import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import "./styles/App.css";
import * as temp_data from "./utils/temporary_data.js";
import * as utils from "./utils/utils.js";
import {AppNavbar} from "./components/navbar.js";
import {CreateBox} from "./components/creation_box.js"
import {Credits} from "./components/credits.js"
import {PatientBox} from "./components/patient_box.js"
import {ChecklistItem} from "./components/item.js"
import {SectionTitle} from "./components/section_title.js";
import {ValidationButton} from "./components/validation_button";
import {AlertsBox} from "./components/alerts_box";
import {Title} from "./components/title";
import {Home} from "./components/home";
import * as calls from "./calls";
import {CountingTable} from "./components/couting_table";
import QrcodeScanner from "./components/qrcodescanner";
import {UserBox} from "./components/user_box";

/*Main Function
* -Declare all the variables needed in different component
* -Return the skeleton of the application
* (Navbar, UserBox, PatientBox, Home, Title, ChecklistItem(s), CreateBox, Credits, Scanners)
* */

export default function App() {

  /******* Variables declaration and initialization ********/

  const is_local = false

  /*Function needed (at the moment), to force the components to update when needed*/
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  /*Main state variables :
  * -userList : List of all the users
  * -userCode : code of the current user
  * -currentUser : current user
  * -patientList : List of all the patient
  * -currentPatient : current patient
  * -checklistId : Id of the current checklist
  * -pathId : Id of the current patient path (also named journey)
  * -checklistList : List containing the different checklists of the current patient path
  * -checklist : current checklist (the one that is shown)
  * -currentQuestion : current question selected in creation mode
  * -result : dict containing the results of the current checklist filling
  * -pbresult : dict containing the results of the current checklist filling, but only the problematic one's
  * -isPreCheckDone : array containing the id's of the questions for which the precheck as been made
  * -warningId : id of the first question of the current checklist not filled after validation button has been pushed
  * */
  let [loginInfo, setLoginInfo] = useState({username : "user1", password : "password1"})
  let [isLogin, setIsLogin] = useState(false)
  let [userList, setUserList ] = useState(null)
  let [userCode, setUserCode] = useState(null)
  let [currentUser, setCurrentUser] = useState(null)
  let [patientList, setPatientList ] = useState(null)
  let [currentPatient, setCurrentPatient] = useState(null)
  let [checklistId, setChecklistId] = useState(-1)
  let [pathId, setPathId] = useState(-1)
  let [checklistList, setChecklistList] = useState(null)
  let [checklist, setChecklist] = useState(null)
  let [currentQuestion, setCurrentQuestion] = useState(null)
  let [alertList,setAlertList] = useState({})
  let [result, setResult] = useState({})
  let [pbresult, setPbResult] = useState({})
  let [visibleList, setVisibleList] = useState([])
  let [isPreCheckDone, setIsPreCheckDone] = useState([])
  let [warningId, setWarningId] = useState(0)


  /* Mode state variables
  * -homeMode : mode where we show the home component
  * -creationMode : mode where we show the creation box component
  * -creditMode : mode where we show the site credits
  * -commentMode : mode where the question's comments are shown and not hidden
  * -debugMode : mode where the question's dynamism is desactivated, all the checklist question's are shown7
  * -forceValidationMode : mode where the user can validate a checklist without filling all questions
  * -precheckMode : mode where the system of question precheck is active
  * */
  let [homeMode, setHomeMode] = useState(true)
  let [creationMode, setCreationMode] = useState(false)
  let [creditMode, setCreditMode] = useState(false)
  let [commentMode, setCommentMode] = useState(true)
  let [debugMode, setDebugMode] = useState(false)
  let [forceValidationMode, setForceValidationMode] = useState(false)
  let [precheckMode, setPrecheckMode] = useState(true)
  let [userValidated, setUserValidated] = useState(false)

  /* Signature component variables
  * -trimmedCanvasUrl : variable containing the canvas url data of the signature
  * */
  let [trimmedCanvasUrl, setTrimmedCanvasUrl] = useState(null)

  /* Scanner component variables
  * -scanValue : string value of the codebar scanned,
  * -scanValueError : string value of the codebar scanned, if it is not correct
  * */
  let [scanValue, setScanValue] = useState(null)
  let [scanValueError, setScanValueError] = useState(null)


  /* Initial set of isDict state variable
  * -init_dict : dict containing {0:true} for each possible answer (yes, no, etc), defined in utils.js
  * -isDict : dict containing, for each possible response defined in utils.js,
  * a dict containing the questions id's that have this response checked at this current time, for the current checklist
  * */
  let init_dict = {}
  utils.list_possible_answer.forEach(function (answer){init_dict[answer]={0:true}})
  const [isDict, setIsDict] = useState(init_dict)

  /*
  Fill in of numDict, containing all the numerical data, extracted from the currentPatient variable, and computation of
  the age variable from date of birth
  * */
  let numDict = {}
  if (currentPatient){
    for (const [key, value] of Object.entries(currentPatient)) {
      if (typeof value === "object"){
        for (const [key_, value_] of Object.entries(value)){
          numDict[key_] = value_
        }
      }
      else{
        numDict[key] = value
      }
    }
    numDict["age"] = utils.date_to_age(numDict["dateofbirth"])
  }


  /* Initialization function, activated only when the App component is created, at site opening,
  * -> Get the different lists needed at start (users, patients)
  * */
  useEffect(() => {
    onNewScanResult = onNewScanResult.bind(this);

    calls.postconnection(is_local,loginInfo,setLoginInfo, setIsLogin)
  }, [])


  /******* Main functions declaration ********/

  /* Reset the state variables who are dependent of the current checklist
  * */
  function reset (){
    setWarningId(0)
    setResult({})
    setPbResult({})
    let init_dict_ = {}
    utils.list_possible_answer.forEach(function (answer){init_dict_[answer]={0:true}})
    setIsDict(init_dict_)
    setIsPreCheckDone([])
  }

  /* Function that swap the current checklist to the checklist with checklist_id and resets
  * state variables that depends of the current checklist
  * */
  const swapchecklist = (checklist_id) => {

    calls.getchecklist(is_local, checklist_id, creationMode, checklist, setChecklist, checklistList, alertList, setAlertList, pbresult, result, checklistId, setCreationMode, setChecklistId, setCurrentQuestion, setHomeMode, reset )
    return checklist
  }

  /* Create a table containing results, to be exportable as csv file or in a post call with other information
  * identiying the checklist completion
  * */
  function import_result () {
    let result_table_csv = [["id", "name", "answer", "is_problematic"]]
    for (const [key, value] of Object.entries(result)){
      result_table_csv.push([key, value.name, value.answer, pbresult[key] ? "yes" : "no"])
    }
    let result_table = []
    for (const [key, value] of Object.entries(result)){
      result_table.push({item_id:key, name:value.name, answer:JSON.stringify(value.answer), is_pb: !!pbresult[key]})
    }
    let final_result = {checklist_id: checklistId, journey_id:pathId, user_id:currentUser.id, patient_id:currentPatient.id, answers : result_table}

    calls.postevaluation(is_local,final_result)
    let csvGenerator = new utils.CsvGenerator(result_table_csv, 'my_csv.csv');
    csvGenerator.download(true);

  }

  /* Function that switch current patient the patient with id
  * */
  function switchPatient (id) {
    calls.getpatient(is_local,id,setCurrentPatient,setScanValueError)
  }

  /* Function that switch current user to the user with id
* */
  function switchUser (id) {
    calls.getuser(is_local, id, setCurrentUser, setScanValueError)
  }

  /* Function triggered after the scan of a user/patient code
  * */
  function onNewScanResult(decodedText) {
    console.log(decodedText, scanValue)
    if (!userValidated){
      if (currentUser.user_code === decodedText){
        setUserValidated(true)
      } else{
        setScanValueError(decodedText)
      }
    }
    else{
      if (currentPatient.patient_code === decodedText) {
        calls.getjourney(is_local, currentPatient, setPathId,setChecklistList)
      } else {
        setChecklistList([{}])
        setScanValueError(decodedText)
        setChecklistList([])
      }
    }
  }


  /******* Variables preparation for the question item recursive first call ********/


  /* Filter (check of the cond's) of the checklist  initial values (i.e. the questions at the first level of the tree)*/
  let values = null
  visibleList = []
  if (checklist && checklist.values) {
    values = values_filter_cond(checklist.values, isDict, numDict, creationMode)
    values.forEach(value => value.check.length ? visibleList.push(value.id): null)
  }

  let dicts = [isDict, setIsDict, numDict, result, pbresult, setResult, setPbResult, isPreCheckDone, setIsPreCheckDone, visibleList, setVisibleList, debugMode, commentMode ]

  let next_scan_item = values ? values.filter(item => !result[item.id] && item.check.includes("scan")) : null
  let next_scan_item_id =  next_scan_item && next_scan_item.length ? next_scan_item[0].id : null


  /******* Main return call ********/

  console.log(currentUser)
  console.log(numDict)

  /* Return the different components.
  * We define also the background and a hidden bottom navbar to avoid problems with the background vertical limits
  * Content (in term of components) :
  * - Navbar
  * ~ Credits (if credit mode)
  * ~ Main page :
  *   ~ Creation box (if create mode)
  *   ~ Menu sections (if home mode) :
  *     ~ User / Patient selection (if no checklist list already set) :
  *       ~ User selection and scanner (if no user already set)
  *       ~ Patient selection (if user already set) :
  *         ~ Patient scanner (if patient selected)
  *     ~ Home section, showing the list of checklists (if checklist list already set)
  *   ~ Main Checklist section (if not home mode) :
  *     ~ Title section, presenting checklist (if not create mode)
  *     ~ Alert section (if not create mode)
  *     ~ Checklist content section (if checklist variable set) :
  *       ~ Normal Checklist (if checklist.counter false)
  *         - Checklist Items
  *       ~ Counter Checklist (if checklist.counter true)
  *     ~ Validation section (if not create mode)
  */
  return (
    <div>{isLogin ? (<div>
      <div className="min-vh-100 content-page bg-color-custom">
        <div>
          {<AppNavbar props = {{
            creationMode,
            setCreationMode,
            creditMode,
            setCreditMode,
            setCommentMode,
            commentMode,
            setDebugMode,
            debugMode,
            trimmedCanvasUrl,
            checklistList,
            swapchecklist,
            reset,
            forceUpdate,
            import_result,
            result,
            setCurrentQuestion,
            checklist,
            homeMode,
            setHomeMode,
            setChecklistList,
            setScanValue,
            setCurrentPatient,
            setUserCode,
            setScanValueError,
            setCurrentUser,
            setUserValidated
          }}/>}
          {creditMode ?
            <Credits props={null}/>
            :
            <div>
              {creationMode ?
                <CreateBox props={{
                  checklist,
                  setChecklist,
                  checklistList,
                  setChecklistList,
                  checklistId,
                  setChecklistId,
                  forceUpdate,
                  currentQuestion,
                  setCurrentQuestion,
                  reset,
                  is_local
                }} />
                : null}
              <div>{homeMode ?
                <div>{!(checklistList && checklistList.length)  ?
                  <div>{!userValidated ?
                      <div>
                        <UserBox props={{
                          userList,
                          onNewScanResult,
                          switchUser,
                          currentUser,
                          is_local,
                          setUserList
                        }} />
                        {currentUser ?
                          <div key={currentUser.id} className={"container p-2"}>
                            <QrcodeScanner fps={10}
                                           qrbox={250}
                                           disableFlip={false}
                                           qrCodeSuccessCallback={onNewScanResult}
                                           scanValueError={scanValueError}
                                           scanValue={null}
                                           is_home={true}/>
                          </div> : null}
                      </div>
                      :
                      <div>
                        <PatientBox props={{
                          currentPatient,
                          setCurrentPatient,
                          setIsDict,
                          setResult,
                          setIsPreCheckDone,
                          forceUpdate,
                          patientList,
                          switchPatient: switchPatient,
                          setChecklistList,
                          setPathId,
                          onNewScanResult,
                          is_local,
                          numDict,
                          setPatientList
                        }} />
                        {currentPatient ?
                          <div key={currentPatient.id} className={"container p-2"}>
                            <QrcodeScanner fps={10}
                                           qrbox={250}
                                           disableFlip={false}
                                           qrCodeSuccessCallback={onNewScanResult}
                                           scanValueError={scanValueError}
                                           scanValue={null}
                                           is_home={true}/>
                          </div> : null}
                      </div>
                  }</div>
                  :
                  <Home checklistList={checklistList}
                        swapchecklist={swapchecklist}
                        scanValue={scanValue}
                        currentPatient={currentPatient}
                        is_local={is_local}/>
                }</div>
                :
                <div id={"title"}>
                  {!creationMode ? <Title checklistList={checklistList}
                                          checklistId={checklistId}
                                          numDict={numDict}
                                          currentPatient={currentPatient}
                                          forceValidationMode={forceValidationMode}
                                          setForceValidationMode={setForceValidationMode}
                                          is_local={is_local}/> : null}
                  {!creationMode ? <div>
                      {alertList && Object.values(alertList).length ? <AlertsBox alertList={alertList}/> : null}
                  </div> : null}

                  {checklist ? <div>
                    {false === false ?
                      <div className={"container p-0 border-bottom border shadow-sm rounded "}>
                        {values ? values.map((i, index) => (
                            <div>
                              {i.section_title ? <SectionTitle section_title={i.section_title} index={index}/> :
                                <div className={"bg-primary " + (index ? " border-top" : "")}/>}
                              <div
                                className=
                                  {"pb-3 px-3 pt-3 " +
                                  (index === values.length - 1 ? "rounded rounded-0-top " : null) +
                                  (index || i.section_title ? "" : " rounded rounded-0-bottom ") +
                                  (i.importance ? " iq-bg-danger" : " bg-color-custom")}>
                                <ChecklistItem key={JSON.stringify(checklistId) + i.id} init_items={checklist} item={i}
                                               dicts={dicts}
                                               forceUpdate={forceUpdate} values_filter_cond={values_filter_cond}
                                               creationMode={creationMode}
                                               currentId={currentQuestion ? currentQuestion.id : null}
                                               warningId={warningId} precheckMode={precheckMode}
                                               is_root={true} alertList={alertList}
                                               scan_bookmark={next_scan_item_id === i.id}
                                               checklist_name = {checklist.name}
                                               is_local = {is_local}
                                />
                              </div>
                            </div>))
                          :
                          null}
                      </div>
                      :
                      <CountingTable result={result} setResult={setResult}/>
                    }</div> : null }

                  {!creationMode ? <ValidationButton visibleList={visibleList}
                                                     result={result}
                                                     import_result={import_result}
                                                     checklist={checklist}
                                                     setWarningId={setWarningId}
                                                     checklistList={checklistList}
                                                     setChecklistList={setChecklistList}
                                                     checklistId={checklistId}
                                                     forceValidationMode={forceValidationMode}/>   : null }
                </div>
              }</div>
            </div>
          }
        </div>

        <div>
          <nav className="navbar">
            <label className="navbar-brand">{null}</label>
          </nav>
        </div>
      </div>
    </div>) : null} </div>
  );
}

/* Filter the values array (containing all the roots question of the checklist)
* by keeping only the values that validates all conditions
* We check all the response condition of the item
* (for ex, if item.cond contains {"yes": [1,4]}, we check if isDict["yes"] contains 1 and 4 )
* + all num conditions check
*/
function values_filter_cond(values, isDict, numDict, creationMode, debugMode) {

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



