// 调用ajax时，统一拼接url，统一发送token，统一设置每次AJAX请求后要做的事
$.ajaxPrefilter(function(options) {
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        };
    }
    // 无论请求成功与否都会调用
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem("token");
            location.href = "/login.html";
        }
    }
})