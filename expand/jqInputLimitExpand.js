//限制只输入数字
$("body").on("input change paste", 'input[value-type="number"]', function() {
    var val = $(this).val();
    if (val) {
        val = String(val);
        var  newVal = val.replace(/[^\d]/g, "");
        if(newVal != val){
            $(this).val(newVal);
        }
    }
})
//限制只输入金额
$("body").on("input change paste", 'input[value-type="money"]', function() {
    //intLength 整数位 用于“限输入数字”限制，例如：最大整数位9&小数位2
    var val = $(this).val(),
        intLength = $(this).attr("maxlength");
    if (val) {
        val = String(val);
        var newVal = val.replace(/。/g,".");
        newVal = newVal.replace(/[^\d.]/g, "");
        newVal = newVal.replace(/^\./g, "");
        newVal = newVal.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        newVal = newVal.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        if (intLength) {
            if (newVal.indexOf('.') == -1) {
                intLength -= 3;
            }
            newVal = newVal.substr(0, intLength);
        }
        if(newVal != val){
            $(this).val(newVal);
        }
    }
})
//限制只输入比例
$("body").on("input change paste", 'input[value-type="rate"]', function(e) {
    var ev = e || window.event,
        val = $(this).val(),
        maxVal = $(this).attr("max");
    if (val) {
        val = String(val);
        var newVal = val.replace(/。/g,".");
        newVal = newVal.replace(/[^\d.]/g, "");
        newVal = newVal.replace(/^\./g, "");
        newVal = newVal.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        newVal = newVal.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        if (maxVal && Number(newVal) > Number( maxVal) && ev.type != 'paste') {
            newVal = newVal.substr(0, newVal.length - 1);
        }
        if (maxVal && Number(newVal) > Number(maxVal)) {
            newVal = maxVal;
        }
        if(newVal != val){
            $(this).val(newVal);
        }
    }
})
//限制不可输入特殊符号，其他不限 (汉字，字母，数字)
$("body").on("input change paste", 'input[value-type="chinese"]', function() {
    var val = $(this).val(),
        intLength = $(this).attr("maxlength");
    if (val) {
        val = String(val);
        var newVal = val.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "");
        if (intLength) {
            newVal = newVal.substr(0, intLength);
        }
        if(newVal != val){
            $(this).val(newVal);
        }
    }
})
//限制不可输入表情
$("body").on("input change paste", 'input[value-type="keyboard"]', function() {
    var val = $(this).val(),
        intLength = $(this).attr("maxlength");
    if (val) {
        val = String(val);
        var newVal = val.replace(/[^A-Za-z0-9\u4e00-\u9fa5\s\r\n~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, "");
        if (intLength) {
            newVal = newVal.substr(0, intLength);
        }
        if(newVal != val){
            $(this).val(newVal);
        }
    }
})
//限制编号，其他不限 (字母，数字)
$("body").on("input change paste", 'input[value-type="alphabet"]', function() {
    var val = $(this).val(),
        intLength = $(this).attr("maxlength");
    if (val) {
        val = String(val);
        var newVal = val.replace(/[^A-Za-z0-9]/g, "");
        if (intLength) {
            newVal = newVal.substr(0, intLength);
        }
        if(newVal != val){
            $(this).val(newVal);
        }
    }
})
