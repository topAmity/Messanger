import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import "./WidgetTest.css";
export const WidgetTest = () => {
  return (
    <div className="frame-wrap">
      <Iframe
        url="http://localhost:3000/register?apiKey=b0ecb95f6fd3a333493e8a1c540b158ad75c8de1bb333a2e&userId=district_admin&displayName=_admin&email=thanaphon@amity.co"
        width="372px"
        height="600px"
        id=""
        className="frame"
        display="block"
        position="relative"
      />
    </div>
  );
};
