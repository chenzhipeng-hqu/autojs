

auto()

// var common = require('common.js');
// console.log("随机数 %d", common.random(2, 5));

// log(currentPackage())
// log(currentActivity())
// app.startActivity({
//     action: "VIEW",
//     data: "alipays://platformapi/startapp?appId=60000002"
// });

// console.show()
console.info("start")

// 芭芭农场田地 浏览任务
function baba_Farmer() {
    className("android.view.View").text("去浏览").findOne().click()
    for (var i=0; i<8; i++) {
        swipe(500, 2000, 500, 1800, 1000);
        sleep(1000)
    }
    back()
}

// baba_Farmer()

// 芭芭农场芒果 浏览任务
// var tmp = className("android.widgetimage").text("集肥料").findOne()
// log(tmp)

// 找到 去完成/去浏览/去领取 任务
// className("android.widget.ListView").findOne().children()
//     .forEach(child =>
//     {
//         var target = child.findOne(className("android.widget.Button").textContains("已完成"))
//         // var button = child.findOne(className("android.widget.Button"))
//         // var target = button.text("已完成")
//         log(target)
//         if (target != null) {
//             // target.click()

//             // for (var i=0; i<20; i++) {
//             //     // swipe(500, 2000, 500, 1800, 1000);
//             //     sleep(1)
//             //     log(i)
//             // }
//             // sleep(15)
//             // back()
//         }
//     })

// var tmp = className("android.widget.Button").textContains("已完成").findOnce()
// log(tmp) 
// for (var i=0; i<3; i++) {
//     swipe(500, 2000, 500, 1800, 1000);
//     sleep(1000)
//     log(i)
// }

// goto_browse_task()

function goto_browse_task() {
    var taskList = ['去完成', '去浏览', '去领取', '签到'];
    taskList.forEach(task => {
        var taskId = ignoreId = 0;
        while (className("android.widget.Button").textContains(task).exists()) {
            var button = text(task).findOnce(ignoreId);
            if (button == null) {
                break;
            }
            log("开始做第" + (taskId + 1) + "次任务 " + "【" + task + "】");
            switch (task) {
                case '去完成':
                case '去浏览':
                    button.click()
                    for (var i=0; i<8; i++) {
                        swipe(500, 2000, 500, 1800, 1000);
                        sleep(1000)
                    }
                    back();
                    break;
                case '去领取':
                    button.click()
                    i++;
                    break;
                default:
                    log("跳过"+(ignoreId+1)+"次【" + task + "】");
                    ignoreId++;
                    taskId++;
                    break;
                }
        }
    })
}


// var tmp = className("android.view.View").textContains("找能量").find()
// if (tmp.empty()) {
//     toastLog("进入好友能量主页");
//     log(tmp)
//     for(i in tmp) {
//         log(i)
//     }
// } else {      
//     toastLog("进入好友能量主页失败");
// }

// var target = textContains("全部宝贝").findOne(1000)
// log(target)
// if (target) {
//     // target.click()
// }

// var target = descContains("关注店铺").findOne(1)
// if (target) {
//     var bounds = target.bounds()
//     click(bounds.centerX(), bounds.centerY()+100)
//     toastLog("找到阳光宝箱")
// }

// var tmp = className("android.view.View").descMatches("\\d{1,}").findOne(1000)
// log(tmp) 

// var target = className("android.view.View").descMatches("\\d{1,}").findOne(1000)
// log(target) 

// find_treasure_box()

