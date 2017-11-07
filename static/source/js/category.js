/**
 * Created by Administrator on 2017/6/24.
 */

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
            },
            error : function () {
                console.log('Get room list  error...');
            }
        })
    }
});


function search () {
    var content = $('#ipt_search').val();
    console.log('search = ' +  content);
}


