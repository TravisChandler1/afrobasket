import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart, MapPin, Search, X, Plus, Minus, ChevronRight,
  Truck, Package, Clock, ArrowLeft, Menu, Leaf, Flame,
  UtensilsCrossed, Salad, Coffee, Cookie, Wheat,
  CheckCircle, Info, Instagram, Mail, Sparkles
} from "lucide-react";
import './App.css';

/* ── COLOUR TOKENS ─────────────────────────────────────────────────────────── */
const C = {
  green:"#00C96B", gd:"#009950", orange:"#FF6B2B",
  gold:"#D4A843",  amber:"#FFB830", white:"#F0EDE6",
  dark:"#070709",  s1:"#111318",   s2:"#181c23",
  gray:"#8a8fa8",  border:"rgba(255,255,255,0.07)",
  bg:"rgba(0,201,107,0.3)",
};

/* ── PICSUM SEEDS that render reliably in sandboxes ────────────────────────── */
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

/* ── HOME COMPONENT ───────────────────────────────────────────────────────── */
const Home = ({ cart, onAdd, onCartOpen, onGoShop }) => {
  const [ref1,in1]=useInView(0.2);
  const [ref2,in2]=useInView(0.2);
  const [ref3,in3]=useInView(0.2);

  return (
    <>
      {/* Hero */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',background:`linear-gradient(135deg, ${C.dark} 0%, ${C.s1} 100%)`,overflow:'hidden'}}>
        {FLOATERS.map((f,i)=>(
          <div key={i} style={{position:'absolute',left:`${f.x}%`,top:`${f.y}%`,width:`${f.w}px`,height:`${f.h}px`,animation:`float${f.anim} 6s ease-in-out infinite`,animationDelay:`${f.delay}s`,opacity:0.8}}>
            <img src={foodImg(f.id,f.w,f.h)} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} onError={(e)=>e.target.style.display='none'} />
          </div>
        ))}
        
        <div className="container" style={{position:'relative',zIndex:2}}>
          <div style={{maxWidth:'600px',...ap(in1)}}>
            <h1 style={{fontSize:'clamp(2.5rem,5vw,4rem)',fontWeight:900,lineHeight:1.1,marginBottom:'1.5rem',...logoGlow}}>
              Authentic African Groceries <span style={{color:C.green}}>Delivered</span>
            </h1>
            <p style={{fontSize:'1.2rem',color:C.gray,marginBottom:'2.5rem',lineHeight:1.6}}>
              Fresh produce, pantry staples, and traditional ingredients from across Africa. From yam and plantain to egusi and ogbono, we bring the taste of home to your doorstep.
            </p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
              <button onClick={onGoShop} className="btn btn-primary" style={{...gold,fontSize:'1.1rem',padding:'1rem 2rem'}}>
                <ShoppingCart size={20} /> Shop Now
              </button>
              <button onClick={onCartOpen} className="btn btn-secondary" style={{fontSize:'1.1rem',padding:'1rem 2rem'}}>
                <MapPin size={20} /> Check Delivery
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-24px) rotate(6deg)}}
          @keyframes float2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-34px) rotate(-5deg)}}
          @keyframes float3{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(9deg)}}
        `}</style>
      </section>

      {/* Features */}
      <section className="section" style={{background:C.dark}} ref={ref1}>
        <div className="container">
          <h2 className="section-title text-center" style={{...ap(in2,0.2)}}>Why Choose AFROBASKET?</h2>
          <p className="section-subtitle text-center" style={{...ap(in2,0.3)}}>We're committed to bringing you the best African grocery experience</p>
          
          <div className="grid grid-3" style={{...ap(in2,0.4)}}>
            <div className="card text-center">
              <Truck size={48} color={C.green} style={{marginBottom:'1rem'}} />
              <h3 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>Fast Delivery</h3>
              <p style={{color:C.gray}}>Same-day delivery available for orders placed before 2 PM</p>
            </div>
            
            <div className="card text-center">
              <Leaf size={48} color={C.green} style={{marginBottom:'1rem'}} />
              <h3 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>Fresh Products</h3>
              <p style={{color:C.gray}}>Sourced directly from trusted suppliers and farmers</p>
            </div>
            
            <div className="card text-center">
              <Package size={48} color={C.green} style={{marginBottom:'1rem'}} />
              <h3 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>Secure Packaging</h3>
              <p style={{color:C.gray}}>Carefully packaged to maintain freshness during transit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="section" style={{background:C.s1}} ref={ref2}>
        <div className="container">
          <h2 className="section-title text-center" style={{...ap(in3,0.2)}}>Delivery Areas</h2>
          <p className="section-subtitle text-center" style={{...ap(in3,0.3)}}>We deliver to these areas in Simcoe County</p>
          
          <div className="grid grid-2" style={{...ap(in3,0.4)}}>
            {ZONES.map((zone,i)=>(
              <div key={i} className="card" style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <MapPin size={32} color={C.green} />
                <div>
                  <h4 style={{color:C.white,marginBottom:'0.25rem'}}>{zone.city}</h4>
                  <p style={{color:C.gray,fontSize:'0.9rem'}}>${zone.fee} delivery fee • {zone.day}</p>
                  {zone.free && <p style={{color:C.green,fontSize:'0.8rem',fontWeight:600}}>{zone.free}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

/* ── SHOP PAGE COMPONENT ─────────────────────────────────────────────────── */
const ShopPage = ({ cart, onAdd, onCartOpen, onBack, initCat }) => {
  const [selectedCategory, setSelectedCategory] = useState(initCat || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = CATS;
  
  const filtered = PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.cat === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (!mounted) {
    return (
      <section className="section" style={{background:C.s1}}>
        <div className="container">
          <h2 className="section-title text-center">Loading Products...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{background:C.s1}}>
      <div className="container">
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2rem'}}>
          <button onClick={onBack} className="btn btn-secondary" style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <ArrowLeft size={20} /> Back to Home
          </button>
          <button onClick={onCartOpen} className="btn btn-primary" style={{position:'relative'}}>
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span style={{
                position:'absolute',top:'-8px',right:'-8px',
                background:C.orange,color:C.white,borderRadius:'50%',
                width:'20px',height:'20px',fontSize:'0.75rem',
                display:'flex',alignItems:'center',justifyContent:'center'
              }}>{cart.reduce((sum,item)=>sum+item.qty,0)}</span>
            )}
          </button>
        </div>

        {/* Search */}
        <div style={{marginBottom:'2rem'}}>
          <div style={{position:'relative',maxWidth:'400px',margin:'0 auto'}}>
            <Search size={20} color={C.gray} style={{position:'absolute',left:'1rem',top:'50%',transform:'translateY(-50%)'}} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              style={{
                width:'100%',padding:'1rem 1rem 1rem 3rem',
                background:C.s2,border:`1px solid ${C.border}`,borderRadius:'8px',
                color:C.white,fontSize:'1rem'
              }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginBottom:'3rem',flexWrap:'wrap'}}>
          {categories.map(cat => {
            const Meta = CAT_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize:'0.9rem',
                  background: selectedCategory === cat ? (Meta?.color || C.green) : C.s2,
                  borderColor: selectedCategory === cat ? (Meta?.color || C.green) : C.border
                }}
              >
                {Meta && <Meta size={16} style={{marginRight:'0.25rem'}} />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Products grid */}
        <div className="grid grid-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'3rem',color:C.gray}}>
            <p style={{fontSize:'1.2rem',marginBottom:'1rem'}}>No products found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── PRODUCT CARD COMPONENT ─────────────────────────────────────────────── */
const ProductCard = ({ product, onAdd }) => {
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="card">
      {!imageError ? (
        <img 
          src={foodImg(product.seed, 200, 200)} 
          alt={product.name}
          style={{width:'100%',height:'200px',objectFit:'cover',borderRadius:'8px',marginBottom:'1rem'}}
          onError={() => setImageError(true)}
        />
      ) : (
        <div style={{
          width:'100%',height:'200px',background:C.s1,borderRadius:'8px',marginBottom:'1rem',
          display:'flex',alignItems:'center',justifyContent:'center',color:C.gray
        }}>
          <Package size={48} />
        </div>
      )}
      
      <h3 style={{fontSize:'1.1rem',fontWeight:600,marginBottom:'0.5rem',color:C.white}}>
        {product.name}
      </h3>
      <p style={{color:C.gray,fontSize:'0.9rem',marginBottom:'1rem'}}>
        {product.desc}
      </p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
        <span style={{fontSize:'1.25rem',fontWeight:700,color:C.green}}>
          ${product.price.toFixed(2)}
        </span>
        <span style={{fontSize:'0.8rem',color:C.gray,padding:'0.25rem 0.5rem',background:C.s1,borderRadius:'4px'}}>
          {product.cat}
        </span>
      </div>
      
      <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          style={{padding:'0.5rem'}}
        >
          <Minus size={16} />
        </button>
        <span style={{minWidth:'2rem',textAlign:'center',fontWeight:600,color:C.white}}>
          {quantity}
        </span>
        <button 
          className="btn btn-secondary"
          onClick={() => setQuantity(quantity + 1)}
          style={{padding:'0.5rem'}}
        >
          <Plus size={16} />
        </button>
      </div>
      
      <button 
        className="btn btn-primary" 
        style={{width:'100%',justifyContent:'center'}}
        onClick={() => onAdd(product, quantity)}
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
};

/* ── CART COMPONENT ───────────────────────────────────────────────────────── */
const Cart = ({ cart, open, onClose, onRemove, onQty }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position:'fixed',top:0,left:0,right:0,bottom:0,
          background:'rgba(0,0,0,0.5)',zIndex:999
        }}
      />
      
      {/* Cart Sidebar */}
      <div style={{
        position:'fixed',top:0,right:0,bottom:0,width:'400px',maxWidth:'90vw',
        background:C.s1,zIndex:1000,overflow:'auto',animation:'slideUp 0.3s ease'
      }}>
        <div style={{padding:'1.5rem',borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <h3 style={{color:C.white,fontSize:'1.25rem',fontWeight:600}}>
              Shopping Cart ({itemCount})
            </h3>
            <button onClick={onClose} style={{background:'none',border:'none',color:C.gray,cursor:'pointer'}}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={{padding:'1.5rem'}}>
          {cart.length === 0 ? (
            <div style={{textAlign:'center',padding:'2rem',color:C.gray}}>
              <ShoppingCart size={48} style={{marginBottom:'1rem'}} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:`1px solid ${C.border}`}}>
                  <div style={{
                    width:'60px',height:'60px',background:C.s2,borderRadius:'8px',
                    display:'flex',alignItems:'center',justifyContent:'center',color:C.gray
                  }}>
                    <Package size={24} />
                  </div>
                  
                  <div style={{flex:1}}>
                    <h4 style={{color:C.white,fontSize:'0.9rem',marginBottom:'0.25rem'}}>{item.name}</h4>
                    <p style={{color:C.green,fontSize:'1rem',fontWeight:600}}>${item.price.toFixed(2)}</p>
                    
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.5rem'}}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => onQty(item.id, -1)}
                        style={{padding:'0.25rem',fontSize:'0.8rem'}}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{minWidth:'1.5rem',textAlign:'center',color:C.white,fontSize:'0.9rem'}}>
                        {item.qty}
                      </span>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => onQty(item.id, 1)}
                        style={{padding:'0.25rem',fontSize:'0.8rem'}}
                      >
                        <Plus size={12} />
                      </button>
                      <button 
                        onClick={() => onRemove(item.id)}
                        style={{background:'none',border:'none',color:C.red,cursor:'pointer',marginLeft:'auto'}}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{textAlign:'right'}}>
                    <p style={{color:C.white,fontWeight:600}}>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:'1rem',marginTop:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                  <span style={{color:C.gray,fontSize:'1.1rem'}}>Total:</span>
                  <span style={{color:C.green,fontSize:'1.5rem',fontWeight:700}}>${total.toFixed(2)}</span>
                </div>
                
                <button className="btn btn-primary" style={{width:'100%',padding:'1rem',fontSize:'1.1rem'}}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
      `}</style>
    </>
  );
};

