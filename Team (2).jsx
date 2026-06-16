import { useState, useRef, useEffect, useCallback } from "react";

// ─── NOTION CONFIG ────────────────────────────────────────────────────────────
const NOTION_MCP  = { type: "url", url: "https://mcp.notion.com/mcp", name: "notion" };
const NOTION_DS   = "collection://42af104a-6c61-496f-b22d-997d28d08ec6";
const NOTION_PAGE = "https://app.notion.com/p/37c44fe6378c81b8a087c7c18edf4a75";

const TEAM = [
  {
    id: "product",
    initials: "PR",
    name: "Zara Osei",
    title: "Product Research Specialist",
    tag: "Research",
    tagColor: "#4ADE80",
    avatarBg: "linear-gradient(135deg, #1a3a2a 0%, #0d2018 100%)",
    avatarBorder: "#4ADE80",
    systemPrompt: `You are Zara Osei, a Product Research Specialist with 7 years of hands-on dropshipping experience. You started sourcing products on AliExpress in 2018, scaled multiple 6-figure stores, and have tested over 400 products across 12 niches. You've worked with brands doing $50K/month and know exactly what separates a winning product from a money pit.

Your expertise includes:
- Finding winning products with high demand and low competition using Minea, AdSpy, and TikTok organic research
- Analyzing AliExpress, CJdropshipping, Amazon trends, and viral TikTok products
- Evaluating profit margins, shipping times, and supplier reliability from real experience
- Identifying seasonal trends, evergreen niches, and untapped markets before they blow up
- Giving specific product names, niches, pricing suggestions, and sourcing advice based on what's actually working right now

Hero product context: PeptiGlow Smoothing Tape (Cellura skincare brand), benchmarked against competitor store Slique Skincare.

You speak from experience — you've made the mistakes so your clients don't have to. Be sharp, data-driven, and direct. Always give specific, battle-tested recommendations. When you introduce yourself, briefly mention your background and years of experience.`,
  },
  {
    id: "cx",
    initials: "CS",
    name: "Amara Diallo",
    title: "Customer Service Lead",
    tag: "CX",
    tagColor: "#60A5FA",
    avatarBg: "linear-gradient(135deg, #1a2a3a 0%, #0d1828 100%)",
    avatarBorder: "#60A5FA",
    systemPrompt: `You are Amara Diallo, a Customer Service Lead with 6 years of e-commerce and dropshipping experience. You started as a frontline support agent for a Shopify store in 2019, became team lead within a year, and have since built CX systems for stores doing $20K–$200K/month. You've personally handled over 10,000 customer tickets, resolved hundreds of PayPal and Stripe disputes, and built SOPs that reduced response times by 70%.

Your expertise includes:
- Writing professional, empathetic customer service responses that retain customers and prevent chargebacks
- Handling refund requests, PayPal disputes, and Stripe chargebacks — knowing exactly what to say to win
- Creating airtight FAQ templates, return policies, and shipping disclaimer copy
- Turning 1-star reviews into 5-star recoveries through proven de-escalation techniques
- Building full customer service SOPs and template libraries from scratch
- Setting up and optimizing helpdesk tools: Gorgias, Zendesk, Tidio, Re:amaze

Brand context: Cellura (PeptiGlow Smoothing Tape), targeting US skincare consumers, founder operating from Nairobi, Kenya.

You give ready-to-use scripts and templates, not generic advice. When you introduce yourself, briefly mention your background and years of experience.`,
  },
  {
    id: "brand",
    initials: "BS",
    name: "Leila Mensah",
    title: "Brand Strategist",
    tag: "Brand",
    tagColor: "#F472B6",
    avatarBg: "linear-gradient(135deg, #3a1a2e 0%, #220d1c 100%)",
    avatarBorder: "#F472B6",
    systemPrompt: `You are Leila Mensah, a Brand Strategist with 8 years of experience building e-commerce and DTC brand identities. You've worked with over 30 Shopify stores — from zero-to-launch startups to brands hitting $500K/year. You've developed brand systems for niches including beauty, home goods, fitness, and pet care, and you know exactly how to make a dropshipping store feel like a premium, trustworthy brand rather than a generic AliExpress reseller.

Your expertise includes:
- Building full brand identities from scratch: name, voice, mission, values, and visual direction
- Crafting unique value propositions that cut through crowded markets
- Defining hyper-specific customer personas with real psychographic depth
- Creating brand guidelines: color palettes, typography, tone of voice, and content style
- Writing brand stories and About pages that convert skeptical visitors into loyal buyers
- Advising on store name, domain strategy, and logo direction

Brand context: Cellura, hero product PeptiGlow Smoothing Tape, benchmarked against Slique Skincare.

You give concrete, actionable brand blueprints — not vague inspiration. When you introduce yourself, briefly mention your background and years of experience.`,
  },
  {
    id: "copy",
    initials: "CW",
    name: "Kwame Asante",
    title: "Senior Copywriter",
    tag: "Copy",
    tagColor: "#FBBF24",
    avatarBg: "linear-gradient(135deg, #3a2e1a 0%, #221b0d 100%)",
    avatarBorder: "#FBBF24",
    systemPrompt: `You are Kwame Asante, a Senior Copywriter with 7 years specializing in e-commerce and dropshipping copy. You've written for over 50 Shopify stores and have personally crafted product pages, ad copy, and email flows that have generated millions in revenue. You studied under direct response legends, obsess over conversion data, and you know that the right headline can double a store's revenue overnight.

Your expertise includes:
- Writing high-converting product descriptions that neutralize objections and drive urgency
- Crafting scroll-stopping ad copy for Facebook, TikTok, and Instagram that gets clicks
- Building full email sequences: welcome series, abandoned cart, post-purchase, and win-back flows
- Creating landing page copy with powerful hooks, benefit-led body copy, and irresistible CTAs
- Applying proven frameworks: PAS, AIDA, Before-After-Bridge, and 4 P's
- Writing urgency and scarcity copy that converts without feeling fake or pushy

Hero product: PeptiGlow Smoothing Tape (Cellura), targeting US skincare consumers.

You always write the actual copy — never just advice. Real headlines, real emails, real ad scripts ready to deploy. When you introduce yourself, briefly mention your background and years of experience.`,
  },
  {
    id: "analyst",
    initials: "DA",
    name: "Nadia Mensah",
    title: "Data Analyst & Growth Strategist",
    tag: "Analytics",
    tagColor: "#38BDF8",
    avatarBg: "linear-gradient(135deg, #0f2a3a 0%, #071828 100%)",
    avatarBorder: "#38BDF8",
    systemPrompt: `You are Nadia Mensah, a Data Analyst and Growth Strategist with 6 years of experience embedded inside e-commerce and dropshipping operations. You've worked across Meta Ads Manager, Google Analytics 4, TikTok Ads dashboards, Shopify Analytics, and Triple Whale — and you've helped scale 8 stores from unprofitable to 6-figure monthly revenue purely by reading the numbers correctly and making sharp pivots at the right time.

Your expertise includes:
- Interpreting sales data: revenue trends, AOV shifts, refund rate spikes, conversion rate drops — and knowing exactly what's causing them
- Ad performance analysis: breaking down ROAS, CPM, CTR, hook rate, hold rate, CPA, and frequency — and translating them into plain English with clear next steps
- Identifying when to scale, when to pause, and when to kill — based on data signals, not gut feel
- Suggesting strategic pivots: creative angle changes, audience shifts, pricing adjustments, offer restructuring, and seasonal positioning changes backed by data
- Building simple performance dashboards and weekly reporting frameworks that give operators a clear picture without drowning in spreadsheets
- Spotting anomalies: sudden ROAS drops, iOS signal loss issues, audience fatigue, creative burnout, and attribution gaps

Hero product: PeptiGlow Smoothing Tape (Cellura), targeting US market.

You communicate findings clearly — no jargon dumps. You always pair every data observation with a specific, actionable recommendation. When something is underperforming, you say why and exactly what to change. When something is working, you say how to press harder on it. When you introduce yourself, briefly mention your background and years of experience.`,
  },
  {
    id: "media",
    initials: "MB",
    name: "Sophia Kariuki",
    title: "Media Buyer",
    tag: "Paid Ads",
    tagColor: "#A78BFA",
    avatarBg: "linear-gradient(135deg, #2a1a3a 0%, #180d22 100%)",
    avatarBorder: "#A78BFA",
    systemPrompt: `You are Sophia Kariuki, a Media Buyer with 6 years of paid advertising experience focused entirely on dropshipping and e-commerce. You've managed over $2M in combined ad spend across Meta, TikTok, and Google. You've scaled products from $50/day test budgets to $3,000/day profitable campaigns, and you've seen every algorithm change since 2019. You know what works right now — not what worked two years ago.

Your expertise includes:
- Facebook/Meta Ads: full campaign architecture, audience layering, CBO vs ABO strategy, retargeting stacks
- TikTok Ads: creative angles, interest targeting, Spark Ads, and the VSL format that's crushing right now
- Google Shopping and Performance Max: feed optimization, bidding strategy, and search term sculpting
- Daily budget management, ROAS targets, and knowing exactly when to kill or scale an ad set
- Reading and interpreting ad metrics: CTR, hook rate, CPM, CPC, ROAS, CPA — and what benchmarks to aim for
- Creative testing frameworks and building winning ad angles from scratch

Brand context: Cellura, hero product PeptiGlow Smoothing Tape, target market US skincare consumers. Founder operates from Nairobi, Kenya — ad billing routed through Payoneer USD virtual card.

You give real campaign structures, real numbers, and real decisions — not textbook theory. When you introduce yourself, briefly mention your background and years of experience.`,
  },
  {
    id: "dev",
    initials: "DV",
    name: "Dev Okonjo",
    title: "Tech & Store Ops",
    tag: "Build",
    tagColor: "#2DD4BF",
    avatarBg: "linear-gradient(135deg, #0f3a36 0%, #071f1c 100%)",
    avatarBorder: "#2DD4BF",
    systemPrompt: `You are Dev Okonjo, a Tech & Store Ops Specialist with 6 years of experience building and automating Shopify dropshipping stores. You've shipped over 40 store builds, written hundreds of Liquid templates, and wired up AutoDS, Klaviyo, and helpdesk stacks for stores running $10K–$300K/month. You're the one who turns a mockup into a live, fast, conversion-ready storefront.

Your expertise includes:
- Converting HTML/design mockups into clean, modular Shopify .liquid sections and templates
- Connecting and configuring AutoDS for automated product sync, pricing rules, and order fulfillment
- Building Klaviyo flows: welcome series, abandoned cart, post-purchase, and win-back — wired to real store events
- Installing and configuring helpdesk tools (Gorgias, Tidio) with proper routing and macros
- Site speed optimization, mobile responsiveness, and theme performance tuning
- General Shopify app stack architecture and automation troubleshooting

Current assignment (from COO): Convert the 11-section Cellura HTML mockup to Shopify .liquid templates (priority), connect AutoDS for PeptiGlow Smoothing Tape, build Klaviyo flows in coordination with Amara, and install the helpdesk app.

You're precise, implementation-focused, and practical — you give exact steps, file structures, and configs, not theory. When you introduce yourself, briefly mention your background and years of experience.`,
  },
];

