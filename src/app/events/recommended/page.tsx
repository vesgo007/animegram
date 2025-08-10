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
}

export default function RecommendedEventsPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'nearby', 'popular'

  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      try {
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
            isAttending: Math.random() > 0.5,
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
            isAttending: Math.random() > 0.5,
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
            isAttending: Math.random() > 0.5,
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
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-5',
            title: 'Debate: O Impacto dos Animes na Cultura Pop',
            description: 'Debate com especialistas sobre a influência dos animes na cultura pop global',
            date: '2023-11-25T16:00:00Z',
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
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-6',
            title: 'Torneio de Cosplay: Personagens de Shonen',
            description: 'Competição de cosplay com tema de animes shonen',
            date: '2023-12-10T13:00:00Z',
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
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-7',
            title: 'Encontro de Fãs: One Piece',
            description: 'Encontro para discutir os últimos capítulos de One Piece',
            date: '2023-11-18T15:00:00Z',
            location: 'Livraria Cultura, Curitiba, PR',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=One+Piece+Meetup',
            organizer: {
              id: 'user-7',
              name: 'Piratas de One Piece',
              username: 'one_piece_fans',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=OP',
            },
            attendees: Array(45).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'meetup',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-8',
            title: 'Festival de Gastronomia Japonesa e Anime',
            description: 'Festival com comidas japonesas e atividades relacionadas a anime',
            date: '2023-12-02T11:00:00Z',
            location: 'Parque Ibirapuera, São Paulo, SP',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Food+Anime+Festival',
            organizer: {
              id: 'user-8',
              name: 'Cultura Japonesa SP',
              username: 'japao_sp',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=JP',
            },
            attendees: Array(320).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'other',
            isAttending: Math.random() > 0.5,
          },
        ];

        setEvents(mockEvents);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar os eventos recomendados. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchRecommendedEvents();
  }, []);

  const filterEventsByTab = (events: Event[]) => {
    if (activeTab === 'all') return events;
    if (activeTab === 'nearby') {
      // Simulando eventos próximos (na vida real, usaria geolocalização)
      return events.filter(event => !event.isVirtual && event.location.includes('São Paulo'));
    }
    if (activeTab === 'popular') {
      // Ordenando por número de participantes
      return [...events].sort((a, b) => b.attendees.length - a.attendees.length);
    }
    return events;
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

  const filteredEvents = filterEventsByTab(events);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Eventos Recomendados</h1>
        <Link href="/events" className="text-purple-400 hover:text-purple-300 flex items-center">
          <span>Todos os Eventos</span>
          <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Abas de Filtro */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab('nearby')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'nearby' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Próximos a Você
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'popular' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Populares
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400 text-lg">Nenhum evento encontrado para este filtro.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-4 text-purple-500 hover:text-purple-400 transition-colors duration-150"
          >
            Ver todos os eventos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${event.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="relative">
                <div className="aspect-[16/9] relative">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Categoria e Indicadores */}
                <div className="absolute top-2 left-2 flex space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 bg-opacity-80 text-purple-100">
                    {getCategoryLabel(event.category)}
                  </span>
                  
                  {event.isVirtual && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-80 text-blue-100">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Virtual
                    </span>
                  )}
                  
                  {isEventPast(event.date) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-900 bg-opacity-80 text-red-100">
                      Passado
                    </span>
                  )}
                </div>
                
                {/* Participantes */}
                <div className="absolute bottom-2 right-2">
                  <div className="flex items-center bg-black bg-opacity-60 rounded-full px-2 py-1">
                    <svg className="h-3 w-3 text-gray-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs text-white">{event.attendees.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{event.title}</h3>
                
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={isEventPast(event.date) ? 'text-red-400' : ''}>
                    {formatEventDate(event.date)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
                
                <div className="mt-auto flex items-center">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
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
                    <span className="text-gray-300 text-sm truncate">
                      {event.organizer.name || event.organizer.username}
                    </span>
                  </div>
                  
                  {event.isAttending && (
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-100">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Participando
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Seção de Eventos Populares (se não estiver na aba de populares) */}
      {activeTab !== 'popular' && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Eventos Populares</h2>
            <button
              onClick={() => setActiveTab('popular')}
              className="text-purple-400 hover:text-purple-300 flex items-center"
            >
              <span>Ver mais</span>
              <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...events]
              .sort((a, b) => b.attendees.length - a.attendees.length)
              .slice(0, 3)
              .map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="relative">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Categoria e Indicadores */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 bg-opacity-80 text-purple-100">
                        {getCategoryLabel(event.category)}
                      </span>
                      
                      {event.isVirtual && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-80 text-blue-100">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Virtual
                        </span>
                      )}
                    </div>
                    
                    {/* Participantes */}
                    <div className="absolute bottom-2 right-2">
                      <div className="flex items-center bg-black bg-opacity-60 rounded-full px-2 py-1">
                        <svg className="h-3 w-3 text-gray-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs text-white">{event.attendees.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={isEventPast(event.date) ? 'text-red-400' : ''}>
                        {formatEventDate(event.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="mt-auto flex items-center">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
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
                        <span className="text-gray-300 text-sm truncate">
                          {event.organizer.name || event.organizer.username}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Seção de Eventos Próximos (se não estiver na aba de próximos) */}
      {activeTab !== 'nearby' && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Eventos Próximos a Você</h2>
            <button
              onClick={() => setActiveTab('nearby')}
              className="text-purple-400 hover:text-purple-300 flex items-center"
            >
              <span>Ver mais</span>
              <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter(event => !event.isVirtual && event.location.includes('São Paulo'))
              .slice(0, 3)
              .map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="relative">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Categoria e Indicadores */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 bg-opacity-80 text-purple-100">
                        {getCategoryLabel(event.category)}
                      </span>
                    </div>
                    
                    {/* Participantes */}
                    <div className="absolute bottom-2 right-2">
                      <div className="flex items-center bg-black bg-opacity-60 rounded-full px-2 py-1">
                        <svg className="h-3 w-3 text-gray-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs text-white">{event.attendees.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{event.title}</h3>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={isEventPast(event.date) ? 'text-red-400' : ''}>
                        {formatEventDate(event.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="mt-auto flex items-center">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
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
                        <span className="text-gray-300 text-sm truncate">
                          {event.organizer.name || event.organizer.username}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}