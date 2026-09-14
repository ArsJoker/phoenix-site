const nav=document.getElementById('nav'),menu=document.getElementById('menu');
menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));
const dialog=document.getElementById('dialog');
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>dialog.showModal());
document.getElementById('close').onclick=()=>dialog.close();
document.getElementById('form').onsubmit=e=>{e.preventDefault();alert('Демо-версия: следующим этапом подключим реальное получение заявок.');dialog.close();};
const s=document.getElementById('search'),c=document.getElementById('cat'),cards=[...document.querySelectorAll('.words article')];
function filter(){const q=s.value.toLowerCase();cards.forEach(x=>x.hidden=!(x.dataset.word.includes(q)&&(c.value==='all'||x.dataset.cat===c.value)));}
s.oninput=filter;c.onchange=filter;