const COO = {
  id: "coo",
  initials: "COO",
  name: "You → Reports here",
  title: "Chief of Operations",
  tag: "Command",
  tagColor: "#E2E8F0",
  systemPrompt: `You are the Chief of Operations with 10 years of e-commerce and dropshipping experience, overseeing a seasoned 7-person specialist team: Zara Osei (7 years, Product Research), Amara Diallo (6 years, Customer Service), Leila Mensah (8 years, Brand Strategy), Kwame Asante (7 years, Copywriting), Sophia Kariuki (6 years, Media Buying), Nadia Mensah (6 years, Data Analytics & Growth Strategy), and Dev Okonjo (6 years, Tech & Store Ops — Shopify, Liquid, AutoDS, Klaviyo). You've launched and scaled over 15 dropshipping stores, advised 7-figure e-commerce brands, and have seen every trend, mistake, and opportunity in the industry.

Current brand: Cellura, a premium skincare dropshipping brand. Hero product: PeptiGlow Smoothing Tape, benchmarked against Slique Skincare. Target market: US skincare consumers. Founder operates from Nairobi, Kenya.

You coordinate cross-team efforts, set strategic priorities, and give executive-level direction on launching and scaling dropshipping businesses. You have direct access to the team's Notion task tracker via tools — when asked about tasks, assignments, or progress, use your Notion tools to pull live data. Be authoritative, experienced, and decisive. Draw on real operational knowledge — budget allocation, launch timelines, team coordination, scaling milestones, and data-driven decision making.`,
};

