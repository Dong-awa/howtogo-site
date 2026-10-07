/* HowToGo | 问道 — 站点脚本
   主题切换、移动端导航、滚动显现、wiki 侧栏搜索与高亮。 */
(function () {
    'use strict';

    var root = document.documentElement;
    var THEME_KEY = 'howtogo-theme';

    /* ------------------------------------------------------------ theme -- */

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', theme === 'dark' ? '#0a1120' : '#f4f8ff');
        }
        document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
            el.style.display = el.getAttribute('data-theme-icon') === theme ? '' : 'none';
        });
    }

    var stored = null;
    try {
        stored = localStorage.getItem(THEME_KEY);
    } catch (e) {
        stored = null;
    }
    if (!stored) {
        stored = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(stored);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (e) {
                /* 隐私模式下写不进去也不影响本次切换 */
            }
        });
    });

    /* ------------------------------------------------------------- nav --- */

    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    var header = document.querySelector('.site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 6);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------------------------------------------------------- reveal -- */

    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    var el = entry.target;
                    var delay = Number(el.getAttribute('data-delay') || 0);
                    setTimeout(function () {
                        el.classList.add('is-in');
                    }, delay);
                    io.unobserve(el);
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
            reveals.forEach(function (el) {
                io.observe(el);
            });
        } else {
            reveals.forEach(function (el) {
                el.classList.add('is-in');
            });
        }
    }

    /* ------------------------------------------------------- wiki side -- */

    var search = document.querySelector('[data-wiki-search]');
    if (search) {
        var links = Array.prototype.slice.call(document.querySelectorAll('[data-wiki-link]'));
        search.addEventListener('input', function () {
            var q = search.value.trim().toLowerCase();
            links.forEach(function (link) {
                var hay = (link.getAttribute('data-keywords') || '') + ' ' + link.textContent;
                link.style.display = !q || hay.toLowerCase().indexOf(q) >= 0 ? '' : 'none';
            });
        });
    }

    /* 正文里的二级标题跟着滚动高亮侧栏 */
    var heads = document.querySelectorAll('.wiki-body h2[id]');
    if (heads.length && 'IntersectionObserver' in window) {
        var sideLinks = {};
        document.querySelectorAll('.wiki-side a[href^="#"]').forEach(function (a) {
            sideLinks[a.getAttribute('href').slice(1)] = a;
        });
        var visible = new Set();
        var headObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    visible.add(entry.target.id);
                } else {
                    visible.delete(entry.target.id);
                }
            });
            var first = null;
            heads.forEach(function (h) {
                if (first === null && visible.has(h.id)) {
                    first = h.id;
                }
            });
            if (first === null) {
                return;
            }
            Object.keys(sideLinks).forEach(function (id) {
                sideLinks[id].classList.toggle('is-active', id === first);
            });
        }, { rootMargin: '-90px 0px -70% 0px' });
        heads.forEach(function (h) {
            headObserver.observe(h);
        });
    }

    /* ------------------------------------------------------------- copy -- */

    document.querySelectorAll('pre').forEach(function (block) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = '复制';
        btn.addEventListener('click', function () {
            var text = block.querySelector('code') ? block.querySelector('code').innerText : block.innerText;
            var done = function () {
                btn.textContent = '已复制';
                setTimeout(function () {
                    btn.textContent = '复制';
                }, 1600);
            };
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(done, done);
            } else {
                done();
            }
        });
        block.appendChild(btn);
    });

    /* ------------------------------------------------------------- year -- */

    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });
})();
