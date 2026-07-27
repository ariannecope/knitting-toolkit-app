export default function ToolPageLayout({ title, children }) {
  return (
    <div className="tool-page">
      <h1 className="tool-title">{title}</h1>

      <div className="tool-content">
        {children}
      </div>
    </div>
  );
}