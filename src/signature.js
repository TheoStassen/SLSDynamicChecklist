import SignaturePad from "react-signature-canvas";
import React from "react";

/*Component for the signature pad
* -sigpad: object representing the signature pad, fill in by the SignaturePad component
* -setTrimmedCanvasUrl: the canvas url data of the signature set function
* */
function AppSignature ({props}) {

  let {sigpad, setTrimmedCanvasUrl} = props;

  /*Reinitialize the canvas and sigpad*/
  const reinit_canvas = () => {
    sigpad.clear()
    setTrimmedCanvasUrl(null)
  }

  /*Import the current sigpad information into canvas url data*/
  const trim_canvas = () => {
    var dataUrl = sigpad.getTrimmedCanvas().toDataURL();
    setTrimmedCanvasUrl(dataUrl);
  }

  /*Return the signature elements*/
  return (
    <div className="container mt-5 mx-auto p-0 container-custom">
      <div className="row align-items-center p-0 m-0 h-100">
        {/*Information text*/}
        <div className="col-sm-3 m-0 p-0 text-center">
          <div className="card card-grey shadow-sm mx-4" >
            <div className="card-body">
              <div className="text-custom">Veuillez rentrer votre signature : </div>
            </div>
          </div>
        </div>
        {/*Signature pad component, receiving the signature*/}
        <div className="col m-0 p-0 h-100 ">
          <div className="sigContainer">
            <SignaturePad canvasProps={{className: "sigPad"}}
              ref={(ref) => { sigpad = ref }} />
          </div>
        </div>
        {/*Validation and Reinitialisation buttons*/}
        <div className="col-md-auto mx-2 p-0">
          {/*Button to validate the current signature and put info into data*/}
          <div className="row align-items-center p-0 m-0 w-100 mb-2">
            <button type="button" className="btn btn-val shadow-sm text-custom" onClick={trim_canvas}>
              Valider la signature
            </button>
          </div>
          {/*Button to clean the current signature canvas and remove info in data*/}
          <div className=" row align-items-center p-0 m-0 h-100">
            <button type="button" className="btn btn-change shadow-sm text-custom"onClick={reinit_canvas}>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {AppSignature}