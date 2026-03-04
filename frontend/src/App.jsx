import Layout from './components/Layout';
import PipelineUI from './PipelineUI';
import Sidebar from './components/Sidebar';
import FloatingSubmit from './components/FloatingSubmit';

export default function App() {
  return (
    <Layout sidebar={<Sidebar />} submit={<FloatingSubmit />}>
      <PipelineUI />
    </Layout>
  );
}
