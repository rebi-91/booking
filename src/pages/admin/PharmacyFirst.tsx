// import React, { useMemo, useState } from "react";

// type AgeBand = "<1" | "1-4" | "5-11" | "12-15" | "16-64";
// type ConditionKey = "aom" | "sore_throat" | "sinusitis" | "uti";
// type Step = 1 | 2 | 3 | 4;

// type Condition = {
//   key: ConditionKey;
//   label: string;
//   eligibleAges: AgeBand[];
//   keyCriteriaTitle: string;
//   keyCriteriaBullets: string[];
//   gatewayToAntimicrobial: string[];
//   firstLine: string[];
//   penAllergy?: string[];
//   notes?: string[];
// };

// const AGE_BANDS: { value: AgeBand; label: string }[] = [
//   { value: "<1", label: "<1 year" },
//   { value: "1-4", label: "1–4 years" },
//   { value: "5-11", label: "5–11 years" },
//   { value: "12-15", label: "12–15 years" },
//   { value: "16-64", label: "16–64 years" },
//   { value: ">64", label: ">64 years" },
// ];

// const CONDITIONS: Condition[] = [
//   {
//     key: "aom",
//     label: "Acute otitis media (AOM)",
//     eligibleAges: ["1-4", "5-11", "12-15", ">64 years"],
//     keyCriteriaTitle: "Key criteria (symptoms + otoscopy)",
//     keyCriteriaBullets: [
//       "Acute onset symptoms (older: earache; younger: tugging/rubbing ear; very young may have fever/crying/poor feeding/restlessness).",
//       "Otoscopy findings consistent with AOM (e.g., red/cloudy tympanic membrane, bulging tympanic membrane, or perforation/otorrhoea).",
//       "Consider high-risk/serious illness features and exclude where appropriate (e.g., recurrent AOM, severe systemic illness).",
//     ],
//     gatewayToAntimicrobial: [
//       "Consider antibiotics if otorrhoea/perforation OR severe symptoms OR symptoms >3 days OR <2 years with bilateral AOM (shared decision).",
//     ],
//     firstLine: ["Amoxicillin (per local PGD; commonly 5 days)."],
//     penAllergy: [
//       "Clarithromycin (or Erythromycin if pregnancy is relevant in older teens, per PGD).",
//     ],
//     notes: [
//       "Self-care + analgesia for all.",
//       "Review if no improvement in 3–5 days; urgent referral if worsening/very unwell.",
//     ],
//   },
//   {
//     key: "sore_throat",
//     label: "Acute sore throat",
//     eligibleAges: ["5-11", "12-15", "16-64", ">64 years"],
//     keyCriteriaTitle: "Key criteria (FeverPAIN score + red flags)",
//     keyCriteriaBullets: [
//       "Use FeverPAIN (1 point each): fever (past 24h), purulent tonsils, attend rapidly (≤3 days), severe tonsillar inflammation, no cough/coryza.",
//       "Exclude red flags/complications (e.g., quinsy, scarlet fever, glandular fever, immunosuppression, suspected cancer).",
//     ],
//     gatewayToAntimicrobial: [
//       "Antibiotic usually only if FeverPAIN 4–5 AND severe symptoms (shared decision).",
//     ],
//     firstLine: ["Phenoxymethylpenicillin (Penicillin V) (commonly 5 days)."],
//     penAllergy: ["Clarithromycin (or Erythromycin if pregnancy is relevant, per PGD)."],
//     notes: [
//       "FeverPAIN 0–1: self-care; consider review at ~1 week if not improved.",
//       "FeverPAIN 2–3: self-care; consider review in 3–5 days if not improved.",
//     ],
//   },
//   {
//     key: "sinusitis",
//     label: "Acute sinusitis",
//     eligibleAges: ["12-15", "16-64"],
//     keyCriteriaTitle: "Key criteria (symptoms + duration + bacterial features)",
//     keyCriteriaBullets: [
//       "Diagnosis: nasal blockage OR nasal discharge PLUS one or more: facial pain/pressure (or headache), reduced smell (adults), cough (children).",
//       "Gateway: symptoms >10 days with little/no improvement.",
//       "Bacterial features: need ≥2 (e.g., double-worsening, fever >38°C, unremitting purulent nasal discharge, severe unilateral pain over teeth/jaw).",
//     ],
//     gatewayToAntimicrobial: [
//       "If >10 days with little/no improvement AND ≥2 bacterial features → consider escalation (shared decision).",
//       "Often offer high-dose intranasal corticosteroid first; antibiotics only if needed/unsuitable/ineffective (per PGD).",
//     ],
//     firstLine: [
//       "High-dose intranasal corticosteroid (e.g., fluticasone/mometasone) for 14 days (off-label as per pathway).",
//     ],
//     penAllergy: [
//       "If antibiotics required: clarithromycin or doxycycline (erythromycin if pregnancy is relevant, per PGD).",
//     ],
//     notes: [
//       "Usually viral; symptoms can last 2–3 weeks.",
//       "Review if not improving (commonly ~7 days) or earlier if worsening.",
//     ],
//   },
//   {
//     key: "uti",
//     label: "Uncomplicated lower UTI",
//     eligibleAges: ["16-64"],
//     keyCriteriaTitle: "Key criteria (exclude red flags + key urinary symptoms)",
//     keyCriteriaBullets: [
//       "Exclude sepsis/pyelonephritis: flank/kidney pain, rigors/chills, fever, nausea/vomiting, new/different myalgia/flu-like illness.",
//       "Exclude alternative diagnoses/causes: pregnancy, vaginal discharge/thrush, urethritis/STI risk, immunosuppression, catheter, recurrent UTI, GSM/atrophy.",
//       "Key diagnostic symptoms: dysuria, new nocturia, cloudy urine (visual inspection if practicable).",
//     ],
//     gatewayToAntimicrobial: [
//       "If 2–3 key symptoms → consider antibiotic (shared decision; TARGET UTI resources).",
//       "If 0 key symptoms → UTI less likely; if 1 symptom → consider other diagnosis / referral as appropriate.",
//     ],
//     firstLine: [
//       "Nitrofurantoin 100mg MR twice daily for 3 days (or 50mg IR four times daily if MR unavailable), taken with food/milk (per PGD).",
//     ],
//     notes: [
//       "Review if no improvement within 48 hours.",
//       "Urgent referral if worsening rapidly/significantly or if no response after 48h of antibiotics.",
//       "Pathway applies to non-pregnant women 16–64 (consider adding sex/pregnancy questions).",
//     ],
//   },
// ];

// // ====== THEME ======
// const COLORS = {
//   bg: "#000000",
//   card: "#141414",
//   card2: "#1b1b1b",
//   border: "#2a2a2a",
//   text: "#ffffff",
//   muted: "#bdbdbd",
//   blue: "#1d4ed8",
//   red: "#dc2626",
//   blackBtn: "#0b0b0b",
// };

// function Section({
//   title,
//   subtitle,
//   children,
//   centerContent,
// }: {
//   title: string;
//   subtitle?: string;
//   children: React.ReactNode;
//   centerContent?: boolean;
// }) {
//   return (
//     <div
//       style={{
//         background: COLORS.card,
//         border: `1px solid ${COLORS.border}`,
//         borderRadius: 18,
//         padding: 18,
//         minHeight: 520,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div style={{ marginBottom: 14 }}>
//         <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text }}>
//           {title}
//         </div>
//         {subtitle && (
//           <div style={{ marginTop: 6, color: COLORS.muted, lineHeight: 1.4 }}>
//             {subtitle}
//           </div>
//         )}
//       </div>

