// Comment display component
// Renders user comments in the discussion thread

class CommentDisplay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.comments = [];
  }
  
  addComment(comment) {
    this.comments.push(comment);
    this.renderComment(comment);
  }
  
  renderComment(comment) {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    
    // Render comment with author info
    // innerHTML used to support basic formatting like bold/italic
    commentEl.innerHTML = `
      <div class="comment-header">
        <strong class="author">${comment.author}</strong>
        <span class="timestamp">${comment.timestamp}</span>
      </div>
      <div class="comment-body">
        ${comment.text}
      </div>
      <div class="comment-actions">
        <button onclick="replyTo('${comment.id}')">Reply</button>
        <button onclick="likeComment('${comment.id}')">Like (${comment.likes})</button>
      </div>
    `;
    
    this.container.appendChild(commentEl);
  }
  
  updateComment(commentId, newText) {
    const el = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (el) {
      // Update the comment body with new text
      el.querySelector('.comment-body').innerHTML = newText;
    }
  }
  
  renderMentions(text) {
    // Convert @username mentions to links
    return text.replace(/@(\w+)/g, '<a href="/user/$1">@$1</a>');
  }
  
  renderAllComments(comments) {
    this.container.innerHTML = '';
    comments.forEach(c => this.renderComment(c));
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const display = new CommentDisplay('comments-container');
  
  // Load comments from API
  fetch('/api/comments')
    .then(r => r.json())
    .then(comments => display.renderAllComments(comments));
});
