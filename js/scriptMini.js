/*
* ルービックキューブ2x2-8x8お告げナビゲーター・ミニ
*
* Copyright (c) 2022-2024 Norio Fujii
* Licensed under the MIT License
*
*/
async function RotCopyc(rot){
    let rote = rot;
    if (rot=="") rote = await clipIn();
    if (rote.slice(0,5)=="j3x3:") setRot([rote(5)]); // "*0 "+ 
    clearTimeout(Tid);
    setTimeout("checkRot();",100);
}

function rotCube(){
    let segs=" translate3d(0,0,0) rotateX("+cubex+"deg) rotateY("+cubey+"deg) rotateZ("+cubez+"deg)";
    $(".cube").css({ "transform":segs, "-webkit-transform":segs });
}
function rotCubeXY(){
    rotCube();
    kiirRotLayer(wholecube,99);
    kiir();
}
function faceFloat(){
    if (FaceF=="") FaceF = "f", $("#lskip").show();
    else FaceF = "", $("#lskip").hide();
    kiirRotLayer(wholecube,99);
    kiir();
}
function faceNum(){
    if (Disp=="none") { Disp = "block"; Face = "F"; $(".mezo span").css("display",Disp); }
    else {
        if (Face=="F") Face = "N";
        else Face = "F";
    }
    kiirRotLayer(wholecube,99);
    kiir();
}
function pause(){
    if (Pause) Pause = false, $("#comment").html($("#comment").html().replace(" Pausing",""));
    else Pause = true, $("#comment").html($("#comment").html()+" Pausing");
}
function step(){
    if (Pause)  {
        pause();
        setTimeout('goPython("Set")',100);  // Reverse scramble
    }
}
var Rev = 0 ;

function crtDiv(e) {
    let trans="";
    e==1&&(trans="rotateX(-90deg) translate3d(  0px,  0px,-60px) ");
    e==6&&(trans="rotateX(-90deg) translate3d(  0px,  0px,-30px) ");
    e==2&&(trans="rotateY( 90deg) translate3d(  0px,-45px,-15px) ");
    e==4&&(trans="rotateY( 90deg) translate3d(  0px,-45px, 15px) ");
    e==3&&(trans="rotateX(0deg)   translate3d(  0px,-45px, 15px) ");
    e==5&&(trans="rotateX(0deg)   translate3d(  0px,-45px,-15px) ");
    return '<div class="core" style="transform:'+trans+'"></div>';
}
function kiir(n=3,so=false){
    let r =                           createFaces( 1,  0,-60,-30,"X(-90deg)");
    r+=unfold(10,"",n).charAt(0)!="f"?createFaces(10,-15,-45,-30,"Y(-90deg)"):createFaces(110,-90,-25, -30,"Y(-90deg)");
    r+=                               createFaces(19,  0,-45, 45,"X(0deg)");
    r+=unfold(28,"",n).charAt(0)!="f"?createFaces(28, 75,-45, 30,"Y(-90deg)"):createFaces(128,185,-25,  30,"Y(-90deg)");
    r+=unfold(37,"",n).charAt(0)!="f"?createFaces(37, 60,-45,-45,"X(0deg)"):  createFaces(137, 90,-25,-130,"X(0deg)");
    r+=unfold(46,"",n).charAt(0)!="f"?createFaces(46,  0, 30, 30,"X(-90deg)"):createFaces(146,  0, 70,  30,"X(-90deg)");
    $("#cubeFields").html(r);
    if (so) return;
    $("#rotLayer").html("")
    $(".mezo span").css("display",Disp);
}
function createFaces(no,x,y,z,rotate,n=3) {
    let r="",d=n==4?26:30,i,j,x1,z1,y4,z4,udfbrl="";
    z<0&&rotate=="X(-90deg)"&&(x1=d,z1=0,y4=0,z4=d,udfbrl="U");
    z>0&&rotate=="X(-90deg)"&&(x1=d,z1=0,y4=0,z4=-d,udfbrl="D");
    z<0&&rotate=="Y(-90deg)"&&(x1=0,z1=d,y4=d,z4=0,udfbrl="L");
    z>0&&rotate=="Y(-90deg)"&&(x1=0,z1=-d,y4=d,z4=0,udfbrl="R");
    z>0&&rotate=="X(0deg)"&&(x1=d,z1=0,y4=d,z4=0,udfbrl="F");
    z<0&&rotate=="X(0deg)"&&(x1=-d,z1=0,y4=d,z4=0,udfbrl="B");
    for (i=0;i<n;i++)
        for (j=0;j<n;j++) {
            let segs = " matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,"+(x+j*x1)+","+(y+i*y4)+","+(z+i*z4+j*z1)+",1) rotate"+rotate ;
            let clsN = (no>100?(no-100+i*n+j):(no+i*n+j));
            r+='<div class="mezo'+ unfold(clsN," szin",n)+a[clsN]+ ' field mezo" style="transform:'+segs+
               '"><span>'+(Face=="F"?"&nbsp;"+udfbrl:clsN) +'</span></div>';
        }
    return r;
}
function kiirRotLayer(r,e,n=3){  // 書き直しのレイヤー選択
    if (Counter<0) return;
    var i, s, t, lo="", rr=r, ra, flip;
    flip = FaceF; FaceF=""; // 回転中は鏡部分を畳んで表示することに決めた（V5）
    $("#rotLayer").html($("#cubeFields").html()); // #cubeFieldsのデータ退避
    kiir(n,true);           // 畳んだ状態での#cubeFieldを新規作成
    FaceF = flip;
    for(i=0;i<rr.length;i++) {
        t = "#cubeFields .mezo"+ rr[i];
        lo += '<div class="mezo'+ rr[i] + " szine" + a[rr[i]] +
                  ' layer mezo" style="transform:' + $(t).css('transform') + '">' +
                  $(t).html() + '</div>';
    }
    $("#cubeFields").html($("#rotLayer").html()); // 退避を戻す
    for(i=0;i<rr.length;i++) {
        s = unfold(rr[i]," szin", n);  // unfoldは常にツール主体の配列サイズ
        t = "#cubeFields .mezo"+ s.slice(0,-6);
        if ((s.charAt(0)=="f")&&( // layer[0][0]は各面の3x3での左上Cubeアドレス、[8]は右下
            (e==2)&&(10<=rr[i])&&(18>=rr[i])||
            (e==5)&&(37<=rr[i])&&(45>=rr[i])||
            ((e==6)||(e==99))&&(46<=rr[i])&&(54>=rr[i])||
            (e==4)&&(28<=rr[i])&&(36>=rr[i])))
             lo += '<div class="mezo'+ s + a[rr[i]] +
                   ' layer mezo" style="transform:' + $(t).css('transform') + '">' +
                   $(t).html() + '</div>';
        $(t).hide();
    }
    $("#rotLayer").html(lo);// facerotate()か、kiir()で表示
}
function unfold(i,szin,n=3) {
    var is = i + szin;
    if (FaceF=="") return is+"e";
    if (cubey<355) return ((i>n*n)&&(i<n*n*2+1)||(i>n*n*4))?FaceF+is+"f":is+"e";
    if (cubey>365) return (i>n*n*3)?FaceF+is+"f":is+"e";
    return ((i>n*n)&&(i<n*n*2+1)||(i>n*n*3))?FaceF+is+"f":is+"e";
}

