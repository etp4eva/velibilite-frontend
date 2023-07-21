import React, { Component, useState } from "react";

type FeaturePopupProps = {
    feature: GeoJSON.Feature,
}

type TimeFrequencyChartProps = {
    feature: GeoJSON.Feature,
    day_of_week: number,
}

const TimeFrequencyChart = ({feature, day_of_week}: TimeFrequencyChartProps) => {
    if (day_of_week <= 6)
    {
        return (
            <table style={{ textAlign: 'center' }}>
            <tr>
                {
                    Object.keys(feature.properties.values[day_of_week]).map(hour =>
                        <td>{ feature.properties.values[day_of_week][hour].green_avg }</td>
                    )
                }
            </tr>
            <tr>
                {
                    Array.from({length:24},(v,k)=>k+1).map(hour =>
                        <td>{ hour }</td>
                    )
                }
            </tr>
            </table>
        )
    } else {
        let results = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        for (let hr = 0; hr <= 23; hr++)
        {
            for (let dow = 0; dow <= 6; dow++)
            {
                results[hr] = results[hr] + feature.properties.values[dow][hr].green_avg
            }

            results[hr] = results[hr] / 7;
        }
        
        return (
            <table style={{ textAlign: 'center' }}>
            <tr>
                {
                    results.map(val =>
                        <td>{ val }</td>
                    )
                }
            </tr>
            <tr>
                {
                    Array.from({length:24},(v,k)=>k+1).map(hour =>
                        <td>{ hour }</td>
                    )
                }
            </tr>
            </table>
        )
    }
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