import QWebChannel from './bridge/qwebchannel';
import {
    assert,
    isQtClient,
    log
} from './utils';
import {
    createSender,
    addDispatcher,
    removeDispatcher
} from './bridge/helper';

const __DEV__ = process.env.NODE_ENV === 'development';

class WebBridge {
    constructor(qtObjName, callback = _ => { }) {
        //初始化参数是否正常
        if (!qtObjName) {
            assert(qtObjName, '必须提供一个QT对象的名称！');
        }
        //非开发环境下需要判断是否在真实的QtWebEngine环境中
        if (!__DEV__) {
            assert(
                window && window.qt && window.qt.webChannelTransport,
                "'qt' 或者 'qt.webChannelTransport' 需要被 QtWebEngine 注入到页面中！"
            );
        }

        //开发环境中，若不在QtWebEngine中则进行模拟
        if (__DEV__ && !isQtClient) {
            window.qt = {
                webChannelTransport: {
                    send() {
                        log('QWebChannel simulator activated !');
                    },
                    onmessage() { }
                }
            };
        }

        //初始化未完成之前先暂存
        this.sendQueue = [];
        this.eventQueue = [];

        this.send = ({ action, data = '' }) => {
            return new Promise((resolve, reject) => {
                this.sendQueue.push({
                    action: action,
                    data: data,
                    promise: {
                        resolve: resolve,
                        reject: reject,
                    }
                });
            });
        };

        this.on = (event, callback) => {
            this.eventQueue.push({
                event: event,
                callback: callback
            });
        };

        this.off = (event, callback) => {
            console.log("尚未初始化！");
        };

        new QWebChannel(window.qt.webChannelTransport, (channel) => {
            if (!Object.keys(channel.objects).includes(qtObjName)) {
                callback();
                return console.error('[QTWEBCHANNEL]: Unknown QT Object !');
            }

            const QtServer = channel.objects[qtObjName];

            this.send = createSender(QtServer);
            this.on = addDispatcher(QtServer);
            this.off = removeDispatcher(QtServer);

            if (this.sendQueue.length > 0) {
                this.sendQueue.forEach(e => {
                    this.send({ action: e.action, data: e.data, promise: e.promise });
                });

                this.sendQueue = [];
            }

            if (this.eventQueue.length > 0) {
                this.eventQueue.forEach(e => {
                    this.on(e.event, e.callback);
                });

                this.eventQueue = [];
            }

            callback();
        });
    }
}

class ApiClient {
    constructor(qtObjName, sendActionName, listenEventName, callback = _ => { }) {
        this.webBridge = new WebBridge(qtObjName, callback = _ => { });
        this.sendActionName = sendActionName;
        this.listenEventName = listenEventName;
        this.callbackList = {};
        this.callbackId = 0;
    }

    send(request) {
        return new Promise((resolve, reject) => {
            request.id = this.callbackId++;
            this.callbackList[request.id] = {
                resolve,
                reject
            };

            this.webBridge.send({
                action: this.sendActionName,
                data: JSON.stringify(request)
            });
        });
    }

    addResponseListener() {
        this.webBridge.on(this.listenEventName, (responseStr) => {
            console.log(responseStr);
            let response = JSON.parse(responseStr);
            if (response.hasOwnProperty("id")) {
                const promiseObj = this.callbackList[response.id];
                promiseObj.resolve(response.data);
                delete this.callbackList[response.id];
            }
        });
    }

    on(eventName, callback) {
        this.webBridge.on(eventName, callback);
    }

    off(eventName, callback) {
        this.webBridge.off(eventName, callback);
    }
}

export default ApiClient;