var cubex=-30,cubey=335,cubez=0,segs="yo", speed=30,NxPaus=400;
var a=new Array(),s=new Array();
var Maprote = new Map([["F","FLBR"], ["f","flbr"],["L","LBRF"], ["l","lbrf"],
                       ["B","BRFL"], ["b","brfl"],["R","RFLB"], ["r","rflb"],
                       ["M","MsmS"], ["m","mSMs"],["S","SmsM"], ["s","sMSm"]]);
var Disp="none", Pause=false, Face="F", FaceF="", Counter=0;
var Comment="", Tid=null, turnN=1, ClipDT="", W=null;
var Rotates = new Array();
var RotSft = 0, Urot = "", Urote = "", NoRot = "";

function initnotscrambled(n=3){
    let i,j;
    if (window.outerWidth<500) window.resizeTo(380,800);
    else                       window.resizeTo(580,440);
    speed=30; if (NxPaus<1100) NxPaus=400;
    if (turnN==16) NxPaus=1500;
    Disp="none"; Pause=false; Face="F"; Comment="";RotSft=0;Rotates=[]; turnN=1;
    clearTimeout(Tid); Tid = null;
    $("#solve3").attr('disabled',false);
    $("#parity").attr('disabled',true);
    $("#comment").html("");  $("#turn").html("&nbsp;"); $("#rotate").html("&nbsp;");
    if (window.name=="cube3dg") setTimeout("checkRot()",100);
    FaceF = "f", $("#lskip").show();
    initCube(n);
}
function initCube(n=3) {
    let i,j;
    for(a[0]=0,j=0;6>j;j++)for(i=1;n*n+1>i;i++)a[i+n*n*j]=j+1;
    if (location.search.slice(0,6)=="?j3x3=")
        a = JSON.parse(location.search.slice(6));
    kiirRotLayer(wholecube,99);
    kiir(n);
    turn("");
    $(".mezo span").css("display",Disp);
}
function turn(a) {
    Rotates.push(a);
    clearTimeout(Tid);
    setTimeout("checkRot();check33();",100);
}
function checkRot(n=3) {
    let i,j;
    let rot,rote=0,s1,s2,t1,t2,lo="",newcolor="transparent"; 
    if ((Pause==false) && (Rotates.length>0)) {
        if (Counter>0) rote = false;
        else rote = Rotates.shift();

        while (rote && (rote.charAt(0)=="*")) {
            if (rote.charAt(1)=="*") {      // cube reset 
                Comment = rote.slice(2);
                check33(); turnN=1;}
            else if (rote.charAt(1)=="#") { // flushing important post #mmnn....
                $("#comment").html(Comment);
                let cn, n=2, lo="", kuro="#888";
                while (n<rote.length-1) {
                    cn = parseInt(rote.slice(n,n+2));
                    s1 = unfold(cn," szin",4);
                    t1="#cubeFields .mezo"+ s1.slice(0,-6);
                    lo += '<div class="mezo'+s1+0+' field mezo" style="transform:'+$(t1).css('transform')+
                          ';"><span>'+ cn +'</span></div>';
                    $(t1).css("background-color",newcolor);
                    n += 2;
                }
                $("#rotLayer").html(lo); flush(200,4); setTimeout("checkRot(3)",1000); return; }
            else if (rote.charAt(1)=="+") { // virtual Y rotation convert 
                RotSft = parseInt(rote.slice(2));} 
            else if (rote.charAt(1)=="-") { // Turn count decrement 
                turnN -= parseInt(rote.slice(2));} 
            else if (rote.charAt(1)=="0") { // Cube setup without rotation
                if (rote.length==2) initCube(n);
                Counter = -1;  // NO rotation mode
                while (Rotates.length>0) {
                    let rot = Rotates.shift();
                    if (rot.charAt(0)=="*") break; 
                    turnN++;   
                    turnStart(dispRote(rot));
                }
                Counter = 0;  // Nomal rotation mode
                kiirRotLayer(wholecube,99),kiir();
                turnN=1;
            } 
            else Comment = (Rotates.length==0)?"":rote.slice(1);  
            rote = Rotates.shift();
        }
        $("#comment").html(Comment);
        if (rote) {
            Urot = rote;
            $("#turn").html(String(turnN));
            $("#rotate").html((rote.charCodeAt(0) & 0x20)>0?String.fromCharCode(rote.charCodeAt(0) ^ 0x20)+"'"+rote.slice(1):rote);
            rot = Maprote.get(rote.charAt(0));
            rote = ((typeof rot==='string')?rot.charAt(RotSft):rote.charAt(0)) +rote.slice(1);
            turnStart(rote);
            Urote = rote;
        }
    }
    Tid = setTimeout("checkRot()",NxPaus);
}
function dispRote(rot) {
    let rote = rot;
    $("#turn").html(String(turnN));
    if ((rote.charAt(0)=="M")||(rote.charAt(0)=="m")) 
        $("#rotate").html(rote.charAt(0)=="m"?rot.charAt(1) +"'"+rote.slice(2):rote.slice(1));
    else {
        $("#rotate").html((rote.charCodeAt(0) & 0x20)>0?String.fromCharCode(rote.charCodeAt(0) ^ 0x20)+"'"+rote.slice(1):rote);
        let rotm = Maprote.get(rote.charAt(0));
        rote = ((typeof rotm==='string')?rotm.charAt(RotSft):rote.charAt(0)) +rote.slice(1);
    }
    return rote;
}
function regRot(seq) { // 回転のprime表記を大文字・小文字系に変換する
    let seqR = seq.map(function (value, index, array) {
               return ((value.charCodeAt(0)<0x60)? 
                        (((value.charAt(1)=="'")||(value.charAt(2)=="'"))?
                               (String.fromCharCode(value.charCodeAt(0) ^ 0x20)+(value.charAt(2)=="'"?
                                                    value.charAt(1)+value.charAt(3):value.charAt(2))):value):
                        (value.charAt(1)=="'")?"m"+value.charAt(0):"M"+value);
                });
    return seqR;
}
function setRot(rot) {  // 回転列のリバース処理
    let rotR = rot;
    if (rot[0]=="!") {
        rot.shift();
        rot.reverse();
        rotR = rot.map(function (value, index, array) {
               if (value.charAt(0)=="*") {
                   turnN += 2;
                   return value;
               }
               return (String.fromCharCode(value.charCodeAt(0) ^ 0x20)+value.slice(1));
        });
        turnN -= rot.length * 2;
    }
    Rotates = Rotates.concat(rotR);
}
const White=1,Orange=2,Green=3,Red=4,Blue=5,Yellow=6,ccoW=new Array(22,38,54,70,22),ccoY=new Array(22,70,54,38,22);
const c=new Array(6,7,10,11,22,23,26,27,38,39,42,43,54,55,58,59,70,71,74,75,86,87,90,91);
const e=new Array(72,76,21,25,69,73,56,60,40,44,53,57,37,41,24,28,2,3,67,66,8,12,51,50,14,15,34,35,5,9,18,19,94,95,79,78,88,92,62,63,82,83,46,47,85,89,31,30);
var YdF,YtF;
function check33(n=3) {
    $("#solve3").attr('disabled',false);
    if ((n==3)||(Counter>0)) return;
    let i,diff, Yd=0,Ye=0;
    YdF = 0;
    $("#solve3").attr('disabled',true);
    for (i=0;i<24;i+=2) if (a[c[i]]!=a[c[i+1]]) return;
    if (a[6]==White)       { for (i=0;i<4 ;i++)  diff=a[ccoW[i+1]]-a[ccoW[i]];if((diff!=1)&&(diff!=-3))return; }
    else if (a[6]==Yellow) { for (i=0;i<4 ;i++)  diff=a[ccoY[i+1]]-a[ccoY[i]];if((diff!=1)&&(diff!=-3))return; }
//    else return;
    for (i=0;i<46;i+=2) { if (a[e[i]]!=a[e[i+1]]) return;
                          else if (a[e[i]]==a[6]) if (e[i]<16) Ye++;
                                                  else if ((i>17) && (i<32)) Yd++,YtF=(10-(i-18)/4) & 3; }
    $("#solve3").attr('disabled',false);
    if (opener && opener.ClipDT && (opener.ClipDT!="")) opener.ClipDT = "";
    if ((Yd+Ye==4)&&((Ye & 1)==1)) {
        $("#parity").attr('disabled',false);
        YdF = Yd;
    }
}
function flush(tm,cnt=8) {
    Counter++;
    setTimeout(function(){
        $("#rotLayer").toggle();
        cnt>Counter?flush(tm,cnt):($("#rotLayer").html(""), kiir(),Counter=0)},tm); // 
}
function flushB(tm,cnt=8,id="#solve3") {
    Counter++;
    setTimeout(function(){
        $(id).css('background-color',Counter%2?'#ce4b42':'#ccc');
        cnt>Counter?flushB(tm,cnt,id):($(id).css('background-color',""),Counter=0)},tm); // 
}
var preRot = "";
function facerotate(an, tm, n=3) {
    if (an>100) {
        facerote(an, tm);
        return;
    }
    var e = Math.floor(an/10);
    const core_e1 =[0,1,2,3,4,5,6,2,1,3,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
//    const core_e2 =[0,0,0,0,0,0,0,4,6,5, 0, 2, 4, 1, 6, 3, 5,10, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    var odiv = crtDiv(core_e1[e],n);
    $("#cubeFields").append(odiv);
    $("#rotLayer").append(odiv);
    $(".mezo span").css("display",Disp);
    facerote(an, tm);
}
function facerote(a, tm) {
    if (Counter<0) return;
    var w = tm * 10 * Counter;
    $("#rotLayer").css("transform-origin","50% 50% 0");
    setTimeout(function(){
11==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),12==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),
21==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),22==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),
31==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),32==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),
41==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),42==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),
51==a&&((FaceF=="f")&&$("#rotLayer").css("transform-origin","90% 50%"),$("#rotLayer").css("transform","rotateZ(-"+w+"deg)")),
52==a&&((FaceF=="f")&&$("#rotLayer").css("transform-origin","90% 50%"),$("#rotLayer").css("transform","rotateZ("+w+"deg)")),
61==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),62==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),
71==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),72==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),
81==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),82==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),
91==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),92==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),
101==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),102==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),
111==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),112==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),
121==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),122==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),
    Counter++,10>Counter?facerote(a, tm):($("#rotLayer").html(""),$("#rotLayer").css("transform","rotateY(0deg)"),  //  
    kiir(),Counter=0,turnN+=1)},speed)}
                                  
