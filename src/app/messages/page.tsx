'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  isOnline?: boolean;
  lastActive?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  read: boolean;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      // Aqui seria feita a chamada para a API para buscar as conversas
      // Por enquanto, vamos simular com dados de exemplo
      setTimeout(() => {
        const mockConversations: Conversation[] = [
          {
            id: '1',
            user: {
              id: '2',
              name: 'Sakura Haruno',
              username: 'sakura_haruno',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
              isOnline: true,
            },
            lastMessage: {
              id: '101',
              content: 'Você viu o novo episódio de Naruto?',
              createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
              senderId: '2',
              receiverId: session.user.id as string,
              read: false,
            },
            unreadCount: 1,
          },
          {
            id: '2',
            user: {
              id: '3',
              name: 'Naruto Uzumaki',
              username: 'naruto_uzumaki',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=N',
              isOnline: false,
              lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
            },
            lastMessage: {
              id: '102',
              content: 'Vamos treinar amanhã?',
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
              senderId: session.user.id as string,
              receiverId: '3',
              read: true,
            },
            unreadCount: 0,
          },
          {
            id: '3',
            user: {
              id: '4',
              name: 'Sasuke Uchiha',
              username: 'sasuke_uchiha',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=S',
              isOnline: true,
            },
            lastMessage: {
              id: '103',
              content: 'Preciso da sua ajuda com uma missão.',
              createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
              senderId: '4',
              receiverId: session.user.id as string,
              read: true,
            },
            unreadCount: 0,
          },
        ];

        setConversations(mockConversations);
        setLoading(false);
      }, 1000);
    }
  }, [status, session]);

  useEffect(() => {
    if (activeConversation) {
      // Aqui seria feita a chamada para a API para buscar as mensagens da conversa ativa
      // Por enquanto, vamos simular com dados de exemplo
      setLoading(true);
      setTimeout(() => {
        const activeUser = conversations.find(conv => conv.id === activeConversation)?.user;
        if (!activeUser || !session?.user) return;

        const mockMessages: Message[] = [
          {
            id: '1',
            content: 'Olá! Como você está?',
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
            senderId: session.user.id as string,
            receiverId: activeUser.id,
            read: true,
          },
          {
            id: '2',
            content: 'Estou bem, obrigado! E você?',
            createdAt: new Date(Date.now() - 3540000).toISOString(), // 59 minutos atrás
            senderId: activeUser.id,
            receiverId: session.user.id as string,
            read: true,
          },
          {
            id: '3',
            content: 'Também estou bem! Viu o novo episódio de Demon Slayer?',
            createdAt: new Date(Date.now() - 3480000).toISOString(), // 58 minutos atrás
            senderId: session.user.id as string,
            receiverId: activeUser.id,
            read: true,
          },
          {
            id: '4',
            content: 'Sim! A animação está incrível como sempre!',
            createdAt: new Date(Date.now() - 3420000).toISOString(), // 57 minutos atrás
            senderId: activeUser.id,
            receiverId: session.user.id as string,
            read: true,
          },
          {
            id: '5',
            content: 'Aquela cena de luta final foi épica!',
            createdAt: new Date(Date.now() - 3360000).toISOString(), // 56 minutos atrás
            senderId: session.user.id as string,
            receiverId: activeUser.id,
            read: true,
          },
          {
            id: '6',
            content: 'Concordo! Mal posso esperar pelo próximo episódio.',
            createdAt: new Date(Date.now() - 3300000).toISOString(), // 55 minutos atrás
            senderId: activeUser.id,
            receiverId: session.user.id as string,
            read: true,
          },
          {
            id: '7',
            content: 'Você viu o novo episódio de Naruto?',
            createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
            senderId: activeUser.id,
            receiverId: session.user.id as string,
            read: false,
          },
        ];

        setMessages(mockMessages);
        setLoading(false);

        // Marcar mensagens como lidas
        setConversations(conversations.map(conv => 
          conv.id === activeConversation ? { ...conv, unreadCount: 0 } : conv
        ));

        // Rolar para o final da conversa
        scrollToBottom();
      }, 500);
    }
  }, [activeConversation, conversations, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const activeUser = conversations.find(conv => conv.id === activeConversation)?.user;
    if (!activeUser || !session?.user) return;

    // Aqui seria feita a chamada para a API para enviar a mensagem
    // Por enquanto, vamos simular o envio
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderId: session.user.id as string,
      receiverId: activeUser.id,
      read: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Atualizar a última mensagem na conversa
    setConversations(conversations.map(conv => 
      conv.id === activeConversation ? { 
        ...conv, 
        lastMessage: newMsg,
      } : conv
    ));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return '';
    
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

  if (status === 'loading' || (loading && !activeConversation)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Você precisa estar logado para ver suas mensagens.</p>
        <Link href="/auth/login" className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Entrar
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> Não foi possível carregar as mensagens. Tente novamente mais tarde.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-200px)]">
          {/* Lista de conversas */}
          <div className="bg-gray-900 border-r border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Mensagens</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {conversations.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-400">Nenhuma conversa encontrada.</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full text-left p-4 hover:bg-gray-800 transition-colors duration-150 ${activeConversation === conversation.id ? 'bg-gray-800' : ''}`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          {conversation.user.image ? (
                            <Image
                              src={conversation.user.image}
                              alt={conversation.user.name || 'Usuário'}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-lg font-medium">
                              {conversation.user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        {conversation.user.isOnline && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-gray-900"></span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-white truncate">
                            {conversation.user.username || conversation.user.name}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatTime(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          {conversation.lastMessage ? (
                            <p className="text-xs text-gray-400 truncate">
                              {conversation.lastMessage.senderId === session?.user?.id ? (
                                <span className="text-gray-500">Você: </span>
                              ) : null}
                              {conversation.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">Nenhuma mensagem ainda</p>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-600 text-xs font-medium text-white">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Área de conversa */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
            {activeConversation ? (
              <>
                {/* Cabeçalho da conversa */}
                <div className="p-4 border-b border-gray-700 flex items-center">
                  {(() => {
                    const activeUser = conversations.find(conv => conv.id === activeConversation)?.user;
                    if (!activeUser) return null;

                    return (
                      <>
                        <div className="relative flex-shrink-0">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            {activeUser.image ? (
                              <Image
                                src={activeUser.image}
                                alt={activeUser.name || 'Usuário'}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
                                {activeUser.name?.charAt(0) || 'U'}
                              </div>
                            )}
                          </div>
                          {activeUser.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800"></span>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-white">
                            {activeUser.username || activeUser.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {activeUser.isOnline ? (
                              'Online'
                            ) : (
                              `Visto por último ${formatLastActive(activeUser.lastActive)}`
                            )}
                          </p>
                        </div>
                      </>
                    );
                  })()} 
                </div>

                {/* Mensagens */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-gray-400">Nenhuma mensagem ainda.</p>
                      <p className="text-gray-500 text-sm mt-2">Envie uma mensagem para iniciar a conversa!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isSentByMe = message.senderId === session?.user?.id;
                        return (
                          <div key={message.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSentByMe ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'}`}>
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isSentByMe ? 'text-purple-200' : 'text-gray-400'}`}>
                                {formatTime(message.createdAt)}
                                {isSentByMe && (
                                  <span className="ml-1">
                                    {message.read ? (
                                      <svg className="inline-block h-3 w-3 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="inline-block h-3 w-3 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Formulário de envio de mensagem */}
                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 bg-gray-700 text-white rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-medium text-white mb-2">Suas mensagens</h3>
                <p className="text-gray-400 max-w-md">Selecione uma conversa ou inicie uma nova para começar a enviar mensagens privadas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}