var mapboxGl = require('mapbox-gl/dist/mapbox-gl');
//console.log('Hello from the client !');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxGl.accessToken = 'pk.eyJ1IjoiY3ByYWxpbiIsImEiOiJjbHJ4a281dHExY2p6Mm9wYjAwYjJzZW56In0.ay1Lle5CTnaqLfm-bQPtyQ';

const map = new mapboxGl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom : false
   /*  center : [-118.113491 , 34.111745],
    zoom : 10,
    interactive : false */
});

const bounds = new mapboxGl.LngLatBounds();

locations.forEach(loc => {
    //create custom marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxGl.Marker({
        element : el,
        anchor : 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    //add popup
    new mapboxGl.Popup({offset : 30}).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`).addTo(map);

    //extend map bounds to include current location
    bounds.extend(loc.coordinates);

});

map.fitBounds(bounds , {
    padding : {
        top : 200,
        bottom : 150,
        left : 100,
        right : 100
    }
});
