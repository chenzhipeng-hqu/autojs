/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

module.exports = BabaFarmer;

function BabaFarmer() {
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
    //打开芭芭农场
    openBabaFarmer();
    //领取阳光
    clickGetSunny();
    //浏览领取阳光
    baba_Farmer();
    //开宝箱
    find_treasure_box();
    //种芒果
    clickMango();
    // 观看直播
    watch_live();
    //浏览任务
    for(var i=0; i<5; i++) {
        goto_browse_task();
        sleep(1000)
    }
    // 结束
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
    toastLog("打开淘宝")
    app.launch("com.taobao.taobao")
    waitForActivity("com.taobao.tao.TBMainActivity");
}

// 2. 打开芭芭农场
function openBabaFarmer(){
    log("打开芭芭农场")
    var babaFarmer = desc("芭芭农场").findOne()
    if (babaFarmer) {
        babaFarmer.click()
    } else {
        toastLog("未找到芭芭农场")
    }
    waitForActivity("com.taobao.browser.BrowserActivity");
    sleep(3000)

    var target = text("立即去收").findOne(3000)
    if (target) {     
        log("点击立即去收")
        target.click()
        sleep(1000)
    }
}

// 3. 点击领阳光
function clickGetSunny() {
    log("点击领阳光")
    click(980, 1750)
    sleep(1500)
    // back();
}

// 4. 浏览领阳光
function baba_Farmer() {
    // sleep(1000)
    log("浏览领阳光")
    var target = className("android.view.View").text("去浏览").findOne(3000)
    if (target != null) {
        // if (text("10, 今日剩余0次").exists()) { //判断是否有浏览任务

        // } else 
        if (text("后开始任务").exists()) {
            log("浏览倒计时中")
        } else {
            log("点击去浏览")
            target.click()
            for (var i=0; i<5; i++) {
                swipe(500, 2000, 500, 1800, 1000);
                sleep(1000)
                // toast("第" + i*2 + ":s")
            }
            target = textMatches("浏览完成.*|全部完成啦.*").findOne(20000);
            if (target) {
                log("浏览完成")
            } else {
                toastLog("浏览超时")
            }
            sleep(500);
            back()        
        }
    } else {
        log("浏览都完成啦")
    }
    sleep(800)
}

