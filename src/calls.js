import ApiService from "./axios";
import * as temp_data from "./utils/temporary_data";
import * as utils from "./utils/utils";
import axios from "axios";
import {useState} from "react";

const postconnection = (is_local, loginInfo, setLoginInfo, setIsLogin, setLoginErrorCode) => {
  if (!is_local){
    const current_token = window.localStorage.getItem("token")
    if (current_token === null){

      let login_info = {email:loginInfo.username, password:loginInfo.password}
      new ApiService().post( process.env.REACT_APP_BASE_URL + '/' + "login", login_info )
        .then(function(response){
          console.log(" login" , response)
          // window.localStorage.setItem("token", response.data.token)
          window.localStorage.setItem("token", response.data.token)
          setIsLogin(true)
        }).catch(error => {console.error(error); setLoginErrorCode(error.message)})
    }
    else{
      new ApiService().get( process.env.REACT_APP_BASE_URL + '/' + "session")
      // new ApiService().post( "#")
        .then(function (response){
          console.log(" session connection succeed", response)
          window.localStorage.setItem("token", response.data.token)
          setIsLogin(true)
        }).catch(function(error){
          console.log("Session connection failed", error)
          window.localStorage.removeItem("token")
          postconnection(is_local, loginInfo, setLoginInfo, setIsLogin)
      })
    }
  }
}

const getusers = (is_local, setUserList, setErrorCode) => {
  /*Get user list from database*/
  // axios.get('http://checklists.metoui.be/api/users')
  new ApiService().get(true ? '#' : process.env.REACT_APP_BASE_URL + '/' + "users")
    .then(function(response){

      //Must handle incoming data
      console.log("user list call response", response)
      console.log("user list call temp", temp_data.user_list)
      const user_list = temp_data.user_list// temporary
      setUserList(user_list);
      console.log("initial get user list call and set finished")
    }).catch((error) => {
      console.error(error.message)
      setErrorCode(error.message)
    });
  return true
}

const getuser = (is_local, id, setCurrentUser, setScanValueError) => {
  new ApiService().get(true ? '#': process.env.REACT_APP_BASE_URL + '/' + 'users/'+id)
    .then(function(response) {
      console.log("get user at id response", response.data)
      console.log("get user at id temp", temp_data.users[id])
      let corresp_users = true ? temp_data.users[id] : response.data // temporary
      // let corresp_patients = response.data
      setCurrentUser(corresp_users ? corresp_users : null)
      setScanValueError(null)
    })
}

const getpatients = (is_local, setPatientList) => {
  /*Get patient list from database*/
  new ApiService().get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'patient')
    .then(function(response){

      //Must handle incoming data
      console.log("patient call response ", response.data)
      console.log("patient call temp", temp_data.patient_list)

      // const patient_list = temp_data.patient_list // temporary
      const patient_list = is_local ? temp_data.patient_list : response.data

      setPatientList(patient_list);
      console.log("initial get patient list call and set finished")
    });
}

const getpatient = (is_local, id, setCurrentPatient, setScanValueError) => {
  new ApiService().get(is_local ? '#': process.env.REACT_APP_BASE_URL + '/' + 'patient/'+id)
    .then(function(response) {
      console.log("get patient at id response", response.data)
      console.log("get patient at id temp", temp_data.patients[id])
      let corresp_patients = is_local ? temp_data.patients[id] : response.data // temporary
      // let corresp_patients = response.data
      setCurrentPatient(corresp_patients ? corresp_patients : null)
      setScanValueError(null)
    })
}

const getwaitingpatients = (is_local, setPatientList, setErrorCode) => {
  new ApiService().get(is_local ? '#': process.env.REACT_APP_BASE_URL + '/' + 'journey')
    .then(function(response) {
      //Must handle incoming data
      console.log("patient call response ", response.data)
      console.log("patient call temp", temp_data.patient_list)

      // const patient_list = temp_data.patient_list // temporary
      let patient_list = []
      if (is_local){
        patient_list = temp_data.patient_list
      }
      else{
        response.data.data.forEach(function (journey){
          const current_date = new Date().setHours(0)
          if (journey.scheduledDateTime === null || new Date(journey.scheduledDateTime) > current_date )
            patient_list.push(journey.patient)
        })
      }
      if (patient_list.length === 0) setErrorCode("empty")
      setPatientList(patient_list);
      console.log("initial get patient list call and set finished")
    }).catch((error) =>{
      console.error(error)
      setErrorCode(error.message)
    })
}

