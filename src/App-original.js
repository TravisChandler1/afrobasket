import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, MapPin, Search, X, Plus, Minus, ChevronRight,
  Truck, Package, Clock, ArrowLeft, Menu, Leaf, Flame,
  UtensilsCrossed, Salad, Coffee, Cookie, Wheat,
  CheckCircle, Info, Instagram, Mail, Sparkles
} from "lucide-react";

/* ── COLOUR TOKENS ─────────────────────────────────────────────────────────── */
const C = {
  green:"#00C96B", gd:"#009950", orange:"#FF6B2B",
  gold:"#D4A843",  amber:"#FFB830", white:"#F0EDE6",
  dark:"#070709",  s1:"#111318",   s2:"#181c23",
  gray:"#8a8fa8",  border:"rgba(255,255,255,0.07)",
  bg:"rgba(0,201,107,0.3)",
};

/* ── PICSUM SEEDS that render reliably in sandboxes ────────────────────────── */
// Using stable picsum IDs — renders without CORS issues
const foodImg = (id, w=400, h=400) =>
  `https://picsum.photos/seed/${id}/${w}/${h}`;

/* Hero floating food images — picsum seeds chosen for food-like colours */
const FLOATERS = [
  { id:"plantain22", w:180, h:180, x:4,  y:8,  anim:1, delay:0   },
  { id:"pepper99",   w:145, h:145, x:83, y:6,  anim:2, delay:0.5 },
  { id:"yam44",      w:170, h:170, x:14, y:60, anim:3, delay:0.2 },
  { id:"spinach33",  w:138, h:138, x:74, y:68, anim:1, delay:0.8 },
  { id:"food55",     w:155, h:155, x:89, y:34, anim:2, delay:0.3 },
  { id:"fish77",     w:128, h:128, x:1,  y:42, anim:3, delay:0.6 },
  { id:"veg66",      w:142, h:142, x:54, y:14, anim:1, delay:1.0 },
  { id:"tom88",      w:122, h:122, x:38, y:76, anim:2, delay:0.4 },
];

