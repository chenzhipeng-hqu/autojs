/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

module.exports = Eleme;

function Eleme() {
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
    //打开支付宝
    openAlipay();

    //打开饿了么果园
    openElemeGarden();

    //浏览任务
    daily_task();

    //浇水次数
    watering(10);
    
    //结束回到主页
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
    sleep(1000);
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

// 打开支付宝
function openAlipay(){
    //launchApp("Alipay");
    
    launchApp("支付宝");
    toastLog("等待支付宝启动");
    //sleep(3000);
    // var i=0;
    // while (!textEndsWith("扫一扫").exists() && !descEndsWith("扫一扫").exists() && i<=5){
    //     clickByTextDesc("首页",0);
    //     sleep(1000);
    //     i++;
    // }
    // toastLog("第"+i+"次尝试进入支付宝主页");
    // if(i>=5){
    //     toastLog("没有找到支付宝首页");
    //     sleep(1000);
    //     clickByTextDesc("首页",0);
    //     return false;
    // }
    return true;
}

// 打开饿了么果园
function openElemeGarden(){ 
    var target = textContains("饿了么").findOne(3000) //支付宝饿了么页面
    if (target) {
        log("点击饿了么")
        target.parent().click()
        target = textContains("0元领水果").findOne(3000) //0元领水果
        if (target) {
            log("点击0元领水果")
            target.parent().click()
            sleep(3000)
        }
    }

    target = textContains("升级账号").findOne(1000) //支付宝饿了么页面
    if (target) {
        target.click();
        log("正在升级账号")
        while(!text("饿了么果园").exists());
        log("升级账号完成")
    }

    return true;
}

// 签到 / 领水滴 / 邀请好友助力
function daily_task(){

}

// 浇水 n 次
function watering(cnt){
    cnt = cnt ? cnt : 5;
    for(var i=0; i<cnt; i++) {
        click(900, 2200);
        sleep(2500);
        log("浇水第"+(i+1)+"次");
    }
}

// 3. 结束
//结束后返回主页面
function whenComplete() {
    toastLog("蚂蚁积分结束");
    back();
    sleep(500);
    back();
    sleep(500);
}


function clickByTextDesc(energyType,paddingY){
    var clicked = false;
    if(descEndsWith(energyType).exists()){
        descEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            if(posb.centerX()<0 || posb.centerY()-paddingY<0){
                return false;
            }
            //toastLog(pos.id());
            var str = pos.id();
            if(str != null){
                if(str.search("search") == -1){
                    click(posb.centerX(),posb.centerY()-paddingY);
                     //toastLog("get it 1");
                     clicked = true;   
                }
            }else{
                click(posb.centerX(),posb.centerY()-paddingY);
                //toastLog("get it 2");
                clicked = true;
                sleep(100);
            }
        });
    }
    
    if(textEndsWith(energyType).exists() && clicked == false){
        textEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            if(posb.centerX()<0 || posb.centerY()-paddingY<0){
                return false;
            }
            //toastLog(pos.id());
            var str = pos.id();
            if(str != null){
                if(str.search("search") == -1){
                    click(posb.centerX(),posb.centerY()-paddingY); 
                    //toastLog("get it 3"); 
                    clicked = true;  
                }
            }else{
                click(posb.centerX(),posb.centerY()-paddingY);
                //toastLog("get it 4");
                clicked = true;
            }
            sleep(100);
        });
    }
    
    return clicked;
}