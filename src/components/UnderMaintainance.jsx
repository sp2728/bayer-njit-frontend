import { NavigationBar, Footer} from "./Common/CommonComponent";
import { Link } from "react-router-dom";

export const UnderMaintainance = (props)=>{
    return (
        <div className="not-found">
            {(props.showNav)?<NavigationBar />:""}
            <div className="container-fluid">
                <div style={{height: (screen.width>767&&screen.height>480)?"100vh":"unset"}} className="row">
                    <div className="col-12">
                        <div className="row pt-5 text-center">
                            <div className="col-12 mt-5 pt-5">
                                <h2>Under Maintainance</h2>
                            </div>
                        </div>
                        <div className="row py-5 text-center">
                            <div className="col-12">
                                <i style={(screen.width<769)?{fontSize:300}:{fontSize:150}} className="fas fa-cog" />
                            </div>
                        </div>
                        <div className="row text-center mb-5">
                            <div className="col-12">
                                <p>Looks like you are lost in this Bayer space!</p>
                                <p>No worries! There is alway an option to get on {(props.isCustomTitle)?<Link to={props.link}>{props.linkTitle}</Link>:<Link to="/dashboard">Dashboard</Link>}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>      
            {(props.showNav)?<Footer />:""}     
        </div>
    );
}