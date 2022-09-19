import React, { useState } from 'react';
import left_image from './left_bg_image.png';
import right_image from './right_bg_image.jpg';
import './Authentication.css';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { Button, TextField, Checkbox } from '@mui/material';
import {NavigationBar, Footer} from '../Common/CommonComponent';
import { checkUserAccess, login, signup } from '../../api/ckdAPI';
import Cookies from 'js-cookie';


/** Renders complete background image related tasks */
const Background = (props)=>{
    return (
        <div className='bg-container'>
            <img className='animate__animated animate__fadeIn animate__delay-1s bg-right' src={right_image}/>
            <img className='animate__animated animate__fadeInLeft bg-left' src={left_image}/>
        </div>
    );
}

/** Renders Login form */
const Login = (props)=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    /** Checks if the form is completed or not and enables login button upon completion or disable upon incompletion */
    const checkFormCompletion = ()=>{
        setIsButtonDisabled(username==='' || password.length<8);
    }

    /** Asynchronously calls Bayer CKD Population Navigator backend API for Login */
    const loginCKDNavigator = (e)=>{
        e.preventDefault();

        /* Axios Login API Post: Login here...*/
        login(username, password).then((response)=>{
            if(response.data.success===1){ /* On Failure display error message */
                props.setMessage(2, response.data.message);

                Cookies.set("userid", response.data.userData.userid,{path:'/'});
                Cookies.set("fullName", response.data.userData.fullName,{path:'/'});
                Cookies.set("email", response.data.userData.email,{path:'/'});
                Cookies.set("authToken", response.data.userData.authToken,{path:'/'});

                window.location.href = "/dashboard";

            } else{
                props.setMessage(-1, response.data.message);
            }
            
        }).catch((error)=>{
            try{
                if(error.response.data.success===0){
                    props.setMessage(-1, error.response.data.message);
                } else {
                    props.setMessage(-2, "A technical error has been detected!. Please Try again later.", error);
                }
            } catch(err) {
                props.setMessage(-2, "A technical error has been detected!. Please Try again later.", error);
            }
        });
    }

    

    return (
        <form onSubmit={loginCKDNavigator} className="container text-center auth-form mb-4" method='post'>
            <div className="row mt-5">
                <div className="col p-2">
                    <h2>Login</h2>
                </div>
            </div>
            <div className="row my-1">
                <div className="col-12 p-2">
                    <TextField id="signin_username" type="text" className="form-input" 
                        variant="standard" label="Username" value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        onBlur={()=>{checkFormCompletion();}}
                        required 
                    />
                </div>
                <div className="col-12 p-2">
                    <TextField id="signin_password" type="password" className="form-input" 
                        variant="standard" label="Password" value={password}
                        onChange={(e) => {setPassword(e.target.value);}} 
                        onBlur={()=>{
                            checkFormCompletion();
                            if(password.length<8 /* || other password policies here ... */){
                                props.setMessage(1, "Password cannot be empty and must be greater than 8 character.");
                            }
                        }}
                        required 
                    />
                </div>
                <div className="col-12 p-2 py-1 text-end">
                    <small><Link to="/auth/forgot-password"> Forgot my password? ...</Link></small>
                </div>
                <div className="col-12 p-2 pt-3">
                    <Button type="submit" sx={{width:'50%'}} variant="contained" disabled={isButtonDisabled}>Login</Button>
                </div>
                <div className="col-12 p-1 mt-2">
                    <p>Donot have a CKD Population Navigator account? <br/><Link to="/auth/signup">Create a new account</Link></p>
                </div>
            </div>
        </form>
    );
}

