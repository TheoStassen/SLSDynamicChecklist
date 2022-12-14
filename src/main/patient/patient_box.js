import {useEffect} from "react";
import * as temp_data from "../../utils/temporary_data";
import * as calls from "../../calls";
import {useState} from "react";

/*Component for the selection of the current patient
* */
function PatientBox ({props}) {
  let { currentPatient, forceUpdate, patientList, switchPatient, onNewScanResult, setPatientList,journeyErrorCode} = props

  /* State variables used in home only
  * -errorCode : contains the error code if get waiting patient fail
  * -isWaitingList : indicates if we are waiting the patient list
  * -isWaitingJourney : indicates if we are waiting the selected patient journey checklist list
  * */
  let [errorCode, setErrorCode] = useState(null)
  let [isWaitingList, setIsWaitingList] = useState(false)
  let [isWaitingJourney, setIsWaitingJourney] = useState(false)

  /*Function to trespass the verification, consider that a correct scan has been obtained*/
  function debug_allow_patient() {
    setIsWaitingJourney(true)
    onNewScanResult(temp_data.patients[currentPatient.id].patient_code)
  }

  /*Function triggered only when mount, get the waiting patient list*/
  useEffect(()=> {
    setIsWaitingList(true)
    calls.getwaitingpatients( setPatientList, setErrorCode, setIsWaitingList) //TODO
  }, [])


  /*Return the patient box elements*/
  return (
    <div className="container p-2 mt-2">
      {isWaitingJourney && !journeyErrorCode ? <div className="d-flex justify-content-center m-2">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> : null
      }
      {journeyErrorCode ?
        <div className={"container iq-card bg-white mx-auto mb-3 mt-2 p-2 text-center shadow-sm border justify-content-center "}>
          <div className={"card-body iq-card mx-auto my-3 text-center p-2 shadow-sm border justify-content-center"}>
            <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun parcours patient n'est trouvé, problème de connexion ("{journeyErrorCode}") </div></h6>
          </div>
        </div> : null
      }
      <div className={"iq-card bg-white col-sm-12 mx-auto p-2 mb-0 text-center border shadow-sm justify-content-center border border-primary "}>
        <div className="card-body">
          <div className={"row"}>
            {/*Patient infos section*/}
            <div className={"col-sm-6 my-auto rounded border-left border-right border-secondary"}>
              {!currentPatient ? <h4 className=" mx-auto">Vous pouvez sélectionner le patient pour lequel vous voulez remplir une checklist</h4> : null }
              {/*{!currentPatient ? <h3 className="card-title text-dark">Liste des patients en attente</h3> : null }*/}
              {currentPatient ? <h3 className="card-title text-dark m-0">Patient(e) : {currentPatient.firstname} {currentPatient.lastname} </h3> : null}
              {currentPatient ? <h4 className="card-title text-secondary m-0">{currentPatient.dateofbirth}</h4> : null}
              {currentPatient ? <h4 className="card-text text-primary m-0"> {currentPatient.intervention_name}</h4> : null}
              {currentPatient ? <img className={"border border-dark mt-2 mb-4"} src={"http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128" alt={"Photo"}/> : null } {/*//TODO : change url*/}
            </div>
            <div className={"col-sm-6 my-auto"}>

              {/*Current patient selection dropdown*/}
              <div className="ml-6">
                <div className="col dropdown text-center my-auto">
                  <button className="btn btn-primary btn-round dropdown-toggle" type="button" id="dropdownMenuButton1"
                          data-toggle="dropdown" aria-expanded="false">
                    {isWaitingList ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true">&nbsp;</span>  : null}
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
                  <button className=" btn btn-warning btn-circle btn-vsm ml-1" type="button" onClick={function (){setIsWaitingList(true); calls.getwaitingpatients( setPatientList, setErrorCode, setIsWaitingList)}}>
                    <div data-icon="Z" className="icon pt-1"></div>
                  </button>
                </div>

              </div>

              {errorCode && errorCode !== "empty" ?
                <div className={"iq-card mx-auto text-center p-2 shadow-sm border justify-content-center mt-2"}>
                  <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun patient n'est trouvé, problème de connexion ("{errorCode}")  </div></h6>
                </div>
                : null}

              {errorCode && errorCode === "empty" ?
                <div className={"iq-card mx-auto text-center p-2 shadow-sm border justify-content-center mt-2"}>
                  <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Liste de patients vide </div></h6>
                </div>
                : null}

              {currentPatient ? <button className={"btn btn-outline-primary btn-round m-2"} onClick={() =>debug_allow_patient()}>Passer Qr Code</button>: null}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {PatientBox}