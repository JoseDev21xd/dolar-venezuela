const cheerio = require('cheerio')
const axios = require('axios')
const https = require('https')

export default async function handler(req, res) {
  try {
    const agente = new https.Agent({ rejectUnauthorized: false })
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-VE,es;q=0.9',
    }

    const [bcvRes, yadioRes] = await Promise.all([
      axios.get('https://www.bcv.org.ve/', { httpsAgent: agente, headers, timeout: 10000 }),
      axios.get('https://api.yadio.io/rate/VES/USD', { timeout: 10000 })
    ])

    const $bcv = cheerio.load(bcvRes.data)
    const usd = parseFloat($bcv('#dolar strong').text().trim().replace(',', '.'))
    const eur = parseFloat($bcv('#euro strong').text().trim().replace(',', '.'))
    const usdt = parseFloat(yadioRes.data.rate.toFixed(2))

    res.json({
      usd,
      eur,
      usdt,
      actualizacion: new Date().toLocaleString('es-VE')
    })

  } catch (error) {
    console.log('Error:', error.message)
    res.status(500).json({ error: 'No se pudo obtener las tasas', detalle: error.message })
  }
}