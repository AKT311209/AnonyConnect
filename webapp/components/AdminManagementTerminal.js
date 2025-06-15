import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import SectionContainer from './SectionContainer';

export default function AdminManagementTerminal() {
  const xtermRef = useRef(null);
  const containerRef = useRef(null);
  const prompt = 'admin@anonyconnect:~$ ';
  const [mode, setMode] = useState('shell');
  const [sqlInput, setSqlInput] = useState('');
  const [sqlOutput, setSqlOutput] = useState('');
  const [sqlLoading, setSqlLoading] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (mode === 'shell') {
      if (!xtermRef.current && containerRef.current) {
        xtermRef.current = new Terminal({
          theme: { background: '#181818', foreground: '#e0e0e0' },
          fontSize: 16, fontFamily: 'monospace', cursorBlink: true, rows: 20, convertEol: true, scrollback: 1000,
        });
        import('@xterm/addon-clipboard').then(({ ClipboardAddon }) => {
          const clipboard = new ClipboardAddon();
          xtermRef.current.loadAddon(clipboard);
        });
        xtermRef.current.open(containerRef.current);
        xtermRef.current.write('Welcome to the admin terminal. Type a command and press Enter.\r\n');
        xtermRef.current.write(prompt);
        setTimeout(() => { if (containerRef.current) containerRef.current.focus(); }, 0);
        initializedRef.current = true;
      }
    } else {
      if (xtermRef.current) { xtermRef.current.dispose(); xtermRef.current = null; initializedRef.current = false; }
      if (containerRef.current) { containerRef.current.innerHTML = ''; }
    }
  }, [mode]);

  useEffect(() => {
    if (!xtermRef.current) return;
    const term = xtermRef.current;
    let currInput = '';
    let history = [];
    let historyIndex = -1;
    let cursor = 0;
    const getCursorX = () => prompt.length + cursor;
    const redrawInput = () => {
      term.write('\x1b[2K');
      term.write('\r');
      term.write(prompt + currInput);
      const pos = getCursorX();
      const end = prompt.length + currInput.length;
      if (end > pos) { term.write(`\x1b[${end - pos}D`); }
    };
    const setInputLine = (newInput) => { currInput = newInput; cursor = currInput.length; redrawInput(); };
    const onData = (data) => {
      const code = data.charCodeAt(0);
      if (code === 13) { term.write('\r\n'); if (currInput.trim()) { history.push(currInput); } historyIndex = history.length; handleCommand(currInput); currInput = ''; cursor = 0; }
      else if (code === 127) { if (cursor > 0) { currInput = currInput.slice(0, cursor - 1) + currInput.slice(cursor); cursor--; redrawInput(); } }
      else if (data === '\u001b[A') { if (history.length && historyIndex > 0) { historyIndex--; currInput = history[historyIndex]; cursor = currInput.length; redrawInput(); } }
      else if (data === '\u001b[B') { if (history.length && historyIndex < history.length - 1) { historyIndex++; currInput = history[historyIndex]; cursor = currInput.length; redrawInput(); } else if (historyIndex === history.length - 1) { historyIndex++; currInput = ''; cursor = 0; redrawInput(); } }
      else if (data === '\u001b[D') { if (cursor > 0) { cursor--; redrawInput(); } }
      else if (data === '\u001b[C') { if (cursor < currInput.length) { cursor++; redrawInput(); } }
      else if (data.length === 1 && data >= ' ' && data <= '~') { currInput = currInput.slice(0, cursor) + data + currInput.slice(cursor); cursor++; redrawInput(); }
      else if (data.startsWith('\x1b[200~')) { const pasted = data.replace(/^\x1b\[200~|\x1b\[201~$/g, ''); currInput = currInput.slice(0, cursor) + pasted + currInput.slice(cursor); cursor += pasted.length; redrawInput(); }
      else if (data.length > 1 && data.startsWith('\x1b')) { const pasted = data.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, ''); if (pasted) { currInput = currInput.slice(0, cursor) + pasted + currInput.slice(cursor); cursor += pasted.length; redrawInput(); } }
    };
    term.onData(onData);
    return () => { if (term && typeof term.dispose === 'function') { term.dispose(); } };
  }, []);

  const handleCommand = async (cmd) => {
    if (!cmd.trim()) { xtermRef.current.write(prompt); return; }
    try {
      const res = await fetch('/api/admin/terminal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) });
      const data = await res.json();
      if (res.ok) {
        if (data.output === '__CLEAR__') { xtermRef.current.clear(); xtermRef.current.write('Welcome to the admin terminal. Type a command and press Enter.\r\n'); xtermRef.current.write(prompt); return; }
        else { for (const ch of data.output || '') { if (ch === '\n') xtermRef.current.write('\r\n'); else xtermRef.current.write(ch); } }
      } else { xtermRef.current.write((data.error || 'Unknown error') + '\r\n'); }
      xtermRef.current.write(prompt);
    } catch (err) { xtermRef.current.write('\r\n[Network error]\r\n' + prompt); }
  };

  return (
    <SectionContainer>
      <div className="row mb-2">
        <div className="col-md-8 col-xl-6 text-center mx-auto">
          <h2 className="fw-bold text-primary">Management Terminal</h2>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-12 d-flex align-items-center" style={{height: 36}}>
          <select
            style={{ width: 120, fontSize: 15, borderRadius: 4, border: '1px solid #aab3b9', background: '#fff', color: '#0d6efd', outline: 'none', padding: '4px 8px', fontWeight: 600 }}
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
                  ref={el => { if (el && mode === 'sql') el.focus(); }}
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
                          const res = await fetch('/api/admin/terminal-sql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sql: sqlInput }) });
                          const data = await res.json();
                          if (res.ok) {
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
                        setSqlInput('');
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
                      const res = await fetch('/api/admin/terminal-sql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sql: sqlInput }) });
                      const data = await res.json();
                      if (res.ok) {
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
                    setSqlInput('');
                    setSqlLoading(false);
                  }}
                >{sqlLoading ? 'Running...' : 'Run'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
