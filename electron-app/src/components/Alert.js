import React from 'react';
import '../stylesheets/Alert.css';

export default function Alert(props) {
    if (!props.options) {
        return null;
    }

    let color = '#6C6C6C';
    if (props.options.type === -1) {
        color = '#d45252';  // see: var(--error)
    } else if (props.options.type === 1) {
        color = '#00CF1F';
    }
    let border = '1px solid ' + color;
    return (
        <div className="alert-wrapper">
            <div className="alert-box" style={{ border: border, color: color}}>
                <span className="x-close" onClick={props.closePopup} />
                <b>{props.options.title}</b>
                {props.children}
            </div>
        </div>
    )
}