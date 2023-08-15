import {
    useCallback,
    useMemo,
    useRef,
    useState
} from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
} from 'reactflow';
import NodeCatalogBar from './NodeCatalog';
import NodeSettingBar from './NodeSetting';

import './style.css';
import 'reactflow/dist/style.css';

import defaultNodes from './graph/nodes.js';
import defaultEdges from './graph/edges.js';


let id = 0;
const getId = () => `node_${id++}`;

function Flow() {
    const reactFlowWrapper = useRef(null);
    const reactFlowProviderWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(false);

    const onConnect = useCallback((params) =>
        setEdges((eds) => addEdge(params, eds)), [setEdges]
    );

    // Node dragging and dropping to the main frame
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            let draggingData = event.dataTransfer.getData('application/reactflow');
            if (draggingData !== '') {
                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                const data = JSON.parse(draggingData);

                // check if the dropped element is valid
                if (typeof data.nodeType === 'undefined' || !data.nodeType) {
                    return;
                }

                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                });
                const newNode = {
                    id: getId(),
                    type: data.nodeType,
                    position,
                    data: data,
                };

                setNodes((nds) => nds.concat(newNode));
            }
        },
        [reactFlowInstance]
    );

    // Node settings panel
    const onNodeClick = useCallback((event, node) =>
        setSelectedNode(node), []
    );
    const onPaneClick = useCallback((event) =>
        setSelectedNode(false), []
    );

    return (
        <div className="flex w-full h-full" ref={reactFlowProviderWrapper}>
            <ReactFlowProvider>
                <div className="relative flex-1 box-border w-full h-full" ref={reactFlowWrapper}>
                    <NodeCatalogBar/>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        className="flex"
                        fitView
                    >
                        {/*<Controls />*/}
                        <Background/>
                    </ReactFlow>
                </div>
                <NodeSettingBar
                    panelWrapper={reactFlowProviderWrapper}
                    selectedNode={selectedNode}
                />
            </ReactFlowProvider>
        </div>
    );
}

export default Flow;