var MAXPAGE = 5;
$(function () {
    fuzzyOrder(1);
    $("#pre").click(function () {
        var current = sessionStorage.getItem('current');
        if (current > 1) {
            current--;
            fuzzyOrder(current);
        }
    });
    // if(sessionStorage.getItem("current") <= 1){
    //     $(this).addClass("disabled");
    // }else{
    //     $(this).removeClass("disabled");
    // }
    $("#next").click(function () {
        var current = sessionStorage.getItem('current');
        var pages = sessionStorage.getItem('pages');
        if (current < pages) {
            current++;
            // $(this).removeClass("disabled");
            fuzzyOrder(current);
        } else {
            // $(this).addClass("disabled");
        }
    });
    // if(sessionStorage.getItem("current") >= sessionStorage.getItem("pages")){
    //     $("#next").addClass("disabled");
    // }
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            $("#pre").click();
        } else if (event.key === 'ArrowRight') {
            $("#next").click();
        }
    });
    window.parent.document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            $("#pre").click();
        } else if (event.key === 'ArrowRight') {
            $("#next").click();
        }
    });
    $("#search").click(function () {
        fuzzyOrder(1);
    });
    // // $("#search").on('click', function () {
    // //     fuzzyOrder(1);
    // // });
    $("#save").on("click", function () {
        var articleId = $("#inputGroupSelectsave").val();
        var number = $("#number").val();
        if (number === '') {
            alert('输入不能为空');
            return;
        }
        if (!updateNumber(articleId, -number)) {
            // alert('修改失败');
            console.log('修改失败');
            return;
        }
        var article = getArticleById(articleId);
        var tradeName = article.tradeName;
        var colorNo = article.colorNo;
        var size = article.size;
        $.post({
            url: "/delivery_details", //请求地址
            contentType: "application/json",
            data: JSON.stringify({
                "orderId": sessionStorage.getItem("id"),
                "articleId": articleId,
                "tradeName": article.tradeName,
                "colorNo": article.colorNo,
                "size": article.size,
                "number": number,
            }),
            success: function (data) {
                if (data.result === "success") {
                    // alert("新增成功");
                    console.log("新增成功");
                    fuzzyOrder(1);
                }
            }
        });
        $(this).siblings().click();
        $("#inputGroupSelectsave").find("option:first").prop("selected", true);
        $("#number").val("");
        $("#updateModal").click();
    });
    $("#update").on("click", function () {
        // updateOrder($(this).parent().parent().find("td").eq(1).attr("index"), $(this).parent().parent().find("td").eq(5).text());
        updateOrder();
        $(this).siblings().click();
        $("#inputGroupSelectUpdate").find("option:first").prop("selected", true);
        $("#unumber").val("");
        $("#updateModal").click();
    });
    $("#updateModal").on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('whatever');
        // console.log("id=" + id);
        var modal = $(this);
        modal.find('.modal-body textarea').val(id);
    });
    forms("#inputGroupSelectUpdate");
    forms("#inputGroupSelectsave");
});

function updateNumber(id, number) {
    var result = false;
    $.ajax({
        url: "/article_number/updateNumber", //请求地址
        contentType: "application/json",
        type: "PUT",
        data: JSON.stringify({
            id: id,
            number: number,
        }),
        async: false,
        success: function (data) {
            if (data.code === 20041) {
                result = true;
            }
        }
    });
    return result;
}

function loadTable() {
    $("tbody").empty();
    var pagedata = JSON.parse(sessionStorage.getItem("pagedata")).records;
    $.each(pagedata, function (index, value) {
        var tr = $("<tr></tr>");
        tr.append("<td>" + (index + 1) + "</td>");
        var article = getArticleById(value.articleId);
        tr.append("<td index='" + value.articleId + "'>" + article.articleNumber + "</td>");
        tr.append("<td>" + value.tradeName + "</td>");
        tr.append("<td>" + value.colorNo + "</td>");
        tr.append("<td>" + value.size + "</td>");
        tr.append("<td>" + value.number + "</td>");
        buttenUpdate = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#updateModal' data-whatever='" + value.id + "'>修改</button>";
        buttenDelete = "<button type='button' class='btn btn-danger' onclick='deleteOrder(" + value.id + ")'>删除</button>";
        tr.append("<td>" + buttenUpdate + "&emsp;" + buttenDelete + "</td>");
        $("tbody").append(tr);
    });
}


