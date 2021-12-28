import React, { useContext, useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import { ProjectContext, UserContext } from '../../../App'
import DisplayTable from './DisplayTable';
import Sidebar from '../../Sidebar'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(ticketName, project, description, type, priority, user, submitter, comments, isComplete, ticketIndex, projectIndex) {
  return { ticketName: ticketName, associatedProject: project, description: description, ticketType: type, 
    priority: priority, userAssigned: user, ticketSubmitter: submitter, comments: comments, isComplete: isComplete, ticketIndex: ticketIndex, projectIndex: projectIndex };
}

function TicketTable() {
  const [ projects ] = useContext(ProjectContext);
  const [ user ] = useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();
  const [ rows, setRows ] = useState([]);
  const [ ticket, setTicket ] = useState(null);
  const [ showCompleted, setShowCompleted ] = useState(false);
  const isNull = useRef(true);
  const [ searchWord, setSearchWord ] = useState('');
  const [ searchedTicketsArray, setSearchedTicketsArray ] = useState([]);

  useEffect(() => {
    let tempArray = [];
    if(projects !== null) {
      projects.forEach((project, projectIndex) => {
        project.tickets.forEach((ticket, ticketIndex) => {
          if(user.email === ticket.userAssigned) {
            tempArray = [ ...tempArray, createData(ticket.ticketName, ticket.associatedProject, ticket.description, ticket.ticketType, ticket.priority, ticket.userAssigned, ticket.ticketSubmitter, ticket.comments, ticket.isComplete, ticketIndex, projectIndex) ];
            setRows(tempArray);
          }
        })
      });
    }
  }, [ projects, user.email ]);
  

  useEffect(() => {
    let tempArray = [];
    rows.forEach(row => {
      if((searchWord !== '') && ((row.ticketName.toUpperCase().includes(searchWord.toUpperCase())) || 
      ((row.associatedProject.toUpperCase().includes(searchWord.toUpperCase()))) ||
      ((row.userAssigned.toUpperCase().includes(searchWord.toUpperCase()))) ||
      ((row.priority.toUpperCase().includes(searchWord.toUpperCase()))))) {
        tempArray.push(row);
      };
    });
    setSearchedTicketsArray(tempArray);
  }, [ searchWord, setSearchWord, rows ]);


  //for displaying on the DisplayTable component
  function getTicketByIndex(event) {
    isNull.current = false;
    setTicket(projects[event.target.dataset.projectindex].tickets[event.target.dataset.ticketindex]);
  };

  function handleShowCompleted() {
    setShowCompleted(!showCompleted);
  };

  function goToTicketForm() {
    history.push('/ticketForm');
  };

  function handleSearchBar(e) {
    setSearchWord(e.target.value);
  };

  return (
    <div>
      <Sidebar />
      
        <div className='sectionTopBar'>
          <h2 className='sectionName'>Your Tickets</h2>
          <div id='checkBox'>
            <input type='checkbox' name='showCompleted' onClick={handleShowCompleted}/>
            <label>Show Completed</label>
          </div>
          <div id='searchBarDiv'>
            <input id='searchBar' placeholder='Search...' onChange={handleSearchBar}/>
          </div>
            <button className='addNewButton'
            onClick={goToTicketForm}>
            + Add New Ticket
            </button>
        </div>

      { searchedTicketsArray[0] ?
      <TableContainer className='tableContainer' component={Paper}>
      <Table className={classes.table} aria-label="simple table">

        <TableHead>
          <TableRow>
            <TableCell className='noWrap minWidthCell topLeftCell' align="center">View Details</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="left">Ticket Name</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">Project</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="center">Priority</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">User Assigned</TableCell>
            <TableCell className='greyCell noWrap LeftPadding smallCell topCell' align="center">Complete</TableCell>
          </TableRow>
        </TableHead>
        
        {searchedTicketsArray.map((row) => (
        <TableBody key={row.ticketName}>
        { showCompleted ? 
          <TableRow>
             
            <TableCell className='tableCell minWidthCell noWrap' align='center' component="th" scope="row">
              <button className='viewButton' data-ticketindex={row.ticketIndex} data-projectindex={row.projectIndex} onClick={event => getTicketByIndex(event)}>View Ticket</button>
            </TableCell>

            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.ticketName}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.associatedProject}</TableCell>
          {row.priority === 'Low' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityLow' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'Medium' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'High' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityHigh' align="center">{row.priority}</TableCell>
          : null }
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.userAssigned}</TableCell>
          {row.isComplete ?
            <TableCell className='tableCell noWrap LeftPadding priorityLow smallCell' align="center">Yes</TableCell>
          : 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium smallCell' align="center">No</TableCell>
          }
            </TableRow>
          :
            null
          }

          { ((!showCompleted) && (!row.isComplete)) ? 
            <TableRow key={row.ticketName}>
          
            <TableCell className='tableCell minWidthCell noWrap' align='center' component="th" scope="row">
              <button className='viewButton' data-ticketindex={row.ticketIndex} data-projectindex={row.projectIndex} onClick={event => getTicketByIndex(event)}>View Ticket</button>
            </TableCell>

            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.ticketName}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.associatedProject}</TableCell>
          {row.priority === 'Low' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityLow' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'Medium' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'High' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityHigh' align="center">{row.priority}</TableCell>
          : null }
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.userAssigned}</TableCell>
          {row.isComplete ?
            <TableCell className='tableCell noWrap LeftPadding priorityLow smallCell' align="center">Yes</TableCell>
          : 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium smallCell' align="center">No</TableCell>
          }
            </TableRow>
          : null }

            </TableBody>
          ))}
        
        </Table>
      </TableContainer>
      :

      <TableContainer className='tableContainer' component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='noWrap minWidthCell topLeftCell' align="center">View Details</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="left">Ticket Name</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">Project</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="center">Priority</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">User Assigned</TableCell>
            <TableCell className='greyCell noWrap LeftPadding smallCell topCell' align="center">Complete</TableCell>
          </TableRow>
        </TableHead>
        
        {rows.map((row) => (
        <TableBody key={row.ticketName}>
        { showCompleted ? 
          <TableRow>
             
            <TableCell className='tableCell minWidthCell noWrap' align='center' component="th" scope="row">
              <button className='viewButton' data-ticketindex={row.ticketIndex} data-projectindex={row.projectIndex} onClick={event => getTicketByIndex(event)}>View Ticket</button>
            </TableCell>

            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.ticketName}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.associatedProject}</TableCell>
          {row.priority === 'Low' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityLow' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'Medium' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'High' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityHigh' align="center">{row.priority}</TableCell>
          : null }
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.userAssigned}</TableCell>
          {row.isComplete ?
            <TableCell className='tableCell noWrap LeftPadding priorityLow smallCell' align="center">Yes</TableCell>
          : 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium smallCell' align="center">No</TableCell>
          }
            </TableRow>
          :
            null
          }

          { ((!showCompleted) && (!row.isComplete)) ? 
            <TableRow key={row.ticketName}>
          
            <TableCell className='tableCell minWidthCell noWrap' align='center' component="th" scope="row">
              <button className='viewButton' data-ticketindex={row.ticketIndex} data-projectindex={row.projectIndex} onClick={event => getTicketByIndex(event)}>View Ticket</button>
            </TableCell>

            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.ticketName}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.associatedProject}</TableCell>
          {row.priority === 'Low' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityLow' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'Medium' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium' align="center">{row.priority}</TableCell>
          : null }
          {row.priority === 'High' ? 
            <TableCell className='tableCell noWrap LeftPadding priorityHigh' align="center">{row.priority}</TableCell>
          : null }
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.userAssigned}</TableCell>
          {row.isComplete ?
            <TableCell className='tableCell noWrap LeftPadding priorityLow smallCell' align="center">Yes</TableCell>
          : 
            <TableCell className='tableCell noWrap LeftPadding priorityMedium smallCell' align="center">No</TableCell>
          }
            </TableRow>
          : null }

            </TableBody>
          ))}

      </Table>
    </TableContainer>
    }
    
    <DisplayTable ticket={ticket} type={'Ticket'} isNull={isNull.current}/>
    </div>
  )
}

export default TicketTable
