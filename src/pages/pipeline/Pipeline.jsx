import React, { useState, useEffect } from 'react'
import { leadAPI } from '../../api/leadAPI'
import pipelineAPI from '../../api/pipelineAPI'

const Pipeline = () => {
  const [showForm, setShowForm] = useState(false)
  const [pipelineName, setPipelineName] = useState('')
  const [stages, setStages] = useState([{ name: '', selectedLeads: [] }]) // 1 champ initial avec leads sélectionnés
  const [allLeads, setAllLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [showLeadSelector, setShowLeadSelector] = useState(null) // index du stage pour lequel on montre le sélecteur

  // Charger les leads au montage du composant
  useEffect(() => {
    if (showForm) {
      fetchLeads()
    }
  }, [showForm])

  const fetchLeads = async () => {
    setLoadingLeads(true)
    try {
      const leads = await leadAPI.getAllLeads()
      setAllLeads(leads)
    } catch (error) {
      console.error('Erreur lors du chargement des leads:', error)
    } finally {
      setLoadingLeads(false)
    }
  }

  const handleAddStage = () => {
    setStages([...stages, { name: '', selectedLeads: [] }])
  }

  const handleStageNameChange = (index, value) => {
    const newStages = [...stages]
    newStages[index].name = value
    setStages(newStages)
  }

  const handleSelectLeads = (stageIndex, leadIds) => {
    const newStages = [...stages]
    newStages[stageIndex].selectedLeads = leadIds
    setStages(newStages)
  }

  const handleCancel = () => {
    setShowForm(false)
    setPipelineName('')
    setStages([{ name: '', selectedLeads: [] }])
    setShowLeadSelector(null)
  }

  const handleSave = async () => {
    try {
      // Préparer les données pour l'API
      const stageNames = stages.map(stage => stage.name)
      const leadIds = stages.flatMap(stage => stage.selectedLeads)

      // Vérifier que tous les champs sont remplis
      if (!pipelineName.trim()) {
        alert('Veuillez entrer un nom de pipeline')
        return
      }

      if (stageNames.some(name => !name.trim())) {
        alert('Veuillez remplir tous les noms de stages')
        return
      }

      if (leadIds.length === 0) {
        alert('Veuillez sélectionner au moins un lead')
        return
      }

      // Créer l'objet DTO
      const pipelineData = {
        name: pipelineName,
        stageNames: stageNames,
        leadIds: leadIds
      }

      console.log('Données envoyées:', pipelineData)

      // Appeler l'API
      const newPipeline = await pipelineAPI.createPipeline(pipelineData)
      console.log('Pipeline créé:', newPipeline)

      // Réinitialiser et fermer
      handleCancel()
      
      // TODO: Actualiser la liste des pipelines ou afficher un message de succès
      alert('Pipeline créé avec succès!')

    } catch (error) {
      console.error('Erreur lors de la création du pipeline:', error)
      alert(error.response?.data?.message || 'Erreur lors de la création du pipeline')
    }
  }

  const toggleLeadSelector = (index) => {
    setShowLeadSelector(showLeadSelector === index ? null : index)
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create Sales Pipeline</h2>
                
                {/* Pipeline Name */}
                <div className="mb-6">
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
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Stage {index + 1}</span>
                        {stages.length > 1 && (
                          <button
                            onClick={() => {
                              const newStages = [...stages]
                              newStages.splice(index, 1)
                              setStages(newStages)
                            }}
                            className="text-red-500 hover:text-red-600 text-lg"
                            type="button"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      
                      {/* Nom du stage */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={stage.name}
                          onChange={(e) => handleStageNameChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Stage name ${index + 1}`}
                        />
                      </div>

                      {/* Bouton pour sélectionner les leads */}
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={() => toggleLeadSelector(index)}
                          className="flex items-center justify-center w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition duration-150"
                        >
                          <span className="mr-2">+</span>
                          {stage.selectedLeads.length > 0 
                            ? `${stage.selectedLeads.length} lead(s) sélectionné(s)` 
                            : 'Sélectionner des leads'
                          }
                        </button>
                      </div>

                      {/* Liste des leads sélectionnés */}
                      {stage.selectedLeads.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Leads sélectionnés:</p>
                          <div className="flex flex-wrap gap-2">
                            {stage.selectedLeads.map((leadId, leadIndex) => {
                              const lead = allLeads.find(l => l._id === leadId)
                              return lead ? (
                                <span 
                                  key={leadIndex} 
                                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {lead.name || lead.email}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSelectedLeads = [...stage.selectedLeads]
                                      newSelectedLeads.splice(leadIndex, 1)
                                      handleSelectLeads(index, newSelectedLeads)
                                    }}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sélecteur de leads (modal) */}
                      {showLeadSelector === index && (
                        <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <p className="font-medium text-gray-700">Sélectionner des leads</p>
                            <button
                              onClick={() => setShowLeadSelector(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                          
                          {loadingLeads ? (
                            <p className="text-center text-gray-500">Chargement des leads...</p>
                          ) : (
                            <div className="max-h-40 overflow-y-auto">
                              {allLeads.length === 0 ? (
                                <p className="text-center text-gray-500">Aucun lead disponible</p>
                              ) : (
                                allLeads.map((lead) => (
                                  <div key={lead._id} className="flex items-center mb-2">
                                    <input
                                      type="checkbox"
                                      id={`lead-${index}-${lead._id}`}
                                      checked={stage.selectedLeads.includes(lead._id)}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked
                                        let newSelectedLeads = [...stage.selectedLeads]
                                        
                                        if (isChecked) {
                                          newSelectedLeads.push(lead._id)
                                        } else {
                                          newSelectedLeads = newSelectedLeads.filter(id => id !== lead._id)
                                        }
                                        
                                        handleSelectLeads(index, newSelectedLeads)
                                      }}
                                      className="mr-2 h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label 
                                      htmlFor={`lead-${index}-${lead._id}`}
                                      className="text-sm text-gray-700 cursor-pointer"
                                    >
                                      {lead.name || lead.email}
                                    </label>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => setShowLeadSelector(null)}
                              className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                            >
                              Valider la sélection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Bouton pour ajouter un stage */}
                  <button
                    onClick={handleAddStage}
                    className="mt-2 w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition duration-150 flex items-center justify-center"
                  >
                    <span className="mr-2">+</span> Add Stage
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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