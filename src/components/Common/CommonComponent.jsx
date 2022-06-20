import React from 'react';
import { Link } from 'react-router-dom';
import logo from './bayer_logo.png';

/** Renders Navigation bar with Bayer's logo */
export class NavigationBar extends React.Component{
    constructor(props){
        super(props);
        window.addEventListener("scroll", function(){
            try{
                if(window.scrollY>10){
                
                    document.getElementById("main-nav").classList.add("show-bg");
                }else{
                    document.getElementById("main-nav").classList.remove("show-bg");
                }       
            } catch(err) {
                //console.log("[ERROR] Navbar is not loaded!");
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
        <footer style={{color:"#ddd", zIndex: 99}} className="container-fluid bg-dark">
            <div className="row">
                <div className="col p-3 text-center">
                    <small>
                        &copy; Copyright 2022 Bayer. All rights reserved | &nbsp;
                        <Link className="text-light" to="/terms">Terms and condition</Link> and &nbsp;
                        <Link className="text-light" to="/policy">Privacy policy</Link>
                    </small>
                </div>
            </div>
        </footer>
    );
}

const stateToAcronymMapping = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arkansas': 'AR', 'Arizona': 'AZ', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 
    'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 
    'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 
    'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Puerto Rico':'PR', 
    'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 
    'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
}
const acronymToStateMapping = {}
Object.keys(stateToAcronymMapping).map(k=>{acronymToStateMapping[stateToAcronymMapping[k]]=k;});

export const getStateNameFromAcronym = (acronym)=>{
    return acronymToStateMapping[acronym];
}
export const getAcronymFromStateName = (stateName)=>{
    return stateToAcronymMapping[stateName];
}