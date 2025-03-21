
import { generate, count } from "random-words";
const mots = generate(1000)
console.log(mots);
const containerRadios = document.getElementById('choixOptions');
const radios = containerRadios.querySelectorAll('input[type="radio"]');
const containerEntree = document.getElementById('EntréeEtValidationTexte');
const boutonValidate = containerEntree.querySelector('#validateButton');
const entreeUtilisateur = containerEntree.querySelector('#playerInput');
const textPropose = document.querySelector('#wordContainer #proposedWord');
const scoreDisplay = document.querySelector('#scoreContainer #score');
const nbDeQuestionsPosé = document.querySelector('#scoreContainer #nbQuestions');
let phrasechoose = false;
let scoreValue = 0;
let nombreDeQuestions = 0;
let motRepondu;

// Définir la position de chaque lettre sur un clavier QWERTY
const keyboardQwerty = {
    q: { x: 0, y: 0 }, w: { x: 1, y: 0 }, e: { x: 2, y: 0 }, r: { x: 3, y: 0 }, t: { x: 4, y: 0 },
    y: { x: 5, y: 0 }, u: { x: 6, y: 0 }, i: { x: 7, y: 0 }, o: { x: 8, y: 0 }, p: { x: 9, y: 0 },
    a: { x: 0.5, y: 1 }, s: { x: 1.5, y: 1 }, d: { x: 2.5, y: 1 }, f: { x: 3.5, y: 1 }, g: { x: 4.5, y: 1 },
    h: { x: 5.5, y: 1 }, j: { x: 6.5, y: 1 }, k: { x: 7.5, y: 1 }, l: { x: 8.5, y: 1 },
    z: { x: 1, y: 2 }, x: { x: 2, y: 2 }, c: { x: 3, y: 2 }, v: { x: 4, y: 2 }, b: { x: 5, y: 2 },
    n: { x: 6, y: 2 }, m: { x: 7, y: 2 }
  };
 
// Initialisation des tableaux pour chaque niveau
const niveaux = {
  facile: [],
  moyen: [],
  difficile: []
};

// Parcours de la liste pour classifier chaque mot
mots.forEach(mot => {
  const niveau = determinerNiveau(mot);
  niveaux[niveau].push(mot);
});
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    motRepondu = false;
    playerInput.disabled = false;
    validateButton.disabled = false;
    if (radio.checked && radio.value === "mots") {
        proposerMots();
        phrasechoose = false;
    } else if (radio.checked && radio.value === "phrases") {
        phrasechoose = true;
    }
    nombreDeQuestions ++;
    nbDeQuestionsPosé.textContent = nombreDeQuestions;
  });
});

boutonValidate.addEventListener("click", function() {
      const inputValue = entreeUtilisateur.value.trim();
      const utilisateurAGagne = comparaison(inputValue);
      if (utilisateurAGagne) {
          alert("Correct !");
      } else {
          alert("Incorrect, réessayez.");
      }
      entreeUtilisateur.value = "";
      motRepondu = true;
      playerInput.disabled = true;
      validateButton.disabled = true;
});


/**
 * Fonction permettant de comparer le mot saisi par l'utilisateur avec le mot proposé.
 * @param {string} motEcritParLUtilisateur - Le mot saisi par l'utilisateur.
 * @return {boolean} true si le mot est correct, false sinon.
 */
function comparaison(motEcritParLUtilisateur) {
    const isCorrect = (textPropose.textContent === motEcritParLUtilisateur);
    if (isCorrect && !motRepondu) {
        incrementerScore();
    }
    return isCorrect;
}

/**
 * Fonction permettant d'incrémenter le score.
 * @return {void}
 */
function incrementerScore() {
    scoreValue++;
    scoreDisplay.textContent = scoreValue;
}

/**
 * Fonction permettant de proposer un mot aléatoire à partir de la liste des mots.
 * @return {void}
 */
function proposerMots() {
    const index = secureRandomInt(niveaux["facile"].length);
    textPropose.textContent = niveaux["facile"][index];
}

/**
 * Fonction permettant de proposer une phrase aléatoire à partir de la liste des phrases.
 * @return {void}
 */
// function proposerPhrases() {
//     const index = secureRandomInt(listPhrases.length);
//     textPropose.textContent = listPhrases[index];
// }

/**
 * Méthode permettant de générer un index aléatoire de manière sécurisée.
 * @param {number} max - La valeur maximale pour l'index.
 * @return {number} Un index aléatoire compris entre 0 et max - 1.
 */
function secureRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}


  
  // Fonction pour calculer la distance euclidienne entre deux lettres
  function distanceEntreLettres(letter1, letter2) {
    const pos1 = keyboardQwerty[letter1];
    const pos2 = keyboardQwerty[letter2];
    if (!pos1 || !pos2) return 0; // Si une lettre n'est pas définie, ignorer
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function calculerDispersion(mot) {
    mot = mot.toLowerCase();
    let distanceTotale = 0;
    for (let i = 0; i < mot.length - 1; i++) {
      distanceTotale += distanceEntreLettres(mot[i], mot[i + 1]);
    }
    return distanceTotale;
  }

  // Fonction pour déterminer le niveau d'un mot en combinant son nombre de lettres et sa dispersion
function determinerNiveau(mot) {
    const dispersion = calculerDispersion(mot);
    // Score combinant la dispersion et le nombre de lettres
    const score = dispersion + mot.length;
    // Ces seuils sont arbitraires et peuvent être ajustés
    if (score < 10) {
      return "facile";
    } else if (score < 15) {
      return "moyen";
    } else {
      return "difficile";
    }
  }

