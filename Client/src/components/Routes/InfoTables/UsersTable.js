import React, { useContext, useState, useEffect, useRef } from 'react'
import { UsersListContext, UserContext } from '../../../App'
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
import { useHistory } from 'react-router-dom'
import '../../Auth.css'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(firstName, lastName, email, accountType, projectsAssigned, id) {
  return { firstName: firstName, lastName: lastName, email: email, accountType: accountType, projectsAssigned: projectsAssigned, userID: id };
} 

function UsersTable() {
  const [ usersList ] = useContext(UsersListContext);
  const [ user ] = useContext(UserContext);
  const history = useHistory();
  const [ rows, setRows ] = useState([]);
  const [ selectedUser, setUser ] = useState(null);
  const isNull = useRef(true);
  const [ searchWord, setSearchWord ] = useState('');
  const [ searchedTicketsArray, setSearchedTicketsArray ] = useState([]);

  useEffect(() => {
    let tempArray = [];
    rows.forEach(row => {
      if((searchWord !== '') && ((row.firstName.toUpperCase().includes(searchWord.toUpperCase())) || 
      ((row.lastName.toUpperCase().includes(searchWord.toUpperCase()))) ||
      ((row.email.toUpperCase().includes(searchWord.toUpperCase()))) ||
      ((row.accountType.toUpperCase().includes(searchWord.toUpperCase()))))) {
        tempArray.push(row);
      };
    });
    setSearchedTicketsArray(tempArray);
  }, [ searchWord, setSearchWord, rows ]);

  useEffect(() => {
    let tempArray = [];
    if(usersList !== null) {
      usersList.forEach(user => {
        tempArray.push( createData(user.firstName, user.lastName, user.email, user.accountType, user.projectsAssigned, user._id) );
        setRows(tempArray);
      });
    }
  }, [ usersList ]);

  function goToUserForm() {
    history.push('/userForm');
  };

  //For displaying on the DisplayTable component
  function getUserByID(event) {
    usersList.forEach(user => {
      if(user._id === event.target.id) {
        isNull.current = false;
        setUser(user);
      };
    });
  };

  function handleSearchBar(e) {
    setSearchWord(e.target.value);
  };
  
  const classes = useStyles();
  return (
    <div>
       <Sidebar />

       <div className='sectionTopBar'>
          <h2 className='sectionName'>Users</h2>
          <div id='searchBarDiv'>
            <input id='searchBar' placeholder='Search...' onChange={handleSearchBar}/>
          </div>

          { user.accountType === 'Admin' ?
            <button className='addNewButton'
            onClick={goToUserForm}>
            + Add New User
            </button>
          :
            null
          }
          
        </div>

      { searchedTicketsArray[0] ? 
      
      <TableContainer className='tableContainer' component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='minWidthCell noWrap topLeftCell' align="center">View Details</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="left">User</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">User Role</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="left">First Name</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchedTicketsArray.map((row) => (
            <TableRow key={row.email}>
              <TableCell className='tableCell minWidthCell noWrap' align='center' scope="row">
                <button className='viewButton' id={row.userID} onClick={event => getUserByID(event)}>View User</button>
              </TableCell>
            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.email}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.accountType}</TableCell>
            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.firstName}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.lastName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

      <TableContainer className='tableContainer' component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='minWidthCell noWrap topLeftCell' align="center">View Details</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="left">User</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">User Role</TableCell>
            <TableCell className='greyCell noWrap LeftPadding topCell' align="left">First Name</TableCell>
            <TableCell className='noWrap LeftPadding topCell' align="left">Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.email}>
              <TableCell className='tableCell minWidthCell noWrap' align='center' scope="row">
                <button className='viewButton' id={row.userID} onClick={event => getUserByID(event)}>View User</button>
              </TableCell>
            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.email}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.accountType}</TableCell>
            <TableCell className='greyCell tableCell noWrap LeftPadding' align="left">{row.firstName}</TableCell>
            <TableCell className='tableCell noWrap LeftPadding' align="left">{row.lastName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  }
    
    <DisplayTable selectedUser={selectedUser} type='User' isNull={isNull.current}/>
    </div>
  )
}

export default UsersTable
