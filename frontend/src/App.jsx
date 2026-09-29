import {useEffect,useState} from "react";
const API="http://127.0.0.1:5000/api";

function App(){
 const [events,setEvents]=useState([]),[user,setUser]=useState(null),[page,setPage]=useState("home");
 const [form,setForm]=useState({name:"",email:"",password:""}),[message,setMessage]=useState("");
 const load=async()=>setEvents(await (await fetch(`${API}/events`)).json());
 useEffect(()=>{load()},[]);
 const login=async e=>{e.preventDefault();const r=await fetch(`${API}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.email,password:form.password})});const d=await r.json();if(!r.ok)return setMessage(d.message);setUser(d);setMessage("");setPage("events")};
 const signup=async e=>{e.preventDefault();const r=await fetch(`${API}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const d=await r.json();setMessage(d.message);if(r.ok)setPage("login")};
 const join=async id=>{if(!user)return setMessage("Please login first.");const r=await fetch(`${API}/events/${id}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:user.id})});setMessage((await r.json()).message);load()};
 const del=async id=>{await fetch(`${API}/events/${id}`,{method:"DELETE"});load()};
 return <><nav><div className="brand">Campus<span>Hub</span></div><div className="navlinks">
 <button onClick={()=>setPage("home")}>Home</button><button onClick={()=>setPage("events")}>Events</button>
 {user&&<button onClick={()=>setPage("mine")}>My Events</button>}{user?.role==="admin"&&<button onClick={()=>setPage("admin")}>Admin</button>}
 {!user&&<button onClick={()=>setPage("login")}>Login</button>}{!user&&<button className="navprimary" onClick={()=>setPage("register")}>Register</button>}
 {user&&<button onClick={()=>{setUser(null);setPage("home")}}>Logout</button>}</div></nav>
 {message&&<div className="message">{message}</div>}
 {page==="home"&&<main className="hero"><div><p className="eyebrow">SMART CAMPUS • CONNECT • PARTICIPATE</p><h1>Discover.<br/>Register.<br/><span>Experience campus.</span></h1><p className="lead">Discover campus events, reserve your seat and manage your participation in one place.</p><button className="cta" onClick={()=>setPage("events")}>Explore Events →</button></div><div className="heroCard"><div className="orb">✦</div><h3>Campus Event Hub</h3><p>Technology • Workshops • Coding • Arts</p><div className="miniStats"><b>{events.length}<small>Events</small></b><b>{events.reduce((a,e)=>a+Number(e.registered),0)}<small>Registrations</small></b></div></div></main>}
 {page==="events"&&<main className="container"><p className="eyebrow">UPCOMING</p><h2>Campus Events</h2><div className="grid">{events.map(e=><div className="event" key={e.id}><div className="tag">{e.category}</div><h3>{e.title}</h3><p>{e.description}</p><div className="details">📅 {String(e.event_date).slice(0,10)}<br/>📍 {e.venue}</div><div className="capacity">{e.registered}/{e.capacity} seats filled</div><button className="cta small" onClick={()=>join(e.id)}>Register</button>{user?.role==="admin"&&<button className="danger" onClick={()=>del(e.id)}>Delete</button>}</div>)}</div></main>}
 {page==="login"&&<Auth title="Welcome back" submit="Login" form={form} setForm={setForm} onSubmit={login}/>}
 {page==="register"&&<Auth title="Create account" submit="Register" form={form} setForm={setForm} onSubmit={signup} register/>}
 {page==="mine"&&user&&<Mine user={user}/>}
 {page==="admin"&&user?.role==="admin"&&<Admin reload={load}/>}
 </>}
}
function Auth({title,submit,form,setForm,onSubmit,register}){return <main className="auth"><form className="authCard" onSubmit={onSubmit}><p className="eyebrow">CAMPUS EVENT HUB</p><h2>{title}</h2>{register&&<input placeholder="Full name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input type="email" placeholder="Email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button className="cta">{submit}</button></form></main>}
function Mine({user}){const [items,setItems]=useState([]);useEffect(()=>{fetch(`${API}/users/${user.id}/registrations`).then(r=>r.json()).then(setItems)},[user]);return <main className="container"><p className="eyebrow">YOUR DASHBOARD</p><h2>My Registered Events</h2><div className="grid">{items.map(e=><div className="event" key={e.id}><div className="tag">{e.category}</div><h3>{e.title}</h3><p>📅 {String(e.event_date).slice(0,10)}<br/>📍 {e.venue}</p></div>)}</div>{!items.length&&<p className="empty">No registrations yet.</p>}</main>}
function Admin({reload}){const [f,setF]=useState({title:"",description:"",category:"Technology",event_date:"",venue:"",capacity:50});const create=async e=>{e.preventDefault();await fetch(`${API}/events`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});setF({...f,title:"",description:""});reload()};return <main className="container"><p className="eyebrow">ADMIN PANEL</p><h2>Create Event</h2><form className="adminForm" onSubmit={create}>{Object.keys(f).map(k=><input key={k} type={k==="event_date"?"date":k==="capacity"?"number":"text"} placeholder={k.replace("_"," ")} required value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/>)}<button className="cta">Create Event</button></form></main>}
export default App;