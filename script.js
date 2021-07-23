/* Les options pour afficher la carte */
const mapOptions = {
  center: [47.523103194323774, 7.478256333714517], //Hagenthal-le-bas
  zoom: 15
};

/* Création du conteneur de la carte */
var myMap = new L.map("mapDiv", mapOptions);

/* Création de la couche OpenStreetMap */
var layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

/* Ajoute la couche au conteneur de la carte */
myMap.addLayer(layer);

/* Les options pour affiner la localisation */
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

let userPositionIcon = L.icon({
    iconUrl: '/rond-vert.png', 
    iconSize: [30,30],
    iconAnchor: [15,15]
})

let userPosition;

function success(pos) {
  userPosition = pos.coords;
  L.marker(userPosition, {icon: userPositionIcon}).addTo(myMap);
}

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}

navigator.geolocation.watchPosition(success, error, options);

let firstObjectiveCoord = [47.52577, 7.47893];
// Création marker boulangerie Hagenthal  
let firstObjective = L.circle(firstObjectiveCoord, {
  color: 'blue', 
  fillColor: 'lightblue', 
  fillOpacity: 0.5, 
  radius: 50
}).addTo(myMap);
firstObjective.bindPopup("Bienvenue à la boulangerie !");

let objectiveDistance = userPosition.distanceTo(L.latLng(firstObjectiveCoord));

if (objectiveDistance < 50) {
firstObjective.openPopup();
} else {
firstObjective.closePopup();
}


