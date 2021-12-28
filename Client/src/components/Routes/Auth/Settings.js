import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Sidebar from '../../Sidebar'
import { UserContext, UsersListContext } from '../../../App'
import '../../Auth.css'

function Settings() {
  const [ user ] = useContext(UserContext);
  const [ usersList, setUsersList ] = useContext(UsersListContext);
  const [ passwordTag, setPasswordTag ] = useState('');
  const [ password, setPassword ] = useState(null);
  const [ userObject, setUserObject ] = useState(
    {
      firstName: user.firstName,
      lastName: user.lastName   
    }
  );
  const [ changeSuccessful, setSuccessful ] = useState(false);
  const [ inputMissing, setInputMissing ] = useState(false); 
  const history = useHistory();

  useEffect(() => {
    usersList.forEach(selectedUser => {
      if(selectedUser.email === user.email) {
        setUserObject(
          {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName
          }
        );
      };
    });
  }, [ user.email, usersList ]);

  function handleFirstName(e) {
    let tempObject = {
      firstName: e.target.value,
      lastName: userObject.lastName
    }
    setUserObject(tempObject);
  };
  function handleLastName(e) {
    let tempObject = {
      firstName: userObject.firstName,
      lastName: e.target.value
    }
    setUserObject(tempObject);
  };
  function handlePassword(e) {
    setPassword(e.target.value);
    setPasswordTag(e.target.value);
  };
  function handleSaveChanges() {
    let inputMissing = false;
    if((userObject.firstName === '') || (userObject.lastName === '')) {
      inputMissing = true;
      setInputMissing(true);
    } else {
      inputMissing = false;
      setInputMissing(false);
    }

    if(!inputMissing) {   
      const userInfo = {
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: user.email,
        password: password,
      };
      
      setPasswordTag('');

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
            setSuccessful(true);
            history.push('/settings');
          })
      .catch(err => {
        console.log(err);
        history.push('/users');
      });
    }
  };

  return (
    <div>
      <Sidebar />
      <div className='settingsParent'>
        <h1 className='welcomeMessage'>User Settings:</h1>
      
        <div>

          <div id='settingsDiv'>            
            <div className='innerDiv'>
              First Name: <input className='settingsInput' placeholder='First Name...' value={userObject.firstName} onChange={handleFirstName}/>
            </div>
            <div className='innerDiv'>
              Last Name: <input className='settingsInput' placeholder='Last Name...' value={userObject.lastName} onChange={handleLastName}/>
            </div>
            <div className='innerDiv'>
              Password: <input className='settingsInput' placeholder='New Password...' value={passwordTag} onChange={handlePassword}/>
            </div>
            <button className='addNewButton' id='settingsButton' onClick={handleSaveChanges}>Save Changes</button>

            { inputMissing ? 
              <div className='errorMessage'>*First and last name must not be blank*</div>
            :
              null
            }

            { changeSuccessful ? 
              <div><p><b>Changes saved successfully!</b></p></div>
            :
              null
            }
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default Settings