function turnStart(a){
    if ((a.charAt(1)=="2")||(a.charAt(2)=="2")) {
        turnStart2(a.slice(0,2));
        return;
    }
    0>=Counter&&(
"U"==a&&(kiirRotLayer(layeru,1),facerotate(11,1),uu()),"u"==a&&(kiirRotLayer(layeru,1),facerotate(12,1),ui()),
"R"==a&&(kiirRotLayer(layerr,4),facerotate(41,1),rr()),"r"==a&&(kiirRotLayer(layerr,4),facerotate(42,1),ri()),
"D"==a&&(kiirRotLayer(layerd,6),facerotate(61,1),dd()),"d"==a&&(kiirRotLayer(layerd,6),facerotate(62,1),di()),
"F"==a&&(kiirRotLayer(layerf,3),facerotate(31,1),ff()),"f"==a&&(kiirRotLayer(layerf,3),facerotate(32,1),fi()),
"B"==a&&(kiirRotLayer(layerb,5),facerotate(51,1),bb()),"b"==a&&(kiirRotLayer(layerb,5),facerotate(52,1),bi()),
"L"==a&&(kiirRotLayer(layerl,2),facerotate(21,1),ll()),"l"==a&&(kiirRotLayer(layerl,2),facerotate(22,1),li()),
"X"==a&&(kiirRotLayer(wholecube,99),facerotate(101,1),bor2(),bor()),"x"==a&&(kiirRotLayer(wholecube,99),facerotate(102,1),bor()),
"Y"==a&&(kiirRotLayer(wholecube,99),facerotate(111,1),fd()),"y"==a&&(kiirRotLayer(wholecube,99),facerotate(112,1),fd2(),fd()),
"Z"==a&&(kiirRotLayer(wholecube,99),facerotate(121,1),fd(),bor(),fd2(),fd()),"z"==a&&(kiirRotLayer(wholecube,99),facerotate(122,1),fd2(),fd(),bor(),fd()),
"m"==a&&(kiirRotLayer(layerm,7),facerotate(71,1),bor(),rr(),li()),"M"==a&&(kiirRotLayer(layerm,7),facerotate(72,1),bor2(),bor(),ri(),ll()),
"E"==a&&(kiirRotLayer(layere,8),facerotate(81,1),di(),uu(),fd2(),fd()),"e"==a&&(kiirRotLayer(layere,8),facerotate(82,1),dd(),ui(),fd()),
"S"==a&&(kiirRotLayer(layers,9),facerotate(91,1),fi(),bb(),fd(),bor(),fd2(),fd()),"s"==a&&(kiirRotLayer(layers,9),facerotate(92,1),ff(),bi(),fd2(),fd(),bor(),fd()),
"Mu"==a&&(kiirRotLayer(layermu,13),facerotate(11,1),Mu()),"mu"==a&&(kiirRotLayer(layermu,13),facerotate(12,1),mu()),
"Mr"==a&&(kiirRotLayer(layermr,12),facerotate(41,1),Mr()),"mr"==a&&(kiirRotLayer(layermr,12),facerotate(42,1),mr()),
"Md"==a&&(kiirRotLayer(layermd,14),facerotate(61,1),Md()),"md"==a&&(kiirRotLayer(layermd,14),facerotate(62,1),md()),
"Mf"==a&&(kiirRotLayer(layermf,15),facerotate(31,1),Mf()),"mf"==a&&(kiirRotLayer(layermf,15),facerotate(32,1),mf()),
"Mb"==a&&(kiirRotLayer(layermb,16),facerotate(51,1),Mb()),"mb"==a&&(kiirRotLayer(layermb,16),facerotate(52,1),mb()),
"Ml"==a&&(kiirRotLayer(layerml,11),facerotate(21,1),Ml()),"ml"==a&&(kiirRotLayer(layerml,11),facerotate(22,1),ml()),
"Lw"==a&&(kiirRotLayer(layerlw,10),facerotate(81,1),ll(),Ml()),"lw"==a&&(kiirRotLayer(layerlw,10),facerotate(82,1),li(),ml()),
"Rw"==a&&(kiirRotLayer(layerrw,10),facerotate(91,1),rr(),Mr()),"rw"==a&&(kiirRotLayer(layerrw,10),facerotate(92,1),ri(),mr()))
}
function turnStart2(a){
    0>=Counter&&(
"U2"==a&&(kiirRotLayer(layeru,1),facerotate(11,2),uu(),uu()),"u2"==a&&(kiirRotLayer(layeru,1),facerotate(12,2),uu(),uu()),
"R2"==a&&(kiirRotLayer(layerr,4),facerotate(41,2),ri(),ri()),"r2"==a&&(kiirRotLayer(layerr,4),facerotate(42,2),ri(),ri()),
"D2"==a&&(kiirRotLayer(layerd,6),facerotate(61,2),dd(),dd()),"d2"==a&&(kiirRotLayer(layerd,6),facerotate(62,2),di(),di()),
"F2"==a&&(kiirRotLayer(layerf,3),facerotate(31,2),ff(),ff()),"f2"==a&&(kiirRotLayer(layerf,3),facerotate(32,2),fi(),fi()),
"B2"==a&&(kiirRotLayer(layerb,5),facerotate(51,2),bb(),bb()),"b2"==a&&(kiirRotLayer(layerb,5),facerotate(52,2),bi(),bi()),
"L2"==a&&(kiirRotLayer(layerl,2),facerotate(21,2),ll(),ll()),"l2"==a&&(kiirRotLayer(layerl,2),facerotate(22,2),ll(),ll()),
"m2"==a&&(kiirRotLayer(layerm,7),facerotate(71,2),bor(),rr(),li(),bor(),rr(),li()),"M2"==a&&(kiirRotLayer(layerm,7),facerotate(72,2),bor2(),bor(),ri(),ll(),bor2(),bor(),ri(),ll()),
"X2"==a&&(kiirRotLayer(wholecube,99),facerotate(101,2),bor2()),"x2"==a&&(kiirRotLayer(wholecube,99),facerotate(102,2),bor2()),
"Y2"==a&&(kiirRotLayer(wholecube,99),facerotate(111,2),fd2()),"y2"==a&&(kiirRotLayer(wholecube,99),facerotate(112,2),fd2()),
"Z2"==a&&(kiirRotLayer(wholecube,99),facerotate(121,2),fd(),bor2(),bor(),fd3()),"z2"==a&&(kiirRotLayer(wholecube,99),facerotate(122,2),fd3(),bor2(),fd()),
"Mu"==a&&(kiirRotLayer(layermu,13),facerotate(11,2),Mu(),Mu()),"mu"==a&&(kiirRotLayer(layermu,13),facerotate(12,2),mu(),mu()),
"Mr"==a&&(kiirRotLayer(layermr,12),facerotate(41,2),Mr(),Mr()),"mr"==a&&(kiirRotLayer(layermr,12),facerotate(42,2),mr(),mr()),
"Md"==a&&(kiirRotLayer(layermd,14),facerotate(61,2),Md(),Md()),"md"==a&&(kiirRotLayer(layermd,14),facerotate(62,2),md(),md()),
"Mf"==a&&(kiirRotLayer(layermf,15),facerotate(31,2),Mf(),Mf()),"mf"==a&&(kiirRotLayer(layermf,15),facerotate(32,2),mf(),mf()),
"Mb"==a&&(kiirRotLayer(layermb,16),facerotate(51,2),Mb(),Mb()),"mb"==a&&(kiirRotLayer(layermb,16),facerotate(52,2),mb(),mb()),
"Ml"==a&&(kiirRotLayer(layerml,11),facerotate(21,2),Ml(),Ml()),"ml"==a&&(kiirRotLayer(layerml,11),facerotate(22,2),ml(),ml()),
"Lw"==a&&(kiirRotLayer(layerlw,10),facerotate(81,2),ll(),Ml(),ll(),Ml()),"lw"==a&&(kiirRotLayer(layerlw,10),facerotate(82,2),li(),ml(),li(),ml()),
"Rw"==a&&(kiirRotLayer(layerrw,10),facerotate(91,2),rr(),Mr(),rr(),Mr()),"rw"==a&&(kiirRotLayer(layerrw,10),facerotate(92,2),ri(),mr(),ri(),mr()))
}

