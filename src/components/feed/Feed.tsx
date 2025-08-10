'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import Post from './Post';
import { fetchPosts } from '@/lib/redux/slices/feedSlice.thunks';

export default function Feed() {
  const { posts, loading, error } = useAppSelector((state) => state.feed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Disparando a thunk action para buscar os posts
    dispatch(fetchPosts({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> Não foi possível carregar o feed. Tente novamente mais tarde.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">Nenhuma postagem encontrada.</p>
          <p className="text-gray-500 mt-2">Comece a seguir outros usuários para ver suas postagens aqui.</p>
        </div>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}