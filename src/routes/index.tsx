import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Coffee, MapPin, Phone, Clock, Instagram, Facebook,
  Star, ArrowRight, Menu as MenuIcon, X, Utensils, Sparkles,
} from "lucide-react";

import heroImg from "@/assets/hero-coffee.jpg";
import mCoffee from "@/assets/menu-coffee.jpg";
import mCold from "@/assets/menu-coldcoffee.jpg";
import mPizza from "@/assets/menu-pizza.jpg";
import mBurger from "@/assets/menu-burger.jpg";
import mDessert from "@/assets/menu-dessert.jpg";
import mShake from "@/assets/menu-shake.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Cafein Cafe — Najafgarh's Premium Coffee Experience" },
      {
        name: "description",
        content:
          "Cafein Cafe in Najafgarh — premium coffee, desserts, pizza & shakes in a luxury Instagram-worthy ambience. Order on Zomato or visit us.",
      },
      { property: "og:title", content: "Cafein Cafe — Brewed With Passion" },
      {
        property: "og:description",
        content: "Najafgarh's premium cafe experience. Coffee, desserts, vibes.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
});

const ZOMATO_URL = "https://zomato.onelink.me/xqzv/qsrif0i6";
const MAPS_URL = "https://maps.app.goo.gl/oCJVv2ScbG5Nuu6eA";
const ADDRESS =
  "Kehra Mor, near Curl Fit Gym, Nanda Enclave, Block B, New Gopal Nagar, Najafgarh, New Delhi — 110043";

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <About />
      <MenuSection />
      <Gallery />
      <Testimonials />
      <Reservation />
      <Location />
      <Footer />
      <FloatingOrder />
    </div>
  );
}