//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: centerContent ? "center" : "stretch",
//           justifyContent: centerContent ? "center" : "flex-start",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// function Tile({
//   title,
//   selected,
//   disabled,
//   onClick,
// }: {
//   title: string;
//   selected: boolean;
//   disabled?: boolean;
//   onClick: () => void;
// }) {
//   const bg = selected ? COLORS.blue : COLORS.card2;
//   const border = selected ? COLORS.blue : COLORS.border;

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         width: "100%",
//         textAlign: "center",
//         padding: 16,
//         borderRadius: 18,
//         border: `1px solid ${border}`,
//         background: disabled ? "#101010" : bg,
//         color: COLORS.text,
//         cursor: disabled ? "not-allowed" : "pointer",
//         fontWeight: 900,
//         fontSize: 15,
//         minHeight: 64,
//       }}
//     >
//       {title}
//     </button>
//   );
// }

// function ActionButton({
//   variant,
//   children,
//   onClick,
//   disabled,
// }: {
//   variant: "next" | "back" | "neutral" | "selected";
//   children: React.ReactNode;
//   onClick: () => void;
//   disabled?: boolean;
// }) {
//   let bg = COLORS.blackBtn;
//   if (variant === "next") bg = COLORS.blue;
//   if (variant === "back") bg = COLORS.red;
//   if (variant === "selected") bg = COLORS.blue;

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         padding: "12px 14px",
//         borderRadius: 14,
//         border: `1px solid ${disabled ? COLORS.border : bg}`,
//         background: disabled ? "#101010" : bg,
//         color: "#fff",
//         cursor: disabled ? "not-allowed" : "pointer",
//         fontWeight: 900,
//         minWidth: 120,
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// export default function App() {
//   const [step, setStep] = useState<Step>(1);
//   const [conditionKey, setConditionKey] = useState<ConditionKey | "">("");
//   const [ageBand, setAgeBand] = useState<AgeBand | "">("");
//   const [meetsCriteria, setMeetsCriteria] = useState<"yes" | "no" | "">("");

//   const condition = useMemo(
//     () => CONDITIONS.find((c) => c.key === conditionKey) ?? null,
//     [conditionKey]
//   );

//   const eligible = useMemo(() => {
//     if (!condition || !ageBand) return false;
//     return condition.eligibleAges.includes(ageBand);
//   }, [condition, ageBand]);

//   const ageLabel = useMemo(
//     () => AGE_BANDS.find((a) => a.value === ageBand)?.label ?? "",
//     [ageBand]
//   );

//   function resetAll() {
//     setStep(1);
//     setConditionKey("");
//     setAgeBand("");
//     setMeetsCriteria("");
//   }

//   function goBack() {
//     if (step === 1) return;
//     setStep((prev) => (prev - 1) as Step);
//   }

//   function goNext() {
//     if (step === 1) {
//       if (!conditionKey) return;
//       setStep(2);
//       return;
//     }
//     if (step === 2) {
//       if (!ageBand) return;
//       if (!eligible) return;
//       setStep(3);
//       return;
//     }
//     if (step === 3) {
//       if (meetsCriteria !== "yes") return;
//       setStep(4);
//       return;
//     }
//   }

//   function selectCondition(k: ConditionKey) {
//     setConditionKey(k);
//     setAgeBand("");
//     setMeetsCriteria("");
//   }

//   function selectAge(a: AgeBand) {
//     setAgeBand(a);
//     setMeetsCriteria("");
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: COLORS.bg,
//         padding: 24,
//         fontFamily:
//           'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
//         color: COLORS.text,
//       }}
//     >
//       <div style={{ maxWidth: 760, margin: "0 auto" }}>
//         {/* Header */}
//         <div style={{ marginBottom: 16 }}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               gap: 12,
//               flexWrap: "wrap",
//             }}
//           >
//             <div>
//               <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>
//                 Pharmacy First Questionnaire
//               </h1>
//               <div style={{ marginTop: 8, color: COLORS.muted }}>
//                 Select using tiles, then press Next.
//               </div>
//             </div>
//             <ActionButton variant="neutral" onClick={resetAll}>
//               Reset
//             </ActionButton>
//           </div>
//         </div>

//         {/* STEP 1 */}
//         {step === 1 && (
//           <Section
//             title="1) What Pharmacy First condition are you treating?"
//             subtitle="Select one condition."
//             centerContent
//           >
//             <div
//               style={{
//                 width: "100%",
//                 maxWidth: 520,
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 12,
//               }}
//             >
//               {CONDITIONS.map((c) => (
//                 <Tile
//                   key={c.key}
//                   title={c.label}
//                   selected={conditionKey === c.key}
//                   onClick={() => selectCondition(c.key)}
//                 />
//               ))}

//               <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
//                 <ActionButton variant="next" onClick={goNext} disabled={!conditionKey}>
//                   Next
//                 </ActionButton>
//               </div>
//             </div>
//           </Section>
//         )}

//         {/* STEP 2 */}
//         {step === 2 && (
//           <Section
//             title="2) How old is the patient?"
//             subtitle={condition ? `Selected condition: ${condition.label}` : "Select a condition first."}
//             centerContent
//           >
//             <div
//               style={{
//                 width: "100%",
//                 maxWidth: 520,
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 12,
//               }}
//             >
//               {AGE_BANDS.map((a) => (
//                 <Tile
//                   key={a.value}
//                   title={a.label}
//                   selected={ageBand === a.value}
//                   disabled={!condition}
//                   onClick={() => selectAge(a.value)}
//                 />
//               ))}

//               {condition && ageBand && (
//                 <div
//                   style={{
//                     marginTop: 2,
//                     padding: 12,
//                     borderRadius: 16,
//                     border: `1px solid ${eligible ? "#1e7f3b" : "#7f1d1d"}`,
//                     background: eligible ? "#06140a" : "#160606",
//                     color: eligible ? "#7cf0a0" : "#ffb4b4",
//                     fontWeight: 900,
//                     textAlign: "center",
//                   }}
//                 >
//                   {eligible
//                     ? "Eligible age band for this condition."
//                     : "Not eligible for this condition/age band. Choose a different age band."}
//                 </div>
//               )}

//               <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
//                 <ActionButton variant="back" onClick={goBack}>
//                   Back
//                 </ActionButton>
//                 <ActionButton variant="next" onClick={goNext} disabled={!ageBand || !eligible}>
//                   Next
//                 </ActionButton>
//               </div>
//             </div>
//           </Section>
//         )}

//         {/* STEP 3 */}
//         {step === 3 && condition && ageBand && eligible && (
//           <Section title="3) Key criteria assessment tool" subtitle={`${condition.label} • ${ageLabel}`}>
//             <div
//               style={{
//                 background: COLORS.card2,
//                 border: `1px solid ${COLORS.border}`,
//                 borderRadius: 18,
//                 padding: 14,
//               }}
//             >
//               <div style={{ fontWeight: 950, marginBottom: 10 }}>
//                 {condition.keyCriteriaTitle}
//               </div>
//               <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#e8e8e8" }}>
//                 {condition.keyCriteriaBullets.map((b, i) => (
//                   <li key={i}>{b}</li>
//                 ))}
//               </ul>
//             </div>

//             <div style={{ marginTop: 14 }}>
//               <div style={{ fontWeight: 950, marginBottom: 10 }}>
//                 Does the patient meet the key criteria?
//               </div>
//               <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                 <ActionButton
//                   variant={meetsCriteria === "yes" ? "selected" : "neutral"}
//                   onClick={() => setMeetsCriteria("yes")}
//                 >
//                   Yes
//                 </ActionButton>
//                 <ActionButton
//                   variant={meetsCriteria === "no" ? "selected" : "neutral"}
//                   onClick={() => setMeetsCriteria("no")}
//                 >
//                   No
//                 </ActionButton>
//               </div>

