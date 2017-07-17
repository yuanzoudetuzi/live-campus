var APPKEY = '5951c4af2a9275716fe3b289';
var TOPIC_BULLET = 'bullet';
var TOPIC_LIKE = 'like';
var TOPIC_STAT = 'stat';
var TEXTS = ['♪', '♩', '♭', '♬'];
var colorSelect  = {
  'one': 'F08080',
  'two': 'ADD8E6',
  'three': 'FFFF00',
  'four': 'FFA07A',
  'five': '90EE90',
  'six': '9370DB',
  'seven': '6BDAEA'
}
var modeSelect = {
    'top': 1,
    'bottom': 2,
    'left': 6,
    'right': 2
}
var color = parseInt('0x' + 'ff0000');
var mode = 2;
/*var colorBtnArray = document.getElementsByClassName('color_select_panel');*/
/*
$('.color_select').click(function () {
    var tempClass =  $(this).attr('class').split(' ');
  /!*  console.log('color = ' + tempClass[1]);*!/
    color = colorSelect[tempClass[1]];
    color = parseInt('0x' +  color);
    $('.msg_color_drop').css('display', 'none');
});
*/

/*$('.location_select').click(function () {
    var tempClass =  $(this).attr('class').split(' ');
   /!* console.log('color = ' + tempClass[1]);*!/
    mode = modeSelect[tempClass[1]];
    $('.msg_location_drop').css('display', 'none');
});*/

function init() {
 /* var player = $('#my-player');*/
  var bullet = $('#my_comment_stage');
 /* player.css("width", "100%");
  player.height(player.width() * 9 / 16.0);
*/console.log("bullet width = " + bullet.width());
 /* bullet.css("width", "100%");
  bullet.css("height","100px");*/
  console.log("bullet width = " + bullet.width());
  console.log("bullet height = " + bullet.height());
  var video = $('#my_video');
 /* video.width(player.width());
  video.height(player.height());
  video.css("display", "block");

  // videojs 生成的 video 标签，若不调整横竖屏切换时视频会不满或溢出
  video = $('#live-video_html5_api');
  video.width(player.width());
  video.height(player.height());
  video.css("display", "block");*/

  var cm = new CommentManager(document.getElementById('my_comment_stage'));
  cm.init();
  cm.start();

  window.cm = cm;
  window.cm_width = bullet.width();
  window.cm_height = bullet.height();
   /* window.cm_width = 1200;
    window.cm_height = 528;
*/
    console.log("cm_width = " +  window.cm_width);
    console.log("cm_height = " +  window.cm_height);
}

$(document).ready(function() {

  $('#span-status').text('正在连接云巴服务器...');

  window.onresize = init;
  init();

  window.yunba = new Yunba({
    server: 'sock.yunba.io',
    port: 3000,
    appkey: APPKEY
  });

  // 初始化云巴 SDK
  yunba.init(function(success) {
    if (success) {
      var cid = Math.random().toString().substr(2);
      console.log('cid: ' + cid);
      window.alias = cid;

      // 连接云巴服务器
      yunba.connect_by_customid(cid,
        function(success, msg, sessionid) {
          if (success) {
            console.log('sessionid：' + sessionid);

            // 设置收到信息回调函数
            yunba.set_message_cb(yunba_msg_cb);

            // 设置别名
            yunba.set_alias({
              'alias': alias
            }, function(data) {

              // 订阅弹幕 TOPIC
              yunba.subscribe({
                  'topic': TOPIC_BULLET
                },
                function(success, msg) {
                  if (success) {
                    console.log('subscribed');

                    // 订阅点赞 TOPIC
                    yunba.subscribe({
                        'topic': TOPIC_LIKE
                      },
                      function(success, msg) {
                        if (success) {
                          console.log('subscribed');

                          // 订阅统计信息 TOPIC
                          yunba.subscribe({
                              'topic': TOPIC_STAT
                            },
                            function(success, msg) {
                              if (success) {
                                console.log('subscribed');
                                yunba_sub_ok();
                                // msg_notify('success', '连接服务器成功~');
                              } else {
                                console.log(msg);
                                // msg_notify('error', msg);
                              }
                            }
                          );
                        } else {
                          console.log(msg);
                          // msg_notify('error', msg);
                        }
                      }
                    );
                  } else {
                    console.log(msg);
                    // msg_notify('error', msg);
                  }
                }
              );
            });

          } else {
            console.log(msg);
            // msg_notify('error', msg);
          }
        });
    } else {
      console.log('yunba init failed');
      // msg_notify('error', '连接出错，请尝试刷新~');
    }
  });
});

