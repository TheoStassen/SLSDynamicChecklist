import React, {useState, useReducer} from "react";
import "./App.css";
import  * as temp_data from "./temporary_data.js";
import * as utils from "./utils.js";
import {AppNavbar} from "./navbar.js";
import {AppSignature} from "./signature.js"
import {CreateBox} from "./creation_box.js"
import {Credits} from "./credits.js"
import {PatientBox} from "./patient_box.js"
import {ChecklistItem} from "./item.js"

/*Main Function
* -Declare all the variables needed in different component
* -Return a combination of different components (Navbar, CreateBox, Credits, PatientBox, ChecklistItem(s), Signature)
* */
export default function App() {

  /*Function needed (for the moment), to force the components to update because they don't*/
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  /*Main state variables :
  * -checklistId : Id of the current checklist
  * -checklistList : List containing the different checklists (from backend, will be a database call)
  * -patientList : List of all the patient (from hospital data, will be a database call)
  * -checklist : current checklist (the one that is shown) (the structure can be seen in temporary_data.js
  * -result : dict containing the results of the current checklist check-in
  * -isPreCheckDone : array containing the id's of the questions for which the precheck as been made
  * */
  let [checklistId, setChecklistId] = useState(0)
  let [checklistList, setChecklistList] = useState(temp_data.checklist_list)
  let [patientList, setPatientList] = useState(temp_data.patients)
  let [currentPatient, setCurrentPatient] = useState(patientList[0])
  let [checklist, setChecklist] = useState(checklistList.filter(e => e.checklist_id === checklistId)[0])
  let [result, setResult] = useState({})
  let [isPreCheckDone, setIsPreCheckDone] = useState([])

  /* Other state variables
  * -creationMode : bool indicates if we are in creation mode
  * -creditMode : bool indicates if we are in credit mode
  * -trimmedCanvasUrl : variable containing the canvas url data of the signature
  * -sigpad : variable containing the signature pad information*/
  let [creationMode, setCreationMode] = useState(0)
  let [creditMode, setCreditMode] = useState(0)
  let [trimmedCanvasUrl, setTrimmedCanvasUrl] = useState(null)
  let sigpad = {}

  /* Initial set of isDict state variable
  * -init_dict : dict containing {0:true} for each possible answer (yes, no, etc), defined in utils.js
  * -isDict : dict containing a dict for each possible response,
  * containing the questions id's that have this response checked at this moment*/
  let init_dict = {}
  utils.list_possible_answer.forEach(function (answer){init_dict[answer]={0:true}})
  const [isDict, setIsDict] = useState(init_dict)


  /* Fill in of numDict, containing all the numerical data (the way current patient info is extracted will be improved)*/
  let num_values = checklist.num_values
  let numDict = {}
  num_values.forEach(function(elm) {numDict[elm.var] = elm.val})
  numDict["yearofbirth"] = currentPatient.yearofbirth
  numDict["gender"] = currentPatient.gender

  let dicts = [isDict, setIsDict, numDict, result, setResult,isPreCheckDone, setIsPreCheckDone ]

  /* Filter (check of the cond's) of the checklist  initial values (i.e. the questions at the first level of the tree)*/
  let values = null
  if (checklist.values)
    values = values_filter_cond(checklist.values, isDict, numDict, creationMode)

  /* Function that changes the current checklist to the checklist with checklist_id and resets dicts*/
  const swapchecklist = (checklist_id) => {
    setChecklistId(checklist_id);
    checklist = checklistList.filter(e => e.checklist_id === checklist_id)[0]
    setChecklist(checklist)
    setResult({})
    setIsDict(init_dict)
    setIsPreCheckDone([])
    return checklist
  }

  /* Return the different components, depending of the mode.
  * We define also the background and a hidden bottom navbar to avoid problems with the background limits
  */
  return (
    <div>
      <div className="bg-color-custom min-vh-100">
        {<AppNavbar props = {{setCreationMode, setCreditMode, trimmedCanvasUrl, result, checklistList, swapchecklist}}/>}
        {!creditMode ? (
          <div>
            {creationMode ?
              <CreateBox props={{checklist, setChecklist, swapchecklist, checklistList, setChecklistList, checklistId, setChecklistId, forceUpdate}} />
              :
              <PatientBox props={{patientList, currentPatient, setCurrentPatient}} />
            }
            {values ? values.map(i => (
              <ChecklistItem init_items={checklist} item={i} dicts={dicts} forceUpdate = {forceUpdate} values_filter_cond={values_filter_cond} creationMode={creationMode} />))
              :
              null
            }
            {!creationMode ? <AppSignature props = {{sigpad, setTrimmedCanvasUrl}}/> : null}
          </div>
          )
          :
          <Credits props={null}/>
        }
      </div>
      <div>
        <nav className="navbar navbar-hidden">
          <a className="navbar-brand" href="#">{null}</a>
        </nav>
      </div>
    </div>
  );
}

/* Filter the values by keeping only the values that validates all conditions
* We check all the response condition of the item
* (for ex, if item.cond contains {"yes": [1,4]}, we check if isDict["yes"] contains 1 and 4 )
* + all num conditions
*/
function values_filter_cond(values, isDict, numDict, creationMode) {
  return values.filter( item=>
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



