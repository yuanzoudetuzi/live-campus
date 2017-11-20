/**
 * Created by Administrator on 2017/7/14.
 */
var cardFileName;
function inputCardImage(input) {
    var imageType = /(.jpg|.jpeg|.gif|.png)$/;
    var file = input.files[0];
    cardFileName = file.name;
    console.log('  cardFileName = ' +   cardFileName);
    console.log('file image');
    console.log(file);
    if ( !imageType.test(file.type) ) {
        alert("请选择图片类型上传");
    } else {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var img = new Image();
            img.onload = function () {
                console.log('img height = ' +img.height);
                console.log('img width = ' +img.width);
                showCardImage(img);
            }
            img.src = data;
        }
        reader.readAsDataURL(file);
    }
};

function showCardImage(img) {
    var canvas = document.getElementById("cardImage");
    var ctx = canvas.getContext("2d");
    var MAX_WIDTH = $('#card_contain').width();
    var MAX_HEIGHT = $('#card_contain').height();
    console.log(' MAX_WIDTH = ' + MAX_WIDTH + " MAX_HEIGHT =" +  MAX_HEIGHT);
    var width = img.width;
    var height = img.height;
    var imgWidth,imgHeight;
    console.log('img height1 = ' + height);
    console.log('img width2 = ' + width);
    if(width < MAX_WIDTH && height < MAX_HEIGHT) {
        imgWidth = width;
        imgHeight = height;
    } else {
        var pWidth = width / (height / MAX_HEIGHT);
        var pHeight = height / (width / MAX_WIDTH);
        imgWidth = width > height ?MAX_WIDTH: pWidth;
        imgHeight = height > width ?MAX_HEIGHT : pHeight;
    }
    console.log('imgHeight = ' + imgHeight);
    console.log('imgWidth = ' + imgWidth);
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx.drawImage(img, 0, 0, imgWidth,imgHeight);
}

