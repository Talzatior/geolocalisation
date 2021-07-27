/* Création du conteneur de la carte */
let myMap = new L.map("mapDiv").locate({setView: true, maxZoom: 16});

/* Création de la couche OpenStreetMap */
let layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

/* Ajoute la couche au conteneur de la carte */
myMap.addLayer(layer);

/* Les options pour affiner la localisation */
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
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
  if (positionMarker === undefined){
    positionMarker = L.marker(currentPos, {icon: userPositionIcon}).addTo(myMap);
  }else {
    let newLat = pos.coords.latitude;
    let newLng = pos.coords.longitude;
    let newLatLng = new L.LatLng(newLat, newLng);
    console.log(newLatLng)
    positionMarker.setLatLng(newLatLng);
  }


  let objectiveDistance = getDistance(currentPos, firstObjectiveCoord);

  if (objectiveDistance < 50) {
    firstObjective.openPopup();
    } else {
    firstObjective.closePopup();
    }
};

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
};

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