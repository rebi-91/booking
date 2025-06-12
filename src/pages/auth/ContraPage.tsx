// src/pages/ContraPage.tsx
import React, { useState } from 'react';
import supabase from '../../supabase';
import Header from '../Header';
import './ContraPage.css';

type AnswerValue = string | string[] | boolean;
interface Answers {
  [key: string]: AnswerValue;
}

const INFO_EVER_USED = `
There are many different types of contraception available and we want to make sure that you’re choosing the right one for you.

We can prescribe the mini pill, the combined pill, the contraceptive patch and the vaginal ring. All are easy to use and very effective when used correctly.

The mini pill (or progesterone only pill) contains the hormone progesterone. Most women can use this pill safely. Examples include Cerazette, Cerelle and Noriday.

The mini pill can help with heavy periods, but it can also cause irregular bleeding. Other possible side effects include sore breasts, mood changes and headaches.

The combined pill, patch and vaginal ring contain both oestrogen and progesterone. Examples include Microgynon, Yasmin and the Evra Patch.

Using these can make your periods lighter, less painful and more regular. They can help with acne and reduce the risk of womb and ovarian cancers. Other possible side effects include spotting, feeling sick and breast pain.

There’s a small possible increase in the risk of breast cancer and cervical cancer with combined contraceptives, but these risks reduce in time after you stop taking it. There is also an increase in the risk of getting blood clots in the legs or lungs. This risk may be even higher if you have other health conditions or you smoke, for example. If this is the case, a mini pill may be recommended as the safer option for you.

It’s worth finding out more about contraceptive choices to make sure you’re choosing the right protection for you.
`;

const INFO_KEEP_SAME_NO = `
There are many different types of contraception available and we want to make sure that you’re choosing the right one for you.

We can prescribe the mini pill, the combined pill and the contraceptive patch. All are easy to use and very effective when used correctly.

The mini pill (or progesterone only pill) contains the hormone progesterone. Most women can use this pill safely. Examples include Cerazette, Cerelle and Noriday.

The mini pill can help with heavy periods, but it can also cause irregular bleeding. Other possible side effects include sore breasts, mood changes and headaches.

The combined pill, patch and vaginal ring contain both oestrogen and progesterone. Examples include Microgynon, Yasmin and the Evra Patch.

Using these can make your periods lighter, less painful and more regular. They can help with acne and reduce the risk of womb and ovarian cancers. Other possible side effects include spotting, feeling sick and breast pain.

There’s a small possible increase in the risk of breast cancer and cervical cancer with the combined contraceptive, but these risks reduce in time after you stop taking it. There is also an increase in the risk of getting blood clots in the legs or lungs. This risk may be even higher if you have other health conditions or you smoke, for example. If this is the case, a mini pill may be recommended as the safer option for you.

Some combined contraceptives have a lower risk of blood clots than others. Pills containing levonorgestrel or norethisterone such as Microgynon, Rigevidon or Levest have the lowest risk (5 to 7 in 10,000 women), compared to pills containing desogestrel, drospirenone and gestodene such as Femodene, Gedarel and Yasmin which have a higher risk (9 to 12 in 10,000 women). This risk is still low for both and it’s worth weighing up these risks against any side effects you may get from a particular contraceptive. We’d recommend using a lower risk pill if you’ve not had any problems with pills before.

It’s worth finding out more about contraceptive choices to make sure you’re choosing the right protection for you. If you’d like more advice on taking contraception you can send us a message through your account for free at any time.
`;

