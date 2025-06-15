import { useEffect, useState } from 'react';

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

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-primary mb-3">Admin Configuration</h2>
      {loading ? (
        <div className="alert alert-info">Loading configuration...</div>
      ) : (
        <>
          <textarea
            className="form-control mb-2"
            style={{ fontFamily: 'monospace', minHeight: 200, fontSize: 15 }}
            value={config}
            onChange={e => setConfig(e.target.value)}
            disabled={saving}
          />
          <div className="d-flex gap-2 mb-2">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn btn-secondary" onClick={handleReset} disabled={saving || loading}>
              Reset to Default
            </button>
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          {success && <div className="alert alert-success py-1">Saved successfully!</div>}
        </>
      )}
    </div>
  );
}
