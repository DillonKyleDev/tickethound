import React, { useContext, useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import { withRouter, useHistory } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import { UserContext } from '../../App';
//Icon imports
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import FolderIcon from '@material-ui/icons/Folder';
import BugReportIcon from '@material-ui/icons/BugReport';
import SettingsIcon from '@material-ui/icons/Settings';

function Dashboard() {
  const [ user ] = useContext(UserContext);
  const history = useHistory();
  const [ isSubmitter, setIsSubmitter ] = useState(false);

  useEffect(() => {
    if(user.accountType === 'Submitter') {
      setIsSubmitter(true);
    };
  }, [ user.accountType ]);

  function goToUsers() {
    history.push('/users');
  };  
  function goToProjects() {
    if((user.accountType === 'Admin') || (user.accountType === 'Project Manager')) {
      history.push('/projects');
    } else {
      history.push('/myProjects');
    }
  };
  function goToTickets() {
    if((user.accountType === 'Admin') || (user.accountType === 'Project Manager') || (user.accountType === 'Submitter')) {
      history.push('/tickets');
    } else {
      history.push('/myTickets');
    }
  };
  function goToSettings() {
    history.push('/settings');
  };

  return (
    <div>
      <Sidebar />
      <div className='dashboardTopBar'>
        <h1 className='welcomeMessage'>Welcome to your { user.accountType } Dashboard!</h1>
      
        <div id='dashboardPage'>

          <Paper className='gridItem'>
            <div id='usersImage'>

              <button className='sectionName addNewButton sectionButton vertical-center' onClick={goToUsers}><PeopleAltIcon className='padding-right-3rem'/> View Users</button>
            </div>
          </Paper>
      
          { !isSubmitter ? 
            <Paper className='gridItem'>
              <div id='projectsImage'>
                <button className='sectionName addNewButton sectionButton vertical-center' onClick={goToProjects}><FolderIcon className='padding-right-3rem' /> View Projects</button>
              </div>
            </Paper>
          :
            null
          }
      
          <Paper className='gridItem'>
            <div id='ticketsImage'>
              <button className='sectionName addNewButton sectionButton vertical-center' onClick={goToTickets}><BugReportIcon className='padding-right-3rem' /> View Tickets</button>
            </div>
          </Paper>
      
          <Paper className='gridItem'>
            <div id='settingsImage'>
              <button className='sectionName addNewButton sectionButton vertical-center' onClick={goToSettings}><SettingsIcon className='padding-right-3rem' /> View Settings</button>
            </div>
          </Paper>
        
        </div>
      </div>
    </div>
  );
}

export default withRouter(Dashboard);