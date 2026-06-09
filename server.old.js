// Importamos las librerías que instalamos
const express = require('express')
const cheerio = require('cheerio')
const cors = require('cors')

// Creamos la app del servidor
const app = express()

// Activamos CORS para que tu HTML pueda hablar con este servidor
app.use(cors())

// ── LA FUNCIÓN DE SCRAPING ──────────────────────────────────────
// async significa que va a esperar respuestas (de internet)
const axios = require('axios')
const https = require('https')

async function obtenerTasasBCV() {

  // Creamos un agente que ignora problemas de certificado SSL
  const agente = new https.Agent({ rejectUnauthorized: false })

  const respuesta = await axios.get('https://www.bcv.org.ve/', {
    httpsAgent: agente,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-VE,es;q=0.9',
    },
    timeout: 10000
  })

  console.log('Status:', respuesta.status)
  console.log('HTML recibido:', respuesta.data.substring(0, 500))

  const $ = cheerio.load(respuesta.data)
  const usd = $('#dolar strong').text().trim().replace(',', '.')
  const eur = $('#euro strong').text().trim().replace(',', '.')

  console.log('USD:', usd)
  console.log('EUR:', eur)

  return { usd: parseFloat(usd), eur: parseFloat(eur) }
}
// ── EL ENDPOINT ─────────────────────────────────────────────────
// Cuando alguien vaya a /tasas, ejecutamos el scraping
app.get('/tasas', async (req, res) => {

  try {
    // Llamamos la función y esperamos el resultado
    const tasas = await obtenerTasasBCV()

    // Enviamos el resultado como JSON
    res.json({
      usd: tasas.usd,
      eur: tasas.eur,
      actualizacion: new Date().toLocaleString('es-VE')
    })

  } catch (error) {
    // Si algo falla, avisamos con un mensaje de error
   console.log('Error completo:', error.message)
    res.status(500).json({ error: 'No se pudo obtener las tasas', detalle: error.message })
  }
})

// ── INICIAMOS EL SERVIDOR ────────────────────────────────────────
// Puerto 3000: tu servidor vivirá en http://localhost:3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})