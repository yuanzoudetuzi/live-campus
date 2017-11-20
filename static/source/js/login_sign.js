/**
 * Created by Administrator on 2017/6/21.
 */
var requestdata;
var uid;
$(document).ready(function () {

    loginArea();
    initNavigation();
    hoverNavigation();
});

function loginArea() {
    if(sessionStorage.getItem('uid')) {
        $("#login_area a").hide();
        $(".login_in").show();
        $('#login_img').css('background-image',sessionStorage.getItem('avatarUrl'));
    } else {
        $("#login_area a").show();
        $(".login_in").hide();
    }
}

function initNavigation() {
    console.log('initNav');
    var navArray =  document.getElementsByClassName("nav_btn");
    console.log('initNav.length = ' + navArray.length);
    for (var i = 0; i < navArray.length; i++ ) {
        navArray[i].style.backgroundImage ="url(/static/source/img/home"+(i+1)+".png)";
    }
}

function hoverNavigation() {
    var img, imgIdx;
    $('.nav_btn').mouseover(function () {
        img =  $(this).css("background-image").substr(-11,9);  //获得图片名称home0.png
        imgIdx =  $(this).css("background-image").substr(-7,5);  //获得图片标号0.png
        $(this).css("background-image","url(/static/source/img/home_" + imgIdx + ")");
    });

    $('.nav_btn').mouseout(function () {
        $(this).css("background-image","url(/static/source/img/" + img + ")");
    });
}

//
// function showLoginBox () {
//     console.log('showLoginBox')
//     var bh = $("body").height();
//     var bw = $("body").width();
//     $("#cover_layer").css({
//         height:bh,
//         width:bw,
//         display:"block"
//     });
//     $("#login_box").show();
// }
//
// function showRegisterBox() {
//     var bh = $("body").height();
//     var bw = $("body").width();
//     $("#cover_layer").css({
//         height:bh,
//         width:bw,
//         display:"block"
//     });
//     $("#register_box").show();
// }
//
// function closeBox() {
//     setElementStatus("alert_box","none");
//     $('#login_box input').val('');
//     $('#register_box input').val('');
//     $("#login_box").hide();
//     $("#register_box").hide();
//     $("#avatar_box").hide();
//     $("#cover_layer").css({
//         height:0,
//         width:0,
//         display:"block"})
// }

function login() {
    var username =  $('#logName').val();
    var password = $('#logPassword').val();
    if (
        validInformation('log_',username, '昵称') == false) {
        document.getElementById('logName').focus();
    }
    else if ( validInformation(password, '密码') == false) {
        document.getElementById('logPassword').focus();
    }  else {
        requestdata = '{"username" : "' + username + '","password" : "' + password + '"}';
        console.log('login = ' + requestdata);
        $.ajax({
            type : 'POST',
            contentType : 'application/json',
            url : 'http://www.campuslive.cn:8080/pass/login',
            processData : false,
            dataType : 'json',
            data : requestdata,
            success : function (data) {
                console.log('data.code = ' + data.code);
                console.log(data.uid + " login in Success!" );
                if(data.code == '200') {
                    setElementStatus("log_alert_box","none");
                    $('#login_box input').val('');
                    $("#login_box").modal();
                    $("#login_area a").hide();
                    $(".login_in").show();
                    sessionStorage.setItem('uid',data.uid);
                    uid  = data.uid;       //获取用户标识
                    showAvatar();

                } else if (data.code == '6031') {
                    setElementStatus("log_alert_box","block");
                    setElementHtml('log_alert_text', '用户不存在!');
                }  else if (data.code ==  '6022') {
                    setElementStatus("log_alert_box","block");
                    setElementHtml('log_alert_text', '用户密码错误!');
                } else if(data.code == '6021'){
                    setElementStatus("log_alert_box","block");
                    setElementHtml('log_alert_text', '用户邮箱不存在!');
                } else {
                    setElementStatus("log_alert_box","block");
                    setElementHtml('log_alert_text', '登陆失败!');
                }
            },
            error : function () {
                console.log('Connect to server Error...');
            }
        })
    }

}