// 4. 开宝箱
function find_treasure_box() {
    log("开宝箱")
    for (var i=0; i<13; i++) {
        // if (1) {
        sleep(1000)
        var target = className("android.view.View").text("去进店").findOne(1500)
        if (target) {
            target.click()
            sleep(5000)
            // textContains("宝贝").waitFor();
            log("第"+(i+1)+"次寻找阳光宝箱")
            for (var j=0; j<36; j++) {          
                sleep(1000)
                var target = desc("立即打开").findOne(10)
                if (target) {
                    toastLog("找到立即打开阳光宝箱 desc")
                    var bounds = target.bounds()   
                    log("X:" + bounds.centerX() + " Y:" + bounds.centerY())       
                    if (bounds.centerY() < device.height*0.95) {
                        click(bounds.centerX(), bounds.centerY()) 
                        var target = boundsInside(bounds.centerX(), bounds.centerY()-200, 
                                                    bounds.centerX()+400, bounds.centerY())
                                                        .descMatches("\\d{1,}").findOne(1000);
                        if (target) {
                            toastLog("找到 "+target.desc()+" 阳光")
                            sleep(1000)
                            back();
                            break;
                        } else {
                            toastLog("未打开宝箱")
                        }
                    } else {
                        // swipe(500, 500, 500, 1000, 500);                
                        swipe(500, 2000, 500, 1000, 500);
                        log("宝箱坐标超出屏幕尺寸")
                        continue;
                    }
                }
        
                var target = text("立即打开").findOne(10)
                if (target) {
                    toastLog("找到立即打开阳光宝箱 text")
                    var bounds = target.bounds()      
                    log("X:" + bounds.centerX() + " Y:" + bounds.centerY())      
                    if (bounds.centerY() <= device.height*0.98) {
                        click(bounds.centerX(), bounds.centerY())
                        // var target = boundsInside(bounds.centerX(), bounds.centerY()-200, 
                        //                             bounds.centerX()+400, bounds.centerY())
                        //                                 .descMatches("\\d{1,}|已获得\\d{1,}阳光.*").findOne(1000);
                        var target = boundsInside(bounds.centerX()-500, bounds.centerY()-250, 
                                                    bounds.centerX()+500, bounds.centerY()+50)
                                                        .textMatches("\\d{1,}|已获得\\d{1,}阳光.*").findOne(1000);
                        if (target) {
                            toastLog("找到 "+target.text()+" 阳光")
                            sleep(1000)
                            back();
                            break;
                        } else {
                            toastLog("未打开宝箱")
                        }
                    } else {
                        // swipe(500, 500, 500, 1000, 500);                
                        swipe(500, 2000, 500, 1000, 500);
                        log("宝箱坐标超出屏幕尺寸")
                        continue;
                    }
                }
                      
                var target = descContains("关注店铺").findOne(10)
                if (target) {
                    toastLog("找到关注店铺阳光宝箱 desc")
                    var bounds = target.bounds()
                    log("X:" + bounds.centerX() + " Y:" + bounds.centerY())
                    if (bounds.centerY() <= device.height*0.95) {
                        click(bounds.centerX(), bounds.centerY()+100)
                        var target = boundsInside(bounds.centerX()-400, bounds.centerY()-150, 
                                                    bounds.centerX()+400, bounds.centerY()+150)
                                                        .descMatches("\\d{1,}|.*成功获得.*|已关注").findOne(1000);
                        if (target) {
                            toastLog("找到 "+target.desc()+" 阳光")
                            sleep(1000)
                            back();
                            break;
                        } else {
                            toastLog("未打开宝箱")
                        }
                    } else {
                        // swipe(500, 500, 500, 1000, 500);                
                        swipe(500, 2000, 500, 1000, 500);
                        log("宝箱坐标超出屏幕尺寸")
                        continue;
                    }
                }
        
                var target = textContains("关注店铺").findOne(10)
                if (target) {
                    toastLog("找到关注店铺阳光宝箱 text")
                    var bounds = target.bounds()
                    log("X:" + bounds.centerX() + " Y:" + bounds.centerY())
                    if (bounds.centerY() <= device.height*0.95) {
                        click(bounds.centerX(), bounds.centerY()+100)
                        var target = boundsInside(bounds.centerX()-400, bounds.centerY()-150, 
                                                    bounds.centerX()+400, bounds.centerY()+150)
                                                        .textMatches("\\d{1,}|.*成功获得.*|已关注").findOne(1000);
                        if (target) {
                            toastLog("找到 "+target.text()+" 阳光")
                            sleep(1000)
                            back();
                            break;
                        } else {
                            toastLog("未打开宝箱")
                        }
                    } else {
                        // swipe(500, 500, 500, 1000, 500);                
                        swipe(500, 2000, 500, 1000, 500);
                        log("宝箱坐标超出屏幕尺寸")
                        continue;
                    }
                } else {
                    swipe(500, 2000, 500, 500, 500);
                    log("滑动第"+j+"次")
                    sleep(500)
                }
            }
            if (j >= 35) {
                back();
            }
            sleep(600)
        } else {
            log("宝箱都开完啦")
            break;
        }
    }

    // 点击关闭领阳光
    log("点击关闭领阳光")
    click(1000, 1360)
    sleep(1000)

    var target = text("立即去收").findOne(1000)
    if (target) {     
        log("点击立即去收")
        target.click()
        sleep(1000)
    }

    log("点击收田")          
    //自己手机 田的位置, 需自己适配 x 坐标 /Y 坐标 依次排列
    var fieldPoint = [548,1506, 353,1386, 556,1280, 360,1168, 758,1170, 560,1046, 346,936, 763,946, 566,826]
    for (var i = 0; i < fieldPoint.length; i += 2){
        click(fieldPoint[i], fieldPoint[i+1])
    }

    sleep(3000)

}

// 点击收田
function collect_sunny() {
    log("点击立即领取升级阳光")
    click(556, 1673);
    sleep(2500)
    
    log("点击收阳光")          
    //自己手机 阳光的位置, 需自己适配 x 坐标 /Y 坐标 依次排列
    var sunnyPoint = [180,910, 360,790, 416,1000, 728,1000, 570,860, 580,678, 786,776, 970,930]
    for (var i = 0; i < sunnyPoint.length; i += 2){
        click(sunnyPoint[i], sunnyPoint[i+1])
    }
    sleep(2000)
}

// 5. 根据亲密度领肥料
function collect_by_intimacy() {
    var target = text("立即领取").findOne(1000)
    if (target) {
        log("点击 " + target.text())
        target.click();
        sleep(1000)
    }

    targets = text("肥料礼包").find()
    if (!targets.empty()) {
        for (let i=0; i<targets.length; i++) {
            sleep(1000)
            log(targets[i].text())
            if (targets[i]) {
                let bounds = targets[i].bounds();
                click(bounds.centerX(), bounds.centerY()+13)
                sleep(1000)
                
                target = textMatches("已领取|小队亲密值达.*").findOne(800)
                if (target) {
                    log(target.text())
                    press(543, 1922, 100);
                }     

                target = textMatches("开心收下").findOne(100)
                if (target) {
                    log(target.text())
                    let bounds =target.bounds();
                    click(bounds.centerX(), bounds.centerY()+13)
                }          
            } else {
                toastLog("领取肥料礼包出错")
            }
            sleep(1000)
        }
        //点击关闭
        log("点击关闭")
        press(1000, 500, 100);
        sleep(1000)  
    }
}

