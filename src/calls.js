import ApiService from "./axios";
import * as temp_data from "./utils/temporary_data";
import * as utils from "./utils/utils";

/*This file contains all the functions that calls the backend using the axios api service
and make different operations when the response is obtained*/

/*Post login or session (if token already set). Login is tried only if login info already set*/
const postconnection = ( loginInfo, setLoginInfo, setIsLogin, setLoginErrorCode, setCurrentUser) => {

  const current_token = window.localStorage.getItem("token")
  if (current_token === null){
    if(loginInfo) {
      let login_info = {email: loginInfo.username, password: loginInfo.password}
      new ApiService().post(process.env.REACT_APP_BASE_URL + '/' + "login", login_info)
        .then(function (response) {
          window.localStorage.setItem("token", response.data.token)
          setIsLogin(true)
          setCurrentUser({...response.data.user, role_id:1})
        }).catch(error => {
        console.error(error);
        setLoginErrorCode(error.message)
      })
    }
  }
  else{
    new ApiService().get( process.env.REACT_APP_BASE_URL + '/' + "session")
      .then(function (response){
        window.localStorage.setItem("token", response.data.token)
        setIsLogin(true)
        setCurrentUser({...response.data.user, role_id:1})
      }).catch(function(error){
        console.error(error);
        window.localStorage.removeItem("token")
    })
  }
}

/*Post logout to disconnect, delete variable values and get back to root route*/
const postdisconnection = (  setLoginInfo, setIsLogin, setCurrentUser, navigate) => {
  new ApiService().post(process.env.REACT_APP_BASE_URL + '/' + "logout")
    .then(function (response) {
      setLoginInfo(null)
      setIsLogin(false)
      setCurrentUser(null)
      window.localStorage.removeItem("token")
      navigate("/")
    }).catch(error => {
    console.error(error);
  })
}

/*Get all patient from database, not used in current version*/
const getpatients = ( setPatientList) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'patient')
    .then(function(response){
      const patient_list = response.data
      setPatientList(patient_list);
    });
}

/*Get patient with id and construct numdict from it*/
const getpatient = ( id, setCurrentPatient, patientList,setNumDict) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'patient/'+id)
    .then(function(response) {
      let corresp_patients = response.data
      corresp_patients.intervention_name = patientList.filter(elm => elm.id === id)[0].intervention_name
      setCurrentPatient(corresp_patients ? corresp_patients : null)

      let num_dict = {}
      if (corresp_patients){
        for (const [key, value] of Object.entries(corresp_patients)) {
          if (typeof value === "object"){
            for (const [key_, value_] of Object.entries(value)){
              num_dict[key_] = value_
            }
          }
          else{
            num_dict[key] = value
          }
        }
        num_dict["age"] = utils.date_to_age(num_dict["dateofbirth"])
        setNumDict(num_dict)
      }

    })
}

/*Get all the patients that have a journey in progress*/
const getwaitingpatients = ( setPatientList, setErrorCode, setIsWaitingList) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'journey')
    .then(function(response) {
      let patient_list = []

      /*For each journey, check if current date -> journey in progress, if yes we put patient in patient list*/
      response.data.data.forEach(function (journey){
        const current_date = new Date().setHours(0)

        if (true ) { //TODO : make the verification, for now all the journey are considered good
          patient_list.push(journey.patient)
          patient_list[patient_list.length - 1].intervention_name = journey.surgery.denomination
        }
      })
      if (patient_list.length === 0) setErrorCode("empty")
      setPatientList(patient_list);
      setIsWaitingList(false)
    }).catch((error) =>{
      console.error(error)
      setErrorCode(error.message)
      setIsWaitingList(false)
    })
}

/*Get checklist (in array form) with checklist id, construct checklist object in good form*/
const getchecklist = ( checklist_id, checklist, setChecklist, checklistList, alertList, setAlertList, pathId, setChecklistErrorCode,setChecklistId, navigate ) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + "checklist/"+ checklist_id)
    .then(function(response){

      let checklist_array = response.data.data.items
      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)

      let checklist_info = checklistList.filter(elm => elm.id === checklist_id)[0]
      checklist.name = checklist_info.title
      checklist.person = checklist_info.person
      checklist.counter = checklist_info.counter
      checklist.type = checklist_info.type

      setChecklist(checklist)

      /* Make get evaluation call to check and set the alert list*/
      alertList = {}
      getevaluation(pathId, null, alertList, setAlertList, checklist_array)

      setChecklistId(checklist_id);
      /*Go to main/checklist, as checklist has been set*/
      navigate("/main/checklist")

    }).catch(error => {setChecklistErrorCode(error.message)})
}

/*Get the exhaustive checklist list for checklist list, and set checklist with one of the checklists*/
const getchecklists = ( checklist, setChecklist,
                       setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
                       setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setChecklistList, setIsWaitingList, chosen_checklist_id) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + "checklist")
    .then(function(response) {
      let checklist_list = response.data
      /*Id of the checklist we want in the list*/
      let new_checklist_id = chosen_checklist_id > 0 ? chosen_checklist_id : checklist_list[0].id

      if (checklist_list && checklist_list.length) {
        setChecklistList(checklist_list, checklist_list)
        getchecklist_creation_mode( new_checklist_id, checklist, setChecklist, checklist_list,
          setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
          setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setIsWaitingList)
      }
    })
}

