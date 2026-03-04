export default function Layout({ sidebar, children, submit }) {
  return (
    <div className="app">
      {sidebar}
      <main className="pipeline-canvas">
        {children}
      </main>
      {submit}
    </div>
  );
}