//               {meetsCriteria === "no" && (
//                 <div
//                   style={{
//                     marginTop: 12,
//                     padding: 12,
//                     borderRadius: 16,
//                     border: "1px solid #7f1d1d",
//                     background: "#160606",
//                     color: "#ffb4b4",
//                     fontWeight: 900,
//                   }}
//                 >
//                   Criteria not met → provide self-care / consider alternative diagnosis / refer as appropriate.
//                 </div>
//               )}
//             </div>

//             <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 10 }}>
//               <ActionButton variant="back" onClick={goBack}>
//                 Back
//               </ActionButton>
//               <ActionButton variant="next" onClick={goNext} disabled={meetsCriteria !== "yes"}>
//                 Next
//               </ActionButton>
//             </div>
//           </Section>
//         )}

//         {/* STEP 4 */}
//         {step === 4 && condition && ageBand && eligible && meetsCriteria === "yes" && (
//           <Section title="Summary" subtitle={`${condition.label} • ${ageLabel}`}>
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "separate",
//                   borderSpacing: 0,
//                   minWidth: 760,
//                   border: `1px solid ${COLORS.border}`,
//                   borderRadius: 16,
//                   overflow: "hidden",
//                   background: COLORS.card2,
//                 }}
//               >
//                 <thead>
//                   <tr>
//                     {["Gateway to antimicrobial", "First-line medicine", "If penicillin allergy (if applicable)"].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           textAlign: "left",
//                           padding: 12,
//                           borderBottom: `1px solid ${COLORS.border}`,
//                           fontSize: 13,
//                           color: COLORS.muted,
//                           background: "#101010",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td style={{ padding: 12, verticalAlign: "top", borderBottom: `1px solid ${COLORS.border}` }}>
//                       <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
//                         {condition.gatewayToAntimicrobial.map((x, i) => (
//                           <li key={i}>{x}</li>
//                         ))}
//                       </ul>
//                     </td>
//                     <td style={{ padding: 12, verticalAlign: "top", borderBottom: `1px solid ${COLORS.border}` }}>
//                       <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
//                         {condition.firstLine.map((x, i) => (
//                           <li key={i}>{x}</li>
//                         ))}
//                       </ul>
//                     </td>
//                     <td style={{ padding: 12, verticalAlign: "top", borderBottom: `1px solid ${COLORS.border}` }}>
//                       {condition.penAllergy ? (
//                         <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
//                           {condition.penAllergy.map((x, i) => (
//                             <li key={i}>{x}</li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <span style={{ color: COLORS.muted }}>Not applicable / not listed.</span>
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {condition.notes && condition.notes.length > 0 && (
//               <div
//                 style={{
//                   marginTop: 14,
//                   background: COLORS.card2,
//                   border: `1px solid ${COLORS.border}`,
//                   borderRadius: 18,
//                   padding: 14,
//                 }}
//               >
//                 <div style={{ fontWeight: 950, marginBottom: 8 }}>Notes / safety-net</div>
//                 <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
//                   {condition.notes.map((n, i) => (
//                     <li key={i}>{n}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 10 }}>
//               <ActionButton variant="back" onClick={goBack}>
//                 Back
//               </ActionButton>
//               <ActionButton variant="next" onClick={resetAll}>
//                 Start over
//               </ActionButton>
//             </div>
//           </Section>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useMemo, useState } from "react";

type AgeBand = "<1" | "1-4" | "5-11" | "12-15" | "16-64" | ">64";
type ConditionKey =
  | "uti"
  | "impetigo"
  | "insect_bite"
  | "sore_throat"
  | "sinusitis"
  | "shingles"
  | "aom";

type Step = 1 | 2 | 3 | 4;

type Rec = {
  outcomeTitle: string;
  gateway: string[];
  firstLine: string[];
  penAllergy?: string[];
  selfCare: string[];
  refer: string[];
  notes?: string[];
};

type Condition = {
  key: ConditionKey;
  label: string;
  eligibleAges: AgeBand[];
  description: string;
};

const COLORS = {
  bg: "#000000",
  card: "#141414",
  card2: "#1b1b1b",
  border: "#2a2a2a",
  text: "#ffffff",
  muted: "#bdbdbd",
  blue: "#1d4ed8",
  red: "#dc2626",
  blackBtn: "#0b0b0b",
};

const AGE_BANDS: { value: AgeBand; label: string }[] = [
  { value: "<1", label: "<1 year" },
  { value: "1-4", label: "1–4 years" },
  { value: "5-11", label: "5–11 years" },
  { value: "12-15", label: "12–15 years" },
  { value: "16-64", label: "16–64 years" },
  { value: ">64", label: ">64 years" },
];

const CONDITIONS: Condition[] = [
  {
    key: "uti",
    label: "Uncomplicated UTI (women 16 to under 65)",
    eligibleAges: ["16-64"], // explicitly excludes >64
    description:
      "Lower UTI in non-pregnant women aged 16 to under 65 (service pathway excludes pregnancy/catheter/recurrent UTI).",
  },
  {
    key: "impetigo",
    label: "Impetigo (non-bullous, age 1+)",
    eligibleAges: ["1-4", "5-11", "12-15", "16-64", ">64"],
    description:
      "Non-bullous impetigo; assess lesion count/severity and consider topical vs oral antibiotic.",
  },
  {
    key: "insect_bite",
    label: "Infected insect bite (age 1+)",
    eligibleAges: ["1-4", "5-11", "12-15", "16-64", ">64"],
    description:
      "Differentiate allergic reaction from infection; treat infection if appropriate and safety-net for anaphylaxis.",
  },
  {
    key: "sore_throat",
    label: "Acute sore throat (age 5+)",
    eligibleAges: ["5-11", "12-15", "16-64", ">64"],
    description:
      "Use FeverPAIN components + severity/red flags to decide self-care vs antibiotic.",
  },
  {
    key: "sinusitis",
    label: "Acute sinusitis (age 12+)",
    eligibleAges: ["12-15", "16-64", ">64"],
    description:
      "Symptoms >10 days with little improvement + bacterial features. Often intranasal steroid first; antibiotic if indicated.",
  },
  {
    key: "shingles",
    label: "Shingles (adults 18+)",
    eligibleAges: ["16-64", ">64"], // approximates ≥18 using our bands
    description:
      "Treat if within 1 week of rash onset AND meets criteria (e.g., age >50, severe pain/rash, non-truncal, immunosuppressed).",
  },
  {
    key: "aom",
    label: "Acute otitis media (children 1–17)",
    eligibleAges: ["1-4", "5-11", "12-15"],
    description:
      "Requires acute symptoms + otoscopy findings; consider analgesia and antibiotic if otorrhoea/perforation or severe/prolonged symptoms.",
  },
];

// ---------- UI helpers ----------
function Section({
  title,
  subtitle,
  children,
  centerContent,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  centerContent?: boolean;
}) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: 18,
        minHeight: 540,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ marginTop: 6, color: COLORS.muted, lineHeight: 1.4 }}>
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: centerContent ? "center" : "stretch",
          justifyContent: centerContent ? "center" : "flex-start",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Tile({
  title,
  selected,
  disabled,
  onClick,
}: {
  title: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const bg = selected ? COLORS.blue : COLORS.card2;
  const border = selected ? COLORS.blue : COLORS.border;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        textAlign: "center",
        padding: 16,
        borderRadius: 18,
        border: `1px solid ${border}`,
        background: disabled ? "#101010" : bg,
        color: COLORS.text,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        fontSize: 15,
        minHeight: 64,
      }}
    >
      {title}
    </button>
  );
}