// 6. 点击种芒果
function clickMango() {
    do {
        collect_sunny();

        log("点击种芒果")
        click(150, 740)
        click(150, 760)
        log("等待天猫农场-福年种福果")
        // className("android.widget.Image").depth(16).textContains("gif;base64,iVB").waitFor()
        // sleep(2000)
        // 点击继续努力
        var target = textContains("继续努力").findOne(2000)
        if (target) {
            log(target.text())
            target.click()
            sleep(700)
        }
        sleep(2000)
    // }while(!className("android.widget.Image").textContains("gif;base64,iVB").exists())
    }while(!textMatches("亲密度|立即领取").exists())
    // className("android.widget.Image").textContains("gif;base64,iVB").waitFor()
    log("找到天猫农场-福年种福果")
    sleep(1000)

    collect_by_intimacy();

    //点击领取昨日肥料
    log("点击领取昨日肥料")
    click(777, 1280)
    sleep(700)
    var target = textContains("去施肥，赚更多肥料").findOne(1000)
    if (target) {
        target.click()
        sleep(700)
    }
}

// 观看直播
function watch_live() {
    let target = textContains("观看直播").findOne(1000)
    if (target) {
        log("点击观看直播")
        let bounds = target.bounds()
        click(bounds.centerX(), bounds.centerY()-100)

        for (var i=0; i<4; i++) {
            swipe(500, 2000, 500, 1800, 1000);
            sleep(1000)
            // toast("第" + i*2 + ":s")
        }

        let browse_cnt = 0;
        while (browse_cnt < 18) {
            let target1 = textMatches("浏览完成.*|全部完成啦.*|任务已完成.*|任务完成.*").findOne(500);
            if (target1) {
                log("text: "+target1.text())
                break;
            }
            let target2 = descMatches("浏览完成.*|全部完成啦.*|任务已完成.*|任务完成.*").findOne(500);
            if (target2) {
                log("desc: "+target2.desc())
                break;
            }
            browse_cnt++;
        }
        if (browse_cnt < 18) {
            // log("浏览完成啦")
        } else {
            log("浏览超时返回啦")
        }
        sleep(1000);
        back();
        sleep(1300);
    }
}

