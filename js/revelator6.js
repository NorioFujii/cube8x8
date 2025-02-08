/*
* ルービックキューブ2x2-8x8お告げナビゲーター・ロジックプログラム集
*
* Copyright (c) 2022-2025 Norio Fujii
* Licensed under the MIT License
*
*/
function beltCheck(color,any=0) {
    var belt=new Array(Nc(15),Nc(22),Nc(24),Nc(31),Nc(33),Nc(40),Nc(42),Nc(13));
    if (any==0) return belt.indexOf(color);
    if (any>1) return belt.slice(0,any).includes(color);
    var hit = belt.filter(function(value, index, array) {
              return (value == color);
          });
    return (hit.length);
}
function edgeCheck(color,odd=1) {
    const edge=new Array(4,11,8,20,6,29,2,38);
    var hit = edge.filter(function(value, index, array) {
              return ((index%odd==0)&&(Nc(value) == color));
          });
//    console.log(RotSft+":Hit="+hit);
    return (hit.length);
}
function LDCheck(color) {
    var hit = layerd.filter(function(value, index, array) {
              return (Na(value) == color);
          });
    return (hit.length);
}
function YCCount(c=Yellow) {
    return ((Nc(2)==c)?1:0)+((Nc(4)==c)?1:0)+((Nc(6)==c)?1:0)+((Nc(8)==c)?1:0);
}
function YCCheck(c=Yellow) {
    return (YCCount(c)==4);
}
function hcorCheck(color) {
    var hcor=new Array(Nc(10),Nc(12),Nc(19),Nc(21),Nc(28),Nc(30),Nc(37),Nc(39));
    return hcor.indexOf(color);
}
function vcorCheck(color,cnt=false) {
    var vcor=new Array(Nc(1),Nc(3),Nc(7),Nc(9));
    if (cnt) {
        var hit = vcor.filter(function(value, index, array) {
                  return (value==color);
              });
        return (hit.length);
    }
    return vcor.includes(color);
}
function cornerOK(color) {
    const conr=new Array([46,25,18,23],[48,27,34,23],[52,45,16,41],[54,43,36,41]);
    var hit = conr.filter(function(value, index, array) {
              return ((Nc(value[0])==color)&&(Nc(value[1])==Nc(value[3]))&&(Nc(value[1])==Nc(value[1]-3))&&(Nc(value[2])==Nc(value[2]-3)));
          });
    return (hit.length + edgeOK(color));
}
function edgeOK(color) {
    const edge=new Array(47,49,51,53);
    var hit = edge.filter(function(value, index, array) {
              return (Nc(value)==color);
          });
    return (hit.length);
}
function Xmove(ret,n,l) { //  四隅交換パーム
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("Xmove("+ret+","+n+","+l+")",NxPaus);
        return true;
    }
    const Us = "*四隅交換パーム,*#300337,r,u,f,U,F,R";
    setRot(Us);
    setTimeout(ret+"("+n+")",100);
}
function Xperm(ret,n,l=4) { // 二隅交換パーム右
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("Xperm("+ret+","+n+","+l+")",NxPaus);
        return true;
    }
    const Us = "*二隅交換パーム,*#300337,r,u,R,u,r,U2,R";
    setRot(Us);
    setTimeout(ret+"("+n+")",100);
}
function nextY(n,go) {  //
    if (((go-n)==0)||((go-n)>=4)) return ["", go];
    return [",Y,Y,Y,Y".slice(0,(go-n)*2).replace(",Y,Y,Y",",y"), go];
}
function turnSftND(str) { // 回転記号をRotSft化で取り換えて、非表示で回転する
    var rot,rote,rot1,rotm,rots = str.split(",");
    Counter = -1;
    for (rot in rots) {
        rote = rots[rot]; rot1 = rote.charAt(0);
        if (rot1.toUpperCase()=="Y") {
                if (rot1=="Y") fd();
                else           Fd();
        } else if (rot1!="*") {
            rotm = Maprote.get(rot1);
            rote = ((typeof rotm==='string')?rotm.charAt(RotSft):rot1) +rote.slice(1);
            turnStart(rote);
        }
    }
    Counter = 0;
}
function WhiteX(m=0,color=White,ck=false) {  // 白クロスを形成する
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("WhiteX("+m+","+color+")",NxPaus);
        return true;
    }
    if (m>=8) {
        setTimeout("SolveNavi(8)",100);  // 9
        return true;
    }
    var n=m, l, Us2, Us = "*白色エッジを一旦上へ"+NoRot.replace(" ",",");
    // 白エッジを４個とも上面に上向きに上げる
    for (n=n;n<4;) {
        l=4;while ((l-->0)&&!(Nc(8)!=color)) { uu(),Us += ",U"; } // 正面エッジが白の間飛ばす
        if (l>0) { 
            const cube=new Array(    11,15,31,47, 29,     26,       22,   24,     20,    51,     35,      33);
            const move =         "L,F,l: F: f:F2:r,f:f,u,R,U:F,u,r,U,f:u,R,U:u,r,U,f:u,R2,U:u,R,U,f:u,R2,U,f".split(":");
            var i = 0, f = 0, nn=-1;
            for (i in cube) {
                if (Nc(cube[i])==color)  {  // 監視範囲に白が居る
                    turnSftND(move[i].trim());
                    Us += ","+move[i].trim();
                    f++; break;
                }
            }
            if (f==0) { // 監視範囲になかったので、次の面へ
                if (Us.slice(-2)==",U") { ui(); Us = Us.slice(0,-2); }
                Us2 = "Y"; 
                turnSftND(Us2); Us += ","+Us2;
                n++;
            } else {
               if (f>cube.length) n = 4;
            }
        } else if (edgeCheck(color,2)==4) {
               [Us2,n] = nextY( n, 4 );    // 終了
               if (Us2!="") turnSftND(Us2),Us += Us2;
        }
    }
    // 白エッジを４個とも側面センターの色に合うよう横回転し、１８０°縦回転する
    for (n=n;n<8;n++) {
        l=4;while ((l-->0)&&!((Nc(8)==color)&&(Nc(20)==Nc(23)))) { uu(); Us += ",U"; }
        if (l<0) { n--; continue; }
        var face=",*白エッジを正規下層へ　&nbsp;<span style='color:"+['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#C0C0C0'][Nc(23)-2]+
                 "; font-weight:300;'>"+"　　橙緑赤青黄白白".charAt(Nc(23))+"面</span>の下層";
        var nxY = "F2"+((n<7)?",Y":"");
        turnSftND(nxY);
        Us += face+","+nxY;
    }
    if (ck) return Us;
    console.log(Us," nextN=",n);
    setRot(rewind(Us.replace(/U,U,U,/g,"u,").replace(/U,u,/g,"").replace(/U,U,/g,"U2,")));
    setTimeout("WhiteX("+n+","+color+")",100);
}
let usw=0;
function ikinari_edge(m=0) { // 上層のエッジをF2Lで横に降ろす。
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("ikinari_edge("+m+")",NxPaus);
        return true;
    }
    var n=m&7, Us2 = "", Us="", dbl = "";
    save5x5();  // 現状の盤面保存
    if ((Nc(9)==White)&&(Nc(21)==Nc(24))&&(Nc(31)==Nc(28))) 
              Us += ",*ねじりセクシーで２連準備,*#0921282431,f,U2,F";
    else if ((Nc(9)==White)&&(Nc(21)==Nc(31))&&(Nc(24)==Nc(28)))
              Us += ",*セクシームーブ３回で　右スロットイン,*#0921282431,R,U,r,u,R,U,r,u,R,U"+((Nc(31)==Nc(32))?",r":",U,r");
    else  { // if (n<4) 全エッジパーツは黄色を含まず、正面色と側面の色が合う面から始める
        Us = slotin();
        if (Us=="") { 
            var l = 4;
            while ((l-->0)&&!((Nc(38)!=Yellow)&&(Nc(2)==Nc(23)))) { uu();  Us2 += ",U"; }
            if (l>=0) { // 左右両検査のため、0を含む
                Us = slotin();
                if (Us=="") {
                    var face=",*お告げ・F2L準備"+" 　　　<span style='color:"+['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#C0C0C0'][Nc(23)-2]+
                             "; font-weight:300;'>"+"　　橙緑赤青黄白白".charAt(Nc(23))+"面</span>で";
                    if (Nc(14)==Nc(38)) Us = face+"左エッジ"+Us2+(WTchk(n,7,19,12)?",f":"")+",*#023814,l,u,L" ;
                    else                Us = face+"右エッジ"+Us2+(WTchk(n,9,21,28)?",F":"")+",*#023832,R,U,r" ;
                    dbl = Us.slice(-16,-15); console.log('dbl=',dbl);
                    if ((dbl=="F")||(dbl=="f")) { Us += (dbl=="F")?"2,u,f,R":"2,U,F,l"; } 
                }
            } else if (edgeCheck(Yellow,2)==4) {
                       [Us2,n] = nextY( n, 4 );    // 終了で残りY回転数を返す
            } else { n++ ; Us = Us2.replace(/\,U/g,"")+",Y"; }  // 正面の切り替え 実回転をする  ４回続くようであれば一度で済ませたい
            if (Us=="") Us = Us2;
        }
        console.log(Us);
        if ((Us!="")&&(edgeCheck(Yellow)<4)) {
            Pause = true;
            rest5x5();     // 盤面復活
            setRot(Us.replace(/U,U,U,/g,"u,").replace(/U,U,/g,"U2,").split(",")); 
            Pause = false;
            setTimeout("ikinari_edge("+n+")",100);
            return true;
        }
    }
    Pause = true;
    rest5x5();     // 盤面復活
    if ((++usw&2)==0) Us += ",u";
        console.log(Us);
    setRot(("*お告げが続く"+Us).split(","));
    Pause = false;
    setTimeout("otuge_corner()",100);
}
function WTchk(n,f1,f2,f3) { // コーナー白を含むか
    var c1=Nc(f1),c2=Nc(f2),c3=Nc(f3); // c12=Nc(f1*4/(f1-6));

    return (((c1==White)||(c3==White))&&(((turnN-turnN3)>100) ||
            (c1==White)&&((c2*c3+c2+c3)==(Nc(2)*Nc(38)+Nc(2)+Nc(38))))) ||
            (c3==White)&&((c2*c1+c2+c1)!=(Nc(2)*Nc(38)+Nc(2)+Nc(38))) ;


    return (((c12!=White) &&
             ((c1==White) || (c2==White))) ||
            ((Nc(cc)==White)&&(c2!=Nc(2))) ) ;
}
function BoCW(f1,f2) { // 上層コーナーに白含み
    return (Nc(f1)==White) || (Nc(f2)==White) ; //  || (Nc(f2+2)==White) ;

}
function slotin(n=-1) {
    var Us = "", l = 4;
//  debugger;
    if (!((Nc(10)==White)&&(Nc(1)==Nc(2))&&(Nc(39)==Nc(38))) && !((Nc(30)==White)&&(Nc(3)==Nc(2))&&(Nc(37)==Nc(38)))) // ２連以外
        while ((l-->0)&&!(((Nc(10)==White)&&(Nc(1)==Nc(23)))||((Nc(30)==White)&&(Nc(3)==Nc(23))))) { uu();  Us += ",U"; }
    if (l>=0) {
        var face=",*お告げ・四隅　<span style='color:"+['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#C0C0C0'][Nc(23)-2]+
             "; font-weight:300;'>"+"　　橙緑赤青黄白白".charAt(Nc(23))+"面</span>から";
        if ((Nc(30)==White)&&!((Nc(10)==White)&&(Nc(2)==Nc(23))&&(Nc(1)==Nc(2))&&(Nc(39)==Nc(38)))) { 
           if ((Nc(2)==Nc(23))&&(Nc(3)==Nc(2))&&(Nc(37)==Nc(38))) Us += ",*横2連発見,*#071219" + 
              ((Nc(38)==Nc(41))?",U,B,u,b":(Nc(38)==Nc(32))?",U2,R,u,r":",Y,u");
           else if (Nc(37)==Nc(32))
               if ((Nc(32)==Nc(24))&&(Nc(31)==Nc(23))) Us += face+"右ITイン,*#300337,R,U,r2,u,f,U,f2,R,f"; // IT-IN
               else Us += face+"右スロットイン,*#300337,R,u,r,U,r,F,R," + (BoCW(25,18)?"u,":"") + "f"; // 沈み判定
        } 
        if ((Us=="")&&(Nc(10)==White)) {
           if ((Nc(2)==Nc(23))&&(Nc(1)==Nc(2))&&(Nc(39)==Nc(38))) Us += ",U,U,*横2連発見,*#092128" +
              ((Nc(38)==Nc(41))?",U,B,u,b":(Nc(38)==Nc(14))?",u2,l,U,L":",Y,u");
           else if (Nc(14)==Nc(39))
               if ((Nc(39)==Nc(22))&&(Nc(15)==Nc(23))) Us += face+"左ITイン,*#100139,l,u,L2,U,F,u,f2,l,F"; // IT-IN
               else Us += face+"左スロットイン,*#100139,l,U,L,u,L,f,l," + (BoCW(27,34)?"U,":"") + "F"; // 沈み判定
        }
    } else Us = "";
    if (n>-1) while (++l<4) ui();
    return Us;
}
function otuge_corner(n=0) { // 下段４コーナーをコーナーお告げに基づき完成する
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("otuge_corner("+n+")",NxPaus);
        return true;
    }
    var Us = "", Us2, l = 4;
    if (cornerOK(White)==8) {
        Us = "*F2L完"+",Y,Y,Y,Y".slice(0,(8-n)*2);
        if ((n&1)==1) console.log('Parityが発生した可能性あり');
        console.log(Us);
        setRot(Us.split(","));
        setTimeout("SolveNavi(18)",100);
        return true;
    }
    if (n<4) {
      if ((Nc(9)==White)&&(Nc(21)==Nc(24))&&(Nc(31)==Nc(28))) 
              Us += ",*ねじりセクシーで２連準備,*#0921282431,f,U2,F";
      else if ((Nc(9)==White)&&(Nc(21)==Nc(31))&&(Nc(24)==Nc(28)))
              Us += ",*セクシームーブ３回で　右スロットイン,*#0921282431,R,U,r,u,R,U,r,u,R,U"+((Nc(31)==Nc(32))?",r":",U,r");
      else  {
          // 　２層４面のエッジベルトに黄色を含んでいたら、上面エッジを降ろし合わせる
          if ((hcorCheck(White)>=0)&&(beltCheck(Yellow,1)==1)||
               (hcorCheck(White)<0)&&(beltCheck(Yellow,1)>0)) {
              var rot = ("*エッジ降ろし発生"+",Y,Y,Y,Y".slice(0,(n%4)*2));
              console.log(rot);
              setRot(rot.split(","));
              setTimeout("ikinari_edge(11)",80);  // 修復モード　８＋３(n)
              return true;
          }
      }
      if (hcorCheck(White)<0) { [Us2,n] = nextY( n, 4 ); Us += Us2; }
      else if (Us=="") { // 奥左右コーナーの白横か？その時正面色が合うまで横回転
          Us = slotin(n);
          if (Us=="") n++;
      }
      if ((Us!="")&&(Us!=",Y")) {
          console.log(Us);
          setRot(Us.replace(/U,U,U,/g,"u,").replace(/U,U,/g,"U2,").split(",")); // 
          setTimeout("ikinari_edge(11)",100);
          return true;
      }
    }
    // 　白上向きコーナーポストが目的スロット位置に来るように黄色面を横回転する
    // 　目的スロットを仮想の正面右として、R U R'U'R U R'U'R U R'と回転させる
    if (n<8) { // 上層コーナー（白上向き）を最下層に降ろす
        l = 4; Us = "*白跳ね上げ"+NoRot.replace(" ",",");
        if (Nc(9)==White) {
            Us = "*お告げ・コーナー白上"; 
            while ((l-->0)&&!((Nc(21)==Nc(24))&&(Nc(31)==Nc(28)))) { ui(),fd(); Us += ",u,Y"; }
            if (l>=0) Us += ",*ねじりセクシーで右スロットイン,*#0921282431,f,U,F,R,U2,r";
            else {
                l = 4; Us = Us.replace(/\,u\,Y/g,""); 
                while ((l-->0)&&!((Nc(21)==Nc(31))&&(Nc(24)==Nc(28)))) { ui(),fd(); Us += ",u,Y"; }
                if (l>=0) {
                    Us += ",*セクシームーブ３回で　右スロットイン,*#0921282431,R,U,r,u,R,U,r,u,R,U"+((Nc(31)==Nc(32))?",r":",U,r");
                } else {
                    console.log('白上の土台のベルト位置が見つからない');
                    ikinari_edge(8);
                    return true;
                }
            }
        } else  {
            if (Nc(27)==White) Us += ",f,U,F,u";
            else if (Nc(34)==White) Us += ",R,u,r,u,Y";
            else if ((Nc(48)==White)&&((Nc(27)!=Nc(23))|| (Nc(27)!=Nc(24)))) Us += ",f,U,F";
            else if ((hcorCheck(White)<2)&&(Nc(19)==White)) Us += ",U";
            else { n++; Us = ",Y"; }
        }
        while (++l<4) { Fd(),uu(); Us+=",y"; } 
        if (Us.toUpperCase().indexOf("U")>=0) {
            if (n%4>0) Us = (Us+",y,y,y,y".slice(0,(n%4)*2)).replace(",y,y,y",",Y");
            n = 0;
        }
        if ((Us==",Y")||(Us==",y")) {
            n = 0;
            if ((++usw&3)==0) Us = ",u"; 
        }
        console.log(Us);
        setRot(Us.split(","));
        setTimeout("otuge_corner("+n+")",100);
        return true;
    }
    if (n%4>0) Us = (Us+",y,y,y,y".slice(0,(n%4)*2)).replace(",y,y,y",",Y");
    if ((hcorCheck(White)>=0)||(cornerOK(White)<8)) {
        setRot(("*お告げが続く"+Us).split(","));
        setTimeout("otuge_corner()",100);
        return true;
    }
    console.log(Us);
    setRot(Us.split(","));
    setTimeout("SolveNavi(18)",100);
}
let yon=false;  // 4x4,6x6スイッチ
const RS="*二隅隣接交換,*#300337092128,L,r,u,R,U,l,u,r,U,R";
const TK="*対角交換（交換パーム）,*#300337071219,r,u,f,U,F,R,U";
function ex2corner(n=0) { // 隣接交換、対角交換でコーナーの色を合わせる
// White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
// 上面コーナーが隣接１組一致(隣接検査表内)なら、隣接交換
// 対角１組一致（隣接検査表外）なら対角交換、
// それぞれ２組一致なら、何もしない
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("ex2corner("+n+")",NxPaus);
        return true;
    }
    var y=4,l=4, Us="*"+NoRot.replace(" ",","), yy;
    while ((y>0)&&!(Nc(14)==Orange)) { y--; fd(); Us += ",Y"; }
    yy = y;
    if ($("#parity").prop('disabled')==false) {
        check33();
        if ($("#miniCube").css('display')!="none") {
             mini3x3(false);
             Pause = true;
             mini3x3(0);
             setTimeout('Pause=false;',2000);
        } 
        flushB(200);
        $("#parity").prop('disabled',true);
        Tid = setTimeout("ex2corner("+n+")",NxPaus);
        return true;
    }
    if (RotOmt==1) {
        while (y++<4) fd2(),fd();
        Us = Us.replace(",Y,Y,Y",",y").replace(",y,Y","");
        RotSft = (RotSft+5-yy) & 3;
    // これからはRotSftに対応しない回転を含むため
        RotOmt = 0;
        Us += ",y,y,y,y".slice(0,RotSft*2);
        console.log(Us);
        Rotates.concat(Us.split(","));
        RotSft = 0;
        setTimeout("ex2corner("+n+")",100);
        return true;
    }
