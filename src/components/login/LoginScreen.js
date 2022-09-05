import { Link } from 'react-router-dom';
import { useState } from 'react'
import styles from './Login.module.css'
// import { useLogin } from '../../firebase/firebaseHooks';
import { useLogin } from './../../hooks/useLogin';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login,isPending,error} = useLogin();
  const handleLogin = e => {
    e.preventDefault();
    login(email,password)
  }
  return (
    <form className={styles['auth-form']}>
      <h2>Login</h2>
      <label>
        <span>email:</span>
        <input
          type="email"
          required
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          type="password"
          required
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}
      {isPending && <button className='btn-disable'>Loading...</button>}
      {!isPending && <button className='btn' onClick={handleLogin}>Login</button>}
      <div>
        <p className={styles.para}>Don&apos;t have an account ? </p>
        <Link to="/signup"> Register</Link>
      </div>
    </form>
  )
}