/*Get a checklist with checklist id, in the creation mode context (so with more variable to set)*/
const getchecklist_creation_mode = ( checklist_id, checklist, setChecklist, checklistList,
                                    setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
                                    setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setIsWaitingList ) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + "checklist/"+ checklist_id)
    .then(function(response){

      let checklist_array = response.data.data.items
      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)

      checklist.title = response.data.data.title
      checklist.description = response.data.data.description
      checklist.type = response.data.data.type
      setChecklist(checklist)
      setChecklistId(checklist_id)
      /*Set of all creation mode variables*/
      let current_question = checklist.values && checklist.values.length ? checklist.values[0] : null
      setCurrentQuestion(current_question)
      reset()
      setCurrentParentQuestion(checklist)
      setCurrentName(current_question ? current_question.name : null)
      setCurrentComment(current_question ? current_question.comment : null)
      setCurrentSectionTitle(current_question && current_question.section_title ? current_question.section_title : null)
      setTempPreCheck({type:"and", then: current_question && current_question.pre_check && current_question.pre_check.then ? current_question.pre_check.then : null})
      setIsWaitingList(false)

    })
}

/*Put (modify in backend) an updated checklist and swap to this checklist*/
const putchecklist = (swapchecklist, checklistList, checklist_id, updated_checklist) => {
  new ApiService().put(process.env.REACT_APP_BASE_URL + '/' + 'checklist/'+checklist_id, updated_checklist)
    .then(function(response){
      swapchecklist(checklistList, checklist_id)
      /*TODO : maybe get the checklist list updated*/
    });
}

/*Post (add a new) checklist and get the new checklist list (with the new checklist id for set current checklist)*/
const addchecklist = (getchecklist_list, new_checklist) => {
  new ApiService().post(process.env.REACT_APP_BASE_URL + '/' + 'checklist', new_checklist)
    .then(function(response){
      getchecklist_list(response.data.id)
    });
}

/*Delete a checklist and get the new checklist list (and set current checklist to default)*/
const removechecklist = (getchecklist_list, checklist_id) => {
  new ApiService().delete(process.env.REACT_APP_BASE_URL + '/' + 'checklist/'+checklist_id)
    .then(function(response){
        getchecklist_list(-1)
      });
}

/*Get the last journey/path of the current patient*/
const getjourney = ( currentPatient, setCurrentPatient, setPathId,setChecklistList, setJourneyErrorCode, navigate) => {
  // First call to ask the journey id corresponding to the last journey of the current patient
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'journey?patient_id='+currentPatient.id)
    .then(function (response) {
      const path_id = response.data.data[0].id
      setPathId(path_id)

      // Second call to get the journey with path id
      new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'journey/'+path_id)
        .then(function (response) {
          let checklist_list = response.data.data.checklists
          if (checklist_list && checklist_list.length) {

            // Get evaluations of the current journey to check what checklist has already been filled
            new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + "evaluation?journey_id="+path_id)
              .then(function (response){
                if(response.data && response.data.data && response.data.data.length){
                  for( const evaluation of response.data.data){
                    checklist_list.find(checklist => checklist.id === evaluation.checklist.id).fill = true
                  }
                }
                setChecklistList(checklist_list)
                // Now that all calls are finished, go to menu
                navigate("/main/menu")
              }).catch(error => setJourneyErrorCode(error.message))
          }
        }).catch(error => setJourneyErrorCode(error.message))
    }).catch(error => setJourneyErrorCode(error.message))
}

/*Post evaluation with the current result*/
const postevaluation = ( final_result) => {
  new ApiService().post(process.env.REACT_APP_BASE_URL + '/' + 'evaluation', final_result  )
    .then(function (response){
    })
}

/*Get evaluations of the current path, if we have alertList we construct the new alert list from evals, if not we set currentEvals*/
const getevaluation = ( path_id, setIsWaitingReview , alertList=null, setAlertList=null, current_checklist_array = null, setCurrentEvals = null) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'evaluation?journey_id='+path_id )
    .then(function (response){

      if (alertList !== null){
        /*For each evaluation, for each answer, we check the question in the checklist filled (prev)
        and search if the question exist in the new current checklist (current). We create the alert using these info
        (if we find a correp question current we indicates in the alert the corresp id, if not we put -1)*/
        let index = 0
        for(const evaluation of response.data.data){
          if (evaluation.checklist.items.length) {
            for (const answer of evaluation.answers) {
              const corresp_question_prev = evaluation.checklist.items.filter(item => item.itemId === answer.item_id)[0]
              const corresp_question_current = current_checklist_array.filter(item => corresp_question_prev.name.includes(item.name))
              if (answer.is_pb === 1) {
                if (!alertList[corresp_question_prev.name])
                  alertList[corresp_question_prev.name] = {
                    id: index++,
                    question_id: corresp_question_current.length ? corresp_question_current[0].itemId : -1,
                    checklist_id: evaluation.checklist.id,
                    checklist_name: evaluation.checklist.title,
                    name: corresp_question_prev.name,
                    answer: utils.trad_answer(JSON.parse(answer.answer)) ? utils.trad_answer(JSON.parse(answer.answer)) : JSON.parse(answer.answer),
                    gravity: 0
                  }
              } else {
                if (alertList[corresp_question_prev.name])
                  alertList[corresp_question_prev.name] = {...alertList[corresp_question_prev.name], gravity: 1,}
              }
            }
          }
        }
        setAlertList(alertList)
      }
      else{
        setCurrentEvals(response.data.data)
      }
      if (setIsWaitingReview) setIsWaitingReview(false)
    })
}

export {postconnection, postdisconnection, getpatients, getpatient, getwaitingpatients, getchecklist, getchecklists, getchecklist_creation_mode, putchecklist, addchecklist, removechecklist, getjourney, postevaluation, getevaluation}