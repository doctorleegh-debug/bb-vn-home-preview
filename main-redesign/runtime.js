export function mountMain(){
  let alive=true;
  const timers=new Set(),frames=new Set(),observers=[],controllers=[],listeners=[];
  const previousChannels=[...document.querySelectorAll('a[href]')].filter(a=>!a.closest('#bb-main')&&/youtube.com|instagram.com/.test(a.href)).map(a=>[a,a.getAttribute('href')]);
  const listen=(target,type,fn,options)=>{const wrapped=function(...args){if(alive)return fn.apply(this,args)};target.addEventListener(type,wrapped,options);listeners.push(()=>target.removeEventListener(type,wrapped,options));};
  const setTimeout=(fn,ms,...args)=>{if(!alive)return 0;const id=window.setTimeout(()=>{timers.delete(id);if(alive)fn(...args)},ms);timers.add(id);return id};
  const clearTimeout=id=>{timers.delete(id);window.clearTimeout(id)};
  const requestAnimationFrame=fn=>{if(!alive)return 0;const id=window.requestAnimationFrame(t=>{frames.delete(id);if(alive)fn(t)});frames.add(id);return id};
  const cancelAnimationFrame=id=>{frames.delete(id);window.cancelAnimationFrame(id)};
  const IntersectionObserver=function(fn,options){const o=new window.IntersectionObserver((...a)=>{if(alive)fn(...a)},options);observers.push(o);return o};
  const ResizeObserver=function(fn,options){const o=new window.ResizeObserver((...a)=>{if(alive)fn(...a)},options);observers.push(o);return o};
  const MutationObserver=function(fn){const o=new window.MutationObserver((...a)=>{if(alive)fn(...a)});observers.push(o);return o};
  const AbortController=function(){const c=new window.AbortController();controllers.push(c);return c};
(function () { var m = document.getElementById('bb-main'); if (!m || !('IntersectionObserver' in window)) return; m.className += ' bb-js'; setTimeout(function () { if (!m.getAttribute('data-bb-ready')) m.className = m.className.replace(' bb-js', ''); }, 4000); })();
(function () {
  var root = document.getElementById('bb-main');
  if (!root || root.getAttribute('data-bb-ready')) return;
  root.setAttribute('data-bb-ready', '1');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SWIPER_JS = 'https://cdn.jsdelivr.net/npm/swiper@11.1.14/swiper-bundle.min.js';
  var safeHttps = function (value, hosts) {
    try { var u = new URL(value); return u.protocol === 'https:' && (!hosts || hosts.indexOf(u.hostname) !== -1); } catch (e) { return false; }
  };
  // Fetch each feed only as its section approaches the viewport; keep static SEO content.
  function whenNear(el, run) {
    if (!el || !window.IntersectionObserver) { run(); return; }
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        observer.disconnect(); run();
      }
    }, { rootMargin: '250px', threshold: 0 });
    observer.observe(el);
  }
  var readFeed = function (url, apply) {
    if (!url || !window.fetch) return;
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
    fetch(url, {cache:'no-cache',signal:controller ? controller.signal : undefined}).then(function(r){if(!r.ok)throw Error('Feed unavailable');return r.json();}).then(apply)['catch'](function(){})['finally'](function(){if(timeout)clearTimeout(timeout);});
  };
  var fitCommon=function(){
    var bottom=document.querySelector('.custom-fixed-bottom-menu');
    var r=bottom&&bottom.getBoundingClientRect();
    root.style.setProperty('--bb-native-bottom',r&&r.height>0&&r.top<innerHeight?Math.ceil(innerHeight-r.top)+'px':'0px');
  };
  fitCommon();listen(window,'resize',fitCommon);
  var hero = root.querySelector('.bb-hero');
  if (hero) { requestAnimationFrame(function () { hero.className += ' is-in'; }); }

  var video = root.querySelector('.bb-hero__video');
  var toggle = root.querySelector('.bb-hero__toggle');
  var heroUserPaused = false;
  function prepareInlineVideo(v) {
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
  }
  function requestVideoPlay(v, failed) {
    if (v.bbPlayPending) return;
    prepareInlineVideo(v);
    var pr;
    try { pr = v.play(); } catch (e) { if (failed) failed(); return; }
    if (pr && pr.then) {
      v.bbPlayPending = true;
      pr.then(function () { v.bbPlayPending = false; }, function () { v.bbPlayPending = false; if (failed) failed(); });
    }
  }
  if (video) {
    var mobile = window.matchMedia('(max-width: 640px)').matches;
    if (mobile) video.setAttribute('poster', video.getAttribute('data-poster-m'));
    if (reduce) {
      video.removeAttribute('autoplay');
      video.setAttribute('poster', video.getAttribute(mobile ? 'data-still-m' : 'data-still-d'));
    }
    prepareInlineVideo(video);
    if (!reduce && !video.querySelector('source')) video.src = video.getAttribute(mobile ? 'data-src-m' : 'data-src-d');
    var setPaused = function (p) {
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', p ? 'true' : 'false');
      toggle.setAttribute('aria-label', p ? "Phát video nền" : "Tạm dừng video nền");
    };
    if (reduce) {
      setPaused(true);
    } else {
      requestVideoPlay(video, function () { setPaused(true); });
    }
    video.addEventListener('playing', function () { setPaused(false); });
    video.addEventListener('pause', function () { setPaused(true); });
    if (toggle) {
      toggle.addEventListener('click', function () {
        if (video.paused) { heroUserPaused = false; requestVideoPlay(video, function () { setPaused(true); }); }
        else { heroUserPaused = true; video.pause(); }
      });
    }
  }

  var aosEls = root.querySelectorAll('[data-bb-aos]');
  for (var a = 0; a < aosEls.length; a++) {
    var dl = aosEls[a].getAttribute('data-bb-delay');
    if (dl) aosEls[a].style.setProperty('--bb-d', dl + 'ms');
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) { entries[e].target.className += ' is-in'; io.unobserve(entries[e].target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    for (var b = 0; b < aosEls.length; b++) io.observe(aosEls[b]);
  } else {
    for (var c = 0; c < aosEls.length; c++) aosEls[c].className += ' is-in';
  }

  var marquees = root.querySelectorAll('[data-bb-marquee]');
  var setupMarquee = function (mq) {
    var track = mq.querySelector('.bb-mq__track');
    var originals = track.querySelectorAll('.bb-mq__item:not([data-bb-clone])');
    if (!originals.length) return;
    var first = originals[0].getBoundingClientRect();
    var last = originals[originals.length - 1].getBoundingClientRect();
    var setW = last.right - first.left;
    if (setW <= 0) return;
    var need = Math.ceil(mq.clientWidth / setW) + 1;
    var have = track.querySelectorAll('[data-bb-clone]').length / originals.length;
    for (var k = have; k < need; k++) {
      for (var n = 0; n < originals.length; n++) {
        var cl = originals[n].cloneNode(true);
        cl.setAttribute('data-bb-clone', '1');
        cl.setAttribute('aria-hidden', 'true');
        var focusables = cl.querySelectorAll('a,button');
        for (var q = 0; q < focusables.length; q++) focusables[q].setAttribute('tabindex', '-1');
        track.appendChild(cl);
      }
    }
    var speed = parseFloat(mq.getAttribute('data-speed') || '40');
    mq.style.setProperty('--bb-mq-dist', setW.toFixed(1) + 'px');
    mq.style.setProperty('--bb-mq-dur', (setW / speed).toFixed(1) + 's');
    if (mq.className.indexOf('is-run') === -1) mq.className += ' is-run';
  };
  if (!reduce) {
    for (var mqi = 0; mqi < marquees.length; mqi++) setupMarquee(marquees[mqi]);
    listen(window,'load', function () { for (var m2 = 0; m2 < marquees.length; m2++) setupMarquee(marquees[m2]); });
    listen(window,'resize', function () { for (var m3 = 0; m3 < marquees.length; m3++) setupMarquee(marquees[m3]); });
  }

  var eventBox = root.querySelector('[data-bb-events-src]');
  function createEventCard(e) {
    var a=document.createElement('a');a.className='bb-evcard';a.href=e.href;a.setAttribute('aria-label',e.title);
    var heading=document.createElement('span');heading.className='bb-evcard__heading';
    var pixels=document.createElement('span');pixels.className='bb-evcard__pixels';pixels.setAttribute('aria-hidden','true');
    for(var n=0;n<4;n++)pixels.appendChild(document.createElement('i'));
    var label=document.createElement('span');label.className='bb-evcard__label';label.setAttribute('aria-hidden','true');label.textContent='EVENT';
    var title=document.createElement('h3');title.className='bb-evcard__title';
    var track=document.createElement('span');track.className='bb-evcard__title-track';
    var text=document.createElement('span');text.className='bb-evcard__title-text';text.textContent=e.title;track.appendChild(text);title.appendChild(track);
    var arrow=document.createElement('span');arrow.className='bb-evcard__arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';
    heading.appendChild(pixels);heading.appendChild(label);heading.appendChild(title);heading.appendChild(arrow);
    var media=document.createElement('span');media.className='bb-evcard__image';
    var im=document.createElement('img');im.src=e.image;im.alt=e.title;im.loading='lazy';im.decoding='async';media.appendChild(im);
    a.appendChild(heading);a.appendChild(media);return a;
  }
  var titleFrame=0,eventTitlesVisible=false;
  function layoutEventTitles(){
    titleFrame=0;if(!eventBox)return;
    eventBox.querySelectorAll('.bb-evcard__title').forEach(function(title){
      var track=title.querySelector('.bb-evcard__title-track'),text=title.querySelector('.bb-evcard__title-text');
      if(!track||!text)return;
      track.querySelectorAll('.bb-evcard__title-copy').forEach(function(e){e.remove()});
      title.classList.remove('is-rolling');if(reduce)return;
      text.style.whiteSpace='nowrap';var width=text.scrollWidth;text.style.whiteSpace='';
      if(width<=title.clientWidth+1)return;
      var copy=text.cloneNode(true);copy.classList.add('bb-evcard__title-copy');copy.setAttribute('aria-hidden','true');track.appendChild(copy);
      title.style.setProperty('--bb-title-distance',(width+32)+'px');title.style.setProperty('--bb-title-duration',Math.max(12,(width+32)/23)+'s');title.classList.add('is-rolling');
    });
  }
  function scheduleEventTitles(){if(!titleFrame)titleFrame=requestAnimationFrame(layoutEventTitles)}
  function setEventTitleMotion(){if(eventBox)eventBox.classList.toggle('bb-event-titles-active',eventTitlesVisible&&!document.hidden&&!reduce)}
  if(eventBox){
    scheduleEventTitles();listen(window,'load',scheduleEventTitles);listen(window,'resize',scheduleEventTitles);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scheduleEventTitles);
    if('IntersectionObserver' in window){new IntersectionObserver(function(entries){eventTitlesVisible=entries[0].isIntersecting;setEventTitleMotion()},{rootMargin:'100px'}).observe(eventBox)}
    else{eventTitlesVisible=true;setEventTitleMotion()}
    listen(document,'visibilitychange',setEventTitleMotion);
  }

  var applyEvents = function (d) { if(!alive)return;
    if (!d || !Array.isArray(d.items)) return;
    var items = d.items.filter(function(e){return e && typeof e.title === 'string' && safeHttps(e.href,["hk.beautyblossom.kr"]) && safeHttps(e.image,["hk.beautyblossom.kr"]);});
    if (!items.length || items.length !== d.items.length) return;
    var mq=eventBox.querySelector('[data-bb-marquee]'),track=mq.querySelector('.bb-mq__track'),frag=document.createDocumentFragment();
    items.forEach(function(e){var item=document.createElement('li');item.className='bb-mq__item';item.appendChild(createEventCard(e));frag.appendChild(item);});
    track.replaceChildren(frag);eventBox.setAttribute('data-bb-feed-updated',d.updatedAt||'');if(!reduce)setupMarquee(mq);scheduleEventTitles();
  };
  if(eventBox)whenNear(eventBox,function(){readFeed(eventBox.getAttribute('data-bb-events-src'),applyEvents);});

  var filmBox = root.querySelector('[data-bb-film-src]');
  if (filmBox && window.fetch) whenNear(filmBox, function () {
    window.fetch(filmBox.getAttribute('data-bb-film-src'), { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !Array.isArray(d.videos) || !d.videos.length || !d.videos.every(function(v){return v && /^[\w-]{11}$/.test(v.id) && typeof v.title==='string' && safeHttps(v.thumb,['i.ytimg.com']) && safeHttps(v.url,['www.youtube.com']);})) return;
      d.videos=d.videos.slice(0,20);
      var mq = filmBox.querySelector('[data-bb-marquee]');
      var track = mq.querySelector('.bb-mq__track');
      var originals = track.querySelectorAll('.bb-mq__item:not([data-bb-clone])');
      var same = originals.length === d.videos.length;
      for (var u = 0; same && u < originals.length; u++) {
        var existing=originals[u],vd=d.videos[u];
        if (existing.querySelector('.bb-film').getAttribute('data-id') !== vd.id || existing.querySelector('img').getAttribute('src') !== vd.thumb || existing.querySelector('.bb-film__title').textContent !== vd.title || (existing.querySelector('.bb-film__time')||{}).textContent !== vd.duration) same = false;
      }
      if (same) return;
      var template = originals[0];
      var frag = document.createDocumentFragment();
      for (var v = 0; v < d.videos.length; v++) {
        var item = template.cloneNode(true);
        var vd = d.videos[v];
        var a = item.querySelector('.bb-film');
        a.setAttribute('href', vd.url);
        a.setAttribute('data-id', vd.id);
        var im = item.querySelector('img');
        im.setAttribute('src', vd.thumb);
        im.setAttribute('alt', vd.title);
        item.querySelector('.bb-film__title').textContent = vd.title;
        item.querySelector('.bb-film__no').textContent = 'BB ' + (v < 9 ? '0' : '') + (v + 1);
        var tm = item.querySelector('.bb-film__time');
        if (tm) { if (vd.duration) { tm.textContent = vd.duration; } else { tm.parentNode.removeChild(tm); } }
        frag.appendChild(item);
      }
      track.innerHTML = '';
      track.appendChild(frag);
      if (!reduce) setupMarquee(mq);
    })['catch'](function () {});
  });

  // 인스타그램 TV: 화면에 보일 때만 릴스 영상을 불러와 재생하고, 손잡이 버튼으로 채널(릴스)을 바꾼다
  var tvList = root.querySelector('[data-bb-reels]');
  if (tvList) {
    var reels = [];
    try { reels = JSON.parse(tvList.getAttribute('data-bb-reels') || '[]'); } catch (e) { reels = []; }
    var playIfVisible = function (v) {
      if (reduce || !v.getAttribute('data-visible')) return;
      if (!v.getAttribute('src')) v.setAttribute('src', v.getAttribute('data-src'));
      requestVideoPlay(v);
    };
    var tune = function (tvEl, step) {
      if (!reels.length) return;
      clearTimeout(tvEl.bbTuneTimer);
      var cur = parseInt(tvEl.getAttribute('data-ch') || tvEl.getAttribute('data-bb-tv'), 10);
      var next = (cur + step + reels.length) % reels.length;
      var r = reels[next];
      if (!r) return;
      var screen = tvEl.querySelector('.bb-tv__screen');
      var vid = screen.querySelector('video');
      screen.className += ' is-static';
      tvEl.bbTuneTimer = setTimeout(function () {
        tvEl.setAttribute('data-ch', next);
        screen.setAttribute('href', r.url);
        screen.setAttribute('aria-label', "Xem Instagram Reels: " + r.caption);
        vid.pause();
        vid.setAttribute('poster', r.poster);
        vid.setAttribute('data-src', r.video);
        vid.removeAttribute('src');
        vid.load();
        tvEl.querySelector('.bb-tv__osd').textContent = 'CH ' + (next < 9 ? '0' : '') + (next + 1);
        tvEl.querySelector('.bb-tv__cap').textContent = r.caption;
        playIfVisible(vid);
        screen.className = screen.className.replace(' is-static', '');
      }, reduce ? 0 : 380);
    };
    tvList.addEventListener('click', function (ev) {
      var knob = ev.target.closest ? ev.target.closest('[data-bb-ch]') : null;
      if (!knob) return;
      var tvEl = knob.closest('[data-bb-tv]');
      if (tvEl) tune(tvEl, parseInt(knob.getAttribute('data-bb-ch'), 10));
    });
    whenNear(tvList,function(){readFeed(tvList.getAttribute('data-bb-reels-src'),function(d){
      if(!d||!Array.isArray(d.reels)||!d.reels.length)return;
      var fresh=d.reels.filter(function(r){return r&&typeof r.caption==='string'&&safeHttps(r.url,['www.instagram.com'])&&safeHttps(r.video)&&safeHttps(r.poster);});
      if(fresh.length!==d.reels.length)return;
      reels=fresh;tvList.setAttribute('data-bb-feed-updated',d.updated||'');
      var all=tvList.querySelectorAll('[data-bb-tv]');
      for(var ti=0;ti<all.length;ti++){all[ti].setAttribute('data-ch',parseInt(all[ti].getAttribute('data-bb-tv'),10)%reels.length);tune(all[ti],0);}
    });});
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        for (var en = 0; en < entries.length; en++) {
          var vv = entries[en].target;
          if (entries[en].isIntersecting) { vv.setAttribute('data-visible', '1'); playIfVisible(vv); } else { vv.removeAttribute('data-visible'); vv.pause(); }
        }
      }, { threshold: 0.35 });
      // 무한 흐름이 복제한 TV까지 포함해 관찰 (복제는 화면 크기가 바뀔 때 늘어날 수 있다)
      var observeVids = function () {
        var vids = tvList.querySelectorAll('video:not([data-bb-obs])');
        for (var vi = 0; vi < vids.length; vi++) { vids[vi].setAttribute('data-bb-obs', '1'); vio.observe(vids[vi]); }
      };
      observeVids();
      listen(window,'load', observeVids);
      listen(window,'resize', observeVids);
    }
  }

  // Mobile autoplay can be denied until a real gesture; retry visible media without overriding a manual pause.
  function resumeVisibleMedia(ev) {
    if (reduce || document.hidden) return;
    if (ev && ev.target && ev.target.closest && ev.target.closest('.bb-hero__toggle')) return;
    if (video && !heroUserPaused && video.paused) {
      var rect = video.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) requestVideoPlay(video, function () { setPaused(true); });
    }
    if (tvList) tvList.querySelectorAll('video[data-visible]').forEach(function (v) { playIfVisible(v); });
  }
  listen(document,'PointerEvent' in window ? 'pointerup' : 'touchend', resumeVisibleMedia, { passive: true });
  listen(document,'visibilitychange', function () { if (!document.hidden) resumeVisibleMedia(); });
  listen(window,'pageshow', function () { resumeVisibleMedia(); });

  var grows = root.querySelectorAll('[data-bb-grow]');
  var decos = root.querySelectorAll('[data-bb-px]');
  var bar = root.querySelector('.bb-qbar');
  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var vh = window.innerHeight;
      if (!reduce) {
        for (var g = 0; g < grows.length; g++) {
          var gt = grows[g].getBoundingClientRect().top;
          var gp = Math.max(0, Math.min(1, (vh - gt) / (vh * 0.55)));
          grows[g].style.clipPath = 'inset(0 ' + ((1 - gp) * 100).toFixed(2) + '% 0 0 round 0 999px 999px 0)';
        }
        for (var i = 0; i < decos.length; i++) {
          var el = decos[i];
          var cur = parseFloat(el.getAttribute('data-bb-cur') || '0');
          var top = el.getBoundingClientRect().top - cur;
          var p = Math.max(0, Math.min(1, (vh - top) / vh));
          var v = (p * 70 * parseFloat(el.getAttribute('data-bb-px'))).toFixed(1);
          el.setAttribute('data-bb-cur', v);
          el.style.transform = 'translate3d(0,' + v + 'px,0)';
        }
      }
      if (bar) {
        var end = root.getBoundingClientRect().bottom < vh - 4;
        if (end && bar.className.indexOf('is-off') === -1) bar.className += ' is-off';
        if (!end && bar.className.indexOf('is-off') !== -1) bar.className = bar.className.replace(' is-off', '');
      }
    });
  };
  listen(window,'scroll', onScroll, { passive: true });
  listen(window,'resize', onScroll);
  onScroll();

  var filter = root.querySelector('[data-bb-filter]');
  if (filter) {
    var btns = filter.querySelectorAll('button');
    var cats = root.querySelectorAll('[data-bb-cat]');
    for (var f = 0; f < btns.length; f++) {
      btns[f].addEventListener('click', function () {
        var key = this.getAttribute('data-key');
        for (var x = 0; x < btns.length; x++) btns[x].setAttribute('aria-pressed', btns[x] === this ? 'true' : 'false');
        for (var y = 0; y < cats.length; y++) {
          var show = key === 'all' || cats[y].getAttribute('data-bb-cat') === key;
          if (show) {
            cats[y].removeAttribute('hidden');
            cats[y].className = cats[y].className.replace(' is-pop', '');
            void cats[y].offsetWidth;
            cats[y].className += ' is-pop';
          } else {
            cats[y].setAttribute('hidden', '');
          }
        }
      });
    }
  }

  var initSwipers = function () { if(!alive)return;
    var S = window.Swiper;
    if (!S) return;
    var list = root.querySelectorAll('[data-bb-swiper]');
    for (var s = 0; s < list.length; s++) {
      var wrapEl = list[s];
      var el = wrapEl.querySelector('.swiper');
      var count = el.querySelectorAll('.swiper-slide').length;
      var many = count >= 8;
      new S(el, {
        slidesPerView: 'auto', centeredSlides: true, spaceBetween: parseInt(wrapEl.getAttribute('data-space') || '30', 10),
        loop: many, rewind: !many, speed: reduce ? 0 : 520, grabCursor: true, watchSlidesProgress: true,
        autoplay: reduce ? false : { delay: parseInt(wrapEl.getAttribute('data-delay') || '3000', 10), disableOnInteraction: false, pauseOnMouseEnter: true },
        navigation: { prevEl: wrapEl.querySelector('[data-bb-prev]'), nextEl: wrapEl.querySelector('[data-bb-next]') },
        a11y: { prevSlideMessage: "Ảnh không gian phòng khám trước", nextSlideMessage: "Ảnh không gian phòng khám tiếp theo" }
      });
    }
  };
  if (window.Swiper) {
    initSwipers();
  } else {
    var existing = document.querySelector('script[data-bb-swiper-lib]');
    if (existing) {
      existing.addEventListener('load', initSwipers);
    } else {
      var tag = document.createElement('script');
      tag.src = SWIPER_JS;
      tag.async = true;
      tag.setAttribute('data-bb-swiper-lib', '1');
      tag.onload = initSwipers;
      document.head.appendChild(tag);
    }
  }
})();

