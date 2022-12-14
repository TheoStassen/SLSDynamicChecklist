import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom"
import * as calls from "../../calls";
import {useState} from "react";
import {Home} from "./home";

/*Menu App Function,
* -Declare all the variables and function specific to menu route
* -Return the elements that allow the user to select a checklist in the current journey checklists :
*  home component that show the list */
export default function MenuApp({props}) {
  /*Props from App */
  let {checklistList,currentPatient,currentUser,pathId,numDict, checklist, setChecklist,alertList, setAlertList,setChecklistId} = props

  /* State variables used in menu route only
* -checklistErrorCode (string) : string containing error prompt if a get checklist call fail.
* */
  let [checklistErrorCode, setChecklistErrorCode] = useState(null)

  /*Function used to navigate between routes*/
  let navigate = useNavigate()

  /* Function that switch current checklist*/
  const swapchecklist = (checklist_id, navigate) => {
    calls.getchecklist(checklist_id, checklist, setChecklist, checklistList, alertList, setAlertList, pathId, setChecklistErrorCode,setChecklistId, navigate)
    return checklist
  }

  /*Function triggered only when the component is mount */
  useEffect(() => {
    if(!currentUser)
      /*If no current user, we are not supposed to be here, we go back to login route*/
      navigate("/login")

  }, [])

  return (
    <div>
      {checklistErrorCode ?
      <div className={"container iq-card bg-white mx-auto mb-0 mt-2 p-2 text-center shadow-sm border justify-content-center "}>
        <div className={"card-body iq-card mx-auto my-3 text-center p-2 shadow-sm border justify-content-center"}>
          <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> La checklist est introuvable, problème de connexion ("{checklistErrorCode}") </div></h6>
        </div>
      </div> : null}
      {currentUser ? <Home checklistList={checklistList}
              swapchecklist={swapchecklist}
              currentPatient={currentPatient}
              currentUser={currentUser}
              pathId={pathId}
              numDict={numDict}
              navigate={navigate}
              checklistErrorCode={checklistErrorCode}/>
        : null }

    </div>
  )
}
