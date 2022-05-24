import './App.css';
import Authentication from './components/Authentication/Authentication';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import { UnderMaintainance } from './components/UnderMaintainance';
import { UserProfile } from './components/UserProfile';

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
          
          <Route exact path="/user/:username/profile" component={UserProfile}/>
          <Route path="*"><NotFound showNav={true}/></Route>
          
        </Switch>
      </Router>
    </div>
  );
}

export default App;
