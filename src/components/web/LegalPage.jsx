import React, { useEffect, useState } from 'react';

const SECTIONS = {
  privacy: { title: 'Privacy Policy', file: 'PRIVACY.md' },
  terms: { title: 'Terms of Service', file: 'TERMS.md' },
  kvkk: { title: 'KVKK Aydınlatma Metni', file: 'KVKK.md' },
};

// Minimal markdown renderer — handles headings, bold, links, lists, paragraphs.
function renderMarkdown(md) {
  const lines = md.split('\n');
  const out = [];
  let listBuf = [];

  const flushList = () => {
    if (listBuf.length === 0) return;
    out.push(
      <ul key={`ul-${out.length}`} style={{ paddingLeft: 22, lineHeight: 1.7 }}>
        {listBuf.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inline(item) }} />
        ))}
      </ul>
    );
    listBuf = [];
  };

  const inline = (s) =>
    s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#14B8D4">$1</a>');

  lines.forEach((line, idx) => {
    if (line.startsWith('## ')) {
      flushList();
      out.push(
        <h2 key={idx} style={{ marginTop: 28, fontSize: 20, color: '#FFFFFF' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      flushList();
      out.push(
        <h1 key={idx} style={{ fontSize: 28, color: '#FFFFFF', marginBottom: 16 }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('- ')) {
      listBuf.push(line.slice(2));
    } else if (line.startsWith('| ')) {
      // Skip raw tables for simplicity — show as preformatted.
      flushList();
      out.push(
        <pre
          key={idx}
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            margin: 0,
            fontFamily: 'monospace',
          }}
        >
          {line}
        </pre>
      );
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      out.push(
        <p
          key={idx}
          style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: '12px 0' }}
          dangerouslySetInnerHTML={{ __html: inline(line) }}
        />
      );
    }
  });
  flushList();
  return out;
}

export default function LegalPage({ section = 'privacy' }) {
  const current = SECTIONS[section] || SECTIONS.privacy;
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    fetch(`/legal/${current.file}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(setContent)
      .catch(() => setContent('# Not available\n\nLegal document not yet published.'));
  }, [current.file]);

  return (
    <div style={{ minHeight: '100vh', background: '#061829', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {Object.entries(SECTIONS).map(([key, s]) => (
            <a
              key={key}
              href={`/legal/${key}`}
              style={{
                color: key === section ? '#14B8D4' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {s.title}
            </a>
          ))}
        </nav>
        <article>{renderMarkdown(content)}</article>
        <footer style={{ marginTop: 60, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)' }}>
            ← BreakFree
          </a>
        </footer>
      </div>
    </div>
  );
}
