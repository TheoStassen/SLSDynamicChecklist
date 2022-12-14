import React from "react";

/* Component for the section title above some questions*/
function SectionTitle ({section_title, index}) {

  return (
    <div className={"card p-2 px-4  mb-0 bg-dark shadow-sm border-bottom border-dark text-center " + (index ? "border-top":"rounded rounded-0-bottom") } >
      <h5 className="text-white ">{section_title}</h5>
    </div>
  )

}

export {SectionTitle}