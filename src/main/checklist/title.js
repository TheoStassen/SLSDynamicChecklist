import React from "react";

/*Component showing the title, i.e the checklist infos above the checklist*/
function Title ({checklistList, checklistId, numDict, currentPatient, forceValidationMode, setForceValidationMode}) {

  const checklist = checklistList ? checklistList.filter(elm => elm.id === checklistId)[0] : null
  return (
    <div className={"container"}>
      <div className="iq-card bg-white  mt-4 text-center p-2 shadow-sm border">
        <div className="card-body">
          <h3 className="card-title text-dark">{checklist ? "Checklist " + checklist.title: null} </h3>
          <h4 className="card-title text-primary m-0">{currentPatient.firstname} {currentPatient.lastname} </h4>
          <h4 className="card-title text-secondary m-0">{currentPatient.dateofbirth}</h4>
          <img className={"border border-dark my-2"} src={"http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128"/> //TODO : put correct url

          <h4 className="card-text text-dark m-0">{ "Chirurgie " + (currentPatient.type === "major" ? "Majeure" : "Mineure" ) + (numDict.age < 19 ? " Enfant" : " Adulte")}</h4>
          <h4 className="card-text text-primary m-0">{currentPatient.intervention_name}</h4>
          <h4 className="card-text text-secondary m-0">{checklist ? checklist.description : null}</h4>
        </div>
      </div>
    </div>
  )

}

export {Title}