import { useState } from 'react';
import BaseNode from '../components/BaseNode';

export default function APINode({ id, data }) {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl]       = useState(data?.url    || '');

  return (
    <BaseNode
      title="API Call"
      inputs={[
        { id: `${id}-body`,    label: 'body' },
        { id: `${id}-headers`, label: 'headers' },
      ]}
      outputs={[
        { id: `${id}-response`, label: 'response' },
        { id: `${id}-status`,   label: 'status' },
      ]}
    >
      <label>Method</label>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>

      <label>URL</label>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://api.example.com"
      />
    </BaseNode>
  );
}
