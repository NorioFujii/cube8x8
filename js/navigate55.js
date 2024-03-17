// ルービックキューブ5x5お告げナビゲーター
// Written by N.Fujii @2023
function dumpRot() {
    if (Solution=="") alert(ClipDT);
    else            alert(Solution);
}
function copyRot() {
    var copystr = ((!Solution)||(Solution==""))? ClipDT:Solution;
    navigator.clipboard.writeText(copystr);   
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
}
var ExchgCnt = 0;
function colorEg(post) {
    var idx = eg.indexOf(post)&0xfe;
    return a[eg[idx]]*a[eg[idx+1]]+a[eg[idx]]+a[eg[idx+1]];
}
function colorEg2(p1,p2) {
    return a[p1]*a[p2]+a[p1]+a[p2];
}
const move23=new Array("B2 R' U","","B' U2","",
"B U2","","R' U","",
"L' F' L","","R U","",
"Pass","","Pass","",
              "B' R' U","","U2","",
"R B U2","","U","",
"F R F' U","","None","",
"L' B' L U2","","U'","",
              "B R' U","","B2 U2","",
"R2 U","","R L' F' L","",
"L' F2 L","","D' L' F L","",
"L' F L","","L2 U' L2","");
const   move03=new Array("B'","","B2 R D B2","","R D B2","","B","","R2 B","","R2 R D B2","","Pass","","U' L' U","",
              "None","","B' R D B2","","R2 D B2","","R B","","Pass","","Pass","","F' U F","","U2 R U2 B","",
              "B2","","D' R' B","","D B2","","R' B","","D2 B2","","D R' B","","D' B2","","D2 R' B","");
const edgeTwist="*エッジ対面交換 l2 U2 F2 l2 F2 U2 l2"; 
const edgeTwis2="*エッジ対面交換2 F D R' B' D' l2 U2 F2 l2 F2 U2 l2 F'"; 
const dblEdge2="*エッジペア交換 l' B L B' U B' U' B l";
const dblEdgeF="*エッジペア交換 Mu' R U R' F R' F' R Mu";
let ycount=0;
function edge4(Ccolor,f=0) {
// 4x4,5x5エッジ連結の正面操作 0:端ピース(右)、1:端ピース(左)、4:中央ピース(前)、5:中央ピース(後)
    const pairRot=NoRot+" r' *エッジペア結成1 "+((N==5)?"*$22245254":"*$14153435")+
               " U L' U' r * *エッジペア結成2 "+((N==5)?"*$22245254":"*$14153435")+" U"; // 

    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("edge4("+Ccolor+','+f+")",NxPaus);
        return true;
    }
// エッジ左右寄せ：各面の処理をY,X面回転で進める
//  正面で左スロットに対し次を行う
//    ５６のエッジグループが２個揃っていれば、”Y”へ
//　　揃わなければ５６の色を探し２４にMove回転で持ってくる（２色反転を避ける）
//  　Move回転の結果、２２に来た色を探して４に持ってくる（２色反転を避ける）
//      ２２のエッジグループが２個揃っていれば、”Y”へ
//　　　Moveで22に持ってきたキューブの色が66キューブの色であれば、
//    　　 U',R'で５６の対面に置き、F面で次のエッジクロス交換を使う。
//     　　 Mu',R,U,R'F,R',F',R,Mu
//  　４に寄せたら、Mr',U,L',U',Mr,U　で穴開き２ペアを２セット作りストックする
    var stp = parseInt(document.getElementById('stop').value);
    if (stp>0){
        if (turnN<stp) {
                NoRot = " *0c";
        } else if (turnN>=stp) {
                NoRot = "";
                pause();
        }
    }
    if (f==1) ycount = 0;
    if (f==2) { // 両端寄せを完結して保護する
        rote = pairRot;
        Rotates = Rotates.concat(regRot(rote.trim().split(" ")));
        edge4(Ccolor,3);
        return true;
    }
    if (f==3) {
//  左スロットがすべて揃ったら、不揃いスロットを同様に処理する
//  終了したら、エッジ中央寄せに進む

      if ((a[eg[12]]==a[eg[14]])&&(a[eg[13]]==a[eg[15]])) {
          if (++ycount>3) {
            ycount = 0;
            var edgeLeft = edgeAll(2);
            if (edgeLeft==-1) { // 不揃い撲滅完了で中央揃えへ
                $("#proc44").attr('disabled',false); 
                if (N==4) edge4(White,8);
                else      edge4(White,4);
                return false;
            } else { // 不揃いを５６へ
                egMove(eg[edgeLeft],eg[26]);
                Rotates.push("*$"+cubeAdrs(eg[26])+cubeAdrs(eg[27]),"f");
            } 
          } else Rotates.push("Y");
      }
      edge4(Ccolor,0);
      return false;
    }
    if (f>3) { // 中央寄せに移行しているので中継する
        return edgeMid(Ccolor,f);
    }
// f=0,1
    var rote,res;
    if ((f==1)&&((colorEg(eg[24])==colorEg(eg[12]))||
                 (colorEg(eg[24])==colorEg(eg[14])))) {  // 22の色が 56や66にある
         egSecond("*$"+cubeAdrs(eg[24])+cubeAdrs(eg[14])+" U' R' " + dblEdgeF);
         edge4(Ccolor,0);
    } else {
        res = 0;
        if ((a[eg[12]]==a[eg[14]])&&(a[eg[13]]==a[eg[15]])||
            ((colorEg(eg[12])==colorEg(eg[26]))||(f==1))&&
             (colorEg(eg[24])==colorEg(eg[26])))  // MoveもRotationも不要
                      { edge4(Ccolor,3); return true; }
        else if (f==0) res = egMove(eg[12],eg[26]);
        else if (f==1) res = egMove(eg[24],eg[16]);
        if (res<0) { // 既に配置
            Rotates.push("*既に配置されている");
            edge4(Ccolor,4+res);
        } else edge4(Ccolor,f+1);
    }
    return true;
}
function egSecond(rote) {
    flushB(200,8,"#edgeEx");
    Rotates = Rotates.concat(regRot(rote.split(" ")));
}        
function egMove(p1,p3) {
    var c1=colorEg(p1),p2=-1,i,cmnt;

    if (colorEg(p3)==c1) return -2; // 既に鎮座
    for (i=0;i<47;i+=2) {
        if ((eg[i]==p1) || (c1!=colorEg(eg[i]))) continue;
        p2 = i;
        break;
    } // console.log('Pair edge ',p1,p2,'p2='+eg[p2],p3);
    if (p2<0) console.log('Pair edge not found',p1,p2,p3);
    else {
        cmnt = "*エッジペア探索" + (p3>10?"左":"右") +
               " *$"+cubeAdrs(p1)+cubeAdrs(p3)+cubeAdrs(p2) +
               NoRot + " " + (p3>10?move23[p2]:move03[p2]);
        if (opener && opener.document.getElementsByName('pythonQ')) {
            parent.ClipDT = cmnt.slice(18);
            opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = cmnt;
        }
        Rotates = Rotates.concat(regRot(cmnt.split(" ")));
    }
    return p2;
}
// エッジ中央寄せ：各面の処理を不揃い発見で進める
//  正面で左スロットに対し次を行う
//    ５６のエッジグループが３個揃っていれば、”Y”へ
//　　揃わなければ５６の色を探し２３にMove回転で持ってくる（２色反転を避ける）
//  　Move回転の結果、２２に来た色を探して３に持ってくる（２色反転を避ける）
//  　３に寄せたら、Mc,U,L',U',Mc',U　で３ペアを２セット作りストックする
//      ２２のエッジグループが３個揃っていれば、”Y”へ
//　　　Moveで持ってくるキューブが61エッジに含まれている場合は、
//        L,Dで56・66を72・74に移し、F面のルーブルフール後上下揃えば、”Y”へ
//  3ペアが揃わないエッジグループが２セットだけになったら、ルーブルフールを実施し
//     揃って(check33)しまえば、次段階の疑似３ｘ３処理に進む
//　 　ルーブルフール＋３個逆順＋ルーブルフール、で両端の２セットが揃う
//  揃わないエッジグループが一つだけなってしまったら、
//  上面前後で次の前グループ内1反転を実施する。
//  　"r2 B2 U2 l U2 r' U2 r U2 F2 r F2 l' B2 r2"
//     右２奥２☆、左下☆右下☆右上☆、前２右上,前２左上、奥２右２（左右はW輪,☆は上２）
//  全エッジグループが１２セット揃ったら、次段階の疑似３ｘ３処理に進む

