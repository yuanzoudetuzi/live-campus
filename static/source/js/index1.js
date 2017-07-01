/**
 * Created by Administrator on 2017/4/25.
 */
var locationUrl = ["url(img/danmu_up.png)", "url(img/danmu_down.png)",
                   "url(img/danmu_right.png)", "url(img/danmu_left.png)"]
$(document).ready(function () {
    $(".menu").mouseover(function () {
        $(this).find("ul").stop(true).slideDown("3000").effect("bounce",{ distance: 5 },"slow");
    });
    $(".menu").mouseout(function () {
        $(this).find("ul").stop(true).slideUp("3000");
    });

    $("#date").datepicker();
    $("#navigation").height(document.body.clientHeight-60);
    $("#video_area").height(document.body.scrollHeight-60);
    $("#live_room_right_plate").height(document.body.scrollHeight-60);
   /* console.log("height = " +window.screen.height);
    console.log("height = " +document.body.scrollHeight );
    console.log("height = " +document.body.clientHeight );*/
    $("#navigation").mCustomScrollbar({
            autoHideScrollbar:true,
            theme:"light"
        }
    );

    $("#msg_color").click(function () {
        /*console.log("color show");*/
        $(".msg_color_drop:first").attr("style", "display:block;");
    });

    $("#msg_location").click(function () {
        $(".msg_location_drop:first").attr("style", "display:block;");
    });

    initMsgLocation();
    $("#message_send_btn").click(function () {
       var msg = $("#message_input").val();
       var originMsg= $(".message_present:first").html();
        $(".message_present:first").html(originMsg + " " + msg);
       /* $(".message_present:first").css("background-color", "blue");*/

    });
});

/*$( document ).click(function() {
    $( "#toggle" ).effect("bounce",{ distance: 5 },"slow")
});*/

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

var myPlayer = neplayer("my_video");
myPlayer.setDataSource([
 {type: "rtmp/flv",src: "rtmp://v4622ebf4.live.126.net/live/9f11e521670f44699f23ca1aff50db7a"}
 /*  {type: "video/x-flv",src: "http://www.example.com/path/to/video.flv"},
 {type: "application/x-mpegURL",src: "http://www.example.com/path/to/video.hls"}*/
 ]);
