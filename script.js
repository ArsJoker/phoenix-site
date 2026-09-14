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
