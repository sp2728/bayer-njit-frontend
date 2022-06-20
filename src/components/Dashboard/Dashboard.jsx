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
import { MedicalSequencing } from "./DashboardPages/MedicalSequencing";

const navigationLinks = [{
    title: "Introduction",
    link: "/dashboard/ckd/intro",
},{
    title: "Patient Finder",
    link: "/dashboard/ckd/patientfinder",
    sublinks: [{
        title: "Patient Finder Chartings",
        link: "/dashboard/ckd/patientfinder",
    },{
        title: "Population Overview",
        link: "/dashboard/ckd/population/overview"
    }, {
        title: "My Preferences",
        link: "/dashboard/ckd/patientfinder/preferences/view"
    }, {
        title: "Create Preferences",
        link: "/dashboard/ckd/patientfinder/preferences/new"
    }, {
        title: "About Patient Finder",
        link: "/dashboard/ckd/intro/patientfinder"
    }]
},{
    title: "Medication Sequencing",
    link: "/dashboard/ckd/medseq",
    sublinks: [{
        title: "Medication Sequencing Chartings",
        link: "/dashboard/ckd/medseq",
    }, {
        title: "About Medication Sequencing",
        link: "/dashboard/ckd/intro/medseq"
    }]
},];

const linkToNavTitleMapping = {};
navigationLinks.map((e)=>{
    if(e.sublinks && e.sublinks.length>0){
        e.sublinks.map((element,index)=>{
            return (linkToNavTitleMapping[element.link] = element.title);
        })
    }
    return (linkToNavTitleMapping[e.link] = e.title);
})

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
            <div className="col-12 col-sm-7 col-md-6 col-lg-7 my-1 my-md-0 pt-md-0 text-center text-sm-start">
                <div id="nav-logo">
                    <img style={{height: "100%", width: "auto"}} src={logo} alt="" />
                </div>
                <h1 style={{display: "inline-block", marginLeft: "10px", paddingTop: "8px"}}>CKD Population Navigator</h1>
            </div>
            <div className="col-13 col-sm-5 col-md-6 col-lg-5 my-0 my-sm-1 my-md-0 pt-md-0 px-1 px-md-3 text-center text-sm-end">
                <p className="display-none-md user-greetings">Hello {Cookies.get("fullName")},</p>
                <IconButton id="acct-btn" onClick={(e)=>{handleClick(e)}} size="small" sx={{ display: "inline-block" ,ml: 0 }}>
                    <Avatar sx={{ width: 32, height: 32 }}><i className="fas fa-user" aria-hidden="true"></i></Avatar>
                </IconButton><label htmlFor="acct-btn" className="display-inline-md-none px-2">&nbsp;<small>Your Account</small></label>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
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

export class NavigationBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isNavToggleActive: false
        }
        this.clickDetect = this.clickDetect.bind(this);
    }

    clickDetect(event){
        if(!$(event.target).closest("nav").length){
            this.setState({isNavToggleActive: false})
        }
    }


    componentDidMount(){
        document.addEventListener("click", this.clickDetect);
    }

    componentWillUnmount(){
        document.removeEventListener("click", this.clickDetect);
    }

    render(){
        return (
            <nav className="container-fluid">
                <FirstNavRow logoutRerender={this.props.logoutRerender}/>
                
                {/* Dashboard Navigation Second Row */}
                <div style={{backgroundColor: "#f7f1e3"}} className="row nav-links animate__animated animate__fadeIn animate__delay-1s">
                    <div className="col-12 display-md-none nav-mobile-bar p-1">
                        <button id="nav-mobbar-btn" style={{transition: "transform 0.5s",background:"none", outline:"none", border: "none", padding: "1px 30px 2px 30px"}} onClick={(e)=>{
                            this.setState({isNavToggleActive: !this.state.isNavToggleActive});
                            document.getElementById('nav-mobbar-btn').style.transform = `rotate(${this.state.isNavToggleActive?0:180}deg)`;
                        }}>
                            <i className="fa fa-bars" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className={"col-12 col-md-12 pt-2 pt-md-0 nav-md-toggler "+((this.state.isNavToggleActive)?"open":"")}>
                        <ol className="custom-nav">
                            {navigationLinks.map((e)=>{
                                return (
                                    <li key={e.title}>
                                        {/* Links on Navigation Bar and also handing decision for present the page user is on by styling navigation links */}
                                        <Link to={e.link} className={(e.title===linkToNavTitleMapping[window.location.pathname])?"active":""}>{e.title}</Link> {(e.sublinks && e.sublinks.length>0)?<i className="fa fa-chevron-down text-black"></i>:""}
                                        {
                                            (e.sublinks && e.sublinks.length>0)?(
                                                <ul className="custom-nav-dropdown">
                                                    {e.sublinks.map((element, index)=>{
                                                        return (
                                                            <li key={element.title}>
                                                                <Link to={element.link} className={(element.title===linkToNavTitleMapping[window.location.pathname])?"active":""}>{element.title}</Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ):""
                                        }
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </nav>
        );       
    }
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
                            <Route path="/dashboard/ckd/intro" component={Introduction} />
                            <Route path="/dashboard/ckd/patientfinder" component={PatientFinder} />
                            <Route exact path="/dashboard/ckd/population/overview" component={PopulationOverview} />
                            <Route exact path="/dashboard/ckd/medseq" component={MedicalSequencing}></Route>
                            {/* <UnderMaintainance showNav={false} /> */}
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