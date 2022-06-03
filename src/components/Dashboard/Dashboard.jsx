import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import logo from '../Common/bayer_logo.png';
import './Dashboard.css';
import { Introduction } from "./DashboardPages/Introduction";
import { PatientFinder } from "./DashboardPages/PatientFinder";
import { Footer } from "../Common/CommonComponent";
import Cookies from "js-cookie";
import { checkUserAccess } from "../../api/ckdAPI";
import { UnderMaintainance } from "../UnderMaintainance";
import { PopulationOverview } from "./DashboardPages/PopulationOverview";

const navigationLinks = [{
    title: "Introduction",
    link: "/dashboard/ckd/intro",
},{
    title: "Patient Finder",
    link: "/dashboard/ckd/patientfinder",
},{
    title: "Population Overview",
    link: "/dashboard/ckd/population/overview",
},{
    title: "Medication Sequence",
    link: "/dashboard/ckd/medseq",
},];

const linkToNavTitleMapping = {};
navigationLinks.map((e)=>{return (linkToNavTitleMapping[e.link] = e.title);})

/** Renders Dashboard's first row of navigation bar */
const FirstNavRow = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {setAnchorEl(event.currentTarget);};

    const handleClose = () => {setAnchorEl(null);};

    const logoutFn = () => {

        /* TODO: Logout from backend API too HERE ... */

        Cookies.remove("userid",{path:'/'});
        Cookies.remove("fullName",{path:'/'});
        Cookies.remove("email",{path:'/'});
        Cookies.remove("authToken",{path:'/'});

        props.logoutRerender();
    }

    //const location = useLocation();
    // const isActive = (route) => {
    //     if (location.pathname === route) return 'menu-item btn-active';
    //     return 'menu-item';
    // }
    const showCreatePreference = () => {window.location.href="/dashboard/ckd/patientfinder/preferences/new";}
    const showViewPreference = () => {window.location.href="/dashboard/ckd/patientfinder/preferences/view";}

    return (
        <div style={{backgroundColor: "rgb(35, 130, 181)"}} className="row animate__animated animate__fadeInDown animate__delay-1s">
            <div className="col-7 col-md-6 col-lg-7 pt-2 pt-md-0">
                <div id="nav-logo">
                    <img style={{height: "100%", width: "auto"}} src={logo} alt="" />
                </div>
                <h1 style={{display: "inline-block", marginLeft: "10px", paddingTop: "8px"}}>CKD Population Navigator</h1>
            </div>
            <div className="col-5 col-md-6 col-lg-5 px-1 px-md-3 text-end">
                <p className="display-none-md user-greetings">Hello {Cookies.get("fullName")},</p>
                <IconButton onClick={(e)=>{handleClick(e)}} size="small" sx={{ display: "inline-block" ,ml: 0 }}>
                    <Avatar sx={{ width: 32, height: 32 }}><i className="fas fa-user" aria-hidden="true"></i></Avatar>
                </IconButton>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Link to={`/user/${Cookies.get('userid')}/profile`} style={{ textDecoration: 'none', color:'inherit' }}> <MenuItem> <Avatar sx={{ width: 20, height: 20 }}><i className="fas fa-user" aria-hidden="true"></i></Avatar> Profile : {Cookies.get("userid")} </MenuItem> </Link>
                    <Divider />
                        <MenuItem onClick={showViewPreference}><ListItemIcon> <i className="fa fa-wrench" aria-hidden="true"></i> </ListItemIcon> My Preferences</MenuItem>
                        <MenuItem onClick={showCreatePreference}><ListItemIcon><i className="fa fa-plus" aria-hidden="true"></i></ListItemIcon> Create New Preference </MenuItem>
                    <Divider />
                    <MenuItem onClick={logoutFn}><ListItemIcon><i className="fa fa-sign-out" aria-hidden="true"></i></ListItemIcon> Logout </MenuItem>
                </Menu>
            </div>
        </div>
    );
}

export const NavigationBar = (props)=>{
    const [isNavToggleActive, setIsNavToggleActive] = useState(false);
    
    return (
        <nav className="container-fluid">
            <FirstNavRow logoutRerender={props.logoutRerender}/>
            
            {/* Dashboard Navigation Second Row */}
            <div style={{backgroundColor: "#f7f1e3"}} className="row nav-links animate__animated animate__fadeIn animate__delay-1s">
                <div className="col-12 display-md-none nav-mobile-bar p-1">
                    <button id="nav-mobbar-btn" style={{transition: "transform 0.5s",background:"none", outline:"none", border: "none", padding: "1px 30px 2px 30px"}} onClick={(e)=>{
                        setIsNavToggleActive(!isNavToggleActive);
                        document.getElementById('nav-mobbar-btn').style.transform = `rotate(${isNavToggleActive?0:180}deg)`;
                    }}>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    </button>
                </div>
                <div className={"col-12 col-md-12 pt-2 pt-md-0 nav-md-toggler "+((isNavToggleActive)?"open":"")}>
                    <ol>
                        {navigationLinks.map((e)=>{
                            return (
                                <li key={e.title}>
                                    {/* Links on Navigation Bar and also handing decision for present the page user is on by styling navigation links */}
                                    <Link to={e.link} className={(e.title===linkToNavTitleMapping[window.location.pathname])?"active":""}>{e.title}</Link>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </nav>
    );
}



class Dashboard extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            access: false,
        }
        this.checkAccess = this.checkAccess.bind(this);
        this.logoutRerender = this.logoutRerender.bind(this);
    }

    checkAccess(){
        checkUserAccess(Cookies.get('userid'), Cookies.get('authToken')).then((response)=>{
            this.setState({access: response.data.access===1, isLoading:false})
        }).catch((err)=>{
            this.setState({access: false, isLoading:false})
        });
    }

    logoutRerender(){
        this.setState({
            access: false,
            isLoading: false,
        });
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
            return (
                <div className="dashboard">
                    <NavigationBar logoutRerender={this.logoutRerender} />
                    <div style={{minHeight: "100vh"}}>
                        <Switch>
                            
                            <Route exact path="/dashboard" component={Introduction} />
                            <Route exact path="/dashboard/ckd" component={Introduction} />
                            <Route exact path="/dashboard/ckd/intro" component={Introduction} />
                            <Route path="/dashboard/ckd/patientfinder" component={PatientFinder} />
                            <Route exact path="/dashboard/ckd/population/overview" component={PopulationOverview} />
                            <Route exact path="/dashboard/ckd/medseq">
                                {/* MedicationSequence Component */}
                                <UnderMaintainance showNav={false} />
                            </Route>
                            <Route path="*"><Redirect to="/not-found" /></Route>

                        </Switch>
                    </div>
                    <Footer/>
                </div>
            ); 
        }

        return (
            <div className="container pt-5">
                <div className="row pt-5">
                    <div className="col pt-5">
                        <h1 style={{fontSize: "24px", fontFamily:"Montserrat, san-serif", fontWeight: 600}}>Bayer CKD Population Navigator</h1>
                        <p>Your login credential seem to be expired or you have enter to this page by mistake. You are going to be redirected automatically in few seconds. If you are not <Link to="/auth/login">Click here</Link>.</p>
                    </div>
                </div>
                <Redirect to="/auth/login" />
            </div>
        );
    }
}

export default Dashboard;