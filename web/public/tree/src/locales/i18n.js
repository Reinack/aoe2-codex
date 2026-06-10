'use strict';
// ── Locale registry ──────────────────────────────────────────────────────────
// LOCALE_ES and LOCALE_EN are defined in locale/es.js and locale/en.js,
// which are loaded before this file in index.html.
const LOCALE = {
  es: LOCALE_ES,
  en: LOCALE_EN,
};

let currentLang = localStorage.getItem('aoe2_lang') || 'es';

// ── t(key, category) ─────────────────────────────────────────────────────────
// Looks up a UI / meta string (ui, types, ages, buildings).
function t(key, category = 'ui') {
  const cat = LOCALE[currentLang]?.[category];
  if (!cat) return key;
  return cat[key] ?? key;
}

// ── tData(obj, field) ────────────────────────────────────────────────────────
// Resolves the translated value of a field on a node/unit object.
//
// Priority:
//   1. Runtime-set value on obj (e.g. updateUniqueForCiv sets obj.name).
//      Handles both plain strings and legacy {es,en} objects.
//   2. Locale file lookup via LOCALE[lang].nodes[obj.id][field].
//   3. Empty string fallback.
//
// The optional third argument is accepted but ignored (legacy call sites pass
// a category string that is no longer needed).
function tData(obj, field, _category) {
  if (!obj) return '';

  // 1. Runtime-set value
  const direct = obj[field];
  if (direct !== undefined && direct !== null) {
    if (typeof direct === 'object' && direct[currentLang]) return direct[currentLang];
    if (typeof direct === 'string' && direct !== '')       return direct;
  }

  // 2. Locale file lookup
  const nodeData = LOCALE[currentLang]?.nodes?.[obj.id];
  if (nodeData?.[field] !== undefined) return nodeData[field];

  return '';
}

// ── setLanguage(lang) ────────────────────────────────────────────────────────
function setLanguage(lang) {
  if (!LOCALE[lang]) return;
  currentLang = lang;
  localStorage.setItem('aoe2_lang', lang);
  document.documentElement.lang = lang;
  if (typeof render === 'function') render();
  updateUIStrings();
}

// ── updateUIStrings() ────────────────────────────────────────────────────────
function updateUIStrings() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const [cat, key] = el.getAttribute('data-i18n').split('.');
    el.innerText = t(key, cat);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const attr = el.getAttribute('data-i18n-title');
    const [cat, key] = attr.includes('.') ? attr.split('.') : ['ui', attr];
    el.title = t(key, cat);
  });
}
