import * as _ from 'lodash';
import "leaflet/dist/leaflet.css";
import { TileLayer } from "react-leaflet";
import "./styles.css";
import React from "react";
import {createRoot} from "react-dom/client";
import FeaturePopup from './components/FeaturePopup'
import { MapContainer } from 'react-leaflet';
import StationsLayer from './components/StationsLayer';

const root = createRoot(document.getElementById('map'));
root.render(
        <MapContainer 
            center={[48.8570, 2.3502]}
            zoom={12}     
            preferCanvas={true}   
            style={{height:'100%'}}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <StationsLayer />

        </MapContainer>
);

/*


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
*/