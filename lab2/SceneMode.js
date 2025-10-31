class SceneMode {
    constructor(name, actions = []) {
        this.name = name;
        this.actions = actions; // [{ device, action: () => {} }, ...]
    }

    addAction(device, action) {
        this.actions.push({ device, action });
    }

    applyScene() {
        this.actions.forEach(({ device, action }) => {
            try {
                action.call(device);
            } catch (e) {
                console.error(`设备[${device.deviceName}]场景操作失败：${e.message}`);
            }
        });
    }
}

module.exports = SceneMode;
