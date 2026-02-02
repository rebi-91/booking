// src/services/shingles.tsx
import type { ServiceDefinition } from "./uti";

export const shinglesService: ServiceDefinition = {
  key: "shingles",
  label: "Shingles",
  subtitle: "Age 18+",
  ageBands: ["18+"],
  startId: "age",
  flow: {
    // 1) AGE
    age: {
      id: "age",
      title: "Age",
      description: "Is the patient aged 18 years or over?",
      options: [
        { label: "Yes", nextId: "exclusions" },
        { label: "No", outcome: "Not eligible – onward referral / alternative pathway." },
      ],
    },

    // 2) EXCLUSIONS
    exclusions: {
      id: "exclusions",
      title: "Exclusion criteria",
      description: "Exclude: pregnant individuals.",
      options: [
        { label: "Excluded", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "Not excluded", nextId: "redflags" },
      ],
    },

    // 3) RED FLAGS (PDF: serious complications + ophthalmic + severe immunosuppression/head & neck)
    redflags: {
      id: "redflags",
      title: "Red flags",
      description:
        "Any serious complications suspected? (Meningitis, encephalitis, myelitis, facial nerve paralysis/Ramsay Hunt), OR shingles in ophthalmic distribution (Hutchinson’s sign/visual symptoms/red eye), OR severe immunosuppression/severe rash/systemically unwell/head & neck involvement",
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
        "Does the presentation follow typical shingles progression? (Abnormal sensation/pain → rash 2–3 days later; grouped red spots → fluid-filled blisters; crusts/scabs; usually one-sided)",
      options: [
        { label: "Yes", nextId: "assessment_within72h" },
        { label: "No", outcome: "Shingles less likely – consider alternative diagnosis and proceed appropriately." },
      ],
    },

    assessment_within72h: {
      id: "assessment_within72h",
      title: "Assessment",
      description: "Is the rash onset within 72 hours?",
      options: [
        { label: "Yes", nextId: "criteria_72h" },
        { label: "No", nextId: "assessment_within1week" },
      ],
    },

    criteria_72h: {
      id: "criteria_72h",
      title: "Assessment",
      description:
        "Within 72 hours: does the patient meet ANY treatment criteria? (Immunosuppressed, non-truncal involvement, moderate/severe pain, moderate/severe rash (confluent lesions), age >50)",
      options: [
        { label: "Yes", nextId: "treatment_choice_72h" },
        {
          label: "No",
          outcome:
            "Patient does not meet treatment criteria – share self-care and safety-netting advice (BAD Shingles leaflet) + analgesia advice. If worsening → onward referral.",
        },
      ],
    },

    treatment_choice_72h: {
      id: "treatment_choice_72h",
      title: "Assessment",
      description:
        "Treatment selection: valaciclovir is preferred for immunosuppressed or adherence risk (already taking ≥8 medicines/day or assisted). Which applies?",
      options: [
        {
          label: "Immunosuppressed OR adherence risk",
          outcome:
            "Offer valaciclovir (subject to PGD criteria) + self-care. If immunosuppressed: notify GP / urgent for action email out of hours + safety-net (worsen/systemically unwell/severe rash → A&E/999).",
        },
        {
          label: "Neither applies",
          outcome:
            "Offer aciclovir (subject to PGD criteria) + self-care. Safety-net: worsen rapidly/significantly or no improvement after 7 days → onward referral.",
        },
      ],
    },

    assessment_within1week: {
      id: "assessment_within1week",
      title: "Assessment",
      description: "Is the rash onset up to one week?",
      options: [
        { label: "Yes", nextId: "criteria_1week" },
        {
          label: "No",
          outcome:
            "Patient does not meet treatment criteria – share self-care and safety-netting advice + analgesia advice. If worsening → onward referral.",
        },
      ],
    },

    criteria_1week: {
      id: "criteria_1week",
      title: "Assessment",
      description:
        "Up to one week: does the patient meet ANY criteria? (Immunosuppressed, continued vesicle formation, severe pain, high risk of severe shingles e.g. severe atopic dermatitis/eczema, age ≥70)",
      options: [
        { label: "Yes", nextId: "treatment_choice_1week" },
        {
          label: "No",
          outcome:
            "Patient does not meet treatment criteria – share self-care and safety-netting advice + analgesia advice. If worsening → onward referral.",
        },
      ],
    },

    treatment_choice_1week: {
      id: "treatment_choice_1week",
      title: "Assessment",
      description:
        "If treatment is indicated: valaciclovir is preferred for immunosuppressed or adherence risk. Which applies?",
      options: [
        {
          label: "Immunosuppressed OR adherence risk",
          outcome:
            "Offer valaciclovir (subject to PGD criteria) + self-care. If immunosuppressed: notify GP / urgent for action email out of hours + safety-net.",
        },
        {
          label: "Neither applies",
          outcome:
            "Offer aciclovir (subject to PGD criteria) + self-care. Safety-net: worsen rapidly/significantly or no improvement after 7 days → onward referral.",
        },
      ],
    },
  },
};
