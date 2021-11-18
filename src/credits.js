import React from "react";

/*Component to show the credits of the web app*/
function Credits ({props}) {
    return (
    <div className="card-inv text-center position-absolute top-50 start-50 translate-middle">
      <div className="card-body">
        <h5 className="card-title m-0"><text className="text-custom">SLS Checklist App</text></h5>
        <p className="card-text text-custom m-0">v0.4</p>
        <p className="card-text text-custom m-0">Développé par Théo Stassen</p>
        <p className="card-text text-custom">theo.stassen@protonmail.com</p>
      </div>
    </div>
  )
}

export {Credits}