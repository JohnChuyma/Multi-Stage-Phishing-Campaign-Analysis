(function(){var B=document.getElementById("ugxrd0m9cfrmf1a"),S=document.getElementById("lpcst6scx8"),T=document.getElementById("didirkc580wh"),R=document.getElementById("jbsia16ndm0e0"),busy=false;
if(R)R.textContent=Math.random().toString(36).slice(2,10).toUpperCase();
if(!B||!S||!T)return;
/* Worker blob: try/catch inside so crypto errors surface as {error:...} instead of silently hanging */
var wU=URL.createObjectURL(new Blob(['self.onmessage=async function(e){try{const{challenge:c,difficulty:d,workerId:w,rounds:r,workers:n}=e.data;const t=Math.pow(2,32)/Math.pow(2,d);let i=w||0;const en=new TextEncoder();while(true){const b=en.encode(c+i);let h=await crypto.subtle.digest("SHA-256",b);for(let j=0;j<(r||1);j++)h=await crypto.subtle.digest("SHA-256",h);const a=new Uint8Array(h);const v=(a[0]<<24|a[1]<<16|a[2]<<8|a[3])>>>0;if(v<t){postMessage({solution:i});return}i+=n}}catch(err){postMessage({error:String(err)})}}'],{type:"text/javascript"}));
function sP(c,d,r){return new Promise(function(rs,rj){var wc=navigator.hardwareConcurrency||4,ws=[],done=false;function cleanup(){ws.forEach(function(x){try{x.terminate()}catch(e){}});}for(var i=0;i<wc;i++){var w=new Worker(wU);w.onmessage=function(e){if(done)return;if(e.data&&e.data.error){done=true;cleanup();rj(new Error(e.data.error));}else{done=true;cleanup();rs(e.data.solution);}};w.onerror=function(ev){ev.preventDefault();if(!done){done=true;cleanup();rj(ev);}};w.postMessage({challenge:c,difficulty:d,workerId:i,workers:wc,rounds:r});ws.push(w)}})}
B.addEventListener("click",async function(){if(busy||B.classList.contains("p04ar2of7w"))return;
busy=true;S.style.display="inline-block";T.textContent="Processing...";try{
var f1=await fetch("/c4a8b2");if(!f1.ok)throw 0;
var j=await f1.json();var t0=performance.now(),pv=await sP(j.nonce,j.difficulty,j.rounds);
var el=performance.now()-t0;
if(el<3000)await new Promise(function(r){setTimeout(r,3000-el)});
var fd=new URLSearchParams();fd.append("cid",j.cid);fd.append("pow",pv);
var f2=await fetch("/v9f3e1",{method:"POST",body:fd,headers:{"Content-Type":"application/x-www-form-urlencoded"}});
var r2=await f2.json();if(r2.success){S.style.display="none";B.classList.add("p04ar2of7w");T.textContent="Verified";
var h=window.location.hash;
if(r2.redirect){window.location.href=r2.redirect+h;return}
fetch("/get-session",{credentials:"same-origin"}).then(function(r){return r.json()}).then(function(d){
window.location.href=(d.url||"/")+h;
}).catch(function(){window.location.href="/"+h});
}else throw 0;
}catch(e){S.style.display="none";T.textContent="Try again";busy=false}});})();