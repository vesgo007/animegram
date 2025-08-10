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

interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  postCount: number;
  isPrivate: boolean;
  isMember: boolean;
  isPending?: boolean;
  createdAt: string;
  owner: User;
}

export default function GroupsPage() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('descobrir');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupPrivacy, setNewGroupPrivacy] = useState('public');
  const [creatingGroup, setCreatingGroup] = useState(false);

  useEffect(() => {
    // Simulação de carregamento de grupos
    const fetchGroups = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo para todos os grupos
        const mockGroups: Group[] = [
          {
            id: 'group-1',
            name: 'Fãs de Naruto',
            description: 'Grupo para discutir tudo sobre Naruto e Boruto!',
            coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Fans',
            memberCount: 5243,
            postCount: 1287,
            isPrivate: false,
            isMember: true,
            createdAt: '2022-01-15T00:00:00Z',
            owner: {
              id: 'user-1',
              name: 'Kakashi Sensei',
              username: 'kakashi_sensei',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
            },
          },
          {
            id: 'group-2',
            name: 'One Piece Brasil',
            description: 'A maior comunidade brasileira de One Piece!',
            coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=One+Piece',
            memberCount: 8721,
            postCount: 3456,
            isPrivate: false,
            isMember: false,
            createdAt: '2021-11-20T00:00:00Z',
            owner: {
              id: 'user-2',
              name: 'Monkey D. Luffy',
              username: 'future_pirate_king',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=L',
            },
          },
          {
            id: 'group-3',
            name: 'Attack on Titan Theories',
            description: 'Vamos discutir teorias e analisar cada episódio!',
            coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=AoT',
            memberCount: 3187,
            postCount: 982,
            isPrivate: true,
            isMember: false,
            isPending: true,
            createdAt: '2022-03-05T00:00:00Z',
            owner: {
              id: 'user-3',
              name: 'Eren Yeager',
              username: 'eren_yeager',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=E',
            },
          },
          {
            id: 'group-4',
            name: 'My Hero Academia',
            description: 'Plus Ultra! Grupo para fãs de Boku no Hero Academia',
            coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=MHA',
            memberCount: 4521,
            postCount: 1543,
            isPrivate: false,
            isMember: true,
            createdAt: '2022-02-10T00:00:00Z',
            owner: {
              id: 'user-4',
              name: 'All Might',
              username: 'all_might_official',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=A',
            },
          },
          {
            id: 'group-5',
            name: 'Demon Slayer Corps',
            description: 'Grupo oficial para fãs de Kimetsu no Yaiba',
            coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Demon+Slayer',
            memberCount: 6234,
            postCount: 2187,
            isPrivate: false,
            isMember: false,
            createdAt: '2022-04-18T00:00:00Z',
            owner: {
              id: 'user-5',
              name: 'Tanjiro Kamado',
              username: 'tanjiro_kamado',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=T',
            },
          },
          {
            id: 'group-6',
            name: 'Jujutsu Kaisen Fans',
            description: 'Grupo para discutir mangá e anime de Jujutsu Kaisen',
            coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Jujutsu+Kaisen',
            memberCount: 3897,
            postCount: 1432,
            isPrivate: false,
            isMember: false,
            createdAt: '2022-05-22T00:00:00Z',
            owner: {
              id: 'user-6',
              name: 'Gojo Satoru',
              username: 'gojo_satoru',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=G',
            },
          },
        ];

        // Filtrar grupos para cada categoria
        const myGroupsData = mockGroups.filter(group => group.isMember);
        const suggestedGroupsData = mockGroups.filter(group => !group.isMember);

        setGroups(mockGroups);
        setMyGroups(myGroupsData);
        setSuggestedGroups(suggestedGroupsData);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar os grupos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleJoinGroup = (groupId: string) => {
    // Aqui seria feita a chamada para a API para entrar no grupo
    // Por enquanto, vamos simular a atualização
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, isMember: true, isPending: group.isPrivate } : group
      )
    );

    setSuggestedGroups(prevGroups => 
      prevGroups.filter(group => group.id !== groupId)
    );

    if (!groups.find(g => g.id === groupId)?.isPrivate) {
      setMyGroups(prevGroups => [
        ...prevGroups,
        { ...groups.find(g => g.id === groupId)!, isMember: true }
      ]);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    // Aqui seria feita a chamada para a API para sair do grupo
    // Por enquanto, vamos simular a atualização
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, isMember: false, isPending: false } : group
      )
    );

    setMyGroups(prevGroups => 
      prevGroups.filter(group => group.id !== groupId)
    );

    setSuggestedGroups(prevGroups => [
      ...prevGroups,
      { ...groups.find(g => g.id === groupId)!, isMember: false, isPending: false }
    ]);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDescription.trim() || !session?.user) return;

    setCreatingGroup(true);

    // Aqui seria feita a chamada para a API para criar o grupo
    // Por enquanto, vamos simular a criação
    setTimeout(() => {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        description: newGroupDescription,
        coverImage: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=New+Group',
        memberCount: 1,
        postCount: 0,
        isPrivate: newGroupPrivacy === 'private',
        isMember: true,
        createdAt: new Date().toISOString(),
        owner: {
          id: session.user.id as string,
          name: session.user.name,
          username: session.user.name?.toLowerCase().replace(/\s+/g, '_'),
          image: session.user.image,
        },
      };

      setGroups(prevGroups => [newGroup, ...prevGroups]);
      setMyGroups(prevGroups => [newGroup, ...prevGroups]);

      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupPrivacy('public');
      setCreatingGroup(false);
      setShowCreateModal(false);
    }, 1000);
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const getDisplayGroups = () => {
    switch (activeTab) {
      case 'meus':
        return myGroups;
      case 'descobrir':
        return suggestedGroups;
      default:
        return groups;
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Grupos</h1>
          <p className="text-gray-400">Encontre comunidades de fãs de anime para participar</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('descobrir')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'descobrir' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Descobrir
            </button>
            <button
              onClick={() => setActiveTab('meus')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'meus' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Meus Grupos
            </button>
          </div>
          
          {session && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Criar Grupo
            </button>
          )}
        </div>
      </div>

      {getDisplayGroups().length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          {activeTab === 'meus' ? (
            <>
              <svg className="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-white">Você ainda não participa de nenhum grupo</h2>
              <p className="mt-2 text-gray-400">Descubra grupos interessantes para participar</p>
              <button
                onClick={() => setActiveTab('descobrir')}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Explorar Grupos
              </button>
            </>
          ) : (
            <>
              <svg className="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-white">Nenhum grupo encontrado</h2>
              <p className="mt-2 text-gray-400">Tente criar seu próprio grupo</p>
              {session && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Criar Grupo
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayGroups().map((group) => (
            <div key={group.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="h-40 relative">
                <Image
                  src={group.coverImage}
                  alt={group.name}
                  width={800}
                  height={200}
                  className="w-full h-full object-cover"
                />
                {group.isPrivate && (
                  <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privado
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <Link href={`/groups/${group.id}`} className="text-lg font-semibold text-white hover:text-purple-400 transition-colors duration-150">
                  {group.name}
                </Link>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{group.description}</p>
                
                <div className="flex items-center mt-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {formatMemberCount(group.memberCount)} membros
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {group.postCount} posts
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full overflow-hidden">
                      {group.owner.image ? (
                        <Image
                          src={group.owner.image}
                          alt={group.owner.name || 'Criador'}
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                          {group.owner.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="ml-2 text-xs text-gray-400">Criado por {group.owner.username}</span>
                  </div>
                  
                  {group.isMember ? (
                    <button
                      onClick={() => handleLeaveGroup(group.id)}
                      className="text-gray-400 hover:text-gray-300 text-sm font-medium"
                    >
                      Sair
                    </button>
                  ) : group.isPending ? (
                    <span className="text-yellow-500 text-sm font-medium">Pendente</span>
                  ) : (
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="text-purple-500 hover:text-purple-400 text-sm font-medium"
                    >
                      Participar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação de grupo */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Criar novo grupo</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do grupo*
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Fãs de Anime Brasil"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição*
                </label>
                <textarea
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Descreva o propósito do seu grupo"
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Privacidade do grupo*
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={newGroupPrivacy === 'public'}
                      onChange={() => setNewGroupPrivacy('public')}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-300">Público</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={newGroupPrivacy === 'private'}
                      onChange={() => setNewGroupPrivacy('private')}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-300">Privado</span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {newGroupPrivacy === 'public' 
                    ? 'Qualquer pessoa pode ver e participar do grupo.' 
                    : 'Apenas membros convidados podem ver e participar do grupo.'}
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim() || !newGroupDescription.trim() || creatingGroup}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {creatingGroup ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando...
                    </>
                  ) : (
                    'Criar Grupo'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}