/*
* ルービックキューブ2x2-8x8お告げナビゲーター・GUI回転系
*
* Copyright (c) 2022-2024 Norio Fujii
* Licensed under the MIT License
*
*/
function dumpRot() {
    if (Solution=="") alert(ClipDT);
    else            alert(Solution);
    alert(navigator.userAgent);
}
function copyRot() {
    var copystr = ((!Solution)||(Solution==""))? ClipDT:Solution;
    navigator.clipboard.writeText("*0c"+N+" "+copystr);   
}
async function RotCopyX(obj,rot,rot2="",sayu="R"){
    var rotx=rot,rot2x=rot2, element=obj.getAttribute('aria-label');
    if (element) {
        element = element.split(' ')[0];
        rotx = "*"+element+ " "+rot;
        rot2x = "*"+element+ " "+rot2;
    }
    RotCopy(rotx,rot2x,sayu);
}
async function RotCopy(rot,rot2="",sayu="R"){
    if (Counter>0) return;
    var rote = (sayu=="R")?rot:rot2;
    if (rote=="") rote = await clipIn();
    navigator.clipboard.writeText(rote);   
    if (rote!="") setRot(regRot((rote + " **").split(" "))); // "*0 "+ 
    if (Counter==0) {
        clearTimeout(Tid2);
        setTimeout("checkRot();",100);
    }
}
function reserve() {
    $("#comment").html("");
    turnN = 1;
    clearTimeout(Tid2);
    mini3x3(false);
    accel(2);
}
function json5x5() { // 5x5盤面保存→JSON
    var i=0, a=[];
    for (var f=0;f<6;f++) for (var y=0;y<5;y++) for (var x=0;x<5;x++) 
        a[++i] = CubeMap[f][y][x];
    return JSON.stringify(a);
}
function json3x3() { // 3x3盤面保存→JSON
    var i=0, a=[];
    for (var f=0;f<6;f++) for (var y=0;y<N;y++) for (var x=0;x<N;x++) 
        if (((y<2)||(y==N-1))&&((x<2)||(x==N-1))) a[++i] = CubeMap[f][y][x];
    return JSON.stringify(a);
}
function mini3x3(sw=true) { // 3x3 mini picture
    if ($("#solve3").prop('disabled')) return;
    if ((sw||sw==0)&&($("#miniCube").attr('src')=="")) {
        $("#miniCube").attr('src','notation-Mini.html?j3x3='+json3x3());
        $("#miniCube").show();
        if (sw!=0) $("#comment").html("休止を解除してください");
//        if ($('input[name="noy"]').is(':checked')) SetTimeout('miniCube.RotOmt = 1',500);
        pause();
    } else {
        $("#miniCube").attr('src','');
        $("#miniCube").hide();
    }
}
function normalPos(color=0) {
    if (CubeMap[0]==0) {
       console.log('UnInitialized Map');
       return;
    }
    var f,rot="";
    if (color==0) save5x5(-1);
    RotOmt = 0;
    for (f=0;f<6;f++) { if (CubeMap[f][N>>1][N>>1]==White) break; }
    if (f<6) {
         ([fd,zz,Bor,Zz,bor,bor2][f]());  // fd is dummy
         rot += ["","Z","x","z","X","X2"][f];
    } else console.log('White not catched');
    for (f=1;f<5;f++) {
        if (CubeMap[2][N>>1][N>>1]==Green) break;
        Fd(); rot += ",y";
    }
    if (color>0) {
        2==color&&(zz()),
        3==color&&(zz(),Bor()),
        4==color&&(bor2(),Zz()),
        5==color&&(bor(),Fd()),
        6==color&&(bor2());
        kiirRotLayer(wholecube,99);kiir();
    } else {
        rest5x5(-1);
        setRot(rot.split(","));
    }
    if (N<6) RotOmt = $('input[name="noy"]').is(':checked')? 1:0;
    RotSft = 0;
}
function crtDiv(e,n=5) {  // キューブ層の仕切り
    var trans="";
    if (n==3) {
        e==1&&(trans="translate3d(  0px,-60px,  0px) rotateX(-90deg) ");
        e==6&&(trans="translate3d(  0px,-30px,  0px) rotateX(-90deg) ");
        e==2&&(trans="translate3d(-15px,-45px,  0px) rotateY( 90deg) ");
        e==4&&(trans="translate3d( 15px,-45px,  0px) rotateY( 90deg) ");
        e==3&&(trans="translate3d(  0px,-45px, 15px) rotateX(0deg)   ");
        e==5&&(trans="translate3d(  0px,-45px,-15px) rotateX(0deg)   ");
    }
    if ((n==4)||(n==2)) {
        e==1&&(trans="translate3d(  3px,-72px,  0px) rotateX(-90deg)");
        e==6&&(trans="translate3d(  3px,-20px,  0px) rotateX(-90deg)");
        e==2&&(trans="translate3d(-24px,-46px,  0px) rotateY( 90deg)");
        e==4&&(trans="translate3d( 28px,-46px,  0px) rotateY( 90deg)");
        e==3&&(trans="translate3d(  3px,-46px, 26px) rotateX(0deg)");
        e==5&&(trans="translate3d(  3px,-46px,-26px) rotateX(0deg)");
        e==10&&(trans="translate3d(  3px,-46px, -3px) rotateX(0deg)");    // mc
        e==11&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");
        e==12&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");
        e==13&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==14&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==15&&(trans="translate3d(  3px,-46px,  3px) rotateX(0deg)");
        e==16&&(trans="translate3d(  3px,-46px, -3px) rotateX(0deg)");
        e==20&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");   // Lw
        e==21&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");   // Rw
        e==22&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==26&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==23&&(trans="translate3d(  3px,-46px,  0px) rotateX(0deg)");
        e==25&&(trans="translate3d(  3px,-46px,  0px) rotateX(0deg)");
        e==28&&(trans="translate3d(  3px,-46px,  3px) rotateX(0deg)");    // Cf
        e==29&&(trans="translate3d(  3px,-46px, -3px) rotateX(0deg)");    // Cb
    } else if (n==5) {
        e==1&&(trans="translate3d(  3px,-78px,  0px) rotateX(-90deg)");
        e==6&&(trans="translate3d(  3px,-10px,  0px) rotateX(-90deg)");
        e==2&&(trans="translate3d(-32px,-45px,  0px) rotateY( 90deg)");
        e==4&&(trans="translate3d( 36px,-45px,  0px) rotateY( 90deg)");
        e==3&&(trans="translate3d(  3px,-45px, 33px) rotateX(0deg)");
        e==5&&(trans="translate3d(  3px,-45px,-33px) rotateX(0deg)");
        e==10&&(trans="translate3d( -8px,-45px,  0px) rotateY( 90deg)"); // 2 mc
        e==11&&(trans="translate3d(-10px,-45px,  0px) rotateY( 90deg)"); // 2 ml
        e==12&&(trans="translate3d( 14px,-45px,  0px) rotateY( 90deg)"); // 4 mr
        e==13&&(trans="translate3d(  3px,-56px,  0px) rotateX(-90deg)"); // 1 mu
        e==14&&(trans="translate3d(  3px,-34px,  0px) rotateX(-90deg)"); // 6 md
        e==15&&(trans="translate3d(  3px,-44px, 11px) rotateX(0deg)");   // 3 mf
        e==16&&(trans="translate3d(  3px,-44px,-11px) rotateX(0deg)");   // 5 mb
        e==18&&(trans="translate3d(-10px,-45px,  0px) rotateY( 90deg)"); // 4 Cl
        e==19&&(trans="translate3d( 14px,-45px,  0px) rotateY( 90deg)"); // 4 Cr
    } else if (n==6) {
        e==1&&(trans="translate3d(  3px,-88px, 11px) rotateX(-90deg)");
        e==6&&(trans="translate3d(  3px,  0px, 11px) rotateX(-90deg)");
        e==2&&(trans="translate3d(-42px,-48px, 11px) rotateY( 90deg)");
        e==4&&(trans="translate3d( 46px,-48px, 11px) rotateY( 90deg)");
        e==3&&(trans="translate3d(  5px,-48px, 56px) rotateX(0deg)");
        e==5&&(trans="translate3d(  5px,-48px,-33px) rotateX(0deg)");
        e==41&&(trans="translate3d( 24px,-44px, 22px) rotateY( 90deg)");  // Mt
        e==11&&(trans="translate3d(-22px,-45px, 11px) rotateY( 90deg)"); // 2 ml
        e==12&&(trans="translate3d( 24px,-45px, 11px) rotateY( 90deg)"); // 4 mr
        e==13&&(trans="translate3d(  3px,-64px, 11px) rotateX(-90deg)"); // 1 mu
        e==14&&(trans="translate3d(  5px,-22px, 11px) rotateX(-90deg)"); // 6 md
        e==15&&(trans="translate3d(  5px,-44px, 33px) rotateX(0deg)");   // 3 mf
        e==16&&(trans="translate3d(  3px,-44px,-10px) rotateX(0deg)");   // 5 mb
        e==17&&(trans="translate3d(-22px,-45px, 11px) rotateY( 90deg)"); // 2 Lc
        e==18&&(trans="translate3d(-22px,-45px, 11px) rotateY( 90deg)"); // 4 Cl
        e==19&&(trans="translate3d( 24px,-45px, 11px) rotateY( 90deg)"); // 4 Cr
        e==24&&(trans="translate3d( 24px,-44px, 11px) rotateY( 90deg)"); // 4 Rc
        e==28&&(trans="translate3d(  5px,-48px, 40px) rotateX(0deg)");    // Cf
        e==29&&(trans="translate3d(  5px,-48px, 16px) rotateX(0deg)");    // Cb
    } else if (n==7) {
        e==1&&(trans="translate3d(  0px,-94px, 22px) rotateX(-90deg)"); // U
        e==6&&(trans="translate3d(  0px, 14px, 22px) rotateX(-90deg)"); // D
        e==2&&(trans="translate3d(-52px,-44px, 22px) rotateY( 90deg)"); // L
        e==4&&(trans="translate3d( 58px,-44px, 22px) rotateY( 90deg)"); // R
        e==3&&(trans="translate3d(  5px,-44px, 68px) rotateX(0deg)");   // F
        e==5&&(trans="translate3d(  8px,-38px,-28px) rotateX(0deg)");   // B
        e==10&&(trans="translate3d( -8px,-44px, 22px) rotateY( 90deg)"); // 2 mc
        e==11&&(trans="translate3d(-30px,-44px, 22px) rotateY( 90deg)"); // 2 ml
        e==12&&(trans="translate3d( 36px,-44px, 22px) rotateY( 90deg)"); // 4 mr
        e==13&&(trans="translate3d(  3px,-74px, 22px) rotateX(-90deg)"); // 1 mu
        e==14&&(trans="translate3d(  5px,-12px, 22px) rotateX(-90deg)"); // 6 md
        e==15&&(trans="translate3d(  5px,-44px, 48px) rotateX(0deg)");   // 3 mf
        e==16&&(trans="translate3d(  8px,-56px, -8px) rotateX(0deg)");   // 5 mb
        e==17&&(trans="translate3d(-29px,-44px, 22px) rotateY( 90deg)"); // 2 Lc
        e==18&&(trans="translate3d(-29px,-44px, 22px) rotateY( 90deg)"); // 4 Cl
        e==19&&(trans="translate3d( 35px,-44px, 22px) rotateY( 90deg)"); // 4 Cr
        e==24&&(trans="translate3d( 35px,-44px, 22px) rotateY( 90deg)"); // 4 Rc
        e==28&&(trans="translate3d(  0px,-44px, 40px) rotateX(0deg)");    // Cf
        e==29&&(trans="translate3d(  0px,-44px, 16px) rotateX(0deg)");    // Cb
        e==41&&(trans="translate3d( 35px,-44px, 22px) rotateY( 90deg)");  // Mt
    } else if (n==8) {
        e==1&&(trans="translate3d( -2px,-112px,35px) rotateX(-90deg)");  // U
        e==6&&(trans="translate3d( -2px, 18px, 35px) rotateX(-90deg)");  // D 
        e==2&&(trans="translate3d(-67px,-48px, 35px) rotateY( 90deg)");  // L
        e==4&&(trans="translate3d( 68px,-48px, 35px) rotateY( 90deg)");  // R
        e==3&&(trans="translate3d(  0px,-48px,102px) rotateX(0deg)");    // F
        e==5&&(trans="translate3d(  0px,-48px,-28px) rotateX(0deg)");    // B
        e==10&&(trans="translate3d( -8px,-48px, 35px) rotateY( 90deg)"); // 2 mc
        e==11&&(trans="translate3d(-42px,-48px, 35px) rotateY( 90deg)"); // 2 ml
        e==12&&(trans="translate3d( 44px,-48px, 35px) rotateY( 90deg)"); // 4 mr
        e==13&&(trans="translate3d( -2px,-92px, 30px) rotateX(-90deg)"); // 1 mu
        e==14&&(trans="translate3d( -2px, -4px, 30px) rotateX(-90deg)"); // 6 md
        e==15&&(trans="translate3d(  0px,-48px, 82px) rotateX(0deg)");   // 3 mf
        e==16&&(trans="translate3d(  0px,-48px,-10px) rotateX(0deg)");   // 5 mb
        e==17&&(trans="translate3d(-42px,-48px, 35px) rotateY( 90deg)"); //10 Lc
        e==18&&(trans="translate3d(-22px,-48px, 35px) rotateY( 90deg)"); //11 Cl
        e==19&&(trans="translate3d( 22px,-48px, 35px) rotateY( 90deg)"); //12 Cr
        e==24&&(trans="translate3d( 44px,-48px, 35px) rotateY( 90deg)"); //12 Rc
        e==28&&(trans="translate3d(  0px,-48px, 40px) rotateX(0deg)");    // Cf
        e==29&&(trans="translate3d(  0px,-48px, 16px) rotateX(0deg)");    // Cb
        e==40&&(trans="translate3d(  5px,-23px, 30px) rotateX(-90deg)");  // Cu
        e==41&&(trans="translate3d( 22px,-48px, 35px) rotateY( 90deg)");  // Mt
        e==43&&(trans="translate3d(-22px,-48px, 35px) rotateY( 90deg)");  // M4
    }
    return (trans=="")?"":'<div class="core" style="transform:'+trans+'"></div>';
}
function kiir(n=N,so=false){
    var r = "";
    if (n==3) { //                                             30:26:22
        r =                               creFaces( 1,  0,-60,-30,"X(-90deg)");
        r+=unfold(10,"",3).charAt(0)!="f"?creFaces(10,-15,-45,-30,"Y(-90deg)"):creFaces(510,-75,-42, -30,"Y(-90deg)");
        r+=                               creFaces(19,  0,-45, 45,"X(0deg)");
        r+=unfold(28,"",3).charAt(0)!="f"?creFaces(28, 75,-45, 30,"Y(-90deg)"):creFaces(528,185,-42,  30,"Y(-90deg)");
        r+=unfold(37,"",3).charAt(0)!="f"?creFaces(37, 60,-45,-45,"X(0deg)"):  creFaces(537,110,-38,-185,"X(0deg)");
        r+=unfold(46,"",3).charAt(0)!="f"?creFaces(46,  0, 30, 30,"X(-90deg)"):creFaces(546,  0, 70,  30,"X(-90deg)");
    } else if ((n==2)||(n==4)) { // 2x2 on cubes:96  charAt(0) is "f" or numeric
        r =                               creFaces( 1,  3,-59,-39,"X(-90deg)",4);
        r+=unfold(17,"",4).charAt(0)!="f"?creFaces(17,-10,-46,-39,"Y(-90deg)",4):creFaces(517,-91,-13, -52,"Y(-90deg)",4);
        r+=                               creFaces(33,  3,-46, 52,"X(0deg)",4);
        r+=unfold(49,"",4).charAt(0)!="f"?creFaces(49, 94,-46, 39,"Y(-90deg)",4):creFaces(549,185,-13,  26,"Y(-90deg)",4);
        r+=unfold(65,"",4).charAt(0)!="f"?creFaces(65, 81,-46,-52,"X(0deg)",4):  creFaces(565,120,-42,-145,"X(0deg)",4);
        r+=unfold(81,"",4).charAt(0)!="f"?creFaces(81,  3, 45, 39,"X(-90deg)",4):creFaces(581,-26,118,  13,"X(-90deg)",4);
    } else {
        var pw = n*n; if (N>=7) FaceF = "";
        r =                                    creFaces(   1,    3,-58,-41,"X(-90deg)",n);
        r+=unfold(pw+1,"",n).charAt(0)!="f"?   creFaces(pw+1,   -9,-46,-41,"Y(-90deg)",n):
                                               creFaces(pw+501,-91,-13,-52,"Y(-90deg)",n);
        r+=                                    creFaces(2*pw+1,  3,-46,22*n-52,   "X(0deg)",n);
        r+=unfold(3*pw+1,"",n).charAt(0)!="f"? creFaces(3*pw+1,22*n-8,-46,22*n-63,"Y(-90deg)",n):
                                               creFaces(3*pw+501, 185,-13,     26,"Y(-90deg)",n);
        r+=unfold(4*pw+1,"",n).charAt(0)!="f"? creFaces(4*pw+1,22*n-20,  -46, -52,"X(0deg)",n):
                                               creFaces(4*pw+501,20*n+18,-46,-200,"X(0deg)",n);
        r+=unfold(5*pw+1,"",n).charAt(0)!="f"? creFaces(5*pw+1,    3,22*n-57,22*n-63,"X(-90deg)",n):
                                               creFaces(5*pw+501,-26,20*n+18,10*n-37,"X(-90deg)",n);
    }
    $("#cubeFields").html(r);
    if (so) return;
    $("#rotLayer").html("");
    $(".mezo span").css("display",Disp);
}
const CV2244 = [1,1, 5,17, 9,33,13,49,17,65,21,81];
function creFaces(no,x,y,z,rotate,n=3) { // no:top of each face
    var r="",d=n==4?26:n>=5?22:30,i,j,x1,z1,y4,z4,udfbrl="",j1=0,clsM,clsN,no3;
    rotate=="X(-90deg)"&&z<0&&(x1=d,z1=0,y4=0,z4=d, udfbrl="U");
    rotate=="X(-90deg)"&&z>0&&(x1=d,z1=0,y4=0,z4=-d,udfbrl="D");
    rotate=="Y(-90deg)"&&z<0&&(x1=0,z1=d,y4=d,z4=0, udfbrl="L");
    rotate=="Y(-90deg)"&&z>0&&(x1=0,z1=-d,y4=d,z4=0,udfbrl="R");
    rotate=="X(0deg)"&&  z>0&&(x1=d,z1=0,y4=d,z4=0, udfbrl="F");
    rotate=="X(0deg)"&&  z<0&&(x1=-d,z1=0,y4=d,z4=0,udfbrl="B");

    for (i=0;i<n;i++) {
        j1 = [0,4,12,0][i];
        for (j=0;j<n;j++) {  // M=1,2,4 5,6,8 13,14,16　…　j1+=j,ij=i*4+j1 
            var segs = " matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,"+(x+j*x1)+","+(y+i*y4)+","+(z+i*z4+j*z1)+",1) rotate"+rotate ;
            no3 = (no>500)?no-500:no;
            clsN = no3+ i*n+j;
            if (n==2) { j1 += j; clsM = CV2244[CV2244.indexOf(no3)+1] + j1; }
            else                 clsM = clsN;
            r += '<div class="mezo'+ unfold(clsM," szin",(n>2)?n:4)+Na(clsM,(n>2)?n:4)+ ' field mezo" ' + 'style="transform:'+segs+'">'+
                 (LED||(Disp=="none")?"":('<span style="font-size:x-small; font-weight:bold">'+
                                  (Face=="F"?"&nbsp;"+udfbrl:clsN) +'</span>'))+'</div>';
        }
    }
    return r;
}
function kiirRote(gost,e) { 
// 移動対象PartsのHTMLを#rotLayerに作成、順番はrotParts[i][y][x].slice(1)の手の形から
// 指の向きにpostsにスタックする。２面、３面、０面の順、１、４、５と続く。再生は先着１０個
// 1,2,3面に上向き指なら、それぞれの面でｙ減少方向に、最後に０面一括
// 1,2,3面に下向き指なら、最初に０面一括、それぞれの面でｙ増加方向に、
// 横向き指なら、それぞれの面でそのｘ方向に、
    if (LED) if (CounterB>0) {
        setTimeout("kiirRote(rotParts,"+e+");",800);
        return true;
    }
    var lo="",r=-1, m=0, p=0, wink="", n = (N==2)?4:N;
    if ((e>30)&&(e<50)) e-=30;
    posts = [];
    for (var fm=[2,3,0,1,4,5],f=0;f<6;f++)
        for (var i=fm[f],y=0;y<n;y++)
            for (var x=0;x<n;x++)
                if (gost[i][y][x]) {
                   var rr = CubeNo(i,y,x,n);
                   posts.push(rr);
                   if ((wink=="")&&(gost[i][y][x].length>1)) {
                           r = p;
                           wink = gost[i][y][x].slice(1);
                           while (gost[i][y][x+m]&&(gost[i][y][x+m].length>1)) m++;
                   }
                   p++;
                }
    if (LED&&(e<50)&&(r>-1)) { // meteor
        var ary=[];
        punit = ((wink=="👈")||(wink=="👉"))? 1:m ; 
        function postPick(bgn,unt) {
            ary=[];for (i=0;i<unt;i++) ary.push(posts[bgn+i*punit]);
            return ary;
        }
        top10=[];if ($("#sample2check").prop("checked")) {
            var top51 = postPick(r,n);
            var top52 = postPick(r+n*punit,n);
            if      (wink=="👈") top10 = top52.reverse().concat(top51.reverse());
            else if (wink=="👆") top10 = top51.reverse().concat(top52.reverse());
            else if (wink=="👉") top10 = postPick(r,n*2);
            else if (wink=="👇") top10 = top52.concat(top51);
            los = "";
        }
        if (top10.length>0) {
            pwk = partsWinker(posts,0,'tail');
            meteorWinker(top10,meteorWinker,'head');
        } else {
            pwk = partsWinker(posts,0,'body');
            bodyWink();
        }
        return true;
    } 
    if (posts.length>0) {
        kiirRotLayer(posts,e,n,true);
        return false;
    }
    return false;
}
function partsWinker(parts,bgn=0,hbt='body') {
    var n=N,lo="";
    for(var i=bgn;i<parts.length;i++) {
        var s = unfold(parts[i]," szin", n); 
        var t = "#cubeFields .mezo"+ s.slice(0,-6);
        lo += '<div class="mezo'+ s + Ns(parts[i],n) +' layer mezo" style="transform:'+ $(t).css('transform') +'">'+
              ((Nt(parts[i],n)=="")?"":(hbt!='body')? Nt(parts[i],n):('<span class="winker">' + Nt(parts[i],n) + '</span>')) + '</div>'; //  
    }
    return lo;
}
let top10,los,pwk,punit;
function meteorWinker(top=top10,nextF=noop,hbt='tail') {
    $("#rotLayer").css("display","block");
    if ((CounterB==0)&&(top.length==0)) {
        if (hbt=='tail') kiir(), turnN++;
        Counter = 0;
        return false;
    }
　　var n=N, met=top.slice(), r = met.shift();
    Counter++;
    CounterB++;
    setTimeout(function(){
       for (var no=r;no<r+punit;no++) {
           var s = unfold(no," szin", n); 
           var t = "#cubeFields .mezo"+ s.slice(0,-6);
           los += '<div class="mezo'+ s + Ns(no,n) + ' layer mezo" style="transform:' + 
                     $(t).css('transform') + ((hbt=='head')? ('">'+Nt(no,n)):'"> ')+'</div>';
       }
       $("#rotLayer").html(los);
       ((Counter>0)&&(met.length>0))?
           meteorWinker(met,nextF,hbt):
           ((hbt=='tail')?(kiir(),turnN++,los="",Counter=0):los=pwk,CounterB=0,nextF());
     },speed*2); // 
}
function bodyWink() { 
        $("#rotLayer").html(pwk);
        $(".winker").show();
        $("#rotLayer").show();
        Counter++;
        flushWinker(speed*4,4);
}

