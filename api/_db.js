/**
 * Database Helper Module
 * Handles all database operations for serverless functions
 * Uses Supabase PostgreSQL
 */

import { createClient } from '@supabase/supabase-js';

let supabase = null;

function getDb() {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    
    if (!url || !key) {
      throw new Error('Missing Supabase credentials');
    }
    
    supabase = createClient(url, key);
  }
  return supabase;
}

// ============================================
// USERS
// ============================================

export async function createUser(email, passwordHash, username) {
  const db = getDb();
  
  const { data, error } = await db
    .from('users')
    .insert([
      {
        email,
        password_hash: passwordHash,
        username,
        credits: 300,
        role: 'user',
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email) {
  const db = getDb();
  
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getUserById(id) {
  const db = getDb();
  
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateUserCredits(userId, amount) {
  const db = getDb();
  
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const newCredits = Math.max(0, user.credits + amount);
  
  const { data, error } = await db
    .from('users')
    .update({ credits: newCredits })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const db = getDb();
  
  const { data, error } = await db
    .from('users')
    .select('id, email, username, credits, role, created_at');

  if (error) throw error;
  return data || [];
}

export async function deleteUser(userId) {
  const db = getDb();
  
  const { error } = await db
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

// ============================================
// POSTS
// ============================================

export async function createPost(userId, title, content, type, tags, imageUrl = null) {
  const db = getDb();
  
  const { data, error } = await db
    .from('posts')
    .insert([
      {
        user_id: userId,
        title,
        content,
        type, // 'news', 'blog', 'image'
        tags: tags.join(','),
        image_url: imageUrl,
        likes: 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPostById(id) {
  const db = getDb();
  
  const { data, error } = await db
    .from('posts')
    .select(`
      *,
      users:user_id (id, username, email),
      comments (id, content, user_id, created_at, users:user_id (username))
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getPosts(filters = {}) {
  const db = getDb();
  
  let query = db
    .from('posts')
    .select(`
      *,
      users:user_id (id, username, email)
    `)
    .order('created_at', { ascending: false });

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.tag) {
    query = query.ilike('tags', `%${filters.tag}%`);
  }

  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }

  const { data, error } = await query.limit(filters.limit || 50);

  if (error) throw error;
  return data || [];
}

export async function updatePost(postId, updates) {
  const db = getDb();
  
  const { data, error } = await db
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(postId) {
  const db = getDb();
  
  const { error } = await db
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

export async function likePost(postId) {
  const db = getDb();
  
  const post = await getPostById(postId);
  if (!post) throw new Error('Post not found');

  const { data, error } = await db
    .from('posts')
    .update({ likes: post.likes + 1 })
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// COMMENTS
// ============================================

export async function addComment(postId, userId, content) {
  const db = getDb();
  
  const { data, error } = await db
    .from('comments')
    .insert([
      {
        post_id: postId,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getComments(postId) {
  const db = getDb();
  
  const { data, error } = await db
    .from('comments')
    .select(`
      *,
      users:user_id (id, username, email)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function deleteComment(commentId) {
  const db = getDb();
  
  const { error } = await db
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

// ============================================
// STATS
// ============================================

export async function getStats() {
  const db = getDb();
  
  const { count: userCount } = await db
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: postCount } = await db
    .from('posts')
    .select('*', { count: 'exact', head: true });

  const { count: commentCount } = await db
    .from('comments')
    .select('*', { count: 'exact', head: true });

  const { data: postData } = await db
    .from('posts')
    .select('likes');

  const totalLikes = (postData || []).reduce((sum, post) => sum + (post.likes || 0), 0);

  return {
    users: userCount || 0,
    posts: postCount || 0,
    comments: commentCount || 0,
    likes: totalLikes,
  };
}
