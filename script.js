/* ---------- Carrito compartido entre páginas ---------- */
var CLAVE = "libroNomadaCarrito";
var respaldo = [];

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch (e) {
    return respaldo;
  }
}

function guardarCarrito(carrito) {
  respaldo = carrito;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
  } catch (e) { /* si el navegador bloquea el almacenamiento, se usa el respaldo en memoria */ }
  actualizarContador();
}

function actualizarContador() {
  var total = leerCarrito().reduce(function (suma, it) { return suma + it.cantidad; }, 0);
  var contador = document.getElementById("contador");
  if (contador) contador.textContent = total;
}

function dinero(n) {
  return "$" + n.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function () {
  var pagina = document.body.id;
  actualizarContador();

  if (pagina === "pag-registro") iniciarRegistro();
  if (pagina === "pag-nosotros") iniciarNosotros();
  if (pagina === "pag-catalogo") iniciarCatalogo();
  if (pagina === "pag-carrito") iniciarCarrito();
  if (pagina === "pag-busqueda") iniciarBusqueda();
});

/* ---------- Registro ---------- */
function iniciarRegistro() {
  var form = document.getElementById("form-registro");
  var terminos = document.getElementById("terminos");
  var boton = document.getElementById("btn-registro");
  var mensaje = document.getElementById("mensaje-registro");
  var campos = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="date"], input[type="tel"]');

  terminos.addEventListener("change", function () {
    boton.disabled = !terminos.checked;
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensaje.className = "mensaje";

    for (var i = 0; i < campos.length; i++) {
      if (campos[i].value.trim() === "") {
        mensaje.textContent = "Completa todos los campos antes de enviar.";
        mensaje.classList.add("error");
        campos[i].focus();
        return;
      }
    }
    for (var j = 0; j < campos.length; j++) {
      if (!campos[j].checkValidity()) {
        mensaje.textContent = campos[j].title || "Revisa el formato de los datos.";
        mensaje.classList.add("error");
        campos[j].focus();
        return;
      }
    }
    mensaje.textContent = "¡Registro completado! Bienvenido a El rincón del libro.";
    mensaje.classList.add("ok");
    form.reset();
    boton.disabled = true;
  });
}

/* ---------- Quiénes somos ---------- */
function iniciarNosotros() {
  var boton = document.getElementById("btn-ver-mas");
  var extra = document.getElementById("info-extra");

  boton.addEventListener("click", function () {
    var oculto = extra.classList.toggle("oculto");
    boton.textContent = oculto ? "Ver más" : "Ver menos";
    boton.setAttribute("aria-expanded", String(!oculto));
  });
}

/* ---------- Catálogo: agrega libros al carrito ---------- */
function iniciarCatalogo() {
  var aviso = document.getElementById("aviso-carrito");

  document.querySelectorAll(".btn-agregar").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var nombre = btn.dataset.nombre;
      var texto = btn.closest(".producto").querySelector(".precio").textContent;
      var precio = parseFloat(texto.replace(/[^0-9.]/g, ""));
      var carrito = leerCarrito();
      var existente = carrito.filter(function (it) { return it.nombre === nombre; })[0];

      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
      }
      guardarCarrito(carrito);
      aviso.textContent = "Agregaste \"" + nombre + "\" al carrito.";
      aviso.className = "mensaje ok";
    });
  });
}

/* ---------- Carrito: se dibuja con lo que se agregó ---------- */
function iniciarCarrito() {
  var vacio = document.getElementById("carrito-vacio");
  var lleno = document.getElementById("carrito-lleno");
  var cuerpo = document.getElementById("lista-carrito");
  var celdaTotal = document.getElementById("total");

  function recalcular() {
    var carrito = leerCarrito();
    var total = 0;
    cuerpo.querySelectorAll("tr").forEach(function (fila, i) {
      var subtotal = carrito[i].precio * carrito[i].cantidad;
      fila.querySelector(".subtotal").textContent = dinero(subtotal);
      total += subtotal;
    });
    celdaTotal.textContent = dinero(total);
  }

  function dibujar() {
    var carrito = leerCarrito();
    cuerpo.innerHTML = "";
    vacio.classList.toggle("oculto", carrito.length > 0);
    lleno.classList.toggle("oculto", carrito.length === 0);

    carrito.forEach(function (item, i) {
      var fila = document.createElement("tr");

      var celdaNombre = document.createElement("td");
      celdaNombre.textContent = item.nombre;

      var celdaPrecio = document.createElement("td");
      celdaPrecio.textContent = dinero(item.precio);

      var celdaCantidad = document.createElement("td");
      var input = document.createElement("input");
      input.type = "text";
      input.className = "cantidad";
      input.value = item.cantidad;
      input.setAttribute("inputmode", "numeric");
      input.setAttribute("aria-label", "Semanas de renta de " + item.nombre);
      input.addEventListener("input", function () {
        input.value = input.value.replace(/\D/g, "");   // solo números
        var c = leerCarrito();
        c[i].cantidad = parseInt(input.value, 10) || 0;
        guardarCarrito(c);
        recalcular();
      });
      input.addEventListener("blur", function () {
        if (input.value === "" || parseInt(input.value, 10) === 0) {
          input.value = 1;
          var c = leerCarrito();
          c[i].cantidad = 1;
          guardarCarrito(c);
          recalcular();
        }
      });
      celdaCantidad.appendChild(input);

      var celdaSub = document.createElement("td");
      celdaSub.className = "subtotal";

      var celdaQuitar = document.createElement("td");
      var quitar = document.createElement("button");
      quitar.type = "button";
      quitar.className = "btn-quitar";
      quitar.textContent = "Quitar";
      quitar.setAttribute("aria-label", "Quitar " + item.nombre + " del carrito");
      quitar.addEventListener("click", function () {
        var c = leerCarrito();
        c.splice(i, 1);
        guardarCarrito(c);
        dibujar();
      });
      celdaQuitar.appendChild(quitar);

      [celdaNombre, celdaPrecio, celdaCantidad, celdaSub, celdaQuitar].forEach(function (td) { fila.appendChild(td); });
      cuerpo.appendChild(fila);
    });
    recalcular();
  }

  document.getElementById("btn-vaciar").addEventListener("click", function () {
    guardarCarrito([]);
    dibujar();
  });

  dibujar();
}

/* ---------- Búsqueda ---------- */
function iniciarBusqueda() {
  var form = document.getElementById("form-busqueda");
  var campo = document.getElementById("texto-busqueda");
  var titulo = document.getElementById("titulo-resultados");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var texto = campo.value.trim();
    if (texto === "") {
      titulo.textContent = "Escribe algo para buscar";
      return;
    }
    titulo.textContent = "Resultados para la búsqueda de " + texto;
  });
}
