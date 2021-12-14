import React from "react";
import * as utils from "./utils";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function PatientBox ({props}) {

  let {patientList, currentPatient, setCurrentPatient, setIsDict, setResult, setIsPreCheckDone, forceUpdate} = props

  /*Function to change the current patient to the one with patient_id*/
  const changecurrentpatient = (patient_id) => {
    const currentPatient = patientList.filter(elm => elm.id === patient_id)[0]
    setCurrentPatient(currentPatient)
    setResult({})
    let init_dict = {}
    utils.list_possible_answer.forEach(function (answer){init_dict[answer]={0:true}})
    setIsDict(init_dict)
    setIsPreCheckDone([])
    forceUpdate()
  }

  /*Return the patient box elements*/
  return (
    <div className="container iq-card p-2 py-3 ">
      <div className="row align-items-center m-0">
        {/*Indication text*/}
        <div className="col-sm-4 align-items-center text-dark">
          Patient Actuel :
        </div>
        {/*Current patient name*/}
        <div className="col-sm-4 align-items-center ">
          <div className="iq-card bg-primary text-center  m-0">
            {currentPatient.firstname}&nbsp;{currentPatient.lastname}
          </div>
        </div>
        {/*Current patient selection dropdown*/}
        <div className="col-sm-4 align-items-center ">
          <div className="dropdown text-center">
            <button className="btn btn-secondary btn-round dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-toggle="dropdown" aria-expanded="false">
              Sélectionnez le patient
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {patientList.map((i, index) => (
                <li key={index}><label className="dropdown-item " onClick={() => changecurrentpatient(i.id)}>
                  {i.firstname}&nbsp;{i.lastname}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export {PatientBox}