import React from "react";
import * as utils from "./utils";
import {bindReporter} from "web-vitals/dist/modules/lib/bindReporter";

function check_all_question_answered (visibleList, result){
  return visibleList.every(
    function (elm){ return result[elm]}
  )
}

function search_question_not_answered (visibleList, result){
  for (let i=0; i<visibleList.length;i=i+1){
    if(!result[visibleList[i]]){
      return "question" + (visibleList[i-1])
    }
  }
  return ""
}

function ValidationButton ({visibleList, result, import_csv_result, checklist}) {


  console.log(visibleList, result)
  console.log(check_all_question_answered(visibleList, result))
  console.log(search_question_not_answered(visibleList,result))
  return (
    <div className="container  mt-5 text-center">
      <a onClick={() => check_all_question_answered(visibleList,result) ? import_csv_result() : null }
         href={"#"+search_question_not_answered(visibleList, result)}
         className=""
      >
        <button className="btn btn-warning text-center w-100 shadow">
          Valider la checklist
        </button>
      </a>
    </div>
  )

  // href={"#" + !check_all_question_answered(visibleList, result) ? search_question_not_answered(visibleList, result) : ""}

}

export {ValidationButton}