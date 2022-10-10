import { Switch, Route, Redirect } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Dashboard from 'pages/Dashboard';
import Settings from 'pages/Settings';
import Files from 'pages/Files';
import Footer from 'components/Footer';
import Login from 'pages/Auth/Login';
import Register from 'pages/Auth/Register';

// Tailwind CSS Style Sheet
import 'assets/styles/tailwind.css';
import Apikeys from 'pages/Apikeys';
import Welcome from 'pages/Welcome';
import Account from 'pages/Account';
import ApikeysDetail from 'pages/ApikeysDetail';
import NotFound from 'pages/NotFound';

function App() {
    return (
        <>
            <Sidebar />
            <div className="md:ml-64">
                <div id="notification" className="fixed top-0 right-0 z-50 w-[350px] h-[50px] m-4"></div>
                <Switch>
                    <Route exact path="/" component={Welcome} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/apikey" component={Apikeys} />
                    <Route exact path="/apikey/:domain" component={ApikeysDetail} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/files" component={Files} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/404" component={NotFound} />
                    <Redirect from="*" to="/" />
                </Switch>
                <Footer />
            </div>
        </>
    );
}

// page route another page
// Language: javascript
// Path: src/pages/Documentation.js

export default App;
