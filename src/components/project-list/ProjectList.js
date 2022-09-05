import { Link } from 'react-router-dom';
import './ProjectList.css'
import Tooltip from './../tooltip/ToolTip';
import Avatar from './../avatar/Avatar';
export default function ProjectList({ projects }) {
    return (
        <div className={`project-list `}>
            {projects && projects.length === 0 &&
                <p className='zero-project'>
                    Found zero project in database. Click
                    <Link to="/create">here</Link>
                    to create one
                </p>}

            {projects && projects.map(project => (

                <Link key={project.id} to={`/projects/${project.id}`}>
                    <h4>{project.name}</h4>

                    {project.projectCompleted ? <p className='project-complete'>Project completed</p> : <p>Due by {project.dueDate.toDate().toDateString()}</p>}
                    {/* <span className='author'>author: {project.createdBy.displayName}</span> */}
                    <div className='assigned-to'>
                        <ul>
                            {project.assignedUsersList.map(user => (
                                <li key={user.photoURL}>
                                    <Tooltip content={user.displayName} direction="bottom">
                                        <Avatar src={user.photoURL} />
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Link>

            ))}
        </div>
    )
}