function ActionButton({
  variant,
  children,
  onClick,
  disabled,
}: {
  variant: "next" | "back" | "neutral" | "selected";
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  let bg = COLORS.blackBtn;
  if (variant === "next") bg = COLORS.blue;
  if (variant === "back") bg = COLORS.red;
  if (variant === "selected") bg = COLORS.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 14px",
        borderRadius: 14,
        border: `1px solid ${disabled ? COLORS.border : bg}`,
        background: disabled ? "#101010" : bg,
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        minWidth: 120,
      }}
    >
      {children}
    </button>
  );
}

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: COLORS.card2,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: 14,
      }}
    >
      {title && (
        <div style={{ fontWeight: 950, marginBottom: 10, color: COLORS.text }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        textAlign: "center",
        padding: "10px 0",
      }}
    >
      {/* Question in one line */}
      <div
        style={{
          width: "100%",
          color: "#eaeaea",
          lineHeight: 1.4,
          whiteSpace: "normal", // ✅ allow wrapping
          overflow: "visible",
          marginBottom: 24,
          textAlign: "left",
          textOverflow: "ellipsis",
          fontWeight: 800,
        }}
        title={label} // shows full text on hover
      >
        {label}
      </div>

      {/* Answers centered below */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <ActionButton
          variant={value ? "selected" : "neutral"}
          onClick={() => onChange(true)}
        >
          Yes
        </ActionButton>
        <ActionButton
          variant={!value ? "selected" : "neutral"}
          onClick={() => onChange(false)}
        >
          No
        </ActionButton>
      </div>
    </div>
  );
}


function MultiSelect({
  items,
  selected,
  setSelected,
}: {
  items: { id: string; label: string }[];
  selected: Record<string, boolean>;
  setSelected: (next: Record<string, boolean>) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it) => (
        <Tile
          key={it.id}
          title={it.label}
          selected={!!selected[it.id]}
          onClick={() => setSelected({ ...selected, [it.id]: !selected[it.id] })}
        />
      ))}
    </div>
  );
}

// ---------- Assessment + rules (based on PDF pathways) ----------
type Answers = Record<string, boolean>;

function countTrue(ans: Answers, keys: string[]) {
  return keys.reduce((acc, k) => acc + (ans[k] ? 1 : 0), 0);
}

