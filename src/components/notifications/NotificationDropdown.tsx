'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag';
  content: string;
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

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aqui seria feita a chamada para a API para buscar as notificações
    // Por enquanto, vamos simular com dados de exemplo
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'like',
          content: 'curtiu sua publicação',
          createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
          read: false,
          user: {
            id: '2',
            name: 'Sakura Haruno',
            username: 'sakura_haruno',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
          },
          postId: '101',
        },
        {
          id: '2',
          type: 'comment',
          content: 'comentou em sua publicação: "Incrível foto!"',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
          read: false,
          user: {
            id: '3',
            name: 'Naruto Uzumaki',
            username: 'naruto_uzumaki',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
          },
          postId: '102',
          commentId: '201',
        },
        {
          id: '3',
          type: 'follow',
          content: 'começou a seguir você',
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
          content: 'mencionou você em um comentário: "@user_teste vamos assistir esse anime juntos!"',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          read: true,
          user: {
            id: '5',
            name: 'Hinata Hyuga',
            username: 'hinata_hyuga',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=H',
          },
          postId: '103',
          commentId: '202',
        },
        {
          id: '5',
          type: 'tag',
          content: 'marcou você em uma publicação',
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
          read: true,
          user: {
            id: '6',
            name: 'Kakashi Hatake',
            username: 'kakashi_sensei',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=K',
          },
          postId: '104',
        },
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);

    // Adicionar event listener para fechar o dropdown ao clicar fora dele
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const markAsRead = (notificationId: string) => {
    // Aqui seria feita a chamada para a API para marcar a notificação como lida
    // Por enquanto, vamos simular a atualização
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    // Aqui seria feita a chamada para a API para marcar todas as notificações como lidas
    // Por enquanto, vamos simular a atualização
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return (
          <div className="p-2 bg-red-500 bg-opacity-10 rounded-full">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="p-2 bg-blue-500 bg-opacity-10 rounded-full">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="p-2 bg-green-500 bg-opacity-10 rounded-full">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      case 'mention':
        return (
          <div className="p-2 bg-yellow-500 bg-opacity-10 rounded-full">
            <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'tag':
        return (
          <div className="p-2 bg-purple-500 bg-opacity-10 rounded-full">
            <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'agora mesmo';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Notificações</h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-150"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-400">Nenhuma notificação.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-700 transition-colors duration-150 ${!notification.read ? 'bg-gray-700 bg-opacity-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative">
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
                      <div className="absolute -right-1 -bottom-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/profile/${notification.user.id}`}
                          className="font-medium text-white hover:underline"
                        >
                          {notification.user.username || notification.user.name}
                        </Link>{' '}
                        <span className="text-gray-400">{notification.content}</span>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="ml-2 text-purple-400 hover:text-purple-300 transition-colors duration-150"
                          title="Marcar como lida"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                    {notification.postId && (
                      <Link
                        href={`/post/${notification.postId}`}
                        className="mt-2 inline-block text-xs text-purple-400 hover:text-purple-300 transition-colors duration-150"
                      >
                        Ver publicação
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-700 text-center">
        <Link
          href="/notifications"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-150"
          onClick={onClose}
        >
          Ver todas as notificações
        </Link>
      </div>
    </div>
  );
}