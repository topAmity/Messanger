import { StrictMode } from "react";
import "./App.css";
import { FloatingChatBtn } from "./Components/ChatButton/";

function App() {
  return (
    <StrictMode>
      <FloatingChatBtn
        apiKey={"b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"}
        authToken={""}
        userId={"Farrari"}
        displayName={"Farrari"}
        email={"naphat.swd@gmail.com"}
      />
    </StrictMode>
  );
}

export default App;
