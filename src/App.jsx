import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import AccommodationForm from './pages/ENForm'
import HomePage from './pages/HomePage'
import GujaratiForm from './pages/GUForm';
import ThankUEn from './pages/ThankUEn';
import ThankUGu from './pages/ThankUGu';

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/en" element={<AccommodationForm />}></Route>
        <Route path="/gu" element={<GujaratiForm />}></Route>
        <Route path="/en-thanku" element={<ThankUEn />}></Route>
        <Route path="/gu-thanku" element={<ThankUGu />}></Route>
      </Routes>
    </div>
  );
}

export default App
