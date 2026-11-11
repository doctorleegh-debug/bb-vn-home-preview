
(function(){
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

  /* ===== EFFECT circles: 중앙 기준 양방향(위로·아래로 멀어지면 갈라짐, 중앙에서 교집합) + 호버 통합 ===== */
  function bindCircle(circ){
    if(circ.getAttribute('data-circ-bound')) return;
    circ.setAttribute('data-circ-bound','1');
    var k1 = circ.querySelector('.c1'), k2 = circ.querySelector('.c2');
    if(!k1 || !k2) return;

    var st = { p:0, cur:0, hover:0, hx:0, hy:0, near:0 };    // p=목표 진행도 / cur=화면에 그려지는 보간값
    function paint(){
      var vw = window.innerWidth || 1180;
      var GAP = vw >= 700 ? 130 : vw >= 480 ? 90 : 56;
      var p = st.cur < 0 ? 0 : st.cur > 1 ? 1 : st.cur;      // 1=교집합 완성 / 0=완전 갈라짐
      var e = 1 - Math.pow(1 - p, 2);                        // ease-out: 끝에서 사르르 붙는 느낌
      var open = 1 - e;
      var baseSc = 0.9 + 0.1 * e;
      var emphL = st.hover ? Math.max(0, -st.near * 2) : 0;
      var emphR = st.hover ? Math.max(0,  st.near * 2) : 0;
      var hx = st.hover ? st.hx : 0, hy = st.hover ? st.hy : 0;
      var tx1 = (-GAP * open) + hx, tx2 = (GAP * open) + hx;
      var op = (0.4 + 0.6 * e).toFixed(3);
      k1.style.setProperty('transform','translate('+tx1.toFixed(1)+'px,'+hy.toFixed(1)+'px) scale('+(baseSc*(1+0.06*emphL)).toFixed(3)+')','important');
      k2.style.setProperty('transform','translate('+tx2.toFixed(1)+'px,'+hy.toFixed(1)+'px) scale('+(baseSc*(1+0.06*emphR)).toFixed(3)+')','important');
      k1.style.setProperty('opacity', op, 'important');
      k2.style.setProperty('opacity', op, 'important');
    }
    // 목표값(p)을 향해 현재값(cur)을 매 프레임 12%씩 따라가 → 부드러운 감속(딱딱함 제거)
    function tick(){
      st.cur += (st.p - st.cur) * 0.12;
      if(Math.abs(st.p - st.cur) < 0.002) st.cur = st.p;
      paint();
      requestAnimationFrame(tick);
    }
    circ._st = st;
    tick();                                                  // 자체 rAF 루프로 항상 부드럽게 보간

    circ.addEventListener('mousemove', function(e){
      var r = circ.getBoundingClientRect(); if(!r.width) return;
      st.hover = 1;
      st.hx = ((e.clientX - r.left) / r.width  - 0.5) * 26;
      st.hy = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      st.near = (e.clientX - r.left) / r.width - 0.5;
    });
    circ.addEventListener('mouseleave', function(){ st.hover = 0; st.hx = 0; st.hy = 0; });
  }

  /* ===== 컨테이너별 init(중복 방지) ===== */
  function initHilo(c){
    if(c.getAttribute('data-hilo-init')) return;
    c.setAttribute('data-hilo-init','1');

    // 이미지 호버 패럴랙스
    c.querySelectorAll('.img').forEach(function(box){
      var im = box.querySelector('img');
      if(!im) return;
      box.addEventListener('mouseenter', function(){ box.classList.add('is-hover'); });
      box.addEventListener('mousemove', function(e){
        var r = box.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width  - 0.5) * -14;
        var y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
        im.style.transform = 'scale(1.08) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      box.addEventListener('mouseleave', function(){ box.classList.remove('is-hover'); im.style.transform = ''; });
    });

    // 스크롤 리빌 — 양방향: 들어오면 .in, 나가면 떼서 재진입 시 다시 재생
    if('IntersectionObserver' in window){
      c.classList.add('js-reveal');
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ en.target.classList.toggle('in', en.isIntersecting); });
      }, {threshold:0.12, rootMargin:'0px 0px -7% 0px'});
      function collect(parent, out){
        Array.prototype.forEach.call(parent.children, function(ch){
          if(ch.classList.contains('split')){
            var im = ch.querySelector('.split-img'), tx = ch.querySelector('.split-txt');
            var rev = ch.classList.contains('reverse');
            if(im){ im.classList.add(rev ? 'rv-r' : 'rv-l'); out.push(im); }
            if(tx){ tx.classList.add(rev ? 'rv-l' : 'rv-r'); out.push(tx); }
          } else if(ch.classList.contains('points')){
            Array.prototype.forEach.call(ch.querySelectorAll('.point'), function(p){ out.push(p); });
          } else { out.push(ch); }
        });
      }
      c.querySelectorAll('section').forEach(function(sec){
        if(sec.classList.contains('hero')) return;
        var base = sec;
        var only = sec.children.length === 1 ? sec.firstElementChild : null;
        if(only && (only.classList.contains('dark') || only.classList.contains('soft'))) base = only;
        var out = []; collect(base, out);
        out.forEach(function(el, i){
          if(el.classList.contains('circles')) return;        // circles는 스크롤-연동이 따로 제어
          el.classList.add('reveal'); el.style.transitionDelay = (i * 0.06).toFixed(2) + 's'; io.observe(el);
        });
      });
      c.querySelectorAll('.img, .band, .pt-vis').forEach(function(m){ m.classList.add('reveal-media'); io.observe(m); });
    }

    c.querySelectorAll('.circles').forEach(bindCircle);
  }

  /* ===== 전역 스크롤 루프 ===== */
  var SCROLL_BOUND = false;
  function setupScroll(){
    if(SCROLL_BOUND || !document.querySelector('.hilo')) return;
    SCROLL_BOUND = true;
    var bar = document.querySelector('.hilo-sbar');
    if(!bar){ bar = document.createElement('div'); bar.className = 'hilo-sbar'; document.body.appendChild(bar); }
    var ticking = false;
    function onScroll(){
      if(ticking) return; ticking = true;
      requestAnimationFrame(function(){
        var vh = window.innerHeight || document.documentElement.clientHeight;

        var first = document.querySelector('.hilo');
        if(first){
          var rect = first.getBoundingClientRect();
          var total = rect.height - vh, scrolled = -rect.top;
          var pp = total > 0 ? Math.min(1, Math.max(0, scrolled/total)) : (rect.top <= 0 ? 1 : 0);
          bar.classList.toggle('on', rect.bottom > 0 && rect.top < vh);
          bar.style.transform = 'scaleX(' + pp.toFixed(4) + ')';
        }

        // circles: 목표 진행도만 세팅(부드러운 보간은 bindCircle 자체 rAF가 처리)
        var circs = document.querySelectorAll('.hilo .circles');
        for(var j=0;j<circs.length;j++){
          var el = circs[j]; if(!el._st) continue;
          var cr = el.getBoundingClientRect();
          var center = cr.top + cr.height/2;
          var dist = Math.abs(center - vh*0.5) / (vh*0.5);    // 중앙=0, 화면 끝=1
          var p = 1 - dist*1.7;                               // 1.15→1.7: 중앙 도달 전에 한 템포 빨리 합쳐짐
          el._st.p = p < 0 ? 0 : p > 1 ? 1 : p;
        }

        if(!reduce){
          var hero = document.querySelector('.hilo .hero');
          if(hero){
            var hr = hero.getBoundingClientRect();
            if(hr.bottom > 0 && hr.top < vh){
              var hp = Math.max(0, Math.min(hr.height, -hr.top));
              var bg = hero.querySelector('.hero-bg'), hin = hero.querySelector('.hero-in');
              if(bg)  bg.style.transform = 'translateY(' + (hp*0.12).toFixed(1) + 'px) scale(1.18)';
              if(hin){ hin.style.transform = 'translateY(' + (hp*-0.1).toFixed(1) + 'px)'; hin.style.opacity = Math.max(0, 1-(hp/(hr.height*0.62))).toFixed(3); }
            }
          }
          var wms = document.querySelectorAll('.hilo .point .pt-vis .wm');
          for(var i=0;i<wms.length;i++){
            var w = wms[i], wr = w.getBoundingClientRect();
            if(wr.bottom > 0 && wr.top < vh){
              var wc = (wr.top + wr.height/2 - vh/2) / vh;
              w.style.transform = 'translateY(' + (wc*-34).toFixed(1) + 'px)';
            }
          }
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});
    onScroll();
  }

  function run(){
    document.querySelectorAll('.hilo').forEach(initHilo);
    setupScroll();
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
  window.addEventListener('load', run);

  if(window.MutationObserver){
    var mo = new MutationObserver(function(){ if(document.querySelector('.hilo:not([data-hilo-init])')) run(); });
    mo.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(function(){ mo.disconnect(); }, 15000);
  }
})();
