'use client'
import React, { useMemo, useState } from "react";

// Propel MVP – single-file React demo
// Added: Student Apply flow + richer profiles (story, job, aspirations) + Need Score (Debt/Income)
// NEW: Upload verification (PDF/Image) during application + in-profile viewer modal

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
    employer: "StartUp Co.",
    jobTitle: "Frontend Engineer",
    salary: 82000,
    story: "First‑gen college grad from upstate NY. Scholarships covered tuition gaps, but living costs drove loans. Mentors peers in CS club.",
    aspirations: "Launch a mentorship program for women in tech and pay it forward at Colgate.",
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
    employer: "Community Bank",
    jobTitle: "Credit Analyst",
    salary: 64000,
    story: "Raised by a single parent, worked two campus jobs. Focused on financial inclusion research.",
    aspirations: "Earn a CFA and build products for underserved borrowers.",
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
    employer: "City of LA",
    jobTitle: "Policy Fellow",
    salary: 52000,
    story: "Interned in city gov during wildfires; passionate about climate resilience and housing.",
    aspirations: "Run a nonprofit focused on climate adaptation for low‑income neighborhoods.",
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
    employer: "UM Health",
    jobTitle: "RN (Pediatrics)",
    salary: 76000,
    story: "Volunteered in pediatric oncology; took extra shifts through the pandemic.",
    aspirations: "Become a nurse practitioner and expand pediatric care access in rural areas.",
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
    employer: "CleanWind Inc.",
    jobTitle: "Design Engineer",
    salary: 88000,
    story: "Built low‑cost turbines in senior design; family supports younger siblings.",
    aspirations: "File a patent for modular micro‑turbines for schools and clinics.",
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
    employer: "Nonprofit Collective",
    jobTitle: "Program Coordinator",
    salary: 51000,
    story: "First‑gen US citizen; led campus food security initiative.",
    aspirations: "Grow into program management and start a food systems nonprofit.",
  },
];

const SCHOOL_COLORS = {
  "Colgate University": "from-rose-100 to-rose-50",
  UCLA: "from-blue-100 to-blue-50",
  "University of Michigan": "from-yellow-100 to-yellow-50",
  "Columbia University": "from-sky-100 to-sky-50",
};

function currency(n) { return n.toLocaleString(undefined, { style: "currency", currency: "USD" }); }

function needScore({ remainingBalance, salary, paymentsRemaining }) {
  // Debt-to-Income as core signal; normalized to 0–100 where higher = higher need
  const dti = salary > 0 ? remainingBalance / salary : 2; // cap effect if salary missing
  const dtiScore = Math.max(0, Math.min(100, Math.round((dti / 2) * 100))); // dti 0..2 → 0..100
  const termBoost = Math.min(20, Math.floor(paymentsRemaining / 6)); // up to +20 for long runway
  return Math.max(0, Math.min(100, dtiScore + termBoost));
}

