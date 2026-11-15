const $=id=>document.getElementById(id);
const defaults=[
 {id:"study",name:"Study & education",template:"{query} explanation notes"},
 {id:"technology",name:"Technology",template:"{query} technology"},
 {id:"current",name:"News & current affairs",template:"{query} latest news India"},
 {id:"jobs",name:"Jobs & internships",template:"{query} jobs internships India"},
 {id:"coding",name:"Coding tutorials",template:"{query} programming tutorial"}
];
let categories=JSON.parse(localStorage.getItem("jarvis_categories")||"null")||defaults;
let endpoint=localStorage.getItem("jarvis_endpoint")||"";
let recognition=null, speaking=false;
function saveCats(){localStorage.setItem("jarvis_categories",JSON.stringify(categories));renderCategories();}
function addLine(text,user=false){const d=document.createElement("div");d.className="msg"+(user?" user":"");const w=document.createElement("div");w.className="who";w.textContent=user?"YOU":"JARVIS";const b=document.createElement("div");b.className="bubble";b.textContent=text;d.append(w,b);$("chat").append(d);$("chat").scrollTop=$("chat").scrollHeight;}
function say(text){if(!("speechSynthesis" in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-IN";u.rate=.96;u.pitch=.92;const voices=speechSynthesis.getVoices();const chosen=$("voiceSelect").value; if(chosen){const v=voices.find(x=>x.name===chosen);if(v)u.voice=v;} speechSynthesis.speak(u);}
async function aiReply(text){
 if(!endpoint)return "I can handle basic commands and web searches now. To enable open-ended AI conversations, add your secure backend URL in Customize. I won't ask you to put an API key inside this app.";
 try{const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:text}]})});if(!r.ok)throw Error("Server returned "+r.status);const data=await r.json();return data.reply||"The AI server returned no reply.";}catch(e){return "I couldn't connect to your AI server. Check the endpoint and internet connection.";}}
async function respond(raw){const text=raw.trim();if(!text)return;addLine(text,true);$("message").value="";$("coreStatus").textContent="● PROCESSING";let reply="";
const c=text.toLowerCase();
if(/\b(time|what time)\b/.test(c))reply="The time is "+new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})+".";
else if(/\b(date|today|what day)\b/.test(c))reply="Today is "+new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+".";
else if(c.includes("joke"))reply="Why do programmers prefer dark mode? Because light attracts bugs.";
else if(c==="help"||c.includes("what can you do"))reply="I can tell the time and date, speak replies, search the web, use your custom search categories, and connect to an AI backend you configure.";
else if(c.startsWith("open youtube")){window.open("https://youtube.com","_blank");reply="Opening YouTube.";}
else if(c.startsWith("open google")){window.open("https://google.com","_blank");reply="Opening Google.";}
else if(c.startsWith("search ")||c.startsWith("search for ")){const q=text.replace(/^search( for)?\s*/i,"");window.open("https://www.google.com/search?q="+encodeURIComponent(q),"_blank");reply="Searching the web for "+q+".";}
else if(c.startsWith("play ")){const q=text.slice(5);window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(q),"_blank");reply="Finding "+q+" on YouTube.";}
else reply=await aiReply(text);
addLine(reply);say(reply);$("coreStatus").textContent="● READY WHEN YOU ARE";}
$("send").onclick=()=>respond($("message").value);$("message").addEventListener("keydown",e=>{if(e.key==="Enter")respond($("message").value)});
document.querySelectorAll("[data-command]").forEach(b=>b.onclick=()=>respond(b.dataset.command));
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));["home","search","settings"].forEach(id=>$(id).classList.toggle("hidden",id!==b.dataset.tab));});
function renderCategories(){
 $("categoryList").innerHTML="";$("categorySearch").innerHTML="";
 categories.forEach(cat=>{
  const item=document.createElement("div");item.className="category";const name=document.createElement("span");name.textContent=cat.name;const del=document.createElement("button");del.className="btn";del.textContent="Delete";del.onclick=()=>{categories=categories.filter(x=>x.id!==cat.id);saveCats();};item.append(name,del);$("categoryList").append(item);
  const box=document.createElement("div");box.className="panel";const title=document.createElement("b");title.textContent=cat.name;const row=document.createElement("div");row.className="row";const input=document.createElement("input");input.className="field";input.placeholder="What do you want to find?";const btn=document.createElement("button");btn.className="btn primary";btn.textContent="SEARCH";btn.onclick=()=>{const q=input.value.trim();if(!q)return;const query=cat.template.replaceAll("{query}",q);window.open("https://www.google.com/search?q="+encodeURIComponent(query),"_blank");};input.addEventListener("keydown",e=>{if(e.key==="Enter")btn.click();});row.append(input,btn);box.append(title,row);$("categorySearch").append(box);
 });
}
$("addCategory").onclick=()=>{const name=$("catName").value.trim(),template=$("catQuery").value.trim();if(!name||!template){alert("Enter a category name and search template.");return;}categories.push({id:"custom-"+Date.now(),name,template});$("catName").value="";$("catQuery").value="";saveCats();};
$("saveEndpoint").onclick=()=>{endpoint=$("endpoint").value.trim();if(endpoint&&!/^https:\/\//i.test(endpoint)){alert("For safety, use an HTTPS backend URL.");return;}localStorage.setItem("jarvis_endpoint",endpoint);$("endpointInfo").textContent=endpoint?"AI endpoint saved on this device.":"AI endpoint cleared.";};
$("endpoint").value=endpoint;
$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify({categories,endpoint},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="jarvis-settings.json";a.click();URL.revokeObjectURL(a.href);};
$("resetData").onclick=()=>{if(confirm("Reset custom categories and endpoint?")){localStorage.removeItem("jarvis_categories");localStorage.removeItem("jarvis_endpoint");categories=defaults;endpoint="";$("endpoint").value="";saveCats();}};
function loadVoices(){if(!("speechSynthesis" in window))return;const sel=$("voiceSelect");const current=sel.value;sel.innerHTML='<option value="">Default phone voice</option>';speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)).forEach(v=>{const o=document.createElement("option");o.value=v.name;o.textContent=v.name+" ("+v.lang+")";sel.append(o);});sel.value=current;}
$("testVoice").onclick=()=>say("Hello. I am JARVIS. Your personal assistant is ready.");
$("stop").onclick=()=>{if("speechSynthesis"in window)speechSynthesis.cancel();};
$("mic").onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert("Voice recognition is not supported in this browser. Try Chrome and check microphone permission.");return;}recognition=new SR();recognition.lang="en-IN";recognition.interimResults=false;recognition.onstart=()=>{$("voiceState").textContent="LISTENING";$("mic").textContent="🎙 LISTENING…";};recognition.onend=()=>{$("voiceState").textContent="READY";$("mic").textContent="🎙 TAP TO SPEAK";};recognition.onerror=()=>{addLine("Voice recognition had a problem. Please try again or type your message.");};recognition.onresult=e=>respond(e.results[0][0].transcript);recognition.start();};
if("speechSynthesis"in window){speechSynthesis.onvoiceschanged=loadVoices;loadVoices();}
$("aiState").textContent=endpoint?"CONFIGURED":"OPTIONAL";
addLine("Good day. JARVIS mobile systems are online. I can help with quick commands, voice, text and custom category searches.");
renderCategories();
if("serviceWorker"in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
