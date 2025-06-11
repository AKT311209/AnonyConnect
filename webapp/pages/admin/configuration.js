import { useEffect, useState } from 'react';
import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminNavBar from '../../components/AdminNavbar';
import AdminConfigLayout from '../../components/AdminConfigLayout';

function AdminConfig() {
  const [config, setConfig] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        setConfig(JSON.stringify(data, null, 4));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load config');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const parsed = JSON.parse(config);
      const res = await fetch('/api/admin/config', {
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

  return (
    <>
      <AdminNavBar />
      <AdminConfigLayout
        loading={loading}
        config={config}
        setConfig={setConfig}
        saving={saving}
        error={error}
        success={success}
        handleSave={handleSave}
      />
    </>
  );
}

export default withAdminPageAuth(AdminConfig);
