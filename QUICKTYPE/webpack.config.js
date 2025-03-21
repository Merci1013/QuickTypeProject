const path = require('path');

module.exports = {
  entry: './script.js', // Le point d'entrée de votre application
  output: {
    filename: 'bundle.js',  // Le nom du fichier généré
    path: path.resolve(__dirname, 'dist'), // Le dossier de sortie
  },
  mode: 'development', // Utilisez 'production' pour la version finale
};
