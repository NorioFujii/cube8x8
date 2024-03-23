/*
* ルービックキューブ2x2-8x8お告げナビゲーター
*
* Copyright (c) 2022-2024 Norio Fujii
* Licensed under the MIT License
*
*/
var ExchgCnt = 0, ShiftRing=false, EGpost;
function colorEg(post) {
    EGpost = post;
    var idx = eg.indexOf(post)&0xfe;
    return Na(eg[idx])*Na(eg[idx+1])+Na(eg[idx])+Na(eg[idx+1]);
}
function colorEg2(p1,p2) {
    return Na(p1)*Na(p2)+Na(p1)+Na(p2);
}
const move23=new Array( // ３７を崩してはダメ *から始まる回転は、前を向く
              "* B2 R' U","B2 R' U","B' U2","* B' U2",
              "* B U2","B U2","R' U","* R' U",
              "* R U","R U","L' F' L","* L' F' L",
              "Pass","Pass","Pass","Pass",
              "* U2","* U2","B' R' U","B' R' U",
              "U","* U","* R B U2","R B U2",
              "* F R F' U", "F R F' U","None","*",
              "* L' B' L U2", "L' B' L U2","U'","* U'",
              "* B R' U", "* B R' U","B2 U2","* B2 U2",
              "R2 U","* R2 U","* R L' F' L","R L' F' L",
              "* L' F2 L","L' F2 L","* D' L' F L","D' L' F L",
              "L' F L","* L' F L","L2 U' L2","* L2 U' L2");
const move03=new Array( // 37,34を崩してはダメ *から始まる回転は、後ろを向く
              "* B'","* B'","* B2 R D B2","B2 R D B2",
              "* R D B2","* R D B2","B","* B",
              "F' U2 F","F' U2 F","R' D B2","* R' D B2",
              "Pass","Pass","Pass","Pass",
              "B' R D B2","B' R D B2","None","",
              "R B","R B","* R2 D B2","* R2 D B2",
              "* D' B2","* D' B2","* L B' L","L B' L'",
              "* F' U F","F' U F","* U2 R U2 B","U2 R U2 B",
              "B2","B2","D' R' B","D' R' B",
              "R' B","R' B","D B2","* D B2",
              "D R' B","D R' B","D2 B2","* D2 B2",
              "D' B2","D' B2","* D2 R' B","D2 R' B");
const dblEdgeF="*エッジペア交換 Mu' R U R' F R' F' R Mu";
const dblEdgeG="*エッジペア内側交換 Cu' R U R' F R' F' R Cu";
let ycount=0, B=1;
function Cc(f,y,x) { return CubeMap[f][y][x]; }
function Cc2(p1,p2) {
    var c1 = CubeMap[p1[0]][p1[1]][p1[2]];
    var c2 = CubeMap[p2[0]][p2[1]][p2[2]];
    return c1*c2+c1+c2;
}
function shelboth(color) {
    var n2 = N-2;
    for (var i=0;i<4;i++) if (CubeMap[2][[ 1, 1,  0,  0][i]][[0,N-1,1,n2][i]]!=
                              CubeMap[2][[n2,n2,N-1,N-1][i]][[0,N-1,1,n2][i]]) return false;
    return true;
}
function shelcntr(color) {
    var m = N>>1, cm = CubeMap[2][m][m]
    for (var i=0;i<4;i++) if (CubeMap[2][[0,m,m,N-1][i]][[m,0,N-1,m][i]]!=cm) return false;
    return true;
}
function egSecond(rote,d) {
    flushB(200,8,"#edgeEx");
    setRot(regRot((rote+[edgeTwist2,edgeTwist2,edgeTwist][d]).split(" ")));
}        
function edgeFYX(Ccolor,f=0) {
// 中央スロットからの±距離の論理にアクセスを書き換え、多ｘ多に対応している
// 4x4-7x7エッジ連結の正面操作:f  0:端ピース(右)、1:端ピース(左)、2:内側右、3:内側左、4:中央ピース(前)、5:中央ピース(後)
    var d = Over5;
    const pairRot=
                  ["mr","mr",["mr","cr"][d],["mr","cr"][d],["mr","rc","cr"][d]][N-4]+  ",*エッジペア結成・1,"+
                 (["*$14153435","*$22245254","*$32357477",["*$4448@0@4","*$4547@1@3"][d],["*$5863C0C5","*$5962C1C4","*$6061C2C3"][d]][N-4])+",U,l,u,"+
                  ["Mr","Mr",["Mr","Cr"][d],["Mr","Cr"][d],["Mr","Rc","Cr"][d]][N-4]+",*,*エッジペア結成・2,"+
                 (["*$14153435","*$22245254","*$32357477",["*$4448@0@4","*$4547@1@3"][d],["*$5863C0C5","*$5962C1C4","*$6061C2C3"][d]][N-4])+",U"; // 

    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("edgeFYX("+Ccolor+','+f+")",NxPaus+((f==12)?500:0));
        return true;
    }
    var stp = parseInt(document.getElementById('stop').value);
    if (stp>40){
        if (turnN<stp) {
                NoRot = " *0c";
        } else if (turnN>=stp) {
                NoRot = "";
                pause();
        }
    }
    var n = N
// エッジ左右寄せ：各面の処理をY,X面回転で進める
//  正面で左スロットに対し次を行う
//    (2,1,0)のエッジグループが両端揃っていれば、”Y”へ
//　　揃わなければ(2,1,0)の色を探し(0,N-1,N-2)にMove回転で持ってくる（２色反転を避ける）
//  　Move回転の結果、(0,N-1,1)に来た色を探して(0,0,N-2)に持ってくる（２色反転を避ける）
//      (0,N-1,1)のエッジグループが両端揃っていれば、”Y”へ
//　　　Moveで(0,N-1,1)に持ってきたキューブの色が(2,N-2,0)キューブの色であれば、
//    　　 U',R'で(2,1,0)の対面に置き、F面で次のエッジクロス交換を使う。
//     　　 Mu',R,U,R'F,R',F',R,Mu
//  　(0,0,N-2)に寄せたら、Mr',U,L',U',Mr,U　で穴開き２ペアを２セット作りストックする
    var rote,res=0;
    console.log("f:%d",f);
    if ((f<3)&&(Cc(2,1+d,0)==Cc(2,N-2-d,0))&&(Cc(1,1+d,N-1)==Cc(1,N-2-d,N-1))) f = 3;     // f=1,2の達成済
//    else if  (shelcntr(Ccolor))  f = 6;

    if (f==1) { // 22の色が 56や66にある
        if ((Cc2([2,0,1+d],[0,N-1,1+d])==Cc2([2,1+d,0],[1,1+d,N-1]))||
            (Cc2([2,0,1+d],[0,N-1,1+d])==Cc2([2,N-2-d,0],[1,N-2-d,N-1]))) {    // 左右エッジ交換
             rote = ("*$")+cubeAdrs(CubeNo(2,0,1+d))+cubeAdrs(CubeNo(0,N-1,1+d))+
                           cubeAdrs(CubeNo(2,1+d,0))+cubeAdrs(CubeNo(2,N-2-d,0))+
                           " U' R' "+ [dblEdgeF,dblEdgeG,dblEdgeG][d];
             setRot(regRot(rote.split(" ")));
             edgeFYX(Ccolor,0);
             return true;
        }
    } 
    if (f==2) {  // 両端寄せを１組完結して保護する。捻れなら、マヌーバーしておく。
        rote = pairRot;
        setRot(rote.trim().split(","));
        return edgeFYX(Ccolor,3);
    }
//  左スロット両端がすべて揃ったら、不揃いスロットを同様に処理する
//  終了したら、エッジ中央寄せに進む
    if (f==3) {
        var edgeLeft = edgeAll((d==0)?2:(N==8)?d+4:4);
        if ((N==8)&&(edgeAll(7)==-1)) {
            setOverNo(1);  // 再び１
            f = 4;
        } else if (edgeLeft==-1) { // 不揃い撲滅完了で中央揃えへ
            $("#proc44").prop('disabled',false); 
            if      (N==4) {
                    next44();
                    return false;
            } else if (N==5) {
                    $("#comment").html("エッジの中央寄せに移行します");
                    f = 4;
            } else if (N==8) {
                   if (Over5<1) {
                       $("#comment").html("エッジペア探索を内側に移行します");
                       setOverNo(1); // 内側両端の揃えへ
                       f = 0;
                   } else if ((Over5==1)&&(edgeAll(5)==-1)) {
                       setOverNo(2); // 最内側両端の揃えへ
                       f = 0;
                   }
            } else if (N>5) {
                if (Over5<1) {
                    $("#comment").html("エッジペア探索を内側に移行します");
                    setOverNo(1); // 内側両端の揃えへ
                    f = 0;
                } else if (edgeAll(4)==-1) {
                    $("#comment").html("エッジの中央寄せに移行します");
                    setOverNo(1);
                    f = 4;
                } else f = 0;
            }
        } else { // 両端不揃いを(0,N-1,N-2)へ、その後fで、(2,1,0)へ
            var ret=egMoveX(edgeLeft,0,[0,N-1,N-2-d],[2,0,N-2-d]);
            if (ret==-1) Rotates.push("Y");  // 同一スロット
            else setRot(["f","*$"+cubeAdrs(CubeNo(1,1+d,N-1))+cubeAdrs(CubeNo(2,1+d,0))]);
            f = 0;
        }
        edgeFYX(Ccolor,f);
        return false;
    }
    if (f>3) { // 中央寄せに移行しているので中継する
         return edgeMidX(Ccolor,f);
    }
