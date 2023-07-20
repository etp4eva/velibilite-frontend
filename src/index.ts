import * as _ from 'lodash';
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "./styles.css";

var mapOptions: L.MapOptions = {
    center: [48.8570, 2.3502],
    zoom: 12,
    preferCanvas: true,
}

var map = L.map("map", mapOptions)

var baselayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
)

baselayer.addTo(map);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

let onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    let output = feature.properties.station_id.toString()
    layer.bindPopup(output)
}

document.addEventListener("DOMContentLoaded", async () => {
    const response = await window.fetch('https://ericwebsite.info/velib/data/stations.geojson');
    const result: GeoJSON.FeatureCollection = await response.json()
    if (response.ok) {
        L.geoJSON(result, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions)
            },
            onEachFeature: onEachFeature,
        }).addTo(map)
    }
});