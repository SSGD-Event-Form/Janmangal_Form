import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import GuForm from "./pages/GuForm";
import EnForm from "./pages/EnForm";
// import ThankUEn from "./pages/ThankUEn";
// import ThankUGu from "./pages/ThankUGu";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/en" element={<EnForm />}></Route>
        <Route path="/gu" element={<GuForm />}></Route>
        {/* <Route path="/en-thanku" element={<ThankUEn />}></Route>
        <Route path="/gu-thanku" element={<ThankUGu />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
