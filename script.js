const objectiveData = [
  
  {
    "coords": [47.52577, 7.47893],
    "title": "Boulangerie de Hagenthal-le-bas",
    "description":
      "Bienvenue à la boulangerie de Hagenthal-le-bas.<br> On y trouve des pâtisseries, des viennoiseries, du pain, des brioches, des petits gâteux et même des glaces maison.",
    "image": "./assets/images/objectives/boulangerie.jpg",
    "audio": "",
    "question": "Que ne trouve-t-on pas à la boulangerie d'Hagenthal-le-bas ?",
    "choices": ["Croissants", "Oeufs", "Eclair au café", "Baguette"],
    "answer": "Oeufs",
  },
  {
    "coords": [47.52396, 7.476726],
    "title": "Château de Hagenthal-le-bas",
    "description":
      "Le Château d’Hagenthal a appartenu aux Eptingen. L’histoire de ce Château reste malgré tout un mystère. On lit qu’il y aurait eu deux châteaux, l’un dans la commune d’Hagenthal-le-Haut et l’autre à Hagenthal-le-Bas. Faute d’étude précise, le château situé sur la commune d’Hagenthal-le-Bas est la pièce maîtresse d’un mystère, symbolique jumeau solitaire d’un endroit où tout semble fonctionner par deux.",
    "image": "./assets/images/objectives/chateau-hagenthal.jpeg",
    "audio": "",
    "question": "A qui a appartenu le château de Hagenthal ?",
    "choices": ["Aux Eptingen", "Aux Chirac", "Aux Sarkozy", "Aux Macron"],
    "answer": "Des Eptingen",
  },
  {
    "coords": [47.52067, 7.48012],
    "title": "Chapelle de l'Exaltation de la Sainte-Croix",
    "description":
      "À l'origine de la chapelle Sainte-Croix se trouve... une croix ! Erigée là par le couple Schoeffel de Hagenthal-le-Bas en 1832, afin d'obtenir la guérison de leur petite fille sourde et muette. Malgré le décès de l'enfant, la croix est toujours présente en 1842 quand un jeune bossu, Théophile Glermann, se retrouve libéré de son infirmité, un soir de tempête, au pied du monument. Au fil des passages, des dons sont déposés au pied de la croix. C'est alors que la famille Schoeffel décide d'y construire un lieu de culte.",
    "image": "./assets/images/objectives/chapelle2.jpg",
    "audio": "./assets/sons/cloches.mp3",
    "question": "En quelle année fut construite la chapelle de l'Exaltation Sainte-Croix ?",
    "choices": ["1832", "1842", "1852", "1862"],
    "answer": "1842",
  }
];


/************* Partie Map *************/


/* Création du conteneur de la carte */
let myMap = new L.map("mapDiv").locate({ setView: true, maxZoom: 16 });