const manuver="*Ｏパリティ補正 r2 B2 U2 l U2 r' U2 r U2 F2 r F2 l' B2 r2";
let Sw = 1;
function edgeMid(Ccolor,f) {
    const pairRot=NoRot+" Mc *エッジ3ペア結成1 *$222324525354 U L' U' Mc' * *エッジ3ペア結成2 *$222324525354 U"; //  ;

    if (f==6) { // 中央寄せ２個(結成1,2)終了できるので保護する
        rote = pairRot;
        Rotates = Rotates.concat(regRot(rote.trim().split(" ")));
        edge4(Ccolor,7);
        return true;
    }
    if (f==7) {
//  左スロットがすべて揃ったか検査し、不揃いスロットを同様に処理する
//  終了したら、疑似３ｘ３処理に進む
//  不揃いが２個だけの時は、縦に持ってきてTwistする
// *0c b b' l f U' r' U' r2 R2 R2 r2 D B l b' l' l2 U' u' D' U2 B' R2 u' r F U2 L' U B2 U F f B' U2 d b' d2 R f b' U R' R' l r' l2 F' D' r r' R F' f' r' l2 u2 D' B2 L B R' F' B2 

        if ((a[56]==a[61])&&(a[56]==a[66])&&(a[35]==a[40])&&(a[35]==a[45])) { // 向きOK
          if (++ycount>3) {
            var edgeLeft = edgeAll(3);
            if (edgeLeft==-1) { // すべてのエッジスロットが３個連結
                edge4(White,8);
                return false;
            } else { // 不揃いを５６へ持ってくる
                ycount = 0;
                Rotates.push("*不揃いを移動","*$"+cubeAdrs(eg[edgeLeft]));   
                egMove(eg[edgeLeft],24);
                Rotates.push("f");
            } 
          } else Rotates.push("Y");
        } else {
            var p1, edgeLeft = edgeAll(3,12);
            if (edgeLeft==-1) { // 他のエッジスロットが全部３個連結なのでマヌーバー
 　　　　　　　 $("#parity").attr('disabled',false);
                rote = "*$"+cubeAdrs(56)+cubeAdrs(61) + " F "+manuver;
                Rotates = Rotates.concat(regRot(rote.split(" ")));
            } else { // 他にも不揃いありなので、正面縦置きで、エッジ上下交換
                p1 = edgeAll(3,edgeLeft);  // 不揃いは、５６組の他１個だけか調べる
                if ((a[56]==a[40])&&(a[35]==a[61])) { // 同種エッジグループ３個（向きが違う）
                  if ((p1<0)&&(colorEg2(61,40)==colorEg(eg[edgeLeft]))) { // edgeLeft以外は、揃っている
                    console.log("Monolithic slot merge. "+eg[edgeLeft]);
                    // 不揃いが２個だけでMonolithicなら次で完結                
                    Rotates = Rotates.concat(regRot(("F *不揃いが２個だけ"+edgeTwist+" f").split(" ")));
                    edge4(Ccolor,4);  // 56に不揃い、５６が６５と同じ色組となる->f＝5で60(61)が２２へ
                    return false;
                  }
                } // 異種エッジグループが残っている
                if (p1<0) { // 不揃いは、５６組の他１個だけ
                    console.log("Hetero slot merge. "+eg[edgeLeft]);
                }
                Rotates.push("*不揃いを移動","*$"+cubeAdrs(56)+cubeAdrs(72),"f"); // ５６を７２へ
                Rotates.push("*$"+cubeAdrs(eg[edgeLeft]));   
                egMove(eg[edgeLeft],24); // 不揃いを22へ
                Rotates = Rotates.concat(regRot(("*エッジ並び変更"+edgeTwist).split(" ")));
            }
        }
        edge4(Ccolor,4);
        return false;
    }
    if (f==8) { // 中央寄せ終了
        Comment="エッジ中央寄せ完了！";
        next44();
        return false;
    }
// f=4,5
    $("#parity").attr('disabled',true);
    var rote,res;
    if ((f==4)&&(colorEg2(56,35)==colorEg2(61,40))) { // 結成１の中央キューブが５６組にあるので向き検査
        edge4(Ccolor,7);
    } else if ((f==5)&&(colorEg2(22,52)==colorEg2(61,40))) { // 結成２の中央キューブが５６組にあるので再構築
 　　　 $("#parity").attr('disabled',false);
        if (a[56]==a[23])  egSecond("*３連２解決 *$"+cubeAdrs(23)+cubeAdrs(53)+" L' F2 U' " + edgeTwist);
        else   egSecond("*３連再構築 *$"+cubeAdrs(61)+" U' R B U2 "+ edgeTwist);
        edge4(Ccolor,4);
    } else {
        res = 0;
        if      (f==4) res = knotMove(56,23,53); // 結成１へ準備
        else if (f==5) res = knotMove(52,3,103); // 結成２へ準備
        if (res<0) { // 既に配置（無い？）
            console.log("*既に配置されている "+turnN);
            if (f==4) edge4(Ccolor,5);
            if (f==5) edge4(Ccolor,8+res);
        } else edge4(Ccolor,f+1); // 5か6へ
    }
    return true;
}
function colorEdge(i) {
    var p1 = (eg[i]+eg[i+2])/2;
    var p2 = (eg[i+1]+eg[i+3])/2;
    return [a[p1]*a[p2]+a[p1]+a[p2],p1,p2];
}
function knotMove(p1,p3,p4) { // ３エッジパーツの中央を探して、p1色合わせの回転をする
    var c1=colorEg(p1),p2=-1,i,cmnt,ret;

    if ((colorEg2(p3,p4)==c1)&&(a[p1]==a[p3])) return -2;
    for (i=0;i<45;i+=4) {
        if (eg[i]==p1) continue;
        ret = colorEdge(i);
        if (c1!=ret[0]) continue;
        if (p3<10) p2 = a[ret[1]]==a[p1]?i:i+2;
        else       p2 = a[ret[2]]==a[p1]?i:i+2;
        break;
    }
    if (p2<0) console.log('Pair edge not found',p1,p2,p3);
    else {
        cmnt = "*エッジペア中央" + (p3>10?"前":"後") +
               " *$"+cubeAdrs(p1)+cubeAdrs(p3)+cubeAdrs(ret[1]) +
               NoRot + " " + (p3>10?move23[p2]:move03[p2]);
        if (opener && opener.document.getElementsByName('pythonQ')) {
            parent.ClipDT = cmnt.slice(18);
            opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = cmnt;
        }
        Rotates = Rotates.concat(regRot(cmnt.split(" ")));
    }
    return p2;
}
function edgeAll(n,ex=12) { // エッジ両端+中央の完了チェック(除:56エッジグループ+1）
    var i,ret;
    for (i=0;i<45;i+=4) {
        if ((i!=12)&&(i!=ex)) {
            if (a[eg[  i]]!=a[eg[i+2]]) break;
            if (a[eg[i+1]]!=a[eg[i+3]]) break;
            if (n==3) {
                if (a[eg[i]]!=a[(eg[i]+eg[i+2])/2]) break;
                if (a[eg[i+1]]!=a[(eg[i+1]+eg[i+3])/2]) break;
            }
        }
        if (i==44) return -1;
    }
    return i;
}
// const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6;
function cent6(Ccolor=0) {
    if ((Rotates.length>0)||(Counter>0)) {
        Tid = setTimeout("cent6("+Ccolor+")",NxPaus);
        return true;
    }
    var color=Ccolor,color=(color>15)?color-16:color,
        color4=color==0?White:color;
    if (Ccolor>16) // turn()後やN==4のrotationの継続
        if (centr(color4)) {
            setTimeout("cent6("+Ccolor+");",100);
            return;
        }
    if      (color==0)      centN("",White);
    else if (color==White)  centN("X2",Yellow);
    else if (color==Yellow) centN("z",Red); 
    else if (color==Red)    centN("X",Blue);
    else if (color==Blue)   centN("X",Orange);
    else if (color==Orange) {
        Comment="中央寄せ完了！";
        Center = true;
        turn("z");
        next44();
        return;
    }  // 
}
let NoRot = "";
let cr;
function centN(rot,color) { 
    // 各面へのターン用のHTMLの書き込みが早すぎないように。
    var t=(rot!="")?NxPaus+200:200;
    if (rot!="") setTimeout("turn('"+rot+"');",t);
    setTimeout("cent6("+(color+16)+");",t+500);
}
function centr(color) {
    var stp = parseInt(document.getElementById('stop').value);
    if (stp>0){
        if (turnN<stp) {
                NoRot = " *0c";
        } else if (turnN>=stp) {
                NoRot = "";
                pause();
        }
    }
    if  (N==4) return centr4(color);
    else              centr9(color);
    return false;
}
const block4 = new Array(7,9,17,19);
const block9 = new Array(7,8,9,12,14,17,18,19);
function centr9(color) {
// 5x5における中央９パーツを固めて、３ｘ３のセンターキューブとみなす
    var i,j,d,u,y,f,rot=""; // rotの回転記号は、大文字/小文字系で指定
    var cmnt="*中央寄せ(" + "<span style='color:" +
             ['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#808080'][color-2] +
             "; font-weight:300;'>"+((color==8)?"□":"■")+"</span>"+"橙緑赤青黄白白".charAt(color-2)+"面)";
    preRot = cmnt + NoRot.replace(" ",",");
//    if ((Rotates.length>0)||(Counter>0)) return true;
// 最初の白の面・赤の面でプレ処理をする
// 　側面の縦２～３個存在する列を、上面の０～１個の列に上げる
// ６色面に実行する（反映面を上面としcolorを引数としてcentr9が呼ばれた）
//　　回転中なら、trueで一旦戻る
//　　Yで４面廻す
//　　　Fで4回廻す
//　　　　・F面の67にcolorが来れば、
//　　　　　お迎え前に、反映面の7,17に色アリを優先で置き
//　　　　　お迎えを" l' U' l"で実施する
//　　　　・F面の69にcolorが来れば、
//　　　　　お迎え前に、反映面の9,19に色アリを優先で置き
//　　　　　お迎えを" r U r'"で実施する
//　　　Dで4回廻す
//　　　　・D面の142にcolorが来れば、
//　　　　  反映面の7,17に色アリを優先で置き
//　　　　　お迎えを" l'2 U' l2"で実施し、7,17の輪も戻る(底面のcolorが増える)
//　　　　・D面の144にcolorが来れば、
//　　　　  反映面の9,19に色アリを優先で置き
//　　　　　お迎えを" r2 U r'2"で実施し、9,19の輪も戻る(底面のcolorが増える)
//　　Yで４面廻す
//　　　Fで4回廻す
//　　　　・F面の62にcolorが来れば、
//　　　　　反映面の12に別色を置き
//　　　　　お迎えを" l' U' Mc' U l' U' Mc"で実施し、12の輪も戻る
//　　　　・F面の64にcolorが来れば、
//　　　　　反映面の14に別色を置き
//　　　　　お迎えを" r U Mc' U' r' U Mc"で実施し、14の輪も戻る
//　　　Dで4回廻す
//　　　　・D面の137にcolorが来れば、
//　　　　  反映面の12に別色を置き
//　　　　　お迎えを" l'2 U' Mc' U l'2 U' Mc"で実施し、12の輪も戻る
//　　　　・D面の139にcolorが来れば、
//　　　　  反映面の14に別色を置き
//　　　　　お迎えを" r2 U Mc' U' r'2 U Mc"で実施し、14の輪も戻る
//　　１面全終了なら、falseで戻る　

// 最初の白赤黄色の面でプレ処理をする
// 　側面の縦２～３個存在する列を、上面の０～１個の列に上げる
    if ((color==White)||(color==Red)||(color==Yellow)) // 「く」の字促成
        for (y=0;y<4;y++) {
            for (f=0;f<4;f++) {
                var cf = (a[57]==color?1:0)+(a[62]==color?1:0)+(a[69]==color?1:0);
                k=3,j=-1; for (i=0;i<4;i++) {
                    d = (a[7]==color?1:0)+(a[12]==color?1:0)+(a[17]==color?1:0);
                    if (d<k) { k=d; j=i; }
                    uu();
                }
                if (k>cf) {
                    while (j-->0) uu(),rot += ",U";
                    if (color==Yellow) rot += ",U2,ml,u2,Ml",u2(),ml(),u2(),Ml();
                    else               rot += ",ml", ml();
                }
            }
        }
    for (y=0;y<4;y++) { // センター９キューブの四つ角
        if ((a[57]==color)||(a[59]==color)||(a[67]==color)||(a[69]==color))
            for (f=0;f<4;f++) {
                rot += moveOne(color,"071767,ml,u,Ml");
                rot += moveOne(color,"091969,Mr,U,mr");
                ff(); rot += ",F";
            }
        if ((a[132]==color)||(a[134]==color)||(a[142]==color)||(a[144]==color))
            for (d=0;d<4;d++) {
                rot += moveOne(color,"0717D2,ml2,u,Ml2");
                rot += moveOne(color,"0919D4,Mr2,U,Mr2");
                dd(); rot += ",D";
            }
        fd(); rot += ",Y";
    }
    for (y=0;y<4;y++) { // センター９キューブの十字四つ
        if ((a[58]==color)||(a[62]==color)||(a[64]==color)||(a[68]==color))
            for (f=0;f<4;f++) {
                rot += moveOne(color,"121262,ml,u,mc,U,Ml,u,Mc");
                rot += moveOne(color,"141464,Mr,U,mc,u,mr,U,Mc");
                ff(); rot += ",F";
            }
        if ((a[133]==color)||(a[137]==color)||(a[139]==color)||(a[143]==color))
            for (d=0;d<4;d++) {
                rot += moveOne(color,"1212C7,ml2,u,mc,U,Ml2,u,Mc");
                rot += moveOne(color,"1414C9,Mr2,U,mc,u,mr2,U,Mc");
                dd(); rot += ",D";
            }
        // 　正面の4か所にcolorが無くなったら、側面を順送りに正面にする
        fd(); rot += ",Y";
    }
    rot = rot.replace(/,U,U,U,U/g,"").replace(/,F,F,F,F/g,"").replace(/,F,F,F/g,",f").
              replace(/,D,D,D,D/g,"").replace(/,Y,Y,Y,Y/g,"");
    console.log(rot);
//    kiir();
    if (opener && opener.document.getElementsByName('pythonQ')) {
        parent.ClipDT = rot;
        opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = preRot+rot;
    }
    i=0;block9.forEach(function(value, index, array) {
        if (a[value]==color) i++;
    });
    if (i<8) console.log("橙緑赤青黄白白".charAt(color-2)+"が９個になっていない");
    setRot(rewind(preRot+rot));
    return false;
}
function moveOne(color,str) {  
// str="071767,ml,u,Ml"  67にcolorが来れば、07,17にcolorが現れるまでU回転(rot入れとuu()実行)し
// rotに点滅アドレスと添付回転記号列を追加し、回転記号列の複数の回転関数を実行する。
// 07,17が同じ番号の時は、color以外があるまでU回転する。
    var u,rot="",rots=str.slice(7).split(","),
        tgt=((str.charAt(4)>"9")?-60:0)+ (str.charCodeAt(4)-48)*10 + str.charCodeAt(5)-48;
//    console.log(tgt,rots);
    while (a[tgt]==color) {
        var p1=parseInt(str.slice(0,2)),p2=parseInt(str.slice(2,4));
        u=4;
        if (p1==p2) { while ((u-->0)&&(a[p2]==color))              uu(),rot+=",U"; }
        else  { while ((u-->0)&&!((a[p1]==color)&&(a[p2]==color))) uu(),rot+=",U"; }
//        if (u>0) {
            rot += ",*$"+str;
            for (var turn in rots) {
                var t = rots[turn];
                "U"==t&&(uu()),"u"==t&&(ui()),
                "Mc"==t&&(Mc()),"mc"==t&&(mc()),
                "Mr"==t&&(Mr()),"mr"==t&&(mr()),
                "Ml"==t&&(Ml()),"ml"==t&&(ml()),
                "Mr2"==t&&(Mr(),Mr()),"mr2"==t&&(mr(),mr()),
                "Ml2"==t&&(Ml(),Ml()),"ml2"==t&&(ml(),ml());
            }
//        }
         console.log(p2,rot);
    }
    return rot;
}
function centr4(Ccolor) { // 4x4における中央4パーツを固めて、３ｘ３のセンターキューブとみなす
    var i,j,k,kk,save;
    preRot = NoRot;
    
    if ((Rotates.length>0)||(Counter>0)) {
    } else {
        if ((Ccolor==White)||(Ccolor==Red)) {  // 白か赤で、TOP面ゼロなら
            var c1=Ccolor,kmax=0,ki=-1;
            for (k=0;k<6;k++) {
                for (i=0,kk=0,j=1;i<4;i++,j*=2) kk += (a[cr[k*4+i]]==c1)?j:0;
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
        
        for (k=0,kk=0,j=1;k<4;k++,j*=2) kk += (a[cr[k]]==Ccolor)?j:0;
        if      ((kk==3)||(kk==10)||(kk==11))  preRot += " U";
        else if ((kk==2)||(kk==12)||(kk==14))  preRot += " U'";
        else if ((kk==1)||(kk==6)||(kk==7))    preRot += " U2";
        else if (kk==15)                     { return false; }
        if (kk%3==0) save = " U2 ";  // ２個連れを期待する
        else         save = " U ";
        return cntr3Srch(4, Ccolor, save);
    }
    return true;
}
const Pri=[0,3,2,9,1,5,7,13,4,10,6,14,8,12,11,15];
function cntr3Srch(st,c1,save) {  // 4x4
    var i,j,k,kk,svt=save,rot,roth,rev,maxi=0,kmax=0,vrot=new Array(6);
    var cmnt="*中央寄せ(" + "<span style='color:" +
             ['#FF8C00','#006400','#8B0000','#0000CD','#FFD700','#C0C0C0','#808080'][c1-2] +
             "; font-weight:300;'>"+((c1==8)?"□":"■")+"</span>"+"橙緑赤青黄白白".charAt(c1-2)+"面)";

    for (k=1;k<6;k++) {
        for (i=0,kk=0,j=1;i<4;i++,j*=2) kk += (a[cr[k*4+i]]==c1)?j:0;
        rot = " "+" LFRBD".charAt(k);
        if (((kk==4)||(kk==5)||(kk%3==0))&&(save==" U2 ")&&
            ((c1==White)||(c1==Red))) // 一気に左上がり縦戻しなし
             { rot += (kk==3)?"'":((kk==9)?"2":"");
               roth = ["","U b","l","U' f","U2 r","l2"][k];
               if ((kk>3)&&(kk<7)) rot = "";
               rev = "";
        } else { 
               roth = ["","U f","r","U' b","U2 l","r2"][k];              // 右上がり
               if      ((kk==1)||(kk==3)||(kk==5)||(kk==7))  rot += "";  // 時計
               else if ((kk==2)||(kk==6))                    rot += "2";
               else if ((kk==4)||(kk==12))                   rot += "'"; // 反時計
               else rot = "";
               rev = (k==5)?"r2":(roth.slice(-1)+"'");  //  縦戻しのターン
        }
        if (kk%3!=0) svt = " U ";  // UP面にてU2で期待されても、１個だけなのでUとする
        if (Pri[kk]>kmax) { kmax = Pri[kk]; maxi = k; }

        rot += " *$ " + roth + svt + rev;
        vrot[k] = rot;
    }
    if (maxi<=0) return -1;
    preRot += vrot[maxi].replace(" *$",(NoRot=="")?" *$"+cubeAdrs(cr[maxi*4+3]):"");

    Rotates = Rotates.concat([cmnt],regRot(preRot.trim().split(" ")));
//    console.log(maxi+','+preRot);
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
        else Face = "F", $("#hdnstop").hide(); 
    }
    kiirRotLayer(wholecube,99);
    kiir();
}
function pause(){
    if (Pause) Pause = false, $("#comment").html($("#comment").html().replace(" Pausing","")),turn("");
    else Pause = true, $("#comment").html($("#comment").html()+" Pausing");
}
function SftOmit(){
    var sw = $('input[name="noy"]:checked').is(':checked')? true:false;
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
    var rote, clen, clipSeq;
    if (!Pause) {
        if (speed==80) speed=40, NxPaus=500;
        else speed=80, NxPaus=1000;
    } else {
        navigator.clipboard.writeText(ClipDT);   
        $("#comment").html(ClipDT);
        return;
    }
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
        return '<div class="core" style="transform:'+trans+'"></div>';
    }
    if (n<5) {
        e==1&&(trans="translate3d(  3px,-72px,  0px) rotateX(-90deg)");
        e==6&&(trans="translate3d(  3px,-20px,  0px) rotateX(-90deg)");
        e==2&&(trans="translate3d(-24px,-46px,  0px) rotateY( 90deg)");
        e==4&&(trans="translate3d( 28px,-46px,  0px) rotateY( 90deg)");
        e==3&&(trans="translate3d(  3px,-46px, 26px) rotateX(0deg)");
        e==5&&(trans="translate3d(  3px,-46px,-26px) rotateX(0deg)");
        e==11&&(trans="translate3d(-22px,-46px,  0px) rotateY( 90deg)");
        e==12&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");
        e==13&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==14&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==15&&(trans="translate3d(  3px,-46px,  3px) rotateX(0deg)");
        e==16&&(trans="translate3d(  3px,-46px, -3px) rotateX(0deg)");
        e==10&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");
        e==21&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==26&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
        e==23&&(trans="translate3d(  3px,-46px,  0px) rotateX(0deg)");
        e==25&&(trans="translate3d(  3px,-46px,  0px) rotateX(0deg)");
        return '<div class="core" style="transform:'+trans+'"></div>';
    }
    e==1&&(trans="translate3d(  3px,-78px,  0px) rotateX(-90deg)");
    e==6&&(trans="translate3d(  3px,-10px,  0px) rotateX(-90deg)");
    e==2&&(trans="translate3d(-32px,-45px,  0px) rotateY( 90deg)");
    e==4&&(trans="translate3d( 36px,-45px,  0px) rotateY( 90deg)");
    e==3&&(trans="translate3d(  3px,-45px, 33px) rotateX(0deg)");
    e==5&&(trans="translate3d(  3px,-45px,-33px) rotateX(0deg)");
    e==11&&(trans="translate3d(-34px,-45px,  0px) rotateY( 90deg)"); // 2
    e==12&&(trans="translate3d( 12px,-45px,  0px) rotateY( 90deg)"); // 4
    e==13&&(trans="translate3d(  3px,-56px,  0px) rotateX(-90deg)"); // 1
    e==14&&(trans="translate3d(  3px,-32px,  0px) rotateX(-90deg)"); // 6
    e==15&&(trans="translate3d(  3px,-44px, 11px) rotateX(0deg)");   // 3
    e==16&&(trans="translate3d(  3px,-44px,-11px) rotateX(0deg)");   // 5
    e==17&&(trans="translate3d(-10px,-44px,  0px) rotateY( 90deg)");   // Mc
    e==10&&(trans="translate3d(  3px,-46px,  0px) rotateY( 90deg)");
    e==21&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
    e==26&&(trans="translate3d(  3px,-46px,  0px) rotateX(-90deg)");
    e==23&&(trans="translate3d(  3px,-46px,  0px) rotateX(0deg)");
    e==25&&(trans="translate3d(  3px,-46px,  0px) rotateX(0deg)");
    return '<div class="core" style="transform:'+trans+'"></div>';
}
function css33(opt=1) {
    if (Fix44) return;
    document.getElementById("dynaCSS").href="css/RBstyle43.css";
    if (opt==1) N = 3;
}
function css44(opt=1) {
    if (Fix33) return;
    document.getElementById("dynaCSS").href="css/RBstyle44.css";
    if (opt==1) { N = 4; kiir(4); }
}
function css55(opt=1) {
    if (Fix33) return;
    document.getElementById("dynaCSS").href="css/RBstyle55.css";
    if (opt==1) { N = 5; kiir(5); }
}
function kiir(n=N,so=false){
    var r = "";
    if (n==0) {  // 3x3 on cubes:96  charAt(0) is "f" or numeric
        css33();
        r =                               creFaces( 1,  0,-60,-30,"X(-90deg)");
        r+=unfold(17,"",4).charAt(0)!="f"?creFaces(10,-15,-45,-30,"Y(-90deg)"):creFaces(210,-75,-45, -30,"Y(-90deg)");
        r+=                               creFaces(19,  0,-45, 45,"X(0deg)");
        r+=unfold(49,"",4).charAt(0)!="f"?creFaces(28, 75,-45, 30,"Y(-90deg)"):creFaces(228,185,-45,  30,"Y(-90deg)");
        r+=unfold(65,"",4).charAt(0)!="f"?creFaces(37, 60,-45,-45,"X(0deg)"):  creFaces(237,100,-45,-185,"X(0deg)");
        r+=unfold(81,"",4).charAt(0)!="f"?creFaces(46,  0, 30, 30,"X(-90deg)"):creFaces(246,  0, 70,  30,"X(-90deg)");
    } else if (n==1) {  // 3x3 on cubes:150  charAt(0) is "f" or numeric
        css33();
        r =                               creFaces( 1,  0,-60,-30,"X(-90deg)");
        r+=unfold(26,"",5).charAt(0)!="f"?creFaces(10,-15,-45,-30,"Y(-90deg)"):creFaces(210,-75,-45, -30,"Y(-90deg)");
        r+=                               creFaces(19,  0,-45, 45,"X(0deg)");
        r+=unfold(76,"",5).charAt(0)!="f"?creFaces(28, 75,-45, 30,"Y(-90deg)"):creFaces(228,185,-45,  30,"Y(-90deg)");
        r+=unfold(101,"",5).charAt(0)!="f"?creFaces(37, 60,-45,-45,"X(0deg)"):  creFaces(237,100,-45,-185,"X(0deg)");
        r+=unfold(126,"",5).charAt(0)!="f"?creFaces(46,  0, 30, 30,"X(-90deg)"):creFaces(246,  0, 70,  30,"X(-90deg)");
    } else if (n==3) {
        r =                               creFaces( 1,  0,-60,-30,"X(-90deg)");
        r+=unfold(10,"",3).charAt(0)!="f"?creFaces(10,-15,-45,-30,"Y(-90deg)"):creFaces(210,-75,-45, -30,"Y(-90deg)");
        r+=                               creFaces(19,  0,-45, 45,"X(0deg)");
        r+=unfold(28,"",3).charAt(0)!="f"?creFaces(28, 75,-45, 30,"Y(-90deg)"):creFaces(228,185,-45,  30,"Y(-90deg)");
        r+=unfold(37,"",3).charAt(0)!="f"?creFaces(37, 60,-45,-45,"X(0deg)"):  creFaces(237,100,-45,-185,"X(0deg)");
        r+=unfold(46,"",3).charAt(0)!="f"?creFaces(46,  0, 30, 30,"X(-90deg)"):creFaces(246,  0, 70,  30,"X(-90deg)");
    } else if ((n==2)||(n==4)) { // 2x2 on cubes:96  charAt(0) is "f" or numeric
        r =                               creFaces( 1,  3,-59,-39,"X(-90deg)",4);
        r+=unfold(17,"",4).charAt(0)!="f"?creFaces(17,-10,-46,-39,"Y(-90deg)",4):creFaces(217,-91,-13, -52,"Y(-90deg)",4);
        r+=                               creFaces(33,  3,-46, 52,"X(0deg)",4);
        r+=unfold(49,"",4).charAt(0)!="f"?creFaces(49, 94,-46, 39,"Y(-90deg)",4):creFaces(249,185,-13,  26,"Y(-90deg)",4);
        r+=unfold(65,"",4).charAt(0)!="f"?creFaces(65, 81,-46,-52,"X(0deg)",4):  creFaces(265,118,-13,-215,"X(0deg)",4);
        r+=unfold(81,"",4).charAt(0)!="f"?creFaces(81,  3, 45, 39,"X(-90deg)",4):creFaces(281,-26,118,  13,"X(-90deg)",4);
    } else if (n==5) {
        r =                               creFaces( 1,  3,-58,-39,"X(-90deg)",5);
        r+=unfold(26,"",5).charAt(0)!="f"?creFaces(26, -9,-46,-41,"Y(-90deg)",5):creFaces(226,-91,-13, -52,"Y(-90deg)",5);
        r+=                               creFaces(51,  3,-46, 59,"X(0deg)",5);
        r+=unfold(76,"",5).charAt(0)!="f"?creFaces(76, 102,-46, 47,"Y(-90deg)",5):creFaces(276,185,-13,  26,"Y(-90deg)",5);
        r+=unfold(101,"",5).charAt(0)!="f"?creFaces(101,89,-46,-52,"X(0deg)",5):  creFaces(301,118,-13,-200,"X(0deg)",5);
        r+=unfold(126,"",5).charAt(0)!="f"?creFaces(126, 3, 53, 47,"X(-90deg)",5):creFaces(326,-26,118,  13,"X(-90deg)",5);
    }
    $("#cubeFields").html(r);
    if (so) return;
    $("#rotLayer").html("")
    $(".mezo span").css("display",Disp);
}
const CV2244 = [1,1, 5,17, 9,33,13,49,17,65,21,81];
const CV3344 = [1,1,10,17,19,33,28,49,37,65,46,81];
const CV3355 = [1,1,10,26,19,51,28,76,37,101,46,126];
function creFaces(no,x,y,z,rotate,n=3) {
    var r="",d=n==4?26:n==5?22:30,i,j,x1,z1,y4,z4,udfbrl="",j1=0,clsM,clsN,no3;
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
            no3 = (no>200)?no-200:no;
            clsN = no3+ i*n+j;
            if (n==2) { j1 += j; clsM = CV2244[CV2244.indexOf(no3)+1] + j1; }
            if (n==3) { j1 += j; clsM = CV3344[CV3344.indexOf(no3)+1] + j1; }
            else                 clsM = clsN;
            r += '<div class="mezo'+ unfold(clsM," szin",(n==5)?5:4)+a[clsM]+ ' field mezo" ' + 'style="transform:'+segs+'">'+
                 (Disp=="none"?"":'<span style="vertical-align:middle; font-size:x-small; font-weight:bold">'+
                                  (Face=="F"?"&nbsp;"+udfbrl:clsN) +'</span>')+'</div>';
        }
    }
    return r;
}            
function kiirRotLayer(r,e,n=N){  // 書き直しのレイヤー選択
    if (Counter<0) return;
    var odiv, i, s, t, lo="", rr=r, cc=r, ra, flip;
    if (typeof(r[0])=='object') rr = r[0].concat(r.slice(1)), cc = rr;
    flip = FaceF; FaceF=""; // 回転中は鏡部分を畳んで表示することに決めた（V5）
    $("#rotLayer").html($("#cubeFields").html());
    kiir(N,true);           // 畳んだ状態での#cubeFieldを新規作成
    FaceF = flip;
    for(i=0;i<rr.length;i++) {
        t = "#cubeFields .mezo"+ rr[i];
        lo += '<div class="mezo'+ rr[i] + " szine" + a[cc[i]] +
                  ' layer mezo" style="transform:' + $(t).css('transform') + '">' +
                  $(t).html() + '</div>';
    }
    $("#cubeFields").html($("#rotLayer").html());
    for(i=0;i<rr.length;i++) {
        s = unfold(rr[i]," szin",(n==5)?5:4);  // unfoldは常にツール主体の配列サイズ
        t = "#cubeFields .mezo"+ s.slice(0,-6);
        if ((s.charAt(0)=="f")&&(
            (e==2)&&(layerl[0][0]<=rr[i])&&(layerl[0][8]>=rr[i])||
            (e==5)&&(layerb[0][0]<=rr[i])&&(layerb[0][8]>=rr[i])||
            ((e==6)||(e==99))&&(layerd[0][0]<=rr[i])&&(layerd[0][8]>=rr[i])||
            (e==4)&&(layerr[0][0]<=rr[i])&&(layerr[0][8]>=rr[i])))
             lo += '<div class="mezo'+ s + a[cc[i]] +
                   ' layer mezo" style="transform:' + $(t).css('transform') + '">' +
                   $(t).html() + '</div>';
        $(t).hide();
    }
    $("#rotLayer").html(lo);
    if (e==99) return; 
    const core_e1 =[0,1,2,3,4,5,6,2,1,3,10,11,12,13,14,15,16,17,0,0,0,21,22,23,24,25,26];
    const core_e2 =[0,0,0,0,0,0,0,4,6,5, 0, 2, 4, 1, 6, 3, 5, 0,0,0,0, 0, 0, 0, 0, 0, 0];
    odiv = crtDiv(core_e1[e],n)+(core_e2[e]>0?crtDiv(core_e2[e],n):"");
    $("#cubeFields").append(odiv);
    $("#rotLayer").html(lo+odiv);
    $(".mezo span").css("display",Disp);
}
function unfold(i,szin,n=N) {
    var is = i + szin;
    if (FaceF=="") return is+"e";
    if (cubey<355) return ((i>n*n)&&(i<n*n*2+1)||(i>n*n*4))?FaceF+is+"f":is+"e";
    if (cubey>365) return (i>n*n*3)?FaceF+is+"f":is+"e";
    return ((i>n*n)&&(i<n*n*2+1)||(i>n*n*3))?FaceF+is+"f":is+"e";
}