// White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
    var i, nablen=[], targ=["U2","u","","U"],dist=[300,96,36,144];  // 隣接検査表
    if (n==34) { // 終了時、中央と４隅との色合わせ
        $("#parity").prop('disabled',true);
        while ((l>0)&&!(Nc(1)*Nc(10)*Nc(39)==36)) { l--; uu(); Us += ",U"; }
        while (y++<4) fd2(),fd();
        while (l++<4) ui();
        console.log(Us);
        setRot(Us.replace(",U,U,U",",u").replace(",U,U",",U2").split(",")); // 
        setTimeout("SolveNavi("+n+")",100);
        return true;
    }
    // 隣との距離が候補４個に入るなら、そのパーツを優先配置して隣接交換可を検証
    nablen.push(Nc(1)*Nc(10)*Nc(39)*3-Nc(7)*Nc(12)*Nc(19)); // 一致： 60 逆：300
    nablen.push(Nc(7)*Nc(12)*Nc(19)*3-Nc(9)*Nc(21)*Nc(28)); // 一致：288 逆： 96
    nablen.push(Nc(9)*Nc(21)*Nc(28)*3-Nc(3)*Nc(30)*Nc(37)); // 一致：180 逆： 36
    nablen.push(Nc(3)*Nc(30)*Nc(37)*3-Nc(1)*Nc(10)*Nc(39)); // 一致： 48 逆：144
    var multiNab = new Set(nablen.concat(dist));
    console.log(multiNab);
    nablen.push(00);
    l = 4;
    if (multiNab.size==7) { // １辺交換可能
        for (i in [0,1,2,3,4]) if (dist.includes(nablen[i])) break;
        if (l>0) { // 交換可能パーツの先頭を9番において
            Us += ","+targ[i]+","+RS;        // 1_7okなので、3-9を交代
        } else console.log('Target [',i,']が無い');
    }
    else {  // 交換ゼロか2個以上交換可能
        Us = "*交換パームかも"+(8-multiNab.size); // 隣接対象外
        while ((l>0)&&!(Nc(1)*Nc(10)*Nc(39)==36)) { l--; uu(); Us += ",U"; }
        if (l>0) {                         //        36
            nablen7 = Nc(7)*Nc(12)*Nc(19); // 目標： 60  72
            nablen9 = Nc(9)*Nc(21)*Nc(28); // 目標：120 120
            nablen3 = Nc(3)*Nc(30)*Nc(37); // 目標： 72  60
            if (nablen9==120) {  // 1_9ok対角の一致
                if (nablen3!=72) { // 上面対角1_9okで1_3ngなので、3-7を対角交換し、U
                    n = 22; // 再度時計読み必要
                    Us += "," + TK;
                }
                // 上面対角1_9と1_3okなら全一致なので、面を合わせた位置で戻る
            }
        } else console.log('コーナー1のパーツが見つからない');
    } 
    while (l++<4) ui();
    while (y++<4) fd2(),fd();
    console.log(Us);
    setRot(Us.replace("U,u,","").replace("U,U,U,","u,").replace("U,U,","U2,").split(",")); // 
    setTimeout("parityAlt("+n+")",100);
}

