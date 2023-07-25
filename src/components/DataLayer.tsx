import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { Circle, CircleMarker, Marker, Polygon, Popup } from "react-leaflet";
import FeaturePopup from "./FeaturePopup";
import { GeoJSON } from "geojson";

type DataLayerProps = {
    selectedLayer: string,
}

const base_url = 'https://ericwebsite.info/velib/data/'

const urls: {[name: string]: string} = {
    'stations': base_url + 'stations.geojson',
    'communes': base_url + 'commune.geojson',
    'nhoods': base_url + 'nhood.geojson',
    'arronds': base_url + 'arrond.geojson',
}

const DataLayer = (props: DataLayerProps) => {
    const layers = {
        stations: null as GeoJSON.FeatureCollection<GeoJSON.Point>,
        communes: null as GeoJSON.FeatureCollection<GeoJSON.Polygon>,
        nhoods: null as GeoJSON.FeatureCollection<GeoJSON.Polygon>,
        arronds: null as GeoJSON.FeatureCollection<GeoJSON.Polygon>,
    }

    const [data, setData] = useState<
        GeoJSON.FeatureCollection<GeoJSON.Point> | 
        GeoJSON.FeatureCollection<GeoJSON.Polygon>
    >();
    
    const fetchLayerData = async (layer: string) => {
        console.log(urls[layer])
        const response = await (
            await fetch(
                urls[layer]
            )
        )
        const result = await response.json()

        if (response.ok)
        {
            setData(result);
        } else {
            console.log(`Fetching data failed: ${layer}`)
        }
    }

    useEffect(() => {
        fetchLayerData(props.selectedLayer);
    }, [props.selectedLayer]);

    // https://stackoverflow.com/questions/67460092/need-proper-way-to-render-jsx-component-inside-leaflet-popup-when-using-geojson
    if
     (data) {
        return (
            <>
            {data.features.map((feature, index) => {
                if (feature.geometry.type === 'Point') {
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
                            <Popup maxWidth={1000}>
                                <FeaturePopup feature={feature}/>
                            </Popup>
                        </CircleMarker>
                    )
                } else if (feature.geometry.type === 'Polygon') {
                    let geom: LatLngExpression[][] = [[]];
                    feature.geometry.coordinates[0].forEach((value) => {
                        geom[0].push([value[1], value[0]])
                    })
                    
                    return (
                        <Polygon
                            key={index}
                            positions={geom}
                            fillColor="#ff7800"
                            color="#000"
                            weight={1}
                            opacity={1}
                            fillOpacity={0.8}               
                        >
                            <Popup maxWidth={1000}>
                                <FeaturePopup feature={feature}/>
                            </Popup>
                        </Polygon>
                    )
                }
            })}
            </>
        )
    }
}   

export default DataLayer;