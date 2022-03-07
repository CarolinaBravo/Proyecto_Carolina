const fs = require("fs");
const { ExcelAJSON } = require("./excel");
const { guardarDB } = require("./guardarArchivo");

const estructuras = JSON.parse(
  fs.readFileSync("Formularios_alfa1.json", {
    encoding: "utf-8",
  })
);

const elementosEsctructuras = estructuras.map((estructura) => {
  // data.structure.elementos es un objeto por lo que al extraerlo solo obtenemos un array de 3 obejtos,
  // al hacer Object.values(tab.elementos) obtenemos 3 arrays con los valores de cada uno de esos 3 objetos,
  // estos valores son los elementos individuales de cada pestaña
  const allTabs = estructura.structure.map((tab) =>
    Object.values(tab.elementos)
  );

  // Hacemos flat para no tener 3 arrays de objetos y convertirlo en uno solo
  const allElements = allTabs.flat();

  // Nos quedamos solo con los dos valores que necesitamos de cada elemento, el id y el dbname
  return allElements.map((el) => {
    return {
      id: el._id,
      dbName: el.dbName,
    };
  });
});

//console.log("reducedElements", reducedElements);

// dataExcel es un array de hojas que contiene un array de elementos [[],[],[]...]
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

const paciente_base = {
  project_data: {
    nuhsa: "AN0563456789",
    nhc: "0123456",
  },
  docs: [],
  data_record: [],
};

/*
1. Creamos un array con todos los pacientes sin datos ==> recorrer la primera tab (filiciación del caso) obteniendo un array con el objeto 
      paciente_base para cada paciente (linea de la tab);
2. Recorremos el array de pacientes, y lo vamos rellenando con las datos de cada tab

*/

// Generamos el Array de pacientes con los datos de project_data
const arrayPacientes = dataExcel[0].map((paciente) => {
  const paciente_base = {
    project_data: {
      nuhsa: "AN0563456789",
      nhc: "0123456",
    },
    docs: [],
    data_record: [],
  };
  paciente_base.project_data.nuhsa = paciente.nuhsa;
  paciente_base.project_data.nhc = paciente.nhc;

  return paciente_base;
});

// Generamos para cada paciente los data_record de cada formulario
arrayPacientes.reduce((acc, paciente, i) => {
  paciente.data_record = elementosEsctructuras.map((reducedElements, index) => {
    const tab = dataExcel[index];

    // copiamos los objetos ejemplo a una constante nueva para modificarlos (data_record y formIteration)
    const data_record = Object.assign({}, data_record_base);
    const formIteration = Object.assign({}, formIteration_base);

    // Obtenemos los valores para cada elemento del paciente extraido del excel
    const forms_data = reducedElements.reduce((acc, el) => {
      acc[el.id] = tab[i][el.dbName];
      return acc;
    }, {});

    formIteration.forms_data = forms_data;
    data_record.formIterations.push(formIteration);

    return data_record;
  });

  acc.push(paciente);
  return acc;
}, []);

// El resultado ahora mismo sería un array con todas el objeto del formulario Filiación paciente para cada paciente,
// esto se debería hacer para cada formulario  y guardarlo todo en el objeto paciente (tienes uno de ejemplo entre los archivos)
guardarDB(data_record_array);
//console.log("data_record_array", data_record_array);

/*
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
*/
