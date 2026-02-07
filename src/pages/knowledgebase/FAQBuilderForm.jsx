import React from 'react';
import { Layers } from 'lucide-react';

const FAQBuilderForm = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            {/* Question Field */}
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                    id="question"
                    type="text"
                    placeholder="What question are customers asking?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Answer Field */}
            <div className="mb-4">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                    id="answer"
                    placeholder="Provide a clear, helpful answer..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
            </div>

            {/* Category Select */}
            <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    id="category"
                    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="Support"
                >
                    <option value="Support">Support</option>
                    {/* Add other options as needed */}
                </select>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md"
            >
                <Layers className="w-5 h-5 mr-2" />
                Add FAQ
            </button>
        </div>
    );
};

export default FAQBuilderForm;