let cubex=-20, cubey=330, cubez=0, segs="yo";
let Pause=false, speed=80, NxPaus=1000;
let a=new Array(), s=new Array();
let Maprote = new Map([["F","FRBL"], ["f","frbl"],["L","LFRB"], ["l","lfrb"],
                       ["B","BLFR"], ["b","blfr"],["R","RBLF"], ["r","rblf"],
                       ["M","MSms"], ["m","msMS"],["S","SMsm"], ["s","smSM"]]);
let MC=new Array([0],[1,7,9,3], [2,4,8,6],[3,1,7,9],[4,8,6,2],[5,5,5,5],
                 [6,2,4,8],[7,9,3,1], [8,6,2,4],[9,3,1,7],[10,19,28,37],
                 [11,20,29,38],[12,21,30,39],[13,22,31,40],[14],[15,24,33,42],[16],[17],[18],[19,28,37,10],
                 [20,29,38,11], [21,30,39,12],[22,31,40,13], [23,32,41,14],
                 [24,33,42,15],[25,34,43,16],[26,35,44,17],[27,36,45,18],[28,37,10,19], [29,38,11,20],
                 [30,39,12,21],[31,40,13,22],[32],[33,42,15,24], [34,43,16,25],
                 [35,44,17,26],[36],[37,10,19,28],[38,11,20,29], [39,12,21,30],
                 [40,13,22,31],[41,14,23,32],[42,15,24,33],[43,16,25,34],[44],[45,18,27,36],[46,48,54,52],
                 [47,51,53,49],[48,54,52,46],[49],[50],[51],[52,46,48,54],[53],[54,52,46,48]);
