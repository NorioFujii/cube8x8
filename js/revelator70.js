/*
* ルービックキューブ2x2-8x8お告げナビゲーター・ロジックプログラム集
*
* Copyright (c) 2022-2025 Norio Fujii
* Licensed under the MIT License
*
*/
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
    return str;
}
function WhiteX(m=0,color=White,ck=false) {  // 白クロスを形成する
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("WhiteX("+m+","+color+")",NxPaus);
        return true;
    }
    return WhiteXI(m,color,ck);
}
function DedgeCheck(color) {
    var n=0,i;
    for (i in [53,49,47,51])
        if ((Nc([53,49,47,51][i])==color)&&(Nc([41,14,23,32][i])==Nc([44,17,26,35][i]))) n++;
    return n;
}
function WhiteXI(m,color,ck) {

    if (m>=8) {
        setTimeout("SolveNavi(8)",100);  // 9
        return true;
    }
    var n=m, l, i, Us2, Us = "*白色エッジを賢く下層へ"+NoRot.replace(" ",",");
// *0c3 F' R2 F2 L' U' F' B2 U' F D2 B2 D F R2 B F L U F2 R D2 U2 D F2 B D U2 R2 L2 U2 F2 B' 
 dropW:
    while (DedgeCheck(color)<4) {
        Us2 = "";   // kiir();         debugger;
        // 上向き白エッジを縦２連にして、１８０°縦回転する
        var Uedge = [2,4,8,6], Sedge = [38,11,20,29,38,11,20,29];
        for (i in Uedge) if (Nc(Uedge[i])==color) { i = Number(i);
            l=4;while ((l-->0)&&((Nc(Sedge[i+(3-l)])!=Nc(Sedge[i+(3-l)]+3)))) { ui(),Us += ",u"; } // 上層エッジをセンターに合わせる
            if (l>=0) {
                // 後で挿入：隣が横向き２連なら、それを先に下層へ
                Us2 = "," + ["B","L","F","R","B","L","F","R"][i+(3-l)] + "2";
                Us += ",*#0"+Uedge[i]+Sedge[i+(3-l)] + turnSftND(Us2);
                continue dropW;
             }
        }
        // 底面の完結していない白エッジを１８０°縦回転する
        var Dedge = [[44,53],[17,49],[26,47],[35,51]];
        for (i in Dedge)
            if (((Nc(Dedge[i][0])==color)||(Nc(Dedge[i][1])==color))&&
                (Nc(Dedge[i][0])!=(Nc(Dedge[i][0]-3)))) {
                l=4;while ((l-->0)&&((Nc(Uedge[i])==color)||(Nc(Sedge[i])==color))) { uu(),Us += ",U"; } // 上層エッジが白の間飛ばす
                if (l<0) break;
                var face=",*白色エッジを上層へ";
                 // 後で挿入：隣が横向き２連なら、それを先に下層へ
                 Us2 = "," + ["B","L","F","R"][i] + "2";
                 Us += face + ",*#"+Dedge[i][0]+Dedge[i][1] + turnSftND(Us2);
                continue dropW;
            } else n++;
        // 残りの上層上向き白エッジを１８０°縦回転する
        var Medge = [[13,42],[15,22],[24,31],[33,40]];
        for (i in Uedge)
            if (Nc(Uedge[i])==color) {
                 // 後で挿入：隣が横向き２連なら、それを先に下層へ
                Us2 = "," + ["B","L","F","R"][i] + ",u";
                if ((Nc(Medge[i][0])==color)||(Nc(Medge[i][1])==color))
                    Us2 = Us2.toLowerCase().slice(0,-1) + "U";
                Us2 += Us2.slice(0,2);
                Us += ",*#"+Medge[i][0]+Medge[i][1] + turnSftND(Us2);
                continue dropW;
             }
        // 上層横向き白エッジを隣の中段に下して２連とし、下層へ縦回転し、元の面を戻す
        for (i in [38,11,20,29])
            if (Nc([38,11,20,29][i])==color) {
                 // 後で挿入：隣が横向き２連なら、それを先に下層へ
                if (Nc([14,23,32,41][i])==Nc(Uedge[i]))      Us2 = "," + ["B,l,b","L,f,l","F,r,f","R,b,r"][i];
                else if (Nc([32,41,14,23][i])==Nc(Uedge[i])) Us2 = "," + ["b,R,B","l,B,L","f,L,F","r,F,R"][i];
                if (Us2=="") {  // 上層をずらして挑戦
                    Us += ",U"; uu();
                    continue dropW;
                }
                Us += ",*横向きのエッジを　　　中段経由で下層へ,*#"+[38,11,20,29][i] + turnSftND(Us2);
                continue dropW;
             }
        // 中間層の横２連を縦にし、単独白エッジは上層に戻し、これらの操作で犠牲の隣面を90度戻す。
        var Hedge = [[13,41],[15,22],[22,14],[24,31],[31,23],[33,40],[40,32],[42,13]];
        for (i in Hedge) {
            if ((Nc(Hedge[i][0])==color)&&(Nc(Hedge[i][1])==Nc(Hedge[i][1]+1)))  // 横２連
                Us2 = "," + ["B","f","L","r","F","b","R","l"][i];
            else if (Nc(Hedge[i][0])==color) {
                Us2 = "," + ["b","F","l","R","f","B","r","L"][i] + ",U,";
                Us2 += String.fromCharCode(Us2.charCodeAt(1)^0x20);
            }
            if (Us2!="") {
                Us += ",*中段の"+((Us2.length>3)?"単身を上層へ":"２連を下層へ")+",*#"+Hedge[i][0]+Hedge[i][1] + turnSftND(Us2);
                continue dropW;
            }
        }
    }
    if (ck) return Us;
    console.log(Us," nextN=",n);
    setRot(rewind(Us.replace(/U,U,U,/g,"u,").replace(/U,u,/g,"").replace(/u,u,u,/g,"U,")));
    setTimeout("WhiteXI("+8+","+color+")",100);
}
let usw=0;
function ikinari_edge(m=0) { // 上層のエッジをF2Lで横に降ろす。
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("ikinari_edge("+m+")",NxPaus);
        return true;
    }
    var n=m&7, Us2 = "", Us="", dbl = "", rl="";
    save5x5();  // 現状の盤面保存
    if (Us=="") { // if (n<4) 全エッジパーツは黄色を含まず、正面色と側面の色が合う面から始める
        Us = slotin();
        if (Us=="") { 
            var l = 4;
            while ((l-->0)&&!((Nc(38)!=Yellow)&&(Nc(2)==Nc(23)))) { uu();  Us2 += ",U"; }
            if (l>=0) { // 左右両検査のため、0を含む
                if (n!=1) Us = slotin();
                if (Us=="") {
                    var face=",*お告げ・F2L準備"+" 　　　<span style='color:"+['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#C0C0C0'][Nc(23)-2]+
                             "; font-weight:300;'>"+"　　橙緑赤青黄白白".charAt(Nc(23))+"面</span>で";
                    if (Nc(14)==Nc(38)) rl="L",Us = face+"左エッジ"+Us2+WTchkL() ;
                    else                rl="R",Us = face+"右エッジ"+Us2+WTchkR() ;
                }
                if (false) { // V7.0
                    if (Nc(14)==Nc(38)) rl="L",Us = face+"左エッジ"+Us2+(WTchk(n,7,19,12)?",f":"")+",*#023814,l,u,L" ;
                    else                rl="R",Us = face+"右エッジ"+Us2+(WTchk(n,9,21,28)?",F":"")+",*#023832,R,U,r" ;
                    dbl = Us.slice(-16,-15);
                    if ((dbl=="F")||(dbl=="f")) { Us += (dbl=="F")?"2,u,f,R":"2,U,F,l"; } 
                    else  // V7.1 エッジセット後、その下に置くコーナーピースが上４コーナーにあればTurn優先
                        dbl = "slot";
                }
            } else if (edgeCheck(Yellow,2)==4) {
                       [Us2,n] = nextY( n, 4 );    // 終了で残りY回転数を返す
            } else { n++ ;
                     Us = Us2.replace(/\,U/g,"")+",Y";
                     if ((Nc(1)==White)&&((turnN-turnN3)>120)) 
                         if      ((Nc(10)*Nc(39)+Nc(10)+Nc(39))==(Nc(23)*Nc(32)+Nc(23)+Nc(32))) Us += ",U";
                         else if ((Nc(10)*Nc(39)+Nc(10)+Nc(39))==(Nc(23)*Nc(14)+Nc(23)+Nc(14))) Us += ",U";
            }  // 正面の切り替え 実回転をする  ４回続くようであれば一度で済ませたい
            if (Us=="") Us = Us2;
        }
        console.log(Us);
        if ((Us!="")&&(edgeCheck(Yellow)<4)) {
            Pause = true;
            rest5x5();     // 盤面復活
            setRot(Us.replace(/U,U,U,/g,"u,").replace(/U,U,/g,"U2,").split(",")); 
            Pause = false;
            if ((rl!="")||(dbl=="slot"))
                             setTimeout("it_slotin('"+rl+"')",100);
            else             setTimeout("ikinari_edge("+1+")",100);
            return true;
        }
    }
    Pause = true;
    rest5x5();     // 盤面復活
    if ((++usw&1)==0) Us += ",u";
        console.log(Us);
    setRot(("*お告げが続く"+Us).split(","));
    Pause = false;
    setTimeout("otuge_corner()",100);
}
function it_slotin(rl) { 
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("it_slotin('"+rl+"')",NxPaus);
        return true;
    }
  　const sideL = Array.of(1,10,39,3,37,30,9,28,21,7,19,12); // top,White,l/r
  　const sideR = Array.of(3,30,37,1,39,10,7,12,19,9,21,28);
    var color = (rl=="L")?Nc(14):Nc(32);
    var Us = "*ITスロットイン,";
    for (var i=0;i<4;i++) {
        if (rl=="L") {
            if ((Nc(sideL[i*3])==Nc(23))&&(Nc(sideL[i*3+1])==White)&&(Nc(sideL[i*3+2])==color)) break;
            if ((Nc(sideL[i*3])==White)&&(Nc(sideL[i*3+1])==Nc(23))&&(Nc(sideL[i*3+2])==color)) break;
        }
        if (rl=="R") {
            if ((Nc(sideR[i*3])==Nc(23))&&(Nc(sideR[i*3+1])==White)&&(Nc(sideR[i*3+2])==color)) break;
            if ((Nc(sideR[i*3])==White)&&(Nc(sideR[i*3+1])==Nc(23))&&(Nc(sideR[i*3+2])==color)) break;
        }
    }
    if (i<4) {
        const it_rotR = Array.of ("","U,","U2,","u,");
        const it_rotL = Array.of ("","u,","u2,","U,");

        if (rl=="R") {
            Us += it_rotR[i] ;
            if (Nc(sideR[i*3])!=White) Us += "R,u,r,U2,R,u,r";
        } else if (rl=="L") {
            Us += it_rotL[i] ;
            if (Nc(sideL[i*3])!=White) Us += "l,U,L,u2,l,U,L";
        }
        console.log(Us);
        $("#proc16").prop('disabled',false);
        setRot(Us.split(","));
    }
    setTimeout("ikinari_edge()",100);
}
function WTchkR() { // 右エッジ移動時に、事前に左側の前後を上げられるか検査。
//                              ITにならないときは、白が沈むのを避けるか検査
    var c1=Nc(9),c2=Nc(21),c3=Nc(28), Us=",*#023832",
        target=White*Nc(23)*Nc(32)+White+Nc(23)+Nc(32);

    if      ((Nc(16)*Nc(45)*Nc(52)+Nc(16)+Nc(45)+Nc(52))==target) Us += ",R,L,U,r,u,l";
    else if ((Nc(25)*Nc(18)*Nc(46)+Nc(25)+Nc(18)+Nc(46))==target) Us += ",R,l,U,r,u,L";
    if (Us.length==9) {
        Us += ",R,U,r";if (opt.sayu.value=="L") return Us;
        original = (Nc(2)*Nc(38)+Nc(2)+Nc(38)) ;
        if (((c1==White)||(c3==White))&&
            (((turnN-turnN3)>100) ||
             (c1==White)&&((c2*c3+c2+c3)==original) ||
             (c3==White)&&((c2*c1+c2+c1)!=original)))  Us = ",F" + Us + "2,u,f,R"; 
    }
    return Us;
}
function WTchkL() { // 左エッジ移動時に、事前に右側の前後を上げられるか検査。
//                              ITにならないときは、白が沈むのを避けるか検査
    var c1=Nc(7),c2=Nc(19),c3=Nc(12), Us=",*#023814",
        target=White*Nc(23)*Nc(14)+White+Nc(23)+Nc(14);

    if      ((Nc(36)*Nc(43)*Nc(54)+Nc(36)+Nc(43)+Nc(54))==target) Us += ",l,r,u,L,U,R";
    else if ((Nc(27)*Nc(34)*Nc(48)+Nc(27)+Nc(34)+Nc(48))==target) Us += ",l,R,u,L,U,r";
    if (Us.length==9) {
        Us += ",l,u,L";if (opt.sayu.value=="L") return Us;
        original = (Nc(2)*Nc(38)+Nc(2)+Nc(38)) ;
        if (((c1==White)||(c3==White))&&
            (((turnN-turnN3)>100) ||
             (c1==White)&&((c2*c3+c2+c3)==original) ||
             (c3==White)&&((c2*c1+c2+c1)!=original)))  Us = ",f" + Us + "2,U,F,l";
    }
    return Us;
}
function WTchk(n,f1,f2,f3) { // コーナー白を含むか
    var c1=Nc(f1),c2=Nc(f2),c3=Nc(f3); // c12=Nc(f1*4/(f1-6));

    return (((c1==White)||(c3==White))&&(((turnN-turnN3)>100) ||
            (c1==White)&&((c2*c3+c2+c3)==(Nc(2)*Nc(38)+Nc(2)+Nc(38))))) ||
            (c3==White)&&((c2*c1+c2+c1)!=(Nc(2)*Nc(38)+Nc(2)+Nc(38))) ;
}
function BoCW(f1,f2) { // 上層コーナーに白含み
    return (Nc(f1)==White) || (Nc(f2)==White) ; //  || (Nc(f2+2)==White) ;

}
function slotin(n=-1) {
    const rote2R = Array.of("r,F,R,f","f,L,F,l","l,B,L,b","b,R,B,r") ;
    const rote2L = Array.of("L,f,l,F","B,l,b,L","R,b,r,B","F,r,f,R") ;
    var Us = "", l;
//  debugger;   // Nc(2)がNc(23)と同じ色になるまで、Y,u を実施すべし。
    function itpairH() {
        var Us = "", n;
        if ((Nc(30)==White)&&(Nc(3)==Nc(2))&&(Nc(37)==Nc(38))) {
            $("#proc16").prop('disabled',false);
            for (n=0;n<4;n++) if (Nc(2)==Nc([23,14,41,32][n]))  break; 
            Us += ",*横2連発見,*#300203," + "U,U,U,U,".slice(-2*n-2) + rote2R[n] ;
        } else if ((Nc(10)==White)&&(Nc(1)==Nc(2))&&(Nc(39)==Nc(38))) {
            $("#proc16").prop('disabled',false);
            for (n=0;n<4;n++) if (Nc(2)==Nc([23,14,41,32][n]))  break; 
            Us += ",*横2連発見,*#100102," + "U,U,U,u,".slice(-2*n-2) + rote2L[n] ;
        }
        return Us.replace(/U,u,/g,"").replace(/U,U,/g,"U2,").replace(/U2,U,/g,"u,");
    }
    Us = itpairH(); if (Us!="") return Us;
    if (Nc(9)==White) {
          if ((Nc(21)==Nc(24))&&(Nc(31)==Nc(28))) Us += ",*ねじりセクシーで2連準備,*#0921282431,f,U2,F";
          else if ((Nc(21)==Nc(31))&&(Nc(24)==Nc(28))) {
              $("#proc16").prop('disabled',false);
              Us += ",*セクシームーブ３回で　右スロットイン,*#0921282431,R,U,r,u,R,U,r,u,R,U"+((Nc(31)==Nc(32))?",r":",U2,r");
         } else if ((Nc(21)*Nc(28)+Nc(21)+Nc(28))==(Nc(33)*Nc(40)+Nc(33)+Nc(40))) { Us += ",u,Y"; }
      }
    if (Us!="") return Us.replace(/U,U2,/g,"u,").replace(/U,U,/g,"U2,");
    l=4; while ((l-->0)&&!(((Nc(10)==White)&&(Nc(1)==Nc(23)))||((Nc(30)==White)&&(Nc(3)==Nc(23))))) { uu();  Us += ",U"; }
    if (l>=0) {
        var us = itpairH(); if (us!="") { while (++l<4) ui(); return Us+us; }
        var face=",*お告げ・四隅　<span style='color:"+['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#C0C0C0'][Nc(23)-2]+
             "; font-weight:300;'>"+"　　橙緑赤青黄白白".charAt(Nc(23))+"面</span>から";
        if ((Nc(30)==White)&&(Nc(37)==Nc(32)))
               if ((Nc(32)==Nc(24))&&(Nc(31)==Nc(23))) Us += face+"右ITイン,*#300337,R,U,r2,u,f,U,f2,R,f"; // IT-IN
               else Us += face+"右スロットイン,*#300337,R,u,r,U,r,F,R," + (BoCW(25,18)?"u,":"") + "f"; // 沈み判定
        if ((Us=="")&&(Nc(10)==White)&&(Nc(14)==Nc(39)))
               if ((Nc(39)==Nc(22))&&(Nc(15)==Nc(23))) Us += face+"左ITイン,*#100139,l,u,L2,U,F,u,f2,l,F"; // IT-IN
               else Us += face+"左スロットイン,*#100139,l,U,L,u,L,f,l," + (BoCW(27,34)?"U,":"") + "F"; // 沈み判定
    } else Us = "";
    if (n>-1) while (++l<4) ui();
    return Us.replace(/U,u,/g,"").replace(/U,U,/g,"U2,");
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
      if (Us=="") {
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
          if (Us.indexOf("2連")>0) setTimeout("otuge_corner()",100);
          else                     setTimeout("ikinari_edge(11)",100);
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
            if (l>=0) Us +=  ",*ねじりセクシーで2連準備,*#0921282431,f,U2,F";
            else {
                l = 4; Us = Us.replace(/\,u\,Y/g,""); 
                while ((l-->0)&&!((Nc(21)==Nc(31))&&(Nc(24)==Nc(28)))) { ui(),fd(); Us += ",u,Y"; }
                if (l>=0) {
                    Us += ",*セクシームーブ３回で　右スロットイン,*#0921282431,R,U,r,u,R,U,r,u,R,U"+((Nc(31)==Nc(32))?",r":",U2,r");
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
            $("#proc16").prop('disabled',false);
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
