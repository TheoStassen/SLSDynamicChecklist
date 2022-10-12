import React, {useEffect, useState} from "react";
import * as utils from "../utils/utils";
import * as temp_data from "../utils/temporary_data";
import axios from "axios";
import * as calls from "../calls";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function UserBox ({props}) {

  let {userList, onNewScanResult, switchUser, currentUser, is_local, setUserList} = props

  let [errorCode, setErrorCode] = useState(null)

  function debug_allow_user() {
    onNewScanResult(temp_data.users[currentUser.id].user_code)
  }

  useEffect(() =>{
    calls.getusers(is_local, setUserList, setErrorCode)
  }, [])


  /*Return the patient box elements*/
  return (
    <div className="container p-2 mt-2">
      <div className={"iq-card bg-white col-sm-12 mx-auto mb-0 p-2 text-center shadow-sm border justify-content-center"}>
        <div className="card-body col-sm-6 mx-auto">
          <h3 className="card-title text-dark"> Identification de l'utilisateur </h3>

          {/*Current patient selection dropdown*/}
          <div className="align-items-center my-auto mx-auto">
            <div className="dropdown text-center">
              <button className="btn btn-primary btn-round dropdown-toggle" type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Sélectionnez l'utilisateur
              </button>
              <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenuButton1">
                {userList ? props.userList.map((i, index) => (
                  <li key={index}><label className="dropdown-item " onClick={() => switchUser(i.id)}>
                    {i.firstname}&nbsp;{i.lastname}</label>
                  </li>
                ))
                  :
                  <li><label className="dropdown-item "> Pas d'utilisateurs</label></li>
                }
                <li><label className="dropdown-item text-center m-0 " id="dropdownMenuButton1" data-toggle="dropdown">
                  <div data-icon="W" className="icon"/></label>
                </li>
              </ul>
            </div>
          </div>

          <button className="btn btn-warning btn-round mt-2" type="button" onClick={function (){calls.getusers(is_local, setUserList)}}>
            <div data-icon="Z" className="icon pt-1"></div>
          </button>
          {errorCode ?
            <div className={"iq-card mx-auto text-center p-2 shadow-sm border justify-content-center mt-2"}>
              <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun utilisateur n'est trouvé, problème de connexion ("{errorCode}") </div></h6>
            </div>
          : null}
          {currentUser ? <h4 className="card-title text-secondary mt-4 mb-0">Scannez le QR code correspondant</h4> : null }
          {currentUser ? <h4 className="card-title text-secondary"><div data-icon="k" className="icon"></div></h4> : null }

          {currentUser ? <button className={"btn btn-outline-primary btn-round m-2"} onClick={() =>debug_allow_user()}>Passer Qr Code</button>: null}
        </div>
      </div>
    </div>
  )
}

export {UserBox}