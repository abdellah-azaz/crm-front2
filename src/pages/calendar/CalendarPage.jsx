import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import MiniCalendarComponent from 'react-calendar';
import { format, parse, startOfWeek, getDay, isSameDay, addDays, isSameHour, startOfDay, endOfDay, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from '../../components/ui/Modal';
import EventForm from '../../components/forms/EventForm';
import AgendaListView from '../../components/AgendaListView';
import { Plus, ListOrdered, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getAllEvents, createEvent } from '../../api/eventAPI';

const locales = {
  'fr': fr,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date, options) => startOfWeek(date, { ...options, weekStartsOn: 1 }),
  getDay,
  locales,
});

const WeeklyGridView = ({ currentDate, events }) => {
    const weekStart = startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 });
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const HOUR_HEIGHT = 64;
    const TOTAL_HEIGHT = 24 * HOUR_HEIGHT;
    
    const eventsByDay = useMemo(() => {
        const grouped = {};
        weekDates.forEach((date, dayIndex) => {
            grouped[dayIndex] = events.filter(event => 
                isSameDay(event.start, date) || 
                (event.start < endOfDay(date) && event.end > startOfDay(date))
            );
        });
        return grouped;
    }, [events, weekDates]);

    const getEventStyle = (event, dayIndex) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        
        if (event.allDay) {
            return {
                top: '5px',
                height: '30px',
                left: `${(1 + dayIndex) * (100 / 8)}%`,
                width: `${100 / 8}%`,
                backgroundColor: event.color || '#3B82F6',
                opacity: 0.8
            };
        }
        
        const startHour = eventStart.getHours();
        const startMinutes = eventStart.getMinutes();
        const top = (startHour * HOUR_HEIGHT) + (startMinutes * (HOUR_HEIGHT / 60));
        const durationMinutes = differenceInMinutes(eventEnd, eventStart);
        const height = Math.max(durationMinutes * (HOUR_HEIGHT / 60), 30);
        
        return {
            top: `${top + 5}px`,
            height: `fit-content`,
            left: `${(1 + dayIndex) * (100 / 8)}%`,
            width: `${100 / 8}%`,   
            backgroundColor: event.color || '#3B82F6',
            opacity: 1
        };
    };

    return (
        <div className="relative overflow-auto h-full max-h-full" style={{ minHeight: `${24 * HOUR_HEIGHT}px` , height: `${24 * HOUR_HEIGHT}px` }}>
            <div className="sticky top-0 bg-white grid grid-cols-8 border-b border-gray-200 shadow-sm z-10">
                <div className="p-2 border-r border-gray-200 text-center text-sm font-medium text-gray-500"></div>
                {weekDates.map((date, index) => (
                    <div 
                        key={index} 
                        className={`p-2 text-center text-sm font-medium border-r border-gray-200 ${
                            isSameDay(date, new Date()) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                    >
                        <span className="block text-xs text-gray-400">{format(date, 'dd', { locale: fr })}</span>
                        <span className="block font-semibold">{format(date, 'EEE', { locale: fr })}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-8" style={{ minHeight: `${TOTAL_HEIGHT}px` }}>
                <div className="col-span-1 sticky left-0 bg-white border-r border-gray-200 z-10" style={{ minHeight: `${TOTAL_HEIGHT}px` }}>
                    {hours.map((hour, index) => (
                        <div key={index} className="h-16 relative border-b border-gray-100">
                            <span className="absolute top-[-10px] right-1 text-xs text-gray-500">
                                {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="col-span-7 grid grid-cols-7 relative" style={{ 
                    height: `${TOTAL_HEIGHT}px`,
                    minHeight: `${TOTAL_HEIGHT}px`
                }}>
                    {hours.map((hour, hourIndex) => (
                        <React.Fragment key={hourIndex}>
                            {weekDates.map((date, dayIndex) => (
                                <div 
                                    key={`${hourIndex}-${dayIndex}`} 
                                    className={`absolute border-b border-gray-100 ${dayIndex < 6 ? 'border-r border-gray-100' : ''} transition-colors hover:bg-gray-50`}
                                    style={{
                                        top: `${hourIndex * HOUR_HEIGHT}px`,
                                        left: `${(dayIndex) * (100/7)}%`,
                                        width: `${100/7}%`,
                                        height: `${HOUR_HEIGHT}px`
                                    }}
                                    data-date={format(date, 'yyyy-MM-dd')}
                                    data-hour={hour}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                
                <div className="absolute top-0 left-0 w-full" style={{ 
                    height: `${TOTAL_HEIGHT}px`,
                    minHeight: `${TOTAL_HEIGHT}px`
                }}>
                    {weekDates.map((date, dayIndex) => (
                        <React.Fragment key={`events-day-${dayIndex}`}>
                            {eventsByDay[dayIndex]?.map((event, eventIndex) => {
                                const eventStyle = getEventStyle(event, dayIndex);
                                const startTime = format(event.start, 'HH:mm');
                                const endTime = format(event.end, 'HH:mm');
                                const timeDisplay = event.allDay ? 'Toute la journée' : `${startTime} - ${endTime}`;
                                
                                return (
                                    <div
                                        key={event.id || eventIndex}
                                        className="absolute rounded-md p-2 text-xs overflow-hidden shadow-sm border-l-4"
                                        style={{
                                            ...eventStyle,
                                            borderLeftColor: event.color || '#3B82F6',
                                            zIndex: 20,
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <div className="font-semibold text-white truncate">
                                            {event.title}
                                        </div>
                                        <div className="text-white/80 text-[10px] truncate mt-1">
                                            {timeDisplay}
                                        </div>
                                        {event.resource && (
                                            <div className="text-white/60 text-[10px] truncate">
                                                {event.resource}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToCurrent = () => toolbar.onNavigate('TODAY');

    let dateRange = format(toolbar.date, 'd MMMM yyyy', { locale: fr }); 
    if (toolbar.view === 'week') {
      const weekStart = startOfWeek(toolbar.date, { locale: fr, weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      const startDay = format(weekStart, 'd', { locale: fr });
      const endDay = format(weekEnd, 'd', { locale: fr });
      const month = format(weekEnd, 'MMMM', { locale: fr });
      const year = format(weekEnd, 'yyyy', { locale: fr });
      dateRange = `${startDay} – ${endDay} ${month} ${year}`;
    } else if (toolbar.view === 'month') {
        dateRange = format(toolbar.date, 'MMMM yyyy', { locale: fr });
    }

    return (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
                <button className="p-1.5 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors" onClick={goToBack}>
                    <ChevronLeft size={20} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors" onClick={goToNext}>
                    <ChevronRight size={20} />
                </button>
                <button className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors" onClick={goToCurrent}>
                    Aujourd'hui
                </button>
                <span className="text-xl font-semibold text-gray-800 ml-4">{dateRange}</span>
            </div>

            <div className="flex space-x-1 border border-blue-400 rounded-lg p-0.5 bg-white">
                <button className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${toolbar.view === 'month' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`} onClick={() => toolbar.onView('month')}>
                    Mois
                </button>
                <button className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${toolbar.view === 'week' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`} onClick={() => toolbar.onView('week')}>
                    Semaine
                </button>
                <button className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${toolbar.view === 'day' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`} onClick={() => toolbar.onView('day')}>
                    Jour
                </button>
            </div>
        </div>
    );
};

const MiniCalendarComponentWrapper = ({ selectedDate, onDateChange }) => {
    return (
        <MiniCalendarComponent
            onChange={onDateChange}
            value={selectedDate}
            locale="fr"
            className="w-full react-calendar-mini-custom mt-4 border border-gray-200 rounded-lg p-2"
            calendarType="iso8601"
            tileClassName={({ date, view }) => {
                if (view === 'month' && isSameDay(date, new Date())) {
                    return 'bg-blue-500 text-white rounded-full';
                }
                if (view === 'month' && isSameDay(date, selectedDate)) {
                    return 'bg-blue-100 text-blue-700 rounded-full';
                }
            }}
        />
    );
};

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
    const [view, setView] = useState('week');
    const [isAgendaView, setIsAgendaView] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const eventsData = await getAllEvents();
            
            const formattedEvents = eventsData.map((event, index) => {
                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
                const color = colors[index % colors.length];
                
                return {
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    color: color,
                    resource: event.resource || 'Personnel'
                };
            });
            
            setEvents(formattedEvents);
        } catch (err) {
            console.error('Erreur chargement événements:', err);
            setError('Impossible de charger les événements depuis le serveur. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const openEventForm = (selectedStart = null, selectedEnd = null) => {
        const now = new Date();
        const start = selectedStart || now;
        const end = selectedEnd || new Date(start.getTime() + 60 * 60 * 1000);
        
        setFormKey(prev => prev + 1);
        setIsModalOpen(true);
    };

    const handleSelectSlot = ({ start, end }) => {
        openEventForm(start, end);
    };

    const handleQuickAdd = () => {
        const now = new Date();
        const start = new Date(miniCalendarDate);
        start.setHours(now.getHours() + 1, 0, 0, 0);
        openEventForm(start);
    };

    const handleSaveEvent = async (newEventData) => {
        try {
            const savedEvent = await createEvent(newEventData);
            
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
            const color = colors[events.length % colors.length];
            
            const eventWithDates = {
                ...savedEvent,
                start: new Date(savedEvent.start),
                end: new Date(savedEvent.end),
                color: color,
                resource: savedEvent.resource || 'Personnel'
            };
            
            setEvents(prevEvents => [...prevEvents, eventWithDates]);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Erreur création événement:', err);
            alert(err.message || 'Erreur lors de la création de l\'événement');
        }
    };

    const handleSelectEvent = (event) => {
        if (window.confirm(`Voulez-vous modifier l'événement "${event.title}" ?`)) {
            openEventForm(event.start, event.end);
        }
    };

    const dayPropGetter = (date) => {
        if (isSameDay(date, miniCalendarDate)) {
            return {
                className: 'rbc-selected-day bg-blue-50',
                style: {
                    backgroundColor: '#EFF6FF',
                    borderColor: '#3B82F6'
                }
            };
        }
        return {};
    };

    const eventStyleGetter = (event) => {
        const backgroundColor = event.color || '#3B82F6';
        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                padding: '2px 4px'
            }
        };
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des événements...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-600 font-medium mb-2">{error}</p>
                        <button
                            onClick={loadEvents}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="p-6 flex-1 overflow-hidden">
                <div className="flex items-center justify-between pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Calendriers</h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Gérer vos événements et rendez-vous
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!isAgendaView ? 'text-white bg-blue-500 hover:bg-blue-600' : 'text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                            onClick={() => setIsAgendaView(false)}
                        >
                            <CalendarIcon size={16} className="mr-2" />
                            Calendrier
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isAgendaView ? 'text-white bg-blue-500 hover:bg-blue-600' : 'text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                            onClick={() => setIsAgendaView(true)}
                        >
                            <ListOrdered size={16} className="mr-2" />
                            Agenda
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 min-h-0 gap-4">
                    <div className="w-1/4 flex flex-col">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
                            <button
                                className="flex items-center justify-center w-full px-4 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
                                onClick={handleQuickAdd}
                            >
                                <Plus size={20} className="mr-2" />
                                Nouvel événement
                            </button>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex-1">
                            <h3 className="font-semibold text-gray-700 mb-3">Mini calendrier</h3>
                            <MiniCalendarComponentWrapper 
                                selectedDate={miniCalendarDate} 
                                onDateChange={setMiniCalendarDate} 
                            />
                            
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Événements à venir ({events.filter(e => e.start >= new Date()).length})</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {events
                                        .filter(event => event.start >= new Date())
                                        .sort((a, b) => a.start - b.start)
                                        .slice(0, 5)
                                        .map(event => (
                                            <div 
                                                key={event.id} 
                                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleSelectEvent(event)}
                                            >
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-2" 
                                                        style={{ backgroundColor: event.color }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm text-gray-900 truncate">
                                                            {event.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {format(event.start, 'EEEE d MMMM HH:mm', { locale: fr })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {events.filter(e => e.start >= new Date()).length === 0 && (
                                        <p className="text-gray-500 text-sm text-center py-4">
                                            Aucun événement à venir
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative" style={{ minHeight: '1000px' }}>
                        {isAgendaView ? (
                            <AgendaListView events={events} currentDate={miniCalendarDate} />
                        ) : (
                            <>
                                {view === 'week' ? (
                                    <WeeklyGridView currentDate={miniCalendarDate} events={events} />
                                ) : (
                                    <Calendar
                                        localizer={localizer}
                                        events={events}
                                        startAccessor="start"
                                        endAccessor="end"
                                        style={{ height: '100%' }}
                                        popup={true}
                                        view={view}
                                        onView={setView}
                                        culture="fr"
                                        date={miniCalendarDate}
                                        onNavigate={(newDate) => setMiniCalendarDate(newDate)}
                                        selectable={true}
                                        onSelectSlot={handleSelectSlot}
                                        onSelectEvent={handleSelectEvent}
                                        dayPropGetter={dayPropGetter}
                                        eventPropGetter={eventStyleGetter}
                                        components={{
                                            toolbar: CustomToolbar,
                                        }}
                                        messages={{
                                            today: "Aujourd'hui",
                                            previous: "Précédent",
                                            next: "Suivant",
                                            month: "Mois",
                                            week: "Semaine",
                                            day: "Jour",
                                            agenda: "Agenda",
                                            date: "Date",
                                            time: "Heure",
                                            event: "Événement",
                                            noEventsInRange: "Aucun événement dans cette période"
                                        }}
                                    />
                                )}
                                
                                <button
                                    className="absolute bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors z-10"
                                    onClick={handleQuickAdd}
                                >
                                    <Plus size={24} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvel événement"
                size="md"
            >
                <EventForm
                    key={formKey}
                    onSave={handleSaveEvent}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default CalendarPage;