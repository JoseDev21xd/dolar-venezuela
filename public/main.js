let tasas = { usd: 0, eur: 0, promedio: 0, usdt: 0 }

async function cargarTasas() {
  try {
    const respuesta = await fetch('/api/tasas')
    const datos = await respuesta.json()

    tasas.usd = datos.usd
    tasas.eur = datos.eur

    document.getElementById('usd-rate').textContent = 'Bs. ' + datos.usd.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    document.getElementById('eur-rate').textContent = 'Bs. ' + datos.eur.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    document.getElementById('last-update').textContent = 'Última actualización: ' + datos.actualizacion

  } catch (error) {
    document.getElementById('usd-rate').textContent = 'Error al cargar'
    document.getElementById('eur-rate').textContent = 'Error al cargar'
    console.log('Error:', error.message)
  }
}

async function cargarMonitorYUsdt() {
  try {
    const respuesta = await fetch('https://exchangemonitor.net/data/rates/ve')
    const datos = await respuesta.json()

    if (!datos.success) return

    const parsearTasa = (str) => parseFloat(str.replace('.', '').replace(',', '.'))

    const monitorDolar = datos.data.find(d => d.id === 've-md')
    const binance = datos.data.find(d => d.id === 've-binance')

    if (monitorDolar) {
      tasas.promedio = parsearTasa(monitorDolar.rate)
      document.getElementById('promedio-rate').textContent = 'Bs. ' + tasas.promedio.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    if (binance) {
      tasas.usdt = parsearTasa(binance.rate)
      document.getElementById('usdt-rate').textContent = 'Bs. ' + tasas.usdt.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

  } catch (error) {
    console.log('Error monitor:', error.message)
  }
}

function calcular(moneda) {
  const input = document.getElementById(moneda + '-input')
  let valor = input.value.replace(/[^0-9]/g, '')

  valor = (parseInt(valor || 0) / 100).toFixed(2)
  input.value = valor

  const monto = parseFloat(valor)
  const tasa = moneda === 'usd' ? tasas.usd
              : moneda === 'eur' ? tasas.eur
              : moneda === 'promedio' ? tasas.promedio
              : tasas.usdt

  const resultado = monto * tasa

  document.getElementById(moneda + '-result').textContent =
    'Bs. ' + resultado.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

document.getElementById('usd-input').addEventListener('input', () => calcular('usd'))
document.getElementById('eur-input').addEventListener('input', () => calcular('eur'))

document.getElementById('usd-input').addEventListener('click', function() {
  this.setSelectionRange(this.value.length, this.value.length)
})

document.getElementById('eur-input').addEventListener('click', function() {
  this.setSelectionRange(this.value.length, this.value.length)
})

// Arrancar
cargarTasas()
cargarMonitorYUsdt()

// Auto-actualización cada 5 minutos
setInterval(() => {
  cargarTasas()
  cargarMonitorYUsdt()
}, 5 * 60 * 1000)

document.getElementById('promedio-input').addEventListener('input', () => calcular('promedio'))
document.getElementById('usdt-input').addEventListener('input', () => calcular('usdt'))

document.getElementById('promedio-input').addEventListener('click', function() {
  this.setSelectionRange(this.value.length, this.value.length)
})

document.getElementById('usdt-input').addEventListener('click', function() {
  this.setSelectionRange(this.value.length, this.value.length)
})