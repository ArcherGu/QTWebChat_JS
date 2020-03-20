<template>
    <div class="home">
        Receive Msg: <textarea v-model="receiveMsg" />
        <br>
        Send Msg: <textarea v-model="sendMsg" />
        <br>
        <button @click="send">Send</button>
    </div>
</template>

<script>
import { JsClient } from '../main';
export default {
    name: 'Home',
    components: {

    },
    data() {
        return {
            action: 'JSSendMessage',
            sendMsg: '',
            receiveMsg: '',
        }
    },
    mounted() {
        JsClient.Listener('SigSendMessageToJS', this.receive);
    },
    methods: {
        printChannel() {
            console.log(JsClient);
        },

        send() {
            JsClient.Sender({
                action: this.action,
                data: this.sendMsg
            }).then((response) => {
                let time = this.dateToString(new Date());
                this.receiveMsg += `[${time}] JS: ${this.sendMsg}\n`;
                this.sendMsg = ''
            }).catch((error) => {
                console.error(error);
            });
        },

        receive(msg) {
            let time = this.dateToString(new Date());
            this.receiveMsg += `[${time}] QT: ${msg}\n`;
        },

        dateToString(now) {
            var year = now.getFullYear();
            var month = (now.getMonth() + 1).toString();
            var day = (now.getDate()).toString();
            var hour = (now.getHours()).toString();
            var minute = (now.getMinutes()).toString();
            var second = (now.getSeconds()).toString();
            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }
            if (hour.length == 1) {
                hour = "0" + hour;
            }
            if (minute.length == 1) {
                minute = "0" + minute;
            }
            if (second.length == 1) {
                second = "0" + second;
            }
            var dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return dateTime;
        }

    }
}
</script>
