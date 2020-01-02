// Fetch collisions data from our Glitch project
var nyc_tz = fetch('https://data.cityofnewyork.us/resource/755u-8jsi.geojson')
  .then(function (response) {
    // Read data as JSON
    return response.json();
  });
  
 
// Fetch lanes data from our Glitch project
var vzv_tcst = fetch('https://data.cityofnewyork.us/resource/hiik-hmf3.geojson')
  .then(function (response) {
    // Read data as JSON
    return response.json();
  });


// Once both have loaded, do some work with them
Promise.all([nyc_tz, vzv_tcst])
  .then(function (fetchedData) {
    console.log('Both datasets have loaded');
  
    // Unpack the data from the Promise
    var nyc_tz = fetchedData[0];
	var vzv_tcst = fetchedData[1];

  
// Add data in the order you want--first goes on the bottom
    var nyc_tz_geo = L.geoJson(nyc_tz, {
  pointToLayer: function (geoJsonPoint, latlng) {
		return L.polygon(latlng);
      },
      style: function (geoJsonFeature) {
        return {
          fillColor: '#FFFFFF',
		  color: '#ffcc00',
          radius: 2,
          fillOpacity: 0,
		  opacity: 0.7,
          stroke: true,
		  weight: 2
        };
      },
});


 var vzv_tcst_geo = L.geoJson(vzv_tcst, {
  pointToLayer: function (geoJsonPoint, latlng) {
		return L.circleMarker(latlng);
      },
      style: function (geoJsonFeature) {
        return {
          fillColor: '#CD00CD',
          radius: 6,
          fillOpacity: 0.8,
          stroke: false
        };
      },
});
// Add popups to the layer
vzv_tcst_geo.bindPopup(function (layer) {
  // This function is called whenever a feature on the layer is clicked
  console.log(layer.feature.properties);
  
  // Render the template with all of the properties. Mustache ignores properties
  // that aren't used in the template, so this is fine.
  return Mustache.render(popupTemplate_vzv_tcst_geo, layer.feature.properties);
});





var var_fac;

    // get color depending on population density value
function getColor_fac(d) {
        return d === 'Health Care'  ? "#ff7f00" :
		       d === 'Human Services'  ? '#0000ff' :
                            "#de2d26";
    }
    function style_fac(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: getColor_fac(feature.properties.Facilities_facgroup),
        fillOpacity: 0.2,
 		fillColor: getColor_fac(feature.properties.Facilities_facgroup),
      };
    }

    geojson_fac = L.geoJson(Facilities_Accessible, {
      style: style_fac,
    });


// Add popups to the layer
geojson_fac.bindPopup(function (layer) {
// This function is called whenever a feature on the layer is clicked
console.log(layer.feature.properties);

// Render the template with all of the properties. Mustache ignores properties
// that aren't used in the template, so this is fine.
return Mustache.render(popupTemplate_fac_geo, layer.feature.properties);
});	
	

var legend_fac = L.control({position: 'bottomright'});
    legend_fac.onAdd = function (map) {

    var div_fac = L.DomUtil.create('div', 'info legend');
    labels_fac = ['<strong>Facilities</strong>'],
    categories_fac = ['Health Care','Human Services','Other'];

    for (var i = 0; i < categories_fac.length; i++) {
            div_fac.innerHTML += 
            labels_fac.push(
                '<i class="circle" style="background:' + getColor_fac(categories_fac[i]) + '"></i> ' +
                (categories_fac[i] ? categories_fac[i] : '+'));
        }

        div_fac.innerHTML = labels_fac.join('<br>');
    return div_fac;
};



var Ambulatory_Difficulty_Global;

    // get color depending on population density value
	
    function getColor6(d) {
    return d > 8  ? '#7a0177' :
           d > 7   ? '#c51b8a' :
           d > 6   ? '#f768a1' :
           d > 5   ? '#fbb4b9' :
                      '#feebe2';
}
		
    function style6(feature) {
      return {
        weight: 1,
        opacity: 1,
        color: "white",
        fillOpacity: .5,
 		fillColor: getColor6(feature.properties.CvNID_Amb_CvNID_AmbP),
      };
    }
    function highlightFeature6(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        color: "#666",
        dashArray: "",
        fillOpacity: .8
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    }
    var Ambulatory_Difficulty_Geo;
    function resetHighlight6(e) {
      Ambulatory_Difficulty_Geo.resetStyle(e.target);
    }

    function onEachFeature6(feature, layer) {
      layer.on({
        mouseover: highlightFeature6,
        mouseout: resetHighlight6
      });
    }
	
    Ambulatory_Difficulty_Geo = L.geoJson(Ambulatory_Difficulty, {
      style: style6,
      onEachFeature: onEachFeature6
    });

// Add popups to the layer
Ambulatory_Difficulty_Geo.bindPopup(function (layer) {
// This function is called whenever a feature on the layer is clicked
console.log(layer.feature.properties);

// Render the template with all of the properties. Mustache ignores properties
// that aren't used in the template, so this is fine.
return Mustache.render(popupTemplate_Ambulatory_Difficulty, layer.feature.properties);
});	
	

var legend6 = L.control({ position: "bottomright" });

legend6.onAdd = function (map) {

    var div6 = L.DomUtil.create('div', 'info legend'),
        grades6 = [0, 5, 6, 7, 8],
        labels6 = []
		;
		

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades6.length; i++) {
        div6.innerHTML +=
            '<i style="background:' + getColor6(grades6[i] + 1) + '"></i> ' +
            grades6[i] + (grades6[i + 1] ? '%&ndash;' + grades6[i + 1] + '%<br>' : '%+');

    }

  div6.innerHTML += "<br><br><center><caption style='color: #d3d3d3'>Source:<br>ACS 2017</caption></center>";
  
    return div6;
	
};


