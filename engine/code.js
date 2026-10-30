// One progress code for the whole IGCSE Maths Hub: it carries every "mh-" key saved in
// this browser (all lessons, name and class, tier), so a student can move to another device.
// Used by the lessons (My progress) and by the hub page. Nothing is sent to a server.
window.MHCode = (() => {
  'use strict';
  const TAG = 'MH1';
  const b64 = (bytes) => { let s = ''; bytes.forEach((b) => { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64 = (s) => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0').slice(0, 5).toUpperCase(); };
  const pipe = async (bytes, Stream, mode) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new Stream(mode))).arrayBuffer());
  const SKIP = ['mh-projector'];

  // Every saved maths key in this browser.
  const collect = () => {
    const all = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('mh-') && !SKIP.includes(k)) all[k] = localStorage.getItem(k);
      }
    } catch (e) { /* storage blocked */ }
    return all;
  };

  const make = async () => {
    const bytes = new TextEncoder().encode(JSON.stringify({ v: 2, all: collect() }));
    let tag = TAG, data = bytes;
    if (window.CompressionStream) {
      try { data = await pipe(bytes, CompressionStream, 'deflate-raw'); tag = TAG + 'Z'; } catch (e) { data = bytes; tag = TAG; }
    }
    const body = b64(data);
    return `${tag}.${body}.${hash(body)}`;
  };

  // Returns the saved keys inside a code ({ key: string }), or throws a friendly error.
  const read = async (code) => {
    const clean = String(code || '').replace(/\s+/g, '');
    const m = clean.match(/^(MH1Z?)\.([A-Za-z0-9_-]+)\.([0-9A-F]{5})$/);
    if (!m) throw new Error('This does not look like a maths progress code. It should start with MH1.');
    if (hash(m[2]) !== m[3]) throw new Error('The code is incomplete or has a mistake. Copy the whole code again.');
    let bytes = unb64(m[2]);
    if (m[1] === 'MH1Z') {
      if (!window.DecompressionStream) throw new Error('This browser is too old to read this code. Try Chrome, Edge, Firefox or Safari.');
      bytes = await pipe(bytes, DecompressionStream, 'deflate-raw');
    }
    const s = JSON.parse(new TextDecoder().decode(bytes));
    if (!s || s.v !== 2 || typeof s.all !== 'object') throw new Error('This code is not from the IGCSE Maths Hub.');
    return s.all;
  };

  // Replace the maths progress in this browser with the keys from a code.
  const apply = (all) => {
    try {
      Object.keys(collect()).forEach((k) => localStorage.removeItem(k));
      Object.entries(all).forEach(([k, v]) => { if (k.startsWith('mh-')) localStorage.setItem(k, v); });
    } catch (e) { /* storage blocked */ }
  };

  return { make, read, apply, collect };
})();
