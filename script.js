(() => {
 const $=id=>document.getElementById(id), input=$("username"), avatar=$("avatar"), logs=$("logs");
 let running=false,soundOn=false,ctx=null,runTimer=null;
 function log(msg,cls="muted"){const p=document.createElement("p");p.className=cls;p.textContent=msg;logs.appendChild(p);logs.scrollTop=logs.scrollHeight}
 function beep(freq=600,duration=.06){if(!soundOn)return;try{ctx ||= new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;g.gain.value=.03;o.connect(g);g.connect(ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.stop(ctx.currentTime+duration)}catch(e){}}
 async function lookup(){
   const name=input.value.trim().replace(/^@+/,"");
   if(!name){$("profileHint").textContent="Masukkan username terlebih dahulu.";input.focus();return}
   $("lookup").disabled=true;$("profileStatus").textContent="SEARCHING";$("source").textContent="ROBLOX PUBLIC";$("displayName").textContent="@"+name;$("handle").textContent="Looking up public avatar…";$("avatarLabel").textContent="LOADING AVATAR";$("result").hidden=true;
   logs.replaceChildren();log("[PROFILE] Looking up public avatar thumbnail…","cyan");log("[INFO] Loading profile preview for @"+name,"muted");
   // Roblox thumbnail API needs a userId, so resolve username through Roblox's public users API first.
   try{
     const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);
     const r=await fetch("https://users.roblox.com/v1/usernames/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({usernames:[name],excludeBannedUsers:false}),signal:controller.signal});clearTimeout(timeout);
     if(!r.ok)throw new Error("lookup unavailable");
     const data=await r.json();const user=data.data&&data.data[0];
     if(!user){$("profileStatus").textContent="NOT FOUND";$("handle").textContent="Username not found";$("avatarLabel").textContent="PROFILE NOT FOUND";avatar.src="";$("avatarFallback").hidden=false;$("avatarFallback").textContent="?";$("profileHint").textContent="Username tidak ditemukan pada lookup publik. Periksa ejaan dan coba lagi.";log("[RESULT] Username not found in public lookup.","warn");return}
     $("displayName").textContent=user.displayName||user.name;$("handle").textContent="@"+user.name+" • ID "+user.id;$("profileStatus").textContent="PROFILE FOUND";$("avatarFallback").hidden=true;$("avatarLabel").textContent="PUBLIC AVATAR";
     avatar.onerror=()=>{avatar.hidden=true;$("avatarFallback").hidden=false;$("avatarFallback").textContent="R";$("profileHint").textContent="Profil ditemukan, tetapi thumbnail tidak bisa dimuat saat ini."};
     avatar.onload=()=>{avatar.hidden=false;$("avatarFallback").hidden=true};
     avatar.hidden=false;avatar.src=`https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=420x420&format=Png&isCircular=false`;
     $("profileHint").textContent="Profil publik ditemukan. Avatar dapat tidak tampil jika layanan Roblox tidak tersedia.";
     log("[OK] Public username resolved: "+user.name,"green");log("[OK] Avatar thumbnail request sent for user ID "+user.id,"cyan");beep(760);
   }catch(e){
     $("profileStatus").textContent="UNAVAILABLE";$("handle").textContent="@"+name+" • lookup unavailable";$("avatarLabel").textContent="AVATAR UNAVAILABLE";avatar.hidden=true;$("avatarFallback").hidden=false;$("avatarFallback").textContent="…";
     $("profileHint").textContent="Tidak dapat menghubungi layanan Roblox. Periksa koneksi, lalu coba lagi.";
     log("[WARN] Roblox public lookup unavailable (network/CORS/service).","warn");log("[INFO] Try again when the public service is reachable.","muted");
   }finally{$("lookup").disabled=false}
 }
 $("lookup").addEventListener("click",lookup);input.addEventListener("keydown",e=>{if(e.key==="Enter")lookup()});
 $("sound").addEventListener("click",()=>{soundOn=!soundOn;$("sound").textContent="♫ Suara: "+(soundOn?"Nyala":"Mati");$("sound").setAttribute("aria-pressed",String(soundOn));if(soundOn)beep(750,.1)});
 $("clear").addEventListener("click",()=>{logs.replaceChildren();log("[SYSTEM] Terminal cleared.","muted")});
 $("scan").addEventListener("click",()=>{
   if(running)return;running=true;$("scan").disabled=true;$("result").hidden=true;logs.replaceChildren();$("fill").style.width="0%";$("percent").textContent="0%";$("progressLabel").textContent="RUNNING VISUAL SEQUENCE";$("ready").textContent="RUNNING";
   const name=input.value.trim().replace(/^@+/,"")||"Player";const steps=[
    [12,"[INIT] Starting visual scan sequence…","cyan"],[27,"[CHECK] Checking public profile preview…","muted"],[43,"[SIM] Generating fictional security events…","warn"],[61,"[SAFE] No login or private data requested.","green"],[78,"[SIM] Completing visual effects…","cyan"],[100,"[DONE] Visual scan finished.","green"]
   ];let i=0;
   runTimer=setInterval(()=>{if(i>=steps.length){clearInterval(runTimer);runTimer=null;running=false;$("scan").disabled=false;$("scan").textContent="↻ Scan lagi";$("ready").textContent="COMPLETE";$("progressLabel").textContent="VISUAL SEQUENCE COMPLETE";$("resultTitle").textContent="Scan selesai";$("resultText").textContent="Animasi scan untuk "+name+" selesai. Ini bukan hasil peretasan dan tidak mengungkap keamanan, password, atau akses akun."; $("result").hidden=false;beep(850,.12);return}
     const s=steps[i++];$("fill").style.width=s[0]+"%";$("percent").textContent=s[0]+"%";log(s[1],s[2]);beep(350+s[0]*4,.05)
   },650)
 });
 function tick(){$("clock").textContent=new Date().toLocaleTimeString("id-ID",{hour12:false})}tick();setInterval(tick,1000);
})();