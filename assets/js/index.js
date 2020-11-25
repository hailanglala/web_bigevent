$(function() {
    getUserInfo();
    // 设置关闭退出
    var layer = layui.layer;
    $("#btnLogout").on("click", function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem("token");
            location.href = "/login.html";
            // 系统自带关闭弹出窗
            layer.close(index);
        });
    });
});

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            renderAvatar(res.data);
        }
    });
}

// 渲染用户信息
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        $(".layui-nav-img").hide();
        $(".text-avatar").html(name[0].toUpperCase()).show();
    }
}