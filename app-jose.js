const fs = require("fs");
const { ExcelAJSON } = require("./excel");
const { guardarDB } = require("./guardarArchivo");

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

const data_record_base = {
  docs: [],
  project_id: "616d199b098e2a33e877378d",
  form_id: "6183bb77772bdf00c0bda2b9",
  formIterations: [],
  modifyBy: "6082b38b81e5450021d16d58",
};

const formIteration_base = {
  isFormFinish: true,
  isActive: false,
  forms_data: {},
};

// Obtenemos el objeto formIteration que necesitamos para cada paciente, para este formulario.
const data_record_array = dataExcel.map((paciente) => {
  // copiamos los objetos ejemplo a una constante nueva para modificarlos (data_record y formIteration)
  const data_record = Object.assign({}, data_record_base);
  const formIteration = Object.assign({}, formIteration_base);
  // Obtenemos los valores para cada elemento del paciente extraido del excel
  const forms_data = reducedElements.reduce((acc, el) => {
    acc[el.id] = paciente[el.dbName];
    return acc;
  }, {});

  formIteration.forms_data = forms_data;
  console.log("formIteration", formIteration);
  data_record.formIterations.push(formIteration);

  return data_record;
});

// El resultado ahora mismo sería un array con todas el objeto del formulario Filiación paciente para cada paciente,
// esto se debería hacer para cada formulario  y guardarlo todo en el objeto paciente (tienes uno de ejemplo entre los archivos)
guardarDB(data_record_array);
//console.log("data_record_array", data_record_array);
