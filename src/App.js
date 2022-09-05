/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { onAuthStateChanged } from "firebase/auth";
import { authIsReady, turnOfAuth,imageUploaded,imageUploadedOf } from './context/userSlice';
import { firebaseAuth } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

//pages and components
import Dashboard from './components/dashboard/Dashboard';
import Create from './components/create/Create';
import LoginScreen from './components/login/LoginScreen';
import SignupScreen from './components/signup/SignupScreen';
import Project from './components/project/Project';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import ProfilePic from './components/profile/ProfilePic';

//styles
import './App.css';
import OnlineUsers from './components/online-users/OnlineUsers';

function App() {
  const dispatch = useDispatch();
  // logic for persisting user after page reloads
  const {authIsReady:isAuth, user} = useSelector(state => state.user)  
  useEffect(() => {
    const unSubs = onAuthStateChanged(  firebaseAuth
      , (user) => {
      dispatch(authIsReady(user));
      unSubs();
    })
  })
  console.log("user-->",user);
  return (
    
    <div className="App">
      {isAuth && <BrowserRouter>
      {user && <Sidebar/>}
        <div className='container'>
          <Navbar/>
          <Routes>
            <Route path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" replace={true} />} 
            />
            <Route path="/login" 
            element={user ? <Navigate to="/" replace={true} /> : <LoginScreen />} 
            />
            <Route path="/signup"
             element={user ? <Navigate to="/" replace={true} /> : <SignupScreen />} 
             />
            <Route path="/create" 
            element={!user ? <Navigate to="/login" replace={true} /> : <Create />} 
            />
            <Route path="/projects/:id" 
            element={ !user ? <Navigate to="/login" replace={true} /> : <Project />} 
            />
          </Routes>
        </div>
        {user && <OnlineUsers />}
      </BrowserRouter>
}
    </div>
  );
}

export default App;
