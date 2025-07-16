'use client';
import { useState } from 'react';

export default function ControlRow<T extends number | string | boolean>({
  label,
  value,
  onChange,
  step = 1,
  formatter = (v: T) => String(v),
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  step?: number;
  formatter?: (v: T) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value.toString());

  const toggleBool = () => onChange(!value as T);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-700/20 text-cyan-300 font-mono text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === 'boolean' ? (
          <button
            className="px-2 py-1 border border-cyan-500 rounded hover:bg-cyan-700/30"
            onClick={toggleBool}
          >
            {value ? 'On' : 'Off'}
          </button>
        ) : (
          <>
            <button onClick={() => onChange(((value as number) - step) as T)}>-</button>
            {editing ? (
              <input
                autoFocus
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                onBlur={() => {
                  onChange(isNaN(+temp) ? (temp as unknown as T) : ((+temp) as T));
                  setEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onChange(isNaN(+temp) ? (temp as unknown as T) : ((+temp) as T));
                    setEditing(false);
                  }
                }}
                className="bg-transparent border border-cyan-400 px-1 text-right w-16"
              />
            ) : (
              <span
                onClick={() => setEditing(true)}
                className="px-2 py-1 border border-cyan-500 rounded cursor-pointer hover:underline text-right w-16 text-cyan-100"
              >
                {formatter(value)}
              </span>
            )}
            <button onClick={() => onChange(((value as number) + step) as T)}>+</button>
          </>
        )}
      </div>
    </div>
  );
}
