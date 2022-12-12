import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SelectionPage from './GenPage/SelectionPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './Menu Page/MenuPage';
import Profile from './Profile/Profile';
import Signup from './login/Signup';
import useToken from './useToken';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>}></Route>
        <Route path="/SelectionPage" element={<SelectionPage token={localStorage.getItem('token')}/>}></Route>
        <Route path="/MenuPage" element={<MenuPage/>}></Route>
        <Route path="/Profile" element={<Profile token={localStorage.getItem('token')} setToken={() => {const { saveToken } = useToken(); return saveToken; }} />}></Route>
        <Route path="/Signup" element={<Signup/>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

