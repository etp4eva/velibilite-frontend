import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { Circle, CircleMarker, Marker, Polygon, Popup } from "react-leaflet";
import FeaturePopup from "./FeaturePopup";
import { GeoJSON } from "geojson";

type DataLayerProps = {
    selectedLayer: string,
    // TODO: day of week and hour
}

const base_url = 'https://ericwebsite.info/velib/data/'

const urls: {[name: string]: string} = {
    'stations': base_url + 'stations.geojson',
    'communes': base_url + 'commune.geojson',
    'nhoods': base_url + 'nhood.geojson',
    'arronds': base_url + 'arrond.geojson',
}

const colourBreaks = [
    '#f6eff7',
    '#bdc9e1',
    '#67a9cf',
    '#1c9099',
    '#016c59'
]

const day_of_week = 3;
const hour_of_day = 12;

let breaks: {[name: string]: string} = {}

const DataLayer = (props: DataLayerProps) => {
    const [data, setData] = useState<
        GeoJSON.FeatureCollection<GeoJSON.Point> | 
        GeoJSON.FeatureCollection<GeoJSON.Polygon>
    >();

    const calculateBreaks = (data: GeoJSON.FeatureCollection) => {        
        let max = Number.NEGATIVE_INFINITY
        let min = Number.POSITIVE_INFINITY
        
        data.features.forEach((feature) => {
            // TODO: Less naive break algorithm
            // TODO: get day of week and hour from props
            const vals = feature.properties.values[day_of_week][hour_of_day]
            const val = vals.g + vals.b
            if (val > max) max = val;
            if (val < min) min = val;
        })

        const step = (max - min) / 5;
        breaks = {}

        for (let i = 0; i < 5; i++)
        {
            breaks[(min + (i * step)).toString()] = colourBreaks[i];
        }
    }
    
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
            calculateBreaks(result);
            setData(result);
            console.log(breaks)
        } else {
            console.log(`Fetching data failed: ${layer}`)
        }
    }

    useEffect(() => {
        fetchLayerData(props.selectedLayer);
    }, [props.selectedLayer]);

    // https://stackoverflow.com/questions/67460092/need-proper-way-to-render-jsx-component-inside-leaflet-popup-when-using-geojson
    if (data) {
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

                    // TODO: get day of week and hour from props                    
                    const vals = feature.properties.values[day_of_week][hour_of_day]
                    const val = vals.g + vals.b

                    let fillColor = colourBreaks[0]

                    Object.keys(breaks).every((key) => {
                        if (Number(val) <= Number(key))
                        {

                            fillColor = breaks[key]
                            return false;
                        }

                        return true;
                    })
                    
                    return (
                        <Polygon
                            key={index}
                            positions={geom}
                            fillColor={fillColor}
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