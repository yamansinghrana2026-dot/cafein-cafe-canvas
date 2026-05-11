import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/use-admin";
import { toast } from "sonner";
import {
  Coffee, LogOut, Utensils, Calendar, Star, Image as ImageIcon, Settings,
  Plus, Trash2, Save, ExternalLink, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin Dashboard — Cafein" }] }),
});

type Tab = "menu" | "reservations" | "reviews" | "gallery" | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const { loading, isAdmin, userId } = useIsAdmin();
  const [tab, setTab] = useState<Tab>("menu");

  useEffect(() => {
    if (!loading && !userId) navigate({ to: "/auth" });
  }, [loading, userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!userId) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Not authorized</h1>
          <p className="text-muted-foreground mt-2">Your account doesn't have admin access.</p>
          <button onClick={async()=>{await supabase.auth.signOut();navigate({to:"/auth"});}}
            className="mt-6 rounded-full bg-primary text-primary-foreground px-6 py-2.5 font-semibold">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const tabs: [Tab, string, any][] = [
    ["menu", "Menu", Utensils],
    ["reservations", "Reservations", Calendar],
    ["reviews", "Reviews", Star],
    ["gallery", "Gallery", ImageIcon],
    ["settings", "Settings", Settings],
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
              <Coffee className="w-5 h-5" />
            </span>
            <div>
              <div className="font-display font-bold leading-tight">Cafein Admin</div>
              <div className="text-xs text-muted-foreground">Live editor</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline-flex items-center gap-2 text-sm rounded-full glass px-4 py-2 hover:bg-white/10">
              <ExternalLink className="w-4 h-4" /> View site
            </Link>
            <button onClick={async()=>{await supabase.auth.signOut();navigate({to:"/auth"});}}
              className="inline-flex items-center gap-2 text-sm rounded-full bg-secondary px-4 py-2 hover:bg-secondary/70">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map(([id, label, Icon]) => (
              <button key={id} onClick={()=>setTab(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                  tab===id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main>
          {tab==="menu" && <MenuAdmin />}
          {tab==="reservations" && <ReservationsAdmin />}
          {tab==="reviews" && <ReviewsAdmin />}
          {tab==="gallery" && <GalleryAdmin />}
          {tab==="settings" && <SettingsAdmin />}
        </main>
      </div>
    </div>
  );
}

/* ---------- MENU ADMIN ---------- */
function MenuAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("menu_items").select("*").order("sort_order");
    setItems(data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("menu_items").insert({
      category: "Coffee", name: "New Item", price: "₹0", rating: 4.8, sort_order: items.length+1,
    });
    if (error) return toast.error(error.message);
    toast.success("Added"); load();
  };
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("menu_items").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setItems(items.map(i => i.id===id ? { ...i, ...patch } : i));
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <Section title="Menu items" subtitle="Add, edit, hide or remove items shown on the website."
      action={<button onClick={add} className="btn-primary"><Plus className="w-4 h-4"/> Add item</button>}>
      {loading ? <Loader/> : (
        <div className="grid gap-3">
          {items.map(item => (
            <div key={item.id} className="glass rounded-2xl p-4 grid sm:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-3 items-center">
              <Input value={item.name} onBlur={v=>update(item.id,{name:v})} placeholder="Name"/>
              <Input value={item.category} onBlur={v=>update(item.id,{category:v})} placeholder="Category"/>
              <Input value={item.price} onBlur={v=>update(item.id,{price:v})} placeholder="₹0" className="w-24"/>
              <Input value={String(item.rating)} onBlur={v=>update(item.id,{rating:Number(v)||4.8})} placeholder="Rating" className="w-20"/>
              <button onClick={()=>update(item.id,{is_active:!item.is_active})}
                className={`text-xs rounded-full px-3 py-1.5 ${item.is_active?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>
                {item.is_active ? "Active" : "Hidden"}
              </button>
              <button onClick={()=>remove(item.id)} className="text-destructive p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ---------- RESERVATIONS ADMIN ---------- */
function ReservationsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("reservations").select("*").order("date",{ascending:false});
    setRows(data || []); setLoading(false);
  };
  useEffect(()=>{load();},[]);
  const setStatus = async (id:string, status:string) => {
    const { error } = await supabase.from("reservations").update({status}).eq("id",id);
    if (error) return toast.error(error.message);
    setRows(rows.map(r=>r.id===id?{...r,status}:r));
  };
  const remove = async (id:string) => {
    if (!confirm("Delete reservation?")) return;
    await supabase.from("reservations").delete().eq("id",id); load();
  };
  return (
    <Section title="Reservations" subtitle="Manage table bookings submitted via the website.">
      {loading ? <Loader/> : rows.length===0 ? <Empty text="No reservations yet."/> : (
        <div className="grid gap-3">
          {rows.map(r => (
            <div key={r.id} className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{r.name} <span className="text-muted-foreground font-normal">· {r.phone}</span></div>
                <div className="text-sm text-muted-foreground mt-1">
                  {r.date} at {r.time} · {r.guests} guests
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={r.status} onChange={e=>setStatus(r.id,e.target.value)}
                  className="bg-input/40 border border-border rounded-full text-xs px-3 py-1.5">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <a href={`https://wa.me/${r.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="text-xs rounded-full bg-primary text-primary-foreground px-3 py-1.5">WhatsApp</a>
                <button onClick={()=>remove(r.id)} className="text-destructive p-2 hover:bg-destructive/10 rounded-lg">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ---------- REVIEWS ADMIN ---------- */
function ReviewsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("sort_order");
    setRows(data||[]); setLoading(false);
  };
  useEffect(()=>{load();},[]);
  const add = async () => {
    await supabase.from("reviews").insert({name:"New Customer", role:"Guest", text:"Great vibe!", rating:5, sort_order: rows.length+1});
    load();
  };
  const update = async (id:string, patch:any) => {
    await supabase.from("reviews").update(patch).eq("id",id);
    setRows(rows.map(r=>r.id===id?{...r,...patch}:r));
  };
  const remove = async (id:string) => { if(!confirm("Delete?")) return; await supabase.from("reviews").delete().eq("id",id); load(); };

  return (
    <Section title="Reviews" subtitle="Customer testimonials shown on the homepage."
      action={<button onClick={add} className="btn-primary"><Plus className="w-4 h-4"/> Add review</button>}>
      {loading ? <Loader/> : (
        <div className="grid gap-3">
          {rows.map(r => (
            <div key={r.id} className="glass rounded-2xl p-4 grid gap-2">
              <div className="grid sm:grid-cols-2 gap-2">
                <Input value={r.name} onBlur={v=>update(r.id,{name:v})} placeholder="Name"/>
                <Input value={r.role||""} onBlur={v=>update(r.id,{role:v})} placeholder="Role"/>
              </div>
              <textarea defaultValue={r.text} onBlur={e=>update(r.id,{text:e.target.value})}
                className="w-full bg-input/40 border border-border rounded-xl px-3 py-2 text-sm" rows={2}/>
              <div className="flex items-center gap-2 justify-between">
                <button onClick={()=>update(r.id,{is_published:!r.is_published})}
                  className={`text-xs rounded-full px-3 py-1.5 ${r.is_published?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>
                  {r.is_published ? "Published" : "Hidden"}
                </button>
                <button onClick={()=>remove(r.id)} className="text-destructive p-2 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ---------- GALLERY ADMIN ---------- */
function GalleryAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const load = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    setRows(data||[]);
  };
  useEffect(()=>{load();},[]);
  const add = async () => {
    if (!url) return toast.error("Paste an image URL");
    await supabase.from("gallery_images").insert({image_url:url, sort_order: rows.length+1});
    setUrl(""); load();
  };
  const remove = async (id:string) => { await supabase.from("gallery_images").delete().eq("id",id); load(); };

  return (
    <Section title="Gallery" subtitle="Add image URLs to feature in the website gallery.">
      <div className="flex gap-2 mb-4">
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://image-url.jpg"
          className="flex-1 bg-input/40 border border-border rounded-2xl px-4 py-2.5"/>
        <button onClick={add} className="btn-primary"><Plus className="w-4 h-4"/> Add</button>
      </div>
      {rows.length===0 ? <Empty text="No custom images yet — defaults will be used on the site."/> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rows.map(r => (
            <div key={r.id} className="relative aspect-square rounded-2xl overflow-hidden group">
              <img src={r.image_url} alt="" className="w-full h-full object-cover"/>
              <button onClick={()=>remove(r.id)}
                className="absolute top-2 right-2 grid place-items-center w-8 h-8 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ---------- SETTINGS ADMIN ---------- */
const SETTING_GROUPS: { title: string; fields: [string, string, string?][] }[] = [
  { title: "Hero", fields: [
    ["hero_badge", "Top badge"],
    ["hero_title", "Main headline"],
    ["hero_subtitle", "Subtitle", "long"],
  ]},
  { title: "About", fields: [
    ["about_text", "About paragraph", "long"],
    ["stat_customers", "Stat — Customers"],
    ["stat_coffees", "Stat — Coffees served"],
    ["stat_rating", "Stat — Rating"],
  ]},
  { title: "Contact & Links", fields: [
    ["phone", "Phone"],
    ["hours", "Opening hours"],
    ["address", "Address", "long"],
    ["zomato_url", "Zomato URL"],
    ["maps_url", "Google Maps URL"],
    ["instagram_url", "Instagram URL"],
    ["facebook_url", "Facebook URL"],
  ]},
];

function SettingsAdmin() {
  const [map, setMap] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from("site_settings").select("*");
      const m: Record<string,string> = {};
      (data||[]).forEach((r:any)=>{ m[r.key]=r.value||""; });
      setMap(m); setLoading(false);
    })();
  },[]);

  const save = async () => {
    setSaving(true);
    const rows = Object.entries(map).map(([key,value])=>({key,value}));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved! Refresh the homepage to see changes.");
  };

  if (loading) return <Loader/>;
  return (
    <Section title="Site settings" subtitle="Edit homepage text and contact details — one click to save."
      action={<button onClick={save} disabled={saving} className="btn-primary">
        {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Save all
      </button>}>
      <div className="space-y-8">
        {SETTING_GROUPS.map(g => (
          <div key={g.title}>
            <h3 className="font-display font-semibold text-lg mb-3">{g.title}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {g.fields.map(([key,label,type]) => (
                <label key={key} className={`block ${type==="long"?"sm:col-span-2":""}`}>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                  {type==="long" ? (
                    <textarea value={map[key]||""} onChange={e=>setMap({...map,[key]:e.target.value})} rows={3}
                      className="mt-2 w-full bg-input/40 border border-border rounded-2xl px-4 py-2.5"/>
                  ) : (
                    <input value={map[key]||""} onChange={e=>setMap({...map,[key]:e.target.value})}
                      className="mt-2 w-full bg-input/40 border border-border rounded-2xl px-4 py-2.5"/>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- shared bits ---------- */
function Section({ title, subtitle, action, children }: any) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-3xl">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function Loader() { return <div className="grid place-items-center py-12"><Loader2 className="w-5 h-5 animate-spin text-primary"/></div>; }
function Empty({text}:{text:string}) { return <div className="glass rounded-2xl p-12 text-center text-muted-foreground text-sm">{text}</div>; }

function Input({ value, onBlur, placeholder, className="" }: any) {
  const [v, setV] = useState(value ?? "");
  useEffect(()=>{setV(value ?? "");},[value]);
  return (
    <input value={v} onChange={e=>setV(e.target.value)} onBlur={()=>{ if (v!==value) onBlur(v); }}
      placeholder={placeholder}
      className={`bg-input/40 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 ${className}`}/>
  );
}
