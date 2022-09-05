import { useState, useEffect, useRef } from 'react';
import Select from 'react-select'
import { Timestamp } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { useFirestore } from './../../hooks/useFirestore';
import { useCollection } from './../../hooks/useCollection';
import { useNavigate } from 'react-router-dom';

import Tooltip from '../tooltip/ToolTip';
import './Create.css'

export default function Create() {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState({value:null});
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [disableBtn, setDisableBtn] = useState(true)
  const [users, setUsers] = useState([])

  const {addDocument} = useFirestore("projects")
  const response = useSelector(state => state.firestoreReducer)
  
  const { user } = useSelector(state => state.user)
  const navigate = useNavigate()
 
  const { documents, error } = useCollection('users');
  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' }
  ]
  
  useEffect(() => {
    if (documents) {
      const options = documents.map(user => {

        return { value: user, label: user.displayName }
      })
      setUsers(options)
    }
  }, [documents])

  const handleSubmit =async e => {
    e.preventDefault();

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }
    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })
    const projectObject = {
      name,
      details,
      category: category.value,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList,
      projectCompleted:false

    }
    
    
    await addDocument(projectObject)
    console.log(response);
    if(!response.error){
      navigate("/")
    }
    
  }
  useEffect(() => {
    if (name && details && dueDate && category.value && assignedUsers.length > 0) {
      setDisableBtn(false)
    }
    else {
      setDisableBtn(true)
    }
  }, [name, details, dueDate, category, assignedUsers])
  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            type="text"
            onChange={e => setName(e.target.value)}
            value={name}
          />
        </label>

        <label>
          <span>Project details:</span>
          <textarea
            type="text"
            onChange={e => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>

        <label>
          <span>Set due date:</span>
          <input
            type="date"
            required
            onChange={e => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            options={categories}
            onChange={option => setCategory(option)}
          />
        </label>
        <label>
          <span>Assigned to:</span>
          <Select
            onChange={option => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        {disableBtn &&
          <Tooltip content="Please fill all the fields to continue" direction="right">
            <button
              disabled={disableBtn}
              className="btn-disable"
            >Add Project</button>
          </Tooltip>}
        {!disableBtn && <button className='btn'>Add Project</button>}
      </form>
    </div>
  )
}