// 7. 集肥料
function goto_browse_task() {
    // var tmp = className("android.widgetimage").text("集肥料").findOne(3)
    // log(tmp)
    log("点击集肥料")
    click(980, 1726)
    click(980, 1760)
    sleep(1800)

    log("开始寻找任务")
    var taskList = ['去浏览', '去领取', '领取', '去签到', '去完成', '去逛逛'];
    var taskId = ignoreId = 0;
    taskList.forEach(task => {
        ignoreId = 0;
        while (text(task).exists()) {
            var button = text(task).findOnce(ignoreId);
            if (button == null) {
                break;
            }
            log("开始做第" + (taskId + 1) + "次任务 " + "【" + task + "】");
            var bounds = button.bounds()
            log("X:" + bounds.centerX() + " Y:" + bounds.centerY())  
            switch (task) {
                case '去完成':
                case '去浏览':
                case '去逛逛':
                    // if (textContains("逛逛支付宝芭芭农场").exists()) {
                    //     log("跳过支付宝芭芭农场任务");
                    //     ignoreId++;
                    //     taskId++;
                    //     break;
                    // }               
                    var target3 = boundsInside(0, bounds.centerY()-100, 
                                    bounds.centerX(), bounds.centerY()+100)
                                        .textMatches("抽心愿礼盒得300肥料").findOne(10);
                    var target4 = boundsInside(0, bounds.centerY()-100, 
                                    bounds.centerX(), bounds.centerY()+100)
                                        .textMatches("下单.*").findOne(10);
                    if (target4) {
                        log("找到: " +target4.text())
                        log("跳过"+(ignoreId+1)+"次【" + task + "】");
                        ignoreId++;
                        taskId++;
                        break;
                    }
                    button.click()
                    for (var i=0; i<4; i++) {
                        swipe(500, 2000, 500, 1900, 1000);
                        sleep(1000)
                        // toast("第" + i*2 + ":s")
                    }
                    var target = textContains("继续赚肥料").findOne(1000)
                    var target2 = desc("关闭").findOne(1000) //支付宝的芭芭农场右上角有个关闭
                    if (target) { //说明进入了支付宝的芭芭农场
                        log("进入支付宝芭芭农场1")
                        target.click()
                        back();
                        // ignoreId++;
                        alipay_browse_task();
                        var target = textContains("继续赚肥料").findOne(1000)
                        if (target) {
                            target.click()
                        }
                    } else if (target2) { //说明进入了支付宝的芭芭农场
                        log("进入支付宝芭芭农场2")
                        // ignoreId++;
                        alipay_browse_task();                    
                        var target = textContains("继续赚肥料").findOne(1000)
                        if (target) {
                            target.click()
                        }
                    } else if (target3) { // 去淘宝人生拿套装(0/1)
                        sleep(1000)
                        log("点击免费抽一次心愿礼盒")
                        click(555, 2290)   // 免费抽一次心愿礼盒
                        sleep(1500)
                        log("点击跳过")
                        click(560, 1683)   // 跳过
                        sleep(1500)
                        log("点击确定")
                        click(560, 1511)   // 确定
                        sleep(1500)
                        back();
                        sleep(1500);    
                        log("点击回到淘宝")
                        click(566, 1436)   // 回到淘宝
                    } else {
                        let browse_cnt = 0;
                        while (browse_cnt < 25) {
                            // 签到领取双倍淘金币
                            var target = textMatches("签到领金币.*|签到领取.*").findOne(50)
                            if (target) {
                                log(target.text())
                                target.click()
                                
                                target = text("我知道了").findOne(1000)
                                if (target) {
                                    log("点击 " + target.text())
                                    target.click()
                                }

                                target = text("领取奖励").findOne(1000)
                                if (target) {
                                    log("点击 领取奖励")
                                    target.click()
                                }
                                
                                target = text("关闭").findOne(1000)
                                if (target) {
                                    log("点击 关闭 互动赚更多")
                                    target.click()
                                }
                            }

                            let target1 = textMatches("浏览完成.*|.*全部完成啦.*|任务已完成.*|任务完成.*").findOne(500);
                            if (target1) {
                                log("text: "+target1.text())
                                break;
                            }
                            let target2 = descMatches("浏览完成.*|.*全部完成啦.*|任务已完成.*|任务完成.*").findOne(500);
                            if (target2) {
                                log("desc: "+target2.desc())
                                break;
                            }
                            browse_cnt++;
                        }
                        if (browse_cnt < 35) {
                            // log("浏览完成啦")
                        } else {
                            log("浏览超时返回啦")
                        }
                        sleep(200);
                        back();
                        sleep(500);

                        let target1 = textMatches("浏览完成.*|.*全部完成啦.*|任务已完成.*|任务完成.*").findOne(500);
                        if (target1) {
                            log("text: "+target1.text())
                            back();
                        }
                        let target2 = descMatches("浏览完成.*|.*全部完成啦.*|任务已完成.*|任务完成.*").findOne(500);
                        if (target2) {
                            log("desc: "+target2.desc())
                            back();
                        }
                    }
                    
                    taskId++;
                    break;
                case '去签到':
                case '去领取':
                case '领取':
                    button.click()
                    taskId++;
                    break;
                default:
                    log("跳过"+(ignoreId+1)+"次【" + task + "】");
                    ignoreId++;
                    taskId++;
                    break;
                }
            sleep(1600)
        }
    })
    
    var target = className("android.widget.Button").textContains("关闭").findOne()
    // log(target)
    if (target != null) {
        log("点击关闭")
        target.click()
        sleep(1000)
    }
}

// 支付宝芭芭农场浏览任务
function alipay_browse_task() {
    // back();
    
    log("点击支付宝集肥料")
    click(980, 2088)
    sleep(1000)

    log("开始寻找任务")
    var taskList = ['去签到', '领取', '去逛逛'];
    var taskId = ignoreId = 0;
    taskList.forEach(task => {
        while (text(task).exists()) {
            var button = text(task).findOnce(ignoreId);
            if (button == null) {
                break;
            }
            log("开始做第" + (taskId + 1) + "次任务 " + "【" + task + "】");
            switch (task) {
                case '去逛逛':
                    button.click()      
                    var target = textContains("你将要登录的账号和手机淘宝当前已登录账号不一致，是否需要切换？").findOne(3000)
                    if (target) {
                        click("确定")
                        break;
                    }
                    taskId++;
                    break;
                case '去签到':
                case '去领取':
                case '领取':
                    button.click()
                    taskId++;
                    break;
                default:
                    log("跳过"+(ignoreId+1)+"次【" + task + "】");
                    ignoreId++;
                    taskId++;
                    break;
                }
            sleep(1000)
        }
    })
    log("完成支付宝集肥料")
}

//结束后返回主页面
function whenComplete() {
    back();
    sleep(500);
    back();
    sleep(500);
}

// 9. 锁屏
