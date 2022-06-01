import { Html5QrcodeScanner } from "html5-qrcode";
import React, {useEffect, useLayoutEffect, useState} from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

function QrcodeScanner (props){


  useEffect(() => {

    if (props.is_home){
      const input = document.getElementById('input1');
      input.focus();
      input.select();
    }


    // Creates the configuration object for Html5QrcodeScanner.
    function createConfig(props) {
      let config = {};
      if (props.fps) {
        config.fps = props.fps;
      }
      if (props.qrbox) {
        config.qrbox = props.qrbox;
      }
      if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
      }
      if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
      }
      return config;
    }

    let config = createConfig(props);
    let verbose = props.verbose === true;

    // Suceess callback is required.
    if (!(props.qrCodeSuccessCallback )) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId, config, verbose);
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
      console.error("Failed to clear html5QrcodeScanner. ", error);
    });}
  },[]);

  let [codeValue, setCodeValue] = useState("")

  function handleChange (event) {
    console.log(event)
    setCodeValue(event.target.value)
  }

  return(
    <div className={"col-sm-12 mx-auto p-0"}>-

      {props.scanValue === null ?
        <div className={" container custom-scanner pt-4 border border-dark rounded rounded-0-bottom bg-white mx-auto w-100 " + (props.scanValueError || props.scanValue ? " rounded-0-bottom": null)} id={qrcodeRegionId} />
        :
        <div id={qrcodeRegionId}/>
      }

      <input id={"input1"} type="text" className={"form-control w-100 mb-0 bg-white rounded-0-top border-dark border-top-0 " + (props.scanValueError ? "rounded-0": null)}
             value={codeValue}
             onChange={handleChange}
             onKeyPress={event => {if(event.key === 'Enter') props.qrCodeSuccessCallback(codeValue) }}/>




      {props.scanValue !== null ?
        <div className={"container custom-scanner card rounded bg-success mx-auto text-center p-2 border border-dark justify-content-center "}>
          <div className="card-body m-0 p-0">
            <h5 className="card-title text-dark m-0">Code "{props.scanValue}" enregistré</h5>
          </div>
        </div>
        : null}

      {props.scanValueError !== null ?
        <div className={"container custom-scanner card rounded rounded-0-top bg-warning mx-auto text-center p-2  border border-dark justify-content-center "}>
          <div className="card-body m-0 p-0">
            <h5 className="card-title text-dark m-0">Erreur : le code "{props.scanValueError}" ne correspond pas </h5>
          </div>
        </div>
        : null}

    </div>
  )
}

export default QrcodeScanner;