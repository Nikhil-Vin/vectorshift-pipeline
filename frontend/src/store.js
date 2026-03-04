import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],

  getNodeID: (type) => {
    const counts = get().nodes.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {});
    return `${type}-${(counts[type] || 0) + 1}`;
  },

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),
}));
