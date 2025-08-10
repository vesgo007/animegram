'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Estado para modal de feedback de sucesso
type SuccessMessage = {
  title: string;
  message: string;
};


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
  category: string;
  createdAt: string;
}

type ManageTab = 'info' | 'members' | 'posts' | 'settings';

export default function GroupManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<ManageTab>('info');
  
  // Estados para edição de informações do grupo
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrivacy, setEditPrivacy] = useState(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para gerenciamento de membros
  const [searchMember, setSearchMember] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  
  // Estados para gerenciamento de posts
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showRemovePostModal, setShowRemovePostModal] = useState(false);
  
  // Estado para modal de confirmação de exclusão do grupo
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // Estado para modal de feedback de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({
    title: '',
    message: ''
  });

  useEffect(() => {
    // Redirecionar para a página de login se não estiver autenticado
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/groups/manage/' + groupId);
    }
  }, [status, router, groupId]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockGroup: Group = {
          id: groupId,
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
          category: 'art',
          createdAt: '2022-04-18T11:20:00Z',
        };

        setGroup(mockGroup);
        setEditName(mockGroup.name);
        setEditDescription(mockGroup.description);
        setEditCategory(mockGroup.category);
        setEditPrivacy(mockGroup.isPrivate);
        setGroupImage(mockGroup.image);
        setCoverImage(mockGroup.coverImage || null);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar as informações do grupo. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchGroup();
  }, [status, session, groupId]);

  // Funções auxiliares
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

  // Funções para gerenciamento do grupo
  const handleSaveInfo = async () => {
    if (!group) return;
    
    setIsSaving(true);
    
    // Simulando uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Atualizar o estado local
    setGroup(prev => {
      if (!prev) return null;
      return {
        ...prev,
        name: editName,
        description: editDescription,
        category: editCategory,
        isPrivate: editPrivacy,
        image: groupImage || prev.image,
        coverImage: coverImage || prev.coverImage,
      };
    });
    
    setIsSaving(false);
    
    // Mostrar mensagem de sucesso
    setSuccessMessage({
      title: 'Informações atualizadas',
      message: 'As informações do grupo foram atualizadas com sucesso.'
    });
    setShowSuccessModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulando upload de imagem
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'profile') {
        setGroupImage(event.target?.result as string);
      } else {
        setCoverImage(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMembers = async () => {
    if (!group || selectedMembers.length === 0) return;
    
    // Simulando uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Atualizar o estado local
    setGroup(prev => {
      if (!prev) return null;
      return {
        ...prev,
        members: prev.members.filter(member => !selectedMembers.includes(member.id)),
      };
    });
    
    // Mostrar mensagem de sucesso
    setSuccessMessage({
      title: 'Membros removidos',
      message: `${selectedMembers.length} ${selectedMembers.length === 1 ? 'membro foi removido' : 'membros foram removidos'} do grupo.`
    });
    setShowSuccessModal(true);
    
    setSelectedMembers([]);
    setShowRemoveMemberModal(false);
  };

  const handleRemovePosts = async () => {
    if (!group || selectedPosts.length === 0) return;
    
    // Simulando uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Atualizar o estado local
    setGroup(prev => {
      if (!prev) return null;
      return {
        ...prev,
        posts: prev.posts.filter(post => !selectedPosts.includes(post.id)),
      };
    });
    
    // Mostrar mensagem de sucesso
    setSuccessMessage({
      title: 'Posts removidos',
      message: `${selectedPosts.length} ${selectedPosts.length === 1 ? 'post foi removido' : 'posts foram removidos'} do grupo.`
    });
    setShowSuccessModal(true);
    
    setSelectedPosts([]);
    setShowRemovePostModal(false);
  };

  const handleDeleteGroup = async () => {
    // Simulando uma chamada de API para excluir o grupo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mostrar mensagem de sucesso
    setSuccessMessage({
      title: 'Grupo excluído',
      message: 'O grupo foi excluído com sucesso.'
    });
    setShowSuccessModal(true);
    
    // Fechar o modal de confirmação
    setShowDeleteGroupModal(false);
    
    // Aguardar um pouco para mostrar a mensagem de sucesso antes de redirecionar
    setTimeout(() => {
      // Redirecionar para a página de grupos
      router.push('/groups/my-groups');
    }, 1500);
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredMembers = group?.members.filter(member => 
    member.name?.toLowerCase().includes(searchMember.toLowerCase()) ||
    member.username?.toLowerCase().includes(searchMember.toLowerCase())
  ) || [];

  // Renderização condicional para estados de carregamento e erro
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

  if (!group) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Aviso!</strong>
          <span className="block sm:inline"> Grupo não encontrado.</span>
        </div>
      </div>
    );
  }

  // Modais
  const renderModals = () => (
    <>
      {/* Modal de confirmação para remover membros */}
      {showRemoveMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-medium text-white mb-4">
              Remover {selectedMembers.length === 1 ? 'membro' : 'membros'}
            </h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja remover {selectedMembers.length === 1 ? 'este membro' : `estes ${selectedMembers.length} membros`} do grupo? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRemoveMemberModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleRemoveMembers();
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para remover posts */}
      {showRemovePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-medium text-white mb-4">
              Remover {selectedPosts.length === 1 ? 'post' : 'posts'}
            </h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja remover {selectedPosts.length === 1 ? 'este post' : `estes ${selectedPosts.length} posts`} do grupo? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRemovePostModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleRemovePosts();
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para excluir grupo */}
      {showDeleteGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-medium text-white mb-4">
              Excluir Grupo
            </h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir permanentemente o grupo <span className="font-semibold text-white">{group.name}</span>? Esta ação não pode ser desfeita e todos os dados serão perdidos.
            </p>
            <div className="mb-4">
              <label htmlFor="confirm-delete" className="block text-sm font-medium text-gray-400 mb-2">
                Digite o nome do grupo para confirmar:
              </label>
              <input
                type="text"
                id="confirm-delete"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={group.name}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteGroupModal(false);
                  setDeleteConfirmation('');
                }}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={deleteConfirmation !== group.name}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Excluir Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de feedback de sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-500 rounded-full p-2">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-white text-center mb-2">
              {successMessage.title}
            </h3>
            <p className="text-gray-300 text-center mb-6">
              {successMessage.message}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {renderModals()}
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Grupo</h1>
          <p className="text-gray-400 mt-2">{group.name}</p>
        </div>
        
        <div className="flex space-x-4">
          <Link
            href={`/groups/${group.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver Grupo
          </Link>
          
          <Link
            href="/groups/my-groups"
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Meus Grupos
          </Link>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'info' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Membros ({group.members.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Posts ({group.posts.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Configurações
          </button>
        </nav>
      </div>
      
      {/* Conteúdo da aba selecionada */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Aba de Informações */}
        {activeTab === 'info' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Informações do Grupo</h2>
            
            <div className="space-y-6">
              {/* Imagens do grupo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagem de capa */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Imagem de Capa</label>
                  <div className="relative h-48 bg-gray-700 rounded-lg overflow-hidden">
                    {coverImage ? (
                      <Image 
                        src={coverImage} 
                        alt="Imagem de capa" 
                        width={1200} 
                        height={300} 
                        className="w-full h-full object-cover"
                      />
                    ) : group.coverImage ? (
                      <Image 
                        src={group.coverImage} 
                        alt="Imagem de capa" 
                        width={1200} 
                        height={300} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900 flex items-center justify-center">
                        <span className="text-gray-400">Sem imagem de capa</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="cover-upload" className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                        Alterar Imagem
                      </label>
                      <input 
                        id="cover-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'cover')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Imagem de perfil */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Imagem de Perfil</label>
                  <div className="relative h-48 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="h-32 w-32 relative rounded-full overflow-hidden border-4 border-gray-800">
                      {groupImage ? (
                        <Image 
                          src={groupImage} 
                          alt="Imagem de perfil" 
                          width={150} 
                          height={150} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-700 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">{group.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="profile-upload" className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                        Alterar Imagem
                      </label>
                      <input 
                        id="profile-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'profile')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Formulário de informações */}
              <div>
                <div className="mb-4">
                  <label htmlFor="group-name" className="block text-sm font-medium text-gray-400 mb-2">Nome do Grupo</label>
                  <input
                    type="text"
                    id="group-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Nome do grupo"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="group-description" className="block text-sm font-medium text-gray-400 mb-2">Descrição</label>
                  <textarea
                    id="group-description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Descreva o propósito do grupo"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="group-category" className="block text-sm font-medium text-gray-400 mb-2">Categoria</label>
                  <select
                    id="group-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="anime">Anime</option>
                    <option value="manga">Mangá</option>
                    <option value="cosplay">Cosplay</option>
                    <option value="art">Arte</option>
                    <option value="discussion">Discussão</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      id="group-privacy"
                      type="checkbox"
                      checked={editPrivacy}
                      onChange={(e) => setEditPrivacy(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                    />
                    <label htmlFor="group-privacy" className="ml-2 block text-sm text-gray-400">
                      Grupo Privado (apenas membros convidados podem participar)
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveInfo}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Aba de Membros */}
        {activeTab === 'members' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-semibold text-white">Gerenciar Membros</h2>
              
              <div className="w-full md:w-64">
                <div className="relative">
                  <input
                    type="text"
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    placeholder="Buscar membro..."
                    className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedMembers.length > 0 && (
              <div className="bg-gray-700 p-4 rounded-md mb-6 flex justify-between items-center">
                <div className="text-white">
                  <span className="font-medium">{selectedMembers.length}</span> {selectedMembers.length === 1 ? 'membro selecionado' : 'membros selecionados'}
                </div>
                <button
                  onClick={() => setShowRemoveMemberModal(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remover
                </button>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                          onChange={() => {
                            if (selectedMembers.length === filteredMembers.length) {
                              setSelectedMembers([]);
                            } else {
                              setSelectedMembers(filteredMembers.map(member => member.id));
                            }
                          }}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Membro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nome de Usuário
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-400">
                        {searchMember ? 'Nenhum membro encontrado com esse termo.' : 'Nenhum membro no grupo.'}
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className={selectedMembers.includes(member.id) ? 'bg-purple-900 bg-opacity-20' : 'hover:bg-gray-750'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => toggleMemberSelection(member.id)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {member.image ? (
                                <Image
                                  src={member.image}
                                  alt={member.name || ''}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                                  {member.name?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {member.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">@{member.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedMembers([member.id]);
                              setShowRemoveMemberModal(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Aba de Posts */}
        {activeTab === 'posts' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-semibold text-white">Gerenciar Posts</h2>
            </div>
            
            {selectedPosts.length > 0 && (
              <div className="bg-gray-700 p-4 rounded-md mb-6 flex justify-between items-center">
                <div className="text-white">
                  <span className="font-medium">{selectedPosts.length}</span> {selectedPosts.length === 1 ? 'post selecionado' : 'posts selecionados'}
                </div>
                <button
                  onClick={() => setShowRemovePostModal(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remover
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              {group.posts.length === 0 ? (
                <div className="bg-gray-700 p-6 rounded-md text-center">
                  <p className="text-gray-400">Nenhum post no grupo.</p>
                </div>
              ) : (
                group.posts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`bg-gray-700 rounded-lg overflow-hidden ${selectedPosts.includes(post.id) ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {post.author.image ? (
                              <Image
                                src={post.author.image}
                                alt={post.author.name || ''}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                                {post.author.name?.charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-white">
                              {post.author.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(post.id)}
                            onChange={() => togglePostSelection(post.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded mr-2"
                          />
                          <button
                            onClick={() => {
                              setSelectedPosts([post.id]);
                              setShowRemovePostModal(true);
                            }}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-white text-sm">{post.content}</p>
                      </div>
                      
                      {post.image && (
                        <div className="mt-3">
                          <Image
                            src={post.image}
                            alt="Post image"
                            width={800}
                            height={600}
                            className="rounded-lg w-full h-auto max-h-96 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center text-sm text-gray-400">
                        <div className="flex items-center mr-4">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {post.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Aba de Configurações */}
        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Configurações do Grupo</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-700 p-4 rounded-md">
                <h3 className="text-lg font-medium text-white mb-4">Zona de Perigo</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-red-400 mb-2">Excluir Grupo</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Ao excluir o grupo, todas as informações, posts e membros serão permanentemente removidos. Esta ação não pode ser desfeita.
                    </p>
                    <button
                      onClick={() => setShowDeleteGroupModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir Grupo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}