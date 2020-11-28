$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 初始化分类列表
    function initArtCateList() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类列表失败");
                }
                var htmlStr = template("tpl-table", res);
                $(".layui-card-body tbody").html(htmlStr);
            }
        });
    }

    // 添加层
    var indexAdd = null;
    $("#btnAddCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    });
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败");
                }
                initArtCateList();
                layer.msg("新增分类成功");
                layer.close(indexAdd);
            }
        });
    })

    //修改层
    var indexEdit = null;
    $(".layui-card-body tbody").on("click", ".btn-edit", function() {
        // 弹出层修改数据
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        // 根据id获取数据
        var id = $(this).attr("data-id");
        $.ajax({
            method: "get",
            url: "/my/article/cates/" + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取信息失败");
                }
                form.val("form-edit", res.data);
            }
        });
    });
    // 确定修改
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败");
                }
                layer.msg("更新分类信息成功");
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    // 删除层
    $(".layui-card-body tbody").on("click", ".btn-delete", function() {
        var id = $(this).attr("data-id");
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "get",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg("删除成功");
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    });
});