

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSignup } from './../../hooks/useSignup';

import styles from './Signup.module.css'

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [disableBtn, setDisableBtn] = useState(true)

  const { signup, error, isPending } = useSignup();
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password,displayName,thumbnail)
  }
  const handleFileChange = e => {
    setThumbnail(null);
    let selected = e.target.files[0];
    if (!selected) {
      setThumbnailError("Please select a file")
      return
    }
    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb.")
      return
    }
    setThumbnailError(null)
    setThumbnail(selected)
  }

  useEffect(() => {
    if (email && password && displayName && thumbnail) {
      setDisableBtn(false)
    }
    else {
      setDisableBtn(true)
    }
  }, [email, password,displayName,thumbnail])

  return (
    <form className={styles['auth-form']}>
      <h2>Register</h2>
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
      <label>
        <span>display name:</span>
        <input
          type="text"
          required
          onChange={e => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      {/* will implement logic of profile pic in user profile page */}
      <label>
        <span>thumbnail:</span>
        <input
          type="file"
          required
          onChange={handleFileChange}
          accept="image/png, image/gif, image/jpeg"
        // value={password}
        />
        {thumbnailError && <p className={styles.error}>{thumbnailError}</p>}
      </label>
      {error && <p className={styles.error}>{error}</p>}
      {isPending ?
        <button className='btn-disable'>Loading...</button>
        :
        <button
          disabled={disableBtn}
          className={disableBtn ? "btn-disable" : 'btn'}
          onClick={handleSubmit}
        >
          Register
        </button>}


      <div>
        <p className={styles.para}>Already a user ? </p>
        <Link to="/login"> Login</Link>
      </div>
    </form>
  )
}
