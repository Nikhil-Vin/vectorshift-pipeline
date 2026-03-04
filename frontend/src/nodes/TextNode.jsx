import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const VAR_REGEX = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;

function extractVars(text) {
  const matches = [...text.matchAll(VAR_REGEX)];
  return [...new Set(matches.map((m) => m[1]))];
}

export default function TextNode({ id, data }) {
  const [text, setText] = useState(data?.text || '');
  const [variables, setVariables] = useState(() => extractVars(data?.text || ''));
  const textareaRef = useRef(null);

  // Extract unique {{variables}} from text
  useEffect(() => {
    setVariables(extractVars(text));
  }, [text]);

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  // Calculate evenly spaced handle positions
  const inputHandleTop = (index, total) =>
    `${((index + 1) / (total + 1)) * 100}%`;

  return (
    <div className="base-node" style={{ minWidth: 240 }}>
      <div className="base-node-header">
        <span className="base-node-header-dot" />
        <span className="base-node-title">Text</span>
      </div>

      <div className="base-node-body">
        {/* nodrag prevents ReactFlow from stealing mouse events while typing */}
        <textarea
          ref={textareaRef}
          className="nodrag"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Use {{variable}} syntax…"
          style={{ resize: 'none', overflow: 'hidden' }}
        />
        {variables.length > 0 && (
          <p style={{
            fontSize: 9, color: '#64748b', margin: 0,
            fontFamily: 'monospace', letterSpacing: '0.05em'
          }}>
            {variables.length} variable{variables.length > 1 ? 's' : ''} detected
          </p>
        )}
      </div>

      {/* Dynamic input handles — one per {{variable}} */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{ top: inputHandleTop(i, variables.length) }}
          />
          <span
            className="handle-label handle-label-left"
            style={{ top: inputHandleTop(i, variables.length) }}
          >
            {varName}
          </span>
        </div>
      ))}

      {/* Static output handle — always present */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ top: '50%' }}
      />
      <span className="handle-label handle-label-right" style={{ top: '50%' }}>
        out
      </span>
    </div>
  );
}