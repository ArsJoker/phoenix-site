const nav=document.getElementById('nav'),menu=document.getElementById('menu');
menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));

const dialog=document.getElementById('dialog');
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>dialog.showModal());
document.getElementById('close').onclick=()=>dialog.close();

const FORM_ENDPOINT='https://script.google.com/macros/s/AKfycbx7wvkpEvXWzriyv0NVY1F7pa3-yOP9LsQcxazNKRWizLbWawc_TCTVFBry91N1P55t/exec';
const form=document.getElementById('form');
const submitButton=document.getElementById('submitButton');
const formStatus=document.getElementById('formStatus');

form.onsubmit=async e=>{
  e.preventDefault();
  submitButton.disabled=true;
  submitButton.textContent='Отправляем…';
  formStatus.textContent='';

  try {
    const data=new FormData(form);
    await fetch(FORM_ENDPOINT,{
      method:'POST',
      mode:'no-cors',
      body:data
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
s.oninput=filter;c.onchange=filter;


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

// V10 — регистрация из карточки события
document.querySelectorAll('.event-register').forEach(button=>{
  button.addEventListener('click',()=>{
    const dialog=document.getElementById('joinDialog');
    const form=document.getElementById('joinForm') || document.querySelector('dialog form');
    if(form){
      const select=form.querySelector('[name="sport"]');
      if(select) select.value=button.dataset.sport;
    }
    if(dialog && typeof dialog.showModal==='function') dialog.showModal();
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


// V13 — окно с полным текстом согласия
const consentDetailsDialog=document.getElementById('consentDetailsDialog');
const openConsentDetails=document.getElementById('openConsentDetails');
const closeConsentDetails=document.getElementById('closeConsentDetails');
const consentUnderstood=document.getElementById('consentUnderstood');

function showConsentDetails(){
  if(consentDetailsDialog && typeof consentDetailsDialog.showModal==='function'){
    consentDetailsDialog.showModal();
  }
}
function hideConsentDetails(){
  if(consentDetailsDialog && consentDetailsDialog.open) consentDetailsDialog.close();
}
if(openConsentDetails) openConsentDetails.addEventListener('click',showConsentDetails);
if(closeConsentDetails) closeConsentDetails.addEventListener('click',hideConsentDetails);
if(consentUnderstood) consentUnderstood.addEventListener('click',hideConsentDetails);
if(consentDetailsDialog){
  consentDetailsDialog.addEventListener('click',e=>{
    if(e.target===consentDetailsDialog) hideConsentDetails();
  });
}
