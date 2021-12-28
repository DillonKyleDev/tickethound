import React, { useEffect, useState, useRef, useContext } from 'react'
import EditsModal from './EditsModal';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { EditProjectContext, EditTicketContext, EditUserContext, ProjectContext, UserContext } from '../../../App';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


function DisplayTable(props) {
  const classes = useStyles();
  const { project, ticket, type, selectedUser, isNull } = props;
  const [ rows, setRows ] = useState([]);
  const [ message, setMessage ] = useState(`Select "View ${type}" to see details.`);
  const [ ticketsAssigned, setTicketsAssigned ] = useState(null);
  const history = useHistory();
  const editButton = useRef();
  const editsArray = useRef([]);
  const viewEdits = useRef();
  const [ modal, setModal ] = useState(null);
  const [ , setEditingProject ] = useContext(EditProjectContext);
  const [ , setEditingTicket ] = useContext(EditTicketContext);
  const [ , setEditingUser ] = useContext(EditUserContext);
  const [ projects ] = useContext(ProjectContext); 
  const [ user ] = useContext(UserContext);

  useEffect(() => {
    if((type === 'User') && (!isNull)) {
      let ticketsArray = [];
      projects.forEach(project => {
        project.tickets.forEach(ticket => {
          if(ticket.userAssigned === selectedUser.email) {
            ticketsArray.push(ticket);
          }
        });
      }); 
      if(ticketsArray[0]) {
        setTicketsAssigned(ticketsArray);
      } else {
        setTicketsAssigned(null);
      }
    }
  }, [ selectedUser, projects, isNull, type ]);

  useEffect(() => {
    if(isNull && editButton.current) {
      editButton.current.className = 'addNewButton editButtonGrey';
    } else if(!isNull && editButton.current) {
      editButton.current.className = 'addNewButton editButtonGreen';
    }
  }, [ project, ticket, user, isNull ])
  
  useEffect(() => {
    if(project !== null) {
      switch(type) {
        case 'Project':
          setRows([createProjectData( project.projectName, project.projectDescription, project.createdBy, project.usersAssigned, project.tickets )]);
          break;
        
        case 'User':
          if(selectedUser !== null) {
            setRows([createUserData( selectedUser.firstName, selectedUser.lastName, selectedUser.email, selectedUser.accountType, selectedUser.projectsAssigned )]);
          }
          break;
        
        case 'Ticket':
          if(ticket !== null) {
            setRows([createTicketData( ticket.ticketName, ticket.associatedProject, ticket.description, ticket.ticketType, ticket.priority, ticket.userAssigned, ticket.ticketSubmitter, ticket.comments, ticket.isComplete, ticket.editsArray )]);
          }
          break;

        default:

          break;
      }
    }
  }, [ project, ticket, selectedUser, type ]);

  function createProjectData( name, description, creator, usersAssigned, tickets ) {
    let completedTickets = 0;
    tickets.forEach(ticket => {
      if(ticket.isComplete) {
        completedTickets++;
      }
    });
    return {
      projectName: name,
      projectDescription: description,
      createdBy: creator,
      usersAssigned: usersAssigned,
      tickets: tickets,
      completedTickets: completedTickets
    }
  }

  function createTicketData( name, associatedProject, description, type, priority, userAssigned, submitter, comments, isComplete, editsList ) {
    editsArray.current = editsList;
    return {
      ticketName: name,
      associatedProject: associatedProject,
      description: description,
      ticketType: type,
      priority: priority,
      userAssigned: userAssigned,
      ticketSubmitter: submitter,
      comments: comments,
      isComplete: isComplete,
      editsList: editsList
    };
  };

  function createUserData( firstName, lastName, email, accountType, projectsAssigned ) {
    return {
      firstName: firstName,
      lastName: lastName,
      email: email,
      accountType: accountType,
      projectsAssigned: projectsAssigned
    };
  };

  function goToEditItem() {
    switch(type) {
      case 'Project':
        setEditingProject(project);
        break;
      case 'Ticket':
        setEditingTicket(ticket);
        break;
      case 'User':
        setEditingUser(selectedUser);
        break;
      default:
        break;
    }
    if(!isNull) {
      history.push(`/edit${type}`);
    } else {
      setMessage(`No ${type} Selected.. Please "View ${type}" to edit.`);
    }
  };

  function closeModal() {
    setModal(null);
  }
  function goToEditHistory() {
    const viewEditsPosition = viewEdits.current.getBoundingClientRect();
    setModal(<EditsModal editArray={editsArray.current} viewEditsPosition={viewEditsPosition} exitHandler={closeModal}/>);
  };

  return(
    <div className='displayTable'>
      { modal !== null ? modal : null }
      { ((type === 'User') && (user !== null) && (user.accountType === 'Admin')) ?
        <div className='sectionBottomBar sectionTopBar'>
          <button 
          className='addNewButton editButtonGrey'
          ref={editButton}
          onClick={goToEditItem}>
          Edit {type}
          </button>
        </div>
      :
        <div>
          { type === 'User' ? 
            <div className='sectionBottomBar sectionTopBar'/>
          :
            null
          }
        </div>
      }

      { ((type === 'Ticket') && ((user.accountType === 'Project Manager') || (user.accountType === 'Admin') || (user.accountType === 'Developer'))) ?
        <div className='sectionBottomBar sectionTopBar'>
          <button 
          className='addNewButton editButtonGrey'
          ref={editButton}
          onClick={goToEditItem}>
          Edit {type}
          </button>
        </div>
      :
      <div>
        { type === 'Ticket' ? 
          <div className='sectionBottomBar sectionTopBar'/>
        :
          null
        }
      </div>
      }

      { ((type === 'Project') && ((user.accountType === 'Project Manager') || (user.accountType === 'Admin'))) ?
        <div className='sectionBottomBar sectionTopBar'>
          <button 
          className='addNewButton editButtonGrey'
          ref={editButton}
          onClick={goToEditItem}>
          Edit {type}
          </button>
        </div>
      :
      <div>
        { type === 'Project' ? 
          <div className='sectionBottomBar sectionTopBar'/>
        :
          null
        }
      </div>
      }
        

        <TableContainer className='tableContainer' component={Paper}>
              
          { (type === 'Project') && (project !== null) ? 

          <Table size='medium' className={classes.table} aria-label="simple table">
            {rows.map(row => (
            <TableHead key={row.projectName}>
              <TableRow>
                <TableCell className='borderRight noWrap itemHeader topLeftCell' component="th" scope="row" align="left">Project Name</TableCell>
                <TableCell className='itemInfo noWrap topCell' align="left">{row.projectName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='greyCell noWrap borderRight itemHeader' component="th" scope="row" align="left">Description</TableCell>
                <TableCell className='greyCell noWrap itemInfo' align="left">{row.projectDescription}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='borderRight noWrap itemHeader' component="th" scope="row" align="left">Created By</TableCell>
                <TableCell className='itemInfo noWrap' align="left">{row.createdBy}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='greyCell noWrap borderRight itemHeader' component="th" scope="row" align="left">Users Assigned</TableCell>
                
                { row.usersAssigned[0] ? 
                  <TableCell className='greyCell noWrap itemInfo' align="left">
                    {row.usersAssigned.map(user => (
                      <span key={user}>{user} <br/></span>
                    ))}
                  </TableCell>
                :
                  <TableCell className='greyCell noWrap itemInfo'>No users assigned.</TableCell>
                }

              </TableRow>
              <TableRow>
                <TableCell className='borderRight noWrap itemHeader' component="th" scope="row" align="left">Tickets Completed</TableCell>
                <TableCell className='itemInfo noWrap' align="left">{row.completedTickets} / {row.tickets.length}</TableCell>
              </TableRow>
            </TableHead>
              ))}
            </Table>
          : 
            null
          }   
                  { (type === 'Project') && (project === null) ? 
                    <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center"><h2>{message}</h2></TableCell>
                      </TableRow>
                    </TableHead> 
                    </Table>
                  :
                    null
                  }

          { (type === 'Ticket') && (ticket !== null) ? 
            <Table size='medium' className={classes.table} aria-label="simple table">
            {rows.map(row => (
            <TableHead key={row.ticketName}>
              <TableRow>
                <TableCell className='noWrap borderRight itemHeader topLeftCell' component="th" scope="row" align="left">Ticket Name</TableCell>
                <TableCell className='noWrap itemInfo topCell' align="left">{row.ticketName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='greyCell noWrap borderRight itemHeader' component="th" scope="row" align="left">Project</TableCell>
                <TableCell className='greyCell noWrap itemInfo' align="left">{row.associatedProject}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Description</TableCell>
                <TableCell className='noWrap itemInfo' align="left">{row.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='greyCell noWrap borderRight itemHeader' component="th" scope="row" align="left">Type</TableCell>
                <TableCell className='greyCell noWrap itemInfo' align="left">{row.ticketType}</TableCell>
              </TableRow>

              { row.priority === 'Low' ?
                <TableRow>
                  <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Priority</TableCell>
                  <TableCell className='noWrap itemInfo priorityLow' align="left">{row.priority}</TableCell>
                </TableRow>
              :
                null
              }
              { row.priority === 'Medium' ?
                <TableRow>
                  <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Priority</TableCell>
                  <TableCell className='noWrap itemInfo priorityMedium' align="left">{row.priority}</TableCell>
                </TableRow>
              :
                null
              }  
              { row.priority === 'High' ?
                <TableRow>
                  <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Priority</TableCell>
                  <TableCell className='noWrap itemInfo priorityHigh' align="left">{row.priority}</TableCell>
                </TableRow>
              :
                null
              }
              { row.userAssigned ? 
                <TableRow>
                  <TableCell className='noWrap greyCell borderRight itemHeader' component="th" scope="row" align="left">User Assigned</TableCell>
                  <TableCell className='noWrap greyCell itemInfo' align="left">{row.userAssigned}</TableCell>
                </TableRow>
              :
                <TableRow>
                  <TableCell className='noWrap greyCell borderRight itemHeader' component="th" scope="row" align="left">User Assigned</TableCell>
                  <TableCell className='noWrap greyCell itemInfo' align="left">No user assigned.</TableCell>
                </TableRow>
              }
              <TableRow>
                <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Submitter</TableCell>
                <TableCell className='noWrap itemInfo' align="left">{row.ticketSubmitter}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='noWrap greyCell borderRight itemHeader' component="th" scope="row" align="left">Comments</TableCell>
                <TableCell className='noWrap greyCell itemInfo' align="left">{row.comments}</TableCell>
              </TableRow>

              { row.isComplete ? 
                <TableRow>
                  <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Complete</TableCell>
                  <TableCell className='noWrap itemInfo priorityLow' align="left">Yes</TableCell>
                </TableRow>
              :
                <TableRow>
                  <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Complete</TableCell>
                  <TableCell className='noWrap itemInfo priorityMedium' align="left">No</TableCell>
                </TableRow>
              }
      
              <TableRow> 
                <TableCell className='noWrap greyCell borderRight itemHeader'>Edit History ({(row.editsList) && (row.editsList[0]) ? <span>{row.editsList.length}</span> : '0'})</TableCell>
                <TableCell ref={viewEdits} className='noWrap greyCell itemInfo'><button className='viewButton' onClick={goToEditHistory}>View Edit History</button></TableCell>
              </TableRow>

            </TableHead>
              ))}
            </Table>
          :
            null
          }    

                  { (type === 'Ticket') && (ticket === null) ? 
                    <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center"><h2>{message}</h2></TableCell>
                      </TableRow>
                    </TableHead> 
                    </Table>
                  :
                    null
                  }

          { (type === 'User') && (selectedUser !== null) ? 

          <Table size='medium' className={classes.table} aria-label="simple table">
            {rows.map(row => (
            <TableHead key={row.email}>
              <TableRow>
                <TableCell className='noWrap borderRight itemHeader topLeftCell' component="th" scope="row" align="left">First Name</TableCell>
                <TableCell className='noWrap itemInfo topCell' align="left">{row.firstName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='greyCell noWrap borderRight itemHeader' component="th" scope="row" align="left">Last Name</TableCell>
                <TableCell className='greyCell noWrap itemInfo' align="left">{row.lastName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Email</TableCell>
                <TableCell className='noWrap itemInfo' align="left">{row.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='greyCell noWrap borderRight itemHeader' component="th" scope="row" align="left">Account Type</TableCell>
                <TableCell className='greyCell noWrap itemInfo' align="left">{row.accountType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='noWrap borderRight itemHeader' component="th" scope="row" align="left">Tickets Assigned</TableCell>
                
                { (ticketsAssigned !== null) ? 
                <TableCell className='noWrap itemInfo'>{
                  ticketsAssigned.map(ticket => (
                    <span key={ticket.ticketName}>Ticket name: "{ticket.ticketName}" - Project: {ticket.associatedProject}<br/></span>
                  ))
                  }
                </TableCell>
                :
                <TableCell className='noWrap itemInfo'>No Tickets Assigned.</TableCell> }
                
              </TableRow>
            </TableHead>
              ))}
            </Table>
          : 
            null
          }
                { (type === 'User') && (selectedUser === null) ? 
                  <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><h2>{message}</h2></TableCell>
                    </TableRow>
                  </TableHead> 
                  </Table>
                :
                  null
                }
        </TableContainer>       

    </div>
  )
}

export default DisplayTable

/*

*/