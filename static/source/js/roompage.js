/**
 * Created by Administrator on 2017/7/1.
 */
/**
 * Created by Administrator on 2017/6/24.
 */
/**
 * Created by Administrator on 2017/4/25.
 */
var locationUrl = ["url(static/source/img/danmu_up.png)", "url((static/source/img/danmu_down.png)",
    "url((static/source/img/danmu_right.png)", "url((static/source/img/danmu_left.png)"];
var navImgArray = ['url(static/source/img/home0.png)','url(static/source/img/home1.png)',
    'url(static/source/img/home2.png)','url(static/source/img/home2.png)','url(static/source/img/home3.png)','url(static/source/img/home4.png)',
    'url(static/source/img/home5.png)','url(static/source/img/home6.png)'];
var roomList;
$(document).ready(function () {

    $("#navigation").height(document.body.clientHeight-60);
    $("#video_area").height(document.body.scrollHeight-60);

    /* $("#msg_color").click(function () {
     /!*console.log("color show");*!/
     $(".msg_color_drop:first").attr("style", "display:block;");
     });

     $("#msg_location").click(function () {
     $(".msg_location_drop:first").attr("style", "display:block;");
     });*/

    initNavigation();

});


function initNavigation() {
    console.log('initNav');
    var navArray =  document.getElementsByClassName("nav_btn");
    console.log('initNav.length = ' + navArray.length);
    for (var i = 0; i < navArray.length; i++ ) {
        navArray[i].style.backgroundImage ="url(static/source/img/home"+i+".png)";
    }
}

function initMsgLocation() {
    var locationrArray =  document.getElementsByClassName("location_select");
    console.log('locationrArray.length = ' + locationrArray.length);
    for (var i = 0; i < locationrArray.length; i++ ) {
        console.log('i = ' + i);
        locationrArray[i].style.backgroundImage = locationUrl[i];
    }
}

function search () {
    var content = $('#ipt_search').val();
    console.log('search = ' +  content);
}

var myPlayer = neplayer('my_video');
 myPlayer.reset();

 myPlayer.setDataSource([
    {type: "rtmp/flv",src: "rtmp://v4622ebf4.live.126.net/live/1c33a2fbfac74978b10caa7e9ef250f5"},
    {type: "video/x-flv",src: "http://flv4622ebf4.live.126.net/live/1c33a2fbfac74978b10caa7e9ef250f5.flv?netease=flv4622ebf4.live.126.net"},
    {type: "application/x-mpegURL",src: "http://pullhls4622ebf4.live.126.net/live/1c33a2fbfac74978b10caa7e9ef250f5/playlist.m3u8"},
    {src:"//nos.netease.com/vod163/demo.mp4",type:"video/mp4"}
]);
/*function backHome() {

 $('#video_cover').css({
 height: 480,
 "z-index":50
 });
 $('#room_list_contain').show();
 }*/
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
