'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  imageUrl: string;
  user: User;
}

interface SearchResult {
  users: User[];
  posts: Post[];
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    setLoading(true);
    setShowResults(true);

    // Aqui seria feita a chamada para a API para buscar os resultados
    // Por enquanto, vamos simular com dados de exemplo
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Naruto Uzumaki',
          username: 'naruto_uzumaki',
          image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
        },
        {
          id: '2',
          name: 'Sasuke Uchiha',
          username: 'sasuke_uchiha',
          image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
        },
        {
          id: '3',
          name: 'Sakura Haruno',
          username: 'sakura_haruno',
          image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
        },
      ].filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const mockPosts: Post[] = [
        {
          id: '101',
          caption: 'Treinando meu novo jutsu! #naruto #rasengan',
          imageUrl: 'https://via.placeholder.com/300/3B0764/FFFFFF?text=Naruto',
          user: {
            id: '1',
            name: 'Naruto Uzumaki',
            username: 'naruto_uzumaki',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
          },
        },
        {
          id: '102',
          caption: 'Dia de treino com o Time 7 #konoha #ninja',
          imageUrl: 'https://via.placeholder.com/300/3B0764/FFFFFF?text=Team7',
          user: {
            id: '2',
            name: 'Sasuke Uchiha',
            username: 'sasuke_uchiha',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
          },
        },
      ].filter(post => 
        post.caption?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults({ users: mockUsers, posts: mockPosts });
      setLoading(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar usuários, posts..."
            className="block w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            onFocus={() => {
              if (searchQuery.trim().length >= 2) {
                setShowResults(true);
              }
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                setSearchQuery('');
                setSearchResults(null);
              }}
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {showResults && (searchResults || loading) && (
        <div className="absolute mt-2 w-full bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-700">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : searchResults && (searchResults.users.length === 0 && searchResults.posts.length === 0) ? (
            <div className="p-4 text-center">
              <p className="text-gray-400">Nenhum resultado encontrado para &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div>
              {searchResults?.users && searchResults.users.length > 0 && (
                <div>
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-xs font-medium text-gray-400 uppercase">Usuários</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.id}`}
                        className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
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
                          <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults?.posts && searchResults.posts.length > 0 && (
                <div>
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-xs font-medium text-gray-400 uppercase">Posts</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        className="block px-4 py-3 hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden">
                            <Image
                              src={post.imageUrl}
                              alt={post.caption || 'Post'}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm text-gray-300 truncate">{post.caption}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex-shrink-0 h-4 w-4 rounded-full overflow-hidden">
                                {post.user.image ? (
                                  <Image
                                    src={post.user.image}
                                    alt={post.user.name || 'Usuário'}
                                    width={16}
                                    height={16}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                                    {post.user.name?.charAt(0) || 'U'}
                                  </div>
                                )}
                              </div>
                              <p className="ml-1 text-xs text-gray-400 truncate">{post.user.username}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-4 py-3 border-t border-gray-700 text-center">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setShowResults(false);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-150"
                >
                  Ver todos os resultados para &quot;{searchQuery}&quot;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}