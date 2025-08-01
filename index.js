// ✅ Importer les modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ✅ Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSJS0Q_lmTSV1ilP3bsGsd3GXcmRNIfoI",
  authDomain: "feuille-de-match-4a742.firebaseapp.com",
  databaseURL: "https://feuille-de-match-4a742-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "feuille-de-match-4a742",
  storageBucket: "feuille-de-match-4a742.appspot.com",
  messagingSenderId: "335510490882",
  appId: "1:335510490882:web:b61199a857a113fb747c1b",
  measurementId: "G-ZQM16BY73B"
};

// ✅ Initialisation Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Variables globales
let currentPoste = null;
const modal = document.getElementById('modal');
const input = document.getElementById('player-name');
const validateBtn = document.getElementById('validate-btn');

// ✅ Charger les données depuis Firebase
document.querySelectorAll('.poste').forEach(p => {
  const poste = p.dataset.poste;
  const posteRef = ref(database, 'postes/' + poste);

  // ✅ Mise à jour en temps réel
  onValue(posteRef, snapshot => {
    const nom = snapshot.val();
    if (nom) {
      p.textContent = nom;
    } else {
      p.textContent = poste.toUpperCase(); // ou vide selon ton besoin
    }
  });

  // ✅ Ouvrir le modal au clic
  p.addEventListener('click', () => {
    currentPoste = poste;
    input.value = "";
    modal.classList.remove('hidden');
    input.focus();
  });
});

// ✅ Validation et enregistrement dans Firebase
validateBtn.addEventListener('click', () => {
  const nom = input.value.trim();
  if (nom.length < 2) {
    alert("Le nom doit contenir au moins 2 caractères.");
    return;
  }

  if (currentPoste) {
    const posteRef = ref(database, 'postes/' + currentPoste);
    set(posteRef, nom)
      .then(() => {
        alert("Nom enregistré !");
        modal.classList.add('hidden');
      })
      .catch((error) => {
        alert("Erreur lors de l'enregistrement : " + error.message);
      });
  }
});

// ✅ Annulation de la réservation
const cancelBtn = document.getElementById('cancel-btn');

cancelBtn.addEventListener('click', () => {
  if (currentPoste) {
    const posteRef = ref(database, 'postes/' + currentPoste);
    set(posteRef, null)
      .then(() => {
        alert("Réservation annulée.");
        modal.classList.add('hidden');
      })
      .catch((error) => {
        alert("Erreur lors de l'annulation : " + error.message);
      });
  }
});

// ✅ Fermer le modal avec Échap
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.add('hidden');
  }
});

// ✅ Fermer le modal si clic en dehors du contenu
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});
