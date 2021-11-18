import BootstrapSelect from "react-bootstrap-select-dropdown";
import * as utils from "./utils";
import React, {useState} from "react";

/* Component for the creation mode box
* -checklist: current checklist (state variable)
* -setChecklist: current checklist set function
* -swapchecklist: function that changes the current checklist
* -checklistList : list of checklists (state variable)
* -setChecklistList : list of checklist set function
* -checklistId : id of the current checklist (state variables)
* -setChecklistId : id of the current checklist set function
* -forceUpdate: function that force the reload of component if necessary
* */
function CreateBox ({props}) {

  let {checklist, setChecklist, swapchecklist, checklistList, setChecklistList, checklistId, setChecklistId, forceUpdate} = props

  /* State variables used only in creation mode
  * -currentQuestion : the question currently into creation/modification
  * -currentParentQuestion : the question that is parent of the current question
  * -currentName : the current name
  */
  let [currentQuestion, setCurrentQuestion] = useState(checklist.values[0])
  let [currentParentQuestion, setCurrentParentQuestion] = useState(checklist)
  let [currentName, setCurrentName] = useState(checklist.values[0].name)

  /* Make the complete list of questions of the current checklist*/
  let questionList = [];
  function enumquestions (item){
    if (item.id > 0)
      questionList.push(item.id)
    for (const value of item.values){
      enumquestions(value)
    }
  }
  enumquestions(checklist)

  /*Set state variables*/
  function set_elements () {
    setCurrentQuestion(currentQuestion)
    setCurrentParentQuestion(currentParentQuestion)
    setChecklist(checklist)
    setChecklistList(checklistList)
  }

  /*Reinitialize the current question, which means taking the first question of the current checklist as current question*/
  function reinit_current_question (checklist) {
    setCurrentQuestion(checklist.values[0])
    setCurrentParentQuestion(checklist)
    setCurrentName(checklist.values[0].name)
  }

  /*Search for a question (with id) in item and his children, knowing that parent_item is the parent of item. When found, set
  * the current question to this question (and so for the parent and name)*/
  function searchquestion (item, parent_item, id) {
    if (item.id === id){
      console.log("found", item)
      currentQuestion = item
      currentParentQuestion = parent_item
      setCurrentQuestion(currentQuestion)
      setCurrentParentQuestion(currentParentQuestion)
      setCurrentName(currentQuestion.name)
    }
    for (const value of item.values){
      searchquestion(value,item,id);
    }
  }

  /*Remove the current question (by removing the question from children of his parent),
  * and reset to a new current queston
  */
  function removequestion (){
    currentParentQuestion.values = currentParentQuestion.values.filter(e => e.id !== currentQuestion.id)
    set_elements()
    reinit_current_question(checklist)
  }

  /*Add a new question to the checklist. For now we put it as the last children of the checklist item
  * (the last question at first level of the tree ) and we put basic elements inside
  */
  function addnewquestion (){
    let last_id = questionList[questionList.length-1]
    let new_empty_question =
      {
        id: last_id+1,
        name : "Nom vide",
        cond: {"yes":[0], "no":[], num:[]},
        check : ["yes", "no"],
        values: [],
      }
    checklist.values.push(new_empty_question)
    set_elements()
    searchquestion(checklist, null, last_id+1)
  }

  /*Move the current question to another position (the last child of the question with id), we reset the cond for now */
  function movecurrentquestion (id){
    let currentQuestionCopy = {...currentQuestion}
    currentQuestionCopy.cond = {"yes":[id], "no":[], num:[]}
    removequestion()
    searchquestion(checklist, null, id)
    currentQuestion.values.push(currentQuestionCopy)
    set_elements()
    searchquestion(checklist, null, currentQuestionCopy.id)
  }

  /*Change the position of the current question, between it siblings*/
  function changepositionquestion (new_position){
     let currentQuestionCopy = {...currentQuestion}
     removequestion()
    searchquestion(checklist, null, currentParentQuestion.id)
    currentQuestion.values.splice(new_position,0,currentQuestionCopy)
    set_elements()
    searchquestion(checklist, null, currentQuestionCopy.id)
  }

  /*Modify the current name*/
  const modifyname = (event) => {
    currentName = event.target.value
    setCurrentName(currentName)
  }

  /*Update the current question name*/
  const updatename = () => {
    currentQuestion.name = currentName
    set_elements()
  }

  /*Change the check array of the current question, containing the possible answers*/
  const changecheck = (selectedOptions) => {
    if (selectedOptions.selectedKey.length){
      currentQuestion.check = selectedOptions.selectedKey
      setCurrentQuestion(currentQuestion)
    }
  }

  /*Add a checklist (with basic content) to the list of checklist, and switch to this checklist*/
  const addchecklist = () => {
    const n_checklist = checklistList[checklistList.length-1].checklist_id+1
    let new_empty_checklist =
      {
        checklist_id: n_checklist,
        id: -1,
        num_values: [],
        values: [
          {
            id: 1,
            name : "Vide",
            check : ["yes","no"],
            cond: {"yes":[0], "no":[0], num:[]},
            values: []
          }
        ],
      }
    checklistList.push(new_empty_checklist)
    setChecklistList(checklistList)
    swapchecklist_creation_mode(n_checklist)
  }

  /*Remove the current checklist from the list of checklist and take the first checklist still available as current checklist*/
  const removechecklist = () => {
    console.log(checklistList, checklistId)
    checklistList = checklistList.filter(e => e.checklist_id !== checklistId)
    console.log(checklistList)
    setChecklistId(checklistList[0].checklist_id)
    checklist = checklistList[0]
    set_elements()
    reinit_current_question(checklist)
  }

  /*Function that swap the current checklist and reinitialize the current question*/
  const swapchecklist_creation_mode = (checklist_id) =>  {
    swapchecklist(checklist_id)
    reinit_current_question(checklist)
  }

  /*Return the create box, with all it elements*/
  return (
    <div className="container p-2 container-custom border border-2 shadow-sm">
      {/*Title text*/}
      <div className="card card-grey text-center mb-2 ">
        <div className="card-body">
          <h5 className="card-title"><text className="text-custom">Mode Création </text></h5>
          <p className="card-text text-custom m-0">Vous pouvez ajouter, supprimer, modifier des checklists et des questions ici.</p>
          <p className="card-text text-custom">La checklist modifiée s'affiche en dessous.</p>
        </div>
      </div>

      {/*Question and Checklist selection and show*/}
      <div className="row align-items-center p-0 m-0 pb-2 border-bottom border-">
        {/*Checklist selection dropdown*/}
        <div className="col align-items-center ">
          <div className="dropdown text-center">
            <button className="btn btn-val dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <text className="text-custom"> Sélectionnez la checklist</text>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {/*Add a checklist (and select it)*/}
              <li><a className="dropdown-item" href="#" onClick={function(event){ addchecklist(); forceUpdate()}}><text className="text-custom">Nouvelle checklist</text></a></li>
              {/*Select an existing checklist*/}
              {checklistList.map(i => (
                <li><a className="dropdown-item" href="#" onClick={() => swapchecklist_creation_mode(i.checklist_id)}>
                  <text className="text-custom">Checklist n°{i.checklist_id}</text></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Checklist show*/}
        <div className="col align-items-center p-2">
          <div className="card card-grey text-center shadow-sm">
            <text className="text-custom">Checklist n°{checklistId} </text>
          </div>
        </div>
        {/*Question show*/}
        <div className="col align-items-center p-2">
          <div className="card card-grey text-center shadow-sm">
            <text className="text-custom">Question n°{currentQuestion.id}</text>
          </div>
        </div>
        {/*Checklist selection dropdown*/}
        <div className="col align-items-center ">
          <div className="dropdown text-center">
            <button className="btn btn-val dropdown-toggle " type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <text className="text-custom "> Sélectionnez la question</text>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {/*Add a question (and select it)*/}
              <li><a className="dropdown-item" href="#" onClick={function(event){ addnewquestion(); forceUpdate()}}><text className="text-custom">Nouvelle question</text></a></li>
              {/*Select an existing checklist*/}
              {questionList.map(i => (
                <li><a className="dropdown-item" href="#" onClick={() => searchquestion(checklist, null, i)}>
                  <text className="text-custom">Question n°{i}</text></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/*Question Name selection*/}
      <div className="row align-items-center p-2 m-0 border-bottom">
        {/*Information text*/}
        <div className="col-sm-4 align-items-center ">
          <text className="text-custom"> Nom de la question : </text>
        </div>
        {/*Question name text input */}
        <div className="col-sm-4 align-items-center">
          <input className="card w-100 text-custom" type = "text " aria-label="text input" value={currentName} onChange={modifyname}/>
        </div>
        {/*Question name validation button*/}
        <div className="col-sm-4 align-items-center p-0 text-center">
          <button className="btn btn-change" >
            <text className="text-custom" onClick={function(event){ updatename(); forceUpdate()}}>Valider le nom</text>
          </button>
        </div>
      </div>

      {/*Question Position (at which question the current question must be put as last child ?)*/}
      <div className="row align-items-center p-2 m-0 border-bottom">
        {/*Information text*/}
        <div className="col-sm-4 align-items-center">
          <text className="text-custom">Souhaitez vous placer la question à la suite d'une autre ? : </text>
        </div>
        <div className="col-sm-4 align-items-center">
        </div>
        {/*Other question as parent selection dropdown*/}
        <div className="col-sm-4 align-items-center p-0 text-center">
          <div className="dropdown text-center">
            <button className="btn btn-change dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <text className="text-custom"> A la suite de quelle question ?</text>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {/*Put the question at top level*/}
              <li><a className="dropdown-item" href="#" onClick={() => movecurrentquestion(-1)}>
                  <text className="text-custom">Aucune</text></a>
                </li>
              {/*Put the question at child of another question*/}
              {questionList.map(i => (
                <li><a className="dropdown-item" href="#" onClick={() => movecurrentquestion(i)}>
                  <text className="text-custom">Question n°{i}</text></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/*Question position (between it siblings)*/}
      <div className="row align-items-center p-2 m-0 border-bottom">
        {/*Information text*/}
        <div className="col-sm-4 align-items-center">
          <text className="text-custom">Sélectionnez la position de la question : </text>
        </div>
        <div className="col-sm-4 align-items-center">
        </div>
        {/*Position of question selection dropdown*/}
        <div className="col-sm-4 align-items-center p-0 text-center">
          <div className="dropdown text-center">
            <button className="btn btn-change dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <text className="text-custom"> Quelle position ?</text>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {/*Put the question at this position*/}
              {currentParentQuestion.values.map((value, index) => (
                <li><a className="dropdown-item" href="#" onClick={() => changepositionquestion(index)}>
                  <text className="text-custom">Question n°{value.id}</text></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/*(Multi)selection of answers of the current question*/}
      <div className="row align-items-center p-2 m-0 border-bottom">
        {/*Information text*/}
        <div className="col-sm-4 align-items-center">
          <text className="text-custom">Quelles réponses possibles ? : </text>
        </div>
        <div className="col-sm-4 align-items-center">
        </div>
        {/*(Multi)Selection dropdown*/}
        <div className="col-sm-4 align-items-center p-0 text-center">
          <BootstrapSelect options={utils.possible_options} isMultiSelect={true} placeholder="Aucune" onChange={changecheck} onClose={forceUpdate}/>
        </div>
      </div>

      {/*End section of the create box, with remove and import button*/}
      <div className="row align-items-center p-2 m-0">
        {/*Button to remove the current checklist*/}
        <div className="col-sm-4 align-items-center text-center">
          <button className="btn btn-change " >
            <text className="text-custom" onClick={function(event){ removechecklist(); forceUpdate()}}>Supprimer la checklist</text>
          </button>
        </div>
        {/*Button to import in .json the list of checklist*/}
        <div className="col-sm-4 align-items-center text-center">
          <button className="btn btn-change " >
            <text className="text-custom" onClick={() => utils.checklist_to_json(checklistList)}>Sauvegarder la liste de checklists</text>
          </button>
        </div>
        {/*Button to remove the current question*/}
        <div className="col-sm-4 align-items-center text-center">
          <button className="btn btn-change " >
            <text className="text-custom" onClick={function(event){ removequestion(); forceUpdate()}}>Supprimer la question</text>
          </button>
        </div>
      </div>
    </div>
    )
}

export {CreateBox}