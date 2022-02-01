import React from "react";
import * as utils from "./utils";




function Title ({checklistList, checklistId}) {
  const checklist = checklistList ? checklistList.filter(elm => elm.checklist_id === checklistId)[0] : null
  return (
    <div className="container iq-card bg-primary  mt-4 text-center p-2 shadow border border-dark">
      <div className="card-body">
        <h3 className="card-title text-white">{checklist ? "Checklist " + checklist.name: null} </h3>
        <h4 className="card-text text-dark m-0">{checklist ? checklist.person : null}</h4>
      </div>
    </div>
  )

}

export {Title}