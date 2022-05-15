import React from 'react';
import { Link } from 'react-router-dom';
import logo from './bayer_logo.png';

/** Renders Navigation bar with Bayer's logo */
export class NavigationBar extends React.Component{
    constructor(props){
        super(props);
        window.addEventListener("scroll", function(){
            if(window.scrollY>10){
                document.getElementById("main-nav").classList.add("show-bg");
            }else{
                document.getElementById("main-nav").classList.remove("show-bg");
            }
        
        });
    }

    render(){
        return (
            <nav id="main-nav" style={{position: "fixed"}} className='animate__animated animate__fadeInDown animate__delay-1s container-fluid'>
                <img className="nav-logo p-3" src={logo} alt="Bayer Pharmaceutical's Logo" />
            </nav>
        );
    }
}

/** Renders Footer with Copyright condition and important product details */
export const Footer = (props)=>{
    return (
        <div style={{color:"#ddd"}} className="container-fluid bg-dark">
            <div className="row">
                <div className="col p-3 text-center">
                    <small>
                        &copy; Copyright 2022 Bayer. All rights reserved | &nbsp;
                        <Link className="text-light" to="/terms">Terms and condition</Link> and &nbsp;
                        <Link className="text-light" to="/policy">Privacy policy</Link>
                    </small>
                </div>
            </div>
        </div>
    );
}

