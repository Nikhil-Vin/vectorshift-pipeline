import { useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from './store';

import InputNode   from './nodes/InputNode';
import OutputNode  from './nodes/OutputNode';
import LLMNode     from './nodes/LLMNode';
import TextNode    from './nodes/TextNode';
import MathNode    from './nodes/MathNode';
import DelayNode   from './nodes/DelayNode';
import APINode     from './nodes/APINode';
import FilterNode  from './nodes/FilterNode';
import LoggerNode  from './nodes/LoggerNode';

const nodeTypes = {
  customInput:  InputNode,
  customOutput: OutputNode,
  llm:          LLMNode,
  text:         TextNode,
  math:         MathNode,
  delay:        DelayNode,
  api:          APINode,
  filter:       FilterNode,
  logger:       LoggerNode,
};

// Injects SVG gradient used by edge strokes
function EdgeGradientDef() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function PipelineUI() {
  const wrapperRef = useRef(null);
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, getNodeID,
  } = useStore();

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const bounds = wrapperRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - bounds.left - 110,
      y: e.clientY - bounds.top  - 40,
    };

    addNode({ id: getNodeID(type), type, position, data: {} });
  }, [addNode, getNodeID]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <EdgeGradientDef />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor="#1f2d44"
          maskColor="rgba(8,12,20,0.75)"
          nodeStrokeWidth={0}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="rgba(99,130,190,0.2)"
        />
      </ReactFlow>
    </div>
  );
}
