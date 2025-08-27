// @ts-nocheck
'use client';

import React, { useMemo, useState } from "react";

function classNames(...cls) { return cls.filter(Boolean).join(" "); }

const SAMPLE_STUDENTS = [
  {
    id: "s1",
    name: "Alex R.",
    school: "Colgate University",
    major: "Computer Science",
    totalBalance: 18000,
    remainingBalance: 12400,
    paymentsRemaining: 36,
    statementMonth: "Aug 2025",
    taxEligible: true,
  },
  {
    id: "s2",
    name: "Maya S.",
    school: "Colgate University",
    major: "Economics",
    totalBalance: 24000,
    remainingBalance: 21450,
    paymentsRemaining: 108,
    statementMonth: "Aug 2025",
    taxEligible: true,
  },
  {
    id: "s3",
    name: "Jordan P.",
    school: "UCLA",
    major: "Public Policy",
    totalBalance: 32000,
    remainingBalance: 29875,
    paymentsRemaining: 118,
    statementMonth: "Aug 2025",
    taxEligible: true,
  },
  {
    id: "s4",
    name: "Leah K.",
    school: "University of Michigan",
    major: "Nursing",
    totalBalance: 27000,
    remainingBalance: 9500,
    paymentsRemaining: 28,
    statementMonth: "Jul 2025",
    taxEligible: true,
  },
  {
    id: "s5",
    name: "Chris D.",
    school: "Columbia University",
    major: "Mechanical Engineering",
    totalBalance: 40000,
    remainingBalance: 36200,
    paymentsRemaining: 124,
    statementMonth: "Aug 2025",
    taxEligible: true,
  },
  {
    id: "s6",
    name: "Sam T.",
    school: "Colgate University",
    major: "Sociology",
    totalBalance: 15000,
    remainingBalance: 6200,
    paymentsRemaining: 22,
    statementMonth: "Aug 2025",
    taxEligible: true,
  },
];

const SCHOOL_COLORS = {
  "Colgate University": "from-rose-100 to-rose-50",
  "UCLA": "from-blue-100 to-blue-50",
  "University of Michigan": "from-yellow-100 to-yellow-50",
  "Columbia University": "from-sky-100 to-sky-50",
};

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function ProgressBar({ value, total }) {
  const pct = Math.min(100, Math.round(((total - value) / total) * 100));
  return (
    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
      <div className="h-3 bg-emerald-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Avoid Tailwind purge issues by mapping tones to static class strings
const TONES = {
  slate: "bg-slate-100 text-slate-800",
  emerald: "bg-emerald-100 text-emerald-800",
};
function Pill({ children, tone = "slate" }) {
  const toneCls = TONES[tone] || TONES.slate;
  return (
    <span className={classNames("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", toneCls)}>{children}</span>
  );
}

function TopNav({ onNavigate, route }) {
  return (
    <div className="w-full sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white grid place-items-center font-bold">P</div>
          <div className="text-xl font-semibold tracking-tight">Propel</div>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: "home", label: "Home" },
            { id: "students", label: "Students" },
            { id: "funds", label: "College Funds" },
            { id: "about", label: "About" },
          ].map((l) => (
            <button
              key={l.id}
              className={classNames(
                "px-3 py-2 rounded-xl text-sm font-medium",
                route === l.id ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              )}
              onClick={() => onNavigate(l.id)}
            >
              {l.label}
            </button>
          ))}
          <button
            className="ml-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            onClick={() => onNavigate("donate")}
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero({ onNavigate }) {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Help students <span className="text-emerald-600">rise above debt</span>.
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Propel is a hybrid platform uniting <span className="font-medium">tax-deductible</span> college funds with
            <span className="font-medium"> direct-to-student</span> giving. Transparent. Accountable. Built for scale.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700" onClick={() => onNavigate("students")}>
              Support a Student
            </button>
            <button className="px-5 py-3 rounded-xl border font-semibold hover:bg-gray-50" onClick={() => onNavigate("funds")}>
              Give to a College Fund
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
            <Pill tone="emerald">Nonprofit + Direct</Pill>
            <Pill tone="slate">Verified Statements</Pill>
            <Pill tone="slate">Transparent Progress</Pill>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border">
          <h3 className="font-semibold text-gray-900">How Propel Works</h3>
          <ol className="mt-4 space-y-3 text-gray-700">
            <li><span className="font-medium">1) Students</span> create a verified profile with school, balance, and payment plan.</li>
            <li><span className="font-medium">2) Donors</span> choose a <span className="font-medium">College Fund (tax-deductible)</span> or give <span className="font-medium">Direct to a Student</span>.</li>
            <li><span className="font-medium">3) Propel</span> routes payments securely and updates progress in real-time.</li>
          </ol>
          <div className="mt-4 text-xs text-gray-500">*Tax-deductible gifts are processed by Propel Foundation. Direct gifts are processed by Propel Direct and are not tax-deductible.</div>
        </div>
      </div>
    </div>
  );
}

