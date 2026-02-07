import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import MiniCalendarComponent from 'react-calendar'; // For the sidebar calendar
import { format, parse, startOfWeek, getDay, isSameDay, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from '../../components/ui/Modal';
import EventForm from '../../components/forms/EventForm';
import AgendaListView from '../../components/AgendaListView';
import { Plus, ListOrdered, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CornerDownRight } from 'lucide-react';

const locales = {
  'fr': fr,
}

// Setup localizer for react-big-calendar
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date, options) => startOfWeek(date, { ...options, weekStartsOn: 1 }), // Monday start of week for France
  getDay,
  locales,
});

// Placeholder events
const initialEvents = [
  {
    title: 'Client Meeting',
    start: new Date(2026, 1, 4, 10, 0), // Note: The year/month are arbitrary but match the image's context (Feb 2026)
    end: new Date(2026, 1, 4, 11, 30),
    allDay: false,
    resource: 'Travail'
  },
  {
    title: 'Weekly Review',
    start: new Date(2026, 1, 5, 14, 0),
    end: new Date(2026, 1, 5, 15, 0),
    allDay: false,
    resource: 'Travail'
  }
];

// --- Custom Weekly Grid View Component (to replace the default week view) ---
const WeeklyGridView = ({ currentDate, events }) => {
    // Determine the start of the week for the given date (Monday)
    const weekStart = startOfWeek(currentDate, { locale: fr, weekStartsOn: 1 });
    
    // Generate dates for the 7 days of the week
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    // Generate hours from 00:00 to 23:00
    const hours = Array.from({ length: 24 }, (_, i) => 
        format(new Date().setHours(i, 0, 0, 0), 'HH:mm')
    );

    return (
        <div className="relative overflow-auto h-full max-h-full">
            {/* Weekday Headers */}
            <div className="sticky top-0 bg-white grid grid-cols-8 border-b border-gray-200 shadow-sm z-10">
                {/* Corner Cell for Time */}
                <div className="p-2 border-r border-gray-200 text-center text-sm font-medium text-gray-500"></div>
                
                {/* Day Headers */}
                {weekDates.map((date, index) => (
                    <div 
                        key={index} 
                        className={`p-2 text-center text-sm font-medium border-r border-gray-200 ${
                            isSameDay(date, new Date()) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                    >
                        <span className="block text-xs text-gray-400">{format(date, 'dd', { locale: fr })}</span>
                        <span className="block font-semibold">{format(date, 'EEE', { locale: fr })}.</span>
                    </div>
                ))}
            </div>

            {/* Time Rows and Grid Cells */}
            <div className="grid grid-cols-8">
                {/* Time Column */}
                <div className="col-span-1 sticky left-0 bg-white border-r border-gray-200 z-10">
                    {hours.map((time, index) => (
                        <div key={index} className="h-16 relative border-b border-gray-100">
                            <span className="absolute top-[-10px] right-1 text-xs text-gray-500">{time}</span>
                        </div>
                    ))}
                </div>

                {/* Grid Cells (7 Days) */}
                <div className="col-span-7 grid grid-cols-7">
                    {/* The time cells need to be layered over the 7 day columns, one row per hour */}
                    {hours.map((_, hourIndex) => (
                        <React.Fragment key={hourIndex}>
                            {weekDates.map((date, dayIndex) => (
                                <div 
                                    key={`${hourIndex}-${dayIndex}`} 
                                    className={`h-16 border-b border-gray-100 ${dayIndex < 6 ? 'border-r border-gray-100' : ''} transition-colors hover:bg-gray-50`}
                                >
                                    {/* Event rendering logic would be complex here, using placeholders */}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                
                {/* Placeholder events in cells (very simplified, actual events need complex positioning) */}
                {events.map((event, index) => {
                    const eventDate = event.start;
                    const eventHour = eventDate.getHours();
                    const dayIndex = getDay(eventDate) === 0 ? 6 : getDay(eventDate) - 1; // 0=Sunday -> 6, 1=Monday -> 0
                    
                    if (weekDates.some(date => isSameDay(date, eventDate))) {
                        return (
                            <div
                                key={index}
                                className="absolute bg-green-200 text-green-800 rounded-lg p-1 text-xs overflow-hidden"
                                style={{
                                    left: `${(1 + dayIndex) * (100 / 8)}%`, // 1/8 is time column, then dayIndex
                                    top: `${eventHour * 64}px`, // 64px is h-16 (16*4 = 64)
                                    width: `${100 / 8}%`,
                                    height: `${(event.end.getHours() - event.start.getHours()) * 64}px`,
                                    transform: 'translateY(10px)', // adjust for time label
                                }}
                            >
                                {event.title}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};
// -------------------------------------------------------------------------


// Custom Toolbar to match the image's design (simplified)
const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };
    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    // Determine the view display. react-big-calendar's toolbar.label doesn't perfectly match the image format.
    // We construct a simplified date range string.
    let dateRange = format(toolbar.date, 'd', { locale: fr }); 
    if (toolbar.view === 'week') {
      // Approximate the date range label for the week view (e.g., 4 – 10 févr.)
      const weekStart = startOfWeek(toolbar.date, { locale: fr, weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);

      const startDay = format(weekStart, 'd', { locale: fr });
      const endDay = format(weekEnd, 'd', { locale: fr });
      const month = format(weekEnd, 'MMM.', { locale: fr });
      dateRange = `${startDay} – ${endDay} ${month}`;
    } else {
        dateRange = toolbar.label; // Fallback for month/day view default label
    }


    return (
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
            {/* Left Controls */}
            <div className="flex items-center space-x-2">
                <button className="p-1 rounded-full text-gray-600 border hover:bg-gray-100" onClick={goToBack}><ChevronLeft size={20} /></button>
                <button className="p-1 rounded-full text-gray-600 border hover:bg-gray-100" onClick={goToNext}><ChevronRight size={20} /></button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100" onClick={goToCurrent}>Aujourd'hui</button>
                <span className="text-xl font-semibold text-gray-800 ml-4">{dateRange}</span>
            </div>

            {/* Right Controls - View Toggles */}
            <div className="flex space-x-1 border border-blue-400 rounded-lg p-0.5">
                <button className={`px-3 py-1 text-sm font-medium rounded-lg ${toolbar.view === 'month' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`} onClick={() => toolbar.onView('month')}>Mois</button>
                <button className={`px-3 py-1 text-sm font-medium rounded-lg ${toolbar.view === 'week' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`} onClick={() => toolbar.onView('week')}>Semaine</button>
                <button className={`px-3 py-1 text-sm font-medium rounded-lg ${toolbar.view === 'day' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`} onClick={() => toolbar.onView('day')}>Jour</button>
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
            className="w-full react-calendar-mini-custom mt-4" // Moved margin here, Custom class for styling
            calendarType="iso8601" // Start week on Monday
        />
    );
};


/**
 * CalendarPage component, integrated with react-big-calendar.
 */
const CalendarPage = () => {
    const [events, setEvents] = useState(initialEvents);
    const [miniCalendarDate, setMiniCalendarDate] = useState(new Date()); // State for the mini-calendar
    const [view, setView] = useState('week'); // State for the main calendar view (month, week, day)
    const [isAgendaView, setIsAgendaView] = useState(false); // Toggle between Calendar grid and Agenda list
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialEventTimes, setInitialEventTimes] = useState({ start: null, end: null }); // Used for pre-filling the modal form
    const today = new Date();
    // Set a default date close to the image date (Feb 2026, though the year doesn't matter much)
    const defaultDate = new Date(today.getFullYear(), 1, 4); 

    // Function to handle new event creation on slot selection (Add event functionality)
    const dayPropGetter = (date) => {
        if (isSameDay(date, miniCalendarDate)) {
            return {
                className: 'rbc-selected-day',
            };
        }
        return {};
    };

    // Function to handle new event creation on slot selection (Add event functionality)
    const handleSelectSlot = ({ start, end }) => {
        setInitialEventTimes({ start, end });
        setIsModalOpen(true);
    };

    // Helper to open the modal for quick add from sidebar
    const handleQuickAdd = () => {
        // Use the current miniCalendarDate as the start date for the new event, default time
        const start = new Date(miniCalendarDate);
        start.setHours(new Date().getHours() + 1, 0, 0, 0); // Start 1 hour from now
        const end = new Date(start.getTime() + 60 * 60 * 1000); // End 1 hour after start
        
        setInitialEventTimes({ start, end });
        setIsModalOpen(true);
    };
    
    // Handler for saving the event from the form
    const handleSaveEvent = (newEventData) => {
        setEvents(prevEvents => [
            ...prevEvents,
            newEventData
        ]);
        setIsModalOpen(false);
    };
    
    return (<>
        <div className="p-6 h-full flex flex-col">
            {/* Header section (Title and View Toggles) */}
            <div className="flex items-center justify-between pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Calendriers</h1>
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

            {/* Main Content: Sidebar and Calendar */}
            <div className="flex flex-1 min-h-0">
                {/* Left Sidebar (25% width) - Matches image layout */}
                <div className="w-1/4 p-4 flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg mr-4">
                    <button
                        className="flex items-center justify-center w-full px-4 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                        onClick={handleQuickAdd}
                     >
                        <Plus size={20} className="mr-2" />
                        Ajouter un événement rapide
                    </button>
                    
                     <MiniCalendarComponentWrapper selectedDate={miniCalendarDate} onDateChange={setMiniCalendarDate} />
                    
                </div>

                {/* Right Calendar View (75% width) - Conditional rendering based on view state */}
                <div className="w-3/4 flex-1 p-0 relative bg-white border border-gray-200 rounded-xl shadow-lg">
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
                                    view={view} // Controlled view
                                    onView={setView} // View state updater
                                    culture="fr" // Use French culture
                                    date={miniCalendarDate} // Controlled date from mini-calendar selection
                                    onNavigate={(newDate) => setMiniCalendarDate(newDate)} // Keep mini-calendar in sync with main navigation
                                    // Enables adding new events by clicking on empty slots
                                    selectable={true}
                                    onSelectSlot={handleSelectSlot}
                                    onSelectEvent={(event) => window.alert(event.title)}
                                    dayPropGetter={dayPropGetter} // Apply class to selected day
                                    components={{
                                        toolbar: CustomToolbar, // Use custom toolbar
                                    }}
                                />
                            )}
                            
                            {/* Floating Add Button (FAB) - Bottom Right */}
                            <button
                                className="absolute bottom-5 right-5 w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full text-white shadow-xl hover:bg-blue-600 transition-colors z-10"
                                onClick={handleQuickAdd}
                            >
                                <Plus size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
        
        {/* Event Creation Modal */}
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Nouvel événement"
            size="sm"
        >
            <EventForm
                initialStart={initialEventTimes.start}
                initialEnd={initialEventTimes.end}
                onSave={handleSaveEvent}
                onCancel={() => setIsModalOpen(false)}
            />
        </Modal>
    </>);
};

export default CalendarPage;
