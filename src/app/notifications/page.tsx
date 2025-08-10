'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag';
  message: string;
  createdAt: string;
  read: boolean;
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  postId?: string;
  commentId?: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      // Aqui seria feita a chamada para a API para buscar as notificações
      // Por enquanto, vamos simular com dados de exemplo
      setTimeout(() => {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'like',
            message: 'curtiu sua postagem',
            createdAt: new Date().toISOString(),
            read: false,
            user: {
              id: '2',
              name: 'Sakura Haruno',
              username: 'sakura_haruno',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
            },
            postId: '1',
          },
          {
            id: '2',
            type: 'comment',
            message: 'comentou em sua postagem: "Incrível! Qual episódio é esse?"',
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
            read: false,
            user: {
              id: '3',
              name: 'Naruto Uzumaki',
              username: 'naruto_uzumaki',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
            },
            postId: '1',
            commentId: '1',
          },
          {
            id: '3',
            type: 'follow',
            message: 'começou a seguir você',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
            read: true,
            user: {
              id: '4',
              name: 'Sasuke Uchiha',
              username: 'sasuke_uchiha',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
            },
          },
          {
            id: '4',
            type: 'mention',
            message: 'mencionou você em um comentário: "@tanjiro_kamado você precisa ver isso!"',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
            read: true,
            user: {
              id: '5',
              name: 'Goku Son',
              username: 'goku_son',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=G',
            },
            postId: '2',
            commentId: '2',
          },
          {
            id: '5',
            type: 'tag',
            message: 'marcou você em uma postagem',
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
            read: true,
            user: {
              id: '6',
              name: 'Luffy Monkey D.',
              username: 'monkey_d_luffy',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=L',
            },
            postId: '3',
          },
        ];

        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    }
  }, [status]);

  const markAllAsRead = () => {
    // Aqui seria feita a chamada para a API para marcar todas as notificações como lidas
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true,
    })));
  };

  const markAsRead = (id: string) => {
    // Aqui seria feita a chamada para a API para marcar uma notificação específica como lida
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return (
          <div className="bg-red-500 bg-opacity-10 p-2 rounded-full">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="bg-blue-500 bg-opacity-10 p-2 rounded-full">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="bg-green-500 bg-opacity-10 p-2 rounded-full">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="bg-yellow-500 bg-opacity-10 p-2 rounded-full">
            <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
        );
      case 'tag':
        return (
          <div className="bg-purple-500 bg-opacity-10 p-2 rounded-full">
            <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-500 bg-opacity-10 p-2 rounded-full">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'agora mesmo';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
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
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Você precisa estar logado para ver suas notificações.</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Entrar
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> Não foi possível carregar as notificações. Tente novamente mais tarde.</span>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Notificações</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-purple-400 hover:text-purple-300 focus:outline-none"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">Nenhuma notificação encontrada.</p>
          <p className="text-gray-500 mt-2">Quando alguém interagir com você, as notificações aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-gray-800 rounded-lg p-4 flex items-start ${!notification.read ? 'border-l-4 border-purple-500' : ''}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="mr-4 flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link href={`/profile/${notification.user.id}`} className="flex-shrink-0 mr-2">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        {notification.user.image ? (
                          <Image
                            src={notification.user.image}
                            alt={notification.user.name || 'Usuário'}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
                            {notification.user.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div>
                      <p className="text-sm text-white">
                        <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                          {notification.user.username || notification.user.name}
                        </Link>{' '}
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(notification.createdAt)}</p>
                    </div>
                  </div>
                  {notification.postId && (
                    <Link 
                      href={`/post/${notification.postId}${notification.commentId ? `?comment=${notification.commentId}` : ''}`}
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-white"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}