const getchecklist = (is_local, checklist_id, creationMode, checklist, setChecklist, checklistList, alertList, setAlertList, pbresult, result, checklistId, setCreationMode, setChecklistId, setCurrentQuestion, setHomeMode, reset, pathId, currentEvals, setCurrentEvals, setChecklistErrorCode ) => {
  // Get the checklist from database

  new ApiService().get(is_local ? "#" : process.env.REACT_APP_BASE_URL + '/' + "checklist/"+ checklist_id)
    .then(function(response){

      console.log("checklist swap call response", response)

      const current_creation_mode = creationMode // we use this variable to reset the creation mode after switching
      let checklist_array = is_local ? temp_data.checklist_arrays[checklist_id-1] : response.data.data.items
      // let checklist_array = response.data.data.items

      console.log("checklist_array", checklist_array)

      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)

      console.log("checklist", checklist)
      let checklist_info = checklistList.filter(elm => elm.id === checklist_id)[0]
      checklist.name = checklist_info.title
      checklist.person = checklist_info.person
      checklist.counter = checklist_info.counter
      checklist.type = checklist_info.type

      setChecklist(checklist)

      /**** Alert gestion section, will be replaced by a get call when the db will handle alert gestion*/

      alertList = {}
      getevaluation(setCurrentEvals, pathId, alertList, setAlertList, checklist_array)

      setCreationMode(false)
      setChecklistId(checklist_id);
      setCurrentQuestion(checklist && checklist.values.length ? checklist.values[0] : null)
      setCreationMode(current_creation_mode)
      setHomeMode(false)
      reset()

      console.log("switch checklist get call and set finished")
    }).catch(error => {setChecklistErrorCode(error.message); setHomeMode(false)})
}

const getchecklists = (is_local, checklist, setChecklist,
                       setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
                       setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setChecklistList ) => {
  new ApiService().get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + "checklist") //Random url, just to simulate the fact that we need to make get call before set checklistList
    .then(function(response) {
      console.log(response)
      let checklist_list = is_local ? temp_data.paths[1].checklists : response.data
      let checklist_id = checklist_list[0].id


      if (checklist_list && checklist_list.length) {
        setChecklistList(checklist_list, checklist_list)
        getchecklist_creation_mode(is_local, checklist_id, checklist, setChecklist, checklist_list,
          setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
          setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck)
      }
    })
}

const getchecklist_creation_mode = (is_local, checklist_id, checklist, setChecklist, checklistList,
                                    setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
                                    setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck ) => {
  // Get the checklist from database
  new ApiService().get(is_local ? "#" : process.env.REACT_APP_BASE_URL + '/' + "checklist/"+ checklist_id)
    .then(function(response){

      let checklist_array = is_local ? temp_data.checklist_arrays[checklist_id-1] : response.data.data.items
      console.log("get checklist creation mode", checklist_array)

      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)
      let checklist_info = checklistList.filter(elm => elm.id === checklist_id)[0]

      checklist.name = checklist_info.title
      checklist.person = checklist_info.person
      checklist.counter = checklist_info.counter
      checklist.type = checklist_info.type
      setChecklist(checklist)
      setChecklistId(checklist_id)
      setCurrentQuestion(checklist.values[0])
      reset()
      setCurrentParentQuestion(checklist)
      setCurrentName(checklist.values[0].name)
      setCurrentComment(checklist.values[0].comment)
      setCurrentSectionTitle(checklist.values[0].section_title ? checklist.values[0].section_title : null)
      setTempPreCheck({type:"and", then: checklist.values[0].pre_check && checklist.values[0].pre_check.then ? checklist.values[0].pre_check.then : null})

      console.log("switch checklist get call and set finished")
    })
}

