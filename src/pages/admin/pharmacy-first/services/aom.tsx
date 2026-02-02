// src/services/aom.tsx
import type { ServiceDefinition } from "./uti";

export const aomService: ServiceDefinition = {
  key: "aom",
  label: "Acute Otitis Media",
  subtitle: "Children 1–17 years",
  ageBands: ["1–15", "16–17"],
  startId: "age",
  flow: {
    // 1) AGE
    age: {
      id: "age",
      title: "Age",
      description: "Is the child/young person aged 1 to 17 years?",
      options: [
        { label: "Yes", nextId: "exclusions" },
        { label: "No", outcome: "Not eligible – onward referral / alternative pathway." },
      ],
    },

    // 2) EXCLUSIONS
    exclusions: {
      id: "exclusions",
      title: "Exclusion criteria",
      description:
        "Any exclusions? (Recurrent AOM: 3+ in 6 months OR 4+ in 12 months; pregnant individuals under 16 years)",
      options: [
        { label: "Yes", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "No", nextId: "redflags_complications" },
      ],
    },

    // 3) RED FLAGS (PDF complications list)
    redflags_complications: {
      id: "redflags_complications",
      title: "Red flags",
      description:
        "Suspected acute complications? (Meningitis, mastoiditis, brain abscess, sinus thrombosis, facial nerve paralysis)",
      options: [
        { label: "Yes", outcome: "Emergency/urgent referral (A&E/999 as appropriate).", danger: true },
        { label: "No", nextId: "assessment_need_otoscopy" },
      ],
    },

    // 4) ASSESSMENT (PDF: need otoscopic exam)
    assessment_need_otoscopy: {
      id: "assessment_need_otoscopy",
      title: "Assessment",
      description: "Does the patient need an otoscopic examination?",
      options: [
        { label: "Yes", outcome: "Signpost to appropriate provider for otoscopic examination (urgent if needed)." },
        { label: "No", nextId: "assessment_aom_features" },
      ],
    },

    assessment_aom_features: {
      id: "assessment_aom_features",
      title: "Assessment",
      description:
        "Does the patient have acute onset consistent with AOM? (Earache or younger child tugging ear/non-specific symptoms) PLUS otoscopic features (red/yellow/cloudy TM; bulging; air-fluid; perforation/discharge)",
      options: [
        { label: "Yes", nextId: "assessment_high_risk" },
        { label: "No", outcome: "Acute otitis media less likely – consider alternative diagnosis and proceed appropriately." },
      ],
    },

    assessment_high_risk: {
      id: "assessment_high_risk",
      title: "Assessment",
      description:
        "Any high-risk criteria? (Systemically very unwell; more serious illness; high risk of complications due to comorbidity/prematurity etc)",
      options: [
        { label: "Yes", outcome: "Onward referral (general practice / other provider as appropriate)." },
        { label: "No", nextId: "assessment_otorrhoea" },
      ],
    },

    assessment_otorrhoea: {
      id: "assessment_otorrhoea",
      title: "Assessment",
      description:
        "Does the child/young person have otorrhoea (discharge after eardrum perforation) or suspected/confirmed perforation?",
      options: [
        { label: "Yes", nextId: "treat_antibiotic_allergy" },
        { label: "No", nextId: "assessment_under2_bilateral" },
      ],
    },

    assessment_under2_bilateral: {
      id: "assessment_under2_bilateral",
      title: "Assessment",
      description: "Is the child under 2 years AND with infection in both ears?",
      options: [
        { label: "Yes", nextId: "assessment_severe_or_3days" },
        { label: "No", nextId: "assessment_severe_or_3days" },
      ],
    },

    assessment_severe_or_3days: {
      id: "assessment_severe_or_3days",
      title: "Assessment",
      description:
        "Does the patient meet ANY of: severe symptoms (clinician impression) OR symptoms for >3 days?",
      options: [
        { label: "Yes", nextId: "treat_antibiotic_allergy" },
        {
          label: "No",
          outcome:
            "Mild symptoms: self-care and regular pain relief to all patients + safety-netting. Ask to return if no improvement within 3–5 days for reassessment. Consider phenazone+lidocaine ear drops for moderate/severe symptoms without perforation (subject to PGD criteria).",
        },
      ],
    },

    treat_antibiotic_allergy: {
      id: "treat_antibiotic_allergy",
      title: "Assessment",
      description: "Reported penicillin allergy?",
      options: [
        {
          label: "No",
          outcome:
            "Offer amoxicillin for 5 days (subject to PGD criteria) + self-care. Safety-net: worsen rapidly/very unwell or no improvement after 2–3 days antibiotics → onward referral.",
        },
        { label: "Yes", nextId: "treat_pregnancy_16_17" },
      ],
    },

    treat_pregnancy_16_17: {
      id: "treat_pregnancy_16_17",
      title: "Assessment",
      description: "If penicillin allergy: is the patient pregnant (aged 16–17 years)?",
      options: [
        { label: "Yes", outcome: "Offer erythromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
        { label: "No", outcome: "Offer clarithromycin for 5 days (subject to PGD criteria) + self-care + safety-netting." },
      ],
    },
  },
};