function clk2move(n=0) {  
// 時計読み２連続ムーブ：点ならFRUR'U'F'、それ以外直線と３時ムーブ、
// それで２連目に時計読み６時ムーブ
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("clk2move("+n+")",NxPaus);
        return true;
    }
    var l = 4, Us = "*時計読みお告げから下準備"+NoRot.replace(" ",",");
    while ((l-->0)&&!(Nc(2)==Yellow)) { uu(); Us += ",U"; }
    if (l>=0) {
        if (n%2==0) {
            if ((Nc(4)==Yellow)||(Nc(8)==Yellow)) Us += ",U";
        } else if (Nc(6)==Yellow) Us += ",u";
    } else Us = "*お告げ・時計パーム６へ,F,R,U,r,u,f";
    while (++l<4) ui();
    if (Us.indexOf('６へ')<0) Us += ((n%2==0)?",*お告げ・時計パーム３":",*お告げ・時計パーム６で　魚準備")+",*#3003370629,r,u,f,U,F,R";
    console.log(Us);
    setRot(Us.replace("U,u,","").replace("U,U,U,","u,").replace("U,U,","U2,").split(",")); // 
    if (n%2==0) {
        n++;
        setTimeout("clk2move("+n+")",100);
        return true;
    }
    setTimeout("SolveNavi("+n+")",100);
}
// const  PA = "*パリティ補正"+((N>=8)?"Ｗ3,ml2,lc2,cl2,U2,F2,ml2,lc2,cl2,F2,U2,ml2,lc2,cl2":
//                             (N>=6)?"Ｗ,ml2,cl2,U2,F2,ml2,cl2,F2,U2,ml2,cl2":
//                                      ",ml2,U2,F2,ml2,F2,U2,ml2");

