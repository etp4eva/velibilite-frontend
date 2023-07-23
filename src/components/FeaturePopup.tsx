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
                label: 'Green bikes',
                data: green,
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
            },
            {
                label: 'Blue bikes',
                data: blue,
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
            },
        ],
    }
    
    return <Bar options={options} data={data} />
}

let days_of_week = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'All'
]

const FeaturePopup = ({feature}: FeaturePopupProps) => {    
    const [day_of_week, setDayOfWeek] = useState(0);

    return (
      <div style={{ fontSize: "12px", color: "black" }}>
        <p><b>Station ID:</b> {feature.properties.station_id}</p>
        <p style={{textAlign:'center'}}>
            <button onClick={() => {
                if (day_of_week - 1 < 0) {
                    setDayOfWeek(7)
                } else {
                    setDayOfWeek(day_of_week - 1)
                }
                console.log(day_of_week)
            }}>⬅️</button>
            { days_of_week[day_of_week] } 
            <button onClick={() => {
                if (day_of_week + 1 > 7) {
                    setDayOfWeek(0)
                } else {
                    setDayOfWeek(day_of_week + 1)
                }
            }}>➡️</button>            
        </p>
        <TimeFrequencyChart feature={feature} day_of_week={day_of_week} />
      </div>
    );
};

export default FeaturePopup;