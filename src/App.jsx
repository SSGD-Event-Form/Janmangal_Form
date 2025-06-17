import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import GuForm from "./pages/GUForm";
import EnForm from "./pages/ENForm";
import SevakForm from "./pages/Savyamsevk";
import MetaTagTest from "./components/MetaTagTest";
import { useMetaTags } from "./hooks/useMetaTags";
// import ThankUEn from "./pages/ThankUEn";
// import ThankUGu from "./pages/ThankUGu";

function App() {
  // Use the custom hook to update meta tags based on current route
  useMetaTags();

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/en" element={<EnForm />}></Route>
        <Route path="/gu" element={<GuForm />}></Route>
        <Route path="/swayamsevak-form" element={<SevakForm />} />
        <Route path="/test-meta" element={<MetaTagTest />} />
        {/* <Route path="/en-thanku" element={<ThankUEn />}></Route>
        <Route path="/gu-thanku" element={<ThankUGu />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
