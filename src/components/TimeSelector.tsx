import React, { useState } from "react";
import '../styles.css'

type TimeSelectorProps = {
    selectedHour: number,
    isLoading: boolean,
    setSelectedHour: React.Dispatch<React.SetStateAction<number>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,    
}

const TimeSelector = (props: TimeSelectorProps) => {
    const [isOpen, setOpen] = useState(true);
    
    return (
        <footer className={ isOpen ? 'footer-open' : 'footer-closed' } >
            <button 
                className={`drawer-button ${isOpen ? 'drawer-down' : 'drawer-up'}`.trim()}
                onClick={() => {
                    if (isOpen) setOpen(false);
                    else setOpen(true);
                }}
            >﹀</button>
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
        </footer>
    )
}

export default TimeSelector;