/* Product catalogue — picsum seeds for each */
const PRODUCTS = [
  { id:1,  name:"Yam (Tuber)",          desc:"Fresh Nigerian white yam, per tuber",       price:10.00, cat:"Staples",    seed:"yam10"   },
  { id:2,  name:"Plantain",             desc:"Ripe or unripe plantain, per piece",         price:2.50,  cat:"Staples",    seed:"plan02"  },
  { id:3,  name:"Garri Ijebu (4kg)",    desc:"Coarsely processed cassava, Ijebu style",    price:20.00, cat:"Staples",    seed:"garri03" },
  { id:4,  name:"Garri White (4kg)",    desc:"Smooth white garri, lightly fermented",      price:18.00, cat:"Staples",    seed:"garriw4" },
  { id:5,  name:"Pounded Yam Flour",    desc:"Premium instant pounded yam flour, 2kg",     price:18.00, cat:"Staples",    seed:"flour05" },
  { id:6,  name:"Semolina (2kg)",       desc:"Finely milled durum wheat semolina",         price:9.00,  cat:"Staples",    seed:"semi06"  },
  { id:7,  name:"Fufu Flour (2kg)",     desc:"Cassava and plantain blend fufu flour",      price:10.00, cat:"Staples",    seed:"fufu07"  },
  { id:8,  name:"Palm Oil (1L)",        desc:"Pure unrefined red palm oil",                price:18.00, cat:"Cooking",    seed:"palm08"  },
  { id:9,  name:"Scotch Bonnet Pepper", desc:"Fresh hot pepper pack",                      price:5.00,  cat:"Cooking",    seed:"pepp09"  },
  { id:10, name:"Tomato Paste",         desc:"Rich concentrated tomato paste",             price:2.50,  cat:"Cooking",    seed:"tom10"   },
  { id:11, name:"Pepper Mix (500g)",    desc:"Blended pepper mix, ready to cook",          price:7.00,  cat:"Cooking",    seed:"pmix11"  },
  { id:12, name:"Egusi (500g)",         desc:"Ground melon seeds for rich soups",          price:10.00, cat:"Soup",       seed:"egu12"   },
  { id:13, name:"Ogbono (500g)",        desc:"Wild mango seeds, thickens draw soups",      price:12.00, cat:"Soup",       seed:"ogb13"   },
  { id:14, name:"Crayfish (250g)",      desc:"Dried and ground crayfish seasoning",        price:8.00,  cat:"Soup",       seed:"cray14"  },
  { id:15, name:"Dry Fish (500g)",      desc:"Smoked catfish, rich and aromatic",          price:15.00, cat:"Soup",       seed:"fish15"  },
  { id:16, name:"Stockfish (pack)",     desc:"Dried and salted stockfish",                 price:25.00, cat:"Soup",       seed:"stock16" },
  { id:17, name:"Maggi Cubes",          desc:"Classic seasoning cubes, full pack",         price:5.00,  cat:"Seasonings", seed:"mag17"   },
  { id:18, name:"Knorr Cubes",          desc:"Knorr chicken seasoning cubes",              price:5.00,  cat:"Seasonings", seed:"knorr18" },
  { id:19, name:"Curry Powder",         desc:"Aromatic curry blend, versatile spice",      price:4.00,  cat:"Seasonings", seed:"curry19" },
  { id:20, name:"Thyme",               desc:"Dried thyme leaves, fragrant herb",          price:3.50,  cat:"Seasonings", seed:"thyme20" },
  { id:21, name:"Okra (500g)",          desc:"Fresh okra, perfect for soups and stews",    price:5.00,  cat:"Vegetables", seed:"okra21"  },
  { id:22, name:"Bitter Leaf (pack)",   desc:"Fresh bitter leaf, cleaned and ready",       price:7.00,  cat:"Vegetables", seed:"bitt22"  },
  { id:23, name:"Ugu Leaves (pack)",    desc:"Fluted pumpkin leaves, fresh pack",          price:7.00,  cat:"Vegetables", seed:"ugu23"   },
  { id:24, name:"Spinach",             desc:"Fresh baby spinach, tender leaves",          price:4.00,  cat:"Vegetables", seed:"spin24"  },
  { id:25, name:"Chin Chin",            desc:"Crispy fried snack, lightly sweetened",      price:6.00,  cat:"Snacks",     seed:"chin25"  },
  { id:26, name:"Plantain Chips",       desc:"Crunchy thinly sliced fried plantain",       price:5.00,  cat:"Snacks",     seed:"pchip26" },
  { id:27, name:"Groundnuts",           desc:"Roasted and salted groundnuts",              price:4.00,  cat:"Snacks",     seed:"gnut27"  },
  { id:28, name:"Milo (400g)",          desc:"Chocolate malt drink powder",                price:8.00,  cat:"Drinks",     seed:"milo28"  },
  { id:29, name:"Peak Milk Powder",     desc:"Full cream instant milk powder",             price:7.00,  cat:"Drinks",     seed:"milk29"  },
  { id:30, name:"Malta Guinness",       desc:"Refreshing malt drink, non-alcoholic",       price:3.00,  cat:"Drinks",     seed:"malt30"  },
  { id:31, name:"Maltina",             desc:"Smooth malt beverage, lightly sweet",        price:3.00,  cat:"Drinks",     seed:"malt31"  },
];

const CATS = ["All","Staples","Cooking","Soup","Seasonings","Vegetables","Snacks","Drinks"];

const CAT_META = {
  Staples:    { Icon:Wheat,            color:"#E67E22" },
  Cooking:    { Icon:Flame,            color:"#F2A900" },
  Soup:       { Icon:UtensilsCrossed,  color:"#27a050" },
  Seasonings: { Icon:Leaf,             color:"#c0392b" },
  Vegetables: { Icon:Salad,            color:"#16a085" },
  Snacks:     { Icon:Cookie,           color:"#8e44ad" },
  Drinks:     { Icon:Coffee,           color:"#2980b9" },
};

const ZONES = [
  { city:"Barrie",   fee:8,  day:"Wednesday", free:"Free delivery over $80" },
  { city:"Innisfil", fee:12, day:"Friday",    free:null },
  { city:"Bradford", fee:15, day:"Friday",    free:null },
  { city:"Orillia",  fee:18, day:"Saturday",  free:null },
];