function register () {
    var username = $('#signName').val()
    var password = $('#signPassword').val();
    var confirmPW = $("#confirmPassword").val();
    if  (validInformation('sign_',username,'昵称') == false) {
        document.getElementById('signName').focus();
    }  else if ( validInformation(password, '密码') == false) {
        document.getElementById('signPassword').focus();
    }  else if (password != confirmPW) {
        setElementStatus("sign_alert_box","block");
        setElementHtml('sign_alert_text', '密码输入不一致');
        document.getElementsByName('con_password')[0].focus();
    }
    else {
        requestdata = '{"username" : "' + username + '","password" : "' + password + '"}';
        console.log('sign = ' + requestdata);
        $.ajax({
            type : 'POST',
            contentType : 'application/json',
            url : 'http://www.campuslive.cn:8080/pass/sign',
            processData : false,
            dataType : 'json',
            data : requestdata,
            success : function (data) {
                console.log(data.username + " Sign up Success!");
                if (data.code == '200') {
                    setElementStatus("sign_alert_box","none");
                    $('#sign_box input').val('');
                    $("#sign_box").modal();
                    $('#register_success').show();
                    setTimeout(function () {
                        $('#register_success').hide();
                    },1000 );
                } else if (data.code == '601') {
                    setElementStatus("sign_alert_box","block");
                    setElementHtml('sign_alert_text', '注册失败!');
                }  else if (data.code ==  '6011') {
                    setElementStatus("sign_alert_box","block");
                    setElementHtml('sign_alert_text', '用户已存在!');
                }
            },
            error : function () {
                console.log('Connect to server Error...');
            }
        })

    }

}

function showAvatar() {
    $.ajax({
        type: 'GET',
        contentType : 'application/json',
        url : 'http://www.campuslive.cn:8080/user/avatar/'+uid,
        processData : false,
        dataType : 'json',
        success:function (data) {
            if (data.code == 200) {
                sessionStorage.setItem('avatarUrl',"url(/static/source/img/avatar.png)");
                $('#login_img').css('background-image',"url(/static/source/img/avatar.png)");
                // sessionStorage.setItem('avatarUrl',data.url);
               // $('#login_img').css('background-imag',"url("+data.url +")");
                console.log('avatar url = ' + data.url);
                // $('#login_img').css('background-image',"url(" + data.url + ")");

            }  else if (data.code == 6058 ) {   //用户头像不存在
                 console.log('用户头像不存在');
                sessionStorage.setItem('avatarUrl',"url(/static/source/img/avatar.png)");
               /* $('#login_img').css('background-image',"url(static/source/img/avatar.png)");*/
            }  else if (data.code == 6057) {   //无效的用户头像请求id
                console.log('无效的用户头像请求id');
                sessionStorage.setItem('avatarUrl',"url(/static/source/img/avatar.png)");
              /*  $('#login_img').css('background-image',"url(static/source/img/avatar.png)");*/
            } else {
                sessionStorage.setItem('avatarUrl',"url(/static/source/img/avatar.png)");
              /*  $('#login_img').css('background-image',"url(static/source/img/avatar.png)");*/

            }
            var url = window.location.href;
            window.location.href = url;
        },
        error: function () {
            console.log('Get avatar from  server Error...');
        }
    });
}
function loginOut () {
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('avatarUrl');
    console.log(" Sign out Success!");
    $("#login_area a").show();
    $(".login_in").hide();
}

function showPerInfo() {
    var uid = sessionStorage.getItem('uid')
    if(uid) {
        window.location.href = 'http://www.campuslive.cn:8080/user/info?' + uid;
    }
}


function validInformation (type,value, alertTxt) {
    /* console.log('validInformation')*/
    if ( value == undefined || value == null || value == "" )
    {
        /*  alert(alertTxt + " 必须填写!");*/
        setElementStatus(type+"alert_box", "block");
        setElementHtml (type+"alert_text",alertTxt + "必须填写！");
        /* $('#alert_text').html(alertTxt + "必须填写！");*/
        return false;
    }
    if( alertTxt == "邮箱" && checkEmail(value) == false ) {
        setElementStatus(type+"alert_box","block");
        setElementHtml (type+"alert_text", alertTxt + "格式错误！");
        // alert(alertTxt + " format is wrong, it must be your phone number.");
        /*  $('#alert_text').html(alertTxt + "格式错误！");*/

        return false;
    } else if( alertTxt == "密码" && checkPassword(value) == false ) {
        /* alert(alertTxt + " format is wrong." +
         " length must be 6 to 20,and must be letter,number,dot,underline.");*/
        setElementStatus(type+"alert_box","block");
        setElementHtml (type+"alert_text", alertTxt +  "格式错误！" +"长度不能为空，有字母，数字，点，下划线组成");
        /*   $('#alert_text').html(alertTxt + " 格式错误！" +"长度6到20，有字母，数字，点，下划线组成");*/
        return false;
    }
    return true;
}

function  setElementStatus (className,state) {
    console.log("state" + state);
    $('.' + className).css('display',state);
    /*  document.getElementsByClassName(className)[0].style.display = state;*/
};

function  setElementHtml (className, html) {
    $('.' + className).html(html);
    /* document.getElementsByClassName(className)[0].innerHTML = html;*/
}

function checkEmail (str){
    /*var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);*/
    if (str != null) {
        return true;
    } else {
        return false;
    }


}

function checkPassword(str) {
    if (!/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){1,19}$/.test(str)) {
        return false;
    } else {
        return true;
    }
}