// f=0,1
    res = 0;
    setRot([NoRot.replace(" ",",")]);
    if        (f==0) {
        res = egMoveX([2,1+d,0],[1,1+d,N-1],[0,N-1,N-2-d],[2,0,N-2-d]);
    } else if (f==1) {
        res = egMoveX([2,0,1+d],[0,N-1,1+d],[0,0,N-2-d],[4,0,1+d]); 
    }
    if (res<0) { // 既に配置
        Rotates.push("*既に配置されている");
        if (res==-1) {   // 左右エッジ交換
　　　　　　if (f==0) edgeFYX(Ccolor,3);
            else  {
                rote = ("*$")+cubeAdrs(CubeNo(2,1+d,0))+cubeAdrs(CubeNo(1,1+d,N-1))+
                   cubeAdrs(CubeNo(2,N-2-d,0))+cubeAdrs(CubeNo(1,N-2-d,N-1))+
                    " F "+ [dblEdgeF,dblEdgeG,dblEdgeG][d];  // N=8では、Over5が反映される
                setRot(regRot(rote.split(" ")));
                edgeFYX(Ccolor,0);
            }
            return true;
        }
    } else if ((res==0)&&(Na(CubeNo(2,0,N>>1))!=Na(CubeNo(2,0,(N>>1)-1)))) {
        Rotates.push("f");
        f = -1;
    }
    edgeFYX(Ccolor,f+1);
    return true;
}
let sTwo=0; // 発見探索方向：順・逆
function egMoveX(p1,p2,p3,p4) { // p2=0の時、eg[p1]をp3へ移動する
    // それ以外はp1,p2の色組と同じキューブを探して、p3,p4へ移動する
    var pOne = (typeof(p1)=='object')?CubeNo(p1[0],p1[1],p1[2]): eg[p1];
    var pTwo=-1,sTwo=-1,mTwo,rTwo,d=Over5,i,cmnt="",lr=(p3[1]>0)?0:(N<6)?2:((N<8)?4:6),nn=N*N,
        c1=(typeof(p1)=='object')?Cc2(p1,p2): colorEg2(eg[p1],eg[p1+1]);
    if (Cc2(p3,p4)==c1) return -2; // 既に鎮座

    // p3[1]に示すのが右探しか左探し
    function srchFwd() {
        pTwo=-1; for (i=d*2;i<eg.length-1;i+=(N<6)?4:((N<8)?8:12)) {
            if ((eg[i]==pOne)||(eg[i]==CubeNo(p2[0],p2[1],p2[2]))) continue;
            if (c1!=colorEg2(eg[i],eg[i+1])) continue;
                pTwo = i; sTwo=1; break;
        }
        return pTwo;
    }
    function srchBwd() {
        pTwo=-1; for (i=eg.length-2-d*2;i>=4;i-=(N<6)?4:((N<8)?8:12)) {
            if ((eg[i]==pOne)||(eg[i]==CubeNo(p2[0],p2[1],p2[2]))) continue;
            if (c1!=colorEg2(eg[i],eg[i+1])) continue;
                pTwo = i; sTwo=-1; break;
        }
        return pTwo;
    }
    if (p2==0) pTwo = p1;
    else if (lr==0) { if (srchBwd()<0) srchFwd(); }
         else         if (srchFwd()<0) srchBwd();
    if (pTwo<0) console.log('Pair edge is not found',pOne,pTwo,p3,p4);
    else {
        mTwo = (N<6)?pTwo:((N<8)?pTwo >> 1:Math.floor(pTwo/3));
        if (lr==0) rTwo = move23[mTwo];
        else       rTwo = move03[mTwo];
        console.log('Pair edge ',pOne,pTwo,'pTwo='+eg[pTwo],c1,rTwo);
        if (rTwo=="Pass") pTwo = -1;
        else  { cmnt = "*エッジペア探索" + (d>0?"内側":"") +(lr==0?"・左":"・右") +
               " *$"+cubeAdrs(eg[pTwo]) +cubeAdrs(eg[pTwo+1]) +
               NoRot + " " + rTwo;
          if (opener && opener.document.getElementsByName('pythonQ')) {
              parent.ClipDT = cmnt.slice(18);
              opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = cmnt;
          }
          setRot(regRot(cmnt.split(" ")));
        }
    }
    return pTwo;
}
// エッジ中央寄せ：各面の処理を不揃い発見で進める
//  正面で左スロットに対し次を行う。中央からdで３個、５個、７個と広がる
//    ５６のエッジグループが３個揃っていれば、中央含めた不揃いを５６スロットへ
//    不揃いがなくなれば、d=2の処理後、次段階の疑似３ｘ３処理に進む
//　　５６の色を探し２３にMove回転で持ってくる（その後２色反転が必要なら実施）
//  　Move回転の結果、反転後の２２に来た色を探して３に持ってきて、２色反転を検査する
//      3に来る候補が61スロットにあるとか、両側とも３個が候補と同じ色なら、他もあたる(knotMoveX)
//      61スロットにしかなければ、F,U2,F',Mc',U,L',U,Mc,U　を実施 、
//  　　それ以外で3に寄せたら、Mc',U,L',U',Mc,U　で３または５ペアを２セット作り
//      ストックする。Mcはd=2の時はMtとし、３輪または５輪同時に動かす
//      ２２のエッジグループが３個揃っていれば、”Y”へ
//  3ペアが揃わないエッジグループが２セットだけになったら、上下両端において
//  ルーブルフールを実施し
//     揃って(edgeAll)しまえば、d=2の処理後、次段階の疑似３ｘ３処理に進む
//　 　ルーブルフール＋３個逆順＋ルーブルフール、で両端の２セットが揃う
//  揃わないエッジグループが一つだけなってしまったら、または、下辺だけ揃っていれば
//  上面前で次の横スロット内1反転（マヌーバ）を実施する。
//  　"r2 B2 U2 l U2 r' U2 r U2 F2 r F2 l' B2 r2"、rlはd=1では Cr Clとする
//     右２奥２☆、左下☆右下☆右上☆、前２右上,前２左上、奥２右２（左右はW輪,☆は上２）
// 
const maneuver="*OLLパリティ補正 r2 B2 U2 l U2 r' U2 r U2 F2 r F2 l' B2 r2";   // 最外環
const maneuver2="*OLLパリティ内側補正 Cr2 B2 U2 Cl U2 Cr' U2 Cr U2 F2 Cr F2 Cl' B2 Cr2";  // 内環
const cntrrevs2="*中央前２個反転 L' F R' D' F2 L";  // 内環
const edgeTwist="*エッジ対面交換 l2 U2 F2 l2 F2 U2 l2"; 
const edgeTwist2="*エッジ内側対面交換 Cl'2 U2 F2 Cl'2 F2 U2 Cl'2"; 
function mono() {  // cntrrevs2が使えないときmaneuver2
    var onetwo = 0;
    if (Cc2([2,0,(N>>1)-Over5],[0,N-1,(N>>1)-Over5])==Cc2([2,0,(N-1)>>1],[0,N-1,(N-1)>>1]))
        onetwo = 1;
    return [cntrrevs2,maneuver2][onetwo];
}
function edgeMidX(Ccolor,f) {
    var d = Over5, left=(N==8)?3-d:(d>1)?1:((N>>1)-1), left2=left, cntr=(N>>1)-((N==8)?1:0), righ=(N==8)?4+d:((d>1)? N-2:(N>>1)+1);
    const pairRot=NoRot.replace(" ",",")+","+(((N==8)&&(d>1))?"m4":((N%2>0)&&(d<2))?"mc":"mt")+",*エッジ左右ペア結成・1,"+["*$222324525354","","*$454647@1@2@3",""][N-5]+ ",U,l,u,"+
                                             (((N==8)&&(d>1))?"M4":((N%2>0)&&(d<2))?"Mc":"Mt")+",*エッジ左右ペア結成・2,"+["*$222324525354","","*$454647@1@2@3",""][N-5]+",U"; //  ;
// f=4,5　新戦略：投機的マヌーバー→戦略的マヌーバー
// 56に来たスロット（の中央部分）が他のスロットへ嵌る形であればf=5へ
// 自分自身へのはめ込みが必要であれば（捻れ）、22に保留しておき、次の 
// 不揃いスロットの処理を04経由で56に持ってくる。
// 22と56に来た新規のスロットが自分自身へはめ込みで続けば、２組を縦にした
// Pパリティ補正で次につなぐ。
// これは56が通常通りで22に前半分を持ってこない限り、22に留まっている
// 最終的に22に１組だけ残ったら、マヌーバーで解決
// egMoveXモード
// ・56無双24経由
// ・56無双04経由
// knotMove2モード
// ・23ヘテロ
// ・03ヘテロ
  console.log("f:%d in MidX",f);
    $("#parity").prop('disabled',true);
    if ((f==4)||(f==5)||(f==8)) {
        var rote, mix, res = -10;
        var edgeLeft = edgeAll(((N%2>0)&&(N<7))?5:(N==8)?4:(4+d),true);
        if ((N==8)&&(d>1)&&(edgeLeft==-1)) edgeLeft = edgeAll(8,true);
        if ((N>4)&&(Over5<3)&&(edgeLeft==-1)&&((N==5)||(edgeAll(N-2,true)==-1))) { 
            // すべてのエッジスロットが２～５個連結
            edgeFYX(Ccolor,7);
            return false;
        }
        if (((f==8)||(f==4))&&Cc2([2,left,0],[1,left,N-1])==Cc2([2,cntr,0],[1,cntr,N-1])) { 
            // 結成１の中央キューブが５６組にあるので向き検査
        　　if ((Cc(2,left,0)==Cc(2,cntr,0))&&(Cc(2,left,0)==Cc(2,righ,0)) &&
                ((N<8)||((Cc(2,left+1,0)==Cc(2,cntr,0))&&(Cc(2,left+1,0)==Cc(2,righ,0)))) &&
                (Cc(1,left,N-1)==Cc(1,cntr,N-1))&&(Cc(1,left,N-1)==Cc(1,righ,N-1))) { // スロット向き一致
               if ((edgeLeft>=0)&&(++ycount>3)) { // 他に不揃いがある
                   ycount = 0;
                   // 不揃いを56へ持ってくる
                   Rotates.push("*不揃いを移動 ","*$"+cubeAdrs(eg[edgeLeft]));   
                   egMoveX(edgeLeft,0,[2,1,0],[1,1,N-1]); // 不揃いを24経由で５６へ
                   Rotates.push("f");
                   f = 4;
               } // else  Rotates.push("Y");
            } else { // 自スロットで捻じれ発生、 f=8の時は連続発生
                var edgeL2 = edgeAll((N>5)?((N<8)?3:4):6), edgeL3 = (edgeL2==-1)?-1:edgeAll((N>5)?((N<8)?3:4):6,edgeL2);
                   // 不揃いは、５６組の他１個だけか調べる
                if ((edgeL2==-1)&&(edgeL3==-1)&& // 他のエッジスロットが全部３個連結なのでマヌーバー検査
                    (Cc(2,left,0)==Cc(1,cntr,N-1))&&(Cc(2,cntr,0)==Cc(1,left,N-1))) { 
                    console.log("Monolithic slot merge. 56");
 　　　　　         $("#parity").prop('disabled',false);
                    rote = "*#2215 F "+[mono(),mono(),maneuver][d];
                    setRot(regRot(rote.split(" ")));
                    f = 7;
                } else if (f==8) {
                    console.log("Hetello slots merge. 56");
                    rote = "*#2215 F "+[edgeTwist2,edgeTwist2,edgeTwist][d];
                    setRot(regRot(rote.split(" ")));
                    f = 7;
                } else {
                    edgeLeft = edgeAll(((N%2>0)&&(N<7))?5:(N==8)?4:(4+d),true);
                    if ((edgeLeft>=0)&&(++ycount>3)) {
                       // 56を24へ移動し、不揃いを56へ持ってくる
                       ycount = 0;
                       Pause = true;
                       Rotates.push("F","*不揃いを移動 ","*$"+cubeAdrs(eg[edgeLeft]));   
                       ff(); egMoveX(edgeLeft,0,[0,0,N-2],[4,0,N-2]); // 不揃いを04経由で５６へ
                       Rotates.push("u","L","U");
                       fi(); Pause = false;
                       f = 8;  // New 8
                    } else  { // 56以外も不揃いありなので、fして13で２個判定
                        // 13では、除外指定でedgeAll、結果がお互いを示すなら、正面縦置きでエッジ上下交換
                       Rotates.push("f"); // if (edgeL2==(N>5)?24:12)
                       f =13; // マヌーバー２個チェック
                    }
                }
            }
            edgeFYX(Ccolor,f);
            return true;
        } else if ((f==5)&&(Cc2([0,N-1,left2],[2,0,left2])==Cc2([2,cntr,0],[1,cntr,N-1]))) { // 結成２の中央キューブが５６組にあるので再構築
 　           $("#parity").prop('disabled',false);
              if (Cc(2,left,0)==Cc(0,N-1,righ))
                    egSecond("*群エッジＷ解決 *$"+cubeAdrs(CubeNo(2,N-1,cntr))+cubeAdrs(CubeNo(2,N-1,N>>1))+cubeAdrs(CubeNo(2,N-1,cntr+1))+" L' F2 U' ",d);
              else  egSecond("*群エッジ再構築 *$"+cubeAdrs(CubeNo(2,(N>>1)-1,0))+cubeAdrs(CubeNo(2,cntr,0))+cubeAdrs(CubeNo(2,(N>>1)+1,0))+" U' R B U2 ",d);
              f = 4;
        } else if ((f==8)||(f==4)) {
              res = knotMoveX([2,left,0],[1,left,N-1],[0,N-1,cntr],[2,0,cntr],Cc(1,left,N-1)); // 結成１へ準備
              f = 4;
        } else if (f==5) {
              if (Cc(2,0,cntr)==Cc(2,left,0)) { // 反転？
                  setRot(regRot("L' F R' D' F2 L".split(" ")));  // 上・前反転
                  edgeFYX(Ccolor,5);
                  return true;
              } else {
                  res = knotMoveX([2,0,left],[0,N-1,left],[0,0,cntr],[4,0,cntr],Cc(2,0,left));   // 結成２へ準備
              }
        }  console.log(res);
        if ((res>=0) || (res==-2)) {
                if (f!=8) f++; if (res<0) console.log("*既に配置されている "+turnN);
        } else if (res==-3) {
                mix = edgeAll(((d>2)?6:((d==2)?5:((N==8)?5:3))),((N<6)?12:((N<8)?24:36)));
                if ((mix==-1)||(mix==((N<6)?12:((N<8)?24:36)))) { // ５６しかない
                    setRot(("F,U2,f,"+(((N==8)&&(d>1))?"m4":((N%2>0)&&(d<2))?"mc":"mt")+",U,l,U,"+
                                      (((N==8)&&(d>1))?"M4":((N%2>0)&&(d<2))?"Mc":"Mt")+",U").split(","));
                    f = 4;  //  反転判断なし
                }
                if (mix==-1) console.log('No matching for over colors slot');
        } else if (res==-4) {
                console.log("*別スロット検査 "+turnN);
                var edgeLeft = edgeAll((N<6)?5:(d==2)?5:((N==8)?5:3));
                if (edgeLeft<0) {         f = 4;
                    $("#parity").prop('disabled',false);
                    setRot(regRot(("*捩り戻し2 *#2215 F "+[mono(),mono(),maneuver][d]).split(" ")));
                } else Rotates.push("F"), f = 7;
        } else if (res==-1) {
                console.log("*マヌーバー検査 "+turnN);
　              f = 7; // ７へ
        }
        edgeFYX(Ccolor,f);
        return true;
    } 
    if (f==6) { // 中央寄せ２個(結成1,2)終了できるので保護する、５６と再検証
        if (Cc(4,0,N>>1)==Cc(2,0,left)) { // 反転？
            setRot(regRot("B' R D B2".split(" ")));  // 上・後反転
        } else {
            rote = pairRot;
            Rotates = Rotates.concat(rote.trim().split(","));
            f = 7;
        }
        edgeFYX(Ccolor,f);
        return true;
    }
    if (f==7) {  // return false;
//  左スロットがすべて揃ったか検査し、不揃いスロットを同様に処理する
//  終了したら、疑似３ｘ３処理に進む
//  不揃いが２個だけの時は、縦に持ってきてTwistする
        var edgeLeft = edgeAll(((N%2>0)&&(N<7))?5:(N==8)?4:(4+d),true);
        if ((N==8)&&(d>1)&&(edgeLeft==-1)) edgeLeft = edgeAll(8,true);
        if ((edgeLeft==-1)&&(Over5==((N<6)?0:((N<8)?2:2)))) { // エッジゴール検査へ
            edgeFYX(Ccolor,20);
            return false;
        }
        if ((N>5)&&(Over5<2)&&((edgeLeft==-1)&&(edgeAll(N-2,true)==-1))) { 
            // すべてのエッジスロットが２～５個連結
            edgeFYX(Ccolor,12);
            return false;
        } 
        if ((Cc(2,left,0)==Cc(2,N>>1,0))&&(Cc(2,left,0)==Cc(2,righ,0))) {
            if ((edgeLeft>=0)&&(++ycount>3)) {
                // 不揃いを56へ持ってくる
                ycount = 0;
                Rotates.push("*不揃いを移動 ","*$"+cubeAdrs(eg[edgeLeft]));   
                egMoveX(edgeLeft,0,[2,1,0],[1,1,N-1]); // 不揃いを22経由で５６へ
                Rotates.push("f");
            } else {
               check33();
               if($("#solve3").prop('disabled')==false) {
                   edgeFYX(Ccolor,20);
                   return false;
               } else  Rotates.push("Y");
            }
        }
        edgeFYX(Ccolor,4);
        return false;
    }
    if (f==12) { // 次は内輪または中間パーツ
        edgeLeft = edgeAll(((N<6)?4:((N<8)?3:4))+d);
        f = 4;
        if (((edgeLeft==-1)&&(edgeAll(5)==-1))&&(edgeAll(4)==-1)) { // ２～３個連結はOKなのでOver5を2にして、エッジの中央と両端による５個揃え
             Rotates.push("*"+((N%2==0)?"４":"５")+"連揃えへ移行");
             setOverNo(2);
             normalPos();
        }
        edgeFYX(Ccolor,f);
        return false;
    }
    if (f==13) { // 56と02でマヌーバー２個なら、正面の上下に配置し両端入れ替えをする
        var edgeL2 = edgeAll((N>5)?((N<8)?3:4):6,true), edgeL3 = edgeAll((N>5)?((N<8)?3:4):6,edgeL2);  // 不揃いは、５６組の他１個だけか調べる
        console.log('f13:edgeL2=%d,edgeL3=%d',edgeL2,edgeL3);
        if (edgeL2==((N>5)?((N<8)?48:72):24)) {
            edgeFYX(Ccolor,14);
            return false;
        }
        if (edgeL2>=0) {  // 群エッジ再構築より、マヌーバーしてしまった方が早い
            if (edgeL2==((N>5)?((N<8)?24:36):12)) setRot("l,u".split(","));
            else if (edgeL3==((N>5)?((N<8)?24:36):12)) setRot(["F"]);
            else egMoveX(edgeL2,0,[0,N-1,righ],[2,0,righ]); // 不揃いを22へ
            edgeFYX(Ccolor,14);
            return false;
        }
        if ((edgeL2!=-1)&&(edgeL2!=((N>5)?((N<8)?24:36):12))&&(edgeL3!=((N>5)?((N<8)?24:36):12))) {
            Rotates.push("*不揃いを移動 ","*$"+cubeAdrs(eg[edgeL2]));   
            egMoveX(edgeL2,0,[0,N-1,N>>1],[2,0,N>>1]); // 不揃いを22経由で５６へ
        }
        edgeFYX(Ccolor,4);
        return false;
    }
    if (f==14) { // 56に新しい不ぞろいを移動
        if ((Cc(0,N-1,left)==Cc(2,0,N>>1))&&(Cc(2,0,left)==Cc(0,N-1,N>>1))&& 
            (Cc(2,N-1,left)==Cc(5,0,N>>1))&&(Cc(2,N-1,N>>1)==Cc(5,0,left))) { 
                Rotates.push("*$"+cubeAdrs(CubeNo(2,0,left))+cubeAdrs(CubeNo(0,N-1,N>>1))+
　　　　　　　　　　　　　　　　　cubeAdrs(CubeNo(2,N-1,left))+cubeAdrs(CubeNo(5,0,N>>1)));   
                setRot(regRot(("*エッジ両端交換"+[edgeTwist2,edgeTwist2,edgeTwist][d]).split(" ")));
        } else {
           for (var x=2;x<N-1;x++) if (CubeMap[2][N-1][x]!=CubeMap[2][N-1][1]) break;
           if ((edgeAll((N>5)?((N<8)?3:5):6,((N>5)?((N<8)?48:72):24))==-1)||(x<N-1)) {
                console.log("Monolithic slot merge. 22");
 　　　　　　　 $("#parity").prop('disabled',false);
                rote = "*#2215 "+  // cubeAdrs(CubeNo(2,left,0))+cubeAdrs(CubeNo(2,N>>1,0))+cubeAdrs(CubeNo(2,righ,0)) + " " +
                       [mono(),mono(),maneuver][d];
                Rotates = Rotates.concat(regRot(rote.split(" ")));
           }
        }
        Rotates.push("f");
        edgeFYX(Ccolor,7);
        return false;
    }
    if (f==20) { // 中央寄せ終了
        normalPos();
        $("#comment").html("エッジ中央寄せ完了！");
        check33();
        if($("#solve3").prop('disabled')==false) {
             if ($("#miniCube").css('display')!="none") {
                 var flip = miniCube.FaceF;
                 mini3x3(false);
                 Pause = true;
                 mini3x3();
                 setTimeout('miniCube.FaceF="'+flip+'";Pause=false;',1000);
              } 
            flushB(200); NaviIn(1);
        } else $("#comment").html("エッジ中央寄せ・未完了！");
        return false;
    }
    return true;
}
function knotMoveX(p1,p2,p3,p4,Fcolor=0) { // ３エッジパーツの中央を探して、不揃いp1色合わせの回転をする
    // エッジの左側のeg番号で４つ置きに進めて、右側のeg番号との中間のパーツの色を探す。
    // 見つかったら、前面なら右側、後面なら左側のeg番号の移動手順で回せばエッジ中央に呼び込める。
//      3に来る候補が61スロットにあるとか、両側とも３個が候補と同じ色なら、他も探す
    var pOne=CubeNo(p1[0],p1[1],p1[2]),c1=Cc2(p1,p2),pTwo=-1,mTwo,rTwo,i,cmnt,ret,d=Over5,left = (d>1)?d-1:(N>>1)-1,
        lr=(p3[1]>0)?0:(N<6)?2:((N<8)?4:6);  // Over5が0なら中央の左右、１なら左右両端の間に３個入れる。
    if ((Cc2(p3,p4)==c1)&&(Cc(p1[0],p1[1],p1[2])==Cc(p3[0],p3[1],p3[2]))) return -2; // 既に鎮座
    for (i=0;i<eg.length-3;i+=(N<6)?4:((N<8)?8:12)) {
        if ((eg[i]==pOne)||(eg[i+1]==pOne)) continue;
        // １回のループで、中間パーツ探し
        // 前後面・上面交換用のターン記号列が付加される。
        ret = centrEdge(i); // 各辺の中央の色組をret[0]にもらう
        if (c1!=ret[0]) continue;  // キューブの色の種類が違う
        if (N%2==1) {
            if ((Na(eg[i+left])==Na(ret[1]))&&(Na(eg[i+left+1])==Na(ret[2]))) continue; // 揃いすぎ
            if ((N>5)&&(edgeAll(5)==-1)&&((ret[1]==pOne+1)||(ret[2]==pOne+1)||
                (Na(eg[(N<6)?24:((N<8)?48:72)])==Na(eg[(N<6)?12:((N<8)?24:36)]+N+1))))  return -3;       // 同一スロット
        }
            console.log('Center edge ',p1,pOne,ret[1],ret[2]);
        pTwo = i; mTwo = (N<6)?pTwo:((N<8)?pTwo>>1:Math.floor(pTwo/3)) ;  // iは見つかったキューブの左側
        if (lr==0) rTwo = move23[mTwo];
        else       rTwo = move03[mTwo];
        if (!((rTwo.slice(0,1)=="*")&&(Fcolor==Na(ret[1]))) || 
             ((rTwo.slice(0,1)!="*")&&(Fcolor==Na(ret[2])))) {  // 予測反転  1571turns → 1295
            if (lr>0) {
                if (rTwo.slice(-1)=="B") rTwo = rTwo.slice(0,-1)+"R D B2 *反転実施";
                if (rTwo.slice(-6)=="R D B2") rTwo = "B *反転実施";
                if (rTwo.slice(-2)=="B2") rTwo = rTwo.slice(0,-2)+"D' R' B *反転実施";
            } else { // ("L' F R' D' F2 L");  // 上・前反転
                if (rTwo.slice(-1)=="U") rTwo = rTwo.slice(0,-1)+"R B R' U2 *反転実施";
                if (rTwo.slice(-2)=="U2") rTwo = rTwo.slice(0,-1)+" R B R' U2 *反転実施";
            }
            rTwo = rTwo.replace(/R2 R/g,"R'").replace(/ R' R/g,"");
        }
        console.log('Pair edge ',pOne,pTwo,'pTwo='+eg[pTwo],c1,rTwo);
        if (rTwo.slice(0,2)=="* ") rTwo = rTwo.slice(2);
        if (rTwo=="Pass") {
            pTwo = -4;
            continue;
        }
        break;
    }
    if (pTwo<0) console.log('Pair in same slot',pOne,pTwo,p3,p4);
    else {
        cmnt = "*エッジ"+[(N===8)?"中央２個":"中央１個","ペア中央","中央左右","中央５個"][d] + ((lr<1)?"・前":"・後") +
               " *$"+cubeAdrs(pOne)+cubeAdrs(CubeNo(p3[0],p3[1],p3[2]))+cubeAdrs(ret[1]) + NoRot+" "+rTwo;
        if (opener && opener.document.getElementsByName('pythonQ')) {
            parent.ClipDT = cmnt.slice(18);
            opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = cmnt;
        }
        console.log(cmnt);
        setRot(regRot(cmnt.split(" ")));
    }
    return pTwo;
}
function centrEdge(i) {
    var p1, p2 ;
    if (N%2==0) { p1=eg[i+(N>>1)]; p2=eg[i+1+(N>>1)]; }
    else {
        p1 = (eg[i]+eg[i+((N<6)?2:((N<8)?6:10))])/2;
        p2 = (eg[i+1]+eg[i+((N<6)?3:((N<8)?7:11))])/2;
    }
    return [Na(p1)*Na(p2)+Na(p1)+Na(p2),p1,p2];
}
function edgeAll(n,ex=null) { // エッジ両端+中央の完了チェック(除:56エッジグループ+1）
    var i,ret,d=Over5,mm,mn;
    for (i=0;i<eg.length-3;i+=(N<6)?4:((N<8)?8:12)) {
        if ((ex==null)&&(i==((N<6)?12:((N<8)?24:36)))||(i==ex)) continue;
        if (Na(eg[i])  !=Na(eg[i+((N<6)?2:(N<8)?6:10)])) break;
        if (Na(eg[i+1])!=Na(eg[i+((N<6)?3:(N<8)?7:11)])) break;
        mm=(N==6)?(eg[i+2]):(N==8)?(eg[i+8]):((eg[i]+eg[i+((N<6)?2:6)])/2);
        mn=(N==6)?(eg[i+3]):(N==8)?(eg[i+9]):((eg[i+1]+eg[i+((N<6)?3:7)])/2);
        if (n==3) {
            if (Na(eg[i+4-d*2])!=Na(mm)) break;
            if (Na(eg[i+5-d*2])!=Na(mn)) break;
        } else if (n==4) {
            if (Na(eg[i+2])!=Na(eg[i+4])) break;
            if (Na(eg[i+3])!=Na(eg[i+5])) break;
        } else if (n==5) {
            if (Na(eg[i+2])!=Na(mm)) break;
            if (Na(eg[i+3])!=Na(mn)) break;
        } else if ((N==8)&&(n==6)) {
            if (Na(eg[i+4])!=Na(eg[i+8])) break;
            if (Na(eg[i+5])!=Na(eg[i+9])) break;
        } else if ((N==8)&&(n==7)) {
            if (Na(eg[i+4])!=Na(eg[i+6])) break;
            if (Na(eg[i+5])!=Na(eg[i+7])) break;
        } else if ((n==6)||(n==7)||(n==8)) {
            if (Na(eg[i  ])!=Na(eg[i+2])) break;
            if (Na(eg[i+1])!=Na(eg[i+3])) break;
        }
    }
    if (i>eg.length-3) return -1;
    return i;
}
function save5x5(s=0) { // 盤面保存
    if (window.localStorage) {
	var json = JSON.stringify(CubeMap);
	localStorage.setItem('rubic_5x5', json);
    }
    else console.log("No local storage!") ;
}
function rest5x5(s=0) { // 盤面復活
    if (window.localStorage) {
	var json = localStorage.getItem('rubic_5x5');
        if (json)  CubeMap = JSON.parse(json);
	else  {
            $("#comment").html("Nothing pattern saved.");
            return;
        }
    }
    else console.log("No local storage!") ;
}
////////////////////////////////////////////////////////
//  中央コアの整列
// const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6;
function cent6faces(Ccolor=0) {
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("cent6faces("+Ccolor+")",NxPaus);
        return true;
    }
    var color=Ccolor,color=(color>15)?color-16:color,
        color4=color==0?White:color;
    if  (Ccolor>16) {
        // turn()後やN==4/6/8のrotationの継続
        var ncolor = centr(color4);
        if (ncolor) {
            if (N%2==0) setTimeout("cent6faces("+Ccolor+");",100);
            else   setTimeout("cent6faces("+(ncolor+16)+");",100);
            return;
        }
    }
    $("#proc40").prop('disabled',false);
    if      (color==0)      ShiftRing = false, centN("",White);
    else if (color==1)    { ShiftRing = false; setOverNo(2); centN("",White); } // 
    else if (color==White)  centN("X2",Yellow);
    else if (color==Yellow) centN("z",Red); 
    else if (color==Red)    centN("X",Blue);
    else if (color==Blue)   centN("X2",Green);
    else if (color==Green)  centN("x",Orange);
    else if (color==Orange) {
　　    if (N>5)
　　　　if (Over5<2) { // Over5を進める       
            Rotates.push("z");
            setTimeout("cent6faces(1);",1000);
            return;
        }
        if ((N==8)&&(Over5>1)) {
            Rotates.push("z");
　　　　　　for (var fx=0;fx<6;fx++) if (centNEQ(N,fx)) { 
                setOverNo(3);
                setTimeout("cent6faces("+(White+16)+");",1000);
                return;
           }
        }            
        $("#comment").html("中央寄せ完了！");
        ShiftRing = false;
        setOverNo(0);
        Center = true;
        Rotates.push("z");
        console.log('%cCenter moves:%d',"color:green",(turnN-1));
        cent6faces(10);
    }
    else next44();
}
let NoRot = "";
function centN(rot,color) { 
    // 各面へのターン用のHTMLの書き込みが早すぎないように。
    var t=(rot!="")?NxPaus+500:500;
    if (rot!="") setRot([rot]);
    else turn("");
    setTimeout("cent6faces("+(color+16)+");",t*2);
}
function centr(color) {
    var stp = parseInt(document.getElementById('stop').value);
    if (stp>40){
        if (turnN<stp) {
                NoRot = " *0c";
        } else if (turnN>=stp) {
                NoRot = "";
                pause();
        }
    }
    if  ((N%2==0)&&(Over5<2)) return centr4(color);
    else                      return centr9(color);
}
// 5x5,7x7における中央９パーツを固めて、３ｘ３のセンターキューブとみなす
// 最初の白の面・赤の面でプレ処理をする
// 　側面の縦２～３個存在する列を、上面の０～１個の列に上げる
// ６色面に実行する（反映面を上面としcolorを引数としてcentr9が呼ばれた）
//　　回転中なら、trueで一旦戻る
//　　Yで４面廻す
//　　　Fで4回廻す
//　　　　・F面の67にcolorが来れば、
//　　　　　お迎え前に、反映面の7,17に色アリを優先で置き
//　　　　　お迎えを" l' U l"で実施する
//　　　　・F面の69にcolorが来れば、
//　　　　　お迎え前に、反映面の9,19に色アリを優先で置き
//　　　　　お迎えを" r U' r'"で実施する
//　　　・D面の142にcolorが来れば、
//　　　  反映面の7,17に色アリを優先で置き
//　　　　お迎えを" l'2 U l2"で実施し、7,17の輪も戻る(底面のcolorが増える)
//　　　・D面の144にcolorが来れば、
//　　　  反映面の9,19に色アリを優先で置き
//　　　　お迎えを" r2 U' r'2"で実施し、9,19の輪も戻る(底面のcolorが増える)
//　　Yで４面廻す
//　　　Fで4回廻す
//　　　　・F面の62にcolorが来れば、
//　　　　　反映面の12に別色を置き
//　　　　　お迎えを" l' U' Mc U l' U' Mc'"で実施し、12の輪も戻る
//　　　　・F面の64にcolorが来れば、
//　　　　　反映面の14に別色を置き
//　　　　　お迎えを" r U Mc U' r' U Mc'"で実施し、14の輪も戻る
//　　　・D面の137にcolorが来れば、
//　　　  反映面の12に別色を置き
//　　　　お迎えを" l'2 U' Mc U l'2 U' Mc'"で実施し、12の輪も戻る
//　　　・D面の139にcolorが来れば、
//　　　  反映面の14に別色を置き
//　　　　お迎えを" r2 U Mc U' r'2 U Mc'"で実施し、14の輪も戻る
//　　１面全終了なら、falseで戻る　
let RetCode, NB, blk95, blk57;
function centr9(color,n=N) {  // 全キューブのCenter扱い

    NB = (n+1)*(n>>1);  // 12,24,40
    blk95 = new Array(      7,     8,     9,12,  14,  17,    18,    19,         57,         58,         59,
           62,    64,      67,      68,      69,         132,         133,         134,    137,    139,      142,      143,      144);
    blk57 = new Array(   NB-n,NB-n+1,NB-n+2,NB,NB+2,NB+n,NB+n+1,NB+n+2,NB*4+n*5-16,NB*4+n*5-15,NB*4+n*5-14,
       NB*5+2,NB*5+4,NB*5+n+2,NB*5+n+3,NB*5+n+4,NB*10+n*5-13,NB*10+n*5-12,NB*10+n*5-11,NB*11+5,NB*11+7,NB*11+n+5,NB*11+n+6,NB*11+n+7);
    const faceMSG ="<span style='color:" +
             ['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#808080'][color-2] +
             "; font-weight:300;'>"+((color==8)?"□":"■")+"</span>"+"橙緑赤青黄白白".charAt(color-2)+"面)";
    const sizeS = "*中央"+["","3x3",["4x4","5x5"][N%2==0?0:1],["6x6","7x7"][N==8?0:1]] [Over5];

    if ((n>4)&&!centNEQ(n,0)) {  // (n-2)コアが揃っている
        $("#comment").html(sizeS.slice(1) + "<br> 完了！(" + faceMSG);
　　    return false;
    }
    var i,j,dx,u,y,fx,rot="",d=Over5-((N==8)?1:(N==5)?-1:0),left=(d^3),righ=N-1-(d^3),m=n>>1,mn=m-Over5; // rotの回転記号は、大文字/小文字系で指定
    var cmnt = sizeS +"寄せ(" + faceMSG;
    var ret1,ret2,ret3;
    save5x5();  // 現状の盤面保存
    preRot = cmnt + NoRot.replace(" ",",");
    RetCode = false;
// 最初の白黄色の面でプレ処理をする
// 　側面の縦２～３個存在する列を、上面の０～１個の列に上げる
    var cf = (Cc(0,d^3,d^3)==color?1:0)+(Cc(0,righ,d^3)==color?1:0)+(Cc(0,d^3,righ)==color?1:0)+(Cc(0,righ,righ)==color?1:0);
    if ((N<8)&&(cf<4)&&((color==White)||(color==Red)||(color==Yellow))) // 四つ角用「く」の字促成  
        for (y=0;y<4;y++) {
            for (fx=0;fx<4;fx++) {
                var cf = (Cc(2,d^3,d^3)==color?1:0)+(Cc(2,righ,d^3)==color?1:0)+(Cc(2,d^3,righ)==color?1:0);
                for (k=3,j=-1,i=0;i<4;i++) {
                    dx  = (Cc(0,d^3,d^3)==color?1:0)+(Cc(0,righ,d^3)==color?1:0)+(Cc(0,righ,righ)==color?1:0);
                    if (dx<k) { k=dx; j=i; }
                    uu();
                }
                if (k>cf) {
                    while (j-->0) uu(),rot += ",U";
                    if (color==Yellow) rot += ",U2,"+((d==1)?"lc,u2,Cl":"ml,u2,Ml"),u2(),MoveVert(0,1,mn),u2(),moveVert(0,1,mn);
                    else               rot += ((d==1)?",lc":",ml"), MoveVert(0,1,mn);
                }
            }
        }
    rot = rot.replace(/,lc,lc,lc,lc/g,'').replace(/,ml,ml,ml,ml/g,'')+","+cmnt+"<br>内側四つ角設置";
// センター９キューブや１６キューブの四つ角  端っこ直突き・角っこ付かず離れず
    for (y=0;y<8;y++) { 
        var cf = (Cc(0,d^3,d^3)==color?1:0)+(Cc(0,righ,d^3)==color?1:0)+(Cc(0,d^3,righ)==color?1:0)+(Cc(0,righ,righ)==color?1:0);
        for (fx=0;fx<8;fx++) {
            if (cf==4) break;
            if (d==2) { // 外枠に進行
                if (Cc(2,d^3,d^3)==color)  rot += moveOneX(color,0,"071757,ml,U,Ml");
                if (Cc(2,d^3,righ)==color) rot += moveOneX(color,0,"091959,Mr,u,mr");
            } else if (d<2) {
                if (Cc(2,d^3,d^3)==color)  rot += moveOneX(color,0,"071757,lc,U,Lc");
                if (Cc(2,d^3,righ)==color) rot += moveOneX(color,0,"091959,Rc,u,rc");
            }
            ff(); rot += ",F";
        }
        for (dx=0;dx<8;dx++) {
            if (cf==4) break;
            if (d==2) { // 外枠に進行
                if (Cc(5,d^3,d^3)==color)  rot += moveOneX(color,0,"0717C2,ml2,U,Ml2");
                if (Cc(5,d^3,righ)==color) rot += moveOneX(color,0,"0919C4,Mr2,u,mr2");
            } else if (d<2) {
                if (Cc(5,d^3,d^3)==color)  rot += moveOneX(color,0,"0717C2,lc2,U,Lc2");
                if (Cc(5,d^3,righ)==color) rot += moveOneX(color,0,"0919C4,Rc2,u,rc2");
            }
            dd(); rot += ",D";
        }
        fd(); rot += ",Y";
    }  
// センター９キューブの十字四つ（底面）
    rot += ","+cmnt+"<br>内側エッジ挟み込み";
    if ((N%2>0)&&(N<8)) for (dx=0;dx<8;dx++) {
        if (!centNEQ(N,0)) break;
        ret1 = "";  ret2 = "";
        if ((N>5)&&(d==1)) {
           if (Cc(5,m,left)==color) ret1 = moveOneX(color,0,"1212C7,lc2,u,Mc,U,Lc2,u,mc");
           if (Cc(5,m,righ)==color) ret2 = moveOneX(color,0,"1414C9,Rc2,u,Mc,U,rc2,u,mc");
            ret3 = ret1+ret2; if (ret3=="") { dd(); rot += ",D";  }
                              else rot += ret3;
        } else if (d==2) {
           if (Cc(5,m,1)==color)    ret1 = moveOneX(color,0,"1212C7,ml2,u,Mc,U,Ml2,u,mc");
           if (Cc(5,m,righ)==color) ret2 = moveOneX(color,0,"1414C9,Mr2,u,Mc,U,mr2,u,mc");
            ret3 = ret1+ret2; if (ret3=="") { dd(); rot += ",D";  }
                              else rot += ret3;
            if (N>5) {
                  ret1 = "";  ret2 = "";
                  if (Cc(5,m-1,1)==color)    ret1 = moveOneX(color,-N,"1212C7,ml2,u,cl,U,Ml2,u,Cl");
                  if (Cc(5,m-1,righ)==color) ret2 = moveOneX(color,-N,"1414C9,Mr2,u,cl,U,mr2,u,Cl");
                  ret3 = ret1+ret2; if (ret3=="") { dd(); rot += ",D";  }
                                    else rot += ret3;
                  ret1 = "";  ret2 = "";
                  if (Cc(5,m+1,1)==color)    ret1 = moveOneX(color,+N,"1212C7,ml2,u,Cr,U,Ml2,u,cr");
                  if (Cc(5,m+1,righ)==color) ret2 = moveOneX(color,+N,"1414C9,Mr2,u,Cr,U,mr2,u,cr");
                  ret3 = ret1+ret2; if (ret3=="") { dd(); rot += ",D";  }
                                    else rot += ret3;
            }
       }
    }
// センター９キューブの十字四つと１６キューブの外枠エッジ
//    rot += edgeFix(0,color); 
    if ((N%2>0)&&(N<8)) for (y=0;y<4;y++) { // センター９キューブの十字四つと１６キューブの外枠エッジ
         for (fx=0;fx<8;fx++) {
             if (!centNEQ(N,0)) break;
             ret1 = "";  ret2 = "";
             if ((N>5)&&(d==1)) {
                if (Cc(2,m,left)==color) ret1 = moveOneX(color,0,"121262,lc,u,Mc,U,Lc,u,mc");
                if (Cc(2,m,righ)==color) ret2 = moveOneX(color,0,"141464,Rc,u,Mc,U,rc,u,mc");
                 ret3 = ret1+ret2; if (ret3=="") { ff(); rot += ",F";  }
                                   else rot += ret3;
             } else if (d==2) {
                if (Cc(2,m,1)==color)    ret1 = moveOneX(color,0,"121262,ml,u,Mc,U,Ml,u,mc");
                if (Cc(2,m,righ)==color) ret2 = moveOneX(color,0,"141464,Mr,u,Mc,U,mr,u,mc");
                 ret3 = ret1+ret2; if (ret3=="") { ff(); rot += ",F";  }
                                   else rot += ret3;
                 if (N>5) {
                     ret1 = "";  ret2 = "";
                     if (Cc(2,m-1,1)==color)    ret1 = moveOneX(color,-N,"121262,ml,u,cl,U,Ml,u,Cl");
                     if (Cc(2,m-1,righ)==color) ret2 = moveOneX(color,-N,"141464,Mr,u,cl,U,mr,u,Cl");
                     ret3 = ret1+ret2; if (ret3=="") { ff(); rot += ",F"; }
                                       else rot += ret3;
                     ret1 = "";  ret2 = "";
                     if (Cc(2,m+1,1)==color)    ret1 = moveOneX(color,+N,"121262,ml,u,Cr,U,Ml,u,cr");
                     if (Cc(2,m+1,righ)==color) ret2 = moveOneX(color,+N,"141464,Mr,u,Cr,U,mr,u,cr");
                     ret3 = ret1+ret2; if (ret3=="") { ff(); rot += ",F";  }
                                       else rot += ret3;
                  }
             }
             // 　正面のエッジ群4か所にcolorが無くなったら、側面を順送りに正面にする
        }
        fd(); rot += ",Y";
    }
    if ((N==6)||(N==8)) for (y=0;y<8*d;y++) { // センター９キューブの十字四つと１６キューブの外枠パーツ
        if (d>1) { // 外枠に進行　上のMc処理のついでに±Nも処理した残り
             NoColor = (y>8)? true: false;
             // 複数のF面とD面で候補が重なるとき、お互いの色同士の交換の方を優先
             for (fx=0;fx<8;fx++) {  // 12
                 ret3=false; u=4;while ((u-->0)&&(!(vslotSP(color,2,2,4)))) { ff(); rot += ",F"; }
                 if (u<0) { rot = rot.slice(0,-8); break; }
                 ret3 = vslotSP(color,2,2,N-2); ret1="";
//              console.log('Fret3:%d',ret3);
                 if ((ret3)&&(!isNaN(ret3))) {
                     if (ret3%2==0) ret1 = moveOneX(color,ret3,"001262,ml,u,cl,U,Ml,u,Cl");
                     else           ret1 = moveOneX(color,ret3,"001464,Mr,u,cl,U,mr,u,Cl");
                     if (ret1!="") rot += ret1;
                     ff(); rot += ",F"; 
                 } else     { ff(); rot += ",F";  }
             }
             for (dx=0;dx<8;dx++) {
                 ret3=false; u=4;while ((u-->0)&&(!(vslotSP(color,5,2,4)))) { dd(); rot += ",D";  }
                 if (u<0) { rot = rot.slice(0,-8); break; }
                 ret3 = vslotSP(color,5,2,N-2); ret1="";
//              console.log('Dret3:%d',ret3);
                 if ((ret3)&&(!isNaN(ret3))) {
                     if (ret3%2==0) ret1 += moveOneX(color,ret3,"0012C7,ml2,u,cl,U,Ml2,u,Cl");
                     else           ret1 += moveOneX(color,ret3,"0014C9,Mr2,u,cl,U,mr2,u,Cl");
                     if (ret1!="") rot += ret1;
                     dd(); rot += ",D";
                 }
             }
          // 　F面のパーツ群4か所にcolorが無くなったら、F面を回転する
          // 　D面のパーツ群4か所にcolorが無くなったら、D面を回転する
        } else if (d<2) {
             for (fx=0;fx<8;fx++) {
                 ret1=""; ret2="";
                 if (Cc(2,m-1,2)==color)    ret1 = moveOneX(color,0,"121262,lc,u,cl,U,Lc,u,Cl");
                 if (Cc(2,m-1,righ)==color) ret2 = moveOneX(color,0,"141464,Rc,u,cl,U,rc,u,Cl");
                 ret3 = ret1+ret2; if (ret3=="") { ff(); rot += ",F";  }
                                   else rot += ret3;
             }
             for (fx=0;fx<8;fx++) {
                 ret1=""; ret2="";
                if (Cc(2,m,2)==color)    ret1 = moveOneX(color,+N,"121262,lc,u,Cr,U,Lc,u,cr");
                if (Cc(2,m,righ)==color) ret2 = moveOneX(color,+N,"141464,Rc,u,Cr,U,rc,u,cr");
                ret3 = ret1+ret2; if (ret3=="") { ff(); rot += ",F";  }
                                  else rot += ret3;
             }
             for (dx=0;dx<8;dx++) {
                 ret1=""; ret2="";
                if (Cc(5,m-1,2)==color)    ret1 = moveOneX(color,0,"1212C7,lc2,u,Cr,U,Lc2,u,cr");
                if (Cc(5,m-1,righ)==color) ret2 = moveOneX(color,0,"1414C9,Rc2,u,Cr,U,rc2,u,cr");
                ret3 = ret1+ret2; if (ret3=="") { dd(); rot += ",D";  }
                                  else rot += ret3;
             }
             for (dx=0;dx<8;dx++) {
                 ret1=""; ret2="";
                if (Cc(5,m,2)==color)    ret1 = moveOneX(color,+N,"1212C7,lc2,u,Cr,U,Lc2,u,cr");
                if (Cc(5,m,righ)==color) ret2 = moveOneX(color,+N,"1414C9,Rc2,u,Cr,U,rc2,u,cr");
                ret3 = ret1+ret2; if (ret3=="") { dd(); rot += ",D";  }
                                  else rot += ret3;
             }
        }
        if ((d>1)&&(!centNEQ(n,0))) {
            while (y%4>0) y++,fd(),rot += ",Y";
            break;
        }
        // 　正面のパーツ群4か所にcolorが無くなったら、側面を順送りに正面にする
        fd(); rot += ",Y";
    }        

    // 修復コード  これは不要かもしれない。当面、再試行モード。
    // const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6;
    if (centNEQ(N-4+d,0)) {
            console.log("中央外枠修復！"+"橙緑赤青黄白白".charAt(color-2));
            if (Over5>1) {
                normalPos(color);
                RetCode = color;
                if (d>2) setOverNo(2);
            }
    } else  RetCode = false;

    rot = rot.replace(/,U,U,U,U/g,"").replace(/,F,F,F,F/g,"").replace(/,F,F,F/g,",f").
              replace(/,D,D,D,D/g,"").replace(/,Y,Y,Y,Y/g,"");
    console.log(rot);
    if (opener && opener.document.getElementsByName('pythonQ')) {
        parent.ClipDT = rot;
        opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = preRot+rot;
    }
    if ((n>5)&&(centNEQ(n+d-3,0)))  // (n-2)コアが揃っていない
        console.log("%d枠の"+"橙緑赤青黄白白".charAt(color-2)+"が揃っていない",Over5+2+(N%2)*2);

    Pause = true;
    rest5x5();     // 盤面復活
    setRot((preRot+rot).split(","));   // kiirRotLayer(wholecube,99),kiir(); // 
    Pause = false;
    return RetCode;
}

