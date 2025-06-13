import React, { useRef, useEffect } from 'react';

export default function SixDigitInput({ value, onChange, onComplete }) {
  const values = typeof value === 'string' ? value.split('').slice(0, 6) : (value || []).slice(0, 6);
  const arr = Array(6).fill('');
  const code = arr.map((_, i) => values[i] || '');
  const inputs = useRef([]);

  // Auto verify when all digits are filled
  useEffect(() => {
    if (code.every(d => d)) {
      onComplete && onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    let newCode = [...code];
    if (val.length === 1) {
      newCode[idx] = val;
      onChange(newCode.join(''));
      if (idx < 5) {
        setTimeout(() => inputs.current[idx + 1]?.focus(), 0);
      }
    } else if (val.length > 1) {
      // If user types/pastes multiple digits in one box, fill in from current idx
      for (let i = 0; i < val.length && idx + i < 6; i++) {
        newCode[idx + i] = val[i];
      }
      onChange(newCode.join(''));
      const nextIdx = Math.min(idx + val.length, 5);
      setTimeout(() => inputs.current[nextIdx]?.focus(), 0);
    } else {
      newCode[idx] = '';
      onChange(newCode.join(''));
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (code[idx]) {
        const newCode = [...code];
        newCode[idx] = '';
        onChange(newCode.join(''));
      } else if (idx > 0) {
        const newCode = [...code];
        newCode[idx - 1] = '';
        onChange(newCode.join(''));
        setTimeout(() => inputs.current[idx - 1]?.focus(), 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      setTimeout(() => inputs.current[idx - 1]?.focus(), 0);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      setTimeout(() => inputs.current[idx + 1]?.focus(), 0);
      e.preventDefault();
    } else if (e.key === 'Enter' && code.every(d => d)) {
      onComplete && onComplete();
    }
  };

  const handleFocus = (e, idx) => {
    // Select the digit for easy overwrite
    e.target.select();
  };

  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 12 }}>
      {code.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6 - idx}
          className="form-control text-center"
          style={{ width: 48, height: 48, fontSize: 24, border: '2px solid #ccc', borderRadius: 8, background: '#fff', padding: 0 }}
          value={digit}
          ref={el => (inputs.current[idx] = el)}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onFocus={e => handleFocus(e, idx)}
          autoFocus={idx === 0}
          aria-label={`Digit ${idx + 1}`}
          tabIndex={0}
        />
      ))}
    </div>
  );
}
