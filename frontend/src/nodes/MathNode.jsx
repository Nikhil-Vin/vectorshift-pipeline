import { useState } from 'react';
import BaseNode from '../components/BaseNode';

export default function MathNode({ id, data }) {
  const [op, setOp] = useState(data?.op || '+');

  return (
    <BaseNode
      title="Math"
      inputs={[
        { id: `${id}-a`, label: 'a' },
        { id: `${id}-b`, label: 'b' },
      ]}
      outputs={[{ id: `${id}-result`, label: 'result' }]}
    >
      <label>Operation</label>
      <select value={op} onChange={(e) => setOp(e.target.value)}>
        <option>+</option>
        <option>-</option>
        <option>*</option>
        <option>/</option>
      </select>
    </BaseNode>
  );
}