function StudentCard({ s, onDonate, onOpen }) {
  const paid = s.totalBalance - s.remainingBalance;
  const pct = Math.min(100, Math.round((paid / s.totalBalance) * 100));
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{s.school}</div>
          <div className="font-semibold text-gray-900">{s.name}</div>
          <div className="text-sm text-gray-600">{s.major}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Remaining</div>
          <div className="font-semibold">{currency(s.remainingBalance)}</div>
          <div className="text-xs text-gray-500">{s.paymentsRemaining} payments left</div>
        </div>
      </div>
      <ProgressBar value={s.remainingBalance} total={s.totalBalance} />
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">Raised: {currency(paid)} ({pct}%)</div>
        <div className="text-gray-500">Stmt: {s.statementMonth}</div>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold" onClick={() => onDonate(s)}>Donate</button>
        <button className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50" onClick={() => onOpen(s)}>View</button>
      </div>
    </div>
  );
}

function StudentsPage({ data, onDonate, onOpen }) {
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState("All");

  const schools = useMemo(() => ["All", ...Array.from(new Set(data.map(d => d.school)))], [data]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      const matchSchool = school === "All" || d.school === school;
      const q = query.trim().toLowerCase();
      const matchQuery = !q || d.name.toLowerCase().includes(q) || d.school.toLowerCase().includes(q) || d.major.toLowerCase().includes(q);
      return matchSchool && matchQuery;
    })
  }, [data, query, school]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Students</h2>
          <p className="text-gray-600">Browse verified profiles and help pay down balances.</p>
        </div>
        <div className="flex gap-3">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search name, major, school…" className="px-3 py-2 rounded-xl border w-64" />
          <select value={school} onChange={(e)=>setSchool(e.target.value)} className="px-3 py-2 rounded-xl border">
            {schools.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filtered.map(s => (
          <StudentCard key={s.id} s={s} onDonate={onDonate} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function StudentDetail({ s, onBack, onDonate }) {
  const paid = s.totalBalance - s.remainingBalance;
  const pct = Math.min(100, Math.round((paid / s.totalBalance) * 100));
  const grad = SCHOOL_COLORS[s.school] || "from-gray-100 to-gray-50";
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button className="text-sm text-gray-600 hover:underline" onClick={onBack}>← Back to students</button>
      <div className="mt-4 bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className={"p-6 bg-gradient-to-br " + grad}>
          <div className="text-sm text-gray-600">{s.school}</div>
          <h3 className="text-2xl font-semibold text-gray-900">{s.name}</h3>
          <div className="text-gray-700">{s.major}</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Stat label="Total Balance" value={currency(s.totalBalance)} />
            <Stat label="Remaining" value={currency(s.remainingBalance)} />
            <Stat label="Payments Left" value={`${s.paymentsRemaining}`} />
          </div>
          <ProgressBar value={s.remainingBalance} total={s.totalBalance} />
          <div className="text-sm text-gray-600">Raised: {currency(paid)} ({pct}%) • Statement: {s.statementMonth}</div>
          <div className="flex gap-3 pt-2">
            <button className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold" onClick={() => onDonate(s)}>Donate to {s.name.split(" ")[0]}</button>
            <button className="px-5 py-3 rounded-xl border font-semibold">View Latest Statement</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border p-4 bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function FundsPage({ data, onDonateFund }) {
  const bySchool = useMemo(() => {
    const map = new Map();
    data.forEach((s) => {
      const rec = map.get(s.school) || { school: s.school, total: 0, remaining: 0, students: 0 };
      rec.total += s.totalBalance;
      rec.remaining += s.remainingBalance;
      rec.students += 1;
      map.set(s.school, rec);
    });
    return Array.from(map.values()).sort((a,b)=> a.school.localeCompare(b.school));
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold tracking-tight">College Funds</h2>
      <p className="text-gray-600">Tax-deductible gifts via Propel Foundation are routed to qualified students by each school’s fund committee.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {bySchool.map((f) => {
          const paid = f.total - f.remaining;
          const pct = Math.min(100, Math.round((paid / f.total) * 100));
          const grad = SCHOOL_COLORS[f.school] || "from-gray-100 to-gray-50";
          return (
            <div key={f.school} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className={"p-5 bg-gradient-to-br " + grad}>
                <div className="text-sm text-gray-600">College Fund</div>
                <div className="text-lg font-semibold text-gray-900">{f.school}</div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">Raised: {currency(paid)} ({pct}%)</div>
                  <div className="text-gray-600">Students: {f.students}</div>
                </div>
                <ProgressBar value={f.remaining} total={f.total} />
                <div className="flex gap-2 pt-2">
                  <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold" onClick={() => onDonateFund(f.school)}>Donate (Tax-deductible)</button>
                  <button className="px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-gray-50" onClick={() => onDonateFund(f.school, true)}>View Students</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">About Propel</h2>
      <p className="mt-3 text-gray-700 leading-7">
        Propel is a hybrid model: <span className="font-medium">Propel Foundation</span> powers tax-deductible college funds
        with objective, needs-based selection. <span className="font-medium">Propel Direct</span> enables donors to support
        specific students transparently. One brand, two compliant rails.
      </p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-5 bg-gray-50">
          <div className="text-xs text-gray-500">Governance</div>
          <div className="font-semibold mt-1">Independent board & clear criteria</div>
        </div>
        <div className="rounded-2xl border p-5 bg-gray-50">
          <div className="text-xs text-gray-500">Security</div>
          <div className="font-semibold mt-1">Verified statements & audit trails</div>
        </div>
        <div className="rounded-2xl border p-5 bg-gray-50">
          <div className="text-xs text-gray-500">Transparency</div>
          <div className="font-semibold mt-1">Real-time progress tracking</div>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-500">
        *This is a demonstration product experience for investors and partners.
      </div>
    </div>
  );
}

function DonateModal({ open, onClose, student, school, onDonateConfirm }) {
  const [amount, setAmount] = useState(100);
  const [mode, setMode] = useState("tax"); // tax = nonprofit fund, direct = direct student

  if (!open) return null;

  const title = student ? `Donate to ${student.name}` : `Donate to ${school} Fund`;
  const isTax = mode === "tax";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="text-sm text-gray-700 font-medium mb-2">Choose how you want to give</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={()=>setMode("tax")} className={classNames("px-4 py-3 rounded-xl border text-sm font-semibold", isTax ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50")}>Tax-deductible (Foundation)</button>
              <button onClick={()=>setMode("direct")} className={classNames("px-4 py-3 rounded-xl border text-sm font-semibold", !isTax ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50")}>Direct to Student</button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {isTax ? "Processed by Propel Foundation; funds allocated to qualified students at this school." : "Processed by Propel Direct; not tax-deductible; paid toward this student's balance."}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-700 font-medium mb-1">Amount</div>
            <div className="flex gap-2">
              {[50,100,250,500].map(v => (
                <button key={v} onClick={()=>setAmount(v)} className={classNames("px-3 py-2 rounded-xl border text-sm", amount===v?"bg-gray-900 text-white border-gray-900":"hover:bg-gray-50")}>{currency(v)}</button>
              ))}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">Custom</span>
                <input type="number" value={amount} onChange={e=>setAmount(parseInt(e.target.value||"0",10))} className="w-28 px-3 py-2 rounded-xl border" />
              </div>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">*Demo only. No real payment will be processed.</div>
            <button className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold" onClick={()=> onDonateConfirm({ amount, mode, student, school })}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-gray-900">Propel</div>
          <div>Building a solid path to a debt‑free future.</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">Model</div>
          <div className="mt-2">Propel Foundation (501(c)(3)) • Propel Direct, Inc.</div>
          <div className="text-xs">For demo purposes only.</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">Contact</div>
          <div className="mt-2">investors@propel.org</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState("home");
  const [students, setStudents] = useState(SAMPLE_STUDENTS);
  const [selected, setSelected] = useState(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateContext, setDonateContext] = useState({ student: null, school: null });

  function handleDonateToStudent(s) {
    setDonateContext({ student: s, school: null });
    setDonateOpen(true);
  }
  function handleOpenStudent(s) {
    setSelected(s);
    setRoute("student");
  }
  function handleDonateFund(school, viewStudents=false) {
    if (viewStudents) {
      const first = students.find(x => x.school === school);
      if (first) { setRoute("students"); }
      return;
    }
    setDonateContext({ student: null, school });
    setDonateOpen(true);
  }
  function applyDonation({ amount, mode, student, school }) {
    if (student) {
      setStudents(prev => prev.map(p => p.id === student.id ? { ...p, remainingBalance: Math.max(0, p.remainingBalance - amount) } : p));
      const updated = students.find(p => p.id === student.id);
      setSelected(updated ? { ...updated, remainingBalance: Math.max(0, updated.remainingBalance - amount) } : student);
    } else if (school) {
      const schoolStudents = students.filter(p => p.school === school);
      const totalRemaining = schoolStudents.reduce((sum, p) => sum + p.remainingBalance, 0);
      setStudents(prev => prev.map(p => {
        if (p.school !== school || totalRemaining === 0) return p;
        const share = Math.round((p.remainingBalance / totalRemaining) * amount);
        return { ...p, remainingBalance: Math.max(0, p.remainingBalance - share) };
      }));
    }
    setDonateOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopNav onNavigate={setRoute} route={route} />
      {route === "home" && (<>
        <Hero onNavigate={setRoute} />
        <div className="max-w-6xl mx-auto px-4">
          <section className="my-10 grid md:grid-cols-3 gap-5">
            {[{t:"Trusted",d:"Clear governance, audited flows."},{t:"Compliant",d:"Two rails: tax-deductible & direct."},{t:"Scalable",d:"Built like a modern fintech."}].map((x,i)=> (
              <div key={i} className="bg-white rounded-2xl border p-6 shadow-sm">
                <div className="text-xs text-gray-500">{x.t}</div>
                <div className="font-semibold mt-1">{x.d}</div>
              </div>
            ))}
          </section>
        </div>
      </>)}
      {route === "students" && (
        <StudentsPage data={students} onDonate={handleDonateToStudent} onOpen={handleOpenStudent} />
      )}
      {route === "student" && selected && (
        <StudentDetail s={selected} onBack={()=>setRoute("students")} onDonate={handleDonateToStudent} />
      )}
      {route === "funds" && (
        <FundsPage data={students} onDonateFund={handleDonateFund} />
      )}
      {route === "about" && (
        <AboutPage />
      )}
      {route === "donate" && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold tracking-tight">Donate</h2>
          <p className="mt-3 text-gray-700">Choose a college fund for a tax-deductible gift, or support a specific student directly.</p>
          <div className="mt-6 flex gap-3">
            <button className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold" onClick={()=>setRoute("funds")}>Give to a College Fund</button>
            <button className="px-5 py-3 rounded-xl border font-semibold" onClick={()=>setRoute("students")}>Support a Student</button>
          </div>
        </div>
      )}

      <Footer />

      <DonateModal
        open={donateOpen}
        onClose={()=>setDonateOpen(false)}
        student={donateContext.student}
        school={donateContext.school}
        onDonateConfirm={applyDonation}
      />
    </div>
  );
}

export default function Page() {
  return <App />;
}
