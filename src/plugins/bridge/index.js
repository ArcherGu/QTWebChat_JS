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

var JsClient = function (qtObjName, callback = _ => {}) {
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
                onmessage() {}
            }
        };
    }

    this.Send = _ => {};
    this.On = _ => { console.log("尚未初始化！"); };
    this.Off = _ => { console.log("尚未初始化！"); };
    new QWebChannel(window.qt.webChannelTransport, (channel) => {
        if (!Object.keys(channel.objects).includes(qtObjName)) {
            callback();
            return console.error('[QTWEBCHANNEL]: Unknown QT Object !');
        }
        const QtServer = channel.objects[qtObjName];
        this.Send = createSender(QtServer);
        this.On = addDispatcher(QtServer);
        this.Off = removeDispatcher(QtServer);
        callback();
    });
}

export default JsClient;