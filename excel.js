var XLSX = require("xlsx");

const ExcelAJSON = () => {
  const excel = XLSX.readFile(
    "filiacion.xlsx", {
      cellText: false,
      cellDates: true,
  });
 
    
    var nombreHoja = excel.SheetNames; // regresa un array
    let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]], {
      raw: false,
      dateNF: "dd/mm/yyyy", 


    });
  
    return datos;
  };
 
module.exports = {
  ExcelAJSON,
  }

