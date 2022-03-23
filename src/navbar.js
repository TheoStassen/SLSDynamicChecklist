import React from "react";
import * as utils from "./utils";
import * as temp_data from "./temporary_data";

/* Component of the upper navbar of the webpage
* -setCreationMode: bool indicating if we are in creation mode set function
* -setCreditMode: bool indicating if we are in credit mode set function
* -trimmedCanvasUrl: the canvas url data of the signature
* -result: dict containing the results of the current checklist check-in
* -checklistList: List containing the different checklists
* -swapchecklist: function that changes the current checklist
* */
function AppNavbar ({props}) {

  let {creationMode, setCreationMode, creditMode, setCreditMode, setCommentMode, commentMode, setDebugMode, debugMode, trimmedCanvasUrl, checklistList, swapchecklist, reset, forceUpdate, import_csv_result, result, setCurrentQuestion, checklist, homeMode, setHomeMode, setChecklistList, setScanValue, setCurrentPatient} = props;

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
    if (creationMode)
      deactivatecreatemode()
    else
      activatecreatemode()
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
    if (main_menu){
      setChecklistList(null)
      setScanValue(null)
    }
  }

  const setdefault = () => {
    setChecklistList(temp_data.checklist_list[0].checklists)
    setCurrentPatient(temp_data.checklist_list[0].patient)
  }

  /*Return the different elements of the navbar*/
  return (
    <div className="iq-top-navbar h-auto " >
      <div className="iq-navbar-custom py-2">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          {/*Navbar Title*/}
          <div className="navbar-brand pl-4">
            <a href="#" onClick={gotohome}>
              <span>SLS</span>
            </a>
          </div>
          {/*/!*Navbar Toggler button*!/*/}
          <label className="navbar-toggler p-0 m-0" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                  aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </label>
          {/*/!*Navbar links*!/*/}
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav  p-2 pl-4">
              {!checklistList ? <label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => setdefault()}>Passer le QRcode</label> : null}
              {checklistList ?<label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => gotohome(true)}>Revenir à l'accueil</label> : null}
              {checklistList && !homeMode ?<label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => gotohome(false)}>Revenir à la sélection des checklists</label> : null}
              {checklistList && !homeMode ?<label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={import_csv_result}>Importer les résultats de la checklist</label> : null}
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
              <li className="nav-item dropdown">
                <label className="nav-link dropdown-toggle m-0" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-expanded="false">
                  Options
                </label>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show">
                      <input type="checkbox" checked={creationMode} onClick={changecreationmode}/>
                      &nbsp; Mode création
                    </label>
                  </li>
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
              <label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={activatecreditmode}>A propos</label>
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