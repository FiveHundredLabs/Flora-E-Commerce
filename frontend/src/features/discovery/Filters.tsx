import { useEffect,useRef,useState,type RefObject } from 'react';
import { SlidersHorizontal,X } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { SelectField,TextField } from '../../shared/components/ui/Fields';
import { categories,categoryNames,locations,locationNames,searchSchema,type Filters as Values,type Kind,type Store } from './model';

function Fields({kind,stores,draft,setDraft,error,input}:{kind:Kind;stores:Store[];draft:Values;setDraft:(v:Values)=>void;error?:string;input:RefObject<HTMLInputElement|null>}){
 return <><TextField ref={input} label={kind==='shops'?'Search shops':'Search products'} name="q" value={draft.q} onChange={e=>setDraft({...draft,q:e.target.value})} hint={`Search ${kind==='shops'?'store':'product'} names and descriptions.`} error={error}/>
 {kind==='shops'?<SelectField label="Shop category" value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value as Values['category']})}><option value="">All shop categories</option>{categories.map(v=><option key={v} value={v}>{categoryNames[v]}</option>)}</SelectField>:stores.length?<SelectField label="Store" value={draft.store} onChange={e=>setDraft({...draft,store:e.target.value})}><option value="">All stores</option>{stores.map(s=><option key={s.slug} value={s.slug}>{s.name}</option>)}</SelectField>:<p role="status">Loading store filters…</p>}
 <SelectField label="Location" value={draft.location} onChange={e=>setDraft({...draft,location:e.target.value as Values['location']})}><option value="">All locations</option>{locations.map(v=><option key={v} value={v}>{locationNames[v]}</option>)}</SelectField></>;
}
export function Filters({kind,stores,values,revision,apply,clear}:{kind:Kind;stores:Store[];values:Values;revision:string;apply:(v:Values)=>void;clear:()=>void}){
 const [draft,setDraft]=useState(values);const [error,setError]=useState<string>();const dialog=useRef<HTMLDialogElement>(null);const desktop=useRef<HTMLInputElement>(null);const mobile=useRef<HTMLInputElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setDraft(values);setError(undefined)},[values,revision]);
 const active=[values.q,kind==='shops'?values.category:values.store,values.location].filter(Boolean).length;
 function commit(input:RefObject<HTMLInputElement|null>,close=false){const parsed=searchSchema.safeParse(draft.q);if(!parsed.success){setError('Use 100 characters or fewer.');input.current?.focus();return}const next={...draft,q:parsed.data};setDraft(next);setError(undefined);apply(next);if(close)dialog.current?.close()}
 function reset(close=false){setDraft(values);setError(undefined);clear();if(close)dialog.current?.close()}
 const actions=(isMobile=false)=><div className="discovery-filter-actions"><Button type="button" onClick={()=>commit(isMobile?mobile:desktop,isMobile)}>Apply filters</Button><Button type="button" variant="outline" onClick={()=>reset(isMobile)}>Clear all</Button></div>;
 return <><button ref={trigger} type="button" className="discovery-mobile-filter-trigger" aria-haspopup="dialog" onClick={()=>dialog.current?.showModal()}><SlidersHorizontal size={18} aria-hidden="true"/>Filters{active?` (${active})`:''}</button><aside className="discovery-filters" aria-label="Catalog filters"><p className="discovery-filter-kicker">Refine the directory</p><Fields kind={kind} stores={stores} draft={draft} setDraft={setDraft} error={error} input={desktop}/>{actions()}</aside>
 <dialog ref={dialog} className="discovery-filter-dialog" aria-labelledby="mobile-filter-title" onClose={()=>trigger.current?.focus()}><header><h2 id="mobile-filter-title">Filter {kind}</h2><button type="button" aria-label="Close filters" onClick={()=>dialog.current?.close()}><X aria-hidden="true"/></button></header><div className="discovery-filter-dialog__body"><Fields kind={kind} stores={stores} draft={draft} setDraft={setDraft} error={error} input={mobile}/></div>{actions(true)}</dialog></>;
}