/* ── HELPERS ───────────────────────────────────────────────────────────────── */
function useInView(t=0.1){
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});
    if(ref.current)o.observe(ref.current); return()=>o.disconnect();
  },[]);
  return [ref,v];
}
const ap=(v,d=0)=>({opacity:v?1:0,transform:v?"translateY(0)":"translateY(36px)",transition:`opacity .75s ease ${d}s,transform .75s ease ${d}s`});
const gold={background:"linear-gradient(90deg,#D4A843,#FFB830,#D4A843)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 3s linear infinite"};
const logoGlow={background:"linear-gradient(90deg,#F0EDE6 20%,#00C96B 40%,#FFD700 55%,#FF6B2B 70%,#F0EDE6 85%)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sweep 3s linear infinite"};
const heroTextGlow={background:"linear-gradient(90deg,#F0EDE6 15%,#00C96B 35%,#FFD700 50%,#FF9A3C 65%,#F0EDE6 85%)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"sweep 3.5s linear infinite"};
const orb=(w,h,col,ex={})=>({position:"absolute",borderRadius:"50%",pointerEvents:"none",filter:"blur(90px)",animation:"breathe 4s ease-in-out infinite",width:w,height:h,background:col,...ex});

/* ── PRODUCT IMAGE ─────────────────────────────────────────────────────────── */
function PImg({ seed, alt, h=190, style={} }){
  const [err,setErr]=useState(false);
  return err
    ? <div style={{height:h,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,201,107,0.07)"}}><Package size={44} color={C.green} strokeWidth={1.4}/></div>
    : <img src={foodImg(seed,400,400)} alt={alt} onError={()=>setErr(true)}
        style={{width:"100%",height:h,objectFit:"cover",display:"block",...style}}/>;
}

/* ── BADGE ─────────────────────────────────────────────────────────────────── */
function Badge({children}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(0,201,107,0.13)",color:C.green,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,border:"1px solid rgba(0,201,107,0.28)",fontFamily:"'Outfit',sans-serif",textTransform:"uppercase",letterSpacing:.8}}>{children}</span>;
}

/* ── PRIMARY BUTTON ────────────────────────────────────────────────────────── */
function Btn({children,onClick,style={},disabled=false}){
  const [h,sH]=useState(false);
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
    style={{background:`linear-gradient(135deg,${C.green},${C.gd})`,color:C.dark,border:"none",borderRadius:50,padding:"16px 36px",fontWeight:700,fontSize:16,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:h?"0 0 50px rgba(0,201,107,.55),0 12px 30px rgba(0,0,0,.4)":"0 0 28px rgba(0,201,107,.25)",transform:h&&!disabled?"translateY(-2px)":"none",transition:"all .3s ease",display:"inline-flex",alignItems:"center",gap:8,opacity:disabled?.45:1,...style}}>
    {children}
  </button>;
}

/* ── PRODUCT CARD ──────────────────────────────────────────────────────────── */
function PCard({p,onAdd,onQV}){
  const [hov,sH]=useState(false);
  return(
    <div onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{background:C.s1,borderRadius:20,overflow:"hidden",border:`1px solid ${hov?C.bg:C.border}`,transition:"all .3s ease",transform:hov?"translateY(-8px)":"none",boxShadow:hov?"0 28px 55px rgba(0,0,0,.55),0 0 35px rgba(0,201,107,.12)":"none"}}>
      <div style={{height:190,position:"relative",overflow:"hidden"}}>
        <PImg seed={p.seed} alt={p.name} h={190} style={{transform:hov?"scale(1.09)":"scale(1)",transition:"transform .45s ease"}}/>
        <div style={{position:"absolute",top:12,left:12}}><Badge>{p.cat}</Badge></div>
        {hov&&<div style={{position:"absolute",inset:0,background:"rgba(4,12,8,.82)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}}>
          <button onClick={()=>onQV(p)} style={{background:C.green,color:C.dark,border:"none",borderRadius:50,padding:"11px 26px",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:14,display:"flex",alignItems:"center",gap:7,boxShadow:"0 0 28px rgba(0,201,107,.55)"}}>
            <Search size={15}/> Quick View
          </button>
        </div>}
      </div>
      <div style={{padding:18}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:C.white,marginBottom:6,lineHeight:1.3}}>{p.name}</p>
        <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:C.gray,lineHeight:1.6,marginBottom:14,minHeight:38}}>{p.desc}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:900,color:C.green}}>${p.price.toFixed(2)}</span>
          <AddBtn onClick={()=>onAdd(p)}/>
        </div>
      </div>
    </div>
  );
}

