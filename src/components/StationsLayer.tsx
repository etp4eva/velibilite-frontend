import L from "leaflet";
import React, { useEffect, useState } from "react";
import { Circle, CircleMarker, GeoJSON, Marker, Popup } from "react-leaflet";
import FeaturePopup from "./FeaturePopup";

const geojsonMarkerOptions = {

};

const StationsLayer = () => {
    const [data, setData] = useState<GeoJSON.FeatureCollection<GeoJSON.Point>>();
    
    useEffect(() => {
        const dataFetch = async () => {
            const response = await (
                await fetch(
                    'https://ericwebsite.info/velib/data/stations.geojson'
                )
            )
            const result = await response.json()

            if (response.ok)
            {
                setData(result);
            } else {
                console.log('Fetching stations data failed')
            }
        }

        dataFetch();
    }, []);

    /*
    const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
        layer.bindPopup(
            ReactDOMServer.renderToString(<FeaturePopup feature={feature}/>),
            { maxWidth: 1000 }
        )
    }*/

    // https://stackoverflow.com/questions/67460092/need-proper-way-to-render-jsx-component-inside-leaflet-popup-when-using-geojson
    if (data) {
        return (
            <>
            {data.features.map((feature, index) => {
                return (
                    <CircleMarker
                        key={index}
                        center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                        radius={8}
                        fillColor="#ff7800"
                        color="#000"
                        weight={1}
                        opacity={1}
                        fillOpacity={0.8}               
                    >
                        <Popup>
                            <FeaturePopup feature={feature}/>
                        </Popup>
                    </CircleMarker>
                )
            })}
            </>
        )
    } 
}   

export default StationsLayer;