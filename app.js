// 상태
// ═══════════════════════════════════════════════
let bookmarks = JSON.parse(localStorage.getItem('nyc_bm')||'[]');
let done = JSON.parse(localStorage.getItem('nyc_done')||'[]');
let currentTab='list';
let searchQ='';
let listFilter='all';
let cardOrder=[...Array(600)].map((_,i)=>i);
let cardIdx=0;
let cardFlipped=false;
let blankFilter='all';

function save(){
  localStorage.setItem('nyc_bm',JSON.stringify(bookmarks));
  localStorage.setItem('nyc_done',JSON.stringify(done));
}

function updateProgress(){
  const pct=Math.round(done.length/600*100);
  document.getElementById('progressFill').style.width=pct+'%';
  document.getElementById('totalBadge').textContent=`${done.length} / 600`;
}

// ═══════════════════════════════════════════════
// 탭 전환
// ═══════════════════════════════════════════════
function setTab(t){
  currentTab=t;
  document.querySelectorAll('.tab').forEach((el,i)=>{
    const tabs=['list','card','blank','fav'];
    el.classList.toggle('on',tabs[i]===t);
  });
  ['viewList','viewCard','viewBlank','viewFav'].forEach(id=>{
    document.getElementById(id).style.display=
      id==='view'+t.charAt(0).toUpperCase()+t.slice(1)?'block':'none';
  });
  if(t==='list') renderList();
  if(t==='card') renderCard();
  if(t==='blank') renderBlank();
  if(t==='fav') renderFav();
}

// ═══════════════════════════════════════════════
// 목록 뷰
// ═══════════════════════════════════════════════
function getFilteredPH(){
  let list=PH;
  if(searchQ){
    const q=searchQ.toLowerCase();
    list=list.filter(p=>p.kr.includes(searchQ)||p.en.toLowerCase().includes(q));
  }
  if(listFilter==='star') list=list.filter(p=>bookmarks.includes(p.n));
  else if(listFilter==='done') list=list.filter(p=>done.includes(p.n));
  else if(listFilter==='todo') list=list.filter(p=>!done.includes(p.n));
  else if(listFilter==='scene') list=list.filter(p=>SCENE[p.n]);
  else if(listFilter==='1-100') list=list.filter(p=>p.n>=1&&p.n<=100);
  else if(listFilter==='101-200') list=list.filter(p=>p.n>=101&&p.n<=200);
  else if(listFilter==='201-300') list=list.filter(p=>p.n>=201&&p.n<=300);
  else if(listFilter==='301-400') list=list.filter(p=>p.n>=301&&p.n<=400);
  else if(listFilter==='401-500') list=list.filter(p=>p.n>=401&&p.n<=500);
  else if(listFilter==='501-600') list=list.filter(p=>p.n>=501&&p.n<=600);
  return list;
}

function renderList(){
  const list=getFilteredPH();
  document.getElementById('listInfo').textContent=`${list.length}개 표현`;
  const c=document.getElementById('listContainer');
  c.innerHTML='';
  list.forEach((p,vi)=>{
    const isBm=bookmarks.includes(p.n);
    const isDone=done.includes(p.n);
    const hasScene=!!SCENE[p.n];
    const div=document.createElement('div');
    div.className='ph-item'+(isBm?' bookmarked':'');
    div.style.animationDelay=(vi%20*.02)+'s';
    div.innerHTML=`
      <div class="ph-top">
        <span class="ph-num">${String(p.n).padStart(3,'0')}</span>
        <span class="ph-kr">${esc(p.kr)}${isDone?'<span class="tag" style="color:var(--green);border-color:var(--green)">✓</span>':''}</span>
      </div>
      <div class="ph-en">${esc(p.en)}</div>
      ${hasScene?`<div class="ph-scene" id="sc${p.n}">${SCENE[p.n]}</div>`:''}
      <div class="ph-actions">
        ${hasScene?`<button class="ph-btn" onclick="toggleScene(${p.n},this)">💡 연상</button>`:''}
        <button class="ph-btn" onclick="speakPhrase('${escAttr(p.en)}',this)">🔊</button>
        <button class="ph-btn ${isBm?'star':''}" id="bm${p.n}" onclick="toggleBm(${p.n},this)">${isBm?'★':'☆'}</button>
        <button class="ph-btn ${isDone?'ok':''}" id="dn${p.n}" onclick="toggleDone(${p.n},this)">${isDone?'✅':'○'}</button>
      </div>`;
    c.appendChild(div);
  });
}

