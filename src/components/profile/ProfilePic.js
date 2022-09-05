import { useEffect, useState } from 'react';
import styles from './ProfilePic.module.css'
import { useUpdateImageAndDisplayName } from '../../hooks/useUpdateProfile';
// import { useSelector } from 'react-redux';


export default function ProfilePic() {
    const [displayName, setDisplayName] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailError, setThumbnailError] = useState(null);
    const [disableBtn, setDisableBtn] = useState(true)
    const { error, isPending, updateImageAndDisplayName } = useUpdateImageAndDisplayName();

    // const { user } = useSelector(state => state);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        updateImageAndDisplayName( displayName, thumbnail).then( a => console.log(a))
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
        if (displayName && thumbnail) {
            setDisableBtn(false)
        }
        else {
            setDisableBtn(true)
        }
    }, [displayName, thumbnail])

    return (
        <form className={styles['auth-form']}>
            <h2>Update Profile</h2>
            <label>
                <span>display name:</span>
                <input
                    type="text"
                    required
                    onChange={e => setDisplayName(e.target.value)}
                    value={displayName}
                />
            </label>
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

            <button
                disabled={disableBtn}
                className={disableBtn ? "btn-disable" : 'btn'}
                onClick={handleSubmit}>
                {isPending ? "Loading..." : "Register"}
            </button>


        </form>
    )
}