function N5c(m)      { return Na((N==5)? m: (Over5<2)? blk57[blk95.indexOf(m)]: (N==7)?ch7C(m):ch6C(m)); }
function N6c(m)      { return Na((N==6)? m: ch8C(m)); }    //  Cc(f,y,x)に変更→ 8,14,26           80,83,86,98,101,188,191,206,209
function ch8C(m)     { return [10,15,50,55,138,143,178,183,330,335,370,335][[ 7,9,17,19,57,59,67,69,132,134,142,144].indexOf(m)]; } 
function ch7C(m)     { return [ 9,13,37,41,107,111,135,139,254,258,282,286][[ 7,9,17,19,57,59,67,69,132,134,142,144].indexOf(m)]; } 
function ch6C(m)     { return [ 8,11,26,29, 80, 83, 98,101,188,191,206,209][[ 7,9,17,19,57,59,67,69,132,134,142,144].indexOf(m)]; } 
function ch6E(m,w=0) { return [14,17, 9,27, 86, 89, 81, 99,194,197,189,207][[12,14,8,18,62,64,58,68,137,139,133,143].indexOf(m)]+w; } 
function ch7E(m,w=0) { return [23,27,11,39,121,125,109,137,268,272,256,284][[12,14,8,18,62,64,58,68,137,139,133,143].indexOf(m)]+w; } 
function ch8E(m,w=0) { return [26,31,20,44,155,158,148,172,347,350,340,364][[12,14,8,18,62,64,58,68,137,139,133,143].indexOf(m)]+w; } 
function Na5E(m,w=0) { return Na((N==5)? m: (Over5<2)? blk57[blk95.indexOf(m)]+w: (N==7)?ch7E(m,w):ch6E(m,w)); }
function Na6E(m,w=0) { return (N==6)?Na(m+w):Na(ch8E(m,w)); }
function Na7E(m,w=0) { return Na(ch7E(m,w)); }

