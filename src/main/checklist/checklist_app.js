import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom"
import * as calls from "../../calls";
import {useState} from "react";
import {Title} from "./title";
import {AlertsBox} from "./alerts_box";
import {SectionTitle} from "./section_title";
import {ChecklistItem} from "./item";
import {CountingTable} from "./couting_table";
import {ValidationButton} from "./validation_button";
import * as utils from "../../utils/utils";

/*Checklist App Function,
* -Declare all the variables and function specific to checklist route
* -Return the elements that allow the user to fill the checklist :
*  title (checklist infos), alert list, checklist items, validation button */
export default function ChecklistApp({props}) {
  /*Props from App */
  let {checklistList,currentPatient, numDict, checklistId,forceValidationMode,setForceValidationMode,
    alertList,checklistErrorCode,checklist, debugMode, commentMode, forceUpdate,setChecklistList,
    precheckMode,pathId,currentUser} = props

  /*
  * -result (dict) :  results of the current checklist filling
  * -pbresult (dict) : results of the current checklist filling, but only the problematic answers
  * -visibleList (array) : list of the question visible at current time in checklist (not hidden by dynamism)
  * -isPreCheckDone (array) : contains the id's of the questions for which the precheck as been made
  * -warningId (number) : id of the first question not filled when validation button has been pushed
  * */
  let [result, setResult] = useState({})
  let [pbresult, setPbResult] = useState({})
  let [visibleList, setVisibleList] = useState([])
  let [isPreCheckDone, setIsPreCheckDone] = useState([])
  let [warningId, setWarningId] = useState(0)

  /* Initial set of isDict state variable
  * -init_dict : dict containing {0:true} for each possible answer (yes, no, etc), defined in utils.js
  * -isDict : dict containing, for each possible response defined in utils.js,
  * a dict containing the questions id's that have this response checked at this current time, for the current checklist
  * */
  let init_dict = {}
  utils.list_possible_answer.forEach(function (answer){init_dict[answer]={0:true}})
  const [isDict, setIsDict] = useState(init_dict)

  /*Function triggered only when the component is mount */
  useEffect(() => {
    if(!checklist)
      /*If no current checklist, we are not supposed to be here, we go back to login route*/
      navigate("/login")
  }, [])

  /* Create a table containing results, and send it in a post evaluation call with other checklist completion infos
* */
  function import_result () {
    let result_table = []
    for (const [key, value] of Object.entries(result)){
      result_table.push({item_id:key, name:value.name, importance:value.importance,
        answer:JSON.stringify(value.answer), is_pb: !!pbresult[key]})
    }
    /*The checklist evaluation is considered as "blocking" if at least one important question has a problematic answer*/
    let is_blocking = result_table.some(item => {return item.importance === 1 && item.is_pb === true})

    let final_result = {
      checklist_id: checklistId,
      journey_id:pathId,
      user_id:currentUser.id,
      patient_id:currentPatient.id,
      answers : result_table,
      is_blocking : is_blocking}

    calls.postevaluation(final_result)
  }

  /* Filter (check of the cond's) of the checklist root values (i.e. the questions at the first level of the tree)*/
  let values = null
  visibleList = []
  if (checklist && checklist.values) {
    values = values_filter_cond(checklist.values, isDict, numDict)
    values.forEach(value => value.check.length ? visibleList.push(value.id): null)
  }

  /*Check what is the first not filled scan question, to active the scan component for it*/
  let next_scan_item = values ? values.filter(item => !result[item.id] && item.check.includes("scan")) : null
  let next_scan_item_id =  next_scan_item && next_scan_item.length ? next_scan_item[0].id : null

  /*Function used to navigate between routes*/
  let navigate = useNavigate()

  /*Put all the dictionaries used by the checklist item in one variable*/
  let dicts = [isDict, setIsDict, numDict, result, pbresult, setResult, setPbResult, isPreCheckDone, setIsPreCheckDone, visibleList, setVisibleList, debugMode, commentMode ]


  return (
    <div>{checklist ?
      <div id={"title"}>
        <Title checklistList={checklistList}
                              checklistId={checklistId}
                              numDict={numDict}
                              currentPatient={currentPatient}
                              forceValidationMode={forceValidationMode}
                              setForceValidationMode={setForceValidationMode}
                              />
        <div>
          {alertList && Object.values(alertList).length ? <AlertsBox alertList={alertList}/> : null}
        </div>
      <div>
      {/*If checklist type is 0, counting table checklist so no item to show*/}
      {checklist.type !== 0 ?
        <div className={"container p-0 border-bottom border shadow-sm rounded "}>
          {/*Return the different items with section title if needed*/}
          {values ? values.map((i, index) => (
              <div>
                {i.section_title ? <SectionTitle section_title={i.section_title} index={index}/> :
                  <div className={"bg-primary " + (index ? " border-top" : "")}/>}
                <div className=
                       {"pb-3 px-3 pt-3 " +
                         (index === values.length - 1 ? "rounded rounded-0-top " : null) +
                         (index || i.section_title ? "" : " rounded rounded-0-bottom ") +
                         (i.importance ? " iq-bg-danger" : " bg-color-custom")}>
                  <ChecklistItem key={JSON.stringify(checklistId) + i.id} init_items={checklist} item={i}
                                 dicts={dicts}
                                 forceUpdate={forceUpdate} values_filter_cond={values_filter_cond}
                                 creationMode={false}
                                 currentId={null}
                                 warningId={warningId} precheckMode={precheckMode}
                                 is_root={true} alertList={alertList}
                                 scan_bookmark={next_scan_item_id === i.id}
                                 checklist_name = {checklist.name}
                  />
                </div>
              </div>))
            :
            null}
        </div>
        :
        <CountingTable result={result} setResult={setResult}/>
      }</div>

      { checklist ?
        <ValidationButton visibleList={visibleList}
                           result={result}
                           import_result={import_result}
                           setWarningId={setWarningId}
                           forceValidationMode={forceValidationMode}/>
      : null }
    </div>
    : null}</div>
  )
}


/* Filter the values array (containing all the roots question of the checklist)
* by keeping only the values that validates all conditions
* We check all the response condition of the item
* (for ex, if item.cond contains {"yes": [1,4]}, we check if isDict["yes"] contains 1 and 4 )
* + all num conditions check
*/
function values_filter_cond(values, isDict, numDict, debugMode, creationMode=false) {
  return debugMode ? values : values.filter( item=>
      Object.keys(item.cond).every(
        function(answer){
          return (answer === "num" || !item.cond[answer] || item.cond[answer].every(
            function(elm) {return isDict[answer][elm];}
          ))
        }
      )
      && (creationMode || item.cond.num.every(
        function(elm) {
          return !numDict[elm.var] || utils.simple_operation(numDict[elm.var],elm.op, elm.val) }
      ))
  )
}