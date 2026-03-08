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
  { id:15, name:"Stockfish (500g)",     desc:"Dried cod fish for traditional soups",        price:15.00, cat:"Soup",       seed:"stock15" },
  { id:16, name:"Ugu (Fluted Pumpkin)", desc:"Fresh fluted pumpkin leaves, per bunch",      price:4.00,  cat:"Vegetables",seed:"ugu16"   },
  { id:17, name:"Bitter Leaf",          desc:"Fresh bitter leaf, washed and ready",         price:3.50,  cat:"Vegetables",seed:"bitter17"},
  { id:18, name:"Scent Leaf",           desc:"Aromatic scent leaf for soups",               price:3.00,  cat:"Vegetables",seed:"scent18" },
  { id:19, name:"Garden Egg",           desc:"Fresh garden eggs, per pack",                 price:2.00,  cat:"Vegetables",seed:"egg19"   },
  { id:20, name:"Okra",                 desc:"Fresh okra pods, per 500g",                   price:4.50,  cat:"Vegetables",seed:"okra20"  },
];

/* ── GLOBAL STYLES (injected once) ───────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,sans-serif;background:${C.dark};color:${C.white};line-height:1.6;}
    img{max-width:100%;height:auto;}
    a{color:${C.green};text-decoration:none;transition:color .2s;}
    a:hover{color:${C.gd};}
    .container{max-width:1200px;margin:0 auto;padding:0 20px;}
    .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:all .2s;}
    .btn-primary{background:${C.green};color:${C.white};}
    .btn-primary:hover{background:${C.gd};transform:translateY(-1px);}
    .btn-secondary{background:${C.s2};color:${C.white};}
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
    .flex{display:flex;}
    .items-center{align-items:center;}
    .justify-between{justify-content:space-between;}
    .gap-1{gap:1rem;}
    .gap-2{gap:2rem;}
    .mb-1{margin-bottom:1rem;}
    .mb-2{margin-bottom:2rem;}
    .mt-1{margin-top:1rem;}
    .mt-2{margin-top:2rem;}
    .hidden{display:none;}
    @media (max-width:768px){
      .section{padding:60px 0;}
      .section-title{font-size:2rem;}
      .grid-2,.grid-3,.grid-4{grid-template-columns:1fr;}
    }
  `}</style>
);

/* ── HEADER ─────────────────────────────────────────────────────────────── */
const Header = ({ cartCount, onCartClick, onMenuClick }) => (
  <header style={{
    position:'fixed',top:0,left:0,right:0,zIndex:1000,
    background: C.s1, borderBottom: `1px solid ${C.border}`, backdropFilter: 'blur(10px)'
  }}>
    <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
        <Leaf size={32} color={C.green} />
        <h1 style={{fontSize:'1.5rem',fontWeight:700,color:C.white}}>AFROBASKET</h1>
      </div>
      <nav style={{display:'flex',alignItems:'center',gap:'2rem'}}>
        <button onClick={onCartClick} style={{position:'relative',background:'none',border:'none',cursor:pointer}}>
          <ShoppingCart size={24} color={C.white} />
          {cartCount > 0 && (
            <span style={{
              position:'absolute',top:'-8px',right:'-8px',
              background:C.orange,color:C.white,borderRadius:'50%',
              width:'20px',height:'20px',fontSize:'0.75rem',
              display:'flex',alignItems:'center',justifyContent:'center'
            }}>{cartCount}</span>
          )}
        </button>
        <button onClick={onMenuClick} style={{background:'none',border:'none',cursor:pointer}}>
          <Menu size={24} color={C.white} />
        </button>
      </nav>
    </div>
  </header>
);

