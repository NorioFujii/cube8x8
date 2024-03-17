const dir1 = document.querySelector("#yp");
const dir2 = document.querySelector("#xp");
const dir3 = document.querySelector("#ym");
const dir4 = document.querySelector("#xm");
const setCube = document.querySelector("#display");
const parts2C=[[1,5,18],[2,14,17],[3,6,9],[4,10,13],[21,8,11],[22,12,15],[23,7,20],[24,16,19]];
const parts4C=[[1,17,68],[4,65,52],[16,49,36],[13,33,20],[93,80,29],[96,64,77],[84,48,61],[81,32,45]];
const partsC=[[1,10,39],[3,37,30],[9,28,21],[7,19,12],[52,45,16],[54,36,43],[48,27,34],[46,18,25]];
const partsE=[2,38,4,11,6,29,8,20,13,42,15,22,24,31,33,40,17,49,26,47,35,51,44,53];
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;
var field2;
var field3;
var field4;
var game ;
var board; //選択中のパーツの元色

    dir1.addEventListener('mousedown', {
        symbol: 'Y', handleEvent: function(){
            XYRotate(this.symbol); }
    }, false);
    dir2.addEventListener('mousedown', {
        symbol: 'X', handleEvent: function(){
            XYRotate(this.symbol); }
    }, false);
    dir3.addEventListener('mousedown', {
        symbol: 'y', handleEvent: function(){
            XYRotate(this.symbol); }
    }, false);
    dir4.addEventListener('mousedown', {
        symbol: 'x', handleEvent: function(){
            XYRotate(this.symbol); }
    }, false);

