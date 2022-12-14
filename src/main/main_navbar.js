import React, {useState} from "react";
import {Outlet, useNavigate} from "react-router-dom"
import Modal from 'react-bootstrap/Modal'
import {Button} from "react-bootstrap";
import axios from "axios";
import * as calls from "../calls";
import {Link} from "react-router-dom";

/* Main Navbar function
* -Declare all the variables and function specific to main/ routes
* -Return the elements composing the upper navbar of the screen in main/ routes */
function AppNavbar ({props}) {
  /*Props from App */
  let { setCommentMode, commentMode, setDebugMode, debugMode, checklistList, forceUpdate, checklist, setChecklistList,
    setCurrentPatient, setCurrentUser, currentPatient, setPathId, currentUser, setLoginInfo, setIsLogin,
    setJourneyErrorCode} = props;

  /*Function used to navigate between routes*/
  let navigate = useNavigate()

  /*Function used to logout the user*/
  function logout (){
    calls.postdisconnection(setLoginInfo, setIsLogin, setCurrentUser, navigate)
  }

  /*Function to change the comment mode*/
  const changecommentmode = () => {
    setCommentMode(!commentMode)
  }

  /*Function to change the debug mode*/
  const changedebugmode = () => {
    setDebugMode(!debugMode)
  }

  /*Function to return backwards (if main_menu true, to root page, if false, to menu page)*/
  const gotohome = (main_menu) => {
    if (main_menu){
      setChecklistList(null)
      setCurrentPatient(null)
      navigate("/")
    }
    else{
      calls.getjourney( currentPatient, setCurrentPatient, setPathId,setChecklistList, setJourneyErrorCode, navigate)
    }
  }

  /*Variables and functions used to handle the indesirable events survey modal (open, close, save survey*/
  const [show, setShow] = useState(false);
  const [problemName, setProblemName] = useState([])
  const [problemDescription, setProblemDescription] = useState("")
  const handleClose = () => {setProblemName([]) ; setProblemDescription(null) ; setShow(false)};
  const handleShow = () => setShow(true);
  const handleName = (name, index) => {
    problemName.splice(index);problemName.push(name);
    setProblemName(problemName); forceUpdate()
  };
  const handleDescription = (event) => setProblemDescription(event.target.value);
  const handleSave = () => {
    setShow(false); setProblemName(null) ; setProblemDescription(null) ;
    axios.post('#', {name:problemName, description:problemDescription})
      .then(function(response){
        //TODO : the undesirable events post call is not implemented in backend, but the frontend part is implemented
      })
  }

  /*Example of undesirable events to be used by the modal TODO : allow admin to control the undesirable events tree */
  let undesirable_events =
    {
      "Patient":
        {
          "Arrivée Tardive": null,
          "Mauvaise Préparation":
            {
              "Prothèses en place": null,
              "Bijoux, piercings, .. en place": null,
              "N'a pas uriné": null,
              "Préparation cutanée incorrecte": null
            }
        },
      "Brancardage": {"Patient pas prêt": null},
      "Dossier": {"Pas de consentement": null, "Pas de prenarcose": null}
    }

  /*Function used to compute the current user initials, to be shown in indicative bubble*/
  let current_user_initials = null
  if (currentUser) {
    const current_user_split_name = currentUser.name.split(" ")
    current_user_initials = [current_user_split_name[0][0], current_user_split_name[1][0]]
  }

  /*Function that return the recursive component used to select undesirable events, following the event tree*/
  const indesirable_event_dropdowns = (undesirable_event_dict, index) => {
    if (!undesirable_event_dict) { return null}
    return (
    <div>
      <div className={"row my-2"}>
        <div className="col-sm-6 dropdown text-center m-0 my-2">
          <button className="btn btn-primary dropdown-toggle  " type="button" id={"dropdownMenuButton"+index}
                  data-toggle="dropdown" aria-expanded="false">
            Sélectionnez le problème
          </button>
          <ul className="dropdown-menu" aria-labelledby={"dropdownMenuButton"+index}>
            {Object.keys(undesirable_event_dict).map((i, nb) => (
              <li key={nb}><label className="dropdown-item " onClick={() => handleName(i, index)}>{i}</label></li>
            ))}
          </ul>
        </div>
        {problemName && problemName[index] ?
          <div className={"col-sm-5 iq-card iq-bg-secondary w-100 text-center my-auto border shadow-sm "}>
            {problemName[index]}
          </div> : null}
      </div>
    {indesirable_event_dropdowns(undesirable_event_dict[problemName[index]], index+1)}
    </div>
    )
  }

  /*Return the different elements of the navbar*/
  return (
    <div>
      <div className="iq-top-navbar h-auto border" >
      <div className="iq-navbar-custom py-2">
        <nav className="navbar navbar-expand-lg navbar-light p-0 ">
          {/*Navbar Title*/}
          <div className="navbar-brand pl-4 custom-logo">
            <a href="#" onClick={() => gotohome(true)}>
              <span><img className={"w-100"} src={process.env.REACT_APP_PUBLIC_BASE_URL + "photos/logo_dynalist_v2.png"}/></span>
            </a>
          </div>
          {/*/!*Navbar Toggler button*!/*/}
          <button className="navbar-toggler p-0" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                  aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/*/!*Navbar items*!/*/}
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav  p-2 pl-2">

              {checklistList ?
                <label className="nav-link m-0 my-auto mx-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => gotohome(true)}>
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="q" className="icon mb-1 mr-0"/>
                    <span>Retour à l'accueil</span>
                  </a>
                </label> : null}

              { checklistList && checklist ?
                <label className="nav-link m-0 my-auto mx-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => gotohome(false)}>
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="&#xe05b;" className="icon mb-1 mr-0"/>
                    <span>Retour à la sélection</span>
                  </a>
                </label> : null}

              <label className="nav-link m-0 my-auto mx-auto" >
                <Link className={"nav-link-color"} to={"/creation"}>
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="L" className="icon mb-1 mr-0"/>
                    <span>Mode Création</span>
                  </a>
                </Link></label>

              <li className="nav-item dropdown my-auto mx-auto">
                <label className="nav-link dropdown-toggle m-0" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-expanded="false">
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="&#xe040;" className="icon mb-1 mr-0"/>
                    <span>Options</span>
                  </a>
                </label>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show">
                      <input type="checkbox" checked={!debugMode} onClick={changedebugmode}/>
                      &nbsp; Activer le dynamisme
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show">
                      <input type="checkbox" checked={commentMode} onClick={changecommentmode}/>
                      &nbsp; Activer les commentaires
                    </label>
                  </li>
                </ul>
              </li>

              <label className="nav-link m-0 my-auto mx-auto" data-toggle="collapse" data-target=".navbar-collapse.show">
                <Link className={"nav-link-color"} to={"/main/credits"}>
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="&#xe03a;" className="icon mb-1 mr-0"></div>
                    <span>À propos</span>
                  </a>
                </Link>
              </label>

              {/*link item triggering a modal component*/}
              <div className="nav-link m-0 mx-auto my-auto">
                <>
                  <Button variant="warning" onClick={handleShow}>
                    Signaler évènement
                  </Button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header className={""} closeButton variant="white">
                      <Modal.Title className={"text-dark"}>Signalement d'évènements indésirables</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Type de problème
                      <div className={""}>
                        {/*Recursive call for the undesirable event tree*/}
                        {indesirable_event_dropdowns(undesirable_events, 0)}
                      </div>
                      Description du problème
                      <textarea className="form-control form-control-custom textarea" rows="4" value={problemDescription} onChange={handleDescription}/>
                    </Modal.Body>
                    <Modal.Footer className={""}>
                      <Button variant="secondary" onClick={handleClose}>
                        Fermer
                      </Button>
                      <Button variant="primary" onClick={handleSave}>
                        Sauvegarder
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              </div>

              {current_user_initials ?
                <div className={"nav-link  mx-auto my-auto"}>
                  <div className={"initial-avatar text-white bg-primary border border-dark-big my-auto mx-auto"}>{current_user_initials}</div>
                </div> : null}
              {current_user_initials ?
                <div className={"nav-link  mx-auto my-auto"}>
                  <button className={"btn btn-danger rounded my-auto mx-auto"} onClick={function (){logout(); window.scrollTo(0, 0);}}>
                  Se déconnecter </button>
                </div> : null}
            </div>
          </div>
        </nav>
      </div>
    </div>
      <Outlet/>
    </div>
  )
}

export {AppNavbar}