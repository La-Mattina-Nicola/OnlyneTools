import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