/* ---------- NAV ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Menu", "#menu"],
    ["Gallery", "#gallery"],
    ["Reserve", "#reserve"],
    ["Visit", "#location"],
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-5 transition-all duration-500 ${
          scrolled ? "" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all ${
            scrolled ? "glass shadow-[0_8px_40px_-12px_oklch(0_0_0/0.6)]" : ""
          }`}
        >
          <a href="#home" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
              <Coffee className="w-5 h-5" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight">
              Cafein<span className="text-primary">.</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a
            href={ZOMATO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[oklch(0.6_0.24_25)] px-5 py-2.5 text-sm font-semibold text-white animate-pulse-glow hover:scale-105 transition-transform"
          >
            <Utensils className="w-4 h-4" />
            Order on Zomato
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden grid place-items-center w-10 h-10 rounded-full glass"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 glass rounded-3xl p-5 flex flex-col gap-4"
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-foreground/90 hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[oklch(0.6_0.24_25)] px-5 py-3 text-sm font-semibold text-white text-center"
            >
              Order on Zomato
            </a>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Cafein Cafe espresso pour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/40" />
      </motion.div>

      {/* Floating particles */}
      <Particles />

      {/* Steam */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute block w-2 h-2 rounded-full bg-cream/30 blur-sm animate-steam"
            style={{
              left: `${i * 14 - 20}px`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 min-h-screen flex flex-col justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex w-fit items-center gap-2 rounded-full glass px-4 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground/80 tracking-wide">
            Najafgarh's Premium Cafe Experience
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tighter max-w-5xl"
        >
          Brewed
          <br />
          With <span className="text-gradient italic">Passion</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl"
        >
          Experience premium coffee, indulgent desserts and electric cafe vibes
          — handcrafted at Cafein, your new favourite hangout.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href={ZOMATO_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-[oklch(0.6_0.24_25)] px-7 py-4 font-semibold text-white animate-pulse-glow hover:scale-105 transition-transform"
          >
            <Utensils className="w-5 h-5" />
            Order on Zomato
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#menu"
            className="inline-flex items-center gap-3 rounded-full glass px-7 py-4 font-semibold hover:bg-white/10 transition-colors"
          >
            View Menu
          </a>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold text-foreground/80 hover:text-primary transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Visit Cafe
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-20 grid grid-cols-3 gap-4 max-w-2xl"
        >
          {[
            ["10K+", "Happy Customers"],
            ["50K+", "Coffees Served"],
            ["4.8★", "Avg Rating"],
          ].map(([num, label]) => (
            <div key={label} className="">
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">
                {num}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground tracking-widest uppercase animate-float">
        Scroll
      </div>
    </section>
  );
}

function Particles() {
  const dots = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: "100vh", x: Math.random() * 100 + "vw", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
        />
      ))}
    </div>
  );
}

/* ---------- ABOUT ---------- */
function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glow-neon">
            <img
              src={g1}
              alt="Cafein Cafe interior"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div className="absolute -bottom-8 -right-4 md:-right-8 w-44 h-44 rounded-3xl overflow-hidden border-4 border-background shadow-2xl">
            <img src={g2} alt="Latte art" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm uppercase tracking-[0.3em] text-primary">Our Story</span>
          <h2 className="mt-4 font-display font-bold text-5xl md:text-6xl leading-tight">
            Where every <span className="text-gradient italic">cup</span> tells a story.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Born in the heart of Najafgarh, Cafein is more than a cafe — it's a
            mood. We craft each espresso, dessert and shake to give you the
            kind of moment worth photographing, sharing and remembering.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From single-origin beans to handmade plates, every detail is
            obsessed over so your visit feels like an experience, not a stop.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              ["10K+", "Happy Customers"],
              ["50K+", "Cups Brewed"],
              ["4.8★", "Google Rating"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl p-5 text-center">
                <div className="font-display text-2xl font-bold text-primary">{n}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- MENU ---------- */
const MENU = [
  { cat: "Coffee", name: "Signature Latte", price: "₹189", img: mCoffee, rating: 4.9 },
  { cat: "Cold Coffee", name: "Iced Caramel Brew", price: "₹219", img: mCold, rating: 4.8 },
  { cat: "Pizza", name: "Truffle Margherita", price: "₹349", img: mPizza, rating: 4.9 },
  { cat: "Burgers", name: "Smash Cheese Stack", price: "₹279", img: mBurger, rating: 4.7 },
  { cat: "Desserts", name: "Molten Lava Dome", price: "₹199", img: mDessert, rating: 5.0 },
  { cat: "Shakes", name: "Strawberry Cloud", price: "₹229", img: mShake, rating: 4.8 },
];
const CATS = ["All", "Coffee", "Cold Coffee", "Pizza", "Burgers", "Desserts", "Shakes"];

function MenuSection() {
  const [active, setActive] = useState("All");
  const items = active === "All" ? MENU : MENU.filter((i) => i.cat === active);

  return (
    <section id="menu" className="relative py-28 md:py-40 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-primary">Menu</span>
          <h2 className="mt-4 font-display font-bold text-5xl md:text-6xl">
            Crafted to <span className="text-gradient italic">crave</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Handpicked favourites from our coffee bar and kitchen.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === c
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="group glass rounded-3xl overflow-hidden hover:shadow-[0_30px_80px_-20px_oklch(0.7_0.2_40/0.4)] transition-all"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs font-medium">
                  {item.cat}
                </div>
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  {item.rating}
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-xl">{item.name}</h3>
                  <p className="text-primary font-bold text-lg mt-1">{item.price}</p>
                </div>
                <a
                  href={ZOMATO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="grid place-items-center w-12 h-12 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                  aria-label={`Order ${item.name}`}
                >
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- GALLERY ---------- */
function Gallery() {
  const imgs = [
    { src: g1, h: "row-span-2" },
    { src: g2, h: "" },
    { src: g3, h: "row-span-2" },
    { src: g4, h: "" },
  ];
  return (
    <section id="gallery" className="py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <span className="text-sm uppercase tracking-[0.3em] text-primary">Gallery</span>
            <h2 className="mt-4 font-display font-bold text-5xl md:text-6xl">
              Moments <span className="text-gradient italic">brewed</span>.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            A peek inside the spaces, plates and people that make Cafein feel
            like home — every frame Instagram-ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4">
          {imgs.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-3xl group ${g.h}`}
            >
              <img
                src={g.src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
const REVIEWS = [
  {
    name: "Aanya Sharma",
    role: "Regular guest",
    text: "Hands down the best cold coffee in Najafgarh. The vibe is straight out of a movie scene.",
  },
  {
    name: "Rohit Verma",
    role: "Foodie",
    text: "Their truffle pizza & molten lava dome combo is unreal. I keep coming back for more.",
  },
  {
    name: "Simran Kaur",
    role: "Content creator",
    text: "Every corner is a photo. Lighting, plates, coffee — chef's kiss. My new favourite spot.",
  },
];

function Testimonials() {
  return (
    <section className="py-28 md:py-40 bg-gradient-to-b from-background to-card/40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm uppercase tracking-[0.3em] text-primary">Loved by guests</span>
          <h2 className="mt-4 font-display font-bold text-5xl md:text-6xl">
            What people <span className="text-gradient italic">say</span>.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-8 hover:-translate-y-2 transition-transform"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- RESERVATION ---------- */
function Reservation() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi Cafein! I'd like to reserve a table.%0A%0AName: ${form.name}%0APhone: ${form.phone}%0ADate: ${form.date}%0ATime: ${form.time}%0AGuests: ${form.guests}`;
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <section id="reserve" className="py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <span className="text-sm uppercase tracking-[0.3em] text-primary">Reserve</span>
            <h2 className="mt-4 font-display font-bold text-4xl md:text-5xl">
              Book your <span className="text-gradient italic">table</span>.
            </h2>
            <p className="mt-3 text-muted-foreground">We'll confirm your booking on WhatsApp.</p>

            <form onSubmit={submit} className="mt-10 grid sm:grid-cols-2 gap-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
              <Field label="Time" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} required />
              <Field label="Guests" type="number" value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} required />
              <button
                type="submit"
                className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold hover:scale-[1.02] transition-transform"
              >
                Confirm via WhatsApp
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-input/40 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
      />
    </label>
  );
}

/* ---------- LOCATION ---------- */
function Location() {
  return (
    <section id="location" className="py-28 md:py-40 bg-gradient-to-b from-background to-card/30">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm uppercase tracking-[0.3em] text-primary">Find us</span>
          <h2 className="mt-4 font-display font-bold text-5xl md:text-6xl">
            Visit <span className="text-gradient italic">Cafein</span>.
          </h2>

          <div className="mt-8 space-y-5">
            <Info icon={<MapPin />} title="Address" text={ADDRESS} />
            <Info icon={<Clock />} title="Open Daily" text="11:00 AM – 11:30 PM" />
            <Info icon={<Phone />} title="Reservations" text="Tap below to chat on WhatsApp" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:scale-105 transition-transform"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold"
            >
              Order Online
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden glass p-2"
        >
          <iframe
            title="Cafein Cafe map"
            src="https://www.google.com/maps?q=Nanda+Enclave+Block+B+New+Gopal+Nagar+Najafgarh+New+Delhi+110043&output=embed"
            className="w-full h-full rounded-2xl grayscale-[20%] contrast-110"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="grid place-items-center w-12 h-12 rounded-2xl bg-primary/15 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
              <Coffee className="w-5 h-5" />
            </span>
            <span className="font-display font-bold text-xl">Cafein<span className="text-primary">.</span></span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
            Najafgarh's premium cafe experience — coffee, desserts and vibes
            crafted to be remembered.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="grid place-items-center w-10 h-10 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="grid place-items-center w-10 h-10 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#menu" className="hover:text-primary">Menu</a></li>
            <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
            <li><a href="#reserve" className="hover:text-primary">Reserve</a></li>
            <li><a href={ZOMATO_URL} target="_blank" rel="noreferrer" className="hover:text-primary">Order Zomato</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-4">Hours</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Mon – Sun</li>
            <li>11:00 AM – 11:30 PM</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cafein Cafe · Najafgarh, New Delhi · All rights reserved.
      </div>
    </footer>
  );
}

/* ---------- FLOATING ORDER BUTTON ---------- */
function FloatingOrder() {
  return (
    <a
      href={ZOMATO_URL}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 md:hidden inline-flex items-center gap-2 rounded-full bg-[oklch(0.6_0.24_25)] text-white px-5 py-3 font-semibold animate-pulse-glow"
    >
      <Utensils className="w-4 h-4" /> Order
    </a>
  );
}
