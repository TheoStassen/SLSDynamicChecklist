import BootstrapSelect from "react-bootstrap-select-dropdown";
import * as utils from "./utils";
import React, {useState} from "react";
import {list_possible_answer, list_possible_num_var, list_possible_op, trad_answer, trad_num_var} from "./utils";

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
  * -tempNums : the numerical condition values (var, op and val) of the current condition the user is going to add
  * -tempPreChech : the precheck condition values (var, op, val) and then value of the current precheck the user is going to add
  */
  let [currentQuestion, setCurrentQuestion] = useState(checklist.values[0])
  let [currentParentQuestion, setCurrentParentQuestion] = useState(checklist)
  let [currentName, setCurrentName] = useState(checklist.values[0].name)
  let [currentComment, setCurrentComment] = useState(checklist.comment ? checklist.comment : null)

  let [tempNums, setTempNums] = useState({})
  let [tempPreCheck, setTempPreCheck] = useState({})


  console.log("main", currentQuestion)

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

  /*Create a list, usable by the select component, of the possible answer*/
  let possible_answers = []
  function construct_possible_answers (){
    possible_answers = []
    list_possible_answer.forEach(function(answer){
      possible_answers.push({"labelKey": answer, "value": trad_answer(answer), "isSelected":currentQuestion.check.includes(answer)})
    })
  }
  construct_possible_answers()

  /*Create a list, usable by the select component, of the possible variables of conditions*/
  let possible_vars = []
  function construct_possible_vars (){
    possible_vars = []
    list_possible_num_var.forEach(function(num_var){
      possible_vars.push({"labelKey": num_var, "value": trad_num_var(num_var)})
    })
  }
  construct_possible_vars()

  /*Create a list, usable by the select component, of the possible operators of conditions*/
  let possible_op = []
  function construct_possible_op (){
    possible_op = []
    list_possible_op.forEach(function(op){
      possible_op.push({"labelKey": op, "value": op})
    })
  }
  construct_possible_op()

  /*Create a list, usable by the select component, of the possible answers of this question*/
  let possible_pre_check = []
  function construct_possible_pre_check (){
    possible_pre_check = []
    currentQuestion.check.forEach(function(pre_check){
      possible_pre_check.push({"labelKey": pre_check, "value": trad_answer(pre_check)})
    })
  }
  construct_possible_pre_check()


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
      setTempNums({})
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
        cond: {"yes":[], "no":[], num:[]},
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
    forceUpdate()
  }

  /*Change the position of the current question, between it siblings*/
  function changepositionquestion (new_position){
     let currentQuestionCopy = {...currentQuestion}
     removequestion()
    searchquestion(checklist, null, currentParentQuestion.id)
    currentQuestion.values.splice(new_position,0,currentQuestionCopy)
    set_elements()
    searchquestion(checklist, null, currentQuestionCopy.id)
    forceUpdate()
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

    /*Modify the current name*/
  const modifycomment = (event) => {
    currentComment = event.target.value
    setCurrentComment(currentComment)
  }

  /*Update the current question name*/
  const updatecomment = () => {
    if (currentComment)
      currentQuestion.comment = currentComment
    else
      delete currentQuestion.comment
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
            cond: {"yes":[], "no":[], num:[]},
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
    checklist = swapchecklist(checklist_id)
    reinit_current_question(checklist)
    forceUpdate()
  }

  /*Function that add a  question condition (with it answer and id) to current question*/
  const addcond = (answer, id) => {
    currentQuestion.cond[answer].push(id)
    setCurrentQuestion(currentQuestion)
    set_elements()
    forceUpdate()
  }

  /*Function that delete a  question condition (with it answer and id) to current question*/
  const deletecond = (answer, id) => {
    currentQuestion.cond[answer] = currentQuestion.cond[answer].filter(elm => elm !== id)
    console.log(currentQuestion)
    setCurrentQuestion(currentQuestion)
    set_elements()
    forceUpdate()
  }

  /*Function that update the tempNum.var variable with input*/
  const addtempnumvar = (selectedOptions) => {
    if (!tempNums){ tempNums = {}}
    tempNums.var = selectedOptions.selectedKey[0]
    setTempNums(tempNums)
    forceUpdate()
  }
  /*Function that update the tempNum.op variable with input*/
  const addtempnumop = (selectedOptions) => {
    if (!tempNums){ tempNums = {}}
    tempNums.op = selectedOptions.selectedKey[0]
    setTempNums(tempNums)
    forceUpdate()
  }
    /*Function that update the tempNum.val variable with input*/
  const addtempnumval = (event) => {
    if (!tempNums){ tempNums = {}}
    tempNums.val = event.target.value
    setTempNums(tempNums)
    forceUpdate()
  }

  /*Function that add a numerical condition (with values contains in tempNum) to currentQuestion*/
  const addnum = () => {
    if (tempNums.var && tempNums.op && tempNums.val) {
      currentQuestion.cond.num.push({var: tempNums.var, op: tempNums.op, val: tempNums.val})
      setCurrentQuestion(currentQuestion)
      set_elements()
      forceUpdate()
    }
  }

  /*Function that remove a numerical condition of the currentQuestion*/
  const removenum = (index) => {
    console.log("supprimer", index)
    currentQuestion.cond.num.splice(index,1)
    console.log(currentQuestion.cond.num)
    setCurrentQuestion(currentQuestion)
    set_elements()
    forceUpdate()
  }

  /*Function that update the tempPrecheck.var variable with input*/
  const addtempprecheckvar = (selectedOptions) => {
    if (!tempPreCheck){ tempPreCheck = {}}
    tempPreCheck.var = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }
  /*Function that update the tempPrecheck.op variable with input*/
  const addtempprecheckop = (selectedOptions) => {
    if (!tempPreCheck){ tempPreCheck = {}}
    tempPreCheck.op = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }
  /*Function that update the tempPrecheck.val variable with input*/
  const addtempprecheckval = (event) => {
    if (!tempPreCheck){ tempPreCheck = {}}
    tempPreCheck.val = event.target.value
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

    /*Function that update the tempPrecheck.then variable with input*/
  const addtempprecheckthen = (selectedOptions) => {
    if (!tempPreCheck){ tempPreCheck = {}}
    tempPreCheck.then = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

  /*Function that add a precheck condition (with values contains in tempPreCheck) and precheck then to currentQuestion*/
  const addprecheck = () => {
    if (tempPreCheck.var && tempPreCheck.op && tempPreCheck.val && tempPreCheck.then) {
      if (!currentQuestion.pre_check)
        currentQuestion.pre_check = {if:[],then:null}
      currentQuestion.pre_check.then = tempPreCheck.then
      currentQuestion.pre_check.if.push({var: tempPreCheck.var, op: tempPreCheck.op, val: tempPreCheck.val})
      setCurrentQuestion(currentQuestion)
      set_elements()
      forceUpdate()
    }
  }

  /*Function that remove a precheck condition of the currentQuestion*/
  const removeprecheck = (index) => {
    console.log("supprimer", index)
    currentQuestion.pre_check.if.splice(index,1)
    if (!currentQuestion.pre_check.if.length)
      currentQuestion.pre_check = null
    console.log(currentQuestion.cond.num)
    setCurrentQuestion(currentQuestion)
    set_elements()
    forceUpdate()
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
                <li><a className="dropdown-item" href="#" onClick={function(){searchquestion(checklist, null, i)}}>
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

      {/*Question Comment selection*/}
      <div className="row align-items-center p-2 m-0 border-bottom">
        {/*Information text*/}
        <div className="col-sm-4 align-items-center ">
          <text className="text-custom"> Commentaire (optionnel) de la question : </text>
        </div>
        {/*Question comment text input */}
        <div className="col-sm-4 align-items-center">
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="2" value={currentComment} onChange={modifycomment}/>
        </div>
        {/*Question comment validation button*/}
        <div className="col-sm-4 align-items-center p-0 text-center">
          <button className="btn btn-change" onClick={function(event){ updatecomment(); forceUpdate()}}>
            <text className="text-custom" >Valider le commentaire</text>
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
        {/*(Multi)Selection dropdown
        -> For now, the only solution i found to have the dropdown reset correctly when question switch is have one separate dropdown for each question, but only one shown
        -> clearly not optimal (but big problem when doing the simple way : the current selection of answers is not reset when question switch and component update -> very annoying*/}
        <div className="col-sm-4 align-items-center p-0 text-center">
          {questionList.map(elm => (
            elm === currentQuestion.id ? <BootstrapSelect options={possible_answers} isMultiSelect={true} placeholder="Aucune" onChange={changecheck} onClose={forceUpdate}/>: null
          ))}
          {/*Simple way*/}
          {/*<BootstrapSelect options={possible_options} isMultiSelect={true} placeholder="Aucune" onChange={changecheck} onClose={forceUpdate}/>*/}
        </div>
      </div>

      {/*Question conditions of the current question (optional part, so it needs to be collapsable)*/}
      <div className="border-bottom m-0 p-0 text-center">
        <button className="btn btn-change m-auto p-2 my-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuestionConditions"
                aria-expanded="false" aria-controls="collapseExample">
          <text className="text-custom"> <i className="fas fa-caret-down"/>Ajouter/Supprimer des conditions sur les autres questions <i className="fas fa-caret-down"/> </text>
        </button>
        <div className="collapse m-0 p-0" id="collapseQuestionConditions">
          <div className="row align-items-center p-2 m-0">
            <div className="col-sm-3 align-items-center">
              <text className="text-custom">Quelles conditions sur les réponses ? : </text>
            </div>
            <div className="col-sm-9 align-items-center">
              {utils.list_possible_answer.map(answer => (
                <div className="row">
                  <div className="col align-items-center p-2 my-auto">
                    <div className="card card-grey text-center shadow-sm m-0 ">
                      <text className="text-custom">{trad_answer(answer)}</text>
                    </div>
                  </div>
                  <div className="col align-items-center p-2">
                    <div className="input-group m-0">
                      {/*For each possible answer, if in item.check, we put a checkbox*/}
                      {currentQuestion.cond[answer] ? currentQuestion.cond[answer].map( id => (
                        <div className="input-group-prepend">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => deletecond(answer, id)} ><text className="text-custom">{id}</text> </button>
                        </div>
                      )): null}
                    </div>

                  </div>
                  <div className="col align-items-center p-2">
                    <div className="dropdown text-center">
                      <button className="btn btn-change dropdown-toggle" type="button" id="dropdownMenuButton1"
                              data-bs-toggle="dropdown" aria-expanded="false">
                        <text className="text-custom"> Quelle question ?</text>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {questionList.map((id, index) => (
                          <li><a className="dropdown-item" href="#" onClick={() => addcond(answer, id)}>
                            <text className="text-custom">Question n°{id}</text></a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*Numerical conditions of the current question*/}
      <div className="border-bottom m-0 p-0 text-center">
        <button className="btn btn-change m-auto p-2 my-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNumConditions"
                aria-expanded="false" aria-controls="collapseExample">
          <text className="text-custom"><i className="fas fa-caret-down"/> Ajouter/Supprimer des conditions numériques <i className="fas fa-caret-down"/> </text>
        </button>
        <div className="collapse m-0 p-0" id="collapseNumConditions">
          <div className="col align-items-center p-2 m-0 border-bottom">
            {/*Current Numerical condition list display*/}
            {currentQuestion.cond.num ? currentQuestion.cond.num.map( (num, index) => (
              <div className="row justify-content-md-center py-2">
                <div className="col-sm-2 align-items-center my-auto">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{trad_num_var(num.var)}</text>
                  </div>
                </div>
                <div className="col-sm-2 align-items-center my-auto ">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{num.op}</text>
                  </div>
                </div>
                <div className="col-sm-2 align-items-center my-auto ">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{num.val}</text>
                  </div>
                </div>
                <div className="col-sm-2 align-items-center my-auto text-center">
                  <button className="btn btn-delete" onClick={() => removenum(index)} >
                    <div className="text-custom" ><i className="fas fa-trash"/></div>
                  </button>
                </div>
              </div>
            )): null}
            {/*Add numerical condition section */}
            <div>
              {/*Same problem than with other (multi) bootstrap select, must see if another solution. If we switch between checklist 0 question 1 and checklist 1 question 1, problem stay*/}
              {questionList.map(elm => (
                elm === currentQuestion.id ? (
                  <div className="row justify-content-md-center py-2">
                    <div className="col-sm-2 align-items-center ">
                      <BootstrapSelect className="w-100 text-custom" selectStyle="btn btn-light border" placeholder="Quelle variable ?" options={possible_vars} onChange={addtempnumvar}/>
                    </div>
                    <div className="col-sm-2 align-items-center ">
                      <BootstrapSelect className="w-100 text-custom" selectStyle="btn btn-light border" placeholder="Quel opérateur ?" options={possible_op} onChange={addtempnumop}/>
                    </div>
                    <div className="col-sm-2 align-items-center ">
                      <input type="number" className="form-control text-custom" placeholder="Quelle valeur ?" onChange={addtempnumval}/>
                    </div>
                    <div className="col-sm-2 align-items-center text-center">
                      <button className="btn btn-change w-100 " onClick={() => addnum()} >
                        <div className="text-custom" >Valider</div>
                      </button>
                    </div>
                  </div>)
                  : null ))}
            </div>
          </div>
        </div>
      </div>

      {/*Precheck conditions of the current question*/}
      <div className="border-bottom m-0 p-0 text-center">
        <button className="btn btn-change m-auto p-2 my-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePreCheck"
                aria-expanded="false" aria-controls="collapseExample">
          <text className="text-custom"><i className="fas fa-caret-down"/> Ajouter/Supprimer des conditions pour que la question soit pré-checkée<i className="fas fa-caret-down"/> </text>
        </button>
        <div className="collapse m-0 p-0" id="collapsePreCheck">
          <div className="col align-items-center p-2 m-0 border-bottom">
            {/*Current PreCheck condition list (and then value) display*/}
            {currentQuestion.pre_check ? currentQuestion.pre_check.if.map( (pre_check, index) => (
              <div className="row justify-content-md-center py-2">
                <div className="col-sm-2 align-items-center my-auto">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{trad_num_var(pre_check.var)}</text>
                  </div>
                </div>
                <div className="col-sm-2 align-items-center my-auto ">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{pre_check.op}</text>
                  </div>
                </div>
                <div className="col-sm-2 align-items-center my-auto ">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{pre_check.val}</text>
                  </div>
                </div>
                <div className="col-sm-2 align-items-center my-auto text-center">
                  <button className="btn btn-delete" onClick={() => removeprecheck(index)} >
                    <div className="text-custom" ><i className="fas fa-trash"/></div>
                  </button>
                </div>
              </div>
            )): null}
            {currentQuestion.pre_check ? (
              <div className="row justify-content-md-center py-2">
                <div className="col-sm-2 align-items-center my-auto ">
                  <div className="card card-grey shadow-sm text-center">
                    <text className="text-custom">{trad_answer(currentQuestion.pre_check.then)}</text>
                  </div>
                </div>
              </div>
            ): null}


            {/*Add PreCheck condition and then value section*/}
            <div>
              {/*Same problem than with other (multi) bootstrap select, must see if another solution. If we switch between checklist 0 question 1 and checklist 1 question 1, problem stay*/}
              {questionList.map(elm => (
                elm === currentQuestion.id ? (
                  <div>
                    <div className="row justify-content-md-center py-2">
                      <div className="col-sm-2 align-items-center ">
                        <BootstrapSelect className="w-100 text-custom" selectStyle="btn btn-light border" placeholder="Quelle variable ?" options={possible_vars} onChange={addtempprecheckvar}/>
                      </div>
                      <div className="col-sm-2 align-items-center ">
                        <BootstrapSelect className="w-100 text-custom" selectStyle="btn btn-light border" placeholder="Quel opérateur ?" options={possible_op} onChange={addtempprecheckop}/>
                      </div>
                      <div className="col-sm-2 align-items-center ">
                        <input type="number" className="form-control text-custom" placeholder="Quelle valeur ?" onChange={addtempprecheckval}/>
                      </div>
                      <div className="col-sm-2 align-items-center text-center">
                        <button className="btn btn-change w-100 " onClick={() => addprecheck()} >
                          <div className="text-custom" >Valider</div>
                        </button>
                      </div>
                    </div>
                    <div className="row justify-content-md-center py-2">
                      <div className="col-sm-2 align-items-center ">
                        <BootstrapSelect className="w-100 text-custom" selectStyle="btn btn-light border" placeholder="Quel pre-check ?" options={possible_pre_check} onChange={addtempprecheckthen}/>
                      </div>
                    </div>
                  </div>
                  )
                  : null ))}
            </div>
          </div>
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