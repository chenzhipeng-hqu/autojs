/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

module.exports = JDongFarmer;

function JDongFarmer() {
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
// mainEntrence("双开京东");
// deleteEnv();

//程序主入口
function mainEntrence(appName) {
    //打开京东
    openJDong(appName);
    //打开东东农场
    openGrowingFruit();
    //浇水
    // watering();
    //点击签到
    clickSignin();
    //签到页面 限时关注得水滴
    FocusOnWaterDroplets()
    //领水滴
    goto_browse_task();
    // 连续点击鸭子
    clicksDuck(15);
    // 天天领红包
    get_red_paper();
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
    if (!requestScreenCapture()) {
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
function unlock() {
    if (!device.isScreenOn()) {
        //点亮屏幕
        device.wakeUp();
        sleep(1000);
        //滑动屏幕到输入密码界面 
        swipe(500, 2000, 500, 1000, 222);// 201~238可以
        sleep(800)
        //输入密码图案
        gestures([0, 800, [250, 936], [834, 936], [834, 1518]]);
    }
}


// 1. 打开京东
function openJDong(appName) {
    log("打开" + appName)
    var JDong;
    do {
        app.launch("com.jingdong.app.mall")
        // app.launchApp('京东');
        sleep(2000)
        JDong = desc(appName).findOne(5000);
        // log(JDong)
        if (JDong) {
            let bounds = JDong.bounds()
            click(bounds.centerX(), bounds.centerY())
            break;
        } else {
            toastLog("未找到京东")
        }

        if (text("免费水果").exists())
        {
            break;
        }
    } while (!JDong)

    // waitForActivity("com.jingdong.app.mall.MainFrameActivity");
    // log("京东已打开")
}

// 2. 打开东东农场
function openGrowingFruit() {
    log("打开东东农场")
    var freeFruit = text("免费水果").findOne()
    if (freeFruit) {
        freeFruit.parent().click()
    }
    // waitForActivity("com.jingdong.app.mall.WebActivity");
    // sleep(2000)

    // 有的时候是去签到, 三餐福利是去领取, 啥也没有就找再浇
    var target = textMatches("去签到|去领取|再浇.*").findOne(7000)
    if (target) {
        log("点击" + target.text())
        let bounds = target.bounds()
        click(bounds.centerX(), bounds.centerY())
        sleep(1000)
    } else {
        log("未找到 去签到|去领取|再浇")
    }
}

// 3. 点击连续签到
function clickSignin() {
    do {
        log("点击连续签到")
        click(138, 1738)
        sleep(1000)
    } while (!textMatches("关注得水滴|去看看|去领取").findOne(2000));

    log("点击签到")
    click(780, 900)
    sleep(1000)
    let target = text("明日再来").findOne(1600)
    if (target) {
        let bounds = target.bounds()
        click(bounds.centerX(), bounds.centerY())
        sleep(1000)
    }
    log("签到完成")
    // back();
}

// 4. 签到页面 限时关注得水滴
function FocusOnWaterDroplets() {
    log("寻找限时关注得水滴")
    for (let i = 0; i < 5; i++) {
        var target = text("关注得水滴").findOne(1500)
        if (target) {
            log("点击关注得水滴 " + (i + 1) + "次");
            let bounds = target.bounds()
            click(bounds.centerX(), bounds.centerY())
            sleep(5500);
            back();

            sleep(1000);
            log("点击去领取");
            target = text("去领取").findOne(3000)
            if (target) {
                let bounds = target.bounds()
                click(bounds.centerX(), bounds.centerY())
            }
        } else {
            break;
        }
    }
    back();
    log("限时关注得水滴完成")
}

// 领水滴
function goto_browse_task() {
    do {
        log("点击领水滴")
        press(300, 1738, 100);
        sleep(1000)
    } while (!className("android.view.View").textContains("领水滴").exists()) //弹出页面中间的领水滴
    // className("android.view.View").textContains("领水滴").waitFor()

    log("开始寻找任务")
    // TODO: 去完成任务需要跳过 帮2位好友浇水，下单奖励50g水滴
    // var taskList = ['签到', '去完成', '去逛逛', '去浏览', '去领取', '领取'];
    var taskList = ['签到', '去逛逛', '去浏览', '去领取', '领取'];
    var taskId = ignoreId = 0;
    var first_enter = 1;
    taskList.forEach(task => {
        className("android.view.View").textContains("领水滴").waitFor()
        while (text(task).exists()) {
            sleep(500)
            var target = text("立即领取").findOne(10);
            if (target) {
                let bounds = button.bounds()
                click(bounds.centerX(), bounds.centerY())
            }
            var button = text(task).findOnce(ignoreId);
            if (button == null) {
                break;
            }
            log("开始做第" + (taskId + 1) + "次任务 " + "【" + task + "】");
            switch (task) {
                case '去完成': {
                    let bounds = button.bounds()
                    click(bounds.centerX(), bounds.centerY())
                    sleep(5000)
                    log("点击领水滴")
                    press(300, 1738, 100);
                    sleep(500)
                    className("android.view.View").textContains("领水滴").waitFor()
                    taskId++;
                    break;
                }
                case '去逛逛': {
                    let bounds = button.bounds()
                    if (bounds.centerY() <= device.height) {
                        click(bounds.centerX(), bounds.centerY())
                        sleep(8000)
                        back();

                        var target = textMatches("残忍放弃").findOne(1000);
                        if (target) {
                            log("发现" + target.text())
                            let bounds = target.bounds()
                            click(bounds.centerX(), bounds.centerY())
                            back();
                            sleep(1000)
                        }
                    }
                    swipe(500, 2000, 500, 1750, 500);
                    // sleep(1000)
                    taskId++;
                    break;
                }
                case '领取':
                case '去领取': {
                    let bounds = button.bounds()
                    if (bounds.centerY() < device.height) {
                        click(bounds.centerX(), bounds.centerY())
                        let target = className("android.widget.Button").textMatches("收下水滴").findOne(1000)
                        if (target) {
                            target.click()
                        }
                    } else {
                        swipe(500, 2000, 500, 1800, 300);
                    }

                    if (first_enter) {
                        first_enter = 0;
                        log("向上滚动")
                        swipe(500, 1300, 500, 2290, 300);
                        swipe(500, 1300, 500, 2290, 300);
                        // let target = className("android.widget.ScrollView").findOne(1000)
                        // log(target)
                        // if (target) {
                        //     log("向上滚动")
                        //     target.scrollBackward()
                        //     target.scrollBackward()
                        // }
                    } else {
                        // swipe(500, 2000, 500, 1800, 500);
                    }
                    // sleep(1000)
                    taskId++;
                    break;
                }
                case '去签到': {
                    let bounds = button.bounds()
                    click(bounds.centerX(), bounds.centerY())
                    sleep(1000)
                    //签到按钮
                    click(538, 1638)
                    sleep(1000)
                    //开心收下
                    click(538, 1738)
                    sleep(1000)

                    log("点击赚狗粮")
                    press(133, 2261, 100);
                    sleep(500)
                    className("android.view.View").textContains("领水滴").waitFor()
                    taskId++;
                    break;
                }
                default:
                    log("跳过" + (ignoreId + 1) + "次【" + task + "】");
                    ignoreId++;
                    taskId++;
                    break;
            }
            sleep(1000)
        }
    })

    log("任务全部完成, 点击关闭")
    click(1000, 1150)
    sleep(1000)
}

// 浇水 n 次
function watering(cnt) {
    cnt = cnt ? cnt : 2;
    for (var i = 0; i < cnt; i++) {
        click(900, 1700);
        sleep(3000);
        log("浇水第" + (i + 1) + "次");
    }
}

// 连续点击鸭子
function clicksDuck(cnt) {
    log("连续点击鸭子")
    for (let i = 0; i < cnt; i++) {
        for (let j = 0; j < 8; j++) {
            press(566, 1256, 100)
            if (className("android.view.View").textMatches("我要休息啦，明天再来找我玩吧").exists()) {
                log("我要休息啦，明天再来找我玩吧")
                sleep(1300)
                return true;
            }
        }
        sleep(1000);
        log("寻找 喊它回来|收下道具卡|收下水滴")
        let target = textMatches("喊它回来|收下道具卡|收下水滴").findOne(7000)
        if (target) {
            log(target.text())
            let bounds = target.bounds()
            click(bounds.centerX(), bounds.centerY())
        } else {
            log("未找到 喊它回来|收下道具卡|收下水滴")
        }
    }
}

// 天天领红包
function get_red_paper() {
    log("点击天天领红包")
    do {
        press(980, 680, 100);
        sleep(3000)
    } while (!className("android.widget.TextView").text("天天红包").exists())
    // className("android.widget.TextView").text("天天红包").waitFor()

    var target = text("快去抽奖").findOne(1000)
    if (target) {
        let bounds = target.bounds()
        click(bounds.centerX(), bounds.centerY())
    }

    log("开始寻找任务")
    var taskList = ['去浏览', '立即领取'];
    var taskId = ignoreId = 0;
    var first_enter = 1;
    taskList.forEach(task => {
        textContains("天天红包").waitFor()
        while (text(task).exists()) {
            sleep(1000)
            var button = text(task).findOnce(ignoreId);
            if (button == null) {
                break;
            }
            log("开始做第" + (taskId + 1) + "次任务 " + "【" + task + "】");
            switch (task) {
                case '去浏览': {
                    let bounds = button.bounds()
                    if (bounds.centerY() <= device.height) {
                        click(bounds.centerX(), bounds.centerY())
                        sleep(5000)
                        back();
                        sleep(1000)
                    }
                    swipe(500, 2000, 500, 1750, 500);
                    sleep(500)
                    taskId++;
                    break;
                }
                case '立即领取': {
                    let bounds = button.bounds()
                    if (bounds.centerY() < device.height) {
                        click(bounds.centerX(), bounds.centerY())
                    } else {
                        swipe(500, 2000, 500, 1800, 500);
                    }
                    sleep(500)
                    taskId++;
                    break;
                }
                default:
                    log("跳过" + (ignoreId + 1) + "次【" + task + "】");
                    ignoreId++;
                    taskId++;
                    break;
            }
            // sleep(500)
        }
    })

    log("任务全部浏览完成, 去抽奖")
    swipe(500, 360, 500, 2100, 1000);

    //抽奖
    while (1) {
        var target = textMatches("还剩\\d{1,2}次机会").findOne(2000)
        if (target) {
            let cnt = target.text().match("\\d{1,2}")
            if (cnt > 0) {
                let bounds = target.bounds()
                click(bounds.centerX(), bounds.centerY() - 100)
                sleep(3000);
                var target = textMatches("继续抽奖").findOne(5000)
                if (target) {
                    let bounds = target.bounds()
                    click(bounds.centerX(), bounds.centerY())
                    sleep(500)
                }
            } else {
                log("抽奖完成")
                break;
            }
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

// 9. 锁屏
