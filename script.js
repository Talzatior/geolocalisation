/* Création du conteneur de la carte */
let myMap = new L.map("mapDiv").locate({setView: true, maxZoom: 16});

/* Variables couche OpenStreetMap */
let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
let osmOptions = { attribution: '&copy; <a href=/"https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' };
/* Variables couche satellite Geoportail */
let satUrl = 'https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?'+
'&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM'+
'&LAYER={ignLayer}&STYLE={style}&FORMAT={format}'+
'&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}';
let satOptions = {
  ignApiKey: 'pratique',
  ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS',
  style: 'normal',
  format: 'image/jpeg',
  service: 'WMTS'
};

let osmLayer;
/* Création de la couche OpenStreetMap */
let layer = new L.TileLayer(osmUrl, osmOptions);
/* Ajoute la couche au conteneur de la carte */
myMap.addLayer(layer);
osmLayer = true;

/* Changement de layer au clic sur le bouton */
let layerToggleButton = document.getElementById('layerToggler');
function toggleLayer() {
  if(osmLayer) {
    myMap.addLayer(new L.TileLayer(satUrl, satOptions));
    layerToggleButton.style.backgroundImage = 'url(./osm.png)';
    osmLayer = false;
    console.log('Boucle 1 : osmLayer : ' + osmLayer);
  } else {
    myMap.addLayer(new L.TileLayer(osmUrl, osmOptions));
    layerToggleButton.style.backgroundImage = 'url(./sat.png)';
    osmLayer = true;
  }
};
layerToggleButton.onclick = toggleLayer;

/* Requête HTTP pour récupérer le contenu du JSON */ 
const loadJSON = (callback) => {
  const xObj = new XMLHttpRequest();
  xObj.overrideMimeType("application/json");
  xObj.open('GET', './objectives.json', true);
  xObj.onreadystatechange = () => {
      if (xObj.readyState === 4 && xObj.status === 200) {
          callback(xObj.responseText);
      }
  };
  xObj.send(null);
}
/* Initialisation variables nécessaires à l'objectif en cours et sa popup */
let popupIndex = 0;
let goalCoords = [];
let goalMarker;
let popupTitle = document.getElementById('popupTitle');
let popupDescription = document.getElementById('popupDescription');
let popupImgSrc = document.getElementById('popupImage');
let popupQuestion = document.getElementById('question');
let popupAnswers = document.getElementById('answers');
/* Définition de la popup */
let popupContent = document.getElementById('popupInfo');
let popup = new L.Popup();
/* Initialisation de la popup grâce au contenu du JSON */
const initGoal = () => {
  loadJSON((response) => {
    const json = JSON.parse(response);
    const goalPopupElements = json['objectives'];
    // Add Goal Marker
    goalCoords = goalPopupElements[popupIndex].coords;
    goalMarker = L.circle(goalCoords, {
      color: 'blue', 
      fillColor: 'lightblue', 
      fillOpacity: 0.5, 
      radius: 50
    }).addTo(myMap);
    // Add Img src, Title, Description, ...
    popupTitle.innerText = goalPopupElements[popupIndex].title;
    popupDescription.innerHTML = goalPopupElements[popupIndex].description;
    popupImgSrc.src = goalPopupElements[popupIndex].image;
    popupQuestion.innerHTML = goalPopupElements[popupIndex].question;

    /* Fonction récupérant les différentes réponses proposées */
    let answerButtonsList = "";
    const answers = goalPopupElements[popupIndex].answers;
    answers.forEach(element => {
        let buttonHTML = '<button id="answerButtons" class="btn btn-primary mb-3 me-3 answerButtons">'+element[0]+'</button>';
        answerButtonsList += buttonHTML;
    });
    popupAnswers.innerHTML = answerButtonsList;

    /* Fonction d'affichage de la popup */
    function displayPopup() {
      popup.setContent(popupContent);
      popupContent.style.display = "block";
    };
    /* Affichage de la popup au click sur le marker */
    goalMarker.on('click', () => {
      displayPopup();
    });
    /* Fonction de fermeture de la popup */
    function closeDescriptionPopup() {
      popupContent.style.display = "none";
    };
    /* Fermeture de la popup au click sur le bouton X */
    let closeBtn = document.getElementById('closePopupBtn');
    closeBtn.onclick = closeDescriptionPopup;
  });
};

initGoal();

/* Les options pour affiner la localisation */
let options = {
  enableHighAccuracy: true,
  timeout: 5000
};

/* Définition de l'icône du marker sur la position de l'utilisateur */
let userPositionIcon = L.icon({
    iconUrl: './rond-vert.png', 
    iconSize: [30,30],
    iconAnchor: [15,15]
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

  var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  var EARTH_RADIUS = 6371;
  return c * EARTH_RADIUS * 1000;
};
function toRadian(degree) {
  return degree*Math.PI/180;
};

function success(pos) {
  currentPos = [pos.coords.latitude, pos.coords.longitude];
  if (!positionMarker){
    positionMarker = L.marker(currentPos, {icon: userPositionIcon}).addTo(myMap);
  }else {
    let newLat = currentPos[0];
    let newLng = currentPos[1];
    let newLatLng = new L.LatLng(newLat, newLng);
    positionMarker.setLatLng(newLatLng);
  }
  let objectiveDistance = getDistance(currentPos, goalCoords);
  if (objectiveDistance < 50) {
    displayPopup();
    } 
};

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
};

navigator.geolocation.watchPosition(success, error, options);