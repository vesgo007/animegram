import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  id: string;
  caption?: string;
  mediaUrls: string[];
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<{ posts: Post[]; hasMore: boolean }>) => {
      state.loading = false;
      state.posts = [...state.posts, ...action.payload.posts];
      state.hasMore = action.payload.hasMore;
      state.page += 1;
      state.error = null;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetFeed: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.isLiked = true;
        post.likes += 1;
      }
    },
    unlikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.isLiked = false;
        post.likes -= 1;
      }
    },
    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.comments += 1;
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  resetFeed,
  addPost,
  removePost,
  likePost,
  unlikePost,
  incrementCommentCount,
} = feedSlice.actions;

export default feedSlice.reducer;