function init() {
    RotOmt = 0;
    if (N==2) $("#game").html('<div class="fieldF2" data-colorCD=0 >9</div>'+
        '<div class="fieldF2" data-colorCD=0 >10</div>'+
        '<div class="fieldF2" data-colorCD=0 >11</div>'+
        '<div class="fieldF2" data-colorCD=0 >12</div>');
    else if (N==3) $("#game").html('<div class="fieldF3" data-colorCD=0 >19</div>'+
        '<div class="fieldF3" data-colorCD=0 >20</div>'+
        '<div class="fieldF3" data-colorCD=0 >21</div>'+
        '<div class="fieldF3" data-colorCD=0 >22</div>'+
        '<div class="fieldF3" data-colorCD=0 >23</div>'+
        '<div class="fieldF3" data-colorCD=0 >24</div>'+
        '<div class="fieldF3" data-colorCD=0 >25</div>'+
        '<div class="fieldF3" data-colorCD=0 >26</div>'+
        '<div class="fieldF3" data-colorCD=0 >27</div>');
    else if (N==4) $("#game").html('<div class="fieldF4" data-colorCD=0 >33</div>'+
        '<div class="fieldF4" data-colorCD=0 >34</div>'+
        '<div class="fieldF4" data-colorCD=0 >35</div>'+
        '<div class="fieldF4" data-colorCD=0 >36</div>'+
        '<div class="fieldF4" data-colorCD=0 >37</div>'+
        '<div class="fieldF4" data-colorCD=0 >38</div>'+
        '<div class="fieldF4" data-colorCD=0 >39</div>'+
        '<div class="fieldF4" data-colorCD=0 >40</div>'+
        '<div class="fieldF4" data-colorCD=0 >41</div>'+
        '<div class="fieldF4" data-colorCD=0 >42</div>'+
        '<div class="fieldF4" data-colorCD=0 >43</div>'+
        '<div class="fieldF4" data-colorCD=0 >44</div>'+
        '<div class="fieldF4" data-colorCD=0 >45</div>'+
        '<div class="fieldF4" data-colorCD=0 >46</div>'+
        '<div class="fieldF4" data-colorCD=0 >47</div>'+
        '<div class="fieldF4" data-colorCD=0 >48</div>');
    if (N==2) field2 = document.querySelectorAll(".fieldF2");
    else if (N==4) field4 = document.querySelectorAll(".fieldF4");
    else           field3 = document.querySelectorAll(".fieldF3");
    game = document.querySelector("#game");
    if (N==4) $("#game").css({ "width":"184px","height":"192px" });
    else      $("#game").css({ "width":"138px","height":"138px" });
    $("#gamePad").html('<br><br><br><br><br><br>'.slice(0,36-N*8));
}
function XYRotate(symbol) {
    RotOmt = 0;
    turn(symbol);
    setTimeout('setTile()',1200);
}
function faceSet(args) {
        let i=0, n = arguments[0];
//        if (n==2) { faceSet2(arguments[1],arguments[2],arguments[3],arguments[4]); return; }
	$(".fieldF"+n+":eq(0)").colorPick({	'initialColor' : arguments[1],
        	'onColorSelected': function() {
			this.element.css({'backgroundColor': this.color, 'color': this.color});
			let colorCD = this.palette.indexOf(this.color) + 2;
			if (this.colorCD>0) faceRefresh(this.position,colorCD);
			this.colorCD = colorCD;
			this.element.attr('data-colorCD',colorCD);
//			console.log("Selected the color: " + this.colorCD + " on No."+this.position);
		}
	});
        for (i=1;i<=arguments.length;i++) {
            if ((n==3)&&(i==arguments.length))
    	        $(".fieldF3:eq(4)").colorPick({
		  'initialColor' : arguments[5],
		  'onColorSelected': function() {
		    if (this.colorCD==0) {
			this.element.css({'backgroundColor': this.color,
					      'color': this.color });
			this.colorCD = this.palette.indexOf(this.color) + 2;
                    }
		  }
	        });
	    else $(".fieldF"+n+":eq("+i+")").colorPick({	'initialColor' : arguments[i+1]});
        }
}
function Cb(no,n=3) {
    if (N==2) {
        return layer24[no];
    } if (n==3) {
        return layer34[MC[no][0]];
    } else {
        return no;
    }
}
function faceCheck(color) {
    let rr, lay = (N==2)?layer24:(N==4)?wholecube:layer34;
    if (typeof(lay[0])=='object') rr = lay[0].concat(lay.slice(1)), lay = rr;

    let hit = lay.filter(function(value, index, array) {
              return (a[value] == color);
          });
    return (hit.length);
}
function sceneON(visible) {
    visible.classList.add("is-visible");
    visible.classList.remove("is-hidden");
}
function sceneOFF(visible) {
    visible.classList.remove("is-visible");
    visible.classList.add("is-hidden");
    $("#parent").hide();
}
//
//  実キューブのパーツ色反映　Main
//
const CC="　　橙緑赤青黄白白", COrange="橙", CGreen="緑", CRed="赤", CBlue="青", CYellow="黄", CWhite="白";
function setFaces() {
    if ($("#display").hasClass('is-hidden')) {
        $("#statusBlk").hide();
        for (var y = 0; y < 5; y++)
	    for (var x = 0; x < 5; x++) {
                if ((y>(4-N))&&(x>(4-N))) $("#r"+y+x).css("border","black 2px solid");
                else                      $("#r"+y+x).css("border","black 1px solid");
	    }
        kiir();
        init();
        $("#parent").show();
        sceneON(setCube);
        if (RotOmt==1) $("input[name='noy']").prop("checked", false).change();
        setTimeout('setTile()',100);
    } else {
        for (let color=2;color<9;color++) {
            if (color==7) continue;
            let count = faceCheck(color);
            if (count != ((N==2)?4:(N==4)?16:9)) {
               alert('Color:'+CC.charAt(color)+' の総数が不一致です：'+count);
               setTile(); error();return;
            }
        }
// const parts2C=[[1,5,18],[2,14,17],[3,6,9],[4,10,13],[21,8,11],[22,12,15],[23,7,20],[24,16,19]];
// const parts4C=[[1,17,68],[4,65,52],[16,49,36],[13,33,20],[93,80,29],[96,64,77],[84,48,61],[81,32,45]];
// const partsC=[[1,10,39],[3,37,30],[9,28,21],[7,19,12],[52,45,16],[54,36,43],[48,27,34],[46,18,25]];
        let set,ary,parts, err = "";
        parts = (N==2)?parts2C:(N==4)?parts4C:partsC;
        for (let i=0;i<parts.length;i++) {
            set = new Set([Nc(parts[i][0],N),Nc(parts[i][1],N),Nc(parts[i][2],N)]);
            if (!((set.has(White)||set.has(Yellow))))
                err = colorName('に白/黄が無いです：',set,parts[i]);
            else {
                if (set.has(White))  set.delete(White);
                else if (set.has(Yellow)) set.delete(Yellow);
                err = checkTwo(set,parts[i][1],parts[i][2],parts[i]);
            }
        }
        if (N==3) for (let i=0;i<partsE.length;i+=2) {
            set = new Set([Nc(partsE[i],3),Nc(partsE[i+1],3)]);
            err = checkTwo(set,partsE[i],partsE[i+1],i);
        }    
        if (err!="") { $("#comment").html(err); setTile(); error();return; }
        if (N==2) {
            FaceUs = white2x2(0,White,true);
        } else if (N==3) {
            bor2();
            FaceUs =  WhiteX(0,White,true);
            bor2();
            crnrSV(0);
        } else { exitFace(); return; }
        kiir(),setTile();
        setTimeout("rotedOK(1)",200);
        return;
    }
}
function error() {
    Disp = "block", Face = "N", $("#hdnstop").show();
    kiirRotLayer(wholecube,99);
    kiir();
    exitFace(false);
}
function exitFace(f=true) {
    if (f) {
        $("#comment").html("色数は合っています。");
        if (N==3) if (confirm("パーツのねじれをチェックしますか？")) {
　　　　　　let err = goPython("CHK");
            if (err!="") $("#comment").html("捻れ発生:"+err);
        }
        sceneOFF(setCube);
        RotOmt = $('input[name="noy"]:checked').is(':checked')? 1:0;
    }
    clearTimeout(Tid2);
}
function rotedOK(n) {
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("rotedOK("+n+")",NxPaus);
        return true;
    }
    if (n==1) {
        if (N==2) {
            alert("白色面は完全一面ですか?");
            FaceUs += "," + white2x2(0,Yellow,true);
            kiir(),setTile();
            setTimeout("rotedOK(2)",200);
        } else {
            alert("白色面は完全一面揃います");
            crnrCV(0);
            bor2();
            rewind(FaceUs);
            setTimeout("rotedOK(3)",200);
        }
    }
    else if (n==2) {
        alert("黄色面は完全一面ですか?");
        rewind(FaceUs);
        setTimeout("exitFace()",200);
    }
    else if (n==3) {
        bor2();
        FaceUs = WhiteX(0,Yellow,true);
        bor2();
        crnrSV(1);
        setTimeout("rotedOK(4)",200);
    }
    else if (n==4) {
        alert("黄色面は完全一面揃います");
        crnrCV(1);
        bor2();
        rewind(FaceUs);
        setTimeout("exitFace()",200);
    }
}
//   "　　橙緑赤青黄白白"
const cn8=new Array(80,160,96,48,60,120,72,36);   // WOB,WRB,WGR,WGO,YBO,YBR,YGR,YGO
const pure=new Array([8,3,2],[8,2,5],[8,5,4],[8,4,3],[6,5,2],[6,2,3],[6,3,4],[6,4,5]);
var cnS=new Array([],[],[],[],[],[],[],[]);
var FaceUs;
function crnrSV(c) { // Save corner real color
    let i, target;
    for (i in cn8) {
        if (N==3) {
            target=Nc(partsC[i][0],3)*Nc(partsC[i][1],3)*Nc(partsC[i][2],3);
          if (cn8.includes(target)) {
            cnS[i][0] = Nc(partsC[i][0],3);
            cnS[i][1] = Nc(partsC[i][1],3);
            cnS[i][2] = Nc(partsC[i][2],3);
          } else  console.log("Lack of piece",target);
            a[layer34[MC[partsC[i][0]][RotSft]]]=pure[i^ (0x04*c)][0];
            a[layer34[MC[partsC[i][1]][RotSft]]]=pure[i^ (0x04*c)][1];
            a[layer34[MC[partsC[i][2]][RotSft]]]=pure[i^ (0x04*c)][2];
        } else if (N==4) {
            target=Nc(parts4C[i][0],4)*Nc(parts4C[i][1],4)*Nc(parts4C[i][2],4);
          if (cn8.includes(target)) {
            cnS[i][0] = Nc(parts4C[i][0],4);
            cnS[i][1] = Nc(parts4C[i][1],4);
            cnS[i][2] = Nc(parts4C[i][2],4);
          } else  console.log("Lack of piece",target);
            a[parts4C[i][0]]=pure[i^ (0x04*c)][0];
            a[parts4C[i][1]]=pure[i^ (0x04*c)][1];
            a[parts4C[i][2]]=pure[i^ (0x04*c)][2];
        }
    }
    kiir();
}
function crnrCV(c) { // Recover corner real color
    let i, target;
    for (i in cn8) {
        if (N==3) {
            a[layer34[MC[partsC[i][0]][RotSft]]]=cnS[i][0];
            a[layer34[MC[partsC[i][1]][RotSft]]]=cnS[i][1];
            a[layer34[MC[partsC[i][2]][RotSft]]]=cnS[i][2];
        } else if (N==4) {
            a[parts4C[i][0]]=cnS[i][0];
            a[parts4C[i][1]]=cnS[i][1];
            a[parts4C[i][2]]=cnS[i][2];
        }
    }
}
function checkTwo(set,part1,part2,parts) {
    let msg = "";
//    console.log(set);
    if (set.size<2) msg = "に同じ色が含まれています：";
    else if ([8,15,48].includes(Nc(part1,N)*Nc(part2,N))) msg = "に対面の色が含まれています：";
    if (msg=="") return "";
    return colorName(msg,set,parts);
}
function colorName(msg,set,parts) {
    let rr = parts, ret;
    if (typeof rr==='object')
         ret='コーナーパーツ'+rr[0]+msg,rr=("0"+rr[0]).slice(-2)+("0"+rr[1]).slice(-2)+("0"+rr[2]).slice(-2);
    else ret='エッジパーツ'+partsE[rr]+msg,rr = ("0"+partsE[rr]).slice(-2)+("0"+partsE[rr+1]).slice(-2);
    ret += Array.from(set).map(function(value, index, array) {
                  return CC.charAt(value);
           }).toString();
    if (Counter==0) {
        setTimeout('alert("'+ret+'");',2000);
        if (N==3) cubeFlush("*#"+rr,8);
        if (N==4) cubeFlush("*$"+rr,8);
    } else alert(ret);
    return ret;
}
function setTile(str="") {
    if (N==2) setTileX(2,field2,str);
    else if (N==4) setTileX(4,field4,str);
    else           setTileX(3,field3,str);
}
function setTileX(n,field,str="") {
    board = new Array(16);
    let face = [],fstP=(n==2)?9:(n==4)?33:19;
    for (let i = 0;i < field.length; i++) {
        face[i] = (str=="")?Nc(fstP+i,n):"0 ogrby w".indexOf(str[i]);
        if (face[i]==0) face[i] = 7;
        if ((n==3)&&(i==4)) continue;
        field[i].colorCD = face[i];
        field[i].onclick = () => {
            if (typeof board[i] == 'undefined') {
                board[i] = field[i].style.backgroundColor;
                field[i].style.backgroundColor = "pink";
            } else if (field[i].style.backgroundColor=="pink") {
               	field[i].style.backgroundColor = board[i];
                delete board[i];
            }
        }
    }
    console.log(face);
    eval("faceSet("+n+","+face.join(',')+");");
}
function faceTo() {
    if (N==2)      setTileTo(2,field2);
    else if (N==4) setTileTo(4,field4);
    else           setTileTo(3,field3);
}
function setTileTo(n,field) {
    let i, fstP=(n==2)?9:(n==4)?33:19;
    for (i = 0;i < field.length; i++) {
        faceRefresh(fstP+i,$(field[i]).attr('data-colorCD'), true);
    }
    kiir();
}
function faceRefresh(cube,col,face=false) {
    let color = (typeof col=='string')? parseInt(col):col;

    a[Cb(cube,N)] = color;
    if (N==2) {
        a[Cb(cube,2)+1] = color;
        a[Cb(cube,2)+4] = color;
        a[Cb(cube,2)+5] = color;
    }
    kiir();
    if ((!face)&&(N==3)) cubeFlush("*#"+cube,8);
    if ((!face)&&(N==4)) cubeFlush("*$"+cube,8);
}

