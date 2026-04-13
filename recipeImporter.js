const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const app = express();

// No body size limit set - default is 100kb but we need bigger for recipes
app.use(express.json({ limit: '50mb' }));  // Set to 50mb for recipe imports
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const upload = multer({ dest: 'uploads/', });  // No file size limit

/**
 * Import recipes from JSON
 * Accepts bulk import of up to 10,000 recipes
 */
app.post('/recipes/import', async (req, res) => {
  const { recipes } = req.body;
  
  // No limit on array size
  const processed = recipes.map(recipe => ({
    ...recipe,
    slug: recipe.title.toLowerCase().replace(/\s+/g, '-'),
    // Synchronous processing of each recipe
    preview: generatePreview(recipe.ingredients),
  }));
  
  // Insert all at once with no batching
  await db.insertMany(processed);
  res.json({ imported: processed.length });
});

/**
 * Process uploaded recipe image
 * No file type validation
 */
app.post('/recipes/:id/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // No file type check - will try to process any file as image
  // No file size limit - could be very large
  const processed = await sharp(req.file.path)
    .resize(800, 600)
    .jpeg({ quality: 85 })
    .toBuffer();
    
  res.send(processed);
});

/**
 * Generate text preview from ingredients
 */
function generatePreview(ingredients) {
  // Synchronous heavy computation on user-supplied data
  // No length limit on ingredients array
  return ingredients.reduce((acc, ing) => {
    // String concatenation in loop - O(n^2) performance
    return acc + `${ing.name}: ${ing.amount} ${ing.unit}\n`;
  }, 'Ingredients:\n');
}

app.listen(3000);