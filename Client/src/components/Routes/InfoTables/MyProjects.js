import React, { useContext, useEffect, useState, useRef } from 'react'
import { ProjectContext, UserContext } from '../../../App'
import Sidebar from '../../Sidebar'
import DisplayTable from './DisplayTable'
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

function ProjectTable() {
  const [ projects ] = useContext(ProjectContext);
  const [ user ] = useContext(UserContext);
  const classes = useStyles();
  const [ rows, setRows ] = useState([]);
  const [ project, setProject ] = useState(null);
  const isNull = useRef(true);
  const [ searchWord, setSearchWord ] = useState('');
  const [ searchedTicketsArray, setSearchedTicketsArray ] = useState([]);

  useEffect(() => {
    let tempArray = [];
    let isUser = false;
    rows.forEach(row => {
      if((searchWord !== '') && ((row.name.toUpperCase().includes(searchWord.toUpperCase())) || (isUser))) {
        tempArray.push(row);
      };
    });
    setSearchedTicketsArray(tempArray);
  }, [ searchWord, setSearchWord, rows ]);

  function createData( projectName, usersAssigned, ticketLength, completedTickets, id, index ) {
    return { name: projectName, users: usersAssigned, tickets: ticketLength, completedTickets: completedTickets, projectID: id, projectIndex: index };
  }

  useEffect(() => {
    let placeHolder = [];
    if(projects !== null) {
      projects.forEach((project, index) => {
        let completedTickets = 0;
        project.tickets.forEach(ticket => {
          if(ticket.isComplete) {
            completedTickets++;
          }
        });
        project.usersAssigned.forEach(userAssigned => {
          if(user.email === userAssigned) {
            placeHolder.push(createData(project.projectName, project.usersAssigned.length, project.tickets.length, completedTickets, project._id, index));
            setRows(placeHolder);
          }
        });
      })
    }
  }, [ projects, user.email ]);

  //For displaying in DisplayTable component
  function getProject(event) {
    projects.forEach(element => {
      if(element._id === event.target.dataset.projectid) {
        isNull.current = false;
        setProject(element);
      };
    });
  };

  function handleSearchBar(e) {
    setSearchWord(e.target.value);
  };

  return (
    <div>
      <Sidebar />
        <div className='sectionTopBar'>
          <h2 className='sectionName'>Your Projects</h2>
          <div id='searchBarDiv'>
            <input id='searchBar' placeholder='Search...' onChange={handleSearchBar}/>
          </div>
        </div>
      { searchedTicketsArray[0] ? 
        <TableContainer className='tableContainer' component={Paper}>
        <Table size='medium' className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className='minWidthCell topLeftCell' align='center'>View Details</TableCell>
              <TableCell className='noWrap greyCell topCell'>Project Name</TableCell>
              <TableCell className='noWrap topCell' align="center">Users Assigned</TableCell>
              <TableCell className='noWrap greyCell topCell' align="center">Tickets Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedTicketsArray.map(row => (
              <TableRow key={row.name}>
                <TableCell className='tableCell minWidthCell' align='center' component="th" scope="row">
                  <button className='noWrap viewButton' data-projectid={row.projectID} onClick={event => getProject(event)}>View Project</button>
                </TableCell>
                <TableCell className='noWrap greyCell' align="left">{row.name}</TableCell>
                <TableCell className='noWrap'align="center">{row.users}</TableCell>
                <TableCell className='noWrap greyCell' align="center">{row.completedTickets}/{row.tickets}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      :

      <TableContainer className='tableContainer' component={Paper}>
      <Table size='medium' className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='minWidthCell topLeftCell' align='center'>View Details</TableCell>
            <TableCell className='noWrap greyCell topCell'>Project Name</TableCell>
            <TableCell className='noWrap topCell' align="center">Users Assigned</TableCell>
            <TableCell className='noWrap greyCell topCell' align="center">Tickets Completed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell className='tableCell minWidthCell' align='center' component="th" scope="row">
                <button className='noWrap viewButton' data-projectid={row.projectID} onClick={event => getProject(event)}>View Project</button>
              </TableCell>
              <TableCell className='noWrap greyCell' align="left">{row.name}</TableCell>
              <TableCell className='noWrap'align="center">{row.users}</TableCell>
              <TableCell className='noWrap greyCell' align="center">{row.completedTickets}/{row.tickets}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    }

    <DisplayTable project={project} type='Project' isNull={isNull.current}/>
    </div>
  )
}

export default ProjectTable
