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
            .then(doc => {
                return doc.data();
            })
    }
}
