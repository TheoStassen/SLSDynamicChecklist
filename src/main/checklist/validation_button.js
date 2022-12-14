import React from "react";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useState} from "react";

/*Component containing the button to send the checklist filled to backend, with some content verification*/
function ValidationButton ({visibleList, result, import_result, setWarningId, forceValidationMode}) {

  /*Check if all the visible question has been answered, if not, set warning id and return the question for href call*/
  function search_question_not_answered (visibleList, result, is_set){
    if (forceValidationMode)
      return ""
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

  /*Modal variables to control the show and close*/
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*If validation ok, import result and show succeed modal*/
  function handlevalidation (){
    import_result()
    handleShow()
  }



  return (
    <div className="container custom-container iq-card  mt-5 text-center p-2 mx-auto shadow-sm border ">
      {/*On click, check, if not correct redirect to the first not answered question*/}
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
            <Modal.Title>La checklist est validée</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Les résultats sont transmis au dossier patient
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

}

export {ValidationButton}