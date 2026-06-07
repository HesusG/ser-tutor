/* Ser tutor: comportamiento compartido: tema claro/oscuro + reveal-on-scroll */
(function(){
  var t=document.getElementById('themeToggle');
  if(t){ t.addEventListener('click',function(){
    var d=document.documentElement;
    d.setAttribute('data-theme', d.getAttribute('data-theme')==='dark'?'light':'dark');
  }); }
  var els=Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); return; }
  var io=new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target);} }); },{threshold:.14});
  els.forEach(function(e){ io.observe(e); });
})();
