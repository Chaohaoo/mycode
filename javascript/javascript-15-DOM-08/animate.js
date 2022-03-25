/**
 * 获取样式属性的兼容方法
 * @param {object} dom  dom对象
 * @param {string} attr css属性名
 */
function getStyle(dom, attr) {
    // window.getComputedStyle这个方法需要IE9以后的主流浏览器才可以使用
    if (window.getComputedStyle) {
        return window.getComputedStyle(dom, null)[attr];
    } else {// IE9之前的浏览器使用 dom对象.currentStyle["css属性名"]
        return dom.currentStyle[attr];
    }
}

/**
 * 封装的原生js缓动动画框架
 * @param {object} dom  需要做动画的dom对象
 * @param {object} json  需要做动画的css属性对象,这个对象可以有一个css属性也可以有多个css属性
 * @param {function} callback 动画完成以后,执行的回调函数 该函数为可选参数
 */

//  注意: dom是一个对象,对象就可以添加属性和方法
function animate(dom, json, callback) {
    // 清除之前的定时器
    window.clearInterval(dom.timer);

    // 开启新的定时器
    dom.timer = window.setInterval(function () {
        // 在定时器里面,定义一个flag变量, 这个变量用于表示是否所有css属性都到达了目标值,假设刚开始都到达了目标值
        var flag = true;

        // 遍历自定义对象json
        for (var attr in json) {
            // opacity这个css属性需要单独处理
            if (attr === "opacity") {
                // 注意: 因为opacity的取值是0~1,变化范围太小了,我们又想要有渐变的感觉,所以我们可以把opacity的当前值和目标值都扩大100倍,最后设置opacity样式的时候,再缩小100倍即可

                // 获取目标值
                var target = json[attr] * 100;

                // 获取当前css属性值  也就是当前值
                var currentVal = parseFloat(getStyle(dom, attr)) * 100;

                // 计算速度  公式:  (目标值-当前值)/10
                var speed = (target - currentVal) / 10;

                // 处理速度 判断速度是否大于0  如果大于0向上取整; 如果小于0向下取整
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

                // 设置dom对象的css样式
                dom.style[attr] = (currentVal + speed) / 100;

                // 判断当前值是否不全等于目标,  只要不全等,就代表没有全部css属性到达目标值
                if (currentVal !== target) {
                    // 修改flag的值为false
                    flag = false;
                }
            } else if (attr === "zIndex") {
                // z-index属性不需要做动画,所以直接设置即可
                dom.style[attr] = json[attr];
            } else {
                // 获取目标值
                var target = json[attr];

                // 获取当前css属性值  也就是当前值
                var currentVal = parseInt(getStyle(dom, attr));

                // 计算速度  公式:  (目标值-当前值)/10
                // var speed = (target - currentVal) / 10;
                var speed = target - currentVal > 0 ? 2 : -2;

                // 处理速度 判断速度是否大于0  如果大于0向上取整; 如果小于0向下取整
                // speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

                // 设置dom对象的css样式
                dom.style[attr] = currentVal + speed + "px";

                // 判断当前值是否不全等于目标,  只要不全等,就代表没有全部css属性到达目标值
                if (currentVal !== target) {
                    // 修改flag的值为false
                    flag = false;
                }
            }
        }

        // for...in遍历所有css属性完毕以后,我们再判断是否所有css属性到达目标值
        if (flag) {
            // 清除定时器
            window.clearInterval(dom.timer);

            // 所有css属性都到达目标值,表示动画已经完成了
            // 当回调函数存在的时候,才调用回调函数
            if (callback) {
                callback();
            }

            // 进阶写法,等同于上面的if结构
            // callback && callback();
        }

    }, 15);
}