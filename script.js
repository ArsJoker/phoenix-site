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

// V15 — регистрация из карточки события
document.querySelectorAll('.event-register').forEach(button=>{
  button.addEventListener('click',()=>{
    const sportSelect=form.querySelector('[name="sport"]');
    if(sportSelect) sportSelect.value=button.dataset.sport || '';
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
