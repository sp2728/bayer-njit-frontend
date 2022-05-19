import { NavigationBar, Footer} from "./Common/CommonComponent";
import logo from './Common/bayer_logo.png';
import { Link } from "react-router-dom";

export const NotFound = (props)=>{
    return (
        <div className="not-found">
            {(props.showNav)?<NavigationBar />:""}
            <div className="container-fluid">
                <div style={{height: (screen.width>767&&screen.height>480)?"100vh":"unset"}} className="row">
                    <div className="col-12">
                        <div className="row pt-5 text-center">
                            <div className="col-12 mt-5 pt-5">
                                <h2>404 Not Found</h2>
                            </div>
                        </div>
                        <div className="row py-5 text-center">
                            <div className="col-12">
                                <img style={(screen.width<769)?{width: "300px", height: "300px"}:{width: "150px", height: "150px"}} src={logo} alt="Bayer Logo" />
                            </div>
                        </div>
                        <div className="row text-center mb-5">
                            <div className="col-12">
                                <p>Looks like you are lost in this Bayer space!</p>
                                <p>No worries! There is alway an option to go {(props.isCustomTitle)?<Link to={props.link}>{props.linkTitle}</Link>:<Link to="/">Home</Link>}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>      
            {(props.showNav)?<Footer />:""}     
        </div>
    );
}