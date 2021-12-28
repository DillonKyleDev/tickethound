import './App.css';
import { useState, createContext } from 'react'
import Header from './components/Header'
import LoginPage from './components/Routes/Auth/LoginPage'
import RegisterPage from './components/Routes/Auth/RegisterPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Dashboard from './components/Routes/Dashboard'
import ProtectedRoute from './components/Routes/Auth/ProtectedRoute'
import FourZeroFour from './components/Routes/FourZeroFour'
import ProjectTable from './components/Routes/InfoTables/ProjectsTable'
import ProjectForm from './components/InputComponents/ProjectForm'
import TicketTable from './components/Routes/InfoTables/TicketTable'
import TicketForm from './components/InputComponents/TicketForm'
import UsersTable from './components/Routes/InfoTables/UsersTable'
import UserForm from './components/InputComponents/UserForm'
import EditProject from './components/InputComponents/EditProject'
import EditTicket from './components/InputComponents/EditTicket'
import EditUser from './components/InputComponents/EditUser'
import Settings from './components/Routes/Auth/Settings'
import EditsModal from './components/Routes/InfoTables/EditsModal'
import MyProjects from './components/Routes/InfoTables/MyProjects'
import MyTickets from './components/Routes/InfoTables/MyTickets'

export const UserContext = createContext();
export const ProjectContext = createContext();
export const UsersListContext = createContext();
export const EditProjectContext = createContext();
export const EditTicketContext = createContext();
export const EditUserContext = createContext();
export const EditsHistoryContext = createContext();

function App() {
  const [ user, setUser ] = useState(null);
  const [ projects, setProjects ] = useState(null);
  const [ usersList, setUsersList ] = useState(null);
  const [ editingProject, setEditingProject ] = useState(null);
  const [ editingTicket, setEditingTicket ] = useState(null);
  const [ editingUser, setEditingUser ] = useState(null);
  const [ editsHistory, setEditsHistory ] = useState(null);

  return (
    <div className="App">
      <UserContext.Provider value={[ user, setUser ]}>
        <ProjectContext.Provider value={[ projects, setProjects ]}>
          <UsersListContext.Provider value={[ usersList, setUsersList ]}>
            <EditProjectContext.Provider value={[ editingProject, setEditingProject ]}>
              <EditTicketContext.Provider value={[ editingTicket, setEditingTicket ]}>
                <EditUserContext.Provider value={[ editingUser, setEditingUser ]}>
                  <EditsHistoryContext.Provider value={[ editsHistory, setEditsHistory ]}>
                    <Router>
                        <Header />
                        <Switch>
                          <Route exact path='/'>
                            <LoginPage />
                          </Route>
                          <Route exact path='/register'>
                          <RegisterPage />
                          </Route>
                          <ProtectedRoute exact path='/dashboard' component={Dashboard}/>
                          <ProtectedRoute exact path='/projects' component={ProjectTable}/>
                          <ProtectedRoute exact path='/projectForm' component={ProjectForm}/>
                          <ProtectedRoute exact path='/tickets' component={TicketTable}/>
                          <ProtectedRoute exact path='/ticketForm' component={TicketForm}/>
                          <ProtectedRoute exact path='/users' component={UsersTable}/>
                          <ProtectedRoute exact path='/userForm' component={UserForm}/>
                          <ProtectedRoute exact path='/editProject' component={EditProject}/>
                          <ProtectedRoute exact path='/editTicket' component={EditTicket}/>
                          <ProtectedRoute exact path='/editUser' component={EditUser}/>
                          <ProtectedRoute exact path='/settings' component={Settings}/>
                          <ProtectedRoute exact path='/editsModal' component={EditsModal}/>
                          <ProtectedRoute exact path='/myProjects' component={MyProjects}/>
                          <ProtectedRoute exact path='/myTickets' component={MyTickets}/>
                          <Route path=''>
                            <FourZeroFour />
                          </Route>
                        </Switch>            
                    </Router>
                  </EditsHistoryContext.Provider>
                </EditUserContext.Provider>
              </EditTicketContext.Provider>
            </EditProjectContext.Provider>
          </UsersListContext.Provider>
        </ProjectContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
