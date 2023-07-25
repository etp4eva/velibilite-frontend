import React from 'react'

type HeaderProps = {
    selectedLayer: string,
    setSelectedLayer: React.Dispatch<React.SetStateAction<string>>,
}

const Header = (props: HeaderProps) => {
    
    return (
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
                <select 
                    name="layer" 
                    id="layer-select" 
                    onChange={ (event) => {
                        const value = event.currentTarget.value;
                        props.setSelectedLayer(value);
                    }}
                >
                    <option value="stations">Stations</option>
                    <option value="communes">Communes</option>
                    <option value="nhoods">Neighbourhoods</option>                                     
                    <option value="arronds">Arrondissements</option>
                </select>
            </div>
            <div
                style={{
                    flexGrow: 2
                }}
            >
                <select 
                    name="bike-type" 
                    id="bike-type-select"
                    style={{
                        visibility: props.selectedLayer != 'stations' ? 'visible' : 'hidden'
                    }}
                >
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
                <select 
                    name="day" 
                    id="day-select"
                    style={{
                        visibility: props.selectedLayer != 'stations' ? 'visible' : 'hidden'
                    }}
                >
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
                    style={{
                        visibility: props.selectedLayer != 'stations' ? 'visible' : 'hidden'
                    }}
                />
            </div>
        </header>
    )
}

export default Header;