function updateCardImag() {
    if(!cardFileName) {
        $('.alert_certify').removeClass('alert-info');
        $('.alert_certify').addClass('alert-danger');
        $('#alert_html').html('请先上传照片！');
        $('.alert_certify').show();
        return;
    }
    var canvas = document.getElementById("cardImage");
    canvas.toBlob(function(blob) {
        var form = new FormData();
        // image.png 则是文件名，由于 base64 的图片信息是不带文件名的，可以手动指定一个
        form.append('img', blob,cardFileName);
        form.append('uid', sessionStorage.getItem('uid'));
        $.ajax({
            type: 'POST',
            url:"http://www.campuslive.cn:8080/user/certification/upload" ,
            contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
            cache: false,
            processData:false,  // 告诉jQuery不要去处理发送的数据
            data: form,
            success: function (data) {
                console.log('上传头像 code1 = ' + data.code );
                if(data.code == 200){
                    alert('上传成功');
                    console.log("上传成功");
                    $('.alert_certify').removeClass('alert-danger');
                    $('.alert_certify').addClass('alert-info');
                    $('#alert_html').html('上传信息成功,等待后台认证！');
                    $('.alert_certify').show();
                } else if (data.code == 60545) {
                    console.log('上传用户头像或者用户id为空');
                } else if (data.code == 6031) {
                    console.log('用户不存在');
                } else if (data.code == 6056){
                    console.log('上传学生证失败');
                }
                else {
                    console.log('上传用户头像上传失败');
                }
            },
            error:function (XmlHttpRequest) {
                console.log('Update avatar ' + XmlHttpRequest.responseText);
            }
        });
    });
}
new Vue({
    el:'#app',
    data:{
        personInfo:{},
        isInfo:true,
        isCert:false,
        attenNum:'',
        fansNum:'',
        admireArray:[],
        fanArray :[]

    },
    components: {
        'list-item': {
            template: '#list_item',
            props: ['avatar', 'name']
        }
    },
    methods:{
        getPersonAtten:function () {
            var that = this;
            $.ajax({
                type:'GET',
                contentType : 'application/json',
                url : 'http://www.campuslive.cn:8080/user/anchorlist?uid=' + sessionStorage.getItem('uid'),
               /* async: false,*/
                processData : false,
                dataType : 'json',
                success: function (data) {
                    var num = data.ret.list.length;
                    that.admireArray = data.ret.list;
                    that.attenNum = num;
                    for(var i = 0; i < num; i++) {
                        that.admireArray[i].imgAvatar =  that.admireArray[i].imgAvatar || "/static/source/img/avatar.png";
                    }
                    console.log('attenNum' + that.attenNum);
                    console.log('atten = ');
                    console.log(that.admireArray);
                },
                error: function () {
                    console.log('Get personal attention  from server Error');
                }
            });
        },
       getPersonFans:function() {
            var that = this;
            $.ajax({
                type:'GET',
                contentType : 'application/json',
                url : 'http://www.campuslive.cn:8080/user/fanlist?uid=' + sessionStorage.getItem('uid'),
             /*   async: false,*/
                processData : false,
                dataType : 'json',
                success: function (data) {
                    var num = data.ret.list.length;
                    that.fanArray = data.ret.list;
                    for(var i = 0; i < num; i++) {
                        that.fanArray[i].imgAvatar =  that.fanArray[i].imgAvatar || "/static/source/img/avatar.png";
                    }
                    that.fansNum =  num;
                    console.log('fan = ');
                    console.log(that.fanArray);
                },
                error: function () {
                    console.log('Get personal fanslist  from server Error');
                }
            });
       },
        getCertification:function () {
            var that = this;
            $.ajax({
                type:'GET',
                contentType : 'application/json',
                url : 'http://www.campuslive.cn:8080/user/certification/check/' + sessionStorage.getItem('uid'),
                processData : false,
                dataType : 'json',
                success: function (data) {
                   if(data.code == '200') {
                       that.personInfo.certification = true;
                   } else {
                       that.personInfo.certification = false;
                   }
                   console.log('certification = ' +  that.personInfo.certification);
                },
                error: function () {
                    console.log('Get personal fanslist  from server Error');
                }
            });
        },
        getPersonInfo:function () {
            var that = this;
            if(!sessionStorage.getItem('uid')) {
                alert('请先登陆');
                return;
            }
            $.ajax({
                type:'GET',
                contentType : 'application/json',
                url : 'http://www.campuslive.cn:8080/user/userinfo?uid=' + sessionStorage.getItem('uid'),
                /* async: false,*/
                processData : false,
                dataType : 'json',
                success: function (data) {
                  /*  $('#personAvatar').css('background-image',sessionStorage.getItem('avatarUrl'));*/
                    that.personInfo = data.ret;
                    console.log('personInfo');
                    console.log(that.personInfo);
                    console.log(that.personInfo.imgAvatar);
                    if(!that.personInfo.imgAvatar) {
                        that.personInfo.imgAvatar = "/static/source/img/avatar.png";  /*设置默认头像*/
                    }
                },
                error: function () {
                    console.log('Get personal infomation from server Error');
                }
            });
        },
        showCertifyPage:function () {
            this.isInfo = false;
            this.isCert = true;
            var that = this;
        },
        goBackInfo:function () {
            this.isCert = false;
            this.isInfo = true;
        },
        updateInfo: function() {
            var uid = sessionStorage.getItem('uid');
            var username = $('#nickname').html();
            var sex =  $('#gender').val();
            var age = $('#age').val();
            var email = $('#email').val();
            var phone = $('#telephone').val();
            requestdata = '{"userID" : "' + uid + '","username" : "' + username + '","sex" : "' + sex +
                '","email" : "'+email + '","phone" : "' +
                phone +'"}';
            console.log('update info = ' + requestdata);
            var that = this;
            $.ajax({
                type : 'POST',
                contentType : 'application/json',
                url : 'http://www.campuslive.cn:8080/user/info/update',
                processData : false,
                dataType : 'json',
                data : requestdata,
                success : function (data) {
                    console.log('更改用户信息  data.code = ' + data.code);
                    if(data.code == '200') {
                        $('#update_success').css('display','flex');
                        $('#update_success').html('更新个人信息成功~');
                        setTimeout(function () {
                            $('#update_success').html('');
                            $('#update_success').css('display','none');
                        },5000);
                        that.personInfo =  requestdata;
                        console.log("更改用户信息成功");
                    } else if (data.code == '6033') {
                        alert('更改用户信息失败');
                        console.log("更改用户信息失败");
                    }  else if (data.code ==  '6022') {

                    } else if(data.code == '6021'){

                    } else {

                    }
                },
                error : function (XmlHttpRequest,textStatus, errorThrown) {
                    console.log('Update information ' + XmlHttpRequest.responseText);
                }
            });
        },
        inputCard:function () {
            console.log('input change');
        }
    },
    created:function(){
         this.getPersonInfo();
         this.getCertification();
         this.getPersonAtten();
         this.getPersonFans();
    }
});


