import {Html5Qrcode} from "html5-qrcode";
import React from "react";
import {useState} from "react";


function Home ({checklistList, swapchecklist, scanValue, currentPatient, is_local}) {

  let [forceMode, setForceMode] = useState(false)

  const list_length = checklistList ? checklistList.length : 0

  console.log("home", checklistList)

  const check_if_fillable = (id) => {
    if (!forceMode) {
      for (let i = 0; i < checklistList.length; i++) {
        if (checklistList[i].fill === false)
          return checklistList[i].id === id
      }
    }
    return true
  }

  return (<div>
    {checklistList && currentPatient ? <div className="container">
      <div className={"iq-card bg-white col-sm-6 mx-auto text-center p-2 mt-4 shadow-sm border justify-content-center "}>
        <div className="card-body">
          <h3 className="card-title text-dark m-0">Patient(e) : {currentPatient.firstname} {currentPatient.lastname} </h3>
          <h4 className="card-title text-primary m-0">{currentPatient.dateofbirth}</h4>
          <h4 className="card-title text-secondary m-0">{currentPatient.intervention_name}</h4>
          <img className={"border border-dark mt-2"} src={is_local ? currentPatient.photo : "http://checklists.metoui.be/storage/"+currentPatient.photo} width="128" height="128"/>
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
        {checklistList.map( (checklist, index) => (
          <div className={"list-group-item shadow-sm " + (list_length < 3 ? "col-sm-3 ":"col-sm-6 mx-auto list-group-item-rounded ") + (checklist.fill ? "iq-bg-success":"iq-bg-danger")}>
            <h4>Checklist n° {checklist.id}</h4>
            <p>{checklist.name}</p>
            <button className=" btn btn-primary m-2" type="button" onClick={function (){if (check_if_fillable(checklist.id)) swapchecklist(checklist.id) }}>
            Remplir
            </button>
          </div>
        ))}
      </div>
    </div> : null }
  </div>)
}

export {Home}