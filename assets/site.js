(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close −' : 'Menu +';
    nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      menu.click(); menu.focus();
    }
  });
  const cards = [...document.querySelectorAll('[data-course]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#course-search');
  let activeFilter = 'all';
  function filterCourses() {
    const query = (search?.value || '').trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const match = (activeFilter === 'all' || card.dataset.category === activeFilter)
        && (card.dataset.search || card.textContent).toLowerCase().includes(query);
      card.hidden = !match;
      if(match) count++;
    });
    const counter = document.querySelector('#result-count');
    if(counter) counter.textContent = `${count} ${count === 1 ? 'programme' : 'programmes'} to explore`;
    const empty = document.querySelector('#no-results');
    if(empty) empty.hidden = count > 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterCourses();
  }));
  search?.addEventListener('input', filterCourses);
  const form = document.querySelector('#interest-form');
  if(!form) return;
  const course = document.querySelector('#programme');
  const selectedCourse = new URLSearchParams(location.search).get('course');
  if(selectedCourse && [...course.options].some(o => o.value === selectedCourse)) course.value = selectedCourse;
  const registrationUrl = window.DHRUV_CONFIG?.registrationUrl || '';
  let approvedUrl = null;
  try { const url = new URL(registrationUrl); if(url.protocol === 'https:') approvedUrl = url; } catch {}
  if(approvedUrl) {
    document.querySelector('#form-preview').hidden = true;
    const live = document.querySelector('#crm-ready');
    live.hidden = false;
    const link = live.querySelector('a');
    link.href = approvedUrl.href;
    document.querySelector('#registration-status').textContent = 'Use the school’s official enquiry form to register your interest. You will review and submit your details there.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if(!form.reportValidity()) return;
    const data = new FormData(form);
    const feedback = document.querySelector('#form-feedback');
    const list = feedback.querySelector('dl');
    list.replaceChildren();
    const fields = [['Name',data.get('name')],['Email',data.get('email')],['Programme',course.selectedOptions[0].text],['Current stage',data.get('education')],['What you want to explore',data.get('message') || 'Not specified']];
    for(const [label,value] of fields) {
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = String(value);
      list.append(dt,dd);
    }
    feedback.hidden = false;
    feedback.focus();
    feedback.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'center'});
  });
  document.querySelector('#clear-preview')?.addEventListener('click', () => {
    form.reset();
    document.querySelector('#form-feedback').hidden = true;
    document.querySelector('#full-name').focus();
  });
})();
