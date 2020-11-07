var id, target, options;
var map = L.map("mapid");

async function tracking(lat, long) {
  const latitude = lat;
  const longitude = long;
  const response = await fetch(
    `https://sharp-boyd-41e0d7.netlify.app/.netlify/functions/position?latitude=${latitude}&longitude=${longitude}`
  );
  const data = await response.json();
  map.setView([data.latitude, data.longitude], 25);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  currentPos = map.getCenter();
  map.removeLayer(L.marker(currentPos.lat, currentPos.lng));
  console.log(currentPos);
  L.marker([data.latitude, data.longitude])
    .addTo(map)
    .bindPopup("3225 Ridgeleigh Heights, Mississauga")
    .openPopup();
}

function success(pos) {
  var crd = pos.coords;
  tracking(crd.latitude, crd.longitude);
  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    console.log("Congratulations, you reached the target");
    navigator.geolocation.clearWatch(id);
  }
}

function error(err) {
  console.warn("ERROR(" + err.code + "): " + err.message);
}

target = {
  latitude: 0,
  longitude: 0,
};

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

id = navigator.geolocation.watchPosition(success, error, options);
