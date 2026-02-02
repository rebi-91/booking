// src/services/insectBite.tsx
import type { ServiceDefinition } from "./uti";

export const insectBiteService: ServiceDefinition = {
  key: "insectBite",
  label: "Infected Insect Bite",
  subtitle: "Age 1+",
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

    // 2) EXCLUSIONS
    exclusions: {
      id: "exclusions",
      title: "Exclusion criteria",
      description: "Exclude: pregnant individuals under 16 years.",
      options: [
        { label: "Excluded", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "Not excluded", nextId: "redflags_anaphylaxis" },
      ],
    },

    // 3) RED FLAGS (top banner + gateway boxes)
    redflags_anaphylaxis: {
      id: "redflags_anaphylaxis",
      title: "Red flags",
      description:
        "Any signs of systemic hypersensitivity reaction or anaphylaxis?",
      options: [
        { label: "Yes", outcome: "Emergency: administer adrenaline as appropriate and call 999.", danger: true },
        { label: "No", nextId: "redflags_airway_orbital_immuno" },
      ],
    },

    redflags_airway_orbital_immuno: {
      id: "redflags_airway_orbital_immuno",
      title: "Red flags",
      description:
        "Any of: risk of airway obstruction (mouth/throat), concerns of orbital cellulitis (around eyes), or severely immunosuppressed with signs of infection?",
      options: [
        { label: "Yes", outcome: "Urgent referral (consider NEWS2; A&E/999 if life-threatening).", danger: true },
        { label: "No", nextId: "redflags_special_bites" },
      ],
    },

    redflags_special_bites: {
      id: "redflags_special_bites",
      title: "Red flags",
      description:
        "Any of: animal/human bite, tick bite with Lyme signs (erythema migrans), travel outside UK with concern for insect-borne disease, unusual/exotic insect?",
      options: [
        { label: "Yes", outcome: "Onward referral (general practice / other provider as appropriate)." },
        { label: "No", nextId: "assessment_48h" },
      ],
    },

    // 4) ASSESSMENT (PDF: 48h → itch principal → acute onset ≥3 symptoms → infected criteria)
    assessment_48h: {
      id: "assessment_48h",
      title: "Assessment",
      description: "Has it been at least 48 hours after the initial insect bite or sting?",
      options: [
        {
          label: "No",
          outcome:
            "Do not offer antibiotics. Likely inflammatory/allergic reaction – recommend self-care (oral antihistamine/topical steroid OTC) + safety-netting.",
        },
        { label: "Yes", nextId: "assessment_itch" },
      ],
    },

    assessment_itch: {
      id: "assessment_itch",
      title: "Assessment",
      description: "Is itch the principal symptom (and no other infection signs)?",
      options: [
        {
          label: "Yes",
          outcome:
            "Infected insect bite less likely – recommend self-care (antihistamine/topical steroid OTC) + safety-netting (monitor; return if worse or not improved after 3 days OTC).",
        },
        { label: "No", nextId: "assessment_acute3" },
      ],
    },

    assessment_acute3: {
      id: "assessment_acute3",
      title: "Assessment",
      description:
        "Acute onset of ≥3 symptoms? (Redness, pain/tenderness, swelling, surrounding skin hot to touch)",
      options: [
        {
          label: "No",
          outcome:
            "Infected insect bite less likely – self-care + safety-netting (redness/itching can last up to 10 days; avoid scratching).",
        },
        { label: "Yes", nextId: "assessment_infection_features" },
      ],
    },

    assessment_infection_features: {
      id: "assessment_infection_features",
      title: "Assessment",
      description:
        "Any of: spreading redness/swelling OR pustular discharge at bite/sting site?",
      options: [
        { label: "No", nextId: "assessment_systemic_or_comorbidity" },
        { label: "Yes", nextId: "treatment_penicillin_allergy" },
      ],
    },

    assessment_systemic_or_comorbidity: {
      id: "assessment_systemic_or_comorbidity",
      title: "Assessment",
      description:
        "Any of: systemically unwell; comorbidity delaying healing (PAD, venous insufficiency, lymphoedema, morbid obesity); severe pain out of proportion; significant pus/fluid collection needing drainage?",
      options: [
        { label: "Yes", outcome: "Onward referral (general practice / other provider as appropriate)." },
        {
          label: "No",
          outcome:
            "No antibiotics – recommend self-care + safety-netting (demarcate area, monitor; return if worse or not improved after 3 days OTC).",
        },
      ],
    },

    // Treatment (PDF)
    treatment_penicillin_allergy: {
      id: "treatment_penicillin_allergy",
      title: "Assessment",
      description: "Reported penicillin allergy?",
      options: [
        { label: "No", outcome: "Offer flucloxacillin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
        { label: "Yes", nextId: "treatment_pregnancy" },
      ],
    },

    treatment_pregnancy: {
      id: "treatment_pregnancy",
      title: "Assessment",
      description: "If penicillin allergy: is the patient pregnant?",
      options: [
        { label: "Yes", outcome: "Offer erythromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
        { label: "No", outcome: "Offer clarithromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
      ],
    },
  },
};
