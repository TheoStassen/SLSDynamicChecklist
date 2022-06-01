import * as utils from "./utils";
import  * as temp_data from "./temporary_data.js";
import React, {useState, useReducer} from "react";
import BootstrapSelect from "react-bootstrap-select-dropdown";
import QrcodeScanner from "./qrcodescanner";
import axios from "axios";
import {AppSignature} from "./signature";

/* Component representing a checklist item (a question).
- init_items : the parent node of the checklist, used when we need to clean the questions after a answer modification
- item : the current item
- dicts : the different state dicts
- forceUpdate : function that force the reload of component if necessary
- values_filter_cond : function that filter the values by keeping only the values that validates all conditions
* */
function ChecklistItem({init_items, item, dicts, forceUpdate, values_filter_cond , creationMode, currentId, warningId, precheckMode, is_root, alertList, scan_bookmark, checklist_name}) {

  // console.log("enter item", item)



  let [isDict, setIsDict, numDict, result, pbresult, setResult, setPbResult, isPreCheckDone, setIsPreCheckDone, visibleList, setVisibleList, debugMode, commentMode] = dicts

  // console.log(item)
  // console.log("isDict", isDict)
  // console.log("result", result)
  // console.log("isprecheck", isPreCheckDone)
  // console.log("numdict", numDict)

  let [isOther, setIsOther] = useState(false)

  let [trimmedCanvasUrl, setTrimmedCanvasUrl] = useState(null)
  let sigpad = {}

  /* Function triggered when the user click on one answer, we update the isDict and results and clean (remove from isDict and results) questions
  * that must not be visible anymore, because of there cond's */
  const handleOnChangeIs = (answer) => {
    console.log("handle change", item)
    const is_check = !isDict[answer][item.id]
    console.log(is_check)
    const list_other_answer = utils.list_possible_answer.filter(elm => elm !== answer)

    // If is_check = true, it means that the state of the answer uncheck -> check,
    // so we add in result and clean questions that depends of this item being with another answer (as it is not the case anymore)
    if (is_check){
      result[item.id]={name:item.name,answer:answer}
      delete pbresult[item.id]
      if (item.color[item.check.indexOf(answer)] === 1)
        pbresult[item.id] = {name:item.name,answer:answer,checklist_name:checklist_name}

      clean_children_rec(init_items, init_items, item.id,isDict, setIsDict, result, pbresult, list_other_answer)
    }
    // If is_check = false, it means that the state of the answer check -> uncheck,
    // so we remove in result and clean questions that depends of this item being with this answer (as it is not the case anymore)
    else{
      delete result[item.id]
      delete pbresult[item.id]
      clean_children_rec(init_items, init_items, item.id, isDict, setIsDict, result, pbresult, [answer])
    }
    setResult(result)
    setPbResult(pbresult)
    isDict[answer][item.id] = is_check
    list_other_answer.forEach(function(elm){isDict[elm][item.id]= false})
    setIsDict(isDict)
  }

  /*Function triggered where the user enter a text in a text question. We update the result*/
  const handleOnChangeText = (event) => {
    const input_text = event.target.value;
    result[item.id]={name:item.name,answer:input_text,checklist_name:checklist_name}
    setResult(result)
    if (item.color[0] === 1){
      pbresult[item.id] = {name:item.name,answer:input_text}
      setPbResult(pbresult)
    }
  };

  /*Function triggered where the user enter a text in a text question. We update the result*/
  const handleOnChangedDefaultText = (event) => {
    const input_text = event;
    result[item.id]={name:item.name,answer:input_text,checklist_name:checklist_name}
    setResult(result)
    if (item.color[0] === 1){
      pbresult[item.id] = {name:item.name,answer:input_text}
      setPbResult(pbresult)
    }
    return input_text
  };

  const handleOnChangeCurrentDate = () => {
    let current_date = new Date()
    let current_date_str = current_date.toISOString().split("T")[0]
    result[item.id]={name:item.name, answer:current_date_str,checklist_name:checklist_name}
    setResult(result)
    console.log(current_date_str)
    return current_date_str
  }

  const handleOnChangeCurrentTime = () => {
    let current_date = new Date()
    let current_time_str = current_date.toTimeString().split(" ")[0].substring(0,5)
    result[item.id]={name:item.name, answer:current_time_str,checklist_name:checklist_name}
    setResult(result)
    console.log(current_time_str)
    return current_time_str
  }

  const handleOnChangeList = (selectedOptions) => {
    const input_answer = JSON.parse(JSON.stringify(selectedOptions.selectedValue));
    if (selectedOptions.selectedKey.includes("other")) {
      setIsOther(true)
    }
    else{
      setIsOther(false)
    }
    result[item.id]={name:item.name,answer:input_answer}
    setResult(result)
    if (item.color[0] === 1 && !(selectedOptions.selectedKey.includes("Aucune") || selectedOptions.selectedKey.includes("Aucun") )){
      pbresult[item.id] = {name:item.name,answer:input_answer,checklist_name:checklist_name}
      setPbResult(pbresult)
    }
    else{
      delete pbresult[item.id]
      setPbResult(pbresult)
    }
  };

  /*Function triggered where the user enter a text in a text question. We update the result*/
  const handleOnChangeListOther = (event) => {
    const input_text = event.target.value;
    let input_answer = result[item.id].answer
    input_answer.pop() // With the first letter typed, remove the "other" field, when you continue to type, remove the previous word and add the new
    input_answer.push(input_text)
    result[item.id]={name:item.name,answer:input_answer}
    setResult(result)
  };

  const create_possible_list_answers = (name) => {
    const list_answers = temp_data.lists[name]
    const list_possible_answers = []
    list_answers.forEach(function(answer){
      list_possible_answers.push({
        "labelKey": answer,
        "value": answer,
      })
    })
    // list_possible_answers.push({
    //   "labelKey" : "supp",
    //   "value": "Fermer",
    // })
    list_possible_answers.push({"labelKey": "other", "value": "Autre"})
    return list_possible_answers
  }

  /* If the item as pre check conditions and his precheck as not already been made,
  * we check the condition in 'pre_check.if' and if it passes, we do as if the 'pre_check.then' answer was clicked
  */
  // console.log(item.id, item.pre_check)

  if(precheckMode && item.pre_check && !isPreCheckDone.includes(item.id)){
    // console.log("enter precheck", item, isDict)
    if (item.pre_check.if.every(function (elms){
        return elms.some(function (elm){
          if (elm.op)
            return utils.simple_operation(numDict[elm.var],elm.op, elm.val);
          else
            return isDict[elm.val][elm.var]
        })
    })){
      handleOnChangeIs(item.pre_check.then); isPreCheckDone.push(item.id); setIsPreCheckDone(isPreCheckDone);
    }
  }

  /* Filter (check of the cond's) of the item values (children) */
  let children = null;
  let values = null;
  if (item.values) {
    values = values_filter_cond(item.values, isDict, numDict, creationMode, debugMode)
    values.forEach(value => !visibleList.includes(value.id) && value.check.length ? visibleList.push(value.id) : null)
  }

  // let show_scan = false
  // if (scan_bookmark && item.check.includes("scan")){
  //   show_scan = true
  //   scan_bookmark = false
  // }

  /*We create the children components of the current item*/
  if (values && values.length) {
    children = (
      <ul className="mb-0">
        {values.map((i, index) => (
          <ChecklistItem  key={index} init_items={init_items} item={i} dicts={dicts} forceUpdate = {forceUpdate} values_filter_cond={values_filter_cond} creationMode={creationMode} currentId={currentId} warningId={warningId} is_root={false} alertList={alertList} scan_bookmark={scan_bookmark} checklist_name={checklist_name} />
        ))}
      </ul>
    );
  }

  let [scanValue, setScanValue] = useState(null)
  let [scanValueError, setScanValueError] = useState(null)

  function onNewScanResult(decodedText, decodedResult) {
    console.log(decodedText, scanValue)
    if(decodedText) {
      setScanValue(decodedText)
      console.log("write decoded scan", decodedText)
      result[item.id] = {name: item.name, answer: decodedText}
      setResult(result)
    }
  }



  // console.log(item.id, scan_bookmark, scanValue)
  // console.log("Item return", item)
  // console.log("isDict", isDict)
  // console.log("result", result)
  // console.log(result)
  // console.log(visibleList)
  // console.log(numDict)
  //
  // console.log(warningId)
  // console.log(currentId)
  //
  // console.log("item", item)

  /*We return the different elements of the current item, and also his children*/
  return (
    <div className={"container p-0 mx-auto " + (is_root ? "":"mt-3") }>
      {/*Current Item*/}

      {warningId === item.id ? (
        <div className=" alert text-white bg-warning rounded" role="alert">
          <div className="iq-alert-icon">
            <i className="ri-alert-fill"/>
          </div>
          <div className="iq-alert-text">Vous n'avez pas répondu à cette question</div>
        </div>
      ):null}

      <div id={"question"+item.id} className={"row align-items-center m-0 p-0" + (creationMode && currentId === item.id ? " border border-danger " : " " )}>

        {/*Item Id*/}
        <div className="col list-group list-group-horizontal m-0 p-0 w-auto">
          <div className={"list-group-item m-0 p-0 text-center shadow-sm my-auto " + (item.importance || alertList && Object.values(alertList).some(elm => elm.name === item.name) ? "bg-danger" : "bg-primary")} >
            <h5 className="card-body p-auto text-white">
              {item.id}
            </h5>
          </div>

          {/*Item name*/}
          <div className="list-group-item m-0 p-0 w-100 shadow-sm h-auto text-dark bg- "  >
              {item.comment && commentMode ? (
                <div className="row alert alert-light px-0 m-0 mt-0 border-0 text-primary my-auto text-center align-content-center" role="alert">
                  <p className={"w-100 m-0"}>{item.comment}</p>
                  {item.comment.includes("Consentement") ?
                    <div className={"text-center mx-auto"}>
                      <button className="btn m-0 p-0 mx-auto " type="button" data-toggle="collapse" data-target="#collapseconsentpdf"
                              aria-expanded="false" aria-controls="collapseExample">
                        <div data-icon="T" className="icon"></div>
                      </button>
                      <div className="collapse m-0 p-0" id="collapseconsentpdf">
                        <p className={"col-sm-12 mx-0 px-0 mb-0"}> <img src={numDict.consent_pdf} width={"280"}/> </p>
                      </div>
                    </div>
                    : null}
                </div>
              ) : null}
            <div className="card-body my-auto">
              {item.name.split("_")[0]}
            </div>
            {/*Item comment (above the item name)*/}
          </div>

        </div>

        {/*Item answers (if any, if not empty col)*/}
        {item.check.length ? (
        <div className="col-sm-auto p-0 pl-3">
          <div className={"row px-3"}>
            <div className="list-group list-group-horizontal ">
              {/*For each possible answer, if in item.check, we put a checkbox*/}
              {item.check.map((answer, index) =>
                index < 3 && !["text","list", "date", "hour", "scan", "signature", "number"].includes(answer.split("_")[0]) ?
                  <label key={index} className={"list-group-item list-group-item-custom btn m-0" + (item.color && item.color[index] === 0 ? " btn-outline-success" : (item.color && item.color[index] === 1 ? " btn-outline-danger" : " btn-outline-secondary"))} >
                    <input  type="checkbox"
                           aria-label="Checkbox"
                           checked={isDict[answer] && isDict[answer][item.id] ? 1:0}
                           onChange={function(event) {handleOnChangeIs(answer);forceUpdate()}}
                    />
                    &nbsp;{utils.trad_answer(answer)}
                  </label>
                : null
              )}
            </div>

            <div className="list-group list-group-horizontal ">
              {/*For each possible answer, if in item.check, we put a checkbox*/}
              {item.check.map((answer, index) =>
                index >= 3 && !["text","list", "date", "hour", "scan", "signature", "number"].includes(answer.split("_")[0]) ?
                  <label key={index} className={"list-group-item list-group-item-custom btn m-0" + (item.color && item.color[index] === 0 ? " btn-outline-success" : (item.color && item.color[index] === 1 ? " btn-outline-danger" : " btn-outline-secondary"))} >
                    <input  type="checkbox"
                            aria-label="Checkbox"
                            checked={isDict[answer] && isDict[answer][item.id] ? 1:0}
                            onChange={function(event) {handleOnChangeIs(answer);forceUpdate()}}
                    />
                    &nbsp;{utils.trad_answer(answer)}
                  </label>
                  : null
              )}
            </div>
          </div>
          {/*If item answers must contain text, put a text input*/}
          {item.check.includes("text") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "text " aria-label="text input" placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers must contain date, put a text input*/}
          {item.check.includes("date") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "date" aria-label="text input" defaultValue={handleOnChangeCurrentDate()} placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers must contain date, put a text input*/}
          {item.check.includes("hour") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "time" aria-label="text input" defaultValue={handleOnChangeCurrentTime()} placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers must contain date, put a text input*/}
          {item.check.includes("number") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "number" aria-label="text input" defaultValue={handleOnChangedDefaultText("0")} placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers must contain list, put a list dropdown input*/}
          {item.check[0].split("_").includes("list") ? (
            <BootstrapSelect key={item.check[0].split("_")[1]} className=" my-auto "
                             selectStyle ="py-2  btn btn-outline-dark bg-white text-dark "
                             options={create_possible_list_answers(item.check[0].split("_")[1])}
                             isMultiSelect={true} placeholder="-" onChange={handleOnChangeList} menuSize={10}/>
          ) : null }

          {/*If item answers is list and the answer is Other, put a text*/}
          {isOther ? (
            <input className="form-control w-100 ml-2 mb-0 bg-white" type = "text " aria-label="text input" placeholder="Insérez ici" onChange={handleOnChangeListOther}/>
          ) : null }

        </div>
        ) : <div className="col-sm-6"> {null} </div>}
      </div>

      {/*If item answers must contain date, put a text input*/}
      {item.check.includes("scan") && scan_bookmark  ? (
        <div className={"row m-0 p-0 mt-2 align-items-center justify-content-center col-sm-6 mx-auto"}>
          <QrcodeScanner key={item.id} item_id={item.id} fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} scanValueError={scanValueError} scanValue={scanValue} scan_bookmark={scan_bookmark} is_home={false}/>
        </div>
      ) : null }

      {item.check.includes("signature") ? (
        <div className={"row m-0 p-0 mt-2 align-items-center justify-content-center mx-auto"}>
          <AppSignature sigpad={sigpad} setTrimmedCanvasUrl={setTrimmedCanvasUrl} is_end_sign={false} setResult={setResult} result={result} item={item} forceUpdate={forceUpdate}/>
        </div>
      ) : null }

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
function clean_children_rec(init_item, item, id, isDict, setIsDict, result, pbresult, answers) {
  let is_remove = false
  if(item.cond){
    answers.forEach(function(answer){
      if(item.cond[answer] && item.cond[answer].includes(id)){
        console.log("delete", item)
        utils.list_possible_answer.forEach(function(elm){isDict[elm][item.id]= false})
        delete result[item.id]
        delete pbresult[item.id]
        is_remove = true
      }
    })
  }

  if (item.values && item.values.length){
    item.values.forEach( function (value) {
      clean_children_rec(init_item, value, id, isDict, setIsDict, result, pbresult, answers)
    })
  }
  if (id !== item.id && is_remove) {
        clean_children_rec(init_item, init_item, item.id, isDict, setIsDict, result, pbresult, answers)
  }
}

export {ChecklistItem}