let MC4=new Array([0]);
function Nc(no,n=3) {
    if (N==2) {
        if (RotSft==0) return a[layer24[no]];
        return a[layer24[MC[no][RotSft]]];
    } if (n==3) {
        if (RotSft==0) return a[layer34[no]];
        return a[layer34[MC[no][RotSft]]];
    } else {
        if (RotSft==0) return a[no];
        console.log('%c【Trial Fault!! 4x4 5x5 RotSft:'+RotSft+'】',"color:red");
    }
}
let N = 5; Disp="none", Face="F", FaceF="", Counter=0;
let Comment="", Tid=null,Tid2=null, turnN=1, ClipDT="", W=null;
let Rotates = new Array(), Tlog = 0, Solution = "";
let RotSft=0, Urot = "", Urote = "";
let Fix33=false, Fix44=false, Auto=true;

function SelCubeT(m) {
    if (m) {
        Auto = false;
        N = m;
    }
    $("#statusBlk").html(saveSTinfo);
    initnotscrambled(m);
}
function initnotscrambled(m=5){
    var n = m, i, j;
    if (Auto) {
        if (location.search.slice(0,10)=="?repeat2x2") N=2,n=2;
        else if (location.search.slice(0,10)=="?repeat3x3") N=3,n=3;
        else if (location.search.slice(0,4)=="?4x4") {
                  $("#toggle3").prop("checked", true).change();
                  SelCubeT(4); return; }
        if (n==2) $("#toggle1").prop("checked", true).change();
        if (n==3) $("#toggle2").prop("checked", true).change();
    }
    if ((m>=4)&&(N!=m)) n = N; 
    if (window.outerWidth<500) window.resizeTo(380,800);
    else                       window.resizeTo(640,600);
    speed=80; if (NxPaus<1100) NxPaus=1000;
    if (turnN==16) NxPaus=1500;
    Disp="none"; Pause=false; Face="F"; Comment="";
    RotSft=0;Rotates=[]; turnN=1; Solution = "";
    clearTimeout(Tid); clearTimeout(Tid2);
    RotOmt = $('input[name="noy"]').is(':checked')? 1:0;
    $("#all3x3").show();
    if (n>2) {
        $("#solve3").attr('disabled',true);
        $("#scrm3x3").html('スクランブル');
        $("#solveX").html('お告げソルブ');
        $('input:radio[name="sayu"]').val(["R"]); 
        $("#parity").attr('disabled',true);
        if (n==3) $("#solve3").attr('disabled',false);  // 3x3論理
        $("#solve4").attr('disabled',false);
    } else {
        $("#proc00").html('完全白一面形成');
        $("#proc04").html('隣接/&nbsp;対角交換');
        $("#proc16").html('黄色面の下向き');
        $("#proc26").html('６面の最終検査');
        $("#proc32").html('完成おめでとう');
        $('input:radio[name="sayu"]').val(["L"]); 
        if (RotOmt==1) $("input[name='noy']").prop("checked", false).change();
    }
    $("#comment").html("");  $("#turn").html("&nbsp;"); $("#rotate").html("&nbsp;");
    initCube(n); Cool = 0;
    if ($("#display").hasClass('is-visible')) sceneOFF(setCube);
    if ((window.name=="cube3dg")||(window.name=="cube3dh")) setTimeout("checkRot()",100);
    if (Auto & (location.search.slice(0,7)=="?repeat")) {
         accel(); Cool=1; allTest();
    }
}
function initCube(m=4) {
    var i,j;
    var n = (m==2)?4:m;
    $("#not2x2").hide();
    $("#STnot2x2").hide();
    
    if (N>=4) {
        if (N==4) css44(0),layers44();
        else      css55(0),layers55();
        $("#not2x2").show();
        $("#STnot2x2").show();
    }
    if ((m==0)||(m==3)) {
            n = 4; m = 0;
            css33(1),layers44();
            $("#all3x3").show();
    }
    else if (m==2){
            n = 4; m = 4;
            css44(0),layers44();
        }
    Center = false; RotSft=0; Rotates=[];a=new Array();
    for(a[0]=0,j=0;6>j;j++)for(i=1;n*n+1>i;i++)a[i+n*n*j] = (j==0)?8:j+1;
    kiirRotLayer(wholecube,99);
    kiir(m); NoRot = "";
    $(".mezo span").css("display",Disp);

    $("#statusBlk").hide();
    if (N>=4) $("#statusBlk").css("height","200px");
    else      $("#statusBlk").css("height","130px");
    for (i=0;i<45;i+=2) $("#proc"+("0"+i).slice(-2)).attr('disabled',true); 
}
let Center = false; Cool = 0, CoolTM = 0;
function allTest() {
        flushB(150,8,"#scrm3x3");
        Auto = true;
        scramble();
        if (document.opt.noy.checked) NoRot = " *0c";
        Cool++;
        $("#statusBlk").show();
        if (N<3) NaviIn();
        else next44();
}
function faceTest() {
    var p,b=(N==5)?8:4;
    for (p in layeru[0].slice(0,9)) if (a[layeru[0][p]]!=a[c[b*0]]) return layeru[0][p];
    for (p in layerd[0].slice(0,9)) if (a[layerd[0][p]]!=a[c[b*5]]) return layerd[0][p];
    for (p in layerl[0].slice(0,9)) if (a[layerl[0][p]]!=a[c[b*1]]) return layerl[0][p];
    for (p in layerr[0].slice(0,9)) if (a[layerr[0][p]]!=a[c[b*3]]) return layerr[0][p];
    for (p in layerf[0].slice(0,9)) if (a[layerf[0][p]]!=a[c[b*2]]) return layerf[0][p];
    for (p in layerb[0].slice(0,9)) if (a[layerb[0][p]]!=a[c[b*4]]) return layerb[0][p];
    return 0;
}
function waitFin(cnt=20) {
     var i, log = '【Trial count:'+Cool+' Moves:'+turnN+'】';

    if (Comment.indexOf(' Fin')>0) {
          var result = faceTest();
          console.log(log);
          if (turnN>=800) console.log(ClipDT);
          if (opener && opener.document.getElementsByName('pythonQ')) 
               opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML = log;
          Disp="none"; Pause=false; Face="F"; RotSft=0;Rotates=[]; turnN=1;
          clearTimeout(Tid); clearTimeout(Tid2);
          if (result!=0) { 
              Auto = false;
              console.log('%c【Trial Fault!! center:'+result+'】',"color:red");
          } else {
              console.log("%c"+log,"color:green");
              setTimeout('allTest();',cnt*100);
          }
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
        if (opener && opener.Rotates.length>0) {
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
                if (N==4) css44();
                if (N==5) css55();
                if ((Cool>0)&&(rote=="*Fin")) waitFin();
            }
            else if (rote.charAt(1)=="*") { // step reset 
                Comment = rote.slice(2);
                turnN=1; check33(); kiir();}
            else if ((rote.charAt(1)=="$")||(rote.charAt(1)=="#")) { // flushing important post #mmnn.... with 4x4 No.
                $("#comment").html(Comment);
                cubeFlush(rote);
                Tid2 = setTimeout("checkRot()",NxPaus);
                return; }
            else if (rote.charAt(1)=="+") { // virtual Y rotation convert 
                RotSft = parseInt(rote.slice(2));} 
            else if (rote.charAt(1)=="-") { // Turn count decrement 
                turnN -= parseInt(rote.slice(2));} 
            else if (rote.charAt(1)=="0") { // Cube setup without rotation
                var i,j;
                if (rote.length==2) initCube(N);
                Counter = -1;  // NO rotation mode
                while (Rotates.length>0) {
                    var rot = Rotates.shift();
                    if (rot.charAt(0)=="*") {
                        if (rot.length==1) break;
//                        else Comment = rot.slice(1); 
                    } else {
                        if (rote.charAt(2)!='*') turnN++;   
                        turnStart(rot);
                    }
                }
                Counter = 0;  // Nomal rotation mode
                kiirRotLayer(wholecube,99);
                kiir();
            } 
            else {
                Comment = (Rotates.length==0)?"":rote.slice(1);
                var title = Comment.split("|");
                if (title.length>1)
                    Comment = "<span title='"+ title[1]+"'>"+title[0]+"</span>";
                $("#rotate").html("");
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
            if (turnN>999){
                pause();
                console.log('%c【 Moves Count Over 999!! 】',"color:red");
            }
            Urot = rote;
            Urote = dispRote(rote);
            if (Urote) turnStart(Urote);
        }
    }
    if (Comment.indexOf(" Fin")<0) Tid2 = setTimeout("checkRot()",NxPaus);
}
function dispRote(rot) {
    var rote = rot;
    if (Rotates[0]) {
        if ((rot.length==1)&&(rot==Rotates[0])) {
            rote = Rotates.shift() + "2";  // おまとめ回転なので纏める。
            console.log('Joint '+rot+rot);
        } else if ((rot+Rotates[0]=="Uu")||(rot+Rotates[0]=="uU")||(rot+Rotates[0]=="U2U2"))  {
            var rot2 = Rotates.shift();  // 無駄な正逆回転なので捨てる。
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
//    setRot(rvsRot);
//    console.log(Rotates);
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
const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6,ccoW=new Array(22,38,54,70,22),ccoY=new Array(22,70,54,38,22);
let c,eg;

function Solve() {
    if (N<4) { NaviIn(0); return; }
    $("#solve4").attr('disabled',true);
    for (i=0;i<45;i+=2) $("#proc"+("0"+i).slice(-2)).attr('disabled',true); 
    $("#statusBlk").show();
    turnN = 1;
    next44();
}
function check33() {  // 3x3論理で解ける形かチェックする
    if ((N<4)||(Counter>0)) return;
    var i,j,diff; 
    $("#solve3").attr('disabled',true);
    $("#parity").attr('disabled',true);
    if (N==4) {
        for (i=0;i<24;i+=4) if ((a[c[i]]!=a[c[i+1]])|| (a[c[i+1]]!=a[c[i+3]])) return false;
        if (a[6]==White)       { for (i=0;i<4 ;i++)  diff=a[ccoW[i+1]]-a[ccoW[i]];if((diff!=1)&&(diff!=-3))return true; }
        else if (a[6]==Yellow) { for (i=0;i<4 ;i++)  diff=a[ccoY[i+1]]-a[ccoY[i]];if((diff!=1)&&(diff!=-3))return true; }
        for (i=16;i<32;i+=4)  { if (pairchk(i,"  ",6))  return true; }
        for (i=32;i<48;i+=4)  { if (pairchk(i,"XX",86)) return true; }
        for (i=0;i<8;i+=4)    { if (pairchk(i,"zZ",75)) return true; }
        for (i=8;i<16;i+=4)   { if (pairchk(i,"zZ",38)) return true; }
            function pairchk(i,bor,center) {
                if ((a[eg[i]]!=a[eg[i+2]])||(a[eg[i+1]]!=a[eg[i+3]])) return true;
                return false; 
            }
    } else {
        for (j=0;j<6;j++) {
            for (i=0;i<8;i++) if (a[j*25+13]!=a[c[8*j+i]]) return true;    // false;
            if ((a[j*25+ 2]!=a[j*25+ 3])||(a[j*25+ 2]!=a[j*25+ 4])||
                (a[j*25+ 6]!=a[j*25+11])||(a[j*25+ 6]!=a[j*25+16])||
                (a[j*25+10]!=a[j*25+15])||(a[j*25+10]!=a[j*25+20])||
                (a[j*25+22]!=a[j*25+23])||(a[j*25+22]!=a[j*25+24])) return true;
        }
    }
    // センター連結Cubeの３ｘ３扱いがＯＫ
    $("#solve3").attr('disabled',false);
    return false;
//  allTest(); // テスト用
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
        if($("#solve3").prop('disabled')==false) {
            flushB(200); NaviIn(1);
            return;
        }
    }
    var i,j=0,s1,t1,lo="",kuro="#888",div,newcolor="transparent";
    for (i=0;i<c.length;i+=4)
      if ((a[c[i]]!=a[c[i+1]])||(a[c[i+1]]!=a[c[i+3]]))
         for (j=0;j<4;j++) {
            s1 = unfold(c[i+j]," szin");
            t1="#cubeFields .mezo"+ s1.slice(0,-6);
            lo += '<div class="mezo'+ s1+ 0 +' layer mezo" style="transform:'+$(t1).css('transform')+'"></div>';
            $(t1).css("background-color",newcolor);
         }
      if (lo=="") {
          $("#proc42").attr('disabled',false);
          console.log('%cCenter moves:'+(turnN-1),"color:green");
          Comment = ""; 
          if($("#solve3").prop('disabled')==false) {
              flushB(200); NaviIn(1);
          } else edge4(White);
          return; 
      }
    if (!navigator.userAgent.match(/iPhone|Android.+/)) speed=40,NxPaus=500;
    $("#proc40").attr('disabled',false);
    if (N==4) turn("");
    if (cent6()) return;

    $("#solve4").attr('disabled',false);
    $("#rotLayer").html(lo);
    flush(200);
}
function flush(tm,cnt=8) {
    if (Counter<0) return;
    Counter++;
    setTimeout(function(){
        $("#rotLayer").toggle();
        cnt>Counter?flush(tm,cnt):($("#rotLayer").html(""), kiir(),Counter=0)},tm); // 
}
let CounterB = 0;
function flushB(tm,cnt=8,id="#solve3") {
    CounterB++;
    setTimeout(function(){
        if(id=="#parity") {
            $(id).css('background-color',CounterB%2?'#ce4b42':'#ccc');
            cnt>CounterB?flushB(tm,cnt,id):($(id).css('background-color',""),CounterB=0,$("#proc32").attr('disabled',false));
        } else {
            $(id).css('background-color',CounterB%2?'#ce4b42':'#ccc');
            cnt>CounterB?flushB(tm,cnt,id):($(id).css('background-color',""),CounterB=0);
        }},tm); // 
}
function NaviIn(n=0) { // 2x2,3x3型のナビゲーション
    console.log(ClipDT);
    Solution = "";
    $("#statusBlk").show();
    RotOmt = $('input[name="noy"]:checked').is(':checked')? 1:0;
    SolveNavi(n);
    return true;
}
let ov100 = "@ABCDEFGHI";
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
     function dl_add(cc,ofs) { // cc=1:Single 2:4x4Eg 3:5x5Eg 4:Center
         var cn,ccc,egm=(cc==3)?(ofs&0xfc)+(ofs&0x01):ofs; // egmはeg４個組の正規開始位置で補正
         for (var ci=cc,oft=egm;ci>0;ci--) {
             cn = (cc==1)?ofs:(cc==4)?((N==5)?c[ofs+[6,4,3,1][ci-1]]:c[oft++]):eg[oft++];
             if ((cc==3)&&(ci==2)) cn=(eg[egm]+eg[egm+2])/2;
             s1 = unfold(cn," szin", (N==3)?4:N);
             t1="#cubeFields .mezo"+ s1.slice(0,-6);
             lo += '<div class="mezo'+s1+0+' field mezo" style="transform:'+
                   $(t1).css('transform')+ ';"></div>';
             $(t1).css("background-color",newcolor);
             if (ci==4) {
                 ccc=(c[ofs+3]+c[ofs+4])/2;
                 s2 = unfold(ccc," szin", (N==3)?4:N);
                 t2="#cubeFields .mezo"+ s2.slice(0,-6);
                 lo += '<div class="mezo'+s2+0+' field mezo" style="transform:'+
                   $(t2).css('transform')+ ';"></div>';
                 $(t2).css("background-color",newcolor);
             }
         }
         return cc;
     }
    while (n<rote.length-1) {
         var np = 0, no;   // $xB0より上は、$x30で解釈して100を足す
         no = ((rote.charAt(n)>"9")?-60:0)+ (rote.charCodeAt(n)-48)*10 + rote.charCodeAt(n+1)-48;
         if (rote.charAt(1)=="#") { // 仮想3x3でのキューブ番号
             cn = layer34[MC[no][RotSft]];
             cof= c.indexOf(cn); if (cof>=0) np = dl_add(4,cof);
             eof= eg.indexOf(cn);if (eof>=0) np = dl_add((N==5)?3:2,eof);
         }
         else if (RotSft==0) cn = no;
         else cn = MC4[no][RotSft];
         if (np==0) np = dl_add(1,cn);
         n += 2;
    }
    $("#rotLayer").html(lo); flush(200,(NxPaus==1000)?cnt:4);
    return;
}
function facerotate(a, tm) {
    if (Counter<0) return;
    var w = tm * 10 * Counter;
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
    Counter++,10>Counter?facerotate(a, tm):($("#rotLayer").html(""),$("#rotLayer").css("transform","rotateY(0deg)"),  //  
    $("#rotLayer").css("transform-origin","50% 50%"),kiir(),Counter=0,turnN+=1)},speed)}
                                  
