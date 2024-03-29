import React, { useContext, useRef, useState } from 'react'
import classes from './AuthForm.module.css'
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import AuthContext from '../AuthContext/auth-context';

const SignUp = () => {
    const emailInputRef=useRef();
    const passwordInputRef=useRef();
    const confirmPasswordInputRef=useRef()
    const authcontext=useContext(AuthContext)

    const [logIn,setLogIn]=useState(false)

    const navigate=useNavigate()

    const switchAuthModeHandler=()=>{
      setLogIn(prevState=>!(prevState))
    }

    const SubmitHandler=(event)=>{
     event.preventDefault();

     const enteredEmail=emailInputRef.current.value;
     const enetredPassword=passwordInputRef.current.value;
     const enteredConfirmPassword=confirmPasswordInputRef.current.value

    

     if(logIn){
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCyzE7q_jL2tqmuLQQXUYBsDY2OgHdHd0E',
      {
        method:'POST',
        body:JSON.stringify({
          email:enteredEmail,
          password:enetredPassword,
          returnSecureToken:true
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res=>{
        //setIsLoading(false)
        if(res.ok){
         console.log(res)
         return res.json()
        }else{
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed!";
            if (data && data.error.message && data.error.message) {
              errorMessage = data.error.message;
            }
             alert(errorMessage);
            throw new Error(errorMessage)
          });
        }
      })
      .then((data)=>{
        // console.log(data.Response)
      
        navigate('/dailyexpenses')
        const idToken=data.idToken
        const email=data.email
        console.log(idToken)
        localStorage.setItem('token',idToken)
        localStorage.setItem('email',email)
        authcontext.logInHandler();
      
      })
      .catch((err)=>{
        alert(err.message)
      })

     }
     else{
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCyzE7q_jL2tqmuLQQXUYBsDY2OgHdHd0E',
      {
        method:'POST',
        body:JSON.stringify({
          email:enteredEmail,
          password:enetredPassword,
          returnSecureToken:true
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res=>{
       // setIsLoading(false)
        if(res.ok){
           console.log('User has successfully signed up.')
        }else{
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed!";
            if (data && data.error.message && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
           // throw new Error(errorMessage)
          });
        }
      })
      .catch(error => {
        console.error('Error during sign up:', error);
       
        passwordInputRef.current.value = '';
        confirmPasswordInputRef.current.value = '';
    });
     }
    }
  return (
    <div className={classes.div}>
    <form className={classes.form} onSubmit={SubmitHandler}>
        <h1 className={classes.heading}>{logIn?'LogIn':'Sign Up'}</h1>
        <label htmlFor="email" className={classes.label}>Email:</label><br/>
        <input type="email" placeholder='Email' id='email' className={classes.input} ref={emailInputRef} required/><br/>
        <label htmlFor="password" className={classes.label}>Password:</label><br/>
        <input type="password" placeholder='Password' id='password' className={classes.input} ref={passwordInputRef} required/><br/>
       { <label htmlFor="confirmpassword" className={classes.label}>Confirm Password:</label>}<br/>
      {   <input type="password" placeholder='Confirm Password' id='confirmpassword' className={classes.input} ref={confirmPasswordInputRef} required/>}<br/>
        <button className={classes.button}>{logIn ? 'LogIn':'Create New Account'}</button>
        {logIn && <NavLink to='/forgotpassword'><p>Forgot Password</p></NavLink>}
        <p className={classes.p} onClick={switchAuthModeHandler}>{logIn?"Create new account":'Login with existing account'}</p>
     

    </form>
    </div>
  )
}

export default SignUp