function find_treasure_box() {
    for (var i=0; i<10; i++) {
        // if (1) {
        sleep(1000)
        var target = className("android.view.View").text("去进店").findOne(5)
        if (target) {
            target.click()
            // sleep(3000)
            textContains("宝贝").waitFor();
            toastLog("寻找阳光宝箱")
            for (var j=0; j<36; j++) {
                var target = desc("立即打开").findOne(1)
                if (target) {
                    target.parent().click()
                    toastLog("找到立即打开阳光宝箱 desc")
                    var target = className("android.view.View").descMatches("\\d{1,}").findOne(1000);
                    if (target) {
                        toastLog("找到 "+target.desc()+" 阳光")
                    }
                    sleep(1000)
                    // back();
                    break;
                }
        
                var target = text("立即打开").findOne(1)
                if (target) {
                    target.parent().click()
                    toastLog("找到立即打开阳光宝箱 text")
                    var target = className("android.view.View").descMatches("\\d{1,}").findOne(1000);
                    if (target) {
                        toastLog("找到 "+target.desc()+" 阳光")
                    }
                    sleep(1000)
                    // back();
                    break;
                }
                      
                var target = descContains("关注店铺").findOne(1)
                if (target) {
                    var bounds = target.bounds()
                    click(bounds.centerX(), bounds.centerY()+100)
                    toastLog("找到关注店铺阳光宝箱 desc")
                    var target = className("android.view.View").descMatches("\\d{1,}").findOne(1000);
                    if (target) {
                        toastLog("找到 "+target.desc()+" 阳光")
                    }
                    sleep(1000)
                    // back();
                    break;
                }
        
                var target = textContains("关注店铺").findOne(1)
                if (target) {
                    var bounds = target.bounds()
                    click(bounds.centerX(), bounds.centerY()+100)
                    toastLog("找到关注店铺阳光宝箱 text")
                    var target = className("android.view.View").descMatches("\\d{1,}").findOne(1000);
                    if (target) {
                        toastLog("找到 "+target.desc()+" 阳光")
                    }
                    sleep(1000)
                    // back();
                    break;
                } else {
                    swipe(500, 2200, 500, 0, 500);
                    toastLog("滑动第"+j+"次")
                    sleep(800)
                }
            }
        }
    }
    // 点击关闭领阳光
    log("点击关闭领阳光")
    click(1000, 1360)
    sleep(1000)
}



// if(!device.isScreenOn()){
//     //点亮屏幕
//     device.wakeUp();
//     sleep(1000);
//     //滑动屏幕到输入密码界面 
//     swipe(500,2000,500,1000,222);// 201~238可以
//     sleep(800)
//     //输入密码图案
//     gestures([0, 800, [250, 936], [834, 936], [834, 1518]]);
// }

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

// var target = clickByTextDesc("支付宝会员")
// if (target) {
//     log(target)
// }

function unlock() {
    let errorMessage = msg => {
        console.error(msg);
        device.isScreenOn() && KeyCode("KEYCODE_POWER"); //判断是否锁屏
        exit();
    }
    
    let max_try_times_wake_up = 10; //尝试解锁10次
    
    while (!device.isScreenOn() && max_try_times_wake_up--) {
        device.wakeUp();
        sleep(500);
    }
    
    if (max_try_times_wake_up < 0) 
        errorMessage("点亮屏幕失败"); //尝试次数max，显示失败文本
    
    let keyguard_manager = context.getSystemService(context.KEYGUARD_SERVICE);
    
    let isUnlocked = () => !keyguard_manager.isKeyguardLocked();
    
    let swipe_time = 0;
    
    let swipe_time_increment = 80;
    
    let max_try_times_swipe = 20; //初始化时间，递增时间，最大解锁时间
    
    while (!isUnlocked() && max_try_times_swipe--) {
        swipe_time += swipe_time_increment;
        gesture(swipe_time, [540, device.height * 0.9], [540, device.height * 0.1]); //模拟手势
        sleep(1200);
    } //循环函数
    
    if (max_try_times_swipe < 0) 
        errorMessage("上滑屏幕失败"); //尝试失败，重新设置一下参数
    
    log("解锁成功");
    
    log("尝试得到最佳滑动时间: " + swipe_time + "(毫秒)") //可到日志中查看最佳滑动时间
}

// var str1 = "我的肥料"
// var str1 = "施肥"
// var str1 = "设置"
// var str1 = "芭芭农场"
// var str1 = "天猫农场-福年种福果"
// var str1 = "gif;base64,iVBoRw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErKJggg=="
// var str1 = "gif;base64,iVB"

// text("天猫农场-福年种福果").waitFor()
// var target = className("android.widget.Image").depth(16).textContains(str1).findOnce(4)
// if (target) {
//     log(target)
// }