AD_Trips = AD_Trips.map(function (p) { return [p[0], p[1]]; });
var heat = L.heatLayer(AD_Trips, {radius: 11});


var OpenStreetMaps = L.tileLayer(
    "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      minZoom: 11,
      maxZoom: 16,
      id: "osm.streets"
    }
  )

var mapOptions = {
	zoomControl: false, 
	attributionControl: false, 
	center: [40.697002, -74.024081],
	zoom: 11,
    layers: [OpenStreetMaps],
	maxBounds: [
	//south west
	[40.203852, -74.774383],
	//north east
	[41.088102, -73.178917]
	],
};


var map = L.map('map', mapOptions)


L.control.zoom({
     position:'topright'
}).addTo(map);




// Add and remove layers
map.on('overlayadd', function (eventLayer) {
	if (eventLayer.name === 'Ambulatory Difficulty') {
		legend6.addTo(map);
	} 	
	else if (eventLayer.name === 'Facilities') {
		legend_fac.addTo(map);
	} 	
});


// Add and remove layers
	map.on('overlayremove', function (eventLayer) {
		 if (eventLayer.name === 'Ambulatory Difficulty') {
	this.removeControl(legend6);
	}
		else if (eventLayer.name === 'Facilities') {
	this.removeControl(legend_fac);
	}
	});
	


var groupedOverlays = {
  "Group One": {
	"Zones": nyc_tz_geo,
	"Heatmap Test": heat
  },
  "Group Two": {
	"Ambulatory Difficulty": Ambulatory_Difficulty_Geo,	
	"Facilities": geojson_fac,
  }
};


//Init BaseMaps
var basemaps = {
  "OpenStreetMaps": OpenStreetMaps,
  
  "Google-Map": L.tileLayer(
    "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
    {
      minZoom: 11,
      maxZoom: 18,
      id: "google.street"
    }
  ),
  "Google-Satellite": L.tileLayer(
    "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
      minZoom: 11,
      maxZoom: 18,
      id: "google.satellite"
    }
  ),
  "Google-Hybrid": L.tileLayer(
    "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    {
      minZoom: 11,
      maxZoom: 18,
      id: "google.hybrid"
    }
  )
};







//Render Zoom Control
var sidebar = L.control.sidebar({
    autopan: true,
    container: "sidebar",
    position: "left"
  })
  .addTo(map);
 
 
 
//Render Layer Control & Move to Sidebar
var layerControl = L.control.groupedLayers(basemaps, groupedOverlays, {position: "topleft", collapsed: false, collapsibleGroups: true}).addTo(map);
var oldLayerControl = layerControl.getContainer();
var newLayerControl = $("#layercontrol");
newLayerControl.append(oldLayerControl);
$(".leaflet-control-layers-list").prepend("<strong class='title'>Base Maps</strong><br>");
$(".leaflet-control-layers-separator").after("<br><strong class='title'>Layers</strong>");
  




  });

  
  
  
  
  
  


var popupTemplate_fac_geo = document.querySelector('.popupTemplate_fac_geo').innerHTML;


var popupTemplate_Ambulatory_Difficulty = document.querySelector('.popupTemplate_Ambulatory_Difficulty').innerHTML;


