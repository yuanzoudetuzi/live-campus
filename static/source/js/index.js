/**
 * Created by Administrator on 2017/11/6.
 */
$(document).ready(function () {
    /* initNavigation();
     hoverNavigation();*/
    rid = 1;
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

new Vue({
    el:'#app',
    data:{
        roomList:[],
        asideList:[]
    },
    components: {
        'room-box': {
            template: '#room_box',
            props: ['room_img', 'username', 'category']
        },
        'aside-box': {
            template: '#aside_box',
            props: ['aside_img']
        }
    },
    methods:{
        jumpRoom:function (rid) {
            console.log('jump rid = ' + rid);
            window.location.href = 'http://www.campuslive.cn:8080/room/' + rid;
        }
    },
    created:function(){
        //get请求
        var that = this;
        $.ajax({
            type : 'GET',
            contentType : 'application/json',
            url : 'http://www.campuslive.cn:8080/room/roomlist?records=12&pnum=1',
            async: false,
            processData : false,
            dataType : 'json',
            success : function (data) {
                var len = data.ret.list.length;
                if(len <= 4) {
                    that.roomList = data.ret.list;
                } else {
                    that.roomList = data.ret.list.slice(0,4);
                }
                if(len <= 3) {
                    that.asideList = data.ret.list;
                } else {
                    that.asideList = data.ret.list.slice(-4,-1);
                }
            },
            error : function () {
                console.log('Get room list  error...');
            }
        })
    }
});