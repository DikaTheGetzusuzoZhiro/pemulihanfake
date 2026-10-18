(() => {
 const $=id=>document.getElementById(id), input=$("username"), avatar=$("avatar"), logs=$("logs");
 let running=false,soundOn=false,ctx=null,runTimer=null,lastUserId=null;
 function log(msg,cls="muted"){const p=document.createElement("p");p.className=cls;p.textContent=msg;logs.appendChild(p);logs.scrollTop=logs.scrollHeight}
 function beep(freq=600,duration=.06){if(!soundOn)return;try{ctx ||= new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;g.gain.value=.03;o.connect(g);g.connect(ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.stop(ctx.currentTime+duration)}catch(e){}}
 function setFallback(label,msg){avatar.hidden=true;$("avatarFallback").hidden=false;$("avatarFallback").textContent="AVATAR UNAVAILABLE";$("avatarLabel").textContent=label;$("profileHint").textContent=msg}
 async function lookup(){
  const name=input.value.trim().replace(/^@+/,"");if(!name){$("profileHint").textContent="Masukkan username Roblox terlebih dahulu.";input.focus();return}
  $("lookup").disabled=true;$("profileStatus").textContent="SEARCHING";$("source").textContent="ROBLOX PUBLIC";$("displayName").textContent="@"+name;$("handle").textContent="Mencari profil publik…";$("avatarLabel").textContent="LOADING";$("avatar").hidden=true;$("avatarFallback").hidden=false;$("avatarFallback").textContent="LOADING";$("profileLink").href="https://www.roblox.com/search/users?keyword="+encodeURIComponent(name);$("retry").disabled=true;lastUserId=null;
  logs.replaceChildren();log("[PROFILE] Looking up username via public Roblox endpoint…","cyan");
  try{
   const response=await fetch("https://users.roblox.com/v1/usernames/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({usernames:[name],excludeBannedUsers:false})});
   if(!response.ok)throw Error("Username service returned "+response.status);
   const json=await response.json(),u=json.data&&json.data[0];
   if(!u){$("profileStatus").textContent="NOT FOUND";$("handle").textContent="Username tidak ditemukan";setFallback("NOT FOUND","Username tidak ditemukan. Pastikan ejaan benar atau buka Roblox untuk memeriksa profil.");log("[RESULT] No matching public username found.","warn");return}
   lastUserId=u.id;$("displayName").textContent=u.displayName||u.name;$("handle").textContent="@"+u.name+" · ID "+u.id;$("profileStatus").textContent="PROFILE FOUND";$("retry").disabled=false;$("profileLink").href="https://www.roblox.com/users/"+u.id+"/profile";
   log("[OK] Username resolved to user ID "+u.id,"green");await loadAvatar(u.id);
  }catch(err){$("profileStatus").textContent="LOOKUP FAILED";$("handle").textContent="@"+name+" · service unavailable";setFallback("LOOKUP FAILED","Tidak dapat menghubungi API Roblox dari browser ini. Coba lagi atau buka profil lewat Roblox.");log("[ERROR] Public username lookup failed. Network/CORS/API may be unavailable.","warn");log("[INFO] Check internet and retry. No fake avatar is shown.","muted")}
  finally{$("lookup").disabled=false}
 }
 async function loadAvatar(userId){
  $("avatarLabel").textContent="LOADING AVATAR";$("avatarFallback").hidden=false;$("avatarFallback").textContent="LOADING";avatar.hidden=true;
  const urls=[
   `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
   `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`
  ];
  for(const apiUrl of urls){
   try{
    const r=await fetch(apiUrl);if(!r.ok)continue;
    if(apiUrl.includes("thumbnails.roblox.com")){
     const data=await r.json(),imageUrl=data.data&&data.data[0]&&data.data[0].imageUrl;if(!imageUrl)continue;
     if(await setImage(imageUrl)){avatar.hidden=false;$("avatarFallback").hidden=true;$("avatarLabel").textContent="PUBLIC AVATAR";$("profileHint").textContent="Avatar publik berhasil dimuat dari thumbnail Roblox."; $("source").textContent="ROBLOX THUMBNAIL";log("[OK] Avatar thumbnail loaded.","green");beep(760);return}
    }else if(await setImage(apiUrl)){avatar.hidden=false;$("avatarFallback").hidden=true;$("avatarLabel").textContent="PUBLIC AVATAR";$("profileHint").textContent="Avatar publik berhasil dimuat."; $("source").textContent="ROBLOX HEADSHOT";log("[OK] Avatar headshot loaded.","green");beep(760);return}
   }catch(e){/* Try the next public thumbnail endpoint. */}
  }
  setFallback("AVATAR UNAVAILABLE","Username ditemukan, tetapi gambar avatar diblokir atau layanan thumbnail sedang gagal. Tekan Coba muat ulang avatar atau buka profil Roblox.");
  $("source").textContent="THUMBNAIL UNAVAILABLE";log("[WARN] Profile found, but thumbnail image could not load.","warn");log("[INFO] Retry avatar or open the Roblox profile link.","muted");
 }
 function setImage(url){return new Promise(resolve=>{let done=false;const finish=v=>{if(done)return;done=true;avatar.onload=null;avatar.onerror=null;resolve(v)};avatar.onload=()=>finish(true);avatar.onerror=()=>finish(false);avatar.src=url; if(avatar.complete&&avatar.naturalWidth>0)finish(true);setTimeout(()=>finish(false),7000)})}
 $("lookup").addEventListener("click",lookup);input.addEventListener("keydown",e=>{if(e.key==="Enter")lookup()});$("retry").addEventListener("click",()=>{if(lastUserId)loadAvatar(lastUserId)});
 $("sound").addEventListener("click",()=>{soundOn=!soundOn;$("sound").textContent="♫ Suara: "+(soundOn?"Nyala":"Mati");$("sound").setAttribute("aria-pressed",String(soundOn));if(soundOn)beep(750,.1)});
 $("clear").addEventListener("click",()=>{logs.replaceChildren();log("[SYSTEM] Terminal cleared.","muted")});
 $("scan").addEventListener("click",()=>{if(running)return;running=true;$("scan").disabled=true;$("result").hidden=true;logs.replaceChildren();$("fill").style.width="0%";$("percent").textContent="0%";$("progressLabel").textContent="RUNNING VISUAL SEQUENCE";$("ready").textContent="RUNNING";const name=input.value.trim().replace(/^@+/,"")||"Player";const steps=[[12,"[INIT] Starting visual scan sequence…","cyan"],[27,"[CHECK] Checking profile preview…","muted"],[43,"[SIM] Generating fictional security events…","warn"],[61,"[SAFE] No login or private data requested.","green"],[78,"[SIM] Completing visual effects…","cyan"],[100,"[DONE] Visual scan finished.","green"]];let i=0;runTimer=setInterval(()=>{if(i>=steps.length){clearInterval(runTimer);runTimer=null;running=false;$("scan").disabled=false;$("scan").textContent="↻ Scan lagi";$("ready").textContent="COMPLETE";$("progressLabel").textContent="VISUAL SEQUENCE COMPLETE";$("resultTitle").textContent="Scan selesai";$("resultText").textContent="Animasi scan untuk "+name+" selesai. Ini bukan hasil peretasan dan tidak mengungkap password atau akses akun."; $("result").hidden=false;beep(850,.12);return}const s=steps[i++];$("fill").style.width=s[0]+"%";$("percent").textContent=s[0]+"%";log(s[1],s[2]);beep(350+s[0]*4,.05)},650)});
 function tick(){$("clock").textContent=new Date().toLocaleTimeString("id-ID",{hour12:false})}tick();setInterval(tick,1000);
})();