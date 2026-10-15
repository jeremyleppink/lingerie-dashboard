import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';
const response=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'none'}});
const secureEqual=(a,b)=>{const x=Buffer.from(a||''),y=Buffer.from(b||'');return x.length===y.length && timingSafeEqual(x,y)};
export default async (request)=>{
  const pass=process.env.DASHBOARD_PASSWORD;
  if(!pass || pass.length<12)return response({error:'DASHBOARD_PASSWORD ontbreekt of is korter dan 12 tekens in Netlify Environment Variables.'},503);
  if(!secureEqual(request.headers.get('x-dashboard-password'),pass))return response({error:'Onjuist wachtwoord'},401);
  if(!['GET','POST'].includes(request.method))return response({error:'Methode niet toegestaan'},405);
  try{
    const store=getStore({name:'lingerie-roadmap',consistency:'strong'});
    const saved=await store.get('shared-dashboard',{type:'json',consistency:'strong'});
    const current=saved||{revision:0,state:{checked:{},notes:{},added:{}}};
    if(request.method==='GET')return response(current);
    const body=await request.json();
    if(JSON.stringify(body).length>150000)return response({error:'Data te groot'},413);
    if(!body || !Number.isInteger(body.revision)||body.revision!==current.revision)return response({error:'CONFLICT'},409);
    const s=body.state;
    if(!s || ['checked','notes','added'].some(k=>!s[k] || typeof s[k]!=='object'||Array.isArray(s[k])))return response({error:'Ongeldige data'},400);
    const next={revision:current.revision+1,state:s};
    await store.setJSON('shared-dashboard',next);
    return response({revision:next.revision});
  }catch(error){console.error('Dashboard backend error',error);return response({error:'Opslagservice niet bereikbaar. Controleer Function-logs.'},500)}
};
