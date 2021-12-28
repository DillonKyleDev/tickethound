import React from 'react'
import { useRef, useEffect, useState, useCallback, useContext } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import '../Auth.css'
import { UsersListContext } from '../../App'
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

function UserForm() {
  const classes = useStyles();
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const password = useRef();
  const canCreateProjects = useRef(false);
  const canAssignUsers = useRef(false);
  const submit = useRef();
  const history = useHistory();
  const [ accountType, setAccountType ] = useState();
  const [ usersList, setUsersList ] = useContext(UsersListContext);
  const [ emailUsed, setEmailUsed ] = useState(false);
  const [ inputMissingState, setInputMissing ] = useState(false);

  const eventListener = useCallback(() => {
    //check all fields for valid values
    let inputMissing = false;
    let emailUsedTemp = false;
    if((firstName.current === undefined) || (firstName.current === "") || (typeof(firstName.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    };
    if((lastName.current === undefined) || (firstName.current === "") || (typeof(lastName.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    };
    if((email.current === undefined) || (firstName.current === "") || (typeof(email.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    };
    if((password.current === undefined) || (firstName.current === "") || (typeof(password.current) === 'object')) {
      inputMissing = true;
      setInputMissing(true);
    };
    if((accountType === undefined) || (firstName.current === "")) {
      inputMissing = true;
      setInputMissing(true);
    };
    
    usersList.forEach(user => {
      if(user.email === email.current) {
        emailUsedTemp = true;
        setEmailUsed(true);
      }
    });

    if(!inputMissing && !emailUsedTemp) {
      //Assign permissions based on account type
      switch(accountType) {
        case 'Admin':
          canCreateProjects.current = true;
          canAssignUsers.current = true;
          break;
        case 'Project Manager':
          canCreateProjects.current = false;
          canAssignUsers.current = true;
          break;
        case 'Developer':
          canCreateProjects.current = false;
          canAssignUsers.current = false;
          break;
        case 'Submitter':
          canCreateProjects.current = false;
          canAssignUsers.current = false;
          break;
        default:
          canCreateProjects.current = false;
          canAssignUsers.current = false;
          break;
      }
    
      const projectInfo = {
        firstName: firstName.current,
        lastName: lastName.current,
        email: email.current,
        password: password.current,
        accountType: accountType,
        canCreateProjects: canCreateProjects.current,
        canAssignUsers: canAssignUsers.current
      };
      
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify(projectInfo)
      };
      fetch('/userForm', options)
      .then(() => {
          fetch('/users')
          .then(response => response.json())
          .then(results => {
            setUsersList(results);
          })
          .catch(err => console.log(err));
            history.push('/users');
          })
      .catch(err => {
        console.log(err);
        history.push('/users');
      });
    }
  }, [ accountType, firstName, lastName, email, password, history, usersList, setUsersList ]);

  useEffect(() => {
    const placeHolder = submit.current;
    placeHolder.addEventListener('click', eventListener);
    return () => {
      //Prevent multiple event listeners upon state change
      if(placeHolder !== null) {
        placeHolder.removeEventListener('click', eventListener);
      }
    }
  }, [ submit, eventListener ]);


  const handleAccountType = (event) => {
    setAccountType(event.target.value);
  };
  function setFirstName(e) {
    firstName.current = e.target.value;
  };
  function setLastName(e) {
    lastName.current = e.target.value;
  };
  function setEmail(e) {
    email.current = e.target.value;
  };
  function setPassword(e) {
    password.current = e.target.value;
  };

  return (
    <div>
    <Sidebar />
    <div className='isCentered2'>
    
      <div className='formParent wideForm'>

        <form id="userForm">
          <Typography className='splashMessage'>
            <span className="splashMessage">Please fill out all fields.</span> <br/>
          </Typography>

          <input name='firstName' className='inputField' placeholder="First Name *" required onChange={setFirstName}/>
          <input name='lastName' className='inputField' placeholder="Last Name *" required onChange={setLastName}/>
          <input name='email' className='inputField wideInputField' placeholder="Email *" required onChange={setEmail}/>
          <input name='password' type='password' className='inputField' placeholder="Password *" required onChange={setPassword}/>
              
            <select className='inputField' value={accountType} onChange={handleAccountType}>
              <option value="">Account Type *</option>
              <option value={'Admin'}>Admin</option>
              <option value={'Project Manager'}>Project Manager</option>
              <option value={'Developer'}>Developer</option>
              <option value={'Submitter'}>Submitter</option>
            </select>

            { emailUsed ? <Typography className='errorMessage'><span>Email already used, please try another email.</span></Typography> : null }
            { inputMissingState ? <Typography className='errorMessage'><span>Input is missing, please fill out required forms.</span></Typography> : null }

          <Button ref={submit} className='addNewButton authButton' variant="contained" color="primary">Submit</Button>
        </form>

        <Typography className={classes.root}>
          <Link onClick={() => history.push('/users')}>
            Cancel
          </Link>
        </Typography>
      </div>
    </div>
    </div>
  )
}

export default UserForm
