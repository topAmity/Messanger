import { Route, Routes } from "react-router-dom";
import { LoginComp } from "./Auth/Login";
import { RegisterComp } from "./Auth/Registration";
import { HomeComp } from "./Home";
import { WidgetTest } from "./WidgetTest/WidgetTest";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeComp />}></Route>
        <Route path="/register" element={<RegisterComp />}></Route>
        <Route path="/login" element={<LoginComp />}></Route>
        <Route path="/iframe" element={<WidgetTest />}></Route>
      </Routes>
    </>
  );
};
