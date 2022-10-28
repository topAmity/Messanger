import { useState } from "react";
import "./App.css";
import { AllRoutes } from "./Components/AllRoutes";
import { FloatingChatBtn } from "./Components/ChatButton/";

function App() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FloatingChatBtn />
    </>
  );
}

export default App;
