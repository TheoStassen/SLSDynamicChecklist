import React from "react";
import * as utils from "./utils";




function Title ({checklistList, checklistId, numDict, currentPatient}) {
  console.log(numDict["age"])

  const checklist = checklistList ? checklistList.filter(elm => elm.checklist_id === checklistId)[0] : null
  return (
    <div className={"container"}>
      <div className="iq-card bg-primary  mt-4 text-center p-2 shadow border border-dark">
        <div className="card-body">
          <h3 className="card-title text-white">{checklist ? "Checklist " + checklist.name: null} </h3>
          <h4 className="card-title text-white m-0">{currentPatient.firstname} {currentPatient.lastname} </h4>
          <img className={"border border-dark my-2"} src={currentPatient.photo} width="128" height="128"/>

          <h4 className="card-text text-white m-0">{checklist ? checklist.type + (numDict.age < 19 ? " Enfant" : " Adulte") : null}</h4>
          <h4 className="card-text text-white m-0">{checklist ? numDict.intervention_name : null}</h4>
          <h4 className="card-text text-dark m-0">{checklist ? checklist.person : null}</h4>
        </div>
      </div>
    </div>
  )

}

export {Title}