import React from 'react'
import { useRef, useEffect, useState, useContext, useCallback } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { UserContext, ProjectContext } from '../../App'
import '../Auth.css'
import Sidebar from '../Sidebar'

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
  const projectName = useRef();
  const projectDescription = useRef();
  const submit = useRef();
  const [ titleUsed, setTitleUsed ] = useState(false);
  const history = useHistory();
  const [ user ] = useContext(UserContext);
  const [ projects, setProjects ] = useContext(ProjectContext);
  const [ inputMissingState, setInputMissing ] = useState(false);

  useEffect(() => {
    const fieldArray = [
      projectName,
      projectDescription,
    ]

    fieldArray.forEach(element => {
      element.current.addEventListener('change', e => {
        element.current = e.target.value;
      });
    });
  }, [ projectName, projectDescription ]);

  const callbackFunction = useCallback(() => {
    let inputMissing = false;
    let titleUsedTemp = false;
    //make sure a value has been assigned to this before posting them
    if((projectName.current === undefined) || (projectName.current === '') || (typeof(projectName.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    };
    if((projectDescription.current === undefined) || (projectDescription.current === '') || (typeof(projectDescription.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    };

    projects.forEach(project => {
      if(project.projectName === projectName.current) {
        titleUsedTemp = true;
        setTitleUsed(true);
      }
    });

    if(!inputMissing && !titleUsedTemp) {
      const projectInfo = {
        projectName: projectName.current,
        projectDescription: projectDescription.current,
        createdBy: user.email,
        usersAssigned: []
      };
  
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify(projectInfo)
      };
      fetch('/projectForm', options)
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
  }, [ projectName, projectDescription, user.email, history, projects, setProjects ]);

  useEffect(() => {
    const placeHolder = submit.current;
    placeHolder.addEventListener('click', callbackFunction);
      if(placeHolder !== null) {
        return (() => {
          placeHolder.removeEventListener('click', callbackFunction)
        })
      }
  }, [ submit, callbackFunction ]);


  return (
    <div>
    <Sidebar />
    <div className='isCentered2'>

      <div className='formParent wideForm'>
        <Typography className='splashMessage'>
          <span className="splashMessage">Please fill out all required fields.</span> <br/>
        </Typography>
        <form id="projectForm">
          <input ref={projectName} className='inputField wideInputField' placeholder='Project Title *' required/>
          <textarea ref={projectDescription} className='inputField wideInputField tallInput' placeholder="Description *" required/>
          { titleUsed ? <Typography className='errorMessage'>Title already used, please try another name.</Typography> : null }
          { inputMissingState ? <Typography className='errorMessage'>Input is missing, please fill out required forms.</Typography> : null }
          <Button ref={submit} className='addNewButton authButton' variant="contained" color="primary">Submit</Button>
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
