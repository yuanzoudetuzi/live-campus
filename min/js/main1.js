function init(){var e=$("#my-player"),o=$("#my-comment-stage");e.css("width","100%"),e.height(9*e.width()/16),o.css("width","100%");var n=new CommentManager(document.getElementById("my_comment_stage"));n.init(),n.start(),window.cm=n,window.cm_width=o.width(),window.cm_height=o.height(),console.log("cm_width = "+window.cm_width),console.log("cm_height = "+window.cm_height)}function yunba_msg_cb(e){if(console.log("data = "+e),e.topic===TOPIC_BULLET)cm.send(JSON.parse(e.msg));else if(e.topic===TOPIC_LIKE){n=parseInt($("#like-number").text())+1;$("#like-number").text(n),show_like_animate()}else if(e.topic===TOPIC_STAT){n=(o=JSON.parse(e.msg)).presence;$("#online-number").text(n)}else if(e.topic===alias){var o=JSON.parse(e.msg),n=parseInt($("#online-number").text())+o.presence;$("#online-number").text(n),n=o.like,$("#like-number").text(n)}}function yunba_sub_ok(){$("#span-status").text("连接云巴服务器成功～"),setTimeout(function(){$("#form-status").css("display","none"),$("#form-info").css("display","block"),$("#btn-send").attr("disabled",!1)},1e3)}function show_like_animate(){var e=9*cm_width/10,o=7*cm_height/8,n=TEXTS[Math.floor(Math.random()*TEXTS.length)],t={stime:0,size:32,color:15790320+Math.floor(986895*Math.random()),mode:7,pool:1,position:"absolute",dbid:104079685,hash:"9bd49c01",border:!1,shadow:!1,x:e,y:o,text:n,rZ:0,rY:0,motion:[{x:{from:e,to:e,dur:1500,delay:0},y:{from:o,to:o-cm_height/2,dur:1500,delay:0}}],movable:!0,font:"宋体",dur:1500,opacity:1,alpha:{from:1,to:0}};cm.send(t)}var APPKEY="5930d133c714b4903f936da8",TOPIC_BULLET="bullet",TOPIC_LIKE="like",TOPIC_STAT="stat",TEXTS=["♪","♩","♭","♬"];$(document).ready(function(){$("#span-status").text("正在连接云巴服务器..."),window.onresize=init,init(),window.yunba=new Yunba({server:"sock.yunba.io",port:3e3,appkey:APPKEY}),yunba.init(function(e){if(e){var o=Math.random().toString().substr(2);console.log("cid: "+o),window.alias=o,yunba.connect_by_customid(o,function(e,o,n){e?(console.log("sessionid："+n),yunba.set_message_cb(yunba_msg_cb),yunba.set_alias({alias:alias},function(e){yunba.subscribe({topic:TOPIC_BULLET},function(e,o){e?(console.log("subscribed"),console.log("msg = "+o),yunba.subscribe({topic:TOPIC_LIKE},function(e,o){e?(console.log("subscribed"),yunba.subscribe({topic:TOPIC_STAT},function(e,o){e?(console.log("subscribed"),yunba_sub_ok()):console.log(o)})):console.log(o)})):console.log(o)})})):console.log(o)})}else console.log("yunba init failed")})}),$("#btn-send").click(function(){var e=1;switch($("#bullet-type").prop("selectedIndex")){case 0:e=2;break;case 1:e=1;break;case 2:e=4;break;case 3:e=5;break;case 4:e=6}var o={mode:e,text:"hello",color:parseInt("0x"+$("#bullet-color").val()),dur:parseInt($("#bullet-dur").val())};yunba.publish({topic:TOPIC_BULLET,msg:JSON.stringify(o)},function(e,o){e||console.log(o)})}),$("#btn-like").click(function(){yunba.publish({topic:TOPIC_LIKE,msg:"like"},function(e,o){e||console.log(o)})});