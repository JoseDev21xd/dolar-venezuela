const cheerio = require('cheerio')
const axios = require('axios')
const https = require('https')

// En Vercel no usamos app.listen ni express
// En cambio exportamos una función que Vercel llama automáticamente
export default async function handler(req, res) {

  try {
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

    const $ = cheerio.load(respuesta.data)
    const usd = $('#dolar strong').text().trim().replace(',', '.')
    const eur = $('#euro strong').text().trim().replace(',', '.')

    res.json({
      usd: parseFloat(usd),
      eur: parseFloat(eur),
      actualizacion: new Date().toLocaleString('es-VE')
    })

  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener las tasas', detalle: error.message })
  }
}