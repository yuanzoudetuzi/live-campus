$(document).ready(function(){console.log("document.body.clientHeight = "+document.body.clientHeight),$("#nav_area").height(document.body.clientHeight-60),$("#publish_area").height(document.body.scrollHeight-60),$("#interactive_area").height(document.body.scrollHeight-60)});var cameraList,microPhoneList,cameraOptions="",microPhoneOptions="",publishBtn=document.getElementById("publishBtn"),previewBtn=document.getElementById("previewBtn"),testInput=document.getElementsByClassName("u-input"),myPublisher=new nePublisher("publish_video",{videoWidth:960,videoHeight:540,fps:20,bitrate:1500},{previewWindowWidth:862,previewWindowHeight:486,wmode:"transparent",quality:"high",allowScriptAccess:"always"},function(){console.log("hello===="),cameraList=this.getCameraList(),microPhoneList=this.getMicroPhoneList(),console.log(cameraList,microPhoneList);for(e=cameraList.length-1;e>=0;e--)cameraOptions='<option value="'+e+'">'+cameraList[e]+"</option>"+cameraOptions;for(var e=microPhoneList.length-1;e>=0;e--)microPhoneOptions='<option value="'+e+'">'+microPhoneList[e]+"</option>"+microPhoneOptions;document.getElementById("cameraSelect").innerHTML=cameraOptions,document.getElementById("microPhoneSelect").innerHTML=microPhoneOptions},function(e,t){console.log(e,t)}),qualityList=[{fps:20,bitrate:600,videoWidth:480,videoHeight:360},{fps:20,bitrate:800,videoWidth:640,videoHeight:480},{fps:20,bitrate:1500,videoWidth:960,videoHeight:540}];console.log("after_hello====");var getCameraIndex=function(){var e=document.getElementById("cameraSelect"),t=e.selectedIndex;return e.options[t].value},getMicroPhoneIndex=function(){var e=document.getElementById("microPhoneSelect"),t=e.selectedIndex;return e.options[t].value},getQualityOption=function(){var e=document.getElementById("qualitySelect").selectedIndex;return qualityList[e]},startPreview=function(){myPublisher.startPreview(getCameraIndex()),document.getElementsByClassName("u-status")[0].innerHTML="预览中"},startPublish=function(){var e=document.getElementById("publishUrl").value;startPublishCall(),myPublisher.setCamera(getCameraIndex()),myPublisher.setMicroPhone(getMicroPhoneIndex()),myPublisher.startPublish(e,getQualityOption(),function(e,t){console.log(e,t),alert(e+"："+t),stopPublishCall()})},stopPublish=function(){myPublisher.stopPublish(),stopPublishCall()},startPublishCall=function(){console.log("推流开始"),document.getElementsByClassName("u-status")[0].innerHTML="直播中",publishBtn.innerHTML="停止直播",publishBtn.onclick=stopPublish;for(var e=testInput.length-1;e>=0;e--)testInput[e].disabled=!0;previewBtn.disabled=!0},stopPublishCall=function(){console.log("推流结束"),document.getElementsByClassName("u-status")[0].innerHTML="预览中",publishBtn.innerHTML="开始直播",publishBtn.onclick=startPublish;for(var e=testInput.length-1;e>=0;e--)testInput[e].disabled=!1;previewBtn.disabled=!1};