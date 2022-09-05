import { useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore';
import { useFirestore } from './../../hooks/useFirestore';

//components
import Avatar from './../avatar/Avatar';
import Tooltip from './../tooltip/ToolTip';

//style
import './Project.css'
export default function ProjectSummary({ project }) {
    const { updateDocument, error } = useFirestore("projects")
    const { user } = useSelector(state => state.user)
    const time = Timestamp.fromDate(new Date())
    const handleClick = async (e) => {
        await updateDocument(project.id, {
            projectCompleted: true,
            projectCompletedAt:time
        }
        )
    }
    return (
        <div>
            <div className="project-summary">
                <h2 className="page-title">{project.name}</h2>
                <p className='createdBy'>Author: &nbsp;{project.createdBy.displayName}</p>
                <p className="due-date">Project due by {project.dueDate.toDate().toDateString()}</p>
                <p className="details">{project.details}</p>
                <h4>Project is assigned to:</h4>
                <div className='assigned-users'>
                    {project.assignedUsersList.map(user => (
                        <div key={user.id} >
                            <Tooltip content={user.displayName} direction="bottom">
                                <Avatar src={user.photoURL} />
                            </Tooltip>
                        </div>
                    ))}
                </div>
            </div>
            {project.projectCompleted && <p className='project-marked'>Project Marked as Completed at : {project.projectCompletedAt.toDate().toDateString()}</p>}
            {
                user.uid === project.createdBy.id ?
                !project.projectCompleted && <button className='btn' onClick={handleClick}>Mark as Complete</button> :
                ""
            }
        </div>
    )
}
