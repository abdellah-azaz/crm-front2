import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Reusable Modal component using React portals.
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {function} onClose - Function to call when the modal should be closed.
 * @param {string} title - The title displayed in the modal header.
 * @param {node} children - The content of the modal body.
 * @param {string} size - The max width of the modal (e.g., 'sm', 'md', 'lg', 'xl'). Defaults to 'md'.
 */
const Modal = ({ isOpen, onClose, title, children, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Close modal on escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render modal content using a portal
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div 
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size] || sizeClasses.sm}`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 leading-6" id="modal-title">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 transition-colors"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer (for action buttons like Save/Cancel) - Not directly visible in image but useful for reusable modal */}
          {/* The EventForm will use its own footer for better control over form submission */}
        </div>
      </div>
    </div>,
    document.body // Ensure the modal is mounted directly to the body
  );
};

export default Modal;
