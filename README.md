# Página de datos de depósito

Esta es una página simple para compartir los datos de pago con tus clientes y que puedan copiar fácilmente cada información.

Cómo ver localmente:

```bash
# abre `index.html` en el navegador (doble clic) o usa un servidor local simple:
python3 -m http.server 8000
# luego visita http://localhost:8000
```

Puedo añadir QR, exportar a PDF imprimible o desplegarla en Netlify/GitHub Pages si lo deseas.

Funcionalidad añadida:

- Botón `Copiar todo`: copia todos los datos mostrados (títulos, valores y notas) en un solo bloque para pegar o compartir.
 - Botones `Enviar comprobante por WhatsApp`: comparten los datos de una persona o de todas las opciones a un número preconfigurado.

Cómo funciona WhatsApp:

Al pulsar `Enviar comprobante por WhatsApp` se abrirá WhatsApp Web o la app móvil (según el dispositivo) con un mensaje prellenado listo para enviar al número configurado en el script.