function bor(){
    s[1]=a[1],s[2]=a[4],s[3]=a[7],a[1]=a[45],a[4]=a[42],a[7]=a[39],a[45]=a[46],a[42]=a[49],a[39]=a[52],a[46]=a[19],a[49]=a[22],a[52]=a[25],a[19]=s[1],a[22]=s[2],a[25]=s[3],
    s[1]=a[2],s[2]=a[5],s[3]=a[8],a[2]=a[44],a[5]=a[41],a[8]=a[38],a[44]=a[47],a[41]=a[50],a[38]=a[53],a[47]=a[20],a[50]=a[23],a[53]=a[26],a[20]=s[1],a[23]=s[2],a[26]=s[3],
    s[1]=a[3],s[2]=a[6],s[3]=a[9],a[3]=a[43],a[6]=a[40],a[9]=a[37],a[43]=a[48],a[40]=a[51],a[37]=a[54],a[48]=a[21],a[51]=a[24],a[54]=a[27],a[21]=s[1],a[24]=s[2],a[27]=s[3],
  s[1]=a[10],s[2]=a[11],a[10]=a[16],a[11]=a[13],a[16]=a[18],a[13]=a[17],a[18]=a[12],a[17]=a[15],a[12]=s[1],a[15]=s[2],s[1]=a[28],s[2]=a[29],a[28]=a[30],a[29]=a[33],a[30]=a[36],a[33]=a[35],a[36]=a[34],a[35]=a[31],a[34]=s[1],a[31]=s[2]}
