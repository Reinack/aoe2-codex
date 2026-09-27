// ═══════════════════════════════════════════════════════════
// DESPLEGABLE ESTILO AoE2 (papiro, ícono por opción)
// ═══════════════════════════════════════════════════════════
//
// Envuelve un <select> nativo, que sigue siendo la fuente de verdad: el resto
// del código lee/escribe select.value y escucha 'change' como siempre.
// Las opciones se reconstruyen solas cuando cambia el <select> (p. ej. al
// cambiar de idioma) y la etiqueta se sincroniza con cada 'change'.
// La lista se posiciona fija respecto de la ventana, así ningún panel con
// scroll la recorta.

let aoeSelectSeq = 0;

// icon: value → ruta del ícono (o null para opciones sin ícono, como un placeholder)
function enhanceSelect(select, { icon = null } = {}) {
  const uid = `aoe-select-${++aoeSelectSeq}`;
  const iconOf = value => (icon && value ? icon(value) : null);
  const wrap = document.createElement('div');
  wrap.className = 'aoe-select';
  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(select);
  select.classList.add('aoe-select-native');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'aoe-select-btn';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `${uid}-list`);
  if (select.getAttribute('aria-label')) btn.setAttribute('aria-label', select.getAttribute('aria-label'));
  btn.innerHTML = `${icon ? '<img class="aoe-select-icon" alt="">' : ''}<span class="aoe-select-label"></span><span class="aoe-select-arrow" aria-hidden="true"></span>`;
  wrap.appendChild(btn);

  const list = document.createElement('ul');
  list.className = 'aoe-select-list';
  list.id = `${uid}-list`;
  list.setAttribute('role', 'listbox');
  list.tabIndex = -1;
  list.hidden = true;
  wrap.appendChild(list);

  const btnIcon = btn.querySelector('.aoe-select-icon');
  const btnLabel = btn.querySelector('.aoe-select-label');
  let items = [];
  let active = -1;

  function build() {
    list.innerHTML = '';
    items = [...select.options].map((opt, i) => {
      const li = document.createElement('li');
      li.id = `${uid}-opt-${i}`;
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      const src = iconOf(opt.value);
      li.innerHTML = `${icon ? (src ? `<img src="${src}" alt="">` : '<i class="aoe-select-noicon"></i>') : ''}<span class="aoe-select-text"><span></span></span>`;
      li.querySelector('.aoe-select-text > span').textContent = opt.textContent;
      // Segunda línea opcional (data-sub en la <option>), p. ej. el bono de equipo de un aliado
      if (opt.dataset.sub) {
        const sub = document.createElement('small');
        sub.textContent = opt.dataset.sub;
        li.querySelector('.aoe-select-text').appendChild(sub);
        li.title = opt.dataset.sub;
      }
      list.appendChild(li);
      return li;
    });
    sync();
  }

  function sync() {
    const opt = select.options[select.selectedIndex];
    btnLabel.textContent = opt ? opt.textContent : '';
    if (btnIcon) {
      const src = opt && iconOf(opt.value);
      if (src) btnIcon.src = src;
      btnIcon.hidden = !src;
    }
    btn.disabled = select.disabled;
    items.forEach((li, i) => li.setAttribute('aria-selected', String(i === select.selectedIndex)));
  }

  function setActive(i) {
    if (!items.length) return;
    active = Math.max(0, Math.min(items.length - 1, i));
    items.forEach((li, j) => li.classList.toggle('active', j === active));
    list.setAttribute('aria-activedescendant', items[active].id);
    items[active].scrollIntoView({ block: 'nearest' });
  }

  function open() {
    if (!list.hidden || btn.disabled) return;
    list.hidden = false;
    // Debajo del botón; hacia arriba si abajo no hay lugar (p. ej. el idioma, al pie)
    const r = btn.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - 10;
    const above = r.top - 10;
    list.style.maxHeight = 'none';
    const wanted = Math.min(list.offsetHeight, window.innerHeight * 0.6);
    const up = below < wanted && above > below;
    list.style.maxHeight = `${Math.min(wanted, up ? above : below)}px`;
    list.style.left = `${r.left}px`;
    list.style.width = `${r.width}px`;
    list.style.top = up ? '' : `${r.bottom + 2}px`;
    list.style.bottom = up ? `${window.innerHeight - r.top + 2}px` : '';
    wrap.classList.toggle('drop-up', up);
    wrap.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    setActive(select.selectedIndex);
    items[active]?.scrollIntoView({ block: 'center' });
    list.focus({ preventScroll: true });
  }

  function close(focusBtn = true) {
    if (list.hidden) return;
    list.hidden = true;
    wrap.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    if (focusBtn) btn.focus({ preventScroll: true });
  }

  function choose(i) {
    const value = items[i]?.dataset.value;
    close();
    if (value == null || value === select.value) return;
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Búsqueda por teclado: tipear las primeras letras salta a la opción
  let typed = '';
  let typedAt = 0;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function typeAhead(ch) {
    const now = Date.now();
    typed = now - typedAt > 700 ? ch : typed + ch;
    typedAt = now;
    const q = norm(typed);
    const start = typed.length === 1 ? active + 1 : active;
    for (let k = 0; k < items.length; k++) {
      const i = (start + k) % items.length;
      if (norm(select.options[i].textContent).startsWith(q)) { setActive(i); return; }
    }
  }
  const isChar = ev => ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey;

  btn.addEventListener('click', () => (list.hidden ? open() : close()));
  btn.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(ev.key)) {
      ev.preventDefault();
      open();
    } else if (isChar(ev)) {
      open();
      typeAhead(ev.key);
    }
  });

  list.addEventListener('keydown', ev => {
    const moves = { ArrowDown: 1, ArrowUp: -1, PageDown: 8, PageUp: -8 };
    if (ev.key in moves) setActive(active + moves[ev.key]);
    else if (ev.key === 'Home') setActive(0);
    else if (ev.key === 'End') setActive(items.length - 1);
    else if (ev.key === 'Enter' || ev.key === ' ') choose(active);
    else if (ev.key === 'Escape') { ev.stopPropagation(); close(); }
    else if (ev.key === 'Tab') { close(false); return; }
    else if (isChar(ev)) typeAhead(ev.key);
    else return;
    ev.preventDefault();
  });
  list.addEventListener('mousemove', ev => {
    const li = ev.target.closest('li');
    if (li && items.indexOf(li) !== active) setActive(items.indexOf(li));
  });
  list.addEventListener('click', ev => {
    const li = ev.target.closest('li');
    if (li) choose(items.indexOf(li));
  });
  list.addEventListener('focusout', ev => { if (!wrap.contains(ev.relatedTarget)) close(false); });
  document.addEventListener('mousedown', ev => { if (!wrap.contains(ev.target)) close(false); }, true);
  // La lista es fija: si se desplaza o cambia de tamaño lo que la rodea, se cierra
  document.addEventListener('scroll', ev => { if (ev.target !== list) close(false); }, true);
  window.addEventListener('resize', () => close(false));

  select.addEventListener('change', sync);
  new MutationObserver(build).observe(select, { childList: true, attributes: true, attributeFilter: ['disabled'] });
  // Asignar `value`/`selectedIndex` por código no dispara 'change': se interceptan para sincronizar
  for (const prop of ['value', 'selectedIndex']) {
    const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, prop);
    Object.defineProperty(select, prop, {
      configurable: true,
      get() { return desc.get.call(this); },
      set(v) { desc.set.call(this, v); sync(); },
    });
  }
  build();
  return { open, close, refresh: build };
}
