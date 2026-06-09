const cheerio = require('cheerio')
const axios = require('axios')
const https = require('https')

export default async function handler(req, res) {
  try {
    const agente = new https.Agent({ rejectUnauthorized: false })
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-VE,es;q=0.9',
      'Referer': 'https://exchangemonitor.net/dolar-venezuela',
      'Origin': 'https://exchangemonitor.net',
      'X-Requested-With': 'XMLHttpRequest'
    }

    const [bcvRes, monitorRes] = await Promise.all([
      axios.get('https://www.bcv.org.ve/', {
        httpsAgent: agente,
        headers: {
          'User-Agent': headers['User-Agent'],
          'Accept': 'text/html',
          'Accept-Language': 'es-VE,es;q=0.9'
        },
        timeout: 10000
      }),
      axios.get('https://exchangemonitor.net/data/rates/ve', {
        httpsAgent: agente,
        headers,
        timeout: 10000
      })
    ])

    // Scraping BCV
    const $bcv = cheerio.load(bcvRes.data)
    const usd = parseFloat($bcv('#dolar strong').text().trim().replace(',', '.'))
    const eur = parseFloat($bcv('#euro strong').text().trim().replace(',', '.'))

    // API ExchangeMonitor
    const datos = monitorRes.data.data
    const parsearTasa = (str) => parseFloat(str.replace('.', '').replace(',', '.'))

    const monitorDolar = datos.find(d => d.id === 've-md')
    const binance = datos.find(d => d.id === 've-binance')

    res.json({
      usd,
      eur,
      promedio: monitorDolar ? parsearTasa(monitorDolar.rate) : null,
      usdt: binance ? parsearTasa(binance.rate) : null,
      actualizacion: new Date().toLocaleString('es-VE')
    })

  } catch (error) {
    console.log('Error:', error.message)
    res.status(500).json({ error: 'No se pudo obtener las tasas', detalle: error.message })
  }
}