import {useReducer, useState} from "react";
import "../styles/App.css";
import * as utils from "../utils/utils.js";
import {CreationAppNavbar} from "./creation_navbar.js";
import {CreateBox} from "./creation_box.js"
import {ChecklistItem} from "../main/checklist/item.js"
import {SectionTitle} from "../main/checklist/section_title.js";
import {CountingTable} from "../main/checklist/couting_table";

/*Creation App Function
* -Declare all the variables and function specific to creation route
* -Return the elements that allow the user to create/modify/delete checklists :
*  navbar specific to the create route, create box that allow to select/modify questions and save/delete checklists,
*  current checklist items for preview (and see directly modifications)
* */
export default function Creation_app({props}) {

  /* Main state variables, used in different routes :
  * -checklistList (array) : list containing the different checklists of the current patient path
  * -checklist (dict) : current checklist
  * -checklistId (number): id of the current checklist
  * -currentQuestion (dict): id of the question currently selected in creation box
  * -result (dict) :  results of the current checklist filling
  * -pbresult (dict) : results of the current checklist filling, but only the problematic answers
  * -visibleList (array) : list of the question visible at current time in checklist (not hidden by dynamism)
  * -isPreCheckDone (array) : contains the id's of the questions for which the precheck as been made
  * -commentMode (bool) : indicates if the question's comments are shown (and not hidden)
  * -debugMode (bool) : indicates if the dynamism is deactivated (all questions shown)
  * -precheckMode (bool) : indicates if we are in a mode where the system of question 'precheck'
  * is active -> not used in the current version by choice but implemented in the code
  * -warningId (number) : id of the first question not filled when validation button has been pushed
  * -isWaitingList (bool) : indicated if we are waiting the end of the get checklists call
  * */
  let [checklistList, setChecklistList] = useState(null)
  let [checklist, setChecklist] = useState(null)
  let [checklistId, setChecklistId] = useState(-1)
  let [currentQuestion, setCurrentQuestion] = useState(null)
  let [result, setResult] = useState({})
  let [pbresult, setPbResult] = useState({})
  let [visibleList, setVisibleList] = useState([])
  let [isPreCheckDone, setIsPreCheckDone] = useState([])
  let [commentMode, setCommentMode] = useState(true)
  let [debugMode, setDebugMode] = useState(false)
  let [precheckMode, setPrecheckMode] = useState(true)
  let [warningId, setWarningId] = useState(0)
  let [isWaitingList, setIsWaitingList] = useState(true)

  /*Function used when component update must be forced (in particular case, especially in creation app)*/
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  /* Initial set of isDict state variable
  * -init_dict : dict containing {0:true} for each possible answer (yes, no, etc), defined in utils.js
  * -isDict : dict containing, for each possible response defined in utils.js,
  * a dict containing the questions id's that have this response checked at this current time, for the current checklist
  * */
  let init_dict = {}
  utils.list_possible_answer.forEach(function (answer){init_dict[answer]={0:true}})
  const [isDict, setIsDict] = useState(init_dict)

  /* Reset the state variables who are dependent of the current checklist when we switch current checklist*/
  function reset (){
    setWarningId(0)
    setResult({})
    setPbResult({})
    let init_dict_ = {}
    utils.list_possible_answer.forEach(function (answer){init_dict_[answer]={0:true}})
    setIsDict(init_dict_)
    setIsPreCheckDone([])
  }

  /* Filter (check of the cond's) of the checklist  initial values (i.e. the questions at the first level of the tree)*/
  let values = null
  visibleList = []
  if (checklist && checklist.values) {
    values = values_filter_cond(checklist.values, isDict, {}, true)
    values.forEach(value => value.check.length ? visibleList.push(value.id): null)
  }

  /*Put all the dictionaries used by the checklist item in one variable*/
  let dicts = [isDict, setIsDict, null, result, pbresult, setResult, setPbResult, isPreCheckDone, setIsPreCheckDone, visibleList, setVisibleList, false, false ]

  /*Check what is the first not filled scan question, to active the scan component for it*/
  let next_scan_item = values ? values.filter(item => !result[item.id] && item.check.includes("scan")) : null
  let next_scan_item_id =  next_scan_item && next_scan_item.length ? next_scan_item[0].id : null

  return (
    <div>
        <div>
          {<CreationAppNavbar props = {{debugMode, setDebugMode, commentMode, setCommentMode}}/>}
          <div>
            <CreateBox props={{checklist, setChecklist, checklistList, setChecklistList, checklistId, setChecklistId,
              forceUpdate, currentQuestion, setCurrentQuestion, reset, setIsWaitingList}} />
            <div id={"title"}>
                {checklist ? <div>
                    {/*If checklist type is 0, counting table checklist so no item to show*/}
                    {checklist.type !== 0 ?
                      <div className={"container p-0 border-bottom border shadow-sm rounded "}>
                        {/*Return the different items with section title if needed*/}
                        {values ? values.map((i, index) => (
                            <div>
                              {i.section_title ? <SectionTitle section_title={i.section_title} index={index}/> :
                                <div className={"bg-primary " + (index ? " border-top" : "")}/>}
                              <div className=
                                     {"pb-3 px-3 pt-3 " +
                                       (index === values.length - 1 ? "rounded rounded-0-top " : null) +
                                       (index || i.section_title ? "" : " rounded rounded-0-bottom ") +
                                       (i.importance ? " iq-bg-danger" : " bg-color-custom")}>
                                <ChecklistItem key={JSON.stringify(checklistId) + i.id} init_items={checklist} item={i}
                                               dicts={dicts}
                                               forceUpdate={forceUpdate} values_filter_cond={values_filter_cond}
                                               creationMode={true}
                                               currentId={currentQuestion ? currentQuestion.id : null}
                                               warningId={warningId} precheckMode={precheckMode}
                                               is_root={true} alertList={[]}
                                               scan_bookmark={next_scan_item_id === i.id}
                                               checklist_name = {checklist.name}
                                />
                              </div>
                            </div>))
                          :
                          null}
                      </div>
                      :
                      <CountingTable result={result} setResult={setResult}/>
                    }</div>
                  :
                  <div>{isWaitingList ?
                    <div className="d-flex justify-content-center m-2">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    :
                    <div
                      className={"container iq-card bg-white mx-auto mb-0 mt-2 p-2 text-center shadow-sm border justify-content-center "}>
                      <div
                        className={"card-body iq-card mx-auto my-3 text-center p-2 shadow-sm border justify-content-center"}>
                        <h6 className="card-text text-danger m-0 p-0">
                          <div data-icon="&#xe063;" className="icon text-danger"> La checklist est introuvable, problème de connexion ()
                          </div>
                        </h6>
                      </div>
                    </div>
                  }</div>
                }

              </div>
          </div>

        </div>
    </div>
  );
}

/* Filter the values array (containing all the roots question of the checklist)
* by keeping only the values that validates all conditions
* We check all the response condition of the item
* (for ex, if item.cond contains {"yes": [1,4]}, we check if isDict["yes"] contains 1 and 4 )
* + all num conditions check
*/
function values_filter_cond(values, isDict, numDict, creationMode, debugMode) {
  return debugMode ? values : values.filter( item=>
      Object.keys(item.cond).every(
        function(answer){
          return (answer === "num" || !item.cond[answer] || item.cond[answer].every(
            function(elm) {return isDict[answer][elm];}
          ))
        }
      )
      && (creationMode || item.cond.num.every(
        function(elm) {
          return !numDict[elm.var] || utils.simple_operation(numDict[elm.var],elm.op, elm.val) }
      ))
  )
}



