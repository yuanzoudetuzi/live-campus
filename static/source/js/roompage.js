/**
 * Created by Administrator on 2017/7/13.
 */

var locationUrl = ["url(static/source/img/danmu_up.png)", "url((static/source/img/danmu_down.png)",
    "url((static/source/img/danmu_right.png)", "url((static/source/img/danmu_left.png)"];
var navImgArray = ['url(static/source/img/home0.png)', 'url(static/source/img/home1.png)',
    'url(static/source/img/home2.png)', 'url(static/source/img/home2.png)', 'url(static/source/img/home3.png)', 'url(static/source/img/home4.png)',
    'url(static/source/img/home5.png)', 'url(static/source/img/home6.png)'];
var roomList;
var rid,aid,uid, isAtten,requestdata;
$(document).ready(function () {
    /* initNavigation();
     hoverNavigation();*/
    var url = window.location.pathname;  //url = /room/rid
    rid = url.substr(6);
    console.log('url = ' + url + 'rid = ' + rid);
    getRoomInfo(rid);

});

function getRoomInfo(rid) {
    $.ajax({
        type: 'GET',
        contentType: 'application/Json',
        url: 'http://www.campuslive.cn:8080/room/roominfo?id=' + rid + '&type=rid',
        processData: false,
        dataType: 'Json',
        async: false,
        success: function (data) {

            console.log('room push url = ' + data.ret.pushUrl);
            console.log('room httpPullUrl = ' + data.ret.httpPullUrl);
            console.log('room hlsPullUrl = ' + data.ret.hlsPullUrl);
            console.log('room rtmpPullUrl = ' + data.ret.rtmpPullUrl);
            console.log('room cover = ' + data.ret.cover);
            document.getElementById("my_video").poster = data.ret.cover;
            $('#nickname').html(data.ret.username);
            aid = data.ret.uid;
            showAnchorAvatar(aid);
            if (sessionStorage.getItem('uid')) {
                uid = sessionStorage.getItem('uid');
                isAttention();
            } else {
                $('#btn-atten').html('+关注');
            }

            var myPlayer = neplayer('my_video');
            myPlayer.reset();
            myPlayer.setDataSource([
                {type: "rtmp/flv", src: data.ret.rtmpPullUrl},
                {type: "video/x-flv", src: data.ret.httpPullUrl},
                {type: "application/x-mpegURL", src: data.ret.hlsPullUrl},
                {src: "//nos.netease.com/vod163/demo.mp4", type: "video/mp4"}
            ]);
        },
        error: function () {
            console.log('Get room information error');
        }
    });
}

function showAnchorAvatar(aid) {
    $.ajax({
        type: 'GET',
        contentType: 'application/Json',
        url: 'http://www.campuslive.cn:8080/user/avatar/' + aid,
        processData: false,
        dataType: 'Json',
        /* async:false,*/
        success: function (data) {

            if (data.code == 200) {
                $('#avatar').css('background-image', data.url);
                console.log('anchor avatar = ' + data.url);
            } else if (data.code == 6058) {   //用户头像不存在
                console.log('用户头像不存在');
                $('#avatar').css('background-image', 'url(/static/source/img/avatar.png)');
            } else if (data.code == 6057) {   //无效的用户头像请求id
                console.log('无效的用户头像请求id');
                $('#avatar').css('background-image', 'url(/static/source/img/avatar.png)');
            } else {
                $('#avatar').css('background-image', 'url(/static/source/img/avatar.png)');
            }
        },
        error: function () {
            console.log('Get  information error');
        }
    });
}

function isAttention() {
    $.ajax({
            type: 'GET',
            contentType: 'application/Json',
            url: 'http://www.campuslive.cn:8080/user/subscriptionstatus?uid=' + uid + '&aid=' + aid,
            processData: false,
            dataType: 'Json',
            /* async:false,*/
            success: function (data) {
               if(data.code == 6046) {
                   console.log('查询关注信息失败');
               } else {
                   if(data.ret.status == 1) {  //已关注
                       $('#btn-atten').html('取消关注');
                       isAtten = true;
                   } else {
                       $('#btn-atten').html('+关注');
                       isAtten = false;
                   }
               }
            },
            error: function () {
                console.log('Get  attention information error');
            }
        });
}

