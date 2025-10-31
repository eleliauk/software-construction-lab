class SmartDevice {
    constructor(deviceId, deviceName) {
        if (new.target === SmartDevice) {
            throw new Error("不能直接实例化SmartDevice抽象类");
        }
        this._deviceId = deviceId;
        this._deviceName = deviceName;
        this._isOn = false;
    }
    turnOn() {
        this._isOn = true;
    }
    turnOff() {
        this._isOn = false;
    }
    getStatus() {
        return this._isOn ? "开" : "关";
    }
    get deviceId() { return this._deviceId; }
    get deviceName() { return this._deviceName; }
    get isOn() { return this._isOn; }
    getDeviceType() {
        throw new Error("请在子类中实现getDeviceType方法");
    }
}

module.exports = SmartDevice;
