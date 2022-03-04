const fs = require("fs");
const { ExcelAJSON } = require("./excel");

const info = fs.readFileSync("Filiación del caso.json", { encoding: "utf-8" });
const data = JSON.parse(info);

// data.structure.elementos es un objeto por lo que al extraerlo solo obtenemos un array de 3 obejtos,
// al hacer Object.values(tab.elementos) obtenemos 3 arrays con los valores de cada uno de esos 3 objetos,
// estos valores son los elementos individuales de cada pestaña
const allTabs = data.structure.map((tab) => Object.values(tab.elementos));

// Hacemos flat para no tener 3 arrays de objetos y convertirlo en uno solo
const allElements = allTabs.flat();

// Nos quedamos solo con los dos valores que necesitamos de cada elemento, el id y el dbname
const reducedElements = allElements.map((el) => {
  return {
    id: el._id,
    dbName: el.dbName,
  };
});

//console.log("reducedElements", reducedElements);

const dataExcel = ExcelAJSON();
//console.log('dataExcel', dataExcel)

// Ejemplo de como obtener el objeto final (forms_data dentro de formIterations) que necesitamos el primer paciente, para este formulario.
const patientObject = reducedElements.reduce((acc, el) => {
  acc[el.id] = dataExcel[0][el.dbName];
  return acc;
}, {});

console.log("patientObject", patientObject);