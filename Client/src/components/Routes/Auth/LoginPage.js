import React from 'react'
import { useRef, useEffect, useContext, useCallback, useState } from 'react'
import { UserContext, ProjectContext, UsersListContext } from '../../../App'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import '../../Auth.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function LoginPage() {
  const classes = useStyles();
  const email = useRef();
  const password = useRef();
  const login = useRef();
  const history = useHistory();
  const [ inputMissing, setInputMissing ] = useState(false);
  const [ incorrectInput, setIncorrectInput ] = useState(false);
  const [ user, setUser ]  = useContext(UserContext);
  const [ usersList, setUsersList ] = useContext(UsersListContext);
  const [ projects, setProjects ] = useContext(ProjectContext)
    
  const eventListener = useCallback(() => {
    setIncorrectInput(false); 
    let inputMissing = false;
    if((email.current.value === '') || (password.current.value === '')) {
      inputMissing = true;
      setInputMissing(true);
    } else {
      inputMissing = false;
      setInputMissing(false);
    };

    if(!inputMissing) {
      const userInput = {
        email: email.current.value,
        password: password.current.value
      };
      const options = {
        method: "POST",
        headers: {
          "Content-type": "Application/json"
        },
        body: JSON.stringify(userInput)
      };
      fetch('/login', options)
      .then(response => response.json())
      .then(resultUser => {   
        setUser(resultUser.user);
        history.push('/dashboard');
      })
      .catch(err => {
        setIncorrectInput(true);
        console.log(err);
        history.push('/');
      });
    }
  }, [ history, setUser ])

  useEffect(() => {
    email.current.addEventListener('change', e => {
      email.current.value = e.target.value;
    });
    password.current.addEventListener('change', e => {
      password.current.value = e.target.value;
    });
  }, []);
  
  useEffect(() => {
    login.current.addEventListener('click', eventListener);
  }, [ eventListener ]);

  //if user successfully logs in, grab the projects and usersList collections from the db and set projects and usersList state
  useEffect(() => {
    if(projects === null && (user)) {
      const OPTIONS = {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON"
        },
        body: JSON.stringify({})
      }
      fetch('/projects', OPTIONS)
      .then(response => response.json())
      .then(results => {
        setProjects(results)        
      })
      .catch(err => console.log(err));
    }

    if(usersList === null && (user)) {
      const OPTIONS = {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON"
        },
        body: JSON.stringify({})
      }
      fetch('/users', OPTIONS)
      .then(response => response.json())
      .then(results => {
        setUsersList(results);
      })
      .catch(err => console.log(err));
    }
  }, [ user, projects, setProjects, setUsersList, usersList ]);

  function loginAdminDemo() {
    const loginInfo = {
      email: 'AdminTestingUser@yahoo.com',
      password: '123456'
    }
    const OPTIONS = {
      method: "POST",
      headers: {
        "Content-type": "Application/JSON"
      },
      body: JSON.stringify(loginInfo)
    }
    fetch('/login', OPTIONS)
    .then(response => response.json())
    .then(resultUser => {   
      setUser(resultUser.user);
      history.push('/dashboard');
    })
    .catch(err => {
      setIncorrectInput(true);
      console.log(err);
      history.push('/');
    });
  };

  function loginManagerDemo() {
    const loginInfo = {
      email: 'ProjectManager@yahoo.com',
      password: '123456'
    }
    const OPTIONS = {
      method: "POST",
      headers: {
        "Content-type": "Application/JSON"
      },
      body: JSON.stringify(loginInfo)
    }
    fetch('/login', OPTIONS)
    .then(response => response.json())
    .then(resultUser => {   
      setUser(resultUser.user);
      history.push('/dashboard');
    })
    .catch(err => {
      setIncorrectInput(true);
      console.log(err);
      history.push('/');
    });
    
  };

  function loginDeveloperDemo() {
   const loginInfo = {
      email: 'DeveloperUser@yahoo.com',
      password: '123456'
    }
    const OPTIONS = {
      method: "POST",
      headers: {
        "Content-type": "Application/JSON"
      },
      body: JSON.stringify(loginInfo)
    }
    fetch('/login', OPTIONS)
    .then(response => response.json())
    .then(resultUser => {   
      setUser(resultUser.user);
      history.push('/dashboard');
    })
    .catch(err => {
      setIncorrectInput(true);
      console.log(err);
      history.push('/');
    });
  };

  function loginSubmitterDemo() {
    const loginInfo = {
      email: 'SubmitterTestUser@yahoo.com',
      password: '123456'
    }
    const OPTIONS = {
      method: "POST",
      headers: {
        "Content-type": "Application/JSON"
      },
      body: JSON.stringify(loginInfo)
    }
    fetch('/login', OPTIONS)
    .then(response => response.json())
    .then(resultUser => {   
      setUser(resultUser.user);
      history.push('/dashboard');
    })
    .catch(err => {
      setIncorrectInput(true);
      console.log(err);
      history.push('/');
    });
  };

  function goToRegister() {
    history.push('/registerPage');
  };

  return (
    <div className='isCentered'>
    <div className="formParent">

        <div>
          <div className="splashMessage">Demo an Account Type</div> <br/>
          <div id='userImageDiv'> 
            <div className='accountTypeText' onClick={loginAdminDemo}>Admin</div>
            <div className='accountTypeText' onClick={loginManagerDemo}>Project Mgr.</div>
            <div className='accountTypeText' onClick={loginDeveloperDemo}>Developer</div>
            <div className='accountTypeText' onClick={loginSubmitterDemo}>Submitter</div>
          </div>
 
          <span className="smallText">Or Login/Register</span>
        </div>
     
      <form>
        <input className='inputField' ref={email} placeholder='Email *' required/>
        <input className='inputField' ref={password} placeholder='Password *' type='password' action='submit' required/>

        { incorrectInput ? 
          <div className='errorMessage'>*Email or Password is incorrect*</div>
        :
          null
        }

        { inputMissing ? 
          <div className='errorMessage'>*Please provide both Email and Password*</div>
        :
          null
        }

        <Button className='addNewButton authButton' ref={login} variant="contained" color="primary">Login</Button>
      </form> 
      <Typography className={classes.root}>
        <Link onClick={() => goToRegister()}>
          Register
        </Link>
      </Typography>
    </div>
    </div>
  )
}

export default LoginPage;
