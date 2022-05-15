//MAPAS DE BASE
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
//PARÂMETROS PARA ABRIR O MAPA
var map = L.map('map', {
    center: [40.85, -8.41],
    minZoom: 11,
    maxZoom: 13,
    zoom: 12,
    layers: [CartoDB_Positron]
});
//GRUPO COM OS MAPAS DE BASE
var baseMaps = {
    "CartoDB": CartoDB_Positron,
    "OpenStreetMap": osm_mapnik,
    "OpenTopoMap": osm_topo,
    "Satélite": Esri_WorldImagery
};
//CONTROL COM MAPAS DE BASE
L.control.layers(baseMaps, null, {
    collapsed: false
}).addTo(map);
//lAYER TEMÁTICO
var varpop = L.geoJSON(vcpop, {
    style: varpop_style,
    zindex: 2,
    onEachFeature: atributos
}).addTo(map);
//EXTENT
var bounds = varpop.getBounds();
map.fitBounds(varpop.getBounds());
map.setMaxBounds(bounds);
// Carrega os atributos para: tooltip, caixa de texto
function atributos(feature, layer) {
    layer.bindTooltip(feature.properties.Des_Simpli);
    layer.addEventListener("mouseover", highlightFeature);
    layer.addEventListener("mouseout", resetHighlight);
}
//Simbologia dos layers temáticos
function varpop_style(feature) {
    return {
        fillColor: varpop_color(feature.properties.v_pop),
        weight: 0.5,
        opacity: 1,
        color: "#737373",
        fillOpacity: 0.8
    };
}
//Em baixo, alternativa com array
function varpop_color(d) {
    if(d > 5) return "#91cf60";
    if(d > 0) return "#d9ef8b";
    if(d > -5) return "#ffffbf";
    if(d > -10) return "#fee08b";
    if(d > -15) return "#fdae61";
    if(d > -20) return "#f46d43";
    return "#d73027";
}
// Alternativa com array (ainda não funciona)
/*
let breaks = [-Infinity, -20, -15, -10, -5, 0, 5, Infinity];
let colors = ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60"];

function varpop_color(d){
  for(let i = 0; i < breaks.lentgh; i++){
    if(d > breaks[i] && d <= breaks[i+1]){
      return colors[i];
    }
  }
}
*/
//LEGENDA
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
leg_VarPop.addTo(map);
//REALCE DE SELEÇÃO
function highlightFeature(e) {
    e.target.setStyle({weight: 5, color: "red", fillOpacity: 0.3});
    e.target.bringToFront();
}
function resetHighlight(e) {
    varpop.resetStyle(e.target);
}
//ESCALA
var scale = L.control.scale();
scale.addTo(map);
//CRÉDITOS
map.attributionControl.setPrefix(
    '&copy; <i>yMaps</i>' + ' | Dados: <a href="https://ine.pt">INE</a> | <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
);
