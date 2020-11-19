/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

module.exports = AntFarmer;

function AntFarmer() {
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

    //进入蚂蚁庄园
    enterAntFarmer();

    //喂小鸡
    feed_the_chicken();
    //领饲料
    get_feed();
    
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

// 1. 打开支付宝
function openAlipay(){
    //launchApp("Alipay");
    
    // launchApp("支付宝");
    // toastLog("等待支付宝启动");
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

    do {
        toastLog("等待支付宝启动");
        launchApp("支付宝");
        sleep(2000);
        clickByTextDesc("首页",0);

        let button = text("稍后再说").findOne(500) // 不更新版本
        if (button) {
            let bounds = button.bounds()
            click(bounds.centerX(), bounds.centerY())
        }
    }while (!textEndsWith("蚂蚁森林").exists() && !descEndsWith("蚂蚁森林").exists())

    return true;
}

//从支付宝主页进入蚂蚁森林进入蚂蚁庄园
function enterAntFarmer(){
    //五次尝试蚂蚁森林入
    // var i=0;
    // while (!textEndsWith("蚂蚁森林").exists() && !descEndsWith("蚂蚁森林").exists()){
    //     // i++;   
    //     clickByTextDesc("首页",0);
    //     sleep(1000);
    // }  
    // if(i>=5){
    //     toastLog("没有找到蚂蚁森林入口，尝试中");
    //     clickByTextDesc("首页",0);
    //     sleep(1000);
        // swipe(screen_width*0.5,screen_height*0.3,screen_width*0.5,screen_height*0.7,1000);
        // sleep(2000);
        // swipe(screen_width*0.5,screen_height*0.3,screen_width*0.5,screen_height*0.7,1000);
        // sleep(2000);
    // }
    clickByTextDesc("蚂蚁森林",0);
    sleep(500);

    className("android.widget.TextView").text("蚂蚁森林").waitFor();
    sleep(2000);
    log("进入蚂蚁庄园")
    press(938, 1375, 100);
    sleep(1000)

    return true;
}

// 喂小鸡
function feed_the_chicken() {
    className("android.widget.TextView").text("蚂蚁庄园").waitFor();
    sleep(500);
    //喂饲料
    press(950, 2200, 100);
    sleep(1000)
}

// 3. 领饲料
function get_feed(){
    log("领饲料")
    press(385, 2214, 100);
    sleep(1200)
    var target = text("去完成").findOne(1000)
    if (target) {
    }

    // 关闭
    // press(1021, 830, 100);
    back();
    sleep(1000)
}

// 3. 结束
//结束后返回主页面
function whenComplete() {
    toastLog("蚂蚁庄园结束");
    back();
    sleep(500);
    back();
    sleep(500);
    // className("android.widget.TextView").text("首页").findOne(3000).parent().click();
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