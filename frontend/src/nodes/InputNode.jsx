import { useState } from 'react';
import BaseNode from '../components/BaseNode';

export default function InputNode({ id, data }) {
  const [name, setName] = useState(data?.inputName || 'input_1');
  const [type, setType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode
      title="Input"
      outputs={[{ id: `${id}-value`, label: 'value' }]}
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
