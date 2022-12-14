import {useState} from "react";
import * as temp from "../../utils/temporary_data"
import {Review} from "../checklist/review";
import Modal from "react-bootstrap/Modal";

/*Component containing the patient information and the list of checklist of the journey, with button to open or review checklist*/
function Home ({checklistList, swapchecklist, currentPatient, currentUser,  pathId, numDict, navigate,checklistErrorCode}) {

  /* State variables used in home only
  * -forceMode : mode that allows to fill any checklist anytime
  * -reviewId : id of the checklist we want to review now
  * -isWaitingChecklist: indicates if we are waiting the checklist we want to open
  * */
  let [forceMode, setForceMode] = useState(false)
  let [reviewId, setReviewId] = useState(0)
  let [isWaitingChecklist, setIsWaitingChecklist] = useState(false)


  /*Filter the checklist list with only checklist that can be filled by the current user, depending on his type.*/
  let filtered_checklist_list =  checklistList ? checklistList.filter(checklist => temp.role_cross_type[currentUser.role_id].includes(checklist.type)) : null
  const list_length = filtered_checklist_list ? filtered_checklist_list.length : 0

  /*Modal variables for close or show the modal*/
  const [show, setShow] = useState(false);
  const handleClose = () => { setShow(false)};
  const handleShow = () => setShow(true);

  /*Check if the checklist can be open now (first checklist not filled, or force mode)*/
  const check_if_fillable = (id) => {
    if (!forceMode) {
      for (let i = 0; i < checklistList.length; i++) {
        if (checklistList[i].fill !== true)
          return checklistList[i].id === id
      }
    }
    return true
  }

  /*Function triggered when we want to open the checklist */
  const open_checklist = (checklist) => {
    setIsWaitingChecklist(true)
    window.scrollTo(0, 0);
    swapchecklist(checklist.id, navigate)
  }

  return (
    <div>
      {isWaitingChecklist && !checklistErrorCode ? <div className="d-flex justify-content-center m-2">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div> : null
      }
      {/*If reviewId, we show the review component of the corresponding checklist, and not the rest*/}
      {reviewId === 0 ?
        <div>
          {checklistList && currentPatient ? <div className="container">
            {/*Patient infos*/}
            <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 mt-4 shadow-sm border justify-content-center "}>
              <div className="card-body">
                <h3 className="card-title text-dark m-0">Patient(e) : {currentPatient.firstname} {currentPatient.lastname} </h3>
                <h4 className="card-title text-secondary m-0">{currentPatient.dateofbirth}</h4>
                <img className={"border border-dark mt-2"} src={"http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128"/>
                <h4 className="card-text text-dark m-0">{ "Chirurgie " + (currentPatient.type === "major" ? "Majeure" : "Mineure" ) + (numDict.age < 19 ? " Enfant" : " Adulte")}</h4>
                <h4 className="card-text text-primary m-0">{currentPatient.intervention_name}</h4>
              </div>
            </div>
            {/*Information panel were we explain that user need to open the first not completed checklist. Button for trigger the force mode if needed*/}
            <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 shadow-sm border justify-content-center "}>
              <div className="card-body m-0 p-2">
                <h4 className="card-title text-dark m-0 p-0">Attention <div data-icon="&#xe063;" className="icon text-danger"></div></h4>
                {!forceMode ? <h6 className="card-text text-secondary m-0 p-0">Vous devez choisir la prochaine checklist non remplie. Si vous souhaitez quand même en choisir une autre, appuyer ici.</h6>: null}
                {!forceMode ? <button className={"btn btn-warning m-0 mt-2 mb-1"} onClick={() => setForceMode(!forceMode)}>Autorise choix libre</button>: null}
                {forceMode ? <h6 className="card-text text-secondary m-0 p-0">Vous pouvez choisir la checklist que vous souhaitez</h6>: null}
                {forceMode ? <button className={"btn btn-warning m-0 mt-2 mb-1"} onClick={() => setForceMode(!forceMode)}>Ne plus autoriser</button>: null}
              </div>
            </div>
            {/*Open/Review (if already filled) Checklist buttons list*/}
            <div className={"list-group text-center text-dark justify-content-center " + (list_length < 3 ? "list-group-horizontal":"")} >
              {filtered_checklist_list.map( (checklist, index) => (
                <div className={"list-group-item shadow-sm " + (list_length < 3 ? "col-sm-3 ":"col-sm-6 mx-auto list-group-item-rounded ") + (checklist.fill ? "iq-bg-success":"iq-bg-danger")}>
                  <h4>Checklist n° {checklist.id}</h4>
                  <p>{checklist.title}</p>
                  {checklist.fill ?
                    <div>{checklist.type !== 0 ?
                      <button className=" btn btn-primary m-2 rounded" type="button" onClick={ function (){setReviewId(checklist.id)}}>
                        Revoir
                      </button> : null}
                    </div>
                    :
                    <button className=" btn btn-primary m-2" type="button" onClick={() => check_if_fillable(checklist.id) ?  open_checklist(checklist)  : handleShow()}>
                      Remplir
                    </button>
                  }

                </div>
              ))}
            </div>
            {/*If checklist list empty*/}
            {!list_length ? (
              <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 shadow-sm border justify-content-center "}>
                <h6 className="card-text text-dark m-0 p-0">Vous ne pouvez remplir aucune liste pour ce patient </h6>
              </div>
            ): null}
          </div>
          :
          /*If no patient journey*/
          <div className={"container iq-card bg-white mx-auto mb-0 mt-2 p-2 text-center shadow-sm border justify-content-center "}>
            <div className={"card-body iq-card mx-auto my-3 text-center p-2 shadow-sm border justify-content-center"}>
              <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun parcours patient n'est trouvé, problème de connexion </div></h6>
            </div>
          </div>
          }
        </div>
        :
        <div>
          <Review pathId={pathId} checklistId={reviewId} setReviewId={setReviewId}/>
        </div>

      }
      {/*Modal that show up if we try to open a checklist we cant*/}
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