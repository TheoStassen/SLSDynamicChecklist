/*Diverse utility elements*/
import { Series, DataFrame } from 'pandas-js';



/*We consider a constant list of all possible answers to a question*/
const list_possible_answer = ["yes","no","idk","ok","not_ok", "normal", "anormal",  "left", "right","na", "a", "b", "c", "d", "text", "list", "date", "hour", "scan", "signature", "bilateral", "number"]
const list_possible_answer_trad = {"yes":"Oui","no":"Non","idk":"?","ok":"OK","not_ok":"Non OK",
  "normal":"Normal", "anormal":"Anormal", "na": "N.A.", "left": "Gauche", "right": "Droite",
  "a":"A", "b":"B", "c":"C", "d":"D", "text":"Texte", "list":"Liste", "date":"Date", "hour":"Hour", "scan":"Scan", "signature":"Signature", "bilateral": "Bilatéral", "number"  :"Nombre"}

const list_possible_num_var = ["diabetic","age","yearofbirth","difficult_intubation", "gender", "xarelto", "insulin"]
const list_possible_num_var_trad = {"diabetic":"Diabétique","age":"Âge","yearofbirth":"Année de naissance","difficult_intubation":"Intubation Difficile", "gender":"Genre", "xarelto":"Patient sous Xarelto", "insulin":"Patient sous Insuline"}

const list_possible_op = ["<",">","="]


/*Function to translate an answer into mountable french version*/
const trad_answer = (answer) => {
  return list_possible_answer_trad[answer]
}

const trad_num_var = (num_var) => {
    return list_possible_num_var_trad[num_var]
}

/*List of possible options (answers), used in the multiselect component to choose the question answers*/


function date_to_age (date){
  let result = date.split("/")
  let current_year = new Date()
  return current_year.getFullYear() - result[2]
}

/*Function that make the operation of type "is val1 op val2 ?' with op the operator in string input*/
const simple_operation = (val1, string_op, val2) => {
  switch (string_op) {
    case ">" : return val1 > val2;
    case "<" : return val1 < val2;
    case "=" : return val1 === val2 ;
    case "est" : return val1 === val2;
    default: return true;
  }
}

/*Function that take the list of checklist, transform it in json format and export as .json file*/
const checklist_to_json = (checklist) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(checklist, null, '\t'));
    console.log(dataStr)
    var b = document.createElement('a');
    b.href = dataStr ;
    b.download = "checklist.json";
    document.body.appendChild(b);
    b.click();
    b.remove()
}

/*Function to take a data array and put in a .csv file, with some characteristics*/
function CsvGenerator(dataArray, fileName, separator, addQuotes) {
    this.dataArray = dataArray;
    this.fileName = fileName;
    this.separator = separator || ';';
    this.addQuotes = !!addQuotes;

    if (this.addQuotes) {
        this.separator = '"' + this.separator + '"';
    }

    this.getDownloadLink = function () {
        var separator = this.separator;
        var addQuotes = this.addQuotes;

        var rows = this.dataArray.map(function (row) {
            var rowData = row.join(separator);

            if (rowData.length && addQuotes) {
                return '"' + rowData + '"';
            }

            return rowData;
        });

        var type = 'data:text/csv;charset=utf-8';
        var data = rows.join('\n');

        if (typeof btoa === 'function') {
            type += ';base64';
            data = btoa(data);
        } else {
            data = encodeURIComponent(data);
        }

        return this.downloadLink = this.downloadLink || type + ',' + data;
    };

    this.getLinkElement = function (linkText) {
        var downloadLink = this.getDownloadLink();
        var fileName = this.fileName;
        this.linkElement = this.linkElement || (function() {
            var a = document.createElement('a');
            a.innerHTML = linkText || '';
            a.href = downloadLink;
            a.download = fileName;
            return a;
        }());
        return this.linkElement;
    };

    // call with removeAfterDownload = true if you want the link to be removed after downloading
    this.download = function (removeAfterDownload) {
        var linkElement = this.getLinkElement();
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        if (removeAfterDownload) {
            document.body.removeChild(linkElement);
        }
    };
}