function getFish(n=0) { // 上面に魚型のクロスを作る
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("getFish("+n+")",NxPaus);
        return true;
    }
    // 運悪く蝶なら（左手上＆右足横）、右足横面の肩パームで魚にする
    // 黄色手足４つが上横下横か上横下肢に４本伸びていれば肩パーム、
    //    手だけ＆足なしの場合は、(uして)腰パームを廻して魚にする
    var l = 4, Us = "*魚型へ"+NoRot.replace(" ",","), corCnt = vcorCheck(Yellow,true); // 上面コーナー黄色の数
    PA = "*パリティ補正"+((N>=8)?"Ｗ3,ml2,lc2,cl2,U2,F2,ml2,lc2,cl2,F2,U2,ml2,lc2,cl2":
                          (N>=6)?"Ｗ,ml2,cl2,U2,F2,ml2,cl2,F2,U2,ml2,cl2":
                                   ",ml2,U2,F2,ml2,F2,U2,ml2");
    if (corCnt==0){ // クロス(10と30が黄色)で、肩からパーム、
        uu(); Us += ",U";
        while ((l-->0)&&!((Nc(10)==Yellow)&&(Nc(30)==Yellow))) { uu(); Us += ",U"; }
        if (l>=0) {
            Us = Us.replace(",U,U,U",",u")+",*肩から黄十字パームで　魚型へ変形,*#300337,r,u,R,u,r,U2,R";
            if ((N%2==0)&&(Nc(11)==Nc(14))&&(Nc(20)!=Nc(23))) Us += ",U,x,"+PA+",X"; // パリティ対応
            if ((N%2==0)&&(Nc(11)!=Nc(14))&&(Nc(20)==Nc(23))) Us += ",x,"+PA+",X"; // パリティ対応
            if (Us.indexOf("*パリティ補正")>=0) {
                $("#parity").prop('disabled',false);
                $("#solve3").prop('disabled',true);
            }
        } else Us = "*魚型へ"+NoRot.replace(" ",",");
        while (++l<4) ui();
        n++;
    } else if (corCnt==1) { // 魚形ができあがった?
           if (edgeCheck(Yellow,2)==4) // 魚形ができあがった
                setTimeout("SolveNavi("+n+")",100);
           else setTimeout("SolveNavi(22)",100); // 再度、時計読みお告げ
           return true;
    } else if (corCnt==2) { // 蝶か亀形
        // 亀は（隣接黄色）、蝶は（対角黄色）で判断
        // 蝶(39と34)そして亀手前（37と39)なら、肩からパーム、
        // 亀手開きだけ(10と30だけ黄色)上げ足からパーム
        while ((l-->0)&&!((Nc(7)==Yellow)&&(Nc(9)==Yellow))) { uu(); Us += ",U"; }
        if (l<0) { // 隣接黄色は無しなので、蝶型（対角黄色）の判定
            l=4;Us = "*"+NoRot.replace(" ",",");
            while ((l-->0)&&!((Nc(7)==Yellow)&&(Nc(3)==Yellow)&&(Nc(28)==Yellow))) { uu(); Us += ",U"; }
            if (l<0) console.log('上面２個の黄色が見つからない');
        } else { // 隣接黄色なので亀形
            if ((Nc(10)==Yellow)&&(Nc(30)==Yellow)) // 手が横開きなら
                Us += ",*上げ足から黄十字パームで　魚型へ変形,*#092128,u,r,u,R,u,r,U2,R";
        }
        while (++l<4) ui();
        if (Us.indexOf("から黄十字")<0)
             Us += ",*肩から黄十字パームで　魚型へ変形,*#300337,r,u,R,u,r,U2,R";
        if (n%2==1) n--;
    } else if (corCnt>3) { // 全面黄色のケース
        while (++l<4) ui();
        n = 28;        // 左右迎えか、Z/Hパームとなり、処理をパスする。
        $("#proc28").prop('disabled',false);
    }
    console.log(Us);
    setRot(Us.replace("U,u,","").replace("U,U,U,","u,").replace("U,U,","U2,").split(",")); // 
    if (n%2==1) setTimeout("getFish("+n+")",100);
    else setTimeout("SolveNavi("+n+")",100);
}
function reachFish(n=0) { // ゴールリーチの横面色に進化させる
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("reachFish("+n+")",NxPaus);
        return true;
    }
    PA = "*パリティ補正"+((N>=8)?"Ｗ3,ml2,lc2,cl2,U2,F2,ml2,lc2,cl2,F2,U2,ml2,lc2,cl2":
                          (N>=6)?"Ｗ,ml2,cl2,U2,F2,ml2,cl2,F2,U2,ml2,cl2":
                                   ",ml2,U2,F2,ml2,F2,U2,ml2");
