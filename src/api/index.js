import ApiClient from '../plugins/webBridge';
const apiClient = new ApiClient("context", "requestFromClient", "responseFromServer");

export function sendMsg(msg) {
    return apiClient.send({
        action: 'send-msg',
        data: msg
    });
}

function _addMsgListener(callback) {
    apiClient.on("receiveMsgFromServer", callback);
}

function _removeMsgListener(callback) {
    apiClient.off("receiveMsgFromServer", callback);
}

export const msgListener = {
    add: _addMsgListener,
    remove: _removeMsgListener
};