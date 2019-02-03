import React, {Component} from 'react';
import {BrowserRouter} from "react-router-dom";
import Switch from "react-router/es/Switch";
import {Route} from "react-router";
import Home from "./pages/home";
import Detail from "./pages/detail";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: "100vh",
        overflowY: "scroll"
    }
});

class App extends Component {
    render() {
        return (
            <div className={this.props.classes.root}>
                <CssBaseline/>
                <BrowserRouter>
                    <Switch>
                        <Route component={Home} exact path="/"/>
                        <Route component={Detail} path="/detail/:id"/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default withStyles(styles)(App);
