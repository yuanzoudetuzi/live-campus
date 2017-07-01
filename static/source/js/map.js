/**
 * Created by Administrator on 2017/4/20.
 */
var mapContainer = document.getElementById("myMap");
var points = [];
var map = new BMap.Map(mapContainer);
var mapStyle = { style : "mapbox" }
var dayStyle = {style:'light'};
var nightStyle = {style:'midnight'}
var myDate = new Date();
console.log(myDate.getHours());
if(myDate.getHours()<19 && myDate.getHours()>7) {
    map.setMapStyle(dayStyle);
}  else {
    map.setMapStyle(nightStyle);
}
map.centerAndZoom(new BMap.Point(103.937404,30.756035), 17);
map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
//map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开
// map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放*/
for(var i = 0; i!=10; i++) {
    points.push(new BMap.Point(103.937404-Math.random()/100,30.756035-Math.random()/100));
}
/*  var convertor = new BMap.Convertor();                //将GPS坐标转换为百度地图坐标
 convertor.translate(points, 1, 5, translateCallback);*/
translateCallback = function (data){
    var imgArry = new Array();
    var myIcon1 = new BMap.Icon("./img/head1.png", new BMap.Size(300,157));
    var myIcon2 = new BMap.Icon("./img/head2.png", new BMap.Size(300,157));
    var myIcon3 = new BMap.Icon("./img/head3.png", new BMap.Size(300,157));
    var myIcon4 = new BMap.Icon("./img/head4.png", new BMap.Size(300,157));
    imgArry.push(myIcon1);
    imgArry.push(myIcon2);
    imgArry.push(myIcon3);
    imgArry.push(myIcon4);

    if(data.status === 0) {
        for (var i = 0; i < data.points.length; i++) {
            var marker = new BMap.Marker(data.points[i],{icon:imgArry[i%4]});  // 创建图标
            var label = new BMap.Label("Hi,快来看我主播~",{offset:new BMap.Size(40,-10)});
            marker.setLabel(label);
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            map.addOverlay(marker);
            marker.addEventListener("click",getInform);
            function  getInform() {
                var p = marker.getPosition();       //获取marker的位置
                //alert("marker的位置是" + p.lng + "," + p.lat);
                window.location.href="live.html?backurl="+window.location.href;
            }
        }
    }
};

setTimeout(function(){
    var convertor = new BMap.Convertor();                //将GPS坐标转换为百度地图坐标
    convertor.translate(points, 1, 5, translateCallback);
}, 1000);
