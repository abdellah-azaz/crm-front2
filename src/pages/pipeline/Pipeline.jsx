import React, { useState, useEffect } from 'react'
import { leadAPI } from '../../api/leadAPI'
import pipelineAPI from '../../api/pipelineAPI'

const Pipeline = () => {
  const [showForm, setShowForm] = useState(false)
  const [pipelineName, setPipelineName] = useState('')
  const [stages, setStages] = useState([{ name: '', selectedLeads: [] }])
  const [allLeads, setAllLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [showLeadSelector, setShowLeadSelector] = useState(null)
  const [pipelines, setPipelines] = useState([])
  const [loadingPipelines, setLoadingPipelines] = useState(true)

  // Charger les pipelines et les leads
  useEffect(() => {
    fetchPipelines()
  }, [])

  const fetchPipelines = async () => {
    setLoadingPipelines(true)
    try {
      const data = await pipelineAPI.getAllPipelines()
      setPipelines(data)
    } catch (error) {
      console.error('Erreur lors du chargement des pipelines:', error)
    } finally {
      setLoadingPipelines(false)
    }
  }

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

  const handleSelectLeads = (stageIndex, leads) => {
    const newStages = [...stages]
    newStages[stageIndex].selectedLeads = leads
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
      if (!pipelineName.trim()) {
        alert('Veuillez entrer un nom de pipeline')
        return
      }

      if (stages.some(stage => !stage.name.trim())) {
        alert('Veuillez remplir tous les noms de stages')
        return
      }

      const totalLeads = stages.flatMap(stage => stage.selectedLeads)
      if (totalLeads.length === 0) {
        alert('Veuillez sélectionner au moins un lead')
        return
      }

      // MODIFICATION ICI : Envoyer les objets lead complets
      const formattedStages = stages.map(stage => ({
        name: stage.name,
        leads: stage.selectedLeads // Envoyer les objets lead complets, pas juste les IDs
      }))

      const pipelineData = {
        name: pipelineName,
        stages: formattedStages
      }

      console.log('📤 Données envoyées:', pipelineData)
      console.log('Exemple de lead envoyé:', formattedStages[0]?.leads[0])

      const newPipeline = await pipelineAPI.createPipeline(pipelineData)
      console.log('Pipeline créé:', newPipeline)

      handleCancel()
      fetchPipelines() // Rafraîchir la liste
      alert('Pipeline créé avec succès!')

    } catch (error) {
      console.error('Erreur lors de la création du pipeline:', error)
      alert('Erreur lors de la création du pipeline')
    }
  }

  const toggleLeadSelector = (index) => {
    if (showForm) {
      fetchLeads()
    }
    setShowLeadSelector(showLeadSelector === index ? null : index)
  }

  const isLeadSelected = (stageIndex, lead) => {
    return stages[stageIndex].selectedLeads.some(
      selectedLead => selectedLead._id === lead._id
    )
  }

  const toggleLeadForStage = (stageIndex, lead) => {
    const currentStage = stages[stageIndex]
    const isSelected = isLeadSelected(stageIndex, lead)
    
    let newSelectedLeads
    if (isSelected) {
      newSelectedLeads = currentStage.selectedLeads.filter(
        selectedLead => selectedLead._id !== lead._id
      )
    } else {
      // MODIFICATION ICI : Stocker l'objet lead complet
      newSelectedLeads = [...currentStage.selectedLeads, lead]
    }
    
    handleSelectLeads(stageIndex, newSelectedLeads)
  }

  const removeLeadFromStage = (stageIndex, leadId) => {
    const currentStage = stages[stageIndex]
    const newSelectedLeads = currentStage.selectedLeads.filter(
      lead => lead._id !== leadId
    )
    handleSelectLeads(stageIndex, newSelectedLeads)
  }

  const handleAddNewStageColumn = () => {
    // Logique pour ajouter une nouvelle colonne/stage à un pipeline existant
    console.log('Ajouter une nouvelle colonne')
  }

  // Fonction pour formater les pipelines en tableau Kanban
  const renderPipelineKanban = (pipeline) => {
    if (!pipeline || !pipeline.stages || pipeline.stages.length === 0) {
      return <div className="text-gray-500 p-4">Aucun stage dans ce pipeline</div>
    }

    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {pipeline.stages.map((stage, stageIndex) => (
            <div 
              key={stageIndex} 
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* En-tête du stage */}
              <div className="p-4 border-b border-gray-200 bg-gray-100 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {stage.name || `Stage ${stageIndex + 1}`}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stage.leads?.length || 0} leads
                  </span>
                </div>
              </div>
              
              {/* Liste des leads */}
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {stage.leads && stage.leads.length > 0 ? (
                  stage.leads.map((lead, leadIndex) => (
                    <div 
                      key={lead._id} 
                      className="bg-white mb-2 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-150"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {lead.name || 'Sans nom'}
                          </h4>
                          {lead.email && (
                            <p className="text-xs text-gray-600 mt-1">{lead.email}</p>
                          )}
                          {lead.phone && (
                            <p className="text-xs text-gray-500 mt-1">{lead.phone}</p>
                          )}
                          {lead.company && (
                            <p className="text-xs text-gray-500 mt-1">{lead.company}</p>
                          )}
                          {lead.info && Object.keys(lead.info).length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-xs font-medium text-gray-500 mb-1">Infos:</p>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(lead.info).map(([key, value]) => (
                                  <span 
                                    key={key} 
                                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                  >
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Aucun lead dans ce stage</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Bouton pour ajouter une colonne */}
          <div className="flex-shrink-0 w-80">
            <button
              onClick={handleAddNewStageColumn}
              className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition duration-150 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">+</span>
              <span className="text-sm font-medium">Ajouter un stage</span>
            </button>
          </div>
        </div>
      </div>
    )
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
        
        {/* Liste des pipelines existants */}
        {loadingPipelines ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des pipelines...</p>
          </div>
        ) : pipelines.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No pipeline found for the moment</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pipelines.map((pipeline) => (
              <div key={pipeline._id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{pipeline.name}</h2>
                    <p className="text-gray-500 text-sm">
                      Créé le {new Date(pipeline.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      Éditer
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                      Supprimer
                    </button>
                  </div>
                </div>
                
                {/* Tableau Kanban du pipeline */}
                {renderPipelineKanban(pipeline)}
              </div>
            ))}
          </div>
        )}

        {/* Modal Form pour créer un nouveau pipeline */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create Sales Pipeline</h2>
                
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
                      
                      <div className="mb-3">
                        <input
                          type="text"
                          value={stage.name}
                          onChange={(e) => handleStageNameChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Stage name ${index + 1}`}
                        />
                      </div>

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

                      {stage.selectedLeads.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Leads sélectionnés:</p>
                          <div className="flex flex-wrap gap-2">
                            {stage.selectedLeads.map((lead, leadIndex) => (
                              <span 
                                key={lead._id} 
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {lead.name || lead.email}
                                <button
                                  type="button"
                                  onClick={() => removeLeadFromStage(index, lead._id)}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

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
                                      checked={isLeadSelected(index, lead)}
                                      onChange={() => toggleLeadForStage(index, lead)}
                                      className="mr-2 h-4 w-4 text-blue-600 rounded"
                                    />
                                    <label 
                                      htmlFor={`lead-${index}-${lead._id}`}
                                      className="text-sm text-gray-700 cursor-pointer"
                                    >
                                      {lead.name || lead.email}
                                      {lead.company && (
                                        <span className="text-gray-500 text-xs ml-2">
                                          ({lead.company})
                                        </span>
                                      )}
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
                  
                  <button
                    onClick={handleAddStage}
                    className="mt-2 w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition duration-150 flex items-center justify-center"
                  >
                    <span className="mr-2">+</span> Add Stage
                  </button>
                </div>

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