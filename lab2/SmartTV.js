const SmartDevice = require('./SmartDevice');

class SmartTV extends SmartDevice {
    constructor(deviceId, deviceName, channel = 1, volume = 10) {
        super(deviceId, deviceName);
        this._channel = channel; // 当前频道
        this._volume = volume;   // 当前音量（0-100）
    }
    setChannel(ch) {
        if (typeof ch !== "number" || ch < 1) throw new Error("频道应为正整数");
        this._channel = ch;
    }
    setVolume(vol) {
        if (vol < 0 || vol > 100) throw new Error("音量应为0~100之间");
        this._volume = vol;
    }
    getDeviceType() { return "智能电视"; }
    getStatus() {
        return `${super.getStatus()}，频道：${this._channel}，音量：${this._volume}`;
    }
}

module.exports = SmartTV;
