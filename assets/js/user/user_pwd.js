$(function() {
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if ($("[name=oldPwd]").val() === value) {
                return "新旧密码不能相同";
            }
        },
        rePwd: function(value) {
            if ($("[name=newPwd]").val() !== value) {
                return "两次密码不一致";
            }
        }
    });
    // 表单提交
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(".layui-form").serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("密码更新失败");
                }
                layui.layer.msg("密码更新成功");
                $(".layui-form")[0].reset();
            }
        });
    });
});