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
    
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <Header 
                selectedLayer={selectedLayer} 
                setSelectedLayer={setSelectedLayer} 
            />
            <MapContainer 
                center={[48.8570, 2.3502]}
                zoom={12}     
                preferCanvas={true}   
                style={{
                    width: '100%',
                    height: '95vh',
                    outline: 'none',
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DataLayer selectedLayer={selectedLayer} />

            </MapContainer>
        </div>
    )
}

const root = createRoot(document.getElementById('content'));
root.render( <Content /> );