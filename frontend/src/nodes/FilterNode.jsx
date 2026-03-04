import { useState } from 'react';
import BaseNode from '../components/BaseNode';

export default function FilterNode({ id, data }) {
  const [condition, setCondition] = useState(data?.condition || '');

  return (
    <BaseNode
      title="Filter"
      inputs={[{ id: `${id}-in`, label: 'in' }]}
      outputs={[
        { id: `${id}-pass`, label: 'pass' },
        { id: `${id}-fail`, label: 'fail' },
      ]}
    >
      <label>Condition</label>
      <input
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        placeholder="value > 0"
      />
    </BaseNode>
  );
}
