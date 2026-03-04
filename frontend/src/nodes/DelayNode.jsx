import { useState } from 'react';
import BaseNode from '../components/BaseNode';

export default function DelayNode({ id, data }) {
  const [ms, setMs] = useState(data?.ms || 1000);

  return (
    <BaseNode
      title="Delay"
      inputs={[{ id: `${id}-in`, label: 'in' }]}
      outputs={[{ id: `${id}-out`, label: 'out' }]}
    >
      <label>Milliseconds</label>
      <input
        type="number"
        value={ms}
        min={0}
        onChange={(e) => setMs(e.target.value)}
      />
    </BaseNode>
  );
}
