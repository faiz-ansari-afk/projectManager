
import { useState } from 'react'
import { useSelector } from 'react-redux';
import ProjectList from '../project-list/ProjectList';
import { useCollection } from './../../hooks/useCollection';
//styles
import './Dashboard.css'
import ProjectFilter from './ProjectFilter';

export default function Dashboard() {
  const { documents, error } = useCollection("projects")
  const [currentFilter, setCurrentFilter] = useState('all');

  const { user } = useSelector(state => state.user)

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }
  let filteredProject = null
  if (documents) {
    filteredProject = documents.filter((document) => {
      switch (currentFilter) {
        case 'all':
          return true;
        case 'mine':
          let assignedToMe = false
          document.assignedUsersList.forEach(u => {
            if (u.id === user.uid) {
              assignedToMe = true
            }
          })
          return assignedToMe
        case 'development':
        case 'design':
        case 'sales':
        case 'marketing':
          console.log(document.category, currentFilter);
          return document.category === currentFilter

        case 'completed':
          return document.projectCompleted
        default:
          return true;
      }
    })
  }
  console.log(filteredProject);
  return (
    <div>
      <h2 className='page-title'>Dashboard</h2>
      {error && <p className='error'>{error.code}</p>}
      {filteredProject && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
      {filteredProject && <ProjectList projects={filteredProject} />}
    </div>
  )
}
