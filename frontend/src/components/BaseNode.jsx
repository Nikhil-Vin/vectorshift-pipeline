import { Handle, Position } from 'reactflow';

function getHandleStyle(index, total) {
  return { top: `${((index + 1) / (total + 1)) * 100}%` };
}

export default function BaseNode({ title, inputs = [], outputs = [], children }) {
  return (
    <div className="base-node">

      {/* Header */}
      <div className="base-node-header">
        <span className="base-node-header-dot" />
        <span className="base-node-title">{title}</span>
      </div>

      {/* Content */}
      <div className="base-node-body">
        {children}
      </div>

      {/* Input Handles (left side) */}
      {inputs.map((input, i) => (
        <div key={input.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={input.id}
            style={getHandleStyle(i, inputs.length)}
          />
          <span
            className="handle-label handle-label-left"
            style={{ top: `${((i + 1) / (inputs.length + 1)) * 100}%` }}
          >
            {input.label}
          </span>
        </div>
      ))}

      {/* Output Handles (right side) */}
      {outputs.map((output, i) => (
        <div key={output.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={output.id}
            style={getHandleStyle(i, outputs.length)}
          />
          <span
            className="handle-label handle-label-right"
            style={{ top: `${((i + 1) / (outputs.length + 1)) * 100}%` }}
          >
            {output.label}
          </span>
        </div>
      ))}

    </div>
  );
}