function turnStart(a){
    if (a=="") return;
    if (N==2) a = a.slice(0,1)+"w"+a.slice(1);
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
"Y"==a&&(kiirRotLayer(wholecube,99),facerotate(111,1),fd()),"y"==a&&(kiirRotLayer(wholecube,99),facerotate(112,1),fd3()),
"Z"==a&&(kiirRotLayer(wholecube,99),facerotate(121,1),fd(),bor(),fd3()),"z"==a&&(kiirRotLayer(wholecube,99),facerotate(122,1),fd3(),bor(),fd()),
"M"==a&&(kiirRotLayer(layerm,7),facerotate(71,1),Ml(),Mc(),mr()),"m"==a&&(kiirRotLayer(layerm,7),facerotate(72,1),ml(),mc(),Mr()),
"E"==a&&(kiirRotLayer(layere,8),facerotate(81,1),di(),uu(),fd2(),fd()),"e"==a&&(kiirRotLayer(layere,8),facerotate(82,1),dd(),ui(),fd()),
"S"==a&&(kiirRotLayer(layers,9),facerotate(91,1),fi(),bb(),fd(),bor(),fd2(),fd()),"s"==a&&(kiirRotLayer(layers,9),facerotate(92,1),ff(),bi(),fd2(),fd(),bor(),fd()),
"Mc"==a&&(kiirRotLayer(layermc,17),facerotate(71,1),Mc()),"mc"==a&&(kiirRotLayer(layermc,17),facerotate(72,1),mc()),
"Mu"==a&&(kiirRotLayer(layermu,13),facerotate(11,1),Mu()),"mu"==a&&(kiirRotLayer(layermu,13),facerotate(12,1),mu()),
"Mr"==a&&(kiirRotLayer(layermr,12),facerotate(41,1),Mr()),"mr"==a&&(kiirRotLayer(layermr,12),facerotate(42,1),mr()),
"Md"==a&&(kiirRotLayer(layermd,14),facerotate(61,1),Md()),"md"==a&&(kiirRotLayer(layermd,14),facerotate(62,1),md()),
"Mf"==a&&(kiirRotLayer(layermf,15),facerotate(31,1),Mf()),"mf"==a&&(kiirRotLayer(layermf,15),facerotate(32,1),mf()),
"Mb"==a&&(kiirRotLayer(layermb,16),facerotate(51,1),Mb()),"mb"==a&&(kiirRotLayer(layermb,16),facerotate(52,1),mb()),
"Ml"==a&&(kiirRotLayer(layerml,11),facerotate(21,1),Ml()),"ml"==a&&(kiirRotLayer(layerml,11),facerotate(22,1),ml()),
"Lw"==a&&(kiirRotLayer(layerlw,10),facerotate(21,1),ll(),Ml()),"lw"==a&&(kiirRotLayer(layerlw,10),facerotate(22,1),li(),ml()),
"Rw"==a&&(kiirRotLayer(layerrw,10),facerotate(41,1),rr(),Mr()),"rw"==a&&(kiirRotLayer(layerrw,10),facerotate(42,1),ri(),mr()),
"Uw"==a&&(kiirRotLayer(layeruw,21),facerotate(11,1),uu(),Mu()),"uw"==a&&(kiirRotLayer(layeruw,21),facerotate(12,1),ui(),mu()),
"Dw"==a&&(kiirRotLayer(layerdw,26),facerotate(61,1),dd(),Md()),"dw"==a&&(kiirRotLayer(layerdw,26),facerotate(62,1),di(),md()),
"Fw"==a&&(kiirRotLayer(layerfw,23),facerotate(31,1),ff(),Mf()),"fw"==a&&(kiirRotLayer(layerfw,23),facerotate(32,1),fi(),mf()),
"Bw"==a&&(kiirRotLayer(layerbw,25),facerotate(51,1),bb(),Mb()),"bw"==a&&(kiirRotLayer(layerbw,25),facerotate(52,1),bi(),mb()),
"Xw"==a&&(kiirRotLayer(wholecube,99),facerotate(101,1),bor2(),bor()),"xw"==a&&(kiirRotLayer(wholecube,99),facerotate(102,1),bor()),
"Yw"==a&&(kiirRotLayer(wholecube,99),facerotate(111,1),fd()),"yw"==a&&(kiirRotLayer(wholecube,99),facerotate(112,1),fd3()),
"Zw"==a&&(kiirRotLayer(wholecube,99),facerotate(121,1),fd(),bor(),fd3()),"zw"==a&&(kiirRotLayer(wholecube,99),facerotate(122,1),fd3(),bor(),fd()))
}
function turnStart2(a){
    0>=Counter&&(
"U2"==a&&(kiirRotLayer(layeru,1),facerotate(11,2),u2()     ),"u2"==a&&(kiirRotLayer(layeru,1),facerotate(12,2),u2()  ),
"R2"==a&&(kiirRotLayer(layerr,4),facerotate(41,2),ri(),ri()),"r2"==a&&(kiirRotLayer(layerr,4),facerotate(42,2),ri(),ri() ),
"D2"==a&&(kiirRotLayer(layerd,6),facerotate(61,2),dd(),dd()),"d2"==a&&(kiirRotLayer(layerd,6),facerotate(62,2),di2() ),
"F2"==a&&(kiirRotLayer(layerf,3),facerotate(31,2),ff(),ff()),"f2"==a&&(kiirRotLayer(layerf,3),facerotate(32,2),fi(),fi()),
"B2"==a&&(kiirRotLayer(layerb,5),facerotate(51,2),bb(),bb()),"b2"==a&&(kiirRotLayer(layerb,5),facerotate(52,2),bi(),bi()),
"L2"==a&&(kiirRotLayer(layerl,2),facerotate(21,2),l2()     ),"l2"==a&&(kiirRotLayer(layerl,2),facerotate(22,2),l2()  ),
"M2"==a&&(kiirRotLayer(layerm,7),facerotate(71,2),Ml(),Mc(),mr(),Ml(),Mc(),mr()),"m2"==a&&(kiirRotLayer(layerm,7),facerotate(72,2),ml(),mc(),Mr(),ml(),mc(),Mr()),
"X2"==a&&(kiirRotLayer(wholecube,99),facerotate(101,2),bor2()),"x2"==a&&(kiirRotLayer(wholecube,99),facerotate(102,2),bor2()),
"Y2"==a&&(kiirRotLayer(wholecube,99),facerotate(111,2),fd2()),"y2"==a&&(kiirRotLayer(wholecube,99),facerotate(112,2),fd2()),
"Z2"==a&&(kiirRotLayer(wholecube,99),facerotate(121,2),fd(),bor2(),bor(),fd3()),"z2"==a&&(kiirRotLayer(wholecube,99),facerotate(122,2),fd3(),bor2(),fd()),
"Mu"==a&&(kiirRotLayer(layermu,13),facerotate(11,2),Mu(),Mu()),"mu"==a&&(kiirRotLayer(layermu,13),facerotate(12,2),mu(),mu()),
"Mr"==a&&(kiirRotLayer(layermr,12),facerotate(41,2),Mr(),Mr()),"mr"==a&&(kiirRotLayer(layermr,12),facerotate(42,2),mr(),mr()),
"Md"==a&&(kiirRotLayer(layermd,14),facerotate(61,2),Md(),Md()),"md"==a&&(kiirRotLayer(layermd,14),facerotate(62,2),md(),md()),
"Mf"==a&&(kiirRotLayer(layermf,15),facerotate(31,2),Mf(),Mf()),"mf"==a&&(kiirRotLayer(layermf,15),facerotate(32,2),mf(),mf()),
"Mb"==a&&(kiirRotLayer(layermb,16),facerotate(51,2),Mb(),Mb()),"mb"==a&&(kiirRotLayer(layermb,16),facerotate(52,2),mb(),mb()),
"Ml"==a&&(kiirRotLayer(layerml,11),facerotate(21,2),Ml(),Ml()),"ml"==a&&(kiirRotLayer(layerml,11),facerotate(22,2),ml(),ml()),
"Lw"==a&&(kiirRotLayer(layerlw,10),facerotate(21,2),ll(),Ml(),ll(),Ml()),"lw"==a&&(kiirRotLayer(layerlw,10),facerotate(22,2),li(),ml(),li(),ml()),
"Rw"==a&&(kiirRotLayer(layerrw,10),facerotate(41,2),rr(),Mr(),rr(),Mr()),"rw"==a&&(kiirRotLayer(layerrw,10),facerotate(42,2),ri(),mr(),ri(),mr()),
"Uw"==a&&(kiirRotLayer(layeruw,21),facerotate(11,2),uu(),Mu(),uu(),Mu()),"uw"==a&&(kiirRotLayer(layeruw,21),facerotate(12,2),ui(),mu(),ui(),mu()),
"Dw"==a&&(kiirRotLayer(layerdw,26),facerotate(61,2),dd(),Md(),dd(),Md()),"dw"==a&&(kiirRotLayer(layerdw,26),facerotate(62,2),di(),md(),di(),md()),
"Fw"==a&&(kiirRotLayer(layerfw,23),facerotate(31,2),ff(),Mf(),ff(),Mf()),"fw"==a&&(kiirRotLayer(layerfw,23),facerotate(32,2),fi(),mf(),fi(),mf()),
"Bw"==a&&(kiirRotLayer(layerbw,25),facerotate(51,2),bb(),Mb(),bb(),Mb()),"bw"==a&&(kiirRotLayer(layerbw,26),facerotate(52,2),bi(),mb(),bi(),mb()),
"Xw"==a&&(kiirRotLayer(wholecube,99),facerotate(101,2),bor2()),"xw"==a&&(kiirRotLayer(wholecube,99),facerotate(102,2),bor2()),
"Yw"==a&&(kiirRotLayer(wholecube,99),facerotate(111,2),fd2()),"yw"==a&&(kiirRotLayer(wholecube,99),facerotate(112,2),fd2()),
"Zw"==a&&(kiirRotLayer(wholecube,99),facerotate(121,2),fd(),bor2(),bor(),fd3()),"zw"==a&&(kiirRotLayer(wholecube,99),facerotate(122,2),fd3(),bor2(),fd()))
}
function Ml(){
    (N==5)?(s[1]=a[2],s[2]=a[7],s[3]=a[12],s[4]=a[17],s[5]=a[22],a[2]=a[124],a[7]=a[119],a[12]=a[114],a[17]=a[109],a[22]=a[104],a[124]=a[127],a[119]=a[132],a[114]=a[137],a[109]=a[142],a[104]=a[147],a[127]=a[52],a[132]=a[57],a[137]=a[62],a[142]=a[67],a[147]=a[72],a[52]=s[1],a[57]=s[2],a[62]=s[3],a[67]=s[4],a[72]=s[5]):
    (s[1]=a[2],s[2]=a[6],s[3]=a[10],s[4]=a[14],a[2]=a[79],a[6]=a[75],a[10]=a[71],a[14]=a[67],a[79]=a[82],a[75]=a[86],a[71]=a[90],a[67]=a[94],a[82]=a[34],a[86]=a[38],a[90]=a[42],a[94]=a[46],a[34]=s[1],a[38]=s[2],a[42]=s[3],a[46]=s[4])}
function Mc(){
    (N==5)?(s[1]=a[3],s[2]=a[8],s[3]=a[13],s[4]=a[18],s[5]=a[23],a[3]=a[123],a[8]=a[118],a[13]=a[113],a[18]=a[108],a[23]=a[103],a[123]=a[128],a[118]=a[133],a[113]=a[138],a[108]=a[143],a[103]=a[148],a[128]=a[53],a[133]=a[58],a[138]=a[63],a[143]=a[68],a[148]=a[73],a[53]=s[1],a[58]=s[2],a[63]=s[3],a[68]=s[4],a[73]=s[5]):
    void(0)}
function mc(){
    (N==5)?(s[1]=a[3],s[2]=a[8],s[3]=a[13],s[4]=a[18],s[5]=a[23],a[3]=a[53],a[8]=a[58],a[13]=a[63],a[18]=a[68],a[23]=a[73],a[53]=a[128],a[58]=a[133],a[63]=a[138],a[68]=a[143],a[73]=a[148],a[128]=a[123],a[133]=a[118],a[138]=a[113],a[143]=a[108],a[148]=a[103],a[123]=s[1],a[118]=s[2],a[113]=s[3],a[108]=s[4],a[103]=s[5]):
    void(0)}
