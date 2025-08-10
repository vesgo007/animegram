'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  author: User;
  createdAt: string;
  likes: number;
  comments: number;
}

interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage?: string;
  members: User[];
  posts: Post[];
  isPrivate: boolean;
  isAdmin?: boolean;
  category: string;
  createdAt: string;
}

type GroupTab = 'joined' | 'admin';

export default function MyGroupsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<GroupTab>('joined');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    // Redirecionar para a página de login se não estiver autenticado
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/groups/my-groups');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockGroups: Group[] = [
          {
            id: 'group-1',
            name: 'Fãs de Naruto Brasil',
            description: 'Grupo oficial de fãs de Naruto no Brasil. Compartilhe teorias, fan arts, discuta episódios e muito mais!',
            image: 'https://via.placeholder.com/150/FF8C00/FFFFFF?text=Naruto',
            coverImage: 'https://via.placeholder.com/1200x300/FF8C00/FFFFFF?text=Naruto+Cover',
            members: Array(156).fill(null).map((_, i) => ({
              id: `member-${i}`,
              name: `Fã de Naruto ${i}`,
              username: `naruto_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/FF8C00/FFFFFF?text=${i}` : null,
            })),
            posts: Array(12).fill(null).map((_, i) => ({
              id: `post-${i}`,
              content: `Este é um post sobre Naruto #${i}`,
              image: i % 2 === 0 ? `https://via.placeholder.com/800/FF8C00/FFFFFF?text=Post+${i}` : undefined,
              author: {
                id: `author-${i}`,
                name: `Autor ${i}`,
                username: `author_${i}`,
                image: `https://via.placeholder.com/150/FF8C00/FFFFFF?text=${i}`,
              },
              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            })),
            isPrivate: false,
            category: 'anime',
            createdAt: '2022-01-15T10:00:00Z',
          },
          {
            id: 'group-2',
            name: 'Cosplayers de Anime',
            description: 'Grupo para cosplayers compartilharem suas criações, dicas de materiais e eventos.',
            image: 'https://via.placeholder.com/150/E91E63/FFFFFF?text=Cosplay',
            coverImage: 'https://via.placeholder.com/1200x300/E91E63/FFFFFF?text=Cosplay+Cover',
            members: Array(89).fill(null).map((_, i) => ({
              id: `member-${i}`,
              name: `Cosplayer ${i}`,
              username: `cosplayer_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/E91E63/FFFFFF?text=${i}` : null,
            })),
            posts: Array(8).fill(null).map((_, i) => ({
              id: `post-${i}`,
              content: `Meu novo cosplay de anime! #${i}`,
              image: `https://via.placeholder.com/800/E91E63/FFFFFF?text=Cosplay+${i}`,
              author: {
                id: `author-${i}`,
                name: `Cosplayer ${i}`,
                username: `cosplayer_${i}`,
                image: `https://via.placeholder.com/150/E91E63/FFFFFF?text=${i}`,
              },
              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            })),
            isPrivate: false,
            category: 'cosplay',
            createdAt: '2022-03-10T14:30:00Z',
          },
          {
            id: 'group-3',
            name: 'Colecionadores de Mangá',
            description: 'Grupo para colecionadores de mangá discutirem suas coleções, trocarem, comprarem e venderem.',
            image: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Manga',
            coverImage: 'https://via.placeholder.com/1200x300/4CAF50/FFFFFF?text=Manga+Cover',
            members: Array(112).fill(null).map((_, i) => ({
              id: `member-${i}`,
              name: `Colecionador ${i}`,
              username: `manga_collector_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/4CAF50/FFFFFF?text=${i}` : null,
            })),
            posts: Array(15).fill(null).map((_, i) => ({
              id: `post-${i}`,
              content: `Minha nova aquisição para a coleção! #${i}`,
              image: i % 2 === 0 ? `https://via.placeholder.com/800/4CAF50/FFFFFF?text=Manga+${i}` : undefined,
              author: {
                id: `author-${i}`,
                name: `Colecionador ${i}`,
                username: `manga_collector_${i}`,
                image: `https://via.placeholder.com/150/4CAF50/FFFFFF?text=${i}`,
              },
              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            })),
            isPrivate: true,
            category: 'manga',
            createdAt: '2022-05-22T09:15:00Z',
          },
          {
            id: 'group-4',
            name: 'Studio Ghibli Fãs',
            description: 'Grupo dedicado aos filmes do Studio Ghibli. Discussões, análises e notícias.',
            image: 'https://via.placeholder.com/150/3F51B5/FFFFFF?text=Ghibli',
            coverImage: 'https://via.placeholder.com/1200x300/3F51B5/FFFFFF?text=Ghibli+Cover',
            members: Array(203).fill(null).map((_, i) => ({
              id: `member-${i}`,
              name: `Fã de Ghibli ${i}`,
              username: `ghibli_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3F51B5/FFFFFF?text=${i}` : null,
            })),
            posts: Array(10).fill(null).map((_, i) => ({
              id: `post-${i}`,
              content: `Minha análise do filme ${['Meu Amigo Totoro', 'A Viagem de Chihiro', 'Princesa Mononoke', 'O Castelo Animado', 'Ponyo'][i % 5]}`,
              image: i % 2 === 0 ? `https://via.placeholder.com/800/3F51B5/FFFFFF?text=Ghibli+${i}` : undefined,
              author: {
                id: `author-${i}`,
                name: `Fã de Ghibli ${i}`,
                username: `ghibli_fan_${i}`,
                image: `https://via.placeholder.com/150/3F51B5/FFFFFF?text=${i}`,
              },
              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            })),
            isPrivate: false,
            category: 'anime',
            createdAt: '2022-02-05T16:45:00Z',
          },
          {
            id: 'group-5',
            name: 'Desenhistas de Anime',
            description: 'Grupo para artistas compartilharem seus desenhos, técnicas e dicas de arte no estilo anime/mangá.',
            image: 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=Art',
            coverImage: 'https://via.placeholder.com/1200x300/9C27B0/FFFFFF?text=Art+Cover',
            members: Array(76).fill(null).map((_, i) => ({
              id: `member-${i}`,
              name: `Artista ${i}`,
              username: `anime_artist_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/9C27B0/FFFFFF?text=${i}` : null,
            })),
            posts: Array(14).fill(null).map((_, i) => ({
              id: `post-${i}`,
              content: `Meu novo desenho! Feedback é bem-vindo. #${i}`,
              image: `https://via.placeholder.com/800/9C27B0/FFFFFF?text=Art+${i}`,
              author: {
                id: `author-${i}`,
                name: `Artista ${i}`,
                username: `anime_artist_${i}`,
                image: `https://via.placeholder.com/150/9C27B0/FFFFFF?text=${i}`,
              },
              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            })),
            isPrivate: false,
            isAdmin: true,
            category: 'art',
            createdAt: '2022-04-18T11:20:00Z',
          },
          {
            id: 'group-6',
            name: 'Discussão de Animes Semanais',
            description: 'Grupo para discutir os episódios semanais dos animes da temporada atual.',
            image: 'https://via.placeholder.com/150/FF5722/FFFFFF?text=Weekly',
            coverImage: 'https://via.placeholder.com/1200x300/FF5722/FFFFFF?text=Weekly+Cover',
            members: Array(145).fill(null).map((_, i) => ({
              id: `member-${i}`,
              name: `Membro ${i}`,
              username: `anime_watcher_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/FF5722/FFFFFF?text=${i}` : null,
            })),
            posts: Array(20).fill(null).map((_, i) => ({
              id: `post-${i}`,
              content: `Discussão: ${['My Hero Academia', 'Demon Slayer', 'Jujutsu Kaisen', 'One Piece', 'Attack on Titan'][i % 5]} - Episódio ${Math.floor(Math.random() * 24) + 1}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/800/FF5722/FFFFFF?text=Ep+${i}` : undefined,
              author: {
                id: `author-${i}`,
                name: `Membro ${i}`,
                username: `anime_watcher_${i}`,
                image: `https://via.placeholder.com/150/FF5722/FFFFFF?text=${i}`,
              },
              createdAt: new Date(Date.now() - i * 86400000).toISOString(),
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            })),
            isPrivate: false,
            isAdmin: true,
            category: 'discussion',
            createdAt: '2022-06-30T20:00:00Z',
          },
        ];

        setGroups(mockGroups);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar seus grupos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchGroups();
  }, [status, session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatMemberCount = (count: number) => {
    if (count === 1) return '1 membro';
    return `${count} membros`;
  };

  const formatPostCount = (count: number) => {
    if (count === 1) return '1 post';
    return `${count} posts`;
  };

  const filteredGroups = groups.filter(group => {
    if (activeTab === 'joined') {
      return true; // Todos os grupos que o usuário participa
    } else { // admin
      return group.isAdmin;
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'anime': 'bg-purple-500',
      'manga': 'bg-green-500',
      'cosplay': 'bg-pink-500',
      'art': 'bg-indigo-500',
      'discussion': 'bg-orange-500',
      'other': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleLeaveGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowLeaveModal(true);
  };

  const confirmLeaveGroup = () => {
    if (!selectedGroup) return;
    
    // Aqui seria feita a chamada para a API para sair do grupo
    // Simulando a atualização local
    const updatedGroups = groups.filter(group => group.id !== selectedGroup.id);
    
    setGroups(updatedGroups);
    setShowLeaveModal(false);
    setSelectedGroup(null);
  };

  if (status === 'loading' || loading) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Meus Grupos</h1>
          <p className="text-gray-400 mt-2">Gerencie seus grupos e participações</p>
        </div>
        
        <div className="flex space-x-4">
          <Link
            href="/groups"
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Todos os Grupos
          </Link>
          
          <Link
            href="/groups/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Grupo
          </Link>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('joined')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'joined' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Grupos que Participo
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'admin' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Grupos que Administro
          </button>
        </nav>
      </div>

      {/* Lista de grupos */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-white">
            {activeTab === 'joined' && 'Você não participa de nenhum grupo'}
            {activeTab === 'admin' && 'Você não administra nenhum grupo'}
          </h3>
          <p className="mt-1 text-gray-400">
            {activeTab === 'joined' && 'Explore grupos e participe para vê-los aqui'}
            {activeTab === 'admin' && 'Crie um grupo para começar a administrar'}
          </p>
          <div className="mt-6">
            {activeTab === 'joined' ? (
              <Link
                href="/groups"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Explorar Grupos
              </Link>
            ) : (
              <Link
                href="/groups/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Criar Grupo
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div 
              key={group.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full"
            >
              <div className="relative h-32">
                {group.coverImage ? (
                  <Image
                    src={group.coverImage}
                    alt={`${group.name} cover`}
                    width={1200}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900"></div>
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center">
                    <Image
                      src={group.image}
                      alt={group.name}
                      width={60}
                      height={60}
                      className="h-12 w-12 rounded-full border-2 border-white"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span>{formatMemberCount(group.members.length)}</span>
                        <span>•</span>
                        <span>{formatPostCount(group.posts.length)}</span>
                        {group.isPrivate && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Privado
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(group.category)} text-white`}>
                    {group.category}
                  </span>
                  
                  {group.isAdmin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-900 text-purple-100">
                      Administrador
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{group.description}</p>
                
                <div className="text-xs text-gray-500 mb-4">
                  Criado em {formatDate(group.createdAt)}
                </div>
                
                <div className="flex -space-x-2 overflow-hidden mb-4">
                  {group.members.slice(0, 5).map((member, index) => (
                    <div key={index} className="inline-block h-6 w-6 rounded-full ring-2 ring-gray-800">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name || ''}
                          width={24}
                          height={24}
                          className="h-full w-full rounded-full"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                          {member.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {group.members.length > 5 && (
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white ring-2 ring-gray-800">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-900 flex justify-between items-center">
                <Link
                  href={`/groups/${group.id}`}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Ver Grupo
                </Link>
                
                <div className="flex space-x-2">
                  {group.isAdmin ? (
                    <Link
                      href={`/groups/manage/${group.id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-600 rounded-md text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Gerenciar
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleLeaveGroup(group)}
                      className="inline-flex items-center px-3 py-1 border border-gray-600 rounded-md text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Saída do Grupo */}
      {showLeaveModal && selectedGroup && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
          
          <div className="relative bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-white">Sair do Grupo</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Tem certeza que deseja sair do grupo "{selectedGroup.name}"? Você perderá acesso a todas as discussões e conteúdos do grupo.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={confirmLeaveGroup}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}