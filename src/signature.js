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
    <div className="container iq-card mt-5">
      <div className="row align-items-center p-0 m-0 h-100">
        {/*Information text*/}
        <div className="col-sm-3 m-0 p-0 text-center text-dark">
          Veuillez rentrer votre signature :
        </div>
        {/*Signature pad component, receiving the signature*/}
        <div className="col m-0 p-0 h-100 py-2 ">
          <div className="container iq-card m-0 bg-light border">
            <div className="sigContainer">
              <SignaturePad canvasProps={{className: "sigPad"}}
                ref={(ref) => { sigpad = ref }} />
            </div>
          </div>
        </div>
        {/*Validation and Reinitialisation buttons*/}
        <div className="col-sm-3 mx-2 p-0">
          {/*Button to validate the current signature and put info into data*/}
          <div className="row align-items-center p-0 m-0 mb-2 px-4">
            <button type="button" className="btn btn-primary w-100" onClick={trim_canvas}>
              Valider la signature
            </button>
          </div>
          {/*Button to clean the current signature canvas and remove info in data*/}
          <div className=" row align-items-center p-0 m-0 px-4">
            <button type="button" className="btn btn-warning text-dark w-100" onClick={reinit_canvas}>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {AppSignature}