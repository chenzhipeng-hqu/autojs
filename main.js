/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

var morningTime = "07:18";//自己运动能量生成时间
var startTime = "07:00";
var endTime = "7:35";
var width = device.width;  //设置屏幕的宽度，像素值
var height = device.height; //设置屏幕的高度，像素值
// var width = 1080;  //设置屏幕的宽度，像素值
// var height = 2340; //设置屏幕的高度，像素值
const WIDTH = Math.min(device.width, device.height);
const HEIGHT = Math.max(device.width, device.height);
const IS_ROOT = files.exists("/sbin/su") || files.exists("/system/xbin/su") || files.exists("/system/bin/su");


var Common = require('common.js');
var common = new Common();


threads.start(function(){
    //在子线程中调用observeKey()从而使按键事件处理在子线程执行
    events.observeKey();
    events.on("key_down", function(keyCode, events){
        //音量键关闭脚本
        if(keyCode == keys.volume_down){
            toast("您选择退出脚本！")
            sleep(1000);
            exit();
        }
    });
});

//环境准备
creatEnv();
//任务选择
taskChoose();
//释放环境
deleteEnv();

/**
 * 任务选择
 */
function taskChoose() {
    taskChooseList = ["全选", "蚂蚁森林", "饿了么果园", "蚂蚁会员积分", "芭芭农场",
                        "东东萌宠", "东东农场", "淘金币(待开发)", "蚂蚁庄园(待开发)"];
    var options = dialogs.multiChoice("请选择需要执行的任务", taskChooseList, [0]);
    if (options == '') {
        toastLog("未选择任务");
        return false
    }
    if(options[0] == 0) {
        log("选择了全选")
        options.shift(0)
        for(let j=1; j<taskChooseList.length; j++) {
            if (options.indexOf(j) > -1) {
                // log("存在")
            } else {
                options.push(j)
            }
        }
    }

    var JDongAppName = "京东"
    var JDongChooseList = ["京东", "双开京东"]
    //勾选京东任务时弹出双开京东选择
    if ((options.indexOf(5) > -1) || (options.indexOf(6) > -1)) {
        JDongAppName = JDongChooseList[JDongChoose(JDongChooseList)];
        log(JDongAppName)
    }

    options.forEach(option => {
        var ret = 0;
        toastLog("执行【"+ taskChooseList[option] +"】任务")
        switch (taskChooseList[option]) {
            case "蚂蚁森林": {
                var AntForest = require('AntForest.js');
                var antForest = new AntForest();
                ret = antForest.run()
                break;
            }
            case "蚂蚁会员积分": {
                var AntVip = require('AntVip.js');
                var antVip = new AntVip();
                ret = antVip.run()
                break;
            }
            case "芭芭农场": {
                var BabaFarmer = require('BabaFarmer.js');
                var babaFarmer = new BabaFarmer();
                ret = babaFarmer.run()
                break;
            }
            case "饿了么果园": {
                var Eleme = require('Eleme.js');
                var eleme = new Eleme();
                ret = eleme.run()
                break;
            }
            case "东东萌宠": {
                var JDongPet = require('JDongPet.js');
                var jdongPet = new JDongPet();
                ret = jdongPet.run(JDongAppName)
                break;
            }
            case "东东农场": {
                var JDongFarmer = require('JDongFarmer.js');
                var jdongFarmer = new JDongFarmer();
                ret = jdongFarmer.run(JDongAppName)
                break;
            }
            default:{
                toastLog("【"+ taskChooseList[option] +"】待开发，敬请等候")
                break;
            }
        }
        toastLog("【"+ taskChooseList[option] +"】结束")
    })
}

/**
 * 京东 或者 双开京东 选择
 */
function JDongChoose(JDongChooseList) {
    var option = dialogs.singleChoice("选择京东APP）", JDongChooseList, 0);
    if (option == -1) {
        toastLog("脚本已退出");
        exit();
    }

    return option;
}

// 1. 环境准备
//获取权限和设置参数
function creatEnv() {
    try {
        auto.waitFor();
    } catch (error) {
        toast("请手动开启无障碍并授权给Auto.js");
        console.error("请手动开启无障碍并授权给Auto.js")
        exit();
    }

    //设置屏幕大小，适应不同屏幕尺寸手机
    setScreenMetrics(width, height);

    //解锁
    unlock();

    // 1.2 打开日志
    // console.show();
    toastLog("开始运行");
    console.info("创建脚本环境")

    //请求截图
    if(!requestScreenCapture()){
        log.error("请求截图失败,脚本退出");
        exit();
    }
    // sleep(3000);
}

function deleteEnv() {
    console.info("删除脚本环境")
    toastLog("结束运行");
    exit();
}

// 1.1 解锁
//解锁
function unlock(){
    if(!device.isScreenOn()){
        //点亮屏幕
        device.wakeUp();
        sleep(1000);
        //滑动屏幕到输入密码界面 
        swipe(500,2000,500,1000,222);// 201~238可以
        sleep(800)
        //输入密码图案
        gestures([0, 800, [250, 936], [834, 936], [834, 1518]]);
        sleep(1000);
    }
}
