(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const config = window.MEAL_APP_CONFIG || {mode:"local", demoAdminId:"admin", demoAdminPassword:"meal123"};
  const STORAGE_KEY = "meal-count-records-v1";
  const today = new Date();
  let viewYear = today.getFullYear(), viewMonth = today.getMonth();
  let selectedKey = dateKey(today), isAdmin = false, records = loadRecords(), toastTimer;
  const THEME_KEY = "meal-count-theme-v1";

  function setTheme(theme) {
    const selected = theme === "dark" ? "dark" : "light";
    document.body.dataset.theme = selected;
    $("lightTheme").setAttribute("aria-pressed", String(selected === "light"));
    $("darkTheme").setAttribute("aria-pressed", String(selected === "dark"));
    try { localStorage.setItem(THEME_KEY, selected); } catch {}
  }
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem(THEME_KEY) || "light"; } catch {}
  setTheme(savedTheme);

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  }
  function parseKey(key) {
    const [y,m,d] = key.split("-").map(Number);
    return new Date(y,m-1,d);
  }
  function loadRecords() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch { return {}; }
  }
  function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); return true; }
    catch { showToast("Could not save in this browser."); return false; }
  }
  function formatDate(key, options={weekday:"long",year:"numeric",month:"long",day:"numeric"}) {
    return parseKey(key).toLocaleDateString(undefined, options);
  }
  function monthRecords() {
    const prefix = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-`;
    return Object.entries(records).filter(([key,v]) => key.startsWith(prefix) && Number.isInteger(v) && v >= 0);
  }
  function renderStats() {
    const values = monthRecords().map(([,v])=>v);
    const total = values.reduce((a,b)=>a+b,0);
    $("monthTotal").textContent = total;
    $("monthAverage").textContent = values.length ? (total/values.length).toFixed(1) : "0.0";
    $("daysLogged").textContent = values.length;
  }
  function renderCalendar() {
    const first = new Date(viewYear,viewMonth,1);
    const days = new Date(viewYear,viewMonth+1,0).getDate();
    const offset = (first.getDay()+6)%7;
    $("monthLabel").textContent = first.toLocaleDateString(undefined,{month:"long",year:"numeric"});
    $("calendar").innerHTML = "";
    for(let i=0;i<42;i++){
      const dayNum=i-offset+1;
      const button=document.createElement("button");
      button.type="button"; button.className="day";
      if(dayNum<1||dayNum>days){button.classList.add("outside");button.disabled=true;button.setAttribute("aria-hidden","true");}
      else {
        const key=dateKey(new Date(viewYear,viewMonth,dayNum));
        const count=records[key];
        button.innerHTML=`<span class="day-num">${dayNum}</span>${Number.isInteger(count)&&count>=0?`<span class="day-count">${count} ${count===1?"meal":"meals"}</span>`:`<span class="day-count">—</span>`}`;
        if(Number.isInteger(count)&&count>=0)button.classList.add("has-count");
        if(key===dateKey(today))button.classList.add("today");
        if(key===selectedKey)button.classList.add("selected");
        button.setAttribute("aria-label",`${formatDate(key)}: ${Number.isInteger(count)?count+" meals":"no count recorded"}`);
        button.setAttribute("aria-pressed",String(key===selectedKey));
        button.addEventListener("click",()=>{selectedKey=key;renderCalendar();renderSelected();});
      }
      $("calendar").appendChild(button);
    }
    renderStats();
  }
  function renderSelected() {
    const count=records[selectedKey];
    $("selectedDate").textContent=formatDate(selectedKey);
    $("selectedCount").textContent=Number.isInteger(count)&&count>=0?count:"—";
    $("detailMessage").textContent=Number.isInteger(count)&&count>=0
      ? `A total of ${count} ${count===1?"meal was":"meals were"} recorded for this day.`
      : "No meal count has been recorded for this day yet.";
    $("editArea").hidden=!isAdmin;
    $("mealInput").value=Number.isInteger(count)&&count>=0?count:"";
    $("adminOpen").innerHTML=isAdmin?"♙ Admin · Sign out":"♙ Admin login";
    $("footerStatus").textContent=isAdmin?"Admin mode · Changes save in this browser":"Public view · Admin edits";
    if(!isAdmin)$("detailMessage").textContent += " Only the admin can make changes.";
  }
  function render(){renderCalendar();renderSelected();}
  function showToast(message) {
    const node=$("toast");node.textContent=message;node.classList.add("show");
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),2400);
  }
  function openModal(){ $("loginError").textContent="";$("loginForm").reset();$("loginModal").hidden=false;$("adminId").focus(); }
  function closeModal(){ $("loginModal").hidden=true; }
  $("lightTheme").addEventListener("click",()=>setTheme("light"));
  $("darkTheme").addEventListener("click",()=>setTheme("dark"));
  $("prevMonth").addEventListener("click",()=>{viewMonth--;if(viewMonth<0){viewMonth=11;viewYear--;}renderCalendar();});
  $("nextMonth").addEventListener("click",()=>{viewMonth++;if(viewMonth>11){viewMonth=0;viewYear++;}renderCalendar();});
  $("adminOpen").addEventListener("click",()=>{if(isAdmin){isAdmin=false;renderSelected();showToast("Signed out.");}else openModal();});
  $("closeModal").addEventListener("click",closeModal);
  $("loginModal").addEventListener("click",e=>{if(e.target===$("loginModal"))closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  $("loginForm").addEventListener("submit",e=>{
    e.preventDefault();
    if(config.mode!=="local"){$("loginError").textContent="Authentication is not configured. See README.md.";return;}
    if($("adminId").value.trim()===config.demoAdminId && $("adminPassword").value===config.demoAdminPassword){
      isAdmin=true;closeModal();renderSelected();showToast("Admin mode enabled.");
    }else{$("loginError").textContent="That admin ID or password is incorrect.";}
  });
  $("saveMeal").addEventListener("click",()=>{
    if(!isAdmin)return;
    const raw=$("mealInput").value, count=Number(raw);
    if(raw.trim()===""||!Number.isInteger(count)||count<0||count>99){showToast("Enter a whole number from 0 to 99.");return;}
    records[selectedKey]=count;
    if(saveRecords()){render();showToast("Meal count saved in this browser.");}
  });
  $("clearMeal").addEventListener("click",()=>{
    if(!isAdmin)return;
    delete records[selectedKey];
    if(saveRecords()){render();showToast("Count cleared in this browser.");}
  });
  render();
})();