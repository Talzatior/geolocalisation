/* Les options pour afficher la carte */
const mapOptions = {
    center: [47.523103194323774, 7.478256333714517], //Hagenthal-le-bas
    zoom: 15
};

/* Les options pour affiner la localisation */
const locationOptions = {
    maximumAge: 5000,
    //timeout: 5000, // Pour recentrer automatiquement sur la position de l'utilisateur
    enableHighAccuracy: true
};

/* Création du conteneur de la carte */
var myMap = new L.map("mapDiv", mapOptions);

/* Création de la couche OpenStreetMap */
var layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

/* Ajoute la couche au conteneur de la carte */
myMap.addLayer(layer);

// /* Verifie que le navigateur est compatible avec la géolocalisation */
// if ("geolocation" in navigator) {
//     //regarde la position de l'utilisateur et suit ses déplacements
//     var actualPosition = navigator.geolocation.watchPosition(handleLocation, handleLocationError, locationOptions);
// } else {
//     /* Le navigateur n'est pas compatible */
//     alert("Merci de bien vouloir activer la localisation sur votre appareil");
// };

// function handleLocation(position) {
//     /* Zoom avant de trouver la localisation */
//     myMap.setZoom(16);
//     /* Centre la carte sur la latitude et la longitude de la localisation de l'utilisateur */
//     myMap.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
// };

// function handleLocationError(error) {
//     {
//         switch(error.code){
//             case error.PERMISSION_DENIED:
//                 alert("L'utilisateur n'a pas autorisé l'accès à sa position");
//                 break;          
//             case error.POSITION_UNAVAILABLE:
//                 alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
//                 break;
//             case error.TIMEOUT:
//                 alert("Le service n'a pas répondu à temps");
//                 break;
//             }
//     };
// };
var userLocation = L.Icon.extend({
    options: {
        iconUrl: 'rond-vert.png',
        iconSize: [20, 20]
    }
})



function onLocationFound(position) {
    var locationIcon = new userLocation({iconAnchor: [position]});
    L.marker([position.latlng], {icon: locationIcon}).addTo(myMap)
};
function onLocationError(position) {
    alert(position.message);
}

myMap.on('locationfound', onLocationFound);
myMap.on('locationerror', onLocationError);

myMap.locate({setView: true, maxZoom: 16})

// Création marker boulangerie Hagenthal
var firstObjective = L.circle([47.52577, 7.47893], {
    color: 'blue', 
    fillColor: 'lightblue', 
    fillOpacity: 0.5, 
    radius: 50
}).addTo(myMap);

