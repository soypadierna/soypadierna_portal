document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Salir en silencio si la página no tiene el formulario
  var form = document.getElementById("formContacto");
  if (!form) {
    return;
  }

  // ---------- Referencias al DOM ----------
  var nombre = document.getElementById("nombre");
  var email = document.getElementById("email");
  var motivo = document.getElementById("motivo");
  var mensaje = document.getElementById("mensaje");
  var terminos = document.getElementById("terminos");
  var contador = document.getElementById("contadorMensaje");
  var resultado = document.getElementById("resultadoForm");

  // ---------- Constantes ----------
  var MIN_NOMBRE = 3;
  var MIN_MENSAJE = 20;
  var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ---------- Utilidades ----------

  /** Marca un campo como inválido y muestra su mensaje de error. */
  function marcarInvalido(campo, texto) {
    var feedback = document.getElementById(campo.getAttribute("aria-describedby").split(" ").pop());
    campo.classList.remove("is-valid");
    campo.classList.add("is-invalid");
    feedback.textContent = texto;
    return false;
  }

  /** Marca un campo como válido y limpia su mensaje de error. */
  function marcarValido(campo) {
    var feedback = document.getElementById(campo.getAttribute("aria-describedby").split(" ").pop());
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    feedback.textContent = "";
    return true;
  }

  /** Quita todas las clases de validación y los mensajes de error. */
  function limpiarValidacion() {
    [nombre, email, motivo, mensaje, terminos].forEach(function (campo) {
      campo.classList.remove("is-valid", "is-invalid");
    });
    form.querySelectorAll(".invalid-feedback").forEach(function (el) {
      el.textContent = "";
    });
  }

  /** Actualiza el contador de caracteres del mensaje. */
  function actualizarContador() {
    var largo = mensaje.value.trim().length;
    contador.textContent = largo + "/" + MIN_MENSAJE + " caracteres mínimo";
  }

  /** Muestra un alert de Bootstrap dentro de #resultadoForm. */
  function mostrarAlerta(tipo, texto) {
    resultado.innerHTML = "";
    var alerta = document.createElement("div");
    alerta.className = "alert alert-" + tipo + " alert-dismissible fade show";
    alerta.textContent = texto;

    var cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.className = "btn-close";
    cerrar.setAttribute("data-bs-dismiss", "alert");
    cerrar.setAttribute("aria-label", "Cerrar aviso");
    alerta.appendChild(cerrar);

    resultado.appendChild(alerta);
  }

  // ---------- Validaciones individuales ----------

  function validarNombre() {
    var valor = nombre.value.trim();
    if (valor.length < MIN_NOMBRE) {
      return marcarInvalido(nombre, "El nombre debe tener al menos 3 caracteres.");
    }
    return marcarValido(nombre);
  }

  function validarEmail() {
    var valor = email.value.trim();
    if (!REGEX_EMAIL.test(valor)) {
      return marcarInvalido(email, "Ingresa un correo válido, por ejemplo nombre@dominio.com.");
    }
    return marcarValido(email);
  }

  function validarMotivo() {
    if (!motivo.value) {
      return marcarInvalido(motivo, "Selecciona un motivo de contacto.");
    }
    return marcarValido(motivo);
  }

  function validarMensaje() {
    var largo = mensaje.value.trim().length;
    if (largo < MIN_MENSAJE) {
      return marcarInvalido(
        mensaje,
        "El mensaje debe tener al menos 20 caracteres (te faltan " + (MIN_MENSAJE - largo) + ")."
      );
    }
    return marcarValido(mensaje);
  }

  function validarTerminos() {
    if (!terminos.checked) {
      return marcarInvalido(terminos, "Debes aceptar la política de datos para continuar.");
    }
    return marcarValido(terminos);
  }

  // ---------- Validación en tiempo real ----------

  nombre.addEventListener("input", validarNombre);
  nombre.addEventListener("blur", validarNombre);

  email.addEventListener("input", validarEmail);
  email.addEventListener("blur", validarEmail);

  motivo.addEventListener("change", validarMotivo);
  motivo.addEventListener("blur", validarMotivo);

  mensaje.addEventListener("input", function () {
    actualizarContador();
    validarMensaje();
  });
  mensaje.addEventListener("blur", validarMensaje);

  terminos.addEventListener("change", validarTerminos);
  terminos.addEventListener("blur", validarTerminos);

  // ---------- Envío del formulario ----------

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Se ejecutan todas las validaciones (sin cortocircuito) para marcar todos los errores
    var resultados = [
      { campo: nombre, ok: validarNombre() },
      { campo: email, ok: validarEmail() },
      { campo: motivo, ok: validarMotivo() },
      { campo: mensaje, ok: validarMensaje() },
      { campo: terminos, ok: validarTerminos() }
    ];

    var primerInvalido = resultados.find(function (r) {
      return !r.ok;
    });

    if (primerInvalido) {
      mostrarAlerta("danger", "Revisa los campos marcados.");
      primerInvalido.campo.focus();
      return;
    }

    // Todo válido: mensaje de éxito con el nombre del usuario
    var nombreUsuario = nombre.value.trim();
    form.reset();
    limpiarValidacion();
    actualizarContador();
    mostrarAlerta("success", "¡Gracias, " + nombreUsuario + "! Tu mensaje fue enviado.");
  });

  // ---------- Botón "Limpiar" ----------

  form.addEventListener("reset", function () {
    // El reset nativo vacía los campos; después se limpian clases, errores, alertas y contador
    setTimeout(function () {
      limpiarValidacion();
      resultado.innerHTML = "";
      actualizarContador();
    }, 0);
  });
});