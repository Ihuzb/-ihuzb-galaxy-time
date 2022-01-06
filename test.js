// 目的地经纬度坐标度数
let SunCalc = require("./index");
let moment = require("moment")
let lat = 36.79801395790244, lng = 118.06406021118165, now = "2021-10-02";
let time = SunCalc.getTrueGalaxyTimes(now, lat, lng);
// let time = SunCalc.getGalaxyPosition(moment("2021-05-11"), lat, lng);
// let time = SunCalc.getGalaxyTimes("2021-10-02", lat, lng);
// let time = SunCalc.getMoonTimes(new Date(now), lat, lng);
// let time = SunCalc.getPosition(new Date(), lat, lng)
console.log(time);