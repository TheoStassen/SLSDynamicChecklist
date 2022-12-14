import {UserBox} from "./user_box";
import QrcodeScanner from "../qrcodescanner";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom"
import * as calls from "../../calls";
import {useState} from "react";

/*Login App Function,
* -Declare all the variables and function specific to login route
* -Return the elements that allow the user to login to the app :
*  user box (to welcome the user) and scanner (to authentify the user) */
export default function LoginApp({props}) {
  /*Props from App */
  let { loginInfo, setLoginInfo, setIsLogin, setCurrentUser, isLogin} = props

  /* State variables used in login route only
  * -loginErrorCode (string) : string containing error prompt if a post login call fail.
  * */
  let [loginErrorCode, setLoginErrorCode] = useState(null)

  /*Function used to navigate between routes*/
  const navigate = useNavigate()

  /*Function triggered when the scanner return a decoded text*/
  function onNewScanResult(decodedText) {
    window.scrollTo(0, 0);

    const login_info = {username:decodedText.split("_")[0], password: decodedText.split("_")[1]}
    setLoginInfo(login_info)
    // Call used to try to login with the login info
    calls.postconnection(login_info,setLoginInfo, setIsLogin, setLoginErrorCode, setCurrentUser)
  }

  /*Function triggered only when isLogin is updated, navigate to patient page if true*/
  useEffect(() => {
    if (isLogin === true){
      navigate("/main/patient")
    }
  }, [isLogin])

  /*Function triggered only when the component is mount */
  useEffect(() => {
    onNewScanResult = onNewScanResult.bind(this);

    // call use to try to session (as loginInfo is not set already)
    calls.postconnection( loginInfo, setLoginInfo, setIsLogin, setLoginErrorCode, setCurrentUser)

  }, [])

  return (
    <div>
      <UserBox props={{
        onNewScanResult,
        loginErrorCode
      }} />
      <div className={"container p-2"}>
        <QrcodeScanner fps={10}
                       qrbox={250}
                       disableFlip={false}
                       qrCodeSuccessCallback={onNewScanResult}
                       scanValue={null}
                       is_home={true}/>
      </div>
    </div>
  )
}
