import React, { useState } from 'react'

const Pipeline = () => {
  const [showForm, setShowForm] = useState(false)
  const [pipelineName, setPipelineName] = useState('')
  const [stages, setStages] = useState(['', '', '', '']) // 4 champs initiaux

  const handleAddStage = () => {
    setStages([...stages, ''])
  }

  const handleStageChange = (index, value) => {
    const newStages = [...stages]
    newStages[index] = value
    setStages(newStages)
  }

  const handleCancel = () => {
    setShowForm(false)
    setPipelineName('')
    setStages(['', '', '', ''])
  }

  const handleSave = () => {
    console.log('Pipeline Name:', pipelineName)
    console.log('Stages:', stages)
    // Ici tu ajouteras la logique pour sauvegarder
    setShowForm(false)
    setPipelineName('')
    setStages(['', '', '', ''])
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
          >
            Create Sales Pipeline
          </button>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No pipeline found for the moment</p>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create Sales Pipeline</h2>
                
                {/* Pipeline Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pipeline Name
                  </label>
                  <input
                    type="text"
                    value={pipelineName}
                    onChange={(e) => setPipelineName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter pipeline name"
                  />
                </div>

                {/* Stages */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stages
                  </label>
                  {stages.map((stage, index) => (
                    <div key={index} className="mb-2 flex items-center space-x-2">
                      <input
                        type="text"
                        value={stage}
                        onChange={(e) => handleStageChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Stage ${index + 1}`}
                      />
                       <button
        onClick={() => {
          const newStages = [...stages]
          newStages.splice(index, 1)
          setStages(newStages)
        }}
        className="text-red-500 hover:text-red-600 p-2"
        type="button"
      >
        ×
      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleAddStage}
                    className="mt-2 text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center"
                  >
                    <span className="mr-1">+</span> Add Stage
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pipeline