function AddBtn({onClick}){
  const [h,sH]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
    style={{background:h?C.green:"rgba(0,201,107,.13)",color:h?C.dark:C.green,border:"1px solid rgba(0,201,107,.32)",borderRadius:50,padding:"8px 18px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,transition:"all .22s ease",display:"flex",alignItems:"center",gap:6}}>
    <Plus size={14}/> Add
  </button>;
}

/* ── QUICK VIEW ────────────────────────────────────────────────────────────── */
function QVModal({p,onClose,onAdd}){
  const [q,sQ]=useState(1);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:1001,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(10px)",animation:"fadeIn .3s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.s1,border:`1px solid ${C.border}`,width:"min(540px,100vw)",borderRadius:"28px 28px 0 0",padding:38,animation:"slideUp .4s cubic-bezier(.22,1,.36,1)",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{borderRadius:18,overflow:"hidden",marginBottom:26,height:260}}>
          <PImg seed={p.seed} alt={p.name} h={260}/>
        </div>
        <Badge>{p.cat}</Badge>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:900,color:C.white,margin:"14px 0 10px"}}>{p.name}</h2>
        <p style={{fontFamily:"'Outfit',sans-serif",color:C.gray,fontSize:16,lineHeight:1.75,marginBottom:22}}>{p.desc}</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:900,color:C.green,marginBottom:26}}>${p.price.toFixed(2)}</p>
        <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:26}}>
          <button onClick={()=>sQ(v=>Math.max(1,v-1))} style={{width:44,height:44,borderRadius:"50%",border:"1.5px solid rgba(0,201,107,.4)",background:"none",cursor:"pointer",color:C.green,display:"flex",alignItems:"center",justifyContent:"center"}}><Minus size={19}/></button>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,minWidth:30,textAlign:"center",color:C.white}}>{q}</span>
          <button onClick={()=>sQ(v=>v+1)} style={{width:44,height:44,borderRadius:"50%",border:"none",background:C.green,color:C.dark,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={19}/></button>
          <span style={{fontFamily:"'Outfit',sans-serif",color:C.gray,fontSize:15}}>Total: <strong style={{color:C.white}}>${(p.price*q).toFixed(2)}</strong></span>
        </div>
        <div style={{display:"flex",gap:12}}>
          <Btn onClick={()=>{onAdd(p,q);onClose();}} style={{flex:1,justifyContent:"center"}}><ShoppingCart size={18}/> Add to Cart</Btn>
          <button onClick={onClose} style={{padding:"14px 22px",borderRadius:50,border:"1.5px solid rgba(255,255,255,.12)",background:"none",cursor:"pointer",color:C.gray,fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:15}}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── CART DRAWER ───────────────────────────────────────────────────────────── */
function Cart({cart,open,onClose,onRemove,onQty}){
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const count=cart.reduce((s,i)=>s+i.qty,0);
  return(
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:999,backdropFilter:"blur(5px)"}}/>}
      <div style={{position:"fixed",top:0,right:0,height:"100vh",width:"min(430px,100vw)",background:C.s1,zIndex:1000,transform:open?"translateX(0)":"translateX(100%)",transition:"transform .4s cubic-bezier(.22,1,.36,1)",boxShadow:"-20px 0 80px rgba(0,0,0,.75)",borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"22px 26px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <ShoppingCart size={22} color={C.green}/>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:C.white}}>Cart <span style={{color:C.gray,fontSize:19}}>({count})</span></h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.gray,display:"flex"}}><X size={23}/></button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:26}}>
          {cart.length===0
            ?<div style={{textAlign:"center",padding:"70px 0",color:C.gray}}>
               <ShoppingCart size={56} color="rgba(138,143,168,.25)" strokeWidth={1} style={{margin:"0 auto 18px"}}/>
               <p style={{fontFamily:"'Outfit',sans-serif",fontSize:17}}>Your cart is empty</p>
             </div>
            :cart.map(it=>(
              <div key={it.id} style={{display:"flex",gap:14,marginBottom:22,paddingBottom:22,borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:62,height:62,borderRadius:14,overflow:"hidden",flexShrink:0,border:`1px solid ${C.border}`}}>
                  <PImg seed={it.seed} alt={it.name} h={62}/>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:15,color:C.white,marginBottom:3}}>{it.name}</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,color:C.green,fontSize:18}}>${(it.price*it.qty).toFixed(2)}</p>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginTop:9}}>
                    <button onClick={()=>onQty(it.id,-1)} style={{width:29,height:29,borderRadius:"50%",border:"1px solid rgba(0,201,107,.4)",background:"none",cursor:"pointer",color:C.green,display:"flex",alignItems:"center",justifyContent:"center"}}><Minus size={13}/></button>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:15,color:C.white,minWidth:22,textAlign:"center"}}>{it.qty}</span>
                    <button onClick={()=>onQty(it.id,1)} style={{width:29,height:29,borderRadius:"50%",border:"none",background:C.green,color:C.dark,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={13}/></button>
                    <button onClick={()=>onRemove(it.id)} style={{marginLeft:"auto",background:"none",border:"none",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"'Outfit',sans-serif",fontSize:13}}><X size={13}/> Remove</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {cart.length>0&&(
          <div style={{padding:"22px 26px",borderTop:`1px solid ${C.border}`,background:C.s2}}>
            {total<40&&<div style={{background:"rgba(212,168,67,.1)",border:"1px solid rgba(212,168,67,.3)",borderRadius:11,padding:"11px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:9}}>
              <Info size={15} color={C.gold}/><p style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:C.gold}}>Add ${(40-total).toFixed(2)} more for $40 minimum.</p>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:18,color:C.white}}>Subtotal</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:900,fontSize:26,color:C.green}}>${total.toFixed(2)}</span>
            </div>
            <Btn disabled={total<40} style={{width:"100%",justifyContent:"center"}}>Checkout <ChevronRight size={18}/></Btn>
          </div>
        )}
      </div>
    </>
  );
}

