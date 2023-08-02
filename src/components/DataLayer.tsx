import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { Circle, CircleMarker, Marker, Polygon, Popup, Tooltip } from "react-leaflet";
import FeaturePopup from "./FeaturePopup";
import { GeoJSON } from "geojson";
import { fill } from "lodash";

type DataLayerProps = {
    selectedLayer: string,
    dayOfWeek: number,
    hourOfDay: number,
    isLoading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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

type PointFC = GeoJSON.FeatureCollection<GeoJSON.Point>;
type PolyFC = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

type FetchedData = {
    [key: string]: PointFC | PolyFC,
    stations : PointFC,
    communes : PolyFC,
    nhoods   : PolyFC,
    arronds  : PolyFC,
}

const calculateBreaks = (featureCollection: PointFC | PolyFC): PointFC | PolyFC => {
    let outFeatureCollection = featureCollection;

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        for (let hourOfDay = 0; hourOfDay < 24; hourOfDay++) {
            let max = Number.NEGATIVE_INFINITY
            let min = Number.POSITIVE_INFINITY
            
            outFeatureCollection.features.forEach((feature, index) => {
                // TODO: Less naive break algorithm
                const vals = feature.properties.values[dayOfWeek][hourOfDay]
                const pct = (vals.g + vals.b) / feature.properties.capacity;
                feature.properties.values[dayOfWeek][hourOfDay].percentFull = pct;

                if (pct > max) max = pct;
                if (pct < min) min = pct;

                outFeatureCollection.features[index] = feature;
            })

            let breaks: {[brk: number]: string} = {}
            const step = (max - min) / 5;
            for (let i = 0; i < 5; i++)
            {
                breaks[(min + (i * step))] = colourBreaks[i];
            }

            outFeatureCollection.features.forEach((feature, index) => {
                const pctFull = feature.properties.values[dayOfWeek][hourOfDay].percentFull;
                let fillColor = colourBreaks[0]

                Object.keys(breaks).every((key, idx) => {
                    const brk = Number(key)                    
                    if (pctFull <= brk)                    
                    {
                        fillColor = breaks[brk]
                        return false;
                    } 

                    return true;
                })

                feature.properties.values[dayOfWeek][hourOfDay].fillColor = fillColor;
                outFeatureCollection.features[index] = feature;
            })            
        }
    }
    
    return(outFeatureCollection);
}

const calculateGeometry = (featureCollection: PolyFC | PointFC) => {  
    let outFeatureCollection = featureCollection; 

    outFeatureCollection.features.forEach((feature, index) => {
        
        if (feature.geometry.type == 'Point') {
            let geom: LatLngExpression;
            geom = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

            feature.properties.geom = geom;
            outFeatureCollection.features[index] = feature;
        } else if (feature.geometry.type == 'Polygon') {
            let geom: LatLngExpression[][] = [[]];
            feature.geometry.coordinates[0].forEach((value) => {            
                geom[0].push([value[1], value[0]]);
            });

            feature.properties.geom = geom;            
            outFeatureCollection.features[index] = feature;
        }   

        
    })

    return outFeatureCollection;
}

const calculateValues = (featureCollection: PolyFC | PointFC) => {
    let newFC = featureCollection;
    newFC = calculateBreaks(newFC);
    newFC = calculateGeometry(newFC);

    return newFC;
}

const DataLayer = (props: DataLayerProps) => {
    const [layers, setLayers] = useState<FetchedData>({
        stations: null,
        communes: null,
        nhoods: null,
        arronds: null,
    });

    const [geom, setGeom] = useState<LatLngExpression[][]>([[]]);

    useEffect(() => {
        fetchLayersData();
    }, []);

    const fetchLayersData = async () => {
        let lyrs: FetchedData = layers;

        for (const key of Object.keys(urls)) {
            lyrs[key] = await fetchLayerData(key);            
        }

        setLayers(lyrs);
    }

    const fetchLayerData = async (layer: string) => {
        const response = await (
            await fetch(
                urls[layer]
            )
        )
        const result = await response.json()
    
        if (response.ok)
        {
            return calculateValues(result);
        } else {
            console.log(`Fetching data failed: ${layer}`)
        }
    }

    const isReady = () => {
        return Object.values(layers).every(x => x != null);      
    }

    // https://stackoverflow.com/questions/67460092/need-proper-way-to-render-jsx-component-inside-leaflet-popup-when-using-geojson

    if (isReady()) {   
        const layer = layers[props.selectedLayer];      

        if (props.selectedLayer == 'stations') {
            return (
                <>{
                    layer.features.map((feature, index) => {
                        const fillColor = feature.properties.values[props.dayOfWeek][props.hourOfDay].fillColor;
                        if (feature.geometry.type === 'Point') {                            
                            return (
                                <CircleMarker
                                    key={index}
                                    center={feature.properties.geom}
                                    radius={8}
                                    fillColor={fillColor}
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
                        }
                    })
                }</>               
            )
        } else {
            return (
                <>{
                    layer.features.map((feature, index) => {
                        if (feature.geometry.type === 'Polygon') {
                            const fillColor = feature.properties.values[props.dayOfWeek][props.hourOfDay].fillColor;
                            return (
                                <Polygon
                                    key={index}
                                    positions={feature.properties.geom}
                                    fillColor={fillColor}
                                    color="#000"
                                    weight={1}
                                    opacity={1}
                                    fillOpacity={0.8}               
                                >
                                    <Popup maxWidth={1000}>
                                        <p>{index}</p>
                                        <FeaturePopup feature={feature}/>                                
                                    </Popup>
                                    <Tooltip direction="center" offset={[0, 0]} opacity={1} permanent>{fillColor}</Tooltip>
                                </Polygon>
                            )
                        }
                    })
                }</>
            )
        }
    }
}   

export default DataLayer;