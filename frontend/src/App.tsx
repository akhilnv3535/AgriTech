import './App.css'
import Dashboard from './dashboard'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WeatherDashboard from "./weatheda";
function App() {
  return <Dashboard />
  // return <WeatherDashboard />
  // return (<Routes>
  //   <Route path="/dashboard" element={<Dashboard />} />
  //   <Route path="/weather" element={<WeatherDashboard />} />
  // </Routes>)
}

export default App;

