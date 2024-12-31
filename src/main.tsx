// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import router from "./router";
// import { RouterProvider } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </React.StrictMode>
);