/* ── HERO SECTION ─────────────────────────────────────────────────────────── */
const Hero = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section style={{
        minHeight:'100vh',display:'flex',alignItems:'center',
        background:`linear-gradient(135deg, ${C.dark} 0%, ${C.s1} 100%)`,
      }}>
        <div className="container">
          <h1 style={{color:C.white,fontSize:'2rem'}}>Loading...</h1>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      minHeight:'100vh',display:'flex',alignItems:'center',position:'relative',
      padding:'4rem 0',background:`linear-gradient(135deg, ${C.dark} 0%, ${C.s1} 100%)`,
      overflow:'hidden'
    }}>
      {/* Floating food images */}
      {FLOATERS.map((f,i)=>(
        <div key={i} style={{
          position:'absolute',left:`${f.x}%`,top:`${f.y}%`,
          width:`${f.w}px`,height:`${f.h}px`,
          animation:`float${f.anim} 6s ease-in-out infinite`,
          animationDelay: `${f.delay}s`,
          opacity:0.8
        }}>
          <img 
            src={foodImg(f.id,f.w,f.h)} 
            alt="" 
            style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      ))}
      
      <div className="container" style={{position:'relative',zIndex:2}}>
        <div style={{maxWidth:'600px'}}>
          <h1 className="section-title" style={{marginBottom:'1.5rem'}}>
            Authentic African Groceries <span style={{color:C.green}}>Delivered</span>
          </h1>
          <p className="section-subtitle" style={{marginBottom:'2rem'}}>
            Fresh produce, pantry staples, and traditional ingredients from across Africa. 
            From yam and plantain to egusi and ogbono, we bring the taste of home to your doorstep.
          </p>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
            <button className="btn btn-primary">
              <ShoppingCart size={20} />
              Shop Now
            </button>
            <button className="btn btn-secondary">
              <MapPin size={20} />
              Check Delivery
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float1{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(5deg);}}
        @keyframes float2{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-15px) rotate(-3deg);}}
        @keyframes float3{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-25px) rotate(3deg);}}
      `}</style>
    </section>
  );
};

/* ── PRODUCTS SECTION ─────────────────────────────────────────────────────── */
const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
  
  const filtered = selectedCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.cat === selectedCategory);

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
        <h2 className="section-title text-center">Shop Our Products</h2>
        <p className="section-subtitle text-center">
          Quality African groceries at competitive prices
        </p>

        {/* Category filter */}
        <div style={{display:'flex',justifyContent:'center',gap:'1rem',marginBottom:'3rem',flexWrap:'wrap'}}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{fontSize:'0.9rem'}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── PRODUCT CARD ─────────────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);

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
      
      {quantity === 0 ? (
        <button 
          className="btn btn-primary" 
          style={{width:'100%',justifyContent:'center'}}
          onClick={() => setQuantity(1)}
        >
          <Plus size={16} />
          Add to Cart
        </button>
      ) : (
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
          >
            <Minus size={16} />
          </button>
          <span style={{minWidth:'2rem',textAlign:'center',fontWeight:600}}>
            {quantity}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ── FEATURES SECTION ─────────────────────────────────────────────────────── */
const Features = () => (
  <section className="section" style={{background:C.dark}}>
    <div className="container">
      <h2 className="section-title text-center">Why Choose AFROBASKET?</h2>
      <p className="section-subtitle text-center">
        We're committed to bringing you the best African grocery experience
      </p>
      
      <div className="grid grid-3">
        <div className="card text-center">
          <Truck size={48} color={C.green} style={{marginBottom:'1rem'}} />
          <h3 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>
            Fast Delivery
          </h3>
          <p style={{color:C.gray}}>
            Same-day delivery available for orders placed before 2 PM
          </p>
        </div>
        
        <div className="card text-center">
          <Leaf size={48} color={C.green} style={{marginBottom:'1rem'}} />
          <h3 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>
            Fresh Products
          </h3>
          <p style={{color:C.gray}}>
            Sourced directly from trusted suppliers and farmers
          </p>
        </div>
        
        <div className="card text-center">
          <Package size={48} color={C.green} style={{marginBottom:'1rem'}} />
          <h3 style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>
            Secure Packaging
          </h3>
          <p style={{color:C.gray}}>
            Carefully packaged to maintain freshness during transit
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ── FOOTER ───────────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{background:C.s1,padding:'3rem 0 1rem',borderTop:`1px solid ${C.border}`}}>
    <div className="container">
      <div className="grid grid-3" style={{marginBottom:'2rem'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
            <Leaf size={24} color={C.green} />
            <h3 style={{fontSize:'1.25rem',fontWeight:700,color:C.white}}>AFROBASKET</h3>
          </div>
          <p style={{color:C.gray,fontSize:'0.9rem'}}>
            Your trusted source for authentic African groceries delivered to your doorstep.
          </p>
        </div>
        
        <div>
          <h4 style={{fontSize:'1.1rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>
            Quick Links
          </h4>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
            <li><a href="#" style={{color:C.gray,fontSize:'0.9rem'}}>About Us</a></li>
            <li><a href="#" style={{color:C.gray,fontSize:'0.9rem'}}>Delivery Info</a></li>
            <li><a href="#" style={{color:C.gray,fontSize:'0.9rem'}}>Contact</a></li>
            <li><a href="#" style={{color:C.gray,fontSize:'0.9rem'}}>FAQ</a></li>
          </ul>
        </div>
        
        <div>
          <h4 style={{fontSize:'1.1rem',fontWeight:600,marginBottom:'1rem',color:C.white}}>
            Connect
          </h4>
          <div style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
            <a href="#" style={{color:C.gray}}><Instagram size={20} /></a>
            <a href="#" style={{color:C.gray}}><Mail size={20} /></a>
          </div>
          <p style={{color:C.gray,fontSize:'0.9rem'}}>
            Follow us for updates and special offers
          </p>
        </div>
      </div>
      
      <div style={{textAlign:'center',paddingTop:'2rem',borderTop:`1px solid ${C.border}`}}>
        <p style={{color:C.gray,fontSize:'0.9rem'}}>
          © 2024 AFROBASKET. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

/* ── MAIN APP ───────────────────────────────────────────────────────────────── */
function App() {
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#070709',
        color: '#F0EDE6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
      }}>
        Loading AFROBASKET...
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:C.dark}}>
      <GlobalStyles />
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setShowCart(!showCart)}
        onMenuClick={() => setShowMenu(!showMenu)}
      />
      
      <main style={{paddingTop:'80px'}}>
        <Hero />
        <Products />
        <Features />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
