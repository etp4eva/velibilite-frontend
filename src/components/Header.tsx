import React from 'react'
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
    
    return (
        <header
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: '5vh',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 10,
                paddingRight: 10,
            }}
        >
            <div
                style={{
                    display: 'flex',
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
                    display: 'flex',
                    flexDirection: 'row',
                    height: '5vh',
                    alignItems: 'center',
                }}
            >
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
                <div
                    style={{
                        flexGrow: 3,
                        paddingLeft: 5,
                        paddingRight: 5,
                    }}
                >
                    <input 
                        type='range'
                        min='0'
                        max='23'
                        defaultValue='0'
                        style={{
                            
                        }}

                        onChange={ (event) => {
                            //props.setLoading(true);
                            const value = event.currentTarget.value;                        
                            props.setSelectedHour(Number(value));                    
                        }}

                        onSelect={ (event) => {                        
                            
                        }}
                        disabled={props.isLoading}
                    />
                </div>
                <div
                    style={{
                        paddingLeft: 5,
                        paddingRight: 5,
                    }}
                >
                    { props.selectedHour.toString().padStart(2, '0') }h
                </div>
            </div>
        </header>
    )
}

export default Header;