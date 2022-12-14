import * as utils from "../../utils/utils";
import  * as temp_data from "../../utils/temporary_data.js";
import React, {useState, useEffect} from "react";
import BootstrapSelect from "react-bootstrap-select-dropdown";
import QrcodeScanner from "../qrcodescanner";
import axios from "axios";
import {AppSignature} from "./signature";

/* Component containing a checklist item (a question), which contains recursively it child items.
* */
function ChecklistItem({init_items, item, dicts, forceUpdate, values_filter_cond , creationMode, currentId, warningId, precheckMode, is_root, alertList, scan_bookmark, checklist_name}) {
  /*Get all the dictionaries used by the checklist item from dicts variable*/
  let [isDict, setIsDict, numDict, result, pbresult, setResult, setPbResult, isPreCheckDone, setIsPreCheckDone, visibleList, setVisibleList, debugMode, commentMode] = dicts

  /* State variables used in checklist item component only
  * -isOther : indicates if the user has choose the 'other' choice in a list
  * -trimmedCanvasUrl : canvas used by the signature component
  * -sigpad : sigpad variable used by the signature component
  * -scanValue : current value scanned by the scan answer
  * */
  let [isOther, setIsOther] = useState(false)
  let [trimmedCanvasUrl, setTrimmedCanvasUrl] = useState(null)
  let sigpad = {}
  let [scanValue, setScanValue] = useState(null)

  /*Function triggered every time a state variable change */
  useEffect(() => {
    /*If we have a scan answer, check if scan value, and update the result*/
    if (item.check.includes("scan") && scan_bookmark && scanValue && !result[item.id]){
      const current_result = result
      current_result[item.id] = {name: item.name, answer: scanValue}
      setResult(current_result)
    }
  })

  /* Function triggered when the user click on one answer, we update the isDict and results
    and clean (i.e.remove from isDict and results) questions that must not be visible anymore, because of there cond's */
  const handleOnChangeIs = (answer) => {
    const is_check = !isDict[answer][item.id]
    const list_other_answer = utils.list_possible_answer.filter(elm => elm !== answer)

    // If is_check = true, it means that the state of the answer uncheck -> check,
    // so we add in result and clean questions that depends of this item being with another answer (as it is not the case anymore)
    if (is_check){
      result[item.id]={name:item.name, importance:item.importance, answer:answer}
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
    isDict[answer][item.id] = is_check //Add true in isDict for the selected answer if is check true
    list_other_answer.forEach(function(elm){isDict[elm][item.id]= false}) // Remove anyway the non selected answers)
    setIsDict(isDict)
  }

  /*Function triggered where the user enter a text in a text question. We update the result*/
  const handleOnChangeText = (event) => {
    const input_text = event.target.value;
    result[item.id]={name:item.name, importance:item.importance, answer:input_text,checklist_name:checklist_name}
    setResult(result)
    if (item.color[0] === 1){
      pbresult[item.id] = {name:item.name,answer:input_text}
      setPbResult(pbresult)
    }
  };

  /*Function triggered where the user enter the text (per default) in a text question. We update the result*/
  const handleOnChangedDefaultText = (event) => {
    const input_text = event;
    result[item.id]={name:item.name, importance:item.importance, answer:input_text,checklist_name:checklist_name}
    setResult(result)
    if (item.color[0] === 1){
      pbresult[item.id] = {name:item.name,answer:input_text}
      setPbResult(pbresult)
    }
    return input_text
  };

  /*Function triggered when the answer must be the current date. We update the result*/
  const handleOnChangeCurrentDate = () => {
    let current_date = new Date()
    let current_date_str = current_date.toISOString().split("T")[0]
    result[item.id]={name:item.name, importance:item.importance,  answer:current_date_str,checklist_name:checklist_name}
    setResult(result)
    return current_date_str
  }

  /*Function triggered where the user enter a time answer. We update the result*/
  const handleOnChangeCurrentTime = () => {
    let current_date = new Date()
    let current_time_str = current_date.toTimeString().split(" ")[0].substring(0,5)
    result[item.id]={name:item.name, importance:item.importance,  answer:current_time_str,checklist_name:checklist_name}
    setResult(result)
    return current_time_str
  }

  /*Function triggered where the user enter a list options answer. We update the result*/
  const handleOnChangeList = (selectedOptions) => {
    const input_answer = JSON.parse(JSON.stringify(selectedOptions.selectedValue));
    if (selectedOptions.selectedKey.includes("other")) {
      setIsOther(true)
    } else{
      setIsOther(false)
    }
    result[item.id]={name:item.name, importance:item.importance, answer:input_answer}
    setResult(result)
    /*If color of item is red, add by default the answer in pb results */
    if (item.color[0] === 1 && !(selectedOptions.selectedKey.includes("Aucune") || selectedOptions.selectedKey.includes("Aucun") )){
      pbresult[item.id] = {name:item.name,answer:input_answer,checklist_name:checklist_name}
      setPbResult(pbresult)
    }
    else{
      delete pbresult[item.id]
      setPbResult(pbresult)
    }
  };

  /*Function triggered where the user enter a text answer when we are in other mode. We update the result*/
  const handleOnChangeListOther = (event) => {
    const input_text = event.target.value;
    let input_answer = result[item.id].answer
    if (isOther) input_answer.pop() // With the first letter typed, remove the "other" field / when you continue to type, remove the previous word and add the new
    input_answer.push(input_text)
    result[item.id]={name:item.name, importance:item.importance, answer:input_answer}
    setResult(result)
  };

  /*Construct in the good format the list of possible answers*/
  const create_possible_list_answers = (name) => {
    const list_answers = temp_data.lists[name]
    const list_possible_answers = []
    list_answers.forEach(function(answer){
      list_possible_answers.push({
        "labelKey": answer,
        "value": answer,
      })
    })
    list_possible_answers.push({"labelKey": "other", "value": "Autre"})
    return list_possible_answers
  }

  /* If the item as pre check conditions and his precheck as not already been made,
  * we check the condition in 'pre_check.if' and if it passes, we do as if the 'pre_check.then' answer was clicked */
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

  /*We create the children elements of the current item*/
  if (values && values.length) {
    children = (
      <ul className="mb-0">
        {values.map((i, index) => (
          <ChecklistItem  key={index} init_items={init_items} item={i} dicts={dicts} forceUpdate = {forceUpdate} values_filter_cond={values_filter_cond} creationMode={creationMode} currentId={currentId} warningId={warningId} is_root={false} alertList={alertList} scan_bookmark={scan_bookmark} checklist_name={checklist_name} />
        ))}
      </ul>
    );
  }

  /*Function triggered when the scanner return a decoded text*/
  function onNewScanResult(decodedText, decodedResult) {
    if(decodedText) {
      setScanValue(decodedText)
    }
  }

  return (
    <div className={"container p-0 mx-auto " + (is_root ? "":"mt-3") }>
      {/*Inform that the user tried to validate the checklist but this question was not answered*/}
      {warningId === item.id ? (
        <div className=" alert text-white bg-warning rounded" role="alert">
          <div className="iq-alert-icon">
            <i className="ri-alert-fill"/>
          </div>
          <div className="iq-alert-text">Vous n'avez pas répondu à cette question</div>
        </div>
      ):null}

      <div id={"question"+item.id} className={"row align-items-center m-0 p-0" + (creationMode && currentId === item.id ? " border border-danger " : " " )}>

        <div className="col list-group list-group-horizontal m-0 p-0 w-auto">

          {/*Item Id*/}
          <div className={"list-group-item m-0 p-0 text-center shadow-sm my-auto " + (item.importance || alertList && Object.values(alertList).some(elm => elm.name === item.name) ? "bg-danger" : "bg-primary")} >
            <h5 className="card-body p-auto text-white">
              {item.id}
            </h5>
          </div>

          {/*Item name*/}
          <div className="list-group-item m-0 p-0 w-100 shadow-sm h-auto text-dark bg- "  >
            {/*item comment show (depends of the comment containing and if need to includ consent file*/}
            {item.comment && commentMode && (item.comment.split("_").length === 1 || item.comment.split("_").length > 1 && numDict[item.comment.split("_")[1]]) ? (
              <div className="row alert iq-bg-secondary px-0 m-0 mt-0 border-0 text-primary my-auto text-center align-content-center" role="alert">
                {item.comment.split("_").length > 1 ?
                  <p className={"w-100 m-0"}>{item.comment.split("_")[0] + numDict[item.comment.split("_")[1]]}</p>
                  :
                  <p className={"w-100 m-0"}>{item.comment}</p>
                }
                {item.comment.includes("Consentement") ?
                  <div className={"text-center mx-auto"}>
                    <button className="btn m-0 p-0 mx-auto " type="button" data-toggle="collapse" data-target="#collapseconsentpdf"
                            aria-expanded="false" aria-controls="collapseExample">
                      <div data-icon="T" className="icon"></div>
                    </button>
                    <div className="collapse m-0 p-0" id="collapseconsentpdf">
                      <p className={"col-sm-12 mx-0 px-0 mb-0"}> <img src={"http://checklists.metoui.be/storage/" + numDict.consent_pdf} width={"280"}/> </p> {/*//TODO : put the good url*/}
                    </div>
                  </div>
                  : null}
              </div>
            ) : null}
            {/*Item name*/}
            <div className="card-body my-auto">
              {item.name.split("_")[0]}
            </div>
          </div>
        </div>

        {/*Item answers (if any, if not : empty col)*/}
        {item.check.length ? (
        <div className="col-sm-auto p-0 pl-3">
          <div className={"row px-3"}>
            {/*three first checkbox item (splitted from other to ease the small screen visibility*/}
            <div className="list-group list-group-horizontal ">
              {/*Put a checkbox for each check answer*/}
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
            {/*all the next checkbox item*/}
            <div className="list-group list-group-horizontal ">
              {/*Put a checkbox for each check answer*/}
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

          {/*If item answers contain text, put a text input*/}
          {item.check.includes("text") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "text " aria-label="text input" placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers contain date, put a date input*/}
          {item.check.includes("date") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "date" aria-label="text input" defaultValue={handleOnChangeCurrentDate()} placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers contain hour, put a time input*/}
          {item.check.includes("hour") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "time" aria-label="text input" defaultValue={handleOnChangeCurrentTime()} placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers contain number, put a number input*/}
          {item.check.includes("number") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "number" aria-label="text input" defaultValue={handleOnChangedDefaultText("0")} placeholder="Insérez ici" onChange={handleOnChangeText}/>
          ) : null }

          {/*If item answers contain list, put a list dropdown input*/}
          {item.check[0].split("_").includes("list") ? (
            <BootstrapSelect key={item.check[0].split("_")[1]} className=" my-auto "
                             selectStyle ="py-2  btn btn-outline-dark bg-white text-dark "
                             options={create_possible_list_answers(item.check[0].split("_")[1])}
                             isMultiSelect={true} placeholder="-" onChange={handleOnChangeList} menuSize={10}/>
          ) : null }

          {/*If item answers is list and the answer is Other, put a text input in addition*/}
          {isOther || item.check.includes("list_problems") ? (
            <input className="form-control w-100 mb-0 bg-white" type = "text " aria-label="text input" placeholder={isOther ? "Insérez ici" : "Décrivez"} onChange={handleOnChangeListOther}/>
          ) : null }

        </div>
        ) : <div className="col-sm-6"> {null} </div>}
      </div>

      {/*If item answers contain scan, put a scan component*/}
      {item.check.includes("scan") ? (

        <div className={"row m-0 p-0 mt-2 align-items-center justify-content-center col-sm-6 mx-auto"}>
          {scan_bookmark && !scanValue ?
            <QrcodeScanner key={item.id} item_id={item.id} fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} scanValue={scanValue} scan_bookmark={scan_bookmark} is_home={false}/>
            : null}
          {scanValue !== null ?
            <div className={"container custom-scanner card rounded bg-white border-success mx-auto text-center mt-2 p-2 border  justify-content-center "}>
              <div className="card-body m-0 p-0">
                <h5 className="card-title text-dark m-0">Code "{scanValue}" enregistré</h5>
              </div>
            </div>
            : null}
        </div>
      ) : null }

      {/*If item answers contain signature, put a signature component*/}
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
  * (id indicating what question has been removed, and answers indicating all the answers that are not checked now (so possibly removed),
  * so we need to check if the current item was dependent of one of these answers,
  * -We call the function recursively on each child of the current item, for the same "target" id
  * - If the current item as been removed, we call recursively, but considering the current item id as the new "target"
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