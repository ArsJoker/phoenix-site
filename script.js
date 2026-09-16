const nav=document.getElementById('nav'),menu=document.getElementById('menu');
menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰';};
document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';});
document.addEventListener('click',e=>{
  if(nav.classList.contains('open') && !nav.contains(e.target) && e.target!==menu){
    nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';
  }
});

const dialog=document.getElementById('dialog');
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>dialog?.showModal());
const closeButton=document.getElementById('close');
if(closeButton) closeButton.onclick=()=>dialog.close();

const FORM_ENDPOINT='https://script.google.com/macros/s/AKfycbz2UUiw8DTgtlF1QexuhhJuHlQBgYegsP6hKfxSgC33KnZNsfroTeIfZTLiP5ETIM-W/exec';
const form=document.getElementById('form');
const submitButton=document.getElementById('submitButton');
const formStatus=document.getElementById('formStatus');

if(form) form.onsubmit=async e=>{
  e.preventDefault();
  submitButton.disabled=true;
  submitButton.textContent='Отправляем…';
  formStatus.textContent='';

  try {
    const fd=new FormData(form);
    const payload={
      name: fd.get('name') || '',
      hearingStatus: fd.get('hearingStatus') || '',
      contact: fd.get('contact') || '',
      sport: fd.get('sport') || 'Баскетбол'
    };

    await fetch(FORM_ENDPOINT,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(payload)
    });

    form.reset();
    formStatus.textContent='Заявка отправлена!';
    submitButton.textContent='Отправлено ✓';

    setTimeout(()=>{
      dialog.close();
      submitButton.disabled=false;
      submitButton.textContent='Отправить заявку';
      formStatus.textContent='';
    },1400);

  } catch(err) {
    console.error(err);
    formStatus.textContent='Не удалось отправить заявку. Попробуйте ещё раз.';
    submitButton.disabled=false;
    submitButton.textContent='Отправить заявку';
  }
};

const s=document.getElementById('search'),c=document.getElementById('cat'),cards=[...document.querySelectorAll('.words article')];
function filter(){const q=s.value.toLowerCase();cards.forEach(x=>x.hidden=!(x.dataset.word.includes(q)&&(c.value==='all'||x.dataset.cat===c.value)));}
if(s) s.oninput=filter;if(c) c.onchange=filter;


// V8 — VK Video dictionary player
const videoModal=document.getElementById('videoModal');
const videoFrameWrap=document.getElementById('videoFrameWrap');
const vkExternal=document.getElementById('vkExternal');

function openVkVideo(ownerId, videoId){
  const pageUrl=`https://vkvideo.ru/video${ownerId}_${videoId}`;
  // VK's public embed endpoint. If VK blocks embedding for a particular video,
  // the external link remains available below the player.
  const embedUrl=`https://vk.com/video_ext.php?oid=${encodeURIComponent(ownerId)}&id=${encodeURIComponent(videoId)}&hd=2&autoplay=1`;
  videoFrameWrap.innerHTML=`<iframe src="${embedUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="VK Видео"></iframe>`;
  vkExternal.href=pageUrl;
  videoModal.hidden=false;
  document.body.style.overflow='hidden';
}

function closeVkVideo(){
  videoModal.hidden=true;
  videoFrameWrap.innerHTML='';
  document.body.style.overflow='';
}

document.querySelectorAll('.vk-video-button').forEach(button=>{
  button.addEventListener('click',()=>openVkVideo(button.dataset.vkOwner,button.dataset.vkVideo));
});
document.querySelectorAll('[data-close-video]').forEach(button=>button.addEventListener('click',closeVkVideo));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && videoModal && !videoModal.hidden) closeVkVideo();});

// V15 — регистрация из карточки события
document.querySelectorAll('.event-register').forEach(button=>{
  button.addEventListener('click',()=>{
    if(!form || !dialog) return;
    const sport=form.querySelector('[name="sport"]');
    const event=form.querySelector('[name="event"]');
    if(sport) sport.value=button.dataset.sport || '';
    if(event) event.value=button.dataset.event || '';
    const box=document.getElementById('selectedEvent');
    const name=document.getElementById('selectedEventName');
    const meta=document.getElementById('selectedEventMeta');
    if(name) name.textContent=button.dataset.event || button.dataset.sport || '';
    if(meta) meta.textContent=[button.dataset.date,button.dataset.time,button.dataset.place].filter(Boolean).join(' · ');
    if(box) box.hidden=false;
    dialog.showModal();
  });
});


// V12 — обязательное согласие перед отправкой заявки
const dataConsent=document.getElementById('dataConsent');
const consentSubmit=document.getElementById('submitButton') || document.querySelector('dialog form button[type="submit"]');

function syncConsentButton(){
  if(dataConsent && consentSubmit){
    consentSubmit.disabled=!dataConsent.checked;
  }
}
if(dataConsent){
  dataConsent.addEventListener('change',syncConsentButton);
  syncConsentButton();
}

// После успешного сброса формы кнопка снова должна быть неактивной.
const consentForm=document.getElementById('joinForm') || document.querySelector('dialog form');
if(consentForm){
  consentForm.addEventListener('reset',()=>{
    setTimeout(syncConsentButton,0);
  });
}



// V15 — предложения и пожелания
const feedbackForm=document.getElementById('feedbackForm');
const feedbackStatus=document.getElementById('feedbackStatus');
if(feedbackForm){
  feedbackForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(feedbackForm);
    const subject=`Предложение для проекта «Феникс»: ${data.get('feedbackTopic')}`;
    const body=`Имя: ${data.get('feedbackName')}\nКонтакт: ${data.get('feedbackContact')}\nТема: ${data.get('feedbackTopic')}\n\nПредложение:\n${data.get('feedbackMessage')}`;
    feedbackStatus.textContent='Открываем письмо — останется нажать «Отправить».';
    window.location.href=`mailto:volt-02@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// V25 — flip team cards on click / keyboard
function toggleTeamCard(card){
  const flipped=card.classList.toggle('is-flipped');
  card.setAttribute('aria-pressed',String(flipped));
}
document.querySelectorAll('.flip-card').forEach(card=>{
  card.addEventListener('click',()=>toggleTeamCard(card));
  card.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){e.preventDefault();toggleTeamCard(card);}
  });
});
