function signin() {
    var username = document.querySelector('#user').value;
    var passwd = document.querySelector('#pass').value;
    if (username === '' || passwd === '') {
        alert('用户名或密码不能为空');
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/login', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        // console.log(resp);
        if (resp.result === "success") {
            console.log(resp.data);
            sessionStorage.setItem("userid", resp.data.id);
            sessionStorage.setItem("username", resp.data.username);
            window.location.href = '/html/index.html';
        } else {
            console.log(resp.result);
            // alert(resp.result);
        }
    };
    xhr.send(JSON.stringify({"username": username, "passwd": passwd}));
}

// $("#change").on("click", function () {
//     console.log(123);
//     // var input = $(".sign-up-htm").find("input");
//     // $.ajax({
//     //     url: '/user',
//     //     data: JSON.stringify({"username": input.eq(0).val(), "passwd": input.eq(1).val()}),
//     //     contentType: 'application/json',
//     //     success: function (data) {
//     //         console.log(data);
//     //     }
//     // })
// });

function change(data){
    var username =$("#changeuser").val();
    var passwd1 = $("#changeaginpasswd").val();
    var passwd2 = $("#changeaginpasswd2").val();
    if(passwd1 !== passwd2){
        console.log("两次密码不一致");
        return;
    }
    if(data==="success"){
        $.ajax({
            url: '/user/'+username+'/'+passwd1,
            type: 'PUT',
            success: function (data) {
                console.log(data);
                if(data.result === "success"){
                    // alert("修改成功");
                    console.log("修改成功");
                    window.location.href = '/';
                }else{
                    // alert("修改失败");
                    console.log("修改失败");
                }
            }
        });
    }else{
        console.log("原密码错误");
    }
}
