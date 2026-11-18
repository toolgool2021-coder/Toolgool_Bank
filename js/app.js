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