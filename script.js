document.addEventListener('DOMContentLoaded',()=>{
  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text);
    }
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    ta.remove();
    return Promise.resolve();
  }

  document.querySelectorAll('.card .copy').forEach(btn=>{
    btn.addEventListener('click',async ()=>{
      const row = btn.closest('.row');
      const val = row?.querySelector('.value')?.getAttribute('data-copy') || row?.querySelector('.value')?.textContent || '';
      if(!val) return;
      try{
        await copyText(val.trim());
        btn.classList.add('copied');
        setTimeout(()=>{ btn.classList.remove('copied'); },1500);
      }catch(err){
        btn.classList.add('error');
        setTimeout(()=>{ btn.classList.remove('error'); },1500);
      }
    })
  })

  // Copiar todo: construye un bloque con todos los datos y lo copia
  const copyAllBtn = document.getElementById('copyAll');
  if(copyAllBtn){
    copyAllBtn.addEventListener('click', async ()=>{
      const cards = Array.from(document.querySelectorAll('.card.person-card'));
      const lines = [];
      cards.forEach(card=>{
        const title = card.querySelector('.person-header')?.textContent?.trim() || '';
        const subtitle = card.querySelector('.person-subtitle')?.textContent?.trim() || '';
        if(title) lines.push(title);
        if(subtitle) lines.push(subtitle);
        card.querySelectorAll('.row').forEach(row=>{
          const label = row.querySelector('.label')?.textContent?.trim() || '';
          const value = row.querySelector('.value')?.getAttribute('data-copy') || row.querySelector('.value')?.textContent || '';
          if(label && value) lines.push(`- ${label}: ${value}`);
        });
        lines.push('');
      });
      const text = lines.join('\n').trim();
      if(!text) return;
      try{
        await copyText(text);
        const orig = copyAllBtn.textContent;
        copyAllBtn.textContent = '¡Copiado!';
        copyAllBtn.classList.add('copied');
        if(navigator.share){
          setTimeout(()=>{
            navigator.share?.({ title: 'Datos de depósito', text }).catch(()=>{});
          },600);
        }
        setTimeout(()=>{ copyAllBtn.textContent = orig; copyAllBtn.classList.remove('copied'); },1800);
      }catch(e){
        copyAllBtn.textContent = 'Error';
        setTimeout(()=>{ copyAllBtn.textContent = 'Copiar todo'; },1500);
      }
    });
  }

  // Enviar por WhatsApp (por tarjeta/persona)
  const whatsappNumber = '5214427496410'; // +52 1 442 749 6410 -> wa.me requires country+number without symbols
  document.querySelectorAll('.card.person-card .whatsapp').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card = btn.closest('.card.person-card');
      if(!card) return;
      const title = card.querySelector('.person-header')?.textContent?.trim() || '';
      const subtitle = card.querySelector('.person-subtitle')?.textContent?.trim() || '';
      const lines = [];
      if(title) lines.push(title);
      if(subtitle) lines.push(subtitle);
      card.querySelectorAll('.row').forEach(row=>{
        const label = row.querySelector('.label')?.textContent?.trim() || '';
        const value = row.querySelector('.value')?.getAttribute('data-copy') || row.querySelector('.value')?.textContent || '';
        if(label && value) lines.push(`${label}: ${value}`);
      });
      const text = lines.join('\n');
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  });

  // Compartir todo por WhatsApp
  const whatsappAllBtn = document.getElementById('whatsappAll');
  if(whatsappAllBtn){
    whatsappAllBtn.addEventListener('click', ()=>{
      const cards = Array.from(document.querySelectorAll('.card.person-card'));
      const lines = [];
      cards.forEach(card=>{
        const title = card.querySelector('.person-header')?.textContent?.trim() || '';
        const subtitle = card.querySelector('.person-subtitle')?.textContent?.trim() || '';
        if(title) lines.push(title);
        if(subtitle) lines.push(subtitle);
        card.querySelectorAll('.row').forEach(row=>{
          const label = row.querySelector('.label')?.textContent?.trim() || '';
          const value = row.querySelector('.value')?.getAttribute('data-copy') || row.querySelector('.value')?.textContent || '';
          if(label && value) lines.push(`- ${label}: ${value}`);
        });
        lines.push('');
      });
      const text = lines.join('\n').trim();
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  function setCardState(card, open) {
    card.classList.toggle('open', open);
    const body = card.querySelector('.card-body');
    if(body) body.style.maxHeight = open ? (body.scrollHeight + 24) + 'px' : '0px';
  }

  const toggleAllBtn = document.getElementById('toggleAll');
  function setAllCards(open) {
    document.querySelectorAll('.card').forEach(card => setCardState(card, open));
    if(toggleAllBtn) toggleAllBtn.textContent = open ? 'Ocultar todo' : 'Mostrar todas';
  }

  document.querySelectorAll('.card-header').forEach(h=>{
    h.addEventListener('click', ()=>{
      const card = h.closest('.card');
      if(!card) return;
      const open = !card.classList.contains('open');
      setCardState(card, open);
    });
  });

  if(toggleAllBtn) {
    toggleAllBtn.addEventListener('click', ()=>{
      const open = toggleAllBtn.textContent !== 'Mostrar todas';
      setAllCards(!open);
    });
  }

  document.querySelectorAll('.person-card').forEach(card => setCardState(card, true));
})
