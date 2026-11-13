(function(){
  var CK_KEY='herz_cookies_v1';
  document.querySelectorAll('.yr').forEach(function(e){e.textContent=new Date().getFullYear();});

  /* menu mobilne */
  var nav=document.getElementById('nav'),bur=document.getElementById('burger');
  if(bur){bur.addEventListener('click',function(){var o=nav.classList.toggle('open');bur.setAttribute('aria-expanded',o);bur.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.style.overflow=o?'hidden':'';});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');bur.setAttribute('aria-expanded','false');document.body.style.overflow='';});});}

  /* aktywna pozycja menu = bieżąca sekcja */
  var links=[].slice.call(document.querySelectorAll('.nav a[href^="#"]:not(.navcta)'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  function spy(){var y=window.scrollY+window.innerHeight*0.35,cur=null;secs.forEach(function(s){if(s.offsetTop<=y)cur=s;});
    links.forEach(function(a){a.classList.toggle('on',!!cur&&a.getAttribute('href')==='#'+cur.id);});}
  window.addEventListener('scroll',spy,{passive:true});spy();

  /* pasek dolny po przewinięciu za przycisk w pierwszym ekranie */
  var mob=document.getElementById('mob'),cta=document.getElementById('heroCta');
  if(mob&&cta&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var e=en[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);}).observe(cta);}

  /* rzędy przewijane palcem i myszą */
  document.querySelectorAll('.rail').forEach(function(r){
    var down=false,sx=0,sl=0,moved=false;
    r.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=r.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;r.classList.add('drag');}r.scrollLeft=sl-dx;});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){var w=step(r);r.classList.remove('drag');r.scrollTo({left:Math.round(r.scrollLeft/w)*w,behavior:'smooth'});}});
    r.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
    r.addEventListener('dragstart',function(e){e.preventDefault();});
    var ctl=document.querySelector('.rail-ctl[data-for="'+r.id+'"]');
    function step(r){var c=r.children[0],g=parseFloat(getComputedStyle(r).columnGap)||0;return c?c.getBoundingClientRect().width+g:300;}
    function upd(){if(!ctl)return;var w=step(r),n=r.children.length,i=Math.min(n,Math.round(r.scrollLeft/w)+1);
      if(r.scrollLeft+r.clientWidth>=r.scrollWidth-4)i=n;ctl.querySelector('.cnt').textContent=i+' / '+n;}
    if(ctl){ctl.querySelector('.prev').addEventListener('click',function(){r.scrollBy({left:-step(r),behavior:'smooth'});});
      ctl.querySelector('.next').addEventListener('click',function(){r.scrollBy({left:step(r),behavior:'smooth'});});}
    r.addEventListener('scroll',upd,{passive:true});
    r.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){r.scrollBy({left:step(r),behavior:'smooth'});e.preventDefault();}if(e.key==='ArrowLeft'){r.scrollBy({left:-step(r),behavior:'smooth'});e.preventDefault();}});
    upd();
  });

  /* temat w formularzu z przycisku */
  document.querySelectorAll('[data-temat]').forEach(function(a){a.addEventListener('click',function(){var s=document.getElementById('temat');if(s)s.value=a.getAttribute('data-temat');});});

  /* formularz pokazowy */
  var f=document.getElementById('form');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var m=document.getElementById('formMsg');
    if(!f.checkValidity()){m.textContent='Uzupełnij imię, e-mail i zaznacz zgodę.';return;}
    m.textContent='To podgląd strony - po wdrożeniu formularz wyśle zapytanie na biuro@slupkiautomatyczne.com.';});

  /* baner cookies */
  var ck=document.getElementById('ck');
  function read(){try{var v=JSON.parse(localStorage.getItem(CK_KEY)||'null');if(v&&Date.now()-v.t<365*864e5)return v;}catch(e){}return null;}
  function save(a,m){try{localStorage.setItem(CK_KEY,JSON.stringify({a:a,m:m,t:Date.now()}));}catch(e){}ck.classList.remove('show','more');}
  if(ck){
    if(!read())ck.classList.add('show');
    ck.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var k=b.getAttribute('data-ck');
      if(k==='all')save(true,true);
      else if(k==='min')save(false,false);
      else if(k==='more'){if(ck.classList.contains('more')){save(document.getElementById('ckA').checked,document.getElementById('ckM').checked);}else{ck.classList.add('more');b.textContent='Zapisz wybór';}}});
    document.querySelectorAll('[data-ck-open]').forEach(function(b){b.addEventListener('click',function(){var v=read();if(v){document.getElementById('ckA').checked=v.a;document.getElementById('ckM').checked=v.m;}ck.classList.add('show','more');var mb=ck.querySelector('[data-ck="more"]');if(mb)mb.textContent='Zapisz wybór';});});
  }
})();
