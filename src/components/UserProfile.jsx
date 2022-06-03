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
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.logoutRerender = this.logoutRerender.bind(this);
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
                <NavigationBar logoutRerender={()=>this.logoutRerender()} />
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