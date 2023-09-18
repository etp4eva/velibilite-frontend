import L, { LatLngExpression } from "leaflet";
import React, { useEffect, useState } from "react";
import { CircleMarker, LayersControl, Polygon, Popup, Tooltip } from "react-leaflet";
import FeaturePopup from "./FeaturePopup";
import { Legend, Layer, DayOfWeek, enumKeys, roundTo, avgArray, medArray, LegendCollection } from '../types/types';
import { Feature } from "geojson";

type DataLayerProps = {
    selectedLayer: Layer,
    dayOfWeek: DayOfWeek,
    hourOfDay: number,
    isLoading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLegends: React.Dispatch<React.SetStateAction<LegendCollection>>,
}

const base_url = 'https://ericwebsite.info/velib/data/'

const urls: {[name in Layer]: string} = {
    [Layer.Stations]:        base_url + 'stations.geojson',
    [Layer.Communes]:        base_url + 'commune.geojson',
    [Layer.Neighbourhoods]:  base_url + 'nhood.geojson',
    [Layer.Arrondissements]: base_url + 'arrond.geojson',
}

const colourBreaks = [
    '#f6eff7',
    '#d0d1e6',
    '#a6bddb',
    '#67a9cf',
    '#1c9099',
    '#016c59'
]

type PointFC = GeoJSON.FeatureCollection<GeoJSON.Point>;
type PolyFC = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type FeatureCollection = (PointFC | PolyFC) & { legend?: Legend };

type FetchedData = {
    [key in Layer] : FeatureCollection;
}

type LayerStats = {
    layer: Layer,
    mins: number[],
    minHist: {[key: number]: number},
    minAvg: number,
    minMed: number,
    maxes: number[],
    maxHist: {[key: number]: number},
    maxAvg: number,
    maxMed: number,
}

const calculateLayerStats = (layer: Layer, featureCollection: FeatureCollection): LayerStats => {

    let minsMaxes: LayerStats = {
        layer: layer,
        mins: [],
        minHist: {},
        minAvg: 0,
        minMed: 0,
        maxes: [],
        maxHist: {},
        maxAvg: 0,
        maxMed: 0,
    }

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        for (let hourOfDay = 0; hourOfDay < 24; hourOfDay++) {
            let max = Number.NEGATIVE_INFINITY
            let min = Number.POSITIVE_INFINITY
            
            featureCollection.features.forEach((feature, index) => {
                // TODO: Less naive break algorithmd
                const vals = feature.properties.values[dayOfWeek][hourOfDay]
                const pct = (vals.g + vals.b) / feature.properties.capacity;
                feature.properties.values[dayOfWeek][hourOfDay].percentFull = pct;

                if (pct >= 1.0 || pct <= 0.0) {
                    return;
                }

                if (pct > max) max = pct;
                if (pct < min) min = pct;
            })

            minsMaxes.mins.push(min);
            minsMaxes.maxes.push(max);
            
            const minRound: number = roundTo(min, 2);
            const maxRound: number = roundTo(max, 2);

            if (minRound in minsMaxes.minHist)
            {
                minsMaxes.minHist[minRound] += 1;
            } else {
                minsMaxes.minHist[minRound] = 1;
            }

            if (maxRound in minsMaxes.maxHist)
            {
                minsMaxes.maxHist[maxRound] += 1;
            } else {
                minsMaxes.maxHist[maxRound] = 1;
            }
        }
    }

    minsMaxes.maxAvg = avgArray(minsMaxes.maxes)
    minsMaxes.minAvg = avgArray(minsMaxes.mins)

    minsMaxes.maxMed = medArray(minsMaxes.maxes)
    minsMaxes.minMed = medArray(minsMaxes.mins)

    return minsMaxes;
}

const calculateLegend = (layerStats: LayerStats): Legend => {    
    const min = layerStats.minMed;
    const max = layerStats.maxMed;    
    const step = (max - min) / (colourBreaks.length - 1);

    let legend: Legend = {};

    let lastValue = min   

    for (let i = 1; i <= colourBreaks.length; i++)
    {
        let nextValue: number = (min + (i * step));

        let labelStr = `${roundTo(lastValue * 100.0, 1).toFixed(1)}% - ${roundTo(nextValue * 100.0, 1).toFixed(1)}%`;

        if (i == colourBreaks.length) {
            labelStr = `>= ${roundTo(lastValue * 100.0, 1).toFixed(1)}%`;
        } else if (i == 1) {
            labelStr = `< ${roundTo(nextValue * 100.0, 1).toFixed(1)}%`;
        }
        
        legend[nextValue] = {
            fillColor: colourBreaks[i - 1],
            label: labelStr,
        };

        lastValue = nextValue;
    }

    return legend;
}

const applyShading = (featureCollection: FeatureCollection): FeatureCollection => {
    let outFeatureCollection = featureCollection;

    outFeatureCollection.features.forEach((feature, index) => {
        for (let dayOfWeek in feature.properties.values) {
            for (let hourOfDay in feature.properties.values[dayOfWeek]) {
                const pctFull = feature.properties.values[dayOfWeek][hourOfDay].percentFull;

                let fillColor = colourBreaks[0]
                let legend: Legend = outFeatureCollection.legend;                

                Object.keys(legend).every((key, idx) => {
                    const brk = Number(key)
                    
                    // Adding small value to account for rounding errors
                    if (pctFull < brk+0.001)                    
                    {
                        fillColor = legend[brk].fillColor;
                        return false;
                    }

                    const numKeys = Object.keys(legend).length;
                    if (idx == numKeys - 1)
                    {
                        fillColor = legend[brk].fillColor;
                        return false;
                    }
                    
                    return true;
                })

                feature.properties.values[dayOfWeek][hourOfDay].fillColor = fillColor;
                outFeatureCollection.features[index] = feature;
            }
        }
        
    })            
    
    return(outFeatureCollection);
}

const calculateGeometry = (featureCollection: FeatureCollection) => {  
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

const calculateValues = (layer: Layer, featureCollection: FeatureCollection) => {    
    let newFC = featureCollection;
    const layerStats = calculateLayerStats(layer, newFC);
    newFC.legend = calculateLegend(layerStats);
    newFC = applyShading(newFC);
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

    useEffect(() => {
        fetchLayersData();
    }, []);

    const fetchLayersData = async () => {
        let lyrs: FetchedData = layers;
        let legends: LegendCollection = {
            stations: null,
            communes: null,
            nhoods: null,
            arronds: null,
        };

        for (const key of enumKeys(Layer)) {
            lyrs[Layer[key]] = await fetchLayerData(Layer[key]);
            legends[Layer[key]] = lyrs[Layer[key]].legend;
        }
        
        setLayers({...lyrs});
        props.setLegends(legends);
        props.setLoading(false);
    }

    const fetchLayerData = async (layer: Layer) => {
        const response = await (
            await fetch(
                urls[layer]
            )
        )
        let result = await response.json()
    
        if (response.ok)
        {            
            return calculateValues(layer, result);
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
                                    pathOptions={{fillColor:fillColor}}
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
                            const percentFull = feature.properties.values[props.dayOfWeek][props.hourOfDay].percentFull;
                            return (
                                <Polygon
                                    key={index}
                                    positions={feature.properties.geom}
                                    pathOptions={{fillColor:fillColor}}
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
                    })
                }</>
            )
        }
    }
}   

export default DataLayer;