function mr(){
    (N==5)?(s[1]=a[4],s[2]=a[9],s[3]=a[14],s[4]=a[19],s[5]=a[24],a[4]=a[122],a[9]=a[117],a[14]=a[112],a[19]=a[107],a[24]=a[102],a[122]=a[129],a[117]=a[134],a[112]=a[139],a[107]=a[144],a[102]=a[149],a[129]=a[54],a[134]=a[59],a[139]=a[64],a[144]=a[69],a[149]=a[74],a[54]=s[1],a[59]=s[2],a[64]=s[3],a[69]=s[4],a[74]=s[5]):
    (s[1]=a[3],s[2]=a[7],s[3]=a[11],s[4]=a[15],a[3]=a[78],a[7]=a[74],a[11]=a[70],a[15]=a[66],a[78]=a[83],a[74]=a[87],a[70]=a[91],a[66]=a[95],a[83]=a[35],a[87]=a[39],a[91]=a[43],a[95]=a[47],a[35]=s[1],a[39]=s[2],a[43]=s[3],a[47]=s[4])}

function bor(){
    (N==5)?(ll(),Ml(),Mc(),mr(),ri()):
    (s[1]=a[2],s[2]=a[6],s[3]=a[10],s[4]=a[14],a[2]=a[79],a[6]=a[75],a[10]=a[71],a[14]=a[67],a[79]=a[82],a[75]=a[86],a[71]=a[90],a[67]=a[94],a[82]=a[34],a[86]=a[38],a[90]=a[42],a[94]=a[46],a[34]=s[1],a[38]=s[2],a[42]=s[3],a[46]=s[4],
    s[1]=a[3],s[2]=a[7],s[3]=a[11],s[4]=a[15],a[3]=a[78],a[7]=a[74],a[11]=a[70],a[15]=a[66],a[78]=a[83],a[74]=a[87],a[70]=a[91],a[66]=a[95],a[83]=a[35],a[87]=a[39],a[91]=a[43],a[95]=a[47],a[35]=s[1],a[39]=s[2],a[43]=s[3],a[47]=s[4],
    ll(),ri())}
function bor2(){
    (N==5)?(l2(),borC(),ri(),ri()):
    (s[1]=a[2],s[2]=a[6],s[3]=a[10],s[4]=a[14],a[2]=a[82],a[6]=a[86],a[10]=a[90],a[14]=a[94],a[82]=s[1],a[86]=s[2],a[90]=s[3],a[94]=s[4],s[1]=a[46],s[2]=a[42],s[3]=a[38],s[4]=a[34],a[46]=a[67],a[42]=a[71],a[38]=a[75],a[34]=a[79],a[67]=s[1],a[71]=s[2],a[75]=s[3],a[79]=s[4],
    s[1]=a[3],s[2]=a[7],s[3]=a[11],s[4]=a[15],a[3]=a[83],a[7]=a[87],a[11]=a[91],a[15]=a[95],a[83]=s[1],a[87]=s[2],a[91]=s[3],a[95]=s[4],s[1]=a[47],s[2]=a[43],s[3]=a[39],s[4]=a[35],a[47]=a[66],a[43]=a[70],a[39]=a[74],a[35]=a[78],a[66]=s[1],a[70]=s[2],a[74]=s[3],a[78]=s[4],
    l2(),ri2())}
function ri2(){
    s[1]=a[4],s[2]=a[8],s[3]=a[12],s[4]=a[16],a[4]=a[84],a[8]=a[88],a[12]=a[92],a[16]=a[96],a[84]=s[1],a[88]=s[2],a[92]=s[3],a[96]=s[4],s[1]=a[48],s[2]=a[44],s[3]=a[40],s[4]=a[36],a[48]=a[65],a[44]=a[69],a[40]=a[73],a[36]=a[77],a[65]=s[1],a[69]=s[2],a[73]=s[3],a[77]=s[4],
    s[1]=a[52],s[2]=a[51],s[3]=a[50],s[4]=a[49],a[52]=a[61],a[51]=a[62],a[50]=a[63],a[49]=a[64], a[61]=s[1],a[62]=s[2],a[63]=s[3],a[64]=s[4], s[1]=a[56],s[2]=a[55],s[3]=a[54],s[4]=a[53],a[56]=a[57],a[55]=a[58],a[54]=a[59],a[53]=a[60],a[57]=s[1],a[58]=s[2],a[59]=s[3],a[60]=s[4]}
function borC(){
    s[1]=a[2],s[2]=a[7],s[3]=a[12],s[4]=a[17],s[5]=a[22],a[2]=a[127],a[7]=a[132],a[12]=a[137],a[17]=a[142],a[22]=a[147],a[127]=s[1],a[132]=s[2],a[137]=s[3],a[142]=s[4],a[147]=s[5],s[1]=a[72],s[2]=a[67],s[3]=a[62],s[4]=a[57],s[5]=a[52],a[72]=a[104],a[67]=a[109],a[62]=a[114],a[57]=a[119],a[52]=a[124],a[104]=s[1],a[109]=s[2],a[114]=s[3],a[119]=s[4],a[124]=s[5],
    s[1]=a[3],s[2]=a[8],s[3]=a[13],s[4]=a[18],s[5]=a[23],a[3]=a[128],a[8]=a[133],a[13]=a[138],a[18]=a[143],a[23]=a[148],a[128]=s[1],a[133]=s[2],a[138]=s[3],a[143]=s[4],a[148]=s[5],s[1]=a[73],s[2]=a[68],s[3]=a[63],s[4]=a[58],s[5]=a[53],a[73]=a[103],a[68]=a[108],a[63]=a[113],a[58]=a[118],a[53]=a[123],a[103]=s[1],a[108]=s[2],a[113]=s[3],a[118]=s[4],a[123]=s[5],
    s[1]=a[4],s[2]=a[9],s[3]=a[14],s[4]=a[19],s[5]=a[24],a[4]=a[129],a[9]=a[134],a[14]=a[139],a[19]=a[144],a[24]=a[149],a[129]=s[1],a[134]=s[2],a[139]=s[3],a[144]=s[4],a[149]=s[5],s[1]=a[74],s[2]=a[69],s[3]=a[64],s[4]=a[59],s[5]=a[54],a[74]=a[102],a[69]=a[107],a[64]=a[112],a[59]=a[117],a[54]=a[122],a[102]=s[1],a[107]=s[2],a[112]=s[3],a[117]=s[4],a[122]=s[5]}
function dd(){
    (N==5)?(sv5(71),mov5(71,46),mov5(46,121),mov5(121,96),rv5(96),
    s[1]=a[127],s[2]=a[128],s[3]=a[129],s[4]=a[130],a[130]=a[126],a[129]=a[131],a[128]=a[136],a[127]=a[141],a[126]=a[146],a[131]=a[147],a[136]=a[148],a[141]=a[149],a[146]=a[150],a[147]=a[145],a[148]=a[140],a[149]=a[135],a[150]=s[4],a[145]=s[3],a[140]=s[2],a[135]=s[1],
    s[1]=a[132],s[2]=a[133],a[132]=a[142],a[133]=a[137],a[142]=a[144],a[137]=a[143],a[144]=a[134],a[143]=a[139],a[134]=s[1],a[139]=s[2]):
    (s[1]=a[45],s[2]=a[46],s[3]=a[47],s[4]=a[48],a[45]=a[29],a[46]=a[30],a[47]=a[31],a[48]=a[32],a[29]=a[77],a[30]=a[78],a[31]=a[79],a[32]=a[80], a[77]=a[61],a[78]=a[62],a[79]=a[63],a[80]=a[64],a[61]=s[1],a[62]=s[2],a[63]=s[3],a[64]=s[4],
    s[1]=a[82],s[2]=a[83],s[3]=a[84],a[84]=a[81],a[83]=a[85],a[82]=a[89],a[81]=a[93],a[85]=a[94],a[89]=a[95],a[93]=a[96],a[94]=a[92],a[95]=a[88],a[88]=s[1],a[92]=s[2],a[96]=s[3], s[4]=a[87],a[87]=a[86],a[86]=a[90],a[90]=a[91],a[91]=s[4])}
function di(){
    (N==5)?(sv5(71),mov5(71,96),mov5(96,121),mov5(121,46),rv5(46),
    s[1]=a[126],s[2]=a[127],s[3]=a[128],s[4]=a[129],a[126]=a[130],a[127]=a[135],a[128]=a[140],a[129]=a[145],a[129]=a[145],a[130]=a[150],a[135]=a[149],a[140]=a[148],a[145]=a[147],a[150]=a[146],a[149]=a[141],a[148]=a[136],a[147]=a[131],a[146]=s[1],a[141]=s[2],a[136]=s[3],a[131]=s[4],
    s[1]=a[132],s[2]=a[133],a[132]=a[134],a[133]=a[139],a[134]=a[144],a[139]=a[143],a[144]=a[142],a[143]=a[137],a[142]=s[1],a[137]=s[2]):
    (s[1]=a[45],s[2]=a[46],s[3]=a[47],s[4]=a[48],a[45]=a[61],a[46]=a[62],a[47]=a[63],a[48]=a[64],a[61]=a[77],a[62]=a[78],a[63]=a[79],a[64]=a[80], a[77]=a[29],a[78]=a[30],a[79]=a[31],a[80]=a[32],a[29]=s[1],a[30]=s[2],a[31]=s[3],a[32]=s[4],
    s[1]=a[81],s[2]=a[82],s[3]=a[83],a[81]=a[84],a[82]=a[88],a[83]=a[92],a[84]=a[96],a[88]=a[95],a[92]=a[94],a[96]=a[93],a[95]=a[89],a[94]=a[85],a[93]=s[1],a[89]=s[2],a[85]=s[3], s[4]=a[86],a[86]=a[87],a[87]=a[91],a[91]=a[90],a[90]=s[4])}
function fd(){
    uu(),
    ((N==5)?(sv5(56),mov5(56,81),mov5(81,106),mov5(106,31),rv5(31),
    sv5(61),mov5(61,86),mov5(86,111),mov5(111,36),rv5(36),
    sv5(66),mov5(66,91),mov5(91,116),mov5(116,41),rv5(41)):
    (s[1]=a[37],s[2]=a[38],s[3]=a[39],s[4]=a[40],a[37]=a[53],a[38]=a[54],a[39]=a[55],a[40]=a[56],a[53]=a[69],a[54]=a[70],a[55]=a[71],a[56]=a[72],a[69]=a[21],a[70]=a[22],a[71]=a[23],a[72]=a[24],a[21]=s[1],a[22]=s[2],a[23]=s[3],a[24]=s[4],
    s[1]=a[41],s[2]=a[42],s[3]=a[43],s[4]=a[44],a[41]=a[57],a[42]=a[58],a[43]=a[59],a[44]=a[60],a[57]=a[73],a[58]=a[74],a[59]=a[75],a[60]=a[76],a[73]=a[25],a[74]=a[26],a[75]=a[27],a[76]=a[28],a[25]=s[1],a[26]=s[2],a[27]=s[3],a[28]=s[4])),
    di()}
function sv5(an) {
    for (var i=0;i<5;i++) s[i]=a[i+an];
}
function rv5(an) {
    for (var i=0;i<5;i++) a[i+an]=s[i];
}
function mov5(t,f) {
    for (var i=0;i<5;i++) a[i+t]=a[i+f];
}
function exg15(t,f) {
    for (var i=0;i<15;i++) { let j=a[i+f]; a[i+f]=a[i+t]; a[i+t]=j; }
}
function fd2(){
    u2(),
    ((N==5)?(exg15(31,81),exg15(56,106),di2()):
    (s[1]=a[37],s[2]=a[38],s[3]=a[39],s[4]=a[40],a[37]=a[69],a[38]=a[70],a[39]=a[71],a[40]=a[72],a[69]=s[1] ,a[70]=s[2] ,a[71]=s[3] ,a[72]=s[4],s[1]=a[21],s[2]=a[22],s[3]=a[23],s[4]=a[24],a[21]=a[53],a[22]=a[54],a[23]=a[55],a[24]=a[56],a[53]=s[1] ,a[54]=s[2] ,a[55]=s[3],a[56]=s[4],
    s[1]=a[41],s[2]=a[42],s[3]=a[43],s[4]=a[44],a[41]=a[73],a[42]=a[74],a[43]=a[75],a[44]=a[76],a[73]=s[1] ,a[74]=s[2] ,a[75]=s[3] ,a[76]=s[4],s[1]=a[25],s[2]=a[26],s[3]=a[27],s[4]=a[28],a[25]=a[57],a[26]=a[58],a[27]=a[59],a[28]=a[60],a[57]=s[1] ,a[58]=s[2] ,a[59]=s[3],a[60]=s[4],
    s[1]=a[45],s[2]=a[46],s[3]=a[47],s[4]=a[48],a[45]=a[77],a[46]=a[78],a[47]=a[79],a[48]=a[80],a[77]=s[1] ,a[78]=s[2] ,a[79]=s[3] ,a[80]=s[4],s[1]=a[29],s[2]=a[30],s[3]=a[31],s[4]=a[32],a[29]=a[61],a[30]=a[62],a[31]=a[63],a[32]=a[64],a[61]=s[1] ,a[62]=s[2] ,a[63]=s[3],a[64]=s[4],
    s[1]=a[81],s[2]=a[82],s[3]=a[83],s[4]=a[84],a[81]=a[96],a[82]=a[95],a[83]=a[94],a[84]=a[93], a[96]=s[1],a[95]=s[2],a[94]=s[3],a[93]=s[4],s[1]=a[85],s[2]=a[86],s[3]=a[87], s[4]=a[88],a[85]=a[92],a[86]=a[91],a[87]=a[90],a[88]=a[89], a[92]=s[1],a[91]=s[2],a[90]=s[3],a[89]=s[4]))} 
function fd3(){
    fd2(),fd()}
