import {
    useCallback,
    useRef,
    useState
} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import NodeCatalogBar from './NodeCatalogBar';
import NodeSettingBar from './NodeSettingBar';

import './style.css';
import 'reactflow/dist/style.css';

import defaultNodes from './graph/nodes.js';
import defaultEdges from './graph/edges.js';

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(false);

  const onConnect = useCallback((params) =>
      setEdges((eds) => addEdge(params, eds)), [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeClick = useCallback((event, node) =>
      setSelectedNode(node), []
  );

  const onPaneClick = useCallback((event) =>
      setSelectedNode(false), []
  );

  return (
    <ReactFlowProvider>
        <div className="realtive flex-1 box-border" ref={reactFlowWrapper}>
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
                <Background />
            </ReactFlow>
        </div>
        <NodeSettingBar selectedNode={selectedNode}/>
    </ReactFlowProvider>
  );
}

export default Flow;