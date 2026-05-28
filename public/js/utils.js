/**
 * Hacker Network - Utility Functions
 * Handles API calls, storage, and common operations
 */

const API_BASE = '/api';
const TOKEN_KEY = 'hn_token';
const USER_KEY = 'hn_user';

// ============================================
// API CALLS
// ============================================

async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// AUTHENTICATION
// ============================================

async function login(email, password) {
  const response = await apiCall('/auth/login', 'POST', { email, password });
  if (response.token && response.user) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    return response;
  }
  throw new Error('Invalid response from server');
}

async function register(email, password, username) {
  const response = await apiCall('/auth/register', 'POST', { email, password, username });
  if (response.token && response.user) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    return response;
  }
  throw new Error('Invalid response from server');
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/';
}

function getCurrentUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// ============================================
// POSTS
// ============================================

async function createPost(postData) {
  return await apiCall('/posts/create', 'POST', postData);
}

async function getPosts(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiCall(`/posts/list?${params}`);
}

async function getPost(id) {
  return await apiCall(`/posts/${id}`);
}

async function updatePost(id, postData) {
  return await apiCall(`/posts/${id}`, 'PUT', postData);
}

async function deletePost(id) {
  return await apiCall(`/posts/${id}`, 'DELETE');
}

async function likePost(postId) {
  return await apiCall(`/posts/${postId}/like`, 'POST');
}

async function unlikePost(postId) {
  return await apiCall(`/posts/${postId}/unlike`, 'POST');
}

// ============================================
// COMMENTS
// ============================================

async function addComment(postId, content) {
  return await apiCall(`/posts/${postId}/comments`, 'POST', { content });
}

async function getComments(postId) {
  return await apiCall(`/posts/${postId}/comments`);
}

async function deleteComment(postId, commentId) {
  return await apiCall(`/posts/${postId}/comments/${commentId}`, 'DELETE');
}

// ============================================
// CREDITS
// ============================================

async function getUserCredits() {
  const user = getCurrentUser();
  if (!user) return 0;
  return user.credits || 0;
}

async function updateUserCredits() {
  try {
    const response = await apiCall('/auth/me');
    if (response.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      return response.user.credits;
    }
  } catch (error) {
    console.error('Failed to update credits:', error);
  }
  return 0;
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

async function getUsers() {
  return await apiCall('/admin/users');
}

async function updateUserCredits(userId, amount) {
  return await apiCall(`/admin/users/${userId}/credits`, 'PUT', { amount });
}

async function deductUserCredits(userId, amount) {
  return await apiCall(`/admin/users/${userId}/credits`, 'PUT', { amount: -amount });
}

async function deleteUser(userId) {
  return await apiCall(`/admin/users/${userId}`, 'DELETE');
}

async function getAllPosts() {
  return await apiCall('/admin/posts');
}

async function deletePostAdmin(postId) {
  return await apiCall(`/admin/posts/${postId}`, 'DELETE');
}

// ============================================
// IMAGE UPLOAD
// ============================================

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem(TOKEN_KEY);
  const options = {
    method: 'POST',
  };

  if (token) {
    options.headers = {
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(`${API_BASE}/storage/upload`, {
      ...options,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}

// ============================================
// UI HELPERS
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      z-index: 10000;
      animation: slideInLeft 0.3s ease-out;
    }
    
    .notification-info {
      background: rgba(0, 217, 255, 0.2);
      border: 1px solid #00d9ff;
      color: #00d9ff;
    }
    
    .notification-success {
      background: rgba(0, 255, 65, 0.2);
      border: 1px solid #00ff41;
      color: #00ff41;
    }
    
    .notification-error {
      background: rgba(255, 0, 85, 0.2);
      border: 1px solid #ff0055;
      color: #ff0055;
    }
    
    .notification-warning {
      background: rgba(255, 165, 0, 0.2);
      border: 1px solid #ffa500;
      color: #ffa500;
    }
  `;
  
  if (!document.querySelector('style[data-notifications]')) {
    style.setAttribute('data-notifications', 'true');
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateText(text, length = 150) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

function sanitizeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// PAGE ROUTING
// ============================================

function navigateTo(path) {
  window.location.href = path;
}

function getCurrentPath() {
  return window.location.pathname;
}

function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// ============================================
// STORAGE
// ============================================

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function removeStorage(key) {
  localStorage.removeItem(key);
}

// ============================================
// EXPORT
// ============================================

window.HN = {
  // API
  apiCall,
  
  // Auth
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  
  // Posts
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  
  // Comments
  addComment,
  getComments,
  deleteComment,
  
  // Credits
  getUserCredits,
  updateUserCredits,
  
  // Admin
  getUsers,
  updateUserCredits,
  deductUserCredits,
  deleteUser,
  getAllPosts,
  deletePostAdmin,
  
  // Upload
  uploadImage,
  
  // UI
  showNotification,
  formatDate,
  truncateText,
  sanitizeHtml,
  
  // Routing
  navigateTo,
  getCurrentPath,
  getQueryParam,
  
  // Storage
  setStorage,
  getStorage,
  removeStorage,
};
