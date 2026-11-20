async function loadSubstack(){
  const grid=document.getElementById('substack-grid');if(!grid)return;
  try{
    const feed='https://isarvesh19.substack.com/feed';
    const response=await fetch(`https://proxy.cors.dev/${feed}`,{headers:{Accept:'application/rss+xml, application/xml, text/xml'}});
    if(!response.ok)throw new Error('Feed unavailable');
    const xml=new DOMParser().parseFromString(await response.text(),'application/xml');
    if(xml.querySelector('parsererror'))throw new Error('Invalid feed');
    const items=[...xml.querySelectorAll('channel > item')];
    if(!items.length){const empty=document.createElement('p');empty.textContent='No public posts yet. New writing will appear here as soon as it’s published.';grid.replaceChildren(empty);return;}
    grid.replaceChildren(...items.slice(0,4).map(item=>{const a=document.createElement('a');a.className='feed-card';a.href=item.querySelector('link')?.textContent?.trim()||'https://open.substack.com/pub/isarvesh19';a.target='_blank';a.rel='noreferrer';const title=document.createElement('strong');title.textContent=item.querySelector('title')?.textContent?.trim()||'Read on Substack';const date=document.createElement('small');const d=new Date(item.querySelector('pubDate')?.textContent||'');date.textContent=Number.isNaN(d.valueOf())?'READ ON SUBSTACK ↗':`${d.toLocaleDateString(undefined,{month:'short',year:'numeric'})} · READ ↗`;a.append(title,date);return a;}));
  }catch{const p=document.createElement('p');p.textContent='The feed is taking a break. Browse all notes on Substack ↗';grid.replaceChildren(p);}
}
const flows={
 payments:{caption:'BYJU’S · FINANCE SYSTEMS',copy:'Payment request → finance service → reconciliation. Every handoff needs to make sense.',nodes:['PAYMENT','FINANCE','LEDGER']},
 gateway:{caption:'YAPPES · API GATEWAY',copy:'Incoming traffic → routing & protection → the right service. Keep the system steady when demand shifts.',nodes:['REQUEST','GATEWAY','SERVICE']},
 search:{caption:'DELIGHTREE · ANALYTICS & AI',copy:'Product data → retrieval → a useful answer. Search grounded in the information people actually need.',nodes:['QUESTION','RETRIEVAL','ANSWER']}
};
document.addEventListener('DOMContentLoaded',()=>{
  loadSubstack();
  const buttons=[...document.querySelectorAll('[data-flow]')],copy=document.getElementById('flow-copy'),caption=document.getElementById('flow-caption'),nodes=[...document.querySelectorAll('.flow-node')];
  buttons.forEach(button=>button.addEventListener('click',()=>{const flow=flows[button.dataset.flow];if(!flow)return;buttons.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});copy.textContent=flow.copy;caption.textContent=flow.caption;nodes.forEach((node,i)=>node.textContent=flow.nodes[i]);}));
});
