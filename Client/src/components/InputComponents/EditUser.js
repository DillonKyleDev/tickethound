import React from 'react'
import { useRef, useEffect, useState, useCallback, useContext } from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import '../Auth.css'
import { UsersListContext, EditUserContext } from '../../App'
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
  const [ , setUsersList ] = useContext(UsersListContext);
  const [ editingUser ] = useContext(EditUserContext);
  const submit = useRef();
  const history = useHistory();
  const [ accountType, setAccountType ] = useState(editingUser.accountType);
  const [ firstName, setFirstName ] = useState(editingUser.firstName);
  const [ lastName, setLastName ] = useState(editingUser.lastName);
  const email = useRef(editingUser.email);
  const [ password, setPassword ] = useState(null);
  const canCreateProjects = useRef(false);
  const canAssignUsers = useRef(false);
  const [ inputMissingState, setInputMissing ] = useState(false);  

  useEffect(() => {
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
  }, [ accountType, setAccountType ]);

  const eventListener = useCallback(() => {
    //check all fields for valid values
    let inputMissing = false;
    if(!accountType) {
      inputMissing = true;
      setInputMissing(true);
    };

    if(!inputMissing) {   
      const userInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email.current,
        password: password,
        accountType: accountType,
        canCreateProjects: canCreateProjects.current,
        canAssignUsers: canAssignUsers.current
      };
      
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify(userInfo)
      };
      fetch('/editUser', options)
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
  }, [ accountType, firstName, lastName, email, password, history, setUsersList ]);

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

  function handleFirstName(e) {
    setFirstName(e.target.value);
  };
  function handleLastName(e) {
    setLastName(e.target.value);
  };
  function handleAccountType(e) {
    setAccountType(e.target.value);
  };
  function handlePassword(e) {
    setPassword(e.target.value);
  };
  function deleteUser() {
    const userBody = {
      email: editingUser.email
    }
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "Application/JSON"
      },
      body: JSON.stringify(userBody)
    };

    fetch('/deleteUser', options)
    .then(() => {
      fetch('/users')
      .then(result => result.json())
      .then(users => {
        setUsersList(users);
        history.push('/users');
      })
      .catch(err => {
        console.log(err);
        history.push('/users');
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
    <Sidebar />
    <div className='isCentered2'>
   
      <div className='formParent wideForm'>

        <form id="editUserForm">
          <Typography className='splashMessage'>
            <span className="splashMessage">Edit User</span> <br/>
          </Typography>

          <input name='firstName' className='inputField' value={firstName} onChange={handleFirstName}/>
          <input name='lastName' className='inputField' value={lastName} onChange={handleLastName}/>
          <input name='email' className='inputField' value={email.current} readOnly/>       
    
            <select className='inputField' defaultValue={accountType} onChange={handleAccountType}>
              <option value="">Account Type *</option>
              <option value={'Admin'}>Admin</option>
              <option value={'Project Manager'}>Project Manager</option>
              <option value={'Developer'}>Developer</option>
              <option value={'Submitter'}>Submitter</option>
            </select>
            <input name='password' className='inputField wideInputField' placeholder="New Password (optional)" onChange={handlePassword}/>  
            <br/>

            { inputMissingState ? <Typography className='errorMessage'><span>Input is missing, please fill out required forms.</span></Typography> : null }
          <Button className='addNewButton deleteButton authButton' variant='contained' color='primary' onClick={deleteUser}>Delete User</Button>
          <Button ref={submit} className='addNewButton authButton' variant="contained" color="primary">Save Changes</Button>
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
