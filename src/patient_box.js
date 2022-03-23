import React from "react";
import * as utils from "./utils";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function PatientBox ({props}) {

  let { currentPatient, setCurrentPatient, setIsDict, setResult, setIsPreCheckDone, forceUpdate} = props


  /*Return the patient box elements*/
  return (
    <div className="container">
      <div className={"iq-card bg-primary col-sm-6 mx-auto text-center p-2 shadow border border-dark justify-content-center "}>
        <div className="card-body">
          <h4 className="card-title text-white m-0">{currentPatient.firstname} {currentPatient.lastname} </h4>
          <img className={"border border-dark mt-2"} src={currentPatient.photo} width="128" height="128"/>
        </div>
      </div>
    </div>
  )
}

export {PatientBox}