function moveOneX(color,w,str) {  // for 5x5～8x8 all
// str="071757,ml,u,Ml"  57にcolorが来れば、07,17にcolorが現れるまでU回転(rot入れとuu()実行)し
// rotに点滅アドレスと添付回転記号列を追加し、回転記号列の複数の回転関数を実行する。
// 07,17が同じ番号の時は、color以外があるまでU回転する。
// wはエッジの縦複数処理で、±Nの時、58の上下を含めて、7,17の間３か所と３回Matchingする。
// 位置さえ合えば回転方法は同じなので、最終的に、w=0の時、すべてを実施
// P1が0なら、U面でのF面の色パーツを優先する
    var u=-1, l=10, m = N>>1, d = Over5-((N==8)?1:0); // N=8:1.2
    var p1=parseInt(str.slice(0,2)), p2=parseInt(str.slice(2,4)),p3,p4,ps1=p1,pt1,ps2=p2,p2h,tgtNh,
        tgt=((str.charAt(4)>"9")?-60:0)+ (str.charCodeAt(4)-48)*10 + str.charCodeAt(5)-48,tgtN=tgt;
    var addrot="", rots = [], rot="", addAdrs="";

    if (N>5) { // N=4,5は変換不要
        if ((p1==0)&&((N==6)||(N==8)&&(d==2))) {  // p1はflag、代わりにｗ
             tgtN = w;
             if      (N==8) p2 = w - ((tgt<100)?128:320); 
             else if (N==6) p2 = w - ((tgt<100)?72:180); 
        } else if ((N==8)&&(d<2)) {
            var p1yx = [+N+1,+N-1,+1,-1][[7,9,12,14].indexOf(ps1)],
                p2yx = [+1,-1,-N+1,-N-1][[12,14,17,19].indexOf(ps2)],     
                tgyx = [+N+1,+N-1,0,0,+N+1,+N-1, 0, 0][[57,59,62,64,132,134,137,139].indexOf(tgt)];
            (p1=ch8E(ps1))?p1: p1=ch8C(ps1); (p2=ch8E(ps2))?p2: p2=ch8C(ps2); 
             p1 += p1yx; p2 += p2yx;
             pt1 = [22,19,46,43][[7,9,12,14].indexOf(ps1)]; // p1の反対の内側
            (tgtN = ch8E(tgt))?tgtN: tgtN=ch8C(tgt);
             tgtN += tgyx;
        } else if (N==7) {
               if (d==1) tgtN = blk57[blk95.indexOf(tgt)];
               p1 = blk57[blk95.indexOf(ps1)];
               p2 = blk57[blk95.indexOf(ps2)]; 
        }
        if ((p1!=0)&&(p1==p2)) {
                (d==1)? (p2 = p1):
                        (p3 = (N==7)?ch7E(ps1,w):(N==8)?ch8E(ps1,w):ch6E(ps1,w), p4 = p3);
        } else if (d>1){ p3 = (N==7)?ch7C(ps1):(N==8)?ch8C(ps1):ch6C(ps1);
                         p4 = (N==7)?ch7C(ps2):(N==8)?ch8C(ps2):ch6C(ps2); }
        if ((p1!=0)&&(d>1)) { // 四つ角
             p1 = p3;    p2 = p4;
            tgtN = (N==7)?ch7E(tgt,w):(N==8)?ch8E(tgt,w):ch6E(tgt,w);
            if (!tgtN) tgtN = (N==7)?ch7C(tgt):(N==8)?ch8C(tgt):ch6C(tgt);
        }
    }
    if ((--l>0)) { // 跳ね上げた後も指定色がターゲットに現れる限り
        // 四つ角Targetが目的色でないとき、回転出直し、p1=0なら、w値が保証している
        var fatM=[],fatm=[];
        u = 4; addAdrs = ""; 
        if ((N%2>0)&&(p1==p2)) { // P1,P2に跳ね上げる
             console.log(l++,color,Na(tgtN),tgt,tgtN,rots,p1,p2);
             while ((u-->0)&&((Na(p2)==color))) { uu(),rot+=",U"; }
             if (u<0) rot = rot.slice(0,-8);
             else if ((w==0)&&(d>1)) {
             // d>1の時rots中３番目Mc,７番目mcの左右対象２段拡張
             // 左有:cl/Cl追加、右有:Cr/cr追加、fatMを使わないとき、依頼のまま(addrot)回転
                 for (var i=1-m;i<m;i++) { // ついでに隣も誘うなら、上面の空き具合チェック
                    if ((Na(tgtN+i*N)==color)&&(Na(p2+i*N)!=color)) {
                        addAdrs += cubeAdrs(p2+i*N)+cubeAdrs(tgtN+i*N);
                        fatM.push(["ml","cl","Mc","Cr","Mr"][i+m-1]);
                        fatm.push(["Ml","Cl","mc","cr","mr"][i+m-1]);
                    } 
                 }
             } else if (((w!=0)||(d<2))&&(Na(tgtN)==color)) {
                 addrot=str.slice(7);
                 rots = addrot.split(",");
                 addAdrs += cubeAdrs(tgtN)+cubeAdrs(p2);
             }
        } else if ((p1==0)||(p1==p2)) {  // Edge  P2にcolor以外が来るまでU回転（P1P2の色面優先）
             while ((u-->0)&&((Na(p2)==color)||(NoColor)&&(Na(p2)!=Na(N*N*2+(N-1)*(N>>1))))) uu(),rot+=",U";
             if (u<0) rot = rot.slice(0,-8);
             else if (d>1) {
                 if (N==8) {
                     tgtN = [130,322][(tgt<100)?0:1]+((ps2==12)?0:5);
                     p2 = tgtN - ((tgt<100)?128:320);
                 } else if (N==6) {
                     tgtN =  [74,182][(tgt<100)?0:1]+((ps2==12)?0:3);
                     p2 = tgtN - ((tgt<100)?72:180);
                 }
                 // ついでに隣も誘うなら、上面の空き具合チェック
                 for (var i=2;i<N-2;i++) { // ついでに隣も誘う
                    if ((Na(tgtN+i*N)==color)&&(Na(p2+i*N)!=color)) { 
//                    console.log('i,tgtN,p2:%d,%d,%d ',i,Na(tgtN+i*N),Na(p2+i*N));
                        addAdrs += cubeAdrs(p2+i*N)+cubeAdrs(tgtN+i*N);
                        fatM.push(["lc","cl","Cr","Rc"][i-((N==8)?2:1)]);
                        fatm.push(["Lc","Cl","cr","rc"][i-((N==8)?2:1)]);
                    } 
                 } 
             }
             else if (d<2) {
                 if (N==8) {
                     tgtN = [131,323][(tgt<100)?0:1]+((ps1==12)?0:3);
                     p2 = tgtN - ((tgt<100)?128:320);
                 }                 // ついでに隣も誘うなら、上面の空き具合チェック
                 if ((Na(tgtN+N*3)==color)&&(Na(p2+N*3)==color))  uu(),rot+=",U";
                 if ((Na(tgtN+N*3)==color)&&(Na(p2+N*3)!=color)) {
//                    console.log('p2+N*3,tgtN,p2:%d,%d,%d ',p2+N*3,Na(tgtN+N*3),Na(p2+N*3));
                        addAdrs += cubeAdrs(p2+N*3)+cubeAdrs(tgtN+N*3);
                        fatM.push(["ml","cl","Cr","Mr"][1]);
                        fatm.push(["Ml","Cl","cr","mr"][1]);
                 }
                 if (N==8) {
                     if ((Na(tgtN+N*4)==color)&&(Na(p2+N*4)==color))  uu(),rot+=",U";
                     if ((Na(tgtN+N*4)==color)&&(Na(p2+N*4)!=color)) {
//                        console.log('p2+N*4,tgtN,p2:%d,%d,%d ',p2+N*4,Na(tgtN+N*4),Na(p2+N*4));
                            addAdrs += cubeAdrs(p2+N*4)+cubeAdrs(tgtN+N*4);
                            fatM.push(["ml","cl","Cr","Mr"][2]);
                            fatm.push(["Ml","Cl","cr","mr"][2]);
                     }
                 }
             }
        } else if (Na(tgtN)==color) {      // 左右角に上げたあと、尖った先を突くように上げる
             addrot=str.slice(7);
             rots = addrot.split(","); addAdrs += cubeAdrs(tgtN)+cubeAdrs(p1)+cubeAdrs(p2);
             ps4 = [9,7][[7,9].indexOf(ps1)];
             if      ((N==7)&&(d==1))   { p4 = blk57[blk95.indexOf(ps4)]; }
             else if ((N%2==0)&&(d==1)) {(p4 =ch8E(ps4))?p4: p4=(N==8)?ch8C(ps4):ch6C(ps4); }
             else            { p4 = (N==5)?ps4:(N==7)?ch7C(ps4):(N==8)?ch8C(ps4):ch6C(ps4); }
             u = 4; while ((u-->0)&&((Na(p1)!=color)||(Na(p2)!=color))) { uu(),rot+=",U"; }
             if ((N==8)&&(d==1)) p4 = pt1;  // CenterのP１対面の一つ内側
             console.log('P4:%d',p4);
             if (u<0) {
                rot = rot.slice(0,-8);     // color２点無し時、左右逆側上有りが良い
                u=4; while ((u-->0)&&(Na(p4)!=color)) { uu(),rot+=",U"; }
             } else if (Na(ps4)!=color) { 
                if ([7,9].includes(ps1)) { // colorが２点でも、左右逆側上有りが良い
                    u=4; while ((u-->0)&&(Na(p4)!=color)) { uu(),rot+=",U"; } 
                }
             } 
             if (u<0) rot = rot.slice(0,-8);
        }
        if (fatM.length>0) {
            rots = str.slice(7).split(",");
            rots = [].concat(rots.slice(0,2),fatM,rots.slice(3,6),fatm);
            addrot = rots.toString(); 
        }
        for (var turn in rots) {
            var t = rots[turn];
            "U"==t&&(uu()), "u"==t&&(ui()),
            "Mc"==t&&(Mc()),"mc"==t&&(mc()),
            "Mr"==t&&(Mr()),"mr"==t&&(mr()),
            "Ml"==t&&(Ml()),"ml"==t&&(ml()),
            "Mr2"==t&&(Mr(),Mr()),"mr2"==t&&(mr(),mr()),
            "Lc2"==t&&(Lc(),Lc()),"lc2"==t&&(lc(),lc()),
            "Rc2"==t&&(Rc(),Rc()),"rc2"==t&&(rc(),rc()),
            "Cr"==t&&(Cr()),"cr"==t&&(cr()),
            "Cl"==t&&(Cl()),"cl"==t&&(cl()),
            "Rc"==t&&(Rc()),"rc"==t&&(rc()),
            "Lc"==t&&(Lc()),"lc"==t&&(lc()),
            "Ml2"==t&&(Ml(),Ml()),"ml2"==t&&(ml(),ml());
        }
        if (N>=5) { 
            if (addrot.length>0) rot += ",*$"+addAdrs+","+addrot;
        }   else     rot += ",*$" + str;
       console.log(rot);
    }
    return rot;
}
// センター構成スロット内の対象パーツの有無を検査
function vslotSP(color,f,s,p) { // 縦方向N側
    for (var y=s;y<p;y++) {
        if (CubeMap[f][y][s-1]==color) return CubeNo(f,y,s-1);
        if (CubeMap[f][y][N-s]==color) return CubeNo(f,y,N-s);
    }
    return false;
}
function hslotSP(color,f,s,p) { // 横方向N側
    for (var x=s;x<p;x++) {
        if (CubeMap[f][s-1][x]==color) return CubeNo(f,s-1,x);
        if (CubeMap[f][N-s][x]==color) return CubeNo(f,N-s,x);
    }
    return false;
}
let NoColor = false;

