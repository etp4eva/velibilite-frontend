import * as _ from 'lodash';
import "leaflet/dist/leaflet.css";
import { TileLayer } from "react-leaflet";
import "./styles.css";
import React, { useState } from "react";
import {createRoot} from "react-dom/client";
import { MapContainer } from 'react-leaflet';
import DataLayer from './components/DataLayer';
import Header from './components/Header';

const Content = () => {
    const [ selectedLayer, setSelectedLayer ] = useState('stations');
    const [ selectedDay, setSelectedDay ] = useState(0);
    const [ selectedHour, setSelectedHour ] = useState(0);
    const [ isLoading, setLoading ] = useState(true);
    //console.log(isLoading)
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <Header 
                selectedLayer={selectedLayer} 
                selectedHour={selectedHour}
                setSelectedLayer={setSelectedLayer} 
                setSelectedDay={setSelectedDay}
                setSelectedHour={setSelectedHour}
                setLoading={setLoading}
            />
            {false /*isLoading*/ ? <div
                style={{
                    position:'absolute',
                    width: '100%',
                    height: '95vh',
                    backgroundColor: 'white',
                    zIndex: 100,
                    opacity: 0.5,
                }}
            ></div> : null }
            <MapContainer 
                center={[48.8570, 2.3502]}
                zoom={12}     
                preferCanvas={true}   
                style={{
                    width: '100%',
                    height: '95vh',
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
                />

            </MapContainer>
        </div>
    )
}

const root = createRoot(document.getElementById('content'));
root.render( <Content /> );