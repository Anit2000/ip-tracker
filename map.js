// setting map
export let map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);

/*
    @params coords : type Object {lat: latitude, long : longituge}
*/

export function updateView({ lat, long }) {
  //setting map center
  L.map("map").setView([lat, long], 19);

  //setting marker
  L.marker([lat, long]).addTo(map);
}
