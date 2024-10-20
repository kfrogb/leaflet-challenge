// Creating the map object
let myMap = L.map("map", {
    center: [40.27119224694612, -109.16606513573375],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  
  // Use this link to get the GeoJSON data.
  let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Getting our GeoJSON data
  d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        let magnitude = feature.properties.mag; // Assuming 'mag' is the property for magnitude
        let depth = feature.geometry.coordinates[2]; // Assuming coordinates[2] is depth
        let color = getColor(depth); // Function to determine color based on depth
        let radius = magnitude * 5; // Scale the radius based on magnitude
  
        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: color,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup("Magnitude: " + magnitude + "<br>Depth: " + depth + " km");
      }
    }).addTo(myMap);
  });
  
  // Function to get color based on depth
  function getColor(depth) {
    return depth > 100 ? '#ee3e32' :
           depth > 50  ? '#f68838' :
           depth > 20  ? '#fbb021' :
                         '#1b8a5a'; // Default color for shallow depths
  }
  
// Create a legend to provide context for map
let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 20, 50, 100];

    // Add the title to the legend
    div.innerHTML += '<h4>Legend (Depth of Earthquake)</h4>';

    // Add label for "No Data Available"
    div.innerHTML += '<i style="background: #eeedd8"></i> No Data Available<br>';

    // Loop through depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);