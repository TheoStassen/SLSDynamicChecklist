
/*Diverse utilitary functions*/

/*We consider a constant list of all possible answers to a question; a list of numerical variables, and operators*/
const list_possible_answer = ["yes","no","idk","ok","not_ok", "normal", "anormal",  "left", "right","na", "a", "b", "c", "d", "text", "list", "date", "hour", "scan", "signature", "bilateral", "number"]
const list_possible_answer_trad = {"yes":"Oui","no":"Non","idk":"?","ok":"OK","not_ok":"Non OK",
  "normal":"Normal", "anormal":"Anormal", "na": "N.A.", "left": "Gauche", "right": "Droite",
  "a":"A", "b":"B", "c":"C", "d":"D", "text":"Texte", "list":"Liste", "date":"Date", "hour":"Hour", "scan":"Scan", "signature":"Signature", "bilateral": "Bilatéral", "number"  :"Nombre"}
const list_possible_num_var = ["diabetic","age","yearofbirth","difficult_intubation", "gender", "xarelto", "insulin"]
const list_possible_num_var_trad = {"diabetic":"Diabétique","age":"Âge","yearofbirth":"Année de naissance","difficult_intubation":"Intubation Difficile", "gender":"Genre", "xarelto":"Patient sous Xarelto", "insulin":"Patient sous Insuline"}
const list_possible_op = ["<",">","="]


/*Function to translate an answer into french version*/
const trad_answer = (answer) => {
  return list_possible_answer_trad[answer]
}

/*Function to translate an numerical variable into french version*/
const trad_num_var = (num_var) => {
    return list_possible_num_var_trad[num_var]
}

/*Date value to age value*/
function date_to_age (date){
  let result = date.split("-")
  let current_year = new Date()
  return current_year.getFullYear() - result[0] //TODO : is_local
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

/*Take the checklist in tree format -> checklist in array/flat format*/
function checklist_tree_to_flat(checklist_tree ) {
  let checklist_array = [{}]
  checklist_array = checklist_tree_to_flat_rec(checklist_tree, checklist_array, 0, 0);

  return checklist_array
}

/*Function to construct flat checklist by adding element to array and call recursively the children*/
function checklist_tree_to_flat_rec(item, array, parent_id, position){
  if (item.id > 0){
    array.push({id: item.db_item_id, itemId: item.id, name: item.name, parent_itemId: parent_id, position: position,
      comment: item.comment, section_title: item.section_title, cond: JSON.stringify(item.cond),
      check : JSON.stringify(item.check), color: JSON.stringify(item.color),
      pre_check: item.pre_check ? JSON.stringify(item.pre_check) : null})
  }
  for (let i=0; i<item.values.length; i++){
    array = checklist_tree_to_flat_rec(item.values[i], array, item.id, i)
  }
  return array
}

/*Take the checklist in array/flat format -> checklist in tree format*/
function checklist_flat_to_tree(checklist_array, checklist_id){
  let root_item = {
    checklist_id:checklist_id,
    id:-1,
    num_values:[],
    values:[]
  }
  return checklist_flat_to_tree_rec(root_item, checklist_array)
}

/*Function to construct tree checklist by taking a tree checklist item, take the array of children in flat checklist,
and for each children : take the infos, ask recursively the children.values, and add the children to item.values  */
function checklist_flat_to_tree_rec(item, array){
  let child_array = array.filter(elm => elm.parent_itemId === item.id)
  child_array.sort(function(a, b){return a.position - b.position})

  if (!child_array.length){
    return item
  }
  for (let i=0; i< child_array.length; i++){
    const elm = child_array[i]
    console.log(elm)
    let new_item = {
      id: elm.itemId,
      name : elm.name,
      comment : elm.comment,
      section_title : elm.section_title,
      cond :  JSON.parse(elm.cond),
      check : JSON.parse(elm.check),
      color : JSON.parse(elm.color),
      pre_check : JSON.parse(elm.pre_check),
      importance : JSON.parse(elm.importance),
      db_item_id : elm.id,
      values:[]
    }
    new_item = checklist_flat_to_tree_rec(new_item, array)
    item.values.push(new_item)
    console.log("new item", new_item)
  }
  return item
}

export {list_possible_answer_trad, list_possible_answer, list_possible_num_var_trad, list_possible_num_var, list_possible_op, trad_answer, trad_num_var, date_to_age, simple_operation, checklist_tree_to_flat, checklist_flat_to_tree}