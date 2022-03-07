var XLSX = require("xlsx");

const ExcelAJSON = () => {
  const excel = XLSX.readFile("filiacion.xlsx", {
    cellText: false,
    cellDates: true,
  });

  var nombreHoja = excel.SheetNames; // regresa un array
  const hojas = nombreHoja.map((name) => {
    return XLSX.utils.sheet_to_json(excel.Sheets[name], {
      raw: false,
      dateNF: "dd/mm/yyyy",
    });
  });

  return hojas;
};

module.exports = {
  ExcelAJSON,
};
