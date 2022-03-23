import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import "./App.css";
import * as temp_data from "./temporary_data.js";
import * as utils from "./utils.js";
import {AppNavbar} from "./navbar.js";
import {AppSignature} from "./signature.js"
import {CreateBox} from "./creation_box.js"
import {Credits} from "./credits.js"
import {PatientBox} from "./patient_box.js"
import {ChecklistItem} from "./item.js"
import {SectionTitle} from "./section_title.js";
import {ValidationButton} from "./validation_button";
import {AlertsBox} from "./alerts_box";
import {Title} from "./title";
import {checklist_arrays, checklist_list} from "./temporary_data.js";
import {Home} from "./home";
import {CountingTable} from "./couting_table";
import QrcodeScanner from "./qrcodescanner";

/*Main Function
* -Declare all the variables needed in different component
* -Return a combination of different components (Navbar, CreateBox, Credits, PatientBox, ChecklistItem(s), Signature)
* */

function date_to_age (date){
  let result = date.split("/")
  let current_year = new Date()
  return current_year.getFullYear() - result[2]
}

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

  let [homeMode, setHomeMode] = useState(true)

  let [checklistId, setChecklistId] = useState(-1)

  //On fait l'appel qui va chercher la liste des checklists (constant)
  let [checklistList, setChecklistList] = useState(null)

  //On fait l'appel qui va chercher la checklist 'checklistId = 0'
  let [checklist, setChecklist] = useState(null)

  let [currentQuestion, setCurrentQuestion] = useState(null)

  let [alertList,setAlertList] = useState({})


  // Init calls (get checklist list and the initial checklist
  useEffect(() => {
    onNewScanResult = onNewScanResult.bind(this);

    // axios.get('http://checklists.metoui.be/api/checklists') //Random url, just to simulate the fact that we need to make get call before set checklistList
    //   .then(function(response){
    //
    //     //Must handle incoming data
    //     console.log("call response", response)
    //     console.log(temp_data.checklist_list)
    //
    //     //For now we use temp_data
    //
    //     setChecklistList(temp_data.checklist_list);
    //     // checklist.name = temp_data.checklist_list.filter(elm => elm.checklist_id === 0)[0].name
    //     // checklist.person = temp_data.checklist_list.filter(elm => elm.checklist_id === 0)[0].person
    //     // setChecklist(checklist)
    //     console.log("initial get checklist list call and set finished")
    //   });
    // axios.get('http://checklists.metoui.be/api/checklists/1') //Random url, just to simulate the fact that we need to make get call before set first checklist
    //   .then(function(response){
    //
    //   //Must handle incoming data
    //   console.log("call response", response)
    //   console.log(temp_data.checklist_arrays[2])
    //
    //   //For now we use temp_data
    //   const init_checklist = utils.checklist_flat_to_tree(temp_data.checklist_arrays[2],0)
    //
    //   setChecklist(init_checklist);
    //   setCurrentQuestion(init_checklist && init_checklist.values.length ? init_checklist.values[0] : null)
    //   console.log("initial get first checklist call and set finished")
    // });
    // axios.get('#') //Random url, just to simulate the fact that we need to make get call before set alert list
    //   .then(function(response){
    //
    //     //Must handle incoming data
    //     console.log("call response", response)
    //     console.log(temp_data.alerts)
    //
    //     //For now we use temp_data
    //     setAlertList(temp_data.alerts);
    //     console.log("initial get alert list call and set finished")
    //   });
  }, [])

  // let [patientList, ] = useState(temp_data.patients)
  let [currentPatient, setCurrentPatient] = useState(null)
  let [result, setResult] = useState({})
  let [pbresult, setPbResult] = useState({})
  let [visibleList, setVisibleList] = useState([])
  let [isPreCheckDone, setIsPreCheckDone] = useState([])
  let [warningId, setWarningId] = useState(0)
  let [precheckMode, setPrecheckMode] = useState(true)



  /* Other state variables
  * -creationMode : bool indicates if we are in creation mode
  * -creditMode : bool indicates if we are in credit mode
  * -trimmedCanvasUrl : variable containing the canvas url data of the signature
  * -sigpad : variable containing the signature pad information*/
  let [creationMode, setCreationMode] = useState(false)
  let [creditMode, setCreditMode] = useState(false)
  let [commentMode, setCommentMode] = useState(true)
  let [debugMode, setDebugMode] = useState(false)
  let [trimmedCanvasUrl, setTrimmedCanvasUrl] = useState(null)
  let sigpad = {}

  /* Initial set of isDict state variablesetTotalReactPackages
  * -init_dict : dict containing {0:true} for each possible answer (yes, no, etc), defined in utils.js
  * -isDict : dict containing a dict for each possible response,
  * containing the questions id's that have this response checked at this moment*/
  let init_dict = {}
  utils.list_possible_answer.forEach(function (answer){init_dict[answer]={0:true}})
  const [isDict, setIsDict] = useState(init_dict)

  // console.log("init_dict", init_dict)

  // console.log(checklist)

  /* Fill in of numDict, containing all the numerical data (the way current patient info is extracted will be improved)*/
  let num_values = checklist ? checklist.num_values : []
  let numDict = {}
  num_values.forEach(function(elm) {numDict[elm.var] = elm.val})

  if (currentPatient){
    console.log("enter")
    for (const [key, value] of Object.entries(currentPatient)) {
      numDict[key] = value
    }
    numDict["age"] = date_to_age(numDict["dateofbirth"])

    // function downloadBase64File(contentBase64, fileName) {
    //   const linkSource = `data:application/pdf;base64,${contentBase64}`;
    //   const downloadLink = document.createElement('a');
    //   document.body.appendChild(downloadLink);
    //
    //   downloadLink.href = linkSource;
    //   downloadLink.target = '_self';
    //   downloadLink.download = fileName;
    //   downloadLink.click();
    //   console.log("downloaded")
    // }
    // downloadBase64File(numDict.consent_pdf, "consent.pdf")
  }




  /* Filter (check of the cond's) of the checklist  initial values (i.e. the questions at the first level of the tree)*/
  let values = null
  visibleList = []
  if (checklist && checklist.values) {
    values = values_filter_cond(checklist.values, isDict, numDict, creationMode)
    values.forEach(value => value.check.length ? visibleList.push(value.id): null)
  }

  let dicts = [isDict, setIsDict, numDict, result, pbresult, setResult, setPbResult, isPreCheckDone, setIsPreCheckDone, visibleList, setVisibleList, debugMode, commentMode ]

  function reset (){
    setWarningId(0)
    setResult({})
    setPbResult({})
    let init_dict_ = {}
    utils.list_possible_answer.forEach(function (answer){init_dict_[answer]={0:true}})
    setIsDict(init_dict_)
    setIsPreCheckDone([])
  }

  /* Function that changes the current checklist to the checklist with checklist_id and resets dicts*/
  const swapchecklist = (checklist_id) => {

      //On fait l'appel qui va chercher la checklist 'checklistId = x'
    axios.get('https://api.npms.io/v2/search?q=react') //Random url, just to simulate the fact that we need to make get call before set checklistList
    .then(function(response){

      //Must handle incoming data
      console.log("swap call response", response)
      console.log(temp_data.checklist_arrays[checklist_id])

      //For now we use temp_data
      const current_creation_mode = creationMode
      let checklist_array = temp_data.checklist_arrays[checklist_id-1]
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)
      checklist.name = checklistList.filter(elm => elm.checklist_id === checklist_id)[0].name
      checklist.person = checklistList.filter(elm => elm.checklist_id === checklist_id)[0].person
      checklist.counter = checklistList.filter(elm => elm.checklist_id === checklist_id)[0].counter
      setChecklist(checklist)

      let alert_list = alertList
      Object.keys(alert_list).forEach((key, index) => {
        const corresponding_questions = checklist_array.filter(elm => elm[1].includes(key))
        alert_list[key].question_id = corresponding_questions.length ? corresponding_questions[0][0] : -1
        if (!Object.values(pbresult).filter(elm => elm.name === key).length && Object.values(result).filter(elm => elm.name === key).length){
          alert_list[key].gravity = 1
        }
      })
      Object.keys(pbresult).forEach((key, index) => {
        const name = pbresult[key].name
        const corresponding_questions = checklist_array.filter(elm => elm[1].includes(name))
        alert_list[name] =
          {
            "id": index, "question_id": corresponding_questions.length ? corresponding_questions[0][0] : -1, "checklist_id" : checklistId, "name": name,
            "answer" : (utils.list_possible_answer_trad[pbresult[key].answer] ? utils.list_possible_answer_trad[pbresult[key].answer] : pbresult[key].answer),
            "gravity": 0
          }
      })
      setAlertList(alert_list)

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

    /*Create a table containing results and export it as .csv file*/
  function import_csv_result () {
    let result_table = [["id", "name", "answer"]]
    for (const [key, value] of Object.entries(result)){
      result_table.push([key, value.name, value.answer])
    }
    let csvGenerator = new utils.CsvGenerator(result_table, 'my_csv.csv');
    csvGenerator.download(true);
  }

  let [scanValue, setScanValue] = useState(null)
  let [scanValueError, setScanValueError] = useState(null)

  function onNewScanResult(decodedText, decodedResult) {
    console.log(decodedText, scanValue)
    if(!scanValue && decodedText) {
      console.log("write decoded scan", decodedText)

      axios.get('#') //Random url, just to simulate the fact that we need to make get call before set checklistList
        .then(function(response){
          let corresp_checklist_list = temp_data.checklist_list.filter(elm => elm.patient_id === decodedText)
          let checklist_list = corresp_checklist_list && corresp_checklist_list.length ? corresp_checklist_list[0].checklists : []
          setCurrentPatient(corresp_checklist_list && corresp_checklist_list.length ? corresp_checklist_list[0].patient : null)

          console.log("checklist_list", checklist_list)
          if (checklist_list && checklist_list.length) {
            console.log("enter if ")
            // setScanValueError(null)
            setChecklistList(checklist_list)
            setScanValue(decodedText)
          }
          else {
            console.log("enter else ")
            setChecklistList([{}])
            setScanValueError(decodedText)
            setChecklistList([])
          }
        })
    }
  }

  let next_scan_item = values ? values.filter(item => !result[item.id] && item.check.includes("scan")) : null
  let next_scan_item_id =  next_scan_item && next_scan_item.length ? next_scan_item[0].id : null


  // console.log("app")
  // console.log("isPreCheckDone", isPreCheckDone)
  // console.log("isDict", isDict)
  console.log("result", result)
  // console.log(result)
  // console.log(visibleList)
  // console.log(isDict)
  // console.log(isPreCheckDone)
  console.log("alertList", alertList)
  // console.log(currentQuestion)
  console.log(checklist)
  /* Return the different components, depending of the mode.
  * We define also the background and a hidden bottom navbar to avoid problems with the background limits
  */
  return (
    <div className="min-vh-100 content-page iq-bg-info">

      <div>
        {<AppNavbar props = {{creationMode, setCreationMode, creditMode,  setCreditMode, setCommentMode, commentMode, setDebugMode, debugMode,trimmedCanvasUrl, checklistList, swapchecklist, reset, forceUpdate, import_csv_result, result, setCurrentQuestion, checklist, homeMode, setHomeMode, setChecklistList, setScanValue, setCurrentPatient}}/>}
        {creditMode ?
          <Credits props={null}/>
          :
          <div>
            {homeMode ?
              <div>{!(checklistList && checklistList.length)  ?
                  <QrcodeScanner fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} scanValueError={scanValueError} scanValue={null}/>
                  :
                  <Home checklistList={checklistList} swapchecklist = {swapchecklist} scanValue = {scanValue} currentPatient={currentPatient}/>
              }</div>
              :
              (<div id={"title"}>
                <Title  checklistList={checklistList} checklistId={checklistId} numDict={numDict} currentPatient={currentPatient}/>
                {creationMode ?
                  <CreateBox key={checklistId} props={{checklist, setChecklist, checklistList, setChecklistList, checklistId, setChecklistId, forceUpdate, setResult, setIsDict, init_dict, setIsPreCheckDone, currentQuestion, setCurrentQuestion, swapchecklist}} />
                  :
                  <div>
                    {/*<PatientBox props={{currentPatient, setCurrentPatient, setIsDict, setResult, setIsPreCheckDone, init_dict, forceUpdate}} />*/}
                    {alertList && Object.values(alertList).length ? <AlertsBox alertList={alertList}/> : null}
                  </div>
                }
                {checklist.counter === false ?
                  <div>
                    <div className={"container p-0 border-bottom border border-dark  shadow rounded "}>
                      {values ? values.map((i, index) => (
                          <div >
                            {i.section_title ? <SectionTitle section_title={i.section_title} index={index} /> :<div className={"bg-primary " + (index ? "border-dark border-top":"")}/>}
                            <div className={"pb-3 px-3 pt-3 " + (index === values.length-1 ? "rounded rounded-0-top ": null) + (index || i.section_title ? "":" rounded rounded-0-bottom ") + (i.importance ? "iq-bg-danger": "iq-bg-info")}>
                              <ChecklistItem key={JSON.stringify(checklistId) + i.id} init_items={checklist} item={i} dicts={dicts}
                                             forceUpdate = {forceUpdate} values_filter_cond={values_filter_cond}
                                             creationMode={creationMode} currentId = {currentQuestion ? currentQuestion.id: null} warningId={warningId} precheckMode={precheckMode}
                                             is_root={true} alertList={alertList} scan_bookmark={next_scan_item_id === i.id}
                              />
                            </div>
                          </div>))
                        :
                        null
                      }
                    </div>
                    {/*{!creationMode ? <AppSignature key={checklistId} sigpad={sigpad} setTrimmedCanvasUrl = {setTrimmedCanvasUrl} is_end_sign={true}/> : null}*/}
                  </div>
                  :
                  <CountingTable result={result} setResult={setResult}/>
                }
                {!creationMode ? <ValidationButton visibleList={visibleList} result={result} import_csv_result = {import_csv_result} checklist={checklist} setWarningId={setWarningId} checklistList={checklistList} setChecklistList={setChecklistList} checklistId={checklistId}/> : null }
              </div>)
            }
          </div>
        }
      </div>

      <div>
        <nav className="navbar">
          <label className="navbar-brand">{null}</label>
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
function values_filter_cond(values, isDict, numDict, creationMode, debugMode) {
  // console.log(values)
  // console.log(isDict)
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



