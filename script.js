document.addEventListener('DOMContentLoaded', () => {
  const whatsappNumber = '524428306394';
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  document.querySelectorAll('.bank-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.bank-tab').forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });

      document.querySelectorAll('.account-card').forEach((panel) => {
        const selected = panel.id === tab.dataset.target;
        panel.classList.toggle('active', selected);
        panel.hidden = !selected;
      });
    });
  });

  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.closest('.account-row')?.querySelector('[data-copy]')?.dataset.copy;
      if (!value) return;

      try {
        await copyText(value);
        button.classList.add('copied');
        showToast('Dato copiado');
        setTimeout(() => button.classList.remove('copied'), 1500);
      } catch {
        showToast('No se pudo copiar el dato');
      }
    });
  });

  document.querySelectorAll('.whatsapp-payment').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.account-card');
      const bank = card.querySelector('h3').textContent.trim();
      const holder = card.querySelector('.account-header p').textContent.trim();
      const details = Array.from(card.querySelectorAll('.account-row')).map((row) => {
        const label = row.querySelector('small').textContent.trim();
        const value = row.querySelector('[data-copy]').dataset.copy;
        return `${label}: ${value}`;
      });
      const message = `Hola Mi Bicla, envío mi comprobante de pago.\n\nBanco: ${bank}\n${holder}\n${details.join('\n')}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  });

  document.getElementById('saveContact').addEventListener('click', () => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Mi Bicla',
      'ORG:Mi Bicla;Taller y accesorios de ciclismo',
      'TEL;TYPE=CELL:+524428306394',
      'TEL;TYPE=CELL:+524427496410',
      'EMAIL:mibiclaqro@gmail.com',
      'ADR;TYPE=WORK:;;Calle Emiliano Zapata Ote. 10;El Jardín, La Cañada;Querétaro;;México',
      'URL:https://www.instagram.com/mibiclaqro',
      'END:VCARD'
    ].join('\r\n');
    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Mi-Bicla.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast('Contacto listo para guardar');
  });
});
