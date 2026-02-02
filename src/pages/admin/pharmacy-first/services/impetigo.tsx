// src/services/impetigo.tsx
import type { ServiceDefinition } from "./uti";

export const impetigoService: ServiceDefinition = {
  key: "impetigo",
  label: "Impetigo",
  subtitle: "Non-bullous, age 1+",
  ageBands: ["1–15", "16–64", "65+"],
  startId: "age",
  flow: {
    // 1) AGE
    age: {
      id: "age",
      title: "Age",
      description: "Is the patient aged 1 year or over?",
      options: [
        { label: "Yes", nextId: "exclusions" },
        { label: "No", outcome: "Not eligible – onward referral / alternative pathway." },
      ],
    },

    // 2) EXCLUSIONS (PDF)
    exclusions: {
      id: "exclusions",
      title: "Exclusion criteria",
      description:
        "Any exclusions? (Bullous impetigo, recurrent impetigo ≥2 episodes in same year, pregnant individuals under 16 years)",
      options: [
        { label: "Yes", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "No", nextId: "redflags_gateway" },
      ],
    },

    // 3) RED FLAGS (PDF gateway row: immunosuppressed+widespread, severe complications; consider NEWS2)
    redflags_gateway: {
      id: "redflags_gateway",
      title: "Red flags",
      description:
        "Any red flags / serious illness? (Severe complications e.g. deeper soft tissue infection, OR immunosuppressed + infection widespread)",
      options: [
        { label: "Yes", outcome: "Urgent referral (consider NEWS2; A&E/999 if life-threatening).", danger: true },
        { label: "No", nextId: "assessment_typical" },
      ],
    },

    // 4) ASSESSMENT (PDF: typical progression)
    assessment_typical: {
      id: "assessment_typical",
      title: "Assessment",
      description:
        "Does the presentation follow typical impetigo progression? (Thin-walled vesicle → ruptures → golden crusts; common on face/limbs/flexures; may be mildly itchy; satellite lesions)",
      options: [
        { label: "Yes", nextId: "assessment_lesions" },
        { label: "No", outcome: "Impetigo less likely – consider alternative diagnosis and proceed appropriately." },
      ],
    },

    assessment_lesions: {
      id: "assessment_lesions",
      title: "Assessment",
      description: "How many lesions/clusters are present?",
      options: [
        { label: "≤3 lesions/clusters (localised)", nextId: "localised_firstline" },
        { label: "≥4 lesions/clusters (widespread)", nextId: "widespread_firstline" },
      ],
    },

    // Localised pathway (PDF)
    localised_firstline: {
      id: "localised_firstline",
      title: "Assessment",
      description:
        "Localised non-bullous impetigo: first-line treatment?",
      options: [
        {
          label: "Offer hydrogen peroxide 1% cream (5 days)",
          outcome:
            "Offer hydrogen peroxide 1% cream for 5 days (subject to protocol criteria) + self-care + hygiene advice + safety-netting (BAD Impetigo leaflet). If worsens / no improvement after course → onward referral.",
        },
        {
          label: "Hydrogen peroxide unsuitable/ineffective",
          nextId: "localised_secondline",
        },
      ],
    },

    localised_secondline: {
      id: "localised_secondline",
      title: "Assessment",
      description:
        "Second line for localised impetigo (e.g., around eyes or ineffective but still localised)?",
      options: [
        {
          label: "Offer fusidic acid cream (5 days)",
          outcome:
            "Offer fusidic acid cream for 5 days (subject to PGD criteria) + self-care + hygiene advice + safety-netting. If worsens / no improvement after course → onward referral.",
        },
      ],
    },

    // Widespread pathway (PDF)
    widespread_firstline: {
      id: "widespread_firstline",
      title: "Assessment",
      description: "Widespread non-bullous impetigo: penicillin allergy?",
      options: [
        { label: "No penicillin allergy", nextId: "widespread_fluclox" },
        { label: "Reported penicillin allergy", nextId: "widespread_macrolide_preg" },
      ],
    },

    widespread_fluclox: {
      id: "widespread_fluclox",
      title: "Assessment",
      description: "Is the patient suitable for flucloxacillin?",
      options: [
        {
          label: "Yes",
          outcome:
            "Offer flucloxacillin for 5 days (subject to PGD criteria) + self-care + hygiene advice + safety-netting. If worsens / no improvement after course → onward referral.",
        },
        {
          label: "No / unsuitable",
          outcome:
            "If unsuitable, onward referral / alternative management as appropriate (per local guidance).",
        },
      ],
    },

    widespread_macrolide_preg: {
      id: "widespread_macrolide_preg",
      title: "Assessment",
      description: "If penicillin allergy: is the patient pregnant?",
      options: [
        { label: "Yes", outcome: "Offer erythromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
        { label: "No", outcome: "Offer clarithromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
      ],
    },
  },
};
