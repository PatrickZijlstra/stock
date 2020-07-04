import React, {Component} from 'react';
import {Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {Link} from 'react-router-dom';

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });

    }

    render() {
        const {isAuthenticated, login, logout} = this.props;
        return <Navbar color="light" light expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink
                            href="https://www.linkedin.com/in/p-j-zijlstra/">Patrick Zijlstra</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://github.com/PatrickZijlstra">GitHub</NavLink>
                    </NavItem>

                    {!isAuthenticated ?
                        <NavItem>
                            <Button color="secondary" outline onClick={login}>Login</Button>
                        </NavItem> :
                        <NavItem>
                            <Button color="secondary" outline onClick={logout}>Logout</Button>
                        </NavItem>
                    }
                </Nav>
            </Collapse>
        </Navbar>;
    }
}

export default NavBar;