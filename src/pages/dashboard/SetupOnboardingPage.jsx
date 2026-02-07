import React from 'react';
import { Rocket } from 'lucide-react';

const SetupOnboardingPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-4xl text-center bg-white p-8 rounded-lg">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center space-x-3 mb-6">
            {/* Rocket Icon (using blue color) */}
            <div className="p-3 bg-blue-500 rounded-lg">
                <Rocket size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Subaccount Onboarding
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Follow these steps to set up your subaccount and start capturing leads
            effectively.
          </p>
        </div>

        {/* Progress Section */}
        <div className="flex justify-center mt-8 mb-16 space-x-8 text-center">
          
          {/* Overall Progress (63%) */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              {/* Placeholder for circular progress bar (63% green circle) */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="6"
                  strokeDasharray={`${(63 / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
              </svg>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 font-semibold">
                63%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Overall Progress</p>
          </div>

          {/* Completed (5) */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-500 rounded-xl shadow-md mb-2">
              <span className="text-2xl font-bold">5</span>
            </div>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          {/* Remaining (3) */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-xl shadow-md mb-2">
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-sm text-gray-500">Remaining</p>
          </div>

          {/* Total Steps (8) */}
          <div className="flex flex-col items-center pt-2">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-xl shadow-md mb-2">
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-sm text-gray-500">Total Steps</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 space-x-6 text-center">
            <button 
                className="text-gray-600 hover:text-blue-600 font-medium transition duration-150"
                onClick={() => console.log('Action: Continue Setup')}
            >
                Continue Setup
            </button>
            <button 
                className="text-gray-600 hover:text-blue-600 font-medium transition duration-150"
                onClick={() => console.log('Action: Skip to Dashboard')}
            >
                Skip to Dashboard
            </button>
        </div>
        
        {/* Steps/Buttons Section (Simulating 70% width and centering) */}
        <div className="mt-12 max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-left mb-4">Onboarding Steps</h2>
          {[
            'Connect Business Email',
            'Track Opportunities',
            'Design Landing Page',
            'Build Knowledge Base & Chatbot',
            'Create Forms & Scoring Rules',
            'Connect Calendar',
            'Engage via Conversations',
            'Set Up Meta (Facebook and Whatsapp)',
          ].map((step, index) => (
            <button
              key={index}
              className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 flex justify-between items-center"
              onClick={() => console.log(`Step Clicked: ${step}`)}
            >
              <span className="font-medium text-gray-700">{step}</span>
              {/* Placeholder for status icon */}
              <span className="text-blue-500 font-semibold">Start →</span>
            </button>
          ))}
        </div>

        {/* Need Help? Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-500 max-w-xl mx-auto mb-6">
                If you get stuck or need assistance with any of the steps, our detailed documentation and support team are ready to help you succeed.
            </p>
            <div className="space-x-4">
                <button
                    className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-150"
                    onClick={() => console.log('Action: Documentation')}
                >
                    Documentation
                </button>
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-150"
                    onClick={() => console.log('Action: Contact Support')}
                >
                    Contact Support
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SetupOnboardingPage;