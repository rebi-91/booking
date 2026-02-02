// src/PharmacyFirst.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  Activity,
  ClipboardList,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Save,
  FileText,
  AlertTriangle,
  Stethoscope,
  ShieldAlert,
  Bug,
  Ear,
  Sparkles,
  Droplets,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { utiService, type ServiceDefinition, type FlowNode } from "./services/uti";
import { impetigoService } from "./services/impetigo";
import { sinusitisService } from "./services/sinusitis";
import { shinglesService } from "./services/shingles";
import { aomService } from "./services/aom";
import { insectBiteService } from "./services/insectBite";
import { soreThroatService } from "./services/soreThroat";

/* ---------------- GLOBAL STYLES (MATCH THE “NEW” VERSION) ---------------- */

const GlobalStyles = () => (
  <style>{`
    :root{
      --bg0:#05070b;
      --bg1:#070a11;
      --surface:#0c1017;
      --surface2:#0f1520;
      --surface3:#0b0f16;
      --border: rgba(255,255,255,.08);
      --border2: rgba(255,255,255,.12);
      --text:#ffffff;
      --muted: rgba(255,255,255,.58);
      --muted2: rgba(255,255,255,.38);
      --blue:#2b6cff;
      --blue2:#1f5eff;
      --cyan:#22d3ee;

      --r-xl: 28px;
      --r-lg: 22px;
      --r-md: 18px;
      --shadow: 0 18px 40px rgba(0,0,0,.55);
      --shadow2: 0 10px 24px rgba(0,0,0,.40);
    }

    *{ box-sizing:border-box; }
    html,body{ height:100%; }
    body{
      margin:0;
      color:var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
      background:
        radial-gradient(1200px 800px at 62% 18%, rgba(43,108,255,.24), transparent 55%),
        radial-gradient(900px 700px at 20% 0%, rgba(34,211,238,.10), transparent 60%),
        linear-gradient(180deg, var(--bg0), var(--bg1));
      overflow-x:hidden;
    }

    /* Scrollbar */
    ::-webkit-scrollbar{ width:10px; }
    ::-webkit-scrollbar-thumb{
      background: rgba(255,255,255,.10);
      border-radius: 999px;
      border: 2px solid rgba(0,0,0,.25);
    }

    /* App layout */
    .pf-shell{
      min-height: 100vh;
      display:flex;
    }

    .pf-sidebar{
      width: 360px;
      padding: 28px 22px;
      background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
      border-right: 1px solid var(--border);
      backdrop-filter: blur(10px);
    }

    .pf-brand{
      display:flex;
      gap: 14px;
      align-items:center;
      padding: 8px 10px;
      margin-bottom: 26px;
    }

    .pf-logo{
      width: 54px;
      height: 54px;
      border-radius: 18px;
      background: linear-gradient(180deg, #2b6cff, #1f5eff);
      box-shadow: 0 10px 22px rgba(43,108,255,.35);
      display:grid;
      place-items:center;
      flex: 0 0 auto;
    }

    .pf-brand-title{
      font-weight: 900;
      letter-spacing: .2px;
      font-size: 20px;
      line-height: 1;
    }
    .pf-brand-title span{ color: #4aa3ff; }
    .pf-brand-sub{
      margin-top: 6px;
      font-size: 12px;
      color: var(--muted);
      letter-spacing: .2px;
    }

    .pf-nav{
      display:flex;
      flex-direction:column;
      gap: 14px;
      margin-top: 10px;
    }

    .pf-nav-btn{
      width: 100%;
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      padding: 16px 18px;
      border-radius: 20px;
      display:flex;
      align-items:center;
      gap: 14px;
      font-weight: 700;
      font-size: 16px;
      cursor:pointer;
      transition: transform .12s ease, background .12s ease, color .12s ease, border-color .12s ease;
    }
    .pf-nav-btn:hover{
      background: rgba(255,255,255,.04);
      color: rgba(255,255,255,.85);
      transform: translateY(-1px);
    }

    .pf-nav-btn.active{
      background: linear-gradient(180deg, rgba(43,108,255,.95), rgba(31,94,255,.95));
      color: white;
      box-shadow: 0 16px 34px rgba(43,108,255,.28);
      border-color: rgba(43,108,255,.35);
    }

    .pf-main{
      flex:1;
      padding: 34px 52px;
      overflow-y:auto;
    }

    .pf-wrap{
      max-width: 1180px;
      margin: 0 auto;
      padding-top: 12px;
    }

    /* Header (Home) */
    .pf-pill{
      display:inline-flex;
      align-items:center;
      gap: 10px;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid rgba(43,108,255,.35);
      background: rgba(43,108,255,.10);
      color: rgba(120,190,255,.95);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .pf-h1{
      font-size: 72px;
      line-height: .98;
      font-weight: 950;
      letter-spacing: -1.2px;
      margin: 0 0 18px 0;
    }

    .pf-h1 .gradient{
      background: linear-gradient(90deg, #2b6cff, #22d3ee);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .pf-lead{
      font-size: 22px;
      line-height: 1.55;
      color: var(--muted);
      max-width: 820px;
      margin: 0 0 44px 0;
    }

    /* Cards */
    .pf-grid3{
      display:grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 28px;
      margin-top: 10px;
    }

    .pf-card{
      text-align:left;
      padding: 38px 34px;
      border-radius: 34px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
      box-shadow: 0 10px 22px rgba(0,0,0,.35);
      cursor:pointer;
      transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
      min-height: 340px;
      display:flex;
      flex-direction:column;
      gap: 12px;
    }

    .pf-card:hover{
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: rgba(255,255,255,.14);
    }

    .pf-card.primary{
      background: linear-gradient(180deg, rgba(43,108,255,.95), rgba(31,94,255,.90));
      border-color: rgba(120,190,255,.35);
      box-shadow: 0 24px 48px rgba(43,108,255,.22);
    }

    .pf-icon-chip{
      width: 54px;
      height: 54px;
      border-radius: 18px;
      display:grid;
      place-items:center;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      margin-bottom: 10px;
    }

    .pf-card.primary .pf-icon-chip{
      background: rgba(255,255,255,.16);
      border-color: rgba(255,255,255,.20);
    }

    .pf-card-title{
      font-size: 30px;
      font-weight: 950;
      letter-spacing: -0.3px;
      margin: 8px 0 0 0;
    }

    .pf-card-desc{
      font-size: 18px;
      line-height: 1.55;
      color: rgba(255,255,255,.70);
      margin: 0;
      max-width: 360px;
    }

    .pf-card.primary .pf-card-desc{
      color: rgba(255,255,255,.86);
    }

    .pf-card-action{
      margin-top: auto;
      font-weight: 900;
      display:flex;
      align-items:center;
      gap: 10px;
      font-size: 18px;
      color: rgba(255,255,255,.92);
    }

    /* Assessment surfaces */
    .pf-panel{
      border-radius: 28px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,.02);
      box-shadow: var(--shadow2);
    }

    .pf-section-title{
      font-size: 34px;
      font-weight: 950;
      letter-spacing: -.4px;
      margin: 0 0 18px 0;
    }

    .pf-back{
      display:inline-flex;
      align-items:center;
      gap: 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,.02);
      color: rgba(255,255,255,.80);
      padding: 10px 14px;
      cursor:pointer;
    }

    .pf-muted{
      color: var(--muted);
    }

    /* Simple responsive */
    @media (max-width: 1100px){
      .pf-sidebar{ width: 320px; }
      .pf-h1{ font-size: 62px; }
    }
    @media (max-width: 920px){
      .pf-shell{ flex-direction: column; }
      .pf-sidebar{
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border);
      }
      .pf-main{ padding: 26px 18px; }
      .pf-grid3{ grid-template-columns: 1fr; }
      .pf-h1{ font-size: 52px; }
    }

    /* ---------- Select Service layout ---------- */
    .pf-section {
      max-width: 980px;
      margin: 0 auto;
    }

    .pf-service-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 18px;
    }

    @media (max-width: 720px) {
      .pf-service-grid {
        grid-template-columns: 1fr;
      }
    }

    .pf-service-card {
      width: 100%;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;

      padding: 22px 22px;
      border-radius: 26px;

      border: 1px solid rgba(255,255,255,.10);
      background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
      box-shadow: 0 10px 22px rgba(0,0,0,.35);

      transition: transform .14s ease, box-shadow .14s ease, border-color .14s ease, background .14s ease;
    }

    .pf-service-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow2);
      border-color: rgba(255,255,255,.16);
    }

    .pf-service-card:active {
      transform: translateY(0px);
    }

    .pf-service-icon {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      display: grid;
      place-items: center;
      background: rgba(43,108,255,.10);
      border: 1px solid rgba(43,108,255,.22);
      color: rgba(160,220,255,.95);
      flex: 0 0 auto;
    }

    .pf-service-title {
      font-weight: 950;
      font-size: 18px;
      letter-spacing: -.2px;
    }

    .pf-service-subtitle {
      margin-top: 6px;
      color: rgba(255,255,255,.55);
      font-weight: 750;
      font-size: 13px;
    }

    .pf-section-title {
      margin-bottom: 10px;
    }
  `}</style>
);