/** Renders SignUp form */
class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            retypedPassword: '',
            email: '',
            fullName: '',
            isFormConsented: false,
            isUsernameUnique: false,
            isButtonDisabled: true
        };

        this.isUsernameUnique = this.isUsernameUnique.bind(this);
        this.isFormIncomplete = this.isFormIncomplete.bind(this);
        this.signupCKDNavigator = this.signupCKDNavigator.bind(this);
    }

    /** Checks if the username is unique only call it upon onBlur input as it heavyly depends on API call 
     @param {String} username - username which need to be check in the user database for the sake of uniqueness
     @returns {boolean} Returns true if unique else false
    */
    isUsernameUnique(username){
        /* Asynchronous API call to Patient Finder Database for User */
        return true; /* TODO: Replace this with API call */
    }

    /** Checks if the form is completed or not and enables login button upon completion or disable upon incompletion 
     @returns {boolean} Returns false if form is completed without errors else true
    */
    isFormIncomplete(){
        return (
            this.state.username==='' || !this.state.isUsernameUnique || 
            this.state.password.length<8 || 
            this.state.retypedPassword!==this.state.password || 
            this.state.email==='' || this.state.fullName==='' || !this.state.isFormConsented
        );
    }

    /** Asynchronously calls Bayer CKD Population Navigator backend API for SignUp */
    signupCKDNavigator(e){

        e.preventDefault();

        /* Axios Signup API Post: Signup here... */
        signup(this.state.username, this.state.email, this.state.fullName, this.state.password, this.state.isFormConsented).then((response)=>{
            if(response.data.success===1){ /* On Failure display error message */
                this.props.setMessage(2, response.data.message);

                // Store response.data.userData to the cookie and redirect to dashboard
                Cookies.set("userid", response.data.userData.userid,{path:'/'});
                Cookies.set("fullName", response.data.userData.fullName,{path:'/'});
                Cookies.set("email", response.data.userData.email,{path:'/'});
                Cookies.set("authToken", response.data.userData.authToken,{path:'/'});

                window.location.href = "/dashboard";

            } else{
                this.props.setMessage(-1, response.data.message);
            }
            
        }).catch((error)=>{
            try{
                if(error.response.data.success===0){
                    this.props.setMessage(-1, error.response.data.message);
                } else {
                    this.props.setMessage(-2, "A technical error has been detected!. Please Try again later.", error);
                }
            } catch(err) {
                this.props.setMessage(-2, "A technical error has been detected!. Please Try again later.", error);
            }
        });

    }
    

    render(){

        return (
            <form onSubmit={this.signupCKDNavigator} className="container text-center auth-form mb-5" method='post'>
                <div className="row mt-5">
                    <div className="col p-2">
                        <h2>Sign Up</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 px-2">
                        <TextField id="signup_username" type="text" className="form-input" 
                            variant="standard" label="Username" value={this.state.username}
                            onChange={(e) => {
                                this.setState({username: e.target.value});
                            }} 
                            onBlur={(e)=>{
                                this.setState({
                                    /* Check if Username is already present in database */
                                    isUsernameUnique: this.isUsernameUnique(e.target.value), 
                                }, ()=>{
                                    this.setState({
                                        isButtonDisabled: this.isFormIncomplete()
                                    })
                                });
                            }}
                            placeholder="Enter a username (It must be a unique one!) ..."
                            required 
                        />
                    </div>
                    <div className="col-12 p-2">
                        <TextField id="signup_email" type="email" className="form-input" 
                            variant="standard" label="Email" value={this.state.email}
                            placeholder="Enter your email for verification ..."
                            onChange={(e) => this.setState({email: e.target.value})} 
                            onBlur={(e)=>{
                                this.setState({
                                    isButtonDisabled: this.isFormIncomplete()
                                });
                            }}
                            required 
                        />
                    </div>
                    <div className="col-12 p-2">
                        <TextField id="signup_name" type="text" className="form-input"
                            variant="standard" label="Name" value={this.state.fullName}
                            placeholder="Enter your full name ..."
                            onChange={(e) => this.setState({fullName: e.target.value})} 
                            onBlur={(e)=>{
                                this.setState({
                                    isButtonDisabled: this.isFormIncomplete()
                                });
                            }}
                            required 
                        />
                    </div>
                    <div className="col-12 px-2 pt-2">
                        <TextField id="signup_password" type="password" className="form-input" 
                            variant="standard" label="Password" value={this.state.password}
                            placeholder="Enter a password ..."
                            onChange={(e) => {
                                var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                                var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                                if(strongRegex.test(e.target.value)){
                                    document.getElementById("pwd-measure").style.width = "100%";
                                    document.getElementById("pwd-measure").style.backgroundColor = "green";
                                }else if(mediumRegex.test(e.target.value)){
                                    document.getElementById("pwd-measure").style.width = "60%";
                                    document.getElementById("pwd-measure").style.backgroundColor = "yellow";
                                }else{
                                    document.getElementById("pwd-measure").style.width = "30%";
                                    document.getElementById("pwd-measure").style.backgroundColor = "red";
                                }
                                this.setState({password: e.target.value})
                                
                            }}
                            onBlur={(e)=>{
                                this.setState({
                                    isButtonDisabled: this.isFormIncomplete()
                                });
                                if(this.state.password.length<8){
                                    this.props.setMessage(1, "Password cannot be empty and must be greater than 8 character.");
                                } else{
                                    this.props.setMessage(0, "");
                                }
                            }}
                            required 
                        />
                        <div style={{width: '90%', margin: '10px auto 1px auto'}} >
                            <small>Password Strength</small>
                            <div id="pwd-measure"></div>
                        </div>
                    </div>
                    <div className="col-12 px-2 pb-2">
                        <TextField id="signup_retype_password" type="password" className="form-input" 
                            variant="standard" label="Retype Password" value={this.state.retypedPassword}
                            placeholder="Retype your password again ..."
                            onChange={(e) => this.setState({retypedPassword: e.target.value})} 
                            onBlur={(e)=>{
                                this.setState({
                                    isButtonDisabled: this.isFormIncomplete()
                                });
                                if(this.state.password!==this.state.retypedPassword){
                                    this.props.setMessage(1, "Passwords doesnot match. Please retype passwords correctly!");
                                }else{
                                    this.props.setMessage(0, "");
                                }
                            }}
                            required 
                        />
                    </div>
                    <div className="col-12 p-2 py-4">
                        <Checkbox id="signup_consent" style={{display:"inline"}} onChange={
                            (e)=>{
                                this.setState({
                                    isFormConsented: e.target.checked
                                },()=>{
                                    this.setState({
                                        isButtonDisabled: this.isFormIncomplete()
                                    });
                                });
                            }} checked={this.state.isFormConsented} required
                        />
                        <p style={{display:"inline", fontSize:"13px"}}>
                            <small>
                                I accept that I understood the&nbsp;
                                <a target="_blank" href="/terms">Terms and Conditions</a> and&nbsp;
                                <a target="_blank" href="/policy">Privacy Policy</a>
                            </small>
                        </p>
                    
                    </div>
                    <div className="col-12 p-2">
                        <Button type="submit" sx={{width:'50%'}} variant="contained" disabled={this.state.isButtonDisabled}>Sign Up</Button>
                    </div>
                </div>
            </form>
        );
    }
}

