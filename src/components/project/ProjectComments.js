import { useState, useEffect } from 'react'
import { Timestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Tooltip from './../tooltip/ToolTip';
import { useFirestore } from './../../hooks/useFirestore';
import Avatar from '../avatar/Avatar';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectComments({ project }) {
    const { user } = useSelector(state => state.user)
    const { error: err ,document} = useSelector(state => state.firestoreReducer)
    
    const [disableBtn, setDisableBtn] = useState(true)
    const { updateDocument } = useFirestore("projects")

    const [newComment, setNewComment] = useState('');
    const createdAt = Timestamp.fromDate(new Date())
    const handleSubmit = async e => {
        e.preventDefault();
        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            commentedAt: createdAt,
            id: uuidv4(),
        }
        await updateDocument(project.id, {
            comments: [...project.comments, commentToAdd]
        })
        if (!err) {
            setNewComment("")
        }
    }
    const handleReopen = async() =>{
        await updateDocument(project.id, {
            projectCompleted:false,
            projectReopenedAt:createdAt,
            projectCompletedAt:null
        })
    }
    useEffect(() => {
        if (newComment) {
            setDisableBtn(false)
        }
        else {
            setDisableBtn(true)
        }
    }, [newComment])
    return (
        <div>
            <h4>Project Comments</h4>
            <ul className='project-comments'>
                {project.comments.length>0 && project.comments.map(
                    comment => (
                        <li key={comment.id}>
                            <div className='comment-author'>
                                {/* <Tooltip content={comment.displayName} direction="right"> */}
                                    <Avatar src={comment.photoURL} />
                                {/* </Tooltip> */}
                                <p>{comment.displayName}</p>
                                <p className='comment-date'>{formatDistanceToNow(comment.commentedAt.toDate(),{addSuffix:true})}</p>
                            </div>
                            <div className='comment-content'>
                                <p>{comment.content}</p>
                            </div>
                        </li>
                    )
                )}
            </ul>
            {!project.projectCompleted && 
            <form className='project-comments' onSubmit={handleSubmit}>
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)} />
                </label>
                {disableBtn &&
                    <Tooltip content="Write something in comment" direction="right">
                        <button
                            disabled={disableBtn}
                            className="btn-disable"
                        >Add Comment</button>
                    </Tooltip>}
                {!disableBtn && <button className='btn'>Add Project</button>}
            </form>}
            {project.projectCompleted && user.uid === project.createdBy.id  && <p className='reopen-tag'>Reopen this project &nbsp;<button className='btn' onClick={handleReopen}>Reopen</button></p>}
        </div>
    )
}
