document.addEventListener("DOMContentLoaded", function () {
  var pagina = document.body.id;

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

  // El botón solo se habilita al aceptar los términos
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
    // Valida los patrones HTML5 (correo y teléfono)
    for (var j = 0; j < campos.length; j++) {
      if (!campos[j].checkValidity()) {
        mensaje.textContent = campos[j].title || "Revisa el formato de los datos.";
        mensaje.classList.add("error");
        campos[j].focus();
        return;
      }
    }
    mensaje.textContent = "¡Registro completado! Bienvenido a Verde Raíz.";
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

/* ---------- Catálogo ---------- */
function iniciarCatalogo() {
  var contador = document.getElementById("contador");
  var aviso = document.getElementById("aviso-carrito");
  var botones = document.querySelectorAll(".btn-agregar");
  var total = 0;

  botones.forEach(function (btn) {
    btn.addEventListener("click", function () {
      total++;
      contador.textContent = total;
      aviso.textContent = "Agregaste \"" + btn.dataset.nombre + "\" al carrito.";
      aviso.className = "mensaje ok";
    });
  });
}

/* ---------- Carrito ---------- */
function iniciarCarrito() {
  var filas = document.querySelectorAll("tbody tr");
  var celdaTotal = document.getElementById("total");

  function dinero(n) {
    return "$" + n.toFixed(2);
  }

  function recalcular() {
    var total = 0;
    filas.forEach(function (fila) {
      var precio = parseFloat(fila.dataset.precio);
      var cantidad = parseInt(fila.querySelector(".cantidad").value, 10) || 0;
      var subtotal = precio * cantidad;
      fila.querySelector(".subtotal").textContent = dinero(subtotal);
      total += subtotal;
    });
    celdaTotal.textContent = dinero(total);
  }

  filas.forEach(function (fila) {
    var input = fila.querySelector(".cantidad");
    input.addEventListener("input", function () {
      // Solo números: elimina cualquier otro carácter
      input.value = input.value.replace(/\D/g, "");
      recalcular();
    });
  });

  recalcular();
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
