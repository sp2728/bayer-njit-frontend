import dataPrinc from "./principal.json";
import { Nivel1 } from "./utils/cat_principales";

const years = new Set(dataPrinc.map((e) => e["Año"]));

function SerieNivel1() {
  const Nivel1_serie = [];
  years.forEach((value) => Nivel1_serie.push(Nivel1(dataPrinc, value)));
  const categorias = new Set(Nivel1_serie.flat().map((e) => e.Categoria));
  const tabla = Nivel1_serie.flat();
  const otro = [];
  for (let cat of categorias) {
    var container = {};
    container["Categoria"] = cat;
    for (let year of years) {
      let aux = tabla.filter((e) => e.Categoria === cat && e.Año === year)[0];

      aux ? (container[year] = aux.Index + 1) : (container[year] = null);
    }
    otro.push(container);
  }
  const maxYear = Math.max(...Array.from(years));

  otro.sort((a, b) =>
    a[maxYear] === null
      ? 1
      : b[maxYear] === null
      ? -1
      : a[maxYear] < b[maxYear]
      ? -1
      : 1
  );
  // const what = Nivel1_serie.flat().map((e) => ({
  //   Categoria: e.Categoria,
  //   Gas: e.Gas,
  //   [e.Año]: e.Index
  // }));
  return otro;
}

function CreateTableFromJSON() {
  var myBooks = SerieNivel1();

  // EXTRACT VALUE FOR HTML HEADER.
  const yearsArray = Array.from(years).sort();
  var col = ["Categoria", ...yearsArray];

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1); // TABLE ROW.

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < myBooks.length; i++) {
    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = myBooks[i][col[j]];
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

CreateTableFromJSON();
