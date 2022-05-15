import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import logo from '../Common/bayer_logo.png';
import './Dashboard.css';
import { Introduction } from "./DashboardPages/Introduction";
import { PatientFinder } from "./DashboardPages/PatientFinder";
import { Footer } from "../Common/CommonComponent";

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
const FirstNavRow = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutFn = () => {
        //dispatch(logout());
    }

    const location = useLocation();
    const isActive = (route) => {
        if (location.pathname === route) return 'menu-item btn-active';
        return 'menu-item';
    }

    const showCreatePreference = () => {
        //dispatch(showModal({ messageType: constants.MESSAGE_TYPES.CREATE_PREFERENCE, action: 'open' }));
    }

    const showViewPreference = () => {
        //dispatch(showModal({ messageType: constants.MESSAGE_TYPES.VIEW_PREFERECNE, action: 'open' }));
    }

    return (
        <div style={{backgroundColor: "rgb(35, 130, 181)"}} className="row animate__animated animate__fadeInDown animate__delay-1s">
            <div className="col-7 col-md-6 col-lg-7 pt-2 pt-md-0">
                <div id="nav-logo">
                    <img style={{height: "100%", width: "auto"}} src={logo} alt="" />
                </div>
                <h1 style={{display: "inline-block", marginLeft: "10px", paddingTop: "8px"}}>CKD Population Navigator</h1>
            </div>
            <div className="col-5 col-md-6 col-lg-5 px-1 px-md-3 text-end">
                <p className="user-greetings" style={{display: "inline-block"}}>Hello {`Username`/* TODO : Replace this with cookie.fullName */},</p>
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
                    <Link to={`/user/${`username123` /* TODO : Replace this with username */}/profile`} style={{ textDecoration: 'none', color:'inherit' }}> <MenuItem> <Avatar sx={{ width: 20, height: 20 }}><i className="fas fa-user" aria-hidden="true"></i></Avatar> Profile : {`Username`/* TODO : Replace this with cookie.fullName */} </MenuItem> </Link>
                    <Divider />
                        <MenuItem onClick={showCreatePreference}><ListItemIcon><i className="fa fa-plus" aria-hidden="true"></i></ListItemIcon> Create Preference </MenuItem>
                        <MenuItem onClick={showViewPreference}><ListItemIcon> <i className="fa fa-wrench" aria-hidden="true"></i> </ListItemIcon> View Preferences</MenuItem>
                    <Divider />
                    <MenuItem onClick={logoutFn}><ListItemIcon><i className="fa fa-sign-out" aria-hidden="true"></i></ListItemIcon> Logout </MenuItem>
                </Menu>
            </div>
        </div>
    );
}

const NavigationBar = (props)=>{
    const [isNavToggleActive, setIsNavToggleActive] = useState(false);
    
    return (
        <nav className="container-fluid">
            <FirstNavRow />
            
            {/* Dashboard Navigation Second Row */}
            <div style={{backgroundColor: "#f7f1e3"}} className="row nav-links animate__animated animate__fadeIn animate__delay-1s">
                <div className="col-12 display-md-none nav-mobile-bar">
                    <button style={{background:"none", outline:"none", border: "none", padding: "1px 30px 2px 30px"}} onClick={(e)=>{
                        setIsNavToggleActive(!isNavToggleActive);
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
    }

    render(){
        return (
            <div className="dashboard">
                <NavigationBar />
                <div style={{minHeight: "100vh"}}>
                    <Switch>
                        <Route exact path="/dashboard" component={Introduction} />
                        <Route exact path="/dashboard/ckd" component={Introduction} />
                        <Route exact path="/dashboard/ckd/intro" component={Introduction} />
                        <Route exact path="/dashboard/ckd/patientfinder">
                            <PatientFinder/>
                        </Route>
                        <Route exact path="/dashboard/ckd/population/overview">
                            {/* PopulationOverview Component */}
                        </Route>
                        <Route exact path="/dashboard/ckd/medseq">
                            {/* MedicationSequence Component */}
                        </Route>
                        <Route path="*"><Redirect to="/not-found" /></Route>
                    </Switch>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Dashboard;