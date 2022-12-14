import QrcodeScanner from "../qrcodescanner";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom"
import * as calls from "../../calls";
import {useState} from "react";
import {PatientBox} from "./patient_box";

/*Patient App Function,
* -Declare all the variables and function specific to patient route
* -Return the elements that allow the user to select the patient :
*  patient box (with the patient list) and scanner (to authentify the patient) */
export default function PatientApp({props}) {
  /*Props from App */
  let { currentPatient, setCurrentPatient, forceUpdate, patientList, setChecklistList, setPathId, setPatientList, setJourneyErrorCode, isLogin, journeyErrorCode,setNumDict} = props

  /*Function used to navigate between routes*/
  const navigate = useNavigate()

  /* State variables used in patient route only
  * -scanValueError (string) : string containing error prompt if the scan value does not correspond to patient code.
  * */
  let [scanValueError, setScanValueError] = useState(null)

  /*Function triggered when the scanner return a decoded text*/
  function onNewScanResult(decodedText) {
    window.scrollTo(0, 0);

    if (currentPatient.patient_code === decodedText) {
      /*If code correct, get the patient journey and go to menu route*/
      calls.getjourney( currentPatient, setCurrentPatient, setPathId,setChecklistList, setJourneyErrorCode, navigate)
    } else {
      setChecklistList([{}])
      setScanValueError(decodedText)
      setChecklistList([])
    }
  }

  /* Function that switch current patient*/
  function switchPatient (id) {
    calls.getpatient(id,setCurrentPatient, patientList,setNumDict)
  }

  /*Function triggered only when the component is mount */
  useEffect(() => {
    onNewScanResult = onNewScanResult.bind(this);

    /*If not login, we are not supposed to be here, we go back to login route*/
    if(!isLogin)
      navigate("/login")

  }, [])


  return (
    <div>
      <PatientBox props={{
        currentPatient, forceUpdate, patientList, switchPatient, onNewScanResult, setPatientList,journeyErrorCode
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
          {scanValueError !== null ?
            <div className={"container custom-scanner card rounded rounded-0-top bg-warning mx-auto text-center p-2  border shadow-sm justify-content-center "}>
              <div className="card-body m-0 p-0">
                <h5 className="card-title text-dark m-0">Erreur : le code "{scanValueError}" ne correspond pas </h5>
              </div>
            </div>
            : null}
        </div> : null}
    </div>
  )
}
