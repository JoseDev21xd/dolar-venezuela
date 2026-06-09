let tasas = { usd: 0, eur: 0 }

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

function calcular(moneda) {
  const input = document.getElementById(moneda + '-input')
  let valor = input.value.replace(/[^0-9]/g, '')

  // Formato caja registradora: los últimos 2 dígitos son decimales
  valor = (parseInt(valor || 0) / 100).toFixed(2)
  input.value = valor

  const monto = parseFloat(valor)
  const tasa = moneda === 'usd' ? tasas.usd : tasas.eur
  const resultado = monto * tasa

  document.getElementById(moneda + '-result').textContent =
    'Bs. ' + resultado.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

document.getElementById('usd-input').addEventListener('input', () => calcular('usd'))
document.getElementById('eur-input').addEventListener('input', () => calcular('eur'))

cargarTasas()

document.getElementById('usd-input').addEventListener('click', function() {
  this.setSelectionRange(this.value.length, this.value.length)
})

document.getElementById('eur-input').addEventListener('click', function() {
  this.setSelectionRange(this.value.length, this.value.length)
})