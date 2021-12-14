import React from "react";
import * as utils from "./utils";

/* Component of the upper navbar of the webpage
* -setCreationMode: bool indicating if we are in creation mode set function
* -setCreditMode: bool indicating if we are in credit mode set function
* -trimmedCanvasUrl: the canvas url data of the signature
* -result: dict containing the results of the current checklist check-in
* -checklistList: List containing the different checklists
* -swapchecklist: function that changes the current checklist
* */
function AppNavbar ({props}) {

  let {setCreationMode, setCreditMode, trimmedCanvasUrl, result, checklistList, swapchecklist} = props;

  /*Function triggered when we want to download the signature as .png file if there is a canvas url data*/
  const image_download = () => {
    if(trimmedCanvasUrl)
      downloadImage(trimmedCanvasUrl, "image.png");
  }

  /*Create a table containing results and export it as .csv file*/
  function import_csv_result () {
    let result_table = [["id", "name", "answer"]]
    for (const [key, value] of Object.entries(result)){
      result_table.push([key, value.name, value.answer])
    }
    let csvGenerator = new utils.CsvGenerator(result_table, 'my_csv.csv');
    csvGenerator.download(true);
  }

  /*Activate the creation mode*/
  const activatecreatemode = () => {
    setCreationMode(1)
  }

  /*Deactivate the creation mode*/
  const deactivatecreatemode = () => {
    setCreationMode(0)
  }

  /*Activate the credit mode*/
  const activatecreditmode = () => {
    setCreditMode(1)
  }

  /*Deactivate the creation mode*/
  const deactivatecreditmode = () => {
    setCreditMode(0)
  }

  /*Return the different elements of the navbar*/
  return (
    <div className="iq-top-navbar h-auto " >
      <div className="iq-navbar-custom py-2">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          {/*Navbar Title*/}
          <div className="navbar-brand pl-4">
            <a href="#" onClick={deactivatecreditmode}>
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
              <label className="nav-link active m-0" aria-current="page" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={deactivatecreditmode}>Page d'accueil</label>
              <label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={import_csv_result}>Importer la checklist</label>
              <label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={image_download}>Importer la signature</label>
              {/*Navbar checklist selection dropdown link*/}
              <li className="nav-item dropdown">
                <label className="nav-link dropdown-toggle m-0" id="navbarDropdown" role="button"
                   data-toggle="dropdown" aria-expanded="false">
                  Liste des checklists disponibles
                </label>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {checklistList.map((i, index) => (
                    <li key={index}><label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => swapchecklist(i.checklist_id)}>Checklist n°{i.checklist_id}</label></li>
                  ))}
                </ul>
              </li>
              <label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show"  onClick={activatecreatemode}>Activer le mode Création</label>
              <label className="nav-link m-0" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={deactivatecreatemode}>Désactiver le mode Création</label>
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