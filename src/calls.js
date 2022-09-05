import axios from "./axios";
import * as temp_data from "./utils/temporary_data";
import * as utils from "./utils/utils";

const postconnection = (is_local, loginInfo, setLoginInfo, setIsLogin) => {
  if (!is_local){
    const current_token = window.localStorage.getItem("token")
    if (current_token === null){
      const login_info = {email : loginInfo.username, password : loginInfo.password}
      axios.prototype.post( process.env.REACT_APP_BASE_URL + '/' + "login", login_info)
      // axios.prototype.post( "#")
        .then(function(response){
          console.log(" login" , response)
          // window.localStorage.setItem("token", response.data.token)
          window.localStorage.setItem("token", "12345678910")
          setIsLogin(true)
        })
    }
    else{
      axios.prototype.post( process.env.REACT_APP_BASE_URL + '/' + "session", current_token)
      // axios.prototype.post( "#")
        .then(function (response){
          console.log(" session", response)
          window.localStorage.setItem("token", response.data.token)
          window.localStorage.setItem("token", "10987654321")
          // setLoginInfo({username:  response.data.user.username, password: response.data.password})
          // setLoginInfo({username:  "user1", password: "125"})
          setIsLogin(true)
        })
    }
  }
}

const getusers = (is_local, setUserList) => {
  /*Get user list from database*/
  // axios.get('http://checklists.metoui.be/api/users')
  axios.prototype.get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + "users")
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
  axios.prototype.get(is_local ? '#': process.env.REACT_APP_BASE_URL + '/' + 'users/'+id)
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
  axios.prototype.get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'patient')
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
  axios.prototype.get(is_local ? '#': process.env.REACT_APP_BASE_URL + '/' + 'patient/'+id)
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
  axios.prototype.get(is_local ? "#" : process.env.REACT_APP_BASE_URL + '/' + "checklist/"+ checklist_id)
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
      // axios.prototype.get('http://checklists.metoui.be/api/alerts/'+pathId) //Random url, just to simulate the fact that we need to make get call before set checklistList
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

const getchecklists = (is_local, checklist, setChecklist,
                       setChecklistId, setCurrentQuestion, reset, setCurrentParentQuestion,
                       setCurrentName, setCurrentComment, setCurrentSectionTitle, setTempPreCheck, setChecklistList ) => {
  axios.prototype.get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + "checklist") //Random url, just to simulate the fact that we need to make get call before set checklistList
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
  axios.prototype.get(is_local ? "#" : process.env.REACT_APP_BASE_URL + '/' + "checklist/"+ checklist_id)
    .then(function(response){

      let checklist_array = is_local ? temp_data.checklist_arrays[checklist_id-1] : response.data.data.items
      console.log("get checklist creation mode", checklist_array)

      // Transform the checklist array to checklist tree and add info from checklist list
      checklist = utils.checklist_flat_to_tree(checklist_array,checklist_id)
      let checklist_info = checklistList.filter(elm => elm.id === checklist_id)[0]

      console.log( checklist, checklist_info)
      checklist.name = checklist_info.name
      checklist.person = checklist_info.person
      checklist.counter = checklist_info.counter
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
  axios.put('http://checklists.metoui.be/api/checklists/'+checklist_id, updated_checklist) //Random url, just to simulate the fact that we need to make get call to add checklist
    .then(function(response){

      console.log("put checklist")
      //Must handle incoming data
      swapchecklist(checklistList, checklist_id) // Pour l'instant n'a pas de sens puisqu'on ne rajoute rien
      console.log("add checklist get call and set finished")
    });
}

const getjourney = (is_local, currentPatient, setPathId,setChecklistList) => {
  // First call to ask the journey id corrsesponding to the last journey of the current patient
  axios.prototype.get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'journey?patient_id='+currentPatient.id) //Random url, just to simulate the fact that we need to make get call before set checklistList
    .then(function (response) {

      console.log("get journey id for the patient id respone", response.data.data ? response.data.data[0].id: null)
      console.log("get journey id for the patient id temp", temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id)
      const path_id = is_local ? temp_data.path_list.filter(elm => elm.patient_id === currentPatient.id)[0].path_id : response.data.data[0].id
      setPathId(path_id)
      console.log(process.env.REACT_APP_BASE_URL + '/' + 'journeys/'+path_id)
      // Second call to get the different information, especially the list of checklist, corresponding to the journey
      axios.prototype.get(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'journey/'+path_id)
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
  axios.prototype.post(is_local ? '#' : process.env.REACT_APP_BASE_URL + '/' + 'evaluation', final_result  )
    .then(function (response){
      console.log("evalutiaon post response", response)
    })
}

export {postconnection, getusers, getuser, getpatients, getpatient, getchecklist, getchecklists, getchecklist_creation_mode, putchecklist, getjourney, postevaluation}