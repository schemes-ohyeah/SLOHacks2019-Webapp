import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyA_0IhKpkkLMrzIl4zS8N306XibgNoRTP4",
    authDomain: "slohacks-dog-instrucc.firebaseapp.com",
    databaseURL: "https://slohacks-dog-instrucc.firebaseio.com",
    projectId: "slohacks-dog-instrucc",
    storageBucket: "",
    messagingSenderId: "504644134709"
};
firebase.initializeApp(config);

export default class Firebase {
    static db = firebase.firestore();

    /**
     * Adds a new command
     *
     * @param command
     * @returns {Promise<firebase.firestore.DocumentReference>}
     */
    static addCommand(command) {
        return Firebase.db.collection("commands").add({
            name: command,
            successRate: 0,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Gets a list of all commands sorted newest first. Document id
     * is merged into the document data for convenient look up
     *
     * @returns {Promise<firebase.firestore.QuerySnapshot>}
     */
    static listCommands() {
        return Firebase.db
            .collection("commands")
            .orderBy("timestamp", "desc")
            .get()
            .then(querySnapshot => {
                return new Promise(resolve => {
                    const data = [];
                    querySnapshot.forEach(doc => {
                        const dataPoint = doc.data();
                        dataPoint.id = doc.id;
                        data.push(dataPoint);
                    });
                    resolve(data);
                });
            });
    }

    /**
     * Gets the details of a specific command - unlike listCommands,
     * document id is not merged into the response because it is already
     * known (provided as argument)
     *
     * @param commandId
     * @returns {Promise<firebase.firestore.DocumentData>}
     */
    static getCommand(commandId) {
        return Firebase.db
            .collection("commands")
            .doc(commandId)
            .get()
            .then(doc => doc.data())
    }

    /**
     * Gets a list of all attempts for a specific command. Document id
     * is merged into the document data for convenient look up
     *
     * @param commandId
     * @returns {Promise<firebase.firestore.QuerySnapshot>}
     */
    static listAttempts(commandId) {
        return Firebase.db
            .collection("commands")
            .doc(commandId)
            .collection("attempts")
            .orderBy("timestamp", "desc")
            .get()
            .then(querySnapshot => {
                return new Promise(resolve => {
                    const data = [];
                    querySnapshot.forEach(doc => {
                        const dataPoint = doc.data();
                        dataPoint.id = doc.id;
                        data.push(dataPoint);
                    });
                    resolve(data);
                });
            });
    }

    /**
     * Gets the first command
     *
     * @param commandId
     * @returns {Promise<firebase.firestore.QuerySnapshot>}
     */
    static getFirstAttempt(commandId) {
        return Firebase.db
            .collection("commands")
            .doc(commandId)
            .collection("attempts")
            .orderBy("timestamp", "desc")
            .limit(1)
            .get()
            .then(querySnapshot => {
                return new Promise(resolve => {
                    let data = {};
                    querySnapshot.forEach(doc => {
                        data = doc.data();
                        data.id = doc.id;
                    });
                    resolve(data);
                })
            })
    }
    /**
     * Gets a specific attempt - typically used in non validated state
     *
     * @param commandId
     * @param attemptId
     */
    static getAttempt(commandId, attemptId) {
        return Firebase.db
            .collection("commands")
            .doc(commandId)
            .collection("attempts")
            .doc(attemptId)
            .get()
            .then(doc => doc.data());
    }

    /**
     * After calculating attempt to be success or fail, update database
     *
     * @param commandId
     * @param attemptId
     * @param result true | false
     * @returns {Promise<void>}
     */
    static updateAttempt(commandId, attemptId, result) {
        return Firebase.db
            .collection("commands")
            .doc(commandId)
            .collection(attemptId)
            .doc(attemptId)
            .update({
                success: result
            });
    }

    /**
     * Submits data to Google Cloud Function to calculate if the move was successful
     *
     * @param commandId
     * @param attemptId
     */
    static validateAttempt(commandId, attemptId) {
        return Firebase.getAttempt(commandId, attemptId)
            .then(recentAttempt => {
                Firebase.getFirstAttempt(commandId)
                    .then(firstAttempt => {
                        fetch("https://us-central1-slohacks-dog-instrucc.cloudfunctions.net/function-1", {
                            method: "POST",
                            headers: new Headers({
                                "Content-Type": "appliation/json"
                            }),
                            body: JSON.stringify({
                                reference: firstAttempt.measurements,
                                recent: recentAttempt.measurements
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                const ERROR_THRESHOLD = 100;
                                const totalError = data.error_x + data.error_y + data.error_z;
                                console.log(totalError);
                                const success = totalError < ERROR_THRESHOLD;
                                Firebase.updateAttempt(commandId, attemptId, success)
                                    .then(() => {
                                        return Firebase.normalizeCommandSuccess(commandId);
                                    });
                            });
                    })
            })
    }

    /**
     * Once new attempt is determined, calculate new success rate for entire command
     *
     * @param commandId
     * @returns {Promise<void>}
     */
    static normalizeCommandSuccess(commandId) {
        return Firebase.listAttempts(commandId)
            .then(data => {
                const newSuccessRate = data.filter(item => item.success).length / data.length;
                return Firebase.db
                    .collection("commands")
                    .doc(commandId)
                    .update({
                        successRate: newSuccessRate
                    });
            })
    }
}
