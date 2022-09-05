import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useLogout } from './../../hooks/useLogout';
//styles
import styles from './Navbar.module.css'
import temple from './../../assets/temple.svg'


export default function Navbar() {
    
    const {logout} = useLogout()
    const { user, isPending } = useSelector((state) => state.user);

    const handleLogout = () => {
        logout();
      };
    return (
        <div className={styles.navbar}>

            <ul>
                <li className={styles.logo}>
                    <img
                        alt="temple"
                        src={temple}
                        className={styles.nextImg}
                    />

                    <Link to="/">
                        Project Manager
                    </Link>
                </li>
                {isPending ? <button className='btn'>Logging out...</button>:""}
                {user &&
                    <li>
                        <button className='btn' onClick={handleLogout}>Logout</button>
                    </li>
                }


            </ul>
        </div>
    )
}
