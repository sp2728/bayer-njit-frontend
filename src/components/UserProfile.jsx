import { Button, TextField } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { Footer } from "./Common/CommonComponent";
import { NavigationBar } from "./Dashboard/Dashboard";
import './Dashboard/Dashboard.css';
import './UserProfile.css';

export class UserProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            fullName: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            displayAbout: false,
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.logoutRerender = this.logoutRerender.bind(this);
        this.clickDetect = this.clickDetect.bind(this);
    }

    clickDetect(event){
        if(!$(event.target).closest(".model-box").length){
            this.setState({displayAbout: false})
            try{
                document.getElementsByClassName("about-model")[0].removeEventListener("click", this.clickDetect);
            }catch(err){}
        }
    }

    logoutRerender(){
        window.location.href = "/";
    }

    componentDidMount(){
        if(this.props.match.params.username===Cookies.get("userid")){
            this.setState({
                // Values cannot be changed by API/user
                username: Cookies.get("userid"), 
                email: Cookies.get("email"), 
                // Values can be changed by API/user
                fullName: Cookies.get("fullName"),
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }else{
            window.location.href = "/not-found";
        }
    }

    onSubmit(){
        // API Call
        

        this.setState({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    }

    render(){
        return (
            <div className="dashboard user-profile">
                <NavigationBar logoutRerender={()=>this.logoutRerender()} showAboutHandler={()=>{
                    this.setState({displayAbout:true},()=>{
                        document.getElementsByClassName("about-model")[0].addEventListener("click", this.clickDetect);
                    })
                }}/>
                {
                        (this.state.displayAbout)?(
                            <div style={{zIndex: 99}} className="about-model">
                                <div className="model-box-container">
                                    <div style={{position: "relative"}} className="model-box p-3">
                                        <div style={{position: "absolute", right: 20, top: 10, fontSize: 20}}>
                                            <button onClick={()=>{this.setState({displayAbout: false})}} style={{outline: "none", border: "none", background: "none"}}>
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                        <h2 style={{fontSize: "170%", fontFamily:"Montserrat, san-serif", fontWeight: 500}} className="text-center">About</h2>
                                        <div className="hr-line"></div>
                                        <p style={{textAlign:"justify"}}>

                                            <strong>CKD Population Navigator</strong> is an internal research tool. CKD Population Navigator is a data visualization and analytics tool based upon the results of a retrospective, cross-sectional analysis of the Optum Administrative 
                                            claims database to describe the <strong>Chronic Kidney Disease</strong> and <strong>Type 2 Diabetes</strong> patient landscape within the database in the year 2019. The tool allows users to explore 
                                            the following characteristics in the type 2 diabetes (T2D), chronic kidney disease (CKD), and CKD and T2D populations: demographic, clinical (i.e., events, comorbidities), 
                                            medication use, and kidney labs.
                                        </p>
                                        <div className="hr-line"></div>
                                        <p className="text-center">
                                            <small>&copy; Copyright 2022 Bayer | All rights reserved</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ):""
                    }
                <div className="container-fluid py-5 mb-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="row pt-5 text-center">
                                <div className="col-12 mt-5 pt-5">
                                    <div className="row">
                                        <div className="col">
                                            <h2>User Profile</h2>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col py-5">
                                            <i style={{fontSize: "100px"}} className="fas fa-user-circle"></i>
                                        </div>
                                    </div>
                                    <form className="row justify-content-center" onSubmit={()=>{this.onSubmit()}} method="post">
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <div className="py-3">
                                                <TextField id="user-name" name="user-name" type="text" className="form-input" 
                                                    variant="standard" label="Username" value={this.state.username}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="py-3">
                                                <TextField id="user-email" name="user-email" type="email" className="form-input" 
                                                    variant="standard" label="Email" value={this.state.email}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="py-3">
                                                <TextField name="user-fullName" id="user-fullName" type="text" className="form-input" 
                                                    variant="standard" label="Full name" value={this.state.fullName}
                                                    onChange={(e)=>{this.setState({fullName: e.target.value})}}
                                                />
                                            </div>
                                            <div className="py-3">
                                                <small><p className="text-primary">Note: Please enter the current password inorder to change your password to new one.</p></small>
                                                <TextField name="user-old-password" id="user-old-password" type="password" className="form-input" 
                                                    variant="standard" label="Current Password" value={this.state.oldPassword}
                                                    onChange={(e)=>{this.setState({oldPassword: e.target.value})}}
                                                    placeholder="[Your password is kept secret]"
                                                />
                                            </div>
                                            <div className="py-3">
                                                <TextField name="user-new-password" id="user-new-password" type="password" className="form-input" 
                                                    variant="standard" label="New Password" value={this.state.newPassword}
                                                    onChange={(e)=>{this.setState({newPassword: e.target.value})}}
                                                />
                                            </div>
                                            <div className="py-3">
                                                <TextField name="user-retype-password" id="user-retype-password" type="password" className="form-input" 
                                                    variant="standard" label="Re-type New Password" value={this.state.confirmPassword}
                                                    onChange={(e)=>{this.setState({confirmPassword: e.target.value})}}
                                                />
                                            </div>
                                            <div>
                                                <Button type="submit" sx={{width:'50%'}} variant="contained">Update</Button>
                                            </div>
                                        </div>
                                    </form>
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