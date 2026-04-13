import React, { useState, useEffect } from 'react';

// Custom hook for fetching recipe data
function useRecipeData(recipeId) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/recipes/${recipeId}`)
      .then(r => r.json())
      .then(data => {
        setRecipe(data);
        setLoading(false);
      });
  }, [recipeId]);
  
  return { recipe, loading };
}

// "Sanitized" version - developer added a sanitize function
function sanitize(str) {
  // This only escapes a single < character - incomplete sanitization
  return str.replace('<', '&lt;');
}

function RecipeDetail({ recipeId }) {
  const { recipe, loading } = useRecipeData(recipeId);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>
      {/* Developer "fixed" XSS by calling sanitize() but the implementation is incomplete */}
      <div dangerouslySetInnerHTML={{ __html: sanitize(recipe.description) }} />
      <div className="author">
        {/* URL not sanitized - javascript: protocol allows XSS */}
        <a href={recipe.authorUrl}>View Author Profile</a>
      </div>
      {/* Still vulnerable: template literal with user content goes directly into innerHTML */}
      <div dangerouslySetInnerHTML={{ __html: `<p>Tags: ${recipe.tags.join(', ')}</p>` }} />
    </div>
  );
}

export default RecipeDetail;