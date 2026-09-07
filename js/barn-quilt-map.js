const QUILT_ACCENT_PALETTE = [
  "#2a78d6", "#eb6834", "#1baf7a", "#eda100",
  "#e87ba4", "#008300", "#4a3aa7", "#e34948"
];

function quiltAccentColor(index) {
  return QUILT_ACCENT_PALETTE[index % QUILT_ACCENT_PALETTE.length];
}

function starPolygonPoints(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points;
  const coords = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    coords.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return coords.join(" ");
}

function buildQuiltIconSvg(color, variant) {
  let inner;
  if (variant === 0) {
    // Diamond-in-a-square block
    inner = `
      <polygon points="17,4 30,17 17,30 4,17" fill="${color}" />
      <polygon points="17,11 23,17 17,23 11,17" fill="#fdfaf2" />
    `;
  } else if (variant === 1) {
    // Eight-point compass star block
    inner = `<polygon points="${starPolygonPoints(17, 17, 13, 5.5, 8)}" fill="${color}" />`;
  } else {
    // Pinwheel block
    inner = `
      <polygon points="17,4 22,12 12,12" fill="${color}" />
      <polygon points="30,17 22,22 22,12" fill="${color}" />
      <polygon points="17,30 12,22 22,22" fill="${color}" />
      <polygon points="4,17 12,12 12,22" fill="${color}" />
      <circle cx="17" cy="17" r="4.5" fill="#fdfaf2" />
    `;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
    <rect x="1.5" y="1.5" width="31" height="31" rx="5" fill="#fdfaf2" stroke="#1d3a5a" stroke-width="1.5" />
    ${inner}
  </svg>`;
}

function svgToDataUrl(svg) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.replace(/\s+/g, " ").trim());
}

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
  const listEl = document.getElementById("trail-list");
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
  const markers = [];
  let activeItem = null;

  function setActiveItem(index) {
    if (activeItem) activeItem.classList.remove("active");
    const item = listEl && listEl.querySelector(`[data-index="${index}"]`);
    if (item) {
      item.classList.add("active");
      item.scrollIntoView({ block: "nearest" });
      activeItem = item;
    }
  }

  function selectQuilt(index) {
    const quilt = quilts[index];
    const marker = markers[index];
    map.panTo(marker.getPosition());
    if (map.getZoom() < 13) map.setZoom(13);
    infoWindow.setContent(buildQuiltInfoContent(quilt));
    infoWindow.open({ anchor: marker, map });
    setActiveItem(index);
  }

  quilts.forEach((quilt, index) => {
    const iconUrl = svgToDataUrl(buildQuiltIconSvg(quiltAccentColor(index), index % 3));

    const marker = new google.maps.Marker({
      position: { lat: quilt.lat, lng: quilt.lng },
      map,
      title: quilt.name,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(34, 34),
        anchor: new google.maps.Point(17, 17)
      }
    });
    markers.push(marker);
    marker.addListener("click", () => selectQuilt(index));

    if (listEl) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "trail-list-item";
      item.dataset.index = String(index);
      item.setAttribute("role", "listitem");
      item.innerHTML = `<img src="${iconUrl}" alt="" class="trail-list-icon" /><span>${quilt.name}</span>`;
      item.addEventListener("click", () => selectQuilt(index));
      listEl.appendChild(item);
    }
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
