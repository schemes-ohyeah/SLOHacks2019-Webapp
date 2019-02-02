import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import MicIcon from "@material-ui/icons/Mic";
import "./home.css";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
        position: 'relative',
        minHeight: 200,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    dialogContent: {
        textAlign: "center"
    },
    micIcon: {
        fontSize: "5rem"
    }
});

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            determinedVoiceSample: false,
            showModal: false,
            voiceSample: ""
        };
    }

    acceptVoiceSample = () => {
        alert("Accepted voice sample " + this.state.voiceSample);
    };

    modalOn = () => {
        this.setState({
            showModal: true
        });
    };

    modalOff = () => {
        this.setState({
            showModal: false
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                {/* Application bar */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <span role="img" aria-label="Dog emoji">🐶</span>{" Dog Instrucc"}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* List of doggo commands */}
                <List component="nav">
                    <ListItem button>
                        <ListItemText primary="Sit" secondary="73%"/>
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Roll" secondary="63%"/>
                    </ListItem>
                </List>

                {/* Add new command button */}
                <Fab
                    className={classes.fab}
                    color="secondary"
                    onClick={this.modalOn}>
                    <AddIcon/>
                </Fab>

                {/* Add new command modal */}
                <Dialog
                    open={this.state.showModal}
                    onClose={this.state.modalOff}>
                    <DialogTitle>Speak a voice command</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <div className="mic-icon-animation">
                            <MicIcon className={classes.micIcon}/>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.modalOff}
                            color="secondary">
                            Cancel
                        </Button>
                        <Button
                            onClick={this.acceptVoiceSample}
                            color="primary"
                            disabled={!this.state.determinedVoiceSample}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Home);