let targetRight = 0
let targetLeft = 0
let corner = 0
let spin = 0
let throttle = 0
MandoBit.startMando(1)
motionbit.brakeMotor(MotionBitMotorChannel.All)
basic.forever(function () {
    // 1. Read Analog Joysticks
    throttle = (128 - MandoBit.getLeftJoyY()) * 2
    spin = (MandoBit.getLeftJoyX() - 128) * 2
    corner = (MandoBit.getRightJoyX() - 128) * 2
    // 2. Deadzone (Safety gap to prevent drift)
    if (Math.abs(throttle) < 40) {
        throttle = 0
    }
    if (Math.abs(spin) < 40) {
        spin = 0
    }
    if (Math.abs(corner) < 40) {
        corner = 0
    }
    // ==========================================
    // 3. DIGITAL D-PAD OVERRIDE (Max Speed)
    // ==========================================
    // If D-Pad UP/DOWN is pressed, override the Y-axis throttle
    if (MandoBit.isButton1Pressed(MandoBit.MandoButton1.Up)) {
        throttle = 255
    } else if (MandoBit.isButton1Pressed(MandoBit.MandoButton1.Down)) {
        throttle = -255
    }
    // If D-Pad LEFT/RIGHT is pressed, override the X-axis spin
    if (MandoBit.isButton1Pressed(MandoBit.MandoButton1.Left)) {
        spin = -255
    } else if (MandoBit.isButton1Pressed(MandoBit.MandoButton1.Right)) {
        spin = 255
    }
    // ==========================================
    // 4. Core Mixing Logic
    // ==========================================
    // The Right Joystick (corner) seamlessly blends with the D-Pad!
    targetLeft = throttle + spin + corner
    targetRight = throttle - spin - corner
    // Constrain limits to MakeCode max (-255 to 255)
    targetLeft = Math.max(-255, Math.min(255, targetLeft))
    targetRight = Math.max(-255, Math.min(255, targetRight))
    // 5. INSTANT OUTPUT TO MOTORS
    // Output to MotionBit M1 (Left Side)
    if (targetLeft >= 0) {
        motionbit.runMotor(MotionBitMotorChannel.M1, MotionBitMotorDirection.Forward, targetLeft)
    } else {
        motionbit.runMotor(MotionBitMotorChannel.M1, MotionBitMotorDirection.Backward, Math.abs(targetLeft))
    }
    // Output to MotionBit M3 (Right Side)
    if (targetRight >= 0) {
        motionbit.runMotor(MotionBitMotorChannel.M3, MotionBitMotorDirection.Forward, targetRight)
    } else {
        motionbit.runMotor(MotionBitMotorChannel.M3, MotionBitMotorDirection.Backward, Math.abs(targetRight))
    }
    basic.pause(20)
})
