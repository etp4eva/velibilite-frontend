import * as _ from 'lodash';
import "leaflet/dist/leaflet.css";
import { TileLayer } from "react-leaflet";
import "./styles.css";
import React, { useEffect, useState } from "react";
import {createRoot} from "react-dom/client";
import { MapContainer } from 'react-leaflet';
import DataLayer from './components/DataLayer';
import Header from './components/Header';
import loadingImg from './images/bike.gif'
import { DayOfWeek, Layer, Legend, LegendCollection } from './types/types'
import TimeSelector from './components/TimeSelector';
import WebFont from 'webfontloader';

const loadingDiv = (
<div
    style={{
        position:'absolute',
        width: '100%',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 100,
        opacity: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}><img src={loadingImg} /></div>
)

const Content = () => {
    const [ selectedLayer, setSelectedLayer ] = useState<Layer>(Layer.Stations);    
    const [ selectedDay,   setSelectedDay   ] = useState<DayOfWeek>(DayOfWeek.Monday);
    const [ selectedHour,  setSelectedHour  ] = useState(0);
    const [ isLoading,     setLoading       ] = useState(true);
    
    const [ legends,       setLegends       ] = useState<LegendCollection>();

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Tajawal', 'Azeret Mono']
            }
        })
    }, [])
    
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
        >            
            <div className='title'>
                Vélibilité
            </div>
            <Header 
                selectedLayer={selectedLayer} 
                selectedHour={selectedHour}
                isLoading={isLoading}
                setSelectedLayer={setSelectedLayer} 
                setSelectedDay={setSelectedDay}
                setSelectedHour={setSelectedHour}
                setLoading={setLoading}                
            />
            { isLoading ? loadingDiv : null }
            <TimeSelector 
                setLoading={setLoading}
                setSelectedHour={setSelectedHour}
                isLoading={isLoading}
                selectedHour={selectedHour}
            />
            <MapContainer 
                center={[48.8570, 2.3502]}
                zoom={12}     
                preferCanvas={true}   
                style={{
                    width: '100%',
                    height: '100vh',
                    outline: 'none',
                    zIndex:'1',
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DataLayer 
                    selectedLayer={selectedLayer} 
                    dayOfWeek={selectedDay}
                    hourOfDay={selectedHour}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    setLegends={setLegends}
                />

            </MapContainer>
        </div>
    )
}

const root = createRoot(document.getElementById('content'));
root.render( <Content /> );