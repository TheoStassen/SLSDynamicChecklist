import {useState} from "react";

/*Component that show texts about the app / the patient and allow to pass the scanner if needed
* */
function UserBox ({props}) {
  let {onNewScanResult, loginErrorCode} = props

  /* State variables used in user box only
  * -isWaitingLogin : indicates if we are waiting the login
  * */
  let [isWaitingLogin, setIsWaitingLogin] = useState(false)

  /*Function to trespass the verification, consider that a correct scan has been obtained*/
  function debug_allow_user() {
    setIsWaitingLogin(true)
    onNewScanResult("theo.stassen@hepl.be_Test123.")
  }

  return (
    <div className="container p-2 mt-2">
      {isWaitingLogin ? <div className="d-flex justify-content-center m-2">
        <div className={"small-icon"}><lottie-player src="https://assets4.lottiefiles.com/private_files/lf30_tcux3hw6.json"  background="transparent"  speed="2"  loop autoplay></lottie-player></div>
      </div> : null
      }
      <div className={"iq-card bg-white col-sm-12 mx-auto mb-0 p-2 text-center shadow-sm border border-primary justify-content-center"}>
        <div className="card-body mx-auto">
          <div className={"row"}>
            <div className={"col-sm-6 my-auto p-0 "}>
              <h3 className="card-title text-primary"> Bonjour, Bienvenue sur </h3>
              <img className={" w-75 bg-transparent"} src={process.env.REACT_APP_PUBLIC_BASE_URL + "photos/logo_dynalist_v2.png"}/>
            </div>

            <div className={"col-sm-6 my-auto pl-4 "}>
              <h4 className="card-title text-secondary text-left"> Vous pouvez vous connecter en scannant votre badge ou en rentrant votre code d'identification </h4>

              {loginErrorCode ?
                <div className={"iq-card mx-auto text-center p-2 shadow-sm border justify-content-center mt-2"}>
                  <h6 className="card-text text-danger m-0 p-0"> <div data-icon="&#xe063;" className="icon text-danger"> Aucun utilisateur n'est trouvé, problème de connexion ("{loginErrorCode}") </div></h6>
                </div>
                : null}
              {/*Button to pass the verification*/}
              <button className={"btn btn-outline-primary btn-round m-2"} onClick={() =>debug_allow_user()}>Passer Qr Code</button>
            </div>
          </div>



        </div>
      </div>
    </div>
  )
}

export {UserBox}