// var target = descContains(str1).findOne(1000)
// if (target) {
//     log(target)
// }

// clickMango()

// 6. 点击种芒果
function clickMango() {
    log("点击种芒果")
    click(150, 750)
    log("等待天猫农场-福年种福果")
    className("android.widget.Image").depth(16).textContains("gif;base64,iVB").waitFor()
    log("找到天猫农场-福年种福果")
    sleep(1000)
    //点击领取昨日肥料
    log("点击领取昨日肥料")
    click(777, 1280)
    sleep(500)
    var target = textContains("去施肥，赚更多肥料").findOne(1000)
    if (target) {
        target.click()
    }
}

// var target = textContains("领积分").findOne(1000)
// if (target) {
//     log(target)
//     target.click();
// }

// get_alipay_vip_points();

function get_alipay_vip_points(){
    toastLog("领取蚂蚁会员积分");
    // clickByTextDesc("我的",0);
    sleep(1000);
    text("我的").findOne(3000).parent().click();
    sleep(1500);
    // clickByTextDesc("支付宝会员",0);
    click(690, 550);
    // sleep(3000);
    // clickByTextDesc("领积分",0);
    textContains("领积分").findOne(3000).click();
    // sleep(1000);
    var i=0;
    for(i=0; i<10;i++){
        clickByTextDesc("点击领取",0);
        sleep(100);
    }
}

// let items = ["《焚书》","《西湖寻梦》","《高太史全集》"];
// let i = dialogs.multiChoice("下列作品...", items);
// let result = i.map(idx => items[idx]);
// toastLog(result);

// i.forEach(option => {
//     var ret = 0;
//     toastLog("执行【"+ items[option] +"】任务")
//     log(option.toString())
//     switch (items[option]) {
//         case "《焚书》": {
//             log("1")
//             break;
//         }
//         case "《西湖寻梦》": {
//             log("2")
//             break;
//         }
//         case "《高太史全集》": {
//             log("3")
//             break;
//         }
//         default:{
//             toastLog("【"+ items[option] +"】待开发，敬请等候")
//             break;
//         }
//     }
//     toastLog("【"+ items[option] +"】结束")
// })


// log("finding");
// // textContains("全部都完成").waitFor()
// textMatches("浏览完成.*|全部都完成.*").findOne(20000)
// log("find it");

// var target = textContains("关闭").findOne(1000)
// log(target)
// if (target) {
//     // target.click()
// }
// var target = descContains("关闭").findOne(1000) //支付宝芭芭农场页面
// log(target)
// if (target) {
//     // target.click()
// }

// var target = textContains("后开始任务").findOne(1000) //支付宝芭芭农场页面
// log(target)
// if (target) {
//     // target.click()
// }

// js递归遍历数组获取所有的叶子节点
function queryList(json,arr) {
    for (var i = 0; i < json.childCount(); i++) {
        var sonList = json.child(i);
        if (sonList.childCount() == 0) {
            arr.push(json.child(i));
        } else {
            queryList(sonList, arr);
        }
    }
    return arr;
}

function queryAllList() {
    var list = className("FrameLayout").findOne();
    var arr=[];
    queryList(list,arr);
    
    for(var k=0;k<arr.length;k++){
        log("第"+k+"个子控件\n"
            +"desc="+arr[k].desc()+"\n"
            +"text="+arr[k].text()+"\n" 
            +"ID="+arr[k].id()+"\n"
            +"classname="+arr[k].className()+"\n"
            +"bounds="+arr[k].bounds()+"\n");
        }
}

// queryAllList();

// var target = textContains("0元领水果").findOne(1000) //支付宝芭芭农场页面
// log(target)
// if (target) {
//     target.parent().click()
// }

// var target = textContains("今日剩余").findOnce(2) //支付宝芭芭农场页面
// log(target)
// if (target) {
//     log(target.text())
//     var str = target.text().match("10|[0-9]")
//     log(str)
//     log(eval(str[0])+1)
// }

str = "12，今日剩余0次".match("10|[0-9]")
log(str[0])

log(eval(str[0])+1)




console.info("end")
exit()