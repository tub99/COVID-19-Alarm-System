import React from 'react';

const Tooltip = (props) => {
    if(!Object.keys(props).length) return (<></>);
    return (
        <div style={{ left: props.style.left + 'px', top: props.style.top + 'px', opacity: props.style.opacity }} className="tooltip">
            {props.children}
        </div>
    )
}

export default Tooltip;