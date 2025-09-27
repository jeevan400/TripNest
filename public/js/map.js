// let mapToken = mapToken;
// console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: list.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// console.log(coordinates);

// Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(list.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${list.title}</h4><p>Exact Location will be provided after booking.</p>`))
        .addTo(map);