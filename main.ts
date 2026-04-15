// 1. Start the MandoBit handshake and background listener on Channel 9
MandoBit.startMando(9)
// 2. Main loop
basic.forever(function () {
    // Grab the pre-formatted string from the extension and print it
    serial.writeLine(MandoBit.getRawPacket())
    // Add a small 50ms pause so we don't crash the Serial Monitor!
    basic.pause(50)
})
