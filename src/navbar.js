import React, {useState} from "react";
import * as utils from "./utils";
import Modal from 'react-bootstrap/Modal'
import * as temp_data from "./temporary_data";
import {Button} from "react-bootstrap";
import axios from "axios";

/* Component of the upper navbar of the webpage
* -setCreationMode: bool indicating if we are in creation mode set function
* -setCreditMode: bool indicating if we are in credit mode set function
* -trimmedCanvasUrl: the canvas url data of the signature
* -result: dict containing the results of the current checklist check-in
* -checklistList: List containing the different checklists
* -swapchecklist: function that changes the current checklist
* */
function AppNavbar ({props}) {

  let {creationMode, setCreationMode, creditMode, setCreditMode, setCommentMode, commentMode, setDebugMode, debugMode, trimmedCanvasUrl, checklistList, swapchecklist, reset, forceUpdate, import_csv_result, result, setCurrentQuestion, checklist, homeMode, setHomeMode, setChecklistList, setScanValue, setCurrentPatient, setUserCode, setScanValueError} = props;

  /*Function triggered when we want to download the signature as .png file if there is a canvas url data*/
  const image_download = () => {
    if(trimmedCanvasUrl)
      downloadImage(trimmedCanvasUrl, "image.png");
  }

  /*Activate the creation mode*/
  const activatecreatemode = () => {
    setCreationMode(true)
  }

  /*Deactivate the creation mode*/
  const deactivatecreatemode = () => {
    setCreationMode(false)
    setCurrentQuestion(checklist && checklist.values.length ? checklist.values[0] : null)
  }

  const changecreationmode = () => {
    if (creationMode) {
      deactivatecreatemode()
      gotohome(true)
    }
    else{
      activatecreatemode()
      setHomeMode(false)
    }
  }

  /*Activate the credit mode*/
  const activatecreditmode = () => {
    setCreditMode(true)
  }

  /*Deactivate the creation mode*/
  const deactivatecreditmode = () => {
    setCreditMode(false)
  }

  const changecommentmode = () => {
    setCommentMode(!commentMode)
  }

  const changedebugmode = () => {
    setDebugMode(!debugMode)
  }

  const gotohome = (main_menu) => {
    deactivatecreditmode();
    deactivatecreatemode()
    setHomeMode(true)
    setScanValueError(null)
    if (main_menu){
      setChecklistList(null)
      setScanValue(null)
      setCurrentPatient(null)
      setUserCode(null)
    }
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [problemName, setProblemName] = useState("")
  const [problemDescription, setProblemDescription] = useState("")

  const handleName = (event) => setProblemName(event.target.value);
  const handleDescription = (event) => setProblemDescription(event.target.value);
  const handleSave = () => {
    setShow(false);
    axios.post('#', {name:problemName, description:problemDescription}) //Random url, just to simulate the fact that we need to make get call to add checklist
      .then(function(response){
      })
  }

  /*Return the different elements of the navbar*/
  return (
    <div className="iq-top-navbar h-auto" >
      <div className="iq-navbar-custom py-2">
        <nav className="navbar navbar-expand-lg navbar-light p-0 ">
          {/*Navbar Title*/}
          <div className="navbar-brand pl-4">
            <a href="#" onClick={() => gotohome(true)}>
              <span>SLS</span>
            </a>
          </div>
          {/*/!*Navbar Toggler button*!/*/}
          <button className="navbar-toggler p-0" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                  aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/*/!*Navbar links*!/*/}
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav  p-2 pl-4">
              {/*{!creationMode && !checklistList ? <label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => setdefault()}>Passer le QRcode</label> : null}*/}
              {checklistList ?<label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => gotohome(true)}>Revenir à l'accueil</label> : null}
              {!creationMode && checklistList && !homeMode ?<label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => gotohome(false)}>Revenir à la sélection des checklists</label> : null}
              {checklistList && !homeMode ?<label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={import_csv_result}>Importer les résultats de la checklist</label> : null}
              {!creationMode ?<label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => changecreationmode()}>Activer Mode Création</label> : null}
              {creationMode ?<label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => changecreationmode()}>Désactiver Mode Création</label> : null}

              {/*<label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={image_download}>Importer la signature</label>*/}
              {/*Navbar checklist selection dropdown link*/}
              {/*<li className="nav-item dropdown">*/}
              {/*  <label className="nav-link dropdown-toggle m-0" id="navbarDropdown" role="button"*/}
              {/*     data-toggle="dropdown" aria-expanded="false">*/}
              {/*    Liste des checklists disponibles*/}
              {/*  </label>*/}
              {/*  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">*/}
              {/*    {checklistList ? checklistList.map((i, index) => (*/}
              {/*      <li key={index}><label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={function (){swapchecklist(i.checklist_id) } }>{i.name}</label></li>*/}
              {/*    )): null}*/}
              {/*  </ul>*/}
              {/*</li>*/}
              <li className="nav-item dropdown my-auto">
                <label className="nav-link dropdown-toggle m-0" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-expanded="false">
                  Options
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
              <label className="nav-link m-0 my-auto" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={activatecreditmode}>A propos</label>

              <div className="nav-link m-0">
                <>
                  <Button variant="warning" onClick={handleShow}>
                    Signaler évènement
                  </Button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton variant="white">
                      <Modal.Title>Signalement d'évènements indésirables</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Intitulé du problème
                      <input  className="form-control w-100 mb-0" type = "text " aria-label="text input" value={problemName} onChange={handleName}/>
                      Description du problème
                      <textarea className="form-control form-control-custom textarea" rows="4" value={problemDescription} onChange={handleDescription}/>
                    </Modal.Body>
                    <Modal.Footer>
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
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

/*Download a data in a file with defined filename*/
const downloadImage = function(data, filename) {
  let a = document.createElement('a');
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
};

export {AppNavbar}