import './App.css';
import Authentication from './components/Authentication/Authentication';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
//import Layout from './components/Layout/Layout';

//import { Provider } from "react-redux";
//import store from "./store/index";


/** 
 Main Application component 
 @returns {JSX} Application object
*/
function App() {

  return (
    <div className="App">
      <Router>
        <Switch>

          <Route path="/auth" component={Authentication} />
          <Route exact path="/"><Redirect to="/auth/login"/></Route>
          <Route path="/dashboard" component={Dashboard} />
          
          <Route path="*" component={NotFound} />
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
