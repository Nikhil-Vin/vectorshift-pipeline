import { useStore } from '../store';

export default function FloatingSubmit() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      alert(
        `Pipeline Analysis\n` +
        `─────────────────\n` +
        `Nodes:  ${data.num_nodes}\n` +
        `Edges:  ${data.num_edges}\n` +
        `Is DAG: ${data.is_dag ? '✅ Valid DAG' : '❌ Has Cycles'}`
      );
    } catch {
      alert('⚠️ Could not reach backend.\nMake sure it is running on port 8000.');
    }
  };

  return (
    <div className="submit-bar">
      <button className="submit-btn" onClick={handleSubmit}>
        <span className="submit-btn-icon">▶</span>
        Run Pipeline
      </button>
    </div>
  );
}
