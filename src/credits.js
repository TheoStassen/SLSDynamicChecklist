import React from "react";

/*Component to show the credits of the web app*/
function Credits ({props}) {
  return (
    <div className="">
      <div className="card-inv text-center">
        <div className="card-body">
          <h5 className="card-title m-0 text-custom">SLS Checklist App</h5>
          <p className="card-text text-custom m-0">v0.9.2</p>
          <p className="card-text text-custom m-0">Développé par Théo Stassen</p>
          <p className="card-text text-custom">theo.stassen@protonmail.com</p>
        </div>
      </div>
    </div>
  )
}

export {Credits}