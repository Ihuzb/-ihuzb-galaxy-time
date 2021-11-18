// 目的地经纬度坐标度数
let SunCalc = require("./index")
let lat = 36.79801395790244, lng = 118.06406021118165, now = "2024-10-24";
// let time = SunCalc.getTrueGalaxyTimes(lat, lng, now);
let time = SunCalc.getMoonTimes(new Date(now), lat, lng);
console.log(time);