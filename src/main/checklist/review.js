import {useEffect, useState} from "react";
import * as calls from "../../calls";
import React from "react";
import * as utils from "../../utils/utils";
import {SectionTitle} from "./section_title";

/*Function that show the results of a checklist filling, with visual very similar to checklist*/
function Review ({ pathId, checklistId, setReviewId}) {

  /* State variables used in review item component only
   -currentEvals : contains the evaluations (checklist fillings)
   -isWaitingReview : indicates if we are waiting the evaluations
* */
  let [currentEvals, setCurrentEvals] = useState(null)
  let [isWaitingReview, setIsWaitingReview] = useState(false)

  /*Function triggered every time a state variable change */
  useEffect(() => {
    setIsWaitingReview(true)
    calls.getevaluation(pathId, setIsWaitingReview,null, null, null,setCurrentEvals) //temp
  }, [])

  /*Take the evaluation corrresponding to current checklist id */
  let current_eval = currentEvals ? currentEvals.filter(elm => elm.checklist.id === checklistId)[0] : null

  /*Change the format of evals*/
  if (currentEvals && typeof currentEvals.filter(elm => elm.checklist.id === checklistId)[0].checklist.items[0].check === 'string') {
    currentEvals.filter(elm => elm.checklist.id === checklistId)[0].checklist.items.forEach(item => {
      item.check = JSON.parse(item.check)
      item.color = JSON.parse(item.color)
      item.cond = JSON.parse(item.cond)
    })
  }

  /*Check if the question with item_id must be put in red*/
  const check_is_danger = (item_id) => {
    const correspond_answers = current_eval.answers.filter(answer => answer.item_id === item_id)
    if (correspond_answers && correspond_answers.length)
      return correspond_answers[0].is_pb
  }

  return (
    <div >
      {isWaitingReview? <div className="d-flex justify-content-center m-2">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> : null
      }
      {/*Go back button*/}
      <div className={"iq-card bg-white col-sm-4 mx-auto text-center p-2 shadow-sm border justify-content-center mt-4 row"}>
        <button className=" btn btn-secondary m-2" type="button" onClick={ function (){setReviewId(0)}}>
          <h5 data-icon="&#xe03d;" className="icon text-white">&nbsp; Revenir à la liste</h5>
        </button>
      </div>
      {/*Take the checklist questions of the current eval, if the question has been answered in current eval answers,
      put the question and the answer*/}
      <div className={"container p-0 border-bottom border shadow-sm rounded mt-4"}>
        {current_eval ? current_eval.checklist.items.map((item,index) => (
          <div> { current_eval.answers.filter(answer => answer.item_id === item.itemId).length ?
            <div>
              {item.section_title ?
                <SectionTitle section_title={item.section_title} index={index}/> :
                <div className={"bg-primary " + (index ? " border-top" : "")}/>
              }
              <div className=
                     {"pb-3 px-3 pt-3 " +
                       (index === current_eval.checklist.items.length - 1 ? "rounded rounded-0-top " : null) +
                       (index || item.section_title ? "" : " rounded rounded-0-bottom ") +
                       (item.importance ? " iq-bg-danger" : " bg-color-custom")}>
                <div className={"container p-0 mx-auto " }>
                  <div id={"question"+item.id} className={"row align-items-center m-0 p-0"}>
                    {/*Item Id*/}
                    <div className="col list-group list-group-horizontal m-0 p-0 w-auto">
                      <div className={"list-group-item m-0 p-0 text-center shadow-sm my-auto " + ( check_is_danger(item.itemId)  ? "bg-danger" : "bg-primary")} >
                        <h5 className="card-body p-auto text-white">
                          {item.itemId}
                        </h5>
                      </div>

                      {/*Item name*/}
                      <div className="list-group-item m-0 p-0 w-100 shadow-sm h-auto text-dark bg- "  >
                        <div className="card-body my-auto">
                          {item.name.split("_")[0]}
                        </div>
                      </div>
                    </div>

                    {/*Item answers (if any, if not empty col), very similar to item.js*/}
                    {item.check.length ? (
                      <div className="col-sm-auto p-0 pl-3">
                        <div className={"row px-3"}>
                          {/*Split the checkbox answers in two part for visual reason*/}
                          <div className="list-group list-group-horizontal ">
                            {item.check.map((elm, index) =>
                              index < 3 && !["text","list", "date", "hour", "scan", "signature", "number"].includes(elm.split("_")[0]) ?
                                <label key={index} className={"list-group-item list-group-item-custom btn m-0" + (item.color && item.color[index] === 0 ? " btn-outline-success" : (item.color && item.color[index] === 1 ? " btn-outline-danger" : " btn-outline-secondary"))} >
                                  <input  type="checkbox"
                                          aria-label="Checkbox"
                                          checked={(current_eval.answers.filter(answer => answer.item_id === item.itemId)[0]).answer.includes(elm) ? 1:0}
                                  />
                                  &nbsp;{utils.trad_answer(elm)}
                                </label>
                                : null
                            )}
                          </div>

                          <div className="list-group list-group-horizontal ">
                            {item.check.map((elm, index) =>
                              index >= 3 && !["text","list", "date", "hour", "scan", "signature", "number"].includes(elm.split("_")[0]) ?
                                <label key={index} className={"list-group-item list-group-item-custom btn m-0" + (item.color && item.color[index] === 0 ? " btn-outline-success" : (item.color && item.color[index] === 1 ? " btn-outline-danger" : " btn-outline-secondary"))} >
                                  <input  type="checkbox"
                                          aria-label="Checkbox"
                                          checked={(current_eval.answers.filter(answer => answer.item_id === item.itemId)[0]).answer.includes(elm) ? 1:0}
                                  />
                                  &nbsp;{utils.trad_answer(elm)}
                                </label>
                                : null
                            )}
                          </div>
                        </div>

                        {/*If item answers must contain text, put a text input*/}
                        {item.check.includes("text") || item.check.includes("hour") || item.check.includes("date") ||
                        item.check.includes("number") || item.check.includes("scan") || item.check[0].split("_").includes("list") ? (
                          <div className=""  >
                            <input className="form-control w-100 mb-0 bg-white" type={"text"}
                                   placeholder={current_eval.answers.filter(answer => answer.item_id === item.itemId).length &&
                                     current_eval.answers.filter(answer => answer.item_id === item.itemId)[0].answer}
                            />
                          </div>
                        ) : null }

                      </div>
                    ) : <div className="col-sm-6"> {null} </div>}
                  </div>
                </div>
              </div>
            </div>
          : null}</div>
        )) : null}
      </div>
    </div>
  )
}

export {Review}