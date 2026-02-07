import React, { useState, useRef } from 'react'

const Entreprise = () => {
  const [logoImage, setLogoImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleDownloadClick = () => {
    fileInputRef.current.click()
  }

  const handleDeleteImage = () => {
    setLogoImage(null)
    fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil d'entreprise</h1>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          {/* Section Logo */}
          <div className="mb-8">
            {/* Zone de téléchargement d'image */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div 
                onClick={handleImageClick}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition duration-150 overflow-hidden"
              >
                {logoImage ? (
                  <img 
                    src={logoImage} 
                    alt="Logo de l'entreprise" 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-3xl text-gray-400 mb-1">+</div>
                    <div className="text-xs text-gray-500">Ajouter un logo</div>
                  </div>
                )}
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Téléchargez un logo (max 2,5 Mo)</h2>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={handleDownloadClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-150"
              >
                Télécharger
              </button>
              <button 
                onClick={handleDeleteImage}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded transition duration-150"
              >
                Supprimer
              </button>
            </div>

            {/* Input file caché */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Formulaire - 2 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne 1 */}
            <div className="space-y-6">
              {/* Nom convivial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom convivial de l'entreprise
                </label>
                <input
                  type="text"
                  defaultValue="AH digital"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Domaine de marque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domaine de marque
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">ex., vol</span>
                  <button className="text-blue-500 hover:text-blue-600 font-medium">
                    Ajouter un domaine
                  </button>
                </div>
              </div>

              {/* Nom légal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom légal de l'entreprise
                </label>
                <input
                  type="text"
                  defaultValue="AH digital"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Site web */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site web de l'entreprise
                </label>
                <input
                  type="url"
                  placeholder="ex., https://www.votresite.cc"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de l'entreprise
                </label>
                <input
                  type="email"
                  defaultValue="quiosk.ah@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Niche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niche de l'entreprise
                </label>
                <input
                  type="text"
                  placeholder="ex., Marketing Digital"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone de l'entreprise
                </label>
                <input
                  type="tel"
                  placeholder="phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* ID de localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de localisation
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-150">
              Sauvegarder les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Entreprise