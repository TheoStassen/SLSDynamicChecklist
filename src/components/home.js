import {Html5Qrcode} from "html5-qrcode";
import React from "react";
import {useState} from "react";
import * as temp from "../utils/temporary_data"
import {Review} from "./review";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";


function Home ({checklistList, swapchecklist, scanValue, currentPatient, currentUser, is_local, pathId, numDict, journeyErrorCode}) {

  let [forceMode, setForceMode] = useState(false)
  let [reviewId, setReviewId] = useState(0)

  console.log("role id", currentUser.role_id, temp.role_cross_type[currentUser.role_id], checklistList)
  let filtered_checklist_list =  checklistList ? checklistList.filter(checklist => temp.role_cross_type[currentUser.role_id].includes(checklist.type)) : null
  const list_length = filtered_checklist_list ? filtered_checklist_list.length : 0

  console.log("home", filtered_checklist_list)

  const [show, setShow] = useState(false);

  const handleClose = () => { setShow(false)};
  const handleShow = () => setShow(true);


  const check_if_fillable = (id) => {
    if (!forceMode) {
      console.log("check")
      for (let i = 0; i < checklistList.length; i++) {
        console.log("check", checklistList[i], id)
        if (checklistList[i].fill !== true)
          return checklistList[i].id === id
      }
    }
    return true
  }

  const open_checklist = (checklist) => {
    window.scrollTo(0, 0); swapchecklist(checklist.id)
  }

  return (
    <div>
      {reviewId === 0 ?
        <div>
          {checklistList && currentPatient ? <div className="container">
            <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 mt-4 shadow-sm border justify-content-center "}>
              <div className="card-body">
                <h3 className="card-title text-dark m-0">Patient(e) : {currentPatient.firstname} {currentPatient.lastname} </h3>
                <h4 className="card-title text-secondary m-0">{currentPatient.dateofbirth}</h4>
                <img className={"border border-dark mt-2"} src={is_local ? currentPatient.photo : "http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128"/>
                <h4 className="card-text text-dark m-0">{ "Chirurgie " + (currentPatient.type === "major" ? "Majeure" : "Mineure" ) + (numDict.age < 19 ? " Enfant" : " Adulte")}</h4>
                <h4 className="card-text text-primary m-0">{currentPatient.intervention_name}</h4>
              </div>
            </div>
            <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 shadow-sm border justify-content-center "}>
              <div className="card-body m-0 p-2">
                <h4 className="card-title text-dark m-0 p-0">Attention <div data-icon="&#xe063;" className="icon text-danger"></div></h4>
                {!forceMode ? <h6 className="card-text text-secondary m-0 p-0">Vous devez choisir la prochaine checklist non remplie. Si vous souhaitez quand même en choisir une autre, appuyer ici.</h6>: null}
                {!forceMode ? <button className={"btn btn-warning m-0 mt-2 mb-1"} onClick={() => setForceMode(!forceMode)}>Autorise choix libre</button>: null}
                {forceMode ? <h6 className="card-text text-secondary m-0 p-0">Vous pouvez choisir la checklist que vous souhaitez</h6>: null}
                {forceMode ? <button className={"btn btn-warning m-0 mt-2 mb-1"} onClick={() => setForceMode(!forceMode)}>Ne plus autoriser</button>: null}
              </div>
            </div>
            <div className={"list-group text-center text-dark justify-content-center " + (list_length < 3 ? "list-group-horizontal":"")} >
              {filtered_checklist_list.map( (checklist, index) => (
                <div className={"list-group-item shadow-sm " + (list_length < 3 ? "col-sm-3 ":"col-sm-6 mx-auto list-group-item-rounded ") + (checklist.fill ? "iq-bg-success":"iq-bg-danger")}>
                  <h4>Checklist n° {checklist.id}</h4>
                  <p>{checklist.title}</p>
                  {checklist.fill ?
                    <button className=" btn btn-primary m-2 rounded" type="button" onClick={ function (){setReviewId(checklist.id)}}>
                      Revoir
                    </button>
                    :
                    <button className=" btn btn-primary m-2" type="button" onClick={() => check_if_fillable(checklist.id) ?  open_checklist(checklist)  : handleShow()}>
                      Remplir
                    </button>
                  }

                </div>
              ))}
            </div>
            {!list_length ? (
              <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 shadow-sm border justify-content-center "}>
                <h6 className="card-text text-dark m-0 p-0">Vous ne pouvez remplir aucune liste pour ce patient </h6>
              </div>
            ): null}
          </div>
          :
          <div className={"container iq-card bg-white mx-auto mb-0 mt-2 p-2 text-center shadow-sm border justify-content-center "}>
            <div className={"card-body iq-card mx-auto my-3 text-center p-2 shadow-sm border justify-content-center"}>
              <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun parcours patient n'est trouvé, problème de connexion ("{journeyErrorCode}") </div></h6>
            </div>
          </div>
          }
        </div>
        :
        <div>
          <Review is_local={is_local} pathId={pathId} checklistId={reviewId} setReviewId={setReviewId}/>
        </div>

      }
      <>
        <Modal show={show} onHide={handleClose} className={""}>
          <Modal.Header className={""} closeButton variant="white">
            <Modal.Title className={"text-danger"}>Attention</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Vous n'êtes pas sensé remplir cette checklist, mais celle qui suit dans l'ordre de remplissage,
            si vous voulez vraiment passer outre, autoriser le choix libre

          </Modal.Body>
          <Modal.Footer className={""}>

          </Modal.Footer>
        </Modal>
      </>
    </div>

  )
}

export {Home}