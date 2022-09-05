import { useSelector } from 'react-redux';
import { useState } from 'react';
import { NavLink } from 'react-router-dom'
import { doc,getDoc  } from "firebase/firestore";
import { firebaseDb } from '../../firebase/config';

//styles and images
import  './Sidebar.css'
import DashboardIcon from '../../assets/dashboard_icon.svg'
import AddIcon from '../../assets/add_icon.svg'
import Avatar from '../avatar/Avatar';

export default function Sidebar() {
    const {user} = useSelector(state=> state.user)
    const navLinks = [
        {title:"Dashboard", path:"/" , imgUrl:DashboardIcon},
        {title:"New Project", path:"/create" , imgUrl:AddIcon},
    ]
    return (
        <div className='sidebar'>
            <div className='sidebar-content'>
                <div className='user'>
                    <Avatar src={user.photoURL} />
                    {user? <p>Hey {user.displayName}</p> : <p>Hey Guest</p>}
                </div>
                <nav className='links'>
                    <ul>
                        {navLinks.map( link=> (
                            <li key={link.title} >
                                <NavLink to={link.path} >
                                    <img src={link.imgUrl} alt={`${link.title} icon`}  />
                                    <span>{link.title}</span>
                                </NavLink>
                            </li>
                        ))
                        }
                    </ul>

                </nav>

            </div>

        </div>
    )
}
