import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Download, MapPin, MessageCircle, Play, Search, Star } from "lucide-react";
import { Card, Badge, SectionHeading } from "@/components/ui";
import { announcements, classes, lessons, testimonials } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site";

export function PublicContent({ page }: { page: string }) {
  if (page === "about-sir") return <About/>;
  if (page === "classes") return <Classes/>;
  if (page === "free-lessons") return <Lessons/>;
  if (page === "gallery") return <Gallery/>;
  if (page === "timetable") return <Timetable/>;
  if (page === "results") return <Results/>;
  if (page === "announcements") return <Announcements/>;
  return <Contact/>;
}

function Wrap({children}:{children:React.ReactNode}){return <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">{children}</section>}
function About(){return <Wrap><div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr]"><Card className="grid min-h-[460px] place-items-center bg-gradient-to-br from-lavender-200 to-peach-100 p-8 text-9xl">👨‍🏫</Card><div><SectionHeading eyebrow="Personal tuition brand" title="Science made clear, organised and enjoyable" text="Pasindu Udana is presented here as a dedicated individual Science teacher—not a large academy or multi-teacher marketplace."/><div className="grid gap-4 sm:grid-cols-2">{[["Qualifications","B.Sc. placeholder • Teacher training placeholder"],["Experience","8+ years of classroom and online teaching"],["Teaching areas","Theory, revision, paper classes and seminars"],["Grades","Grades 6 to 11"]].map(([a,b])=><Card key={a} className="p-5"><p className="text-sm font-black text-lavender-700">{a}</p><p className="mt-2 leading-6 text-ink/65">{b}</p></Card>)}</div><Card className="mt-5 p-6"><h3 className="text-xl font-black">Teaching philosophy</h3><p className="mt-3 leading-7 text-ink/65">Every student can understand Science when ideas are connected to everyday life, explained in small steps and reinforced through purposeful practice. Lessons combine clear theory, diagrams, experiments, questions and feedback.</p></Card></div></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[["Mission","Help every learner build confidence and strong scientific thinking."],["Vision","Create a trusted personal tuition class where progress is visible."],["Promise","Clear teaching, regular practice and respectful student support."]].map(([a,b],i)=><Card key={a} className="p-6"><div className="text-4xl">{["🎯","🔭","🤝"][i]}</div><h3 className="mt-4 text-xl font-black">{a}</h3><p className="mt-2 text-sm leading-6 text-ink/60">{b}</p></Card>)}</div></Wrap>}

function Classes(){return <Wrap><ClassesPoster/></Wrap>}
function Info({icon,title,text}:{icon:string;title:string;text:string}){return <div className="rounded-2xl bg-white/65 p-4"><div className="text-xl">{icon}</div><p className="mt-2 font-black">{title}</p><p className="text-xs text-ink/45">{text}</p></div>}

function Lessons(){return <Wrap><div className="mb-7 grid gap-3 md:grid-cols-[1fr_auto_auto]"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18}/><input className="pastel-input pl-11" placeholder="Search free lessons..."/></div><button className="pill">All grades</button><button className="pill">All topics</button></div><div className="grid gap-5 md:grid-cols-3">{[...lessons,...lessons].map((l,i)=><Card key={i} className="overflow-hidden"><div className={`grid h-48 place-items-center text-7xl ${i%3===0?"bg-lavender-200":i%3===1?"bg-peach-100":"bg-butter"}`}>{l.icon}</div><div className="p-5"><div className="flex gap-2"><Badge>{l.grade}</Badge><Badge tone="blue">{l.duration}</Badge></div><h2 className="mt-4 text-xl font-black">{l.title}</h2><p className="mt-1 text-sm text-ink/50">{l.topic} • Pasindu Udana</p><div className="mt-5 flex gap-2"><button className="gradient-button flex-1"><Play size={16}/> Watch</button><button className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-card"><Download size={17}/></button></div></div></Card>)}</div></Wrap>}

import { TimetablePoster } from "@/components/timetable-poster";
import { ClassesPoster } from "@/components/classes-poster";
import { ContactPoster } from "@/components/contact-poster";
import { GalleryPoster } from "@/components/gallery-poster";

function Gallery(){return <Wrap><GalleryPoster/></Wrap>}

function Timetable(){return <Wrap><TimetablePoster/></Wrap>}

function Results(){return <Wrap><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["92%","Regular attendance"],["84%","Average term score"],["126","Improvement stories"],["37","A-grade results"]].map(([a,b])=><Card className="p-6 text-center" key={b}><p className="text-4xl font-black text-lavender-700">{a}</p><p className="mt-2 text-sm font-bold text-ink/50">{b}</p></Card>)}</div><SectionHeading eyebrow="Improvement stories" title="Progress built through consistency" text="All names and results below are realistic mock data for the UI demonstration."/><div className="grid gap-5 md:grid-cols-3">{[["Nethmi S.","61 → 84","Grade 10"],["Kavindu R.","55 → 78","Grade 9"],["Dinuka P.","68 → 91","Grade 11"]].map(([n,r,g])=><Card className="p-6" key={n}><div className="grid h-16 w-16 place-items-center rounded-2xl bg-lavender-100 text-3xl">🎓</div><h3 className="mt-4 text-xl font-black">{n}</h3><Badge tone="blue">{g}</Badge><p className="mt-5 text-4xl font-black text-emerald-600">{r}</p><p className="mt-2 text-sm text-ink/55">Term-test improvement after structured revision and paper practice.</p></Card>)}</div><div className="mt-10 grid gap-5 md:grid-cols-3">{testimonials.map(t=><Card className="p-5" key={t.name}><div className="flex text-amber-400">{Array.from({length:5}).map((_,i)=><Star key={i} size={15} fill="currentColor"/>)}</div><p className="mt-4 text-sm leading-6 text-ink/65">“{t.text}”</p><p className="mt-4 font-black">{t.name}</p></Card>)}</div></Wrap>}

function Announcements(){return <Wrap><div className="mb-7 grid gap-3 md:grid-cols-[1fr_auto]"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18}/><input className="pastel-input pl-11" placeholder="Search announcements..."/></div><button className="pill">All categories</button></div><Card className="mb-6 bg-gradient-to-r from-lavender-200 to-peach-100 p-7"><Badge tone="pink">Featured announcement</Badge><h2 className="mt-4 text-3xl font-black">Grade 11 model paper seminar</h2><p className="mt-3 max-w-3xl leading-7 text-ink/60">A focused seminar covering time management, marking schemes, structured answers and common exam mistakes.</p><p className="mt-5 text-sm font-black">03 August 2026 • 8:30 AM • Maharagama</p></Card><div className="grid gap-5 md:grid-cols-2">{[...announcements,...announcements].map((a,i)=><Card className="p-5" key={i}><div className="flex gap-2"><Badge tone="pink">{a.category}</Badge><Badge tone="yellow">{a.priority}</Badge></div><h3 className="mt-4 text-xl font-black">{a.title}</h3><p className="mt-2 text-sm leading-6 text-ink/55">Additional announcement details can be displayed here with a full read-more page later.</p><p className="mt-4 text-xs font-bold text-ink/40">{a.date}</p></Card>)}</div></Wrap>}

function Contact(){return <Wrap><ContactPoster/></Wrap>}
