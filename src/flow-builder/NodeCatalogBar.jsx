import React, {
    useCallback,
    useRef,
    useState
} from 'react';
import {
    Input,
    Collapse,
    initTE
} from "tw-elements";
import grip_vertical from './images/icons/grip-vertical.svg';
import toggle_left from './images/icons/toggle-left.svg';
import toggle_right from './images/icons/toggle-right.svg';
import python from './images/icons/python.svg';

function DraggableNode() {
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
                <img src={python} alt="Python" className="mr-4 w-12 h-12"/>
            </div>
            <div className="flex flex-col py-2 pl-2">
                <div className="text-left"><strong>PythonOperator</strong></div>
                <div className="text-left">Execute a Python function</div>
            </div>
        </div>
    );
}


export default () => {
    initTE({ Input, Collapse });

    const [isCollapsableHidden, setCollapsableHidden] = useState(false);
    const collapsableBarElement = useRef(null);

    const onClickToggleCollapse = useCallback((event) => {
        let collapse = new Collapse(collapsableBarElement.current, {toggle: false});
        if (collapsableBarElement.current.classList.contains('hidden')) {
            collapse.show();
        } else {
            collapse.hide();
        }
    }, []);

    window.addEventListener('hidden.te.collapse', () => {
        setCollapsableHidden(true)
    });

    window.addEventListener('shown.te.collapse', () => {
        setCollapsableHidden(false)
    });

    let nodes = [];
    for (let i = 0; i < 25; i++) {
        nodes.push(<DraggableNode/>);
    }


    return (
        <aside className="absolute z-10 flex flex-col min-w-[5rem] h-screen px-7 box-border bg-slate-50">
            <div
                className="flex flex-col h-screen w-96"
                ref={collapsableBarElement}
                data-te-collapse-show
                data-te-collapse-horizontal
            >
                {/* Seach Bar */}
                <div className="flex-1 relative mr-12 my-5 bg-white" data-te-input-wrapper-init>
                    <input
                        type="search"
                        className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="nodeFilterInput"
                        placeholder="Type query"
                    />
                    <label
                        htmlFor="nodeFilterInput"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Search modules</label>
                </div>

                {/* Nodes list */}
                <div className="mb-10 pr-3 grid gap-2 overflow-y-scroll scroll-smooth">{nodes}</div>

            </div>

            {/* Expand / Collapse button */}
            <div
                className="absolute my-5 right-7 flex flex-col justify-center cursor-pointer"
                title="Toggle"
                onClick={onClickToggleCollapse}
            >
                <img
                    src={isCollapsableHidden ? toggle_right : toggle_left}
                    alt="Toggle"
                    className="w-8 h-8"
                />
            </div>
        </aside>
    );
};
