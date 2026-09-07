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
    const res = await fetch("quilts.json");
    quilts = await res.json();
  } catch (err) {
    console.error("Could not load barn quilt trail data:", err);
    return;
  }

  const map = new google.maps.Map(mapEl, {
    center: { lat: 38.55, lng: -76.55 },
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
