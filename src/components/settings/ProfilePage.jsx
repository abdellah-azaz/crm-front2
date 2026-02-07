import React from 'react'

const ProfilePage = () => {
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profile</h1>

        {/* Grid pour les 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Colonne de gauche */}
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-150">
                  Sauvegarder les informations
                </button>
              </div>
            </div>

            {/* Intégration email */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Intégration email</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service email
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Sélectionner un service</option>
                    <option value="gmail">Gmail</option>
                    <option value="outlook">Outlook</option>
                    <option value="yahoo">Yahoo Mail</option>
                    <option value="imap">IMAP/SMTP personnalisé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email pour l'intégration
                  </label>
                  <input
                    type="email"
                    placeholder="email@integration.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-150">
                  Connecter l'email
                </button>
                <button className="ml-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-lg transition duration-150">
                  Déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* Colonne de droite */}
          <div className="space-y-6">
            {/* Modifier le mot de passe */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Modifier le mot de passe</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-150">
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            {/* Signature email */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature email</h2>
              <p className="text-sm text-gray-600 mb-4">Cette signature sera ajoutée à la fin de chaque email sortant.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre signature
                </label>
                <textarea
                  rows="6"
                  placeholder="Cordialement,
[Votre nom]
[Votre poste]
[Votre téléphone]
[Site web de l'entreprise]"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="includeSignature" className="rounded text-blue-500" />
                  <label htmlFor="includeSignature" className="text-sm text-gray-700">
                    Inclure la signature dans tous les emails sortants
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-150">
                  Sauvegarder la signature
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage