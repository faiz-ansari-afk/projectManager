import Head from 'next/head'

//import components
import Navbar from './../navbar/Navbar';
import Sidebar from './../sidebar/Sidebar';

import styles from './../../styles/Home.module.css'
export default function Wrapper({children}) {

  return (
    <div className={styles.App}>
      <Head>
        <title>Project Manager</title>
      </Head>
      <Sidebar />
      <div className={styles.container}>
        <Navbar />
        {children}
      </div>
    </div>
  )
}
