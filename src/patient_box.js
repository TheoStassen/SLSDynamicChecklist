import React from "react";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function PatientBox ({props}) {

  let {patientList, currentPatient, setCurrentPatient} = props

  /*Function to change the current patient to the one with patient_id*/
  const changecurrentpatient = (patient_id) => {
    const currentPatient = patientList.filter(elm => elm.id === patient_id)[0]
    setCurrentPatient(currentPatient)
  }

  /*Return the patient box elements*/
  return (
    <div className="container p-2 container-custom border border-2 shadow-sm">
      <div className="row align-items-center p-2 m-0">
        {/*Indication text*/}
        <div className="col-sm-4 align-items-center text-custom ">
          Patient Actuel :
        </div>
        {/*Current patient name*/}
        <div className="col-sm-4 align-items-center ">
          <div className="card card-grey text-center shadow-sm text-custom">
            {currentPatient.name}
          </div>
        </div>
        {/*Current patient selection dropdown*/}
        <div className="col-sm-4 align-items-center ">
          <div className="dropdown text-center">
            <button className="btn btn-val dropdown-toggle text-custom" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
              Sélectionnez le patient
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {patientList.map((i, index) => (
                <li key={index}><label className="dropdown-item  text-custom" onClick={() => changecurrentpatient(i.id)}>
                  {i.name}</label>
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