// ２か所のお迎えパームでゴールさせる。
// 対面にあるエッジのお迎えは、側の一致する左右迎えで引くことができる
// 単純に左右から迎えられる判断でも、対面が正面エッジを欲しがっていたら、
//    何もせずに、U2後の単一試行が手数有利で優先
// 側面に黄ばみのない面の対面で、その面の黄色を避ける２個のキューブを調べる
    var Us = "*リーチのエッジ移動"+NoRot.replace(" ",",");
    var l = 4, i = -1;
    if (n%2==0) { // １回目（表）
        while ((l-->0)&&!((Nc(37)!=Yellow)&&(Nc(39)!=Yellow))) MoveHori(0,1,0);
        if (l<0) console.log('黄色無しの面が無い');
        if (Nc(19)==Yellow) { // i,j:0-3:H,L,O,R
            for (i in [20,11,38,29]) if (Nc([20,11,38,29][i])==Nc(21)) break;
            i = invite(i,37);
        } else if (Nc(21)==Yellow) {
            for (i in [20,11,38,29]) if (Nc([20,11,38,29][i])==Nc(19)) break;
            i = invite(i,39);
        } else i = 0, n++;
        while (++l<4) { moveHori(0,1,0); Us += ",U"; } // i==0の時、U回転の計数を継続する
    }
    if (n%2==1) {  // ２回目（裏）か　上面全黄色
        if (Nc(39)==Yellow) { // i,j:0-3:H,L,O,R
            for (i in [20,11,38,29]) if (Nc([20,11,38,29][i])==Nc(21)) break;
            i = invite(i,37);
        } else if (Nc(37)==Yellow) {
            for (i in [20,11,38,29]) if (Nc([20,11,38,29][i])==Nc(19)) break;
            i = invite(i,39);
        } else if (edgeCheck(Yellow,2)==4) { // 上面全黄色
//            while (++l<4) ui();  // 「勝手にuu()」をいったん戻す
            Us += ",*最終交換パーム"; l = 4; i = 0;
            while ((l-->0)&&!((Nc(39)==Nc(38))&&(Nc(38)==Nc(37)))) MoveHori(0,1,0);
            if (l<0) { // 上層横色が３パーツ揃った面がない
                Us += ",*最終交換", l = 4;
                if      ((Nc(19)==Nc(11))&&(Nc(10)==Nc(20))) i = 6; // 斜め２組交換
                else if ((Nc(19)==Nc(29))&&(Nc(30)==Nc(20))) i = 7; // 斜め２組交換
                else if ((Nc(19)==Nc(38))&&(Nc(37)==Nc(20))) {
                     if (!yon || (Nc(11)==Nc(28)))           i = 5; // 十字交換
                     else if ((Nc(19)==Nc(11))&&(Nc(10)==Nc(29))) i = 1; // 左迎え後P
                     else if ((Nc(19)==Nc(29))&&(Nc(11)==Nc(30))) i = 3; // 右迎え後P
                     else  i = 8, n--;
                } else  i = 8, n--; // エッジ移動して３パーツ整備後、reachFish後半やり直し
            } else { console.log('l=',l);
                if      ((Nc(19)==Nc(11))&&(Nc(10)==Nc(29))) i = 1; // 左迎え
                else if ((Nc(19)==Nc(29))&&(Nc(11)==Nc(30))) i = 3; // 右迎え
                else if ((Nc(29)==Nc(28))&&(Nc(28)==Nc(30))&&(Nc(10)==Nc(11))&&(Nc(11)==Nc(12))) n = 33;
                else if (yon) i = 9, n-=3; // U後、パリティ、reachFishやり直し
            }
            while (++l<4) { ui(); Us += ",U"; }
        } else if (yon) i = 9, n-=3; // U後、パリティ、reachFishやり直し
    }   
    if (i==0) {  // reachFishがすべて揃っている。
        setTimeout("SolveNavi("+n+")",100);
        return true;
    }
    hidari = ",*エッジ左迎え,*#04110820,M2,U,m,U2,M,U,M2";
    migi   = ",*エッジ右迎え,*#06290820,M2,u,m,U2,M,u,M2";
    center = ",*エッジ十字交換,*#02380820,M2,U,M2,U2,M2,U,M2";
    slant2 = ",*エッジ斜め２組交換,*#0411082006290238,M,U,M2,U,M2,U,M,U2,M2";
    if      (i==1) Us += hidari;
    else if (i==2) Us += ",U"+hidari+",u";
    else if (i==3) Us += migi;
    else if (i==4) Us += ",u"+migi+",U";
    else if (i==5) Us += center;
    else if (i==6) Us += slant2;
    else if (i==7) Us += ",U"+slant2;
    else if (i==8) {
            if      (Nc(19)==Nc(29)) Us += migi;  // 右迎え後、reachFishやり直し
            else if (Nc(19)==Nc(11)) Us += hidari;// 左迎え後、reachFishやり直し
            else                     Us += center;}// 十字交換後、reachFishやり直し
    else if (i==9) {
        $("#parity").prop('disabled',false);
        $("#solve3").prop('disabled',true);
        Us += ",U,x,"+PA+",X,u";
    }
    if ((i<5)&&(n%2==0)) { Us += ",U,U"; Us = Us.replace("u,U,",""); }
    console.log(Us);
    setRot(Us.replace("U,U,U,","u,").replace(/U\,U\,/g,"U2,").split(",")); // 
    if ((i==8)||(i<5)&&(n%2==0)) setTimeout("reachFish("+(n+1)+")",100);
    else setTimeout("SolveNavi("+n+")",100);
}   
function invite(i,y) {
    var ii = i;
    if      ((i==1)&&(Nc(29)==Nc(y))) ii = 6; // 斜め２組交換
    else if ((i==2)&&(Nc(11)==Nc(y))) ii = 4; // u+migi
    else if ((i==3)&&(Nc(11)==Nc(y))) ii = 7; // U+斜め２組交換
    if (Nc(20)==Nc(y))
        if (ii==2) ii = 5; // 表裏エッジ相互交換
        else       ii = 0; // 裏エッジの処理に任せる
    return ii;
} 
let PA,NP;
const PP = "l2,U2,F2,l2,F2,U2,l2".split(",");
const MP = "F Rw U2 Rw' U2 Rw U2 Rw U2 Lw' U2 Rw U2 Rw' U2 X' U2 Rw2 U2 F'".split(" ")
function parityAlt(n) {  // 4x4の時自動的に実行される
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("parityAlt("+n+")",NxPaus);
        return true;
    }
    if (!yon){
        setTimeout("SolveNavi("+n+")",100);
        return true;
    }
    // 4x4のパリティチェック
    var rot = "*パリティ補正"+((N==8)?"Ｗ3 ":(N==6)?"Ｗ ":" ");
    if (!yon||!(YCCount(Yellow)%2==1)) { // TOP色Edgeペアが奇数でないなら戻る
        $("#parity").prop('disabled',true);
        setTimeout("SolveNavi("+n+")",100);
        return true;
    }
    $("#parity").prop('disabled',false);
    $("#solve3").prop('disabled',true);
    if (!navigator.userAgent.match(/iPhone|Android.+/)) speed=40,NxPaus=500;
    l=4;while ((l-->0)&&!((Nc(2)==Yellow)&&(Nc(8)!=Yellow))) { uu(); rot+="U "; }
    if (l>=0) { // 上層エッジの非黄色が手前に
        NP = (N==8)?"Mr2 Rc2 Cr2 B2 U2 Ml Lc Cl U2 mr rc cr U2 Mr Rc Cr U2 F2 Mr Rc Cr F2 ml lc cl B2 Mr2 Rc2 Cr2":
             (N>=6)?"Mr2 Cr2 B2 U2 Ml Cl U2 mr cr U2 Mr Cr U2 F2 Mr Cr F2 ml cl B2 Mr2 Cr2":
                    "Mr2 B2 U2 Ml U2 mr U2 Mr U2 F2 Mr F2 ml B2 Mr2";
        Rotates = Rotates.concat((rot+NP).split(" "));
    }
    while (++l<4) ui();
    console.log(Rotates.join(","));
    setTimeout("ex2corner("+n+")",100); // 再度、コーナー交換チェック
}
//
//  3x3扱いで、お告げ型手順を逐次実行する
//  2x2扱いへのオプションも、ここからお告げ型手順をへ進む
//
let turnN3 = 0;  // turn No at 3x3 mode start
function SolveNavi(s=0) {
    var n = s;
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("SolveNavi("+n+")",NxPaus);
        return true;
    }
    if (N==2) { solve2x2(s); return; }
    if (n>34) {
        return;  //  終了
    }
    if (n==0) turnN3 = turnN;
    var stp = parseInt(document.getElementById('stop').value);
    if (stp>0){
        if (n<stp) {
                NoRot = "";
        } else if (n>=stp) {
                NoRot = "";
                pause();
        }
    }
    yon=false; if ((N>=4)||(n==1)) yon = true;
