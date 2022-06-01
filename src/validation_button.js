import React from "react";
import * as utils from "./utils";
import {bindReporter} from "web-vitals/dist/modules/lib/bindReporter";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useState} from "react";

function check_all_question_answered (visibleList, result){
  return visibleList.every(
    function (elm){ return result[elm]}
  )
}



function ValidationButton ({visibleList, result, import_result, checklist, setWarningId, checklistList, setChecklistList, checklistId}) {

  function search_question_not_answered (visibleList, result, is_set){
    const visibleListsorted = visibleList.sort(function (elm1,elm2){return elm1>elm2})
    for (let i=0; i<visibleListsorted.length;i=i+1){
      if(!result[visibleListsorted[i]]){
        if (is_set) setWarningId(visibleListsorted[i])
        return i ? "question" + (visibleListsorted[i-1] ) : "title"
      }
    }
    if (is_set) setWarningId(0)
    return ""
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  function handlevalidation (){

    import_result()
    checklistList.filter(elm => elm.checklist_id === checklistId)[0].fill = true
    setChecklistList(checklistList)
    handleShow()
    console.log("handle validation end")
  }



  return (
    <div className="container custom-container iq-card  mt-5 text-center p-2 mx-auto shadow border border-dark">
      <a onClick={() => search_question_not_answered(visibleList, result, true) === "" ? handlevalidation(): null }
         href={"#" + search_question_not_answered(visibleList, result, false)}
         className=""
      >
        <div className="btn-group btn-group-lg w-100 " role="group" aria-label="Basic example">
          <button type="button" className="btn btn-warning w-100">Valider la checklist</button>
        </div>
      </a>
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton variant="white">
            <Modal.Title>La checklist a bien été validée</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Intitulé du problème
            Description du problème
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  )

  // href={"#" + !check_all_question_answered(visibleList, result) ? search_question_not_answered(visibleList, result) : ""}

}

export {ValidationButton}