function ProgressBar({ value, total }) {
  const pct = Math.min(100, Math.round(((total - value) / total) * 100));
  return (
    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
      <div className="h-3 bg-emerald-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function ScoreBar({ score }) {
  return (
    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden" title={`Need Score: ${score}`}>
      <div className="h-2.5 bg-orange-500" style={{ width: `${score}%` }} />
    </div>
  );
}

function Pill({ children, tone = "slate" }) {
  const toneMap = {
    slate: "bg-slate-100 text-slate-800",
    emerald: "bg-emerald-100 text-emerald-800",
    orange: "bg-orange-100 text-orange-800",
  };
  return (
    <span className={classNames("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", toneMap[tone] || toneMap.slate)}>{children}</span>
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
            { id: "apply", label: "Apply" },
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
            Propel unites <span className="font-medium">tax-deductible college funds</span> with
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
            <li><span className="font-medium">1) Students</span> apply with school, balance, and plan; share their story and aspirations.</li>
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
  const score = needScore(s);
  const hasVer = !!(s.verification && s.verification.name);
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-gray-500">{s.school}</div>
          <div className="font-semibold text-gray-900 flex items-center gap-2">{s.name} {hasVer && <Pill tone="emerald">Verification on file</Pill>}</div>
          <div className="text-sm text-gray-600">{s.major}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Remaining</div>
          <div className="font-semibold">{currency(s.remainingBalance)}</div>
          <div className="text-xs text-gray-500">{s.paymentsRemaining} payments left</div>
        </div>
      </div>
      <ScoreBar score={score} />
      <div className="flex items-center justify-between text-xs">
        <div className="text-gray-600">Need Score: <span className="font-medium">{score}</span>/100</div>
        <div className="text-gray-500">Stmt: {s.statementMonth}</div>
      </div>
      <ProgressBar value={s.remainingBalance} total={s.totalBalance} />
      <div className="text-sm text-gray-600 line-clamp-2">{s.story}</div>
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
  const [minScore, setMinScore] = useState(0);

  const schools = useMemo(() => ["All", ...Array.from(new Set(data.map(d => d.school)))], [data]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      const matchSchool = school === "All" || d.school === school;
      const q = query.trim().toLowerCase();
      const matchQuery = !q || d.name.toLowerCase().includes(q) || d.school.toLowerCase().includes(q) || d.major.toLowerCase().includes(q) || (d.story||"").toLowerCase().includes(q);
      const scoreOk = needScore(d) >= minScore;
      return matchSchool && matchQuery && scoreOk;
    })
  }, [data, query, school, minScore]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Students</h2>
          <p className="text-gray-600">Browse verified profiles and help pay down balances.</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search name, major, story…" className="px-3 py-2 rounded-xl border w-64" />
          <select value={school} onChange={(e)=>setSchool(e.target.value)} className="px-3 py-2 rounded-xl border">
            {schools.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Min Need</span>
            <input type="range" min={0} max={100} value={minScore} onChange={(e)=>setMinScore(parseInt(e.target.value,10))} />
            <span className="text-gray-800 w-10">{minScore}</span>
          </div>
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
  const score = needScore(s);
  const [docOpen, setDocOpen] = useState(false);
  const hasDoc = !!(s.verification && s.verification.dataUrl);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button className="text-sm text-gray-600 hover:underline" onClick={onBack}>← Back to students</button>
      <div className="mt-4 bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className={"p-6 bg-gradient-to-br " + grad}>
          <div className="text-sm text-gray-600">{s.school}</div>
          <h3 className="text-2xl font-semibold text-gray-900">{s.name}</h3>
          <div className="text-gray-700">{s.major}</div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Stat label="Total Balance" value={currency(s.totalBalance)} />
            <Stat label="Remaining" value={currency(s.remainingBalance)} />
            <Stat label="Payments Left" value={`${s.paymentsRemaining}`} />
            <div className="rounded-xl border p-4 bg-gray-50">
              <div className="text-xs text-gray-500">Need Score</div>
              <div className="text-lg font-semibold text-gray-900">{score}/100</div>
              <div className="mt-2"><ScoreBar score={score} /></div>
            </div>
          </div>
          <ProgressBar value={s.remainingBalance} total={s.totalBalance} />
          <div className="text-sm text-gray-600 flex items-center gap-3 flex-wrap">
            <span>Raised: {currency(paid)} ({pct}%) • Statement: {s.statementMonth}</span>
            {hasDoc && <Pill tone="emerald">Verification on file: {s.verification.name}</Pill>}
          </div>

          <section className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 rounded-2xl border p-5 bg-gray-50">
              <div className="text-sm font-semibold text-gray-900 mb-2">Story</div>
              <p className="text-gray-700 leading-7">{s.story}</p>
            </div>
            <div className="rounded-2xl border p-5 bg-gray-50 space-y-2">
              <div className="text-sm font-semibold text-gray-900">Current Job</div>
              <div className="text-gray-700"><span className="font-medium">{s.jobTitle}</span> at {s.employer}</div>
              <div className="text-gray-700">Salary: {s.salary ? currency(s.salary) : "—"}</div>
              <div className="pt-2 text-sm font-semibold text-gray-900">Aspirations</div>
              <div className="text-gray-700">{s.aspirations}</div>
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <button className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold" onClick={() => onDonate(s)}>Donate to {s.name.split(" ")[0]}</button>
            <button className="px-5 py-3 rounded-xl border font-semibold">View Latest Statement</button>
            {hasDoc && (
              <button className="px-5 py-3 rounded-xl border font-semibold" onClick={()=>setDocOpen(true)}>
                View Uploaded Verification
              </button>
            )}
          </div>
        </div>
      </div>
      <DocumentModal open={docOpen} onClose={()=>setDocOpen(false)} doc={s.verification} />
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

function ApplyPage({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    school: "Colgate University",
    major: "",
    totalBalance: "",
    remainingBalance: "",
    paymentsRemaining: "",
    salary: "",
    employer: "",
    jobTitle: "",
    story: "",
    aspirations: "",
    consent: false,
    verificationFile: null,
    verificationName: "",
    verificationDataUrl: "",
    verificationMime: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function update(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  function onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) { alert("File too large (max 10MB)"); return; }
    const ok = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]; 
    if (!ok.includes(file.type)) { alert("Please upload a PDF or image (PNG/JPG)"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      update("verificationFile", file);
      update("verificationName", file.name);
      update("verificationDataUrl", reader.result);
      update("verificationMime", file.type);
    };
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.school || !form.remainingBalance) return;
    // In a real app, the file would be uploaded to storage and we would store a URL.
    const student = {
      id: "s" + Math.random().toString(36).slice(2,8),
      name: form.name,
      school: form.school,
      major: form.major || "",
      totalBalance: parseInt(form.totalBalance || form.remainingBalance || 0, 10),
      remainingBalance: parseInt(form.remainingBalance || 0, 10),
      paymentsRemaining: parseInt(form.paymentsRemaining || 0, 10),
      statementMonth: "Aug 2025",
      taxEligible: true,
      employer: form.employer || "—",
      jobTitle: form.jobTitle || "—",
      salary: parseInt(form.salary || 0, 10),
      story: form.story,
      aspirations: form.aspirations,
      pending: true,
      verification: form.verificationDataUrl ? {
        name: form.verificationName,
        mime: form.verificationMime,
        dataUrl: form.verificationDataUrl,
      } : null,
    };
    onSubmit(student);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="text-2xl font-semibold">Application received ✅</div>
        <p className="mt-3 text-gray-700">Thanks for applying to Propel. Our team will review and verify your information. You’ll receive an email update soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold tracking-tight">Apply to Propel</h2>
      <p className="text-gray-600">Tell us about yourself. Upload a recent **loan statement** or other **verification** (PDF or image). Verified profiles may appear publicly once approved.</p>
      <form className="mt-6 space-y-6" onSubmit={submit}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <input className="w-full px-3 py-2 rounded-xl border" value={form.name} onChange={e=>update("name", e.target.value)} />
          </Field>
          <Field label="Email" required>
            <input type="email" className="w-full px-3 py-2 rounded-xl border" value={form.email} onChange={e=>update("email", e.target.value)} />
          </Field>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="School" required>
            <input className="w-full px-3 py-2 rounded-xl border" value={form.school} onChange={e=>update("school", e.target.value)} />
          </Field>
          <Field label="Major">
            <input className="w-full px-3 py-2 rounded-xl border" value={form.major} onChange={e=>update("major", e.target.value)} />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Remaining Balance (USD)" required>
            <input type="number" className="w-full px-3 py-2 rounded-xl border" value={form.remainingBalance} onChange={e=>update("remainingBalance", e.target.value)} />
          </Field>
          <Field label="Total Balance (USD)">
            <input type="number" className="w-full px-3 py-2 rounded-xl border" value={form.totalBalance} onChange={e=>update("totalBalance", e.target.value)} />
          </Field>
          <Field label="Payments Remaining">
            <input type="number" className="w-full px-3 py-2 rounded-xl border" value={form.paymentsRemaining} onChange={e=>update("paymentsRemaining", e.target.value)} />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Current Employer">
            <input className="w-full px-3 py-2 rounded-xl border" value={form.employer} onChange={e=>update("employer", e.target.value)} />
          </Field>
          <Field label="Job Title">
            <input className="w-full px-3 py-2 rounded-xl border" value={form.jobTitle} onChange={e=>update("jobTitle", e.target.value)} />
          </Field>
          <Field label="Annual Salary (USD)">
            <input type="number" className="w-full px-3 py-2 rounded-xl border" value={form.salary} onChange={e=>update("salary", e.target.value)} />
          </Field>
        </div>

        <Field label="Upload Statement / Verification (PDF or PNG/JPG)">
          <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={onFileChange} className="block w-full text-sm" />
          {form.verificationName && (
            <div className="mt-2 text-xs text-gray-600">Selected: {form.verificationName}</div>
          )}
        </Field>

        <Field label="Your Story">
          <textarea rows={4} className="w-full px-3 py-2 rounded-xl border" value={form.story} onChange={e=>update("story", e.target.value)} />
        </Field>
        <Field label="Aspirations">
          <textarea rows={3} className="w-full px-3 py-2 rounded-xl border" value={form.aspirations} onChange={e=>update("aspirations", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.consent} onChange={e=>update("consent", e.target.checked)} />
          I consent to Propel reviewing this information and contacting me.
        </label>
        <div className="pt-2">
          <button disabled={!form.name || !form.email || !form.school || !form.remainingBalance || !form.consent} className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50">Submit Application</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</div>
      {children}
    </label>
  );
}

function DocumentModal({ open, onClose, doc }) {
  if (!open || !doc || !doc.dataUrl) return null;
  const isPdf = doc.mime === "application/pdf" || doc.dataUrl.startsWith("data:application/pdf");
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">{doc.name}</div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <div className="p-0 max-h-[80vh] overflow-auto">
          {isPdf ? (
            <object data={doc.dataUrl} type="application/pdf" className="w-full h-[75vh]">PDF preview unavailable. <a className="text-emerald-700 underline" href={doc.dataUrl} target="_blank" rel="noreferrer">Open</a></object>
          ) : (
            <img src={doc.dataUrl} alt={doc.name} className="w-full" />
          )}
        </div>
        <div className="p-4 border-t text-sm flex items-center justify-between">
          <span className="text-gray-600">For demo only. In production this would be stored securely and watermarked.</span>
          <a href={doc.dataUrl} download={doc.name} className="px-4 py-2 rounded-xl border font-semibold hover:bg-gray-50">Download</a>
        </div>
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
    if (viewStudents) { setRoute("students"); return; }
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

  function handleApplication(newStudent) {
    // In a real app this would be pending review; for the demo we'll append with a badge
    setStudents(prev => [newStudent, ...prev]);
    setRoute("students");
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
      {route === "apply" && (
        <ApplyPage onSubmit={handleApplication} />
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

