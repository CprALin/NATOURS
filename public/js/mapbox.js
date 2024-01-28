//console.log('Hello from the client !');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);


mapboxgl.accessToken = 'pk.eyJ1IjoiY3ByYWxpbiIsImEiOiJjbHJ4a281dHExY2p6Mm9wYjAwYjJzZW56In0.ay1Lle5CTnaqLfm-bQPtyQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

