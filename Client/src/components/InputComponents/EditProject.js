import React from 'react'
import { useRef, useEffect, useState, useContext, useCallback } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { UserContext, ProjectContext, EditProjectContext } from '../../App'
import Sidebar from '../Sidebar'
import '../Auth.css'

//Material UI config
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function ProjectForm() {
  const classes = useStyles();
  const projectDescription = useRef();
  const submit = useRef();
  const deleteProject = useRef();
  const history = useHistory();
  const [ user ] = useContext(UserContext);
  const [ , setProjects ] = useContext(ProjectContext);
  const [ editingProject ] = useContext(EditProjectContext);
  const [ inputMissingState, setInputMissing ] = useState(false);
  const [ description, setDescription ] = useState(editingProject.projectDescription);

  useEffect(() => {
    projectDescription.current.addEventListener('change', e => {
      setDescription(e.target.value);
    });
  }, [  projectDescription ]);

  const callbackFunction = useCallback(() => {
    let inputMissing = false;
    //makes sure a value has been assigned to this before posting them
    if((projectDescription.current === undefined) || (projectDescription.current === '')) {
      inputMissing = true;
      setInputMissing(true);
    };

    if(!inputMissing) {
      const projectInfo = {
        projectName: editingProject.projectName,
        projectDescription: description,
        user: user.email
      };
  
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify(projectInfo)
      };
      fetch('/editProject', options)
      .then(() => {
        fetch('/projects')
        .then(response => response.json())
        .then(results => {
          setProjects(results);
          history.push('/projects');        
        })
        .catch(err => console.log(err));
      })
      .catch(err => {
        console.log(err);
        history.push('/projects');
      });
    }
  }, [ projectDescription, history, user.email, setProjects, description, editingProject.projectName ]);

  useEffect(() => {
    const placeHolder = deleteProject.current;
    const data = {
      projectName: editingProject.projectName
    };
    const options = {
      method: 'POST',
      headers: {
        "Content-type": "Application/JSON"
      },
      body: JSON.stringify(data)
    }

    placeHolder.addEventListener('click', () => {
      fetch('/deleteProject', options)
      .then(() => {
        fetch('/projects')
        .then(result => result.json())
        .then(projects => {
          setProjects(projects);
          history.push('/projects');
        })
        .catch(err => {
          console.log(err);
          history.push('/projects');
        });
      })
      .catch((err) => {
        console.log(err);
      });
    });
  }, [ deleteProject, history, setProjects, editingProject.projectName ]);

  useEffect(() => {
    const placeHolder = submit.current;
    placeHolder.addEventListener('click', callbackFunction);
      if(placeHolder !== null) {
        return (() => {
          placeHolder.removeEventListener('click', callbackFunction)
        })
      }
  }, [ submit, callbackFunction ]);

  function handleDescription(event) {
    setDescription(event.target.value);
  };

  return (
    <div>
    <Sidebar />
    <div className='isCentered2'>
      <div className='formParent wideForm'>
        <Typography className='splashMessage'>
          <span className="splashMessage">Edit Project</span> <br/>
        </Typography>
        <form id="editProjectForm">

          <input className='inputField wideInputField' value={editingProject.projectName} readOnly />
          <textarea ref={projectDescription} className='inputField wideInputField tallInput' placeholder="Description *" value={description} onChange={handleDescription} required/>
          { inputMissingState ? <Typography className='errorMessage'>Input is missing, please fill out required forms.</Typography> : null }
          <Button ref={deleteProject} className='addNewButton deleteButton authButton' variant='contained' color='primary'>Delete Project</Button>
          <Button ref={submit} className='addNewButton authButton' variant="contained" color="primary">Save Changes</Button>
        </form>
        <Typography className={classes.root}>
          <Link onClick={() => history.push('/projects')}>
            Cancel
          </Link>
        </Typography>
      </div>
    </div>
    </div>
  )
}

export default ProjectForm
