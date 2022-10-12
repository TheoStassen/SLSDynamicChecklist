import {useEffect, useState} from "react";
import * as calls from "../calls";
import {index} from "mathjs";
import React from "react";
import * as utils from "../utils/utils";
import BootstrapSelect from "react-bootstrap-select-dropdown";
import {SectionTitle} from "./section_title";


function Review ({is_local, pathId, checklistId, setReviewId}) {

  let [currentEvals, setCurrentEvals] = useState(null)

  useEffect(() => {
    if (!is_local) calls.getevaluation(setCurrentEvals,pathId) //temp

  }, [])

  // let [last_evaluation, set_last_evaluation ] = useState(null)

  let current_eval = currentEvals ? currentEvals.filter(elm => elm.checklist.id === checklistId)[0] : null

  if (currentEvals && typeof currentEvals.filter(elm => elm.checklist.id === checklistId)[0].checklist.items[0].check === 'string') {
    currentEvals.filter(elm => elm.checklist.id === checklistId)[0].checklist.items.forEach(item => {
      item.check = JSON.parse(item.check)
      item.color = JSON.parse(item.color)
      item.cond = JSON.parse(item.cond)
    })
    // set_last_evaluation(last_evaluation)
  }

  const check_is_danger = (item_id) => {
    const correspond_answers = current_eval.answers.filter(answer => answer.item_id === item_id)
    if (correspond_answers && correspond_answers.length)
      return correspond_answers[0].is_pb
  }

  if(current_eval) current_eval.checklist.items.forEach(item => console.log(current_eval.answers.filter(answer => answer.item_id === item.itemId)[0]))

  return (
    <div >
      <div className={"iq-card bg-white col-sm-4 mx-auto text-center p-2 shadow-sm border justify-content-center mt-4 row"}>

        <button className=" btn btn-secondary m-2" type="button" onClick={ function (){setReviewId(0)}}>
          <h5 data-icon="&#xe03d;" className="icon text-white">&nbsp; Revenir à la liste</h5>

        </button>
      </div>
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
                        {/*Item comment (above the item name)*/}
                      </div>
                    </div>

                    {/*Item answers (if any, if not empty col)*/}
                    {item.check.length ? (
                      <div className="col-sm-auto p-0 pl-3">
                        <div className={"row px-3"}>
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
                            {/*For each possible answer, if in item.check, we put a checkbox*/}
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

                            {/*Item comment (above the item name)*/}
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