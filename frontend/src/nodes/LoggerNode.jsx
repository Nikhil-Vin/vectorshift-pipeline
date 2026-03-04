import BaseNode from '../components/BaseNode';

export default function LoggerNode({ id }) {
  return (
    <BaseNode
      title="Logger"
      inputs={[{ id: `${id}-in`, label: 'in' }]}
      outputs={[{ id: `${id}-out`, label: 'out' }]}
    >
      <p className="node-description">Logs value to console</p>
    </BaseNode>
  );
}
