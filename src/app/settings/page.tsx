'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy' | 'notifications'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Configurações de notificações
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    emailNotifications: false,
  });

  // Configurações de privacidade
  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivity: true,
    allowTagging: true,
    allowMessages: 'everyone', // 'everyone', 'followers', 'none'
  });

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Aqui seria feita a chamada para a API para buscar o perfil completo do usuário
      // Por enquanto, vamos simular com dados de exemplo
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: session.user.id as string,
          name: session.user.name,
          username: session.user.name?.toLowerCase().replace(/\s+/g, '_'),
          email: session.user.email,
          image: session.user.image,
          bio: 'Apaixonado por anime e mangá. Colecionador de figures e cosplayer nas horas vagas.',
          website: 'https://animegram.com',
          location: 'São Paulo, Brasil',
        };

        setProfile(mockProfile);
        setLoading(false);
      }, 1000);
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, session, router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrivacySettings({
      ...privacySettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Aqui seria feita a chamada para a API para salvar as alterações do perfil
    // Por enquanto, vamos simular o salvamento
    setTimeout(() => {
      // Simular atualização da sessão
      if (profile) {
        update({
          ...session,
          user: {
            ...session?.user,
            name: profile.name,
            image: imagePreview || profile.image,
          },
        });
      }

      setSuccess('Perfil atualizado com sucesso!');
      setSaving(false);

      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1500);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Aqui seria feita a chamada para a API para salvar as alterações da conta
    // Por enquanto, vamos simular o salvamento
    setTimeout(() => {
      setSuccess('Configurações da conta atualizadas com sucesso!');
      setSaving(false);

      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1500);
  };

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Aqui seria feita a chamada para a API para salvar as configurações de privacidade
    // Por enquanto, vamos simular o salvamento
    setTimeout(() => {
      setSuccess('Configurações de privacidade atualizadas com sucesso!');
      setSaving(false);

      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1500);
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Aqui seria feita a chamada para a API para salvar as configurações de notificações
    // Por enquanto, vamos simular o salvamento
    setTimeout(() => {
      setSuccess('Configurações de notificações atualizadas com sucesso!');
      setSaving(false);

      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1500);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Você precisa estar logado para acessar as configurações.</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Sidebar de navegação */}
          <div className="md:w-64 bg-gray-900 md:border-r border-gray-700">
            <nav className="p-4 md:p-6 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </button>

              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'account' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Conta
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'privacy' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacidade
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notificações
              </button>
            </nav>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 p-6">
            {error && (
              <div className="mb-4 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            {/* Configurações de Perfil */}
            {activeTab === 'profile' && profile && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Editar Perfil</h2>
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-6">
                    <div className="flex items-center">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-700">
                        {(imagePreview || profile.image) ? (
                          <Image
                            src={imagePreview || profile.image || ''}
                            alt={profile.name || 'Usuário'}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-3xl font-medium">
                            {profile.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="ml-5">
                        <label htmlFor="image-upload" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150">
                          Alterar foto
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="ml-2 text-red-500 hover:text-red-400 text-sm"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Nome de usuário</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Biografia</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profile.bio || ''}
                      onChange={handleProfileChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={profile.website || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Localização</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profile.location || ''}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Salvar alterações
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Configurações de Conta */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Configurações da Conta</h2>
                <form onSubmit={handleSaveAccount}>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Informações de Login</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profile?.email || ''}
                          disabled
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 opacity-70"
                        />
                        <p className="mt-1 text-xs text-gray-400">Para alterar seu e-mail, entre em contato com o suporte.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Alterar Senha</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">Senha atual</label>
                        <input
                          type="password"
                          id="current-password"
                          name="currentPassword"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">Nova senha</label>
                        <input
                          type="password"
                          id="new-password"
                          name="newPassword"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">Confirmar nova senha</label>
                        <input
                          type="password"
                          id="confirm-password"
                          name="confirmPassword"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Ações da Conta</h3>
                    <div className="space-y-4">
                      <div>
                        <button
                          type="button"
                          className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                        >
                          Desativar temporariamente minha conta
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-400 text-sm font-medium"
                        >
                          Excluir minha conta permanentemente
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Salvar alterações
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Configurações de Privacidade */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Configurações de Privacidade</h2>
                <form onSubmit={handleSavePrivacy}>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Visibilidade da Conta</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="private-account"
                          name="privateAccount"
                          checked={privacySettings.privateAccount}
                          onChange={handlePrivacyChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="private-account" className="ml-2 block text-sm text-gray-300">
                          Conta privada (apenas seguidores aprovados podem ver seu conteúdo)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="show-activity"
                          name="showActivity"
                          checked={privacySettings.showActivity}
                          onChange={handlePrivacyChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="show-activity" className="ml-2 block text-sm text-gray-300">
                          Mostrar status de atividade (online/offline)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Interações</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allow-tagging"
                          name="allowTagging"
                          checked={privacySettings.allowTagging}
                          onChange={handlePrivacyChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="allow-tagging" className="ml-2 block text-sm text-gray-300">
                          Permitir que pessoas me marquem em posts
                        </label>
                      </div>
                      <div>
                        <label htmlFor="allow-messages" className="block text-sm text-gray-300 mb-1">
                          Quem pode me enviar mensagens
                        </label>
                        <select
                          id="allow-messages"
                          name="allowMessages"
                          value={privacySettings.allowMessages}
                          onChange={handlePrivacyChange}
                          className="w-full md:w-64 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="everyone">Todos</option>
                          <option value="followers">Apenas seguidores</option>
                          <option value="none">Ninguém</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Salvar alterações
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Configurações de Notificações */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Configurações de Notificações</h2>
                <form onSubmit={handleSaveNotifications}>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Notificações no Aplicativo</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="likes"
                          name="likes"
                          checked={notificationSettings.likes}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="likes" className="ml-2 block text-sm text-gray-300">
                          Curtidas em minhas publicações
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="comments"
                          name="comments"
                          checked={notificationSettings.comments}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="comments" className="ml-2 block text-sm text-gray-300">
                          Comentários em minhas publicações
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="follows"
                          name="follows"
                          checked={notificationSettings.follows}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="follows" className="ml-2 block text-sm text-gray-300">
                          Novos seguidores
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mentions"
                          name="mentions"
                          checked={notificationSettings.mentions}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="mentions" className="ml-2 block text-sm text-gray-300">
                          Menções e marcações
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="messages"
                          name="messages"
                          checked={notificationSettings.messages}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="messages" className="ml-2 block text-sm text-gray-300">
                          Novas mensagens
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">Notificações por E-mail</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-500 rounded"
                        />
                        <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-300">
                          Receber notificações por e-mail
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Salvar alterações
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}