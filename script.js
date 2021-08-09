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

/* Création marker boulangerie Hagenthal */
let firstObjectiveCoord = [47.52577, 7.47893];
let firstObjective = L.circle(firstObjectiveCoord, {
  color: 'blue', 
  fillColor: 'lightblue', 
  fillOpacity: 0.5, 
  radius: 50
}).addTo(myMap);


/* Définition de la popup et de son contenu */
let popupContent = document.getElementById('popupInfo');
let popup = new L.Popup();

/* Fonction d'affichage de la popup */
function displayPopup() {
  popup.setContent(popupContent);
  popupContent.style.display = "block";
}
/* Affichage de la popup au click sur le marker */
firstObjective.on('click', () => {
  displayPopup();
})
/* Fonction de fermeture de la popup */
function closeDescriptionPopup() {
  popupContent.style.display = "none";
}
/* Fermeture de la popup au click sur le bouton X */
let closeBtn = document.getElementById('closePopupBtn');
closeBtn.onclick(closeDescriptionPopup());

/* Les options pour affiner la localisation */
let options = {
  enableHighAccuracy: true,
  timeout: 5000
};

/* Définition de l'icône du marker sur la position de l'utilisateur */
let userPositionIcon = L.icon({
    iconUrl: '/rond-vert.png', 
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
  let objectiveDistance = getDistance(currentPos, firstObjectiveCoord);
  if (objectiveDistance < 50) {
    displayPopup();
    } 
};

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
};

navigator.geolocation.watchPosition(success, error, options);