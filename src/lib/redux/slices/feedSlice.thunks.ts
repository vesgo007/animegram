import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from './feedSlice';

// Definindo o tipo para os posts
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

// Função para simular a busca de posts da API
const fetchPostsFromAPI = async (page = 1, limit = 10): Promise<{ posts: Post[], hasMore: boolean }> => {
  // Simulando um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Dados simulados
  const mockPosts = [
    {
      id: '1',
      caption: 'Novo episódio de One Piece! O que acharam da revelação sobre o One Piece?',
      mediaUrls: [
        'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=One+Piece+Episode',
      ],
      createdAt: new Date().toISOString(),
      userId: '1',
      user: {
        id: '1',
        name: 'Luffy',
        username: 'monkey_d_luffy',
        image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=L',
      },
      likes: 120,
      comments: 24,
      isLiked: false,
    },
    {
      id: '2',
      caption: 'Minha coleção de mangás está crescendo! #MangaCollection #Otaku',
      mediaUrls: [
        'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=Manga+Collection+1',
        'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=Manga+Collection+2',
        'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=Manga+Collection+3',
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      userId: '2',
      user: {
        id: '2',
        name: 'Sakura',
        username: 'sakura_haruno',
        image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
      },
      likes: 89,
      comments: 15,
      isLiked: true,
    },
    {
      id: '3',
      caption: 'Acabei de assistir o novo filme de Demon Slayer! Simplesmente incrível! A animação está em outro nível. #DemonSlayer #KimetsuNoYaiba',
      mediaUrls: [
        'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=Demon+Slayer+Movie',
      ],
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
      userId: '3',
      user: {
        id: '3',
        name: 'Tanjiro',
        username: 'tanjiro_kamado',
        image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
      },
      likes: 230,
      comments: 42,
      isLiked: false,
    },
  ];

  // Simulando paginação
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = mockPosts.slice(startIndex, endIndex);
  const hasMore = endIndex < mockPosts.length;

  return { posts: paginatedPosts, hasMore };
};

// Thunk action para buscar posts
export const fetchPosts = createAsyncThunk(
  'feed/fetchPosts',
  async (params: { page?: number; limit?: number } = {}, { dispatch }) => {
    try {
      dispatch(fetchPostsStart());
      const { page = 1, limit = 10 } = params;
      const response = await fetchPostsFromAPI(page, limit);
      dispatch(fetchPostsSuccess(response));
      return response;
    } catch (error) {
      let errorMessage = 'Falha ao carregar os posts';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(fetchPostsFailure(errorMessage));
      throw error;
    }
  }
);