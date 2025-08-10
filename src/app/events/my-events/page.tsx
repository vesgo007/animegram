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
  isAttending: boolean;
  isOrganizer?: boolean;
}

type EventTab = 'upcoming' | 'past' | 'organizing';

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Redirecionar para a página de login se não estiver autenticado
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/events/my-events');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockEvents: Event[] = [
          {
            id: 'event-1',
            title: 'Anime Expo 2023',
            description: 'O maior evento de anime do Brasil!',
            date: '2023-12-15T10:00:00Z',
            location: 'São Paulo Expo, São Paulo, SP',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Anime+Expo+2023',
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
            isAttending: true,
          },
          {
            id: 'event-2',
            title: 'Maratona de Anime: Studio Ghibli',
            description: 'Maratona dos melhores filmes do Studio Ghibli',
            date: '2023-11-20T18:00:00Z',
            location: 'Cinema Cultural, Rio de Janeiro, RJ',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Maratona+Ghibli',
            organizer: {
              id: 'user-2',
              name: 'Clube de Anime RJ',
              username: 'clube_anime_rj',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=CA',
            },
            attendees: Array(78).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'watch-party',
            isAttending: true,
          },
          {
            id: 'event-3',
            title: 'Workshop de Desenho Mangá',
            description: 'Aprenda técnicas de desenho mangá com artistas profissionais',
            date: '2023-12-05T14:00:00Z',
            location: 'Online',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Workshop+Manga',
            organizer: {
              id: 'user-3',
              name: 'Escola de Mangá',
              username: 'escola_manga',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=EM',
            },
            attendees: Array(42).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: true,
            category: 'workshop',
            isAttending: true,
          },
          {
            id: 'event-4',
            title: 'Lançamento: Novo Filme de Dragon Ball',
            description: 'Sessão especial de lançamento do novo filme de Dragon Ball',
            date: '2023-12-20T19:30:00Z',
            location: 'Cinemark Shopping Morumbi, São Paulo, SP',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Dragon+Ball+Premiere',
            organizer: {
              id: 'user-4',
              name: 'Fã Clube Dragon Ball Brasil',
              username: 'dbz_brasil',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=DBZ',
            },
            attendees: Array(210).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'premiere',
            isAttending: true,
          },
          {
            id: 'event-5',
            title: 'Debate: O Impacto dos Animes na Cultura Pop',
            description: 'Debate com especialistas sobre a influência dos animes na cultura pop global',
            date: '2023-10-25T16:00:00Z', // Evento passado
            location: 'Online',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Debate+Anime',
            organizer: {
              id: 'user-5',
              name: 'Cultura Otaku',
              username: 'cultura_otaku',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=CO',
            },
            attendees: Array(65).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: true,
            category: 'discussion',
            isAttending: true,
          },
          {
            id: 'event-6',
            title: 'Torneio de Cosplay: Personagens de Shonen',
            description: 'Competição de cosplay com tema de animes shonen',
            date: '2023-09-10T13:00:00Z', // Evento passado
            location: 'Centro de Convenções, Belo Horizonte, MG',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Cosplay+Shonen',
            organizer: {
              id: 'user-6',
              name: 'Associação de Cosplayers',
              username: 'cosplay_brasil',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=CB',
            },
            attendees: Array(98).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'competition',
            isAttending: true,
          },
          {
            id: 'event-7',
            title: 'Encontro de Fãs: One Piece',
            description: 'Encontro para discutir os últimos capítulos de One Piece',
            date: '2023-12-18T15:00:00Z',
            location: 'Livraria Cultura, Curitiba, PR',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=One+Piece+Meetup',
            organizer: {
              id: session?.user?.id || 'user-7', // Usuário logado é o organizador
              name: session?.user?.name || 'Piratas de One Piece',
              username: 'one_piece_fans',
              image: session?.user?.image || 'https://via.placeholder.com/150/3B0764/FFFFFF?text=OP',
            },
            attendees: Array(45).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'meetup',
            isAttending: true,
            isOrganizer: true,
          },
          {
            id: 'event-8',
            title: 'Festival de Gastronomia Japonesa e Anime',
            description: 'Festival com comidas japonesas e atividades relacionadas a anime',
            date: '2023-12-02T11:00:00Z',
            location: 'Parque Ibirapuera, São Paulo, SP',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Food+Anime+Festival',
            organizer: {
              id: session?.user?.id || 'user-8', // Usuário logado é o organizador
              name: session?.user?.name || 'Cultura Japonesa SP',
              username: 'japao_sp',
              image: session?.user?.image || 'https://via.placeholder.com/150/3B0764/FFFFFF?text=JP',
            },
            attendees: Array(320).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'festival',
            isAttending: true,
            isOrganizer: true,
          },
        ];

        setEvents(mockEvents);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar seus eventos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [status, session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const isEventPast = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate < now;
  };

  const filteredEvents = events.filter(event => {
    const isPast = isEventPast(event.date);
    
    if (activeTab === 'upcoming') {
      return !isPast && event.isAttending;
    } else if (activeTab === 'past') {
      return isPast && event.isAttending;
    } else { // organizing
      return event.isOrganizer;
    }
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'convention': 'bg-purple-500',
      'watch-party': 'bg-blue-500',
      'workshop': 'bg-green-500',
      'premiere': 'bg-red-500',
      'discussion': 'bg-yellow-500',
      'competition': 'bg-orange-500',
      'meetup': 'bg-pink-500',
      'festival': 'bg-indigo-500',
      'other': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleCancelAttendance = (event: Event) => {
    setSelectedEvent(event);
    setShowCancelModal(true);
  };

  const confirmCancelAttendance = () => {
    if (!selectedEvent) return;
    
    // Aqui seria feita a chamada para a API para cancelar a participação
    // Simulando a atualização local
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id ? { ...event, isAttending: false } : event
    );
    
    setEvents(updatedEvents);
    setShowCancelModal(false);
    setSelectedEvent(null);
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
          <h1 className="text-3xl font-bold text-white">Meus Eventos</h1>
          <p className="text-gray-400 mt-2">Gerencie seus eventos e participações</p>
        </div>
        
        <div className="flex space-x-4">
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Todos os Eventos
          </Link>
          
          <Link
            href="/events/calendar"
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendário
          </Link>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Próximos Eventos
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Eventos Passados
          </button>
          <button
            onClick={() => setActiveTab('organizing')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'organizing' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Organizando
          </button>
        </nav>
      </div>

      {/* Lista de eventos */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-white">
            {activeTab === 'upcoming' && 'Você não tem eventos futuros'}
            {activeTab === 'past' && 'Você não participou de eventos anteriores'}
            {activeTab === 'organizing' && 'Você não está organizando nenhum evento'}
          </h3>
          <p className="mt-1 text-gray-400">
            {activeTab === 'upcoming' && 'Explore eventos e confirme sua participação'}
            {activeTab === 'past' && 'Participe de eventos para vê-los aqui'}
            {activeTab === 'organizing' && 'Crie um evento para começar a organizar'}
          </p>
          <div className="mt-6">
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {activeTab === 'organizing' ? 'Criar Evento' : 'Explorar Eventos'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={450}
                  className="w-full h-48 md:h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(event.category)} text-white`}>
                    {event.category}
                  </span>
                  
                  {event.isVirtual && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-900 text-blue-100">
                      <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Virtual
                    </span>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3 p-6 flex flex-col">
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    {event.isOrganizer && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-900 text-purple-100">
                        Organizador
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.date)} às {formatTime(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{event.attendees.length} participantes</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="flex-shrink-0 h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Organizado por {event.organizer.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Ver Detalhes
                  </Link>
                  
                  {!isEventPast(event.date) && !event.isOrganizer && (
                    <button
                      onClick={() => handleCancelAttendance(event)}
                      className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancelar Participação
                    </button>
                  )}
                  
                  {event.isOrganizer && (
                    <>
                      <Link
                        href={`/events/edit/${event.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Editar
                      </Link>
                      
                      <button
                        className="inline-flex items-center px-4 py-2 border border-red-700 rounded-md shadow-sm text-sm font-medium text-red-500 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Cancelar Evento
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cancelamento */}
      {showCancelModal && selectedEvent && (
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
                <h3 className="text-lg leading-6 font-medium text-white">Cancelar Participação</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Tem certeza que deseja cancelar sua participação em "{selectedEvent.title}"? Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={confirmCancelAttendance}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
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