import { useEffect, useRef, useState } from 'react';
import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminNavBar from '../../components/AdminNavbar';
import Footer from '../../components/footer';

function AdminTerminal() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on output change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Always focus input box
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [output, loading]);

  // Always focus input box, including when user types anywhere
  useEffect(() => {
    const focusInput = (e) => {
      // Only focus if not typing in another input/textarea
      if (inputRef.current && document.activeElement !== inputRef.current) {
        // Ignore if user is tabbing or using modifier keys
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          inputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', focusInput);
    return () => window.removeEventListener('keydown', focusInput);
  }, []);

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    // Format prompt like a real terminal
    setOutput((prev) => {
      const lines = prev.split('\n').filter(Boolean);
      return (lines.length > 0 ? prev + '\n' : '') + `$ admin@anonyconnect:~$ ${input}\n`;
    });
    try {
      const res = await fetch('/api/admin/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: input }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.output === '__CLEAR__') {
          setOutput('');
        } else {
          setOutput((prev) => prev + (data.output || ''));
        }
      } else {
        setOutput((prev) => prev + (data.error || 'Unknown error') + '\n');
      }
    } catch (err) {
      setOutput((prev) => prev + '\n[Network error]\n');
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="container pb-5 mb-5 mt-5">
      <section className="py-5 pt-0">
        <div className="container py-5 mt-0 pt-5">
          <div className="row mb-5">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2 className="fw-bold text-primary">Management Terminal</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div
                ref={terminalRef}
                style={{
                  background: '#181818',
                  color: '#e0e0e0',
                  borderRadius: 6,
                  minHeight: 320,
                  maxHeight: 420,
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: 16,
                  padding: 16,
                  marginBottom: 8,
                  border: '1.5px solid #aab3b9',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
                tabIndex={0}
                aria-label="Terminal output"
              >
                {output || 'Welcome to the admin terminal. Type a command and press Enter.'}
              </div>
              <form onSubmit={handleCommand} className="d-flex" autoComplete="off">
                <input
                  ref={inputRef}
                  className="form-control me-2"
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter command..."
                  disabled={loading}
                  style={{ fontFamily: 'monospace', fontSize: 16, borderRadius: 6 }}
                  autoFocus
                />
                <button
                  className="btn border rounded-0 fixed-size-btn pe-4 ps-4 me-0 ms-2"
                  type="submit"
                  style={{ background: 'var(--bs-primary)', color: 'var(--bs-light)', fontSize: 14 }}
                  disabled={loading || !input.trim()}
                >
                  {loading ? 'Running...' : 'Run'}
                </button>
              </form>
              {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
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

function AdminManagement() {
  return (
    <>
      <AdminNavBar />
      <AdminTerminal />
      <Footer />
    </>
  );
}

export default withAdminPageAuth(AdminManagement);