// function checklist_tree_to_flat(checklist_tree ) {
//     let checklist_array = [["id", "name", "parent_id", "position", "comment", "section_title", "cond", "check", "color", "pre_check"]]
//     checklist_array = checklist_tree_to_flat_rec(checklist_tree, checklist_array, 0, 0);
//     console.log(checklist_array)
//     // let csvGenerator = new CsvGenerator(checklist_array, 'my_csv.csv', ";");
//     // csvGenerator.download(true);
//     checklist_to_json(checklist_array)
//
//     return checklist_array
// }
//
// function checklist_tree_to_flat_rec(item, array, parent_id, position){
//     if (item.id > 0){
//       console.log(JSON.stringify(item.cond))
//       array.push([item.id, item.name, parent_id, position, item.comment, item.section_title, JSON.stringify(item.cond), JSON.stringify(item.check), JSON.stringify(item.color), item.pre_check ? JSON.stringify(item.pre_check) : null])
//     }
//     for (let i=0; i<item.values.length; i++){
//         array = checklist_tree_to_flat_rec(item.values[i], array, item.id, i)
//     }
//     return array
// }

function checklist_tree_to_flat(checklist_tree ) {
  let checklist_array = [{}]
  checklist_array = checklist_tree_to_flat_rec(checklist_tree, checklist_array, 0, 0);
  console.log(checklist_array)
  // let csvGenerator = new CsvGenerator(checklist_array, 'my_csv.csv', ";");
  // csvGenerator.download(true);
  checklist_to_json(checklist_array)

  return checklist_array
}

function checklist_tree_to_flat_rec(item, array, parent_id, position){
  if (item.id > 0){
    console.log(JSON.stringify(item.cond))
    array.push({id: item.id, name: item.name, parent_itemId: parent_id, position: position, comment: item.comment, section_title: item.section_title, cond: JSON.stringify(item.cond), check : JSON.stringify(item.check), color: JSON.stringify(item.color), pre_check: item.pre_check ? JSON.stringify(item.pre_check) : null})
  }
  for (let i=0; i<item.values.length; i++){
    array = checklist_tree_to_flat_rec(item.values[i], array, item.id, i)
  }
  return array
}


function checklist_flat_to_tree(checklist_array, checklist_id){
  let root_item = {
    checklist_id:checklist_id,
    id:-1,
    num_values:[],
    values:[]
  }
  return checklist_flat_to_tree_rec(root_item, checklist_array)
}

function checklist_flat_to_tree_rec(item, array){
  let child_array = array.filter(elm => elm[2] === item.id)
  child_array.sort(function(a, b){return a[3] - b[3]})
  // console.log(array)
  // console.log(child_array)
  if (!child_array.length){
    return item
  }
  for (let i=0; i< child_array.length; i++){
    const elm = child_array[i]
    let new_item = {
      id: elm[0],
      name : JSON.parse(elm[1]),
      comment : JSON.parse(elm[4]),
      section_title : JSON.parse(elm[5]),
      cond : JSON.parse(elm[6]),
      check : JSON.parse(elm[7]),
      color : JSON.parse(elm[8]),
      pre_check : JSON.parse(elm[9]),
      importance : JSON.parse(elm[10]),
      values:[]
    }
    new_item = checklist_flat_to_tree_rec(new_item, array)
    item.values.push(new_item)
  }
  return item
}


// function checklist_flat_to_tree(checklist_array, checklist_id){
//   let root_item = {
//     checklist_id:checklist_id,
//     id:-1,
//     num_values:[],
//     values:[]
//   }
//   return checklist_flat_to_tree_rec(root_item, checklist_array)
// }
//
// function checklist_flat_to_tree_rec(item, array){
//   let child_array = array.filter(elm => elm.parent_itemId === item.id)
//   child_array.sort(function(a, b){return a.position - b.position})
//   // console.log(array)
//   // console.log(child_array)
//   if (!child_array.length){
//     return item
//   }
//   for (let i=0; i< child_array.length; i++){
//     const elm = child_array[i]
//     console.log(elm)
//     let new_item = {
//       id: elm.itemId,
//       name : elm.name,
//       comment : elm.comment,
//       section_title : elm.section_title,
//       cond :  JSON.parse(elm.cond),
//       check : JSON.parse(elm.check),
//       color : JSON.parse(elm.color),
//       pre_check : JSON.parse(elm.pre_check),
//       importance : JSON.parse(elm.importance),
//       values:[]
//     }
//     new_item = checklist_flat_to_tree_rec(new_item, array)
//     item.values.push(new_item)
//     console.log("new item", new_item)
//   }
//   return item
// }


export {list_possible_answer_trad, list_possible_answer, list_possible_num_var_trad, list_possible_num_var, list_possible_op, trad_answer, trad_num_var, date_to_age, CsvGenerator, simple_operation, checklist_to_json, checklist_tree_to_flat, checklist_flat_to_tree}