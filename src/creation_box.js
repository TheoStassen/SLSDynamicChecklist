import BootstrapSelect from "react-bootstrap-select-dropdown";
import * as utils from "./utils";
import React, {useState} from "react";
import {list_possible_answer, list_possible_num_var, list_possible_op, trad_answer, trad_num_var, checklist_to_json,} from "./utils";
import * as temp from "./temporary_data";

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

  let {checklist, setChecklist, checklistList, setChecklistList, checklistId, setChecklistId, forceUpdate, setResult, setIsDict, init_dict, setIsPreCheckDone, currentQuestion, setCurrentQuestion} = props

  /* State variables used only in creation mode
  * -currentQuestion : the question currently into creation/modification
  * -currentParentQuestion : the question that is parent of the current question
  * -currentName : the current name
  * -tempNums : the numerical condition values (var, op and val) of the current condition the user is going to add
  * -tempPreChech : the precheck condition values (var, op, val) and then value of the current precheck the user is going to add
  */

  let [currentParentQuestion, setCurrentParentQuestion] = useState(checklist)
  let [currentName, setCurrentName] = useState(checklist && checklist.values.length ? checklist.values[0].name : " " )
  let [currentComment, setCurrentComment] = useState(checklist && checklist.values[0].comment ? checklist.values[0].comment : null)
  let [currentSectionTitle, setCurrentSectionTitle] = useState(checklist && checklist.values[0].section_title ? checklist.values[0].section_title : null)

  let [tempNums, setTempNums] = useState({})
  let [tempPreCheck, setTempPreCheck] = useState({})

  let [pairIndicator, setPairIndicator] = useState(0)

  let [isAltAnswers, setIsAltAnswers] = useState(false)


  // console.log("main", currentQuestion)

  /* Make the complete list of questions of the current checklist*/
  let questionList = [];
  function enumquestions (item){
    if (item.id > 0)
      questionList.push(item.id)
    for (const value of item.values){
      enumquestions(value)
    }
  }
  if (checklist) enumquestions(checklist)

  /*Create a list, usable by the select component, of the possible answer*/
  let possible_answers = []
  let alt_possible_answers = []
  function construct_possible_answers (){
    possible_answers = []
    list_possible_answer.forEach(function(answer){
      if(["text","list"].includes(answer)){
        alt_possible_answers.push({"labelKey": answer,"value": trad_answer(answer)})
      }
      else{
        possible_answers.push({
          "labelKey": answer,
        "value": trad_answer(answer),
        "isSelected":currentQuestion.check.includes(answer),
        })
      }
    })
  }
  if (currentQuestion) construct_possible_answers()

  /*Create a list, usable by the select component, of the possible variables of conditions*/
  let possible_vars = []
  function construct_possible_vars (){
    possible_vars = []
    list_possible_num_var.forEach(function(num_var){
      possible_vars.push({"labelKey": num_var, "value": trad_num_var(num_var)})
    })
  }
  if (currentQuestion) construct_possible_vars()

  /*Create a list, usable by the select component, of the possible operators of conditions*/
  let possible_op = []
  function construct_possible_op (){
    possible_op = []
    list_possible_op.forEach(function(op){
      possible_op.push({"labelKey": op, "value": op})
    })
  }
  if (currentQuestion) construct_possible_op()

  /*Create a list, usable by the select component, of the possible answers of this question*/
  let possible_pre_check = []
  function construct_possible_pre_check (){
    possible_pre_check = []
    currentQuestion.check.forEach(function(pre_check){
      possible_pre_check.push({"labelKey": pre_check, "value": trad_answer(pre_check)})
    })
  }
  if (currentQuestion) construct_possible_pre_check()

  let possible_lists = []
  function construct_possible_lists () {
    Object.keys(temp.lists).forEach(function (name){
      possible_lists.push({"labelKey": name, "value": temp.lists_trad[name]})
    })
    return possible_lists
  }
  if (currentQuestion) construct_possible_lists()

  // /*Set state variables*/
  // function set_elements () {
  //   setCurrentQuestion(currentQuestion)
  //   setCurrentParentQuestion(currentParentQuestion)
  //   setChecklist(checklist)
  //   setChecklistList(checklistList)
  // }

  /*Reinitialize the current question, which means taking the first question of the current checklist as current question*/
  function reinit_current_question (checklist) {
    setCurrentQuestion(checklist && checklist.values.length ? checklist.values[0] : null)
    setCurrentParentQuestion(checklist)
    setCurrentName(checklist && checklist.values.length ? checklist.values[0].name : "")
    setCurrentComment(checklist && checklist.values.length ? checklist.values[0].comment : "")
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
      setCurrentComment(currentQuestion.comment)
      setCurrentSectionTitle(currentQuestion.section_title)
      setPairIndicator(!pairIndicator)
      return currentQuestion
    }
    let current_question = null
    for (const value of item.values){
      current_question = searchquestion(value,item,id) || current_question;
    }
    return current_question
  }

  /*Remove the current question (by removing the question from children of his parent),
  * and reset to a new current queston
  */
  function removequestion (){
    if (currentParentQuestion) {
      currentParentQuestion.values = currentParentQuestion.values.filter(e => e.id !== currentQuestion.id)
      reinit_current_question(checklist)
      forceUpdate() // Dont know why the remove question need force update but not remove checklist
    }
  }

  /*Add a new question to the checklist. For now we put it as the last children of the checklist item
  * (the last question at first level of the tree ) and we put basic elements inside
  */
  function addnewquestion (){
    let last_id = questionList.length ? questionList[questionList.length-1] : 0
    let new_empty_question =
      {
        id: last_id+1,
        name : "",
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes", "no"],
        color : [0,1],
        values: [],
      }
    checklist.values.push(new_empty_question)
    //set_elements()
    searchquestion(checklist, null, last_id+1)
  }

  function check_id(item, id){
    return item.id === id || (item.values.length && item.values.every(value => check_id(value)))
  }

  /*Move the current question to another position (the last child of the question with id), we reset the cond for now */
  function movecurrentquestion_sibling (id){
    if (!check_id(currentQuestion, id)) {
      let currentQuestionCopy = {...currentQuestion}
      removequestion()
      searchquestion(checklist, null, id)
      let chosen_question_position = currentParentQuestion.values.findIndex(elm => elm.id === id)
      currentQuestionCopy.cond = {"yes": [], "no": [], num: []}
      currentParentQuestion.values.splice(chosen_question_position + 1, 0, currentQuestionCopy)
      //set_elements()
      searchquestion(checklist, null, currentQuestionCopy.id)
      forceUpdate()
    }
  }

  function movecurrentquestion_child (id){
    if (!check_id(currentQuestion, id)) {
      let currentQuestionCopy = {...currentQuestion}
      currentQuestionCopy.cond = {"yes":[], "no":[], num:[]}
      removequestion()
      searchquestion(checklist, null, id)
      currentQuestion.values.splice(0,0,currentQuestionCopy)
      //set_elements()
      searchquestion(checklist, null, currentQuestionCopy.id)
      forceUpdate()
    }
  }

  /*Modify the current name*/
  const modifyname = (event) => {
    currentName = event.target.value
    setCurrentName(currentName)
  }

  /*Update the current question name*/
  const updatename = () => {
    currentQuestion.name = currentName
    setCurrentQuestion(currentQuestion)
    forceUpdate()
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
    forceUpdate()
  }

  /*Modify the current name*/
  const modifysectiontitle= (event) => {
    currentSectionTitle = event.target.value
    setCurrentSectionTitle(currentSectionTitle)
  }

  /*Update the current question name*/
  const updatesectiontitle = () => {
    if (currentSectionTitle)
      currentQuestion.section_title = currentSectionTitle
    else
      delete currentQuestion.section_title
    forceUpdate()
  }

  /*Change the check array of the current question, containing the possible answers*/
  const changecheck = (selectedOptions) => {
    if (selectedOptions.selectedKey.length) {
      if (!(selectedOptions.selectedKey.includes("list") || selectedOptions.selectedKey.includes("text"))) {
        currentQuestion.check = selectedOptions.selectedKey
        let current_colors = currentQuestion.color
        if (currentQuestion.check.length >= current_colors.length)
          current_colors = current_colors.concat(new Array(currentQuestion.check.length - current_colors.length).fill(2))
        // else
        //   current_colors.splice(currentQuestion.check.length)
        currentQuestion.color = current_colors
      }
      else if(selectedOptions.selectedKey[0] === "list"){
        currentQuestion.check = ["list_meds"]
      }
      else{
        currentQuestion.check = selectedOptions.selectedKey
      }
    }
    else{
      currentQuestion.check = []
    }
      setCurrentQuestion(currentQuestion)
      switchpairindicator()
      forceUpdate()
  }

  /*Add a checklist (with basic content) to the list of checklist, and switch to this checklist*/
  const addchecklist = () => {
    const n_checklist = checklistList.length ? checklistList[checklistList.length-1].checklist_id+1 : 0
    let new_empty_checklist =
      {
        checklist_id: n_checklist,
        id: -1,
        num_values: [],
        values: [
          {
            id: 1,
            name : "",
            check : ["yes","no"],
            color : [0,1],
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
    setChecklistId(checklistList.length ? checklistList[0].checklist_id : " -")
    checklist = checklistList.length ? checklistList[0] : null
    setChecklist(checklist)
    setChecklistList(checklistList)
    reinit_current_question(checklist)
  }

  /*Function that swap the current checklist and reinitialize the current question*/
  const swapchecklist_creation_mode = (checklist_id) =>  {
    setChecklistId(checklist_id);
    checklist = checklistList.filter(e => e.checklist_id === checklist_id)[0]
    setChecklist(checklist)
    setResult({})
    setIsDict(init_dict)
    setIsPreCheckDone([]) //Do a warning when switch checklist but seems not causing problem
    setPairIndicator(!pairIndicator)
    reinit_current_question(checklist)
  }

  /*Function that add a  question condition (with it answer and id) to current question*/
  const addcond = (answer, id) => {
    if (currentQuestion.cond[answer]) currentQuestion.cond[answer].push(id)
    else currentQuestion.cond[answer] = [id]

    setCurrentQuestion(currentQuestion)
    forceUpdate()
  }

  /*Function that delete a  question condition (with it answer and id) to current question*/
  const deletecond = (answer, id) => {
    currentQuestion.cond[answer] = currentQuestion.cond[answer].filter(elm => elm !== id)
    console.log(currentQuestion)
    setCurrentQuestion(currentQuestion)
    //set_elements()
    forceUpdate()
  }

  /*Function that update the tempNum.var variable with input*/
  const addtempnumvar = (selectedOptions) => {
    if (!tempNums){ tempNums = {}}
    tempNums = {}
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
    if(tempNums.var && ["diabetic","difficult_intubation", "gender"].includes(tempNums.var) )
      tempNums.val = event.selectedKey[0]
    else
      tempNums.val = event.target.value
    setTempNums(tempNums)
    forceUpdate()
  }

  /*Function that add a numerical condition (with values contains in tempNum) to currentQuestion*/
  const addnum = () => {
    if(tempNums.var && tempNums.val && ["diabetic","difficult_intubation", "gender"].includes(tempNums.var)){
      currentQuestion.cond.num.push({var: tempNums.var, op: "est", val: tempNums.val})
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
    else if (tempNums.var && tempNums.op && tempNums.val) {
      currentQuestion.cond.num.push({var: tempNums.var, op: tempNums.op, val: tempNums.val})
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  /*Function that remove a numerical condition of the currentQuestion*/
  const removenum = (index) => {
    console.log("supprimer", index)
    currentQuestion.cond.num.splice(index,1)
    console.log(currentQuestion.cond.num)
    setCurrentQuestion(currentQuestion)
    //set_elements()
    forceUpdate()
  }

  /*Function that update the tempPrecheck.var variable with input*/
  const addtempprecheckvar = (selectedOptions) => {
    if (!tempPreCheck){ tempPreCheck = {}}
    tempPreCheck = {}
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
    if(tempPreCheck.var && ["diabetic","difficult_intubation", "gender"].includes(tempPreCheck.var) )
      tempPreCheck.val = event.selectedKey[0]
    else
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
    if(tempPreCheck.var && tempPreCheck.val && tempPreCheck.then &&  ["diabetic","difficult_intubation", "gender"].includes(tempPreCheck.var)){
      if (!currentQuestion.pre_check)
        currentQuestion.pre_check = {if:[],then:null}
      currentQuestion.pre_check.then = tempPreCheck.then
      currentQuestion.pre_check.if.push({var: tempPreCheck.var, op: "est", val: tempPreCheck.val})
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
    else if (tempPreCheck.var && tempPreCheck.op && tempPreCheck.val && tempPreCheck.then) {
      if (!currentQuestion.pre_check)
        currentQuestion.pre_check = {if:[],then:null}
      currentQuestion.pre_check.then = tempPreCheck.then
      currentQuestion.pre_check.if.push({var: tempPreCheck.var, op: tempPreCheck.op, val: tempPreCheck.val})
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  const updateprecheckthen = () => {
    if(currentQuestion.pre_check){
      currentQuestion.pre_check.then = tempPreCheck.then
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  /*Function that remove a precheck condition of the currentQuestion*/
  const removeprecheck = (index) => {
    console.log("supprimer", index)
    currentQuestion.pre_check.if.splice(index,1)
    if (!currentQuestion.pre_check.if.length)
      currentQuestion.pre_check = null
    setCurrentQuestion(currentQuestion)
    //set_elements()
    forceUpdate()
  }

  const switchpairindicator = () => {
    pairIndicator = (pairIndicator + 1)%4
  }

  const changecolor = (answer, color_id) => {
    currentQuestion.color[currentQuestion.check.indexOf(answer)] = color_id
    setCurrentQuestion(currentQuestion)
    forceUpdate()
  }

  const changelist = (selectedOptions) => {
    if (selectedOptions.selectedKey.length) {
      currentQuestion.check = [currentQuestion.check[0].split("_")[0] + "_" + selectedOptions.selectedKey[0]]
      console.log(currentQuestion.check)
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  console.log(currentQuestion)

  /*Return the create box, with all it elements*/
  return (
    <div className="container iq-card pt-2 border border-dark shadow">

      {/*Title text*/}
      <div className="iq-card bg-primary text-center mb-2">
        <div className="card-body">
          <h4 className="card-title text-white">Mode Création </h4>
          <p className="card-text  m-0">Vous pouvez ajouter, supprimer, modifier des checklists et des questions ici.</p>
          <p className="card-text ">La checklist modifiée s'affiche en dessous.</p>
        </div>
      </div>

      {/*Question and Checklist selection and show*/}
      <div className="row align-items-center p-0 m-0 pb-2 border-bottom border-">
        {/*Checklist selection dropdown*/}
        <div className="col align-items-center ">
          <div className="dropright text-center">
            <button className="btn btn-info dropdown-toggle " type="button" id="dropdownMenuButton1"
                    data-toggle="dropdown" aria-expanded="false">
              Sélectionnez la checklist
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {/*Add a checklist (and select it)*/}
              <li><label className="dropdown-item " onClick={function(event){ addchecklist(); forceUpdate()}}>Nouvelle checklist</label></li>
              {/*Select an existing checklist*/}
              {checklistList.map((i, index) => (
                <li key={index}><label className="dropdown-item " onClick={function (){swapchecklist_creation_mode(i.checklist_id)}}>
                  Checklist n°{i.checklist_id}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Checklist show*/}
        <div className="col align-items-center p-2">
          <div className="iq-card card-light text-dark text-center shadow-sm mb-0 ">
            Checklist n°{checklistId}
          </div>
        </div>
        {/*Question show*/}
        <div className="col align-items-center p-2">
          <div className="iq-card card-light text-dark text-center shadow-sm mb-0">
            Question n°{currentQuestion ? currentQuestion.id : " -"}
          </div>
        </div>
        {/*Checklist selection dropdown*/}
        <div className="col align-items-center ">
          <div className="dropleft text-center">
            <button className="btn btn-info dropdown-toggle  " type="button" id="dropdownMenuButton1"
                    data-toggle="dropdown" aria-expanded="false">
              Sélectionnez la question
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {/*Add a question (and select it)*/}
              <li><label className="dropdown-item " onClick={function(event){ addnewquestion(); forceUpdate()}}>Nouvelle question</label></li>
              {/*Select an existing checklist*/}
              {questionList.map((i, index) => (
                <li key={index}><label className="dropdown-item " onClick={function(){searchquestion(checklist, null, i)}}>
                  Question n°{i}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {currentQuestion ? ( <div>
        {/*Question Name selection*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark ">
            Nom de la question :
          </div>
          {/*Question name text input */}
          <div className="col-sm-4 align-items-center">
            <input className="form-control w-100 mb-0" type = "text " aria-label="text input" value={currentName} onChange={modifyname}/>
          </div>
          {/*Question name validation button*/}
          <div className="col-sm-4 align-items-center p-0 text-center ">
            <button className="btn btn-warning " onClick={ () => updatename()}>
              Valider le nom
            </button>
          </div>
        </div>

        {/*Question Comment selection*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark  ">
            Commentaire (optionnel) de la question :
          </div>
          {/*Question comment text input */}
          <div className="col-sm-4 align-items-center ">
            <textarea className="form-control form-control-custom textarea" id="exampleFormControlTextarea1" rows="2" value={currentComment ? currentComment:""} onChange={modifycomment}/>
          </div>
          {/*Question comment validation button*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <button className="btn btn-warning " onClick={function(event){ updatecomment(); forceUpdate()}}>
              Valider le commentaire
            </button>
          </div>
        </div>

        {/*Question Section Title selection*/}
        {currentQuestion.parent_id === -1 ? (
          <div className="row align-items-center p-2 m-0 border-bottom">
            {/*Information text*/}
            <div className="col-sm-4 align-items-center text-dark  ">
              Nom de section (optionnel) devant la question :
            </div>
            {/*Question comment text input */}
            <div className="col-sm-4 align-items-center ">
              <textarea className="form-control form-control-custom textarea" id="exampleFormControlTextarea1" rows="2" value={currentSectionTitle ? currentSectionTitle:""} onChange={modifysectiontitle}/>
            </div>
            {/*Question comment validation button*/}
            <div className="col-sm-4 align-items-center p-0 text-center">
              <button className="btn btn-warning " onClick={function(event){ updatesectiontitle(); forceUpdate()}}>
                Valider le titre
              </button>
            </div>
          </div>
        ): null}

        {/*Question Position (below which question the current question must be put)*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark">
            Placer la question à la suite d'une autre :
          </div>
          <div className="col-sm-4 align-items-center">
          </div>
          {/*Other question as parent selection dropdown*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <div className="dropleft text-center">
              <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Quelle question ?
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {/*Put the question at top level*/}
                <li><label className="dropdown-item " onClick={() => movecurrentquestion_child(-1)}>
                  Au début</label>
                  </li>
                {/*Put the question at child of another question*/}
                {questionList.map((i, index) => (
                  <li key={index}><label className="dropdown-item " onClick={() => movecurrentquestion_sibling(i)}>
                    Question n°{i}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/*Question situation (child or sibling of the upper question)*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark ">
            Placer la question comme découlant d'une autre :
          </div>
          <div className="col-sm-4 align-items-center">
          </div>
          {/*Choice between child and sibling*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <div className="dropleft text-center">
              <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Quelle question ?
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {/*Put the question at top level*/}
                <li><label className="dropdown-item " onClick={() => movecurrentquestion_child(-1)}>
                  Au début</label>
                  </li>
                {/*Put the question at child of another question*/}
                {questionList.map((i, index) => (
                  <li key={index}><label className="dropdown-item " onClick={() => movecurrentquestion_child(i)}>
                    Question n°{i}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/*(Multi)selection of answers of the current question*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark ">
            Quelles réponses possibles ? :
          </div>
          <div className="col-sm-4 align-items-center">

          </div>
          {/*(Multi)Selection dropdown*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <div className="row">
              {!isAltAnswers ?
                <BootstrapSelect key={pairIndicator} className=" col w-100 my-auto " selectStyle ="btn-warning" options={possible_answers} isMultiSelect={true} placeholder="Entrer checkboxs" onChange={changecheck}/>
                :
                <BootstrapSelect key={!pairIndicator} className=" col w-100 my-auto " selectStyle ="btn-warning" options={alt_possible_answers} isMultiSelect={false} placeholder="Entrer Autres" onChange={changecheck}/>
              }
              <button className={"col-sm-2 btn btn-outline-info"} onClick={function (){setIsAltAnswers(!isAltAnswers)}}>
                <div data-icon="&#xe049;" className="icon mt-1"></div>
              </button>
            </div>
          </div>
        </div>

        {/*Select of the list (if the answer is list)*/}
        { currentQuestion.check[0] && currentQuestion.check[0].split("_")[0] === "list" ?
          <div className="row align-items-center p-2 m-0 border-bottom">
            {/*Information text*/}
            <div className="col-sm-4 align-items-center text-dark ">
              Quelle liste ? :
            </div>
            <div className="col-sm-4 align-items-center">

            </div>
            {/*(Multi)Selection dropdown*/}
            <div className="col-sm-4 align-items-center p-0 text-center">
              <div className="row">
                <BootstrapSelect key={pairIndicator} className=" col w-100 my-auto " selectStyle ="btn-warning" options={possible_lists} isMultiSelect={false} placeholder="Aucune" onChange={changelist}/>
              </div>
            </div>
          </div>
        : null}

        {/*selection of colors of answers of the current question*/}
        { !isAltAnswers ?
          <div className="border-bottom m-0 py-2 text-center">
            <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapseColors"
                    aria-expanded="false" aria-controls="collapseExample">
              <i className="las la-angle-down"/> Modifier les couleurs des questions <i className="las la-angle-down"/>
            </button>
            <div className="collapse m-0 p-0" id="collapseColors">
              <div className="row align-items-center p-2 m-0 border-bottom">
                {/*Information text*/}
                <div className="col-sm-3 align-items-center text-dark ">
                  Avec quelles couleurs ? :
                </div>
                <div className="col-sm-9 align-items-center text-center">
                  {currentQuestion.check.map((answer,index) => (
                    <div key={index} className="row">
                      <div className="col text-center justify-content-center my-4">
                        <div className=" iq-card card-grey text-center shadow-sm text-dark m-0">
                          {utils.trad_answer(answer)}
                        </div>
                      </div>
                      <div className="col text-center justify-content-center my-4">
                        <div className=" iq-card card-grey text-center shadow-sm text-dark m-0">
                          {currentQuestion.color[index] === 0 ? "Vert" : currentQuestion.color[index] === 1 ? "Rouge" : "Gris"}
                        </div>
                      </div>
                      <div className="col text-center justify-content-center my-3">
                        <div className="dropleft text-center">
                          <button className="btn btn-warning dropdown-toggle m-0 " type="button" id="dropdownMenuButton1"
                                  data-toggle="dropdown" aria-expanded="false">
                            Quelle couleur ?
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            {["Vert","Rouge","Gris"].map((color, index) => (
                              <li key={index}><label className="dropdown-item " onClick={() => changecolor(answer, index)}>
                                {color}</label>
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
        : null}

        {/*Question conditions of the current question (optional part, so it needs to be collapsable)*/}
        <div className="border-bottom m-0 py-2 text-center">
          <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapseQuestionConditions"
                  aria-expanded="false" aria-controls="collapseExample">
            <i className="las la-angle-down"/> Ajouter/Supprimer des conditions sur les autres questions <i className="las la-angle-down"/>
          </button>
          <div className="collapse m-0 p-0" id="collapseQuestionConditions">
            <div className="row align-items-center p-2 m-0">
              <div className="col-sm-3 align-items-center text-dark ">
                Quelles conditions sur les réponses ? :
              </div>
              <div className="col-sm-9 align-items-center">
                {utils.list_possible_answer.map((answer, index) => (
                  <div key={index} className="row">
                    <div className="col align-items-center p-2 my-auto">
                      <div className="iq-card card-grey text-center shadow-sm m-0 text-dark ">
                        {trad_answer(answer)}
                      </div>
                    </div>
                    <div className="col align-items-center p-2">
                      <div className="list-group list-group-horizontal m-0">
                        {/*For each possible answer, if in item.check, we put a checkbox*/}
                        {(currentQuestion && currentQuestion.cond[answer]) ? currentQuestion.cond[answer].map( (id, index) => (
                            <button key={index} className=" list-group-item list-group-item-custom btn btn-outline-secondary " type="button" onClick={() => deletecond(answer, id)} >{id} </button>
                        )): null}
                      </div>

                    </div>
                    <div className="col align-items-center p-2 my-auto">
                      <div className="dropleft text-center">
                        <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton1"
                                data-toggle="dropdown" aria-expanded="false">
                          Quelle question ?
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          {questionList.map((id, index) => (
                            <li key={index}><label className="dropdown-item " onClick={() => addcond(answer, id)}>
                              Question n°{id}</label>
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
        <div className="border-bottom m-0 py-2 text-center">
          <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapseNumConditions"
                  aria-expanded="false" aria-controls="collapseExample">
            <i className="las la-angle-down"/> Ajouter/Supprimer des conditions numériques <i className="las la-angle-down"/>
          </button>
          <div className="collapse m-0 p-0" id="collapseNumConditions">
            <div className="col align-items-center p-2 m-0">
              {/*Current Numerical condition list display*/}
              {(currentQuestion && currentQuestion.cond.num) ? currentQuestion.cond.num.map( (num, index) => (
                <div  key={index} className="row justify-content-md-center py-2">
                  <div className="col-sm-3 align-items-center my-auto">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark ">
                      {trad_num_var(num.var)}
                    </div>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto ">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark ">
                      {num.op}
                    </div>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto ">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                      {num.val}
                    </div>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto text-center">
                    <button className="btn btn-danger " onClick={() => removenum(index)} >
                      <div data-icon="&#xe053;" className="icon mt-1"/>
                    </button>
                  </div>
                </div>
              )): null}
              {/*Add numerical condition section */}
              <div>
                <div className="row justify-content-md-center py-2">
                  <div className="col-sm-3 align-items-center my-auto">
                    <BootstrapSelect key={pairIndicator} className="w-100 " selectStyle="btn border" placeholder="Quelle variable ?" options={possible_vars} onChange={addtempnumvar}/>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto">
                    {["diabetic","difficult_intubation", "gender"].includes(tempNums.var) ?
                      <div>est</div>
                      :
                      <BootstrapSelect key={pairIndicator} className="w-100 " selectStyle="btn border" placeholder="Quel opérateur ?" options={possible_op} onChange={addtempnumop}/>
                    }
                  </div>
                  <div className="col-sm-3 align-items-center my-auto ">
                    {["diabetic","difficult_intubation"].includes(tempNums.var) ?
                      <BootstrapSelect key={tempNums.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                     options={[{"labelKey": "vrai", "value": "Vrai"},{"labelKey": "faux", "value": "Faux"}]  } onChange={addtempnumval}/>
                      :
                      <div> {tempNums.var === "gender" ?
                        <BootstrapSelect key={tempNums.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                     options={[{"labelKey": "F", "value": "F"},{"labelKey": "M", "value": "M"}] } onChange={addtempnumval}/>
                        :
                        <input type="number" className="form-control " placeholder="Quelle valeur ?" onChange={addtempnumval}/>
                      } </div>
                    }
                  </div>
                  <div className="col-sm-3 align-items-center text-center my-auto">
                    <button className="btn btn-warning w-100 " onClick={() => addnum()} >
                      Valider
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Precheck conditions of the current question*/}
        <div className="border-bottom m-0 py-2 text-center">
          <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapsePreCheck"
                  aria-expanded="false" aria-controls="collapseExample">
            <i className="las la-angle-down"/> Ajouter/Supprimer des conditions pour que la question soit pré-checkée <i className="las la-angle-down"/>
          </button>
          <div className="collapse m-0 p-0" id="collapsePreCheck">
            <div className="col align-items-center p-2 m-0">
              {/*Current PreCheck condition list (and then value) display*/}
              {(currentQuestion && currentQuestion.pre_check) ? currentQuestion.pre_check.if.map( (pre_check, index) => (
                <div  key={index} className="row justify-content-md-center py-2">
                  <div className="col-sm-3 align-items-center my-auto">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark ">
                      {trad_num_var(pre_check.var)}
                    </div>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto ">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                      {pre_check.op}
                    </div>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto ">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                      {pre_check.val}
                    </div>
                  </div>
                  <div className="col-sm-3 align-items-center my-auto text-center">
                    <button className="btn btn-danger " onClick={() => removeprecheck(index)} >
                      <div data-icon="&#xe053;" className="icon mt-1"/>
                    </button>
                  </div>
                </div>
              )): null}
              {(currentQuestion && currentQuestion.pre_check) ? (
                <div className="row justify-content-md-center py-2">
                  <div className="col-sm-2 align-items-center my-auto ">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                      {trad_answer(currentQuestion.pre_check.then)}
                    </div>
                  </div>
                </div>
              ): null}


              {/*Add PreCheck condition and then value section*/}
              <div>
                {/*Same problem than with other (multi) bootstrap select, must see if another solution. If we switch between checklist 0 question 1 and checklist 1 question 1, problem stay*/}
                <div>
                  <div className="row justify-content-md-center py-2">
                    <div className="col-sm-3 align-items-center my-auto">
                      <BootstrapSelect key={pairIndicator} className="w-100 " selectStyle="btn border" placeholder="Quelle variable ?" options={possible_vars} onChange={addtempprecheckvar}/>
                    </div>
                    <div className="col-sm-3 align-items-center my-auto ">
                      {["diabetic","difficult_intubation", "gender"].includes(tempPreCheck.var) ?
                        <div>est</div>
                        :
                        <BootstrapSelect key={pairIndicator} className="w-100 " selectStyle="btn border" placeholder="Quel opérateur ?" options={possible_op} onChange={addtempprecheckop}/>
                      }
                    </div>
                    <div className="col-sm-3 align-items-center my-auto">
                      {["diabetic","difficult_intubation"].includes(tempPreCheck.var) ?
                        <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                       options={[{"labelKey": "vrai", "value": "Vrai"},{"labelKey": "faux", "value": "Faux"}]  } onChange={addtempprecheckval}/>
                        :
                        <div> {tempPreCheck.var === "gender" ?
                          <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                       options={[{"labelKey": "F", "value": "F"},{"labelKey": "M", "value": "M"}] } onChange={addtempprecheckval}/>
                          :
                          <input type="number" className="form-control " placeholder="Quelle valeur ?" onChange={addtempprecheckval}/>
                        } </div>
                      }
                    </div>
                    <div className="col-sm-3 align-items-center text-center my-auto">
                      <button className="btn btn-warning w-100  " onClick={() => addprecheck()} >
                        Valider
                      </button>
                    </div>
                  </div>
                  <div className="row justify-content-md-center py-2">
                    <div className="col-sm-3 align-items-center my-auto ">
                      <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quel pre-check ?" options={possible_pre_check} onChange={addtempprecheckthen}/>
                    </div>
                    <div className="col-sm-3 align-items-center ">
                      <button className="btn btn-warning w-100  " onClick={() => updateprecheckthen()} >
                        Modifier le precheck
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> ) : null}


      {/*End section of the create box, with remove and import button*/}
      <div className="row align-items-center p-2 m-0">
        {/*Button to remove the current checklist*/}
        <div className="col-sm-4 align-items-center text-center">
          <button className="btn btn-danger  " onClick={removechecklist} >
            Supprimer la checklist
          </button>
        </div>
        {/*Button to import in .json the list of checklist*/}
        <div className="col-sm-4 align-items-center text-center">
          <button className="btn btn-warning  " onClick={() =>  utils.checklist_tree_to_flat(checklist)}>
            Sauvegarder la checklist
          </button>
        </div>
        {/*Button to remove the current question*/}
        <div className="col-sm-4 align-items-center text-center">
          <button className="btn btn-danger " onClick={removequestion}>
            Supprimer la question
          </button>
        </div>
      </div>
    </div>
    )
}

export {CreateBox}