/**
 * Created by Administrator on 2017/6/24.
 */
/**
 * Created by Administrator on 2017/4/25.
 */
/*var Vue = require('vue');
var VueResource = require('vue-resource');*/

var roomList;
$(document).ready(function () {
   /* getAllRooms();*/
});

new Vue({
    el:'#app',
    data:{
      roomList:[{description:'hello',username:'ylt',category:'sport'}],
        msg:'hello'
    },
    components: {
        'room-box': {
            template: '#room_box',
            props: ['room_img', 'room_descri', 'play_num', 'danmu_num']
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
                that.roomList = data.ret.list;
                console.log('this = ' + this)
                console.log('roomList = ' + this.roomList)
            },
            error : function () {
                console.log('Get room list  error...');
            }
        })
    }
});

/*
function getAllRooms() {
    $.ajax({
        type : 'GET',
        contentType : 'application/json',
        url : 'http://www.campuslive.cn:8080/room/roomlist?records=12&pnum=1',
        async: false,
        processData : false,
        dataType : 'json',

        success : function (data) {
            console.log('data.code = ' + data.code);
            console.log('There are ' + data.ret.list.length + " rooms!" );
            console.log('First room rid is  ' + data.ret.list[0].rid);
            roomList = data.ret.list;
            showRoomList();
            /!*window.location.href="/";*!/
        },
        error : function () {
            console.log('Get room list  error...');
        }
    })
}
*/

function showRoomList() {
    console.log('showRoomList');
    var contain = document.getElementById('room_list_contain');
    var i;
    var max_i = Math.ceil(roomList.length/3);
    var max_j;
    for(i = 0; i < max_i; i++ ) {
        // console.log('i = ' + i);
        var room_list = document.createElement('div');
        room_list.className = 'row';
        /*处理最后一排不满3个房间的情况*/
        if (i == max_i -1) {
            max_j = roomList.length - 3*i;
        }  else {
            max_j = 3;
        }
        for(var j = 0; j < max_j ; j++) {
            // console.log('j = ' + j);
            index = 3*i + j;
            var room = document.createElement('div');
            room.className = 'room_box col-xs-12 col-md-3';
            var img = document.createElement('img');
            img.src = roomList[index].cover;
            img.onclick = (function (m) {
                return function () {
                    console.log('img.oncilck');
                    // window.location.href = 'http://www.campuslive.cn:8080/room/roominfo?id='+roomList[index].rid + '&type=rid';
                    window.location.href = 'http://www.campuslive.cn:8080/room/' + roomList[m].rid;
                    console.log(' onclick roomList[index].rid = '  +  roomList[m].rid);
                }
            })(index);

            console.log('index = ' + index + '     roomList[index].rid = '  +  roomList[index].rid);
            var title = document.createElement('h3');
            title.innerText = roomList[index].title;
            var span1 = document.createElement('span');
            var i1 = document.createElement('i');
            i1.className = 'play_num';
            span1.appendChild(i1);
            var span2 = document.createElement('span');
            var i2 = document.createElement('i');
            i2.className = 'danmu_num';
            span2.appendChild(i2);
            room.appendChild(img);
            room.appendChild(title);
            room.appendChild(span1);
            room.appendChild(span2);
            room_list.appendChild(room);
        }
        contain.appendChild(room_list);
    }
}
/*
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
        console.log('over img = ' + img);
    });

    $('.nav_btn').mouseout(function () {
         $(this).css("background-image","url(/static/source/img/" + img + ")");
        console.log('out  img = ' + img);

    });
}
*/


function search () {
    var content = $('#ipt_search').val();
    console.log('search = ' +  content);
}