// 黄色面を上層にする　
    if (Nc(5)==White) {
        setRot(["*黄色上面"]);
    　　if (n==0) setRot(["**"]);
        if (RotSft>0) normalPos();
        Rotates.push("X2");
        setTimeout("SolveNavi("+n+")",100);
        return true;
    }
    if ((n==0) && !yon&&(beltCheck(Yellow,1)==0)&&(edgeOK(White)==4)) n = 13;
    $("#proc"+("0"+(n&254)).slice(-2)).prop('disabled',false);
    if ((n==33)&&yon) $("#proc28").prop('disabled',false);
    if ((n>12) && (n<18) && (faceTest(true)==0)) n = 18;
    console.log('SolveNavi In: '+n);
// 白エッジを４個とも上面に上向きに上げてから、最下層に降ろす
    if (n<5) {
        WhiteX(0);
        return true;
    }
// ２層のエッジベルトが黄色を４個含むまで、上面黄色エッジを降ろす
// ４個でなくエッジベルトのうち、パーツ位置が違っている分だけ黄色降ろしでもよい。
// White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
    var l = 4, y = 4, Us = "*「いきなりF2L」|エッジベルトが黄色を４個含むまで"+NoRot.replace(" ",",");
// ２層４面の黄ばみのないエッジベルトのため、センター色に合わせて上面エッジから降ろす
    
    if ((n<16)&&(edgeCheck(Yellow,2)<4)) {
        $("#proc16").prop('disabled',false);
        ikinari_edge(0);
        return true;
    }        
// 以下を下段４コーナー分繰り返すと、F2L終了状態となる
    if ((n<18)&&(cornerOK(White)<8)) {
        $("#proc16").prop('disabled',false);
        otuge_corner();
        return true;
    }        
// 隣接１組一致なら、隣接交換。対角１組一致なら対角交換。
    if (n<22) {
        $("#proc18").prop('disabled',false);
        ex2corner(22);
        return true;
    }
    if (n<24) {
// 時計読み２連続ムーブ、点ならFRUR'U'F'と時計読み6時ムーブ
        $("#proc20").prop('disabled',false);
        if ((vcorCheck(Yellow,true)==4)&&(edgeCheck(Yellow,2)==4)) {
            setTimeout("SolveNavi(31)",100); // 黄色面達成済み
            return true;
        } else if (!YCCheck()) { clk2move(24); return true; }
    }
// 運悪く蝶なら（左手上＆右足横）、右足横面の肩パームで魚にする
// 黄色手足４つが上横下横か上横下肢に４本伸びていれば肩パーム、
//    手だけ＆足なしの場合は、腰パームを廻して魚にする
    if (n<26) {
        $("#proc24").prop('disabled',false);
        getFish(26);
        return true;
    }
// 黄ばみの無い面の対面からXパームを実施して黄色一面にする
    var vcor = vcorCheck(Yellow,true),i=0;
    Us = "*魚・黄十字パーム|黄色一面へ"+NoRot.replace(" ",","); l=4;
    if (n<28) {
       if (vcor<4) {
          $("#proc26").prop('disabled',false);
          while ((l-->0)&&!((Nc(19)!=Yellow)&&(Nc(21)!=Yellow))) { uu();  Us += ",U"; }
          if (l>=0) { 
            var tms = 24;
            if (navigator.userAgent.match(/iPhone|Android.+/))  tms = 4;
            if        (Nc(37)==Yellow) {
                Us += ",U,*#101112,*#3003370629,r,u,R,u,r,U2,R";
            } else if (Nc(39)==Yellow) {
                Us += ",u,*#282930,*#1001390411,L,U,l,U,L,U2,l";
            } else { kiir();alert('上面奥横に黄色が見つからない：パーツ捻れ'); } 
          } else { kiir();console.log('上面横の黄ばみなし面が見つからない'); }
       } else console.log('Full yellow');
        while (++l<4) ui();
        console.log(Us);
        setRot(Us.replace("U,u,","").replace("U,U,U,","u,").replace("U,U,","U2,").split(",")); // 
        setTimeout("SolveNavi(28)",100);
        return true;
    }
// ２か所のお迎えパームでゴール型に進化させる。
// 対面にあるエッジのお迎えは、側の左右迎えで引くことができる
    if (n==31) {
        $("#proc28").prop('disabled',false);
        reachFish(32);
        return true;
    }
// 上面黄色一色の時、Z,U,Hパームでゴールする
    if ((n<33) && (vcor==4)) {
        $("#proc32").prop('disabled',false);
        reachFish(33);
        return true;
    }
// 上面の４隅を中央に合わせて回転する
    if ($("#miniCube").css('display')!="none") mini3x3(0);
    if (n<34) {
        ex2corner(34);
       return true;
    }
