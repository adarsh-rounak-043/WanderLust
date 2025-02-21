mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const div = document.createElement('div');
const i = document.createElement('i');
i.className = 'fa-sharp fa-solid fa-house house-icon';
div.className ='marker';
div.appendChild(i);

const marker1 = new mapboxgl.Marker(div)
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`))
        .addTo(map);
