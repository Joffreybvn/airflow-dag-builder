import React, {
    useCallback, useEffect, useRef,
    useState
} from 'react';
import {
    Input,
    initTE
} from "tw-elements";
import axios from "axios";
import fuzzysort from 'fuzzysort'

import "./style.css"
import toggle_left from './static/icons/toggle-left.svg';
import toggle_right from './static/icons/toggle-right.svg';
import python from "./static/icons/python.svg";


function OperatorCatalogNode({data}) {

    // Make Node draggable
    const onDragStart = (event, nodeType) => {
        data['nodeType'] = nodeType
        event.dataTransfer.setData('application/reactflow', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex w-full h-18 bg-white rounded border border-slate-800 cursor-grabbing"
            title={data.name}
            onDragStart={(event) => onDragStart(event, 'default')}
            draggable
        >
            <div className="flex flex-col justify-center mx-2">
                <div className="w-1 h-5 border-x border-slate-500"></div>
            </div>
            <div className="flex flex-col justify-center">
                <img src={python} alt="Python" className="w-12 h-12"/>
            </div>
            <div className="flex flex-col py-2 pl-2">
                <div className="text-left w-64 truncate"><strong>{data.label}</strong></div>
                <div className="text-left w-64 truncate">Execute a Python function</div>
            </div>
        </div>
    );
}


export default () => {
    initTE({Input});

    const catalogSearchBar = useRef(null);
    const [collapsableCatalog, setCollapsableState] = useState(false);

    const [allOperatorNodesData, setAllOperatorNodesData] = useState([]);
    const [allOperatorCatalog, setAllOperatorCatalog] = useState([]);
    const [filteredOperatorCatalog, setFilteredOperatorCatalog] = useState([]);
    const [displayedOperatorCatalog, setDisplayedOperatorCatalog] = useState([]);

    // Expand / Collapse Catalog

    const onClickToggle = useCallback(
        () => setCollapsableState(!collapsableCatalog),
        [collapsableCatalog]
    );

    // Catalog fuzzy searching

    const onSearchInputChange = useCallback(
        (event) => {
            if (event.target.value === '') {
                setDisplayedOperatorCatalog(allOperatorCatalog);
            } else {
                let filteredOperators = fuzzysort.go(
                    event.target.value,
                    allOperatorNodesData,
                    {key: 'label'}
                )

                let new_nodes = []
                for (let operator of filteredOperators) {
                    new_nodes.push(<OperatorCatalogNode data={operator.obj}/>)
                }
                setFilteredOperatorCatalog(new_nodes);
                setDisplayedOperatorCatalog(new_nodes);
            }
        },
        [
            allOperatorNodesData,
            allOperatorCatalog,
            setFilteredOperatorCatalog,
            setDisplayedOperatorCatalog
        ]
    )

    const loadAllOperatorDefinitionsFromAPI = () => {
        return axios.get('http://0.0.0.0:8000/demo-data.json')
            .then((response) => response.data)
    }

    const createAllOperatorNodesData = (allOperatorDefinitions) => {
        let new_nodes = []
        for (let operator of allOperatorDefinitions) {
            new_nodes.push(<OperatorCatalogNode data={operator}/>)
        }
        setAllOperatorCatalog(new_nodes);
        setDisplayedOperatorCatalog(new_nodes);
    }

    useEffect(
        () => {
            loadAllOperatorDefinitionsFromAPI().then((allOperatorDefinitions) => {
                setAllOperatorNodesData(allOperatorDefinitions);
                createAllOperatorNodesData(allOperatorDefinitions);
            });
        }, [
            setAllOperatorNodesData,
            setAllOperatorCatalog,
            setDisplayedOperatorCatalog
        ]
    )

    return (
        <aside className="absolute z-10 flex flex-col min-w-[5rem] h-full px-7 box-border bg-slate-50">
            <div className={"flex flex-col h-full w-96" + (collapsableCatalog ? '' : ' hidden')}>
                {/* Seach Bar */}
                <div className="flex-1 relative mr-12 my-5 bg-white max-h-10" data-te-input-wrapper-init>
                    <input
                        type="search"
                        className="peer block min-h-[auto] h-10 max-h-10 w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="nodeFilterInput"
                        placeholder="Type query"
                        ref={catalogSearchBar}
                        onChange={onSearchInputChange}
                    />
                    <label
                        htmlFor="nodeFilterInput"
                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Search modules</label>
                </div>
                {/* Nodes list */}
                <div className="mb-10 pr-3 grid gap-2 overflow-y-scroll scroll-smooth">{displayedOperatorCatalog}</div>
            </div>

            {/* Expand / Collapse button */}
            <div
                className="absolute my-5 right-7 flex flex-col justify-center cursor-pointer"
                onClick={onClickToggle}
            >
                <img
                    src={collapsableCatalog ? toggle_left : toggle_right}
                    alt="Toggle"
                    className="w-8 h-8"
                />
                <div className={"mt-5 vertical-text" + (collapsableCatalog ? ' hidden' : '')}>
                    <strong>Operators catalog</strong>
                </div>
            </div>
        </aside>
    );
};
