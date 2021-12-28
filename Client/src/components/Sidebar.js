import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
//Icon imports
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import FolderIcon from '@material-ui/icons/Folder';
import BugReportIcon from '@material-ui/icons/BugReport';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom'
import { UserContext } from '../App';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function Sidebar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [ user ] = useContext(UserContext);
  const [ isSubmitter, setIsSubmitter ] = useState(false);

  useEffect(() => {
    if(user.accountType === 'Submitter') {
      setIsSubmitter(true);
    };
  }, [ user.accountType ]);

  function logout() {
    const OPTIONS = {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON"
      },
      body: JSON.stringify({})
    }
    fetch('/logout', OPTIONS)
    .then(() => {
      history.push('/');
    })
    .catch(err => console.log(err));
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

//Click handlers for sidebar nav buttons
  function getDashboard() {
    history.push('/dashboard');
  };
  function getProjects() {
    if((user.accountType === 'Admin') || (user.accountType === 'Project Manager')) {
      history.push('/projects');
    } else {
      history.push('/myProjects');
    }
  };
  function getUsers() {
    history.push('/users');
  };
  function getTickets() {
    if(user.accountType === 'Developer') {
      history.push('/myTickets');
    } else {
      history.push('/tickets');
    }
    
  };

  function getSettings() {
    history.push('/settings');
  };


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className='appBar'
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Ticket Hound
          </Typography>
        </Toolbar>
      </AppBar>
     
      <Drawer
        className={classes.drawer}
        id='sidebarDrawer'
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: 'sidebarList',
        }}
      >
        <div className={classes.drawerHeader} id='helloUser'>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Hello, {user.firstName}
            </Typography>
          </Toolbar>
          <IconButton id='sidebarIcon' onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider className='sidebarDivider'/>
        
        <List>
          <ListItem button className="sidebarText" key={'Dashboard'} onClick={getDashboard}>
            <ListItemIcon><DashboardIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary={'Dashboard'} />
          </ListItem>
        
        { user.accountType === 'Admin' ? 
          <ListItem button  className="sidebarText"key={'Manage Users'} onClick={getUsers}>
            <ListItemIcon><PeopleAltIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary={'Manage Users'} />
          </ListItem>
        : 
          <ListItem button className="sidebarText" key={'View Users'} onClick={getUsers}>
          <ListItemIcon><SupervisedUserCircleIcon className="sidebarButton" /></ListItemIcon>
          <ListItemText primary={'View Users'} />
          </ListItem> 
        }
        { !isSubmitter ?
          <ListItem button className="sidebarText" key={'View Projects'} onClick={getProjects}>
            <ListItemIcon><FolderIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary={'View Projects'} />
          </ListItem>
        :
          null
        }

        { user.accountType === 'Admin' ? 
          <ListItem button className="sidebarText" key={'Manage Tickets'} onClick={getTickets}>
            <ListItemIcon><BugReportIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary={'Manage Tickets'} />
          </ListItem>
        : 
          null
        }

        { ((user.accountType === 'Submitter') || (user.accountType === 'Project Manager')) ? 
          <ListItem button className="sidebarText" key={'View Tickets'} onClick={getTickets}>
            <ListItemIcon><BugReportIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary={'View Tickets'} />
          </ListItem>
        : 
          null
        }

        { user.accountType === 'Developer' ? 
          <ListItem button className="sidebarText" key={'My Tickets'} onClick={getTickets}>
            <ListItemIcon><BugReportIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary={'My Tickets'} />
          </ListItem>
        : 
          null
        }
    
        </List>

        <Divider className='sidebarDivider'/>

        <List className='sidebarList'>
          <ListItem button className="sidebarText" key={'Settings'} onClick={getSettings}>
            <ListItemIcon><SettingsIcon  className="sidebarButton"/></ListItemIcon>
            <ListItemText primary={'Settings'} />
          </ListItem>
          
          <ListItem button className="sidebarText" key={'Logout'} onClick={logout}>
            <ListItemIcon><ExitToAppIcon className="sidebarButton" /></ListItemIcon>
            <ListItemText primary='Logout'/>
          </ListItem>
        </List>

      </Drawer>

    </div>
  )
}

export default Sidebar