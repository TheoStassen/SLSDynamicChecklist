import axios from "axios";
import * as temp_data from "./temporary_data";
import * as utils from "./utils";

const getusers = (is_local, setUserList) => {
  /*Get user list from database*/
  // axios.get('http://checklists.metoui.be/api/users')
  axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/users')
    .then(function(response){

      //Must handle incoming data
      console.log("user list call response", response)
      console.log("user list call temp", temp_data.user_list)
      const user_list = temp_data.user_list// temporary
      setUserList(user_list);
      console.log("initial get user list call and set finished")
    });
  return true
}

const getuser = (is_local, id, setCurrentUser, setScanValueError) => {
  axios.get(is_local ? '#': 'http://checklists.metoui.be/api/users/'+id)
    .then(function(response) {
      console.log("get user at id response", response.data)
      console.log("get user at id temp", temp_data.users[id])
      let corresp_users = is_local ? temp_data.users[id] : response.data // temporary
      // let corresp_patients = response.data
      setCurrentUser(corresp_users ? corresp_users : null)
      setScanValueError(null)
    })
}

const getpatients = (is_local, setPatientList) => {
  /*Get patient list from database*/
  axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/patients')
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
  axios.get(is_local ? '#': 'http://checklists.metoui.be/api/patients/'+id)
    .then(function(response) {
      console.log("get patient at id response", response.data)
      console.log("get patient at id temp", temp_data.patients[id])
      let corresp_patients = is_local ? temp_data.patients[id] : response.data // temporary
      // let corresp_patients = response.data
      setCurrentPatient(corresp_patients ? corresp_patients : null)
      setScanValueError(null)
    })
}

const getchecklist = (is_local, checklist_id, creationMode, checklist, setChecklist, checklistList, alertList, setAlertList, pbresult, result, checklistId, setCreationMode, setChecklistId, setCurrentQuestion, setHomeMode, reset ) => {
  // Get the checklist from database
  axios.get(is_local ? "#" : "http://checklists.metoui.be/api/checklists/"+ checklist_id)
    .then(function(response){

      console.log("checklist swap call response", response)

      const current_creation_mode = creationMode // we use this variable to reset the creation mode after switching
      let checklist_array = is_local ? temp_data.checklist_arrays[checklist_id-1] : response.data.data.items
      // let checklist_array = response.data.data.items

      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)
      let checklist_info = checklistList.filter(elm => elm.id === checklist_id)[0]
      checklist.name = checklist_info.name
      checklist.person = checklist_info.person
      checklist.counter = checklist_info.counter
      setChecklist(checklist)

      /**** Alert gestion section, will be replaced by a get call when the db will handle alert gestion*/

        // Filter alert list to keep only alerts of checklist that precede the current checklist
      let alert_list =  Object.keys(alertList).reduce(function (filtered, key ) {
          if (alertList[key].checklist_id < checklist_id) filtered[key] = alertList[key]
          return filtered
        }, {});

      // Update the gravity of the alerts (if there was an problematic response on a certain question and not anymore)
      Object.keys(alert_list).forEach((key, index) => {
        const corresponding_questions = checklist_array.filter(elm => elm[1].includes(key))
        alert_list[key].question_id = corresponding_questions.length ? corresponding_questions[0][0] : -1
        if (!Object.values(pbresult).filter(elm => elm.name === key).length && Object.values(result).filter(elm => elm.name === key).length){
          alert_list[key].gravity = 1
        }
      })

      //  Add new alerts corresponding ti the checklist we are about to left
      if (checklist_id >= checklistId) Object.keys(pbresult).forEach((key, index) => {
        const name = pbresult[key].name
        const corresponding_questions = checklist_array.filter(elm => elm[1].includes(name))
        console.log(checklist)
        alert_list[name] =
          {
            "id": index, "question_id": corresponding_questions.length ? corresponding_questions[0][0] : -1,
            "checklist_id" : checklistId, "checklist_name" : pbresult[key].checklist_name, "name": name,
            "answer" : (utils.list_possible_answer_trad[pbresult[key].answer] ? utils.list_possible_answer_trad[pbresult[key].answer] : pbresult[key].answer),
            "gravity": 0
          }
      })
      setAlertList(alert_list)


      // const alert_list = []
      // axios.get('http://checklists.metoui.be/api/alerts/'+pathId) //Random url, just to simulate the fact that we need to make get call before set checklistList
      //   .then(function(response){
      //
      //     console.log("get alerts response", response)
      //
      //     const alert_checklists = response.checklists
      //     alert_checklists.forEach(checklist =>
      //       checklist.items.forEach(item =>
      //         alert_list.push({
      //           "question_id": item.item_id,
      //           "checklist_id" : checklist.checklist_id,
      //           "checklist_name" : checklist.checklist_title,
      //           "name": item.item_title,
      //           "answer" : item.answer,
      //           "gravity": item.gravity
      //         })
      //       )
      //     )
      //     setAlertList(alert_list)
      //   })

      // Now that checklist has been selected, we set variables related to checklist to default value

      setCreationMode(false)
      setChecklistId(checklist_id);
      setCurrentQuestion(checklist && checklist.values.length ? checklist.values[0] : null)
      setCreationMode(current_creation_mode)
      setHomeMode(false)
      reset()

      console.log("switch checklist get call and set finished")
    })
}

const getjourney = (is_local, currentPatient, setPathId,setChecklistList) => {
  // First call to ask the journey id corrsesponding to the last journey of the current patient
  axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/journeys?patient_id='+currentPatient.id) //Random url, just to simulate the fact that we need to make get call before set checklistList
    .then(function (response) {

      console.log("get journey id for the patient id respone", response.data.data ? response.data.data[0].id: null)
      console.log("get journey id for the patient id temp", temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id)
      const path_id = is_local ? temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id : response.data.data[0].id
      setPathId(path_id)
      console.log('http://checklists.metoui.be/api/journeys/'+path_id)
      // Second call to get the different information, especially the list of checklist, corresponding to the journey
      axios.get(is_local ? '#' : 'http://checklists.metoui.be/api/journeys/'+path_id)
        .then(function (response) {
          console.log("get journey corresponding to journey id response", response.data.data ? response.data.data.checklists : null)
          console.log("get journey corresponding to journey id temp", temp_data.paths[path_id].checklists)
          let checklist_list = is_local ? temp_data.paths[path_id].checklists : response.data.data.checklists
          if (checklist_list && checklist_list.length) {
            setChecklistList(checklist_list)
          }
        })
    })
}

const postevaluation = (is_local, final_result) => {
  axios.post(is_local ? '#' : 'http://checklists.metoui.be/api/evaluations', final_result  )
    .then(function (response){
      console.log("evalutiaon post response", response)
    })
}

export {getusers, getuser, getpatients, getpatient, getchecklist, getjourney, postevaluation}