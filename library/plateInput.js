window.plateKeyboard = (function() {
    var exportsObject = {};

    /*    车牌号输入方法      */
    var plateLength = 7; //6 普通车牌 7 新能源车
    var provinces = new Array("京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀", "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂", "津", "贵", "云", "桂", "琼", "青", "新", "藏", "蒙", "宁", "甘", "陕", "闽", "赣", "湘");
    var keyNums = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "OK", "Z", "X", "C", "V", "B", "N", "M", "<i class='iconfont'>&#xe66b;</i>");
    var next = 0;
    var plateInput = '';
    //设置省份
    function showProvince() {
        $("#keyboard_pro").html("");
        var ss = "";
        for (var i = 0; i < provinces.length; i++) {
            ss = ss + addKeyProvince(i)
        }
        $("#keyboard_pro").html("<ul class='clearfix ul_pro'>" + ss + "<li class='li_clean'><span><i class='iconfont'>&#xe66b;</i></span></li><li class='li_close'><span>关闭</span></li></ul>");
    }

    function addKeyProvince(provinceIds) {
        var addHtml = '<li>';
        addHtml += '<span class="prokey">' + provinces[provinceIds] + '</span>';
        addHtml += '</li>';
        return addHtml;
    }

    function chooseProvince(province) {
        next = 0;
        plateInput = province;
        carInputChangeBack && carInputChangeBack(plateInput);
        showKeybord();
        return false;
    }
    //设置字母数字
    function showKeybord() {
        $("#keyboard_pro").html("");
        var sss = "";
        for (var i = 0; i < keyNums.length; i++) {
            sss = sss + '<li class="ikey ikey' + i + ' ' + (i > 9 ? "li_zm" : "li_num") + ' ' + (i > 28 ? "li_w" : "") + '" ><span class="wordkey" data-index="' + i + '">' + keyNums[i] + '</span></li>'
        }
        $("#keyboard_pro").html("<ul class='clearfix ul_keybord'>" + sss + "</ul>");
    }

    function choosekey(keyWord, jj) {
        var carNo = plateInput;
        if (jj == 29) {
            $("body").find("#keyboard_wrap").remove();
        } else if (jj == 37) {
            carNo = carNo.substring(0, carNo.length - 1);
            if (!carNo) {
                showProvince();
                next = 0;
            }
            if (next < 1) {
                next = 0;
                plateInput = "";
                showProvince();
            } else {
                plateInput = carNo;
            }
            next = next - 1;
        } else {
            if (next > (plateLength - 1)) {
                closePro()
                return;
            }
            if (next == 0 & jj < 10 & carNo.length == 1) {
                carInputErrorBack && carInputErrorBack("车牌第二位为字母");
                return;
            }
            carNo += keyWord;
            plateInput = carNo;
            next = next + 1;
        }
        carInputChangeBack && carInputChangeBack(plateInput)
        return false;
    }

    function closePro() {
        $("body").find("#keyboard_wrap").remove();
        return false;
    }

    function cleanPro() {
        plateInput = '';
        carInputChangeBack && carInputChangeBack(plateInput);
        next = 0;
    }
    //布局
    function showLayerCarInputPro() {
        $("body").append("<div id='keyboard_wrap'></div>");
        $("body").find("#keyboard_wrap").append('<div id="keyboard_pro"></div><div class="bg"></div>');
        showProvince();
    }

    function showLayerCarInputProp() {
        $("body").append("<div id='keyboard_wrap'></div>");
        $("body").find("#keyboard_wrap").append('<div id="keyboard_pro"></div><div class="bg"></div>');
        showKeybord();
    }
    //绑定事件
    function initDomListener() {
        var keyBoard = $("body").find("#keyboard_wrap");
        keyBoard.on("click", ".bg,.li_close", function() {
            closePro();
        }).on("click", ".li_clean", function() {
            cleanPro();
        }).on("click", ".prokey", function() {
            var province = $(this).text();
            province = province.trim();
            chooseProvince(province);
        }).on("click", ".wordkey", function() {
            var index = $(this).data("index");
            var word = $(this).text();
            word = word.trim();
            choosekey(word, index);
        })
    }
    //模块可视方法
    exportsObject.input = function(plate, newPlateLength) {
        if (plate) {
            plateInput = plate;
            next = plate.length - 1;
        } else {
            plateInput = '';
            next = 0;
        }
        if (newPlateLength) {
            plateLength = newPlateLength;
        } else {
            plateLength = 7;
        }
        if (!plateInput) {
            showLayerCarInputPro();
        } else {
            showLayerCarInputProp();
        }
        initDomListener();
        return false;
    }
    exportsObject.change = function(callBack) {
        carInputChangeBack = callBack;
    };
    exportsObject.error = function(callBack) {
        carInputErrorBack = callBack;
    };
    return exportsObject;
})();