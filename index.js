let SunCalc = require('./suncalc');
let moment = require("moment")
let timeMap = (info) => {
    if (Array.isArray(info)) {
        info = info.map(v => ({date: moment(v).format("YYYY-MM-DD HH:mm:ss"), unix: moment(v).valueOf()}))
    } else {
        for (let key in info) {
            let time = moment(info[key])
            info[key] = {date: time.format("YYYY-MM-DD HH:mm:ss"), unix: time.valueOf()}
        }
    }
    return info
}

// 交集
let isIntersect = (arr1, arr2) => {
    let start = [Math.min(...arr1), Math.min(...arr2)];//区间的两个最小值
    let end = [Math.max(...arr1), Math.max(...arr2)];//区间的两个最大值
    return {isShow: Math.max(...start) <= Math.min(...end), time: [Math.max(...start), Math.min(...end)]};//最大值里的最小值 是否 小于等于 最大值的最小值
}


// 目的地经纬度坐标度数
let lat = 36.79801395790244, lng = 118.06406021118165
let now = "2024-10-24", now1 = "2024-10-25";
var allTime = timeMap(SunCalc.getTimes(new Date(now), lat, lng));
var allTimeT = timeMap(SunCalc.getTimes(new Date(now1), lat, lng));
//  rise：银河升起 mid：银河90°时间  set：银河降落
let galaxyTime = timeMap(SunCalc.getGalaxyTimes(new Date(now), lat, lng));
let galaxyTimeT = timeMap(SunCalc.getGalaxyTimes(new Date(now1), lat, lng));
//  rise:月亮升起 set:月亮落下
let moonTime = timeMap(SunCalc.getMoonTimes(new Date(now), lat, lng));
let moonTimeT = timeMap(SunCalc.getMoonTimes(new Date(now1), lat, lng));
// 黑夜开始
let {night} = allTime;
// 黑夜结束
let {nightEnd} = allTimeT;
// 当天月落
let {rise: moonRise, set: moonSet} = moonTime;
// 隔天月落
let {rise: moonRiseT, set: moonSetT} = moonTimeT;
// 当前银河
let {rise: galaxyRise, set: galaxySet} = galaxyTime;
// 隔天银河
let {rise: galaxyRiseT, set: galaxySetT} = galaxyTimeT;


console.log("夜晚开始：", night.date, "夜晚结束：", nightEnd.date)
console.log("月升：", moonRise.date, "隔天月升：", moonRiseT ? moonRiseT.data : moonRise.date)
console.log("月落：", moonSet.date, "隔天月落：", moonSetT.date)
console.log("银河升：", galaxyRise.date, "隔天银河升：", galaxyRiseT.date)
console.log("银河落：", galaxySet.date, "隔天银河落：", galaxySetT.date)


let start = galaxyRise, end = galaxySet, moonStart = moonRise, moonEnd = moonSet;
// 获取正确月落时间
// 如果当天月出小于当天月落 说明月落再第二天
if (moonRise.unix > moonSet.unix) {
    moonEnd = moonSetT
} else if (nightEnd.unix >= moonRiseT.unix) {
    moonStart = moonRiseT
    moonEnd = moonSetT
}
// 获取正确银河落时间
// 如果当前银河出大于当日银河落  说明银河落再第二天
if (galaxyRise.unix > galaxySet.unix) {
    end = galaxySetT
} else if (nightEnd.unix >= galaxyRiseT.unix) {
    start = galaxyRiseT
    end = galaxySetT
}
console.log("银河开始结束时间：", start.date, end.date)
console.log("夜晚开始结束时间：", night.date, nightEnd.date,)
// 银河出现时间是否于黑夜重合
let {isShow, time} = isIntersect([night.unix, nightEnd.unix], [start.unix, end.unix]);

console.log("银河和夜晚重合时间：", timeMap(time).map(v => v.date))

// 今夜是否出现银河
if (isShow) {
    // 获得夜晚可见时间段
    let [start, end] = timeMap(time);
    if (start.unix <= moonStart.unix && moonStart.unix <= end.unix) {
        console.log("适宜观测1", `时间段：${start.date}~${moonStart.date}`);
    } else if (start.unix >= moonEnd.unix) {
        console.log("适宜观测2", `时间段：${start.date}~${end.date}`);
    } else if (end.unix <= moonStart.unix) {
        console.log("适宜观测4", `时间段：${start.date}~${moonStart.date}`);
    } else if (start.unix <= moonEnd.unix && moonEnd.unix <= end.unix) {
        console.log("适宜观测3", `时间段：${moonEnd.date}~${end.date}`);
    } else {
        console.log("不适宜观测1")
    }
} else {
    console.log("不适宜观测2")
}