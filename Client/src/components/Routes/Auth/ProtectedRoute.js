import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { UserContext } from '../../../App'

function ProtectedRoute({ component: Component }) {
  const [ user ] = useContext(UserContext);
  return (
    <Route 
      render={() => {
        if(user !== null) {
          console.log("authed from protected route")
          return <Component />;
        } else {
          console.log("Not authed from protected route");
          return <Redirect to={{ pathname: '/'}} />
        }
    }}/>
  )
}

export default ProtectedRoute
