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
    { href: '12-JAVA基础/JAVA基础八股文.html',        label: 'JAVA 基础',    accent: '#f87171' },
    { href: '13-设计模式/设计模式八股文.html',          label: '设计模式',     accent: '#2dd4bf' },
    { href: '14-SpringBoot/SpringBoot八股文.html',      label: 'Spring Boot',  accent: '#a3e635' },
    { href: '15-操作系统/操作系统八股文.html',          label: '操作系统',     accent: '#eab308' },
    { href: '16-消息队列/消息队列八股文.html',          label: '消息队列',     accent: '#d946ef' },
    { href: '17-Linux常用命令/Linux常用命令八股文.html', label: 'Linux 命令',   accent: '#0ea5e9' },
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

  // ── Inject hamburger button, theme toggle & overlay (mobile-only) ──
  var hamburgerHTML = '<button class="hamburger" aria-label="菜单" id="hamburger-btn">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'
    + '</svg></button>'
    + '<button class="theme-toggle-mobile" id="theme-toggle-mobile" aria-label="切换主题">'
    + '<svg id="theme-icon-mobile" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></button>'
    + '<div class="sidebar-overlay" id="sidebar-overlay"></div>';
  document.body.insertAdjacentHTML('afterbegin', hamburgerHTML);

  // ── Build sidebar HTML ──────────────────────────────
  var html = '<nav class="sidebar" id="global-nav">';

  // Header: home icon + title + collapse toggle
  html += '<div class="sidebar-header" style="margin-bottom:14px;position:relative">';
  html += '<a href="' + resolveHref('index.html') + '" style="display:flex;align-items:center;gap:8px;text-decoration:none;color:inherit;font-weight:700;font-size:15px;letter-spacing:-0.01em">';
  html += '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  html += '<span>银行八股文</span>';
  html += '</a>';
  html += '<button class="sidebar-toggle" id="sidebar-toggle" title="收起侧边栏" aria-label="收起侧边栏">';
  html += '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  html += '</button>';
  html += '</div>';

  // Theme toggle — in sidebar flow, below header
  html += '<button class="theme-toggle" id="theme-toggle" title="切换亮色/暗色主题" aria-label="切换主题">';
  html += '<span class="theme-toggle-label">亮色</span>';
  html += '<span class="theme-toggle-icon-circle"><svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></span>';
  html += '</button>';

  // Module list
  html += '<div class="sidebar-section">';
  html += '<div class="sidebar-section-label" style="display:flex;align-items:center;justify-content:space-between">';
  html += '<span>全部模块</span>';
  html += '<button class="module-collapse-btn" id="module-collapse-btn" title="折叠全部模块" aria-label="折叠全部模块">';
  html += '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  html += '</button>';
  html += '</div>';
  html += '<div id="module-list">';
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
  html += '</div>';

  // Page TOC placeholder (filled after DOM ready)
  html += '<div style="margin-top:auto;padding-top:16px;border-top:1px solid var(--border-subtle)">';
  html += '<div class="sidebar-section-label">当前页目录</div>';
  html += '<div id="page-toc"></div>';
  html += '</div>';

  html += '</nav>';

  // ── Inject sidebar + edge handle into page ──────────
  var oldNav = document.querySelector('.sidebar');
  if (oldNav) oldNav.remove();
  var oldHandle = document.querySelector('.sidebar-handle');
  if (oldHandle) oldHandle.remove();
  document.body.insertAdjacentHTML('afterbegin', html);
  document.body.insertAdjacentHTML('afterbegin', '<div class="sidebar-handle" id="sidebar-handle" title="展开侧边栏"></div>');

  // ── Mobile: hamburger toggle logic ──────────────────
  var sidebar = document.getElementById('global-nav');
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var overlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.remove('collapsed');
    var mc = document.querySelector('.main');
    if (mc) mc.classList.remove('expanded');
    var h = document.getElementById('sidebar-handle');
    if (h) h.classList.remove('visible');
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

  // ── Collapse/expand sidebar ─────────────────────────
  var toggleBtn = document.getElementById('sidebar-toggle');
  var handle = document.getElementById('sidebar-handle');
  var mainContent = document.querySelector('.main');

  function collapseSidebar() {
    sidebar.classList.add('collapsed');
    if (mainContent) mainContent.classList.add('expanded');
    if (handle) handle.classList.add('visible');
    toggleBtn.setAttribute('title', '展开侧边栏');
    toggleBtn.querySelector('svg').innerHTML = '<polyline points="9 18 15 12 9 6"/>';
    try { localStorage.setItem('sidebar-collapsed', '1'); } catch(e) {}
  }

  function expandSidebar() {
    sidebar.classList.remove('collapsed');
    if (mainContent) mainContent.classList.remove('expanded');
    if (handle) handle.classList.remove('visible');
    toggleBtn.setAttribute('title', '收起侧边栏');
    toggleBtn.querySelector('svg').innerHTML = '<polyline points="15 18 9 12 15 6"/>';
    try { localStorage.setItem('sidebar-collapsed', '0'); } catch(e) {}
  }

  toggleBtn.addEventListener('click', function() {
    if (sidebar.classList.contains('collapsed')) { expandSidebar(); }
    else { collapseSidebar(); }
  });

  if (handle) {
    handle.addEventListener('click', expandSidebar);
  }

  // Restore saved state
  try {
    if (localStorage.getItem('sidebar-collapsed') === '1') { collapseSidebar(); }
  } catch(e) {}

  // ── Module list collapse toggle ──────────────────────
  var moduleCollapseBtn = document.getElementById('module-collapse-btn');
  var moduleList = document.getElementById('module-list');

  function collapseModules() {
    if (moduleList) moduleList.classList.add('collapsed');
    if (moduleCollapseBtn) {
      moduleCollapseBtn.setAttribute('title', '展开全部模块');
      moduleCollapseBtn.querySelector('svg').innerHTML = '<polyline points="6 9 12 15 18 9"/>';
    }
    try { localStorage.setItem('modules-collapsed', '1'); } catch(e) {}
  }

  function expandModules() {
    if (moduleList) moduleList.classList.remove('collapsed');
    if (moduleCollapseBtn) {
      moduleCollapseBtn.setAttribute('title', '折叠全部模块');
      moduleCollapseBtn.querySelector('svg').innerHTML = '<polyline points="18 15 12 9 6 15"/>';
    }
    try { localStorage.setItem('modules-collapsed', '0'); } catch(e) {}
  }

  if (moduleCollapseBtn) {
    moduleCollapseBtn.addEventListener('click', function() {
      if (moduleList && moduleList.classList.contains('collapsed')) {
        expandModules();
      } else {
        collapseModules();
      }
    });
  }

  // Restore saved module collapse state
  try {
    if (localStorage.getItem('modules-collapsed') === '1') { collapseModules(); }
  } catch(e) {}

  // ── Theme toggle ────────────────────────────────────
  var themeBtn = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');
  var themeBtnMobile = document.getElementById('theme-toggle-mobile');
  var themeIconMobile = document.getElementById('theme-icon-mobile');
  var htmlEl = document.documentElement;

  var moonSVG = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  var sunSVG = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m-8.48-3.52l1.41-1.41m12.73-12.73l1.41-1.41M2 12h2m16 0h2m-15.48 6.07l1.41-1.41m12.73-12.73l1.41-1.41"/>';

  function setTheme(theme) {
    var label = themeBtn ? themeBtn.querySelector('.theme-toggle-label') : null;
    if (theme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.innerHTML = sunSVG;
      if (themeIconMobile) themeIconMobile.innerHTML = sunSVG;
      if (themeBtn) themeBtn.setAttribute('title', '切换暗色主题');
      if (themeBtnMobile) themeBtnMobile.setAttribute('title', '切换暗色主题');
      if (label) label.textContent = '暗色';
    } else {
      htmlEl.removeAttribute('data-theme');
      if (themeIcon) themeIcon.innerHTML = moonSVG;
      if (themeIconMobile) themeIconMobile.innerHTML = moonSVG;
      if (themeBtn) themeBtn.setAttribute('title', '切换亮色主题');
      if (themeBtnMobile) themeBtnMobile.setAttribute('title', '切换亮色主题');
      if (label) label.textContent = '亮色';
    }
    try { localStorage.setItem('theme', theme); } catch(e) {}
  }

  try {
    var saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
  } catch(e) {}

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var current = htmlEl.getAttribute('data-theme');
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }
  if (themeBtnMobile) {
    themeBtnMobile.addEventListener('click', function() {
      var current = htmlEl.getAttribute('data-theme');
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // ── Mermaid click-to-zoom ──────────────────────────
  document.addEventListener('click', function(e) {
    var mermaidDiv = e.target.closest('.mermaid');
    if (!mermaidDiv) return;
    e.preventDefault();

    var svg = mermaidDiv.querySelector('svg');
    var img = mermaidDiv.querySelector('img');
    if (!svg && !img) return;

    // Build overlay
    var overlay = document.createElement('div');
    overlay.className = 'mermaid-zoom-overlay';
    overlay.innerHTML = '<button class="zoom-close">&times;</button>'
      + '<div class="zoom-wrapper"></div>';
    var wrapper = overlay.querySelector('.zoom-wrapper');

    if (svg) {
      var clone = svg.cloneNode(true);
      clone.style.width = '100%';
      clone.style.height = 'auto';
      clone.removeAttribute('width');
      clone.removeAttribute('height');
      wrapper.appendChild(clone);
    } else {
      var clone = img.cloneNode(true);
      clone.style.width = '100%';
      wrapper.appendChild(clone);
    }

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closeZoom() {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    }

    overlay.querySelector('.zoom-close').addEventListener('click', closeZoom);
    overlay.addEventListener('click', function(ev) {
      if (ev.target === overlay) closeZoom();
    });

    // Escape key
    document.addEventListener('keydown', function escHandler(ev) {
      if (ev.key === 'Escape') { closeZoom(); document.removeEventListener('keydown', escHandler); }
    });
  });

  // ── Wrap tables for responsive scrolling ───────────
  function wrapTables() {
    var main = document.querySelector('.main');
    if (!main) return;
    var tables = main.querySelectorAll('table');
    tables.forEach(function(t) {
      if (t.parentNode.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapTables);
  } else {
    wrapTables();
  }

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

  // ── Expandable table rows ────────────────────────────
  function initExpandables() {
    // Table row expand
    document.addEventListener('click', function(ev) {
      var row = ev.target.closest('.row-expandable');
      if (!row) return;
      // Don't trigger if selecting text
      if (window.getSelection().toString()) return;

      var detailTr = row.nextElementSibling;
      if (!detailTr || !detailTr.classList.contains('detail-tr')) return;

      var isExpanded = row.classList.contains('expanded');
      // Close all other expanded rows in same table
      var tbody = row.parentNode;
      if (tbody) {
        tbody.querySelectorAll('.row-expandable.expanded').forEach(function(r) {
          if (r !== row) {
            r.classList.remove('expanded');
            var d = r.nextElementSibling;
            if (d && d.classList.contains('detail-tr')) d.classList.remove('show');
          }
        });
      }
      // Toggle this row
      if (isExpanded) {
        row.classList.remove('expanded');
        detailTr.classList.remove('show');
      } else {
        row.classList.add('expanded');
        detailTr.classList.add('show');
      }
    });

    // Diagram detail toggle
    document.addEventListener('click', function(ev) {
      var btn = ev.target.closest('.detail-toggle');
      if (!btn) return;

      var panel = btn.nextElementSibling;
      if (!panel || !panel.classList.contains('detail-panel')) return;

      var isExpanded = btn.classList.contains('expanded');
      if (isExpanded) {
        btn.classList.remove('expanded');
        panel.classList.remove('show');
        btn.innerHTML = btn.innerHTML.replace('收起详解', '展开详解').replace('▼', '▶');
      } else {
        btn.classList.add('expanded');
        panel.classList.add('show');
        btn.innerHTML = btn.innerHTML.replace('展开详解', '收起详解').replace('▶', '▼');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpandables);
  } else {
    initExpandables();
  }

})();