function centr4(Ccolor) {
// 偶数ｘ偶数キューブの中央4パーツを固めて、３ｘ３のセンターコアとみなす
    ShiftRing = false;
    var i,j,k,kk,save,NL=N/2-1,NR=N/2;
    var cmnt="*中央2x2寄せ(" + "<span style='color:" +
             ['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#808080'][Ccolor-2] +
             "; font-weight:300;'>"+((Ccolor==8)?"□":"■")+"</span>"+"橙緑赤青黄白白".charAt(Ccolor-2)+"面)";
    preRot = NoRot;
    if ((Rotates.length>0)||(Counter>0)) return;
    Rotates.push(cmnt);
        if ((Ccolor==White)||(Ccolor==Red)) {  // 白か赤で、TOP面ゼロなら
            var c1=Ccolor,kmax=0,ki=-1;
            for (k=0;k<6;k++) {  // iは右上から左回りに４個 NL=N/2-1,NR=N/2
                                 //[NL][NR],[NL][NL],[NR][NL],[NR][NR]
                for (i=0,kk=0,j=1;i<4;i++,j*=2)
                    kk += (CubeMap[k][[NL,NL,NR,NR][i]][[NR,NL,NL,NR][i]]==c1)?j-0:0;
                if ((k==0)&&(kk>0)) break;
                if (Pri[kk]>kmax) { kmax = Pri[kk]; ki = k; }
            }
            if (ki>0) { // その色が一番多い面
                Rotates.push(["*Lucky!","Z","X","z","x","X2"][ki]);
                return true;
            }
        }
        // UP面color１個ならa[10]に置き確保はU、２個ならa[7],a[11]に置き確保はU2
        // UP面color３個ならa[7],a[10],a[11]に置き確保はU
        
        for (i=0,kk=0,j=1;i<4;i++,j*=2)
            kk += (CubeMap[0][[NL,NL,NR,NR][i]][[NR,NL,NL,NR][i]]==Ccolor)?j-0:0;
        if      ((kk==3)||(kk==10)||(kk==11))  preRot += " U";
        else if ((kk==2)||(kk==12)||(kk==14))  preRot += " u";  // U' for 大文字
        else if ((kk==1)||(kk==6)||(kk==7))    preRot += " U2";
        else if (kk==15) { 
             $("#comment").html(cmnt.slice(1) + "<br>完了！");
             return false;
        }
        if (kk%3==0) save = " U2 ";  // ２個連れを期待する
        else         save = " U ";
        var res = cntr4Srch(Ccolor, save);
        if (!res) $("#comment").html(cmnt.slice(1) + "<br>完了！") ;
        return res;
}
const Pri=[0,3,2,9,1,5,7,13,4,10,6,14,8,12,11,15];
function cntr4Srch(c1,save) {  // 偶数ｘ偶数キューブ 小文字
    var i,j,k,kk,NL=N/2-1,NR=N/2,svt=save,rot,roth,rev,maxi=0,kmax=0,
        vrot=new Array(6);

    for (k=1;k<6;k++) {
        for (i=0,kk=0,j=1;i<4;i++,j*=2)
            kk += (CubeMap[k][[NL,NL,NR,NR][i]][[NR,NL,NL,NR][i]]==c1)?j-0:0;
        rot = " "+" LFRBD".charAt(k);
        if (((kk==4)||(kk==5)||(kk%3==0))&&(save==" U2 ")&&
            ((c1==White)||(c1==Red))) { // 一気に左上がり縦戻しなし
               if ((kk>3)&&(kk<7)) rot = "";
               else rot = " "+((kk==3)?" lfrbd".charAt(k):(" LFRBD".charAt(k)+((kk==9)?"2":"")));
               roth = ["","U Cb","Cl","u Cf","U2 Cr","Cl2"][k];
               rev = "";
        } else { 
               roth = ["","U Cf","Cr","u Cb","U2 Cl","Cr2"][k];          // 右上がり
               if      ((kk==1)||(kk==3)||(kk==5)||(kk==7))  rot += "";  // 時計
               else if ((kk==2)||(kk==6))                    rot += "2";
               else if ((kk==4)||(kk==12)) rot = " "+" lfrbd".charAt(k); // 反時計
               else rot = "";
               rev =  ["","cf","cr","cb","cl","Cr2"][k];  //  縦戻しのターン
        }
        if (kk%3!=0) svt = " U ";  // UP面にてU2で期待されても、１個だけなのでUとする
        if (Pri[kk]>kmax) { kmax = Pri[kk]; maxi = k; }

        rot += " *$ " + roth + svt + rev;
        vrot[k] = rot;
    }
    if (maxi<=0) return -1;
    preRot += vrot[maxi].replace(" *$",(NoRot=="")?" *$"+cubeAdrs(CubeNo(maxi,NR,NR,N)):"");

    Rotates = Rotates.concat(preRot.trim().split(" "));
    if (kk==15) return false;  // 面の完了
    return true;
}
function rotCube(){
    var segs=" translate3d(0,0,0) rotateX("+cubex+"deg) rotateY("+cubey+"deg) rotateZ("+cubez+"deg)";
    $(".cube").css({ "transform":segs, "-webkit-transform":segs });
}
function rotCubeXY(){
    rotCube();
    kiirRotLayer(wholecube,99);
    kiir();
}
function shortRot() {
    if (NoRot=="") { 
        NoRot = " *0c"; Auto = true;
    } else {
        NoRot = ""; if (Pause) Auto = false;
    }
}
function faceFloat(){
    if (FaceF=="") {
        FaceF = "f",$("#lskip").show();
        if (Pause) NoRot = "";
    } else {
        FaceF = "", $("#lskip").hide();
    }
    kiirRotLayer(wholecube,99);
    kiir();
}
function faceNum(){
    if (Disp=="none") Disp = "block", Face = "N",$(".mezo span").css("display",Disp);
    else {
        if (Face=="F") Face = "N", $("#hdnstop").show(); 
        else {
            Face = "F";
            if ($("hdnstop").prop('display')=='block') Disp = "none"; 
            $("#hdnstop").hide();
            $("#Trial").html("Turns: "+ Average[N]);
        }
    }
    kiirRotLayer(wholecube,99);
    kiir();
}
function pause(){
    if (Pause) {
        Pause = false;
        $("#comment").html($("#comment").html().replace(" Pausing",""));
        clearTimeout(Tid2); turn("");
    } else Pause = true, $("#comment").html($("#comment").html()+" Pausing");
}
function SftOmit(){
    var sw = $('input[name="noy"]').is(':checked')? true:false;
    if (sw) RotOmt = 1;
    else {
        RotOmt = 0;
        while (RotSft-->0) turnStart("Y");
    }
    RotSft = 0;
}
function demo(){
    if (Cool>0){
        Auto = false;
        Cool = 0;
    } else {
        Cool = 1;
        allTest();
    }
}
let Rev = 0 ; // Reverse
function accel(usft=true){
  
    if (usft==2) {
        LED =    $("#sample1check").prop("checked");
        if (LED) $("#sample2check").prop("checked",false).change();
    } else {
        if (speed==80) speed=40, NxPaus=500;
        else speed=80, NxPaus=1000;
    }
}
function css33(opt=1) {
    if (Fix44) return;
    document.getElementById("dynaCSS").href="css/RBstyle33.css";
    if (opt==1) N = 3;
}
function cssNN(n,opt=1) {
    if (Fix33) return;
    document.getElementById("dynaCSS").href=("css/RBstyle"+n)+(n+".css");
    if (opt==1) { N = n; kiir(n); }
}
function CubeNo(f,y,x,n=N) {
    return f*n*n+y*n+x+1;
}
function unfold(i,szin,n=N) {
    var is = i + szin;
    if (FaceF=="") return is+"e";
    if (cubey<355) return ((i>n*n)&&(i<n*n*2+1)||(i>n*n*4))?FaceF+is+"f":is+"e";
    if (cubey>365) return (i>n*n*3)?FaceF+is+"f":is+"e";
    return ((i>n*n)&&(i<n*n*2+1)||(i>n*n*3))?FaceF+is+"f":is+"e";
}
// ここから、Ｖ6新処理方式
let cubex=-20, cubey=330, cubez=0, segs="yo";
let Pause=false, speed=80, NxPaus=1000;
let CubeMap = new Array(6), s=new Array();
let Maprote = new Map([["F","FRBL"], ["f","frbl"],["L","LFRB"], ["l","lfrb"],
                       ["B","BLFR"], ["b","blfr"],["R","RBLF"], ["r","rblf"],
                       ["M","MSms"], ["m","msMS"],["S","SMsm"], ["s","smSM"]]);
