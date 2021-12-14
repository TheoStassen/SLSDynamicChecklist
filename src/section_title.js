import React from "react";
import * as utils from "./utils";

function SectionTitle ({section_title}) {


  console.log(section_title)
  return (
    <div className="card p-2 px-4 mb-2 text-primary shadow-sm border-bottom border-top border-dark">
      {section_title}
    </div>
  )

}

export {SectionTitle}