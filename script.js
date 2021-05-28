/* Les options pour afficher la France */
const mapOptions = {
    center: [47.523103194323774, 7.478256333714517], //Hagenthal-le-bas
    zoom: 15
};

/* Les options pour affiner la localisation */
const locationOptions = {
    maximumAge: 5000,
    timeout: 5000,
    enableHighAccuracy: true
};

/* Création du conteneur de la carte */
var map = new L.map("map", mapOptions);

/* Création de la couche OpenStreetMap */
var layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

/* Ajoute la couche au conteneur de la carte */
map.addLayer(layer);

/* Verifie que le navigateur est compatible avec la géolocalisation */
if ("geolocation" in navigator) {
    //regarde la position de l'utilisateur et suit ses déplacements
    var actualPosition = navigator.geolocation.watchPosition(handleLocation, handleLocationError, locationOptions);
} else {
    /* Le navigateur n'est pas compatible */
    alert("Merci de bien vouloir activer la localisation sur votre appareil");
};

function handleLocation(position) {
    /* Zoom avant de trouver la localisation */
    map.setZoom(16);
    /* Centre la carte sur la latitude et la longitude de la localisation de l'utilisateur */
    map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
};

function handleLocationError(error) {
    {
        switch(error.code){
            case error.PERMISSION_DENIED:
                alert("L'utilisateur n'a pas autorisé l'accès à sa position");
                break;          
            case error.POSITION_UNAVAILABLE:
                alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
                break;
            case error.TIMEOUT:
                alert("Le service n'a pas répondu à temps");
                break;
            }
    };
};

// Création marker boulangerie Hagenthal
var circle = L.circle([47.52577, 7.47893], {
    color: 'blue', 
    fillColor: 'lightblue', 
    fillOpacity: 0.5, 
    radius: 50
}).addTo(map);