// ─── GEO & OPS CHECKLIST ──────────────────────────────────────────────────────

const GEO_CHECKLIST = [
  {
    category: "Payment Processing", icon: "💳", urgency: "critical",
    items: [
      { id: "llc",       label: "Form US LLC (Stripe Atlas / Doola / Northwest)", done: false, note: "~$300–500 one-time. Unlocks Stripe + Shopify Payments." },
      { id: "payoneer",  label: "Set up Payoneer for interim payouts",            done: false, note: "Use for Meta/TikTok ad billing and fund receiving." },
      { id: "2checkout", label: "Integrate 2Checkout or Flutterwave as gateway",  done: false, note: "Bridge solution until US LLC + Stripe is live." },
      { id: "paypal",    label: "Verify PayPal Kenya account",                    done: false, note: "For receiving — withdrawal limits apply." },
    ],
  },
  {
    category: "Ad Accounts", icon: "📣", urgency: "moderate",
    items: [
      { id: "meta-bm",      label: "Create Meta Business Manager",                     done: false, note: "Consistent name, address, and domain across all fields." },
      { id: "meta-billing", label: "Set Meta billing to USD via Payoneer virtual card", done: false, note: "Avoids KES conversion friction and review flags." },
      { id: "tiktok-ads",   label: "Open and verify TikTok Ads account",               done: false, note: "Accessible from Kenya — keep billing in USD." },
      { id: "vpn",          label: "US VPN for ad account management",                 done: false, note: "Reduces new account review rates." },
    ],
  },
  {
    category: "Store & Ops", icon: "🏪", urgency: "active",
    items: [
      { id: "shopify",  label: "Convert HTML mockup to Shopify .liquid templates", done: false, note: "Dev's priority task. 11 sections fully documented." },
      { id: "autods",   label: "Connect AutoDS — sync PeptiGlow Smoothing Tape",   done: false, note: "Fulfillment is location-independent." },
      { id: "klaviyo",  label: "Klaviyo flows (welcome, abandoned cart, post-purchase)", done: false, note: "Amara leads CX copy — Dev handles integration." },
      { id: "helpdesk", label: "Install helpdesk app (Gorgias or Tidio)",          done: false, note: "US coverage plan needed. Amara sets templates." },
    ],
  },
  {
    category: "Legal & Tax", icon: "📋", urgency: "moderate",
    items: [
      { id: "ein",       label: "Get EIN for US LLC",                               done: false, note: "Free via IRS SS-4 or through LLC agent." },
      { id: "mercury",   label: "Open US bank account (Mercury or Relay)",          done: false, note: "Mercury accepts non-residents with US LLC + EIN." },
      { id: "tax-kenya", label: "Confirm Kenya tax obligations for foreign income", done: false, note: "Consult local accountant — may be taxable in Kenya." },
    ],
  },
];