function toggleScene(n,btn){
  const sc=document.getElementById('sc'+n);
  if(!sc) return;
  const showing=sc.classList.toggle('show');
  btn.textContent=showing?'💡 닫기':'💡 연상';
}

function toggleBm(n,btn){
  const idx=bookmarks.indexOf(n);
  if(idx===-1) bookmarks.push(n);
  else bookmarks.splice(idx,1);
  save();
  const isBm=bookmarks.includes(n);
  btn.textContent=isBm?'★':'☆';
  btn.classList.toggle('star',isBm);
  const item=btn.closest('.ph-item');
  if(item) item.classList.toggle('bookmarked',isBm);
  updateProgress();
}

function toggleDone(n,btn){
  const idx=done.indexOf(n);
  if(idx===-1) done.push(n);
  else done.splice(idx,1);
  save();
  const isDone=done.includes(n);
  btn.textContent=isDone?'✅':'○';
  btn.classList.toggle('ok',isDone);
  updateProgress();
}

function speakPhrase(text,btn){
  if(!text||!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='en-US'; u.rate=0.82;
  window.speechSynthesis.speak(u);
  if(btn){ btn.classList.add('speak-on'); setTimeout(()=>btn.classList.remove('speak-on'),2000); }
}

function onSearch(v){
  searchQ=v;
  document.getElementById('searchClear').style.display=v?'block':'none';
  renderList();
}

function clearSearch(){
  searchQ='';
  document.getElementById('searchInput').value='';
  document.getElementById('searchClear').style.display='none';
  renderList();
}

function setFilter(f,el){
  listFilter=f;
  document.querySelectorAll('#filterRow .filter-chip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  renderList();
}

// ═══════════════════════════════════════════════
// 카드 학습
// ═══════════════════════════════════════════════
function getCurrentPH(){
  return PH[cardOrder[cardIdx]];
}

function renderCard(){
  const p=getCurrentPH();
  if(!p) return;
  cardFlipped=false;
  document.getElementById('cardInfo').textContent=`${cardIdx+1} / ${cardOrder.length}`;
  document.getElementById('cNum').textContent=`#${String(p.n).padStart(3,'0')}`;
  document.getElementById('cKr').textContent=p.kr;
  const sc=document.getElementById('cScene');
  if(SCENE[p.n]){ sc.textContent=SCENE[p.n]; sc.style.display='block'; }
  else sc.style.display='none';
  const en=document.getElementById('cEn');
  en.textContent=p.en; en.classList.remove('show');
  document.getElementById('cHint').textContent='▼ 탭해서 영어 확인';
  const isBm=bookmarks.includes(p.n);
  const isDone=done.includes(p.n);
  document.getElementById('cardStar').textContent=isBm?'★ 즐겨찾기':'☆ 즐겨찾기';
  document.getElementById('cardDone').textContent=isDone?'✅ 암기됨':'○ 암기완료';
  document.getElementById('cardDone').classList.toggle('ok',isDone);
}

function flipCard(){
  cardFlipped=!cardFlipped;
  const en=document.getElementById('cEn');
  en.classList.toggle('show',cardFlipped);
  document.getElementById('cHint').textContent=cardFlipped?'▼ 다음 표현으로':'▼ 탭해서 영어 확인';
}

function nextCard(){
  if(cardIdx<cardOrder.length-1) cardIdx++;
  else cardIdx=0;
  renderCard();
}

function prevCard(){
  if(cardIdx>0) cardIdx--;
  else cardIdx=cardOrder.length-1;
  renderCard();
}

function shuffleCards(){
  const arr=[...Array(600)].map((_,i)=>i);
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  cardOrder=arr; cardIdx=0; renderCard();
}

function resetCards(){
  cardOrder=[...Array(600)].map((_,i)=>i);
  cardIdx=0; renderCard();
}

function speakCard(){
  const p=getCurrentPH();
  if(p) speakPhrase(p.en,null);
}

function toggleCardStar(){
  const p=getCurrentPH();
  if(!p) return;
  const idx=bookmarks.indexOf(p.n);
  if(idx===-1) bookmarks.push(p.n);
  else bookmarks.splice(idx,1);
  save();
  const isBm=bookmarks.includes(p.n);
  document.getElementById('cardStar').textContent=isBm?'★ 즐겨찾기':'☆ 즐겨찾기';
}

function toggleCardDone(){
  const p=getCurrentPH();
  if(!p) return;
  const idx=done.indexOf(p.n);
  if(idx===-1) done.push(p.n);
  else done.splice(idx,1);
  save(); updateProgress();
  const isDone=done.includes(p.n);
  const btn=document.getElementById('cardDone');
  btn.textContent=isDone?'✅ 암기됨':'○ 암기완료';
  btn.classList.toggle('ok',isDone);
}

// ═══════════════════════════════════════════════
// 빈칸 채우기
// ═══════════════════════════════════════════════
function getBlankList(){
  let list=PH;
  if(blankFilter==='star') list=list.filter(p=>bookmarks.includes(p.n));
  else if(blankFilter==='todo') list=list.filter(p=>!done.includes(p.n));
  return list.slice(0,30); // 30개씩 표시
}

function makeBlank(en){
  // 영어 문장에서 핵심 단어(동사/관용어 핵심) 하나를 숨김
  const words=en.split(' ');
  if(words.length<3) return {html:en,word:''};
  // 4글자 이상이면서 일반 단어 중 랜덤 선택
  const cands=words.map((w,i)=>({w,i})).filter(({w})=>{
    const c=w.replace(/[^a-zA-Z]/g,'');
    return c.length>=4&&!['that','this','with','from','have','been','your','will','just','like','when','what','them','they','some','into','than'].includes(c.toLowerCase());
  });
  if(!cands.length) return {html:en,word:''};
  const pick=cands[Math.floor(Math.random()*cands.length)];
  const slot=`<span class="blank-slot" onclick="revealBlank(this,'${escAttr(pick.w)}')" data-word="${escAttr(pick.w)}">${'_'.repeat(pick.w.replace(/[^a-zA-Z]/g,'').length)}</span>`;
  const parts=[...words];
  parts[pick.i]=slot;
  return {html:parts.join(' '),word:pick.w};
}

function renderBlank(){
  const list=getBlankList();
  const c=document.getElementById('blankContainer');
  c.innerHTML='';
  list.forEach(p=>{
    const {html}=makeBlank(p.en);
    const div=document.createElement('div');
    div.className='blank-card';
    div.innerHTML=`
      <div class="blank-num">#${String(p.n).padStart(3,'0')}</div>
      <div class="blank-kr">${esc(p.kr)}</div>
      <div class="blank-en-wrap">${html}</div>
      ${SCENE[p.n]?`<div class="blank-scene">${SCENE[p.n]}</div>`:''}
      <div class="blank-tap">↑ 빈칸 탭하면 정답이 나타납니다</div>`;
    c.appendChild(div);
  });
}

function revealBlank(el,word){
  el.textContent=word;
  el.classList.add('revealed');
}

function setBlankFilter(f,el){
  blankFilter=f;
  document.querySelectorAll('#viewBlank .filter-chip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  renderBlank();
}

// ═══════════════════════════════════════════════
// 즐겨찾기
// ═══════════════════════════════════════════════
function renderFav(){
  const list=PH.filter(p=>bookmarks.includes(p.n));
  const c=document.getElementById('favContainer');
  document.getElementById('favInfo').textContent=`즐겨찾기 ${list.length}개`;
  if(!list.length){
    c.innerHTML=`<div class="fav-empty"><div class="fav-empty-icon">⭐</div>목록 뷰에서 ☆ 버튼을 눌러<br>즐겨찾기에 추가해 보세요</div>`;
    return;
  }
  c.innerHTML='';
  list.forEach(p=>{
    const div=document.createElement('div');
    div.className='ph-item bookmarked';
    div.innerHTML=`
      <div class="ph-top">
        <span class="ph-num">${String(p.n).padStart(3,'0')}</span>
        <span class="ph-kr">${esc(p.kr)}</span>
      </div>
      <div class="ph-en">${esc(p.en)}</div>
      ${SCENE[p.n]?`<div class="ph-scene show">${SCENE[p.n]}</div>`:''}
      <div class="ph-actions">
        <button class="ph-btn" onclick="speakPhrase('${escAttr(p.en)}',this)">🔊 듣기</button>
        <button class="ph-btn star" onclick="removeFav(${p.n})">★ 제거</button>
        <button class="ph-btn ${done.includes(p.n)?'ok':''}" onclick="toggleDone(${p.n},this)">${done.includes(p.n)?'✅':'○ 암기'}</button>
      </div>`;
    c.appendChild(div);
  });
}

function removeFav(n){
  bookmarks=bookmarks.filter(b=>b!==n);
  save();
  renderFav();
}

// ═══════════════════════════════════════════════
// 유틸
// ═══════════════════════════════════════════════
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function escAttr(s){return String(s||'').replace(/'/g,'&#39;').replace(/"/g,'&quot;');}

// 스크롤 맨 위


// ═══════════════════════════════════════════════
// 초기화
// ═══════════════════════════════════════════════
cardOrder=cardOrder;
updateProgress();
renderList();
</script>
