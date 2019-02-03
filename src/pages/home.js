import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import {Link} from "react-router-dom";
import AudioTranscriber from "../components/AudioTranscriber";
import Firebase from "../util/Firebase";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import {withRouter} from "react-router";
import LogoIcon from "../components/LogoIcon";

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
    }
});

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            commands: undefined,
            determinedVoiceSample: false,
            showModal: false,
            voiceSample: ""
        };
    }

    componentDidMount() {
        Firebase.listCommands().then(commands => this.setState({commands}));
    }

    acceptVoiceSample = () => {
        this.modalOff();
        Firebase.addCommand(this.state.voiceSample.toLowerCase())
            .then(docRef => {
                this.props.history.push(`/detail/${docRef.id}`);
            });
    };

    modalOn = () => {
        this.setState({
            determinedVoiceSample: false,
            showModal: true,
            voiceSample: ""
        });
    };

    modalOff = () => {
        this.setState({
            showModal: false
        });
    };

    receiveRecognizedSpeech = (result) => {
        this.setState({
            determinedVoiceSample: true,
            voiceSample: result
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
                            <LogoIcon/>{" Dog Instrucc"}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* List of doggo commands */}
                {
                    this.state.commands === undefined
                        ? <CircularProgress/>
                        : <List>
                            {
                                this.state.commands.length === 0
                                    ? <Typography style={{padding: "1rem"}}>
                                        No entries yet. Click the button at the bottom to get started!
                                    </Typography>
                                    : this.state.commands.map(command => {
                                        const commandName = command.name[0].toUpperCase() + command.name.substring(1);
                                        const successRate = Math.round(command.successRate * 100);
                                        return (
                                            <ListItem
                                                button
                                                component={Link}
                                                key={command.id}
                                                to={`/detail/${command.id}`}>
                                                <ListItemText
                                                    primary={commandName}
                                                    secondary={`${isNaN(successRate) ? 0 : successRate}%`}/>
                                            </ListItem>
                                        );
                                    })
                            }
                        </List>
                }

                {/* Add new command button */}
                <Fab
                    className={classes.fab}
                    color="secondary"
                    onClick={this.modalOn}>
                    <i className="fas fa-paw"/>
                </Fab>

                {/* Add new command modal */}
                <Dialog
                    open={this.state.showModal}
                    onClose={this.state.modalOff}>
                    <DialogTitle>Speak a voice command</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <AudioTranscriber
                            sendRecognizedSpeech={this.receiveRecognizedSpeech}/>
                        <Typography>{this.state.voiceSample}</Typography>
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

export default withRouter(withStyles(styles)(Home));