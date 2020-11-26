$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称只能 1~6 位";
            }
        }
    });
    initUserInfo();
    // 重置表单
    $("#btnReset").on("click", function(e) {
        e.preventDefault();
        initUserInfo();
    });
    // 信息提交
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("更新失败");
                }
                layer.msg("更新成功");
                window.parent.getUserInfo();
            }
        });
    });

    // 初始化表单
    function initUserInfo() {
        $.ajax({
            method: "get",
            url: "/my/userinfo",
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取信息失败");
                }
                form.val("formUserInfo", res.data);
            }
        });
    }
});