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
    btn.addEventListener('click',async e=>{
      const card = btn.closest('.card');
      const val = card.querySelector('.value')?.getAttribute('data-copy') || card.querySelector('.value')?.textContent || '';
      if(!val) return;
      try{
        await copyText(val.trim());
        const orig = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(()=>{ btn.textContent = orig; btn.classList.remove('copied'); },1500);
      }catch(err){
        btn.textContent = 'Error';
        setTimeout(()=>{ btn.textContent = 'Copiar'; },1500);
      }
    })
  })

  // Copiar todo: construye un bloque con todos los datos y lo copia
  const copyAllBtn = document.getElementById('copyAll');
  if(copyAllBtn){
    copyAllBtn.addEventListener('click', async ()=>{
      const cards = Array.from(document.querySelectorAll('.card'));
      const lines = [];
      cards.forEach(card=>{
        const title = card.querySelector('h2')?.textContent || card.querySelector('h3')?.textContent || '';
        const value = card.querySelector('.value')?.getAttribute('data-copy') || card.querySelector('.value')?.textContent || '';
        const meta = card.querySelector('.meta')?.textContent || '';
        if(title) lines.push(title + ': ' + value);
        if(meta) lines.push(meta);
        lines.push('');
      });
      const text = lines.join('\n').trim();
      if(!text) return;
      try{
        await copyText(text);
        const orig = copyAllBtn.textContent;
        copyAllBtn.textContent = '¡Copiado!';
        copyAllBtn.classList.add('copied');
        // ofrecer compartir si está disponible
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
})