function uu(){
    (N==5)?(s[1]=a[51],s[2]=a[52],s[3]=a[53],s[4]=a[54],s[5]=a[55],a[51]=a[76],a[52]=a[77],a[53]=a[78],a[54]=a[79],a[55]=a[80],a[76]=a[101],a[77]=a[102],a[78]=a[103],a[79]=a[104],a[80]=a[105],a[101]=a[26],a[102]=a[27],a[103]=a[28],a[104]=a[29],a[105]=a[30],a[26]=s[1],a[27]=s[2],a[28]=s[3],a[29]=s[4],a[30]=s[5],
    s[1]=a[21],s[2]=a[22],s[3]=a[23],s[4]=a[24],a[21]=a[25],a[22]=a[20],a[23]=a[15],a[24]=a[10],a[25]=a[5],a[20]=a[4],a[15]=a[3],a[10]=a[2],a[5]=a[1],a[4]=a[6],a[3]=a[11],a[2]=a[16],a[1]=s[1],a[6]=s[2],a[11]=s[3],a[16]=s[4],
    s[1]=a[17],s[2]=a[18],a[17]=a[19],a[18]=a[14],a[19]=a[9],a[14]=a[8],a[9]=a[7],a[8]=a[12],a[7]=s[1],a[12]=s[2]):
    (s[1]=a[33],s[2]=a[34],s[3]=a[35],s[4]=a[36],a[33]=a[49],a[34]=a[50],a[35]=a[51],a[36]=a[52],a[49]=a[65],a[50]=a[66],a[51]=a[67],a[52]=a[68],a[65]=a[17],a[66]=a[18],a[67]=a[19],a[68]=a[20],a[17]=s[1],a[18]=s[2],a[19]=s[3],a[20]=s[4],
    s[1]=a[13], s[2]=a[14], s[3]=a[15], a[13]=a[16],a[14]=a[12],a[15]=a[8],a[16]=a[4],a[12]=a[3],a[8]=a[2],a[4]=a[1],a[3]=a[5],a[2]=a[9],a[1]=s[1],a[5]=s[2],a[9]=s[3], s[4]=a[6],a[6]=a[10],a[10]=a[11],a[11]=a[7],a[7]=s[4])}
function u2(){
    (N==5)?(sv5(51),mov5(51,101),rv5(101),sv5(26),mov5(26,76),rv5(76),
    sv5(21),a[21]=a[5],a[22]=a[4],a[23]=a[3],a[24]=a[2],a[25]=a[1],a[5]=s[0],a[4]=s[1],a[3]=s[2],a[2]=s[3],a[1]=s[4],
    s[1]=a[6],s[2]=a[11],s[3]=a[16],a[6]=a[20],a[11]=a[15],a[16]=a[10],a[20]=s[1],a[15]=s[2],a[10]=s[3],
    s[1]=a[17],s[2]=a[18],s[3]=a[19],s[4]=a[14],a[17]=a[9],a[18]=a[8],a[19]=a[7],a[14]=a[12],a[9]=s[1],a[8]=s[2],a[7]=s[3],a[12]=s[4]):
    (s[1]=a[33],s[2]=a[34],s[3]=a[35],s[4]=a[36],a[33]=a[65],a[34]=a[66],a[35]=a[67],a[36]=a[68],a[65]=s[1] ,a[66]=s[2] ,a[67]=s[3] ,a[68]=s[4],s[1]=a[17],s[2]=a[18],s[3]=a[19],s[4]=a[20],a[17]=a[49],a[18]=a[50],a[19]=a[51],a[20]=a[52],a[49]=s[1] ,a[50]=s[2] ,a[51]=s[3],a[52]=s[4],
    s[1]=a[1], s[2]=a[2], s[3]=a[3] ,s[4]=a[4] ,a[1]=a[16],a[2]=a[15],a[3]=a[14],a[4]=a[13], a[16]=s[1],a[15]=s[2],a[14]=s[3],a[13]=s[4], s[1]=a[5], s[2]=a[6], s[3]=a[7] ,s[4]=a[8] ,a[5]=a[12],a[6]=a[11],a[7]=a[10],a[8]=a[9], a[12]=s[1],a[11]=s[2],a[10]=s[3],a[9]=s[4])} 
function ui(){
    u2(),uu()}
function ff(){
    bor(),dd(),bor2(),bor()}
function fi(){
    bor(),di(),bor2(),bor()}
function rr(){
    ri(),ri(),ri()}
function ri(){
    (N==5)?(s[1]=a[5],s[2]=a[10],s[3]=a[15],s[4]=a[20],s[5]=a[25],a[5]=a[121],a[10]=a[116],a[15]=a[111],a[20]=a[106],a[25]=a[101],a[121]=a[130],a[116]=a[135],a[111]=a[140],a[106]=a[145],a[101]=a[150],a[130]=a[55],a[135]=a[60],a[140]=a[65],a[145]=a[70],a[150]=a[75],a[55]=s[1],a[60]=s[2],a[65]=s[3],a[70]=s[4],a[75]=s[5],
    s[1]=a[76],s[2]=a[77],s[3]=a[78],s[4]=a[79],a[76]=a[80],a[77]=a[85],a[78]=a[90],a[79]=a[95],a[80]=a[100],a[85]=a[99],a[90]=a[98],a[95]=a[97],a[100]=a[96],a[99]=a[91],a[98]=a[86],a[97]=a[81],a[96]=s[1],a[91]=s[2],a[86]=s[3],a[81]=s[4],
    s[1]=a[82],s[2]=a[83],a[82]=a[84],a[83]=a[89],a[84]=a[94],a[89]=a[93],a[94]=a[92],a[93]=a[87],a[92]=s[1],a[87]=s[2]):
    (s[1]=a[4],s[2]=a[8],s[3]=a[12],s[4]=a[16],a[4]=a[77],a[8]=a[73],a[12]=a[69],a[16]=a[65],a[77]=a[84],a[73]=a[88],a[69]=a[92],a[65]=a[96],a[84]=a[36],a[88]=a[40],a[92]=a[44],a[96]=a[48],a[36]=s[1],a[40]=s[2],a[44]=s[3],a[48]=s[4],
    s[1]=a[51],s[2]=a[50],s[3]=a[49],a[49]=a[52],a[52]=a[64],a[51]=a[60],a[50]=a[56],a[56]=a[63],a[60]=a[62],a[64]=a[61],a[63]=a[57],a[62]=a[53], a[61]=s[3],a[57]=s[2],a[53]=s[1], s[4]=a[54],a[54]=a[55],a[55]=a[59],a[59]=a[58],a[58]=s[4])}
function ll(){
    (N==5)?(s[1]=a[1],s[2]=a[6],s[3]=a[11],s[4]=a[16],s[5]=a[21],a[1]=a[125],a[6]=a[120],a[11]=a[115],a[16]=a[110],a[21]=a[105],a[125]=a[126],a[120]=a[131],a[115]=a[136],a[110]=a[141],a[105]=a[146],a[126]=a[51],a[131]=a[56],a[136]=a[61],a[141]=a[66],a[146]=a[71],a[51]=s[1],a[56]=s[2],a[61]=s[3],a[66]=s[4],a[71]=s[5],
    s[1]=a[27],s[2]=a[28],s[3]=a[29],s[4]=a[30],a[27]=a[41],a[28]=a[36],a[29]=a[31],a[30]=a[26],a[41]=a[49],a[36]=a[48],a[31]=a[47],a[26]=a[46],a[49]=a[35],a[48]=a[40],a[47]=a[45],a[46]=a[50], a[35]=s[1],a[40]=s[2],a[45]=s[3],a[50]=s[4],
    s[1]=a[33],s[2]=a[34],a[34]=a[32],a[33]=a[37],a[32]=a[42],a[37]=a[43],a[42]=a[44],a[43]=a[39],a[44]=s[2],a[39]=s[1]):
    (s[1]=a[1],s[2]=a[5],s[3]= a[9],s[4]=a[13],a[1]=a[80],a[5]=a[76], a[9]=a[72],a[13]=a[68],a[80]=a[81],a[76]=a[85],a[72]=a[89],a[68]=a[93],a[81]=a[33],a[85]=a[37],a[89]=a[41],a[93]=a[45],a[33]=s[1],a[37]=s[2],a[41]=s[3],a[45]=s[4],
    s[1]=a[18],s[2]=a[19],s[3]=a[20],a[18]=a[25],a[19]=a[21],a[20]=a[17],a[25]=a[31],a[21]=a[30],a[17]=a[29],a[29]=a[32],a[30]=a[28],a[31]=a[24], a[32]=s[3],a[28]=s[2],a[24]=s[1], s[4]=a[23],a[23]=a[22],a[22]=a[26],a[26]=a[27],a[27]=s[4])}
function l2(){
    (N==5)?(s[1]=a[1],s[2]=a[6],s[3]=a[11],s[4]=a[16],s[5]=a[21],a[1]=a[126],a[6]=a[131],a[11]=a[136],a[16]=a[141],a[21]=a[146],a[126]=s[1],a[131]=s[2],a[136]=s[3],a[141]=s[4],a[146]=s[5],s[1]=a[125],s[2]=a[120],s[3]=a[115],s[4]=a[110],s[5]=a[105],a[125]=a[51],a[120]=a[56],a[115]=a[61],a[110]=a[66],a[105]=a[71],a[51]=s[1],a[56]=s[2],a[61]=s[3],a[66]=s[4],a[71]=s[5],
    sv5(26),a[26]=a[50],a[27]=a[49],a[28]=a[48],a[29]=a[47],a[30]=a[46],a[50]=s[0],a[49]=s[1],a[48]=s[2],a[47]=s[3],a[46]=s[4],s[1]=a[31],s[2]=a[36],s[3]=a[41],a[31]=a[45],a[36]=a[40],a[41]=a[35],a[45]=s[1],a[40]=s[2],a[35]=s[3],
    s[1]=a[32],s[2]=a[33],s[3]=a[34],s[4]=a[37],a[32]=a[44],a[33]=a[43],a[34]=a[42],a[44]=s[1],a[43]=s[2],a[42]=s[3],a[37]=a[39],a[39]=s[4]):
    (s[1]=a[1],s[2]=a[5],s[3]=a[9], s[4]=a[13],a[1]=a[81],a[5]=a[85], a[9]=a[89],a[13]=a[93],a[81]=s[1],a[85]=s[2],a[89]=s[3],a[93]=s[4],s[1]=a[45],s[2]=a[41],s[3]=a[37],s[4]=a[33],a[45]=a[68],a[41]=a[72],a[37]=a[76],a[33]=a[80],a[68]=s[1],a[72]=s[2],a[76]=s[3],a[80]=s[4],
    s[1]=a[17],s[2]=a[18],s[3]=a[19],s[4]=a[20],a[17]=a[32],a[18]=a[31],a[19]=a[30],a[20]=a[29], a[32]=s[1],a[31]=s[2],a[30]=s[3],a[29]=s[4], s[1]=a[21],s[2]=a[22],s[3]=a[23],s[4]=a[24],a[24]=a[25],a[23]=a[26],a[22]=a[27],a[21]=a[28],a[28]=s[1],a[27]=s[2],a[26]=s[3],a[25]=s[4])}
function li(){
    l2(),ll()}
function di2(){
    di(),di()}
function bb(){
    bor2(),bor(),dd(),bor()}
function bi(){
    bor2(),bor(),di(),bor()}
function Mu(){
    fd(),bor(),fd3(),Mr(),fd3(),bor(),fd()}
function Mr(){
    (N==5)?(s[1]=a[4],s[2]=a[9],s[3]=a[14],s[4]=a[19],s[5]=a[24],a[4]=a[54],a[9]=a[59],a[14]=a[64],a[19]=a[69],a[24]=a[74],a[54]=a[129],a[59]=a[134],a[64]=a[139],a[69]=a[144],a[74]=a[149],a[129]=a[122],a[134]=a[117],a[139]=a[112],a[144]=a[107],a[149]=a[102],a[122]=s[1],a[117]=s[2],a[112]=s[3],a[107]=s[4],a[102]=s[5]):
    (s[1]=a[3],s[2]=a[7],s[3]=a[11],s[4]=a[15],a[3]=a[35],a[7]=a[39],a[11]=a[43],a[15]=a[47],a[35]=a[83],a[39]=a[87],a[43]=a[91],a[47]=a[95],a[83]=a[78],a[87]=a[74],a[91]=a[70],a[95]=a[66],a[78]=s[1],a[74]=s[2],a[70]=s[3],a[66]=s[4])}
function Md(){
    fd(),bor(),fd3(),Ml(),fd3(),bor(),fd()}
function Mf(){
    fd3(),Mr(),fd()}
function Mb(){
    fd3(),Ml(),fd()}
function mu(){
    fd(),bor(),fd3(),mr(),fd3(),bor(),fd()}
function md(){
    fd(),bor(),fd3(),ml(),fd3(),bor(),fd()}
function mf(){
    fd3(),mr(),fd()}
function mb(){
    fd3(),ml(),fd()}
function ml(){
    (N==5)?(s[1]=a[2],s[2]=a[7],s[3]=a[12],s[4]=a[17],s[5]=a[22],a[2]=a[52],a[7]=a[57],a[12]=a[62],a[17]=a[67],a[22]=a[72],a[52]=a[127],a[57]=a[132],a[62]=a[137],a[67]=a[142],a[72]=a[147],a[127]=a[124],a[132]=a[119],a[137]=a[114],a[142]=a[109],a[147]=a[104],a[124]=s[1],a[119]=s[2],a[114]=s[3],a[109]=s[4],a[104]=s[5]):
    (s[1]=a[2],s[2]=a[6],s[3]=a[10],s[4]=a[14],a[2]=a[34],a[6]=a[38],a[10]=a[42],a[14]=a[46],a[34]=a[82],a[38]=a[86],a[42]=a[90],a[46]=a[94],a[82]=a[79],a[86]=a[75],a[90]=a[71],a[94]=a[67],a[79]=s[1],a[75]=s[2],a[71]=s[3],a[67]=s[4])}
function Rw() {
    Mr(),rr()}
function rw() {
    ri(),mr()}
function Lw() {
    ll(),Ml()}
function lw() {
    li(),ml()}
function Uw() {
    uu(),Mu()}
function uw() {
    ui(),mu()}
function Dw() {
    dd(),Md()}
function dw() {
    di(),md()}
function Fw() {
    ff(),Mf()}
function fw() {
    fi(),mf()}
function Bw() {
    bb(),Mb()}
function bw() {
    bi(),mb()}

