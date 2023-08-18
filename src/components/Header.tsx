import React, { useState } from 'react'
import { Layer, BikeType, DayOfWeek, enumKeys } from '../types/types'

type HeaderProps = {
    selectedLayer: string,
    selectedHour: number,
    isLoading: boolean,
    setSelectedLayer: React.Dispatch<React.SetStateAction<string>>,
    setSelectedDay: React.Dispatch<React.SetStateAction<number>>,
    setSelectedHour: React.Dispatch<React.SetStateAction<number>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

const Header = (props: HeaderProps) => {
    const [isOpen, setOpen] = useState(true);

    return (
        <header className={ isOpen ? 'header-open' : 'header-closed' }>
            <div className='header-content'>
                <div
                    style={{
                        flexGrow: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                    }}
                >
                    <select 
                        name="layer" 
                        id="layer-select" 
                        onChange={ (event) => {
                            const value = event.currentTarget.value;
                            props.setSelectedLayer(value);
                        }}
                        disabled={props.isLoading}
                    >
                        { 
                            enumKeys(Layer).map(key => {
                                const value = Layer[key];
                                return (<option value={value}>{key}</option>)
                            }) 
                        }    
                    </select>
                </div>
                <div
                    style={{
                        flexGrow: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                    }}
                >
                    <select 
                        name="bike-type" 
                        id="bike-type-select"
                        disabled={props.isLoading || props.selectedLayer == 'stations'}
                    >
                        {
                            enumKeys(BikeType).map(key => {
                                const value = BikeType[key];
                                return (<option value={value}>{key} bikes</option>)
                            }) 
                        }
                    </select>
                </div>
                <div
                    style={{
                        flexGrow: 2,
                        paddingLeft: 5,
                        paddingRight: 5,
                    }}
                >
                    <select 
                        name="day" 
                        id="day-select"
                        onChange={ (event) => {                        
                            const value = event.currentTarget.value;
                            props.setSelectedDay(Number(value));
                        }}
                        disabled={ props.isLoading || props.selectedLayer == 'stations' }
                        defaultValue={ DayOfWeek.Monday }
                    >
                        {
                            enumKeys(DayOfWeek).map(key => {
                                const value = DayOfWeek[key];
                                /*
                                if (key == 'All') {
                                    return (<option value={value}>{key} Days</option>)
                                }*/
                                return (<option value={value}>{key}</option>)
                            }) 
                        }
                    </select>
                </div>
            </div>
            <button 
                className={`drawer-button ${isOpen ? 'drawer-up' : 'drawer-down'}`.trim()}
                onClick={() => {
                    if (isOpen) setOpen(false);
                    else setOpen(true);
                }}
            >﹀</button>
        </header>
    )
}

export default Header;