/* ---------------- TYPES ---------------- */

type Page = "home" | "assessment" | "history";
type Step = "service" | "age" | "flow";

type ServiceKey =
  | "soreThroat"
  | "impetigo"
  | "sinusitis"
  | "uti"
  | "shingles"
  | "aom"
  | "insectBite";

interface FlowStep {
  nodeId: string;
  question: string;
  answer: string;
}

interface RecordItem {
  id: number;
  serviceKey: ServiceKey;
  serviceLabel: string;
  ageBand: string;
  outcome: string;
  pathway: FlowStep[];
  createdAt: string;
}

/* ---------------- SERVICES ---------------- */

const SERVICES: Record<ServiceKey, ServiceDefinition> = {
  soreThroat: soreThroatService,
  impetigo: impetigoService,
  sinusitis: sinusitisService,
  uti: utiService,
  shingles: shinglesService,
  aom: aomService,
  insectBite: insectBiteService,
};

const SERVICE_META: Record<ServiceKey, { title: string; subtitle: string; icon: React.ReactNode }> = {
  soreThroat: { title: "Acute sore throat", subtitle: "Age 5+", icon: <Sparkles size={22} /> },
  impetigo: { title: "Impetigo", subtitle: "Age 1+", icon: <AlertTriangle size={22} /> },
  sinusitis: { title: "Acute sinusitis", subtitle: "Age 12+", icon: <ShieldAlert size={22} /> },
  uti: { title: "Uncomplicated UTI", subtitle: "Women 16–64", icon: <Droplets size={22} /> },
  shingles: { title: "Shingles", subtitle: "Age 18+", icon: <Stethoscope size={22} /> },
  aom: { title: "Acute otitis media", subtitle: "Age 1–17", icon: <Ear size={22} /> },
  insectBite: { title: "Infected insect bite", subtitle: "Age 1+", icon: <Bug size={22} /> },
};

/* ---------------- LAYOUT ---------------- */

const Layout = ({
  page,
  setPage,
  children,
}: {
  page: Page;
  setPage: (p: Page) => void;
  children: React.ReactNode;
}) => (
  <div className="pf-shell">
    <GlobalStyles />

    <aside className="pf-sidebar">
      <div className="pf-brand">
        <div className="pf-logo">
          <Activity size={22} color="#fff" />
        </div>
        <div>
          <div className="pf-brand-title">
            Pharmacy<span>First</span>
          </div>
          <div className="pf-brand-sub">Clinical Pathways</div>
        </div>
      </div>

      <div className="pf-nav">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "assessment", icon: Activity, label: "New Assessment" },
          { id: "history", icon: ClipboardList, label: "History" },
        ].map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id as Page)}
            className={`pf-nav-btn ${page === n.id ? "active" : ""}`}
          >
            <n.icon size={20} />
            {n.label}
          </button>
        ))}
      </div>
    </aside>

    <main className="pf-main">
      <div className="pf-wrap">{children}</div>
    </main>
  </div>
);

/* ---------------- APP ---------------- */