function scramble(){
    if (N==2) { scramble2(); return; }
    if (N==4) { scramble4(); return; }
    if (N==5) { scramble5(); return; }
    scramble3();
    $("#solve3").attr('disabled',false);
    if (opener && opener.ClipDT && (opener.ClipDT!="")) opener.ClipDT = "";
}
function scramble2(){
    var i,j,sym="";
    const rotS = "U,U',F,F',D,D',B,B',R,R',L,L'".split(",");
    initCube(4);
    for(i=0;18>i;i++)rand=Math.floor(12*Math.random()),sym+=rotS[rand]+" ",
        0==rand&&Uw(),1==rand&&uw(),2==rand&&Fw(),3==rand&&fw(),4==rand&&Dw(),5==rand&&dw(),
        6==rand&&Bw(),7==rand&&bw(),8==rand&&Rw(),9==rand&&rw(),10==rand&&Lw(),11==rand&&lw();
    symset(sym);
}
function scramble3(){
    var i,j,sym="";
    const rotS = "U,U',U2,F,F',F2,D,D',D2,B,B',B2,R,R',R2,L,L',L2".split(",");
    initCube(0);
    for(i=0;22>i;i++)rand=Math.floor(18*Math.random()),sym+=rotS[rand]+" ",
        0==rand&&uu(),1==rand&&ui(),2==rand&&u2(),3==rand&&ff(),4==rand&&fi(),5==rand&&(ff(),ff()),6==rand&&dd(),7==rand&&di(),8==rand&&(dd(),dd()),9==rand&&bb(),10==rand&&bi(),11==rand&&(bb(),bb()),12==rand&&rr(),13==rand&&ri(),14==rand&&(rr(),rr()),15==rand&&ll(),16==rand&&li(),17==rand&&l2();
    symset(sym);
}
function scramble4(){
    var i,j,sym="";
    const rotS = "U,U',U2,u,u',u2,F,F',F2,f,f',f2,D,D',D2,d,d',d2,B,B',B2,b,b',b2,R,R',R2,r,r',r2,L,L',L2,l,l',l2".split(",");
    css44(0);
    initCube(4);
    for(i=0;50>i;i++)rand=Math.floor(36*Math.random()),sym+=rotS[rand]+" ",
         0==rand&&uu(), 1==rand&&ui(), 2==rand&&u2(), 3==rand&&Mu(), 4==rand&&mu(), 5==rand&&(mu(),mu()), 6==rand&&ff(), 7==rand&&fi(), 8==rand&&(ff(),ff()), 9==rand&&Mf(),10==rand&&mf(),11==rand&&(mf(),mf()),12==rand&&dd(),13==rand&&di(),14==rand&&(dd(),dd()),15==rand&&Md(),16==rand&&md(),17==rand&&(md(),md()),
        18==rand&&bb(),19==rand&&bi(),20==rand&&(bb(),bb()),21==rand&&Mb(),22==rand&&mb(),23==rand&&(mb(),mb()),24==rand&&rr(),25==rand&&ri(),26==rand&&(rr(),rr()),27==rand&&Mr(),28==rand&&mr(),29==rand&&(mr(),mr()),30==rand&&ll(),31==rand&&li(),32==rand&&(ll(),ll()),33==rand&&Ml(),34==rand&&ml(),35==rand&&(ml(),ml());
    $("#solve3").attr('disabled',true);
    $("#solve4").attr('disabled',false);
    symset(sym);
}
function scramble5(){
    var i,j,sym="";
    const rotS = "U,U',U2,u,u',u2,F,F',F2,f,f',f2,D,D',D2,d,d',d2,B,B',B2,b,b',b2,R,R',R2,r,r',r2,L,L',L2,l,l',l2".split(",");
    css55(0);
    initCube(5);
    for(i=0;64>i;i++)rand=Math.floor(36*Math.random()),sym+=rotS[rand]+" ",
         0==rand&&uu(), 1==rand&&ui(), 2==rand&&u2(), 3==rand&&Mu(), 4==rand&&mu(), 5==rand&&(mu(),mu()), 6==rand&&ff(), 7==rand&&fi(), 8==rand&&(ff(),ff()), 9==rand&&Mf(),10==rand&&mf(),11==rand&&(mf(),mf()),12==rand&&dd(),13==rand&&di(),14==rand&&(dd(),dd()),15==rand&&Md(),16==rand&&md(),17==rand&&(md(),md()),
        18==rand&&bb(),19==rand&&bi(),20==rand&&(bb(),bb()),21==rand&&Mb(),22==rand&&mb(),23==rand&&(mb(),mb()),24==rand&&rr(),25==rand&&ri(),26==rand&&(rr(),rr()),27==rand&&Mr(),28==rand&&mr(),29==rand&&(mr(),mr()),30==rand&&ll(),31==rand&&li(),32==rand&&(ll(),ll()),33==rand&&Ml(),34==rand&&ml(),35==rand&&(ml(),ml());
    $("#solve3").attr('disabled',true);
    $("#solve4").attr('disabled',false);
    symset(sym);
}
function symset(sym) {
    turnN = 1;
    ClipDT = sym;
    kiirRotLayer(wholecube,99),kiir();
    if (opener) {
        opener.document.getElementsByName('pythonQ')[0].contentDocument.body.innerHTML += sym;
        if (typeof opener.ClipDT!=="undefined") opener.ClipDT = sym;
    }
    else $("#comment").html(sym);
    // フォーカスをあてる
    //    navigator.clipboard.writeText(sym);   
}
let layeru,layerl,layerf,layerr,layerb,layerd,layerml,layermc,layermr,layermu,layermd,layermf,layermb,layerec,layersc,layermlc,
    layerm,layere,layers,layer33,layer24,layer34,wholecube;
let layerlw,layerrw,layeruw,layerdw,layerfw,layerbw;

function layers55() {
layeru=[[ 1, 2, 5, 6, 7,10,21,22,25,26,27,30,51,52, 55, 76, 77, 80,101,102,105], 3, 4, 8, 9,11,12,13,14,15,16,17,18,19,20,23,24,28,29,53,54, 78, 79,103,104],
layerl=[[26,27,30,31,32,35,46,47,50, 1, 6,21,51,56, 71,105,110,125,126,131,146],28,29,33,34,36,37,38,39,40,41,42,43,44,45,48,49,11,16,61,66,115,120,136,141],
layerf=[[51,52,55,56,57,60,71,72,75,21,22,25,30,35, 50, 76, 81, 96,126,127,130],53,54,58,59,61,62,63,64,65,66,67,68,69,70,73,74,23,24,40,45, 86, 91,128,129],
layerr=[[76,77,80,81,82,85,96,97,100, 5,10,25,55,60,75,101,106,121,130,135,150],78,79,83,84,86,87,88,89,90,91,92,93,94,95,98,99,15,20,65,70,111,116,140,145],
layerb=[[101,102,105,106,107,110,121,122,125, 1, 2, 5,26,31,46,80,85,100,146,147,150],103,104,108,109,111,112,113,114,115,116,117,118,119,120,123,124, 3, 4,36,41,90,95,148,149],
layerd=[[126,127,130,131,132,135,146,147,150,46,47,50,71,72,75,96,97,100,121,122,125],128,129,133,134,136,137,138,139,140,141,142,143,144,145,148,149,48,49,73,74,98,99,123,124],
layerml=[ 2, 7,12,17,22,52,57,62,67,72,104,109,114,119,124,127,132,137,142,147],
layermc=[ 3, 8,13,18,23,53,58,63,68,73,103,108,113,118,123,128,133,138,143,148],
layermr=[ 4, 9,14,19,24,54,59,64,69,74,102,107,112,117,122,129,134,139,144,149],
layermu=[31,32,33,34,35,56,57,58,59,60, 81, 82, 83, 84, 85,106,107,108,109,110],
layerec=[36,37,38,39,40,61,62,63,64,65, 86, 87, 88, 89, 90,111,112,113,114,115],
layermd=[41,42,43,44,45,66,67,68,69,70, 91, 92, 93, 94, 95,116,117,118,119,120],
layermf=[16,17,18,19,20,29,34,39,44,49, 77, 82, 87, 92, 97,131,132,133,134,135],
layersc=[11,12,13,14,15,28,33,38,43,48, 78, 83, 88, 93, 98,136,137,138,139,140],
layermb=[ 6, 7, 8, 9,10,27,32,37,42,47, 79, 84, 89, 94, 99,141,142,143,144,145],
layermlc=[2,7,22,52,57,72,104,109,124,127,132,147],
layer33=Array.from(new Set([].concat(layeru[0],layerl[0],layerf[0],layerr[0],layerb[0],layerd[0])));
layer34=[0].concat(layeru[0].slice(0,9),layerl[0].slice(0,9),layerf[0].slice(0,9),layerr[0].slice(0,9),layerb[0].slice(0,9),layerd[0].slice(0,9));
var layermlx=layerml.filter(function(value, index, array) {
  return (!layermlc.includes(value));
});
layerm=[layermlc,...layermlx.concat(layermc,layermr)];
layere=layermu.concat(layerec,layermd);
layers=layermf.concat(layersc,layermb);
var cubes55=[...[...Array(150)].map((v, i)=> i+1)].filter(function(value, index, array) {
  return (!layer33.includes(value));
});
wholecube=[layer33,...cubes55];
        c=new Array(7,8,9,12,14,17,18,19,32,33,34,37,39,42,43,44,57,58,59,62,64,67,68,69,
              82,83,84,87,89,92,93,94,107,108,109,112,114,117,118,119,132,133,134,137,139,142,143,144);
        eg=new Array(31,110,41,120,106,85,116,95,  70,91,60, 81,56,35,66,45,
                      4,102 ,2,104, 20,77,10 ,79,  22,52,24, 54, 6,27,16,29,
                    147,124,149,122,145,99,135,97,129,74,127,72,131,49,141,47);
// 　　              0,1,2,3, 4, 5, 6, 7,  8, 9, 10,11,12,13,14,15, 16,17,18,19,20,21,22,23, 24,25,26,27,28,29,30,31, 32, 33, 34, 35, 36, 37, 38, 39,  40, 41, 42, 43, 44, 45, 46, 47
        cr=new Array(9,8,7,12,17,18,19,10, 34,33,32,37,42,43,44,39, 59,58,57,62,67,68,69,64, 84,83,82,87,92,93,94,89, 109,108,107,112,117,118,119,114, 134,133,132,137,142,143,144,139);
}
function layers44() {
layeru=[[ 1, 2, 4, 5, 6, 8,13,14,16,17,18,20,33,34,36,49,50,52,65,66,68], 3, 7, 9,10,11,12,15,19,35,51,67],
layerl=[[17,18,20,21,22,24,29,30,32, 1, 5,13,33,37,45,68,72,80,81,85,93],19,23,25,26,27,28,31, 9,41,76,89],
layerf=[[33,34,36,37,38,40,45,46,48,13,14,16,20,24,32,49,53,61,81,82,84],35,39,41,42,43,44,47,15,28,57,83],
layerr=[[49,50,52,53,54,56,61,62,64, 4, 8,16,36,40,48,65,69,77,84,88,96],51,55,57,58,59,60,63,12,44,73,92],
layerb=[[65,66,68,69,70,72,77,78,80, 1, 2, 4,17,21,29,52,56,64,93,94,96],67,71,73,74,75,76,79, 3,25,60,95],
layerd=[[81,82,84,85,86,88,93,94,96,29,30,32,45,46,48,61,62,64,77,78,80],83,87,89,90,91,92,95,31,47,63,79],
layerm =[[2, 6,14,34,38,46,67,71,79,82,86,94], 3, 7,10,11,15,35,39,42,43,47,66,70,74,75,78,83,87,90,91,95],
layere=[[13,14,15,22,23,24,31,32,33,40,41,42]],
layers=[[ 5 ,6, 8,18,22,30,50,54,62,85,86,88], 7, 9,10,11,12,19,23,26,27,31,51,55,58,59,63,87,89,90,91,92],
layerml=[ 2, 6,10,14,34,38,42,46,67,71,75,79,82,86,90,94],
layermr=[ 3, 7,11,15,35,39,43,47,66,70,74,78,83,87,91,95],
layermu=[21,22,23,24,37,38,39,40,53,54,55,56,69,70,71,72],
layermd=[25,26,27,28,41,42,43,44,57,58,59,60,73,74,75,76],
layermf=[ 9,10,11,12,19,23,27,31,50,54,58,62,85,86,87,88],
layermb=[ 5, 6, 7, 8,18,22,26,30,51,55,59,63,89,90,91,92],
layerlw=[].concat(layerl[0],layerl.slice(1),layerml),
layerrw=[].concat(layerr[0],layerr.slice(1),layermr),
layeruw=[].concat(layeru[0],layeru.slice(1),layermu),
layerdw=[].concat(layerd[0],layerd.slice(1),layermd),
layerfw=[].concat(layerf[0],layerf.slice(1),layermf),
layerbw=[].concat(layerb[0],layerb.slice(1),layermb),
layer33=Array.from(new Set([].concat(layeru[0],layerl[0],layerf[0],layerr[0],layerb[0],layerd[0])));
layer34=[0].concat(layeru[0].slice(0,9),layerl[0].slice(0,9),layerf[0].slice(0,9),layerr[0].slice(0,9),layerb[0].slice(0,9),layerd[0].slice(0,9));
layer24=[0,1,3,9,11,17,19,25,27,33,35,41,43,49,51,57,59,65,67,73,75,81,83,89,91];
var cubes44=[...[...Array(96)].map((v, i)=> i+1)].filter(function(value, index, array) {
  return (!layer33.includes(value));
});
wholecube=[layer33,...cubes44];
        c=new Array(6,7,10,11,22,23,26,27,38,39,42,43,54,55,58,59,75,74,71,70,86,87,90,91);   // center
        eg=new Array(21,72,25,76,69,56,73,60, 44,57,40,53,37,24,41,28,                        // edge.  blue,green
                      3,66, 2,67,12,50, 8,51, 14,34,15,35, 5,18, 9,19,                        //        white
                     94,79,95,78,92,63,88,62, 83,47,82,46,85,31,89,30);                       //        yellow
// 　　              0,1,2, 3,  4, 5, 6, 7,  8, 9, 10,11, 12,13,14,15, 16,17,18,19, 20,21,22,23
        cr=new Array(7,6,10,11, 23,22,26,27, 39,38,42,43, 55,54,58,59, 71,70,74,75, 87,86,90,91);  // center rotation
}
// console.log(layer34);
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
/*
*/
  $(".rotateE").mousedown(function(){  turn("E")}),
  $(".rotateEi").mousedown(function(){ turn("e")}),
  $(".rotateC").mousedown(function(){   turn("Mc")}),
  $(".rotateCi").mousedown(function(){  turn("mc")}),
  $(".rotateM").mousedown(function(){  turn("M")}),
  $(".rotateMi").mousedown(function(){ turn("m")}),
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