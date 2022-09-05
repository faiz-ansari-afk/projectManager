import { useParams ,Link} from "react-router-dom";

import './Project.css'
import { useDocument } from './../../hooks/useDocument';
import ProjectSummary from "./ProjectSummary";
import ProjectComments from "./ProjectComments";

export default function Project() {
  const { id } = useParams();
  const { document, error } = useDocument('projects', id)
  
  if (error) {
    return <div><div className="error">{error}</div>
    <Link to="/" replace><button className="btn">Go back</button></Link> 
    </div>
  }
  if (!document) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="project-details">
      <ProjectSummary project={document} />
      <ProjectComments project={document}/>
    </div>
  )
}