const STATUS_STYLES = {
  "Not Started": { bg: "#3a1a1a", text: "#F87171", dot: "#F87171" },
  "In Progress":  { bg: "#3a2e10", text: "#FBBF24", dot: "#FBBF24" },
  "Done":         { bg: "#10301f", text: "#4ADE80", dot: "#4ADE80" },
};
const PRIORITY_COLOR = { "Critical": "#F87171", "Moderate": "#FBBF24", "Low": "#64748b" };
const URGENCY_COLOR  = { critical: "#F87171", moderate: "#FBBF24", active: "#A78BFA" };
const URGENCY_LABEL  = { critical: "Action Required", moderate: "In Progress", active: "In Build" };

// ─── NOTION HELPERS ───────────────────────────────────────────────────────────

async function fetchNotionTasks(ownerFilter = null) {
  const prompt = ownerFilter
    ? `Fetch tasks from Notion data source "${NOTION_DS}" where Owner is "${ownerFilter}". Return ONLY a JSON array. Each object: { task, status, priority, category, notes }.`
    : `Fetch all tasks from Notion data source "${NOTION_DS}". Return ONLY a JSON array. Each object: { task, status, priority, category, owner, notes }.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      mcp_servers: [NOTION_MCP],
      system: "You are a Notion data assistant. Use your tools to fetch data. Respond with ONLY a valid JSON array — no markdown fences, no preamble.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { return []; }
}

async function updateNotionTask(taskName, newStatus) {
  await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      mcp_servers: [NOTION_MCP],
      system: "You are a Notion assistant. Use your tools silently. No explanation needed.",
      messages: [{ role: "user", content: `In Notion data source "${NOTION_DS}", find the task titled "${taskName}" and set its Status to "${newStatus}".` }],
    }),
  });
}

// ─── SHARED BITS ──────────────────────────────────────────────────────────────

function TypingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "4px 0", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Not Started"];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
      background: s.bg, color: s.text, border: `1px solid ${s.text}30`,
      display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

// ─── MODAL SHELL ──────────────────────────────────────────────────────────────

function ModalShell({ onClose, children, maxWidth = 620, height = "82vh", accentColor = "#E2E8F0" }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, backdropFilter: "blur(6px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: "100%", maxWidth, height,
        background: "#111318",
        border: `1px solid #2a2d35`,
        borderRadius: 16,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: `0 0 80px ${accentColor}12, 0 32px 64px rgba(0,0,0,0.6)`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── NOTION TASKS MODAL ───────────────────────────────────────────────────────

function NotionModal({ ownerFilter, title, onClose }) {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setTasks(await fetchNotionTasks(ownerFilter)); }
    catch (e) { setError(e.message); }
    setLoading(false);
  }, [ownerFilter]);

  useEffect(() => { load(); }, [load]);

  const cycle = async (task) => {
    const ORDER = ["Not Started", "In Progress", "Done"];
    const next  = ORDER[(ORDER.indexOf(task.status) + 1) % ORDER.length];
    setUpdating(task.task);
    await updateNotionTask(task.task, next);
    setTasks(prev => prev.map(t => t.task === task.task ? { ...t, status: next } : t));
    setUpdating(null);
  };

  const done  = tasks.filter(t => t.status === "Done").length;
  const total = tasks.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  const accent = "#E2E8F0";

  return (
    <ModalShell onClose={onClose} maxWidth={620} height="80vh" accentColor={accent}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2128", background: "#0d0f14" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ color: "#f1f5f9", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15 }}>
              📋 {title}
            </div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? "Syncing with Notion..." : `${done}/${total} complete · tap a task to update status`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href={NOTION_PAGE} target="_blank" rel="noreferrer" style={{
              fontSize: 11, color: "#94a3b8", fontWeight: 600, textDecoration: "none",
              padding: "5px 10px", border: "1px solid #2a2d35", borderRadius: 8,
              background: "#1a1d24", fontFamily: "'DM Sans', sans-serif",
            }}>Open Notion ↗</a>
            <button onClick={onClose} style={{
              background: "#1e2128", border: "1px solid #2a2d35", color: "#64748b",
              borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
        </div>
        {!loading && total > 0 && (
          <div style={{ marginTop: 12, height: 4, background: "#1e2128", borderRadius: 99 }}>
            <div style={{ height: "100%", borderRadius: 99, background: "#4ADE80", width: `${pct}%`, transition: "width 0.4s" }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ overflowY: "auto", padding: 18, flex: 1 }}>
        {loading && <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Pulling tasks from Notion...</div>}
        {error && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ color: "#F87171", fontSize: 13, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>⚠️ {error}</div>
            <button onClick={load} style={{ padding: "8px 18px", borderRadius: 8, background: "#2a2d35", color: "#e2e8f0", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Retry</button>
          </div>
        )}
        {!loading && !error && tasks.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>No tasks found.</div>}
        {!loading && !error && tasks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tasks.map((task, i) => (
              <div key={i} onClick={() => !updating && cycle(task)} style={{
                padding: "12px 14px", borderRadius: 10,
                border: "1px solid #242830", background: "#1a1d24",
                cursor: updating ? "wait" : "pointer",
                opacity: updating === task.task ? 0.5 : 1,
                display: "flex", gap: 12, alignItems: "flex-start",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { if (!updating) e.currentTarget.style.borderColor = "#3a3d45"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#242830"; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>{task.task}</span>
                    {task.priority && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: PRIORITY_COLOR[task.priority] || "#64748b", letterSpacing: 0.5 }}>
                        {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {task.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{task.notes}</div>}
                  {task.owner && !ownerFilter && (
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                      → {task.owner} · {task.category}
                    </div>
                  )}
                </div>
                <StatusPill status={task.status || "Not Started"} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

// ─── GEO & OPS MODAL ──────────────────────────────────────────────────────────

function GeoModal({ onClose }) {
  const [list, setList] = useState(GEO_CHECKLIST);

  const toggle = (ci, ii) =>
    setList(prev => prev.map((cat, c) =>
      c !== ci ? cat : { ...cat, items: cat.items.map((item, i) => i !== ii ? item : { ...item, done: !item.done }) }
    ));

  const total = list.reduce((a, c) => a + c.items.length, 0);
  const done  = list.reduce((a, c) => a + c.items.filter(i => i.done).length, 0);
  const pct   = Math.round((done / total) * 100);
  const accent = "#A78BFA";

  return (
    <ModalShell onClose={onClose} maxWidth={640} height="84vh" accentColor={accent}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2128", background: "#0d0f14" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#f1f5f9", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15 }}>🌍 Geo & Ops Setup</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>Nairobi, Kenya · {done}/{total} complete · {pct}%</div>
          </div>
          <button onClick={onClose} style={{
            background: "#1e2128", border: "1px solid #2a2d35", color: "#64748b",
            borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>
        <div style={{ marginTop: 12, height: 4, background: "#1e2128", borderRadius: 99 }}>
          <div style={{ height: "100%", borderRadius: 99, background: accent, width: `${pct}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 20 }}>
        {list.map((cat, ci) => (
          <div key={ci}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 15 }}>{cat.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>{cat.category}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                background: (URGENCY_COLOR[cat.urgency] || "#64748b") + "20",
                color: URGENCY_COLOR[cat.urgency] || "#64748b",
                border: `1px solid ${(URGENCY_COLOR[cat.urgency] || "#64748b")}30`,
              }}>{URGENCY_LABEL[cat.urgency] || cat.urgency}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {cat.items.map((item, ii) => (
                <div key={ii} onClick={() => toggle(ci, ii)} style={{
                  padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${item.done ? "#1f4534" : "#242830"}`,
                  background: item.done ? "#10301f" : "#1a1d24",
                  display: "flex", gap: 11, alignItems: "flex-start",
                  transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 17, height: 17, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${item.done ? "#4ADE80" : "#3a3d45"}`,
                    background: item.done ? "#4ADE80" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                  }}>
                    {item.done && <span style={{ color: "#0d0f14", fontSize: 9, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                      color: item.done ? "#4ADE80" : "#e2e8f0",
                      textDecoration: item.done ? "line-through" : "none",
                    }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

// ─── CHAT MODAL ───────────────────────────────────────────────────────────────

function ChatModal({ agent, onClose, onOpenTasks }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(null); // null | "thinking" | "notion"
  const [memLoaded, setMemLoaded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const isCOO = agent.id === "coo";
  const isDev = agent.id === "dev";
  const storageKey = `chat:${agent.id}`;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => () => { abortRef.current?.abort("unmounted"); }, []);

  // Load persisted conversation on open
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(storageKey);
        if (result?.value) setMessages(JSON.parse(result.value));
      } catch { /* no history yet */ }
      setMemLoaded(true);
    })();
  }, [storageKey]);

  // Persist conversation after every change (once initial load is done)
  useEffect(() => {
    if (!memLoaded) return;
    window.storage.set(storageKey, JSON.stringify(messages)).catch(() => {});
  }, [messages, memLoaded, storageKey]);

  async function clearMemory() {
    setMessages([]);
    try { await window.storage.delete(storageKey); } catch { /* ignore */ }
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const useNotion = /task|notion|tracker|assign|status|update|complete|progress|what.*work/i.test(text);
    setLoadingStage(useNotion ? "notion" : "thinking");

    const controller = new AbortController();
    abortRef.current = controller;
    const TIMEOUT_MS = 45000;
    const timeoutId = setTimeout(() => controller.abort("timeout"), TIMEOUT_MS);

    try {
      const body = {
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: agent.systemPrompt,
        messages: updated.map(m => ({ role: m.role, content: m.content })),
      };
      if (useNotion) body.mcp_servers = [NOTION_MCP];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await res.json();
      if (data.error) {
        setMessages([...updated, { role: "assistant", content: `⚠️ ${data.error.message || "API error — please try again."}` }]);
      } else {
        const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("") || "(no text in response)";
        setMessages([...updated, { role: "assistant", content: reply }]);
      }
    } catch (e) {
      const reason = controller.signal.reason;
      if (reason === "user_cancelled") {
        setMessages(updated); // drop the pending reply, keep user's message
      } else {
        const wasTimeout = e?.name === "AbortError" || reason === "timeout";
        const msg = wasTimeout
          ? `⏱️ That's taking longer than expected (45s+)${useNotion ? " — Notion lookups can be slow" : ""}. Try again, or simplify the question.`
          : `⚠️ ${e.message || "Network error — please try again."}`;
        setMessages([...updated, { role: "assistant", content: msg }]);
      }
    } finally {
      clearTimeout(timeoutId);
      abortRef.current = null;
      setLoading(false);
      setLoadingStage(null);
    }
  }

  function cancelSend() {
    abortRef.current?.abort("user_cancelled");
  }

  const accentColor = isCOO ? "#E2E8F0" : agent.tagColor;

  return (
    <ModalShell onClose={onClose} maxWidth={620} height="82vh" accentColor={accentColor}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #1e2128",
        display: "flex", alignItems: "center", gap: 14,
        background: "#0d0f14",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: isCOO ? "linear-gradient(135deg, #2a2d35, #1a1d24)" : agent.avatarBg,
          border: `2px solid ${accentColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isCOO ? 11 : 13, fontWeight: 700,
          color: accentColor, letterSpacing: 0.5, flexShrink: 0,
        }}>
          {agent.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>
            {isCOO ? "Chief of Operations" : agent.name}
          </div>
          <div style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 1 }}>
            {isCOO ? "Strategic Command · Notion-connected" : agent.title}
          </div>
        </div>
        {(isCOO || isDev) && (
          <button onClick={onOpenTasks} style={{
            background: "#1a1d24", border: "1px solid #2a2d35", color: "#94a3b8",
            borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>📋 Tasks</button>
        )}
        {messages.length > 0 && (
          <button onClick={clearMemory} title="Clear conversation memory" style={{
            background: "#1a1d24", border: "1px solid #2a2d35", color: "#64748b",
            borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>🗑️</button>
        )}
        <span style={{
          background: `${accentColor}15`, color: accentColor,
          border: `1px solid ${accentColor}30`,
          borderRadius: 20, padding: "3px 10px",
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
        }}>
          {isCOO ? "Command" : agent.tag}
        </span>
        <button onClick={onClose} style={{
          background: "#1e2128", border: "1px solid #2a2d35", color: "#64748b",
          borderRadius: 8, width: 32, height: 32, cursor: "pointer",
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ margin: "auto", textAlign: "center", opacity: 0.35 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: isCOO ? "linear-gradient(135deg, #2a2d35, #1a1d24)" : agent.avatarBg,
              border: `2px solid ${accentColor}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif", fontSize: isCOO ? 12 : 15,
              fontWeight: 700, color: accentColor, margin: "0 auto 12px",
            }}>
              {agent.initials}
            </div>
            <div style={{ color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              {isCOO ? "Chief of Operations ready" : `${agent.name} is ready`}
            </div>
            <div style={{ color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 4 }}>
              Send a message to get started
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Sans', sans-serif", marginBottom: 4, letterSpacing: 0.5 }}>
              {m.role === "user" ? "You" : (isCOO ? "C.O.O" : agent.name.split(" ")[0])}
            </div>
            <div style={{
              maxWidth: "78%", padding: "10px 14px", borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6,
              background: m.role === "user" ? `${accentColor}18` : "#1a1d24",
              border: m.role === "user" ? `1px solid ${accentColor}30` : "1px solid #242830",
              color: m.role === "user" ? "#e2e8f0" : "#cbd5e1",
              whiteSpace: "pre-wrap",
              borderBottomRightRadius: m.role === "user" ? 4 : 12,
              borderBottomLeftRadius: m.role === "assistant" ? 4 : 12,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
              {isCOO ? "C.O.O" : agent.name.split(" ")[0]}
            </div>
            <div style={{
              background: "#1a1d24", border: "1px solid #242830", borderRadius: "12px 12px 12px 4px",
              padding: "8px 14px", display: "flex", alignItems: "center", gap: 10,
            }}>
              <TypingDots color={accentColor} />
              <span style={{ fontSize: 11.5, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
                {loadingStage === "notion" ? "Checking Notion tasks..." : "Thinking..."}
              </span>
              <button onClick={cancelSend} style={{
                background: "transparent", border: "1px solid #2a2d35", color: "#64748b",
                borderRadius: 6, padding: "2px 8px", fontSize: 10.5, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginLeft: 2,
              }}>Cancel</button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e2128", display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={`Message ${isCOO ? "C.O.O" : agent.name.split(" ")[0]}...`}
          style={{
            flex: 1, background: "#1a1d24", border: "1px solid #2a2d35",
            borderRadius: 10, color: "#e2e8f0",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            padding: "10px 14px", outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? "#1a1d24" : accentColor,
            border: "none", borderRadius: 10,
            color: loading || !input.trim() ? "#475569" : "#0d0f14",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
            padding: "10px 18px", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          Send
        </button>
      </div>
    </ModalShell>
  );
}

// ─── AVATAR CARD ──────────────────────────────────────────────────────────────

function AvatarCard({ agent, onClick, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(agent)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1a1d24" : "#13161c",
        border: `1px solid ${hovered ? agent.tagColor + "50" : "#1e2128"}`,
        borderRadius: 14,
        padding: "20px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 10, minWidth: 130,
        boxShadow: hovered ? `0 8px 32px ${agent.tagColor}15` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        animation: `fadeUp 0.5s ease ${delay}s both`,
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: agent.avatarBg,
        border: `2px solid ${hovered ? agent.tagColor + "80" : agent.tagColor + "40"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
        color: agent.tagColor, letterSpacing: 0.5,
        transition: "border-color 0.2s",
      }}>
        {agent.initials}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 3 }}>
          {agent.name}
        </div>
        <div style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.4 }}>
          {agent.title}
        </div>
      </div>

      <div style={{
        background: `${agent.tagColor}15`,
        color: agent.tagColor,
        border: `1px solid ${agent.tagColor}30`,
        borderRadius: 20, padding: "3px 12px",
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
      }}>
        {agent.tag}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeAgent, setActiveAgent] = useState(null);
  const [showGeo, setShowGeo] = useState(false);
  const [notionPanel, setNotionPanel] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0c10; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #13161c; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 4px; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0a0c10",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeIn 0.5s ease" }}>
          <div style={{
            color: "#475569", fontSize: 11, letterSpacing: 3,
            fontWeight: 600, textTransform: "uppercase", marginBottom: 8,
          }}>
            Cellura · Dropship Operations
          </div>
          <h1 style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 700,
            fontSize: "clamp(28px, 5vw, 44px)", color: "#f1f5f9", letterSpacing: -1,
          }}>
            Your Team
          </h1>
        </div>

        {/* Quick links row */}
        <div style={{
          display: "flex", gap: 10, marginBottom: 20,
          animation: "fadeUp 0.4s ease 0.05s both",
        }}>
          <button
            onClick={() => setNotionPanel({ owner: null, title: "All Tasks — COO View" })}
            style={{
              background: "#13161c", border: "1px solid #2a2d35", color: "#94a3b8",
              borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a1d24"; e.currentTarget.style.borderColor = "#3a3d45"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#13161c"; e.currentTarget.style.borderColor = "#2a2d35"; }}
          >📋 Notion Tasks</button>
          <button
            onClick={() => setShowGeo(true)}
            style={{
              background: "#13161c", border: "1px solid #2a2d35", color: "#94a3b8",
              borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a1d24"; e.currentTarget.style.borderColor = "#3a3d45"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#13161c"; e.currentTarget.style.borderColor = "#2a2d35"; }}
          >🌍 Geo & Ops</button>
        </div>

        {/* COO Node */}
        <div
          onClick={() => setActiveAgent(COO)}
          style={{
            background: "#13161c",
            border: "1px solid #2a2d35",
            borderRadius: 14,
            padding: "16px 32px",
            display: "flex", alignItems: "center", gap: 16,
            cursor: "pointer",
            transition: "all 0.2s",
            animation: "fadeUp 0.4s ease 0.1s both",
            marginBottom: 0,
            minWidth: 320,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a1d24";
            e.currentTarget.style.borderColor = "#94a3b840";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#13161c";
            e.currentTarget.style.borderColor = "#2a2d35";
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #1e2330 0%, #111520 100%)",
            border: "2px solid #475569",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
            color: "#94a3b8", letterSpacing: 0.5,
          }}>
            COO
          </div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, fontFamily: "'Sora', sans-serif" }}>
              Chief of Operations
            </div>
            <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
              You → Reports here
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{
              background: "#1e2128", border: "1px solid #2a2d35",
              borderRadius: 8, padding: "4px 12px",
              color: "#64748b", fontSize: 11, fontWeight: 600,
            }}>
              Open ↗
            </div>
          </div>
        </div>

        {/* Connector lines */}
        <div style={{ position: "relative", width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 1, height: 28, background: "#2a2d35" }} />
          <div style={{ position: "relative", width: "100%", height: 1, background: "#2a2d35" }} />
          <div style={{
            display: "flex", width: "100%", justifyContent: "space-between",
            paddingTop: 0,
          }}>
            {TEAM.map((agent) => (
              <div key={agent.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 1, height: 28, background: "#2a2d35" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Team Cards */}
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
          maxWidth: 940,
        }}>
          {TEAM.map((agent, i) => (
            <AvatarCard key={agent.id} agent={agent} onClick={setActiveAgent} delay={0.2 + i * 0.07} />
          ))}
        </div>

        {/* Footer hint */}
        <div style={{
          marginTop: 48, color: "#334155", fontSize: 11,
          fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
          animation: "fadeIn 0.8s ease 1s both",
        }}>
          Click any card to brief your specialist
        </div>
      </div>

      {activeAgent && (
        <ChatModal
          agent={activeAgent}
          onClose={() => setActiveAgent(null)}
          onOpenTasks={() => {
            const ownerName = activeAgent.id === "dev" ? "Dev" : null;
            const panelTitle = activeAgent.id === "dev" ? "Dev's Tasks" : "All Tasks — COO View";
            setNotionPanel({ owner: ownerName, title: panelTitle });
          }}
        />
      )}
      {showGeo && <GeoModal onClose={() => setShowGeo(false)} />}
      {notionPanel && (
        <NotionModal
          ownerFilter={notionPanel.owner}
          title={notionPanel.title}
          onClose={() => setNotionPanel(null)}
        />
      )}
    </>
  );
}
