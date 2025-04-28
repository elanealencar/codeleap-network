
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://dev.codeleap.co.uk/careers/';

export interface Post {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
}

// Initial State 
const initialState: { posts: Post[]; loading: boolean; error: string | null } = {
  posts: [],
  loading: false,
  error: null,
};

// Async actions


export const createPost = createAsyncThunk('posts/createPost', 
    async (newPost: { 
        username: string;
        title: string;
        content: string }) => {
    await axios.post(BASE_URL, newPost);
  });
  

export const fetchPosts = createAsyncThunk('posts/fetchPosts', 
    async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', 
    async ({ id, title, content }: { id: number; title: string; content: string }) => {
  await axios.patch(`${BASE_URL}${id}/`, { title, content });
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
  await axios.delete(`${BASE_URL}${id}/`);
});

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Algo deu errado';
      });
  },
});

export default postsSlice.reducer;
