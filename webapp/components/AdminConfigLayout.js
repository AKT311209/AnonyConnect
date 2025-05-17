// AdminConfigLayout.js
// Layout and presentational component for the admin configuration page
import dynamic from 'next/dynamic';
import MonacoEditor from '@monaco-editor/react';
import { useState, useRef, useEffect } from 'react';

function ConfigEditor({ loading, config, setConfig, editorHeight, editorRef }) {
  if (loading) return <div>Loading...</div>;
  return (
    <div style={{ border: '1.5px solid #aab3b9', borderRadius: 6, marginBottom: 8, background: '#fff', paddingTop: 8, paddingBottom: 8 }}>
      <MonacoEditor
        height={editorHeight}
        language="json"
        theme="vs-light"
        value={config}
        options={{ 
          fontSize: 16, 
          fontFamily: 'Roboto, monospace', 
          minimap: { enabled: false }, 
          scrollBeyondLastLine: false, 
          theme: 'vs-light', 
          automaticLayout: true 
        }}
        onChange={setConfig}
        onMount={(_, editor) => { editorRef.current = editor; }}
      />
    </div>
  );
}

function ConfigStatus({ error, success }) {
  return (
    <>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>Saved!</div>}
    </>
  );
}

function ConfigFooter() {
  return (
    <footer className="text-center bg-primary-gradient mt-5" style={{ background: 'var(--bs-light)' }}>
      <div className="container text-center py-4 py-lg-5 mt-0">
        <p className="mb-0">Copyright © 2025 AnonyConnect</p>
      </div>
    </footer>
  );
}

export default function AdminConfigLayout({
  loading,
  config,
  setConfig,
  saving,
  error,
  success,
  handleSave
}) {
  const [editorHeight, setEditorHeight] = useState(250);
  const editorRef = useRef(null);

  // Adjust height based on content
  useEffect(() => {
    if (editorRef.current) {
      const lineCount = config ? config.split('\n').length : 1;
      setEditorHeight(Math.max(150, Math.min(lineCount * 24 + 24, 600)));
    }
  }, [config]);

  const handleSaveTrim = async () => {
    // Remove trailing whitespace from each line and trim file
    const trimmedConfig = config
      .split('\n')
      .map(line => line.replace(/\s+$/g, ''))
      .join('\n')
      .replace(/\n+$/g, '')
      .trim();
    setConfig(trimmedConfig);
    await handleSave();
  };

  return (
    <>
      <div className="container pb-5 mb-5 mt-5">
        <section className="py-5 pt-0">
          <div className="container py-5 mt-0 pt-5">
            <div className="row mb-5">
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <h2 className="fw-bold text-primary">Configuration</h2>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <ConfigEditor loading={loading} config={config} setConfig={setConfig} editorHeight={editorHeight} editorRef={editorRef} />
                <ConfigStatus error={error} success={success} />
                <div className="d-flex justify-content-end">
                  <div className="btn-group btn-group-equal" role="group">
                    <button
                      className="btn border rounded-0 fixed-size-btn pe-4 ps-4 me-0 ms-4 mt-2"
                      type="button"
                      style={{ background: 'var(--bs-primary)', color: 'var(--bs-light)', fontSize: 14 }}
                      onClick={handleSaveTrim}
                      disabled={saving || loading}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <header></header>
        </section>
      </div>
      <ConfigFooter />
    </>
  );
}