let MC3=new Array([0],[1,7,9,3], [2,4,8,6],[3,1,7,9],[4,8,6,2],[5,5,5,5],
                 [6,2,4,8],[7,9,3,1], [8,6,2,4],[9,3,1,7],[10,19,28,37],
                 [11,20,29,38],[12,21,30,39],[13,22,31,40],[14],[15,24,33,42],[16],[17],[18],[19,28,37,10],
                 [20,29,38,11], [21,30,39,12],[22,31,40,13], [23,32,41,14],
                 [24,33,42,15],[25,34,43,16],[26,35,44,17],[27,36,45,18],[28,37,10,19], [29,38,11,20],
                 [30,39,12,21],[31,40,13,22],[32],[33,42,15,24], [34,43,16,25],
                 [35,44,17,26],[36],[37,10,19,28],[38,11,20,29], [39,12,21,30],
                 [40,13,22,31],[41,14,23,32],[42,15,24,33],[43,16,25,34],[44],[45,18,27,36],[46,48,54,52],
                 [47,51,53,49],[48,54,52,46],[49],[50],[51],[52,46,48,54],[53],[54,52,46,48]);

function Nc(no,n=N) {  // 仮想3x3Map上で指定パーツの色を求める
    var sftC;
    if (N==2) {
        if (RotSft==0) sftC = layer24[no];
        else           sftC = layer24[MC3[no][RotSft]];
        return  Na(sftC, 4);
    } if (n==3) {  // layer34をやめる
        if (RotSft==0) sftC = no;
        else           sftC = MC3[no][RotSft];
        return  Na(sftC, 3);
    } else {
        if (RotSft==0) sftC = layer3N[no];
        return  Na(sftC);
    } 
}
function Na(a4x4,n=N) { // 6x8x8 上で左上部分の指定パーツの色を拾う
//    console.log('a4x4:',a4x4);
    var face = a4x4-1;
    return CubeMap[Math.floor(face/(n*n))][Math.floor((face%(n*n))/n)][face%n];
}
function Ns(a4x4,n=N) { // 6x8x8 上で左上部分の指定パーツの色を数字文字として拾う
    var face = a4x4-1; // console.log(face);
    return rotParts[Math.floor(face/(n*n))][Math.floor((face%(n*n))/n)][face%n].charAt(0);
}
function Nt(a4x4,n=N) { // LED=trueの時 6x8x8 上で左上部分の指定パーツの文字列を拾う
    var face = a4x4-1; // console.log(face);
    return rotParts[Math.floor(face/(n*n))][Math.floor((face%(n*n))/n)][face%n].slice(1);
}
let N = 5; Disp="none", Face="F", FaceF="", LED=false, Counter=0;
let Comment="", Tid=null,Tid2=null, turnN=1, ClipDT="", W=null;
let Rotates = new Array(), Tlog = 0, Solution = "";
let RotSft=0, Urot = "", Urote = "";
let Fix33=false, Fix44=false, Auto=true, Average=new Array(8);

