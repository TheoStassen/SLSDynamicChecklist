import React from "react";
import * as utils from "./utils";
import {bindReporter} from "web-vitals/dist/modules/lib/bindReporter";

function check_all_question_answered (visibleList, result){
  return visibleList.every(
    function (elm){ return result[elm]}
  )
}



function ValidationButton ({visibleList, result, import_csv_result, checklist, setWarningId}) {

  function search_question_not_answered (visibleList, result, is_set){
    const visibleListsorted = visibleList.sort(function (elm1,elm2){return elm1>elm2})
    for (let i=0; i<visibleListsorted.length;i=i+1){
      if(!result[visibleListsorted[i]]){
        if (is_set) setWarningId(visibleListsorted[i])
        return "question" + (visibleListsorted[i-1])
      }
    }
    if (is_set) setWarningId(0)
    return ""
  }

  return (
    <div className="container iq-card  mt-5 text-center p-2 shadow">
      <a onClick={() => search_question_not_answered(visibleList, result, true) === "" ? import_csv_result() : null }
         href={"#" + search_question_not_answered(visibleList, result, false)}
         className=""
      >
        <button className="btn btn-warning text-center w-100 rounded b">
          Valider la checklist
        </button>
      </a>
    </div>
  )

  // href={"#" + !check_all_question_answered(visibleList, result) ? search_question_not_answered(visibleList, result) : ""}

}

export {ValidationButton}