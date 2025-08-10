'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Post from '@/components/feed/Post';

interface UserProfile {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  bio?: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}

interface ProfilePost {
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

export default function ProfilePage() {
  const { userId } = useParams();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    // Aqui seria feita a chamada para a API para buscar o perfil do usuário
    // Por enquanto, vamos simular com dados de exemplo
    setTimeout(() => {
      const isCurrentUser = session?.user?.id === userId;
      
      const mockProfile: UserProfile = {
        id: userId as string,
        name: 'Tanjiro Kamado',
        username: 'tanjiro_kamado',
        image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
        bio: 'Caçador de demônios | Fã de anime | Protegendo minha irmã Nezuko a todo custo',
        followersCount: 1250,
        followingCount: 365,
        postsCount: 42,
        isFollowing: !isCurrentUser,
        isCurrentUser,
      };

      const mockPosts: ProfilePost[] = [
        {
          id: '1',
          caption: 'Treinamento intenso hoje! #DemonSlayer',
          mediaUrls: [
            'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=Training+Session',
          ],
          createdAt: new Date().toISOString(),
          userId: userId as string,
          user: {
            id: userId as string,
            name: 'Tanjiro Kamado',
            username: 'tanjiro_kamado',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
          },
          likes: 230,
          comments: 42,
          isLiked: false,
        },
        {
          id: '2',
          caption: 'Minha nova espada chegou! #NichiringSword',
          mediaUrls: [
            'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=New+Sword+1',
            'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=New+Sword+2',
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          userId: userId as string,
          user: {
            id: userId as string,
            name: 'Tanjiro Kamado',
            username: 'tanjiro_kamado',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
          },
          likes: 345,
          comments: 56,
          isLiked: true,
        },
        {
          id: '3',
          caption: 'Reunião com os outros Hashiras. Sempre aprendendo!',
          mediaUrls: [
            'https://via.placeholder.com/800x600/3B0764/FFFFFF?text=Hashira+Meeting',
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          userId: userId as string,
          user: {
            id: userId as string,
            name: 'Tanjiro Kamado',
            username: 'tanjiro_kamado',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
          },
          likes: 289,
          comments: 34,
          isLiked: false,
        },
      ];

      setProfile(mockProfile);
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, [userId, session]);

  const handleFollow = () => {
    if (!profile) return;
    
    // Aqui seria feita a chamada para a API para seguir/deixar de seguir o usuário
    setProfile({
      ...profile,
      isFollowing: !profile.isFollowing,
      followersCount: profile.isFollowing 
        ? profile.followersCount - 1 
        : profile.followersCount + 1,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> Não foi possível carregar o perfil. Tente novamente mais tarde.</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Cabeçalho do perfil */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
        {/* Banner do perfil */}
        <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-500"></div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Foto do perfil */}
            <div className="relative -mt-20 md:-mt-16 mb-4 md:mb-0 md:mr-6">
              <div className="h-32 w-32 rounded-full border-4 border-gray-800 overflow-hidden">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name || 'Usuário'}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Informações do perfil */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <p className="text-gray-400">@{profile.username}</p>
                </div>
                
                {profile.isCurrentUser ? (
                  <Link 
                    href="/settings/profile" 
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Editar perfil
                  </Link>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${profile.isFollowing ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                  >
                    {profile.isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
                )}
              </div>
              
              {profile.bio && (
                <p className="mt-4 text-white">{profile.bio}</p>
              )}
              
              {/* Estatísticas */}
              <div className="flex justify-center md:justify-start space-x-8 mt-6">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">{profile.postsCount}</span>
                  <span className="text-gray-400">Posts</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">{profile.followersCount}</span>
                  <span className="text-gray-400">Seguidores</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">{profile.followingCount}</span>
                  <span className="text-gray-400">Seguindo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Abas */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'saved' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Salvos
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tagged' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Marcados
          </button>
        </nav>
      </div>
      
      {/* Conteúdo das abas */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">Nenhuma postagem encontrada.</p>
              {profile.isCurrentUser && (
                <p className="text-gray-500 mt-2">Comece a compartilhar seus momentos anime favoritos!</p>
              )}
            </div>
          ) : (
            posts.map((post) => <Post key={post.id} post={post} />)
          )}
        </div>
      )}
      
      {activeTab === 'saved' && (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">Nenhum post salvo ainda.</p>
          <p className="text-gray-500 mt-2">Os posts que você salvar aparecerão aqui.</p>
        </div>
      )}
      
      {activeTab === 'tagged' && (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">Nenhum post com marcação ainda.</p>
          <p className="text-gray-500 mt-2">Quando alguém marcar você em um post, ele aparecerá aqui.</p>
        </div>
      )}
    </div>
  );
}