function SelCubeT(m) {
    if (m) {
        Auto = false;
        N = Number(m);
    }
    $("#statusBlk").html(saveSTinfo);
    initVirgin(N);
}
function initVirgin(m=5){
    var n = m, i, j;
    if (Auto) {
        if      (location.search.slice(0,4)=="?2x2") N=2,n=2;
        else if (location.search.slice(0,4)=="?3x3") N=3,n=3;
        else if (location.search.slice(0,4)=="?4x4") {
                  $("#toggle4").prop("checked", true).change();
                  SelCubeT(4); return; }
        else if (location.search.slice(0,4)=="?5x5") {
                  $("#toggle5").prop("checked", true).change();
                  $("#toggleB5").prop("checked", true).change();
                  SelCubeT(5); return; }
        if (n==2) $("#toggle2").prop("checked", true).change();
        if (n==3) { $("#toggle3").prop("checked", true).change();
                  SelCubeT(3); return; }
    }
    $("#toggle5").removeAttr('checked').prop("checked", false).change();
    if ((m>=4)&&(N!=m)) n = N; 
    if (window.outerWidth<500) window.resizeTo(380,800);
    else                       window.resizeTo(640,600);
    speed=80; if (NxPaus<1100) NxPaus=1000;
    Disp="none"; Pause=false; Face="F"; Comment="";
    RotSft=0;Rotates=[]; turnN=1; Solution = "";
    clearTimeout(Tid); clearTimeout(Tid2);
    RotOmt = $('input[name="noy"]').is(':checked')? 1:0;
    Counter = 0; setOverNo(0);

    $("#all3x3").show();
    if (n>2) {
        $("#solve3").prop('disabled',true);
        $("#scrm3x3").html('スクランブル');
        $("#solveX").html('お告げソルブ');
        $('input:radio[name="sayu"]').val(["R"]); 
        $("#parity").prop('disabled',true);
        if (n==3) $("#solve3").prop('disabled',false);  // 3x3論理
        $("#solve4").prop('disabled',false);
    } else {
        $("#proc00").html('完全白一面形成');
        $("#proc04").html('隣接/&nbsp;対角交換');
        $("#proc16").html('黄色面の下向き');
        $("#proc26").html('６面の最終検査');
        $("#proc32").html('完成おめでとう');
        $('input:radio[name="sayu"]').val(["L"]); 
        if (RotOmt==1) $("input[name='noy']").prop("checked", false).change();
    }
    $("#sample1check").removeAttr('checked').prop("checked", LED).change();
    $("#sample2check").removeAttr('checked').prop("checked", false).change();
    $("#comment").html("");  $("#turn").html("&nbsp;"); $("#rotate").html("&nbsp;");
    initCube(n); Cool = 0; 
    if ($("#display").hasClass('is-visible')) sceneOFF(setCube);
    if ((window.name=="cube3dg")||(window.name=="cube3dh")) setTimeout("checkRot()",100);
    if (Auto & (location.search.slice(0,7)=="?repeat")) {
         accel(); Cool=1; allTest();
    }
}
function initCube(m=5) {
    var i,j;
    Center = false; setOverNo(0); RotSft=0; Rotates=[]; CubeMap = new Array(6);
    for (var i=0;i<6;i++) {
        CubeMap[i] = new Array(8);
        for (var j=0;j<8;j++) CubeMap[i][j] = [];
    }
    var n = m;
    if ((m==0)||(m==2)) n = 4;
    for(var k=0;6>k;k++) for(j=0;n>j;j++) for(i=0;n>i;i++) 
        CubeMap[k][j][i] = (k==0)?8:k+1;

    $("#not2x2").hide();
    $("#STnot2x2").hide();
    
    if (m==2) {
        $("#toggle2").prop("checked", true).change();
        cssNN(4,0);layersNN(4);
    }
    if (n==3) {
        css33(1);  layersNN(3);
        $("#toggle3").prop("checked", true).change();
        $("#all3x3").show();
    }
    else if (N>=4) {
        if (N==5) {
            if ($("#toggle5B").prop('checked'))
                $("#toggle5B").prop("checked", true).change();
            if ($("#lowBtn").css('display')=='none')
                $("#toggle5").prop("checked", true).change();
        } else  $("#toggle"+N).prop("checked", true).change();
        cssNN(n,0);layersNN(n);
        $("#not2x2").show();
        $("#STnot2x2").show();
        $("#solve3").prop('disabled',true);
        $("#solve4").show();
        mini3x3(false);
    }
    kiirRotLayer(wholecube,99);
    kiir(m); NoRot = "";
    $(".mezo span").css("display",Disp);
    $("#statusBlk").hide();
    if (N>=4) $("#statusBlk").css("height","220px");
    else      $("#statusBlk").css("height","168px");
    for (i=0;i<45;i+=2) $("#proc"+("0"+i).slice(-2)).prop('disabled',true); 
}
let rotParts = [];  // #rotLayerへHTMLとして記録するPartsのフラグ
let moveSTK = [];
let posts = [];
let layeru,layerl,layerf,layerr,layerb,layerd,layer24,layer3N,wholecube;
let c,cc,eg;
function layersNN(nn) { // n>2
    layer3N = null; wholecube = null; eg = null;
    if (N==2) {
        layer24=[0,1,3,9,11,17,19,25,27,33,35,41,43,49,51,57,59,65,67,73,75,81,83,89,91];
    }
    layeru = setFacePs(nn,0);
    layerl = setFacePs(nn,1);
    layerf = setFacePs(nn,2);
    layerr = setFacePs(nn,3);
    layerb = setFacePs(nn,4);
    layerd = setFacePs(nn,5);

    function setFacePs(m,n) {
        var nn=Number(m), p=nn*nn*n , m=nn*nn*(n+1);
        var tmpA=new Array(p+1,    p+2,    p+nn,
                           p+nn+1, p+nn+2, p+nn*2,
                           m-nn+1, m-nn+2, m    );
        return tmpA;
    }
    layer3N=[0].concat(layeru,layerl,layerf,layerr,layerb,layerd);
    wholecube=[...Array(nn*nn*6)].map((v, i)=> i+1);
       // center
    var i, j, k, y;
    c = []; for (k=0;k<6;k++) for (j=1;j<N-1;j++) for (i=1;i<N-1;i++) c.push(k*N*N+j*N+i+1);
            if (N==2) c = [1,17,33,49,65,81];
    cc= []; for (k=0;k<6;k++) for (j=2;j<N-2;j++) for (i=2;i<N-2;i++) cc.push(k*N*N+j*N+i+1);
    eg= []; // edges 奇数キューブも(N-1)/2セットずつ12種類並んでおり正中間エッジは補完される
        function yi() { y = (N&1>0)&&((N-1)/2==y+1)?y+2:y+1; }
//        function ym() { y = (N&1>0)&&((N-1)/2==y-1)?y-2:y-1; }
    for (y=1;y<N-1;yi()) eg.push(CubeNo(1,y,[0,N-1][0],N),CubeNo(4,y,[0,N-1][1],N));     // O-blue
    for (y=1;y<N-1;yi()) eg.push(CubeNo(4,y,[0,N-1][0],N),CubeNo(3,y,[0,N-1][1],N));     // blue-R
    for (y=1;y<N-1;yi()) eg.push(CubeNo(3,y,[0,N-1][0],N),CubeNo(2,y,[0,N-1][1],N));     // R-green
    for (y=1;y<N-1;yi()) eg.push(CubeNo(2,y,[0,N-1][0],N),CubeNo(1,y,[0,N-1][1],N));     // green-O
    for (y=1;y<N-1;yi()) eg.push(CubeNo(0,[0,N-1][0],y,N),CubeNo(4,[0,N-1][0],N-1-y,N)); // white-B
    for (y=1;y<N-1;yi()) eg.push(CubeNo(0,y,[0,N-1][1],N),CubeNo(3,[0,N-1][0],N-1-y,N)); // white-R
    for (y=1;y<N-1;yi()) eg.push(CubeNo(0,[0,N-1][1],y,N),CubeNo(2,[0,N-1][0],y,N));     // white-G
    for (y=1;y<N-1;yi()) eg.push(CubeNo(0,y,[0,N-1][0],N),CubeNo(1,[0,N-1][0],y,N));     // white-O
    for (y=1;y<N-1;yi()) eg.push(CubeNo(5,[0,N-1][1],y,N),CubeNo(4,[0,N-1][1],N-1-y,N)); // yellow-B
    for (y=1;y<N-1;yi()) eg.push(CubeNo(5,y,[0,N-1][1],N),CubeNo(3,[0,N-1][1],y,N));     // yellow-R
    for (y=1;y<N-1;yi()) eg.push(CubeNo(5,[0,N-1][0],y,N),CubeNo(2,[0,N-1][1],y,N));     // yellow-G
    for (y=1;y<N-1;yi()) eg.push(CubeNo(5,y,[0,N-1][0],N),CubeNo(1,[0,N-1][1],N-1-y,N)); // yellow-O
}
let Center = false, Over5 = 0, Cool = 0, CoolTM = 0;
function allTest() {
        flushB(150,8,"#scrm3x3");
        Auto = true;
        scramble();
        if (document.opt.noy.checked) NoRot = " *0c";
        Cool++;
        $("#statusBlk").show();
        if (N<4) NaviIn();
        else next44();
}
function faceTest(f2l=false) {
    var p, n=N, b = (N==2)?(n=4,1):(N-2)**2;
    if (!f2l) 
        for (p in layeru) if (Na(layeru[p],n)!=Na(c[b*0],n)) return layeru[p];
    for (p in layerd) if (Na(layerd[p],n)!=Na(c[b*5],n)) return layerd[p];
    for (p in layerl) if (Na(layerl[p],n)!=Na(c[b*1],n)) return layerl[p];
    for (p in layerr) if (Na(layerr[p],n)!=Na(c[b*3],n)) return layerr[p];
    for (p in layerf) if (Na(layerf[p],n)!=Na(c[b*2],n)) return layerf[p];
    for (p in layerb) if (Na(layerb[p],n)!=Na(c[b*4],n)) return layerb[p];
    return 0;
}
function waitFin(cnt=20) {
     var i, log = '【Trial count:'+Cool+' Moves:'+turnN+'】';

    if (Comment.indexOf(' Fin')>0) {
          var result = faceTest();
          console.log(log);
          if (opener && opener.document.getElementsByName('pythonQ')) 
               opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = log;
          Disp="none"; Pause=false; Face="F"; RotSft=0;Rotates=[]; 
          clearTimeout(Tid); clearTimeout(Tid2);
          if (result!=0) { 
              Auto = false;
              console.log('%c【Trial Fault!! center:'+result+'】',"color:red");
              console.log(ClipDT);
          } else {
              console.log("%c"+log,"color:green");
              $("#Trial").html("Cours: "+ Cool);
              if (isNaN(Average[N])) Average[N] = turnN;
              else Average[N] = Math.ceil((Average[N]*Cool+turnN)/(Cool+1));
              setTimeout('allTest();',cnt*100);
          }
          turnN = 1;
    }
}
async function clipIn() {
    return (await navigator.clipboard.readText()
    .then((text) => {
        console.log(text);
        return (text);
    })
    .catch(err => {
//        console.error("text is nothing", err);
        return ("");
    }));
}
async function quickIn(lang="jp") {  // 臨時入力処理
    var rot, RotatesText = "";
    var clipdt = await clipIn();
    var wh = window.outerHeight;
    window.resizeTo(640, wh);
    if (lang=="en") RotatesText = window.prompt("Input rotation symbols split by comma or space (xx2:twice)", clipdt);
    else        RotatesText = window.prompt("区切（スペースorコンマ）の回転記号文字列を貼り付けてください。", clipdt);
    parent.ClipDT = RotatesText;
    window.resizeTo(380, wh);
    if (RotatesText==null) { rot = []; } //  Auto = false;
    else if (RotatesText.indexOf(",")>-1) rot = RotatesText.trim().split(",");
         else                             rot = regRot(RotatesText.trim().split(" "));
    clearTimeout(Tid2);
    setRot(rot);
    setTimeout("checkRot()",100);
}
const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6;
//        ccoW=new Array(22,38,54,70,22),ccoY=new Array(22,70,54,38,22);
function Solve() {
    if (Pause) pause(),turnN = Average[0];
    else turnN = 1;
    if (N<4) { NaviIn(0); return; }
    $("#solve4").prop('disabled',true);
    for (i=0;i<45;i+=2) $("#proc"+("0"+i).slice(-2)).prop('disabled',true); 
    $("#statusBlk").show();
    if (faceTest()==0) $("#comment").html("整っています");
    else next44();
}
function check33() {  // 3x3論理で解ける形かチェックする
    if ((N<4)||(Counter>0)) return true;;
    var i,j,diff,old=$("#solve3").prop('disabled'); 
    $("#solve3").prop('disabled',true);
    $("#parity").prop('disabled',true);
    for (j=0;j<6;j++) {
        if (centNEQ(N,j)||EdgNEQ(N,j)) {
            return true;    // 3x3 centers or Edges are not same color.
        }
    }
    // センター連結Cubeの３ｘ３扱いがＯＫ
    $("#solve3").prop('disabled',false);
    $("#proc40").prop('disabled',false);
    $("#proc42").prop('disabled',false);
    $("#proc44").prop('disabled',false);
    return false;
//  allTest(); // テスト用
}
function centNEQ(nn,f) { // f面の中心から(nn-1)x(nn-1)に異色があるか
    var x, y,m=N>>1, c1=CubeMap[f][m][m],s=N%2;
    for (y=m-(nn>>1)+1; y<m+(nn>>1)-1+s; y++)
        for (x=m-(nn>>1)+1; x<m+(nn>>1)-1+s; x++)
            if (CubeMap[f][y][x]!=c1) return [f,y,x];
    return false;
}
function EdgNEQ(nn,f) {
    var x, y;
    for (y=0;y<nn;y++) {
        if ((y==0)||(y==nn-1)) for (x=1;x<nn-2;x++){
            if (CubeMap[f][y][x]!=CubeMap[f][y][x+1]) return [y,x+1];
        } else if (y<nn-2)
            if ((CubeMap[f][y][0]!=CubeMap[f][y+1][0])||
                (CubeMap[f][y][nn-1]!=CubeMap[f][y+1][nn-1])) return [y,y+1];
    }
    return false;
}
function next44() {
    if (Pause) { accel(false);return; }
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("next44()",NxPaus);
        return true;
    }
    var judge=true;
    if ((N==3)||($("#solve3").prop('disabled'))) {
        judge = check33();
        if ((N>3)&&($("#solve3").prop('disabled')==false)) {
              mini3x3(false);
             if ($("#miniCube").css('display')!="none") {
                 Pause = true;
                 mini3x3();
                 setTimeout('Pause=false;',2000);
              } 
            flushB(200); NaviIn(1);
            return;
        }
    }
    var i,j=0,s1,t1,lo="",kuro="#888",div,newcolor="transparent";
    for (j=0;j<6;j++) {
        var fyx = centNEQ(N,j);
        if (!fyx) continue;
        var cidx = (N-2)*(N-2);
        for (i=0;i<cidx;i++) {
            s1 = unfold(c[j*cidx+i]," szin",N);
            t1="#cubeFields .mezo"+ s1.slice(0,-6);
            lo += '<div class="mezo'+ s1+0+' field mezo" style="transform:'+$(t1).css('transform')+'"></div>';
            $(t1).css("background-color",newcolor);
        }
    } // console.log(lo);
    if (lo=="") {
          $("#proc40").prop('disabled',false);
          $("#proc42").prop('disabled',false);
          Comment = ""; 
          if($("#solve3").prop('disabled')==false) {
              mini3x3(false);
              flushB(200); NaviIn(1);
              return;
          } else edgeFYX(White);
          return; 
    }
    $("#rotLayer").html(lo);
    flush(200);
    if (!navigator.userAgent.match(/iPhone|Android.+/)) speed=40,NxPaus=500;
    $("#proc40").prop('disabled',false);
    if ((N>=5)&&(Over5==0)) setOverNo(1); // Mxl,Mxrが特別回転 中心から±１
    if (cent6faces()) return;

    $("#solve4").prop('disabled',false);
    $("#rotLayer").html(lo);
    flush(200);
}
function setOverNo(n) {
    Over5 = n;
    $("#ringNo").html("Ring: "+n);
    flushB(200,8,"#ringNo");
}
function flush(tm,cnt=8) {
    if (Counter<0) return;
    Counter++;
    $("#rotLayer").toggle();
    setTimeout(function(){
        cnt>Counter?flush(tm,cnt):($("#rotLayer").html(""), kiir(),Counter=0)},tm); // 
}
let CounterB = 0;
function flushB(tm,cnt=8,id="#solve3") {
    CounterB++;
    setTimeout(function(){
        if(id=="#parity") {
            $(id).css('background-color',CounterB%2?'#ce4b42':'#ccc');
            cnt>CounterB?flushB(tm,cnt,id):
               ($(id).css('background-color',""),CounterB=0,$("#proc32").prop('disabled',false));
        } else if(id=="#rotLayer"){
            CounterB%2?$(id).hide():$(id).show();
            cnt>CounterB?flushB(tm,cnt,id):($(id).show(),CounterB=0,$(id).html(""),kiir(),Counter=0);
        } else {
            $(id).css('background-color',CounterB%2?'#ce4b42':'#ccc');
            cnt>CounterB?flushB(tm,cnt,id):($(id).css('background-color',""),CounterB=0);
        }},tm); // 
}
let ov100 = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function cubeAdrs(n) { // 100を超えるキューブアドレスを２桁で返す
    var twoC = "A0"; // 110
    if (n<100) return ("0"+n).slice(-2); 
    twoC = ov100.charAt((n-100-n%10)/10) + n%10;
    return twoC;
}
function cubeFlush(rote,cnt=8) {
    if (Counter>0) {
        Tid = setTimeout("cubeFlush("+rote+")",NxPaus);
        return true;
    }
    var cn,cof,eof,s1,s2,t1,t2, n=2, lo="", newcolor="transparent";
     function dl_add(cc,ce,ofs) { // ce=C/E cc=1:Single 2:4x4Eg 3:5x5Eg 5:7x7Eg 4:4x4C,6x6Eg 9,25:Center 
         var cn,ccc,egm=(ce==2)?((N==8)?(ofs-ofs%12):(N>=6)?(ofs&0xf8):(ofs&0xfc)):ofs; // egmはeg４個組の正規開始位置で補正
         for (var ci=cc,oft=egm;ci>0;ci--) {
             cn = (cc==1)?ofs:(ce==1)?((N%2>0)?c[ofs+ci-1]:c[oft++]):eg[oft++];
             if ((ce==2)&&(N%2>0)&&(ci<cc/2)) {
                 if (ci==N>>1)   cn=(eg[oft-ci-2]+eg[oft-ci])/2,oft-=2;
                 if (ci==(N>>1)-1) cn=(eg[oft-ci-3]+eg[oft-ci-1])/2;
             }
             s1 = unfold(cn," szin", N);
             t1="#cubeFields .mezo"+ s1.slice(0,-6);
             lo += '<div class="mezo'+s1+0+' field mezo" style="transform:'+
                   $(t1).css('transform')+ ';"></div>';
             $(t1).css("background-color",newcolor);
         }
         return cc;
     }
    while (n<rote.length-1) {
         var np = 0, no;   // $xB0より上は、$x30で解釈して100〜300を足す
         no = ((rote.charAt(n)>"9")?-60:0)+ (rote.charCodeAt(n)-48)*10 + rote.charCodeAt(n+1)-48;
         if (rote.charAt(1)=="#") { // 仮想3x3でのキューブ番号
             if (N==3) cn = MC3[no][RotSft]; // 
             else      cn = layer3N[MC3[no][RotSft]]; // 
             cof= c.indexOf(cn); if (cof>=0) np = dl_add((N-2)**2,1,cof);
             eof= eg.indexOf(cn);if (eof>=0) np = dl_add((N-2)*2,2,eof);
         }
         else if (RotSft==0) cn = no;
         else cn = MC4[no][RotSft];
         if (np==0) np = dl_add(1,0,cn);
         n += 2;
    }
    $("#rotLayer").html(lo);
    flush(LED?100:200,(NxPaus==1000)?cnt:4);
}
function NaviIn(n=0) { // 2x2,3x3型のナビゲーション
    setOverNo(1);
    console.log(ClipDT);
    Solution = "";
    $("#statusBlk").show();
    RotOmt = $('input[name="noy"]').is(':checked')? 1:0;
    if (n==0) turn("");
    SolveNavi(n);
    return true;
}
