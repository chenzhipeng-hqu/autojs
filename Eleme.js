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
    goto_browse_task();

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
    sleep(2000)
    return true;
}

// 打开饿了么果园
function openElemeGarden(){ 
    log("等待 饿了么");
    textContains("饿了么").waitFor()
    sleep(1000)
    var target = text("饿了么").findOne(5000) //支付宝饿了么页面
    if (target) {
        log("点击 " + target.text())
        sleep(1000)
        var bounds = target.bounds()
        click(bounds.centerX(), bounds.centerY())
        sleep(2000)
        log("等待 0元领水果");
        textContains("0元领水果").waitFor()
        target = textContains("0元领水果").findOne(5000) //0元领水果
        if (target) {
            log("点击0元领水果")
            var bounds = target.bounds()
            click(bounds.centerX(), bounds.centerY())
            sleep(2000);
            do{
                sleep(2000);
                log('等待加载饿了么果园界面')
            } while(textMatches("工具.*|正在.*").exists());
            back();
            log("返回")
            sleep(1000)
        }
        back();
        log("返回")
        sleep(1000)
    }
    
    log("等待 口碑");
    textContains("口碑").waitFor()
    sleep(1000)
    var target = text("口碑").findOne(5000) //支付宝饿了么页面
    if (target) {
        log("点击 " + target.text())
        sleep(1000)
        var bounds = target.bounds()
        click(bounds.centerX(), bounds.centerY())
        sleep(2000)
        log("等待 0元领水果");
        textContains("0元领水果").waitFor()
        target = textContains("0元领水果").findOne(5000) //0元领水果
        if (target) {
            log("点击0元领水果")
            var bounds = target.bounds()
            click(bounds.centerX(), bounds.centerY())
            sleep(2000);
            do{
                sleep(2000);
                log('等待加载饿了么果园界面')
            } while(textMatches("工具.*|正在.*").exists());
            sleep(1000);
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

// 回果园 2020/12/07 双12需要
function goto_fruit() {
    log("点击回果园")
    click(130, 1000)
    sleep(1600)
}

// 签到 / 领水滴 / 邀请好友助力
function goto_browse_task() {
    do {
        // 2020/12/07 双12需要
        goto_fruit();

        log("点击领水滴")
        click(112, 2256)
        sleep(1600)
    } while(!textMatches("每日任务|做任务领水滴").exists()) 
    // text("邀请果园新用户").waitFor()

    log("开始寻找任务")
    var taskList = ['重新签到', '签到', '去浏览', '去玩转', '去参加', '去完成', '去逛逛', '领取'];
    for (let i=0; i<3; i++) {
        var taskId = ignoreId = 0;
        taskList.forEach(task => {
            log("开始做第" + (taskId + 1) + "次任务 " + "【" + task + "】");
            sleep(500)
            while (text(task).exists()) {
                log("等待 做任务领水滴|每日任务");
                textMatches("做任务领水滴|每日任务").waitFor()
                sleep(100)
                var button = text(task).findOnce(ignoreId);
                if (button == null) {
                    break;
                }       

                let bounds = button.bounds()
                if (bounds.centerY() > device.height*0.9) {
                    log("超出屏幕, 向下滚动一行")
                    swipe(500, 2000, 500, 1750, 500);
                } else {
                    switch (task) {
                        case '去浏览':
                            button.parent().click()
                            for (var i=0; i<4; i++) {
                                sleep(1000)
                                swipe(500, 2000, 500, 1800, 1000);
                                // toast("第" + i*2 + ":s")
                            }
                            text("任务完成").findOne(15000);
                            log("浏览完成啦")
                            sleep(1000);
                            back();                    
                            taskId++;
                            break;
                        case '去参加':
                        case '去逛逛':
                        case '去玩转':
                        case '去完成':
                            button.parent().click()
                            sleep(1000)
                            back();
                            taskId++;
                            break;
                        case '领取':
                        case '签到':
                        case '重新签到':
                            button.parent().click()
                            sleep(3000)
                            taskId++;
                            break;
                        default:
                            log("跳过"+(ignoreId+1)+"次【" + task + "】");
                            ignoreId++;
                            taskId++;
                            break;
                    }
                }
                sleep(1000)
            }
        })
    }
    
    do {   
        log("任务全部完成, 点击关闭")
        click(1000, 1000)
        sleep(1500)
    } while(textMatches("每日任务|做任务领水滴").exists()) 
}

// 浇水 n 次
function watering(cnt){
    cnt = cnt ? cnt : 5;
    for(var i=0; i<cnt; i++) {
        click(900, 2200);
        sleep(2500);
        log("浇水第"+(i+1)+"次");

        if (className("android.view.View").textMatches("水不够啦").exists()) {
            log("水不够啦")
            sleep(1300)
            return true;
        }
    }
}

// 3. 结束
//结束后返回主页面
function whenComplete() {
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
                //toastLog("get it 2");+
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