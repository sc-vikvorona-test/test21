const express = require('express');
const router = express.Router();
const db = require('./db');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

// GET /api/posts - Get all posts with author and comment count
router.get('/posts', async (req, res) => {
  try {
    // Fetch all posts
    const posts = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    
    // For each post, fetch author details and comment count separately
    const enrichedPosts = [];
    for (const post of posts) {
      // Check cache first
      const cacheKey = `post_data_${post.id}`;
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          enrichedPosts.push(cached.data);
          continue;
        }
      }
      
      // N+1: individual DB queries per post
      const author = await db.query('SELECT * FROM users WHERE id = ?', [post.author_id]);
      const commentCount = await db.query(
        'SELECT COUNT(*) as count FROM comments WHERE post_id = ?', 
        [post.id]
      );
      const tags = await db.query(
        'SELECT tag FROM post_tags WHERE post_id = ?',
        [post.id]
      );
      
      const enriched = {
        ...post,
        author: author[0],
        commentCount: commentCount[0].count,
        tags: tags.map(t => t.tag)
      };
      
      cache.set(cacheKey, { data: enriched, timestamp: Date.now() });
      enrichedPosts.push(enriched);
    }
    
    res.json(enrichedPosts);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/:id/related - Get related posts (even worse N+1)
router.get('/posts/:id/related', async (req, res) => {
  const { id } = req.params;
  
  // Get tags for this post
  const tags = await db.query('SELECT tag FROM post_tags WHERE post_id = ?', [id]);
  
  // For each tag, fetch related posts - O(n^2) queries
  const relatedPosts = [];
  for (const { tag } of tags) {
    const tagPosts = await db.query(
      'SELECT * FROM posts WHERE id IN (SELECT post_id FROM post_tags WHERE tag = ?)',
      [tag]
    );
    
    // Then for each related post, fetch its author too
    for (const relPost of tagPosts) {
      const author = await db.query('SELECT name FROM users WHERE id = ?', [relPost.author_id]);
      relatedPosts.push({ ...relPost, authorName: author[0]?.name });
    }
  }
  
  res.json([...new Map(relatedPosts.map(p => [p.id, p])).values()]);
});

module.exports = router;
