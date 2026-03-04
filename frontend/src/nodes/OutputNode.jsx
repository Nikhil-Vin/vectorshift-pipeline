import { useState } from 'react';
import BaseNode from '../components/BaseNode';

export default function OutputNode({ id, data }) {
  const [name, setName] = useState(data?.outputName || 'output_1');
  const [type, setType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      title="Output"
      inputs={[{ id: `${id}-value`, label: 'value' }]}
    >
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Text</option>
        <option>File</option>
      </select>
    </BaseNode>
  );
}