interface Question {
  id: number;
  stateKey: string;
  prompt?: string;
  subtitle?: string;
  type: 'single' | 'multi' | 'text' | 'info';
  options?: string[];
  dependsOn?: { key: string; value: any };
  dependsOnAny?: { key: string; value: any }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    stateKey: 'currentUsing',
    prompt: 'Are you currently using any kind of hormonal contraception?',
    subtitle: 'Such as the combined pill, mini pill, an IUS (coil), implant, injection or patch.',
    type: 'single',
    options: ['Yes', 'No']
  },
  {
    id: 2,
    stateKey: 'everUsed',
    prompt: 'Have you ever used any kind of hormonal contraception?',
    type: 'single',
    options: ['Yes', 'No'],
    dependsOn: { key: 'currentUsing', value: 'No' }
  },
  {
    id: 3,
    stateKey: 'prevContraception',
    prompt: 'Can you tell us the name(s) of the contraception you have previously used?',
    type: 'text',
    dependsOn: { key: 'everUsed', value: 'Yes' }
  },
  {
    id: 4,
    stateKey: 'everInfo',
    type: 'info',
    subtitle: INFO_EVER_USED,
    dependsOn: { key: 'everUsed', value: 'No' }
  },
  {
    id: 5,
    stateKey: 'everConfirm',
    prompt: 'Because you’ve not used hormonal contraception before, it’s important that you let us know that you:',
    type: 'single',
    options: ['I have read and understood the information above'],
    dependsOn: { key: 'everUsed', value: 'No' }
  },
  {
    id: 6,
    stateKey: 'keepSame',
    prompt: 'Would you like to keep using the same contraception?',
    type: 'single',
    options: ['Yes', 'No'],
    dependsOn: { key: 'currentUsing', value: 'Yes' }
  },
  {
    id: 7,
    stateKey: 'type',
    prompt: 'What type of contraception are you using?',
    type: 'single',
    options: [
      'Contraceptive pill',
      'Contraceptive implant',
      'Contraceptive injection',
      'Contraceptive coil',
      'Contraceptive patch or ring',
      'Other'
    ],
    dependsOn: { key: 'keepSame', value: 'Yes' }
  },
  {
    id: 8,
    stateKey: 'nameDetail',
    prompt: "Can you tell us the name of the contraception you're using now?",
    type: 'text',
    dependsOnAny: [
      { key: 'keepSame', value: 'Yes' },
      { key: 'keepSame', value: 'No' }
    ]
  },
  {
    id: 9,
    stateKey: 'keepSameInfo',
    type: 'info',
    subtitle: INFO_KEEP_SAME_NO,
    dependsOn: { key: 'keepSame', value: 'No' }
  },
  {
    id: 10,
    stateKey: 'keepSameConfirm',
    prompt: 'Because you would like to change, please confirm that you have read and understood the information above:',
    type: 'single',
    options: ['I have read and understood'],
    dependsOn: { key: 'keepSame', value: 'No' }
  },
  {
    id: 11,
    stateKey: 'changeReason',
    prompt: 'Why would you like to change?',
    type: 'text',
    dependsOn: { key: 'keepSame', value: 'No' }
  },
  // (Insert questions 12–27 for medical history here, unchanged)
  {
    id: 28,
    stateKey: 'height',
    prompt: 'What is your height and weight?',
    subtitle: 'Select ft & in or cm — and st & lbs or kg',
    type: 'text',
    dependsOnAny: [
      { key: 'prevContraception', value: '' },
      { key: 'everConfirm', value: 'I have read and understood the information above' },
      { key: 'nameDetail', value: '' },
      { key: 'keepSameConfirm', value: 'I have read and understood' }
    ]
  }
];

