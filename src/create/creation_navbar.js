import {Link} from "react-router-dom";

/* Creation Navbar function
* Return the elements composing the upper navbar of the screen in create route */
function CreationAppNavbar ({props}) {
  /*Props from App */
  let {debugMode, setDebugMode, commentMode, setCommentMode} = props;

  /*Change comment mode*/
  const changecommentmode = () => {
    setCommentMode(!commentMode)
  }

  /*Change debug mode*/
  const changedebugmode = () => {
    setDebugMode(!debugMode)
  }

  return (
    <div className="iq-top-navbar h-auto border" >
      <div className="iq-navbar-custom py-2">
        <nav className="navbar navbar-expand-lg navbar-light p-0 ">
          {/*Navbar Title*/}
          <div className="navbar-brand pl-4 custom-logo">
            <a href="#">
              <span><img className={"w-100"} src={process.env.REACT_APP_PUBLIC_BASE_URL + "photos/logo_dynalist_v2.png"}/></span>
            </a>
          </div>
          {/*/!*Navbar Toggler button*!/*/}
          <button className="navbar-toggler p-0" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                  aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/*/!*Navbar links*!/*/}
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav  p-2 pl-2">
              <label className="nav-link m-0 my-auto mx-auto" >
                <Link className={"nav-link-color"} to={"/"}>
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="q" className="icon mb-1 mr-0"></div>
                    <span>Retour à Dynalist</span>
                  </a>
                </Link></label>
              <li className="nav-item dropdown my-auto">
                <label className="nav-link dropdown-toggle m-0" id="navbarDropdown" role="button"
                       data-toggle="dropdown" aria-expanded="false">
                  <a className="iq-icons-list m-0 p-0 my-auto ">
                    <div data-icon="&#xe040;" className="icon mb-1 mr-0"></div>
                    <span>Options</span>
                  </a>
                </label>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show">
                      <input type="checkbox" checked={!debugMode} onClick={changedebugmode}/>
                      &nbsp; Activer le dynamisme
                    </label>
                  </li>
                  <li>
                    <label className="dropdown-item m-0" data-toggle="collapse" data-target=".navbar-collapse.show">
                      <input type="checkbox" checked={commentMode} onClick={changecommentmode}/>
                      &nbsp; Activer les commentaires
                    </label>
                  </li>
                </ul>
              </li>

            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export {CreationAppNavbar}