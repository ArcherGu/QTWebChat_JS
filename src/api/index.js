import WebBridge from '../plugins/webBridge';
export const webBridge = new WebBridge("context");

export function sendMsg(msg) {
    return webBridge.send({
        action: 'send_msg',
        data: msg
    });
}

function _addMsgListener(callback) {
    webBridge.on("SigReceviceMessageFromQT", callback);
}

function _removeMsgListener(callback) {
    webBridge.off("SigReceviceMessageFromQT", callback);
}

export const msgListener = {
    add: _addMsgListener,
    remove: _removeMsgListener
};