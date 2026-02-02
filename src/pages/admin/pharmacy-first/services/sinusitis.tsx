// src/services/sinusitis.tsx
import type { ServiceDefinition } from "./uti";

export const sinusitisService: ServiceDefinition = {
  key: "sinusitis",
  label: "Acute Sinusitis",
  subtitle: "Age 12+",
  ageBands: ["12–15", "16–64", "65+"],
  startId: "age",
  flow: {
    // 1) AGE
    age: {
      id: "age",
      title: "Age",
      description: "Is the patient aged 12 years or over?",
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
        "Any exclusions? (Immunosuppressed, chronic sinusitis >12 weeks, pregnant individuals under 16 years)",
      options: [
        { label: "Yes", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "No", nextId: "redflags" },
      ],
    },

    // 3) RED FLAGS (PDF: periorbital/orbital, intracranial swelling frontal bone, meningitis/severe frontal headache/focal neuro)
    redflags: {
      id: "redflags",
      title: "Red flags",
      description:
        "Any red flags? (Intraorbital/periorbital complications like orbital cellulitis/reduced vision, swelling over frontal bone, meningitis signs, severe frontal headache, focal neurological signs)",
      options: [
        { label: "Yes", outcome: "Urgent referral (consider NEWS2; A&E/999 if life-threatening).", danger: true },
        { label: "No", nextId: "assessment_diagnosis" },
      ],
    },

    // 4) ASSESSMENT (PDF diagnostic definition)
    assessment_diagnosis: {
      id: "assessment_diagnosis",
      title: "Assessment",
      description:
        "Does the patient meet acute sinusitis diagnostic features? (Nasal blockage OR nasal discharge) WITH (facial pain/pressure/headache OR reduced/loss smell in adults OR cough day/night in children)",
      options: [
        { label: "Yes", nextId: "assessment_duration_10" },
        { label: "No", outcome: "Acute sinusitis less likely – consider alternative diagnosis and proceed appropriately." },
      ],
    },

    assessment_duration_10: {
      id: "assessment_duration_10",
      title: "Assessment",
      description: "Has the patient had symptoms for ≤10 days?",
      options: [
        {
          label: "Yes",
          outcome:
            "Self-care and regular pain relief. Antibiotic not needed. Safety-net advice (sinusitis usually lasts 2–3 weeks).",
        },
        { label: "No (symptoms >10 days with no improvement)", nextId: "assessment_bacterial_2plus" },
      ],
    },

    assessment_bacterial_2plus: {
      id: "assessment_bacterial_2plus",
      title: "Assessment",
      description:
        "Does the patient have 2 or more features suggesting acute bacterial sinusitis? (Marked deterioration after milder phase, fever >38°C, unremitting purulent nasal discharge, severe localised unilateral pain over teeth/jaw)",
      options: [
        { label: "No", nextId: "shared_decision_steroid" },
        { label: "Yes", nextId: "offer_steroid_firstline" },
      ],
    },

    shared_decision_steroid: {
      id: "shared_decision_steroid",
      title: "Assessment",
      description:
        "Shared decision-making based on severity. Offer high-dose nasal corticosteroid (off-label) for 14 days?",
      options: [
        {
          label: "Yes",
          outcome:
            "Offer high-dose nasal corticosteroid (off-label) for 14 days (subject to PGD criteria) + self-care and pain relief. Ask to return if not improved in 7 days for reassessment. Safety-net: worsen rapidly → onward referral.",
        },
        {
          label: "No / not suitable",
          outcome:
            "Self-care and pain relief + safety-netting. Return if not improved in 7 days for reassessment / referral if worsening.",
        },
      ],
    },

    offer_steroid_firstline: {
      id: "offer_steroid_firstline",
      title: "Assessment",
      description:
        "Instead of antibiotics first line: offer high-dose nasal corticosteroid (off-label) for 14 days?",
      options: [
        { label: "Suitable and offered", nextId: "steroid_effective" },
        { label: "Not suitable", nextId: "antibiotic_allergy" },
      ],
    },

    steroid_effective: {
      id: "steroid_effective",
      title: "Assessment",
      description: "Is the nasal corticosteroid unsuitable or ineffective?",
      options: [
        {
          label: "No (suitable/effective)",
          outcome:
            "High-dose nasal corticosteroid (14 days) + self-care/pain relief. Return if not improved in 7 days. Safety-net if worsening.",
        },
        { label: "Yes (unsuitable/ineffective)", nextId: "antibiotic_allergy" },
      ],
    },

    antibiotic_allergy: {
      id: "antibiotic_allergy",
      title: "Assessment",
      description: "Reported penicillin allergy?",
      options: [
        {
          label: "No",
          outcome:
            "Offer phenoxymethylpenicillin for 5 days (subject to PGD criteria) + self-care. Safety-net: worsen / no improvement after course → onward referral.",
        },
        { label: "Yes", nextId: "antibiotic_pregnancy" },
      ],
    },

    antibiotic_pregnancy: {
      id: "antibiotic_pregnancy",
      title: "Assessment",
      description: "If penicillin allergy: is the patient pregnant?",
      options: [
        { label: "Yes", outcome: "Offer erythromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
        {
          label: "No",
          outcome:
            "Offer clarithromycin OR doxycycline for 5 days (subject to PGD criteria) + self-care + safety-netting.",
        },
      ],
    },
  },
};
