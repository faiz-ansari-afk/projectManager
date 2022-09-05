import { useCollection } from './../../hooks/useCollection';
import Avatar from '../avatar/Avatar';

//styles
import './OnlineUsers.css'

export default function OnlineUsers() {
  const { documents, error } = useCollection("users");
  
  return (
    <div className='user-list'>
      <h2>All Users</h2>
      {error && <div>Firebase Free Plan {error}</div>}
      {documents && documents.map(user => {
      
        return(
        <div key={user.id} className='user-list-item'>
          {user.online && <span className='online-user'></span>}
          <span>{user.displayName}</span>

          <Avatar src={user.photoURL} />
        </div>
      )})}
    </div>
  )
}