const ForgetMyPassword = (props)=>{
    const [email, setEmail] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const sendResetPasswordLink = (e)=>{
        e.preventDefault();

        /** TODO: Reset Password Link send - Use axios to call backend API that performs mailing a link to user's email for password reset */
        
    }

    return (
        <form className="container text-center auth-form mb-5" method='post'>
                <div className="row mt-5">
                    <div className="col p-2">
                        <h2>Forgot My Password!</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 py-2">
                        <p style={{fontSize: "14px", textAlign:"justify"}}>Just enter your email associated with your username and you will receive a password reset link in no time. </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 px-2">
                        <TextField id="forgot_email" type="email" className="form-input" 
                            variant="standard" label="Email" value={email}
                            onChange={(e) => {setEmail(e.target.value);}} 
                            onBlur={(e)=>{setIsButtonDisabled(e.target.value==='');}}
                            placeholder="Enter the email associated with your username ..."
                            required 
                        />
                    </div>
                    <div className="col-12 mt-4 p-2">
                        <p>Do you want to send a reset password link?</p>
                        <Button type="submit" sx={{width:'50%'}} variant="contained" onClick={(e)=>sendResetPasswordLink(e)} disabled={isButtonDisabled}>Send</Button>
                    </div>
                </div>
            </form>
    );
}

