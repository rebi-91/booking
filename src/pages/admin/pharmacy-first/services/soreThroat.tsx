// src/services/soreThroat.tsx
import type { ServiceDefinition } from "./uti";

export const soreThroatService: ServiceDefinition = {
  key: "soreThroat",
  label: "Acute Sore Throat",
  subtitle: "Age 5+ (FeverPAIN)",
  ageBands: ["5–15", "16–64", "65+"],
  startId: "age",
  flow: {
    // 1) AGE
    age: {
      id: "age",
      title: "Age",
      description: "Is the patient aged 5 years or over?",
      options: [
        { label: "Yes", nextId: "exclusions" },
        { label: "No", outcome: "Not eligible – onward referral / alternative pathway." },
      ],
    },

    // 2) EXCLUSIONS
    exclusions: {
      id: "exclusions",
      title: "Exclusion criteria",
      description: "Is the patient pregnant AND under 16 years?",
      options: [
        { label: "Yes", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "No", nextId: "redflags_epiglottitis" },
      ],
    },

    // 3) RED FLAGS
    redflags_epiglottitis: {
      id: "redflags_epiglottitis",
      title: "Red flags",
      description:
        "Suspected epiglottitis? (4Ds: dysphagia, dysphonia, drooling, distress). Do NOT examine throat if suspected.",
      options: [
        { label: "Yes", outcome: "Emergency referral (A&E/999).", danger: true },
        { label: "No", nextId: "redflags_stridor_severe" },
      ],
    },

    redflags_stridor_severe: {
      id: "redflags_stridor_severe",
      title: "Red flags",
      description:
        "Stridor (noisy/high-pitched breathing) OR severe complications suspected (dehydration, pharyngeal abscess)?",
      options: [
        { label: "Yes", outcome: "Urgent referral (consider NEWS2; A&E/999 if life-threatening).", danger: true },
        { label: "No", nextId: "redflags_other_serious" },
      ],
    },

    redflags_other_serious: {
      id: "redflags_other_serious",
      title: "Red flags",
      description:
        "Any concern for scarlet fever/quinsy/glandular fever, suspected head/neck cancer signs, or immunosuppressed?",
      options: [
        { label: "Yes", outcome: "Onward referral (general practice / other provider as appropriate)." },
        { label: "No", nextId: "assessment_fp_fever" },
      ],
    },

    // 4) ASSESSMENT: FeverPAIN items 1 by 1
    assessment_fp_fever: {
      id: "assessment_fp_fever",
      title: "Assessment (FeverPAIN)",
      description: "Fever over 38°C?",
      options: [
        { label: "Yes", nextId: "assessment_fp_purulence" },
        { label: "No", nextId: "assessment_fp_purulence" },
      ],
    },

    assessment_fp_purulence: {
      id: "assessment_fp_purulence",
      title: "Assessment (FeverPAIN)",
      description: "Purulence present?",
      options: [
        { label: "Yes", nextId: "assessment_fp_within3" },
        { label: "No", nextId: "assessment_fp_within3" },
      ],
    },

    assessment_fp_within3: {
      id: "assessment_fp_within3",
      title: "Assessment (FeverPAIN)",
      description: "First attendance within 3 days after onset of symptoms?",
      options: [
        { label: "Yes", nextId: "assessment_fp_tonsils" },
        { label: "No", nextId: "assessment_fp_tonsils" },
      ],
    },

    assessment_fp_tonsils: {
      id: "assessment_fp_tonsils",
      title: "Assessment (FeverPAIN)",
      description: "Severely inflamed tonsils?",
      options: [
        { label: "Yes", nextId: "assessment_fp_nocough" },
        { label: "No", nextId: "assessment_fp_nocough" },
      ],
    },

    // LAST FeverPAIN question — now routes "nowhere" (runner will auto-route after answering)
    assessment_fp_nocough: {
      id: "assessment_fp_nocough",
      title: "Assessment (FeverPAIN)",
      description: "No cough or coryza (cold symptoms)?",
      options: [{ label: "Yes" }, { label: "No" }],
    },

    // FeverPAIN 2–3 branch
    fp_2to3_return: {
      id: "fp_2to3_return",
      title: "Assessment",
      description: "FeverPAIN 2–3: Provide self-care/pain relief. Returning patient?",
      options: [
        {
          label: "No (new patient)",
          outcome:
            "Self-care and pain relief + safety-netting (TARGET RTI advice). Ask patient to return to pharmacy if no improvement within 3–5 days for reassessment.",
        },
        { label: "Yes (returning patient)", nextId: "fp_returning_after_reassessment" },
      ],
    },

    fp_returning_after_reassessment: {
      id: "fp_returning_after_reassessment",
      title: "Assessment",
      description:
        "After pharmacist reassessment (including red flags), is an antibiotic appropriate based on clinician global impression?",
      options: [
        { label: "No", outcome: "Antibiotic not needed – OTC symptomatic relief + fluids + safety-netting." },
        { label: "Yes", nextId: "fp_antibiotic_allergy" },
      ],
    },

    // FeverPAIN 4–5 branch
    fp_4to5_severity: {
      id: "fp_4to5_severity",
      title: "Assessment",
      description: "FeverPAIN 4–5: shared decision-making based on severity. Symptoms mild or severe?",
      options: [
        {
          label: "Mild symptoms",
          outcome: "Mild: consider pain relief and self-care first line + safety-netting (TARGET RTI advice).",
        },
        { label: "Severe symptoms", nextId: "fp_antibiotic_allergy" },
      ],
    },

    fp_antibiotic_allergy: {
      id: "fp_antibiotic_allergy",
      title: "Assessment",
      description: "Reported penicillin allergy?",
      options: [
        {
          label: "No",
          outcome:
            "Offer phenoxymethylpenicillin for 5 days (subject to PGD criteria) + self-care + safety-netting. If not improving after course → onward referral.",
        },
        { label: "Yes", nextId: "fp_pregnancy" },
      ],
    },

    fp_pregnancy: {
      id: "fp_pregnancy",
      title: "Assessment",
      description: "If penicillin allergy: is the patient pregnant?",
      options: [
        {
          label: "Yes",
          outcome: "Offer erythromycin for 5 days (subject to PGD criteria) + self-care + safety-netting.",
        },
        {
          label: "No",
          outcome: "Offer clarithromycin for 5 days (subject to PGD criteria) + self-care + safety-netting.",
        },
      ],
    },
  },
};
