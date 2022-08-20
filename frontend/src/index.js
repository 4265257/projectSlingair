import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ResProvider } from "./components/ResContext";
ReactDOM.render(
  <ResProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ResProvider>,
  document.getElementById("root")
);