function bor2(){
      s[1]=a[1],s[2]=a[4],s[3]=a[7],a[1]=a[46],a[4]=a[49],a[7]=a[52],a[46]=s[1],a[49]=s[2],a[52]=s[3],s[1]=a[45],s[2]=a[42],s[3]=a[39],a[45]=a[19],a[42]=a[22],a[39]=a[25],a[19]=s[1],a[22]=s[2],a[25]=s[3],
      s[1]=a[2],s[2]=a[5],s[3]=a[8],a[2]=a[47],a[5]=a[50],a[8]=a[53],a[47]=s[1],a[50]=s[2],a[53]=s[3],s[1]=a[44],s[2]=a[41],s[3]=a[38],a[44]=a[20],a[41]=a[23],a[38]=a[26],a[20]=s[1],a[23]=s[2],a[26]=s[3],
      s[1]=a[3],s[2]=a[6],s[3]=a[9],a[3]=a[48],a[6]=a[51],a[9]=a[54],a[48]=s[1],a[51]=s[2],a[54]=s[3],s[1]=a[43],s[2]=a[40],s[3]=a[37],a[43]=a[21],a[40]=a[24],a[37]=a[27],a[21]=s[1],a[24]=s[2],a[27]=s[3],
 s[1]=a[10],s[2]=a[11],s[3]=a[12],a[10]=a[18],a[11]=a[17],a[12]=a[16],a[18]=s[1],a[17]=s[2],a[16]=s[3],s[1]=a[13],a[13]=a[15],a[15]=s[1],s[1]=a[28],s[2]=a[29],s[3]=a[30],a[28]=a[36],a[29]=a[35],a[30]=a[34],a[36]=s[1],a[35]=s[2],a[34]=s[3],s[1]=a[31],a[31]=a[33],a[33]=s[1]}
