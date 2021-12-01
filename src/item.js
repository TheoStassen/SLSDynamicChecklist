import * as utils from "./utils";
import React from "react";

/* Component representing a checklist item (a question).
- init_items : the parent node of the checklist, used when we need to clean the questions after a answer modification
- item : the current item
- dicts : the different state dicts
- forceUpdate : function that force the reload of component if necessary
- values_filter_cond : function that filter the values by keeping only the values that validates all conditions
* */
function ChecklistItem({init_items, item, dicts, forceUpdate, values_filter_cond , creationMode}) {

  let [isDict, setIsDict, numDict, result, setResult, isPreCheckDone, setIsPreCheckDone] = dicts

  /* Function triggered when the user click on one answer, we update the isDict and results and clean (remove from isDict and results) questions
  * that must not be visible anymore, because of there cond's */
  const handleOnChangeIs = (answer) => {
    const is_check = !isDict[answer][item.id]
    const list_other_answer = utils.list_possible_answer.filter(elm => elm !== answer)

    // If is_check = true, it means that the state of the answer uncheck -> check,
    // so we add in result and clean questions that depends of this item being with another answer (as it is not the case anymore)
    if (is_check){
      result[item.id]={name:item.name,answer:answer}

      clean_children_rec(init_items, init_items, item.id,isDict, setIsDict, result, list_other_answer)
    }
    // If is_check = false, it means that the state of the answer check -> uncheck,
    // so we remove in result and clean questions that depends of this item being with this answer (as it is not the case anymore)
    else{
      delete result[item.id]
      clean_children_rec(init_items, init_items, item.id, isDict, setIsDict, result, [answer])
    }
    setResult(result)
    isDict[answer][item.id] = is_check
    list_other_answer.forEach(function(elm){isDict[elm][item.id]= false})
    setIsDict(isDict)
  }

  /*Function triggered where the user enter a text in a text question. We update the result*/
  const handleOnChangeText = (event) => {
    const input_text = event.target.value;
    result[item.id]={name:item.name,answer:input_text}
    setResult(result)
  };

  /* If the item as pre check conditions and his precheck as not already been made,
  * we check the condition in 'pre_check.if' and if it passes, we do as if the 'pre_check.then' answer was clicked
  */

  if(item.pre_check && !isPreCheckDone.includes(item.id)){
    if (item.pre_check.if.every(function (elm){ return utils.simple_operation(numDict[elm.var],elm.op, elm.val);})){
      handleOnChangeIs(item.pre_check.then); isPreCheckDone.push(item.id); setIsPreCheckDone(isPreCheckDone);
    }
  }

  /* Filter (check of the cond's) of the item values (children) */
  let children = null;
  let values = null;
  if (item.values)
    values = values_filter_cond(item.values, isDict, numDict, creationMode)

  /*We create the children components of the current item*/
  if (values && values.length) {
    children = (
      <ul className="mb-0">
        {values.map((i, index) => (
          <ChecklistItem  key={index} init_items={init_items} item={i} dicts={dicts} forceUpdate = {forceUpdate} values_filter_cond={values_filter_cond}/>
        ))}
      </ul>
    );
  }


  // console.log("Item return", item)
  // console.log("isDict", isDict["yes"][10])
  // console.log("result", result)

  /*We return the different elements of the current item, and also his children*/
  return (
    <div className="container m-0 mt-3 p-0 mx-auto">
      {/*Current Item*/}
      <div className="row align-items-center m-0 p-0">

        {/*Item Id*/}
        <div className="col-sm-1 m-0 p-0 w-auto">
          <div className="card card-grey text-center w-100 shadow-sm" >
            <div className="card-body  text-custom">
              {item.id}
            </div>
          </div>
        </div>

        {/*Item body*/}
        <div className="col m-0 p-0 ">
          {/*Item comment (above the item name)*/}
          {item.comment ? (
            <div className="alert alert-info m-0 mt-0 align- shadow-sm" role="alert">
              <p className="mb-0  text-custom"> {item.comment} </p>
            </div>
            ) : null
          }
          {/*Item name*/}
          <div className="card w-100 shadow-sm" >
            <div className="card-body text-custom">
              {item.name}
            </div>
          </div>
        </div>

        {/*Item answers (if any, if not empty col)*/}
        {item.check.length ? (
        <div className="col-md-auto">
          <div className="input-group ">
            {/*For each possible answer, if in item.check, we put a checkbox*/}
            {utils.list_possible_answer.map((answer, index) => (
              item.check.includes(answer) ? (
              <div  key={index} className="input-group-prepend ">
                <div className="input-group-text shadow  text-custom">
                  <input type="checkbox"
                         aria-label="Checkbox"
                         checked={isDict[answer][item.id] ? 1:0}
                         onChange={function(event){handleOnChangeIs(answer); forceUpdate()}}
                  />
                  &nbsp;{utils.trad_answer(answer)}
                </div>
              </div>
              ) : null
            ))}
            {/*If item answers must contain text, put a text input*/}
            {item.check.includes("text") ? (
            <div className="input-group-prepend">
              <div className="input-group-text">
                  <input
                    className="card w-100 text-custom"
                    type = "text"
                    aria-label="text input"
                    onChange={handleOnChangeText}
                  />
              </div>
            </div>
            ) : null }
          </div>
        </div>
        ) : <div className="col-sm-8"> {null} </div>}
      </div>
      {/*Children of the current item*/}
      {children}
    </div>
  );
}

/*Function that clean (remove from isDict and results) questions
  * that must not be visible anymore, because of there cond's.
  * -We check the current item, remove if necessary from result and isDict
  * (id indicating what question has been removed, and answers indicating all the answers possibly removed,
  * so we need to check if the current item was dependent of one of these answers,
  * -We call the function recursively on each child of the current item
  * - If the current item as been removed, we call recursively, s
  * */
function clean_children_rec(init_item, item, id, isDict, setIsDict, result, answers) {
  let is_remove = false
  if(item.cond){
    answers.forEach(function(answer){
      if(item.cond[answer] && item.cond[answer].includes(id)){
        utils.list_possible_answer.forEach(function(elm){isDict[elm][item.id]= false})
        delete result[item.id]
        is_remove = true
      }
    })
  }

  if (item.values && item.values.length){
    item.values.forEach( function (value) {
      clean_children_rec(init_item, value, id, isDict, setIsDict, result, answers)
    })
  }
  if (id !== item.id && is_remove) {
        clean_children_rec(init_item, init_item, item.id, isDict, setIsDict, result, answers)
  }
}

export {ChecklistItem}