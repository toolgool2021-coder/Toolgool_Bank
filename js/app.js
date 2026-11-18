(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const main = $('modalOverlay');
  const fullscreen = $('qrFullscreenOverlay');
  const qr = $('qrImage');
  let previousFocus = null;
  let noticeTimer = null;
  let copiedTimer = null;
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
  function lockScroll() { document.body.style.overflow = main.classList.contains('active') || fullscreen.classList.contains('active') ? 'hidden' : ''; }
  function showToast(message) { const el=$('toast'); el.textContent=message; el.classList.add('show'); clearTimeout(noticeTimer); noticeTimer=setTimeout(()=>el.classList.remove('show'),2700); }
  function bankButton(bank) {
    const button=document.createElement('button');
    button.type='button'; button.className='bank-button'; button.setAttribute('aria-label', 'Реквизиты ' + bank.name);
    const img=document.createElement('img'); img.src=bank.icon; img.alt=''; img.className='bank-icon'; img.loading='lazy';
    const bottom=document.createElement('span'); bottom.className='bank-bottom';
    const detail=document.createElement('span'); const name=document.createElement('span'); name.className='bank-name'; name.textContent=bank.name;
    const caption=document.createElement('span'); caption.className='bank-caption'; caption.textContent='QR-код и реквизиты';
    const icon=document.createElement('span'); icon.className='bank-arrow'; icon.innerHTML=arrow;
    detail.append(name,caption); bottom.append(detail,icon); button.append(img,bottom);
    button.addEventListener('click',()=>openBank(bank)); return button;
  }
  function openBank(bank) {
    previousFocus=document.activeElement;
    $('modalTitle').textContent=bank.name;
    $('requisitesText').textContent=bank.text || 'Реквизиты не указаны';
    qr.src=bank.qr; qr.alt='QR-код ' + bank.name;
    $('qrExpand').disabled=false;
    main.classList.add('active'); main.setAttribute('aria-hidden','false'); lockScroll(); $('modalCloseBtn').focus();
  }
  function closeMain() { main.classList.remove('active'); main.setAttribute('aria-hidden','true'); lockScroll(); previousFocus?.focus(); }
  function openQR() { if (!qr.complete || qr.naturalWidth===0) return showToast('Не удалось загрузить QR-код'); fullscreen.classList.add('active'); fullscreen.setAttribute('aria-hidden','false'); $('qrFullscreenImage').src=qr.src; lockScroll(); $('qrFullscreenCloseBtn').focus(); }
  function closeQR() { fullscreen.classList.remove('active'); fullscreen.setAttribute('aria-hidden','true'); lockScroll(); $('qrExpand').focus(); }
  async function copyDetails() {
    const value=$('requisitesText').textContent;
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(value);
      else { const ta=document.createElement('textarea'); ta.value=value; ta.style.cssText='position:fixed;opacity:0;top:-999px'; document.body.appendChild(ta); ta.select(); const ok=document.execCommand('copy'); ta.remove(); if(!ok) throw new Error('copy failed'); }
      $('copyLabel').textContent='Скопировано'; clearTimeout(copiedTimer); copiedTimer=setTimeout(()=>$('copyLabel').textContent='Копировать',2200); showToast('Реквизиты скопированы');
    } catch { showToast('Не удалось скопировать. Выделите текст вручную.'); }
  }
  function trapFocus(event, layer) {
    const focusable=Array.from(layer.querySelectorAll('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'));
    if(!focusable.length) return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
  if (Array.isArray(window.Banks) || typeof Banks !== 'undefined') {
    const data=typeof Banks!=='undefined' ? Banks : window.Banks;
    $('banksContainer').replaceChildren(...data.map(bankButton)); $('paymentCount').textContent=data.length+' способа оплаты';
  } else $('banksContainer').textContent='Способы оплаты временно недоступны.';

  // Decorative balance card: local configuration only, no payment API or account access.
  const card=$('bankCard');
  const config=window.ToolgoolCardData || {};
  if(card){
    const clean=(value,fallback,max=32)=>String(value??fallback).slice(0,max);
    $('cardTitle').textContent=clean(config.title,'TL PRIVATE',22);
    $('cardOwner').textContent=clean(config.owner,'TOOLGOOL',28);
    $('cardNumber').textContent=clean(config.cardNumber,'••••  ••••  ••••  2026',32);
    $('cardStatus').textContent=clean(config.status,'PROJECT WALLET',24);
    const amount=Number(config.balance);
    const currency=clean(config.currency,'KGS',3).toUpperCase();
    const locale=clean(config.locale,'ru-RU',20);
    let formatted='—';
    try { if(Number.isFinite(amount)) formatted=new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(amount)+' '+currency; } catch { formatted=Number.isFinite(amount)?amount.toFixed(2)+' '+currency:'—'; }
    $('cardBalance').textContent=config.showBalance===false?'••••••':formatted;
    if(/^#[0-9a-fA-F]{6}$/.test(config.accent||'')) card.style.setProperty('--card-accent',config.accent);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const canTilt=window.matchMedia('(hover: hover) and (pointer: fine)');
    function resetCard(){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');card.style.setProperty('--glow-x','50%');card.style.setProperty('--glow-y','50%');}
    card.addEventListener('pointermove',(event)=>{
      if(!canTilt.matches||reduced.matches)return;
      const rect=card.getBoundingClientRect();
      const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
      const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
      card.style.setProperty('--tilt-x',((.5-y)*13).toFixed(2)+'deg');
      card.style.setProperty('--tilt-y',((x-.5)*13).toFixed(2)+'deg');
      card.style.setProperty('--glow-x',(x*100).toFixed(1)+'%');
      card.style.setProperty('--glow-y',(y*100).toFixed(1)+'%');
    });
    card.addEventListener('pointerleave',resetCard);
    card.addEventListener('blur',resetCard);
  }

  $('year').textContent=new Date().getFullYear();
  $('modalCloseBtn').addEventListener('click',closeMain);
  $('modalButtonClose').addEventListener('click',closeMain);
  $('qrExpand').addEventListener('click',openQR);
  $('qrFullscreenCloseBtn').addEventListener('click',closeQR);
  $('copyBtn').addEventListener('click',copyDetails);
  main.addEventListener('click',(e)=>{if(e.target===main)closeMain();});
  fullscreen.addEventListener('click',(e)=>{if(e.target===fullscreen)closeQR();});
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){if(fullscreen.classList.contains('active'))closeQR();else if(main.classList.contains('active'))closeMain();}
    if(e.key==='Tab'){const layer=fullscreen.classList.contains('active')?fullscreen:main.classList.contains('active')?main:null;if(layer)trapFocus(e,layer);}
  });
})();