import React, {useEffect} from "react";
import * as utils from "./utils";
import * as temp_data from "./temporary_data";
import axios from "axios";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function UserBox ({props}) {

  let {onNewScanResult} = props

  function debug_allow_user() {
    onNewScanResult("7654321")
  }


  /*Return the patient box elements*/
  return (
    <div className="container p-2">
      <div className={"iq-card bg-primary col-sm-12 mx-auto p-2 text-center shadow border border-dark justify-content-center "}>
        <div className="card-body">
          <h3 className="card-title text-white m-0"> Identification de l'utilisateur </h3>

         <h4 className="card-title text-white mt-4 mb-0">Scannez le QR code correspondant</h4>
         <h4 className="card-title text-white"><div data-icon="k" className="icon"></div></h4>

         <button id={"btn1"} className={"btn btn-info btn-round m-2"} onClick={() =>debug_allow_user()}>Passer Qr Code</button>

        </div>
      </div>
    </div>
  )
}

export {UserBox}