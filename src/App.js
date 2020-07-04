import React, {Component} from 'react';
import './App.css';
import Home from './Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ImplicitCallback, SecureRoute, Security, withAuth} from '@okta/okta-react';
import StocksList from './StocksList';
import StocksEdit from './StocksEdit';
import Api from './Api';
import NavBar from "./NavBar";

const AuthWrapper = withAuth(class WrappedRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {authenticated: null, user: null, api: new Api()};
        this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    async checkAuthentication() {
        const authenticated = await this.props.auth.isAuthenticated();
        if (authenticated !== this.state.authenticated) {
            if (authenticated) {
                const user = await this.props.auth.getUser();
                let accessToken = await this.props.auth.getAccessToken();
                this.setState({authenticated, user, api: new Api(accessToken)});
            } else {
                this.setState({authenticated, user: null, api: new Api()});
            }
        }
    }

    async componentDidMount() {
        this.checkAuthentication();
    }

    async componentDidUpdate() {
        this.checkAuthentication();
    }

    async login() {
        if (this.state.authenticated === null) return; // do nothing if auth isn't loaded yet
        this.props.auth.login('/');
    }

    async logout() {
        this.props.auth.logout('/');
    }

    render() {
        let {authenticated, user, api} = this.state;
        if (authenticated === null) {
            return null;
        }
        const navbar = <NavBar
            isAuthenticated={authenticated}
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
        />;
        return (
            <Switch>
                <Route
                    path='/'
                    exact={true}
                    render={(props) => <Home {...props} authenticated={authenticated} user={user} api={api}
                                             navbar={navbar}/>}
                />
                <SecureRoute
                    path='/stocks'
                    exact={true}
                    render={(props) => <StocksList {...props} authenticated={authenticated} user={user} api={api}
                                                   navbar={navbar}/>}
                />
                <SecureRoute
                    path='/stocks/:id'
                    render={(props) => <StocksEdit {...props} authenticated={authenticated} user={user} api={api}
                                                   navbar={navbar}/>}
                />
            </Switch>
        )
    }
});

class App extends Component {
    render() {
        return (
            <Router>
                <Security issuer='https://dev-300026.okta.com/oauth2/default'
                          clientId='0oajbh7acK4R7bVuj4x6'
                          redirectUri={window.location.origin + '/implicit/callback'}
                          pkce={true}>
                    <Route path='/implicit/callback' component={ImplicitCallback}/>
                    <AuthWrapper/>
                </Security>
            </Router>
        )
    }
}

export default App;