function rot(){
    s[1]=a[25],s[2]=a[26],s[3]=a[27],a[25]=a[16],a[26]=a[17],a[27]=a[18],a[16]=a[43],a[17]=a[44],a[18]=a[45],a[43]=a[34],a[44]=a[35],a[45]=a[36],a[34]=s[1],a[35]=s[2],a[36]=s[3],s[1]=a[46],s[2]=a[47],a[46]=a[52],a[47]=a[49],a[52]=a[54],a[49]=a[53],a[54]=a[48],a[53]=a[51],a[48]=s[1],a[51]=s[2]}
function roti(){
    s[1]=a[25],s[2]=a[26],s[3]=a[27],a[25]=a[34],a[26]=a[35],a[27]=a[36],a[34]=a[43],a[35]=a[44],a[36]=a[45],a[43]=a[16],a[44]=a[17],a[45]=a[18],a[16]=s[1],a[17]=s[2],a[18]=s[3],s[1]=a[46],s[2]=a[47],a[46]=a[48],a[47]=a[51],a[48]=a[54],a[51]=a[53],a[54]=a[52],a[53]=a[49],a[52]=s[1],a[49]=s[2]}
function fd(){
    s[1]=a[19],s[2]=a[20],s[3]=a[21],a[19]=a[28],a[20]=a[29],a[21]=a[30],a[28]=a[37],a[29]=a[38],a[30]=a[39],a[37]=a[10],a[38]=a[11],a[39]=a[12],a[10]=s[1],a[11]=s[2],a[12]=s[3],s[1]=a[22],s[2]=a[23],s[3]=a[24],a[22]=a[31],a[23]=a[32],a[24]=a[33],a[31]=a[40],a[32]=a[41],a[33]=a[42],a[40]=a[13],a[41]=a[14],a[42]=a[15],a[13]=s[1],a[14]=s[2],a[15]=s[3],s[1]=a[25],s[2]=a[26],s[3]=a[27],a[25]=a[34],a[26]=a[35],a[27]=a[36],a[34]=a[43],a[35]=a[44],a[36]=a[45],a[43]=a[16],a[44]=a[17],a[45]=a[18],a[16]=s[1],a[17]=s[2],a[18]=s[3],s[1]=a[1],s[2]=a[2],a[1]=a[7],a[2]=a[4],a[7]=a[9],a[4]=a[8],a[9]=a[3],a[8]=a[6],a[3]=s[1],a[6]=s[2],s[1]=a[46],s[2]=a[47],a[46]=a[48],a[47]=a[51],a[48]=a[54],a[51]=a[53],a[54]=a[52],a[53]=a[49],a[52]=s[1],a[49]=s[2]}
