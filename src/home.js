import {Html5Qrcode} from "html5-qrcode";
import React from "react";


function Home ({checklistList, swapchecklist, scanValue, currentPatient}) {

  const list_length = checklistList ? checklistList.length : 0



  return (<div>
    {checklistList && currentPatient ? <div className="container">
      <div className={"iq-card bg-primary col-sm-6 mx-auto text-center p-2 shadow border border-dark justify-content-center "}>
        <div className="card-body">
          <h3 className="card-title text-white m-0">Patient(e) : {currentPatient.firstname} {currentPatient.lastname} </h3>
          <h4 className="card-title text-dark m-0">{currentPatient.dateofbirth}</h4>
          {/*<h4 className="card-text m-0">Code : {scanValue ? scanValue : "-"}</h4>*/}
          <img className={"border border-dark mt-2"} src={currentPatient.photo} width="128" height="128"/>
        </div>
      </div>
      <div className={"list-group text-center text-dark justify-content-center " + (list_length < 3 ? "list-group-horizontal":"")} >
        {checklistList.map( (checklist, index) => (
          <div className={"list-group-item shadow " + (list_length < 3 ? "col-sm-3 ":"col-sm-6 mx-auto list-group-item-rounded ") + (checklist.fill ? "iq-bg-success":"iq-bg-danger")}>
            <h4>Checklist n° {checklist.checklist_id}</h4>
            <p>{checklist.name}</p>
            <button className=" btn btn-primary m-2" type="button" onClick={()=> swapchecklist(checklist.checklist_id)}>
            Remplir
            </button>
          </div>
        ))}
      </div>
    </div> : null }
  </div>)
}

export {Home}