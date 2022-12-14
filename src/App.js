import { useReducer, useState} from "react";
import {Navigate} from "react-router-dom"
import "./styles/App.css";
import {AppNavbar} from "./main/main_navbar.js";
import {Credits} from "./main/credits/credits.js"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Creation_app from "./create/creation_app";
import LoginApp from "./main/login/login_app";
import PatientApp from "./main/patient/patient_app";
import MenuApp from "./main/menu/menu_app";
import ChecklistApp from "./main/checklist/checklist_app";

/*App Function
* -Declare all the variables that are needed in more than one route
* -Return the router containing the routes ( main - login/patient/menu/checklist // creation) */
export default function App() {

  /* Main state variables, used in different routes :
  * -loginInfo (dict): login/password information of the user
  * -isLogin (bool) : indicates if user is login
  * -currentUser (dict) : current user information, obtained by the login call
  * -patientList (array) : current list of all the patient waiting for checklist completion
  * -currentPatient (dict) : current patient
  * -checklistId (number) : id of the current checklist
  * -pathId (number) : id of the current patient path (also named journey)
  * -checklistList (array) : list containing the different checklists of the current patient path
  * -checklist (dict) : current checklist
  * -alertList (array) : list containing the different alerts observed for the current path, shown in checklist app
  * -journeyErrorCode (string) : string containing error prompt if a get journey call fail.
  * -commentMode (bool) : indicates if we are in a mode where the question's comments are shown (and not hidden)
  * -debugMode (bool) : indicates if we are in a mode where the dynamism is deactivated (all questions shown)
  * -forceValidationMode (bool) : indicates if we are in a mode where the user can validate a checklist
  * without filling all questions -> not used in the current version by choice but implemented in the code
  * -precheckMode (bool) : indicates if we are in a mode where the system of question 'precheck'
  * is active -> not used in the current version by choice but implemented in the code
  * -numDict (dict) : dictionary containing all the numerical information concerning the patient
  * */
  let [loginInfo, setLoginInfo] = useState(null)
  let [isLogin, setIsLogin] = useState(false)
  let [currentUser, setCurrentUser] = useState(null)
  let [patientList, setPatientList ] = useState([])
  let [currentPatient, setCurrentPatient] = useState(null)
  let [checklistId, setChecklistId] = useState(-1)
  let [pathId, setPathId] = useState(-1)
  let [checklistList, setChecklistList] = useState(null)
  let [checklist, setChecklist] = useState(null)
  let [alertList,setAlertList] = useState({})
  let [journeyErrorCode, setJourneyErrorCode] = useState(null)
  let [commentMode, setCommentMode] = useState(true)
  let [debugMode, setDebugMode] = useState(false)
  let [forceValidationMode, setForceValidationMode] = useState(false)
  let [precheckMode, setPrecheckMode] = useState(true)
  let [numDict, setNumDict] = useState({})

  /*Function used when component update must be forced (in particular case, especially in creation app)*/
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return (
    <div>
      <div className="min-vh-100 content-page bg-color-custom">
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="login" />} />
              <Route path="login" element={<LoginApp props={{ loginInfo, setLoginInfo, setIsLogin, setCurrentUser, isLogin}}/>} />
              <Route path="main" element={<AppNavbar props={{ setCommentMode, commentMode, setDebugMode, debugMode, checklistList, forceUpdate, checklist, setChecklistList, setCurrentPatient, setCurrentUser, currentPatient, setPathId, currentUser,setLoginInfo, setIsLogin, setJourneyErrorCode}} /> } >
                <Route path="patient" element={<PatientApp props={{ currentPatient, setCurrentPatient, forceUpdate, patientList, setChecklistList, setPathId, setPatientList, setJourneyErrorCode, isLogin, journeyErrorCode,setNumDict}}/>} />
                <Route path="menu" element={<MenuApp props={{checklistList,currentPatient,currentUser,pathId,numDict, checklist, setChecklist,alertList, setAlertList,setChecklistId}} />} />
                <Route path="checklist" element={<ChecklistApp props={{checklistList,currentPatient,numDict, checklistId,forceValidationMode,setForceValidationMode,alertList,checklist,
                  debugMode, commentMode, forceUpdate,setChecklistList, precheckMode,pathId,currentUser }} />} />
                <Route path="credits" element={<Credits props={null}/>} />
              </Route>
              <Route path="creation" element={<Creation_app/>}/>
            </Routes>
          </BrowserRouter>
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





