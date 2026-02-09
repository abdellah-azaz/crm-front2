import React, { useState } from 'react';
import { Clock, Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createEvent } from '../../api/eventAPI';

// Composant pour les inputs de date/heure
const DateTimeInput = ({ date, type, onChange, allDay = false, label }) => {
    const formattedValue = type === 'date' 
        ? format(date, 'yyyy-MM-dd') 
        : format(date, 'HH:mm');
    
    const formattedDisplay = type === 'date'
        ? format(date, 'E. d MMM.', { locale: fr })
        : format(date, 'HH:mm');

    const handleChange = (e) => {
        const newValue = e.target.value;
        const newDate = new Date(date);
        
        if (type === 'date') {
            const [year, month, day] = newValue.split('-').map(Number);
            newDate.setFullYear(year, month - 1, day);
        } else {
            const [hours, minutes] = newValue.split(':').map(Number);
            newDate.setHours(hours, minutes, 0, 0);
        }
        
        onChange(newDate);
    };

    return (
        <div className="relative flex-1">
            <div className="relative">
                <input
                    type={type}
                    value={formattedValue}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-1.5 text-center text-gray-700 font-medium text-sm appearance-none ${
                        (!allDay || type === 'date') ? 'cursor-pointer hover:border-blue-500' : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={allDay && type === 'time'}
                    aria-label={label}
                />
                {(!allDay || type === 'date') && (
                    <ChevronDown 
                        size={16} 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                    />
                )}
            </div>
        </div>
    );
};

/**
 * EventForm component avec contrôle indépendant des dates
 */
const EventForm = ({ onSave, onCancel }) => {
    // Initialiser avec des valeurs par défaut indépendantes
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(now);
    const [end, setEnd] = useState(oneHourLater);
    const [description, setDescription] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Gestion des changements de date
    const handleStartDateChange = (newDate) => {
        const updatedStart = new Date(newDate);
        // Garder l'heure actuelle
        updatedStart.setHours(start.getHours(), start.getMinutes());
        setStart(updatedStart);
    };

    const handleEndDateChange = (newDate) => {
        const updatedEnd = new Date(newDate);
        // Garder l'heure actuelle
        updatedEnd.setHours(end.getHours(), end.getMinutes());
        setEnd(updatedEnd);
    };

    const handleStartTimeChange = (newTime) => {
        const updatedStart = new Date(start);
        updatedStart.setHours(newTime.getHours(), newTime.getMinutes());
        setStart(updatedStart);
    };

    const handleEndTimeChange = (newTime) => {
        const updatedEnd = new Date(end);
        updatedEnd.setHours(newTime.getHours(), newTime.getMinutes());
        setEnd(updatedEnd);
    };

    const handleAllDayChange = (e) => {
        const isAllDay = e.target.checked;
        setAllDay(isAllDay);
        
        if (isAllDay) {
            // Pour toute la journée, mettre les heures à minuit
            const startOfDay = new Date(start);
            startOfDay.setHours(0, 0, 0, 0);
            setStart(startOfDay);
            
            const endOfDay = new Date(end);
            endOfDay.setHours(23, 59, 59, 999);
            setEnd(endOfDay);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validation
        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        
        if (start >= end && !allDay) {
            setError('La date de fin doit être après la date de début');
            return;
        }

        setIsLoading(true);

        // Formater les dates pour l'API
        const eventData = {
            title: title.trim(),
            description: description.trim(),
            start: start.toISOString(),
            end: end.toISOString(),
            allDay: allDay,
        };

        try {
            const newEvent = await createEvent(eventData);
            onSave(newEvent);
        } catch (err) {
            console.error("Failed to create event:", err);
            setError(err.message || err.response?.data?.message || 'Erreur lors de la création de l\'événement.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {/* Title Input */}
            <div className="mb-4">
                <label className="block text-gray-600 font-semibold mb-2">
                    Titre de l'événement *
                </label>
                <input
                    type="text"
                    placeholder="Titre de l'événement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-lg font-medium text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Dates et heures */}
            <div className="space-y-4 mb-4">
                {/* Dates */}
                <div className="space-y-2">
                    <label className="block text-gray-600 font-medium">Dates</label>
                    <div className="flex items-center space-x-3">
                        <Calendar size={20} className="text-gray-500 flex-shrink-0" />
                        <div className="flex items-center space-x-2 flex-1">
                            <DateTimeInput 
                                date={start} 
                                type="date" 
                                onChange={handleStartDateChange}
                                allDay={allDay}
                                label="Date de début"
                            />
                            <span className="text-gray-500 mx-1">à</span>
                            <DateTimeInput 
                                date={end} 
                                type="date" 
                                onChange={handleEndDateChange}
                                allDay={allDay}
                                label="Date de fin"
                            />
                        </div>
                    </div>
                </div>

                {/* Heures (uniquement si pas toute la journée) */}
                {!allDay && (
                    <div className="space-y-2">
                        <label className="block text-gray-600 font-medium">Heures</label>
                        <div className="flex items-center space-x-3">
                            <Clock size={20} className="text-gray-500 flex-shrink-0" />
                            <div className="flex items-center space-x-2 flex-1">
                                <DateTimeInput 
                                    date={start} 
                                    type="time" 
                                    onChange={handleStartTimeChange}
                                    label="Heure de début"
                                />
                                <span className="text-gray-500 mx-1">-</span>
                                <DateTimeInput 
                                    date={end} 
                                    type="time" 
                                    onChange={handleEndTimeChange}
                                    label="Heure de fin"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Toute la journée */}
            <div className="flex items-center space-x-3 text-gray-500 py-2 mb-4">
                <Calendar size={20} className="flex-shrink-0" />
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allDay}
                        onChange={handleAllDayChange}
                        className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300"
                    />
                    <span className="text-gray-700">Toute la journée</span>
                </label>
            </div>

            {/* Description */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">
                    Description
                </label>
                <textarea
                    placeholder="Ajouter une description (optionnel)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full text-gray-700 placeholder-gray-400 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Affichage des dates pour debug */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p><strong>Début:</strong> {format(start, 'EEEE d MMMM yyyy HH:mm', { locale: fr })}</p>
                <p><strong>Fin:</strong> {format(end, 'EEEE d MMMM yyyy HH:mm', { locale: fr })}</p>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                    disabled={isLoading || !title.trim()}
                >
                    {isLoading ? 'Création...' : 'Créer l\'événement'}
                </button>
            </div>
        </form>
    );
};

export default EventForm;