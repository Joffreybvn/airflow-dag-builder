import {create} from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import initialNodes from './static/graph/nodes';
import initialEdges from './static/graph/edges';


// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create((set, get) => (
    {
        /* ReactFlow state management */

        nodes: initialNodes,
        edges: initialEdges,

        setNodes: (nodes) => {
            set({
                nodes: get().nodes.concat(nodes)
            });
        },

        onNodesChange: (changes) => {
            set({
                nodes: applyNodeChanges(changes, get().nodes),
            });
        },
        onEdgesChange: (changes) => {
            set({
                edges: applyEdgeChanges(changes, get().edges),
            });
        },
        onConnect: (connection) => {
            set({
                edges: addEdge(connection, get().edges),
            });
        },
    })
);

export default useStore;
