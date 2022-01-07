import React from "react";
import * as utils from "./utils";

function SectionTitle ({section_title, index}) {


  console.log(section_title)
  return (
    <div className={"card p-2 px-4 mb-2 text-primary shadow-sm border-bottom border-dark " + (index ? "border-top":"rounded rounded-0-bottom") } >
      {section_title}
    </div>
  )

}

export {SectionTitle}