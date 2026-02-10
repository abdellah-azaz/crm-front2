import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  const [deletingPipelineId, setDeletingPipelineId] = useState(null)
  const [deletingStages, setDeletingStages] = useState({})
  const [addingStageToPipeline, setAddingStageToPipeline] = useState(null)
  const [newStageName, setNewStageName] = useState('')
  const [showAddLeadModal, setShowAddLeadModal] = useState({ pipeline: null, stage: null })
  const [availableLeads, setAvailableLeads] = useState([])
  const [searchLeadTerm, setSearchLeadTerm] = useState('')
  const [addingLead, setAddingLead] = useState(false)
  const [draggedLead, setDraggedLead] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [movingLead, setMovingLead] = useState(false)

  // Charger les pipelines
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

  const fetchAllLeads = async () => {
    setLoadingLeads(true)
    try {
      const leads = await leadAPI.getAllLeads()
      setAllLeads(leads)
      setAvailableLeads(leads)
    } catch (error) {
      console.error('Erreur lors du chargement des leads:', error)
    } finally {
      setLoadingLeads(false)
    }
  }

  const fetchLeads = async () => {
    if (showForm) {
      fetchAllLeads()
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

      const formattedStages = stages.map(stage => ({
        name: stage.name,
        leads: stage.selectedLeads
      }))

      const pipelineData = {
        name: pipelineName,
        stages: formattedStages
      }

      await pipelineAPI.createPipeline(pipelineData)
      
      handleCancel()
      fetchPipelines()
      alert('Pipeline créé avec succès!')

    } catch (error) {
      console.error('Erreur lors de la création du pipeline:', error)
      alert('Erreur lors de la création du pipeline')
    }
  }

  const handleDeletePipeline = async (pipelineId, pipelineName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le pipeline "${pipelineName}" ?`)) {
      return
    }

    try {
      setDeletingPipelineId(pipelineId)
      const result = await pipelineAPI.deletePipeline(pipelineId)
      
      if (result.deletedCount > 0) {
        alert(`Pipeline "${result.pipelineName}" supprimé avec succès!`)
        fetchPipelines()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du pipeline:', error)
      alert('Erreur lors de la suppression du pipeline')
    } finally {
      setDeletingPipelineId(null)
    }
  }

  const handleDeleteStage = async (pipelineName, stageName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le stage "${stageName}" du pipeline "${pipelineName}" ?`)) {
      return
    }

    try {
      const stageKey = `${pipelineName}-${stageName}`
      setDeletingStages(prev => ({ ...prev, [stageKey]: true }))
      
      await pipelineAPI.deleteStage(pipelineName, stageName)
      
      alert(`Stage "${stageName}" supprimé avec succès du pipeline "${pipelineName}"!`)
      fetchPipelines()
      
    } catch (error) {
      console.error('Erreur lors de la suppression du stage:', error)
      alert('Erreur lors de la suppression du stage')
    } finally {
      const stageKey = `${pipelineName}-${stageName}`
      setDeletingStages(prev => ({ ...prev, [stageKey]: false }))
    }
  }

  const handleAddStageToPipeline = async (pipelineName) => {
    if (!newStageName.trim()) {
      alert('Veuillez entrer un nom pour le nouveau stage')
      return
    }
  
    try {
      setAddingStageToPipeline(pipelineName)
      await pipelineAPI.addStage(pipelineName, newStageName)
      
      alert(`Stage "${newStageName}" ajouté avec succès au pipeline "${pipelineName}"!`)
      setNewStageName('')
      fetchPipelines()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du stage:', error)
      alert('Erreur lors de l\'ajout du stage: ' + (error.response?.data?.message || error.message))
    } finally {
      setAddingStageToPipeline(null)
    }
  }

  const toggleLeadSelector = (index) => {
    if (showForm) {
      fetchAllLeads()
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

  // Fonction pour ouvrir le modal d'ajout de lead
  const openAddLeadModal = async (pipelineName, stageName) => {
    try {
      await fetchAllLeads()
      setShowAddLeadModal({ pipeline: pipelineName, stage: stageName })
      setSearchLeadTerm('')
    } catch (error) {
      console.error('Erreur lors du chargement des leads:', error)
      alert('Erreur lors du chargement des leads')
    }
  }

  // Fonction pour fermer le modal d'ajout de lead
  const closeAddLeadModal = () => {
    setShowAddLeadModal({ pipeline: null, stage: null })
    setSearchLeadTerm('')
  }

  // Fonction pour ajouter un lead à un stage
  const handleAddLeadToStage = async (lead) => {
    if (!showAddLeadModal.pipeline || !showAddLeadModal.stage) return

    try {
      setAddingLead(true)
      await pipelineAPI.addLeadToStage(
        showAddLeadModal.pipeline,
        showAddLeadModal.stage,
        lead
      )

      console.log(
        showAddLeadModal.pipeline,
        showAddLeadModal.stage,
        lead
      );
      
      alert(`Lead "${lead.name || lead.email}" ajouté avec succès au stage "${showAddLeadModal.stage}"!`)
      closeAddLeadModal()
      fetchPipelines()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lead:', error)
      alert('Erreur lors de l\'ajout du lead: ' + (error.response?.data?.message || error.message))
    } finally {
      setAddingLead(false)
    }
  }

  // Fonction pour déplacer un lead entre les stages
  const handleMoveLeadBetweenStages = async (pipelineName, leadEmail, fromStageName, toStageName) => {
    if (!pipelineName || !leadEmail || !fromStageName || !toStageName) {
      console.error('Paramètres manquants pour le déplacement du lead')
      return
    }

    if (fromStageName === toStageName) {
      console.log('Le lead est déjà dans ce stage')
      return
    }

    try {
      setMovingLead(true)
      
      console.log(`Déplacement du lead ${leadEmail} de "${fromStageName}" vers "${toStageName}"`)
      
      const result = await pipelineAPI.moveLeadBetweenStages(
        pipelineName,
        leadEmail,
        fromStageName,
        toStageName
      )
      
      console.log('Lead déplacé avec succès:', result)
      
      // Rafraîchir les pipelines
      fetchPipelines()
      
    } catch (error) {
      console.error('Erreur lors du déplacement du lead:', error)
      alert(`Erreur lors du déplacement du lead: ${error.response?.data?.message || error.message}`)
    } finally {
      setMovingLead(false)
    }
  }

  // Handlers pour le drag & drop
  const handleDragStart = (e, pipelineName, stageName, lead) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      pipelineName,
      stageName,
      leadEmail: lead.email,
      leadName: lead.name || lead.email
    }))
    e.dataTransfer.effectAllowed = 'move'
    setDraggedLead({
      pipelineName,
      stageName,
      leadEmail: lead.email,
      leadName: lead.name || lead.email
    })
  }

  const handleDragOver = (e, stageName) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stageName)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOverStage(null)
  }

  const handleDrop = async (e, pipelineName, toStageName) => {
    e.preventDefault()
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'))
      
      if (!dragData || !dragData.pipelineName || !dragData.stageName || !dragData.leadEmail) {
        console.error('Données de drag invalides')
        return
      }

      // Vérifier que le drop est dans le même pipeline
      if (dragData.pipelineName !== pipelineName) {
        alert('Vous ne pouvez déplacer un lead que dans le même pipeline')
        return
      }

      // Vérifier que le lead n'est pas déplacé dans le même stage
      if (dragData.stageName === toStageName) {
        console.log('Le lead est déjà dans ce stage')
        return
      }

      // Confirmation utilisateur
      const confirmMove = window.confirm(
        `Déplacer le lead "${dragData.leadName}" du stage "${dragData.stageName}" vers "${toStageName}" ?`
      )

      if (!confirmMove) {
        return
      }

      // Appeler l'API pour déplacer le lead
      await handleMoveLeadBetweenStages(
        pipelineName,
        dragData.leadEmail,
        dragData.stageName,
        toStageName
      )

    } catch (error) {
      console.error('Erreur lors du drop:', error)
    } finally {
      setDraggedLead(null)
      setDragOverStage(null)
    }
  }

  // Filtre les leads en fonction du terme de recherche
  const filteredLeads = useMemo(() => {
    if (!searchLeadTerm.trim()) return availableLeads
    
    return availableLeads.filter(lead => {
      const searchTerm = searchLeadTerm.toLowerCase()
      return (
        (lead.name && lead.name.toLowerCase().includes(searchTerm)) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm)) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm)) ||
        (lead.phone && lead.phone.includes(searchTerm))
      )
    })
  }, [availableLeads, searchLeadTerm])

  // Fonction pour vérifier si un lead est déjà dans le stage
  const isLeadInStage = (leadId, pipeline, stageName) => {
    const pipelineToCheck = pipelines.find(p => p.name === pipeline)
    if (!pipelineToCheck) return false
    
    const stage = pipelineToCheck.stages.find(s => s.name === stageName)
    if (!stage || !stage.leads) return false
    
    return stage.leads.some(lead => lead._id === leadId)
  }

  // Fonction pour formater les pipelines en tableau Kanban
  const renderPipelineKanban = (pipeline) => {
    if (!pipeline || !pipeline.stages || pipeline.stages.length === 0) {
      return <div className="text-gray-500 p-4">Aucun stage dans ce pipeline</div>
    }

    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {pipeline.stages.map((stage, stageIndex) => {
            const stageKey = `${pipeline.name}-${stage.name}`
            const isDeleting = deletingStages[stageKey]
            const isDragOver = dragOverStage === stage.name && draggedLead?.stageName !== stage.name
            
            return (
              <div 
                key={stageIndex} 
                className={`flex-shrink-0 w-80 rounded-lg border relative transition-all duration-200 ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 bg-gray-50'
                }`}
                onDragOver={(e) => handleDragOver(e, stage.name)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, pipeline.name, stage.name)}
              >
                <div className={`p-4 border-b rounded-t-lg ${
                  isDragOver ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-gray-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-800">
                        {stage.name || `Stage ${stageIndex + 1}`}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {stage.leads?.length || 0} leads
                      </span>
                      <button
                        onClick={() => handleDeleteStage(pipeline.name, stage.name)}
                        disabled={isDeleting}
                        className={`text-red-500 hover:text-red-700 transition duration-150 ${
                          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Supprimer ce stage"
                      >
                        {isDeleting ? (
                          <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 max-h-[500px] overflow-y-auto">
                  {/* Bouton pour ajouter un lead */}
                  <div className="mb-3 p-2">
                    <button
                      onClick={() => openAddLeadModal(pipeline.name, stage.name)}
                      className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition duration-150 bg-white"
                    >
                      <span className="mr-2">+</span>
                      <span>Ajouter un lead</span>
                    </button>
                  </div>
                  
                  {stage.leads && stage.leads.length > 0 ? (
                    stage.leads.map((lead, leadIndex) => {
                      const isLeadDragged = draggedLead?.leadEmail === lead.email
                      
                      return (
                        <div 
                          key={lead._id} 
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, pipeline.name, stage.name, lead)}
                          className={`mb-2 p-3 rounded-lg border transition-all duration-150 cursor-move ${
                            isLeadDragged 
                              ? 'opacity-50 border-blue-300 bg-blue-50' 
                              : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <svg 
                                  className="h-4 w-4 text-gray-400 mr-2" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                                </svg>
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {lead.name || 'Sans nom'}
                                </h4>
                              </div>
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
                      )
                    })
                  ) : (
                    <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
                      isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
                    }`}>
                      <p className="text-sm text-gray-400">
                        {isDragOver ? 'Déposez le lead ici' : 'Aucun lead dans ce stage'}
                      </p>
                      {isDragOver && (
                        <p className="text-xs text-blue-500 mt-2">
                          Déplacer {draggedLead?.leadName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* Bouton pour ajouter un stage */}
          <div className="flex-shrink-0 w-80">
            {addingStageToPipeline === pipeline.name ? (
              <div className="w-full h-full min-h-[200px] border-2 border-blue-300 bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <h4 className="font-medium text-gray-800 mb-3">Ajouter un nouveau stage</h4>
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom du stage"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddStageToPipeline(pipeline.name)}
                    disabled={!newStageName.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingStageToPipeline === pipeline.name ? 'Ajout...' : 'Ajouter'}
                  </button>
                  <button
                    onClick={() => setAddingStageToPipeline(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingStageToPipeline(pipeline.name)}
                className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition duration-150 flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-2">+</span>
                <span className="text-sm font-medium">Ajouter un stage</span>
              </button>
            )}
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
        
        {/* Indicateur de drag & drop */}
        {draggedLead && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              <span>Déplacer {draggedLead.leadName} vers un autre stage</span>
            </div>
          </div>
        )}
        
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
                    <button
                      onClick={() => handleDeletePipeline(pipeline._id, pipeline.name)}
                      disabled={deletingPipelineId === pipeline._id}
                      className={`px-3 py-1 text-sm rounded-lg transition duration-150 ${
                        deletingPipelineId === pipeline._id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {deletingPipelineId === pipeline._id ? 'Suppression...' : 'Supprimer'}
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

        {/* Modal pour ajouter un lead à un stage */}
        {showAddLeadModal.pipeline && showAddLeadModal.stage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Ajouter un lead au stage "{showAddLeadModal.stage}"
                  </h2>
                  <button
                    onClick={closeAddLeadModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                {/* Barre de recherche */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchLeadTerm}
                    onChange={(e) => setSearchLeadTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rechercher un lead..."
                  />
                </div>
                
                {/* Liste des leads */}
                <div className="max-h-96 overflow-y-auto">
                  {loadingLeads ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Chargement des leads...</p>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">
                        {searchLeadTerm ? 'Aucun lead ne correspond à votre recherche' : 'Aucun lead disponible'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredLeads.map((lead) => {
                        const isAlreadyInStage = isLeadInStage(lead._id, showAddLeadModal.pipeline, showAddLeadModal.stage)
                        
                        return (
                          <div
                            key={lead._id}
                            className={`p-3 border rounded-lg cursor-pointer transition duration-150 ${
                              isAlreadyInStage
                                ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                            onClick={() => !isAlreadyInStage && handleAddLeadToStage(lead)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {lead.name || 'Sans nom'}
                                  {isAlreadyInStage && (
                                    <span className="ml-2 text-xs text-gray-500">(déjà dans le stage)</span>
                                  )}
                                </h4>
                                {lead.email && (
                                  <p className="text-xs text-gray-600 mt-1">{lead.email}</p>
                                )}
                                {lead.company && (
                                  <p className="text-xs text-gray-500 mt-1">{lead.company}</p>
                                )}
                              </div>
                              {!isAlreadyInStage && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddLeadToStage(lead)
                                  }}
                                  disabled={addingLead}
                                  className={`px-3 py-1 text-xs rounded-lg transition duration-150 ${
                                    addingLead
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-blue-500 text-white hover:bg-blue-600'
                                  }`}
                                >
                                  {addingLead ? 'Ajout...' : 'Ajouter'}
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeAddLeadModal}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
                  >
                    Annuler
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