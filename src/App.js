import React, {Component} from 'react';
import {BrowserRouter} from "react-router-dom";
import Switch from "react-router/es/Switch";
import {Route} from "react-router";
import Home from "./pages/home";
import Detail from "./pages/detail";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import withStyles from "@material-ui/core/es/styles/withStyles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {brown, green} from "@material-ui/core/colors";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: "100vh",
        overflowY: "scroll"
    }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            main: green[400]
        },
        secondary: {
            main: brown[600]
        }
    }
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className={this.props.classes.root}>
                    <CssBaseline/>
                    <BrowserRouter>
                        <Switch>
                            <Route component={Home} exact path="/"/>
                            <Route component={Detail} path="/detail/:id"/>
                        </Switch>
                    </BrowserRouter>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(App);