function fd2(){
    s[1]=a[19],s[2]=a[20],s[3]=a[21],a[19]=a[37],a[20]=a[38],a[21]=a[39],a[37]=s[1] ,a[38]=s[2] ,a[39]=s[3],
    s[1]=a[22],s[2]=a[23],s[3]=a[24],a[22]=a[40],a[23]=a[41],a[24]=a[42],a[40]=s[1] ,a[41]=s[2] ,a[42]=s[3],
    s[1]=a[25],s[2]=a[26],s[3]=a[27],a[25]=a[43],a[26]=a[44],a[27]=a[45],a[43]=s[1] ,a[44]=s[2] ,a[45]=s[3],
    s[1]=a[28],s[2]=a[29],s[3]=a[30],a[28]=a[10],a[29]=a[11],a[30]=a[12],a[10]=s[1] ,a[11]=s[2] ,a[12]=s[3],
    s[1]=a[31],s[2]=a[32],s[3]=a[33],a[31]=a[13],a[32]=a[14],a[33]=a[15],a[13]=s[1] ,a[14]=s[2] ,a[15]=s[3],
    s[1]=a[34],s[2]=a[35],s[3]=a[36],a[34]=a[16],a[35]=a[17],a[36]=a[18],a[16]=s[1] ,a[17]=s[2] ,a[18]=s[3],
    s[1]=a[1], s[2]=a[2], s[3]=a[3] ,a[1]=a[9],a[2]=a[8],a[3]=a[7], a[9]=s[1],a[8]=s[2],a[7]=s[3], s[1]=a[4],a[4]=a[6],a[6]=s[1],
    s[1]=a[46],s[2]=a[47],s[3]=a[48],a[46]=a[54],a[47]=a[53],a[48]=a[52],a[52]=s[3],a[53]=s[2],a[54]=s[1], s[1]=a[49],a[49]=a[51],a[51]=s[1]}
