import React from "react";
import * as utils from "./utils";




function Title ({checklistList, checklistId, numDict, currentPatient, forceValidationMode, setForceValidationMode, is_local}) {

  const checklist = checklistList ? checklistList.filter(elm => elm.checklist_id === checklistId)[0] : null
  return (
    <div className={"container"}>
      <div className="iq-card bg-white  mt-4 text-center p-2 shadow-sm border">
        <div className="card-body">
          <h3 className="card-title text-dark">{checklist ? "Checklist " + checklist.name: null} </h3>
          <h4 className="card-title text-primary m-0">{currentPatient.firstname} {currentPatient.lastname} </h4>
          <h4 className="card-title text-secondary m-0">{currentPatient.dateofbirth}</h4>
          <img className={"border border-dark my-2"} src={is_local ? currentPatient.photo : "http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128"/>

          <h4 className="card-text text-dark m-0">{checklist ?  "Checklist " + (currentPatient.type === "major" ? "Majeure" : "Mineure" ) + (numDict.age < 19 ? " Enfant" : " Adulte") : null}</h4>
          <h4 className="card-text text-primary m-0">{checklist ? numDict.intervention_name : null}</h4>
          <h4 className="card-text text-secondary m-0">{checklist ? checklist.person : null}</h4>
        </div>
      </div>
      {/*<div className={"iq-card iq-bg-secondary p-0 mx-auto text-center shadow border border-dark justify-content-center "}>*/}
      {/*  <div className="card-body m-0 p-2">*/}
      {/*    <h4 className="card-title text-dark m-0 p-0">Note</h4>*/}
      {/*    {!forceValidationMode ? <h6 className="card-text text-dark m-0 p-0">Vous devez répondre à toutes les questions pour valider. Si vous voulez pouvoir valider quand même, appuyez ici</h6>: null}*/}
      {/*    {!forceValidationMode ? <button className={"btn btn-warning m-0 mt-2"} onClick={() => setForceValidationMode(!forceValidationMode)}>Autorise validation libre</button>: null}*/}
      {/*    {forceValidationMode ? <h6 className="card-text text-dark m-0 p-0">Vous pouvez valider la checklist à tout moment</h6>: null}*/}
      {/*    {forceValidationMode ? <button className={"btn btn-warning m-0 mt-2"} onClick={() => setForceValidationMode(!forceValidationMode)}>Ne plus autoriser</button>: null}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )

}

export {Title}