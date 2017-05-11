// JavaScript Document
function show_video_panel()
{
	document.getElementById("videoblackarea").style.display='block';
}


/////

function show_video()
{
	
 window.location="view_videos.php?vid_no=1";
	
}
///////////


function showphoto(imagename)
{
var nextval;
var prevval;

var imagepath="photos/exterior/"+imagename+".jpg";
document.getElementById("photo").style.backgroundImage =   'url('+imagepath+')';//"url('photos/exterior/05.jpg\')";

document.getElementById("photo_id").value=imagename;


if(imagename!="1")
{
document.getElementById("prevval").value=parseInt(imagename)-1;
//document.getElementById("prevval").value="0"+document.getElementById("prevval").value;
}

if(imagename=="11")
document.getElementById("arrow_right").style.display='none';
else document.getElementById("arrow_right").style.display='block';

if(imagename=="1")
document.getElementById("arrow_left").style.display='none';
else document.getElementById("arrow_left").style.display='block';



}
///////////
function next_photo()
{
	
 
imagename=document.getElementById("photo_id").value;

 //alert(imagename);
if(imagename!="11")
{
document.getElementById("nextval").value=parseInt(imagename)+1;
//alert(document.getElementById("nextval").value);
//document.getElementById("nextval").value="0"+document.getElementById("nextval").value;
}

showphoto(document.getElementById("nextval").value);

}

///////////
function prev_photo()
{
	imagename=document.getElementById("photo_id").value;

 if(imagename!="1")
{
document.getElementById("prevval").value=parseInt(imagename)-1;
//document.getElementById("prevval").value="0"+document.getElementById("prevval").value;
}
 //alert(document.getElementById("prevval").value);
showphoto(document.getElementById("prevval").value);
}


/////////
function close_video()
{ 

/*var myVideo = document.getElementsByTagName('video')[0];
myVideo.pause();*/
//document.getElementById("my_video_1").pause();


//document.getElementById("videoblackarea").style.display = 'none';
 window.location="index.html";
//alert(imagepath);
}