function saveCube() {
    if ((N==3)&&(!window.confirm('実キューブに二十数手で戻しますか(Cancel)？ アプリ上だけ(OK)ですか？'))) {
        goPython("RVS");
	localStorage.setItem('rubic_4x4',readCookie('_CubeStatus'));
    }
    else if (window.localStorage) {
	let json = JSON.stringify(a);
	localStorage.setItem('rubic_4x4', json);
    }
    initCube() ;
}
function restCube() {
    if (window.localStorage) {
	let json = localStorage.getItem('rubic_4x4');
        if (!json) { $("#comment").html("Nothing pattern saved.");return; }
        if (json.charAt(0)=="*") {
            navigator.clipboard.writeText(json);   
            setRot(regRot(json.split(",")));
            turn("");
        }
	else {
            a = JSON.parse(json);
            kiirRotLayer(wholecube,99);
            kiir();
        }
    }
}

var preRot = "";
function goPython(rev) {
    if ((rev=='RVS')&&
        (!window.confirm('現在の状態(OK)だとネット接続が必要です。'))) {
        navigator.clipboard.writeText(ClipDT);   
        $("#comment").html(ClipDT);
        initCube(3) ;
        return;
    }
    let rotation = "";
// const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
    let r=new Array(1,10,39,3,37,30,9,28,21,7,19,12,52,45,16,54,36,43,48,27,34,46,18,25);
    let e3=new Array(42,13,40,33,24,31,22,15,2,38,6,29,8,20,4,11,53,44,51,35,47,26,49,17); //W,Y,G,B優先
    let cx8=new Array(80,160,96,48,60,120,72,36);           // WOB,WRB,WGR,WGO,YBO,YBR,YGR,YGO
    let cx12=new Array(17,29,19,11,53,44,35,26,41,34,27,20); // BO,BR,GR,GO,WB,WR,WG,WO,YB,YR,YG,YO
    let i=0,time=5,ix,dx, corner="[", corner_d="[", edge="[", edge_d="[", c0=new Array();
    preRot="";
        if (Nc(5)!=White) for (i=0;(i<4)&&(Nc(5)!=White);i++) { preRot+=" X'"; bor(); }
        if (i==4) { preRot="";for (i=0;(i<4)&&(Nc(5)!=White);i++) { preRot+=" Z'"; fd2(),fd(),bor(),fd(); }}
        for (i=0;(i<4)&&(Nc(23)!=Green);i++) { preRot+=" Y'"; fd2(),fd(); }
        for (i=0;i<24;i+=3) {
            c0[0]=Nc(r[i]),c0[1]=Nc(r[i+1]),c0[2]=Nc(r[i+2]);
            ix = cx8.indexOf(c0[0] * c0[1] * c0[2]); if (ix<0) return ("ix<0 in cx8");
            dx = c0.findIndex(function(v,n,a) { return (v==White || v==Yellow);});
            corner   += ix + ((i>20)?"]":",");
            corner_d += dx + ((i>20)?"]":",");
        }
        for (i=0;i<24;i+=2) {
            c0[0]=Nc(e3[i]); c0[1]=Nc(e3[i+1]);
            ix = cx12.indexOf(c0[0] * c0[1] + c0[0]+ c0[1]);
            if (ix<0) return ("ix<0 in cx12"); 
            if ((ix==3) && ((c0[0]==White) || (c0[1]==White))) ix = 4; 
            if (((c0[0]==White) || (c0[0]==Yellow)) ||
                (!((c0[1]==White) || (c0[1]==Yellow)) &&
                 ((c0[0]==Blue)  && (ix<2))          ||
                 ((c0[0]==Green) && (ix<4))))     dx = 0;
            else dx = 1;
            edge   += ix + ((i>21)?"]":",");
            edge_d += dx + ((i>21)?"]":",");
        }
    console.log(corner+','+corner_d+','+edge+','+edge_d);
    if (rev=="CHK") return ("");
    cloudGo(corner,corner_d,edge,edge_d,time,rev);
    $("#rotate").html("");
    $("#comment").html("Cloud computing!");
    setTimeout('$("#comment").html(RotA); pause();',1600*time);
    flushB(200,4*time,"#comment");
    if (rev=="CHK") return ("");
}
var RotA = "";
function cloudGo(corner,corner_d,edge,edge_d,time,rev=null) {
    $(function(){
      $.ajax({
        url:"https://mori1-hakua.tokyo/python/Cube2phase_Fast3.py",
        type:"POST",
//        async: false,
        data: {'value1':corner, 'value2':corner_d, 'value3':edge, 'value4':edge_d,'time':time },
        dataType:"text",
        timeout: 10000
      })
      .done((data) => {
    //成功した場合の処理
        pause();
        window.focus();
        let rot = data.slice(data.indexOf('<div ')+16,data.indexOf('</div>'));
        $("#solve3").attr('disabled',true);
        clearTimeout(Tid2); Rotates = [];
        if (rev=="CHK") {
            if (rot.indexOf('None *Fin')>0) alert("キューブのパーツに捻れがあり解けない");
//            sceneOFF(setCube); setFaces();
            return ("");
        }
        if (rev=="RVS") {
            initCube(3) ;
            let rvsRot = (preRot + " " +rot.slice(19,-5)).trim();
            setRot(["*0c"]);
            setRot(["!"].concat(regRot(rvsRot.split(" "))));
            setRot(["*"]);
            let seqR = (rvsRot.split(" ")).map(function (value, index, array) {
                 return (value.slice(0,1)+
                         (value.slice(1,2)=="'"? value.slice(2):"'"+value.slice(1)));
                });
            RotA = "*0c "  + seqR.reverse().toString().replace(/,/g,' ') + " *";
            navigator.clipboard.writeText(RotA);  // "! * "+rvsRot+" *0c");   
            writeCookie('_CubeStatus='+RotA.replace(/ /g,','));  
        }
        else {
            setRot(["!"].concat(regRot((preRot + " " + rot).trim().split(" "))));
        }
        setTimeout("checkRot();check33();",100);
        if ((NoRot=="")&&(!navigator.userAgent.match(/iPhone|Android.+/))) Pause = false;
      })
      .fail((data) => {
    //失敗した場合の処理
        if (rev=="CHK") return;
        console.log(data.responseText+"　Retry?");  //レスポンス文字列を表示(502を経験）
        setTimeout("goPython("+rev+")",3000);
      })
    });
}
// Cookie書き込み cookie:'_aaa=xxx'
    function writeCookie(cookie) {
      document.cookie = cookie;
    }
// 読み込み       ck:'_aaa'
    function readCookie(ck) {
        var arr = new Array();
        if(document.cookie != ''){
            var tmp = document.cookie.split('; ');
            for(var i=0;i<tmp.length;i++){
                var data = tmp[i].split('=');
                arr[data[0]] = decodeURIComponent(data[1]);
            }
        }
        return arr[ck];
    }
// 削除
    function deleteCookie(ck) {
      document.cookie = ck+"=; expires=0";
    }
