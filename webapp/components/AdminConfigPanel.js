import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import SectionContainer from './SectionContainer';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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
          automaticLayout: true,
          scrollbar: { alwaysConsumeMouseWheel: false },
          mouseWheelScrollSensitivity: 1,
          mouseWheelZoom: false
        }}
        onChange={setConfig}
        onMount={(_, editor) => { editorRef.current = editor; }}
      />
    </div>
  );
}

function ConfigStatus({ error, success }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (success) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [success]);

  return (
    <>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && show && <div style={{ color: 'green', marginTop: 8, fontWeight: 'bold' }}>Saved!</div>}
    </>
  );
}

export default function AdminConfigPanel({
  fetchConfigUrl = '/api/admin/config',
  saveConfigUrl = '/api/admin/config',
  fetchDefaultConfigUrl = '/api/admin/getDefaultConfig',
}) {
  const [config, setConfig] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editorHeight, setEditorHeight] = useState(250);
  const editorRef = useRef(null);

  useEffect(() => {
    fetch(fetchConfigUrl)
      .then(res => res.json())
      .then(data => {
        setConfig(JSON.stringify(data, null, 4));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load config');
        setLoading(false);
      });
  }, [fetchConfigUrl]);

  useEffect(() => {
    if (editorRef.current) {
      const lineCount = config ? config.split('\n').length : 1;
      setEditorHeight(Math.max(150, Math.min(lineCount * 24 + 24, 600)));
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const parsed = JSON.parse(config);
      const res = await fetch(saveConfigUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess(true);
    } catch (e) {
      setError('Invalid JSON or save failed');
    }
    setSaving(false);
  };

  const handleReset = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(fetchDefaultConfigUrl);
      if (!res.ok) throw new Error('Failed to fetch default config');
      const data = await res.json();
      setConfig(JSON.stringify(data, null, 4));
    } catch (e) {
      setError('Failed to load default config');
    }
    setLoading(false);
  };

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
                <div className="btn-group btn-group-equal" role="group" style={{ width: '100%' }}>
                  <button
                    className="btn border rounded-0 fixed-size-btn pe-4 ps-4 me-2 mt-2 btn-danger"
                    type="button"
                    style={{ fontSize: 14, minWidth: 100, color: '#fff' }}
                    onClick={handleReset}
                    disabled={saving || loading}
                  >
                    Reset
                  </button>
                  <button
                    className="btn border rounded-0 fixed-size-btn pe-4 ps-4 ms-0 mt-2"
                    type="button"
                    style={{ background: 'var(--bs-primary)', color: 'var(--bs-light)', fontSize: 14, minWidth: 100 }}
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
  );
}
