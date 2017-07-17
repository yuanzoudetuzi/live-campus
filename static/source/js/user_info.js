/**
 * Created by Administrator on 2017/7/14.
 */
$(document).ready(function () {
     getPersonInfo();
});

function getPersonInfo() {
    if(!sessionStorage.getItem('uid')) {
        alert('请先登陆');
        return;
    }
    $.ajax({
        type:'GET',
        contentType : 'application/json',
        url : 'http://www.campuslive.cn:8080/user/userinfo?uid=' + sessionStorage.getItem('uid'),
        async: false,
        processData : false,
        dataType : 'json',
        success: function (data) {
            $('#personAvatar').css('background-image',sessionStorage.getItem('avatarUrl'));
            // $('#personAvatar').css('background-image',data.imgAvatar);
            console.log('username = ' + data.ret.username + data.ret.sex + data.ret.age);
            $('#nickname').html(data.ret.username);
            $('#gender').html(data.ret.sex);
            $('#age').html(data.ret.age);
            getPersonAtten();
            getPersonFans();
        },
        error: function () {
            console.log('Get personal infomation from server Error');
        }
    });
}

function getPersonAtten() {
    $.ajax({
        type:'GET',
        contentType : 'application/json',
        url : 'http://www.campuslive.cn:8080/user/anchorlist?uid=' + sessionStorage.getItem('uid'),
        async: false,
        processData : false,
        dataType : 'json',
        success: function (data) {
           var num = data.ret.list.length;
            $('#atten-num').html(num);
        },
        error: function () {
            console.log('Get personal attention  from server Error');
        }
    });
}

function getPersonFans() {
    $.ajax({
        type:'GET',
        contentType : 'application/json',
        url : 'http://www.campuslive.cn:8080/user/user/fanlist?uid=' + sessionStorage.getItem('uid'),
        async: false,
        processData : false,
        dataType : 'json',
        success: function (data) {
            var num = data.ret.list.length;
            $('#fans-num').html(num);
        },
        error: function () {
            console.log('Get personal fanslist  from server Error');
        }
    });
}

function setAvatar() {
    
}