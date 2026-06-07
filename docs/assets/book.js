/* Ser tutor: comportamiento compartido: tema claro/oscuro + reveal-on-scroll */
(function(){
  var t=document.getElementById('themeToggle');
  if(t){ t.addEventListener('click',function(){
    var d=document.documentElement;
    d.setAttribute('data-theme', d.getAttribute('data-theme')==='dark'?'light':'dark');
  }); }

  /* sub-tabs de teóricos (debajo de la cabecera) */
  Array.prototype.slice.call(document.querySelectorAll('[data-th]')).forEach(function(th){
    var tabs=Array.prototype.slice.call(th.querySelectorAll('.th__tab'));
    var panels=Array.prototype.slice.call(th.querySelectorAll('.th__panel'));
    function sel(i){
      tabs.forEach(function(t,j){var on=j===i;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;});
      panels.forEach(function(p,j){p.classList.toggle('is-on',j===i);});
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){sel(i);});
      t.addEventListener('keydown',function(e){
        var n=null;
        if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;
        else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i-1+tabs.length)%tabs.length;
        else if(e.key==='Home')n=0; else if(e.key==='End')n=tabs.length-1;
        if(n!==null){e.preventDefault();sel(n);tabs[n].focus();}
      });
    });
    if(tabs.length)sel(0);
  });

  var els=Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); return; }
  var io=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target);} }); },{threshold:.14});
  els.forEach(function(e){ io.observe(e); });
})();
