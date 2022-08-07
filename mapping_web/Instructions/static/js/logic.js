let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 17,
});

let baseMaps = {
    "Base Map": baseMap
};

let myMap = L.map("map", {
    center: [ 35, -100 ], 
    zoom: 5,
    layers: [baseMap],
});

function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p> <b>Date/Time: </b>" + new Date(feature.properties.time) + "</p>" +
        "<p> <b>Magnitude:</b> " + feature.properties.mag + "; <b>Depth:</b> " + feature.geometry.coordinates[2] + "</p>");
}


// Layer for data
let earthquakes = L.layerGroup();

let overlayMaps = {
    Earthquakes: earthquakes
};

L.control.layers(null, overlayMaps, {
    collapsed: false,
  }).addTo(myMap);

// get data
d3.json(url).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, layer){
            return new L.CircleMarker(layer, {
               radius: (feature.properties.mag)*5,
               fillColor: depthColor(feature.geometry.coordinates[2]),
               weight: 0.8,
               color: "#000000",
               fillOpacity: 0.8,
            });
        },
        onEachFeature: popUpMsg,
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);
});
//marker color
function depthColor(depth) {
    let color = '#000FFF';
    if (depth < 10) {
        color = '#d1d4ff';
    } else if (depth < 20) {
        color = '##979dff';
    } else if (depth < 40) {
        color = '##5e68ff';
    } else if (depth < 80) {
        color = '##2330ff';
    };  
    return color
}