function kiirRotLayer(r,e,n=N,g=false){  // 書き直しのレイヤー選択
    if (Counter<0) return;
    var i, s, t, lo="", rr=r, ra, flip, n = (n==2)?4:n;
    if (typeof(r[0])=='object') rr = r[0].concat(r.slice(1));
    if (!LED) {
        flip = FaceF; FaceF=""; // 回転中は鏡部分を畳んで表示することに決めた（V5）
        $("#rotLayer").html($("#cubeFields").html()); // #cubeFieldsのデータ退避
        kiir(n,true);           // 畳んだ状態での#cubeFieldを新規作成
        FaceF = flip;
        for(i=0;i<rr.length;i++) {
            t = "#cubeFields .mezo"+ rr[i];
            lo += '<div class="mezo'+ rr[i] + " szine" + (g?Ns(rr[i],n):Na(rr[i],n)) +
                      ' layer mezo" style="transform:' + $(t).css('transform') + '">' +
                      $(t).html() + '</div>';
        }
        $("#cubeFields").html($("#rotLayer").html()); // 退避を戻す
    }
    for(i=0;i<rr.length;i++) {
        s = unfold(rr[i]," szin", n);  // unfoldは常にツール主体の配列サイズ
        t = "#cubeFields .mezo"+ s.slice(0,-6);
        if ((LED&&(rr[i]>0))||(s.charAt(0)=="f")&&( // layer[0][0]は各面の3x3での左上Cubeアドレス、[8]は右下
            (e==2)&&(CubeNo(1,0,0,n)<=rr[i])&&(CubeNo(1,n-1,n-1,n)>=rr[i])||
            (e==5)&&(CubeNo(4,0,0,n)<=rr[i])&&(CubeNo(4,n-1,n-1,n)>=rr[i])||
            ((e==6)||(e==99))&&(CubeNo(5,0,0,n)<=rr[i])&&(CubeNo(5,n-1,n-1,n)>=rr[i])||
            (e==4)&&(CubeNo(3,0,0,n)<=rr[i])&&(CubeNo(3,n-1,n-1,n)>=rr[i])))
             lo += '<div class="mezo'+ s + (g?Ns(rr[i],n):Na(rr[i],n)) +
                   ' layer mezo" style="transform:' + $(t).css('transform') + '">' +
                   ((LED&&(e<50))?Nt(rr[i],n):$(t).html()) + '</div>';
        if (lo.length>0) $(t).hide();
    }
    $("#rotLayer").html(lo);// facerotate()か、kiir()で表示
}
function flushWinker(tm,cnt=8) {
    CounterB++;
　　var id=".winker";
    setTimeout(function() {
            $(id).css("display",CounterB%2?"none":"block");
            cnt>CounterB?flushWinker(tm,cnt):(CounterB=0,meteorWinker());
        },tm); // 
}
const noop=() => {}
function facerotate(e, a, tm, n=N) {
    rotParts = new Array(6);
    for (var i=0;i<6;i++) {
            rotParts[i] = new Array(8);
            for (var j=0;j<8;j++) rotParts[i][j] = [];
    }
    moveSTK[e][4-(a&1)].forEach(function(v,i,ar) {
        v(ar.length); // console.log(e+','+v);
    });
    if ((tm==2)&&(moveSTK[e][0].charAt(1)!="2"))
        moveSTK[e][4-(a&1)].forEach(function(v,i,ar) {
            v(ar.length);
        });
    if (Counter<0) return;
    if (kiirRote(rotParts,e)) return;
    if (a>80) {
        facerote(a, tm);
        return;
    }
    if ((N%2==0)&&(e==10)) a = 51;
    if (e>43) e-=30;
    else if ((e>37)&&(e<40)) e-=23;  //  15,16
//    rotParts = new Array(6);
    const core_e1 =[0,1,2,3,4,5,6,2,1,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
    const core_e2 =[0,0,0,0,0,0,0,4,6,0, 0, 2, 4, 0, 6, 3, 0,10,11,12, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0];
    var odiv = crtDiv(core_e1[e],n)+((core_e2[e]>0)&&((n<6)||(e<15))?crtDiv(core_e2[e],n):"");
    if (e==41) odiv = crtDiv(core_e1[18],n)+crtDiv(core_e1[19],n); // Mt
    if (e==43) odiv = crtDiv(core_e1[17],n)+crtDiv(core_e1[24],n); // M4
    $("#cubeFields").append(odiv);
    $("#rotLayer").append(odiv);
    if (!LED) $(".mezo span").css("display",Disp);
    facerote(a, tm);
}
function facerote(a, tm) {
    var w = tm * 10 * Counter;
    $("#rotLayer").css("transform-origin","50% 50% 0");
    setTimeout(function(){
11==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),12==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),
21==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),22==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),
31==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),32==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),
41==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),42==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),
51==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),52==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),
61==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),62==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),
71==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),72==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),
73==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),74==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),
81==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),82==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),
91==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),92==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),
101==a&&$("#rotLayer").css("transform","rotateX("+w+"deg)"),102==a&&$("#rotLayer").css("transform","rotateX(-"+w+"deg)"),
111==a&&$("#rotLayer").css("transform","rotateY(-"+w+"deg)"),112==a&&$("#rotLayer").css("transform","rotateY("+w+"deg)"),
121==a&&$("#rotLayer").css("transform","rotateZ("+w+"deg)"),122==a&&$("#rotLayer").css("transform","rotateZ(-"+w+"deg)"),
    Counter++,10>Counter?facerote(a, tm):($("#rotLayer").html(""),$("#rotLayer").css("transform","rotateY(0deg)"),  //  
    kiir(),Counter=0,turnN+=1)},speed)}
                                  
