var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
});
var osm_mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var osm_topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
var map = L.map('map', {
    center: [40.85, -8.41],
    minZoom: 11,
    maxZoom: 13,
    zoom: 12,
    layers: [CartoDB_Positron]
});
var baseMaps = {
    "CartoDB": CartoDB_Positron,
    "OpenStreetMap": osm_mapnik,
    "OpenTopoMap": osm_topo,
    "Satélite": Esri_WorldImagery
};
//Layers temáticos
var dp2011 = L.geoJSON(vcpop, {
    style: dp2011_style,
    zindex: 2,
    onEachFeature: atributos
});
var dp2021 = L.geoJSON(vcpop, {
    style: dp2021_style,
    zindex: 2,
    onEachFeature: atributos
});
var varpop = L.geoJSON(vcpop, {
    style: varpop_style,
    zindex: 2,
    onEachFeature: atributos
}).addTo(map);
var conc = L.geoJSON(conc, {
    style: conc_style,
    zindex: 10
}).addTo(map);

var overlayMaps = {
    "População":{
        "Variação 2011-2021 (%)": varpop,
        "Densidade (hab/km2) - 2021": dp2021,
        "Densidade (hab/km2) - 2011": dp2011        
    }
};
var tema = "VarPop";

var options = {
    exclusiveGroups: ["População"],
    groupCheckboxes: true,
    collapsed: false
};
var layerControl = L.control.groupedLayers(baseMaps, overlayMaps, options);
map.addControl(layerControl);

//Extent
var bounds = varpop.getBounds();
map.fitBounds(varpop.getBounds());
map.setMaxBounds(bounds);

//Caixa de texto com os atributos
var info = L.control({position: "bottomleft"});
info.onAdd = function(map){
    var div_info = L.DomUtil.create("div", "info");
    div_info.innerHTML = '<p id="infoPop"></p></div>';
    return div_info;
};
info.addTo(map);
var info_p = document.getElementById("infoPop");



//o evento de fecho terá de ser feito através do remove control, tal como a mudança de legenda

//Caixa de informação
/*
$('#close-btn').click(function () {
    $('body, #div-to-atributos').hide();
    event.stopPropagation(); //Disable click propagation on the parent Layer (otherwise when you click your slider it will go through to the map below)
})*/

// Carrega os atributos para: tooltip, caixa de texto
function atributos(feature, layer) {
    layer.bindTooltip(feature.properties.Des_Simpli);
    layer.addEventListener("mouseover", highlightFeature);
    layer.addEventListener("mouseout", resetHighlight);
}

//Simbologia dos layers temáticos
function conc_style(feature) {
    return {
        color: "black",
        weight: 2.0,
        fill: false
    };
}

function varpop_style(feature) {
    return {
        fillColor: varpop_color(feature.properties.v_pop),
        weight: 0.5,
        opacity: 1,
        color: "#737373", 
        fillOpacity: 0.8
    };
}
function varpop_color(d) {
    if(d > 5) return "#91cf60";
    if(d > 0) return "#d9ef8b";
    if(d > -5) return "#ffffbf";
    if(d > -10) return "#fee08b";
    if(d > -15) return "#fdae61";
    if(d > -20) return "#f46d43";
    return "#d73027";
}
function dp2021_style(feature) {
    return {
        fillColor: dp_color(feature.properties.DP_2021),
        weight: 0.5,
        opacity: 1,
        color: "#737373", 
        fillOpacity: 0.8
    };
}
function dp2011_style(feature) {
    return {
        fillColor: dp_color(feature.properties.DP_2011),
        weight: 0.5,
        opacity: 1,
        color: "#737373", 
        fillOpacity: 0.8
    };
}
function dp_color(d) {
    if(d > 1500) return "#4a1486";
    if(d > 1000) return "#6a51a3";
    if(d > 500) return "#807dba";
    if(d > 300) return "#9e9ac8";
    if(d > 150) return "#bcbddc";
    if(d > 50) return "#dadaeb";
    return "#f2f0f7";
}    

var leg_VarPop = L.control({position: "topright"});
leg_VarPop.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legenda");
    div.innerHTML =
    '<small>%</small><br>' +
    '<div style="background-color: #91cf60"></div> 5 a 10<br>' +
    '<div style="background-color: #d9ef8b"></div> 0 a 5<br>' +
    '<div style="background-color: #ffffbf"></div> -5 a 0<br>' +
    '<div style="background-color: #fee08b"></div> -10 a -5<br>' +
    '<div style="background-color: #fdae61"></div> -15 a -10<br>' +
    '<div style="background-color: #f46d43"></div> -20 a -10<br>' + 
    '<div style="background-color: #d73027"></div> -25 a -20<br>';
    return div;
};

var leg_DPop = L.control({position: "topright"});
leg_DPop.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legenda");
    div.innerHTML =
    '<small>hab/km2</small><br>' +
    '<div style="background-color: #f2f0f7"></div> < a 50<br>' +
    '<div style="background-color: #dadaeb"></div> 50 a 150<br>' +
    '<div style="background-color: #bcbddc"></div> 150 a 300<br>' +
    '<div style="background-color: #9e9ac8"></div> 300 a 500<br>' +
    '<div style="background-color: #807dba"></div> 500 a 1000<br>' +
    '<div style="background-color: #6a51a3"></div> 1000 a 1500<br>' +
    '<div style="background-color: #4a1486"></div> > 1500<br>';
    return div;
    };
leg_VarPop.addTo(map);

//Alteração da legenda em função do layer temático seleccionado
map.on('overlayadd', function (eventLayer) {
    // Switch to the Population legend...
    if (eventLayer.name === 'Variação 2011-2021 (%)') {
        this.removeControl(leg_DPop);
        leg_VarPop.addTo(this);
        tema = "VarPop";
    } else { // Or switch to the Population Change legend...
        this.removeControl(leg_VarPop);
        leg_DPop.addTo(this);
        tema = "DPop";
    }
})


function highlightFeature(e) {
    e.target.setStyle({weight: 5, color: "red", fillOpacity: 0.3});
    e.target.bringToFront();
    info_p.innerHTML = "<i>Concelho:</i> " + e.target.feature.properties.Concelho +  "<br><i>Freguesia:</i> " + e.target.feature.properties.Des_Simpli + "<br><i>Área:</i> " + e.target.feature.properties.Area_km2_1 + " km<sup>2</sup>" + "<br><i>População residente: 2021:</i> " + e.target.feature.properties.HM_2021 + " | <i>2011:</i> " + e.target.feature.properties.HM_2011 + "<br><i>Variação da população:</i> " + e.target.feature.properties.v_pop + "%<br><i>Densidade populacional (hab/km<sup>2</sup>): 2021:</i> " + e.target.feature.properties.DP_2021 + " | <i> 2011: </i>" + e.target.feature.properties.DP_2011;

    //document.getElementById("info").style.display = "none";
}
function resetHighlight(e) {

    if (tema === "VarPop") {
            varpop.resetStyle(e.target);
    } else {
        dp2011.resetStyle(e.target);
    }
    /*
    if (e.target.na === 'Variação 2011-2021 (%)') {
    varpop.resetStyle(e.target);
    } 
    /*
    else { // Or switch to the Population Change legend...
        this.removeControl(leg_VarPop);
        leg_DPop.addTo(this);
    }*/


    
    info_p.innerHTML = "";
}





var scale = L.control.scale();
scale.addTo(map);

map.attributionControl.setPrefix(
    '&copy; <i>yMaps</i>' + ' | Dados: <a href="https://ine.pt">INE</a> | <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
);