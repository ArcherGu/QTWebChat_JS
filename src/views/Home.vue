<template>
    <el-form
        label-position="top"
        label-width="80px"
        :model="msg"
    >
        <el-form-item label="Receive Msg">
            <el-input
                v-model="msg.receiveMsg"
                type="textarea"
                readonly
                :rows="10"
            ></el-input>
        </el-form-item>
        <el-form-item label="Send Msg">
            <el-input
                v-model="msg.sendMsg"
                type="textarea"
                autosize
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
                @click="send"
                type="primary"
            >
                Send
            </el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
import { sendMsg, msgListener } from "../api";

export default {
    name: "Home",
    components: {},
    data() {
        return {
            msg: {
                sendMsg: "",
                receiveMsg: "",
            },
        };
    },
    created() {
        this.unNewTest();
        msgListener.add(this.receive);
    },
    beforeDestroy() {
        msgListener.remove(this.receive);
    },
    mounted() {},
    methods: {
        send() {
            sendMsg(this.msg.sendMsg)
                .then((response) => {
                    console.log(response);
                    let time = this.dateToString(new Date());
                    this.msg.receiveMsg += `[${time}] JS: ${this.msg.sendMsg}\n`;
                    this.msg.sendMsg = "";
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        receive(msg) {
            let time = this.dateToString(new Date());
            this.msg.receiveMsg += `[${time}] QT: ${msg}\n`;
        },

        dateToString(now) {
            var year = now.getFullYear();
            var month = (now.getMonth() + 1).toString();
            var day = now.getDate().toString();
            var hour = now.getHours().toString();
            var minute = now.getMinutes().toString();
            var second = now.getSeconds().toString();
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
            var dateTime =
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hour +
                ":" +
                minute +
                ":" +
                second;
            return dateTime;
        },

        unNewTest() {
            let msg = "这是一条测试QWebChannel部分尚未初始化的信息";
            sendMsg(msg)
                .then((response) => {
                    let time = this.dateToString(new Date());
                    this.msg.receiveMsg += `[${time}] JS: ${msg}\n`;
                    this.msg.sendMsg = "";
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>
