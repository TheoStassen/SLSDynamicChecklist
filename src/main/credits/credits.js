import React from "react";

/*Component to show the credits of the web app*/
function Credits () {
  return (
    <div className="">
      <div className="iq-card col-sm-6 mx-auto mt-4 text-center border shadow-sm">
        <div className="card-body">
          <h5 className="card-title m-0 text-custom">DynaList</h5>
          <p className="card-text text-custom m-0">v1.0</p>
          <p className="card-text text-custom m-0">Développé par Théo Stassen</p>
          <p className="card-text text-custom">theo.stassen@protonmail.com</p>
        </div>
      </div>
    </div>
  )
}

export {Credits}