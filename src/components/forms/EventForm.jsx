import React, { useState } from 'react';
import { Clock, MapPin, Users, AlignLeft, Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createEvent } from '../../api/eventAPI';

// Helper component for form inputs with icons
const FormInputWithIcon = ({ Icon, placeholder, value, onChange, type = 'text', readOnly = false }) => (
    <div className="flex items-center space-x-3 text-gray-500 border-b border-gray-200 py-2">
        <Icon size={20} className="flex-shrink-0" />
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className="w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 border-none p-0"
        />
    </div>
);

// Functional Date/Time Dropdown representation using native inputs for picking functionality
const DateTimeInput = ({ date, type, onChange }) => {
    const formattedDisplay = type === 'date'
        ? format(date, 'E. d MMM.', { locale: fr })
        : format(date, 'HH:mm');
    
    const formattedValue = type === 'date' ? format(date, 'yyyy-MM-dd') : format(date, 'HH:mm');

    const handleNativeChange = (e) => {
        const newValue = e.target.value;
        const newDate = new Date(date.getTime()); // Start with a copy of the existing date/time

        if (type === 'date') {
            // New Date value is 'YYYY-MM-DD'.
            // We use Date.parse() on the string to get a timestamp, but need to be careful with timezone.
            // Using local time zone parts for consistency:
            const [year, month, day] = newValue.split('-').map(Number);
            
            // Apply the new date parts, preserving the original time
            newDate.setFullYear(year, month - 1, day);
            
        } else {
            // New Time value is 'HH:MM'. Update only the time part.
            const [hours, minutes] = newValue.split(':').map(Number);
            newDate.setHours(hours, minutes, 0, 0); // Set new H/M/S/MS

        }
        onChange(newDate); // Notify parent component with the updated Date object
    };

    return (
        <div className="relative flex-1">
            {/* The hidden native input handles the actual picking */}
            <input
                type={type}
                value={formattedValue}
                onChange={handleNativeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* This styled div acts as the visible dropdown trigger */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1.5 cursor-pointer hover:border-blue-500 transition-colors bg-white">
                <span className="text-gray-700 font-medium text-sm w-full text-center">{formattedDisplay}</span>
                <ChevronDown size={16} className="ml-2 text-gray-400 flex-shrink-0" />
            </div>
        </div>
    );
}


/**
 * EventForm component for adding/editing calendar events.
 * Simulates the modal design from the user's image.
 */
const EventForm = ({ initialStart, initialEnd, onSave, onCancel }) => {
    // Initial state based on the current date or provided defaults
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(initialStart || new Date());
    const [end, setEnd] = useState(initialEnd || new Date(new Date().getTime() + 60 * 60 * 1000)); // Default 1 hour later
    const [description, setDescription] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Format dates to ISO strings for the backend
        const eventData = {
            title,
            description,
            start: start.toISOString(),
            end: end.toISOString(),
            allDay,
        };

        try {
            const newEvent = await createEvent(eventData);
            onSave(newEvent); // Call parent handler on success
        } catch (err) {
            console.error("Failed to create event:", err);
            // Assuming error object structure: { message: '...' } or string
            setError(err.message || 'Erreur lors de la création de l\'événement.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <h4 className="text-gray-600 font-semibold mb-2">Titre de l'événement</h4>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Titre de l'événement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 border-b border-gray-300 pb-1"
                    required
                />
            </div>

            {/* Date and Time Pickers */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-gray-500 flex-shrink-0" />
                    <div className="flex items-center space-x-2">
                        {/* Start Date Dropdown */}
                         <DateTimeInput date={start} type="date" onChange={setStart} />
                         <span className="text-gray-500">à</span>
                         {/* End Date Dropdown */}
                         <DateTimeInput date={end} type="date" onChange={setEnd} />
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-gray-500 flex-shrink-0" />
                    <div className="flex items-center space-x-2">
                        {/* Start Time Dropdown */}
                         <DateTimeInput date={start} type="time" onChange={setStart} />
                         <span className="text-gray-500">-</span>
                         {/* End Time Dropdown */}
                         <DateTimeInput date={end} type="time" onChange={setEnd} />
                    </div>
                </div>
            </div>
            
            {/* All Day Toggle */}
            <div className="flex items-center space-x-3 text-gray-500 py-2">
                <Calendar size={20} className="flex-shrink-0" />
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={allDay}
                        onChange={(e) => setAllDay(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300"
                    />
                    <span className="text-gray-700">Toute la journée</span>
                </label>
            </div>


            {/* Description Input */}
            <div className="flex items-start space-x-3 text-gray-500 border-b border-gray-200 py-2 mb-6 mt-4">
                <AlignLeft size={20} className="flex-shrink-0 mt-3" />
                <textarea
                    placeholder="Ajouter une description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 border-none p-0 resize-none"
                />
            </div>

            {/* Footer Buttons */}
            {error && <p className="text-red-500 text-sm mb-4">Erreur: {error}</p>}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 -mx-6 px-6">
                <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>
        </form>
    );
};

export default EventForm;