function search() {
    var content = $('#ipt_search').val();
    console.log('search = ' + content);
}

function attention() {
    if (!sessionStorage.getItem('uid')) {
        alert('请先登陆');
    } else {
        uid = sessionStorage.getItem('uid');
        if(isAtten) {
           alert('取消关注');
            console.log('取消关注');
            $.post("http://www.campuslive.cn:8080/user/unsubscribeanchor",
                {
                    uid:uid,
                    aid:aid
                },
                function(data,status){
                  /*  var response = JSON.stringify(data);*/
                  /*  console.log('关注 code = ' + response.code );*/
                    if (status == 'success') {
                        console.log('取消关注 code1 = ' + data.code );
                        if(data.code == 200){
                            alert('取消关注成功');
                            console.log("取消关注成功");
                            $('#btn-atten').html('+关注');
                        } else if (data.code == 6038) {
                            console.log('该用户尚未关注该主播');
                        } else {
                            console.log('取消关注失败');
                        }
                    }  else {
                        console.log('cancel attention is ' + status);
                    }

                   /* alert("Data: " + data + "\nStatus: " + status);*/
                });
        } else {
           /* alert('关注');*/
            console.log('关注');
            $.post("http://www.campuslive.cn:8080/user/subscribeanchor",
                {
                    uid:uid,
                    aid:aid
                },
                function(data,status){
                   if (status == 'success') {
                       console.log('关注 code1 = ' + data.code );
                       if(data.code == 200){
                           alert('关注成功');
                           console.log("关注成功");
                           $('#btn-atten').html('取消关注');

                       } else if (data.code == 6036) {
                           console.log('该用户已关注该主播');
                       } else  {
                           console.log('关注失败');
                       }
                   }  else {
                       console.log('attention is ' + status);
                   }

                   /* alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);*/
                });
        }
    }
}
function showRoom(rid) {
    /* $('#room_list_contain').hide();
     $('#video_cover').hide();
     $('#video_cover').css({
     height:0,
     "z-index":48
     });
     if (rid == 1){
     myPlayer.setDataSource([
     {type: "rtmp/flv",src: "rtmp://v4622ebf4.live.126.net/live/1c33a2fbfac74978b10caa7e9ef250f5"},
     {type: "video/x-flv",src: "http://flv4622ebf4.live.126.net/live/1c33a2fbfac74978b10caa7e9ef250f5.flv?netease=flv4622ebf4.live.126.net"},
     {type: "application/x-mpegURL",src: "http://pullhls4622ebf4.live.126.net/live/1c33a2fbfac74978b10caa7e9ef250f5/playlist.m3u8"}
     /!* {src:"//nos.netease.com/vod163/demo.mp4",type:"video/mp4"}*!/
     ]);
     } else if (rid == 2) {
     myPlayer.setDataSource([
     {type: "rtmp/flv",src: "rtmp://v4622ebf4.live.126.net/live/29528fa6d9714d12b4edab590efd51c0"},
     {type: "video/x-flv",src: "http://flv4622ebf4.live.126.net/live/29528fa6d9714d12b4edab590efd51c0.flv?netease=flv4622ebf4.live.126.net"},
     {type: "application/x-mpegURL",src: "http://pullhls4622ebf4.live.126.net/live/29528fa6d9714d12b4edab590efd51c0/playlist.m3u8"}
     ]);
     } else if (rid == 3) {
     myPlayer.setDataSource([
     {type: "rtmp/flv",src: "rtmp://v4622ebf4.live.126.net/live/0209abf2449a4fe5ba9fafa90298f4e5"},
     {type: "video/x-flv",src: "http://flv4622ebf4.live.126.net/live/0209abf2449a4fe5ba9fafa90298f4e5.flv?netease=flv4622ebf4.live.126.net"},
     {type: "application/x-mpegURL",src: "http://pullhls4622ebf4.live.126.net/live/0209abf2449a4fe5ba9fafa90298f4e5/playlist.m3u8"}
     ]);
     }*/
}

