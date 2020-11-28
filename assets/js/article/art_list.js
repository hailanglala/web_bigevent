$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "" //文章的状态
    };

    initCate();

    // 获取分类信息
    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取信息列表失败");
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通过 layui 重新渲染 select
                form.render();
            }
        });
    }

    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());

        var hh = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }

    // 补0
    function addZero(n) {
        return n > 9 ? n : "0" + n;
    }

    initTable();

    // 加载列表信息
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("信息加载失败");
                }
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                // 分页信息渲染
                renderPage(res.total);
            }
        });
    }

    // 通过筛选获取信息
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    // 分页信息渲染
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            limits: [2, 3, 5, 10],
            curr: q.pagenum,
            // 切换分页的回调
            // 触发jump方式两种，1.点击分页 2.调用laypage.render方法
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
        });
    }

    // 删除操作
    $("tbody").on("click", ".btn-delete", function() {
        var id = $(this).attr("data-id");
        // 通过判断当前页面删除按钮个数是否为1，知道删除后页面数是否减一
        var len = $(".btn-delete").length;
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "get",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg("删除成功");
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });

            layer.close(index);
        });
    })
});