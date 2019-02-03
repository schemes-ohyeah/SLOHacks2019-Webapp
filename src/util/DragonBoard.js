export default class DragonBoard {
    static IP_ADDRESS = "127.0.0.1";

    /**
     * Tells DragonBoard to start recording accelerometer values
     * with a provided Firebase document id to save to
     *
     * @param commandId
     * @returns {Promise<number>}
     */
    static startAccelerometer(commandId) {
        return fetch(DragonBoard.IP_ADDRESS, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({command_id: commandId})
        }).then(response => response.status);
    }

    /**
     * Tells DragonBoard to stop recording - the board will upload
     * to Firebase return newly generated document id in the http text
     *
     * @returns {Promise<string>}
     */
    static stopAccelerometer() {
        return fetch(DragonBoard.IP_ADDRESS, {
            method: "GET"
        }).then(response => response.text())
    }
}