(function () {
  var LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  var FALLOFF_STEPS = 8;
  var SPRING = 320;
  var DAMPING = 22;

  function approach(current, target, dt, seconds) { return current + (target - current) * (1 - Math.exp(-dt / seconds)); }
  function hexToRgb(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.replace(/./g, function (c) { return c + c; });
    var n = parseInt(h.slice(0, 6), 16);
    return isNaN(n) ? [255, 255, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, alpha) { var c = hexToRgb(hex); return 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + alpha + ')'; }
  function noise() {
    var h = 2166136261;
    for (var i = 0; i < arguments.length; i++) {
      h = Math.imul(h ^ (arguments[i] | 0), 16777619);
      h ^= h >>> 13;
      h = Math.imul(h, 0x5bd1e995);
      h ^= h >>> 15;
    }
    return (h >>> 0) / 4294967296;
  }
  function signed(v) { return v > 0 ? '+' + v : v < 0 ? '−' + (-v) : '0'; }

  // React Bits TechText를 아임웹용 순수 JS로 옮긴 것. 여러 줄(lines)과 왼쪽 정렬, 글자 그림자를 추가했다.
  function TechText(container, o) {
    var s = {
      lines: o.lines || ['React Bits'], fontFamily: o.fontFamily || '', fontWeight: o.fontWeight || 600, fontSize: o.fontSize || 150,
      letterSpacing: o.letterSpacing == null ? -0.05 : o.letterSpacing, lineHeight: o.lineHeight || 1.12, align: o.align || 'center',
      color: o.color || '#ffffff', accentColor: o.accentColor || '#ffffff', shadow: o.shadow || '', dashLength: o.dashLength || 4,
      dashGap: o.dashGap || 2, strokeWidth: o.strokeWidth || 1.5, lineStyle: o.lineStyle || 'dashed', specks: o.specks == null ? 15 : o.specks,
      selection: o.selection !== false, labels: o.labels !== false, draggable: o.draggable !== false, sweep: o.sweep !== false, speed: o.speed || 1
    };
    var canvas = document.createElement('canvas');
    canvas.className = 'bb-tt__canvas';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var width = 1, height = 1, dpr = 1, raf = 0, last = performance.now(), visible = true;
    var layoutKey = '', requestedFont = '', word = null, glyphs = [], clock = 0, pulse = 0, placed = false, dragging = -1;
    var pointer = { x: 0, y: 0, inside: false };
    var grab = { x: 0, y: 0 };
    var lens = { x: 0, y: 0 };
    var frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    function family() { return s.fontFamily || getComputedStyle(container).fontFamily || 'sans-serif'; }
    function fontFor(size) { return s.fontWeight + ' ' + size + 'px ' + family(); }
    function setFont(target, size) {
      target.font = fontFor(size);
      if ('letterSpacing' in target) target.letterSpacing = (s.letterSpacing * size) + 'px';
      target.textAlign = 'left';
      target.textBaseline = 'alphabetic';
    }
    function refreshFonts() { layoutKey = ''; wake(); }

    function sprite(view, glyph, stroke) {
      var pad = Math.ceil(s.strokeWidth * 2 + 4 + (s.shadow && !stroke ? 22 : 0));
      var left = glyph.box.x1 - pad, top = glyph.box.y1 - pad;
      var w = glyph.box.x2 - glyph.box.x1 + pad * 2, h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      var image = document.createElement('canvas');
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      var c = image.getContext('2d');
      if (!c) return { image: image, left: left, top: top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, view.size);
      if (stroke) {
        c.lineJoin = 'round';
        c.lineWidth = s.strokeWidth * 2;
        c.lineCap = 'butt';
        c.strokeStyle = s.color;
        if (s.lineStyle !== 'solid') c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
        c.strokeText(glyph.char, glyph.x, glyph.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = '#000000';
        c.fillText(glyph.char, glyph.x, glyph.baseline);
        c.globalCompositeOperation = 'source-over';
      } else {
        if (s.shadow) { c.shadowColor = s.shadow; c.shadowBlur = 18 * dpr; c.shadowOffsetY = 2 * dpr; }
        c.fillStyle = s.color;
        c.fillText(glyph.char, glyph.x, glyph.baseline);
      }
      return { image: image, left: left, top: top };
    }

    function ensureLayout() {
      var key = [s.lines.join('\n'), family(), s.fontWeight, s.fontSize, width, height, dpr].join('|');
      if (key === layoutKey && word) return word;
      layoutKey = key;
      var wanted = fontFor(64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.lines.join('')).then(refreshFonts, refreshFonts);
      }
      var probe = document.createElement('canvas').getContext('2d');
      setFont(probe, s.fontSize);
      var ref = probe.measureText('가힣Bg');
      var maxInk = 1;
      for (var i = 0; i < s.lines.length; i++) {
        var mm = probe.measureText(s.lines[i]);
        maxInk = Math.max(maxInk, mm.actualBoundingBoxLeft + mm.actualBoundingBoxRight);
      }
      var blockAt = function (size) { return (ref.actualBoundingBoxAscent + ref.actualBoundingBoxDescent) * size / s.fontSize + (s.lines.length - 1) * size * s.lineHeight; };
      var fit = Math.min(1, (width * 0.96) / maxInk, (height * 0.9) / Math.max(blockAt(s.fontSize), 1));
      var size = s.fontSize * fit;
      setFont(probe, size);
      ref = probe.measureText('가힣Bg');
      var asc = ref.actualBoundingBoxAscent, desc = ref.actualBoundingBoxDescent;
      var blockH = asc + desc + (s.lines.length - 1) * size * s.lineHeight;
      var top0 = (height - blockH) / 2;
      var next = { size: size, left: Infinity, right: -Infinity, top: top0, bottom: top0 + blockH };
      var previous = glyphs;
      glyphs = [];
      for (var li = 0; li < s.lines.length; li++) {
        var line = s.lines[li];
        var m = probe.measureText(line);
        var ink = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
        var x = (s.align === 'left' ? Math.ceil(s.strokeWidth * 2 + 2) : (width - ink) / 2) + m.actualBoundingBoxLeft;
        var baseline = top0 + asc + li * size * s.lineHeight;
        next.left = Math.min(next.left, x - m.actualBoundingBoxLeft);
        next.right = Math.max(next.right, x + m.actualBoundingBoxRight);
        var chars = Array.from(line);
        var prefix = '';
        for (var ci = 0; ci < chars.length; ci++) {
          var ch = chars[ci];
          prefix += ch;
          var own = probe.measureText(ch);
          var gx = x + probe.measureText(prefix).width - own.width;
          if (!ch.trim()) continue;
          var base = { char: ch, x: gx, baseline: baseline, box: { x1: gx - own.actualBoundingBoxLeft, y1: baseline - own.actualBoundingBoxAscent, x2: gx + own.actualBoundingBoxRight, y2: baseline + own.actualBoundingBoxDescent } };
          var kept = previous[glyphs.length];
          base.offset = kept && kept.char === ch ? kept.offset : { x: 0, y: 0 };
          base.velocity = { x: 0, y: 0 };
          base.outline = 0;
          base.fill = sprite(next, base, false);
          base.dashes = sprite(next, base, true);
          glyphs.push(base);
        }
      }
      word = next;
      dragging = -1;
      frame.index = -1;
      return next;
    }

    function glyphAt(x, y) {
      if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
      var best = -1, bestDistance = Infinity;
      for (var i = 0; i < glyphs.length; i++) {
        var g = glyphs[i];
        var x1 = g.box.x1 + g.offset.x, x2 = g.box.x2 + g.offset.x, y1 = g.box.y1 + g.offset.y, y2 = g.box.y2 + g.offset.y;
        var dx = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        var dy = y < y1 ? y1 - y : y > y2 ? y - y2 : 0;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestDistance) { bestDistance = d; best = i; }
      }
      return bestDistance < 28 ? best : -1;
    }

    function blit(target, art, dx, dy) { target.drawImage(art.image, Math.round((art.left + dx) * dpr), Math.round((art.top + dy) * dpr)); }
    function crisp(v) { return (Math.round(v * dpr) + 0.5) / dpr; }
    function perimeterPoint(distance, w, h) {
      var p = 2 * (w + h);
      var d = ((distance % p) + p) % p;
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    }

    function drawSpecks(a) {
      var w = frame.x2 - frame.x1, h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      var perimeter = 2 * (w + h), seed = frame.index + 1, grid = 3;
      for (var k = 0; k < s.specks; k++) {
        var period = 0.5 + noise(seed, k, 11) * 1.2;
        var t = pulse / period + noise(seed, k, 17);
        var cycle = Math.floor(t), life = t - cycle;
        if (life > 0.7) continue;
        var pp = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        var pick = noise(seed, k, cycle, 2);
        var size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        var large = size >= 8;
        var out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        var x = frame.x1 + Math.round((pp[0] + pp[2] * out - frame.x1) / grid) * grid;
        var y = frame.y1 + Math.round((pp[1] + pp[3] * out - frame.y1) / grid) * grid;
        var tone = noise(seed, k, cycle, 3);
        var blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        var alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        var left = Math.round(x - size / 2), top = Math.round(y - size / 2);
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeStyle = rgba(s.accentColor, alpha);
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) { ctx.fillStyle = rgba(s.accentColor, alpha); ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2); }
        } else {
          ctx.fillStyle = rgba(s.accentColor, alpha);
          ctx.fillRect(left, top, size, size);
        }
      }
      var trail = [0.95, 0.55, 0.32, 0.16];
      for (var j = 0; j < 2; j++) {
        var head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
        for (var i = 0; i < 4; i++) {
          var q = perimeterPoint(head - i * 6, w, h);
          var sz = i === 0 ? 3 : 2;
          ctx.fillStyle = rgba(s.accentColor, a * trail[i]);
          ctx.fillRect(Math.round(q[0] - sz / 2), Math.round(q[1] - sz / 2), sz, sz);
        }
      }
    }

    function drawFrame() {
      var g = glyphs[frame.index];
      if (!g || frame.alpha < 0.01) return;
      var a = frame.alpha;
      var x1 = crisp(frame.x1), y1 = crisp(frame.y1), x2 = crisp(frame.x2), y2 = crisp(frame.y2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var moved = Math.sqrt(g.offset.x * g.offset.x + g.offset.y * g.offset.y);
      if (moved > 1) {
        var hx = (g.box.x1 + g.box.x2) / 2, hy = (g.box.y1 + g.box.y2) / 2;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + g.offset.x, hy + g.offset.y);
        ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.strokeStyle = rgba(s.accentColor, 0.45 * a); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4); ctx.fillStyle = rgba(s.accentColor, 0.7 * a); ctx.fill();
      }
      ctx.beginPath(); ctx.rect(x1, y1, x2 - x1, y2 - y1); ctx.lineWidth = 1; ctx.strokeStyle = rgba(s.accentColor, 0.5 * a); ctx.stroke();
      ctx.beginPath();
      var corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
      for (var i = 0; i < 4; i++) ctx.rect(Math.round(corners[i][0]) - 2, Math.round(corners[i][1]) - 2, 5, 5);
      ctx.fillStyle = rgba(s.accentColor, 0.95 * a); ctx.fill();
      if (s.specks > 0) { ctx.lineWidth = 1; drawSpecks(a); }
      if (!s.labels) return;
      ctx.font = LABEL_FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillStyle = rgba(s.accentColor, 0.62 * a);
      var label = moved > 1 ? signed(Math.round(g.offset.x)) + ', ' + signed(Math.round(-g.offset.y)) : g.char + '  ' + Math.round(g.box.x2 - g.box.x1) + ' × ' + Math.round(g.box.y2 - g.box.y1);
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
    }

    function tick(now) {
      raf = 0;
      var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      var view = ensureLayout();
      var sweeping = s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * s.speed;
      pulse += dt;
      var tx = pointer.x, ty = pointer.y;
      if (sweeping) {
        tx = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        ty = s.lines.length > 1 ? view.top + (view.bottom - view.top) * (0.5 - 0.5 * Math.cos(clock * 0.31)) : view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      var active = pointer.inside || sweeping || dragging >= 0;
      if (active && !placed) { lens.x = tx; lens.y = ty; }
      if (active) {
        var lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, tx, dt, lag);
        lens.y = approach(lens.y, ty, dt, lag);
      }
      placed = active;
      var moving = false;
      for (var i = 0; i < glyphs.length; i++) {
        var g = glyphs[i];
        if (i === dragging) {
          g.offset.x = approach(g.offset.x, pointer.x - grab.x, dt, 0.03);
          g.offset.y = approach(g.offset.y, pointer.y - grab.y, dt, 0.03);
          g.velocity.x = 0; g.velocity.y = 0; moving = true;
          continue;
        }
        if (Math.abs(g.offset.x) < 0.05 && Math.abs(g.offset.y) < 0.05 && Math.sqrt(g.velocity.x * g.velocity.x + g.velocity.y * g.velocity.y) < 0.5) {
          g.offset.x = 0; g.offset.y = 0; g.velocity.x = 0; g.velocity.y = 0;
          continue;
        }
        g.velocity.x += (-SPRING * g.offset.x - DAMPING * g.velocity.x) * dt;
        g.velocity.y += (-SPRING * g.offset.y - DAMPING * g.velocity.y) * dt;
        g.offset.x += g.velocity.x * dt;
        g.offset.y += g.velocity.y * dt;
        moving = true;
      }
      var focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0 && s.selection) {
        var fg = glyphs[focus];
        var bx1 = fg.box.x1 + fg.offset.x - 6, by1 = fg.box.y1 + fg.offset.y - 6, bx2 = fg.box.x2 + fg.offset.x + 6, by2 = fg.box.y2 + fg.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) { frame.x1 = bx1; frame.y1 = by1; frame.x2 = bx2; frame.y2 = by2; }
        var glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide); frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide); frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);
      for (var k = 0; k < glyphs.length; k++) {
        var target = k === focus && k !== dragging ? 1 : 0;
        glyphs[k].outline = approach(glyphs[k].outline, target, dt, 0.09);
        if (Math.abs(glyphs[k].outline - target) > 0.002) moving = true; else glyphs[k].outline = target;
      }
      if (s.draggable) container.style.cursor = dragging >= 0 ? 'grabbing' : focus >= 0 && pointer.inside ? 'grab' : '';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var a1 = 0; a1 < glyphs.length; a1++) {
        var mv = Math.sqrt(glyphs[a1].offset.x * glyphs[a1].offset.x + glyphs[a1].offset.y * glyphs[a1].offset.y);
        if (mv > 1) { ctx.globalAlpha = Math.min(1, mv / 24) * 0.55; blit(ctx, glyphs[a1].dashes, 0, 0); ctx.globalAlpha = 1; }
      }
      for (var b1 = 0; b1 < glyphs.length; b1++) {
        var gg = glyphs[b1];
        if (gg.outline < 0.999) { ctx.globalAlpha = 1 - gg.outline; blit(ctx, gg.fill, gg.offset.x, gg.offset.y); }
        if (gg.outline > 0.001) { ctx.globalAlpha = gg.outline; blit(ctx, gg.dashes, gg.offset.x, gg.offset.y); }
        ctx.globalAlpha = 1;
      }
      drawFrame();
      var settling = moving || (frame.alpha > 0.01 && frame.alpha < 0.99);
      if ((active || settling) && visible) raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    function resize() {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      layoutKey = '';
      wake();
    }
    function locate(e) { var r = container.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; }
    container.addEventListener('pointermove', function (e) { locate(e); pointer.inside = true; wake(); }, { passive: true });
    container.addEventListener('pointerenter', function (e) { locate(e); pointer.inside = true; wake(); }, { passive: true });
    container.addEventListener('pointerleave', function () { if (dragging >= 0) return; pointer.inside = false; wake(); }, { passive: true });
    container.addEventListener('pointerdown', function (e) {
      locate(e); pointer.inside = true;
      if (s.draggable && (e.pointerType !== 'mouse' || e.button === 0)) {
        var index = glyphAt(pointer.x, pointer.y);
        if (index >= 0) {
          dragging = index;
          grab.x = pointer.x - glyphs[index].offset.x;
          grab.y = pointer.y - glyphs[index].offset.y;
          if (container.setPointerCapture) container.setPointerCapture(e.pointerId);
        }
      }
      wake();
    }, { passive: true });
    var onUp = function (e) {
      if (dragging >= 0) {
        dragging = -1;
        if (container.releasePointerCapture) container.releasePointerCapture(e.pointerId);
        var r = container.getBoundingClientRect();
        pointer.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      }
      wake();
    };
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container); else listen(window,'resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; wake(); }).observe(container);
    if (document.fonts) document.fonts.ready.then(refreshFonts, refreshFonts);
    resize();
  }

  var targets = document.querySelectorAll('[data-bb-techtext]');
  for (var t = 0; t < targets.length; t++) {
    var el = targets[t];
    if (el.getAttribute('data-bb-tt-ready')) continue;
    el.setAttribute('data-bb-tt-ready', '1');
    var cfg = {};
    try { cfg = JSON.parse(el.getAttribute('data-bb-techtext') || '{}'); } catch (err) { cfg = {}; }
    TechText(el, cfg);
    el.className += ' is-on';
    var h1 = el.parentNode.querySelector('.bb-h1');
    if (h1) h1.className += ' is-tt';
  }
})();
/* Homepage-only country channels and navigation styling. */
(function(){
  var root=document.getElementById('bb-main');if(!root)return;
  document.documentElement.setAttribute('data-bb-main-country',root.getAttribute('data-country'));
  var box=root.querySelector('[data-bb-reels-src]');
  var accounts={EN:'beautyblossom_global',JP:'beautyblossom_jp',CN:'beautyblossom_tw',TW:'beautyblossom_tw',TH:'beautyblossom_th',HK:'beautyblossom_tw'};
  var instagram='https://www.instagram.com/'+accounts[root.getAttribute('data-country')]+'/';
  document.querySelectorAll('a[href]').forEach(function(a){
    if(root.contains(a))return;
    try{var u=new URL(a.href);if(/(^|\.)youtube\.com$/.test(u.hostname)&&/^\/(?:@|channel\/)/.test(u.pathname))a.href='https://www.youtube.com/@koreanskin_drlee';
    else if(/(^|\.)instagram\.com$/.test(u.hostname)&&!/^\/(?:p|reel|reels)\//.test(u.pathname))a.href=instagram;}catch(e){}
  });
})();

/* Keep main treatment links aligned with the site's published header navigation. */
(function(){
  var root=document.getElementById('bb-main');if(!root)return;
  var section=root.querySelector('#bb-treatments'),table=document.querySelector('#bbFullMenu .menu-table,.full-menu .menu-table,.full-menu .bb-menu-table');
  if(!section||!table)return;
  var allowed=new Set([location.hostname]);
  var origin={KO:'https://beautyblossom.kr',EN:'https://en.beautyblossom.kr',JP:'https://jp.beautyblossom.kr',CN:'https://cn.beautyblossom.kr',TW:'https://tw.beautyblossom.kr',TH:'https://www.beautyblossomth.kr',HK:'https://hk.beautyblossom.kr'}[root.getAttribute('data-country')||'KO'];
  if(origin)allowed.add(new URL(origin).hostname);
  function sync(){
    section.querySelectorAll('[data-bb-cat]').forEach(function(cat){
      var key=cat.getAttribute('data-bb-cat');if(!/^c[0-6]$/.test(key))return;
      var col=key.slice(1),cell=table.querySelector('td[data-col="'+col+'"]');if(!cell)return;
      var items=[],seen=new Set();
      cell.querySelectorAll('a[href]').forEach(function(a){
        var hidden=a.closest('[hidden],[aria-hidden="true"],[data-menu-hidden="true"]');if(hidden&&hidden!==cell&&cell.contains(hidden))return;
        var label=a.textContent.replace(/\s+/g,' ').trim();if(!label)return;
        try{var u=new URL(a.getAttribute('href'),origin||location.origin);if(!/^https?:$/.test(u.protocol)||!allowed.has(u.hostname)||u.hash||u.pathname==='/')return;
          var id=u.pathname.replace(/\/$/,'')+u.search;if(seen.has(id))return;seen.add(id);items.push({label:JSON.parse(root.getAttribute('data-bb-reviewed-navigation')||'{}')[u.pathname.replace(/\/$/,'')]||label,url:u.href});
        }catch(e){}
      });
      var list=cat.querySelector('.bb-tx__list');if(!list)return;
      cat.hidden=!items.length;var categoryFilter=section.querySelector('[data-bb-filter] [data-key="'+key+'"]');if(categoryFilter)categoryFilter.hidden=!items.length;
      var sig=JSON.stringify(items);if(list.getAttribute('data-nav-signature')===sig)return;
      var fragment=document.createDocumentFragment();items.forEach(function(item){var li=document.createElement('li'),a=document.createElement('a');a.href=item.url;a.textContent=item.label;li.appendChild(a);fragment.appendChild(li)});
      list.replaceChildren(fragment);list.setAttribute('data-nav-signature',sig);
      var heading=table.querySelector('th[data-col="'+col+'"]'),label=heading&&heading.textContent.trim();
      label=JSON.parse(root.getAttribute('data-bb-reviewed-navigation')||'{}')['@'+key]||label;if(label){var title=cat.querySelector('.bb-tx__head h3 a,.bb-tx__head h3');if(title)title.textContent=label;var filter=section.querySelector('[data-bb-filter] [data-key="'+key+'"]');if(filter)filter.textContent=label;}
    });
    section.setAttribute('data-bb-menu-source','published-header');
  }
  sync();listen(document,'DOMContentLoaded',sync,{once:true});listen(window,'load',sync,{once:true});
  if(window.MutationObserver)new MutationObserver(sync).observe(table,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['href','hidden','aria-hidden','data-menu-hidden']});
})();

const givingCleanup=(()=>{const root=document.getElementById('bb-giving');if(!root||root.dataset.ready)return;root.dataset.ready='true';const get=id=>root.querySelector('#'+id);
'use strict';
const partners=JSON.parse(root.dataset.partners);
const dialog=get('bb-giving-partner-dialog');
let opener=null;
listen(root.querySelector('.partner-showcase'),'click',event=>{
    const button=event.target.closest('[data-partner]');if(!button)return;
    const partner=partners[button.dataset.partner];if(!partner)return;
    opener=button;
    get('bb-giving-dialog-title').textContent=partner.name;
    get('bb-giving-dialog-category').textContent=partner.category;
    get('bb-giving-dialog-description').textContent=partner.description;
    get('bb-giving-dialog-support').textContent=partner.support;
    const logo=get('bb-giving-dialog-logo');logo.src=partner.logo;logo.alt=partner.name;
    get('bb-giving-dialog-logo-stage').classList.toggle('is-dark',Boolean(partner.dark));
    const note=get('bb-giving-dialog-logo-note');note.hidden=!partner.logoNote;note.textContent=partner.logoNote||'';
    get('bb-giving-dialog-website').href=partner.website;
    dialog.showModal();dialog.scrollTop=0;
});
listen(root.querySelector('.dialog-close'),'click',()=>dialog.close());
listen(dialog,'click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
listen(dialog,'close',()=>opener?.focus({preventScroll:true}));
// One repeated group at a constant 25 CSS pixels per second. Pause for reading.
const viewport=get('bb-giving-partner-viewport');
const track=get('bb-giving-partner-track');
const original=track.querySelector('.partner-grid');
const copies=[];
function ensureCopies(count){
  while(copies.length<count){const copy=original.cloneNode(true);copy.dataset.copy='';copy.setAttribute('aria-hidden','true');copy.querySelectorAll('button').forEach(button=>button.tabIndex=-1);track.append(copy);copies.push(copy);}
  while(copies.length>count){const last=copies.at(-1);if(last.contains(document.activeElement))break;copies.pop().remove();}
}
ensureCopies(1);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let animation=null,hovered=false,distance=0;
function updateMotion(){
  const paused=hovered||document.hidden||dialog.open||viewport.contains(document.activeElement);
  if(animation){if(paused)animation.pause();else animation.play();}
}
function layoutMotion(){
  const progress=animation&&distance?((animation.currentTime||0)/1000*25)%distance/distance:0;
  animation?.cancel();animation=null;
  if(reduced.matches){copies.forEach(copy=>copy.hidden=true);viewport.classList.remove('is-animated');return;}
  copies.forEach(copy=>copy.hidden=false);viewport.classList.add('is-animated');viewport.scrollLeft=0;
  distance=original.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
  if(distance<=0)return;
  ensureCopies(Math.max(1,Math.ceil((viewport.clientWidth+parseFloat(getComputedStyle(track).gap))/distance)));
  animation=track.animate([{transform:'translateX(0)'},{transform:'translateX(-'+distance+'px)'}],{duration:distance/25*1000,iterations:Infinity,easing:'linear'});
  animation.currentTime=progress*distance/25*1000;updateMotion();
}
listen(viewport,'pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;updateMotion()}});
listen(viewport,'pointerleave',()=>{hovered=false;updateMotion()});
listen(viewport,'focusin',event=>{
  if(animation){const button=event.target.closest('[data-partner]');if(button){const r=button.getBoundingClientRect(),v=viewport.getBoundingClientRect();if(r.left<v.left||r.right>v.right){const index=[...original.querySelectorAll('[data-partner]')].findIndex(x=>x.dataset.partner===button.dataset.partner);const item=original.children[index];animation.currentTime=(item.offsetLeft-original.children[0].offsetLeft)/25*1000;}}}
  updateMotion();
});
listen(viewport,'focusout',()=>queueMicrotask(updateMotion));
listen(dialog,'close',updateMotion);new MutationObserver(updateMotion).observe(dialog,{attributes:true,attributeFilter:['open']});
listen(document,'visibilitychange',updateMotion);listen(reduced,'change',layoutMotion);
const givingSection=viewport.closest('.giving-section');
function fitViewportToSection(){
  const right=givingSection.getBoundingClientRect().right,left=viewport.getBoundingClientRect().left;
  const width=Math.max(0,right-left);const next=width.toFixed(3)+'px';
  if(viewport.style.width!==next)viewport.style.width=next;
  layoutMotion();
}
new ResizeObserver(layoutMotion).observe(original);
new ResizeObserver(fitViewportToSection).observe(givingSection);
listen(window,'resize',fitViewportToSection,{passive:true});
fitViewportToSection();

return ()=>{animation?.cancel();animation=null;copies.forEach(copy=>copy.remove());dialog.close();delete root.dataset.ready;};
})();

  return ()=>{givingCleanup?.();alive=false;document.documentElement.removeAttribute('data-bb-main-country');for(const [a,href] of previousChannels)if(a.isConnected)a.setAttribute('href',href);for(const fn of listeners)fn();for(const id of timers)window.clearTimeout(id);for(const id of frames)window.cancelAnimationFrame(id);for(const o of observers)o.disconnect();for(const c of controllers)c.abort();const root=document.getElementById('bb-main');if(root){for(const v of root.querySelectorAll('video'))v.pause();for(const el of root.querySelectorAll('.swiper'))el.swiper?.destroy(true,true);for(const el of root.querySelectorAll('[data-bb-clone]'))el.remove();root.removeAttribute('data-bb-ready');for(const el of root.querySelectorAll('[data-bb-tt-ready]')){el.removeAttribute('data-bb-tt-ready');el.querySelector('canvas')?.remove();}}};
}
