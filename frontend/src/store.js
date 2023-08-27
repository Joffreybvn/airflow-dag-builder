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
        // Flow state management ----------------------------------------------

        nodes: [],
        edges: [],

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

        // Node Settings state management -------------------------------------

        nodeSettings: {},

        setNodeSetting: (nodeId, settingName, value) => {
            let nodeSettings = get().nodeSettings;

            if (!(nodeId in nodeSettings)) {
                nodeSettings[nodeId] = {};
            }
            nodeSettings[nodeId][settingName] = value
            set({nodeSettings: nodeSettings});
        },

        getNodeSetting: (nodeId, settingName) => {
            let nodeSettings = get().nodeSettings;
            if (
                (nodeId in nodeSettings)
                && (settingName in nodeSettings[nodeId])
            ) {
                return nodeSettings[nodeId][settingName]
            }
        }
    })
);

export default useStore;
