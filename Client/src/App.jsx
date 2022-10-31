import { StrictMode } from "react";
import "./App.css";
import { FloatingChatBtn } from "./Components/ChatButton/";

function App() {
  return (
    <StrictMode>
      <FloatingChatBtn
        apiKey={""}
        authToken={""}
        userId={""}
        displayName={""}
        email={""}
      />
    </StrictMode>
  );
}

export default App;