/* Variables couche OpenStreetMap */
let osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let osmOptions = {
  attribution:
    '&copy; <a href=/"https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
/* Variables couche satellite Geoportail */
let satUrl =
  "https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?" +
  "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM" +
  "&LAYER={ignLayer}&STYLE={style}&FORMAT={format}" +
  "&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}";
let satOptions = {
  ignApiKey: "pratique",
  ignLayer: "ORTHOIMAGERY.ORTHOPHOTOS",
  style: "normal",
  format: "image/jpeg",
  service: "WMTS",
};

let osmLayer;
/* Création de la couche OpenStreetMap */
let layer = new L.TileLayer(osmUrl, osmOptions);
/* Ajoute la couche au conteneur de la carte */
myMap.addLayer(layer);
osmLayer = true;

/* Changement de layer au clic sur le bouton */
let layerToggleButton = document.getElementById("layerToggler");
function toggleLayer() {
  if (osmLayer) {
    myMap.addLayer(new L.TileLayer(satUrl, satOptions));
    layerToggleButton.style.backgroundImage = "url(./assets/images/icons/osm.png)";
    osmLayer = false;
  } else {
    myMap.addLayer(new L.TileLayer(osmUrl, osmOptions));
    layerToggleButton.style.backgroundImage = "url(./assets/images/icons/sat.png)";
    osmLayer = true;
  }
}
layerToggleButton.onclick = toggleLayer;


/************* Partie Popup + Marker *************/


/* Initialisation variables nécessaires à l'objectif en cours et sa popup */

let popupContent = document.getElementById("popupInfo");
let popup = new L.Popup();
let popupIndex = 0;
let goalCoords = [];
let goalMarker;
let popupTitle = document.getElementById("popupTitle");
let popupDescription = document.getElementById("popupDescription");
let popupImgSrc = document.getElementById("popupImage");
let popupQuestion = document.getElementById("question");
let popupAnswers = document.getElementById("answers");
let popupAudio = document.getElementById("popupAudio");
let buttonId = "";
let correctAnswer;
let score = 0;

let popupEndContent = document.getElementById("popupEnd");
let closeEndPopup = document.getElementById("closeEndPopupBtn");
let popupEndScore = document.getElementById("score");

let popupTransitionContent = document.getElementById("popupTransition");
let closeTransitionPopup = document.getElementById("closeTransitionPopupBtn");
let nextObjective = document.getElementById("nextObjective");

/* Fonction d'affichage de la popup description */

function displayPopup() {
  popupLoadContent();
  popup.setContent(popupContent);
  popupContent.style.display = "block";
}

/* Fonction d'affichage de la popup de transition */

function displayTransitionPopup() {
  popup.setContent(popupTransitionContent);
  popupTransitionContent.style.display = "block";
  nextObjective.innerText = objectiveData[popupIndex].title;
}

/* Fonction d'affichage de la popup de fin */

function displayEndPopup() {
  popup.setContent(popupEndContent);
  popupEndContent.style.display = "block";
  popupEndScore.innerText = "Votre score est de " + score + "/" + objectiveData.length + ".";
}

// Add Goal Marker

function createMarker() {
  goalCoords = objectiveData[popupIndex].coords;
  goalMarker = L.circle(goalCoords, {
    color: "blue",
    fillColor: "lightblue",
    fillOpacity: 0.5,
    radius: 50,
  }).addTo(myMap)
    .on("click", () => {
      displayPopup();
    });
};
createMarker();

// Add Img src, Title, Description, ...
function popupLoadContent() {
  popupTitle.innerText = objectiveData[popupIndex].title;
  popupDescription.innerHTML = objectiveData[popupIndex].description;
  popupImgSrc.src = objectiveData[popupIndex].image;
  popupQuestion.innerHTML = objectiveData[popupIndex].question;
  correctAnswer = objectiveData[popupIndex].answer;
  let audioSrc = objectiveData[popupIndex].audio;

  /* Fonction récupérant l'audio lorsqu'il y a lieu */
  if(audioSrc){
    popupAudio.src = audioSrc;
  }

  /* Fonction récupérant les différentes réponses proposées et vérifiant la réponse cliquée*/

  let answerButtonsList = "";
  let choices = objectiveData[popupIndex].choices;
  for (let i = 0; i < choices.length; i++) {
    let buttonHTML =
      '<button id="answer' +
      [i] +
      '" class="btn btn-primary mb-3 me-3 answerButtons" onclick="onAnswerClick(this.id)">' +
      choices[i] +
      "</button>";
    answerButtonsList += buttonHTML;
    popupAnswers.innerHTML = answerButtonsList;
  }
}
popupLoadContent();

/* Fonction de fermeture de la popup description */

function closeDescriptionPopup() {
  popupContent.style.display = "none";
}

/* Fonction de fermeture de la popup objectif suivant */

function closeTransitionPopupBtn() {
  popupTransitionContent.style.display = "none";
}

/* Fonction de fermeture de la popup de fin */

function closeEndPopupBtn() {
  popupEndContent.style.display = "none";
}

/* Fermeture de la popup description au click sur le bouton X */

let closeBtn = document.getElementById("closePopupBtn");
closeBtn.onclick = closeDescriptionPopup;

/* Fermeture de la popup de transition au click sur le bouton X */

let closeTransitionBtn = document.getElementById("closeTransitionPopupBtn");
closeTransitionBtn.onclick = closeTransitionPopupBtn;

/* Fermeture de la popup de fin au click sur le bouton X */

let closeEndBtn = document.getElementById("closeEndPopupBtn");
closeEndBtn.onclick = closeEndPopupBtn;

/* Définition de la popup */

function onAnswerClick(id) {
  buttonId = id;
  let answerClicked = document.getElementById(buttonId).textContent;
  if(answerClicked === objectiveData[popupIndex].answer){
    score++;
  }

  closeDescriptionPopup();
  popupIndex++;
  
  /* Annulation de la génération des Markers / popups s'il n'y a plus d'objectif // Affichage de la fenêtre de résultats */
  
  if(popupIndex < objectiveData.length) {
    displayTransitionPopup();
    myMap.removeLayer(goalMarker);
    createMarker();

  }else {
    closeDescriptionPopup();
    displayEndPopup();
  }
}


/************* Partie Localisation *************/


/* Les options pour affiner la localisation */
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
};

/* Définition de l'icône du marker sur la position de l'utilisateur */
let userPositionIcon = L.icon({
  iconUrl: "./assets/images/icons/rond-vert.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/* Initialise le marker à la position de l'utilisateur de l'utilisateur */
let positionMarker;

function getDistance(start, goal) {
  // return distance in meters
  var lon1 = toRadian(start[1]),
    lat1 = toRadian(start[0]),
    lon2 = toRadian(goal[1]),
    lat2 = toRadian(goal[0]);

  var deltaLat = lat2 - lat1;
  var deltaLon = lon2 - lon1;

  var a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  var EARTH_RADIUS = 6371;
  return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
  return (degree * Math.PI) / 180;
}

function success(pos) {
  currentPos = [pos.coords.latitude, pos.coords.longitude];
  if (!positionMarker) {
    positionMarker = L.marker(currentPos, { icon: userPositionIcon }).addTo(
      myMap
    );
  } else {
    let newLat = currentPos[0];
    let newLng = currentPos[1];
    let newLatLng = new L.LatLng(newLat, newLng);
    positionMarker.setLatLng(newLatLng);
  }
  let objectiveDistance = getDistance(currentPos, goalCoords);
  if (objectiveDistance < 50) {
    displayPopup();
  }
}

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}

navigator.geolocation.watchPosition(success, error, options);