function uu(){
    bor2(),rot(),bor2()}
function ui(){
    bor2(),roti(),bor2()}
function ff(){
    bor(),rot(),bor2(),bor()}
function fi(){
    bor(),roti(),bor2(),bor()}
function rr(){
    fd(),bor(),rot(),bor2(),bor(),fd2(),fd()}
function ri(){
    fd(),bor(),roti(),bor2(),bor(),fd2(),fd()}
function ll(){
    fd2(),fd(),bor(),rot(),bor2(),bor(),fd()}
function li(){
    fd2(),fd(),bor(),roti(),bor2(),bor(),fd()}
function dd(){
    rot()}
function di(){
    roti()}
function bb(){
    bor2(),bor(),rot(),bor()}
function bi(){
    bor2(),bor(),roti(),bor()}

function scramble(){
    scramble3();
    $("#solve3").attr('disabled',false);
//    if (opener && opener.ClipDT && (opener.ClipDT!="")) opener.ClipDT = "";
}
function scramble3(){
    let i,j,sym="";
    const rotS = "U,U',U2,F,F',F2,D,D',D2,B,B',B2,R,R',R2,L,L',L2".split(",");
    for(a[0]=0,j=0;6>j;j++)for(i=1;10>i;i++)a[i+9*j]=j+1;
    for(i=0;22>i;i++)rand=Math.floor(18*Math.random()),sym+=rotS[rand]+" ",
        0==rand&&uu(),1==rand&&ui(),2==rand&&(uu(),uu()),3==rand&&ff(),4==rand&&fi(),5==rand&&(ff(),ff()),6==rand&&dd(),7==rand&&di(),8==rand&&(dd(),dd()),9==rand&&bb(),10==rand&&bi(),11==rand&&(bb(),bb()),12==rand&&rr(),13==rand&&ri(),14==rand&&(rr(),rr()),15==rand&&ll(),16==rand&&li(),17==rand&&(ll(),ll());
    symset(sym+" U L U L");
}
function symset(sym) {
    ClipDT = sym;
    kiirRotLayer(wholecube,99),kiir(3);
    if (opener) {
        opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = sym;
        if (typeof opener.ClipDT!=="undefined") opener.ClipDT = sym;
    }
    else $("#comment").html(sym);
}
const
layeru=[1,2,3,4,5,6,7,8,9,10,11,12,19,20,21,28,29,30,37,38,39],
layerl=[10,11,12,13,14,15,16,17,18,1,4,7,19,22,25,46,49,52,39,42,45],
layerf=[19,20,21,22,23,24,25,26,27,7,8,9,12,15,18,46,47,48,28,31,34],
layerr=[28,29,30,31,32,33,34,35,36,3,6,9,21,24,27,48,51,54,37,40,43],
layerb=[37,38,39,40,41,42,43,44,45,30,33,36,10,13,16,1,2,3,52,53,54],
layerd=[46,47,48,49,50,51,52,53,54,25,26,27,16,17,18,25,26,27,34,35,36,43,44,45],
layerm=[2,5,8,20,23,26,47,50,53,38,41,44],
layere=[13,14,15,22,23,24,31,32,33,40,41,42],
layers=[4,5,6,11,14,17,29,32,35,49,50,51],
wholecube=[...Array(54)].map((v, i)=> i+1);

$(document).ready(function(){
  initnotscrambled(3);
  if (typeof(mousedragRotate) != 'undefined') mousedragRotate(".cube");
});