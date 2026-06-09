const axios = require('axios')
const https = require('https')

export default async function handler(req, res) {
  try {
    const agente = new https.Agent({ rejectUnauthorized: false })

    const respuesta = await axios.get('https://exchangemonitor.net/data/rates/ve', {
      httpsAgent: agente,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'es-VE,es;q=0.9',
        'Referer': 'https://exchangemonitor.net/dolar-venezuela',
        'Origin': 'https://exchangemonitor.net',
      },
      timeout: 10000
    })

    res.json({ status: respuesta.status, data: respuesta.data })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}