/* ── SHOP PAGE ─────────────────────────────────────────────────────────────── */
function ShopPage({cart,onAdd,onCartOpen,onBack,initCat="All"}){
  const [search,sSearch]=useState("");
  const [cat,sCat]=useState(initCat);
  const [qv,sQv]=useState(null);
  const count=cart.reduce((s,i)=>s+i.qty,0);

  const filtered=PRODUCTS.filter(p=>{
    const mc=cat==="All"||p.cat===cat;
    const q=search.toLowerCase();
    return mc&&(!q||p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));
  });
  const groups=CATS.slice(1).map(c=>({c,items:PRODUCTS.filter(p=>p.cat===c&&(!search||p.name.toLowerCase().includes(search.toLowerCase())||p.desc.toLowerCase().includes(search.toLowerCase())))}))).filter(g=>g.items.length>0);
  const grouped=cat==="All"&&!search;

  return(
    <div style={{minHeight:"100vh",background:C.dark}}>
      {/* nav */}
      <nav style={{position:"sticky",top:0,zIndex:900,background:"rgba(7,7,9,.97)",backdropFilter:"blur(22px)",borderBottom:`1px solid ${C.border}`,padding:"0 28px",height:70,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:C.gray,fontFamily:"'Outfit',sans-serif",fontWeight:500,fontSize:15,display:"flex",alignItems:"center",gap:8}}>
          <ArrowLeft size={19}/> Home
        </button>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:36,height:36,background:"rgba(0,201,107,.15)",border:"1px solid rgba(0,201,107,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ShoppingCart size={17} color={C.green}/>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700,...logoGlow}}>AfroBasket Market</span>
        </div>
        <button onClick={onCartOpen} style={{position:"relative",background:C.green,border:"none",borderRadius:50,padding:"10px 22px",cursor:"pointer",color:C.dark,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:8}}>
          <ShoppingCart size={17}/> Cart
          {count>0&&<span style={{position:"absolute",top:-7,right:-7,background:C.orange,color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{count}</span>}
        </button>
      </nav>

      <div style={{maxWidth:1220,margin:"0 auto",padding:"48px 28px 100px"}}>
        {/* heading */}
        <div style={{marginBottom:34,position:"relative"}}>
          <div style={{...orb(400,400,"rgba(0,201,107,.07)"),top:-120,right:-60}}/>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(38px,5.5vw,60px)",fontWeight:900,color:C.white,marginBottom:10,position:"relative"}}>
            All <span style={gold}>Groceries</span>
          </h1>
          <p style={{fontFamily:"'Outfit',sans-serif",color:C.gray,fontSize:17,position:"relative"}}>
            {filtered.length} product{filtered.length!==1?"s":""}{search?` matching "${search}"`:""}
          </p>
        </div>

        {/* search */}
        <div style={{position:"relative",maxWidth:560,marginBottom:24}}>
          <Search size={19} color={C.gray} style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
          <input value={search} onChange={e=>sSearch(e.target.value)} placeholder="Search products, e.g. plantain, palm oil…"
            style={{width:"100%",background:"rgba(255,255,255,.05)",border:`1.5px solid ${search?"rgba(0,201,107,.55)":"rgba(255,255,255,.1)"}`,borderRadius:50,padding:"15px 52px 15px 54px",color:C.white,fontFamily:"'Outfit',sans-serif",fontSize:16,outline:"none",transition:"all .3s"}}/>
          {search&&<button onClick={()=>sSearch("")} style={{position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.gray,cursor:"pointer",display:"flex"}}><X size={18}/></button>}
        </div>

        {/* pills */}
        <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:36,paddingBottom:30,borderBottom:`1px solid ${C.border}`}}>
          {CATS.map(c=>{
            const active=cat===c; const meta=CAT_META[c];
            return <button key={c} onClick={()=>sCat(c)} style={{padding:"10px 22px",borderRadius:50,border:`1.5px solid ${active?C.green:"rgba(255,255,255,.1)"}`,background:active?C.green:"rgba(255,255,255,.04)",color:active?C.dark:C.gray,fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:14,cursor:"pointer",transition:"all .22s ease",boxShadow:active?"0 0 22px rgba(0,201,107,.32)":"none",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:7}}>
              {meta&&<meta.Icon size={14}/>}{c}
            </button>;
          })}
        </div>

        {/* results */}
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"90px 0",color:C.gray}}>
             <Search size={60} color="rgba(138,143,168,.18)" strokeWidth={1} style={{margin:"0 auto 22px"}}/>
             <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:C.white,marginBottom:12}}>No results found</p>
             <p style={{fontFamily:"'Outfit',sans-serif",fontSize:17}}>Try a different search or browse all categories</p>
             <Btn onClick={()=>{sSearch("");sCat("All");}} style={{marginTop:26}}>Clear Filters</Btn>
           </div>
          :grouped
            ?<div style={{display:"flex",gap:38,alignItems:"flex-start"}}>
               {/* sidebar */}
               <div style={{width:210,flexShrink:0,position:"sticky",top:90}} className="hide-mobile">
                 <p style={{color:C.gray,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.6,marginBottom:16,fontFamily:"'Outfit',sans-serif"}}>Categories</p>
                 {CATS.map(c=>{
                   const cnt=c==="All"?PRODUCTS.length:PRODUCTS.filter(p=>p.cat===c).length;
                   const active=cat===c; const meta=CAT_META[c];
                   return <div key={c} onClick={()=>sCat(c)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 15px",borderRadius:11,cursor:"pointer",marginBottom:5,background:active?"rgba(0,201,107,.11)":"transparent",border:`1px solid ${active?"rgba(0,201,107,.3)":"transparent"}`,transition:"all .2s"}}>
                     <div style={{display:"flex",alignItems:"center",gap:9}}>
                       {meta&&<meta.Icon size={15} color={active?C.green:C.gray}/>}
                       <span style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:500,color:active?C.green:C.white}}>{c}</span>
                     </div>
                     <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:C.gray,background:"rgba(255,255,255,.06)",padding:"2px 9px",borderRadius:10}}>{cnt}</span>
                   </div>;
                 })}
               </div>
               {/* grouped */}
               <div style={{flex:1}}>
                 {groups.map(({c,items})=>{
                   const meta=CAT_META[c];
                   return <div key={c} style={{marginBottom:54}}>
                     <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:24}}>
                       {meta&&<div style={{width:40,height:40,borderRadius:11,background:`${meta.color}18`,border:`1px solid ${meta.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><meta.Icon size={21} color={meta.color} strokeWidth={1.8}/></div>}
                       <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:C.white}}>{c}</h2>
                       <span style={{background:"rgba(0,201,107,.12)",color:C.green,fontSize:13,fontWeight:700,padding:"4px 12px",borderRadius:20,fontFamily:"'Outfit',sans-serif",border:"1px solid rgba(0,201,107,.22)"}}>{items.length}</span>
                       <div style={{flex:1,height:1,background:"rgba(255,255,255,.06)"}}/>
                     </div>
                     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:20}}>
                       {items.map(p=><PCard key={p.id} p={p} onAdd={onAdd} onQV={sQv}/>)}
                     </div>
                   </div>;
                 })}
               </div>
             </div>
            :<div>
               <p style={{fontFamily:"'Outfit',sans-serif",color:C.gray,fontSize:16,marginBottom:24}}>{filtered.length} result{filtered.length!==1?"s":""}{cat!=="All"?` in ${cat}`:""}</p>
               <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:20}}>
                 {filtered.map(p=><PCard key={p.id} p={p} onAdd={onAdd} onQV={sQv}/>)}
               </div>
             </div>
        }
      </div>
      {qv&&<QVModal p={qv} onClose={()=>sQv(null)} onAdd={(p,q)=>{onAdd(p,q);sQv(null);}}/>}
    </div>
  );
}

/* ── HOME PAGE ─────────────────────────────────────────────────────────────── */
function Home({cart,onAdd,onCartOpen,onGoShop}){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  const [scrolled,sSc]=useState(false);
  const [mob,sMob]=useState(false);
  const [qv,sQv]=useState(null);
  const [heroRef,heroV]=useInView(.04);
  const [catRef,catV]=useInView(.1);
  const [prodRef,prodV]=useInView(.1);
  const [howRef,howV]=useInView(.1);
  const [delRef,delV]=useInView(.1);
  const [abtRef,abtV]=useInView(.1);
  const [ctaRef,ctaV]=useInView(.1);
  useEffect(()=>{const fn=()=>sSc(window.scrollY>60);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});sMob(false);};
  const NAV=[{l:"Shop",id:"preview"},{l:"Categories",id:"cats"},{l:"Delivery",id:"delivery"},{l:"About",id:"about"}];

  return(
    <div style={{background:C.dark,color:C.white}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:900,background:scrolled?"rgba(7,7,9,.97)":"transparent",backdropFilter:scrolled?"blur(22px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",height:74,padding:"0 30px",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .4s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
          <div style={{width:42,height:42,background:"rgba(0,201,107,.15)",border:"1px solid rgba(0,201,107,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ShoppingCart size={19} color={C.green}/>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,...logoGlow}}>AfroBasket Market</span>
        </div>
        <div style={{display:"flex",gap:34}} className="hide-mobile">
          {NAV.map(({l,id})=>(
            <span key={id} onClick={()=>go(id)} style={{fontFamily:"'Outfit',sans-serif",fontWeight:500,color:"rgba(240,237,230,.7)",fontSize:16,cursor:"pointer",transition:"color .3s"}}
              onMouseEnter={e=>e.target.style.color=C.green} onMouseLeave={e=>e.target.style.color="rgba(240,237,230,.7)"}>{l}</span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onCartOpen} style={{position:"relative",background:C.green,border:"none",borderRadius:50,padding:"10px 22px",cursor:"pointer",color:C.dark,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:8}}>
            <ShoppingCart size={17}/> Cart
            {count>0&&<span style={{position:"absolute",top:-7,right:-7,background:C.orange,color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{count}</span>}
          </button>
          <button className="show-mobile" onClick={()=>sMob(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:C.white,display:"flex"}}><Menu size={28}/></button>
        </div>
      </nav>

      {mob&&<div style={{position:"fixed",top:74,left:0,right:0,background:"rgba(7,7,9,.98)",backdropFilter:"blur(22px)",zIndex:899,padding:"18px 30px",display:"flex",flexDirection:"column",gap:4,borderBottom:`1px solid ${C.border}`}}>
        {NAV.map(({l,id})=><span key={id} onClick={()=>go(id)} style={{fontFamily:"'Outfit',sans-serif",color:C.white,fontSize:18,padding:"13px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>{l}</span>)}
      </div>
