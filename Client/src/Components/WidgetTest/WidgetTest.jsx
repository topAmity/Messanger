import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import "./WidgetTest.css";
export const WidgetTest = () => {
  return (
    <div className="frame-wrap">
      <Iframe
        url="http://localhost:3000/register?apiKey=b0eeed0e39d2f3344963d81f0701168884588de1eb673d24&userId=district_admin&displayName=district_admin&email=thanaphon@amity.co"
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
