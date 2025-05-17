// AdminConfigLayout.js
// Layout and presentational component for the admin configuration page
export default function AdminConfigLayout({
  loading,
  config,
  setConfig,
  saving,
  error,
  success,
  handleSave
}) {
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
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <textarea
                    value={config}
                    onChange={e => setConfig(e.target.value)}
                    style={{ width: '100%', height: 180, fontSize: 18, fontFamily: 'monospace', border: '1px solid #333', borderRadius: 4, padding: 8 }}
                    disabled={saving}
                  />
                )}
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: 8 }}>Saved!</div>}
                <div className="d-flex justify-content-end">
                  <div className="btn-group btn-group-equal" role="group">
                    <button
                      className="btn border rounded-0 fixed-size-btn pe-4 ps-4 me-0 ms-4 mt-2"
                      type="button"
                      style={{ background: 'var(--bs-primary)', color: 'var(--bs-light)', fontSize: 14 }}
                      onClick={handleSave}
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
      <footer className="text-center bg-primary-gradient mt-5" style={{ background: 'var(--bs-light)' }}>
        <div className="container text-center py-4 py-lg-5 mt-0">
          <p className="mb-0">Copyright © 2025 AnonyConnect</p>
        </div>
      </footer>
    </>
  );
}
