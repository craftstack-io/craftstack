/* CraftMeetCode art engine — shared by the website and generator, so previews match the generated NFT artwork. */
function cmcRng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const CMC_METALS=[["Gold","#fff0b0","#ffd24a","#d49a1c","#8a5a0c"],["Ruby","#ffb8b8","#ef4a4a","#b02323","#6a1010"],["Emerald","#b8ffd2","#3fd37a","#1f9a52","#0f5c2e"],["Sapphire","#bcdaff","#4a8cf0","#2a5cb8","#142f6e"],["Amethyst","#ecc8ff","#a65df0","#7332b8","#401569"],["Cyan","#c8fbff","#3fd6e0","#1d9aa8","#0e5560"],["Rose","#ffd2ec","#ff6fb8","#c73a85","#7a1a50"],["Silver","#f4f1ea","#c8c2b4","#8f897c","#585247"],["Copper","#ffc89a","#e08a4a","#a85420","#6a300e"],["Obsidian","#9096aa","#4f5466","#2f3342","#171923"],["Lime","#f2ffb4","#b6f03a","#7bb81c","#46690c"],["Pearl","#ffffff","#e8ecf2","#aab3c2","#6a7385"]];
const CMC_GLOWS=[["Cyan","#4fe3ff"],["Orange","#ff7a2e"],["Lime","#7dff6a"],["White","#ffffff"],["Red","#ff4f6a"],["Yellow","#ffe45c"],["Violet","#d98bff"],["Pink","#ff5cc8"]];
const CMC_BGS=[["Bronze","#1c150a","#120d06"],["Teal","#0f1b1c","#0a1213"],["Wine","#201014","#150a0c"],["Navy","#111424","#0a0c17"],["Violet","#1a1030","#100a1e"],["Forest","#0e1d12","#08120a"],["Slate","#1d1a22","#121016"],["Rust","#2a1208","#1a0b05"],["Ocean","#0c2230","#07151e"],["Plum","#2a1024","#1a0a16"]];
const CMC_HATS=[["Orange","#ff9a2e","#ffc76a","#b85c10"],["Yellow","#ffd24a","#fff0b0","#c98a14"],["Red","#ef4a4a","#ff9a9a","#a02020"],["Blue","#4a8cf0","#9cc4ff","#2a5cb8"],["Green","#3fd37a","#a0ffc4","#1f8a4c"],["Purple","#a65df0","#d8b0ff","#6a2ab0"]];
/* Draw token `id` (1–10,000) to a 32×32 context and return its trait list. */
function drawToken(c,id){
  const r=cmcRng(id*7919+13);
  const P=(x,y,k)=>{c.fillStyle=k;c.fillRect(x,y,1,1)};
  const R=(x,y,w,h,k)=>{c.fillStyle=k;c.fillRect(x,y,w,h)};
  const pick=a=>a[Math.floor(r()*a.length)];
  const OL="#140e04";
  const boxes=(list,k,hi,sh)=>{list.forEach(b=>R(b[0]-1,b[1]-1,b[2]+2,b[3]+2,OL));
    list.forEach(b=>{R(b[0],b[1],b[2],b[3],k);if(hi)R(b[0],b[1],b[2],1,hi);if(sh)R(b[0],b[1]+b[3]-1,b[2],1,sh)})};
  const mt=pick(CMC_METALS),M=[mt[1],mt[2],mt[3],mt[4]],gl=pick(CMC_GLOWS),glow=gl[1],bgp=pick(CMC_BGS),bg=[bgp[1],bgp[2]];
  const T=[["Body",mt[0]],["Eye Color",gl[0]],["Background",bgp[0]]];
  R(0,0,32,32,bg[0]);
  for(let y=0;y<32;y++)for(let x=0;x<32;x++){if((x+y)%2===0&&y%6<2)P(x,y,bg[1])}
  R(0,28,32,4,bg[1]);for(let x=0;x<32;x+=2)P(x,28,bg[0]);
  for(let i=0;i<9;i++)P(Math.floor(r()*32),Math.floor(r()*20),"rgba(255,255,255,.3)");
  const ham=r()<.5;
  if(ham){boxes([[28,18,2,11]],"#8a5a2a","#b07a3a");boxes([[25,13,7,4]],"#b9c0cc","#eef2f8","#7d8696")}
  boxes([[6,26,20,6]],M[1],M[0],M[2]);R(24,27,2,5,M[2]);R(6,27,1,5,M[0]);
  R(13,27,6,4,OL);const bk=pick([0,1]);
  if(bk){P(14,28,glow);P(13,29,glow);P(14,30,glow);P(18,28,glow);P(19,29,glow);P(18,30,glow)}else{R(14,28,4,1,glow);R(14,30,4,1,glow);P(15,29,glow);P(17,29,glow)}
  R(14,23,4,3,M[3]);R(14,25,4,1,OL);
  const ears=r()<.7;
  if(ears)boxes([[6,13,2,5],[24,13,2,5]],M[2],M[1]);
  R(9,7,14,17,OL);R(8,8,16,15,OL);
  R(10,8,12,15,M[1]);R(9,9,14,13,M[1]);
  R(10,8,12,1,M[0]);R(9,9,1,11,M[0]);R(10,9,1,1,M[0]);
  R(22,10,1,12,M[2]);R(10,22,12,1,M[2]);R(21,21,1,1,M[2]);
  P(11,20,M[3]);P(20,20,M[3]);P(11,10,M[3]);P(20,10,M[3]);
  R(10,12,12,6,OL);R(11,13,10,4,"#071217");
  const es=Math.floor(r()*5);
  if(es===0){R(12,14,2,2,glow);R(18,14,2,2,glow);P(12,14,"#fff");P(18,14,"#fff")}
  else if(es===1){R(12,14,8,2,glow);P(12,14,"#fff")}
  else if(es===2){[[12,15],[13,14],[14,15],[17,15],[18,14],[19,15]].forEach(p=>P(p[0],p[1],glow))}
  else if(es===3){[0,1].forEach(i=>{const x=12+i*6;P(x,13,glow);P(x+2,13,glow);P(x+1,14,glow);P(x,15,glow);P(x+2,15,glow)})}
  else{[[13,13],[12,14],[13,15],[18,13],[19,14],[18,15]].forEach(p=>P(p[0],p[1],glow))}
  R(11,13,3,1,"rgba(255,255,255,.22)");
  const ms=Math.floor(r()*3);
  if(ms===0){for(let x=13;x<19;x+=2)R(x,19,1,2,OL)}
  else if(ms===1){P(13,19,OL);R(14,20,4,1,OL);P(18,19,OL)}
  else R(13,20,6,1,OL);
  const t=Math.floor(r()*6);let hatN="None";
  if(t===0){boxes([[15,4,2,3]],M[2]);boxes([[14,1,4,3]],glow,"#fff")}
  else if(t===1){const h=pick(CMC_HATS);hatN=h[0];
    boxes([[10,3,12,4],[9,5,14,3]],h[1],h[2],h[3]);R(15,3,2,5,h[2]);R(8,8,16,1,OL);R(8,7,16,1,h[3])}
  else if(t===2){boxes([[11,3,2,4],[19,3,2,4]],M[2]);boxes([[10,1,4,3],[18,1,4,3]],glow,"#fff")}
  else if(t===3){boxes([[10,5,12,3],[10,3,2,3],[15,2,2,4],[20,3,2,3]],"#ffe07a","#fff6c8","#d49a1c");P(15,6,glow);P(16,6,glow)}
  else if(t===4){R(9,9,14,2,"#5a3a1a");R(9,9,14,1,"#7a5226");boxes([[11,5,4,3],[17,5,4,3]],glow,"#fff");R(14,6,4,1,OL)}
  const sp=r()<.45;
  if(sp)[[3,6],[28,9],[4,19]].forEach(q=>{if(r()<.8){P(q[0],q[1],M[0]);[[-1,0],[1,0],[0,-1],[0,1]].forEach(d=>P(q[0]+d[0],q[1]+d[1],M[1]))}});
  T.push(["Eyes",["Square","Visor","Happy","Cross","Code"][es]],["Mouth",["Grille","Smile","Line"][ms]],
    ["Headgear",["Antenna","Hard Hat","Twin Antenna","Crown","Goggles","None"][t]],["Hat Color",hatN],
    ["Ears",ears?"Yes":"No"],["Hammer",ham?"Yes":"No"],["Chest Badge",bk?"Code":"Face"],["Sparkles",sp?"Yes":"No"]);
  return T;
}
if(typeof module!=="undefined")module.exports={drawToken};
