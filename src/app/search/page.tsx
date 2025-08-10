'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  bio?: string | null;
  followers?: number;
  following?: number;
}

interface Post {
  id: string;
  caption?: string | null;
  imageUrl: string;
  user: User;
  createdAt: string;
  likes: number;
  comments: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim().length < 2) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Aqui seria feita a chamada para a API para buscar os resultados
    // Por enquanto, vamos simular com dados de exemplo
    setTimeout(() => {
      try {
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Naruto Uzumaki',
            username: 'naruto_uzumaki',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
            bio: 'Futuro Hokage da Vila da Folha! Acredite!',
            followers: 1500,
            following: 300,
          },
          {
            id: '2',
            name: 'Sasuke Uchiha',
            username: 'sasuke_uchiha',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
            bio: 'Último sobrevivente do clã Uchiha. Restaurando meu clã.',
            followers: 1200,
            following: 50,
          },
          {
            id: '3',
            name: 'Sakura Haruno',
            username: 'sakura_haruno',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
            bio: 'Ninja médica do Time 7. Discípula da Tsunade.',
            followers: 800,
            following: 200,
          },
          {
            id: '4',
            name: 'Kakashi Hatake',
            username: 'kakashi_sensei',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
            bio: 'Jounin da Vila da Folha. Líder do Time 7.',
            followers: 2000,
            following: 100,
          },
          {
            id: '5',
            name: 'Hinata Hyuga',
            username: 'hinata_hyuga',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=H',
            bio: 'Membro do clã Hyuga. Byakugan!',
            followers: 700,
            following: 150,
          },
        ].filter(user => 
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase()) ||
          user.bio?.toLowerCase().includes(query.toLowerCase())
        );

        const mockPosts: Post[] = [
          {
            id: '101',
            caption: 'Treinando meu novo jutsu! #naruto #rasengan',
            imageUrl: 'https://via.placeholder.com/600/3B0764/FFFFFF?text=Naruto',
            user: {
              id: '1',
              name: 'Naruto Uzumaki',
              username: 'naruto_uzumaki',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
            likes: 120,
            comments: 15,
          },
          {
            id: '102',
            caption: 'Dia de treino com o Time 7 #konoha #ninja',
            imageUrl: 'https://via.placeholder.com/600/3B0764/FFFFFF?text=Team7',
            user: {
              id: '2',
              name: 'Sasuke Uchiha',
              username: 'sasuke_uchiha',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
            likes: 95,
            comments: 8,
          },
          {
            id: '103',
            caption: 'Nova técnica médica aprendida hoje! #sakura #medical #ninja',
            imageUrl: 'https://via.placeholder.com/600/3B0764/FFFFFF?text=Sakura',
            user: {
              id: '3',
              name: 'Sakura Haruno',
              username: 'sakura_haruno',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
            },
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
            likes: 75,
            comments: 12,
          },
          {
            id: '104',
            caption: 'Lendo meu livro favorito. #kakashi #icha #paradise',
            imageUrl: 'https://via.placeholder.com/600/3B0764/FFFFFF?text=Kakashi',
            user: {
              id: '4',
              name: 'Kakashi Hatake',
              username: 'kakashi_sensei',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
            },
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
            likes: 150,
            comments: 20,
          },
          {
            id: '105',
            caption: 'Praticando com meu Byakugan hoje. #hinata #byakugan #hyuga',
            imageUrl: 'https://via.placeholder.com/600/3B0764/FFFFFF?text=Hinata',
            user: {
              id: '5',
              name: 'Hinata Hyuga',
              username: 'hinata_hyuga',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=H',
            },
            createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 dias atrás
            likes: 85,
            comments: 10,
          },
        ].filter(post => 
          post.caption?.toLowerCase().includes(query.toLowerCase()) ||
          post.user.name?.toLowerCase().includes(query.toLowerCase()) ||
          post.user.username?.toLowerCase().includes(query.toLowerCase())
        );

        setUsers(mockUsers);
        setPosts(mockPosts);
        setLoading(false);
      } catch (err) {
        setError('Ocorreu um erro ao buscar os resultados. Tente novamente mais tarde.');
        setLoading(false);
      }
    }, 1000);
  }, [query]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (query.trim().length < 2) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Digite pelo menos 2 caracteres para pesquisar.</p>
      </div>
    );
  }

  const totalResults = users.length + posts.length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Resultados para &quot;{query}&quot;</h1>
        <p className="text-gray-400">{totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}</p>
      </div>

      {totalResults === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-xl font-medium text-white mb-2">Nenhum resultado encontrado</h2>
          <p className="text-gray-400 max-w-md mx-auto">Não encontramos nenhum resultado para sua pesquisa. Tente termos diferentes ou verifique a ortografia.</p>
        </div>
      ) : (
        <div>
          <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
              >
                Todos ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
              >
                Usuários ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
              >
                Posts ({posts.length})
              </button>
            </nav>
          </div>

          {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
            <div className="mb-10">
              {activeTab === 'all' && <h2 className="text-xl font-bold text-white mb-4">Usuários</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <div key={user.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || 'Usuário'}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                              {user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-white">{user.name}</h3>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                      {user.bio && (
                        <p className="mt-4 text-gray-300 text-sm">{user.bio}</p>
                      )}
                      <div className="mt-4 flex space-x-4 text-sm">
                        <div>
                          <span className="font-medium text-white">{formatNumber(user.followers || 0)}</span>{' '}
                          <span className="text-gray-400">seguidores</span>
                        </div>
                        <div>
                          <span className="font-medium text-white">{formatNumber(user.following || 0)}</span>{' '}
                          <span className="text-gray-400">seguindo</span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link
                          href={`/profile/${user.id}`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-purple-500 text-sm font-medium rounded-md text-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-150"
                        >
                          Ver perfil
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === 'all' && users.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-150"
                  >
                    Ver todos os usuários
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
            <div>
              {activeTab === 'all' && <h2 className="text-xl font-bold text-white mb-4">Posts</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <Image
                        src={post.imageUrl}
                        alt={post.caption || 'Post'}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                          {post.user.image ? (
                            <Image
                              src={post.user.image}
                              alt={post.user.name || 'Usuário'}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                              {post.user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="ml-2">
                          <Link
                            href={`/profile/${post.user.id}`}
                            className="text-sm font-medium text-white hover:underline"
                          >
                            {post.user.username}
                          </Link>
                        </div>
                      </div>
                      {post.caption && (
                        <p className="text-gray-300 text-sm mb-2">{post.caption}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {formatNumber(post.likes)}
                          </div>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            {formatNumber(post.comments)}
                          </div>
                        </div>
                        <div>{formatDate(post.createdAt)}</div>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/post/${post.id}`}
                          className="w-full inline-flex justify-center items-center px-4 py-2 bg-purple-600 text-sm font-medium rounded-md text-white hover:bg-purple-700 transition-colors duration-150"
                        >
                          Ver post
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === 'all' && posts.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-150"
                  >
                    Ver todos os posts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}