function setsession(data) {
    sessionStorage.setItem("pagedata", JSON.stringify(data));
    sessionStorage.setItem("total", data.total);
    sessionStorage.setItem("current", data.current);
    sessionStorage.setItem("pages", data.pages);
}

function loadPagination() {
    $(".yemabiaoqian").remove();
    var pages = sessionStorage.getItem("pages");
    var current = sessionStorage.getItem("current");
    for (var i = 1; i <= pages; i++) {
        var li = $("<li class='page-item yemabiaoqian'></li>");
        // li.append('<a class="page-link" href="javascript:;" onclick="page(' + i * MAXPAGE + ',' + (i * MAXPAGE + MAXPAGE - 1) + ')"' + 'index="' + i + '"' + i + '</a>');
        li.append('<a class="page-link" href="javascript:;"> ' + i + '</a>');
        li.attr("index", i);
        li.on('click', function () {
            fuzzyOrder($(this).attr('index'));
        });
        if (i === parseInt(current)) {
            li.addClass("active");
            li.attr("aria-current", "page");
        }
        $("#next").before(li);
    }
}

function deleteOrder(id) {
    $.ajax({
        url: "/delivery_details/" + id,
        type: "DELETE",
        success: function (data) {
            if (data.result === "success") {
                console.log("删除成功");
                fuzzyOrder(1);
            }
        }
    });
}

function updateOrder() {
    var articleId = $("#inputGroupSelectUpdate").val();
    var number = $("#unumber").val();
    var id = $("#uid").val();
    if (number === '') {
        alert('输入不能为空');
        return;
    }
    var detail = getDeailById(id);
    var preNumber = detail.number;
    if (!updateNumber(articleId, preNumber - number)) {
        // alert('修改失败');
        console.log('修改失败');
        return;
    }
    var article = getArticleById(articleId);
    $.ajax({
        url: "/delivery_details/",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "id": id,
            "articleId": articleId,
            "tradeName": article.tradeName,
            "colorNo": article.colorNo,
            "size": article.size,
            "number": number,
        }),
        success: function (data) {
            if (data.result === "success") {
                console.log("修改成功");
                fuzzyOrder(1);
            }
        },
        async: false,
    });
}

function fuzzyOrder(page) {
    // console.log($(".receiptNumber").val());
    // console.log($(".form-control.receiptNumber").val());
    $.ajax({
        url: "/delivery_order/page",
        contentType: "application/json",
        type: "GET",
        data: {
            "page": page,
            "sizep": MAXPAGE,
            "id": sessionStorage.getItem("id"),
            "tradeName": $("#tradeName").val(),
            "colorNo": $("#colorNo").val(),
            "size": $("#size").val()
        },
        success: function (data) {
            if (data.result === "success") {
                setsession(data.data);
                loadTable();
                loadPagination();
            }
        }
    });
}

function fmtDateTime(obj) {
    var d = new Date(obj);
    var year = d.getFullYear();
    var month = "0" + (d.getMonth() + 1);
    var day = "0" + d.getDate();
    return year + '-' + month.substring(month.length - 2, month.length) + '-' + day.substring(day.length - 2, day.length);
}

function forms(htmlid) {
    $.ajax({
        url: '/article_number/getAll',
        success: function (data) {
            var list = data.data;
            var html = '';
            for (var i = 0; i < list.length; i++) {
                html += '<option value="' + list[i].id + '">' + list[i].articleNumber + '</option>';
            }
            $(htmlid).append(html);
        },
        async: false
    });
}


function getArticleById(id) {
    var article;
    $.get({
        url: "/article_number/getById/" + id,
        async: false,
        success: function (data) {
            article = data.data;
        },
    });
    return article;
}

function getDeailById(id) {
    var detail;
    $.get({
        url: "/delivery_details/" + id,
        async: false,
        success: function (data) {
            detail = data.data;
        },
    });
    return detail;
}