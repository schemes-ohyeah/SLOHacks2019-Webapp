import * as firebase from "firebase";

export default class Firebase {
    constructor() {
        const config = {
            apiKey: "AIzaSyA_0IhKpkkLMrzIl4zS8N306XibgNoRTP4",
            authDomain: "slohacks-dog-instrucc.firebaseapp.com",
            databaseURL: "https://slohacks-dog-instrucc.firebaseio.com",
            projectId: "slohacks-dog-instrucc",
            storageBucket: "",
            messagingSenderId: "504644134709"
        };
        try {
            firebase.initializeApp(config);
        }
        catch (e) {
            console.warn(e);
        }

        this.db = firebase.firestore();
    }

    addCommand(command) {
        return this.db.collection("commands").add({
            name: command,
            successRate: 0,
            timestamp: new Date().toISOString()
        });
    }

    listCommands() {
        return this.db
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

    getCommand(command) {
        return this.db
            .collection("commands")
            .doc(command)
            .get()
            .then(doc => {
                return doc.data();
            })
    }
}