function turnStart(a){
    if (a=="") return;
//    a += "2";  // for verification
// console.log(a);
    var e, aa, pos, w=1;
    if (N==2) a = a.slice(0,1)+"w"+a.slice(1);
    if ((N<6)&&(a.toLowerCase()=="mt")) a = a.slice(0,1)+a.slice(2);
    if (0>=Counter) {
        if ((a.charAt(1)=="2")||(a.charAt(2)=="2")) {
            a = a.slice(0,2);
            w = 2;
        }
        if ((Counter==0)&&($("#miniCube").css('display')!="none")&&
            ($("#parity").prop('disabled')) &&
            (!$("#solve3").prop('disabled')))  miniCube.Rotates.push(a);
        pos = moveSTK.filter(function(line,index,array) {
            if (line[0]==a){
                e = index; aa = line[2];
                return true;
            } else if (line[1]==a) {
                e = index; aa = line[2] + 1;
                return true;
            }
            return false;
        });
        if (pos.length>0) facerotate(e,aa, w);
    }
}
function turn(a) {
    if (Pause) {
        turnStart(a);
        return;
    }
//    Comment = "";  // rotate("*")で消すこと
    clearTimeout(Tid2);
    if (a!="") Rotates.push(a);
    setTimeout("checkRot();check33();",100);
}
function checkRot() {
    var rot,rote=0,s1,s2,t1,t2,lo="",newcolor="transparent"; 
    if (parent && ((window.name=="cube3dg")||(window.name=="cube3dh"))) {
        var rotbuf = (window.name=="cube3dg")?parent.RotatesG:parent.RotatesH;
        if (rotbuf.length>0) {
            rot = regRot(rotbuf.trim().split(" "));
            if (window.name=="cube3dg") parent.RotatesG = "";
            else                        parent.RotatesH = "";
            setRot(rot);
        }
    }
    else if ((window.name=="cube3d") || (parent.swin==null) || (parent.swin.closed)) {
        if (opener && opener.Rotates && (opener.Rotates.length>0)) {
            rot = regRot(opener.Rotates.trim().split(" "));
            opener.Rotates = "";
            setRot(rot);
        }
    }
    if ((Pause==false) && (Rotates.length>0)) {
        if (Counter>0) rote = false;
        else rote = Rotates.shift();
        while (rote && (rote.charAt(0)=="*")) {
            Fix44 = false;
            if (rote=="*Fin") {
                Comment += " Fin "+Cool; check33();
                if ((NxPaus<700)&&(Rotates.length>0)) {
                    Comment = "Parity Process";
                    $("#parity").attr('disabled',true);
                }
                cssNN(N==2?4:N,0);
                waitFin((Cool>0)?20:-1);
            } else if (rote.charAt(1)=="*") { // step reset 
                Comment = rote.slice(2);
                turnN=1; check33(); kiir();
            } else if ((rote.charAt(1)=="$")||(rote.charAt(1)=="#")) { 
                // flushing important post #mmnn.... with 4x4 No.
                $("#comment").html(Comment);
                if ((rote.charAt(1)=="#")&&
                    ($("#miniCube").css('display')!="none")&&(!$("#solve3").prop('disabled')))
                                        miniCube.Rotates.push(rote);
                cubeFlush(rote);
                Tid2 = setTimeout("checkRot()",NxPaus);
                return;
            } else if (rote.charAt(1)=="+") { // virtual Y rotation convert 
                RotSft = parseInt(rote.slice(2));
            } else if (rote.charAt(1)=="-") { // Turn count decrement 
                turnN -= parseInt(rote.slice(2));
            } else if (rote.charAt(1)=="0") { // Cube setup without rotation
                var i,j;
                if (rote.length==2) initCube(N);
                Counter = -1;  // NO rotation mode
                while (Rotates.length>0) {
                    var rot = Rotates.shift();
                    if (rot.charAt(0)=="*") {
                        if (rot.length==1) break;
                    } else {
                        if (rote.charAt(2)!='*') turnN++;   
                        turnStart(rot);
                    }
                }
                Counter = 0;  // Nomal rotation mode
                kiirRotLayer(wholecube,99);
                kiir();
            } else {
                Comment = (Rotates.length==0)?"":rote.slice(1);
                var title = Comment.split("|");
                if (title.length>1)
                    Comment = "<span title='"+ title[1]+"'>"+title[0]+"</span>";
                $("#rotate").html("");
                $(".lowerRot").css("font-size","16px");
            }  
            $("#comment").html(Comment);
            rote = Rotates.shift();
        }
        if ((RotOmt==1)&&rote&&(rote.toUpperCase()=="Y")) {
            if (rote=="Y") RotSft = (RotSft+1) & 3;
            else           RotSft = (RotSft+3) & 3;
            rote = null;
        }
        if (rote) {
            if (turnN>N*500){
                pause();
                console.log('%c【 Moves Count Over %d!! 】',"color:red",turnN);
            }
            Urot = rote;
            Urote = dispRote(rote);
            if (Urote) turnStart(Urote);
        }
    }
    if (Auto || (Comment.indexOf(" Fin")<0))
        Tid2 = setTimeout("checkRot()",NxPaus);
}
function dispRote(rot) {
    var rote = rot;
    if (Rotates[0]) {
        if ((rot.length==1)&&(rot==Rotates[0])) {
            rote = Rotates.shift() + "2";  // おまとめ回転なので纏める。
//            console.log('Joint '+rot+rot);
        } else if ((rot!=Rotates[0])&&(rot.toLowerCase()==Rotates[0].toLowerCase())||
                   (rot==Rotates[0])&&(rot.charAt(1)=="2")) {
            var rot2 = Rotates.shift();  // 無駄な正逆回転や４回転なので捨てる。
            console.log('Cut '+rot+rot2);
            if ((Rotates.length>0)&&(Rotates[0].charAt(0)!="*"))
                  rote = dispRote(Rotates.shift());
            else  return false;
        }
    }
    $("#turn").html(String(turnN));
    var rotm = Maprote.get(rote.charAt(0));
    rote = ((typeof rotm==='string')?rotm.charAt(RotSft):rote.charAt(0)) +rote.slice(1);
    var rotExp = (rote.charCodeAt(0) & 0x20)>0?String.fromCharCode(rote.charCodeAt(0) ^ 0x20)+
                 (rote.charAt(1)=="2"?"'2":rote.charAt(1)+"'"+rote.slice(2)):rote;
    $("#rotate").html($("#rotate").html()+" "+rotExp);
    if ($("#rotate").html().length>32) $(".lowerRot").css("font-size","11px");
    if (Tlog==1) Solution += " "+rotExp;
    return rote;
}
function regRot(seq) { // 回転のprime表記を大文字・小文字系に変換する
    var seqR = seq.map(function (value, index, array) {
               return ((value.charCodeAt(0)<0x60)? 
                        (((value.charAt(1)=="'")||(value.charAt(2)=="'"))?
                               (String.fromCharCode(value.charCodeAt(0) ^ 0x20)+(value.charAt(2)=="'"?
                                                    value.charAt(1)+value.charAt(3):value.charAt(2))):value):
                        (value.charAt(1)=="'")?"m"+value.charAt(0)+value.slice(2):"M"+value);
                });
    return seqR;
}
function setRot(rot) {  // 大文字小文字系の回転列のリバース処理
    var rotR = rot;
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
function rewind(rot) { // 既に回転が終わっている文字列を急速巻き戻しして、
                       // 実施すべき通常再生パターン配列を返す。
    Pause = true;
    var rvsRot = rot.trim().split(",");
    var oldTurn = turnN;
    setRot(["*0*"]); // turnカウントに入れず
    setRot(["!"].concat(rvsRot));
    setRot(["*"]);
    turnN = oldTurn;
    Pause = false;
    return rvsRot;
}
// 以下、m=0なら回転表示しない
function MoveHori(m,w,l,n=N) { // CW Rotate horizontal layer l. 
    if (n==2) n = 4;
    var i, j, x; // (N>3)?N:4 if (N==3) if (l==2) l = 3;
    for (x=0;x<n;x++) s[x] = CubeMap[1][l][x];
    if (m>0) for(i=1;i<5;i++)for(j=0;j<n;j++) {
            rotParts[i][l][j] = String(CubeMap[i][l][j]) + ((i>2)?"👉":"👈"); }
    if (w==2) for (x=0;x<n;x++) s[x+n] = CubeMap[2][l][x];
    for (i=1;i<5;i++)
        for (x=0;x<n;x++) {
            if (i<5-w) CubeMap[i][l][x] = CubeMap[i+w][l][x];
            if (i==4)           CubeMap[5-w][l][x] = s[x];
            if ((w==2)&&(i==3)) CubeMap[4][l][x]   = s[x+n];
        }
}
function moveHori(m,w,l,n=N) { // CCW Rotate horizontal layer l. 
    if (n==2) n = 4;
    var i, j, x; // (N>3)?N:4 if (N==3) if (l==2) l = 3;
    if (m>0) for(i=1;i<5;i++)for(j=0;j<n;j++) {
            rotParts[i][l][j] = String(CubeMap[i][l][j]) + ((i>2)?"👈":"👉"); }
    for (x=0;x<n;x++) s[x] = CubeMap[4][l][x];
    if (w==2) for (x=0;x<n;x++) s[x+n] = CubeMap[3][l][x];
    for (i=4;i>0;i--)
        for (x=0;x<n;x++) {
            if (i>w) CubeMap[i][l][x] = CubeMap[i-w][l][x];
            if (i==1)           CubeMap[w][l][x] = s[x];
            if ((w==2)&&(i==2)) CubeMap[1][l][x] = s[x+n];
        }
}
function MoveVert(m,w,l,n=N) { // CW Rotate vertical layer l. 
    if (n==2) n = 4;
    var i, j, y, ty, tl, tate=[0,2,5,4], Dtate=["👇","👆","👆","👇"];
    if (m>0) for(i=0;i<4;i++)for(j=0;j<n;j++) {
            var vl=l;if (i==3) vl=n-1-l;
            rotParts[tate[i]][j][vl] = String(CubeMap[tate[i]][j][vl]) + Dtate[i]; }
    for (y=0;y<n;y++) s[y] = CubeMap[0][y][l];
    if (w==2) for (y=0;y<n;y++) s[y+n] = CubeMap[2][y][l];
    for (y=0;y<n;y++) {
        ty=y;tl=l;if (w==2) ty=n-1-y, tl=n-1-l;
        CubeMap[0][y][l] = CubeMap[tate[w]][y][l];
        if (w==1) { ty=n-1-y, tl=n-1-l;
            CubeMap[2][y][l] = CubeMap[5][y][l];
            CubeMap[5][y][l] = CubeMap[4][ty][tl];
        } else {
            CubeMap[2][y][l] = CubeMap[4][ty][tl];
        }
    }
    for (y=0;y<n;y++) {
        ty=y;tl=l;if (4-w==3) ty=n-1-y, tl=n-1-l;
        CubeMap[tate[4-w]][ty][tl] = s[y];
        if (w==2) CubeMap[4][n-1-y][n-1-l] = s[y+n];
    }
}
function moveVert(m,w,l,n=N) { // CCW Rotate vertical layer l. 
    if (n==2) n = 4;
    var i, j, y, vl, rtate=[4,5,2,0], dtate=["👆","👇","👇","👆"];
    if (m>0) for(i=0;i<4;i++)for(j=0;j<n;j++) {
         vl=l;if (i==0) vl=n-1-l;
         rotParts[rtate[i]][j][vl] = String(CubeMap[rtate[i]][j][vl]) + dtate[i]; }
    for (y=0;y<n;y++) s[y] = CubeMap[4][n-1-y][n-1-l];
    if (w==2) for (y=0;y<n;y++) s[y+n] = CubeMap[5][y][l];
    for (y=0;y<n;y++) {
        vl = n-1-l;
        CubeMap[4][n-1-y][vl] = CubeMap[rtate[w]][y][l];
        if (w==1) {
            CubeMap[5][y][l] = CubeMap[2][y][l];
            CubeMap[2][y][l] = CubeMap[0][y][l];
        } else {
            CubeMap[5][y][l] = CubeMap[0][y][l];
        }
    }
    for (y=0;y<n;y++) CubeMap[rtate[4-w]][y][l] = s[y];
    if (w==2) for (y=0;y<n;y++) CubeMap[0][y][l] = s[y+n];
}
function MoveCirc(m,w,l,n=N) { // CW Rotate Circle layer l. 
    if (n==2) n = 4;
    var i, j, x, vx, vl=n-1-l, rund=[0,1,5,3];
    if (m>0) for(j=0;j<n;j++) {
        rotParts[0][vl][j] = String(CubeMap[0][vl][j]) + "👉";
        rotParts[1][j][vl] = String(CubeMap[1][j][vl]) + "👆";
        rotParts[3][j][l]  = String(CubeMap[3][j][l]) + "👇";
        rotParts[5][l][j]  = String(CubeMap[5][l][j]) + "👈";
    }
    for (x=0;x<n;x++) s[x] = CubeMap[0][vl][x];
    if (w==2) for (x=0;x<n;x++) s[x+n] = CubeMap[1][x][vl];
        for (x=0;x<n;x++) {
            vx = n-1-x; //  正転 5->1,0->3　w=2は必ず逆転
            if (w==1) {
               CubeMap[0][vl][x]  = CubeMap[1][vx][vl];
               CubeMap[1][vx][vl] = CubeMap[5][l][vx];
               CubeMap[5][l][vx]  = CubeMap[3][x][l];
            } else {
               CubeMap[0][vl][x] = CubeMap[5][l][vx];
               CubeMap[1][x][vl] = CubeMap[3][vx][l];
            }
        }
    for (x=0;x<n;x++) { vx = n-1-x;
        if (w==1) CubeMap[3][x][l]  = s[x];
        else   {  CubeMap[5][l][vx] = s[x];
                  CubeMap[3][vx][l] = s[x+n]; }
    }
}
function moveCirc(m,w,l,n=N) { // CCW Rotate Circle layer l. 
    if (n==2) n = 4;
    var i, j, x, vx, vl=n-1-l, rund=[0,3,5,1];
    if (m>0) for(j=0;j<n;j++) {
        rotParts[0][vl][j] = String(CubeMap[0][vl][j]) + "👈";
        rotParts[1][j][vl] = String(CubeMap[1][j][vl]) + "👇";
        rotParts[3][j][l]  = String(CubeMap[3][j][l]) + "👆";
        rotParts[5][l][j]  = String(CubeMap[5][l][j]) + "👉";
    }
    for (x=0;x<n;x++) s[x] = CubeMap[0][vl][x];
    if (w==2) for (x=0;x<n;x++) s[x+n] = CubeMap[3][x][l];
        for (x=0;x<n;x++) {
            vx = n-1-x; //  正転 5->1,0->3　w=2は必ず逆転
            if (w==1) {
               CubeMap[0][vl][x] = CubeMap[3][x][l];
               CubeMap[3][x][l]  = CubeMap[5][l][vx];
               CubeMap[5][l][vx] = CubeMap[1][vx][vl];
            } else {
               CubeMap[0][vl][x] = CubeMap[5][l][vx];
               CubeMap[3][vx][l] = CubeMap[1][x][vl];
            }
        }
    for (x=0;x<n;x++) { vx = n-1-x;
        if (w==1) CubeMap[1][vx][vl] = s[x];
        else   {  CubeMap[5][l][vx]  = s[x];
                  CubeMap[1][vx][vl] = s[x+n]; }
    }
}
function roteX(m,w,f,nn=0) {
    var i, j, fr, to, ww=w;
    var n=N==2?4:N;
    // n=奇数は3からN、偶数は2からN、1ずつUP
    if (nn==0) {
        fr = (n>>1)-1; to = n-fr-1;
        if (m>0) for(i=0;i<n;i++)for(j=0;j<n;j++)
            rotParts[f][i][j] = String(CubeMap[f][i][j]) + ""; 
    } else {
        fr = nn - 1 ; to = n-fr-1;
    }
    while (ww-->0) {
        for (i=fr;i<=to;i++)
            s[i] = CubeMap[f][fr][i];
        for (i=fr;i<=to;i++)
            CubeMap[f][fr][i] = CubeMap[f][i][to];
        for (i=fr;i<to;i++)
            CubeMap[f][i][to] = CubeMap[f][to][to-i+fr];
        for (i=fr;i<=to;i++)
            CubeMap[f][to][to-i+fr] = CubeMap[f][to-i+fr][fr];
        for (i=fr;i<=to;i++)
            CubeMap[f][to-i+fr][fr] = s[i];
    }
    if (fr==0) return;
    roteX(m,w, f, fr);
}
function RoteX(m,w,f,nn=0) {
    var i, j, fr, to, ww=w;
    var n=N==2?4:N;
    // n=奇数は3からN、偶数は2からN、1ずつUP
    if (nn==0) { 
        fr = (n>>1)-1; to = n-fr-1;
        if (m>0) for(i=0;i<n;i++)for(j=0;j<n;j++)
            rotParts[f][i][j] = String(CubeMap[f][i][j]) + ""; 
    } else {
        fr = nn-1 ; to = n-fr-1;
    }
    while (ww-->0) {
        for (i=fr;i<=to;i++)
            s[i] = CubeMap[f][fr][i];
        for (i=fr;i<to;i++)
            CubeMap[f][fr][i] = CubeMap[f][to-i+fr][fr];
        for (i=fr;i<=to;i++)
            CubeMap[f][i][fr] = CubeMap[f][to][i];
        for (i=fr;i<to;i++)
            CubeMap[f][to][i] = CubeMap[f][to-i+fr][to];
        for (i=fr;i<=to;i++)
            CubeMap[f][i][to] = s[i];
    }
    if (fr==0) return;
    RoteX(m,w, f, fr);
}
const Ml=(m=0) => {
     if (N!=3) moveVert(m,1,1);
}
const ml=(m=0) => {
     if (N!=3) MoveVert(m,1,1,N);
}
const Lc=(m=0) => {
     if (N>=6) moveVert(m,1,2);
}
const lc=(m=0) => {
     if (N>=6) MoveVert(m,1,2);
}
const Rc=(m=0) => {
     if (N>=6) MoveVert(m,1,N-3);
}
const rc=(m=0) => {
     if (N>=6) moveVert(m,1,N-3);
}
const Cl=(m=0) => {
     if (N>=4) moveVert(m,1,(N>>1)-1);
}
const cl=(m=0) => {
     if (N>=4) MoveVert(m,1,(N>>1)-1);
}
const Cr=(m=0) => {
     if (N>=4) MoveVert(m,1,N-(N>>1));
}
const cr=(m=0) => {
     if (N>=4) moveVert(m,1,N-(N>>1));
}
const Cf=(m=0) => {
     MoveCirc(m,1,(N>>1)-1);
}
const cf=(m=0) => {
     moveCirc(m,1,(N>>1)-1);
}
const Cb=(m=0) => {
     moveCirc(m,1,N>>1);
}
const cb=(m=0) => {
     MoveCirc(m,1,N>>1);
}
const Cu=(m=0) => {
     if (N==8) MoveHori(m,1,Over5+1);
     else      MoveHori(m,1,2);
}
const cu=(m=0) => {
     if (N==8) moveHori(m,1,Over5+1);
     else      moveHori(m,1,2);
}
const Mc=(m=0) => {
    if (N&1>0) MoveVert(m,1,N>>1);
}
const mc=(m=0) => {
    if (N&1>0) moveVert(m,1,N>>1);
}
const Mr=(m=0) => {
    if (N>3) MoveVert(m,1,N-2,N);
}
const mr=(m=0) => {
    if (N>3) moveVert(m,1,N-2,N);
}
const MM=(m=0) => {
    if (N==8) ml(m),lc(m),cl(m),Mc(m),Cr(m),Rc(m),Mr(m);
    else if (N>5) ml(m),cl(m),Mc(m),Cr(m),Mr(m);
    else ml(m),Mc(m),Mr(m);
}
const mm=(m=0) => {
    if (N==8) Ml(m),Lc(m),Cl(m),mc(m),cr(m),rc(m),mr(m);
    else if (N>5) Ml(m),Cl(m),mc(m),cr(m),mr(m);
    else Ml(m),mc(m),mr(m);
}
const zz=(m=0) => {
    RoteX(m,1,2);
    for (var i=0;i<(N==2?4:N);i++) MoveCirc(m,1,i);
    roteX(m,1,4);
}
const Zz=(m=0) => {
    roteX(m,1,2);
    for (var i=0;i<(N==2?4:N);i++) moveCirc(m,1,i);
    RoteX(m,1,4);
}
const Bor=(m=0) => {
    for (var i=0;i<(N==2?4:N);i++) MoveVert(m,1,i);
    RoteX(m,1,3); roteX(m,1,1);
}
const bor=(m=0) => {
    for (var i=0;i<(N==2?4:N);i++) moveVert(m,1,i);
    RoteX(m,1,1); roteX(m,1,3);
}
const bor2=(m=0) => {
    for (var i=0;i<N;i++) moveVert(m,2,i);
    RoteX(m,2,1); roteX(m,2,3);
}
const dd=(m=0) => {
    moveHori(m,1,N-1);
    RoteX(m,1,5);
}
const d2=(m=0) => {
    moveHori(m,2,N-1);
    RoteX(m,2,5);
}
const di=(m=0) => {
    MoveHori(m,1,N-1);
    roteX(m,1,5);
}
const fd=(m=0) => {  // Y move
    for (var i=0;i<(N==2?4:N);i++) MoveHori(m,1,i);
    RoteX(m,1,0); roteX(m,1,5);
}
const Fd=(m=0) => {  // y move
    for (var i=0;i<(N==2?4:N);i++) moveHori(m,1,i);
    RoteX(m,1,5); roteX(m,1,0);
}
const fd2=(m=0) => {
    for (var i=0;i<(N==2?4:N);i++) MoveHori(m,2,i);
    roteX(m,2,5); RoteX(m,2,0);
} 
const uu=(m=0) => {
    MoveHori(m,1,0);
    RoteX(m,1,0);
}
const u2=(m=0) => {
    MoveHori(m,2,0);
    RoteX(m,2,0);
}
const ui=(m=0) => {
    moveHori(m,1,0);
    roteX(m,1,0);
}
const ff=(m=0) => {
    RoteX(m,1,2);
    MoveCirc(m,1,0);
}
const f2=(m=0) => {
    RoteX(m,2,2);
    MoveCirc(m,2,0);
}
const fi=(m=0) => {
    roteX(m,1,2);
    moveCirc(m,1,0);
}
const rr=(m=0) => {
    MoveVert(m,1,N-1);
    RoteX(m,1,3);
}
const r2=(m=0) => {
    MoveVert(m,2,N-1);
    RoteX(m,2,3);
}
const ri=(m=0) => {
    moveVert(m,1,N-1);
    roteX(m,1,3);
}
const ll=(m=0) => {
    moveVert(m,1,0);
    RoteX(m,1,1);
}
const l2=(m=0) => { 
    moveVert(m,2,0);
    RoteX(m,2,1);
}
const li=(m=0) => {
    MoveVert(m,1,0);
    roteX(m,1,1);
}
const bb=(m=0) => {
    RoteX(m,1,4);
    moveCirc(m,1,N-1);
}
const b2=(m=0) => {
    RoteX(m,2,4);
    moveCirc(m,2,N-1);
}
const bi=(m=0) => {
    roteX(m,1,4);
    MoveCirc(m,1,N-1);
}
const Mu=(m=0) => {
    MoveHori(m,1,1);
}
const Md=(m=0) => {
    moveHori(m,1,N-2);
}
const Mf=(m=0) => {
    MoveCirc(m,1,1);
}
const Mb=(m=0) => {
    moveCirc(m,1,N-2);
}
const mu=(m=0) => {
    moveHori(m,1,1);
}
const md=(m=0) => {
    MoveHori(m,1,N-2);
}
const mf=(m=0) => {
    moveCirc(m,1,1);
}
const mb=(m=0) => {
    MoveCirc(m,1,N-2);
}
const Rw=(m=0) => {
    MoveVert(m,1,2,4);
    MoveVert(m,1,3,4);
    RoteX(m,1,3)}
const rw=(m=0) => {
    moveVert(m,1,3,4);
    roteX(m,1,3);
    moveVert(m,1,2,4)}
const Lw=(m=0) => {
    ll(m),Ml(m)}
const lw=(m=0) => {
    MoveVert(m,1,0,4);
    roteX(m,1,1);
    MoveVert(m,1,1,4)}
const Uw=(m=0) => {
    uu(m),Mu(m)}
const uw=(m=0) => {
    ui(m),mu(m)}
const Dw=(m=0) => {
    moveHori(m,1,3,4);
    RoteX(m,1,5);
    moveHori(m,1,2,4)}
const dw=(m=0) => {
    MoveHori(m,1,3,4);
    roteX(m,1,5);
    MoveHori(m,1,2,4)}
const Fw=(m=0) => {
    ff(m),Mf(m)}
const fw=(m=0) => {
    fi(m),mf(m)}
const Bw=(m=0) => {
    RoteX(m,1,4);
    moveCirc(m,1,3,4);
    moveCirc(m,1,2,4)}
const bw=(m=0) => {
    roteX(m,1,4);
    MoveCirc(m,1,3,4);
    MoveCirc(m,1,2,4)}

 moveSTK[1]=["U","u",11,[uu],[ui]];
 moveSTK[2]=["L","l",21,[ll],[li]];
 moveSTK[3]=["F","f",31,[ff],[fi]];
 moveSTK[4]=["R","r",41,[rr],[ri]];
 moveSTK[5]=["B","b",51,[bb],[bi]];
 moveSTK[6]=["D","d",61,[dd],[di]];
 moveSTK[7]=["M","m",71,[MM],[mm]]; // 
 moveSTK[8]=["E","e",81,[di,uu,Fd],[dd,ui,fd]];
 moveSTK[9]=["S","s",91,[fi,bb,zz],[ff,bi,Zz]];
moveSTK[10]=["Mc","mc",71,[Mc],[mc]];
moveSTK[11]=["Ml","ml",21,[Ml],[ml]];
moveSTK[12]=["Mr","mr",41,[Mr],[mr]];
moveSTK[13]=["Mu","mu",11,[Mu],[mu]];
moveSTK[14]=["Md","md",61,[Md],[md]];
moveSTK[15]=["Mf","mf",31,[Mf],[mf]];
moveSTK[16]=["Mb","mb",51,[Mb],[mb]];
moveSTK[17]=["Lc","lc",21,[Lc],[lc]];
moveSTK[18]=["Cl","cl",21,[Cl],[cl]];
moveSTK[19]=["Cr","cr",41,[Cr],[cr]];
moveSTK[20]=["Lw","lw",21,[Lw],[lw]];
moveSTK[21]=["Rw","rw",41,[Rw],[rw]];
moveSTK[22]=["Uw","uw",11,[Uw],[uw]];
moveSTK[23]=["Fw","fw",31,[Fw],[fw]];
moveSTK[24]=["Rc","rc",41,[Rc],[rc]];
moveSTK[25]=["Bw","bw",51,[Bw],[bw]];
moveSTK[26]=["Dw","dw",61,[Dw],[dw]];
moveSTK[27]=["Xw","xw",101,[Bor],[bor]];
moveSTK[28]=["Cf","cf",31,[Cf],[cf]];
moveSTK[29]=["Cb","cb",51,[Cb],[cb]];
moveSTK[31]=["U2","u2",11,[u2],[u2]];
moveSTK[32]=["L2","l2",21,[l2],[l2]];
moveSTK[33]=["F2","f2",31,[f2],[f2]];
moveSTK[34]=["R2","r2",41,[r2],[r2]];
moveSTK[35]=["B2","b2",51,[b2],[b2]];
moveSTK[36]=["D2","d2",61,[d2],[d2]];
moveSTK[37]=["M2","m2",71,[MM,MM],[mm,mm]];
moveSTK[38]=["Yw","yw",111,[fd],[Fd]];
moveSTK[39]=["Zw","zw",121,[zz],[Zz]];
moveSTK[40]=["Cu","cu",11,[Cu],[cu]];
moveSTK[41]=["Mt","mt",71,[cl,Mc,Cr],[Cl,mc,cr]];
moveSTK[43]=["M4","m4",71,[lc,cl,Mc,Cr,Rc],[Lc,Cl,mc,cr,rc]];
moveSTK[50]=["X","x",101,[Bor],[bor]];
moveSTK[51]=["Y","y",111,[fd],[Fd]];
moveSTK[52]=["Z","z",121,[zz],[Zz]];
moveSTK[53]=["X2","x2",101,[bor2],[bor2]];
moveSTK[54]=["Y2","y2",111,[fd2],[fd2]];
moveSTK[55]=["Z2","z2",121,[zz,zz],[Zz,Zz]];
moveSTK[56]=["xx","xx",131,void(0),void(0)];

const rotS = "U,U',u,u',F,F',f,f',D,D',d,d',B,B',b,b',R,R',r,r',L,L',l,l',Cl,Cl',Cr,Cr',Lc,Lc',Rc,Rc'".split(",");

function scramble(){
    if (N==2) { scramble2(); return; }
    if (N==3) { scramble3(); return; }

    var i,j,sym="";
    cssNN(N,0);
    initCube(N);
    for(j=0;j<3;j++) {
      for(i=0;N*5>i;i++) rand=Math.floor(((N>5)?30:24)*Math.random()),sym+=rotS[rand]+" ",
         0==rand&&uu(), 1==rand&&ui(), 2==rand&&Mu(), 3==rand&&mu(), 4==rand&&ff(), 5==rand&&fi(), 6==rand&&Mf(), 7==rand&&mf(), 8==rand&&dd(), 9==rand&&di(),
        10==rand&&Md(),11==rand&&md(),12==rand&&bb(),13==rand&&bi(),14==rand&&Mb(),15==rand&&mb(),16==rand&&rr(),17==rand&&ri(),18==rand&&Mr(),19==rand&&mr(),
        20==rand&&ll(),21==rand&&li(),22==rand&&Ml(),23==rand&&ml(),24==rand&&Lc(),25==rand&&(MoveCirc(0,1,2)),  26==rand&&Rc(),27==rand&&(MoveCirc(0,1,4)),
        28==rand&&(moveHori(0,1,2)),  29==rand&&(MoveHori(0,1,4));
      if (j==1) sym += "Y ", fd(); else  sym += "Z ", zz();
    }
    sym += "X Y2"; Bor(),fd2();
    symset(sym);
}
function scramble2(){
    var i,j,sym="",osym="";
    const rot2 = "R,R',U,U',F,B',F',D,B,D',L,L',R,R'".split(",");
    initCube(2);
    for(i=0;18>i;i++) rand=Math.floor(12*Math.random()),rand+=(osym.slice(0,1)==rot2[rand].slice(0,1))?2:0,osym=rot2[rand],sym+=osym+" ",
        0==rand&&Rw(),1==rand&&rw(),2==rand&&Uw(),3==rand&&uw(),4==rand&&Fw(),5==rand&&bw(),
        6==rand&&fw(),7==rand&&Dw(),8==rand&&Bw(),9==rand&&dw(),10==rand&&Lw(),11==rand&&lw();
    symset(sym);
}
function scramble3(){
    var i,j,sym="",osym="";
    const rot3 = "U,U',U2,F,F',F2,D,D',D2,B,B',B2,R,R',R2,L,L',L2,U,U',U2".split(",");
    initCube(3);
    for(i=0;32>i;i++) rand=Math.floor(18*Math.random()),rand+=(osym.slice(0,1)==rot3[rand].slice(0,1))?3:0,osym=rot3[rand],sym+=osym+" ",
        0==rand&&uu(),1==rand&&ui(),2==rand&&u2(),3==rand&&ff(),4==rand&&fi(),5==rand&&(f2()),6==rand&&dd(),7==rand&&di(),8==rand&&(d2()),9==rand&&bb(),
      10==rand&&bi(),11==rand&&(b2()),12==rand&&rr(),13==rand&&ri(),14==rand&&(r2()),15==rand&&ll(),16==rand&&li(),17==rand&&l2();
    symset(sym);
    $("#solve3").attr('disabled',false);
    if (opener && opener.ClipDT && (opener.ClipDT!="")) opener.ClipDT = "";
}
function symset(sym) {
    turnN = 1;
    ClipDT = sym;
    kiirRotLayer(wholecube,99),kiir();
    if (opener && (opener.document.getElementsByName('pythonQ').length>0)) {
            parent.ClipDT = cmnt.slice(18);
            opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = cmnt;
    }
    else $("#comment").html("スクランブル記号列：「DUMP」ボタン");
    // フォーカスをあてる
    //    navigator.clipboard.writeText(sym);   
}
let saveSTinfo;

$(document).ready(function(){
    FaceF = "", $("#lskip").hide();
    saveSTinfo =  $("#statusBlk").html();
    SelCubeT(),
  $(".rotateU").mousedown(function(){  turn("U")}),
  $(".rotateUi").mousedown(function(){ turn("u")}),
  $(".rotateR").mousedown(function(){  turn("R")}),
  $(".rotateRi").mousedown(function(){ turn("r")}),
  $(".rotateD").mousedown(function(){  turn("D")}),
  $(".rotateDi").mousedown(function(){ turn("d")}),
  $(".rotateF").mousedown(function(){  turn("F")}),
  $(".rotateFi").mousedown(function(){ turn("f")}),
  $(".rotateB").mousedown(function(){  turn("B")}),
  $(".rotateBi").mousedown(function(){ turn("b")}),
  $(".rotateL").mousedown(function(){  turn("L")}),
  $(".rotateLi").mousedown(function(){ turn("l")}),
  $(".rotateu").mousedown(function(){  turn("Mu")}),
  $(".rotateui").mousedown(function(){ turn("mu")}),
  $(".rotater").mousedown(function(){  turn("Mr")}),
  $(".rotateri").mousedown(function(){ turn("mr")}),
  $(".rotated").mousedown(function(){  turn("Md")}),
  $(".rotatedi").mousedown(function(){ turn("md")}),
  $(".rotatef").mousedown(function(){  turn("Mf")}),
  $(".rotatefi").mousedown(function(){ turn("mf")}),
  $(".rotateb").mousedown(function(){  turn("Mb")}),
  $(".rotatebi").mousedown(function(){ turn("mb")}),
  $(".rotatel").mousedown(function(){  turn("Ml")}),
  $(".rotateli").mousedown(function(){ turn("ml")}),
  $(".rotateM").mousedown(function(){  turn("M")}),
  $(".rotateMi").mousedown(function(){ turn("m")}),
  $(".rotateMt").mousedown(function(){ turn("Mt")}),
  $(".rotatemt").mousedown(function(){ turn("mt")}),
/*
*/
  $(".rotateLc").mousedown(function(){  turn("Lc")}),
  $(".rotateRc").mousedown(function(){  turn("Rc")}),
  $(".rotateCl").mousedown(function(){  turn("Cl")}),
  $(".rotateCr").mousedown(function(){  turn("Cr")}),
  $(".rotatelc").mousedown(function(){  turn("lc")}),
  $(".rotaterc").mousedown(function(){  turn("rc")}),
  $(".rotatecl").mousedown(function(){  turn("cl")}),
  $(".rotatecr").mousedown(function(){  turn("cr")}),
  $(".rotateX").mousedown(function(){   turn("X")}),
  $(".rotateY").mousedown(function(){   turn("Y")}),
  $(".rotateZ").mousedown(function(){   turn("Z")}),
  $(".rotateXi").mousedown(function(){  turn("x")}),
  $(".rotateYi").mousedown(function(){  turn("y")}),
  $(".rotateZi").mousedown(function(){  turn("z")}),
  $(".rotateKiir").mousedown(function(){  kiir()}),
  $(".rotateXview").mousedown(function(){ if ((FaceF=="")||(cubex<-5)) cubex+=5,rotCubeXY()}),
  $(".rotateYview").mousedown(function(){ if ((FaceF=="")||(cubey<420)) cubey+=5,rotCubeXY()}),
  $(".rotateZview").mousedown(function(){ cubez+=5,rotCube()}),
  $(".rotateXview").mouseup(function(){   if ((FaceF=="")||(cubex<-5)) cubex+=5,rotCubeXY()}),
  $(".rotateYview").mouseup(function(){   if ((FaceF=="")||(cubey<420)) cubey+=5,rotCubeXY()}),
  $(".rotateZview").mouseup(function(){   cubez+=5,rotCube()}),
  $(".rotateXiview").mousedown(function(){if ((FaceF=="")||(cubex>-85)) cubex-=5,rotCubeXY()}),
  $(".rotateYiview").mousedown(function(){if ((FaceF=="")||(cubey>290)) cubey-=5,rotCubeXY()}),
  $(".rotateZiview").mousedown(function(){cubez-=5,rotCube()}),
  $(".rotateXiview").mouseup(function(){  if ((FaceF=="")||(cubex>-85)) cubex-=5,rotCubeXY()}),
  $(".rotateYiview").mouseup(function(){  if ((FaceF=="")||(cubey>290)) cubey-=5,rotCubeXY()}),
  $(".rotateZiview").mouseup(function(){  cubez-=5,rotCube()});
  if (typeof(mousedragRotate) != 'undefined') mousedragRotate("#cubeFields");
});
