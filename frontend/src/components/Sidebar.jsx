import { useCallback } from 'react';

const NODE_PALETTE = [
  { type: 'customInput',  label: 'Input',  icon: '⤵' },
  { type: 'customOutput', label: 'Output', icon: '⤴' },
  { type: 'llm',          label: 'LLM',    icon: '◈' },
  { type: 'text',         label: 'Text',   icon: '❝' },
  { type: 'math',         label: 'Math',   icon: '∑' },
  { type: 'delay',        label: 'Delay',  icon: '◷' },
  { type: 'api',          label: 'API',    icon: '⇌' },
  { type: 'filter',       label: 'Filter', icon: '⊸' },
  { type: 'logger',       label: 'Log',    icon: '▤' },
];

function DraggableNode({ type, label, icon }) {
  const onDragStart = useCallback((e) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  }, [type]);

  return (
    <div
      className="draggable-node"
      draggable
      onDragStart={onDragStart}
      title={label}
    >
      <span className="draggable-node-icon">{icon}</span>
      <span className="draggable-node-label">{label}</span>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">VS</div>
      <div className="sidebar-divider" />
      <span className="sidebar-label">Nodes</span>
      {NODE_PALETTE.map((node) => (
        <DraggableNode key={node.type} {...node} />
      ))}
    </aside>
  );
}
