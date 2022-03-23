import SignaturePad from "react-signature-canvas";
import React, {useEffect} from "react";

/*Component for the signature pad
* -sigpad: object representing the signature pad, fill in by the SignaturePad component
* -props.setTrimmedCanvasUrl: the canvas url data of the signature set function
* */
function AppSignature (props) {

  let sigpad = props.sigpad

  useEffect(() => {
    reinit_canvas()
  }, [])

  /*Reinitialize the canvas and props.sigpad*/
  const reinit_canvas = () => {
    sigpad.clear()
    props.setTrimmedCanvasUrl(null)
    if (props.item) {
      delete props.result[props.item.id]
      props.setResult(props.result)
    }
  }

  /*Import the current sigpad information into canvas url data*/
  const trim_canvas = () => {
    let dataUrl = sigpad.getTrimmedCanvas().toDataURL();
    props.setTrimmedCanvasUrl(dataUrl);
    props.result[props.item.id] = {name:props.item.name, answer:dataUrl}
    props.setResult(props.result)
    props.forceUpdate()
  }

  /*Return the signature elements*/
  return (
    <div className={"container iq-card border-bottom border-right border-left border-dark shadow " + (props.is_end_sign ? "rounded-0-top" : "border-top m-0 mr-3")}>
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
          <div className="row align-items-center p-0 m-0 mb-2 mt-4 px-4">
            <button type="button" className="btn btn-warning w-100" onClick={trim_canvas}>
              Valider la signature
            </button>
          </div>
          {/*Button to clean the current signature canvas and remove info in data*/}
          <div className=" row align-items-center p-0 m-0 mb-4 px-4">
            <button type="button" className="btn btn-secondary w-100" onClick={reinit_canvas}>
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {AppSignature}