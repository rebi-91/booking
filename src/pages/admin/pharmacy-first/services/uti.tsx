// src/services/uti.tsx
export type ServiceKey =
  | "soreThroat"
  | "impetigo"
  | "sinusitis"
  | "uti"
  | "shingles"
  | "aom"
  | "insectBite";

export type NodeOption = {
  label: string;
  nextId?: string;
  outcome?: string;
  danger?: boolean;
};

export type FlowNode = {
  id: string;
  title: string;
  description?: string;
  options: NodeOption[];
};

export type ServiceDefinition = {
  key: ServiceKey;
  label: string;
  subtitle: string;
  ageBands: string[];
  flow: Record<string, FlowNode>;
  startId: string;
};

export const utiService: ServiceDefinition = {
  key: "uti",
  label: "Uncomplicated UTI",
  subtitle: "Women 16–64 years (lower UTI)",
  ageBands: ["16–64"],
  startId: "age",
  flow: {
    // 1) AGE
    age: {
      id: "age",
      title: "Age",
      description: "Is the patient a woman aged 16 to under 65 years?",
      options: [
        { label: "Yes", nextId: "age_diabetes" },
        { label: "No", outcome: "Not eligible for this service – onward referral / alternative pathway." },
      ],
    },
    age_diabetes: {
      id: "age_diabetes",
      title: "Age",
      description: "Does the patient have diabetes?",
      options: [
        { label: "No", nextId: "exclusions" },
        { label: "Yes", outcome: "Excluded (diabetes) – onward referral to general practice / appropriate provider." },
      ],
    },

    // 2) EXCLUSIONS (PDF: pregnant, catheter, recurrent UTI)
    exclusions: {
      id: "exclusions",
      title: "Exclusion criteria",
      description:
        "Any exclusions? (Pregnant, urinary catheter, recurrent UTI: 2 in last 6 months OR 3 in last 12 months)",
      options: [
        { label: "Yes", outcome: "Excluded – onward referral to general practice / appropriate provider." },
        { label: "No", nextId: "redflags_pyelo" },
      ],
    },

    // 3) RED FLAGS (PDF: risk of deterioration + pyelonephritis signs)
    redflags_pyelo: {
      id: "redflags_pyelo",
      title: "Red flags",
      description:
        "Any new signs/symptoms of pyelonephritis? (Kidney pain/tenderness under ribs, flu-like illness, rigors or temp ≥37.9°C, nausea/vomiting)",
      options: [
        { label: "Yes", outcome: "Urgent same-day referral (consider NEWS2; A&E/999 if life-threatening).", danger: true },
        { label: "No", nextId: "exclusion_other_conditions" },
      ],
    },

    // PDF exclusion-style screen right before key symptoms:
    exclusion_other_conditions: {
      id: "exclusion_other_conditions",
      title: "Exclusion criteria",
      description:
        "Does the patient have ANY of: vaginal discharge, urethritis/possible STI, pregnancy concerns, genitourinary syndrome of menopause, or is immunosuppressed?",
      options: [
        { label: "Yes", outcome: "Onward referral (general practice / sexual health clinic / other appropriate provider)." },
        { label: "No", nextId: "assessment_key_symptoms" },
      ],
    },

    // 4) ASSESSMENT (PDF: 3 key diagnostic symptoms -> branching)
    assessment_key_symptoms: {
      id: "assessment_key_symptoms",
      title: "Assessment",
      description:
        "How many of the 3 key diagnostic symptoms are present? (Dysuria, new nocturia, cloudy urine)",
      options: [
        { label: "0 symptoms", nextId: "assessment_other_urinary_0" },
        { label: "1 symptom", nextId: "assessment_other_urinary_1" },
        { label: "2 or 3 symptoms", nextId: "assessment_severity_2plus" },
      ],
    },

    assessment_other_urinary_0: {
      id: "assessment_other_urinary_0",
      title: "Assessment",
      description:
        "Are there other urinary symptoms? (Urgency, frequency, visible haematuria, suprapubic pain/tenderness)",
      options: [
        { label: "No", outcome: "UTI less likely – self-care and pain relief + safety-netting (TARGET UTI advice)." },
        { label: "Yes", outcome: "UTI equally likely to other diagnosis – onward referral as appropriate + safety-netting." },
      ],
    },

    assessment_other_urinary_1: {
      id: "assessment_other_urinary_1",
      title: "Assessment",
      description:
        "Are there other urinary symptoms? (Urgency, frequency, visible haematuria, suprapubic pain/tenderness)",
      options: [
        { label: "No", outcome: "UTI less likely – self-care and pain relief + safety-netting (TARGET UTI advice)." },
        { label: "Yes", outcome: "UTI equally likely to other diagnosis – onward referral as appropriate + safety-netting." },
      ],
    },

    assessment_severity_2plus: {
      id: "assessment_severity_2plus",
      title: "Assessment",
      description:
        "Symptoms severity? (PDF: mild → self-care first line; moderate–severe → offer nitrofurantoin 3 days if eligible)",
      options: [
        {
          label: "Mild symptoms",
          outcome:
            "UTI likely – consider pain relief and self-care first line. Ask patient to return if no improvement in 48 hours for pharmacist reassessment. Safety-net: worsen rapidly/ no improvement → onward referral.",
        },
        {
          label: "Moderate to severe symptoms",
          outcome:
            "UTI likely – offer nitrofurantoin for 3 days (subject to PGD criteria) + self-care. Safety-net: worsen rapidly/ no improvement in 48 hours of antibiotics → onward referral.",
        },
      ],
    },
  },
};
