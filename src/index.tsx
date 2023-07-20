import * as _ from 'lodash';
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "./styles.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

type FeaturePopupProps = {
    feature: GeoJSON.Feature,
}

const FeaturePopup = ({feature}: FeaturePopupProps) => {
    return (
      <div style={{ fontSize: "12px", color: "black" }}>
        <p><b>Station ID:</b> {feature.properties.station_id}</p>
        <p>⬅️ Monday ➡️</p>
        <table>
        <tr>
            {
                Object.keys(feature.properties.values[0]).map(hour =>
                    <td>{ feature.properties.values[0][hour].green_avg }</td>
                )
            }
        </tr>
        </table>
      </div>
    );
  };

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
    layer.bindPopup(
        ReactDOMServer.renderToString(<FeaturePopup feature={feature}/>),
        { maxWidth: 1000 }
    )
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