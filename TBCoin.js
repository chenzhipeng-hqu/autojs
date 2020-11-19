/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

module.exports = TBCoin;

function TBCoin() {
    this.run = mainEntrence
}

var morningTime = "07:18";//自己运动能量生成时间
var startTime = "07:00";
var endTime = "7:35";
var width = device.width;  //设置屏幕的宽度，像素值
var height = device.height; //设置屏幕的高度，像素值
// var width = 1080;  //设置屏幕的宽度，像素值
// var height = 2340; //设置屏幕的高度，像素值

threads.start(function(){
    //在子线程中调用observeKey()从而使按键事件处理在子线程执行
    events.observeKey();
    events.on("key_down", function(keyCode, events){
        //音量键关闭脚本
        if(keyCode == keys.volume_down){
            toast("您选择退出脚本！")
            sleep(2000);
            exit();
        }
    });
});

//环境准备
// creatEnv();
// mainEntrence();
// deleteEnv();

//程序主入口
function mainEntrence(){
    //打开淘宝
    openTaobao();
    //打开领取金币
    openGetCoin();
    //签到
    clickSignin();
    //返回主页
    whenComplete();
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

    //解锁
    unlock();

    //设置屏幕大小，适应不用屏幕尺寸手机
    setScreenMetrics(width, height);

    // 1.2 打开日志
    // console.show();
    console.info("创建脚本环境")
    toastLog("开始运行");

    //请求截图
    if(!requestScreenCapture()){
        log.error("请求截图失败,脚本退出");
        exit();
    }
    sleep(3000);
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
    }
}


// 1. 打开淘宝
function openTaobao(){
    log("打开淘宝")
    app.launch("com.taobao.taobao")
    waitForActivity("com.taobao.tao.TBMainActivity");
}

// 2. 打开领金币
function openGetCoin(){
    log("打开领金币")
    var GetCoin = desc("领淘金币").findOne().click()
    waitForActivity("com.taobao.browser.BrowserActivity");
    sleep(3000)

    // var target = text("立即去收").findOne(3000)
    // if (target) {     
    //     log("点击立即去收")
    //     target.click()
    //     sleep(1000)
    // }
}

// 3. 点击淘金币
function clickSignin() {
    // 签到领取双倍淘金币
    var target = textMatches("签到领金币.*|领取.*").findOne(3000)
    if (target) {
        log("点击签到领取双倍淘金币")
        target.click()
        target = text("关闭").findOne(1000)
        if (target) {
            log("点击 关闭 互动赚更多")
            target.click()
        }
    } else {
        log("找不到签到领取双倍淘金币")
        click(156, 800)
        sleep(300)
        click(568, 533)
    }
    sleep(1000)
}

// 3. 结束
//结束后返回主页面
function whenComplete() {
    back();
    sleep(500);
}