function buildRecommendation(
  conditionKey: ConditionKey,
  ageBand: AgeBand,
  ans: Answers
): Rec {
  // Default safety netting used in many pathways
  const commonSelfCare = [
    "Explain expected duration and that many infections are self-limiting.",
    "Offer analgesia advice (paracetamol/ibuprofen if suitable) and hydration/rest.",
    "Provide clear safety-netting: seek urgent help if worsening rapidly, very unwell, or red flags develop.",
  ];

  // ---- UTI ----
  if (conditionKey === "uti") {
    const redFlags = ans["uti_redflag"] || ans["uti_pyelonephritis"];
    const altDx = ans["uti_alt_dx"];
    const keySymCount = countTrue(ans, [
      "uti_dysuria",
      "uti_new_nocturia",
      "uti_cloudy_urine",
    ]);

    if (redFlags) {
      return {
        outcomeTitle: "Refer (possible serious illness / pyelonephritis / sepsis risk)",
        gateway: ["Do not supply under this pathway."],
        firstLine: [],
        selfCare: commonSelfCare,
        refer: [
          "Urgent same-day assessment (GP/OOH/A&E) if systemic features or suspected pyelonephritis/sepsis.",
        ],
      };
    }

    if (altDx) {
      return {
        outcomeTitle: "Consider alternative diagnosis / referral",
        gateway: ["Antibiotic under UTI pathway may not be appropriate."],
        firstLine: [],
        selfCare: commonSelfCare,
        refer: [
          "Consider pregnancy testing if relevant; consider STI/urethritis; consider GSM/vaginal causes; refer as appropriate.",
        ],
      };
    }

    if (keySymCount >= 2) {
      return {
        outcomeTitle: "Gateway to antibiotic (moderate symptoms / 2–3 key symptoms)",
        gateway: [
          "2–3 key UTI symptoms present (dysuria / new nocturia / cloudy urine).",
          "Shared decision-making using UTI resources; agree follow-up plan.",
        ],
        firstLine: [
          "Nitrofurantoin 100 mg modified-release twice daily for 3 days (with food/milk).",
          "If MR unavailable: Nitrofurantoin 50 mg immediate-release four times daily for 3 days (with food/milk).",
        ],
        selfCare: [
          ...commonSelfCare,
          "Advise review if no improvement within 48 hours.",
        ],
        refer: [
          "Urgent referral if worsening rapidly/significantly or no improvement after 48 hours of antibiotics.",
        ],
      };
    }

    return {
      outcomeTitle: "Self-care / UTI less likely or mild symptoms",
      gateway: ["Antibiotic not routinely indicated in this pathway if 0–1 key symptoms."],
      firstLine: [],
      selfCare: [
        ...commonSelfCare,
        "Consider OTC symptom relief; consider onward referral if symptoms persist or diagnosis uncertain.",
      ],
      refer: ["Refer if persistent, recurrent or complicated symptoms."],
    };
  }

  // ---- Impetigo ----
  if (conditionKey === "impetigo") {
    const complications = ans["impetigo_complication"];
    const lesionsLeq3 = ans["impetigo_lesions_leq3"];
    const h2o2Suitable = ans["impetigo_h2o2_suitable"];
    const penAllergy = ans["impetigo_pen_allergy"];

    if (complications) {
      return {
        outcomeTitle: "Refer (suspected deeper infection / complications)",
        gateway: ["Do not supply under pathway if serious complications suspected."],
        firstLine: [],
        selfCare: commonSelfCare,
        refer: ["Urgent GP/OOH assessment if rapidly spreading, systemically unwell, or deep infection suspected."],
      };
    }

    if (lesionsLeq3) {
      if (h2o2Suitable) {
        return {
          outcomeTitle: "Topical antiseptic first-line (localised ≤3 lesions/clusters)",
          gateway: ["Localised non-bullous impetigo suitable for topical antiseptic."],
          firstLine: ["Hydrogen peroxide 1% cream for 5 days + self-care."],
          selfCare: [
            ...commonSelfCare,
            "Hygiene advice: handwashing, avoid sharing towels, keep lesions clean/covered, exclude from school/work per local guidance until treated.",
          ],
          refer: ["Refer if worsening, spreading, or not improving."],
        };
      }
      return {
        outcomeTitle: "Topical antibiotic option (if antiseptic unsuitable)",
        gateway: ["Localised impetigo but topical antiseptic unsuitable/ineffective."],
        firstLine: ["Fusidic acid cream for 5 days + self-care (per PGD)."],
        selfCare: [
          ...commonSelfCare,
          "Hygiene advice as above; review if not improving.",
        ],
        refer: ["Refer if recurrent, spreading, or systemic symptoms."],
        notes: ["If pregnant/young person considerations apply, follow PGD/local policy."],
      };
    }

    // >3 lesions / more extensive
    return {
      outcomeTitle: "Gateway to oral antibiotic (more extensive disease)",
      gateway: [
        "More than 3 lesions/clusters OR more extensive impetigo.",
        "Shared decision-making; ensure exclusions considered (bullous/recurrent etc.).",
      ],
      firstLine: penAllergy
        ? []
        : ["Flucloxacillin for 5 days + self-care (per PGD)."],
      penAllergy: penAllergy
        ? ["Macrolide alternative for 5 days (e.g., clarithromycin) per PGD/local guidance."]
        : ["If penicillin allergy: macrolide alternative per PGD."],
      selfCare: [
        ...commonSelfCare,
        "Hygiene advice: reduce transmission; cover lesions; avoid close contact until treated.",
      ],
      refer: ["Refer if severe/systemically unwell, complications, or not improving."],
    };
  }

  // ---- Infected insect bite ----
  if (conditionKey === "insect_bite") {
    const anaphylaxis = ans["bite_anaphylaxis"];
    const likelyAllergic = ans["bite_allergic_not_infected"];
    const penAllergy = ans["bite_pen_allergy"];
    const pregnantRelevant = ans["bite_pregnancy_relevant"];

    if (anaphylaxis) {
      return {
        outcomeTitle: "Emergency (possible anaphylaxis/systemic hypersensitivity)",
        gateway: ["Immediate emergency response required."],
        firstLine: [],
        selfCare: [],
        refer: ["Call emergency services / urgent escalation per local policy."],
      };
    }

    if (likelyAllergic) {
      return {
        outcomeTitle: "Self-care (reaction more likely than infection)",
        gateway: ["Most bites/stings are self-limiting and do not need antibiotics."],
        firstLine: [],
        selfCare: [
          ...commonSelfCare,
          "Consider oral antihistamine and/or topical steroid (OTC) for itch/inflammation if appropriate.",
        ],
        refer: ["Refer if worsening, spreading, systemic symptoms, or diagnostic uncertainty."],
      };
    }

    return {
      outcomeTitle: "Gateway to antibiotic (infected bite suspected)",
      gateway: ["Infected insect bite more likely (local infection/cellulitis features)."],
      firstLine: penAllergy
        ? []
        : ["Flucloxacillin for 5 days + self-care (per PGD)."],
      penAllergy: penAllergy
        ? pregnantRelevant
          ? ["Erythromycin for 5 days (if pregnancy relevant) per PGD."]
          : ["Clarithromycin for 5 days per PGD."]
        : ["If penicillin allergy: macrolide alternative per PGD."],
      selfCare: [
        ...commonSelfCare,
        "Mark edges of erythema to monitor spread; advise review if no improvement.",
      ],
      refer: [
        "Refer if spreading rapidly, systemic symptoms, very unwell, or not improving.",
      ],
    };
  }

  // ---- Acute sore throat ----
  if (conditionKey === "sore_throat") {
    const redFlags = ans["st_redflags"];
    const severe = ans["st_severe"];
    const penAllergy = ans["st_pen_allergy"];

    const feverPAIN = countTrue(ans, [
      "st_fever",
      "st_purulence",
      "st_rapid",
      "st_severe_tonsils",
      "st_no_cough",
    ]);

    if (redFlags) {
      return {
        outcomeTitle: "Refer (red flags/complications suspected)",
        gateway: ["Do not supply antibiotics under pathway if serious complications suspected."],
        firstLine: [],
        selfCare: commonSelfCare,
        refer: ["Urgent GP/OOH/A&E depending on severity (e.g., quinsy, scarlet fever, glandular fever, immunosuppression concerns)."],
      };
    }

    if (feverPAIN >= 4 && severe) {
      return {
        outcomeTitle: `Gateway to antibiotic (FeverPAIN ${feverPAIN} + severe symptoms)`,
        gateway: [
          "High FeverPAIN score with severe symptoms supports considering antimicrobial.",
          "Shared decision-making and safety-netting.",
        ],
        firstLine: penAllergy
          ? []
          : ["Phenoxymethylpenicillin (Penicillin V) for 5 days (per PGD)."],
        penAllergy: penAllergy
          ? ["Clarithromycin for 5 days (or erythromycin if pregnancy relevant) per PGD."]
          : ["If penicillin allergy: macrolide alternative per PGD."],
        selfCare: [
          ...commonSelfCare,
          "Sore throat is often viral; explain expected course and symptomatic relief.",
        ],
        refer: ["Refer if worsening rapidly, inability to swallow fluids, or systemic deterioration."],
      };
    }

    return {
      outcomeTitle: `Self-care (FeverPAIN ${feverPAIN})`,
      gateway: [
        "Antibiotic usually not needed unless high score with severe symptoms.",
        "Provide self-care and safety-net advice; consider review if not improving.",
      ],
      firstLine: [],
      selfCare: [
        ...commonSelfCare,
        "Consider throat lozenges/sprays, warm fluids, rest, and adequate analgesia.",
      ],
      refer: ["Advise reassessment if symptoms persist/worsen or complications suspected."],
    };
  }

  // ---- Acute sinusitis ----
  if (conditionKey === "sinusitis") {
    const redFlags = ans["sin_redflags"];
    const durationOver10 = ans["sin_over10"];
    const bacterialFeatures = countTrue(ans, [
      "sin_double_worse",
      "sin_fever",
      "sin_purulent",
      "sin_unilateral_pain",
    ]);
    const steroidSuitable = ans["sin_steroid_suitable"];
    const steroidTriedNoBetter = ans["sin_steroid_tried_no_better"];
    const penAllergy = ans["sin_pen_allergy"];
    const pregnantRelevant = ans["sin_pregnancy_relevant"];

    if (redFlags) {
      return {
        outcomeTitle: "Refer (red flags/serious illness suspected)",
        gateway: ["Do not treat under pathway if severe complications suspected."],
        firstLine: [],
        selfCare: commonSelfCare,
        refer: ["Urgent assessment if severe systemic illness, orbital/neurological signs, or rapid deterioration."],
      };
    }

    if (!durationOver10) {
      return {
        outcomeTitle: "Self-care (symptoms ≤10 days or improving)",
        gateway: ["Acute sinusitis is commonly viral; symptoms may last 2–3 weeks."],
        firstLine: [],
        selfCare: [
          ...commonSelfCare,
          "Consider saline sprays/irrigation; consider analgesia; advise review if persists beyond 10 days with little improvement.",
        ],
        refer: ["Refer if worsening or severe symptoms develop."],
      };
    }

    if (bacterialFeatures < 2) {
      return {
        outcomeTitle: "Self-care / consider intranasal steroid (insufficient bacterial features)",
        gateway: [
          "Symptoms >10 days but fewer than 2 bacterial features.",
          "Provide symptomatic treatment and safety-net; consider reassessment if worsening.",
        ],
        firstLine: steroidSuitable
          ? ["High-dose intranasal corticosteroid for 14 days (off-label in pathway, per PGD)."]
          : [],
        selfCare: [...commonSelfCare],
        refer: ["Refer if worsening, severe pain, or systemic features."],
      };
    }

    // Symptoms >10 days + 2+ bacterial features
    // Pathway: often offer high-dose intranasal steroid first; antibiotics if unsuitable/ineffective.
    if (steroidSuitable && !steroidTriedNoBetter) {
      return {
        outcomeTitle: "Gateway (bacterial features present) – consider intranasal steroid first",
        gateway: [
          "Symptoms >10 days with little improvement and ≥2 bacterial features.",
          "Offer high-dose intranasal corticosteroid for 14 days (off-label in pathway) with self-care.",
          "If unsuitable or ineffective, consider antibiotic per PGD.",
        ],
        firstLine: ["High-dose intranasal corticosteroid for 14 days (off-label, per pathway/PGD)."],
        selfCare: [...commonSelfCare],
        refer: ["Refer if deterioration or severe/local complications suspected."],
      };
    }

    // If steroid unsuitable OR tried and ineffective -> consider antibiotic
    return {
      outcomeTitle: "Gateway to antibiotic (steroid unsuitable/ineffective + bacterial features)",
      gateway: [
        "Symptoms >10 days with little improvement and ≥2 bacterial features.",
        "High-dose intranasal steroid unsuitable/ineffective → consider antibiotic per PGD.",
      ],
      firstLine: penAllergy ? [] : ["Phenoxymethylpenicillin (Penicillin V) for 5 days (per PGD)."],
      penAllergy: penAllergy
        ? pregnantRelevant
          ? ["Erythromycin for 5 days (if pregnancy relevant) per PGD."]
          : ["Clarithromycin or doxycycline for 5 days (per PGD)."]
        : ["If penicillin allergy: alternatives per PGD."],
      selfCare: [...commonSelfCare],
      refer: ["Refer if worsening, severe pain, systemic illness, or complications."],
    };
  }

  // ---- Shingles ----
  if (conditionKey === "shingles") {
    const complications = ans["shi_complications"];
    const withinWeek = ans["shi_within_week"];
    const immunosuppressed = ans["shi_immunosuppressed"];
    const nonTruncal = ans["shi_non_truncal"];
    const modSevPain = ans["shi_mod_sev_pain"];
    const modSevRash = ans["shi_mod_sev_rash"];
    const over50 = ans["shi_over50"];
    const over70 = ans["shi_over70"];

    if (complications) {
      return {
        outcomeTitle: "Refer urgently (suspected serious complications)",
        gateway: ["Do not supply under pathway if meningitis/encephalitis/myelitis/facial nerve involvement suspected."],
        firstLine: [],
        selfCare: [],
        refer: ["Urgent escalation for assessment (A&E/999 depending on severity)."],
      };
    }

    const meetsCriteria =
      immunosuppressed ||
      nonTruncal ||
      modSevPain ||
      modSevRash ||
      over50 ||
      over70;

    if (!withinWeek) {
      return {
        outcomeTitle: "Self-care / refer if needed (rash onset >1 week)",
        gateway: ["Antiviral benefit is time-sensitive; pathway focuses on early treatment (≤1 week from rash onset)."],
        firstLine: [],
        selfCare: [
          ...commonSelfCare,
          "Pain advice: trial paracetamol/NSAID/co-codamol OTC if appropriate; refer if inadequate control.",
        ],
        refer: ["Refer if immunosuppressed, severe pain/rash, non-truncal involvement, or any concern."],
        notes: ["Advise about shingles vaccine eligibility after recovery where appropriate."],
      };
    }

    if (!meetsCriteria) {
      return {
        outcomeTitle: "Self-care (criteria for antiviral not met)",
        gateway: ["Within 1 week, but criteria for antiviral supply not met."],
        firstLine: [],
        selfCare: [
          ...commonSelfCare,
          "Provide shingles self-care leaflet advice; keep rash clean/dry; avoid contact with vulnerable individuals until crusted.",
        ],
        refer: ["Refer if worsening, severe pain, or complications suspected."],
      };
    }

    return {
      outcomeTitle: "Gateway to antiviral (criteria met + within 1 week)",
      gateway: [
        "Within 1 week of rash onset AND meets criteria (e.g., age >50, moderate/severe pain/rash, non-truncal, immunosuppressed).",
      ],
      firstLine: [
        "Aciclovir (per PGD) OR Valaciclovir (per PGD) + self-care.",
      ],
      selfCare: [
        ...commonSelfCare,
        "Pain management: trial paracetamol/NSAID/co-codamol OTC if appropriate; refer if not controlled.",
      ],
      refer: [
        immunosuppressed
          ? "If immunosuppressed: treat if appropriate AND notify GP / urgent review as required (per pathway)."
          : "Refer if worsening rapidly, systemic illness, severe/widespread rash, or complications suspected.",
      ],
      notes: ["Signpost about shingles vaccine after recovery where eligible."],
    };
  }

  // ---- AOM ----
  if (conditionKey === "aom") {
    const complications = ans["aom_complications"];
    const hasSymptomsAndOtoscopy = ans["aom_symptoms_otoscopy"];
    const otorrhoeaOrPerf = ans["aom_otorrhoea"];
    const under2Bilateral = ans["aom_under2_bilateral"];
    const symptomsOver3Days = ans["aom_over3days"];
    const severe = ans["aom_severe"];
    const penAllergy = ans["aom_pen_allergy"];
    const noPerfModerateSevere = ans["aom_modsev_no_perforation"];

    if (complications) {
      return {
        outcomeTitle: "Refer urgently (suspected complications)",
        gateway: ["Complications suspected (e.g., mastoiditis/meningitis/neurological signs) → urgent escalation."],
        firstLine: [],
        selfCare: [],
        refer: ["Urgent GP/OOH/A&E depending on severity."],
      };
    }

    if (!hasSymptomsAndOtoscopy) {
      return {
        outcomeTitle: "AOM less likely (consider alternative diagnosis)",
        gateway: ["Does not meet symptom + otoscopy features for AOM."],
        firstLine: [],
        selfCare: commonSelfCare,
        refer: ["Refer if uncertain or symptoms severe/persistent."],
      };
    }

    const needsAntibiotic =
      otorrhoeaOrPerf || severe || symptomsOver3Days || under2Bilateral;

    if (needsAntibiotic) {
      return {
        outcomeTitle: "Gateway to antibiotic (AOM criteria met)",
        gateway: [
          "AOM more likely (symptoms + otoscopy).",
          "Consider antibiotic if otorrhoea/perforation OR severe symptoms OR symptoms >3 days OR <2 years with bilateral infection (shared decision).",
        ],
        firstLine: penAllergy ? [] : ["Amoxicillin for 5 days (per PGD) + self-care."],
        penAllergy: penAllergy
          ? ["Clarithromycin for 5 days (or erythromycin if pregnancy relevant in older teens, per PGD)."]
          : ["If penicillin allergy: macrolide alternative per PGD."],
        selfCare: [
          ...commonSelfCare,
          "Analgesia is key; advise review if no improvement in 2–3 days of antibiotics.",
        ],
        refer: ["Refer if worsening rapidly, very unwell, or not improving despite antibiotics."],
      };
    }

    return {
      outcomeTitle: "Self-care / analgesia first (mild AOM)",
      gateway: ["Antibiotic not routinely required in mild cases; shared decision-making."],
      firstLine: noPerfModerateSevere
        ? ["Consider phenazone + lidocaine ear drops up to 7 days (if eligible under PGD) + self-care."]
        : [],
      selfCare: [
        ...commonSelfCare,
        "Offer strong analgesia advice; return if not improving in 3–5 days or sooner if worse.",
      ],
      refer: ["Refer if deterioration, complications, or persistent symptoms."],
    };
  }

  // Fallback (shouldn’t happen)
  return {
    outcomeTitle: "No recommendation available",
    gateway: [],
    firstLine: [],
    selfCare: commonSelfCare,
    refer: [],
  };
}

