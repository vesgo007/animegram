'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

interface Post {
  id: string;
  caption?: string | null;
  image: string;
  likes: number;
  comments: number;
  user: User;
}

export default function ExplorePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulação de carregamento de posts para explorar
    const fetchPosts = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
          id: `post-${i + 1}`,
          caption: i % 3 === 0 ? `Explorando o mundo dos animes #anime #otaku ${i + 1}` : null,
          image: `https://via.placeholder.com/600/3B0764/FFFFFF?text=Anime+Explore+${i + 1}`,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          user: {
            id: `user-${i + 1}`,
            name: `Usuário ${i + 1}`,
            username: `usuario_${i + 1}`,
            image: `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i + 1}`,
          },
        }));

        setPosts(mockPosts);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar os posts. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    const fetchSuggestedUsers = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));

        // Dados de exemplo
        const mockUsers: User[] = Array.from({ length: 5 }, (_, i) => ({
          id: `suggested-user-${i + 1}`,
          name: `Fã de Anime ${i + 1}`,
          username: `anime_fan_${i + 1}`,
          image: `https://via.placeholder.com/150/3B0764/FFFFFF?text=${String.fromCharCode(65 + i)}`,
        }));

        setSuggestedUsers(mockUsers);
      } catch (err) {
        console.error('Erro ao carregar usuários sugeridos:', err);
      }
    };

    fetchPosts();
    fetchSuggestedUsers();
  }, []);

  const filterPosts = () => {
    if (activeTab === 'todos') {
      return posts;
    } else if (activeTab === 'populares') {
      return [...posts].sort((a, b) => b.likes - a.likes);
    } else if (activeTab === 'recentes') {
      // Na vida real, ordenaríamos por data
      // Aqui vamos apenas inverter a ordem para simular
      return [...posts].reverse();
    }
    return posts;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Explorar</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'todos' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab('populares')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'populares' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Populares
          </button>
          <button
            onClick={() => setActiveTab('recentes')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'recentes' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Recentes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna principal com posts */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filterPosts().map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                  <Image
                    src={post.image}
                    alt={post.caption || 'Post'}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-4 text-white">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coluna lateral com sugestões */}
        <div className="hidden md:block">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-semibold text-white mb-6">Sugestões para você</h2>
            
            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link href={`/profile/${user.id}`} className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'Usuário'}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="ml-3">
                      <Link href={`/profile/${user.id}`} className="text-sm font-medium text-white hover:underline">
                        {user.username || user.name}
                      </Link>
                      <p className="text-xs text-gray-400">{user.name}</p>
                    </div>
                  </div>
                  <button className="text-purple-500 hover:text-purple-400 text-sm font-medium">
                    Seguir
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link href="/search" className="text-purple-500 hover:text-purple-400 text-sm">
                Ver mais sugestões
              </Link>
            </div>

            <div className="mt-8 text-xs text-gray-500">
              <p>© 2023 Animegram</p>
              <div className="mt-2 flex flex-wrap">
                <Link href="#" className="mr-2 hover:underline">Sobre</Link>
                <Link href="#" className="mr-2 hover:underline">Ajuda</Link>
                <Link href="#" className="mr-2 hover:underline">Privacidade</Link>
                <Link href="#" className="mr-2 hover:underline">Termos</Link>
                <Link href="#" className="hover:underline">Contato</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}