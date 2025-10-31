class Controllable {
    turnOn() { throw new Error('必须实现 turnOn 方法'); }
    turnOff() { throw new Error('必须实现 turnOff 方法'); }
}

module.exports = Controllable;
