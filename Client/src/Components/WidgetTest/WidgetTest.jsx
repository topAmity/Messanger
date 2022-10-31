import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import "./WidgetTest.css";
export const WidgetTest = () => {
  return (
    <div className="frame-wrap">
      <Iframe
        url="http://localhost:3000/register?apiKey=b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f&userId=top&displayName=top&email=thanaphon@amity.co"
        width="350px"
        height="550px"
        id=""
        className="frame"
        display="block"
        position="relative"
      />
    </div>
  );
};