/** Main Authentication component */
class Authentication extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isActive: (window.location.pathname==="/auth/signup")?1:0, /* isActive - for determining which tab is currently active (0: Login, 1: Signup) */
            messageState: 0, /* messageState: (0: No message, -1: errorMessage, 1: infoMessage, 2: successMessage) */
            messageText: "",
            isLoading: true,
            access: false,
            showErrorBox: false,
            isReportSent: false,
            sendReportSuccess: false,
            errorObj: {}
        }

        this.setActiveFormTab = this.setActiveFormTab.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.checkAccess = this.checkAccess.bind(this);
    }

    /** Set which one from Login and Signup form tab is active currently
     @param {int} formValue - `0` is Login and `1` is Signup
    */
    setActiveFormTab(formValue){
        return this.setState({
            isActive: formValue
        },()=>{
            /* FormTab Styling after click - Deciding which tab is underlined */
            document.getElementById('login-tab-btn').className="";
            document.getElementById('signup-tab-btn').className="";
            (formValue==1)?document.getElementById('signup-tab-btn').className="active":document.getElementById('login-tab-btn').className="active";
        });
    }

    /** Enables and display a pop-up message on top of the authentication form */
    setMessage(messageState, messageText, errorReportObj={}){
        // Show info message
        this.setState({
            messageState: (messageState===-2)?-1:messageState,
            messageText: messageText,
            errorObj: JSON.stringify(errorReportObj),
            showErrorBox: messageState===-2?true:false
        });

        // Make the message disappear after 30 seconds
        setTimeout(()=>{this.setState({messageState: 0})}, 30000);
    }

    checkAccess(){
        checkUserAccess(Cookies.get('userid'), Cookies.get('authToken')).then((response)=>{
            this.setState({access: response.data.access===1, isLoading:false})
        }).catch((error)=>{
            this.setState({access: false, isLoading:false}, ()=>{
                try{
                    if(error.response.data.success===0){
                        this.setMessage(-1, error.response.data.message);
                    } else {
                        this.setMessage(-2, "A technical error has been detected!. Please Try again later.", error);
                    }
                } catch(err) {
                    this.setMessage(-2, "A technical error has been detected!. Please Try again later.", error);
                }
            });
        });
    }

    sendReport(){
        console.log("Current Error Obj: \n", this.state.errorObj);
        /* TODO: Semd Error Obj here ... */
        return true; // Return success of sending the object to API
    }

    render(){
        if(this.state.isLoading){
            this.checkAccess();
            return (
                <div className="container pt-5">
                    <div className="row pt-5">
                        <div className="col pt-5">
                            <h1 style={{fontSize: "24px", fontFamily:"Montserrat, san-serif", fontWeight: 600}}>Bayer CKD Population Navigator</h1>
                            <p>Verifying your login credential. You are going to be redirected automatically in few seconds. If you are not <Link to="/dashboard">Click here</Link>.</p>
                        </div>
                    </div>
                </div>
            )
        } else if(!this.state.isLoading && this.state.access){
            return(
                <div className="container pt-5">
                    <div className="row pt-5">
                        <div className="col pt-5">
                            <h1 style={{fontSize: "24px", fontFamily:"Montserrat, san-serif", fontWeight: 600}}>Bayer CKD Population Navigator</h1>
                            <p>Verifying your login credential. You are going to be redirected automatically in few seconds. If you are not <Link to="/dashboard">Click here</Link>.</p>
                        </div>
                        <Redirect to="/dashboard" />
                    </div>
                </div>
            );
        }

        return (
            <div className='authentication'>
                
                {
                    this.state.showErrorBox
                    ?   <div style={{
                            position: "fixed",
                            display: "flex",
                            width: "100vw",
                            height: "100vh",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.75)",
                            zIndex: 999
                        }} className="p-1">
                            <div className='bg-light px-3 pt-2 pb-4'>
                                <div className='text-end'>
                                    <button style={{fontSize: "18px", fontWeight: "bold"}} className="btn btn-outline-none text-danger p-1 px-2" onClick={()=>{
                                        this.setState({
                                            showErrorBox: false
                                        });
                                    }}>x</button>
                                </div>
                                {
                                    !this.state.isReportSent
                                      ? (
                                        <div>
                                            <p>The application has detected a technical error or crash on your side!</p>
                                            <p><strong>Do you want to send the error/crash report to the developer?</strong></p>
                                            <div className='text-center'>
                                                <button onClick={()=>{
                                                    const success = this.sendReport();
                                                    this.setState({
                                                        isReportSent: true,
                                                        sendReportSuccess: !success
                                                    });
                                                }} className='m-3 px-4 btn btn-primary'>Send Report</button>
                                                <button className='m-3 px-4 btn btn-danger' onClick={()=>{
                                                    this.setState({
                                                        showErrorBox: false
                                                    });
                                                }}>Cancel</button>
                                            </div>
                                        </div>
                                      ) : (
                                        <div className="px-3 py-2">
                                            {this.state.sendReportSuccess?<p className="text-success">Your report is sent successfully</p>:<p className='text-danger'>Something went wrong while sending the report. Please try again later!!</p>}
                                            <div className='text-center'>
                                                <button className='m-3 px-4 btn btn-danger' onClick={()=>{
                                                    this.setState({
                                                        showErrorBox: false
                                                    });
                                                }}>Close</button>
                                            </div>
                                        </div>
                                      )
                                }
                            </div>
                        </div>
                    :   ""
                }


                <Background />
                <NavigationBar />
                <div className="auth-content container-fluid">
                    <div className="row">
                        <div className="h-lg-100vh col-12 col-lg-5 col-xl-7">
                            <div style={{display: "fixed", height: "100%", width: "100%"}}>
                                <div className='title animate__animated animate__fadeIn animate__delay-1s'>
                                    <p className="h1"> Welcome to the </p>
                                    <h1 className="h1"> CKD Population Navigator </h1>
                                </div>
                                <div className='animate__animated animate__fadeInLeft animate__delay-1s border-slashes'> &#47;&#47;&#47;&#47;&#47;&#47; </div>
                            </div>
                        </div>
                        <div className="animate__animated animate__fadeInRight animate__delay-2s form-container col-12 col-lg-7 col-xl-5 p-4">
                            <div className="row">
                                <div className="col p-2 p-lg-5">
                                    <div className="row">
                                        <div style={{borderRight: "1px solid #eee",borderTopLeftRadius: "10px"}} className="col-3 form-tabs">
                                            <Link id="login-tab-btn" onClick={()=>this.setActiveFormTab(0)} className={(this.state.isActive===0)?"active":""} to="/auth/login">Login</Link>
                                        </div>
                                        <div style={{borderTopRightRadius: "10px"}} className="col-3 form-tabs">
                                            <Link id="signup-tab-btn" onClick={()=>this.setActiveFormTab(1)} className={(this.state.isActive===1)?"active":""} to="/auth/signup">Sign Up</Link>
                                        </div>
                                    </div>
                                    <div className="form-region row">
                                        <div className="col">
                                            <div style={{position:"relative"}}>
                                                <div style={(this.state.messageState===0)?{display: "none"}:{display: "block", marginTop:"20%", marginRight: "10%"}} id="form-info" className={
                                                    (this.state.messageState===-1)?"error-box":((this.state.messageState===1)?"info-box":(
                                                        (this.state.messageState===2)?"success-box":"")
                                                    )
                                                }>
                                                    <div className="container">
                                                        <div className="row">
                                                            <div className='col-2'>
                                                                <span style={{ top: "1px", position: "relative"}} id="form-info-icon">{(this.state.messageState===-1)?<i className="fas fa-exclamation"></i>:(
                                                                    (this.state.messageState===1)?<i className="fas fa-info-circle"></i>:(
                                                                        (this.state.messageState===2)?<i className="fas fa-check"></i>:""
                                                                    )
                                                                )}</span>
                                                            </div>
                                                            <div className='col-8'>
                                                                <p id="form-info-message">{this.state.messageText}</p>
                                                            </div>
                                                            <div className='col-2'>
                                                                <button className="text-light" style={{border:"none", outline: "none", background:"none"}} onClick={()=>{
                                                                    this.setState({messageState: 0})
                                                                }}>
                                                                    <i style={{ top: "-5px", position: "relative"}} className='fas fa-times'></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <Switch>
                                                <Route exact path="/auth"><Redirect to="/auth/login"/></Route>
                                                <Route exact path="/auth/login" ><Login setMessage={(messageState, messageText)=>{this.setMessage(messageState,messageText)}}/></Route>
                                                <Route exact path="/auth/signup"><SignUp setMessage={(messageState, messageText)=>{this.setMessage(messageState,messageText)}}/></Route>
                                                <Route exact path="/auth/forgot-password" component={ForgetMyPassword} />

                                                <Route path="*"><Redirect to="/not-found" /></Route>
                                            </Switch>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
        
    }
}

export default Authentication;
