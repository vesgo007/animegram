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
  distance?: number; // distância em km
  image: string;
  organizer: User;
  attendees: User[];
  isVirtual: boolean;
  category: string;
  isAttending?: boolean;
}

export default function NearbyEventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [distanceFilter, setDistanceFilter] = useState<number>(50); // 50km por padrão

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocationPermission('granted');
          },
          (error) => {
            console.error('Erro ao obter localização:', error);
            setLocationPermission('denied');
          }
        );
      } else {
        setError('Geolocalização não é suportada pelo seu navegador.');
        setLocationPermission('denied');
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
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
            distance: 2.5,
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
            distance: 5.8,
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
            distance: 0, // Eventos virtuais têm distância 0
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
            distance: 3.2,
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
            distance: 0, // Eventos virtuais têm distância 0
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
            distance: 12.7,
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
            distance: 25.3,
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
            distance: 4.1,
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
            category: 'festival',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-9',
            title: 'Feira de Mangás e Quadrinhos',
            description: 'Feira com vendedores de mangás, quadrinhos e colecionáveis',
            date: '2023-12-09T10:00:00Z',
            location: 'Centro de Exposições, Campinas, SP',
            distance: 35.8,
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Manga+Fair',
            organizer: {
              id: 'user-9',
              name: 'Associação de Quadrinistas',
              username: 'quadrinhos_brasil',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=QB',
            },
            attendees: Array(145).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'fair',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-10',
            title: 'Sessão de Autógrafos: Autor de Mangá',
            description: 'Sessão de autógrafos com famoso autor de mangá em visita ao Brasil',
            date: '2023-12-17T14:00:00Z',
            location: 'Livraria Saraiva, Rio de Janeiro, RJ',
            distance: 42.3,
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Manga+Author+Signing',
            organizer: {
              id: 'user-10',
              name: 'Editora Anime Brasil',
              username: 'editora_anime',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=EA',
            },
            attendees: Array(87).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Fã de Anime ${i}`,
              username: `anime_fan_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'signing',
            isAttending: Math.random() > 0.5,
          },
        ];

        // Filtrar eventos por distância se a localização do usuário estiver disponível
        const filteredEvents = locationPermission === 'granted'
          ? mockEvents.filter(event => event.isVirtual || (event.distance !== undefined && event.distance <= distanceFilter))
          : mockEvents;

        // Ordenar eventos por distância
        const sortedEvents = [...filteredEvents].sort((a, b) => {
          // Eventos virtuais sempre aparecem primeiro
          if (a.isVirtual && !b.isVirtual) return -1;
          if (!a.isVirtual && b.isVirtual) return 1;
          // Depois ordenar por distância
          return (a.distance || 0) - (b.distance || 0);
        });

        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar os eventos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [locationPermission, distanceFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

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
      'fair': 'bg-teal-500',
      'signing': 'bg-cyan-500',
      'other': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleDistanceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistanceFilter(Number(e.target.value));
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationPermission('denied');
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo seu navegador.');
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
          <h1 className="text-3xl font-bold text-white">Eventos Próximos a Você</h1>
          <p className="text-gray-400 mt-2">Descubra eventos de anime na sua região</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          {locationPermission !== 'granted' && (
            <button
              onClick={requestLocationPermission}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Compartilhar Localização
            </button>
          )}
          
          {locationPermission === 'granted' && (
            <div className="flex items-center space-x-2">
              <label htmlFor="distance-filter" className="text-sm font-medium text-gray-300">
                Distância máxima:
              </label>
              <select
                id="distance-filter"
                value={distanceFilter}
                onChange={handleDistanceFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            </div>
          )}
          
          <Link
            href="/events/calendar"
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Calendário
          </Link>
        </div>
      </div>

      {/* Mensagem de localização */}
      {locationPermission === 'denied' && (
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-md mb-6" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                Compartilhe sua localização para ver eventos próximos a você. Sem localização, estamos mostrando todos os eventos disponíveis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de eventos */}
      {events.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-white">Nenhum evento encontrado</h3>
          <p className="mt-1 text-gray-400">
            Não encontramos eventos próximos a você com os filtros atuais.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setDistanceFilter(100)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Aumentar Distância de Busca
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${event.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={450}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getCategoryColor(event.category)} text-white`}>
                    {event.category}
                  </span>
                  
                  {event.isVirtual ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-900 text-blue-100">
                      <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Virtual
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-700 text-gray-200">
                      <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.distance !== undefined ? `${event.distance} km` : 'Presencial'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg className="flex-shrink-0 h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.date)} às {formatTime(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg className="flex-shrink-0 h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg className="flex-shrink-0 h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{event.attendees.length} participantes</span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-900 flex justify-between items-center">
                <div className="flex items-center">
                  {event.organizer.image && (
                    <Image
                      src={event.organizer.image}
                      alt={event.organizer.name || ''}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full mr-2"
                    />
                  )}
                  <span className="text-sm text-gray-400">{event.organizer.name}</span>
                </div>
                
                {event.isAttending ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-900 text-green-100">
                    <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmado
                  </span>
                ) : (
                  <span className="text-sm text-purple-400 hover:text-purple-300">
                    Ver detalhes
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}