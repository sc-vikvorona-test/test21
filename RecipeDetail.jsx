import React, { useState, useEffect } from 'react';

function useRecipeData(recipeId) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/recipes/${recipeId}`)
      .then(r => r.json())
      .then(data => { setRecipe(data); setLoading(false); });
  }, [recipeId]);
  return { recipe, loading };
}

// Fixed sanitize function - added /g flag per code review
function sanitize(str) {
  return str.replace(/</g, '&lt;');
}

function RecipeDetail({ recipeId }) {
  const { recipe, loading } = useRecipeData(recipeId);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitize(recipe.description) }} />
      <div className="author">
        <a href={recipe.authorUrl}>View Author Profile</a>
      </div>
      <div dangerouslySetInnerHTML={{ __html: `<p>Tags: ${recipe.tags.join(', ')}</p>` }} />
    </div>
  );
}

export default RecipeDetail;