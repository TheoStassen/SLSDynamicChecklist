import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import "./App.css";
import * as temp_data from "./temporary_data.js";
import * as utils from "./utils.js";
import {AppNavbar} from "./navbar.js";
import {CreateBox} from "./creation_box.js"
import {Credits} from "./credits.js"
import {PatientBox} from "./patient_box.js"
import {ChecklistItem} from "./item.js"
import {SectionTitle} from "./section_title.js";
import {ValidationButton} from "./validation_button";
import {AlertsBox} from "./alerts_box";
import {Title} from "./title";
import {Home} from "./home";
import {CountingTable} from "./couting_table";
import QrcodeScanner from "./qrcodescanner";
import {UserBox} from "./user_box";
import {AppSidebar} from "./sidebar";

/*Main Function
* -Declare all the variables needed in different component
* -Return the skeleton of the application
* (Navbar, UserBox, PatientBox, Home, Title, ChecklistItem(s), CreateBox, Credits, Scanners)
* */

export default function App() {

  /******* Variables declaration and initialization ********/

  const is_local = true

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
    console.log("enter")
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
    console.log(currentPatient)
    numDict["age"] = utils.date_to_age(numDict["dateofbirth"])
  }

  /* Initialization function, activated only when the App component is created, at site opening,
  * -> Get the different lists needed at start (users, patients)
  * */
  useEffect(() => {
    onNewScanResult = onNewScanResult.bind(this);


    /*Get user list from database*/
    // axios.get('http://checklists.metoui.be/api/users')
    axios.get('#') //Random url, just to simulate the fact that we need to make get call before set checklistList
      .then(function(response){

        //Must handle incoming data
        console.log("user list call response", response)
        console.log("user list call temp", temp_data.user_list)
        const user_list = temp_data.user_list// temporary
        setUserList(user_list);
        console.log("initial get user list call and set finished")
      });

    /*Get patient list from database*/
    axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/patients')
    // axios.get('#') //Random url, just to simulate the fact that we need to make get call before set checklistList
      .then(function(response){

        //Must handle incoming data
        console.log("patient call response", response.data)
        console.log("patient call temp", temp_data.patient_list)

        // const patient_list = temp_data.patient_list // temporary
        const patient_list = is_local ? temp_data.patient_list : response.data

        setPatientList(patient_list);
        console.log("initial get patient list call and set finished")
      });
  }, [])

  useEffect(() => {
    if (userCode && !currentUser){
      const current_users = userList.filter(elm => elm.user_code === userCode)

      if (current_users.length){
        setCurrentUser(userList ? current_users[0]: {"id":0, user_code:"1234567", lastname: "Jonas", firstname: "Michel", role: "Assistant Anést." })
      }
      else{
        setScanValueError(userCode)
        setUserCode(null)
      }
    }
  })


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

    // Get the checklist from database
    axios.get(is_local ? "#" : "http://checklists.metoui.be/api/checklists/"+checklist_id) //Random url, just to simulate the fact that we need to make get call before set checklistList
      .then(function(response){

      // console.log("checklist swap call response", response ? response.data.data.items: null)
      // console.log("checklist swap call response", response.data.data.items)
      console.log("checklist swap call temp", temp_data.checklist_arrays[checklist_id-1])

      const current_creation_mode = creationMode // we use this variable to reset the creation mode after switching
      let checklist_array = is_local ? temp_data.checklist_arrays[checklist_id-1] : response.data.data.items
      // let checklist_array = response.data.data.items

      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)
      checklist.name = checklistList.filter(elm => elm.checklist_id === checklist_id)[0].name
      checklist.person = checklistList.filter(elm => elm.checklist_id === checklist_id)[0].person
      checklist.counter = checklistList.filter(elm => elm.checklist_id === checklist_id)[0].counter
      setChecklist(checklist)

      /**** Alert gestion section, will be replaced by a get call when the db will handle alert gestion*/

      // Filter alert list to keep only alerts of checklist that precede the current checklist
      let alert_list =  Object.keys(alertList).reduce(function (filtered, key ) {
        if (alertList[key].checklist_id < checklist_id) filtered[key] = alertList[key]
        return filtered
      }, {});

      // Update the gravity of the alerts (if there was an problematic response on a certain question and not anymore)
      Object.keys(alert_list).forEach((key, index) => {
        const corresponding_questions = checklist_array.filter(elm => elm[1].includes(key))
        alert_list[key].question_id = corresponding_questions.length ? corresponding_questions[0][0] : -1
        if (!Object.values(pbresult).filter(elm => elm.name === key).length && Object.values(result).filter(elm => elm.name === key).length){
          alert_list[key].gravity = 1
        }
      })

      //  Add new alerts corresponding ti the checklist we are about to left
      if (checklist_id >= checklistId) Object.keys(pbresult).forEach((key, index) => {
        const name = pbresult[key].name
        const corresponding_questions = checklist_array.filter(elm => elm[1].includes(name))
        console.log(checklist)
        alert_list[name] =
          {
            "id": index, "question_id": corresponding_questions.length ? corresponding_questions[0][0] : -1,
            "checklist_id" : checklistId, "checklist_name" : pbresult[key].checklist_name, "name": name,
            "answer" : (utils.list_possible_answer_trad[pbresult[key].answer] ? utils.list_possible_answer_trad[pbresult[key].answer] : pbresult[key].answer),
            "gravity": 0
          }
      })
      setAlertList(alert_list)


      // const alert_list = []
      // axios.get('http://checklists.metoui.be/api/alerts/'+pathId) //Random url, just to simulate the fact that we need to make get call before set checklistList
      //   .then(function(response){
      //
      //     console.log("get alerts response", response)
      //
      //     const alert_checklists = response.checklists
      //     alert_checklists.forEach(checklist =>
      //       checklist.items.forEach(item =>
      //         alert_list.push({
      //           "question_id": item.item_id,
      //           "checklist_id" : checklist.checklist_id,
      //           "checklist_name" : checklist.checklist_title,
      //           "name": item.item_title,
      //           "answer" : item.answer,
      //           "gravity": item.gravity
      //         })
      //       )
      //     )
      //     setAlertList(alert_list)
      //   })

      // Now that checklist has been selected, we set variables related to checklist to default value

      setCreationMode(false)
      setChecklistId(checklist_id);
      setCurrentQuestion(checklist && checklist.values.length ? checklist.values[0] : null)
      setCreationMode(current_creation_mode)
      setHomeMode(false)
      reset()

      console.log("switch checklist get call and set finished")
    })

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
      result_table.push({item_id:key, name:value.name, answer:value.answer, is_pb: !!pbresult[key]})
    }
    let final_result = {checklist_id: checklistId, journey_id:pathId, user_id:currentUser.id, patient_id:currentPatient.id, answers : result_table}
    axios.post(is_local ? '#' : 'http://checklists.metoui.be/api/evaluations', final_result  )
      .then(function (response){
        console.log("evalutiaon post response", response)
        let csvGenerator = new utils.CsvGenerator(result_table_csv, 'my_csv.csv');
        csvGenerator.download(true);
      })

  }

  /* Function that switch current patient the patient with id
  * */
  function switchPatient (id) {
    axios.get(is_local ? '#': 'http://checklists.metoui.be/api/patients/'+id)
      .then(function(response) {
        console.log("get patient at id response", response.data)
        console.log("get patient at id temp", temp_data.patients[id])
        let corresp_patients = is_local ? temp_data.patients[id] : response.data // temporary
        // let corresp_patients = response.data
        setCurrentPatient(corresp_patients ? corresp_patients : null)
        setScanValueError(null)
      })
  }

  /* Function triggered after the scan of a user/patient code
  * */
  function onNewScanResult(decodedText) {
    console.log(decodedText, scanValue)
    if (!userCode){
      setUserCode(decodedText)
    }
    else{
      if(!scanValue && decodedText) {
        console.log("write decoded scan", decodedText)

        if (currentPatient.patient_code === decodedText) {
          // First call to ask the journey id corrsesponding to the last journey of the current patient
          axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/journeys?patient_id='+currentPatient.id) //Random url, just to simulate the fact that we need to make get call before set checklistList
            .then(function (response) {

              console.log("get journey id for the patient id temp", temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id)
              const path_id = is_local ? temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id : response.data.data[0].id
              setPathId(path_id)

              // Second call to get the different information, especially the list of checklist, corresponding to the journey
              axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/journeys/'+path_id)
                .then(function (response) {
                  console.log("get journey corresponding to journey id response", response.data.checklists)
                  console.log("get journey corresponding to journey id temp", temp_data.paths[path_id].checklists)
                  let checklist_list = is_local ? temp_data.paths[path_id].checklists : response.data.checklists
                  if (checklist_list && checklist_list.length) {
                    setChecklistList(checklist_list)
                  }
                })
            })
        } else {
          setChecklistList([{}])
          setScanValueError(decodedText)
          setChecklistList([])
        }
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
  */
  return (
    <div>
      <AppSidebar/>
      <div className="min-vh-100 content-page iq-bg-info">
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
            setCurrentUser
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
                  reset
                }} />
                : null}
              <div>{homeMode ?
                <div>{!(checklistList && checklistList.length)  ?
                  <div>{!currentUser ?
                      <div>
                        <UserBox props={{onNewScanResult}} />
                        <div className={"container p-2"}>
                          <QrcodeScanner fps={10}
                                         qrbox={250}
                                         disableFlip={false}
                                         qrCodeSuccessCallback={onNewScanResult}
                                         scanValueError={scanValueError}
                                         scanValue={null}
                                         is_home={true}/>
                        </div>
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
                          switchUser: switchPatient,
                          setChecklistList,
                          setPathId,
                          onNewScanResult,
                          is_local,
                          numDict
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
                    {checklist.counter === false ?
                      <div className={"container p-0 border-bottom border border-dark  shadow rounded "}>
                        {values ? values.map((i, index) => (
                            <div>
                              {i.section_title ? <SectionTitle section_title={i.section_title} index={index}/> :
                                <div className={"bg-primary " + (index ? "border-dark border-top" : "")}/>}
                              <div
                                className=
                                  {"pb-3 px-3 pt-3 " +
                                  (index === values.length - 1 ? "rounded rounded-0-top " : null) +
                                  (index || i.section_title ? "" : " rounded rounded-0-bottom ") +
                                  (i.importance ? "iq-bg-danger" : "iq-bg-info")}>
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
    </div>

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



