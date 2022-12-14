import BootstrapSelect from "react-bootstrap-select-dropdown";
import * as utils from "../utils/utils";
import React, {useEffect, useState} from "react";
import {list_possible_answer, list_possible_num_var, list_possible_op, trad_answer, trad_num_var} from "../utils/utils";
import * as temp from "../utils/temporary_data";
import * as calls from "../calls"

/* Create box, used to add/modify question, save/delete checklists
* */
function CreateBox ({props}) {
  /*Props from App */
  let {checklist, setChecklist, checklistList, setChecklistList, checklistId, setChecklistId, forceUpdate,
    currentQuestion, setCurrentQuestion, reset,  setIsWaitingList=null} = props

  /* State variables used only in the create box
  * -currentParentQuestion : the parent question of the current question
  * -currentName : the current question name
  * -currentComment : the current question comment
  * -currentSectionTitle : the current question section title
  * -tempNums : the numerical condition values (var, op and val) of the current condition the user is going to add
  * -tempPreCheck : the precheck condition values (var, op, val) and then value of the current precheck
  * -pairIndicator : trick, value used as key for some select component to force them to "reload" when switch question
  * -isAltAnswers : definine if selection dropdown use classical answers (yes, no, ?, etc.) or alt answers (text, list)
  *  comes from the fact that a question can (and must) have multiple classical answers OR text answer OR list answer
  */
  let [currentParentQuestion, setCurrentParentQuestion] = useState(null)
  let [currentName, setCurrentName] = useState(null)
  let [currentComment, setCurrentComment] = useState(null)
  let [currentSectionTitle, setCurrentSectionTitle] = useState(null)
  let [tempNums, setTempNums] = useState({})
  let [tempPreCheck, setTempPreCheck] = useState(null)
  let [pairIndicator, setPairIndicator] = useState(0)
  let [isAltAnswers, setIsAltAnswers] = useState(false)

  /* Function that switch current checklist*/
  const swapchecklist = (checklist_list, checklist_id) => {
    calls.getchecklist_creation_mode( checklist_id, checklist, setChecklist, checklistList,
      setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
      setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setIsWaitingList)
  }

  /* Function that get the exhaustive checklist list*/
  const getchecklist_list = (chosen_checklist_id) => {
    calls.getchecklists( checklist, setChecklist,
      setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
      setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setChecklistList, setIsWaitingList, chosen_checklist_id)
  }

  /*Function triggered only when the component is mount */
  useEffect(() => {
    /*At the opening, we wait the checklist list*/
    if(setIsWaitingList !== null) setIsWaitingList(true)
    getchecklist_list(-1)
  }, [])

  /* Enumerate and put in variable the complete list of questions of the current checklist*/
  let questionList = [];
  function enumquestions (item){
    if (item.id > 0)
      questionList.push(item.id)
    for (const value of item.values){
      enumquestions(value)
    }
  }
  if (checklist) enumquestions(checklist)

  /*Create a list of the possible answers of a question (classical and alternative)
  (single is without pre select with current values)*/
  let possible_answers = []
  let possible_answers_single = []
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
        possible_answers_single.push({
          "labelKey": answer,
        "value": trad_answer(answer),
        })
      }
    })
  }
  if (currentQuestion) construct_possible_answers()

  /*Create a list, of the possible variables ('var') of conditions (only numerical)*/
  let possible_vars = []
  function construct_possible_vars (){
    possible_vars = []
    list_possible_num_var.forEach(function(num_var){
      possible_vars.push({"labelKey": num_var, "value": trad_num_var(num_var)})
    })
  }
  if (currentQuestion) construct_possible_vars()

  /*Create a list, of the possible variables ('var') of conditions (numerical and relative to other questions)*/
  let possible_vars_extended = JSON.parse( JSON.stringify(possible_vars) )
  function construct_possible_vars_extended(){
    questionList.forEach(function (question){
      possible_vars_extended.push({"labelKey": question, "value": "Question "+ question})
    })
  }
  if (currentQuestion) construct_possible_vars_extended()

  /*Create a list, of the possible operators ('op') of conditions*/
  let possible_op = []
  function construct_possible_op (){
    possible_op = []
    list_possible_op.forEach(function(op){
      possible_op.push({"labelKey": op, "value": op})
    })
  }
  if (currentQuestion) construct_possible_op()

  /*Create a list, of the current question answers, as there are the possible 'values' of pre check condition*/
  let possible_pre_check = []
  function construct_possible_pre_check (){
    possible_pre_check = []
    currentQuestion.check.forEach(function(pre_check){
      possible_pre_check.push({"labelKey": pre_check, "value": trad_answer(pre_check)})
    })
  }
  if (currentQuestion) construct_possible_pre_check()

  /*Create a list, of the possible lists for list type answer*/
  let possible_lists = []
  function construct_possible_lists () {
    Object.keys(temp.lists).forEach(function (name){
      possible_lists.push({"labelKey": name, "value": temp.lists_trad[name]})
    })
    return possible_lists
  }
  if (currentQuestion) construct_possible_lists()

  /*Reinitialize the current question, which means taking the first question of the current checklist as current question*/
  function reinit_current_question (checklist) {
    setCurrentQuestion(checklist && checklist.values.length ? checklist.values[0] : null)
    setCurrentParentQuestion(checklist)
    setCurrentName(checklist && checklist.values.length ? checklist.values[0].name : "")
    setCurrentComment(checklist && checklist.values.length ? checklist.values[0].comment : "")
    setCurrentSectionTitle(checklist && checklist.values[0].section_title ? checklist.values[0].section_title : null)
    setTempNums({})
    setTempPreCheck({type:"and", then: checklist.values[0].pre_check && checklist.values[0].pre_check.then ? checklist.values[0].pre_check.then : null})
    setIsAltAnswers(false)
  }

  /*Search for a question (with id) in item and his children, knowing that parent_item is the parent of item. When found, set
  * the current question to this question (and so for the parent and name)*/
  function searchquestion (item, parent_item, id) {
    if (item.id === id){
      currentQuestion = item
      currentParentQuestion = parent_item
      setCurrentQuestion(currentQuestion)
      setCurrentParentQuestion(currentParentQuestion)
      setCurrentName(currentQuestion.name)
      setTempNums({})
      setTempPreCheck({})
      setCurrentComment(currentQuestion.comment)
      setCurrentSectionTitle(currentQuestion.section_title)
      setPairIndicator(!pairIndicator)
      setIsAltAnswers(false)
      return currentQuestion
    }
    let current_question = null
    for (const value of item.values){
      current_question = searchquestion(value,item,id) || current_question;
    }
    return current_question
  }

  /*Remove the current question (by removing the question among his parent's children), and reinit current queston
  */
  function removequestion (){
    if (currentParentQuestion) {
      currentParentQuestion.values = currentParentQuestion.values.filter(e => e.id !== currentQuestion.id)
      reinit_current_question(checklist)
      forceUpdate() // Dont know why the remove question need force update but not remove checklist
    }
  }

  /*Add a new question to the checklist. We put it as the last children of the root item
  * (the last question at first level of the tree ) and we put basic elements inside. And we go to this question
  */
  function addnewquestion (){
    let last_id = questionList.length ? questionList.length : 0
    let new_empty_question =
      {
        id: last_id+1,
        name : "",
        cond: {"yes":[], "no":[], num:[]},
        check : ["yes", "no"],
        color : [0,1],
        importance : 1,
        db_item_id: -1,
        values: [],

      }
    checklist.values.push(new_empty_question)
    searchquestion(checklist, null, last_id+1)
  }

  /*Check if the id correspond to item or its children */
  function check_id(item, id){
    return item.id === id || (item.values.length && item.values.every(value => check_id(value)))
  }

  /*Explore in depth the tree to get the current appearance order of question ids  */
  function determine_question_order(question_order, checklist, current_id){
    for (let value of checklist.values){
      question_order[value.id] = current_id
      current_id = current_id + 1
      if (value.values)
        current_id = determine_question_order(question_order, value, current_id)
    }
    return current_id
  }

  /*Reorganise question order, to have the increasing order of appearance (1,2,..) */
  function reorganise_question_ids(checklist, question_order){
    for (let i in checklist.values) {
      let cond = checklist.values[i].cond
      for (let i in cond){
        if (i !== "num") {
          let new_cond_i = []
          cond[i].forEach(elm => new_cond_i.push(question_order[elm]))
          cond[i] = new_cond_i
        }
      }
      checklist.values[i] = {...checklist.values[i], id:question_order[checklist.values[i].id], cond:cond}
      if (checklist.values[i].values)
        reorganise_question_ids(checklist.values[i], question_order)
    }
  }

  /*Move the current question just after the question with id (as sibling) */
  function movecurrentquestion_sibling (id){
    if (!check_id(currentQuestion, id)) {
      // Make a copy of current question, remove current question,
      // go to question with id that become the new current question,
      // put the copy as new child of current question parent (just after the current question)
      let currentQuestionCopy = {...currentQuestion}
      removequestion()
      searchquestion(checklist, null, id)
      let chosen_question_position = currentParentQuestion.values.findIndex(elm => elm.id === id)
      currentQuestionCopy.cond = {"yes": [], "no": [], num: []}
      currentParentQuestion.values.splice(chosen_question_position + 1, 0, currentQuestionCopy)

      // After the question moving, determine new question order, and reorganize to have an increasing appearance order
      let question_order = {}
      determine_question_order(question_order, checklist, 1)
      reorganise_question_ids(checklist, question_order)
      searchquestion(checklist, null, question_order[currentQuestionCopy.id])
      forceUpdate()
    }
  }

  /*Move the current question as first child of the question with id*/
  function movecurrentquestion_child (id){
    if (!check_id(currentQuestion, id)) {
      // Make a copy of current question, remove current question,
      // go to question with id that become the new current question,
      // put the copy as new child of new current question
      let currentQuestionCopy = {...currentQuestion}
      currentQuestionCopy.cond = {"yes":[], "no":[], num:[]}
      removequestion()
      searchquestion(checklist, null, id)
      currentQuestion.values.splice(0,0,currentQuestionCopy)

      // After the question moving, determine new question order, and reorganize to have an increasing appearance order
      let question_order = {}
      determine_question_order(question_order, checklist, 1)
      reorganise_question_ids(checklist, question_order)
      searchquestion(checklist, null, currentQuestionCopy.id)
      forceUpdate()
    }
  }

  /*Modify the name of current checklist*/
  const modifychecklistname = (event) => {
    setChecklist({...checklist, name:event.target.value})
  }

  /*Modify the description of current checklist*/
  const modifychecklistdescription = (event) => {
    setChecklist({...checklist, description:event.target.value})
  }

  /*Modify the current name variable*/
  const modifyname = (event) => {
    currentName = event.target.value
    setCurrentName(currentName)
  }

  /*Update the current question name using name variable*/
  const updatename = () => {
    currentQuestion.name = currentName
    setCurrentQuestion(currentQuestion)
    forceUpdate()
  }

  /*Modify the current comment variable*/
  const modifycomment = (event) => {
    currentComment = event.target.value
    setCurrentComment(currentComment)
  }

  /*Update the current question comment using comment variable*/
  const updatecomment = () => {
    if (currentComment)
      currentQuestion.comment = currentComment
    else
      delete currentQuestion.comment
    forceUpdate()
  }

  /*Modify the current section title variable*/
  const modifysectiontitle= (event) => {
    currentSectionTitle = event.target.value
    setCurrentSectionTitle(currentSectionTitle)
  }

  /*Update the current question section title using section title variable*/
  const updatesectiontitle = () => {
    if (currentSectionTitle)
      currentQuestion.section_title = currentSectionTitle
    else
      delete currentQuestion.section_title
    forceUpdate()
  }

  /*Change the check array of the current question, containing the possible answers, with the answers selected*/
  const changecheck = (selectedOptions) => {
    if (selectedOptions.selectedKey.length) {
      if (!(selectedOptions.selectedKey.includes("list") || selectedOptions.selectedKey.includes("text"))) {
        currentQuestion.check = selectedOptions.selectedKey
        /*Check if we need to add elements in color array, as it must be at least of the same size*/
        let current_colors = currentQuestion.color
        if (currentQuestion.check.length >= current_colors.length)
          current_colors = current_colors.concat(new Array(currentQuestion.check.length - current_colors.length).fill(2))
        currentQuestion.color = current_colors
      }
      else if(selectedOptions.selectedKey[0] === "list"){
        currentQuestion.check = ["list_meds"] // If list answer, we put list_meds by default
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

  /*Apply modifications of current checklist by put call to backend*/
  const updatechecklist = () => {
    const checklist_id = checklistList.length ? checklistId : 0
    const updated_checklist = {
      title: checklist.title,
      description : checklist.description,
      type : checklist.type,
      items : utils.checklist_tree_to_flat(checklist).slice(1) //todo : remove slice
    }
    calls.putchecklist(swapchecklist, checklistList, checklist_id,updated_checklist)
  }

  /*Add an empty checklist by post call to backend*/
  const addchecklist = () => {
    const new_checklist =
      {
        title : "Nouvelle Checklist",
        description : "Description vide",
        type : 1,
        items : []
      }
    calls.addchecklist(getchecklist_list, new_checklist)
  }

  /*Duplicate the current checklist (add a checklist identical to current) by post call to backend*/
  const duplicatechecklist = () => {
    const new_checklist =
      {
        title : checklist.title + " - Copie",
        description : checklist.description,
        type : 1,
        items : utils.checklist_tree_to_flat(checklist).slice(1) //todo : remove slice
      }
    calls.addchecklist(getchecklist_list, new_checklist)
  }

  /*Remove the current checklist by delete call to backend */
  const removechecklist = () => {
    calls.removechecklist(getchecklist_list, checklistId)
  }

  /*Function that add a 'question' condition ("the question 'id' must be answered 'answer'") to current question*/
  const addcond = (answer, id) => {
    if (currentQuestion.cond[answer]) currentQuestion.cond[answer].push(id)
    else currentQuestion.cond[answer] = [id]
    setCurrentQuestion(currentQuestion)
    forceUpdate()
  }

  /*Function that delete a 'question' condition*/
  const deletecond = (answer, id) => {
    currentQuestion.cond[answer] = currentQuestion.cond[answer].filter(elm => elm !== id)
    setCurrentQuestion(currentQuestion)
    forceUpdate()
  }

  /*Function that update the 'var' of the current numerical condition we're working on with selected input*/
  const addtempnumvar = (selectedOptions) => {
    if (!tempNums){ tempNums = {}}
    tempNums = {}
    tempNums.var = selectedOptions.selectedKey[0]
    setTempNums(tempNums)

    forceUpdate()
  }

  /*Function that update the 'op' of the current numerical condition we're working on with selected input*/
  const addtempnumop = (selectedOptions) => {
    if (!tempNums){ tempNums = {}}
    tempNums.op = selectedOptions.selectedKey[0]
    setTempNums(tempNums)
    forceUpdate()
  }

  /*Function that update the 'num' of the current numerical condition we're working on with selected input*/
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

  /*Function that update the 'var' of the current pre check condition we're working on with selected input*/
  const addtempprecheckvar = (selectedOptions) => {
    tempPreCheck = {type:tempPreCheck.type, then:currentQuestion.pre_check && currentQuestion.pre_check.then ? currentQuestion.pre_check.then: null}
    tempPreCheck.var = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

  /*Function that update the 'op' of the current pre check condition we're working on with selected input*/
  const addtempprecheckop = (selectedOptions) => {
    tempPreCheck.op = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

  /*Function that update the 'val' of the current pre check condition we're working on with selected input*/
  const addtempprecheckval = (event) => {
    if(tempPreCheck.var && !["age","yearofbirth"].includes(tempPreCheck.var))
      tempPreCheck.val = event.selectedKey[0]
    else
      tempPreCheck.val = event.target.value
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

  /*Function that update the temp pre check variable*/
  const addtempprecheckthen = (selectedOptions) => {
    if (selectedOptions.selectedKey[0]) tempPreCheck.then = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

  /*Function that update the 'type' of the current pre check condition we're working on with selected input*/
  const addtempprechecktype = (selectedOptions) => {
    if (selectedOptions.selectedKey[0]) tempPreCheck.type = selectedOptions.selectedKey[0]
    setTempPreCheck(tempPreCheck)
    forceUpdate()
  }

  /*Function that update the 'then' of the current pre check condition we're working on with selected input*/
  const updateprecheckthen = () => {
    if(currentQuestion.pre_check){
      currentQuestion.pre_check.then = tempPreCheck.then
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  /*Function that add a precheck condition (with values contains in tempPreCheck) and precheck then to currentQuestion*/
  const addprecheck = () => {
    if(tempPreCheck.var && tempPreCheck.val && tempPreCheck.then && (!["age","yearofbirth"].includes(tempPreCheck.var) || tempPreCheck.op)){
      //Add progressively the diffent elements of the pre check (depending of 'and' or 'or condition)
      if (!currentQuestion.pre_check)
        currentQuestion.pre_check = {if:[],then:null}
      currentQuestion.pre_check.then = tempPreCheck.then
      if (!tempPreCheck.op) utils.list_possible_num_var.includes(tempPreCheck.var) ? tempPreCheck.op = "est" : tempPreCheck.op = null
      if (tempPreCheck.type === "and" || !currentQuestion.pre_check.if.length)
        currentQuestion.pre_check.if.push([{var: tempPreCheck.var, val: tempPreCheck.val, op:tempPreCheck.op}])
      else if (tempPreCheck.type === "or") {
        currentQuestion.pre_check.if[currentQuestion.pre_check.if.length - 1].push({var: tempPreCheck.var, val: tempPreCheck.val, op: tempPreCheck.op})
      }
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  /*Function that remove a precheck condition of the currentQuestion, with two index for the 2 levels of or/and conds*/
  const removeprecheck = (index1, index2) => {
    currentQuestion.pre_check.if[index1].splice(index2,1)
    if (!currentQuestion.pre_check.if[index1].length)
      currentQuestion.pre_check.if.splice(index1,1)
    if (!currentQuestion.pre_check.if.length)
      currentQuestion.pre_check = null
    setCurrentQuestion(currentQuestion)
    //set_elements()
    forceUpdate()
  }

  /*Switch the pair indicator to force select components to refresh*/
  const switchpairindicator = () => {
    pairIndicator = (pairIndicator + 1)%4
  }

  /*Update a color of the color array of current question*/
  const changecolor = (answer, color_id) => {
    currentQuestion.color[currentQuestion.check.indexOf(answer)] = color_id
    setCurrentQuestion(currentQuestion)
    forceUpdate()
  }

  /*Update the type of list of list answer of the current question*/
  const changelist = (selectedOptions) => {
    if (selectedOptions.selectedKey.length) {
      currentQuestion.check = [currentQuestion.check[0].split("_")[0] + "_" + selectedOptions.selectedKey[0]]
      setCurrentQuestion(currentQuestion)
      forceUpdate()
    }
  }

  return (
    <div>{checklist && tempPreCheck ? <div className="container iq-card bg-white pt-2 mt-4 mb-4 border shadow-sm">
      {/*Creation box title*/}
      <div className="iq-card bg-white text-center border border-dark mb-2">
        <div className="card-body col-sm-6 mx-auto my-2 ">
          <h4 className="card-title text-dark">Mode Création </h4>
          <p className="card-text text-primary  m-0">Vous pouvez ajouter, supprimer, modifier des checklists et des questions ici.</p>
          <p className="card-text text-primary ">La checklist modifiée s'affiche en dessous.</p>
        </div>
      </div>

      {/*Question and Checklist selection */}
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
                <li key={index}><label className="dropdown-item " onClick={function (){swapchecklist(checklistList, i.id)}}>
                  Checklist {i.title}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Checklist show*/}
        <div className="col align-items-center p-2">
          <div className="iq-card card-light text-dark text-center shadow-sm mb-0 ">
            Checklist {checklist.title}
          </div>
        </div>
        {/*Question show*/}
        <div className="col align-items-center p-2">
          <div className="iq-card card-light text-dark text-center shadow-sm mb-0">
            Question n°{currentQuestion ? currentQuestion.id : " -"}
          </div>
        </div>
        {/*Question selection dropdown*/}
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

      {/*Current Checklist and question modification*/}
      {currentQuestion ? ( <div key={currentQuestion.id}>

        {/*Checklist Name selection*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          <div className="col-sm-4 align-items-center text-dark ">
            Nom de la checklist :
          </div>
          {/*Question name text input */}
          <div className="col-sm-8 align-items-center">
            <input key={checklistId} className="form-control w-100 mb-0" type = "text " aria-label="text input" value={checklist.title} onChange={modifychecklistname}/>
          </div>
        </div>

        {/*Checklist Description selection*/}
        <div className="row align-items-center p-2 m-0 border-bottom border-dark">
          <div className="col-sm-4 align-items-center text-dark ">
            Description de la checklist :
          </div>
          {/*Question name text input */}
          <div className="col-sm-8 align-items-center">
            <textarea className="form-control form-control-custom textarea" rows="2"  value={checklist.description ? checklist.description : ""} onChange={modifychecklistdescription}/>
          </div>
        </div>

        {/*Question Name selection*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          <div className="col-sm-4 align-items-center text-dark ">
            Nom de la question :
          </div>
          {/*Question name text input */}
          <div className="col-sm-4 align-items-center">
            <input key={checklistId} className="form-control w-100 mb-0" type = "text " aria-label="text input" value={currentName} onChange={modifyname}/>
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
        {currentParentQuestion.id === -1 ? (
          <div className="row align-items-center p-2 m-0 border-bottom">
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

        {/*Question moving (as sibling)*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark">
            Placer la question à la suite d'une autre :
          </div>
          <div className="col-sm-4 align-items-center">
          </div>
          {/*What other question as parent selection dropdown*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <div className="dropleft text-center">
              <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Quelle question ?
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {/*Put the question at very first place (first child of root)*/}
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

        {/*Question moving (as child)*/}
        <div className="row align-items-center p-2 m-0 border-bottom">
          {/*Information text*/}
          <div className="col-sm-4 align-items-center text-dark ">
            Placer la question comme découlant d'une autre :
          </div>
          <div className="col-sm-4 align-items-center">
          </div>
          {/*What other question as parent selection dropdown*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <div className="dropleft text-center">
              <button className="btn btn-warning dropdown-toggle " type="button" id="dropdownMenuButton1"
                      data-toggle="dropdown" aria-expanded="false">
                Quelle question ?
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {/*Put the question at very first place (first child of root)*/}
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
          <div className="col-sm-4 align-items-center text-dark ">
            Quelles réponses possibles ? :
          </div>
          <div className="col-sm-4 align-items-center">
          </div>
          {/*(Multi)Selection dropdown*/}
          <div className="col-sm-4 align-items-center p-0 text-center">
            <div className="row">
              {!isAltAnswers ? // Define the possible answers (and if multi select or not)
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
            {/*Collapse button*/}
            <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapseColors"
                    aria-expanded="false" aria-controls="collapseExample">
              <i className="las la-angle-down"/> Modifier les couleurs des questions <i className="las la-angle-down"/>
            </button>
            <div className="collapse m-0 p-0" id="collapseColors">
              <div className="row align-items-center p-2 m-0 border-bottom">
                <div className="col-sm-3 align-items-center text-dark ">
                  Avec quelles couleurs ? :
                </div>
                <div className="col-sm-9 align-items-center text-center">
                  {/*For each answer of the question, show the current color, and allow to select a new color*/}
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

        {/*Question conditions of the current question*/}
        <div className="border-bottom m-0 py-2 text-center">
          {/*Collapse button*/}
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
                {/*Show all possible answer*/}
                {utils.list_possible_answer.map((answer, index) => (
                  <div key={index} className="row">
                    {/*Answer name*/}
                    <div className="col align-items-center p-2 my-auto">
                      <div className="iq-card card-grey text-center shadow-sm m-0 text-dark ">
                        {trad_answer(answer)}
                      </div>
                    </div>
                    {/*Show in boxes all the question ids currently included in a condition with this answer, allow to delete them by simply click on it*/}
                    <div className="col align-items-center p-2">
                      <div className="list-group list-group-horizontal m-0">
                        {(currentQuestion && currentQuestion.cond[answer]) ? currentQuestion.cond[answer].map( (id, index) => (
                            <button key={index} className=" list-group-item list-group-item-custom btn btn-outline-secondary " type="button" onClick={() => deletecond(answer, id)} >{id} </button>
                        )): null}
                      </div>
                    </div>
                    {/*Allow to select a question id to add to the condition with this answer*/}
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
          {/*Collapse button*/}
          <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapseNumConditions"
                  aria-expanded="false" aria-controls="collapseExample">
            <i className="las la-angle-down"/> Ajouter/Supprimer des conditions numériques <i className="las la-angle-down"/>
          </button>
          <div className="collapse m-0 p-0" id="collapseNumConditions">
            <div className="col align-items-center p-2 m-0">
              {/*List of current numerical condition of current question*/}
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
                  {/*Delete condition button*/}
                  <div className="col-sm-3 align-items-center my-auto text-center">
                    <button className="btn btn-danger " onClick={() => removenum(index)} >
                      <div data-icon="&#xe053;" className="icon mt-1"/>
                    </button>
                  </div>
                </div>
              )): null}

              {/*Add numerical condition */}
              <div>
                <div className="row justify-content-md-center py-2">
                  {/*Dropdowns for the different numerical condition elements*/}
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
                  {/*Depending of the var, the val possibilities change (True/False, M/F, etc.)*/}
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
                  {/*Numerical condition validation button*/}
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
          {/*Collapse button*/}
          <button className="btn btn-secondary m-auto p-2 my-2 " type="button" data-toggle="collapse" data-target="#collapsePreCheck"
                  aria-expanded="false" aria-controls="collapseExample">
            <i className="las la-angle-down"/> Ajouter/Supprimer des conditions pour que la question soit pré-checkée <i className="las la-angle-down"/>
          </button>
          <div className="collapse m-0 p-0" id="collapsePreCheck">
            <div className="col align-items-center p-2 m-0">
              {/*List of list of current pre check condition of current question (list of list because in/or cond*/}
              {(currentQuestion && currentQuestion.pre_check) ? currentQuestion.pre_check.if.map( (pre_checks, index1) => (
                <div>
                  {index1 ? <div className={"mx-auto w-50 border-top border-bottom border-light"}>et</div> : <div className={"mx-auto w-50 border-top border-light"}/>}
                  {pre_checks.map((pre_check, index2) => (
                    <div>
                      {index2 ? <div>ou</div> : null}
                      <div  key={index1} className="row justify-content-md-center py-2">
                        <div className="col-sm-3 align-items-center my-auto">
                          <div className="iq-card card-grey shadow-sm text-center m-0 text-dark ">
                            {list_possible_num_var.includes(pre_check.var) ? trad_num_var(pre_check.var) : "Question " + pre_check.var}
                          </div>
                        </div>
                        <div className="col-sm-3 align-items-center my-auto ">
                          <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                            {pre_check.op ? pre_check.op : "est"}
                          </div>
                        </div>
                        <div className="col-sm-3 align-items-center my-auto ">
                          <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                            {list_possible_num_var.includes(pre_check.var) ? pre_check.val : trad_answer(pre_check.val)}
                          </div>
                        </div>
                        {/*Delete condition button*/}
                        <div className="col-sm-3 align-items-center my-auto text-center">
                          <button className="btn btn-danger " onClick={() => removeprecheck(index1, index2)} >
                            <div data-icon="&#xe053;" className="icon mt-1"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )): null}
              {/*Current pre check then value of current question*/}
              {(currentQuestion && currentQuestion.pre_check) ? (
                <div className="row mx-auto w-50 justify-content-md-center py-2 border-top">
                  <div className="col-sm-2 align-items-center my-auto">
                    <div className="iq-card card-grey shadow-sm text-center m-0 text-dark">
                      {trad_answer(currentQuestion.pre_check.then)}
                    </div>
                  </div>
                </div>
              ): null}

              {/*Add PreCheck condition and then value section*/}
              <div>
                <div>
                  <div className="row justify-content-md-center py-2">
                    {/*Select if added condition is 'or' or 'and' the current conditions and select all different elemnts*/}
                    <div className="col-sm-3 align-items-center my-auto">
                      <BootstrapSelect key={pairIndicator} className="w-100 " selectStyle="btn border" placeholder="Et/Ou" options={[{"labelKey": "and", "value": "Et", "isSelected":true},{"labelKey": "or", "value": "Ou"}]  } onChange={addtempprechecktype}/>
                    </div>
                    <div className="col-sm-3 align-items-center my-auto">
                      <BootstrapSelect key={pairIndicator} className="w-100 " selectStyle="btn border" placeholder="Quelle variable ?" options={possible_vars_extended} onChange={addtempprecheckvar}/>
                    </div>
                    <div className="col-sm-3 align-items-center my-auto ">
                      {!["age","yearofbirth"].includes(tempPreCheck.var) ?
                        <div>est</div>
                        :
                        <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quel opérateur ?" options={possible_op} onChange={addtempprecheckop}/>
                      }
                    </div>
                    {/*Depending of the var, the val possibilities change (True/False, M/F, etc.)*/}
                    <div className="col-sm-3 align-items-center my-auto">
                      {["diabetic","difficult_intubation"].includes(tempPreCheck.var) ?
                        <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                       options={[{"labelKey": "vrai", "value": "Vrai"},{"labelKey": "faux", "value": "Faux"}]  } onChange={addtempprecheckval}/>
                        :
                        <div> {tempPreCheck.var === "gender" ?
                          <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                       options={[{"labelKey": "F", "value": "F"},{"labelKey": "M", "value": "M"}] } onChange={addtempprecheckval}/>
                          :
                          <div> {Number.isInteger(tempPreCheck.var) ?
                            <BootstrapSelect key={tempPreCheck.var} className="w-100 " selectStyle="btn border" placeholder="Quelle valeur ?"
                                             options={possible_answers_single} onChange={addtempprecheckval}/>
                            :
                            <input key={tempPreCheck.var} type="number" className="form-control " placeholder="Quelle valeur ?"
                                   onChange={addtempprecheckval}/>
                          }
                          </div>
                        }
                        </div>
                      }
                    </div>
                  </div>
                  {/*Select, update the then element of pre check condition and validate the all pre check cond*/}
                  <div className="row justify-content-md-center py-2">
                    <div className="col-sm-3 align-items-center my-auto ">
                      <BootstrapSelect key={tempPreCheck.var + currentQuestion.check.length} className="w-100 " selectStyle="btn border" placeholder="Quel pre-check ?" options={possible_pre_check} onChange={addtempprecheckthen}/>
                    </div>
                    <div className="col-sm-3 align-items-center ">
                      <button className="btn btn-warning w-100  " onClick={() => updateprecheckthen()} >
                        Modifier le precheck
                      </button>
                    </div>
                    <div className="col-sm-3 align-items-center text-center my-auto">
                      <button className="btn btn-warning w-100  " onClick={() => addprecheck()} >
                        Valider
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> ) : null}


      <div className="row align-items-center p-2 m-0">
        {/*Button to remove the current checklist*/}
        <div className="col-sm-3 align-items-center text-center">
          <button className="btn btn-danger  " onClick={removechecklist} >
            Supprimer la checklist
          </button>
        </div>
        {/*Button to duplicate the current checklist*/}
        <div className="col-sm-3 align-items-center text-center">
          <button className="btn btn-warning  " onClick={() =>  duplicatechecklist()}>
            Dupliquer la checklist
          </button>
        </div>
        {/*Button to save the current checklist*/}
        <div className="col-sm-3 align-items-center text-center">
          <button className="btn btn-warning  " onClick={() =>  updatechecklist()}>
            Sauvegarder la checklist
          </button>
        </div>
        {/*Button to remove the current question*/}
        <div className="col-sm-3 align-items-center text-center">
          <button className="btn btn-danger " onClick={removequestion}>
            Supprimer la question
          </button>
        </div>
      </div>
    </div>
    :null}</div>
    )
}

export {CreateBox}