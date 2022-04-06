import { Html5QrcodeScanner } from "html5-qrcode";
import React, {useEffect, useLayoutEffect} from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

function QrcodeScanner (props){


  useEffect(() => {
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
  });


  return(
    <div className={"w-100"}>
      {props.scanValue === null ?
        <div className={" container custom-scanner pt-4 border border-dark rounded bg-white shadow mx-auto w-100 " + (props.scanValueError || props.scanValue ? " rounded-0-bottom": null)} id={qrcodeRegionId} />
        :
        <div id={qrcodeRegionId}/>
      }
      {props.scanValue !== null ?
        <div className={"container custom-scanner card rounded bg-success mx-auto text-center p-2 shadow border border-dark justify-content-center "}>
          <div className="card-body m-0 p-0">
            <h5 className="card-title text-dark m-0">Code "{props.scanValue}" enregistré</h5>
          </div>
        </div>
        : null}

      {props.scanValueError !== null ?
        <div className={"container custom-scanner card rounded rounded-0-top bg-warning mx-auto text-center p-2 shadow border border-dark justify-content-center "}>
          <div className="card-body m-0 p-0">
            <h5 className="card-title text-dark m-0">Erreur : le code "{props.scanValueError}" ne correspond pas </h5>
          </div>
        </div>
        : null}

    </div>
  )
}

export default QrcodeScanner;