const putchecklist = (swapchecklist, checklistList, checklist_id, updated_checklist) => {
  // Inform that we want to add a new checklist and receive in response the new checklist list
  new ApiService().put('http://checklists.metoui.be/api/checklists/'+checklist_id, updated_checklist) //Random url, just to simulate the fact that we need to make get call to add checklist
    .then(function(response){

      console.log("put checklist")
      //Must handle incoming data
      swapchecklist(checklistList, checklist_id) // Pour l'instant n'a pas de sens puisqu'on ne rajoute rien
      console.log("add checklist get call and set finished")
    });
}

const getjourney = (is_local, currentPatient, setCurrentPatient, setPathId,setChecklistList, setJourneyErrorCode) => {
  // First call to ask the journey id corrsesponding to the last journey of the current patient
  new ApiService().get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'journey?patient_id='+currentPatient.id) //Random url, just to simulate the fact that we need to make get call before set checklistList
    .then(function (response) {

      console.log("get journey id for the patient id response", response.data.data ? response.data.data[0].id: null)
      console.log("get journey id for the patient id temp", temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id)
      const path_id = is_local ? temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id : response.data.data[0].id
      setPathId(path_id)
      console.log(process.env.REACT_APP_BASE_URL + '/' + 'journeys/'+path_id)

      // Second call to get the different information, especially the list of checklist, corresponding to the journey
      new ApiService().get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'journey/'+path_id)
        .then(function (response) {
          console.log("get journey corresponding to journey id response", response.data.data ? response.data.data.checklists : null)
          console.log("get journey corresponding to journey id temp", temp_data.paths[path_id].checklists)
          if (!is_local) setCurrentPatient({...currentPatient, intervention_name : response.data.data.surgery.denomination} )
          let checklist_list = is_local ? temp_data.paths[path_id].checklists : response.data.data.checklists
          if (checklist_list && checklist_list.length) {

            new ApiService().get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + "evaluation?journey_id="+path_id) // Will add /path_id when the call will handle get evaluation of a certain journey
              .then(function (response){
                console.log("get evaluation", response)
                if(response.data && response.data.data && response.data.data.length){
                  for( const evaluation of response.data.data){
                    checklist_list.find(checklist => checklist.id === evaluation.checklist.id).fill = true
                  }
                }
                setChecklistList(checklist_list)
              }).catch(error => setJourneyErrorCode(error.message))

          }
        }).catch(error => setJourneyErrorCode(error.message))
    }).catch(error => setJourneyErrorCode(error.message))
}

const postevaluation = (is_local, final_result) => {
  new ApiService().post(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'evaluation', final_result  )
    .then(function (response){
      console.log("evaluation post response", response)
    })
}

const getevaluation = (setCurrentEvals, path_id, alertList=null, setAlertList=null, current_checklist_array = null ) => {
  new ApiService().get(process.env.REACT_APP_BASE_URL + '/' + 'evaluation?journey_id='+path_id )
    .then(function (response){
      console.log("evaluation get response", response)
      setCurrentEvals(response.data.data)
      console.log(current_checklist_array)

      if (alertList !== null){
        let index = 0
        for(const evaluation of response.data.data){
          for(const answer of evaluation.answers){
            const corresp_question_prev = evaluation.checklist.items.filter(item => item.itemId === answer.item_id)[0]
            const corresp_question_current = current_checklist_array.filter(item => corresp_question_prev.name.includes(item.name))
            if(answer.is_pb === 1){
              if(!alertList[corresp_question_prev.name])
                alertList[corresp_question_prev.name] = {id: index++, question_id: corresp_question_current.length ? corresp_question_current[0].itemId : -1,
                  checklist_id: evaluation.checklist.id, checklist_name: evaluation.checklist.title, name : corresp_question_prev.name,
                  answer: utils.trad_answer(JSON.parse(answer.answer)) ? utils.trad_answer(JSON.parse(answer.answer)) : JSON.parse(answer.answer), gravity:0}
            }
            else{
              if(alertList[corresp_question_prev.name])
                alertList[corresp_question_prev.name] = {...alertList[corresp_question_prev.name], gravity:1,}
            }
          }
        }
        setAlertList(alertList)
      }
    })
}

export {postconnection, getusers, getuser, getpatients, getpatient, getwaitingpatients, getchecklist, getchecklists, getchecklist_creation_mode, putchecklist, getjourney, postevaluation, getevaluation}