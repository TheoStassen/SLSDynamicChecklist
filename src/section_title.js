import React from "react";
import * as utils from "./utils";

function SectionTitle ({section_title, index}) {


  // console.log(section_title)
  return (
    <div className={"card p-2 px-4 mb-2 bg-primary shadow-sm border-bottom border-dark text-center " + (index ? "border-top":"rounded rounded-0-bottom") } >
      <h5 className="text-white ">{section_title}</h5>
    </div>
  )

}

export {SectionTitle}