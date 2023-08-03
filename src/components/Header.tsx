import React from 'react'

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
                        <option value="stations">Stations</option>
                        <option value="communes">Communes</option>
                        <option value="nhoods">Neighbourhoods</option>                                     
                        <option value="arronds">Arrondissements</option>
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
                        <option value="all">All bikes</option>
                        <option value="green">Green bikes</option>
                        <option value="blue">Blue bikes</option>
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
                        disabled={props.isLoading || props.selectedLayer == 'stations'}
                        
                    >
                        <option value="7">All days</option>
                        <option value="0">Monday</option>
                        <option value="1">Tuesday</option>
                        <option value="2">Wednesday</option>
                        <option value="3">Thursday</option>
                        <option value="4">Friday</option>
                        <option value="5">Saturday</option>
                        <option value="6">Sunday</option>
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
                    {props.selectedHour.toString().padStart(2, '0')}h
                </div>
            </div>
        </header>
    )
}

export default Header;