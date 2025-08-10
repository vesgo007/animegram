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
  endDate?: string;
  location: string;
  image: string;
  organizer: User;
  attendees: User[];
  isVirtual: boolean;
  category: string;
  isAttending?: boolean;
}

type CalendarView = 'month' | 'week' | 'day';

export default function EventCalendarPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
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
            description: 'O maior evento de anime do Brasil!',
            date: '2023-12-15T10:00:00Z',
            endDate: '2023-12-15T18:00:00Z',
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
            endDate: '2023-11-20T23:00:00Z',
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
            endDate: '2023-12-05T17:00:00Z',
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
            endDate: '2023-12-20T22:00:00Z',
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
            endDate: '2023-11-25T18:00:00Z',
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
            endDate: '2023-12-10T19:00:00Z',
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
            endDate: '2023-11-18T17:30:00Z',
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
            endDate: '2023-12-02T22:00:00Z',
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
          // Adicionar mais eventos em diferentes dias para o calendário
          {
            id: 'event-9',
            title: 'Clube do Livro: Light Novels',
            description: 'Discussão sobre as últimas light novels traduzidas',
            date: '2023-12-08T19:00:00Z',
            endDate: '2023-12-08T21:00:00Z',
            location: 'Online',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Light+Novel+Club',
            organizer: {
              id: 'user-9',
              name: 'Clube de Leitura Otaku',
              username: 'leitura_otaku',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=CL',
            },
            attendees: Array(28).fill(null).map((_, i) => ({
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
            id: 'event-10',
            title: 'Exposição: Arte de Anime',
            description: 'Exposição de arte inspirada em animes famosos',
            date: '2023-12-12T10:00:00Z',
            endDate: '2023-12-18T18:00:00Z', // Evento de vários dias
            location: 'Museu de Arte Moderna, São Paulo, SP',
            image: 'https://via.placeholder.com/800/3B0764/FFFFFF?text=Anime+Art+Expo',
            organizer: {
              id: 'user-10',
              name: 'Coletivo de Artistas Otaku',
              username: 'arte_otaku',
              image: 'https://via.placeholder.com/150/3B0764/FFFFFF?text=AO',
            },
            attendees: Array(175).fill(null).map((_, i) => ({
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
        setError('Não foi possível carregar os eventos. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Adicionar dias do mês anterior para completar a primeira semana
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      days.push({
        date: new Date(prevMonthYear, prevMonth, day),
        isCurrentMonth: false,
        events: getEventsForDate(new Date(prevMonthYear, prevMonth, day)),
      });
    }

    // Adicionar dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        events: getEventsForDate(new Date(year, month, i)),
      });
    }

    // Adicionar dias do próximo mês para completar a última semana
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias = 42
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextMonthYear, nextMonth, i),
        isCurrentMonth: false,
        events: getEventsForDate(new Date(nextMonthYear, nextMonth, i)),
      });
    }

    return days;
  };

  const getWeekData = () => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    const firstDayOfWeek = new Date(date.setDate(diff));
    const days = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(firstDayOfWeek);
      currentDay.setDate(firstDayOfWeek.getDate() + i);
      days.push({
        date: currentDay,
        events: getEventsForDate(currentDay),
      });
    }

    return days;
  };

  const getDayData = () => {
    return {
      date: currentDate,
      events: getEventsForDate(currentDate),
    };
  };

  const getEventsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
      
      // Verificar se o evento ocorre no dia especificado
      const eventStartDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      const eventEndDay = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
      const checkDate = new Date(year, month, day);
      
      return checkDate >= eventStartDay && checkDate <= eventEndDay;
    });
  };

  const navigateToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatWeekRange = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const firstDay = new Date(date);
    firstDay.setDate(diff);
    const lastDay = new Date(date);
    lastDay.setDate(diff + 6);
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} de ${firstDay.toLocaleDateString('pt-BR', { month: 'long' })} de ${firstDay.getFullYear()}`;
    } else if (firstDay.getFullYear() === lastDay.getFullYear()) {
      return `${firstDay.getDate()} de ${firstDay.toLocaleDateString('pt-BR', { month: 'long' })} - ${lastDay.getDate()} de ${lastDay.toLocaleDateString('pt-BR', { month: 'long' })} de ${firstDay.getFullYear()}`;
    } else {
      return `${firstDay.getDate()} de ${firstDay.toLocaleDateString('pt-BR', { month: 'long' })} de ${firstDay.getFullYear()} - ${lastDay.getDate()} de ${lastDay.toLocaleDateString('pt-BR', { month: 'long' })} de ${lastDay.getFullYear()}`;
    }
  };

  const formatDayDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (view === 'month') {
      setView('day');
      setCurrentDate(date);
    }
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
      'other': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Calendário de Eventos</h1>
        <Link href="/events" className="text-purple-400 hover:text-purple-300 flex items-center">
          <span>Todos os Eventos</span>
          <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Controles do Calendário */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={navigateToPreviousPeriod}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-150"
          >
            <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-xl font-semibold text-white">
            {view === 'month' && formatMonthYear(currentDate)}
            {view === 'week' && formatWeekRange(currentDate)}
            {view === 'day' && formatDayDate(currentDate)}
          </h2>
          
          <button
            onClick={navigateToNextPeriod}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-150"
          >
            <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={navigateToToday}
            className="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors duration-150"
          >
            Hoje
          </button>
        </div>
        
        <div className="flex bg-gray-700 rounded-md p-1">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Mês
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Semana
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Dia
          </button>
        </div>
      </div>

      {/* Visualização do Mês */}
      {view === 'month' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-7 border-b border-gray-700">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={index} className="py-2 text-center text-gray-400 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-fr">
            {getMonthData().map((day, index) => (
              <div 
                key={index} 
                className={`min-h-[100px] border-b border-r border-gray-700 p-1 ${day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900 text-gray-500'}`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span 
                    className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full
                      ${isToday(day.date) ? 'bg-purple-600 text-white' : ''}
                      ${isSelectedDate(day.date) && !isToday(day.date) ? 'bg-purple-900 text-white' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </span>
                  
                  {day.events.length > 0 && (
                    <span className="text-xs text-gray-400">{day.events.length} evento{day.events.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {day.events.slice(0, 3).map((event) => (
                    <Link 
                      key={event.id} 
                      href={`/events/${event.id}`}
                      className={`block text-xs truncate px-1 py-0.5 rounded ${getCategoryColor(event.category)} text-white`}
                    >
                      {formatEventTime(event.date)} {event.title}
                    </Link>
                  ))}
                  
                  {day.events.length > 3 && (
                    <div className="text-xs text-gray-400 px-1">
                      +{day.events.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visualização da Semana */}
      {view === 'week' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-8 border-b border-gray-700">
            <div className="py-2 text-center text-gray-400 font-medium text-sm border-r border-gray-700">
              Horário
            </div>
            {getWeekData().map((day, index) => (
              <div 
                key={index} 
                className={`py-2 text-center font-medium ${isToday(day.date) ? 'text-purple-400' : 'text-gray-300'}`}
              >
                <div>{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day.date.getDay()]}</div>
                <div 
                  className={`text-sm mt-1 h-6 w-6 mx-auto flex items-center justify-center rounded-full
                    ${isToday(day.date) ? 'bg-purple-600 text-white' : ''}
                  `}
                >
                  {day.date.getDate()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative">
            {/* Horas do dia */}
            <div className="grid grid-cols-8 divide-x divide-gray-700">
              <div className="col-span-1">
                {Array.from({ length: 24 }).map((_, hour) => (
                  <div key={hour} className="h-16 border-b border-gray-700 text-xs text-gray-400 pr-2 text-right">
                    {hour}:00
                  </div>
                ))}
              </div>
              
              <div className="col-span-7 grid grid-cols-7 divide-x divide-gray-700">
                {getWeekData().map((day, dayIndex) => (
                  <div key={dayIndex} className="relative">
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} className="h-16 border-b border-gray-700"></div>
                    ))}
                    
                    {/* Eventos do dia */}
                    {day.events.map((event) => {
                      const eventDate = new Date(event.date);
                      const eventHour = eventDate.getHours();
                      const eventMinute = eventDate.getMinutes();
                      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(eventDate.getTime() + 60 * 60 * 1000); // Default 1 hour
                      const eventEndHour = eventEndDate.getHours();
                      const eventEndMinute = eventEndDate.getMinutes();
                      
                      const startPercentage = (eventHour + eventMinute / 60) / 24 * 100;
                      const durationHours = (eventEndHour + eventEndMinute / 60) - (eventHour + eventMinute / 60);
                      const heightPercentage = durationHours / 24 * 100;
                      
                      return (
                        <Link 
                          key={event.id} 
                          href={`/events/${event.id}`}
                          className={`absolute left-0 right-0 mx-1 px-2 py-1 rounded text-white text-xs overflow-hidden ${getCategoryColor(event.category)}`}
                          style={{ 
                            top: `${startPercentage}%`, 
                            height: `${heightPercentage}%`,
                            minHeight: '24px'
                          }}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-80">
                            {formatEventTime(event.date)} - {formatEventTime(event.endDate || new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString())}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visualização do Dia */}
      {view === 'day' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-gray-700">
            {/* Coluna da Esquerda - Horários e Eventos */}
            <div className="lg:col-span-2 divide-y divide-gray-700">
              <div className="p-4 bg-gray-900">
                <h3 className="text-lg font-semibold text-white">
                  Agenda do Dia
                </h3>
              </div>
              
              <div className="relative">
                {/* Horas do dia */}
                <div className="grid grid-cols-12">
                  <div className="col-span-1">
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} className="h-16 border-b border-gray-700 text-xs text-gray-400 pr-2 text-right">
                        {hour}:00
                      </div>
                    ))}
                  </div>
                  
                  <div className="col-span-11 relative">
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div key={hour} className="h-16 border-b border-gray-700"></div>
                    ))}
                    
                    {/* Eventos do dia */}
                    {getDayData().events.map((event) => {
                      const eventDate = new Date(event.date);
                      const eventHour = eventDate.getHours();
                      const eventMinute = eventDate.getMinutes();
                      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(eventDate.getTime() + 60 * 60 * 1000); // Default 1 hour
                      const eventEndHour = eventEndDate.getHours();
                      const eventEndMinute = eventEndDate.getMinutes();
                      
                      const startPercentage = (eventHour + eventMinute / 60) / 24 * 100;
                      const durationHours = (eventEndHour + eventEndMinute / 60) - (eventHour + eventMinute / 60);
                      const heightPercentage = durationHours / 24 * 100;
                      
                      return (
                        <Link 
                          key={event.id} 
                          href={`/events/${event.id}`}
                          className={`absolute left-0 right-0 mx-2 px-3 py-2 rounded text-white overflow-hidden ${getCategoryColor(event.category)}`}
                          style={{ 
                            top: `${startPercentage}%`, 
                            height: `${heightPercentage}%`,
                            minHeight: '32px'
                          }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm opacity-80">
                            {formatEventTime(event.date)} - {formatEventTime(event.endDate || new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString())}
                          </div>
                          {event.isVirtual && (
                            <div className="text-xs mt-1 flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Virtual
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coluna da Direita - Lista de Eventos */}
            <div className="lg:col-span-1 divide-y divide-gray-700">
              <div className="p-4 bg-gray-900">
                <h3 className="text-lg font-semibold text-white">
                  Eventos do Dia
                </h3>
              </div>
              
              <div className="p-4">
                {getDayData().events.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="h-12 w-12 text-gray-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400">Nenhum evento agendado para este dia.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getDayData().events.map((event) => (
                      <Link 
                        key={event.id} 
                        href={`/events/${event.id}`}
                        className="block bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors duration-150"
                      >
                        <div className="aspect-[16/9] relative">
                          <Image
                            src={event.image}
                            alt={event.title}
                            width={300}
                            height={169}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex space-x-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getCategoryColor(event.category)}`}>
                              {event.category}
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
                        </div>
                        
                        <div className="p-3">
                          <h4 className="text-white font-medium mb-1">{event.title}</h4>
                          <div className="flex items-center text-gray-400 text-sm mb-1">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {formatEventTime(event.date)} - {formatEventTime(event.endDate || new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString())}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-400 text-sm">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}