// Guardamos las tasas aquí para usarlas en la calculadora
let tasas = { usd: 0, eur: 0 }

// ── OBTENER Y MOSTRAR LAS TASAS ──────────────────────────────────
async function cargarTasas() {

  try {
    // Le pedimos los datos a NUESTRO servidor (no al BCV directamente)
 const respuesta = await fetch('/api/tasas')

    // Convertimos la respuesta a objeto JavaScript
    const datos = await respuesta.json()

    // Guardamos las tasas para usarlas en la calculadora
    tasas.usd = datos.usd
    tasas.eur = datos.eur

    // Mostramos los valores en el HTML usando los id que pusimos
    document.getElementById('usd-rate').textContent = 'Bs. ' + datos.usd.toFixed(2)
    document.getElementById('eur-rate').textContent = 'Bs. ' + datos.eur.toFixed(2)
    document.getElementById('last-update').textContent = 'Última actualización: ' + datos.actualizacion

  } catch (error) {
    document.getElementById('usd-rate').textContent = 'Error al cargar'
    document.getElementById('eur-rate').textContent = 'Error al cargar'
    console.log('Error:', error.message)
  }
}

// ── CALCULADORA ──────────────────────────────────────────────────
// Esta función se ejecuta cada vez que el usuario escribe en el input
function calcular(moneda) {

  // Agarramos el valor que escribió el usuario
  const monto = parseFloat(document.getElementById(moneda + '-input').value)

  // Si no escribió nada o escribió algo inválido, limpiamos el resultado
  if (isNaN(monto)) {
    document.getElementById(moneda + '-result').textContent = 'Bs. 0.00'
    return
  }

  // Hacemos la multiplicación según la moneda
  const tasa = moneda === 'usd' ? tasas.usd : tasas.eur
  const resultado = monto * tasa

  // Mostramos el resultado formateado
  document.getElementById(moneda + '-result').textContent = 'Bs. ' + resultado.toFixed(2)
}

// ── EVENTOS ──────────────────────────────────────────────────────
// Escuchamos cuando el usuario escribe en cada input
document.getElementById('usd-input').addEventListener('input', () => calcular('usd'))
document.getElementById('eur-input').addEventListener('input', () => calcular('eur'))

// ── ARRANCAR ─────────────────────────────────────────────────────
// Cuando carga la página, pedimos las tasas inmediatamente
cargarTasas()