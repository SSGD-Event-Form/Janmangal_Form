import { Route, Router, Routes } from 'react-router-dom'
import './App.css'
import AccommodationForm from './pages/ENForm'
import HomePage from './pages/HomePage'
import GujaratiForm from './pages/GUForm';

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/en" element={<AccommodationForm />}></Route>
        <Route path="/gu" element={<GujaratiForm />}></Route>
      </Routes>
    </div>
  );
}

export default App
