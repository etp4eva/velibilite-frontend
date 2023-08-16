import React, { useState } from "react";
import '../styles.css'

type TimeSelectorProps = {
    selectedHour: number,
    isLoading: boolean,
    setSelectedHour: React.Dispatch<React.SetStateAction<number>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,    
}

const TimeSelector = (props: TimeSelectorProps) => {
    
    return (
        <div className='time-selector-div'>
            <input 
                type='range'
                min='0'
                max='23'
                defaultValue='0'

                onChange={ (event) => {
                    const value = event.currentTarget.value;                        
                    props.setSelectedHour(Number(value));                    
                }}

                disabled={props.isLoading}
            />
            <div className='time-selector-time'>
                { props.selectedHour.toString().padStart(2, '0') }h
            </div>
        </div>
    )
}

export default TimeSelector;