import React from 'react';
import { Plus } from 'lucide-react'; // For the Add Tag button

const ManualEntryForm = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            {/* Title Field */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter a descriptive title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Category Select */}
            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    id="category"
                    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    defaultValue=""
                >
                    <option value="" disabled>Select a category</option>
                    <option value="General">General</option>
                    <option value="Technical">Technical</option>
                    <option value="Support">Support</option>
                </select>
            </div>

            {/* Content Field */}
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                    id="content"
                    placeholder="Enter detailed content..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>

            {/* Tags Field */}
            <div className="mb-6">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex items-center space-x-2">
                    <input
                        id="tags"
                        type="text"
                        placeholder="Add a tag"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-150"
                        title="Add Tag"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md"
            >
                <Plus className="w-5 h-5 mr-2" />
                Add to Knowledge Base
            </button>
        </div>
    );
};

export default ManualEntryForm;