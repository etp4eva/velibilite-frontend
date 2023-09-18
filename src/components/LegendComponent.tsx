import React, { useEffect, useState } from "react";
import { Legend, enumKeys } from "../types/types";

type LegendProps = {
    legend: Legend,
}

const LegendComponent = (props: LegendProps) => {
    const [isOpen, setOpen] = useState(true);

    if (!(props.legend)) {
        return <></>;
    }        

    const classes = `legend ${isOpen ? 'legend-open' : 'legend-closed'}`

    return (
        <div className={ classes }>
            <table>
                <caption>Capacité Utilisée</caption>
                {  
                    Object.keys(props.legend).map((key: string) => {
                        return (
                            <tr>
                                <td className="legend-label">
                                    {props.legend[key].label}
                                </td>
                                <td 
                                    className="legend-colour-box" 
                                    style={{
                                        backgroundColor: props.legend[key].fillColor,
                                    }}
                                ></td>
                            </tr>
                        )
                    }) 
                }
            </table>
            <button 
                className={`legend-button ${isOpen ? 'legend-button-open' : 'legend-button-closed'}`.trim()}
                onClick={() => {
                    if (isOpen) setOpen(false);
                    else setOpen(true);
                }}
            >﹀</button>
        </div>
    )
}

export default LegendComponent;