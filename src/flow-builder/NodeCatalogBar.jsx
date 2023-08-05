import React from 'react';
import grip_vertical from './images/icons/grip-vertical.svg';
import toggle_left from './images/icons/toggle-left.svg';
import python from './images/icons/python.svg';
import './style.css';
function NodeClass() {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex w-full h-18 bg-white rounded border border-slate-800 cursor-grabbing"
            onDragStart={(event) => onDragStart(event, 'input')}
            draggable
        >
            <div className="flex flex-col justify-center">
                <img src={grip_vertical} alt="Drag and Drop" className="w-2 mx-2 opacity-40"/>
            </div>
            <div className="flex flex-col justify-center">
                <img src={python} alt="PythonProvider" className="mr-4 w-12 h-12"/>
            </div>
            <div className="flex flex-col py-2 pl-2">
                <div className="text-left"><strong>PythonOperator</strong></div>
                <div className="text-left">Execute a Python function</div>
            </div>
        </div>
    );
}

export default () => {
    let nodes = [];
    for (let i = 0; i < 20; i++) {
        nodes.push(<NodeClass/>);
    }

    return (
        <aside className="flex flex-col flex-[1_1_25%] w-1/4 h-screen px-7 box-border bg-slate-50">
            <div className="flex mt-7 mb-5">
                <div className="flex-1">Dag Catalog</div>
                <img src={toggle_left} alt="Open / Close" className="w-6 h-6 cursor-pointer"/>
            </div>
            <div className="mb-10 pr-3 grid gap-2 overflow-y-scroll scroll-smooth">
                {nodes}
            </div>
        </aside>
    );
};