/* ── MAIN APP ───────────────────────────────────────────────────────────────── */
function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [initCat, setInitCat] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [notif, setNotif] = useState(null);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? {...item, qty: item.qty + qty} : item
        );
      }
      return [...prev, {...product, qty}];
    });
    setNotif(`${product.name} added to cart!`);
    setTimeout(() => setNotif(null), 2500);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id ? {...item, qty: Math.max(1, item.qty + delta)} : item
    ));
  };

  const goShop = (cat = "All") => {
    setInitCat(cat);
    setPage("shop");
    window.scrollTo({top: 0});
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo({top: 0});
  };

  return (
    <div style={{minHeight:'100vh',background:C.dark}}>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{overflow-x:hidden;background:#070709;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-24px) rotate(6deg)}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-34px) rotate(-5deg)}}
        @keyframes float3{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(9deg)}}
        @keyframes breathe{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.72;transform:scale(1.08)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes sweep{0%{background-position:-300% center}100%{background-position:300% center}}
        @keyframes ctaPulse{0%,100%{box-shadow:0 0 32px rgba(0,201,107,.3)}50%{box-shadow:0 0 65px rgba(0,201,107,.68)}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes notifIn{0%{transform:translateY(-22px);opacity:0}15%{transform:translateY(0);opacity:1}85%{transform:translateY(0);opacity:1}100%{transform:translateY(-22px);opacity:0}}
        @keyframes kenburns{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.12) translate(-2%,-1%)}100%{transform:scale(1.06) translate(2%,1%)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111318}::-webkit-scrollbar-thumb{background:#00C96B;border-radius:2px}
        @media(max-width:768px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}.grid-2{grid-template-columns:repeat(2,1fr)!important}.grid-1{grid-template-columns:1fr!important}}
        @media(min-width:769px){.show-mobile{display:none!important}}
        
        .container{max-width:1200px;margin:0 auto;padding:0 20px;}
        .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all .2s;}
        .btn-primary{background:${C.green};color:${C.white};}
        .btn-primary:hover{background:${C.gd};transform:translateY(-1px);}
        .btn-secondary{background:${C.s2};color:${C.white};border:1px solid ${C.border};}
        .btn-secondary:hover{background:${C.s1};}
        .section{padding:80px 0;}
        .section-title{font-size:2.5rem;font-weight:700;margin-bottom:1rem;color:${C.white};}
        .section-subtitle{font-size:1.1rem;color:${C.gray};margin-bottom:3rem;}
        .grid{display:grid;gap:2rem;}
        .grid-2{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));}
        .grid-3{grid-template-columns:repeat(auto-fit,minmax(250px,1fr));}
        .grid-4{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));}
        .card{background:${C.s2};border-radius:12px;padding:1.5rem;border:1px solid ${C.border};transition:transform .2s,box-shadow .2s;}
        .card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,0.3);}
        .text-center{text-align:center;}
      `}</style>

      {/* Notification */}
      {notif && (
        <div style={{
          position:"fixed",top:82,right:22,
          background:`linear-gradient(135deg,#00C96B,#009950)`,
          color:"#070709",padding:"14px 24px",borderRadius:50,
          fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,
          zIndex:2000,animation:"notifIn 2.5s ease forwards",
          boxShadow:"0 0 44px rgba(0,201,107,.55)",
          display:"flex",alignItems:"center",gap:9
        }}>
          <CheckCircle size={17}/> {notif}
        </div>
      )}

      {/* Page Content */}
      {page === "home" && (
        <Home 
          cart={cart} 
          onAdd={addToCart} 
          onCartOpen={() => setCartOpen(true)} 
          onGoShop={goShop}
        />
      )}
      
      {page === "shop" && (
        <ShopPage 
          cart={cart} 
          onAdd={addToCart} 
          onCartOpen={() => setCartOpen(true)} 
          onBack={goHome} 
          initCat={initCat}
        />
      )}

      {/* Cart */}
      <Cart 
        cart={cart} 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onRemove={removeFromCart} 
        onQty={updateQty}
      />
    </div>
  );
}

export default App;
