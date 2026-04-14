// Add this inside your extension or main logic
basic.forever(function () {

    // Listen for incoming Bluetooth text that ends with a NewLine (\n)
    bluetooth.onUartDataReceived("\n", function () {

        // Read the string out of the buffer
        let message = bluetooth.uartReadUntil("\n");

        // Split the string by commas. Example: "1,255,128" becomes ["1", "255", "128"]
        let data = message.split(",");

        // Make sure we actually received the 3 parts we expected
        if (data.length >= 3) {
            let command = parseInt(data[0]);
            let leftMotor = parseInt(data[1]);
            let rightMotor = parseInt(data[2]);

            // Example: If command byte is 1, show a happy face
            if (command == 1) {
                basic.showIcon(IconNames.Happy);
            }
        }
    });
})