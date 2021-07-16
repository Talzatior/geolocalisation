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

  function success(pos) {
    var crd = pos.coords;
    L.marker([47.523103194323774, 7.478256333714517], {icon: userPositionIcon}).addTo(myMap);

    // console.log('Votre position actuelle est :');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude : ${crd.longitude}`);
    // console.log(`La précision est de ${crd.accuracy} mètres.`);
  }
  
  function error(err) {
    console.warn(`ERREUR (${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.watchPosition(success, error, options);

  // Création marker boulangerie Hagenthal
var firstObjective = L.circle([47.52577, 7.47893], {
    color: 'blue', 
    fillColor: 'lightblue', 
    fillOpacity: 0.5, 
    radius: 50
}).addTo(myMap);