import { useEffect, useRef, useState } from 'react';
import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminNavBar from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import Head from 'next/head';

function AdminTerminal() {
  const xtermRef = useRef(null);
  const containerRef = useRef(null);
  const prompt = 'admin@anonyconnect:~$ ';
  const [mode, setMode] = useState('shell');
  const [sqlInput, setSqlInput] = useState('');
  const [sqlOutput, setSqlOutput] = useState('');
  const [sqlLoading, setSqlLoading] = useState(false);

  // Track if terminal is initialized
  const initializedRef = useRef(false);

  // Initialize or dispose xterm on mode change
  useEffect(() => {
    if (mode === 'shell') {
      if (!xtermRef.current && containerRef.current) {
        xtermRef.current = new Terminal({
          theme: {
            background: '#181818',
            foreground: '#e0e0e0',
          },
          fontSize: 16,
          fontFamily: 'monospace',
          cursorBlink: true,
          rows: 20,
          convertEol: true,
          scrollback: 1000,
        });
        import('@xterm/addon-clipboard').then(({ ClipboardAddon }) => {
          const clipboard = new ClipboardAddon();
          xtermRef.current.loadAddon(clipboard);
        });
        xtermRef.current.open(containerRef.current);
        xtermRef.current.write('Welcome to the admin terminal. Type a command and press Enter.\r\n');
        xtermRef.current.write(prompt);
        setTimeout(() => {
          if (containerRef.current) containerRef.current.focus();
        }, 0);
        initializedRef.current = true;
      }
    } else {
      // Dispose terminal when leaving shell mode
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
        initializedRef.current = false;
      }
      // Optionally clear the container DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }
    // eslint-disable-next-line
  }, [mode]);

  // Handle terminal input
  useEffect(() => {
    if (!xtermRef.current) return;
    const term = xtermRef.current;
    let currInput = '';
    let history = [];
    let historyIndex = -1;
    let cursor = 0;

    // Helper to get the current cursor X position relative to the prompt
    const getCursorX = () => prompt.length + cursor;

    // Redraws the entire input line, always starting from the prompt
    const redrawInput = () => {
      // Move to start of line
      term.write('\x1b[2K'); // Erase entire line
      term.write('\r'); // Carriage return
      term.write(prompt + currInput);
      // Move cursor to correct position after prompt
      const pos = getCursorX();
      const end = prompt.length + currInput.length;
      if (end > pos) {
        term.write(`\x1b[${end - pos}D`); // Move left
      }
    };

    const setInputLine = (newInput) => {
      currInput = newInput;
      cursor = currInput.length;
      redrawInput();
    };

    const onData = (data) => {
      const code = data.charCodeAt(0);
      if (code === 13) { // Enter
        term.write('\r\n');
        if (currInput.trim()) {
          history.push(currInput);
        }
        historyIndex = history.length;
        handleCommand(currInput);
        currInput = '';
        cursor = 0;
      } else if (code === 127) { // Backspace
        // Only allow backspace if cursor is after the prompt (i.e., cursor > 0 in input)
        if (cursor > 0) {
          currInput = currInput.slice(0, cursor - 1) + currInput.slice(cursor);
          cursor--;
          redrawInput();
        } else {
          // Prevent erasing the prompt: do nothing
        }
      } else if (data === '\u001b[A') { // Up arrow
        if (history.length && historyIndex > 0) {
          historyIndex--;
          currInput = history[historyIndex];
          cursor = currInput.length;
          redrawInput();
        }
      } else if (data === '\u001b[B') { // Down arrow
        if (history.length && historyIndex < history.length - 1) {
          historyIndex++;
          currInput = history[historyIndex];
          cursor = currInput.length;
          redrawInput();
        } else if (historyIndex === history.length - 1) {
          historyIndex++;
          currInput = '';
          cursor = 0;
          redrawInput();
        }
      } else if (data === '\u001b[D') { // Left arrow
        if (cursor > 0) {
          cursor--;
          redrawInput();
        }
      } else if (data === '\u001b[C') { // Right arrow
        if (cursor < currInput.length) {
          cursor++;
          redrawInput();
        }
      } else if (data.length === 1 && data >= ' ' && data <= '~') { // Printable
        currInput = currInput.slice(0, cursor) + data + currInput.slice(cursor);
        cursor++;
        redrawInput();
      } else if (data.startsWith('\x1b[200~')) { // Bracketed paste mode
        const pasted = data.replace(/^\x1b\[200~|\x1b\[201~$/g, '');
        currInput = currInput.slice(0, cursor) + pasted + currInput.slice(cursor);
        cursor += pasted.length;
        redrawInput();
      } else if (data.length > 1 && data.startsWith('\x1b')) {
        const pasted = data.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
        if (pasted) {
          currInput = currInput.slice(0, cursor) + pasted + currInput.slice(cursor);
          cursor += pasted.length;
          redrawInput();
        }
      }
    };
    term.onData(onData);
    return () => {
      if (term && typeof term.dispose === 'function') {
        term.dispose(); // Clean up terminal instance
      }
      // xterm.js does not provide offData, so we can't remove the handler directly
      // If needed, we could track a flag to ignore events after unmount
    };
    // eslint-disable-next-line
  }, []);

  // Handle command execution
  const handleCommand = async (cmd) => {
    if (!cmd.trim()) {
      xtermRef.current.write(prompt);
      return;
    }
    try {
      const res = await fetch('/api/admin/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.output === '__CLEAR__') {
          xtermRef.current.clear();
          xtermRef.current.write('Welcome to the admin terminal. Type a command and press Enter.\r\n');
          xtermRef.current.write(prompt);
          return;
        } else {
          for (const ch of data.output || '') {
            if (ch === '\n') xtermRef.current.write('\r\n');
            else xtermRef.current.write(ch);
          }
        }
      } else {
        xtermRef.current.write((data.error || 'Unknown error') + '\r\n');
      }
      xtermRef.current.write(prompt);
    } catch (err) {
      xtermRef.current.write('\r\n[Network error]\r\n' + prompt);
    }
  };

  return (
    <div className="container pb-0 mb-0 mt-4">
      <section className="py-3 pt-0">
        <div className="container py-3 mt-0 pt-3">
          <div className="row mb-2">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2 className="fw-bold text-primary">Management Terminal</h2>
            </div>
          </div>
          {/* Drop box row */}
          <div className="row mb-2">
            <div className="col-12 d-flex align-items-center" style={{height: 36}}>
              <select
                style={{
                  width: 120,
                  fontSize: 15,
                  borderRadius: 4,
                  border: '1px solid #aab3b9',
                  background: '#fff',
                  color: '#0d6efd',
                  outline: 'none',
                  padding: '4px 8px',
                  fontWeight: 600
                }}
                value={mode}
                onChange={e => setMode(e.target.value)}
                aria-label="Terminal mode selector"
              >
                <option value="shell">Shell</option>
                <option value="sql">SQL</option>
              </select>
            </div>
          </div>
          {mode === 'shell' ? (
            <div className="row" style={{height: '400px'}}>
              <div className="col" style={{height: '100%'}}>
                <div ref={containerRef} tabIndex={0} style={{ height: '100%', background: '#181818', borderRadius: 6, border: '1.5px solid #aab3b9', width: '100%', overflow: 'auto', paddingLeft: 16, paddingTop: 12 }} className="xterm-full-scroll" />
              </div>
            </div>
          ) : (
            <div className="row" style={{height: '400px'}}>
              <div className="col d-flex flex-column" style={{height: '100%'}}>
                <div style={{ flex: 1, height: '100%', background: '#181818', color: '#e0e0e0', borderRadius: 6, border: '1.5px solid #aab3b9', width: '100%', overflow: 'auto', padding: 16, marginBottom: 8, fontFamily: 'monospace', fontSize: 15, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 40, flex: 1, overflowY: 'auto'}}>{sqlOutput || <span style={{color:'#888'}}>SQL output will appear here.</span>}</div>
                  <div className="d-flex mt-3" style={{gap: 8, marginTop: 16}}>
                    <textarea
                      className="form-control"
                      ref={el => {
                        if (el && mode === 'sql') el.focus();
                      }}
                      style={{ fontFamily: 'monospace', fontSize: 15, borderRadius: 4, border: '1.5px solid #aab3b9', background: '#fff', color: '#222', resize: 'vertical', minHeight: 13, maxHeight: 45, flex: 1 }}
                      placeholder="Enter SQL command..."
                      value={sqlInput}
                      onChange={e => setSqlInput(e.target.value)}
                      disabled={sqlLoading}
                      onKeyDown={async e => {
                        if (e.key === 'Enter' && !e.shiftKey && !sqlLoading) {
                          e.preventDefault();
                          if (sqlInput.trim()) {
                            setSqlLoading(true);
                            setSqlOutput('');
                            try {
                              const res = await fetch('/api/admin/terminal-sql', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ sql: sqlInput }),
                              });
                              const data = await res.json();
                              if (res.ok) {
                                // If output is an array of objects, format as a table
                                if (Array.isArray(data.output) && data.output.length > 0 && typeof data.output[0] === 'object') {
                                  const keys = Object.keys(data.output[0]);
                                  const header = keys.join(' | ');
                                  const separator = keys.map(() => '---').join(' | ');
                                  const rows = data.output.map(row => keys.map(k => String(row[k])).join(' | '));
                                  setSqlOutput([header, separator, ...rows].join('\n'));
                                } else if (Array.isArray(data.output)) {
                                  setSqlOutput(data.output.join('\n'));
                                } else {
                                  setSqlOutput(data.output || '');
                                }
                              } else {
                                setSqlOutput(data.error || 'Unknown error');
                              }
                            } catch (err) {
                              setSqlOutput('[Network error]');
                            }
                            setSqlInput(''); // Auto clear input after run
                            setSqlLoading(false);
                          }
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="btn btn-primary"
                      style={{ fontWeight: 600, minWidth: 80 }}
                      disabled={sqlLoading || !sqlInput.trim()}
                      onClick={async () => {
                        setSqlLoading(true);
                        setSqlOutput('');
                        try {
                          const res = await fetch('/api/admin/terminal-sql', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sql: sqlInput }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            // If output is an array of objects, format as a table
                            if (Array.isArray(data.output) && data.output.length > 0 && typeof data.output[0] === 'object') {
                              const keys = Object.keys(data.output[0]);
                              const header = keys.join(' | ');
                              const separator = keys.map(() => '---').join(' | ');
                              const rows = data.output.map(row => keys.map(k => String(row[k])).join(' | '));
                              setSqlOutput([header, separator, ...rows].join('\n'));
                            } else if (Array.isArray(data.output)) {
                              setSqlOutput(data.output.join('\n'));
                            } else {
                              setSqlOutput(data.output || '');
                            }
                          } else {
                            setSqlOutput(data.error || 'Unknown error');
                          }
                        } catch (err) {
                          setSqlOutput('[Network error]');
                        }
                        setSqlInput(''); // Auto clear input after run
                        setSqlLoading(false);
                      }}
                    >{sqlLoading ? 'Running...' : 'Run'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <section>
        <header></header>
      </section>
      {/* Remove or reduce extra margin/padding below */}
    </div>
  );
}

function AdminManagement() {
  return (
    <>
      <Head>
        <title>AnonyConnect – Admin Management</title>
      </Head>
      <AdminNavBar />
      <AdminTerminal />
      <Footer />
    </>
  );
}

export default withAdminPageAuth(AdminManagement);

/* Add this CSS to ensure the scrollbar spans the full height */
<style jsx global>{`
  .xterm-full-scroll, .xterm, .xterm-viewport {
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
  }
  .xterm-full-scroll .xterm-viewport {
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
  }
  .container.pb-0.mb-0 {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }
  section.py-3.pt-0 {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }
  .row.mb-5 { margin-bottom: 0 !important; }
  .xterm-full-scroll { margin-bottom: 0 !important; }
`}</style>
