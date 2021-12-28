import React from 'react'
import { useRef, useEffect, useContext, useState, useCallback } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { ProjectContext, UsersListContext, UserContext } from '../../App'
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

function TicketForm() {
  const classes = useStyles();
  const ticketName = useRef();
  const description = useRef();
  const comments = useRef();
  const submit = useRef();
  const history = useHistory();
  const [ projects, setProjects ] = useContext(ProjectContext);
  const [ users ] = useContext(UsersListContext);
  const [ loggedInAs ] = useContext(UserContext);
  const [ selectedProject, setSelectedProject ] = useState();
  const [ ticketType, setTicketType ] = useState();
  const [ priority, setPriority ] = useState();
  const [ userAssigned, setUserAssigned ] = useState();
  const [ nameUsed, setNameUsed ] = useState(false);
  const [ inputMissingState, setInputMissing ] = useState(false);
  
  useEffect(() => {
    const fieldArray = [
      ticketName,
      description,
      comments,
    ]

    fieldArray.forEach(element => {
      element.current.addEventListener('change', e => {
        element.current = e.target.value;
      });
    });
  }, []);

  const callbackFunction = useCallback(() => {
    let inputMissing = false;
    let nameUsedTemp = false;
    //check all fields for valid values
    if((comments.current === undefined) || (comments.current === "") || (typeof(comments.current) === 'object')) {
      comments.current = ['Ticket submitted.'];
    };
    if((ticketName.current === undefined) || (ticketName.current === "") || (typeof(ticketName.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    }
    if((description.current === undefined) || (description.current === "") || (typeof(description.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    }
    if((ticketType === undefined) || (ticketType === "")) {
      inputMissing = true;
      setInputMissing(true);
    }
    if((priority === undefined) || (priority === "")) {
      inputMissing = true;
      setInputMissing(true);
    }
    if((userAssigned === undefined) || (userAssigned === "")) {
      inputMissing = true;
      setInputMissing(true);
    }

    projects.forEach(project => {
      project.tickets.forEach(ticket => {
        if(ticket.ticketName === ticketName.current) {
          nameUsedTemp = true;
          setNameUsed(true);
        }
      })
    })

    
    if(!inputMissing && !nameUsedTemp) {
      //getting date/time submitted
      const date = new Date();
      const currentDate = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
      let meridiem;
      let hour;
      if(date.getHours() > 12) {
        hour = date.getHours() - 12;
        meridiem = 'pm';
      } else { 
        hour = date.getHours()
        meridiem = 'am';
      }
      let minute;
      if(date.getMinutes() < 10) {
        minute = `0${date.getMinutes()}`;
      }  else { 
        minute = date.getMinutes();
       }

      const currentTime = `${hour}:${minute}${meridiem}`
      const ticketInfo = {
        ticketName: ticketName.current,
        description: description.current,
        comments: comments.current,
        isCompleted: false,
        associatedProject: selectedProject,
        ticketType: ticketType,
        priority: priority,
        userAssigned: userAssigned,
        ticketSubmitter: loggedInAs.email,
        dateSubmitted: currentDate,
        timeSubmitted: currentTime
      };
      
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify(ticketInfo)
      };

      fetch('/ticketForm', options)
      .then(() => {
        fetch('/projects')
        .then(response => response.json())
        .then(results => {
          setProjects(results)        
        })
        .catch(err => console.log(err));
        history.push('/tickets');
      })
      .catch(err => {
        console.log(err);
        history.push('/tickets');
      });
    } else { history.push('/ticketForm') }
  }, [ selectedProject, ticketType, priority, userAssigned, loggedInAs, history, projects, setProjects ]);

  useEffect(() => {
    const placeHolder = submit.current;
    placeHolder.addEventListener('click', callbackFunction);
    //Prevent multiple event listeners upon state change
    if(placeHolder !== null) {
     return (() => {
      placeHolder.removeEventListener('click', callbackFunction);
     })
    }
  }, [ submit, callbackFunction ]);


  function handleAssociated(event) {
    setSelectedProject(event.target.value)
  };
  function handleTicketType(event) {
    setTicketType(event.target.value);
  };
  function handlePriority(event) {
    setPriority(event.target.value);
  };
  function handleUserAssigned(event) {
    setUserAssigned(event.target.value);
  };

  return (
    <div>
    <Sidebar />
    <div className='isCentered2'>
    
      <div className='formParent wideForm'>
        
        <Typography className="splashMessage">
          <span className="splashMessage">Please fill out all required fields.</span> <br/>
        </Typography>

        <form id="ticketForm">
          <input ref={ticketName} className='inputField' placeholder="Ticket Title *" required/>

              <select className='inputField' value={selectedProject} onChange={handleAssociated}>
                <option value="">Project *</option>
                  {projects.map(project => (
                    <option key={project._id} value={project.projectName}>{project.projectName}</option>
                  ))}
              </select>

          <textarea ref={description} className='inputField wideInputField tallInput' placeholder="Description *" required/>
          
              <select className='inputField' value={ticketType} onChange={handleTicketType}>
                <option value="">Ticket Type *</option>
                <option value='Bug'>Bug</option>
                <option value='Functionality'>Functionality</option>
                <option value='Graphical'>Graphical</option>
                <option value='Network'>Network</option>
                <option value='Compatibility'>Compatibility</option>
                <option value='Accessability'>Accessability</option>
                <option value='Other'>Other</option>
              </select>
          
              <select className='inputField' value={priority} onChange={handlePriority}>
                <option value="">Priority *</option>
                <option value='Low'>Low</option>
                <option value='Medium'>Medium</option>
                <option value='High'>High</option>
              </select>

              <select className='inputField' value={userAssigned} onChange={handleUserAssigned}>
                <option value="">User Assigned *</option>
                {users.map(user => (
                    <option key={user.email} value={user.email}>{user.email}</option>
                  ))}
              </select>

          <input ref={comments} className='inputField' placeholder="Comments"/>
          
          <br/>
          { nameUsed ? <Typography className='errorMessage'><span>Ticket name already used, please try another name.</span></Typography> : null }
          { inputMissingState ? <Typography className='errorMessage'><span>Input is missing, please fill out required forms.</span></Typography> : null }

          <Button ref={submit} className='addNewButton authButton'variant="contained" color="primary">Submit</Button>
        </form>
        <Typography className={classes.root}>
          <Link onClick={() => history.push('/tickets')}>
            Cancel
          </Link>
        </Typography>
      </div>
    </div>
    </div>
  )
}

export default TicketForm
