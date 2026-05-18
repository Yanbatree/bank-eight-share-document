// ============================================================
//  Global Navigation Sidebar — Shared across all module pages
//  Desktop: fixed left sidebar
//  Mobile: hamburger → slide-in drawer + overlay backdrop
// ============================================================

(function() {
  var MODULES = [
    { href: 'index.html',                           label: '首页总览',     accent: '#94a3b8' },
    { href: '01-MySQL/MySQL八股文.html',            label: 'MySQL',        accent: '#38bdf8' },
    { href: '02-Redis/Redis八股文.html',            label: 'Redis',        accent: '#f472b6' },
    { href: '03-集合/集合八股文.html',                label: 'Java 集合',    accent: '#a78bfa' },
    { href: '04-多线程/多线程八股文.html',            label: '多线程',       accent: '#fb923c' },
    { href: '05-JVM/JVM八股文.html',                 label: 'JVM',          accent: '#34d399' },
    { href: '06-计算机网络/计算机网络八股文.html',    label: '计算机网络',   accent: '#60a5fa' },
    { href: '07-SSM/SSM八股文.html',                 label: 'SSM 框架',     accent: '#c084fc' },
    { href: '08-场景题/场景题八股文.html',            label: '场景题',       accent: '#fbbf24' },
    { href: '09-Agent技术/Agent技术八股文.html',      label: 'Agent & MCP',  accent: '#22d3ee' },
    { href: '10-银行业务/银行业务八股文.html',        label: '银行业务',     accent: '#f97316' },
    { href: '11-银行智能化/银行智能化八股文.html',    label: '银行智能化',   accent: '#818cf8' },
  ];

  // Normalize Windows backslashes in pathname
  var pathname = window.location.pathname.replace(/\\/g, '/');

  // Determine if we're at root (index.html) or in a subdirectory
  var isRoot = /\/index\.html$/.test(pathname) ||
               pathname === '/' ||
               pathname === '' ||
               /^\/[A-Za-z]:\/[^\/]+\/[^\/]+\.html$/.test(pathname);

  // If in subdirectory, all relative links need "../" prefix
  var prefix = isRoot ? '' : '../';

  function resolveHref(href) {
    return prefix + href;
  }

  function isActive(href) {
    return pathname.indexOf(href.replace(/^\d\d-/, '').replace(/\/.+\.html$/, '')) !== -1 ||
           pathname.indexOf(href.replace(/\.html$/, '')) !== -1;
  }

  // ── Inject hamburger button & overlay (mobile-only) ──
  var hamburgerHTML = '<button class="hamburger" aria-label="菜单" id="hamburger-btn">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'
    + '</svg></button>'
    + '<div class="sidebar-overlay" id="sidebar-overlay"></div>';
  document.body.insertAdjacentHTML('afterbegin', hamburgerHTML);

  // ── Build sidebar HTML ──────────────────────────────
  var html = '<nav class="sidebar" id="global-nav">';

  // Header: home icon + title linking to index
  html += '<div class="sidebar-header" style="margin-bottom:14px">';
  html += '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  html += '<a href="' + resolveHref('index.html') + '" style="text-decoration:none;color:inherit;font-weight:700;font-size:15px;letter-spacing:-0.01em">银行八股文</a>';
  html += '</div>';

  // Module list
  html += '<div class="sidebar-section">';
  html += '<div class="sidebar-section-label">全部模块</div>';
  MODULES.forEach(function(m) {
    var hrefFolder = m.href.split('/')[0];
    var active = (hrefFolder === 'index.html') ? isRoot : (pathname.indexOf('/' + hrefFolder + '/') !== -1);

    html += '<a href="' + resolveHref(m.href) + '"';
    if (active) html += ' class="active"';
    html += ' style="display:flex;align-items:center;gap:8px">';
    html += '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + m.accent + ';flex-shrink:0"></span>';
    html += m.label;
    html += '</a>';
  });
  html += '</div>';

  // Page TOC placeholder (filled after DOM ready)
  html += '<div style="margin-top:auto;padding-top:16px;border-top:1px solid var(--border-subtle)">';
  html += '<div class="sidebar-section-label">当前页目录</div>';
  html += '<div id="page-toc"></div>';
  html += '</div>';

  html += '</nav>';

  // ── Inject into page ────────────────────────────────
  var oldNav = document.querySelector('.sidebar');
  if (oldNav) oldNav.remove();
  document.body.insertAdjacentHTML('afterbegin', html);

  // ── Mobile: hamburger toggle logic ──────────────────
  var sidebar = document.getElementById('global-nav');
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var overlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('open')) { closeSidebar(); }
    else { openSidebar(); }
  });

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when tapping any nav link
  sidebar.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') { closeSidebar(); }
  });

  // ── Build page TOC from existing h2/h3 headings ────
  function buildTOC() {
    var toc = document.getElementById('page-toc');
    if (!toc) return;
    var headings = document.querySelectorAll('.main h2, .main h3');
    var tocHtml = '';
    headings.forEach(function(h, i) {
      if (!h.id) h.id = 'section-' + i;
      var indent = h.tagName === 'H3' ? ' style="padding-left:14px;font-size:12px"' : '';
      tocHtml += '<a href="#' + h.id + '"' + indent + '>' + h.textContent + '</a>';
    });
    toc.innerHTML = tocHtml || '<span style="color:var(--text-tertiary);font-size:12px">（无子目录）</span>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTOC);
  } else {
    buildTOC();
  }

})();