// 初期の配置型に揃える
    turn("X2");
    Rotates.push("*ゴール!!","*Fin");
    setTimeout("SolveNavi(35)",1000);
}
//  2x2 option logic
//
//  Step1：高速・完全白一面を作る
//         1)白にマークのあるパーツを手前上段パーツ番号３の位置に固定（Y＆X）。
//         2)上段白含みの他のパーツを下段に。跳ね上げに白を含まない位置で。
//         3)固定パーツの右に、白と正面９番の色(目的)を含むパーツを下段から呼び込む。
//         　右ターゲットに対し、左下、直下、下裏面のどこかに目的色が現れるまで下段を回す
//           ・左下に現れ下裏が白　　R',D2,R　で下裏へ
//           ・直下に現れ右側が白    L',F',L
//           ・下裏に現れ直下が白    B,R,B'
//         4)同様にターゲットを右へ３か所移動U回転して実施し、白一面を完成する。
//
//  Step2：下面の黄色パーツの位置確定をする
//         ・交換ターゲットは、隣接交換と、対角交換の２種類発生し、一気の回転もあるが、
//           隣接交換：R,U2,R',U',R,U2,L',U,R',U',L    (黄色上面）
//           対角交換：R,U',R',U',F2,U',R,U,R',U,F2    (黄色上面）
//
//           この二つは複雑で2x2特有の手順のため、3x3および4x4でも使える手順を採用する
//           手順は短くなるが、黄色面でのパーツ単体回転も伴なうため、次段補正を前提とする
//           隣接交換：U'R U L'U'R'U R U    (黄色上面）
//           対角交換：R'U'F'U F R U　　    (黄色上面）
//
//  Step3：位置が確定した黄色パーツを完全一面とする
//         ・黄色パーツが下面に黄色無しなら、事前に対角交換を２回実施すると早い
//         ・固定パーツの右の位置を「エレベーター」として上下交換の役割を負わせる
//         ・上下交換の手順として「セクシームーブ(R,U,R',U')」とその逆(U,R,U',R')を使う
//         1)下段で黄色が下を向いていないパーツをＤ回転でエレベーターへ移動。
//         2)黄色が下を向くまで、正逆セクシームーブを２回ずつ繰り返す。
//         3)４パーツすべてが下を向けば、黄色一面終了、同時に白一面も完全形に戻る。
//
//
let nablen=[];
function renab() {
        nablen = [];
        nablen.push(Nc(3)*Nc( 6)*Nc( 9));
        nablen.push(Nc(22)*Nc(12)*Nc(15));
//        nablen.push(Nc(4)*Nc(10)*Nc(13));
//        console.log(nablen);
}
const WhGrp = [160,96,80,48];
function nabW(i,target=White) { // パーツが白を含むか
    renab();
    if (target==White) return(WhGrp.includes(nablen[i]));
    return([120,72,60,36].includes(nablen[i]));  // Yellow
}
// 2x2 Solver First
//   White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
//   白のあるパーツ
//        nablen1 = Nc(1)*Nc( 5)*Nc(18); // 目標： 80
//        nablen2 = Nc(2)*Nc(14)*Nc(17); // 目標：160
//        nablen3 = Nc(3)*Nc( 6)*Nc( 9); // 基準： 48
//        nablen4 = Nc(4)*Nc(10)*Nc(13); // 目標： 96
//   黄色のあるパーツ
//        nablen21= Nc(21)*Nc( 8)*Nc(11); // 目標： 60
//        nablen22= Nc(22)*Nc(12)*Nc(15); // 目標： 36
//        nablen23= Nc(23)*Nc( 7)*Nc(20); // 目標：120
//        nablen24= Nc(24)*Nc(16)*Nc(19); // 目標： 72

function white2x2(n,target=White,ck=false,Us="") {
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("white2x2("+n+","+target+","+ck+","+Us+")",NxPaus);
        return true;
    }
    // 白パーツを４個とも上面に上向きに上げる
    if (n>=8) {
        Us = Us.replace(/U\,U\,U\,U/g,"").replace("U,U,U,","u,");
        Us = Us.replace(/D\,D\,D\,D\,/g,"").replace("D,D,D,","d,");
        console.log(Us);
        setRot(rewind(Us));
        setTimeout("solve2x2(8)",100);  //
        return true;
    }
    const cube3 = ["09101314","19202324","33343738"];
    var i, j, k, l, color=Blue; // 初期パーツの正面
    if (n<4) {
        Us = "*白パーツを下へ集める"+NoRot.replace(" ",",");
        for (k=0;k<8;k++) {
            if (nabW(0,target)) {  // 3番が白含みなので下段に回転するが、白跳ね上げを回避
                i=3; while ((i-->0)&&(Nc([3,6,9][i])!=target));
                     Us += ",*$" + cube3[i];  // 白の色を点滅
                j=4;l=4; while (l-->0) {
　　　　　　　　　　if (!nabW(1,target)) break; // 跳ね上がる22番のパーツが白なし
                    j--; turnSftND("D"); Us+=",D";
                }
                if (l>0) { turnSftND("f"); Us += ",f"; }
            } else  { n++; turnSftND("U"); Us += ",U"; }
        }
        n = 4;
    }
    if (n<8){
        Us += ",*$35363940,*白パーツを正規の位置へ";
        for (n=n;n<8;n++) {
            let colname = ",*移動先に呼ぶべき<span style='color:"+['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#C0C0C0'][color-2]+
                          "; font-weight:300;'>"+"　　橙緑赤青黄白白".charAt(color)+"色</span>が";
            for (j=0;j<4;j++) {
                if      ((Nc(11)==color)&&(Nc(21)==target))
                   Us+=",*$41424546"+colname+"左下なので R'D2 R後、,*下裏からB R B',r,D2,R,B,R,b",turnSftND("r,D2,R,B,R,b");
                else if ((Nc(12)==color)&&(Nc(15)==target))
                   Us+=",*$43444748"+colname+"直下に来たので L'F L,l,f,L",turnSftND("l,f,L");
                else if ((Nc(22)==color)&&(Nc(12)==target))
                   Us+=",*$83848788"+colname+"下裏に来たので B R B',B,R,b",turnSftND("B,R,b");
                else if ((Nc(10)==color)&&(Nc( 4)==target))
                   Us+="";
                else { turnSftND("D"); Us+=",D"; continue; } 
                turnSftND("U"); Us+=",U";
                color = Nc(9);
//                break;
            }
        }
        if (Us.slice(-4)=="の位置へ") console.log('Not found:',color);
    }
    if (ck) return Us;
    white2x2(n,target,ck,Us);
}
// 2x2 Solver Second
// 隣接１組一致なら、隣接交換。対角１組一致なら対角交換。
function yellow2x2(n) {
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("yellow2x2("+n+")",NxPaus);
        return true;
    }
    var l;
    const RS="*隣接交換 黄色一面に向け D'R D L'D'R'D R D が可,*$5758626159606364,d,R,D,l,d,r,D,R,D",
          TK="*対角交換 黄色一面に向け R'D'B'D B R D が可,*$0304070809101314,r,d,b,D,B,R,D";
    var Us = "*最終検査"+NoRot.replace(" ",",");             
    if (n==34) { // 終了時、４隅定位置の色合わせ(上：白、下：黄色)
        if (faceTest()==0) {
            setTimeout("solve2x2(34)",100);
            return true;
        }
        l=4;while ((l-->0)&&!(Nc(1)*Nc(5)*Nc(18)==80)) { Uw(); Us += ",U"; }
            if      (l==0) Us = "*最終検査"+NoRot.replace(" ",",");
        l=4;while ((l-->0)&&!(Nc(21)*Nc(8)*Nc(11)==36)) { Dw(); Us += ",D"; }
            if      (l==0) Us = Us.replace(",D,D,D,D","");
        Us = Us.replace(",D,D,D",",d")
        console.log(Us);
        setRot(rewind(Us)); // 
        setTimeout("solve2x2(34)",100);
        return true;
    }
    Us = "*隣接・対角調査"+NoRot.replace(" ",",");
    var i,targ=["","D","D2","d"],dist=[36,144,300,96];  // 隣接検査表(交換可能距離４点)
    // White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
    // 隣との距離が候補４個に入るなら、そのパーツを優先配置して隣接交換可を検証
    //   黄色のあるパーツ
    //        nablen1= Nc(21)*Nc( 8)*Nc(11); // 目標： 60
    //        nablen3= Nc(22)*Nc(15)*Nc(12); // 目標： 36
    //        nablen7= Nc(23)*Nc( 7)*Nc(20); // 目標：120
    //        nablen9= Nc(24)*Nc(19)*Nc(16); // 目標： 72
    nablen = [];
    nablen.push(Nc(24)*Nc(19)*Nc(16)*3-Nc(22)*Nc(15)*Nc(12)); // 一致：180 逆： 36
    nablen.push(Nc(22)*Nc(15)*Nc(12)*3-Nc(21)*Nc( 8)*Nc(11)); // 一致： 48 逆：144
    nablen.push(Nc(21)*Nc( 8)*Nc(11)*3-Nc(23)*Nc( 7)*Nc(20)); // 一致： 60 逆：300
    nablen.push(Nc(23)*Nc( 7)*Nc(20)*3-Nc(24)*Nc(19)*Nc(16)); // 一致：288 逆： 96
    var multiNab = new Set(nablen.concat(dist));
    console.log(multiNab);
    nablen.push(00);
    l = 4;
    if (multiNab.size==7) { // １辺交換可能
        for (i in [0,1,2,3,4]) if (dist.includes(nablen[i])) break;
        if (l>0) { // 交換可能パーツの先頭を22番において
            console.log("Parts22 ",Nc(22)*Nc(15)*Nc(12),"3-9を交代");
            Us += ","+targ[i]+",x,"+ RS;      // 1_7okなので、3-9を交代 
        } else console.log('Target [',j,']が無い');
    }
    else {  // 交換ゼロか2個以上交換可能
        Us = "*時計パーム６ "+(8-multiNab.size); // 隣接対象外
        while ((l>0)&&!(Nc(21)*Nc(8)*Nc(11)==60)){
            l--; Dw(); Us += ",D"; } // 本来パーツを21番へ
        if (l>0) {                         //        60
            nablen7 = Nc(23)*Nc( 7)*Nc(20); // 目標：120
            nablen9 = Nc(24)*Nc(19)*Nc(16); // 目標： 72
            nablen3 = Nc(22)*Nc(15)*Nc(12); // 目標： 36
            if (nablen9==72) {  // 1_9ok対角の一致
                if (nablen3!=36) { // 上面対角1_9okで1_3ngなので、3-7を対角交換し、U
                    Us += ","+ TK;
                }
                // 上面対角1_9と1_3okなら全一致なので、面を合わせた位置で戻る
            } else console.log('nablen9 =',nablen9);
        } else Us="*", l=4, console.log('コーナー1のパーツが見つからない');
    } 
    if ((Nc(21)!=Yellow)&&(Nc(22)!=Yellow)&&(Nc(23)!=Yellow)&&(Nc(24)!=Yellow)) { // 黄色が全部側面を向いたとき
        j=4; let Ds=""; while ((j>0)&&!((Nc(19)==Yellow)&&(Nc(12)==Yellow))) { j--; dw(); Ds += ",d"; }
        // 黄色を右奥と右手前に置いて対角交換２回分10手で、２個を下向きにできる
            if (j==0) Ds = "";
            else { // if ((Nc(20)==Yellow)&&(Nc(11)==Yellow)||(Nc(7)==Yellow)&&(Nc(8)==Yellow)) 
                Us += Ds + ",*２個反転対角交換２回,*$4344474873747778,r,d,b,D,B,d,b,D,B,R"; 
                while (j++<4) Dw();
            }
    }
    while (l++<4) dw();
    console.log(Us);
    setRot(Us.replace("U,U,U,","u,").split(","));
    setTimeout("solve2x2(12)",100);
}
//         ・交換ターゲットは、隣接交換と、対角交換の２種類発生し、次の回転もある
//           隣接交換：R,U2,R',U',R,U2,L',U,R',U',L    (黄色上面）
//           対角交換：R,U',R',U',F2,U',R,U,R',U,F2    (黄色上面）
//
// 2x2 Solver Main
function solve2x2(n) {
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("solve2x2("+n+")",NxPaus);
        return true;
    }
