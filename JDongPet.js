/**
 * 作者: chenzhipeng
 * 时间：2020-11-05 01:43:45
 */

module.exports = JDongPet;

function JDongPet() {
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
function mainEntrence(appName){
    //打开京东
    openJDong(appName);

    //打开东东萌宠
    openJDongPet();

    // //浏览任务
    goto_browse_task();

    // //浇水次数
    // watering(10);
    
    // //结束回到主页
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

// 打开京东
function openJDong(appName){
    log("打开" + appName)
    var JDong;
    do {
        // app.launch("com.jingdong.app.mall")
        app.launchApp('京东');
        sleep(2000)
        JDong = desc(appName).findOne(1000);
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
            toastLog("找到京东主页")
            break;
        }
    } while (!JDong)

    sleep(1666)
}

// 打开东东萌宠
function openJDongPet(){ 
    // var target = className("android.widget.TextView").descContains("搜索框").findOne(1000)
    // if (target) {
    //     target.click();
    //     target = className("android.widget.EditText").descContains("搜索框").findOne(1000)
    //     target.setText("东东萌宠")
    //     target = className("android.widget.TextView").text("搜索").findOne(1000)
    //     if(target) {
    //         target.click();
    //     }
    // }
    className("android.widget.TextView").descContains("搜索框").waitFor()
    // swipe(900, 1000, 100, 1000, 2020);
    // sleep(1500)
    // swipe(900, 1000, 100, 1000, 2020);
    // sleep(1500)

    do {
        log("点击我的")
        var target = text("我的").findOne(1000)
        if (target) {
            let bounds = target.bounds()
            click(bounds.centerX(), bounds.centerY())
            sleep(1000)
        }

        log("点击东东萌宠")
        var JDongPet = text("东东萌宠").findOne()
        if (JDongPet) {
            let bounds = JDongPet.bounds()
            click(bounds.centerX(), bounds.centerY())
            sleep(500)
        }

    } while(!className("android.widget.TextView").textContains("与爱宠相识").exists());

    
    log("等待与爱宠相识")
    // className("android.widget.TextView").text("东东萌宠").waitFor()
    className("android.widget.TextView").textContains("与爱宠相识").waitFor()
    sleep(500)
    //开心收下
    press(536, 1700, 100);
    sleep(1500)

    return true;
}

// 做任务 赚狗粮
function goto_browse_task() {
    do {
        log("点击赚狗粮")
        press(133, 2261, 100);
        sleep(1000)
    }while(!className("android.widget.TextView").textContains("做任务赚狗粮").exists())
    // className("android.widget.TextView").textContains("做任务赚狗粮").waitFor()

    log("开始寻找任务")
    var taskList = ['去签到', '去完成', '去开启', '去浏览', '去领取'];
    var taskId = ignoreId = 0;
    var first_enter = 1;
    taskList.forEach(task => {
        className("android.widget.TextView").textContains("做任务赚狗粮").waitFor()
        while (text(task).exists()) {
            sleep(500)
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
                        sleep(1500)
                        back();     
                        sleep(1000)   
                    }
                    swipe(500, 2000, 500, 1700, 500);
                    taskId++;
                    break;
                }
                case '去领取': {
                    let bounds = button.bounds()
                    if ((bounds.centerY() < device.height) && (bounds.centerY() > device.height/2)) {
                        click(bounds.centerX(), bounds.centerY())  
                    }
                    if (first_enter) {
                        first_enter = 0;
                        log("向上滚动")
                        sleep(500)
                        swipe(500, 1450, 500, 2250, 300);
                        swipe(500, 1450, 500, 2250, 300);
                        // let target = className("android.widget.ScrollView").depth(1).findOne(1000)
                        // if (target) {
                        //     target.scrollBackward()
                        //     target.scrollBackward()
                        // }
                    } else {
                        // swipe(500, 2000, 500, 1800, 500);
                    }
                    taskId++;
                    break;
                }
                case '去开启':{
                    let bounds = button.bounds()
                    click(bounds.centerX(), bounds.centerY())
                    sleep(3000)
                    do {
                        log("点击开心收下")
                        click(538, 1600)
                        sleep(1500)
                        log("点击赚狗粮")
                        press(133, 2261, 100);
                        sleep(1000)
                    }while(!className("android.widget.TextView").textContains("做任务赚狗粮").exists())
                    // className("android.widget.TextView").textContains("做任务赚狗粮").waitFor()

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
                    click(538, 1600) //普通签到
                    click(538, 1738) //双倍签到
                    sleep(1000)

                    log("点击赚狗粮")
                    press(133, 2261, 100);
                    sleep(500)
                    className("android.widget.TextView").textContains("做任务赚狗粮").waitFor()
                    taskId++;
                    break;
                }
                case '去完成': {
                    let bounds = button.bounds()
                    click(bounds.centerX(), bounds.centerY())
                    sleep(5000)
                    
                    log("点击收爱心")          
                    //自己手机 爱心的位置, 需自己适配 x 坐标 /Y 坐标 依次排列
                    var heartPoint = [124,1800, 136,1235, 443,880, 850,1060, 877,1388]  
                    for (var i = 0; i < heartPoint.length; i += 2){
                        click(heartPoint[i], heartPoint[i+1])
                    }
                    sleep(500)

                    log("点击赚狗粮")
                    press(133, 2261, 100);
                    sleep(500)
                    className("android.widget.TextView").textContains("做任务赚狗粮").waitFor()
                    taskId++;
                    break;
                }
                default:
                    log("跳过"+(ignoreId+1)+"次【" + task + "】");
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