import React, { useMemo } from 'react';
import { format, compareAsc, isPast, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin } from 'lucide-react';

/**
 * Renders a list view of events, sorted by nearest date first.
 * @param {array} events - The list of calendar events.
 * @param {Date} currentDate - The current date selected in the mini-calendar/main view.
 */
const AgendaListView = ({ events, currentDate }) => {
    // Filter and sort events: only show events on or after the current date, sorted by start time.
    const sortedUpcomingEvents = useMemo(() => {
        const filteredEvents = events.filter(event => 
            !isPast(event.end) || isSameDay(event.start, currentDate)
        );

        return filteredEvents.sort((a, b) => compareAsc(a.start, b.start));
    }, [events, currentDate]);

    if (sortedUpcomingEvents.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                Aucun événement à venir.
            </div>
        );
    }

    // Helper to group events by day for easier display
    const groupedEvents = sortedUpcomingEvents.reduce((acc, event) => {
        const dateKey = format(event.start, 'EEEE d MMMM yyyy', { locale: fr });
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {});

    const renderEvent = (event) => {
        const startTime = format(event.start, 'HH:mm');
        const endTime = format(event.end, 'HH:mm');
        const eventColor = event.color || '#60a5fa'; // Default color

        return (
            <div key={event.title + event.start.getTime()} className="flex items-start p-4 mb-3 border-l-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow" style={{ borderColor: eventColor }}>
                {/* Time Indicator */}
                <div className="flex flex-col items-center justify-center mr-4 pt-1">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-700 mt-1">{startTime}</span>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                        {startTime} - {endTime}
                    </p>
                    {event.location && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin size={12} className="mr-1" />
                            {event.location}
                        </div>
                    )}
                    {event.description && (
                        <p className="text-sm text-gray-700 mt-2 italic border-l pl-2">{event.description.substring(0, 100)}...</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 space-y-6 overflow-y-auto h-full">
            {Object.keys(groupedEvents).map(dateKey => (
                <div key={dateKey}>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1">
                        {dateKey.charAt(0).toUpperCase() + dateKey.slice(1)}
                    </h2>
                    <div className="space-y-3">
                        {groupedEvents[dateKey].map(renderEvent)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgendaListView;
