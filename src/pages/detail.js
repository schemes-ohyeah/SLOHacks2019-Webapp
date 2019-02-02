import React from "react";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Fab from "@material-ui/core/Fab/Fab";
import IconButton from "@material-ui/core/IconButton/IconButton";
import BackButton from "@material-ui/icons/KeyboardBackspace";
import {Link} from "react-router-dom";
import withStyles from "@material-ui/core/es/styles/withStyles";
import PlayIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import WaitIcon from "@material-ui/icons/HourglassFull";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar/Avatar";
import moment from "moment";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import SuccessIcon from "@material-ui/icons/Check";
import FailIcon from "@material-ui/icons/Close";

const styles = theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    successAvatar: {
        margin: 10,
        backgroundColor: green[500]
    },
    failAvatar: {
        margin: 10,
        backgroundColor: red[500]
    },
    title: {
        marginTop: 10,
        textAlign: "center"
    }
});

const dummyData = [
    {
        timestamp: "2019-02-02T18:03Z",
        success: true
    },
    {
        timestamp: "2019-02-02T18:00Z",
        success: false
    }
];

class Detail extends React.Component {
    static LOOP_STATUS = {
        idle: 0,
        recording: 1,
        uploading: 2
    };

    constructor(props) {
        super(props);

        this.state = {
            loopStatus: Detail.LOOP_STATUS.idle
        };
    }

    get successRate() {
        const percent = dummyData.filter(item => item.success).length / dummyData.length;
        return Math.round(percent * 100);
    }

    handleLoopStatusUpdate = () => {
        if (this.state.loopStatus === Detail.LOOP_STATUS.idle) {
            this._startRecording();
        }
        else if (this.state.loopStatus === Detail.LOOP_STATUS.recording) {
            this._stopRecording();
        }
        else if (this.state.loopStatus === Detail.LOOP_STATUS.uploading) {
            // Do nothing - user shouldn't be allowed to click at this time
        }
        else {
            alert("Oh no, something went wrong. :(");
            this.setState({
                loopStatus: Detail.LOOP_STATUS.idle
            });
        }
    };

    _startRecording = () => {
        this.setState({
            loopStatus: Detail.LOOP_STATUS.recording
        });
    };

    _stopRecording = () => {
        this.setState({
            loopStatus: Detail.LOOP_STATUS.uploading
        }, this._processData);
    };

    _processData = () => {
        setTimeout(() => {
            this.setState({
                loopStatus: Detail.LOOP_STATUS.idle
            });
        }, 1000);
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                {/* Application bar */}
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="back"
                            component={Link}
                            to="/">
                            <BackButton/>
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <span role="img" aria-label="Dog emoji">🐶</span>{" Command Training"}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Success rate */}
                <Typography
                    className={classes.title}
                    variant="h2">
                    {this.successRate}%
                </Typography>

                {/* History */}
                <List>
                    {
                        dummyData.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar className={item.success ? classes.successAvatar : classes.failAvatar}>
                                        {
                                            item.success ? <SuccessIcon/> : <FailIcon/>
                                        }
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={moment(item.timestamp).fromNow()}/>
                            </ListItem>
                        ))
                    }
                </List>

                {/* Loop status update */}
                <Fab
                    className={classes.fab}
                    color="secondary"
                    disabled={this.state.loopStatus === Detail.LOOP_STATUS.uploading}
                    onClick={this.handleLoopStatusUpdate}>
                    {
                        this.state.loopStatus === Detail.LOOP_STATUS.idle &&
                            <PlayIcon/>
                    }
                    {
                        this.state.loopStatus === Detail.LOOP_STATUS.recording &&
                            <StopIcon/>
                    }
                    {
                        this.state.loopStatus === Detail.LOOP_STATUS.uploading &&
                            <WaitIcon/>
                    }
                </Fab>
            </div>
        );
    }
}

export default withStyles(styles)(Detail);