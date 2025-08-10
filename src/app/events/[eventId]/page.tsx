'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: User;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  organizer: User;
  attendees: User[];
  isVirtual: boolean;
  category: string;
  isAttending?: boolean;
  comments?: Comment[];
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();
  const { data: session } = useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAttendeesList, setShowAttendeesList] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    // Simulação de carregamento do evento
    const fetchEvent = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockEvent: Event = {
          id: eventId,
          title: 'Anime Expo 2023',
          description: 'O maior evento de anime do Brasil! Venha participar de painéis, conhecer dubladores, participar de concursos de cosplay e muito mais. Haverá área de exposição com produtos exclusivos, área de jogos, food trucks com comidas temáticas e shows ao vivo com artistas japoneses.\n\nProgramação:\n\n09:00 - Abertura dos portões\n10:00 - Painel de abertura com convidados especiais\n12:00 - Concurso de Cosplay (categoria iniciante)\n14:00 - Sessão de autógrafos com dubladores\n16:00 - Workshop de desenho mangá\n18:00 - Apresentação musical\n20:00 - Concurso de Cosplay (categoria avançado)\n22:00 - Encerramento',
          date: '2023-12-15T10:00:00Z',
          location: 'São Paulo Expo, São Paulo, SP',
          image: 'https://via.placeholder.com/1200/3B0764/FFFFFF?text=Anime+Expo+2023',
          organizer: {
            id: 'user-1',
            name: 'Anime Brasil',
            username: 'anime_brasil',
            image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=AB',
          },
          attendees: Array(156).fill(null).map((_, i) => ({
            id: `attendee-${i}`,
            name: `Fã de Anime ${i}`,
            username: `anime_fan_${i}`,
            image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
          })),
          isVirtual: false,
          category: 'convention',
          isAttending: Math.random() > 0.5,
          comments: Array(12).fill(null).map((_, i) => ({
            id: `comment-${i}`,
            text: i % 3 === 0 
              ? 'Estou super animado para este evento! Alguém mais vai participar do concurso de cosplay?' 
              : i % 3 === 1 
                ? 'Quais são os horários dos painéis? Estou especialmente interessado no painel sobre animação japonesa.'
                : 'Já comprei meu ingresso! Vai ser incrível!',
            createdAt: new Date(Date.now() - i * 3600000 * 24).toISOString(),
            user: {
              id: `user-comment-${i}`,
              name: `Comentarista ${i}`,
              username: `comentarista_${i}`,
              image: i % 4 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=C${i}` : null,
            }
          })),
        };

        setEvent(mockEvent);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar o evento. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleAttendEvent = () => {
    if (!session?.user || !event) return;

    // Atualizar estado local
    setEvent(prevEvent => {
      if (!prevEvent) return null;
      
      const isNowAttending = !prevEvent.isAttending;
      
      return {
        ...prevEvent,
        isAttending: isNowAttending,
        attendees: isNowAttending 
          ? [...prevEvent.attendees, session.user as User]
          : prevEvent.attendees.filter(attendee => attendee.id !== (session.user as User).id)
      };
    });

    // Aqui seria feita a chamada para a API para atualizar no servidor
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !event || !newComment.trim()) return;

    setSubmittingComment(true);

    // Aqui seria feita a chamada para a API para adicionar o comentário
    // Simulando um atraso de rede
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
        user: session.user as User,
      };

      setEvent(prevEvent => {
        if (!prevEvent) return null;
        return {
          ...prevEvent,
          comments: [newCommentObj, ...(prevEvent.comments || [])],
        };
      });

      setNewComment('');
      setSubmittingComment(false);
    }, 1000);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'} atrás`;
      }
      return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atrás`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} atrás`;
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    }
  };

  const isEventPast = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate < now;
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'convention': 'Convenção',
      'watch-party': 'Watch Party',
      'workshop': 'Workshop',
      'premiere': 'Estreia',
      'discussion': 'Debate',
      'competition': 'Competição',
      'meetup': 'Encontro',
      'other': 'Outro',
    };
    return categories[category] || category;
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
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/events')}
            className="text-purple-500 hover:text-purple-400 transition-colors duration-150"
          >
            Voltar para Eventos
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400 text-lg">Evento não encontrado.</p>
        <button
          onClick={() => router.push('/events')}
          className="mt-4 text-purple-500 hover:text-purple-400 transition-colors duration-150"
        >
          Voltar para Eventos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Navegação */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/events" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Eventos
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">
                  {event.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Cabeçalho do Evento */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="relative">
          <div className="aspect-[2/1] relative">
            <Image
              src={event.image}
              alt={event.title}
              width={1200}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Categoria */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 bg-opacity-80 text-purple-100">
              {getCategoryLabel(event.category)}
            </span>
            
            {event.isVirtual && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-80 text-blue-100">
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Virtual
              </span>
            )}
            
            {isEventPast(event.date) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 bg-opacity-80 text-red-100">
                Evento passado
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
              
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={isEventPast(event.date) ? 'text-red-400' : ''}>
                  {formatEventDate(event.date)}
                </span>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center">
                <Link href={`/profile/${event.organizer.id}`} className="flex items-center group">
                  <div className="h-6 w-6 rounded-full overflow-hidden mr-2 group-hover:ring-1 group-hover:ring-purple-500">
                    {event.organizer.image ? (
                      <Image
                        src={event.organizer.image}
                        alt={event.organizer.name || 'Organizador'}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                        {event.organizer.name?.charAt(0) || 'O'}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-purple-400">
                    Organizado por <span className="font-medium">{event.organizer.name || event.organizer.username}</span>
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {!isEventPast(event.date) && (
                <button
                  onClick={handleAttendEvent}
                  disabled={!session}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center ${event.isAttending ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' : 'bg-purple-600 hover:bg-purple-700 text-white'} ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {event.isAttending ? (
                    <>
                      <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Participando
                    </>
                  ) : (
                    'Participar'
                  )}
                </button>
              )}
              
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartilhar
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <button
                onClick={() => setShowAttendeesList(true)}
                className="flex items-center text-gray-300 hover:text-white"
              >
                <div className="flex -space-x-1 mr-2">
                  {event.attendees.slice(0, 3).map((attendee, index) => (
                    <div key={`${attendee.id}-${index}`} className="h-6 w-6 rounded-full overflow-hidden ring-1 ring-gray-800">
                      {attendee.image ? (
                        <Image
                          src={attendee.image}
                          alt={attendee.name || `Participante ${index}`}
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-600 flex items-center justify-center text-white text-xs">
                          {attendee.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                  ))}
                  {event.attendees.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 ring-1 ring-gray-800">
                      +{event.attendees.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm">{event.attendees.length} {event.attendees.length === 1 ? 'pessoa' : 'pessoas'} participando</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda - Descrição */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Sobre este evento</h2>
            <div className="text-gray-300 whitespace-pre-line">{event.description}</div>
          </div>
          
          {/* Comentários */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Comentários</h2>
            
            {session ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'Usuário'}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white">
                          {session.user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        placeholder="Adicione um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {submittingComment ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          'Comentar'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-700 rounded-lg p-4 mb-6 text-center">
                <p className="text-gray-300 mb-2">Faça login para adicionar um comentário</p>
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Fazer Login
                </Link>
              </div>
            )}
            
            {event.comments && event.comments.length > 0 ? (
              <div className="space-y-6">
                {event.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <Link href={`/profile/${comment.user.id}`}>
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          {comment.user.image ? (
                            <Image
                              src={comment.user.image}
                              alt={comment.user.name || 'Usuário'}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-600 flex items-center justify-center text-white">
                              {comment.user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <Link href={`/profile/${comment.user.id}`} className="text-white font-medium hover:text-purple-400">
                            {comment.user.name || comment.user.username}
                          </Link>
                          <span className="text-gray-400 text-xs">{formatCommentDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="h-12 w-12 text-gray-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-400">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Coluna da Direita - Informações Adicionais */}
        <div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Detalhes</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-gray-300 font-medium">Data e Hora</p>
                  <p className="text-gray-400 text-sm">{formatEventDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-300 font-medium">Localização</p>
                  <p className="text-gray-400 text-sm">{event.location}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <p className="text-gray-300 font-medium">Categoria</p>
                  <p className="text-gray-400 text-sm">{getCategoryLabel(event.category)}</p>
                </div>
              </div>
              
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-gray-300 font-medium">Participantes</p>
                  <button 
                    onClick={() => setShowAttendeesList(true)}
                    className="text-gray-400 text-sm hover:text-purple-400"
                  >
                    {event.attendees.length} confirmados
                  </button>
                </div>
              </div>
              
              <div className="flex">
                <svg className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-gray-300 font-medium">Organizador</p>
                  <Link 
                    href={`/profile/${event.organizer.id}`}
                    className="text-gray-400 text-sm hover:text-purple-400"
                  >
                    {event.organizer.name || event.organizer.username}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {!isEventPast(event.date) && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Participar</h2>
              
              {session ? (
                <button
                  onClick={handleAttendEvent}
                  className={`w-full py-3 rounded-md text-sm font-medium flex items-center justify-center ${event.isAttending ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                >
                  {event.isAttending ? (
                    <>
                      <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Você está participando
                    </>
                  ) : (
                    'Confirmar participação'
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-3">Faça login para participar deste evento</p>
                  <Link href="/auth/login" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Fazer Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Lista de Participantes */}
      {showAttendeesList && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Participantes ({event.attendees.length})</h2>
              <button
                onClick={() => setShowAttendeesList(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="divide-y divide-gray-700">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="py-3 flex items-center">
                  <Link href={`/profile/${attendee.id}`} className="flex items-center flex-1">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      {attendee.image ? (
                        <Image
                          src={attendee.image}
                          alt={attendee.name || 'Participante'}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-600 flex items-center justify-center text-white">
                          {attendee.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{attendee.name || attendee.username}</p>
                      {attendee.username && attendee.name && (
                        <p className="text-gray-400 text-sm">@{attendee.username}</p>
                      )}
                    </div>
                  </Link>
                  
                  {attendee.id === event.organizer.id && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-100">
                      Organizador
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAttendeesList(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Compartilhar Evento</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-2">Compartilhe este evento com seus amigos:</p>
              <div className="flex items-center bg-gray-700 rounded-md overflow-hidden">
                <input
                  type="text"
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  readOnly
                  className="flex-1 bg-transparent border-none px-3 py-2 text-white focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 flex items-center"
                >
                  {copySuccess ? (
                    <>
                      <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-300 mb-3">Ou compartilhe nas redes sociais:</p>
              <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}