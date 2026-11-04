const URL_SERVER = "https://alarming-toad-7v54j55wqj94hr959-3000.app.github.dev/sensores";

function getSensor() {
  // Configura la petición al servidor
  fetch(URL_SERVER, {
    method: "GET",
    mode: "cors",
  }).then((response) => {
    // Si NO se obtuvo una respuesta adecuada muestra un mensaje por consola
    if (response.status !== 200) {
      console.log(
        "Parece que hubo un problema con la consulta. Status Code: " +
          response.status
      );
      return;
    }
    // Muestra los sensores en la interfaz gráfica
    response.json().then(function (data) {
      let ul = document.getElementById("sensor-list");
      ul.innerHTML = "";
      data.forEach((sensor) => {
        let li = document.createElement("li");
        li.className = "mdl-list__item";
        let span = document.createElement("span");
        span.className = "mdl-list__item-primary-content";
        let i = document.createElement("i");
        i.className = "material-icons mdl-list__item-icon";
        i.appendChild(document.createTextNode("memory"));
        span.appendChild(i);
        span.appendChild(document.createTextNode(sensor.nombre));
        li.appendChild(span);
        ul.appendChild(li);
      });
    });
  });
}

function createSensor(sensorName) {
  let sensor = {
    nombre: sensorName,
  };
  fetch(URL_SERVER, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sensor),
  }).then((response) => {
    if (response.status !== 201) {
      console.log(
        "Parece que hubo un problema con la consulta. Status Code: " +
          response.status
      );
      return;
    }
    // Muestra un mensaje y limpia el campo
    response.json().then(function (data) {
      let snackbarContainer = document.querySelector("#mensaje-interactivo");
      let dataMessage = { message: "Sensor agregado - id: " + data._id };
      snackbarContainer.MaterialSnackbar.showSnackbar(dataMessage);
      document.getElementById("sensor-name").value = "";
    });
  });
}

// Toma el evento del menú para mostrar un contenido u otro
function viewPage(page) {
  if (page === "page-sensor-list") {
    document.getElementById("page-sensor-list").style.display = "inline";
    document.getElementById("page-sensor-add").style.display = "none";
    getSensor();
  } else {
    document.getElementById("page-sensor-list").style.display = "none";
    document.getElementById("page-sensor-add").style.display = "inline";
  }
}

// Cuando la aplicación se haya cargado pide los sensores desde el servidor
window.addEventListener("load", function () {
  getSensor();
  document.getElementById("btn-sensor-add").addEventListener("click", () => {
    createSensor(document.getElementById("sensor-name").value);
  });
  viewPage("page-sensor-list");
});