const ContraPage: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);

  const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('metric');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightUnit, setWeightUnit] = useState<'imperial' | 'metric'>('metric');
  const [weightSt, setWeightSt] = useState('');
  const [weightLb, setWeightLb] = useState('');
  const [weightKg, setWeightKg] = useState('');

  const setAnswer = (key: string, value: AnswerValue) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  const updateHeightAnswer = () => {
    if (heightUnit === 'imperial' && heightFt && heightIn) {
      setAnswer('height', `${heightFt} ft ${heightIn} in`);
    }
    if (heightUnit === 'metric' && heightCm) {
      setAnswer('height', `${heightCm} cm`);
    }
  };

  const updateWeightAnswer = () => {
    if (weightUnit === 'imperial' && weightSt && weightLb) {
      setAnswer('weight', `${weightSt} st ${weightLb} lbs`);
    }
    if (weightUnit === 'metric' && weightKg) {
      setAnswer('weight', `${weightKg} kg`);
    }
  };

  const visible = QUESTIONS.filter(q => {
    if (q.dependsOn && answers[q.dependsOn.key] !== q.dependsOn.value) {
      return false;
    }
    if (q.dependsOnAny && !q.dependsOnAny.some(d => {
      const v = answers[d.key];
      if (d.key === 'prevContraception' || d.key === 'nameDetail') {
        return typeof v === 'string' && v.length > 0;
      }
      return Array.isArray(v) ? v.includes(d.value) : v === d.value;
    })) {
      return false;
    }
    return true;
  });

  const current = visible[stepIndex];

  const goNext = () => {
    if (stepIndex < visible.length - 1) {
      setStepIndex(i => i + 1);
    }
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setStepIndex(i => i - 1);
    }
  };

  const allowNext = () => {
    if (current.type === 'info') {
      return true;
    }
    if (current.stateKey === 'height') {
      const hOk = heightUnit === 'imperial' ? !!(heightFt && heightIn) : !!heightCm;
      const wOk = weightUnit === 'imperial' ? !!(weightSt && weightLb) : !!weightKg;
      return hOk && wOk;
    }
    if (current.type === 'single') {
      return !!answers[current.stateKey];
    }
    if (current.type === 'multi') {
      const v = answers[current.stateKey];
      return Array.isArray(v) && v.length > 0;
    }
    if (current.type === 'text') {
      const v = answers[current.stateKey];
      return typeof v === 'string' && v.length > 0;
    }
    return false;
  };

  const handleSubmit = async () => {
    await supabase.from('contraception_assessment').insert([answers]);
    alert('Submitted!');
  };

  return (
    <>
      <Header />
      <div className="contra-container">
        <h1 className="page-title">Contraception Assessment</h1>

        <section className="question-card">
          {current.stateKey === 'height' ? (
            <div className="question-block">
              <h2>{current.prompt}</h2>
              <p className="subtitle">{current.subtitle}</p>

              {heightUnit === 'imperial' ? (
                <div className="imperial-row">
                  <input
                    type="number"
                    placeholder="e.g. 5 ft."
                    value={heightFt}
                    onChange={e => {
                      setHeightFt(e.target.value);
                      setTimeout(updateHeightAnswer, 0);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="e.g. 3 in."
                    value={heightIn}
                    onChange={e => {
                      setHeightIn(e.target.value);
                      setTimeout(updateHeightAnswer, 0);
                    }}
                  />
                </div>
              ) : (
                <div className="metric-row">
                  <input
                    type="number"
                    placeholder="e.g. 170 cm"
                    value={heightCm}
                    onChange={e => {
                      setHeightCm(e.target.value);
                      setTimeout(updateHeightAnswer, 0);
                    }}
                  />
                </div>
              )}
              <button
                className="unit-switch"
                onClick={() => {
                  if (heightUnit === 'imperial') {
                    setHeightUnit('metric');
                    setHeightFt('');
                    setHeightIn('');
                    setAnswer('height', '');
                  } else {
                    setHeightUnit('imperial');
                    setHeightCm('');
                    setAnswer('height', '');
                  }
                }}
              >
                {heightUnit === 'imperial' ? 'Switch to cm.' : 'Switch to ft., in.'}
              </button>

              {weightUnit === 'imperial' ? (
                <div className="imperial-row">
                  <input
                    type="number"
                    placeholder="e.g. 10 st."
                    value={weightSt}
                    onChange={e => {
                      setWeightSt(e.target.value);
                      setTimeout(updateWeightAnswer, 0);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="e.g. 3 lbs."
                    value={weightLb}
                    onChange={e => {
                      setWeightLb(e.target.value);
                      setTimeout(updateWeightAnswer, 0);
                    }}
                  />
                </div>
              ) : (
                <div className="metric-row">
                  <input
                    type="number"
                    placeholder="e.g. 75 kg"
                    value={weightKg}
                    onChange={e => {
                      setWeightKg(e.target.value);
                      setTimeout(updateWeightAnswer, 0);
                    }}
                  />
                </div>
              )}
              <button
                className="unit-switch"
                onClick={() => {
                  if (weightUnit === 'imperial') {
                    setWeightUnit('metric');
                    setWeightSt('');
                    setWeightLb('');
                    setAnswer('weight', '');
                  } else {
                    setWeightUnit('imperial');
                    setWeightKg('');
                    setAnswer('weight', '');
                  }
                }}
              >
                {weightUnit === 'imperial' ? 'Switch to kg.' : 'Switch to st., lbs.'}
              </button>
            </div>
          ) : (
            <div className="question-block">
              {current.type === 'info' ? (
                <p className="info-block">{current.subtitle}</p>
              ) : (
                <>
                  <h2>{current.prompt}</h2>
                  {current.subtitle && <p className="subtitle">{current.subtitle}</p>}
                </>
              )}

              {current.type === 'single' && current.options && (
                <div className="options-list">
                  {current.options.map(opt => (
                    <button
                      key={opt}
                      className={`option-btn ${answers[current.stateKey] === opt ? 'selected' : ''}`}
                      onClick={() => {
                        setAnswer(current.stateKey, opt);
                        goNext();
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {current.type === 'multi' && current.options && (
                <div className="options-list">
                  {current.options.map(opt => {
                    const selList = Array.isArray(answers[current.stateKey])
                      ? (answers[current.stateKey] as string[])
                      : [];
                    const sel = selList.includes(opt);
                    return (
                      <label key={opt} className={`checkbox-card ${sel ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={sel}
                          onChange={() =>
                            setAnswer(
                              current.stateKey,
                              sel ? selList.filter(x => x !== opt) : [...selList, opt]
                            )
                          }
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}

              {current.type === 'text' && (
                <textarea
                  className="text-input"
                  rows={2}
                  placeholder="Your answer…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={typeof answers[current.stateKey] === 'string' ? (answers[current.stateKey] as string) : ''}
                  onChange={e => setAnswer(current.stateKey, e.target.value)}
                />
              )}
            </div>
          )}
        </section>

        <div className="pager-buttons">
          <button className="prev-btn" onClick={goPrev} disabled={stepIndex === 0}>
            Back
          </button>
          {stepIndex < visible.length - 1 ? (
            <button className="next-btn" onClick={goNext} disabled={!allowNext()}>
              Next
            </button>
          ) : (
            <button className="submit-btn" onClick={handleSubmit} disabled={!allowNext()}>
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContraPage;

// import React, { useState } from 'react';
// import supabase from '../../supabase';
// import Header from '../Header';
// import './ContraPage.css';

// type AnswerValue = string | string[] | boolean;
// interface Answers { [key: string]: AnswerValue }
// interface Question {
//   id: number;
//   prompt: string;
//   subtitle?: string;
//   type: 'single' | 'multi' | 'text';
//   options?: string[];
//   dependsOn?: { key: string; value: any };
//   dependsOnAny?: { key: string; value: any }[];
//   stateKey: string;
// }

// const QUESTIONS: Question[] = [
//   { id: 1, prompt: 'Are you currently using any kind of hormonal contraception?', subtitle: 'Such as pill, coil, implant, injection or patch.', type: 'single', options: ['Yes', 'No'], stateKey: 'currentUsing' },
//   { id: 2, prompt: 'Would you like to keep using the same contraception?', type: 'single', options: ['Yes', 'No'], dependsOn: { key: 'currentUsing', value: 'Yes' }, stateKey: 'keepSame' },
//   { id: 3, prompt: 'What type of contraception are you using?', type: 'single', options: ['Contraceptive pill', 'Contraceptive implant', 'Contraceptive injection', 'Contraceptive coil', 'Contraceptive patch or ring', 'Other'], dependsOn: { key: 'keepSame', value: 'Yes' }, stateKey: 'type' },
//   { id: 4, prompt: `Can you tell us the name of the contraception you're using now?`, type: 'text', dependsOnAny: [{ key: 'keepSame', value: 'Yes' }, { key: 'keepSame', value: 'No' }], stateKey: 'nameDetail' },
//   { id: 5, prompt: 'Why would you like to change?', type: 'text', dependsOn: { key: 'keepSame', value: 'No' }, stateKey: 'changeReason' },
//   { id: 6, prompt: 'Have you ever had a heart attack or stroke?', subtitle: 'If yes, provide details.', type: 'single', options: ['Yes', 'No'], stateKey: 'hadHeartEvent' },
//   { id: 7, prompt: 'When did this happen and what treatment did you have?', type: 'text', dependsOn: { key: 'hadHeartEvent', value: 'Yes' }, stateKey: 'heartEventDetails' },
//   { id: 8, prompt: 'Do any of the following apply? Increase your risk of blood clots.', type: 'multi', options: ['Had clot', 'Family clot', 'Surgery last 3 weeks', 'Immobile', 'None'], stateKey: 'clotRisks' },
//   { id: 9, prompt: 'Do you have diabetes?', type: 'single', options: ['Yes', 'No'], stateKey: 'hasDiabetes' },
//   { id: 10, prompt: 'Conditions affecting liver or kidneys?', type: 'single', options: ['Yes', 'No'], stateKey: 'liverKidneyCondition' },
//   { id: 11, prompt: 'Please provide details.', type: 'text', dependsOn: { key: 'liverKidneyCondition', value: 'Yes' }, stateKey: 'liverKidneyDetails' },
//   { id: 12, prompt: 'Cancer history? Select all that apply.', type: 'multi', options: ['Breast', 'Cervical', 'Liver', 'Other', 'Never had'], stateKey: 'cancerHistory' },
//   { id: 13, prompt: 'Cancer details:', type: 'text', dependsOnAny: [{ key: 'cancerHistory', value: 'Breast' }, { key: 'cancerHistory', value: 'Cervical' }, { key: 'cancerHistory', value: 'Liver' }, { key: 'cancerHistory', value: 'Other' }], stateKey: 'cancerDetails' },
//   { id: 14, prompt: 'Unexpected vaginal bleeding?', type: 'single', options: ['Yes', 'No'], stateKey: 'unexpectedBleeding' },
//   { id: 15, prompt: 'How long have you been using your current contraception?', type: 'single', options: ['< 3 months', '> 3 months'], stateKey: 'contraceptiveDuration' },
//   { id: 16, prompt: 'Other medical conditions?', type: 'single', options: ['Yes', 'No'], stateKey: 'otherConditions' },
//   { id: 17, prompt: 'List conditions:', type: 'text', dependsOn: { key: 'otherConditions', value: 'Yes' }, stateKey: 'otherConditionsList' },
//   { id: 18, prompt: 'Do you take tranexamic acid?', type: 'single', options: ['Yes', 'No'], stateKey: 'usesTranexamic' },
//   { id: 19, prompt: 'Medication list:', type: 'multi', options: ['Carbamazepine','Lamotrigine','Modafinil','Other'], stateKey: 'medicationList' },
//   { id: 20, prompt: 'Other medication course?', type: 'single', options: ['Yes','No'], stateKey: 'otherMedicationCourse' },
//   { id: 21, prompt: 'Names & doses:', type: 'text', dependsOn: { key: 'otherMedicationCourse', value: 'Yes' }, stateKey: 'otherMedicationDetails' },
//   { id: 22, prompt: 'What for?', type: 'text', dependsOn: { key: 'otherMedicationCourse', value: 'Yes' }, stateKey: 'otherMedicationUse' },
//   { id: 23, prompt: 'Supply duration?', subtitle: '3 or 6 months', type: 'single', options: ['3 months','6 months'], stateKey: 'supplyDuration' },
//   { id: 24, prompt: 'I have answered honestly & truthfully.', type: 'single', options: ['Yes'], stateKey: 'confirmations' },
//   { id: 25, prompt: 'I agree to terms & privacy.', type: 'single', options: ['Yes'], stateKey: 'agreeTerms' }
// ];

// const ContraPage: React.FC = () => {
//   const [answers, setAnswers] = useState<Answers>({});
//   const [stepIndex, setStepIndex] = useState(0);

//   const visible = QUESTIONS.filter(q => {
//     if (q.dependsOn && answers[q.dependsOn.key] !== q.dependsOn.value) return false;
//     if (q.dependsOnAny && !q.dependsOnAny.some(d => {
//       const val = answers[d.key];
//       return Array.isArray(val) ? val.includes(d.value) : val === d.value;
//     })) return false;
//     return true;
//   });

//   // build group of this step + dependents
//   const group: Question[] = [];
//   for (let i = stepIndex; i < visible.length; i++) {
//     const q = visible[i];
//     if (i === stepIndex) group.push(q);
//     else if (q.dependsOn && group.some(g => g.stateKey === q.dependsOn!.key)) group.push(q);
//     else break;
//   }

//   const current = visible[stepIndex];
//   const setAnswer = (key: string, value: AnswerValue) => setAnswers(prev => ({ ...prev, [key]: value }));

//   const allowNext = () => {
//     const val = answers[current.stateKey];
//     if (current.type === 'single' || current.type === 'text') return !!val;
//     if (current.type === 'multi') return Array.isArray(val) && val.length > 0;
//     return false;
//   };

//   const goNext = () => { if (allowNext() && stepIndex < visible.length - 1) setStepIndex(stepIndex + 1); };
//   const goPrev = () => { if (stepIndex > 0) setStepIndex(stepIndex - 1); };

//   const handleSubmit = async () => {
//     const payload = { /* map answers here */ };
//     await supabase.from('contraception_assessment').insert([payload]);
//     alert('Submitted!');
//   };

//   return (
//     <>
//       <Header />
//       <div className="contra-container">
//         <h1 className="page-title">Contraception Assessment</h1>
//         <section className="question-card">
//           {group.map(q => (
//             <div key={q.id} className="question-block">
//               <h2>{q.prompt}</h2>
//               {q.subtitle && <p className="subtitle">{q.subtitle}</p>}
//               {q.type === 'single' && q.options && (
//                 <div className="options-list">
//                   {q.options.map(opt => (
//                     <button key={opt}
//                       className={`option-btn ${answers[q.stateKey]===opt?'selected':''}`}
//                       onClick={()=>setAnswer(q.stateKey,opt)}
//                     >{opt}</button>
//                   ))}
//                 </div>
//               )}
//               {q.type==='multi' && q.options && (
//                 <div className="options-list">
//                   {q.options.map(opt => {
//                     const list = Array.isArray(answers[q.stateKey]) ? answers[q.stateKey]! as string[] : [];
//                     const sel = list.includes(opt);
//                     return (
//                       <label key={opt} className={`checkbox-card ${sel?'selected':''}`}>
//                         <input type="checkbox" checked={sel}
//                           onChange={()=>setAnswer(q.stateKey, sel? list.filter(x=>x!==opt): [...list,opt])}/>
//                         {opt}
//                       </label>
//                     );
//                   })}
//                 </div>
//               )}
//               {q.type==='text' && (
//                 <textarea className="text-input" rows={2} placeholder="Your answer..."
//                   value={typeof answers[q.stateKey]==='string'?answers[q.stateKey]! as string:''}
//                   onChange={e=>setAnswer(q.stateKey,e.target.value)}
//                 />
//               )}
//             </div>
//           ))}
//         </section>
//         <div className="pager-buttons">
//           <button className="prev-btn" onClick={goPrev} disabled={stepIndex===0} />
//           {stepIndex<visible.length-1
//             ? <button className="next-btn" onClick={goNext} disabled={!allowNext()} />
//             : <button className="submit-btn" onClick={handleSubmit} disabled={!allowNext()} />
//           }
//         </div>
//       </div>
//     </>
//   );
// };

// export default ContraPage;


// // ContraPage.tsx
// import React, { useState } from 'react';
// import Header from '../Header';
// import './ContraPage.css';

// const CONTRACEPTION_TYPES = [
//   'Contraceptive pill',
//   'Contraceptive implant',
//   'Contraceptive injection',
//   'Contraceptive coil',
//   'Contraceptive patch or ring',
//   'Other'
// ];

// const CLOT_RISK_OPTIONS = [
//   'I have had a blood clot before',
//   'Someone in my close family has had a blood clot',
//   'I have had major surgery in the last 3 weeks',
//   'I am immobile',
//   'None of these apply to me'
// ];

// const CANCER_TYPES = [
//   'Breast cancer',
//   'Cervical cancer',
//   'Liver cancer',
//   'Other cancer',
//   'I have never had cancer'
// ];

// const MEDICATION_LIST = [
//   'Carbamazepine',
//   'Eslicarbazepine',
//   'Griseofulvin',
//   'Lamotrigine',
//   'Modafinil',
//   'Orlistat',
//   'Oxcarbazepine',
//   'Phenytoin',
//   'Rifabutin',
//   'Rifampicin',
//   'Topiramate',
//   'None of the above'
// ];

// const ContraPage: React.FC = () => {
//   // contraception states
//   const [currentUsing, setCurrentUsing] = useState<string | null>(null);
//   const [keepSame, setKeepSame] = useState<string | null>(null);
//   const [type, setType] = useState<string | null>(null);
//   const [nameDetail, setNameDetail] = useState<string>('');
//   const [changeReason, setChangeReason] = useState<string>('');

//   // health history
//   const [hadHeartEvent, setHadHeartEvent] = useState<string | null>(null);
//   const [heartEventDetails, setHeartEventDetails] = useState<string>('');
//   const [clotRisks, setClotRisks] = useState<string[]>([]);
//   const [hasDiabetes, setHasDiabetes] = useState<string | null>(null);
//   const [liverKidneyCondition, setLiverKidneyCondition] = useState<string | null>(null);
//   const [liverKidneyDetails, setLiverKidneyDetails] = useState<string>('');
//   const [cancerHistory, setCancerHistory] = useState<string[]>([]);
//   const [cancerDetails, setCancerDetails] = useState<string>('');

//   // symptoms / bleeding
//   const [unexpectedBleeding, setUnexpectedBleeding] = useState<string | null>(null);
//   const [contraceptiveDuration, setContraceptiveDuration] = useState<string | null>(null);
//   const [otherConditions, setOtherConditions] = useState<string | null>(null);
//   const [otherConditionsList, setOtherConditionsList] = useState<string>('');

//   // medications
//   const [usesTranexamic, setUsesTranexamic] = useState<string | null>(null);
//   const [medicationList, setMedicationList] = useState<string[]>([]);
//   const [otherMedicationCourse, setOtherMedicationCourse] = useState<string | null>(null);
//   const [otherMedicationDetails, setOtherMedicationDetails] = useState<string>('');
//   const [otherMedicationUse, setOtherMedicationUse] = useState<string>('');

//   // supply and confirmations
//   const [supplyDuration, setSupplyDuration] = useState<string | null>(null);
//   const [confirmations, setConfirmations] = useState<boolean>(false);
//   const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

//   // multi-select handler
//   const toggleMulti = (
//     value: string,
//     list: string[],
//     setList: React.Dispatch<React.SetStateAction<string[]>>
//   ) => {
//     setList(prev =>
//       prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]
//     );
//   };

//   // scroll helper after answer
//   const handleAnswer = <T,>(
//     e: React.MouseEvent,
//     setter: React.Dispatch<React.SetStateAction<T>>,
//     value: T
//   ) => {
//     setter(value);
//     const card = (e.currentTarget as HTMLElement).closest('.question-card');
//     if (card && card.nextElementSibling) {
//       (card.nextElementSibling as HTMLElement).scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="contra-container">
//         <h1 className="page-title">Contraception Assessment</h1>

//         {/* 1 */}
//         <section className="question-card">
//           <h2>Are you currently using any hormonal contraception?</h2>
//           <p className="subtitle">Such as pill, coil, implant, injection or patch.</p>
//           <div className="options-list">
//             {['Yes', 'No'].map(opt => (
//               <button
//                 key={opt}
//                 className={`option-btn ${currentUsing === opt ? 'selected' : ''}`}
//                 onClick={e => handleAnswer(e, setCurrentUsing, opt)}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 2 */}
//         {currentUsing === 'Yes' && (
//           <section className="question-card">
//             <h2>Would you like to keep using the same contraception?</h2>
//             <div className="options-list">
//               {['Yes', 'No'].map(opt => (
//                 <button
//                   key={opt}
//                   className={`option-btn ${keepSame === opt ? 'selected' : ''}`}
//                   onClick={e => handleAnswer(e, setKeepSame, opt)}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* 3 & 4 same method */}
//         {currentUsing === 'Yes' && keepSame === 'Yes' && (
//           <>
//             <section className="question-card">
//               <h2>What type of contraception are you using?</h2>
//               <div className="options-list">
//                 {CONTRACEPTION_TYPES.map(opt => (
//                   <button
//                     key={opt}
//                     className={`option-btn ${type === opt ? 'selected' : ''}`}
//                     onClick={e => handleAnswer(e, setType, opt)}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//             </section>
//             <section className="question-card">
//               <h2>Can you tell us the name of the contraception you're using now?</h2>
//               <textarea
//                 className="text-input"
//                 rows={2}
//                 placeholder="E.g. Microgynon"
//                 value={nameDetail}
//                 onChange={e => setNameDetail(e.target.value)}
//               />
//             </section>
//           </>
//         )}

//         {/* 3 & 4 change reason */}
//         {currentUsing === 'Yes' && keepSame === 'No' && (
//           <>
//             <section className="question-card">
//               <h2>Can you tell us the name of the contraception you're using now?</h2>
//               <textarea
//                 className="text-input"
//                 rows={2}
//                 placeholder="Enter name..."
//                 value={nameDetail}
//                 onChange={e => setNameDetail(e.target.value)}
//               />
//             </section>
//             <section className="question-card">
//               <h2>Why would you like to change?</h2>
//               <textarea
//                 className="text-input"
//                 rows={2}
//                 placeholder="Explain reason..."
//                 value={changeReason}
//                 onChange={e => setChangeReason(e.target.value)}
//               />
//             </section>
//           </>
//         )}

//         {/* 5 Heart event */}
//         <section className="question-card">
//           <h2>Have you ever had a heart attack or stroke?</h2>
//           <p className="subtitle">If yes, please provide details.</p>
//           <div className="options-list">
//             {['Yes', 'No'].map(opt => (
//               <button
//                 key={opt}
//                 className={`option-btn ${hadHeartEvent === opt ? 'selected' : ''}`}
//                 onClick={e => handleAnswer(e, setHadHeartEvent, opt)}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//           {hadHeartEvent === 'Yes' && (
//             <textarea
//               className="text-input"
//               rows={2}
//               placeholder="When & treatment details..."
//               value={heartEventDetails}
//               onChange={e => setHeartEventDetails(e.target.value)}
//             />
//           )}
//         </section>

//                 {/* 6 Clot risk */}
//         <section className="question-card">
//           <h2>Do any of the following apply to you?</h2>
//           <p className="subtitle">These can increase your risk of blood clots.</p>
//           <div className="options-list">
//             {CLOT_RISK_OPTIONS.map(opt => (
//               <label key={opt} className={`checkbox-card ${clotRisks.includes(opt)?'selected':''}`}>
//                 <input type="checkbox" checked={clotRisks.includes(opt)} onChange={() => toggleMulti(opt, clotRisks, setClotRisks)} />
//                 {opt}
//               </label>
//             ))}
//           </div>
//         </section>

//         {/* 7 Diabetes */}
//         <section className="question-card">
//           <h2>Do you have diabetes?</h2>
//           <div className="options-list">
//             {['Yes','No'].map(opt => (
//               <button key={opt} className={`option-btn ${hasDiabetes===opt?'selected':''}`} onClick={e=>handleAnswer(e, setHasDiabetes, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 8 Liver/kidney */}
//         <section className="question-card">
//           <h2>Do you have any conditions affecting your liver or kidneys?</h2>
//           <div className="options-list">
//             {['Yes','No'].map(opt => (
//               <button key={opt} className={`option-btn ${liverKidneyCondition===opt?'selected':''}`} onClick={e=>handleAnswer(e, setLiverKidneyCondition, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//           {liverKidneyCondition==='Yes' && (
//             <textarea className="text-input" rows={2} placeholder="Details..." value={liverKidneyDetails} onChange={e=>setLiverKidneyDetails(e.target.value)}/>
//           )}
//         </section>

//         {/* 9 Cancer */}
//         <section className="question-card">
//           <h2>Do you have or have you ever had cancer?</h2>
//           <p className="subtitle">Select all that apply</p>
//           <div className="options-list">
//             {CANCER_TYPES.map(opt => (
//               <label key={opt} className={`checkbox-card ${cancerHistory.includes(opt)?'selected':''}`}>
//                 <input type="checkbox" checked={cancerHistory.includes(opt)} onChange={()=>toggleMulti(opt, cancerHistory, setCancerHistory)} />
//                 {opt}
//               </label>
//             ))}
//           </div>
//           {cancerHistory.length>0 && !cancerHistory.includes('I have never had cancer') && (
//             <textarea className="text-input" rows={2} placeholder="Details..." value={cancerDetails} onChange={e=>setCancerDetails(e.target.value)}/>
//           )}
//         </section>

//         {/* 10 Unexpected bleeding */}
//         <section className="question-card">
//           <h2>Do you have unexpected or unusual vaginal bleeding?</h2>
//           <div className="options-list">
//             {['Yes','No'].map(opt => (
//               <button key={opt} className={`option-btn ${unexpectedBleeding===opt?'selected':''}`} onClick={e=>handleAnswer(e, setUnexpectedBleeding, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 11 Duration */}
//         <section className="question-card">
//           <h2>How long have you been using your current contraception?</h2>
//           <div className="options-list">
//             {['< 3 months','> 3 months'].map(opt => (
//               <button key={opt} className={`option-btn ${contraceptiveDuration===opt?'selected':''}`} onClick={e=>handleAnswer(e, setContraceptiveDuration, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 12 Other conditions */}
//         <section className="question-card">
//           <h2>Do you have any other medical conditions?</h2>
//           <div className="options-list">
//             {['Yes','No'].map(opt => (
//               <button key={opt} className={`option-btn ${otherConditions===opt?'selected':''}`} onClick={e=>handleAnswer(e, setOtherConditions, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//           {otherConditions==='Yes' && (
//             <textarea className="text-input" rows={2} placeholder="List conditions..." value={otherConditionsList} onChange={e=>setOtherConditionsList(e.target.value)}/>
//           )}
//         </section>

//         {/* 13 Tranexamic acid */}
//         <section className="question-card">
//           <h2>Do you take tranexamic acid?</h2>
//           <p className="subtitle">Used to help reduce heavy bleeding (e.g. Cyklokapron).</p>
//           <div className="options-list">
//             {['Yes','No'].map(opt => (
//               <button key={opt} className={`option-btn ${usesTranexamic===opt?'selected':''}`} onClick={e=>handleAnswer(e, setUsesTranexamic, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 14 Medications list */}
//         <section className="question-card">
//           <h2>Are you taking any of the following medications?</h2>
//           <div className="options-list">
//             {MEDICATION_LIST.map(opt => (
//               <label key={opt} className={`checkbox-card ${medicationList.includes(opt)?'selected':''}`}>
//                 <input type="checkbox" checked={medicationList.includes(opt)} onChange={()=>toggleMulti(opt, medicationList, setMedicationList)} />
//                 {opt}
//               </label>
//             ))}
//           </div>
//         </section>

//         {/* 15 Other medication course */}
//         <section className="question-card">
//           <h2>Are you currently taking any other medication, or have you recently finished a course of medication?</h2>
//           <div className="options-list">
//             {['Yes','No'].map(opt => (
//               <button key={opt} className={`option-btn ${otherMedicationCourse===opt?'selected':''}`} onClick={e=>handleAnswer(e, setOtherMedicationCourse, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//           {otherMedicationCourse==='Yes' && (
//             <>
//               <textarea className="text-input" rows={2} placeholder="Names & doses..." value={otherMedicationDetails} onChange={e=>setOtherMedicationDetails(e.target.value)}/>
//               <textarea className="text-input" rows={2} placeholder="What for?" value={otherMedicationUse} onChange={e=>setOtherMedicationUse(e.target.value)}/>
//             </>
//           )}
//         </section>

//         {/* 16 Supply & confirm */}
//         <section className="question-card">
//           <h2>Do you want to order a 3 month or 6 month supply of contraception?</h2>
//           <p className="subtitle">For new users we recommend 3 months, existing users 6 months.</p>
//           <div className="options-list">
//             {['3 months','6 months'].map(opt => (
//               <button key={opt} className={`option-btn ${supplyDuration===opt?'selected':''}`} onClick={e=>handleAnswer(e, setSupplyDuration, opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//           <label className={`checkbox-card ${confirmations?'selected':''}`}><input type="checkbox" checked={confirmations} onChange={()=>setConfirmations(!confirmations)}/>I have answered honestly & truthfully.</label>
//           <label className={`checkbox-card ${agreeTerms?'selected':''}`}><input type="checkbox" checked={agreeTerms} onChange={()=>setAgreeTerms(!agreeTerms)}/>I agree to the terms, privacy notice & cookie policy.</label>
//         </section>

//         <button className="next-button" disabled={!agreeTerms}>
//           Next
//         </button>
//       </div>
//     </>
//   );
// };

// export default ContraPage;
