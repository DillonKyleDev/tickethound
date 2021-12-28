import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import '../../Auth.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function RegisterPage() {
  const classes = useStyles();

  return (
    <div className='isCentered'>
    <div className='formParent'>
      <Typography>
        <span>
          <span className="splashMessage">Welcome to Ticket Hound!</span> <br/> <br/>
          <span className="smallText">Please Login</span>
        </span>
      </Typography>
      <form action='/register' method='POST'>
        <input className='inputField' name='firstName' placeholder='First Name *' required/>
        <input className='inputField' name='lastName' placeholder='Last Name *' required/>
        <input className='inputField' name='email' placeholder='Email *' required/>
        <input className='inputField' name='password' placeholder='Password *' type='password' required/>
        <Button className='addNewButton authButton' variant="contained" color="primary" type='submit'>Register</Button>
      </form>
      <Typography className={classes.root}>
        <Link href='/'>
          Login
        </Link>
      </Typography>
    </div>
    </div>
  )
}

export default RegisterPage
