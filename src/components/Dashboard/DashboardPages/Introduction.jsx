import { Link, Redirect, Route, Switch } from "react-router-dom";
import { UnderMaintainance } from "../../UnderMaintainance";
import { PatientFinderIntro } from "./IntroductionPages/PatientFinderIntro";
import "./Introduction.css";
import { MedicalSequencingIntro } from "./IntroductionPages/MedicalSequencingIntro";
import { useState } from "react";

export const Introduction = ()=>{
    const [introPageIndex, setIntroPageIndex] = useState(0);
    const [isNavToggleActive, setIsNavToggleActive] = useState(false);
    return(
        <div className="container introduction">
            <div className="row">
                <div className="col">
                    <div>Quick Links:</div>
                    <div style={(!isNavToggleActive)?{maxHeight: "50px"}:{maxHeight: "unset"}} className="chart-card intro-nav">
                        <div style={{height: "50px"}} className="display-md-none">
                            <button id="intro-nav-mobbar-btn" style={{transition: "transform 0.5s",background:"none", outline:"none", border: "none", margin: "11px", padding: "1px 30px 2px 30px"}} onClick={(e)=>{
                                setIsNavToggleActive(!isNavToggleActive);
                                document.getElementById('intro-nav-mobbar-btn').style.transform = `rotate(${isNavToggleActive?0:180}deg)`;
                            }}>
                                <i className="fa fa-bars" aria-hidden="true"></i>
                            </button>
                        </div>
                        <ul>
                            <li className={introPageIndex==0?"active":""}>
                                <Link onClick={(e)=>{setIntroPageIndex(0)}} to="/dashboard/ckd/intro/patientfinder">About PatientFinder</Link>
                            </li>
                            <li className={introPageIndex==1?"active":""}>
                                <Link onClick={(e)=>{setIntroPageIndex(1)}} to="/dashboard/ckd/intro/medseq">About Medication Sequencing</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Switch>
                <Route exact path="/dashboard" component={PatientFinderIntro} />
                <Route exact path="/dashboard/ckd" component={PatientFinderIntro} />
                <Route exact path="/dashboard/ckd/intro" component={PatientFinderIntro} />
                <Route exact path="/dashboard/ckd/intro/patientfinder" component={PatientFinderIntro}/>
                <Route exact path="/dashboard/ckd/intro/medseq" component={MedicalSequencingIntro} />
                <Route path="*"><Redirect to="/not-found" /></Route>
            </Switch>
        </div>
    );
}