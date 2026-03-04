import BaseNode from '../components/BaseNode';

export default function LLMNode({ id }) {
  return (
    <BaseNode
      title="LLM"
      inputs={[
        { id: `${id}-system`, label: 'system' },
        { id: `${id}-prompt`, label: 'prompt' },
      ]}
      outputs={[{ id: `${id}-response`, label: 'response' }]}
    >
      <p className="node-description">Language Model</p>
    </BaseNode>
  );
}