$('#msg_send_btn').click(function() {

  /*switch ($('#bullet-type').prop('selectedIndex')) {
    case 0:
      mode = 2;
      break;

    case 1:
      mode = 1;
      break;

    case 2:
      mode = 4;
      break;

    case 3:
      mode = 5;
      break;

    case 4:
      mode = 6;
      break;
  }*/
  console.log("mode = "+mode);
  var text = $('#msg_input').val();


  // var dur = parseInt($('#bullet-dur').val());
  var dur = 3000;

  var bullet = {
    "mode": mode,
    "text": text,
    "color": color,
    "dur": dur
  };

  yunba.publish({
      topic: TOPIC_BULLET,
      msg: JSON.stringify(bullet)
    },
    function(success, msg) {
      if (!success) {
        console.log(msg);
      }
    }
  );
});

$('#btn-like').click(function() {
  yunba.publish({
      topic: TOPIC_LIKE,
      msg: 'like'
    },
    function(success, msg) {
      if (!success) {
        console.log(msg);
      }
    }
  );
});

var danmu;
var danmu_num = 0;
function yunba_msg_cb(data) {
  console.log('yunba_msg-cb');
  // console.log(data);
  if (data.topic === TOPIC_BULLET) {
    // 弹幕
      console.log('Topic:' + data.topic + ',Msg:' + data.msg);
      console.log('弹幕 = ' +JSON.parse(data.msg).text);
      danmu = JSON.parse(data.msg).text;
      if(danmu_num%2==0) {
          document.getElementById('present_msg').innerHTML += "<div class='talk_box'><div class='talk_img1'></div><div class='talk_txt1'>" + danmu +"</div></div>";
      } else {
          document.getElementById('present_msg').innerHTML += "<div class='talk_box'><div class='talk_img2'></div><div class='talk_txt2'>" + danmu +"</div></div>";
      }
      document.getElementById('present_msg').scrollTop = document.getElementById('present_msg').scrollHeight;
      cm.send(JSON.parse(data.msg));
      danmu_num++;
      if(danmu_num == 20){
          document.getElementById('present_msg').innerHTML = '';
          danmu_num = 0;
      }


  } else if (data.topic === TOPIC_LIKE) {
    // 点赞
    var num = parseInt($('#like-number').text()) + 1;
    $('#like-number').text(num);
    show_like_animate();
  } else if (data.topic === TOPIC_STAT) {
    // 在线信息
    var msg = JSON.parse(data.msg);
    var num = msg.presence;
    $('#online-number').text(num);
  } else if (data.topic === alias) {
    // 初始在线和点赞信息

    var msg = JSON.parse(data.msg);
    console.log('alias like = ' + msg.like + ' 在线 = ' + msg.presence);
    var num = parseInt($('#online-number').text()) + msg.presence;
    $('#online-number').text(num);
    num = msg.like;
    $('#like-number').text(num);
  }
}

function yunba_sub_ok() {
  setTimeout(function() {
        $('.msg_box').css("display", "block");
       /* $('#msg_send_btn').attr("disabled", false);*/
    }, 1000);
}

function show_like_animate() {
  var x = cm_width * 9 / 10;
    /*var x = (cm_width - 15) ;*/
  var y = cm_height * 7 / 8;
  console.log('x = '+x);
  console.log('y = '+y);
  var text = TEXTS[Math.floor(Math.random() * TEXTS.length)];
  var color = 0xf0f0f0 + Math.floor(Math.random() * 0x0f0f0f);

  var bullet = {
    "stime": 0,
    "size": 32,
    "color": color,
    "mode": 7,
    "pool": 1,
    "position": "absolute",
    "dbid": 104079685,
    "hash": "9bd49c01",
    "border": false,
    "shadow": false,
    "x": x,
    "y": y,
    "text": text,
    "rZ": 0,
    "rY": 0,
    "motion": [{
      "x": {
        "from": x,
        "to": x,
        "dur": 1500,
        "delay": 0
      },
      "y": {
        "from": y,
        "to": y - cm_height / 2,
        "dur": 1500,
        "delay": 0
      }
    }],
    "movable": true,
    "font": "宋体",
    "dur": 1500,
    "opacity": 1,
    "alpha": {
      "from": 1,
      "to": 0
    }
  };

  cm.send(bullet);
}
