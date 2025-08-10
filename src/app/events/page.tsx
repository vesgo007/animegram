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

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past' | 'my'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEventDetails, setShowEventDetails] = useState<string | null>(null);

  // Formulário para criar evento
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isVirtual: false,
    category: 'convention',
    image: null as File | null,
    imagePreview: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulação de carregamento de eventos
    const fetchEvents = async () => {
      try {
        // Aqui seria feita a chamada para a API
        // Simulando um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dados de exemplo
        const mockEvents: Event[] = [
          {
            id: 'event-1',
            title: 'Anime Expo 2023',
            description: 'O maior evento de anime do Brasil! Venha participar de painéis, conhecer dubladores, participar de concursos de cosplay e muito mais. Haverá área de exposição com produtos exclusivos, área de jogos, food trucks com comidas temáticas e shows ao vivo com artistas japoneses.',
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
              name: `Attendee ${i}`,
              username: `attendee_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'convention',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-2',
            title: 'Maratona Naruto Shippuden',
            description: 'Maratona dos melhores episódios de Naruto Shippuden com comentários ao vivo dos fãs. Evento online com premiações para os participantes mais ativos no chat. Teremos convidados especiais e sorteio de produtos exclusivos.',
            date: '2023-11-20T18:00:00Z',
            location: 'Online - Discord',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Naruto+Maratona',
            organizer: {
              id: 'user-2',
              name: 'Konoha Fã Clube',
              username: 'konoha_fc',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=KF',
            },
            attendees: Array(89).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Attendee ${i}`,
              username: `attendee_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: true,
            category: 'watch-party',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-3',
            title: 'Workshop de Desenho Mangá',
            description: 'Aprenda técnicas de desenho mangá com artistas profissionais. Workshop presencial com materiais inclusos. Vagas limitadas. Todos os níveis são bem-vindos, desde iniciantes até artistas experientes. Cada participante receberá um kit com materiais de desenho.',
            date: '2023-12-05T14:00:00Z',
            location: 'Centro Cultural, Rio de Janeiro, RJ',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Workshop+Manga',
            organizer: {
              id: 'user-3',
              name: 'Manga Artists BR',
              username: 'manga_artists_br',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=MA',
            },
            attendees: Array(24).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Attendee ${i}`,
              username: `attendee_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'workshop',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-4',
            title: 'Lançamento: One Piece Film Red',
            description: 'Sessão especial de lançamento do novo filme de One Piece com brindes exclusivos. Venha fantasiado e participe do concurso de cosplay antes da sessão. Os primeiros 50 participantes receberão pôsteres autografados.',
            date: '2023-11-10T19:30:00Z',
            location: 'Cinemark Shopping Eldorado, São Paulo, SP',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=One+Piece+Film',
            organizer: {
              id: 'user-4',
              name: 'Toei Animation Brasil',
              username: 'toei_br',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=TB',
            },
            attendees: Array(210).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Attendee ${i}`,
              username: `attendee_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'premiere',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-5',
            title: 'Debate: O Impacto Cultural do Anime',
            description: 'Debate acadêmico sobre a influência do anime na cultura global. Palestrantes convidados incluem professores universitários e críticos culturais. Haverá emissão de certificado de participação e material complementar disponível para download.',
            date: '2023-12-12T15:00:00Z',
            location: 'Online - Zoom',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Debate+Anime',
            organizer: {
              id: 'user-5',
              name: 'Anime Studies',
              username: 'anime_studies',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=AS',
            },
            attendees: Array(45).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Attendee ${i}`,
              username: `attendee_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: true,
            category: 'discussion',
            isAttending: Math.random() > 0.5,
          },
          {
            id: 'event-6',
            title: 'Torneio de Card Game Yu-Gi-Oh!',
            description: 'Torneio oficial de Yu-Gi-Oh! com premiação em cartas raras. Inscrições limitadas. Traga seu próprio deck. Juízes oficiais estarão presentes para garantir o cumprimento das regras. Haverá uma área para trocas de cartas entre os participantes.',
            date: '2023-11-25T09:00:00Z',
            location: 'Card Shop Central, Belo Horizonte, MG',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Yugioh+Tournament',
            organizer: {
              id: 'user-6',
              name: 'Duel Monsters Brasil',
              username: 'duel_monsters_br',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=DM',
            },
            attendees: Array(32).fill(null).map((_, i) => ({
              id: `attendee-${i}`,
              name: `Attendee ${i}`,
              username: `attendee_${i}`,
              image: i % 3 === 0 ? `https://via.placeholder.com/150/3B0764/FFFFFF?text=${i}` : null,
            })),
            isVirtual: false,
            category: 'competition',
            isAttending: Math.random() > 0.5,
          },
        ];

        setEvents(mockEvents);
        
        // Filtrar eventos que o usuário está participando
        const userEvents = mockEvents.filter(event => event.isAttending);
        setMyEvents(userEvents);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAttendEvent = (eventId: string) => {
    if (!session?.user) {
      // Redirecionar para login ou mostrar modal
      alert('Você precisa estar logado para participar de eventos.');
      return;
    }

    // Atualizar estado local
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          const isNowAttending = !event.isAttending;
          
          // Atualizar também a lista de myEvents
          if (isNowAttending) {
            setMyEvents(prev => [...prev, event]);
          } else {
            setMyEvents(prev => prev.filter(e => e.id !== eventId));
          }
          
          return {
            ...event,
            isAttending: isNowAttending,
            attendees: isNowAttending 
              ? [...event.attendees, session.user as User]
              : event.attendees.filter(attendee => attendee.id !== (session.user as User).id)
          };
        }
        return event;
      });
      return updatedEvents;
    });

    // Aqui seria feita a chamada para a API para atualizar no servidor
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setIsSubmitting(true);

    // Aqui seria feita a chamada para a API para criar o evento
    // Simulando um atraso de rede
    setTimeout(() => {
      // Criar novo evento com dados do formulário
      const dateTime = `${newEvent.date}T${newEvent.time}:00Z`;
      
      const createdEvent: Event = {
        id: `event-${Date.now()}`,
        title: newEvent.title,
        description: newEvent.description,
        date: dateTime,
        location: newEvent.isVirtual ? `Online - ${newEvent.location}` : newEvent.location,
        image: newEvent.imagePreview || 'https://via.placeholder.com/800/3B0764/FFFFFF?text=New+Event',
        organizer: session.user as User,
        attendees: [session.user as User],
        isVirtual: newEvent.isVirtual,
        category: newEvent.category,
        isAttending: true,
      };

      // Atualizar estado
      setEvents(prev => [createdEvent, ...prev]);
      setMyEvents(prev => [createdEvent, ...prev]);
      
      // Resetar formulário
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        isVirtual: false,
        category: 'convention',
        image: null,
        imagePreview: '',
      });
      
      setIsSubmitting(false);
      setShowCreateModal(false);
    }, 1500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    // Criar URL para preview
    const imageUrl = URL.createObjectURL(file);
    
    setNewEvent({
      ...newEvent,
      image: file,
      imagePreview: imageUrl,
    });
  };

  const getFilteredEvents = () => {
    const now = new Date();
    
    // Filtrar por categoria
    let filtered = events;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    // Filtrar por pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizer.name?.toLowerCase().includes(query) ||
        event.organizer.username?.toLowerCase().includes(query)
      );
    }
    
    // Filtrar por aba
    switch (activeTab) {
      case 'upcoming':
        return filtered.filter(event => new Date(event.date) > now);
      case 'past':
        return filtered.filter(event => new Date(event.date) < now);
      case 'my':
        return myEvents;
      default:
        return filtered;
    }
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

  const filteredEvents = getFilteredEvents();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Eventos</h1>
          <p className="text-gray-400 mt-1">Descubra e participe de eventos da comunidade anime</p>
        </div>
        
        {session?.user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Criar Evento
          </button>
        )}
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Pesquisar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Todas categorias</option>
              <option value="convention">Convenções</option>
              <option value="watch-party">Watch Parties</option>
              <option value="workshop">Workshops</option>
              <option value="premiere">Estreias</option>
              <option value="discussion">Debates</option>
              <option value="competition">Competições</option>
              <option value="meetup">Encontros</option>
              <option value="other">Outros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Próximos
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
          >
            Passados
          </button>
          {session?.user && (
            <button
              onClick={() => setActiveTab('my')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'my' ? 'border-purple-500 text-purple-500' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Meus Eventos
            </button>
          )}
        </nav>
      </div>

      {/* Lista de Eventos */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400 text-lg">Nenhum evento encontrado</p>
          <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou crie um novo evento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative">
                <div className="aspect-video relative">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Categoria */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 bg-opacity-80 text-purple-100">
                    {getCategoryLabel(event.category)}
                  </span>
                </div>
                
                {/* Indicador de evento virtual */}
                {event.isVirtual && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-80 text-blue-100">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Virtual
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={isEventPast(event.date) ? 'text-red-400' : ''}>
                    {formatEventDate(event.date)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{event.title}</h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link href={`/profile/${event.organizer.id}`} className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full overflow-hidden">
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
                    </Link>
                    <span className="ml-2 text-xs text-gray-500 truncate max-w-[100px]">
                      {event.organizer.username || event.organizer.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex -space-x-1 mr-2">
                      {event.attendees.slice(0, 3).map((attendee, index) => (
                        <div key={`${attendee.id}-${index}`} className="h-5 w-5 rounded-full overflow-hidden ring-1 ring-gray-800">
                          {attendee.image ? (
                            <Image
                              src={attendee.image}
                              alt={attendee.name || `Participante ${index}`}
                              width={20}
                              height={20}
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
                        <div className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 ring-1 ring-gray-800">
                          +{event.attendees.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{event.attendees.length}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setShowEventDetails(event.id)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium"
                  >
                    Detalhes
                  </button>
                  
                  {!isEventPast(event.date) && (
                    <button
                      onClick={() => handleAttendEvent(event.id)}
                      className={`flex-1 px-3 py-1.5 rounded text-sm font-medium ${event.isAttending ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    >
                      {event.isAttending ? 'Participando' : 'Participar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Evento */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Criar Novo Evento</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent}>
              <div className="space-y-4">
                {/* Imagem do evento */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Imagem do evento
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                    {newEvent.imagePreview ? (
                      <div className="space-y-2 text-center">
                        <div className="relative w-full max-w-lg mx-auto">
                          <Image
                            src={newEvent.imagePreview}
                            alt="Preview"
                            width={400}
                            height={225}
                            className="mx-auto rounded-md object-cover aspect-video"
                          />
                          <button
                            type="button"
                            onClick={() => setNewEvent({...newEvent, image: null, imagePreview: ''})}
                            className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors duration-150"
                          >
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-center text-sm text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none">
                            <span className="px-3 py-2 inline-block">Alterar imagem</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="flex text-sm text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none">
                            <span className="px-3 py-2 inline-block">Carregar imagem</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                          </label>
                          <p className="pl-1 pt-2">ou arraste e solte</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF até 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Título */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Título do evento*
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: Convenção Anime Brasil 2023"
                    required
                  />
                </div>
                
                {/* Descrição */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Descrição*
                  </label>
                  <textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Descreva seu evento em detalhes..."
                    required
                  />
                </div>
                
                {/* Data e Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                      Data*
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                      Hora*
                    </label>
                    <input
                      type="time"
                      id="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Tipo de evento */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      id="isVirtual"
                      type="checkbox"
                      checked={newEvent.isVirtual}
                      onChange={(e) => setNewEvent({...newEvent, isVirtual: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                    />
                    <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-300">
                      Este é um evento virtual
                    </label>
                  </div>
                </div>
                
                {/* Localização */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    {newEvent.isVirtual ? 'Plataforma*' : 'Localização*'}
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={newEvent.isVirtual ? 'Ex: Zoom, Discord, YouTube' : 'Ex: Centro de Convenções, São Paulo, SP'}
                    required
                  />
                </div>
                
                {/* Categoria */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Categoria*
                  </label>
                  <select
                    id="category"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="convention">Convenção</option>
                    <option value="watch-party">Watch Party</option>
                    <option value="workshop">Workshop</option>
                    <option value="premiere">Estreia</option>
                    <option value="discussion">Debate</option>
                    <option value="competition">Competição</option>
                    <option value="meetup">Encontro</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando...
                    </>
                  ) : (
                    'Criar Evento'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Evento */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const event = events.find(e => e.id === showEventDetails);
              if (!event) return null;
              
              return (
                <>
                  <div className="relative">
                    <div className="aspect-video relative">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <button
                      onClick={() => setShowEventDetails(null)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-opacity duration-150"
                    >
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-100">
                        {getCategoryLabel(event.category)}
                      </span>
                      
                      {event.isVirtual && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Virtual
                        </span>
                      )}
                      
                      {isEventPast(event.date) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-100">
                          Evento passado
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                    
                    <div className="flex items-center mb-6">
                      <Link href={`/profile/${event.organizer.id}`} className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                          {event.organizer.image ? (
                            <Image
                              src={event.organizer.image}
                              alt={event.organizer.name || 'Organizador'}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-purple-600 flex items-center justify-center text-white text-xs">
                              {event.organizer.name?.charAt(0) || 'O'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{event.organizer.name || event.organizer.username}</p>
                          <p className="text-gray-400 text-xs">Organizador</p>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Detalhes</h3>
                        
                        <div className="space-y-3">
                          <div className="flex">
                            <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-gray-300">Data e Hora</p>
                              <p className="text-gray-400 text-sm">{formatEventDate(event.date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <p className="text-gray-300">Localização</p>
                              <p className="text-gray-400 text-sm">{event.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <div>
                              <p className="text-gray-300">Participantes</p>
                              <p className="text-gray-400 text-sm">{event.attendees.length} confirmados</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Descrição</h3>
                        <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Participantes ({event.attendees.length})</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {event.attendees.slice(0, 12).map((attendee, index) => (
                          <Link key={`${attendee.id}-${index}`} href={`/profile/${attendee.id}`} className="group">
                            <div className="h-10 w-10 rounded-full overflow-hidden group-hover:ring-2 group-hover:ring-purple-500">
                              {attendee.image ? (
                                <Image
                                  src={attendee.image}
                                  alt={attendee.name || `Participante ${index}`}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-600 flex items-center justify-center text-white text-sm">
                                  {attendee.name?.charAt(0) || 'P'}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                        
                        {event.attendees.length > 12 && (
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-300">
                            +{event.attendees.length - 12}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => setShowEventDetails(null)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        Voltar
                      </button>
                      
                      {!isEventPast(event.date) && (
                        <button
                          onClick={() => {
                            handleAttendEvent(event.id);
                            if (!event.isAttending) {
                              // Se o usuário está se inscrevendo, mostrar mensagem
                              setTimeout(() => {
                                setShowEventDetails(null);
                              }, 500);
                            }
                          }}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${event.isAttending ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                        >
                          {event.isAttending ? 'Cancelar Participação' : 'Confirmar Participação'}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}