$(function() {
    $("#link_reg").on("click", function() {
        $(".reg-box").show();
        $(".login-box").hide();
    });
    $("#link_login").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });
    // 自定义校验规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致";
            }
        }
    });
    // 注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        $.post("/api/reguser", {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功");
            $("#form_reg")[0].reset();
            $("#link_login").click();
        });
    });
    // 登录功能
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                localStorage.setItem("token", res.token);
                location.href = '/index.html';
            }
        });
    });
});