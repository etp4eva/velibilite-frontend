import * as _ from 'lodash';
import "leaflet/dist/leaflet.css";
import { TileLayer } from "react-leaflet";
import "./styles.css";
import React from "react";
import {createRoot} from "react-dom/client";
import { MapContainer } from 'react-leaflet';
import StationsLayer from './components/StationsLayer';

const root = createRoot(document.getElementById('content'));
root.render(
    <div
        style={{
            width: '100%',
            height: '100%',
        }}
    >
        <header
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: '5vh',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    backgroundColor: 'greenyellow',
                    width: 'auto',
                    alignItems: 'center',
                    paddingLeft: 5,
                    paddingRight: 5,
                }}
            >
                <h1 style={{
                    fontSize:'4cqh',
                    padding: 0,
                    margin: 0,
                }}>
                    Vélibilité
                </h1>
            </div>
            <div
                style={{
                    flexGrow: 2
                }}
            >
                <select name="layer" id="layer-select">
                    <option value="stations">Stations</option>
                    <option value="communes">Communes</option>
                    <option value="nhoods">Neighbourhoods</option>                                     
                    <option value="arrond">Arrondisements</option>
                </select>
            </div>
            <div
                style={{
                    flexGrow: 2
                }}
            >
                <select name="bike-type" id="bike-type-select">
                    <option value="all">All bikes</option>
                    <option value="green">Green bikes</option>
                    <option value="blue">Blue bikes</option>
                </select>
            </div>
            <div
                style={{
                    flexGrow: 2
                }}
            >
                <select name="day" id="day-select">
                    <option value="all">All days</option>
                    <option value="mon">Monday</option>
                    <option value="tue">Tuesday</option>
                    <option value="wed">Wednesday</option>
                    <option value="thu">Thursday</option>
                    <option value="fri">Friday</option>
                    <option value="sat">Saturday</option>
                    <option value="sun">Sunday</option>
                </select>
            </div>
            <div
                style={{
                    flexGrow: 3,
                }}
            >
                <input 
                    type='range'
                    min='0'
                    max='23'
                />
            </div>
        </header>
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
            <StationsLayer />

        </MapContainer>
    </div>
);