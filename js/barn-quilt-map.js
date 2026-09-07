function buildQuiltInfoContent(quilt) {
  const photo = quilt.photo
    ? `<img src="${quilt.photo}" alt="${quilt.name}" class="quilt-info-photo" />`
    : "";
  return `
    <div class="quilt-info">
      ${photo}
      <h3>${quilt.name}</h3>
      <p class="quilt-info-address">${quilt.address}</p>
      <p class="quilt-info-desc">${quilt.description}</p>
    </div>
  `;
}

async function initBarnQuiltMap() {
  const mapEl = document.getElementById("trail-map");
  if (!mapEl) return;

  let quilts = [];
  try {
    const res = await fetch("../data/quilts.json");
    quilts = await res.json();
  } catch (err) {
    console.error("Could not load barn quilt trail data:", err);
    return;
  }

  const map = new google.maps.Map(mapEl, {
    center: { lat: 36.45, lng: -75.95 },
    zoom: 11,
    styles: [
      { featureType: "poi.business", stylers: [{ visibility: "off" }] },
      { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#faf7ef" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe0ea" }] }
    ]
  });

  const infoWindow = new google.maps.InfoWindow();

  quilts.forEach((quilt) => {
    const marker = new google.maps.Marker({
      position: { lat: quilt.lat, lng: quilt.lng },
      map,
      title: quilt.name
    });

    marker.addListener("click", () => {
      infoWindow.setContent(buildQuiltInfoContent(quilt));
      infoWindow.open({ anchor: marker, map });
    });
  });
}

window.initBarnQuiltMap = initBarnQuiltMap;

(function loadGoogleMaps() {
  if (!window.GOOGLE_MAPS_API_KEY) {
    console.error("Missing GOOGLE_MAPS_API_KEY — create config/config.js from config/config.example.js");
    return;
  }
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${window.GOOGLE_MAPS_API_KEY}&callback=initBarnQuiltMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})();
