import React from 'react';
import { toast } from '@/lib/store/useAppStore';

interface WorkspaceTestResultsProps {
  output: { success: boolean; message: string } | null;
  terminalLogs: string[];
  langFile: string;
  onAskAiTutor: () => void;
  isHardwareQuest: boolean;
  isCompleted: boolean;
}

export function WorkspaceTestResults({
  output,
  terminalLogs,
  langFile,
  onAskAiTutor,
  isHardwareQuest,
  isCompleted,
}: WorkspaceTestResultsProps) {
  return (
    <div>
      {/* Terminal Output */}
      <div style={{
        marginTop: 16,
        background: '#090a0f',
        border: '1.5px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)'
      }}>
        {/* Terminal Bar Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#11131a',
          borderBottom: '1px solid var(--border)',
          padding: '6px 14px'
        }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>
            <span style={{ color: 'var(--accent)', borderBottom: '2px solid var(--accent)', paddingBottom: 2 }}>TERMINAL</span>
            <span>OUTPUT</span>
            <span>PROBLEMS</span>
          </div>

          {output && !output.success && (
            <button
              onClick={onAskAiTutor}
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                border: 'none',
                borderRadius: 8,
                color: 'var(--text)',
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              className="btn-glow"
            >
              🤖 Ask AI Debug Tutor
            </button>
          )}
        </div>

        {/* Terminal Logs Prompt */}
        <div style={{ padding: '12px 16px', minHeight: 100, fontSize: 12, lineHeight: 1.6, color: 'var(--text)' }}>
          <div style={{ color: '#00ff66', fontWeight: 700, marginBottom: 6 }}>
            bash - pinit-compiler-v2.0 ~ $ execution-runner --lang={langFile}
          </div>
          {terminalLogs.length > 0 ? (
            terminalLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.startsWith('[ERROR]') ? 'var(--coral)' : log.startsWith('[WARN]') ? 'var(--amber)' : '#e2e8f0' }}>
                {log}
              </div>
            ))
          ) : output ? (
            <div style={{ color: output.success ? 'var(--green)' : 'var(--coral)', fontWeight: 700 }}>
              {output.success ? '✓ [SUCCESS] ' : '❌ [ERROR] '}{output.message}
            </div>
          ) : (
            <div style={{ color: 'var(--t4)', fontStyle: 'italic' }}>
              Press "Run Code / Verify" to compile script and view terminal outputs...
            </div>
          )}
        </div>
      </div>

      {/* Compiler output badge */}
      {output && (
        <div style={{
          marginTop: 12,
          background: output.success ? 'rgba(var(--success-deep-rgb), 0.06)' : 'rgba(var(--danger-rgb), 0.06)',
          border: `1.5px solid ${output.success ? 'var(--green)' : 'var(--coral)'}`,
          padding: 14,
          borderRadius: 12,
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: output.success ? 'var(--green)' : 'var(--coral)',
          whiteSpace: 'pre-wrap'
        }}>
          {output.success ? '🟢 ' : '🔴 '}
          {output.message}
        </div>
      )}

      {/* Bynik Hardware Flashing Tool */}
      {isHardwareQuest && (
        <div style={{
          marginTop: 12,
          padding: 16,
          background: 'rgba(var(--purple-rgb, 124, 58, 237), 0.06)',
          border: '1px solid rgba(var(--purple-rgb, 124, 58, 237), 0.2)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: 12, fontWeight: 900, color: 'var(--reward-bright)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
              🔌 Bynik Hardware Flashing Tool
            </h4>
            <span style={{ fontSize: 9.5, background: 'rgba(var(--purple-rgb, 124, 58, 237), 0.15)', color: 'var(--reward-bright)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>
              v1.0.4 Connected
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.45, margin: 0 }}>
            Deploy your compiled firmware solution directly to the target microcontroller core using the Bynik USB bridge.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                if (isCompleted) return;
                toast.info('Bynik: Compiling...', 'Translating code to binary hex payload...');
                setTimeout(() => {
                  toast.success('Bynik: Flash Completed! ⚡', 'Firmware successfully written to CPU address 0x08000000.');
                }, 1800);
              }}
              disabled={isCompleted}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: isCompleted ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                border: isCompleted ? '1px solid var(--border)' : 'none',
                color: isCompleted ? 'var(--t3)' : 'var(--text)',
                fontWeight: 700,
                fontSize: 11.5,
                borderRadius: 8,
                cursor: isCompleted ? 'not-allowed' : 'pointer',
                boxShadow: isCompleted ? 'none' : '0 4px 10px rgba(var(--purple-rgb, 124, 58, 237), 0.2)'
              }}
            >
              Deploy to CPU (Bynik)
            </button>
            <button
              onClick={() => {
                if (isCompleted) return;
                toast.info('Bynik: Resetting CPU...', 'Sending hardware restart signal...');
                setTimeout(() => {
                  toast.success('Bynik: CPU Restarted 🔄', 'Microcontroller core bootloader initialized.');
                }, 1000);
              }}
              disabled={isCompleted}
              style={{
                padding: '8px 12px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                color: isCompleted ? 'var(--t3)' : 'var(--t1)',
                fontWeight: 700,
                fontSize: 11.5,
                borderRadius: 8,
                cursor: isCompleted ? 'not-allowed' : 'pointer'
              }}
            >
              Reset CPU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
