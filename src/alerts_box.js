import React from "react";
import * as utils from "./utils";
import * as temp_data from "./temporary_data";

/*Component for the selection of the current patient
* -patientList : list of all patients
* -currentPatient : current patient state variable
* -setCurrentPatient: current patient set function
* */
function AlertsBox ({alertList}) {

  console.log("enter alert box", alertList)

  let list_alert = alertList
  const half = list_alert ? Math.ceil(list_alert.length/2) : 0

  const first_half_list = list_alert ? list_alert.slice(0, half) : []
  const second_half_list = list_alert && list_alert.length > 1 ? list_alert.length % 2 === 0 ? list_alert.slice(-half) : list_alert.slice(-half+1) : []

  return (
    <div className={"container iq-card pt-3 pb-1 border-bottom border-left border-right border-dark shadow rounded-0-top"}>
      <div className="row align-items-center">
        <div className={"col-sm-6 pr-2"}>
          {first_half_list.map((alert, index) =>
            <div className={"col-sm-12 alert rounded " + (alert.gravity === 0 ? "bg-danger" : alert.gravity === 1 ? "bg-warning" : "bg-light text-dark") } role="alert">
              <div className="iq-alert-text">Alerte <b>Question {alert.question_id}</b> : {alert.info}</div>
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <i className="ri-close-line text-dark"></i>
              </button>
            </div>
          )}
        </div>
        <div className={"col-sm-6 pl-2"}>
          {second_half_list.map((alert, index) =>
            <div className={"col-sm-12 alert rounded " + (alert.gravity === 0 ? "bg-danger" : alert.gravity === 1 ? "bg-warning" : "bg-light text-dark") } role="alert">
              <div className="iq-alert-text">Alerte <b>Question {alert.question_id}</b> : {alert.info}</div>
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <i className="ri-close-line text-dark"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export {AlertsBox}