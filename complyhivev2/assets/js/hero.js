/* ===== 11 — COMPLYHIVE JS ===== */

/* Mouse-follow hotspot */
(function(){
'use strict';
if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
if(window.matchMedia('(pointer:coarse)').matches)return;
if(window.matchMedia('(max-width:768px)').matches)return;

var h=document.getElementById('ch-bg');
if(!h)return;

h.classList.add('ch-hero--interactive');

var tx=.5,ty=.5,cx=.5,cy=.5,vx=0,vy=0,raf=null;

function clamp(n,min,max){return Math.max(min,Math.min(max,n))}

function up(){
  vx+=(tx-cx)*.085;
  vy+=(ty-cy)*.085;
  vx*=.78;
  vy*=.78;

  cx+=vx;
  cy+=vy;

  cx=clamp(cx,0,1);
  cy=clamp(cy,0,1);

  h.style.setProperty('--ch-mouse-x',cx.toFixed(4));
  h.style.setProperty('--ch-mouse-y',cy.toFixed(4));

  if(
    Math.abs(tx-cx)>.0007||
    Math.abs(ty-cy)>.0007||
    Math.abs(vx)>.0007||
    Math.abs(vy)>.0007
  ){
    raf=requestAnimationFrame(up);
  }else{
    raf=null;
  }
}

function kick(){
  if(!raf)raf=requestAnimationFrame(up);
}

h.addEventListener('mousemove',function(e){
  var r=h.getBoundingClientRect();
  tx=(e.clientX-r.left)/r.width;
  ty=(e.clientY-r.top)/r.height;
  h.classList.add('ch-hero--interactive');
  kick();
},{passive:true});

h.addEventListener('mouseenter',function(){
  h.classList.add('ch-hero--interactive');
},{passive:true});

h.addEventListener('mouseleave',function(){
  tx=.56;
  ty=.42;
  kick();
},{passive:true});
})();

/* Mobile nav toggle */
(function(){
  var btn = document.getElementById('ch-nav-toggle');
  var nav = document.getElementById('ch-nav');
  if(!btn || !nav) return;

  // Ensure deterministic initial state
  btn.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-hidden', 'true');

  btn.addEventListener('click', function(e){
    e.preventDefault();

    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    var nextOpen = !isOpen;

    btn.setAttribute('aria-expanded', String(nextOpen));
    nav.setAttribute('aria-hidden', String(!nextOpen)); // critical
  });
  
  // Optional: close after tapping a link (mobile UX)
  nav.addEventListener('click', function (e) {
    if (e.target && e.target.closest('a')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    }
  });

  // Optional: close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    }
  });
})();
