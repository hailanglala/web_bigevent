$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 初始化分类信息
    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类失败");
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 图片文件选择
    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click();
    });
    // 监听文件选择框
    $("#coverFile").on("change", function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return;
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 提交 和 存稿 区别方法
    var art_state = "已发布";
    $("#btnSave2").on("click", function() {
        art_state = "草稿";
    });

    // 表单提交
    $("#form-pub").on("submit", function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append("state", art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                // 发布文章
                publishArticle(fd);
            });
    });

    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            method: "post",
            url: "/my/article/add",
            data: fd,
            // 如果数据是 FormData 格式，必须加以下两项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("发布失败");
                }
                layer.msg("发布成功");
                location.href = "/article/art_list.html";
            }
        });
    }
});