// 白コーナーを４個とも上面に上向きに上げる
    if (n==0) {
        $("#proc00").prop('disabled',false); 
        if (Nc(1)*Nc(2)*Nc(3)*Nc(4)==4096) n = 8;
        else {
//            turn("");
            setTimeout("white2x2(0)",100);
            return true;
        }
    }
    console.log('Solve2x2 In:',n);
    if ((n>0) && (n==parseInt(document.getElementById('stop').value))) pause();
// 下段のコーナー整合のため、黄色面の隣接交換・対角交換を実施する
    if (n==8) { //
        $("#proc04").prop('disabled',false);  // 18
        setTimeout("yellow2x2(8)",300);
        return;
    }
// 下段の黄色パーツで、底を向いていないものを向かせる。
// ４個でなくても、違っている分だけ黄色回転でよい。位置は問わない。
// White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6
    var l, m=n, y, Us="", As=0;
    if (n==12) { //
        $("#proc16").prop('disabled',false);
        Us = "*黄色一面を揃える"+NoRot.replace(" ",",");
        if (Nc(21)*Nc(22)*Nc(23)*Nc(24)==1296) m = 16;
    }
    const sexy2 = ",*$57586162,*右下<span style='background-color:yellow;'>&nbsp;田&nbsp;</span>が<font color=red>横</font>向きなので、セクシームーブ２回,"
                + "R,U,r,u,R,U,r,u";
    const sexyR = ",*$43444748,*右下<span style='background-color:yellow;'>&nbsp;田&nbsp;</span>が<font color=red>前</font>向きなので、逆セクシームーブ２回,"
                + "U,R,u,r,U,R,u,r";
    while (m<16) { //
        y=4;while ((y>0)&&(Nc(22)==Yellow)) { y--; Dw(); Us += ",D"; } //  
            if (y>0) {
                if      (Nc(15)==Yellow) { As=0,Rw(),Uw(),rw(),uw(),Rw(),Uw(),rw(),uw(); Us += sexy2; } // セクシームーブ
                else if (Nc(12)==Yellow) { As=1,Uw(),Rw(),uw(),rw(),Uw(),Rw(),uw(),rw(); Us += sexyR; } // 逆セクシームーブ
                m++;
                if (Nc(21)*Nc(22)*Nc(23)*Nc(24)==1296) { // 黄色一面達成
                    m = 16;
                    if (As==0) Uw(),Us = Us.slice(0,-2); // 最後の u 回転なら不要
                }
            } else {
                Us = Us.slice(0,-8);
                m = 16;
            }
    }
    if (m==16) {
        $("#proc26").prop('disabled',false);
        console.log(Us);
        let setR = rewind(Us.replace("U,U,U,","u,"));
        setRot(setR);
        setTimeout("yellow2x2(34)",100);
        return true;
    }
    if (n==34) { // 終了時、４隅の色合わせ
        l=4; while ((l>0)&&!(Nc(1)*Nc(5)*Nc(18)==(Nc(7)*Nc(20)*(Nc(23)+2))))
                      { l--; uu(); Us += ",U"; }
        while (l++<4) ui();
        console.log(Us);
        setRot(Us.replace(",U,U,U",",u").replace(",U,U",",U2").split(",")); // 
        $("#proc32").prop('disabled',false);
        Rotates.push("*ゴール!!","*Fin");
        setTimeout("SolveNavi(35)",100);
    }
   return true;  //  ストッパー
}