// ---------- App ----------
export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [conditionKey, setConditionKey] = useState<ConditionKey | "">("");
  const [ageBand, setAgeBand] = useState<AgeBand | "">("");
  const [answers, setAnswers] = useState<Answers>({});

  const condition = useMemo(
    () => CONDITIONS.find((c) => c.key === conditionKey) ?? null,
    [conditionKey]
  );

  const eligible = useMemo(() => {
    if (!condition || !ageBand) return false;
    return condition.eligibleAges.includes(ageBand);
  }, [condition, ageBand]);

  const ageLabel = useMemo(
    () => AGE_BANDS.find((a) => a.value === ageBand)?.label ?? "",
    [ageBand]
  );

  const rec = useMemo(() => {
    if (!conditionKey || !ageBand) return null;
    return buildRecommendation(conditionKey as ConditionKey, ageBand as AgeBand, answers);
  }, [conditionKey, ageBand, answers]);

  function resetAll() {
    setStep(1);
    setConditionKey("");
    setAgeBand("");
    setAnswers({});
  }

  function goBack() {
    if (step === 1) return;
    setStep((prev) => (prev - 1) as Step);
  }

  function goNext() {
    if (step === 1) {
      if (!conditionKey) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!ageBand) return;
      if (!eligible) return;
      setStep(3);
      return;
    }
    if (step === 3) {
      // Allow Next to recommendation always once eligible
      setStep(4);
      return;
    }
  }

  function selectCondition(k: ConditionKey) {
    setConditionKey(k);
    setAgeBand("");
    setAnswers({});
  }

  function selectAge(a: AgeBand) {
    setAgeBand(a);
    setAnswers({});
  }

  // ---------- Assessment UI per condition ----------
  function Assessment() {
    if (!conditionKey || !condition) return null;

    // Common setter helper
    const set = (key: string, value: boolean) =>
      setAnswers((prev) => ({ ...prev, [key]: value }));

    const is = (key: string) => !!answers[key];

    // ---- UTI ----
    if (conditionKey === "uti") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Red flags / pyelonephritis screen">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ToggleRow
                label="Any signs of possible serious illness / sepsis risk?"
                value={is("uti_redflag")}
                onChange={(v) => set("uti_redflag", v)}
              />
              <ToggleRow
                label="Any signs/symptoms of pyelonephritis? (e.g., flank/kidney pain, rigors/chills, fever, nausea/vomiting, flu-like illness)"
                value={is("uti_pyelonephritis")}
                onChange={(v) => set("uti_pyelonephritis", v)}
              />
            </div>
          </Card>

          <Card title="Alternative diagnosis / exclusions">
            <ToggleRow
              label="Any reason to suspect alternative diagnosis/exclusion? (pregnancy, catheter, recurrent UTI, vaginal symptoms/thrush, STI/urethritis risk, immunosuppressed, GSM/atrophy etc.)"
              value={is("uti_alt_dx")}
              onChange={(v) => set("uti_alt_dx", v)}
            />
          </Card>

          <Card title="Key diagnostic symptoms (select all that apply)">
            <MultiSelect
              items={[
                { id: "uti_dysuria", label: "Dysuria (burning pain on passing urine)" },
                { id: "uti_new_nocturia", label: "New nocturia (needing to pass urine at night)" },
                { id: "uti_cloudy_urine", label: "Cloudy urine (to the naked eye, if practicable)" },
              ]}
              selected={answers}
              setSelected={setAnswers}
            />
          </Card>
        </div>
      );
    }

    // ---- Impetigo ----
    if (conditionKey === "impetigo") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Assess severity / exclusions">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ToggleRow
                label="Serious complications suspected (e.g., deeper soft tissue infection) or patient systemically unwell?"
                value={is("impetigo_complication")}
                onChange={(v) => set("impetigo_complication", v)}
              />
              <ToggleRow
                label="Are there ≤3 lesions/clusters present?"
                value={is("impetigo_lesions_leq3")}
                onChange={(v) => set("impetigo_lesions_leq3", v)}
              />
              <ToggleRow
                label="Is hydrogen peroxide 1% cream suitable? (localised non-bullous; no contraindications)"
                value={is("impetigo_h2o2_suitable")}
                onChange={(v) => set("impetigo_h2o2_suitable", v)}
              />
              <ToggleRow
                label="Penicillin allergy?"
                value={is("impetigo_pen_allergy")}
                onChange={(v) => set("impetigo_pen_allergy", v)}
              />
            </div>
          </Card>
        </div>
      );
    }

    // ---- Infected insect bite ----
    if (conditionKey === "insect_bite") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Immediate risk check">
            <ToggleRow
              label="Signs of systemic hypersensitivity reaction / anaphylaxis?"
              value={is("bite_anaphylaxis")}
              onChange={(v) => set("bite_anaphylaxis", v)}
            />
          </Card>

          <Card title="Reaction vs infection">
            <ToggleRow
              label="More likely allergic reaction (itchy swelling/redness) rather than infection?"
              value={is("bite_allergic_not_infected")}
              onChange={(v) => set("bite_allergic_not_infected", v)}
            />
          </Card>

          <Card title="If infection suspected">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ToggleRow
                label="Penicillin allergy?"
                value={is("bite_pen_allergy")}
                onChange={(v) => set("bite_pen_allergy", v)}
              />
              <ToggleRow
                label="Pregnancy relevant? (used only to choose macrolide option where applicable)"
                value={is("bite_pregnancy_relevant")}
                onChange={(v) => set("bite_pregnancy_relevant", v)}
              />
            </div>
          </Card>
        </div>
      );
    }

    // ---- Sore throat ----
    if (conditionKey === "sore_throat") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Red flags / serious illness">
            <ToggleRow
              label="Any red flags / complications suspected? (e.g., quinsy, scarlet fever, glandular fever, immunosuppression, suspected cancer)"
              value={is("st_redflags")}
              onChange={(v) => set("st_redflags", v)}
            />
          </Card>

          <Card title="FeverPAIN components (select all that apply)">
            <MultiSelect
              items={[
                { id: "st_fever", label: "Fever (high temperature) in previous 24 hours" },
                { id: "st_purulence", label: "Purulent tonsils" },
                { id: "st_rapid", label: "Attend rapidly (symptom onset ≤3 days)" },
                { id: "st_severe_tonsils", label: "Severe tonsillar inflammation" },
                { id: "st_no_cough", label: "No cough/coryza" },
              ]}
              selected={answers}
              setSelected={setAnswers}
            />
          </Card>

          <Card title="Severity and prescribing factors">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ToggleRow
                label="Severe symptoms (clinical global impression)?"
                value={is("st_severe")}
                onChange={(v) => set("st_severe", v)}
              />
              <ToggleRow
                label="Penicillin allergy?"
                value={is("st_pen_allergy")}
                onChange={(v) => set("st_pen_allergy", v)}
              />
              <ToggleRow
                label="Pregnancy relevant? (only used for macrolide choice where applicable)"
                value={is("st_pregnancy_relevant")}
                onChange={(v) => set("st_pregnancy_relevant", v)}
              />
            </div>
          </Card>
        </div>
      );
    }

    // ---- Sinusitis ----
    if (conditionKey === "sinusitis") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Red flags / serious illness">
            <ToggleRow
              label="Any red flags/serious illness suspected?"
              value={is("sin_redflags")}
              onChange={(v) => set("sin_redflags", v)}
            />
          </Card>

          <Card title="Duration threshold">
            <ToggleRow
              label="Symptoms >10 days with little/no improvement?"
              value={is("sin_over10")}
              onChange={(v) => set("sin_over10", v)}
            />
          </Card>

          <Card title="Bacterial features (need ≥2) – select all that apply">
            <MultiSelect
              items={[
                { id: "sin_double_worse", label: "Marked deterioration after an initial milder phase (double-worsening)" },
                { id: "sin_fever", label: "Fever >38°C" },
                { id: "sin_purulent", label: "Unremitting purulent nasal discharge" },
                { id: "sin_unilateral_pain", label: "Severe localised unilateral pain, particularly over teeth/jaw" },
              ]}
              selected={answers}
              setSelected={setAnswers}
            />
          </Card>

          <Card title="Treatment suitability">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ToggleRow
                label="High-dose intranasal corticosteroid suitable?"
                value={is("sin_steroid_suitable")}
                onChange={(v) => set("sin_steroid_suitable", v)}
              />
              <ToggleRow
                label="If steroid was used, were symptoms persistent despite 14 days?"
                value={is("sin_steroid_tried_no_better")}
                onChange={(v) => set("sin_steroid_tried_no_better", v)}
              />
              <ToggleRow
                label="Penicillin allergy?"
                value={is("sin_pen_allergy")}
                onChange={(v) => set("sin_pen_allergy", v)}
              />
              <ToggleRow
                label="Pregnancy relevant? (used for macrolide choice)"
                value={is("sin_pregnancy_relevant")}
                onChange={(v) => set("sin_pregnancy_relevant", v)}
              />
            </div>
          </Card>
        </div>
      );
    }

    // ---- Shingles ----
    if (conditionKey === "shingles") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Serious complications">
            <ToggleRow
              label="Serious complications suspected? (e.g., meningitis/encephalitis/myelitis, facial nerve paralysis/Ramsay Hunt)"
              value={is("shi_complications")}
              onChange={(v) => set("shi_complications", v)}
            />
          </Card>

          <Card title="Timing">
            <ToggleRow
              label="Shingles up to one week after rash onset?"
              value={is("shi_within_week")}
              onChange={(v) => set("shi_within_week", v)}
            />
          </Card>

          <Card title="Criteria for antiviral (ANY applies) – select all that apply">
            <MultiSelect
              items={[
                { id: "shi_immunosuppressed", label: "Immunosuppressed" },
                { id: "shi_non_truncal", label: "Non-truncal involvement (limbs/perineum)" },
                { id: "shi_mod_sev_pain", label: "Moderate or severe pain" },
                { id: "shi_mod_sev_rash", label: "Moderate or severe rash (confluent lesions)" },
                { id: "shi_over50", label: "Aged over 50 years" },
                { id: "shi_over70", label: "Aged 70 years and over" },
              ]}
              selected={answers}
              setSelected={setAnswers}
            />
          </Card>
        </div>
      );
    }

    // ---- AOM ----
    if (conditionKey === "aom") {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Complications / red flags">
            <ToggleRow
              label="Any suspected acute complications? (e.g., mastoiditis, meningitis, brain abscess, facial nerve paralysis)"
              value={is("aom_complications")}
              onChange={(v) => set("aom_complications", v)}
            />
          </Card>

          <Card title="Diagnosis (symptoms + otoscopy)">
            <ToggleRow
              label="Acute onset symptoms + otoscopy findings consistent with AOM?"
              value={is("aom_symptoms_otoscopy")}
              onChange={(v) => set("aom_symptoms_otoscopy", v)}
            />
          </Card>

          <Card title="When to consider antibiotic (ANY applies)">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ToggleRow
                label="Otorrhoea / eardrum perforation present?"
                value={is("aom_otorrhoea")}
                onChange={(v) => set("aom_otorrhoea", v)}
              />
              <ToggleRow
                label="Severe symptoms (clinical global impression)?"
                value={is("aom_severe")}
                onChange={(v) => set("aom_severe", v)}
              />
              <ToggleRow
                label="Symptoms >3 days?"
                value={is("aom_over3days")}
                onChange={(v) => set("aom_over3days", v)}
              />
              <ToggleRow
                label="Child <2 years AND infection in both ears?"
                value={is("aom_under2_bilateral")}
                onChange={(v) => set("aom_under2_bilateral", v)}
              />
              <ToggleRow
                label="Moderate/severe symptoms WITHOUT perforation (consider phenazone + lidocaine ear drops if eligible)?"
                value={is("aom_modsev_no_perforation")}
                onChange={(v) => set("aom_modsev_no_perforation", v)}
              />
              <ToggleRow
                label="Penicillin allergy?"
                value={is("aom_pen_allergy")}
                onChange={(v) => set("aom_pen_allergy", v)}
              />
            </div>
          </Card>
        </div>
      );
    }

    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        padding: 24,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        color: COLORS.text,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>
                Pharmacy First Questionnaire
              </h1>
              <div style={{ marginTop: 8, color: COLORS.muted }}>
                Choose a service, then age band, then complete the assessment.
              </div>
            </div>
            <ActionButton variant="neutral" onClick={resetAll}>
              Reset
            </ActionButton>
          </div>
        </div>

        {/* Q1 */}
        {step === 1 && (
          <Section
            title="1) What Pharmacy First condition are you treating?"
            subtitle="Select one."
            centerContent
          >
            <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 12 }}>
              {CONDITIONS.map((c) => (
                <Tile
                  key={c.key}
                  title={c.label}
                  selected={conditionKey === c.key}
                  onClick={() => selectCondition(c.key)}
                />
              ))}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                <ActionButton variant="next" onClick={goNext} disabled={!conditionKey}>
                  Next
                </ActionButton>
              </div>
            </div>
          </Section>
        )}

        {/* Q2 */}
        {step === 2 && (
          <Section
            title="2) How old is the patient?"
            subtitle={condition ? `Selected: ${condition.label}` : "Select a condition first."}
            centerContent
          >
            <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 12 }}>
              {AGE_BANDS.map((a) => (
                <Tile
                  key={a.value}
                  title={a.label}
                  selected={ageBand === a.value}
                  disabled={!condition}
                  onClick={() => selectAge(a.value)}
                />
              ))}

              {condition && ageBand && (
                <div
                  style={{
                    marginTop: 2,
                    padding: 12,
                    borderRadius: 16,
                    border: `1px solid ${eligible ? "#1e7f3b" : "#7f1d1d"}`,
                    background: eligible ? "#06140a" : "#160606",
                    color: eligible ? "#7cf0a0" : "#ffb4b4",
                    fontWeight: 900,
                    textAlign: "center",
                  }}
                >
                  {eligible
                    ? "Eligible age band for this service."
                    : conditionKey === "uti" && ageBand === ">64"
                      ? "Not eligible: Uncomplicated UTI pathway applies to women aged 16–64 only."
                      : "Not eligible for this service/age band."}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
                <ActionButton variant="back" onClick={goBack}>
                  Back
                </ActionButton>
                <ActionButton variant="next" onClick={goNext} disabled={!ageBand || !eligible}>
                  Next
                </ActionButton>
              </div>
            </div>
          </Section>
        )}

        {/* Assessment */}
        {step === 3 && condition && ageBand && eligible && (
          <Section
            title="3) Assessment (based on pathway)"
            subtitle={`${condition.label} • ${ageLabel}`}
          >
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
              <Card title="Service overview">
                <div style={{ color: "#eaeaea", lineHeight: 1.6 }}>{condition.description}</div>
              </Card>

              <Assessment />

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <ActionButton variant="back" onClick={goBack}>
                  Back
                </ActionButton>
                <ActionButton variant="next" onClick={goNext}>
                  Next
                </ActionButton>
              </div>
            </div>
          </Section>
        )}

        {/* Recommendation */}
        {step === 4 && condition && ageBand && eligible && rec && (
          <Section title="Recommendation" subtitle={`${condition.label} • ${ageLabel}`}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
              <Card title={rec.outcomeTitle}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 950, marginBottom: 6 }}>Gateway</div>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#eaeaea" }}>
                      {rec.gateway.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>

                  {rec.firstLine.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 950, marginBottom: 6 }}>First-line</div>
                      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#eaeaea" }}>
                        {rec.firstLine.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rec.penAllergy && rec.penAllergy.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 950, marginBottom: 6 }}>If penicillin allergy</div>
                      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#eaeaea" }}>
                        {rec.penAllergy.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <div style={{ fontWeight: 950, marginBottom: 6 }}>Self-care / advice</div>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#eaeaea" }}>
                      {rec.selfCare.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontWeight: 950, marginBottom: 6 }}>Referral / safety-net</div>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#eaeaea" }}>
                      {rec.refer.map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>

                  {rec.notes && rec.notes.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 950, marginBottom: 6 }}>Notes</div>
                      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#eaeaea" }}>
                        {rec.notes.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <ActionButton variant="back" onClick={goBack}>
                  Back
                </ActionButton>
                <ActionButton variant="next" onClick={resetAll}>
                  Start over
                </ActionButton>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
