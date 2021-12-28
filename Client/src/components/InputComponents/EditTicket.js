import React from 'react'
import { useRef, useEffect, useContext, useState, useCallback } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import { ProjectContext, UsersListContext, UserContext, EditTicketContext } from '../../App'
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
  const completeButton = useRef();
  const reopenButton = useRef();
  const history = useHistory();
  const [ , setProjects ] = useContext(ProjectContext);
  const [ editingTicket ] = useContext(EditTicketContext);
  const [ tempStatus, setTempStatus ] = useState(editingTicket.isComplete);
  const [ user ] = useContext(UserContext);
  const [ users ] = useContext(UsersListContext);
  const [ loggedInAs ] = useContext(UserContext);
  const [ selectedProject ] = useState(editingTicket.associatedProject);
  const [ ticketType, setTicketType ] = useState(editingTicket.ticketType);
  const [ priority, setPriority ] = useState(editingTicket.priority);
  const [ userAssigned, setUserAssigned ] = useState(editingTicket.userAssigned);
  const [ inputMissingState, setInputMissing ] = useState(false);
  
  useEffect(() => {
    const placeHolder = comments.current;
    placeHolder.addEventListener('change', e => {
      comments.current = e.target.value;
    });
  }, []);

  const callbackFunction = useCallback(() => {
    let inputMissing = false;
    //check all fields for valid values
    if((comments.current === undefined) || (comments.current === "") || (typeof(comments.current) === 'object')) {
      comments.current = `Ticket updated by ${loggedInAs.email}.`;
    };
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

    if(!inputMissing) {
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
        ticketName: ticketName.current.value,
        description: description.current.value,
        comments: comments.current,
        isComplete: tempStatus,
        associatedProject: selectedProject,
        ticketType: ticketType,
        priority: priority,
        userAssigned: userAssigned,
        ticketEditor: loggedInAs.email,
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

      fetch('/editTicket', options)
      .then(() => {
        fetch('/projects')
        .then(response => response.json())
        .then(results => {
          setProjects(results)        
        })
        .catch(err => console.log(err));
        if((user.accountType === 'Admin') || (user.accountType === 'Project Manager')) {
          history.push('/tickets');
        } else {
          history.push('/myTickets');
        }
      })
      .catch(err => {
        console.log(err);
        if((user.accountType === 'Admin') || (user.accountType === 'Project Manager')) {
          history.push('/tickets');
        } else {
          history.push('/myTickets')
        }
      });
    } else { history.push('/editTicket') }
  }, [ selectedProject, ticketType, priority, userAssigned, loggedInAs, history, setProjects, tempStatus, user.accountType ]);

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

  function handleTicketType(event) {
    setTicketType(event.target.value);
  };
  function handlePriority(event) {
    setPriority(event.target.value);
  };
  function handleUserAssigned(event) {
    setUserAssigned(event.target.value);
  };
  function markComplete() {
    setTempStatus(true);
  };
  function reopenTicket() {
    setTempStatus(false);
  };
  function cancelTicket() {
    if((user.accountType === 'Admin') || (user.accountType === 'Project Manager')) {
      history.push('/tickets');
    } else {
      history.push('/myTickets')
    };
  };

  return (
    <div>
    <Sidebar />
    <div className='isCentered2'>

      <div className='formParent wideForm'>
        
        <Typography className="splashMessage">
          <span className="splashMessage">Edit Ticket</span> <br/>
        </Typography>

        <form id="editTicketForm">
          <input ref={ticketName} className='inputField' value={editingTicket.ticketName} readOnly/>
          <input className='inputField' value={editingTicket.associatedProject} readOnly/>
          <div ref={description} className='inputField wideInputField tallInput'><span className='bold'>Description:</span> {<br/>}{editingTicket.description}</div>
    
                <select className='inputField' defaultValue={`${editingTicket.ticketType}`} onChange={handleTicketType}>
                  <option value="">Ticket Type *</option>
                  <option value='Bug'>Bug</option>
                  <option value='Functionality'>Functionality</option>
                  <option value='Graphical'>Graphical</option>
                  <option value='Network'>Network</option>
                  <option value='Compatibility'>Compatibility</option>
                  <option value='Accessability'>Accessability</option>
                  <option value='Other'>Other</option>
                </select>

              
                <select className='inputField' defaultValue={`${editingTicket.priority}`} onChange={handlePriority}>
                  <option value=''>Priority *</option>
                  <option value='Low'>Low</option>
                  <option value='Medium'>Medium</option>
                  <option value='High'>High</option>
                </select>



              <select className='inputField' defaultValue={`${editingTicket.userAssigned}`} onChange={handleUserAssigned}>
                <option value="">{editingTicket.userAssigned}</option>
                <option value=''>User Assigned *</option>
                {users.map(user => (
                    <option key={user.email} value={user.email}>{user.email}</option>
                  ))}
              </select>

          <input ref={comments} className='inputField' placeholder="Comments"/>
          
          <br/>
          { inputMissingState ? <Typography className='errorMessage'><span>Input is missing, please fill out required forms.</span></Typography> : null }
          { !tempStatus ?
            <Button ref={completeButton} onClick={markComplete} className='addNewButton authButton isNotComplete' variant='contained' color='primary'>Mark Complete</Button>
          :
            <Button ref={reopenButton} onClick={reopenTicket} className='addNewButton authButton isComplete' variant='contained' color='primary'>Reopen Ticket</Button>
          }
            <Button ref={submit} className='addNewButton authButton'variant="contained" color="primary">Save Changes</Button>
        </form>
        <Typography className={classes.root}>
          <Link onClick={cancelTicket}>
            Cancel
          </Link>
        </Typography>
      </div>
    </div>
    </div>
  )
}

export default TicketForm
