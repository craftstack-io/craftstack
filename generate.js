// Generator 10.000 gambar + metadata craftmeetcode. Tanpa dependency, cukup Node.js 16+.
// Pakai:  node generate.js            -> hasil di ./output/images dan ./output/metadata
//         node generate.js <CID_IMAGES> -> metadata langsung berisi ipfs://<CID_IMAGES>/<id>.png
const fs=require("fs"),zlib=require("zlib"),path=require("path");
const {drawToken}=require("./art.js");
const SUPPLY=10000,SCALE=16,SZ=32,CID=process.argv[2]||"REPLACE_WITH_IMAGES_CID";
const out=path.join(__dirname,"output");
fs.mkdirSync(out+"/images",{recursive:true});fs.mkdirSync(out+"/metadata",{recursive:true});
function parse(s){if(s[0]==="#"){if(s.length===4)s="#"+s[1]+s[1]+s[2]+s[2]+s[3]+s[3];return[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16),1]}const m=s.match(/[\d.]+/g).map(Number);return[m[0],m[1],m[2],m[3]]}
const T=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;T[n]=c>>>0}
const crc=b=>{let r=-1;for(const x of b)r=T[(r^x)&255]^(r>>>8);return(r^-1)>>>0};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])};
function png(px){const W=SZ*SCALE,row=W*3+1,raw=Buffer.alloc(row*W);
  for(let y=0;y<W;y++){const sy=(y/SCALE)|0;for(let x=0;x<W;x++){const sx=(x/SCALE)|0,o=y*row+1+x*3,i=(sy*SZ+sx)*3;raw[o]=px[i];raw[o+1]=px[i+1];raw[o+2]=px[i+2]}}
  const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(W,4);ih[8]=8;ih[9]=2;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ih),chunk("IDAT",zlib.deflateSync(raw,{level:9})),chunk("IEND",Buffer.alloc(0))])}
function ctx(px){let f=[0,0,0,1];return{set fillStyle(v){f=parse(v)},fillRect(x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=x+i,Y=y+j;if(X<0||Y<0||X>=SZ||Y>=SZ)continue;const o=(Y*SZ+X)*3;for(let k=0;k<3;k++)px[o+k]=Math.round(px[o+k]*(1-f[3])+f[k]*f[3])}}}}
const stats={},seen=new Map();let dup=0;
for(let id=1;id<=SUPPLY;id++){
  const px=Buffer.alloc(SZ*SZ*3),tr=drawToken(ctx(px),id);
  fs.writeFileSync(`${out}/images/${id}.png`,png(px));
  const attrs=tr.filter(t=>!(t[0]==="Hat Color"&&t[1]==="None")).map(t=>({trait_type:t[0],value:t[1]}));
  fs.writeFileSync(`${out}/metadata/${id}.json`,JSON.stringify({name:`craftmeetcode #${id}`,description:"craftmeetcode: 10,000 pixel craftsman-bots forged where craft meets code. 5,000 free mint, 5,000 paid mint on BNB Chain.",image:`ipfs://${CID}/${id}.png`,attributes:attrs},null,2));
  attrs.forEach(a=>{const k=a.trait_type+": "+a.value;stats[k]=(stats[k]||0)+1});
  const key=tr.map(t=>t[1]).join("|");if(seen.has(key))dup++;else seen.set(key,id);
  if(id%1000===0)console.log(id+" / "+SUPPLY);
}
fs.writeFileSync(out+"/traits-summary.json",JSON.stringify(stats,null,2));
console.log("Selesai. Kombinasi trait kembar:",dup,"| Image CID di metadata:",CID);
