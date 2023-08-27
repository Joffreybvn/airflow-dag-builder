import {
    useCallback,
    useRef,
    useState
} from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    Flex,
    Box
} from "@chakra-ui/react";
import {shallow} from 'zustand/shallow';
import useStore from '../store';
import NodeSetting from './node-settings';
import NodeCatalog from "./node-catalog";


let id = 0;
const generateNodeId = () => `node_${id++}`;

const DagBuilder = () => {
    const reactFlowWrapper = useRef(null);
    const reactFlowProviderWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(undefined);
    const {nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect} = useStore(
        (state) => ({
            nodes: state.nodes,
            edges: state.edges,
            setNodes: state.setNodes,
            onNodesChange: state.onNodesChange,
            onEdgesChange: state.onEdgesChange,
            onConnect: state.onConnect,
        }), shallow);

    // Node dragging and dropping to the main frame
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const createFlowNode = useCallback(
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
                    id: generateNodeId(),
                    type: data.nodeType,
                    position,
                    data: data,
                };
                setNodes(newNode);
            }
        },
        [reactFlowInstance, setNodes]
    );

    // Node settings panel
    const selectNode = useCallback((event, node) =>
        setSelectedNode(node), []
    );
    const unselectNode = useCallback(() =>
        setSelectedNode(undefined), []
    );

    return (
        <Flex
            w="100%"
            h="100%"
            ref={reactFlowProviderWrapper}
        >
            <ReactFlowProvider>
                <Box
                    flex={1}
                    position="relative"
                    ref={reactFlowWrapper}
                >
                    <NodeCatalog/>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={createFlowNode}
                        onDragOver={onDragOver}
                        onNodeClick={selectNode}
                        onPaneClick={unselectNode}
                        className="flex"
                        fitView
                    >
                        {/*<Controls />*/}
                        <Background/>
                    </ReactFlow>
                </Box>
                <NodeSetting
                    panelWrapper={reactFlowProviderWrapper}
                    selectedNode={selectedNode}
                />
            </ReactFlowProvider>
        </Flex>
    );
}

export default DagBuilder;
