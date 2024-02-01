//console.log('Hello from the client !');

export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3ByYWxpbiIsImEiOiJjbHJ4a281dHExY2p6Mm9wYjAwYjJzZW56In0.ay1Lle5CTnaqLfm-bQPtyQ';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        scrollZoom : false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        //create custom marker
        const el = document.createElement('div');
        el.className = 'marker';

        //add marker
        new mapboxgl.Marker({
            element : el,
            anchor : 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        //add popup
        new mapboxgl.Popup({offset : 30}).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`).addTo(map);

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
}

