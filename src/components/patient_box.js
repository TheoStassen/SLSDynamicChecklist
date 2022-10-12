import React, {useEffect} from "react";
import * as utils from "../utils/utils";
import * as temp_data from "../utils/temporary_data";
import * as calls from "../calls";
import {useState} from "react";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function PatientBox ({props}) {

  let { currentPatient, setCurrentPatient, setIsDict, setResult, setIsPreCheckDone, forceUpdate, patientList, switchPatient, setChecklistList, setPathId, onNewScanResult, is_local, numDict, setPatientList} = props

  let [errorCode, setErrorCode] = useState(null)

  function debug_allow_patient() {
    onNewScanResult(temp_data.patients[currentPatient.id].patient_code)
  }

  useEffect(()=> {
    calls.getwaitingpatients(is_local, setPatientList, setErrorCode)
  }, [])


  /*Return the patient box elements*/
  return (
    <div className="container p-2 mt-2">
      <div className={"iq-card bg-white col-sm-12 mx-auto p-2 text-center border shadow-sm justify-content-center "}>
        <div className="card-body">
          {currentPatient ? <h3 className="card-title text-dark m-0">Patient(e) : {currentPatient.firstname} {currentPatient.lastname} </h3> : null}
          {currentPatient ? <h4 className="card-title text-secondary m-0">{currentPatient.dateofbirth}</h4> : null}
          {/*{currentPatient ? <h4 className="card-text text-secondary m-0"> {currentPatient.intervention_name}</h4> : null}*/}
          {currentPatient ? <img className={"border border-dark mt-2 mb-4"} src={is_local ? currentPatient.photo : "http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128" alt={"Photo"}/> : null }

          {!currentPatient ? <h3 className="card-title text-dark">Liste des patients en attente</h3> : null }

          {/*Current patient selection dropdown*/}
          <div className="align-items-center">
            <div className="dropdown text-center">
              <button className="btn btn-primary btn-round dropdown-toggle" type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Sélectionnez le patient
              </button>
              <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenuButton1">
                {patientList && patientList.length ? patientList.map((i, index) => (
                  <li key={index}><label className="dropdown-item " onClick={() => {forceUpdate(); switchPatient(i.id) }}>
                    {i.firstname}&nbsp;{i.lastname}</label>
                  </li>
                ))
                  :
                  <li><label className="dropdown-item "> Pas de patients</label></li>
                }
                <li><label className="dropdown-item text-center m-0 " id="dropdownMenuButton1" data-toggle="dropdown">
                  <div data-icon="W" className="icon"/></label>
                </li>
              </ul>
            </div>
          </div>
          <button className="btn btn-warning btn-round mt-2" type="button" onClick={function (){calls.getpatients(is_local, setPatientList)}}>
            <div data-icon="Z" className="icon pt-1"></div>
          </button>

          {errorCode && errorCode !== "empty" ?
            <div className={"iq-card mx-auto text-center p-2 shadow-sm border justify-content-center mt-2"}>
              <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun patient n'est trouvé, problème de connexion ("{errorCode}")  </div></h6>
            </div>
            : null}

          {errorCode && errorCode === "empty" ?
            <div className={"iq-card mx-auto text-center p-2 shadow-sm border justify-content-center mt-2"}>
              <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun utilisateur n'est trouvé, problème de connexion ("{errorCode}") </div></h6>
            </div>
            : null}

          {currentPatient ? <h4 className="card-title text-secondary mt-4 mb-0">Scannez le QR code correspondant</h4> : null }
          {currentPatient ? <h4 className="card-title text-secondary"><div data-icon="k" className="icon"></div></h4> : null }

          {currentPatient ? <button className={"btn btn-outline-primary btn-round m-2"} onClick={() =>debug_allow_patient()}>Passer Qr Code</button>: null}

        </div>
      </div>
    </div>
  )
}

export {PatientBox}