function  showAvatarBox() {
    var bh = $("body").height();
    var bw = $("body").width();
    $("#cover_layer").css({
        height:bh,
        width:bw,
        display:"block"
    });
    $("#avatar_box").show();
}

function  hiddenAvatarBox() {
    $("#cover_layer").css({
        height:0,
        width:0,
        display:"block"
    });
    $("#avatar_box").hide();
}

var postFile = {
    /*获取浏览器可视宽、高*/
     winSize:function() {
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window )){
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    },

    init: function () {
        var t = this;
        t.regional = document.getElementById('label');
        t.getImage = document.getElementById('get_image');
        t.editPic = document.getElementById('edit_pic');
        t.editBox = document.getElementById('cover_box');
        t.vw =  postFile.winSize().width/100;    // 获取单位1vw
        console.log('t.vw = '+ t.vw);
        t.px = 0;    //background image x
        t.py = 0;    //background image y
        t.sx = 0.5*t.vw;    //crop area x
        t.sy = 0.5*t.vw;    //crop area y
        t.sHeight = 10*t.vw;    //crop area height
        t.sWidth = 10*t.vw;  //crop area width
        document.getElementById('temp_avatar_file').addEventListener("change", t.handleFiles, false);
        document.getElementById('save_button').onclick = function () {
            t.editPic.height = t.sHeight;
            t.editPic.width = t.sWidth;
            var ctx = t.editPic.getContext('2d');
            var images = new Image();
            images.src = t.imgUrl;
            images.onload = function () {
                ctx.drawImage(images, t.sx, t.sy, t.sHeight, t.sWidth, 0, 0, t.sHeight, t.sWidth);
                document.getElementById('show_pic').getElementsByTagName('img')[0].src = t.editPic.toDataURL();
                postFile.uploadAvatar (t);
            }

        }
    },
    handleFiles: function () {
        var fileList = this.files[0];
        var oFReader = new FileReader();
        oFReader.readAsDataURL(fileList);
        oFReader.onload = function (oFREvent) {
            postFile.paintImage(oFREvent.target.result);
        };
    },
    paintImage: function (url) {
        var t = this;
        var createCanvas = t.getImage.getContext("2d");
        var img = new Image();
        img.src = url;
        /*对选取的图片进行缩放处理*/
        img.onload = function () {
            if (img.width < t.regional.offsetWidth && img.height < t.regional.offsetHeight) {
                t.imgWidth = img.width;
                t.imgHeight = img.height;
            } else {
                var pWidth = img.width / (img.height / t.regional.offsetHeight);
                var pHeight = img.height / (img.width / t.regional.offsetWidth);
                t.imgWidth = img.width > img.height ? t.regional.offsetWidth : pWidth;
                t.imgHeight = img.height > img.width ? t.regional.offsetHeight : pHeight;
            }
            t.px = (t.regional.offsetWidth - t.imgWidth) / 2 + 'px';
            t.py = (t.regional.offsetHeight - t.imgHeight) / 2 + 'px';
            t.getImage.height = t.imgHeight;
            t.getImage.width = t.imgWidth;
            t.getImage.style.left = t.px;
            t.getImage.style.top = t.py;
            createCanvas.drawImage(img, 0, 0, t.imgWidth, t.imgHeight);
            t.imgUrl = t.getImage.toDataURL();
            t.cutImage();
            t.drag();
        };

    },
    cutImage: function () {
        var t = this;
        //绘制遮罩层：
        t.editBox.height = t.imgHeight;
        t.editBox.width = t.imgWidth;
        t.editBox.style.display = 'block';
        t.editBox.style.left = t.px;
        t.editBox.style.top = t.py;
        var cover = t.editBox.getContext("2d");
        cover.fillStyle = "rgba(0, 0, 0, 0.5)";
        cover.fillRect(0, 0, t.imgWidth, t.imgHeight);
        cover.clearRect(t.sx, t.sy, t.sHeight, t.sWidth);

        //预览图片
        document.getElementById('show_edit').style.background = 'url(' + t.imgUrl + ')' + -t.sx + 'px ' + -t.sy + 'px no-repeat';
        document.getElementById('show_edit').style.height = t.sHeight + 'px';
        document.getElementById('show_edit').style.width = t.sWidth + 'px';
    },
    getOffsetRectLeft :function (ele) {
        var box=ele.getBoundingClientRect();
        var body=document.body,
            docElem=document.documentElement;
        //获取页面的scrollTop,scrollLeft(兼容性写法)
        var scrollTop=window.pageYOffset||docElem.scrollTop||body.scrollTop,
            scrollLeft=window.pageXOffset||docElem.scrollLeft||body.scrollLeft;
        var clientTop=docElem.clientTop||body.clientTop,
            clientLeft=docElem.clientLeft||body.clientLeft;
        var top=box.top+scrollTop-clientTop,
            left=box.left+scrollLeft-clientLeft;
        return {
            //Math.round 兼容火狐浏览器bug
            top:Math.round(top),
            left:Math.round(left)
        }
    },

    drag: function () {
        console.log("drag");
        var t = this;
        var draging = false;
        var startX = 0;
        var startY = 0;
        document.getElementById('cover_box').onmousemove = function (e) {
            /*获得t.regional，即cover_box离浏览器左边跟上边的间距*/
            t.regional.myOffsetLeft = postFile.getOffsetRectLeft(t.regional).left;
            t.regional.myOffsetTop = postFile.getOffsetRectLeft(t.regional).top;
            var pageX = e.pageX - ( t.regional.myOffsetLeft + this.offsetLeft );
            var pageY = e.pageY - ( t.regional.myOffsetTop + this.offsetTop );
            if (pageX > t.sx && pageX < t.sx + t.sWidth && pageY > t.sy && pageY < t.sy + t.sHeight) {
                this.style.cursor = 'move';
                this.onmousedown = function () {
                    console.log("mousedown");
                    draging = true;
                    t.ex = t.sx;
                    t.ey = t.sy;
                    startX = e.pageX - ( t.regional.myOffsetLeft+ this.offsetLeft );
                    startY = e.pageY - ( t.regional.myOffsetTop + this.offsetTop );
                }
                window.onmouseup = function () {
                    draging = false;
                }
                if (draging) {
                    if (t.ex + (pageX - startX) < 0) {
                        t.sx = 0;
                    } else if (t.ex + (pageX - startX) + t.sWidth > t.imgWidth) {
                        t.sx = t.imgWidth - t.sWidth;
                    } else {
                        t.sx = t.ex + (pageX - startX);
                    }
                    if (t.ey + (pageY - startY) < 0) {
                        t.sy = 0;
                    } else if (t.ey + (pageY - startY) + t.sHeight > t.imgHeight) {
                        t.sy = t.imgHeight - t.sHeight;
                    } else {
                        t.sy = t.ey + (pageY - startY);
                    }
                    t.cutImage();
                }
            } else {
                this.style.cursor = 'auto';
            }
        };

    },

    uploadAvatar: function (t) {
        if (!sessionStorage.getItem('uid')) {
            alert('请先登陆');
        } else {
            var avatar = t.editPic.toDataURL();
            console.log('avatar = ' + avatar);
            // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
            avatar=avatar.split(',')[1];
            avatar=window.atob(avatar);
            var ia = new Uint8Array(avatar.length);
            for (var i = 0; i < avatar.length; i++) {
                ia[i] = avatar.charCodeAt(i);
            };
            // canvas.toDataURL 返回的默认格式就是 image/png
            var blob=new Blob([ia], {type:"image/png"});
            var fd=new FormData();
            // image.png 则是文件名，由于 base64 的图片信息是不带文件名的，可以手动指定一个
            fd.append('avatar',blob,'image.png');
            fd.append('uid',sessionStorage.getItem('uid'));
            $.ajax({
                type: 'POST',
                url:"http://www.campuslive.cn:8080/user/avatar/upload" ,
               /* contentType:"multipart/form-data",*/
                contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                cache: false,
                processData:false,  // 告诉jQuery不要去处理发送的数据
                data: fd,

                success: function (data) {
                    console.log('上传头像 code1 = ' + data.code );
                    if(data.code == 200){
                        alert('上传成功');
                        hiddenAvatarBox();
                        console.log("上传成功");
                    } else if (data.code == 6053) {
                        console.log('上传用户头像或者用户id为空');
                    } else if (data.code == 6054) {
                        nsole.log('上传用户头像上传失败6054');
                    }
                    else {
                        console.log('上传用户头像上传失败');
                    }
                },
                error:function (XmlHttpRequest) {
                    console.log('Update avatar ' + XmlHttpRequest.responseText);
                }
            });
        }

    }

};
postFile.init();
