require("colors");


//const excel = require("exceljs");
const fs = require("fs");
const { formatWithOptions } = require("util");
const { ExcelAJSON }   = require("./excel");
const { guardarDB } = require("./guardarArchivo");


const info = fs.readFileSync("Filiación del caso.json", { encoding: "utf-8" });
const data = JSON.parse(info);

const l = data.structure.length;

const elementosTabs = data.structure.map((tab) => Object.keys(tab.elementos));

const tempTab = elementosTabs[0].map((key) => data.structure[0].elementos[key]);

let tempArray = elementosTabs.map((arrayKeys, index) => {
  return arrayKeys.map((key) => {
    const el = Object.assign({}, data.structure[index].elementos[key]);
    return { _id: el._id, dbName: el.dbName };
  });
});

tempArray = tempArray.reduce((acc, value) => {
  return acc.concat(value);
}, []);
//////////////////////////////////////////////////////


const dataExcel = ExcelAJSON();
//console.log('dataExcel', dataExcel[0]);

let keys = [];
for(let i=0; i<dataExcel.length; i++){
    let key = Object.keys(dataExcel[i]);
    keys.push(key);
    
}

//console.log(keys);

let values = [];
for(let j=0; j<dataExcel.length; j++){
    let val = Object.values(dataExcel[j]);
    values.push(val);
    
}
//console.log(values);
 

////////////////////////////////////////////////////////////////////////
  for(let k =0; k<dataExcel.length; k++){
    for(let v=0; v<dataExcel.length;v++){
    let ke = keys[k];
    let va = values[v];
    
    let paciente = ke.map((arrayKeys,index) => {
        return tempArray.map((arrayKeys2, index) => {
            if((tempArray[index].dbName == ke[index]))  {
              let id = [tempArray[index]._id];
              
              let pac = {
                [id]: va[index]
               
               }
              return pac;
            }
            
            
           
      });
      
      });
      console.log(paciente);
      guardarDB(paciente);
    }
    
  }

 
