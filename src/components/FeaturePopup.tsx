import React, { Component, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: false,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },

};

type FeaturePopupProps = {
    feature: GeoJSON.Feature,
}

type TimeFrequencyChartProps = {
    feature: GeoJSON.Feature,
    day_of_week: number,
}

type ValuesType = {
    g: number,
    b: number,
}

const TimeFrequencyChart = ({feature, day_of_week}: TimeFrequencyChartProps) => {
    let green = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let blue = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    if (day_of_week <= 6) {
        green = Object.values(feature.properties.values[day_of_week]).map((hour: ValuesType) =>
            { 
                return hour.g
            }
        )

        blue = Object.values(feature.properties.values[day_of_week]).map((hour: ValuesType) =>
            { 
                return hour.b
            }
        )
    } else {
        for (let hr = 0; hr <= 23; hr++)
        {
            for (let dow = 0; dow <= 6; dow++)
            {
                green[hr] = green[hr] + feature.properties.values[dow][hr].g
                blue[hr] = blue[hr] + feature.properties.values[dow][hr].b
            }

            green[hr] = green[hr] / 7;
            blue[hr] = blue[hr] / 7;
        }
    }

    const data = {
        labels: Array.from({length:24},(v,k)=>k+1),
        datasets: [
            {
                label: 'Mécanique',
                data: green,
                backgroundColor: '#016c59',
            },
            {
                label: 'Électriques',
                data: blue,
                backgroundColor: '#67a9cf',
            },
        ],
    }
    
    return <Bar options={options} data={data} />
}

let days_of_week = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Tous'
]

const formatDataRow = (title: string, data: string): React.JSX.Element => {
    return (
        <div className="data-line">
            <p className="data-label">
                {title}
            </p>
            <p className="data-value">
                {data}
            </p>
        </div>
    )
}

const getGeomIDJSX = (ftProps: {[name: string]: any}): React.JSX.Element => {

    if (ftProps.station_id) {
        return formatDataRow('Matricule', ftProps.station_id)
    }

    if (ftProps.nomcom) {
        return formatDataRow('Commune', ftProps.nomcom)
    }

    if (ftProps.l_qu) {
        return formatDataRow('Quartier', ftProps.l_qu)
    }

    if (ftProps.l_ar) {
        return formatDataRow('Arrondissement', ftProps.l_ar)
    }

    return null;
}

const FeaturePopup = ({feature}: FeaturePopupProps) => {    
    const [day_of_week, setDayOfWeek] = useState(0);

    let geom_id_jsx = getGeomIDJSX(feature.properties);

    return (
      <div style={{ fontSize: "12px", color: "black" }}>        
        <p style={{
            display:'flex',
            textAlign:'center',
            justifyContent: 'center',
            margin: '0'
        }}>
            <button 
                onClick={() => {
                    if (day_of_week - 1 < 0) {
                        setDayOfWeek(7)
                    } else {
                        setDayOfWeek(day_of_week - 1)
                    }
                }}

                className="popup-button"
            >
                <p>⬅️</p>
            </button>
            <p style={{
                display: 'flex',
                width: '33%',
                margin: 0,
                padding: 0,
                fontSize: 16,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                { days_of_week[day_of_week] }
            </p>
            <button 
                onClick={() => {
                    if (day_of_week + 1 > 7) {
                        setDayOfWeek(0)
                    } else {
                        setDayOfWeek(day_of_week + 1)
                    }
                }}

                className="popup-button"
            >
                <p>➡️</p>
            </button>
        </p>
        <TimeFrequencyChart feature={feature} day_of_week={day_of_week} />
        {geom_id_jsx}
        {formatDataRow('Capacité', feature.properties.capacity)}
      </div>
    );
};

export default FeaturePopup;