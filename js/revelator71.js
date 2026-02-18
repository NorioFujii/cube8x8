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
    WhiteXI(m,color,ck);
}
function DedgeCheck(color) {
    var n=0,i;
    for (i in [53,49,47,51])
        if ((Nc([53,49,47,51][i])==color)&&(Nc([41,14,23,32][i])==Nc([44,17,26,35][i]))) n++;
  
  return n;
}

function WhiteXI(m,color,ck) {

    if (m>=8) {
        if (opt.sayu.value=="L") { // 初期の配置型に揃える
            turn("X2");
            Rotates.push("*ゴール!!","*Fin");
            setTimeout("SolveNavi(35)",1000);
        } else setTimeout("SolveNavi(8)",100);  // 9
        return true;
    }
    seq2 = String(N-1) + "連";
    var n=0, l, i, j, Us2, usLen, Us = "*白色エッジを賢く下層へ"+NoRot.replace(" ",",");
    const Uedge = [2,4,8,6], Sedge = [38,11,20,29,38,11,20,29],
          Hedge = [[13,41],[15,22],[22,14],[24,31],[31,23],[33,40],[40,32],[42,13]],
          Ccube = [[42,32],[22,14],[15,41],[31,23],[24,14],[40,32],[33,23],[13,41]];
    const r180 = ["B","L","F","R","B","L","F","R"];
    const Dedge = [[44,53],[17,49],[26,47],[35,51]];
    for (i in Dedge) { var ocolor = Nc(Dedge[i][1]) ;
        if ((Nc(Dedge[i][0])==color)&&(Math.abs(ocolor-Nc(Dedge[i][0]-3)==2))) {
            // 下層で横白の底の色がセンターと反対色なら
            // 青←→緑、赤←→橙の時だけ、D 一発
            // const White=8,Orange=2,Green=3,Red=4,Blue=5,Yellow=6;
            uu(),Us += ",D";
            break;
        }
    }
  dropW:
    while (DedgeCheck(color)<4) {
        Us2 = "";   // kiir();         debugger;

        // 中間層の横２連を縦にする。(横２連の処理が縦２連を壊すことはないが、上向き白エッジはずらす。)
        for (i in Hedge) {
            if ((Nc(Hedge[i][0])==color)&&(Nc(Hedge[i][1])==Nc(Hedge[i][1]+1)))  // 横２連
                Us2 = ((Nc([2,8,4,6,8,2,6,4][i])==color)?",u,":",") + ["B","f","L","r","F","b","R","l"][i]; // 
            if (Us2!="") {if (Us2.slice(0,2)==",u") n++;
                Us += ",*中段エッジの横"+seq2+"を　　下層へ,*#"+Hedge[i][0]+Hedge[i][1] + turnSftND(Us2);
                continue dropW;
            }
        }
        // 上向き白エッジを縦２連にして、180度縦回転する。center下が白のとき90度で横二連ができる方へ回転する。
        // 　center横先が白のとき90度で横二連ができる方へ回転する。
        for (i in Uedge) if (Nc(Uedge[i])==color) { j = Number(i); UsLen=Us.length; // iはプロパティから数値jへ変わる
            l=4;while ((l-->0)&&((Nc(Sedge[j+(3-l)])!=Nc(Sedge[j+(3-l)]+3)))) { ui(),Us += ",u"; } // 上層エッジをセンターに合わせる
            if (l>=0) {
                j += (3-l);
                Us2 = ","+ r180[j] + "2"; // 通常は、180度回転
                if (Nc(Sedge[j]+6)==color) { // 
                    if (Nc([53,49,47,51][j&3])==Nc(Sedge[j+1]+3)) {
                        Us2 = ","+r180[j].toLowerCase()+","+r180[j+1].toLowerCase(); // 左へ90度+90度
                        Us2 += Us2.slice(0,2); n += 2;
                    } else if (Nc([53,49,47,51][j&3])==Nc(Sedge[(j+4-1)&3]+3)) {     // 右へ90度+90度
                        Us2 = ","+r180[j]+","+r180[(j+4-1)&3]+","+r180[j];
                    }
                } else if (Nc([33,24,15,42][j&3])==color) { // 右90度＋"U"＋右90度
                    Us2 = ","+r180[j]+",u,"+r180[j]; n += 2;
                } else if (Nc([13,22,31,40][j&3])==color) { // 左90度＋"U"＋左90度
                    Us2 = ","+r180[j].toLowerCase()+",u,"+r180[j].toLowerCase();
                }
                Us += ",*上層の縦"+seq2+"を回転,*#0"+Uedge[j&3]+Sedge[j] + turnSftND(Us2);
                continue dropW;
            }
        }
        // 上層横向き白エッジを隣面の中段に下して２連とし、下層へ縦回転し、元の面を戻す
    roteW:
        for (i in Sedge.slice(0,4))
            if (Nc(Sedge[i])==color) {
                if ((Nc([14,23,32,41][i])!=Nc(Uedge[i]))&&(Nc([32,41,14,23][i])!=Nc(Uedge[i]))) {
                     ui(),Us += ",u";
                     continue roteW;
                } // 上層エッジを中段に合わせる
                if (Nc([14,23,32,41][i])==Nc(Uedge[i]))      Us2 = "," + ["B,l,b","L,f,l","F,r,f","R,b,r"][i];
                else if (Nc([32,41,14,23][i])==Nc(Uedge[i])) Us2 = "," + ["b,R,B","l,B,L","f,L,F","r,F,R"][i];
                Us += ",*横向きのエッジを中段で連結し下層へ,*#"+[38,11,20,29][i] + turnSftND(Us2);
                continue dropW;
             }
        // 底面で孤立している白エッジを下面または縦回転する。途中で横２連になるなら、90度ずつに回転とする。
        for (i in Dedge) {
            if ((Nc(Dedge[i][0])==color)&&(Nc(Dedge[i][0]-3)==(Nc(Dedge[i][1])))) {
                Us2 = ",D," + ["L","F","R","B"][i] + ",d," + ["B","L","F","R"][i] ; 
                Us += ",*下層の孤立白色エッジを下向きに,*#"+Dedge[i][0]+Dedge[i][1] + turnSftND(Us2);
                continue dropW;
            }
            if (((Nc(Dedge[i][0])==color)||(Nc(Dedge[i][1])==color))&&
                (Nc(Dedge[i][0])!=(Nc(Dedge[i][0]-3)))) { j = Number(i); UsLen=Us.length; // iはプロパティから数値jへ変わる
                l=4;while ((l-->0)&&((Nc(Uedge[j&3])==color)||(Nc(Sedge[i])==color))) { ui(),Us += ",u"; } // 上層エッジが白の間飛ばす
                if (l<0) break;
                Us2 = "," + ["B","L","F","R"][i] + "2";   // 通常は、180度回転
                if (Nc(Dedge[i][0])==color) { // 底面横向きが白なら
                    if (Nc(Dedge[i][1])==Nc(Sedge[(j+1)&3]+3)) {
                        Us2 = ","+r180[i].toLowerCase()+","+r180[j+1].toLowerCase(); // 左へ90度
                    } else if (Nc(Dedge[i][1])==Nc(Sedge[(j+4-1)&3]+3)) {            // 右へ90度
                        Us2 = ","+r180[i]+","+r180[(j+4-1)&3];
                    }
                } 
                Us += ",*下層の孤立白色エッジを上層へ,*#"+Dedge[i][0]+Dedge[i][1] + turnSftND(Us2);
                continue dropW;
            }
        }
        // 中間層の孤立白エッジは上層に戻し、犠牲となった隣面を90度戻す。
        for (i in Hedge) {
            if (Nc(Hedge[i][0])==color) {
                l=4;while ((l-->0)&&((Nc(Uedge[i&3])==color)||(Nc(Sedge[i])==color))) { ui(),Us += ",u"; } // 上層エッジが白の間飛ばす
                if (l<0) break;
                Us2 = "," + ["b","F","l","R","f","B","r","L"][i] + ((Nc(Ccube[i][0])==Nc(Ccube[i][1]))?",U,":",u,");
                Us2 += String.fromCharCode(Us2.charCodeAt(1)^0x20);
            }
            if (Us2!="") {
                Us += ",*中段の孤立エッジを　　　上層へ,*#"+Hedge[i][0]+Hedge[i][1] + turnSftND(Us2);
                continue dropW;
            }
        }
    }
    if (ck) return Us;
    Us = Us.replace(/u,u,u,/g,"U,").replace(/,u,u/g,",u2");
    Us = Us.replace(/,u2,u/g,",U");
       var arr = Us.split(',').filter(function(value, index, array) {
           return (value.charAt(0)!="*");
       });
       n = arr.length;
    console.log(Us," nextN=",n); // nextNは、Us内の*で始まらない要素数を表示すべし。
    setRot(rewind(Us));
    setTimeout("WhiteXI(8)",1000);
}
