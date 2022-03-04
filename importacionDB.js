const excelJson = [{}, {}, {}];

/* const arrayClaves = ["f9081479-d29c-41f8-8c21-a88b3aec6852", "68fa38a2-2f4c-4256-a493-51017806ca00",]
const arrayValores = [{  "dbName": "nombre"}, {"dbName": "nombre"},] */

// Unir objetos json en uno solo
const objeto1 = {};
const objeto2 = {};
const objeto3 = {};

const objetoGlobal = { ...objeto1, ...objeto2, ...objeto3 };

const elementosFormulario = {
  "f9081479-d29c-41f8-8c21-a88b3aec6852": {
    ordinal: 0,
    _id: "f9081479-d29c-41f8-8c21-a88b3aec6852",
    row: "row-1",
    title: "NHC",
    units: "",
    field_type: "textfield",
    data_type: "INT",
    value: "",
    default_value: "",
    calculation: "",
    display_status: "true",
    conditional_display_id: null,
    conditional_display_value: null,
    field_size: 2,
    required: true,
    dbName: "nhc",
    conditional_value: null,
  },
  "68fa38a2-2f4c-4256-a493-51017806ca00": {
    ordinal: 1,
    _id: "68fa38a2-2f4c-4256-a493-51017806ca00",
    row: "row-1",
    title: "NUHSA",
    units: "",
    field_type: "textfield",
    data_type: "ST",
    value: "",
    default_value: "",
    calculation: "",
    display_status: "true",
    conditional_display_id: null,
    conditional_display_value: null,
    field_size: 2,
    required: true,
    dbName: "nuhsa",
  },
};

const arrayPacientes = [];

const crearPaciente = () => {
  excelJson.forEach((paciente) => {
    // Por cada paciente
    const pacientJson = {
      project_data: { nuhsa: paciente.nuhsa, nhc: paciente.nhc },
      data_record: [
        {
          docs: [],
          project_id: { $oid: "616d199b098e2a33e877378d" },
          form_id: { $oid: "6183bb77772bdf00c0bda2b9" },
          formIterations: [],
        },
      ],
    };

    const formsIteration = {
      isFormFinish: false,
      isActive: false,
      forms_data: [],
    };

    // otro bucle en el que buscar los valores en paciente
    Object.keys(elementosFormulario).forEach((key) => {
      formsIteration.forms_data.push(key, paciente.dbName);
    });

    pacientJson.data_record[0].formIterations.push(formsIteration);

    arrayPacientes.push(pacientJson);
  });
};