export default function PharmacyFirst() {
  const [page, setPage] = useState<Page>("home");
  const [step, setStep] = useState<Step>("service");

  const [serviceKey, setServiceKey] = useState<ServiceKey | null>(null);
  const [ageBand, setAgeBand] = useState<string | null>(null);

  const [nodeId, setNodeId] = useState<string>("age");
  const [history, setHistory] = useState<FlowStep[]>([]);
  const [outcome, setOutcome] = useState<string | null>(null);

  const [records, setRecords] = useState<RecordItem[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // FeverPAIN local state (only used for sore throat flow)
  const [fp, setFp] = useState({
    fever: false,
    purulence: false,
    within3Days: false,
    severeTonsils: false,
    noCough: false,
  });

  const resetFp = () =>
    setFp({
      fever: false,
      purulence: false,
      within3Days: false,
      severeTonsils: false,
      noCough: false,
    });

  const fpScore = (s: typeof fp) =>
    Number(s.fever) +
    Number(s.purulence) +
    Number(s.within3Days) +
    Number(s.severeTonsils) +
    Number(s.noCough);

  const service = serviceKey ? SERVICES[serviceKey] : null;
  const node: FlowNode | null = service ? service.flow[nodeId] : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, outcome, nodeId]);

  const reset = () => {
    setStep("service");
    setServiceKey(null);
    setAgeBand(null);
    setNodeId("age");
    setHistory([]);
    setOutcome(null);
    resetFp();
  };

  const answer = (label: string, next?: string, res?: string) => {
    if (!service || !node) return;

    // record step
    setHistory((prev) => [...prev, { nodeId, question: node.title, answer: label }]);

    // direct outcome from node option
    if (res) {
      setOutcome(res);
      return;
    }

    // FeverPAIN auto-score only for sore throat
    if (service.key === "soreThroat") {
      const yes = label.trim().toLowerCase().startsWith("yes");

      if (nodeId === "assessment_fp_fever") setFp((p) => ({ ...p, fever: yes }));
      if (nodeId === "assessment_fp_purulence") setFp((p) => ({ ...p, purulence: yes }));
      if (nodeId === "assessment_fp_within3") setFp((p) => ({ ...p, within3Days: yes }));
      if (nodeId === "assessment_fp_tonsils") setFp((p) => ({ ...p, severeTonsils: yes }));

      if (nodeId === "assessment_fp_nocough") {
        const nextState = { ...fp, noCough: yes };
        const score = fpScore(nextState);

        if (score <= 1) {
          setOutcome("FeverPAIN 0–1: Self-care and pain relief + safety-netting (TARGET RTI advice).");
          return;
        }
        if (score <= 3) {
          setNodeId("fp_2to3_return");
          return;
        }
        setNodeId("fp_4to5_severity");
        return;
      }
    }

    // default next
    if (next) setNodeId(next);
  };

  const save = () => {
    if (!service || !serviceKey || !ageBand || !outcome) return;

    setRecords((prev) => [
      {
        id: Date.now(),
        serviceKey,
        serviceLabel: service.label,
        ageBand,
        outcome,
        pathway: history,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setPage("history");
    reset();
  };

  return (
    <Layout page={page} setPage={setPage}>
      {/* HOME */}
      {page === "home" && (
        <>
          <div>
            <div className="pf-pill">NHS PHARMACY FIRST</div>

            <h1 className="pf-h1">
              Clinical Assessment
              <br />
              <span className="gradient">Protocol System</span>
            </h1>

            <p className="pf-lead">
              Start a new patient assessment using standardized clinical pathways.
            </p>
          </div>

          <div className="pf-grid3">
            <HomeCard
              title="Start Assessment"
              description="Begin a new consultation for a Pharmacy First service."
              action="Start Now"
              primary
              icon={<Activity size={22} />}
              onClick={() => setPage("assessment")}
            />
            <HomeCard
              title="Patient History"
              description="Review past assessments and outcomes."
              action="View Log"
              icon={<ClipboardList size={22} />}
              onClick={() => setPage("history")}
            />
            <HomeCard
              title="Protocols"
              description="Use the pathway questions to reach an outcome."
              action="Read Docs"
              icon={<AlertTriangle size={22} />}
              onClick={() => setPage("assessment")}
            />
          </div>
        </>
      )}

      {/* ASSESSMENT */}
      {page === "assessment" && (
        <>
          {step === "service" && (
            <>
              <div className="pf-section">
                <h2 className="pf-section-title">Select Service</h2>

                <div className="pf-service-grid">
                  {(Object.keys(SERVICE_META) as ServiceKey[]).map((k) => (
                    <ServiceCard
                      key={k}
                      title={SERVICE_META[k].title}
                      subtitle={SERVICE_META[k].subtitle}
                      icon={SERVICE_META[k].icon}
                      onClick={() => {
                        setServiceKey(k);
                        setStep("age");
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === "age" && service && (
            <>
              <button className="pf-back" onClick={() => setStep("service")} style={{ marginBottom: 16 }}>
                <ArrowLeft size={18} /> Back
              </button>

              <h2 className="pf-section-title">Patient Age Band</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {service.ageBands.map((a) => (
                  <AgeCard
                    key={a}
                    label={a}
                    icon={<User size={20} />}
                    onClick={() => {
                      setAgeBand(a);
                      setStep("flow");
                      setNodeId(service.startId);
                      setHistory([]);
                      setOutcome(null);
                      resetFp();
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {step === "flow" && service && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <div>
                  <div style={{ fontWeight: 950, fontSize: 22, letterSpacing: "-.2px" }}>
                    {service.label}{" "}
                    <span className="pf-muted" style={{ fontWeight: 800, fontSize: 14, marginLeft: 8 }}>
                      {ageBand ?? ""}
                    </span>
                  </div>

                  <div className="pf-muted" style={{ marginTop: 6 }}>
                    Follow the pathway questions to determine the safest outcome.
                  </div>
                </div>

                <button onClick={reset} className="pf-back">
                  <RotateCcw size={16} /> Restart
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 18,
                    top: 18,
                    bottom: 0,
                    width: 2,
                    background: "rgba(255,255,255,.06)",
                  }}
                />

                {history.map((h, i) => (
                  <TimelineDone key={i} question={h.question} answer={h.answer} />
                ))}

                {!outcome && node && (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={nodeId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <TimelineQuestion node={node} onAnswer={answer} />
                    </motion.div>
                  </AnimatePresence>
                )}

                {outcome && <TimelineOutcome outcome={outcome} onSave={save} />}

                <div ref={bottomRef} />
              </div>
            </>
          )}
        </>
      )}

      {/* HISTORY */}
      {page === "history" && (
        <>
          <h2 className="pf-section-title">Assessment History</h2>

          {records.length === 0 && (
            <div className="pf-panel" style={{ padding: 54, textAlign: "center" }}>
              <FileText size={46} color="rgba(255,255,255,.35)" />
              <div style={{ marginTop: 14, color: "rgba(255,255,255,.55)", fontWeight: 700 }}>
                No records found.
              </div>
            </div>
          )}

          {records.map((r) => (
            <div
              key={r.id}
              className="pf-panel"
              style={{
                padding: 22,
                marginBottom: 16,
                borderRadius: 22,
                background: "rgba(255,255,255,.02)",
              }}
            >
              <div style={{ fontWeight: 950, fontSize: 18 }}>{r.outcome}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 6 }}>
                {r.serviceLabel} • {r.ageBand} • {new Date(r.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </>
      )}
    </Layout>
  );
}

/* ---------------- COMPONENTS ---------------- */

function HomeCard({
  title,
  description,
  action,
  onClick,
  primary,
  icon,
}: {
  title: string;
  description: string;
  action: string;
  onClick: () => void;
  primary?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={`pf-card ${primary ? "primary" : ""}`}>
      <div className="pf-icon-chip">{icon}</div>
      <div className="pf-card-title">{title}</div>
      <p className="pf-card-desc">{description}</p>
      <div className="pf-card-action">
        {action} <ChevronRight size={18} />
      </div>
    </button>
  );
}

function ServiceCard({
  title,
  subtitle,
  onClick,
  icon,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className="pf-service-card">
      <div className="pf-service-icon">{icon}</div>
      <div>
        <div className="pf-service-title">{title}</div>
        <div className="pf-service-subtitle">{subtitle}</div>
      </div>
    </button>
  );
}

function AgeCard({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="pf-panel"
      style={{
        padding: 18,
        borderRadius: 20,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          background: "rgba(43,108,255,.10)",
          border: "1px solid rgba(43,108,255,.25)",
          color: "#7fc2ff",
        }}
      >
        {icon}
      </div>
      <div style={{ fontWeight: 900 }}>{label}</div>
    </button>
  );
}

function TimelineDone({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "999px",
          background: "rgba(34,197,94,.14)",
          border: "1px solid rgba(34,197,94,.38)",
          display: "grid",
          placeItems: "center",
          zIndex: 1,
        }}
      >
        <Check size={16} color="rgba(255,255,255,.95)" />
      </div>

      <div
        className="pf-panel"
        style={{
          padding: 16,
          borderRadius: 18,
          flex: 1,
          background: "rgba(255,255,255,.015)",
        }}
      >
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.50)", fontWeight: 800 }}>
          {question}
        </div>
        <div style={{ fontWeight: 900, marginTop: 6 }}>{answer}</div>
      </div>
    </div>
  );
}

function TimelineQuestion({
  node,
  onAnswer,
}: {
  node: FlowNode;
  onAnswer: (label: string, next?: string, res?: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "999px",
          background: "rgba(43,108,255,.95)",
          boxShadow: "0 14px 28px rgba(43,108,255,.22)",
          display: "grid",
          placeItems: "center",
          fontWeight: 950,
          zIndex: 1,
        }}
      >
        ?
      </div>

      <div className="pf-panel" style={{ padding: 20, borderRadius: 22, flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 950, letterSpacing: "-.2px" }}>{node.title}</div>
        {node.description && (
          <div style={{ marginTop: 10, color: "rgba(255,255,255,.58)", lineHeight: 1.5 }}>
            {node.description}
          </div>
        )}

        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          {node.options.map((o, i) => (
            <button
              key={i}
              onClick={() => onAnswer(o.label, o.nextId, o.outcome)}
              style={{
                padding: "14px 14px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,.10)",
                background: o.danger ? "rgba(239,68,68,.10)" : "rgba(255,255,255,.03)",
                color: "#fff",
                textAlign: "left",
                fontWeight: 850,
                cursor: "pointer",
                transition: "transform .12s ease, background .12s ease, border-color .12s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineOutcome({ outcome, onSave }: { outcome: string; onSave: () => void }) {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "999px",
          background: "rgba(34,197,94,.20)",
          border: "1px solid rgba(34,197,94,.42)",
          display: "grid",
          placeItems: "center",
          zIndex: 1,
        }}
      >
        <Check size={16} color="rgba(255,255,255,.95)" />
      </div>

      <div
        className="pf-panel"
        style={{
          padding: 26,
          borderRadius: 26,
          flex: 1,
          textAlign: "center",
          border: "1px solid rgba(34,197,94,.35)",
          background: "rgba(34,197,94,.05)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 1.2,
            color: "rgba(134,239,172,.95)",
            fontWeight: 950,
          }}
        >
          CLINICAL RECOMMENDATION
        </div>

        <div style={{ fontSize: 26, fontWeight: 950, marginTop: 12 }}>{outcome}</div>

        <button
          onClick={onSave}
          style={{
            marginTop: 16,
            padding: "12px 18px",
            borderRadius: 999,
            background: "linear-gradient(180deg, rgba(43,108,255,.98), rgba(31,94,255,.98))",
            border: "1px solid rgba(120,190,255,.30)",
            color: "#fff",
            fontWeight: 950,
            cursor: "pointer",
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            boxShadow: "0 18px 34px rgba(43,108,255,.22)",
          }}
        >
          <Save size={16} /> Save to History
        </button>
      </div>
    </div>
  );
}


// import React, { useState, useRef, useEffect } from "react";
// import {
//   Home,
//   Activity,
//   ClipboardList,
//   ChevronRight,
//   ArrowLeft,
//   RotateCcw,
//   Check,
//   Save,
//   FileText,
//   AlertTriangle,
//   Stethoscope,
//   User,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// /* ---------------- GLOBAL STYLES ---------------- */

// const GlobalStyles = () => (
//   <style>{`
//     :root{
//       --bg0:#05070b;
//       --bg1:#070a11;
//       --surface:#0c1017;
//       --surface2:#0f1520;
//       --surface3:#0b0f16;
//       --border: rgba(255,255,255,.08);
//       --border2: rgba(255,255,255,.12);
//       --text:#ffffff;
//       --muted: rgba(255,255,255,.58);
//       --muted2: rgba(255,255,255,.38);
//       --blue:#2b6cff;
//       --blue2:#1f5eff;
//       --cyan:#22d3ee;

//       --r-xl: 28px;
//       --r-lg: 22px;
//       --r-md: 18px;
//       --shadow: 0 18px 40px rgba(0,0,0,.55);
//       --shadow2: 0 10px 24px rgba(0,0,0,.40);
//     }

//     *{ box-sizing:border-box; }
//     html,body{ height:100%; }
//     body{
//       margin:0;
//       color:var(--text);
//       font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
//       background:
//         radial-gradient(1200px 800px at 62% 18%, rgba(43,108,255,.24), transparent 55%),
//         radial-gradient(900px 700px at 20% 0%, rgba(34,211,238,.10), transparent 60%),
//         linear-gradient(180deg, var(--bg0), var(--bg1));
//       overflow-x:hidden;
//     }

//     /* Scrollbar */
//     ::-webkit-scrollbar{ width:10px; }
//     ::-webkit-scrollbar-thumb{
//       background: rgba(255,255,255,.10);
//       border-radius: 999px;
//       border: 2px solid rgba(0,0,0,.25);
//     }

//     /* App layout */
//     .pf-shell{
//       min-height: 100vh;
//       display:flex;
//     }

//     .pf-sidebar{
//       width: 360px;
//       padding: 28px 22px;
//       background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
//       border-right: 1px solid var(--border);
//       backdrop-filter: blur(10px);
//     }

//     .pf-brand{
//       display:flex;
//       gap: 14px;
//       align-items:center;
//       padding: 8px 10px;
//       margin-bottom: 26px;
//     }

//     .pf-logo{
//       width: 54px;
//       height: 54px;
//       border-radius: 18px;
//       background: linear-gradient(180deg, #2b6cff, #1f5eff);
//       box-shadow: 0 10px 22px rgba(43,108,255,.35);
//       display:grid;
//       place-items:center;
//       flex: 0 0 auto;
//     }

//     .pf-brand-title{
//       font-weight: 900;
//       letter-spacing: .2px;
//       font-size: 20px;
//       line-height: 1;
//     }
//     .pf-brand-title span{ color: #4aa3ff; }
//     .pf-brand-sub{
//       margin-top: 6px;
//       font-size: 12px;
//       color: var(--muted);
//       letter-spacing: .2px;
//     }

//     .pf-nav{
//       display:flex;
//       flex-direction:column;
//       gap: 14px;
//       margin-top: 10px;
//     }

//     .pf-nav-btn{
//       width: 100%;
//       border: 1px solid transparent;
//       background: transparent;
//       color: var(--muted);
//       padding: 16px 18px;
//       border-radius: 20px;
//       display:flex;
//       align-items:center;
//       gap: 14px;
//       font-weight: 700;
//       font-size: 16px;
//       cursor:pointer;
//       transition: transform .12s ease, background .12s ease, color .12s ease, border-color .12s ease;
//     }
//     .pf-nav-btn:hover{
//       background: rgba(255,255,255,.04);
//       color: rgba(255,255,255,.85);
//       transform: translateY(-1px);
//     }

//     .pf-nav-btn.active{
//       background: linear-gradient(180deg, rgba(43,108,255,.95), rgba(31,94,255,.95));
//       color: white;
//       box-shadow: 0 16px 34px rgba(43,108,255,.28);
//       border-color: rgba(43,108,255,.35);
//     }

//     .pf-main{
//       flex:1;
//       padding: 34px 52px;
//       overflow-y:auto;
//     }

//     .pf-wrap{
//       max-width: 1180px;
//       margin: 0 auto;
//       padding-top: 12px;
//     }

//     /* Header (Home) */
//     .pf-pill{
//       display:inline-flex;
//       align-items:center;
//       gap: 10px;
//       padding: 8px 16px;
//       border-radius: 999px;
//       border: 1px solid rgba(43,108,255,.35);
//       background: rgba(43,108,255,.10);
//       color: rgba(120,190,255,.95);
//       font-size: 12px;
//       font-weight: 800;
//       letter-spacing: 1.2px;
//       text-transform: uppercase;
//       margin-bottom: 18px;
//     }

//     .pf-h1{
//       font-size: 72px;
//       line-height: .98;
//       font-weight: 950;
//       letter-spacing: -1.2px;
//       margin: 0 0 18px 0;
//     }

//     .pf-h1 .accent{
//       color: #4aa3ff;
//     }

//     .pf-h1 .gradient{
//       background: linear-gradient(90deg, #2b6cff, #22d3ee);
//       -webkit-background-clip: text;
//       background-clip: text;
//       color: transparent;
//     }

//     .pf-lead{
//       font-size: 22px;
//       line-height: 1.55;
//       color: var(--muted);
//       max-width: 820px;
//       margin: 0 0 44px 0;
//     }

//     /* Cards */
//     .pf-grid3{
//       display:grid;
//       grid-template-columns: repeat(3, minmax(0, 1fr));
//       gap: 28px;
//       margin-top: 10px;
//     }

//     .pf-card{
//       text-align:left;
//       padding: 38px 34px;
//       border-radius: 34px;
//       border: 1px solid var(--border);
//       background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
//       box-shadow: 0 10px 22px rgba(0,0,0,.35);
//       cursor:pointer;
//       transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
//       min-height: 340px;
//       display:flex;
//       flex-direction:column;
//       gap: 12px;
//     }

//     .pf-card:hover{
//       transform: translateY(-4px);
//       box-shadow: var(--shadow);
//       border-color: rgba(255,255,255,.14);
//     }

//     .pf-card.primary{
//       background: linear-gradient(180deg, rgba(43,108,255,.95), rgba(31,94,255,.90));
//       border-color: rgba(120,190,255,.35);
//       box-shadow: 0 24px 48px rgba(43,108,255,.22);
//     }

//     .pf-icon-chip{
//       width: 54px;
//       height: 54px;
//       border-radius: 18px;
//       display:grid;
//       place-items:center;
//       background: rgba(255,255,255,.05);
//       border: 1px solid rgba(255,255,255,.08);
//       margin-bottom: 10px;
//     }

//     .pf-card.primary .pf-icon-chip{
//       background: rgba(255,255,255,.16);
//       border-color: rgba(255,255,255,.20);
//     }

//     .pf-card-title{
//       font-size: 30px;
//       font-weight: 950;
//       letter-spacing: -0.3px;
//       margin: 8px 0 0 0;
//     }

//     .pf-card-desc{
//       font-size: 18px;
//       line-height: 1.55;
//       color: rgba(255,255,255,.70);
//       margin: 0;
//       max-width: 360px;
//     }

//     .pf-card.primary .pf-card-desc{
//       color: rgba(255,255,255,.86);
//     }

//     .pf-card-action{
//       margin-top: auto;
//       font-weight: 900;
//       display:flex;
//       align-items:center;
//       gap: 10px;
//       font-size: 18px;
//       color: rgba(255,255,255,.92);
//     }

//     .pf-card:not(.primary) .pf-card-action{
//       color: rgba(255,255,255,.88);
//     }

//     /* Assessment surfaces */
//     .pf-panel{
//       border-radius: 28px;
//       border: 1px solid var(--border);
//       background: rgba(255,255,255,.02);
//       box-shadow: var(--shadow2);
//     }

//     .pf-section-title{
//       font-size: 34px;
//       font-weight: 950;
//       letter-spacing: -.4px;
//       margin: 0 0 18px 0;
//     }

//     .pf-back{
//       display:inline-flex;
//       align-items:center;
//       gap: 10px;
//       border-radius: 999px;
//       border: 1px solid var(--border);
//       background: rgba(255,255,255,.02);
//       color: rgba(255,255,255,.80);
//       padding: 10px 14px;
//       cursor:pointer;
//     }

//     .pf-muted{
//       color: var(--muted);
//     }

//     /* Simple responsive */
//     @media (max-width: 1100px){
//       .pf-sidebar{ width: 320px; }
//       .pf-h1{ font-size: 62px; }
//     }
//     @media (max-width: 920px){
//       .pf-shell{ flex-direction: column; }
//       .pf-sidebar{
//         width: 100%;
//         border-right: none;
//         border-bottom: 1px solid var(--border);
//       }
//       .pf-main{ padding: 26px 18px; }
//       .pf-grid3{ grid-template-columns: 1fr; }
//       .pf-h1{ font-size: 52px; }
//     }
//   `}</style>
// );

// /* ---------------- TYPES ---------------- */

// type Page = "home" | "assessment" | "history";
// type Step = "service" | "age" | "flow";
// type Service = "uti" | "impetigo";
// type AgeBand = "<1" | "1–15" | "16–64" | "65+";

// interface FlowNode {
//   id: string;
//   question: string;
//   description?: string;
//   options: {
//     label: string;
//     nextId?: string;
//     outcome?: string;
//     danger?: boolean;
//   }[];
// }

// interface FlowStep {
//   nodeId: string;
//   question: string;
//   answer: string;
// }

// interface RecordItem {
//   id: number;
//   service: Service;
//   ageBand: AgeBand;
//   outcome: string;
//   pathway: FlowStep[];
//   createdAt: string;
// }

// /* ---------------- PATHWAYS ---------------- */

// const PATHWAYS: Record<Service, Record<string, FlowNode>> = {
//   uti: {
//     start: {
//       id: "start",
//       question: "NEWS2 score or sepsis risk?",
//       description: "Any concern of sepsis or clinical instability?",
//       options: [
//         { label: "Yes", outcome: "Urgent referral / 999", danger: true },
//         { label: "No", nextId: "pyelo" },
//       ],
//     },
//     pyelo: {
//       id: "pyelo",
//       question: "Signs of pyelonephritis?",
//       description: "Flank pain, rigors, vomiting, fever?",
//       options: [
//         { label: "Yes", outcome: "Urgent referral", danger: true },
//         { label: "No", nextId: "exclusions" },
//       ],
//     },
//     exclusions: {
//       id: "exclusions",
//       question: "Any exclusions present?",
//       description: "Pregnancy, catheter, vaginal discharge, recurrent UTI?",
//       options: [
//         { label: "Yes", outcome: "Refer to GP" },
//         { label: "No", nextId: "symptoms" },
//       ],
//     },
//     symptoms: {
//       id: "symptoms",
//       question: "Key UTI symptoms present?",
//       description: "Dysuria, nocturia, cloudy urine?",
//       options: [
//         { label: "None", outcome: "UTI unlikely – self care" },
//         { label: "Two or more", outcome: "UTI likely – Nitrofurantoin 3 days" },
//       ],
//     },
//   },

//   impetigo: {
//     start: {
//       id: "start",
//       question: "Signs of systemic illness?",
//       description: "Fever, unwell child, sepsis concern?",
//       options: [
//         { label: "Yes", outcome: "Urgent referral", danger: true },
//         { label: "No", nextId: "distribution" },
//       ],
//     },
//     distribution: {
//       id: "distribution",
//       question: "Extent of impetigo?",
//       description: "Localised vs widespread lesions",
//       options: [
//         { label: "Localised (≤3 lesions)", outcome: "Hydrogen peroxide 1% cream for 5 days" },
//         { label: "Widespread (≥4 lesions)", outcome: "Flucloxacillin 5 days (or clarithromycin if allergic)" },
//       ],
//     },
//   },
// };

// /* ---------------- LAYOUT ---------------- */

// const Layout = ({
//   page,
//   setPage,
//   children,
// }: {
//   page: Page;
//   setPage: (p: Page) => void;
//   children: React.ReactNode;
// }) => (
//   <div className="pf-shell">
//     <GlobalStyles />

//     <aside className="pf-sidebar">
//       <div className="pf-brand">
//         <div className="pf-logo">
//           <Activity size={22} color="#fff" />
//         </div>
//         <div>
//           <div className="pf-brand-title">
//             Pharmacy<span>First</span>
//           </div>
//           <div className="pf-brand-sub">Clinical Pathways</div>
//         </div>
//       </div>

//       <div className="pf-nav">
//         {[
//           { id: "home", icon: Home, label: "Home" },
//           { id: "assessment", icon: Activity, label: "New Assessment" },
//           { id: "history", icon: ClipboardList, label: "History" },
//         ].map((n) => (
//           <button
//             key={n.id}
//             onClick={() => setPage(n.id as Page)}
//             className={`pf-nav-btn ${page === n.id ? "active" : ""}`}
//           >
//             <n.icon size={20} />
//             {n.label}
//           </button>
//         ))}
//       </div>
//     </aside>

//     <main className="pf-main">
//       <div className="pf-wrap">{children}</div>
//     </main>
//   </div>
// );

// /* ---------------- APP ---------------- */

// export default function PharmacyFirstApp() {
//   const [page, setPage] = useState<Page>("home");
//   const [step, setStep] = useState<Step>("service");
//   const [service, setService] = useState<Service | null>(null);
//   const [ageBand, setAgeBand] = useState<AgeBand | null>(null);
//   const [nodeId, setNodeId] = useState("start");
//   const [history, setHistory] = useState<FlowStep[]>([]);
//   const [outcome, setOutcome] = useState<string | null>(null);
//   const [records, setRecords] = useState<RecordItem[]>([]);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [history, outcome]);

//   const answer = (label: string, next?: string, res?: string) => {
//     if (!service) return;
//     const node = PATHWAYS[service][nodeId];
//     setHistory([...history, { nodeId, question: node.question, answer: label }]);
//     if (res) setOutcome(res);
//     else if (next) setNodeId(next);
//   };

//   const reset = () => {
//     setStep("service");
//     setService(null);
//     setAgeBand(null);
//     setNodeId("start");
//     setHistory([]);
//     setOutcome(null);
//   };

//   const save = () => {
//     if (!service || !ageBand || !outcome) return;
//     setRecords([
//       {
//         id: Date.now(),
//         service,
//         ageBand,
//         outcome,
//         pathway: history,
//         createdAt: new Date().toISOString(),
//       },
//       ...records,
//     ]);
//     setPage("history");
//     reset();
//   };

//   return (
//     <Layout page={page} setPage={setPage}>
//       {/* HOME */}
//       {page === "home" && (
//         <>
//           <div>
//             <div className="pf-pill">NHS PHARMACY FIRST</div>

//             <h1 className="pf-h1">
//               Clinical Assessment
//               <br />
//               <span className="gradient">Protocol System</span>
//             </h1>

//             <p className="pf-lead">
//               Start a new patient assessment using standardized clinical pathways.
//             </p>
//           </div>

//           <div className="pf-grid3">
//             <HomeCard
//               title="Start Assessment"
//               description="Begin a new consultation for UTI or Impetigo."
//               action="Start Now"
//               primary
//               icon={<Activity size={22} />}
//               onClick={() => setPage("assessment")}
//             />
//             <HomeCard
//               title="Patient History"
//               description="Review past assessments and outcomes."
//               action="View Log"
//               icon={<ClipboardList size={22} />}
//               onClick={() => setPage("history")}
//             />
//             <HomeCard
//               title="Protocols"
//               description="View clinical guidelines and exclusions."
//               action="Read Docs"
//               icon={<AlertTriangle size={22} />}
//               onClick={() => {}}
//             />
//           </div>
//         </>
//       )}

//       {/* ASSESSMENT */}
//       {page === "assessment" && (
//         <>
//           {step === "service" && (
//             <>
//               <h2 className="pf-section-title">Select Service</h2>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//                 <ServiceCard
//                   title="Uncomplicated UTI"
//                   subtitle="Women 16–64 years"
//                   icon={<Stethoscope size={22} />}
//                   onClick={() => {
//                     setService("uti");
//                     setStep("age");
//                   }}
//                 />
//                 <ServiceCard
//                   title="Impetigo"
//                   subtitle="Adults and children >1 year"
//                   icon={<AlertTriangle size={22} />}
//                   onClick={() => {
//                     setService("impetigo");
//                     setStep("age");
//                   }}
//                 />
//               </div>
//             </>
//           )}

//           {step === "age" && (
//             <>
//               <button className="pf-back" onClick={() => setStep("service")} style={{ marginBottom: 16 }}>
//                 <ArrowLeft size={18} /> Back
//               </button>

//               <h2 className="pf-section-title">Patient Age</h2>

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                 {(["<1", "1–15", "16–64", "65+"] as AgeBand[]).map((a) => (
//                   <AgeCard
//                     key={a}
//                     label={a}
//                     icon={<User size={20} />}
//                     onClick={() => {
//                       setAgeBand(a);
//                       setStep("flow");
//                     }}
//                   />
//                 ))}
//               </div>
//             </>
//           )}

//           {step === "flow" && service && (
//             <>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
//                 <div>
//                   <div style={{ fontWeight: 950, fontSize: 22, letterSpacing: "-.2px" }}>
//                     {service.toUpperCase()} Assessment{" "}
//                     <span className="pf-muted" style={{ fontWeight: 800, fontSize: 14, marginLeft: 8 }}>
//                       {ageBand}
//                     </span>
//                   </div>
//                   <div className="pf-muted" style={{ marginTop: 6 }}>
//                     Follow the pathway questions to determine the safest outcome.
//                   </div>
//                 </div>

//                 <button onClick={reset} className="pf-back">
//                   <RotateCcw size={16} /> Restart
//                 </button>
//               </div>

//               <div style={{ position: "relative" }}>
//                 <div
//                   style={{
//                     position: "absolute",
//                     left: 18,
//                     top: 18,
//                     bottom: 0,
//                     width: 2,
//                     background: "rgba(255,255,255,.06)",
//                   }}
//                 />

//                 {history.map((h, i) => (
//                   <TimelineDone key={i} {...h} />
//                 ))}

//                 {!outcome && (
//                   <TimelineQuestion node={PATHWAYS[service][nodeId]} onAnswer={answer} />
//                 )}

//                 {outcome && <TimelineOutcome outcome={outcome} onSave={save} />}

//                 <div ref={bottomRef} />
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {/* HISTORY */}
//       {page === "history" && (
//         <>
//           <h2 className="pf-section-title">Assessment History</h2>

//           {records.length === 0 && (
//             <div className="pf-panel" style={{ padding: 54, textAlign: "center" }}>
//               <FileText size={46} color="rgba(255,255,255,.35)" />
//               <div style={{ marginTop: 14, color: "rgba(255,255,255,.55)", fontWeight: 700 }}>
//                 No records found.
//               </div>
//             </div>
//           )}

//           {records.map((r) => (
//             <div
//               key={r.id}
//               className="pf-panel"
//               style={{
//                 padding: 22,
//                 marginBottom: 16,
//                 borderRadius: 22,
//                 background: "rgba(255,255,255,.02)",
//               }}
//             >
//               <div style={{ fontWeight: 950, fontSize: 18 }}>{r.outcome}</div>
//               <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 6 }}>
//                 {r.service.toUpperCase()} • {r.ageBand} • {new Date(r.createdAt).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </Layout>
//   );
// }

// /* ---------------- COMPONENTS ---------------- */

// function HomeCard({
//   title,
//   description,
//   action,
//   onClick,
//   primary,
//   icon,
// }: {
//   title: string;
//   description: string;
//   action: string;
//   onClick: () => void;
//   primary?: boolean;
//   icon: React.ReactNode;
// }) {
//   return (
//     <button onClick={onClick} className={`pf-card ${primary ? "primary" : ""}`}>
//       <div className="pf-icon-chip">{icon}</div>
//       <div className="pf-card-title">{title}</div>
//       <p className="pf-card-desc">{description}</p>
//       <div className="pf-card-action">
//         {action} <ChevronRight size={18} />
//       </div>
//     </button>
//   );
// }

// function ServiceCard({
//   title,
//   subtitle,
//   onClick,
//   icon,
// }: {
//   title: string;
//   subtitle: string;
//   onClick: () => void;
//   icon: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className="pf-panel"
//       style={{
//         padding: 24,
//         borderRadius: 22,
//         cursor: "pointer",
//         textAlign: "left",
//         display: "flex",
//         gap: 14,
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           width: 44,
//           height: 44,
//           borderRadius: 16,
//           display: "grid",
//           placeItems: "center",
//           background: "rgba(255,255,255,.04)",
//           border: "1px solid rgba(255,255,255,.07)",
//         }}
//       >
//         {icon}
//       </div>
//       <div>
//         <div style={{ fontWeight: 950, fontSize: 18 }}>{title}</div>
//         <div style={{ color: "rgba(255,255,255,.55)", marginTop: 6 }}>{subtitle}</div>
//       </div>
//     </button>
//   );
// }

// function AgeCard({
//   label,
//   onClick,
//   icon,
// }: {
//   label: AgeBand;
//   onClick: () => void;
//   icon: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className="pf-panel"
//       style={{
//         padding: 18,
//         borderRadius: 20,
//         cursor: "pointer",
//         textAlign: "left",
//         display: "flex",
//         gap: 12,
//         alignItems: "center",
//       }}
//     >
//       <div
//         style={{
//           width: 40,
//           height: 40,
//           borderRadius: 14,
//           display: "grid",
//           placeItems: "center",
//           background: "rgba(43,108,255,.10)",
//           border: "1px solid rgba(43,108,255,.25)",
//           color: "#7fc2ff",
//         }}
//       >
//         {icon}
//       </div>
//       <div style={{ fontWeight: 900 }}>{label}</div>
//     </button>
//   );
// }

// function TimelineDone({ question, answer }: { question: string; answer: string }) {
//   return (
//     <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
//       <div
//         style={{
//           width: 38,
//           height: 38,
//           borderRadius: "999px",
//           background: "rgba(34,197,94,.14)",
//           border: "1px solid rgba(34,197,94,.38)",
//           display: "grid",
//           placeItems: "center",
//           zIndex: 1,
//         }}
//       >
//         <Check size={16} color="rgba(255,255,255,.95)" />
//       </div>

//       <div
//         className="pf-panel"
//         style={{
//           padding: 16,
//           borderRadius: 18,
//           flex: 1,
//           background: "rgba(255,255,255,.015)",
//         }}
//       >
//         <div style={{ fontSize: 12, color: "rgba(255,255,255,.50)", fontWeight: 800 }}>{question}</div>
//         <div style={{ fontWeight: 900, marginTop: 6 }}>{answer}</div>
//       </div>
//     </div>
//   );
// }

// function TimelineQuestion({
//   node,
//   onAnswer,
// }: {
//   node: FlowNode;
//   onAnswer: (label: string, next?: string, res?: string) => void;
// }) {
//   return (
//     <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
//       <div
//         style={{
//           width: 38,
//           height: 38,
//           borderRadius: "999px",
//           background: "rgba(43,108,255,.95)",
//           boxShadow: "0 14px 28px rgba(43,108,255,.22)",
//           display: "grid",
//           placeItems: "center",
//           fontWeight: 950,
//           zIndex: 1,
//         }}
//       >
//         ?
//       </div>

//       <div className="pf-panel" style={{ padding: 20, borderRadius: 22, flex: 1 }}>
//         <div style={{ fontSize: 20, fontWeight: 950, letterSpacing: "-.2px" }}>{node.question}</div>
//         {node.description && (
//           <div style={{ marginTop: 10, color: "rgba(255,255,255,.58)", lineHeight: 1.5 }}>
//             {node.description}
//           </div>
//         )}

//         <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
//           {node.options.map((o, i) => (
//             <button
//               key={i}
//               onClick={() => onAnswer(o.label, o.nextId, o.outcome)}
//               style={{
//                 padding: "14px 14px",
//                 borderRadius: 16,
//                 border: "1px solid rgba(255,255,255,.10)",
//                 background: o.danger ? "rgba(239,68,68,.10)" : "rgba(255,255,255,.03)",
//                 color: "#fff",
//                 textAlign: "left",
//                 fontWeight: 850,
//                 cursor: "pointer",
//                 transition: "transform .12s ease, background .12s ease, border-color .12s ease",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
//             >
//               {o.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function TimelineOutcome({ outcome, onSave }: { outcome: string; onSave: () => void }) {
//   return (
//     <div style={{ display: "flex", gap: 16 }}>
//       <div
//         style={{
//           width: 38,
//           height: 38,
//           borderRadius: "999px",
//           background: "rgba(34,197,94,.20)",
//           border: "1px solid rgba(34,197,94,.42)",
//           display: "grid",
//           placeItems: "center",
//           zIndex: 1,
//         }}
//       >
//         <Check size={16} color="rgba(255,255,255,.95)" />
//       </div>

//       <div
//         className="pf-panel"
//         style={{
//           padding: 26,
//           borderRadius: 26,
//           flex: 1,
//           textAlign: "center",
//           border: "1px solid rgba(34,197,94,.35)",
//           background: "rgba(34,197,94,.05)",
//         }}
//       >
//         <div style={{ fontSize: 12, letterSpacing: 1.2, color: "rgba(134,239,172,.95)", fontWeight: 950 }}>
//           CLINICAL RECOMMENDATION
//         </div>
//         <div style={{ fontSize: 26, fontWeight: 950, marginTop: 12 }}>{outcome}</div>

//         <button
//           onClick={onSave}
//           style={{
//             marginTop: 16,
//             padding: "12px 18px",
//             borderRadius: 999,
//             background: "linear-gradient(180deg, rgba(43,108,255,.98), rgba(31,94,255,.98))",
//             border: "1px solid rgba(120,190,255,.30)",
//             color: "#fff",
//             fontWeight: 950,
//             cursor: "pointer",
//             display: "inline-flex",
//             gap: 10,
//             alignItems: "center",
//             boxShadow: "0 18px 34px rgba(43,108,255,.22)",
//           }}
//         >
//           <Save size={16} /> Save to History
//         </button>
//       </div>
//     </div>
//   );
// }
