
// // src/pages/auth/ContraPage.tsx
// import React, { useState } from 'react';
// import supabase from '../../supabase';
// import Header from '../Header';
// import './ContraPage.css';

// type AnswerValue = string | string[] | boolean;
// interface Answers {
//   [key: string]: AnswerValue;
// }

// const INFO_LONG_EXPIRE = `
// There are many different types of contraception available and we want to make sure that you’re choosing the right one for you.

// We can prescribe the mini pill, the combined pill and the contraceptive patch. All are easy to use and very effective when used correctly.

// The mini pill (or progesterone only pill) contains the hormone progesterone. Most women can use this pill safely. Examples include Cerazette, Cerelle and Noriday.

// The mini pill can help with heavy periods, but it can also cause irregular bleeding. Other possible side effects include sore breasts, mood changes and headaches.

// The combined pill, patch and vaginal ring contain both oestrogen and progesterone. Examples include Microgynon, Yasmin and the Evra Patch.

// Using these can make your periods lighter, less painful and more regular. They can help with acne and reduce the risk of womb and ovarian cancers. Other possible side effects include spotting, feeling sick and breast pain.

// There’s a small possible increase in the risk of breast cancer and cervical cancer with the combined contraceptive, but these risks reduce in time after you stop taking it. There is also an increase in the risk of getting blood clots in the legs or lungs. This risk may be even higher if you have other health conditions or you smoke, for example. If this is the case, a mini pill may be recommended as the safer option for you.

// Some combined contraceptives have a lower risk of blood clots than others. Pills containing levonorgestrel or norethisterone such as Microgynon, Rigevidon or Levest have the lowest risk (5 to 7 in 10,000 women), compared to pills containing desogestrel, drospirenone and gestodene such as Femodene, Gedarel and Yasmin which have a higher risk (9 to 12 in 10,000 women). This risk is still low for both and it’s worth weighing up these risks against any side effects you may get from a particular contraceptive. We’d recommend using a lower risk pill if you’ve not had any problems with pills before.

// It’s worth finding out more about contraceptive choices to make sure you’re choosing the right protection for you. If you’d like more advice on taking contraception you can send us a message through your account for free at any time.
// `;

// const INFO_LONG_BLEED = `
// I see that you are using a contraceptive implant at the moment and have been experiencing unexpected bleeding.

// The Royal College of Gynaecologists has advised that it is possible to use a combined contraceptive pill to help manage bleeding caused by progestogen-only implants, injections or intrauterine coils. Combined pills contain both oestrogen and progesterone. These pills should be used for up to 3 months. This is an off label use. This means that although it has become a widely accepted and recognised use of this medication, this use is outside the official license.

// After three months, if your bleeding has not settled to a normal pattern, you should see your GP to consider other causes or management options.

// The pills that we would generally use should contain 30-35mcg oestrogen with levonorgestrel or norethisterone, as these are lower risk compared to other pills. The combined pills we are able to recommend for managing bleeding on other contraception are the following: Microgynon 30, Rigevidon, Levest or Ovranette. All contain the same active ingredients but are different brands.

// It’s worth finding out more about contraceptive choices to make sure you’re choosing the right protection for you. If you’d like more advice on taking the pill you can send us a message through your account for free at any time.
// `;

// const ContraPage: React.FC = () => {
//   const [answers, setAnswers] = useState<Answers>({});
//   const [step, setStep] = useState(0);

//   // Height / weight units & inputs
//   const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('imperial');
//   const [ft, setFt] = useState(''), [inch, setInch] = useState(''), [cm, setCm] = useState('');
//   const [weightUnit, setWeightUnit] = useState<'imperial' | 'metric'>('imperial');
//   const [st, setSt] = useState(''), [lbs, setLbs] = useState(''), [kg, setKg] = useState('');

//   const setAnswer = (key: string, value: AnswerValue) =>
//     setAnswers(prev => ({ ...prev, [key]: value }));

//   interface Block {
//     element: JSX.Element;
//     stateKey?: string;
//   }
//   const blocks: Block[] = [];

//   //
//   // 1) Are you currently using any kind of hormonal contraception?
//   //
//   blocks.push({
//     element: (
//       <div>
//         <h2>Are you currently using any kind of hormonal contraception?</h2>
//         <p className="subtitle">
//           Such as the combined pill, mini pill, an IUS (coil), implant, injection or patch.
//         </p>
//         {['Yes','No'].map(opt => (
//           <button
//             key={opt}
//             className={`option-btn ${answers.currentUsing === opt ? 'selected' : ''}`}
//             onClick={() => setAnswer('currentUsing', opt)}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//     ),
//     stateKey: 'currentUsing'
//   });

//   //
//   // 2) Would you like to keep using the same contraception?
//   //
//   if (answers.currentUsing === 'Yes') {
//     blocks.push({
//       element: (
//         <div>
//           <h2>Would you like to keep using the same contraception?</h2>
//           {['Yes','No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${answers.keepSame === opt ? 'selected' : ''}`}
//               onClick={() => setAnswer('keepSame', opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       ),
//       stateKey: 'keepSame'
//     });
//   }

//   //
//   // 2b) If currently using AND keepSame = No → name & reason & INFO+checkbox
//   //
//   if (answers.currentUsing === 'Yes' && answers.keepSame === 'No') {
//     // Name of current
//     blocks.push({
//       element: (
//         <div>
//           <h2>Can you tell us the name of the contraception you're using now?</h2>
//           <textarea
//             className="text-input"
//             rows={2}
//             value={(answers.nameDetail as string) || ''}
//             onChange={e => setAnswer('nameDetail', e.target.value)}
//           />
//         </div>
//       ),
//       stateKey: 'nameDetail'
//     });
//     // Reason for change
//     blocks.push({
//       element: (
//         <div>
//           <h2>Why would you like to change?</h2>
//           <textarea
//             className="text-input"
//             rows={2}
//             value={(answers.changeReason as string) || ''}
//             onChange={e => setAnswer('changeReason', e.target.value)}
//           />
//         </div>
//       ),
//       stateKey: 'changeReason'
//     });
//     // INFO + checkbox
//     blocks.push({
//       element: (
//         <div>
//           <div className="info-block">{INFO_LONG_EXPIRE}</div>
//           <label className="checkbox-card">
//             <input
//               type="checkbox"
//               checked={!!answers.expireConfirm}
//               onChange={e => setAnswer('expireConfirm', e.target.checked)}
//             />
//             <div>
//               Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
//               <ul>
//                 <li><strong>have read and understood the information provided above</strong></li>
//                 <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
//                 <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
//                 <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or have difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
//                 <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
//               </ul>
//             </div>
//           </label>
//         </div>
//       ),
//       stateKey: 'expireConfirm'
//     });
//   }

//   //
//   // 2c) If not currently using → Have you ever used any kind of hormonal contraception?
//   //
//   if (answers.currentUsing === 'No') {
//     blocks.push({
//       element: (
//         <div>
//           <h2>Have you ever used any kind of hormonal contraception?</h2>
//           {['Yes','No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${answers.everUsed === opt ? 'selected' : ''}`}
//               onClick={() => setAnswer('everUsed', opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       ),
//       stateKey: 'everUsed'
//     });

//     // If everUsed = Yes → previous methods + INFO+checkbox
//     if (answers.everUsed === 'Yes') {
//       blocks.push({
//         element: (
//           <div>
//             <h2>Can you tell us the name(s) of the contraception you have previously used?</h2>
//             <textarea
//               className="text-input"
//               rows={2}
//               value={(answers.prevContraception as string) || ''}
//               onChange={e => setAnswer('prevContraception', e.target.value)}
//             />
//           </div>
//         ),
//         stateKey: 'prevContraception'
//       });
//       blocks.push({
//         element: (
//           <div>
//             <div className="info-block">{INFO_LONG_EXPIRE}</div>
//             <label className="checkbox-card">
//               <input
//                 type="checkbox"
//                 checked={!!answers.prevConfirm}
//                 onChange={e => setAnswer('prevConfirm', e.target.checked)}
//               />
//               <div>
//                 Because you’re not currently using contraception, it's important that you let us know that you:
//                 <ul>
//                   <li><strong>have read and understood the information provided above</strong></li>
//                   <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
//                   <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
//                   <li>understand the risks and possible side effects, including blood clots, and that if you get pain in your leg or difficulty breathing you must seek urgent care</li>
//                   <li>will contact your online doctor or GP if you have any questions</li>
//                 </ul>
//               </div>
//             </label>
//           </div>
//         ),
//         stateKey: 'prevConfirm'
//       });
//     }

//     // If everUsed = No → INFO+checkbox only
//     if (answers.everUsed === 'No') {
//       blocks.push({
//         element: (
//           <div>
//             <div className="info-block">{INFO_LONG_EXPIRE}</div>
//             <label className="checkbox-card">
//               <input
//                 type="checkbox"
//                 checked={!!answers.everConfirm}
//                 onChange={e => setAnswer('everConfirm', e.target.checked)}
//               />
//               <div>
//                 Because you’ve never used hormonal contraception before, it's important that you let us know that you:
//                 <ul>
//                   <li><strong>have read and understood the information provided above</strong></li>
//                   <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
//                   <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
//                   <li>understand the risks and possible side effects, including blood clots, and that if you get pain or difficulty breathing you must seek urgent care</li>
//                   <li>will contact your online doctor or GP if you have any questions</li>
//                 </ul>
//               </div>
//             </label>
//           </div>
//         ),
//         stateKey: 'everConfirm'
//       });
//     }
//   }

//   //
//   // 3–7) keepSame = Yes flow (unchanged)
//   //
//   if (answers.keepSame === 'Yes') {
//     // 3) What type of contraception?
//     blocks.push({
//       element: (
//         <div>
//           <h2>What type of contraception are you using?</h2>
//           {[
//             'Contraceptive pill',
//             'Contraceptive implant',
//             'Contraceptive injection',
//             'Contraceptive coil',
//             'Contraceptive patch or ring',
//             'Other'
//           ].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${answers.type === opt ? 'selected' : ''}`}
//               onClick={() => setAnswer('type', opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       ),
//       stateKey: 'type'
//     });

//     // 4) Name of current contraception
//     blocks.push({
//       element: (
//         <div>
//           <h2>Can you tell us the name of the contraception you're using now?</h2>
//           <textarea
//             className="text-input"
//             rows={2}
//             value={(answers.nameDetail as string) || ''}
//             onChange={e => setAnswer('nameDetail', e.target.value)}
//           />
//         </div>
//       ),
//       stateKey: 'nameDetail'
//     });

//     // 5) If implant/injection/coil → why need another?
//     if (
//       answers.type === 'Contraceptive implant' ||
//       answers.type === 'Contraceptive injection' ||
//       answers.type === 'Contraceptive coil'
//     ) {
//       // 5a) Why need another?
//       blocks.push({
//         element: (
//           <div>
//             <h2>
//               Can you tell us why you need another type of contraception as well as the one you're currently using?
//             </h2>
//             {[
//               'my contraception is about to run out or expire',
//               'to control irregular bleeding on this contraception',
//               'other reasons'
//             ].map(opt => (
//               <button
//                 key={opt}
//                 className={`option-btn ${answers.needAnotherReason === opt ? 'selected' : ''}`}
//                 onClick={() => setAnswer('needAnotherReason', opt)}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         ),
//         stateKey: 'needAnotherReason'
//       });

//       // 5b) Expire path
//       if (answers.needAnotherReason === 'my contraception is about to run out or expire') {
//         blocks.push({
//           element: (
//             <div>
//               <div className="info-block">{INFO_LONG_EXPIRE}</div>
//               <label className="checkbox-card">
//                 <input
//                   type="checkbox"
//                   checked={!!answers.expireConfirm}
//                   onChange={e => setAnswer('expireConfirm', e.target.checked)}
//                 />
//                 <div>
//                   Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
//                   <ul>
//                     <li><strong>have read and understood the information provided above</strong></li>
//                     <li>understand that if you miss a contraceptive or take one late there is a risk that you might get pregnant</li>
//                     <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
//                     <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or have difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
//                     <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
//                   </ul>
//                 </div>
//               </label>
//             </div>
//           ),
//           stateKey: 'expireConfirm'
//         });
//       }

//       // 5c) Irregular bleeding path
//       if (answers.needAnotherReason === 'to control irregular bleeding on this contraception') {
//         blocks.push({
//           element: (
//             <div>
//               <h2>
//                 Are you currently using, or recently used, a contraceptive pill, patch or vaginal ring to control bleeding due to your other contraceptive?
//               </h2>
//               {['Yes','No'].map(opt => (
//                 <button
//                   key={opt}
//                   className={`option-btn ${answers.bleedControlUsed === opt ? 'selected' : ''}`}
//                   onClick={() => setAnswer('bleedControlUsed', opt)}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           ),
//           stateKey: 'bleedControlUsed'
//         });

//         if (answers.bleedControlUsed === 'Yes') {
//           blocks.push({
//             element: (
//               <div>
//                 <h2>
//                   What is the name of the additional contraceptive you've used, and how long have you used it for?
//                 </h2>
//                 <textarea
//                   className="text-input"
//                   rows={2}
//                   value={(answers.bleedAdditionalDetail as string) || ''}
//                   onChange={e => setAnswer('bleedAdditionalDetail', e.target.value)}
//                 />
//               </div>
//             ),
//             stateKey: 'bleedAdditionalDetail'
//           });
//         }

//         blocks.push({
//           element: (
//             <div>
//               <div className="info-block">{INFO_LONG_BLEED}</div>
//               <label className="checkbox-card improved-checkbox">
//                 <input
//                   type="checkbox"
//                   checked={!!answers.bleedConfirm}
//                   onChange={e => setAnswer('bleedConfirm', e.target.checked)}
//                 />
//                 <div className="checkbox-text">
//                   Because you’re not currently using the contraceptive pill, it's important that you let us know that you:
//                   <ul>
//                     <li><strong>have read and understood the information provided above</strong></li>
//                     <li>understand that the use of the pill to control irregular bleeding is an off-label use</li>
//                     <li>understand the risks and possible side effects of taking the pill, including blood clots, and that if you get pain in your leg or have difficulty breathing while on the pill, you need to speak to a doctor urgently</li>
//                     <li>will contact your online doctor or your GP if you have any questions about taking the pill</li>
//                   </ul>
//                 </div>
//               </label>
//             </div>
//           ),
//           stateKey: 'bleedConfirm'
//         });
//       }

//       // 5d) Other reasons path
//       if (answers.needAnotherReason === 'other reasons') {
//         blocks.push({
//           element: (
//             <div>
//               <h2>Please provide more details:</h2>
//               <textarea
//                 className="text-input"
//                 rows={2}
//                 value={(answers.otherReasonDetails as string) || ''}
//                 onChange={e => setAnswer('otherReasonDetails', e.target.value)}
//               />
//             </div>
//           ),
//           stateKey: 'otherReasonDetails'
//         });

//         blocks.push({
//           element: (
//             <div>
//               <div className="info-block">{INFO_LONG_EXPIRE}</div>
//               <label className="checkbox-card">
//                 <input
//                   type="checkbox"
//                   checked={!!answers.otherConfirm}
//                   onChange={e => setAnswer('otherConfirm', e.target.checked)}
//                 />
//                 <div>
//                   Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
//                   <ul>
//                     <li><strong>have read and understood the information provided above</strong></li>
//                     <li>understand that if you miss a contraceptive or take one late there is a risk that you might get pregnant</li>
//                     <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
//                     <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or have difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
//                     <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
//                   </ul>
//                 </div>
//               </label>
//             </div>
//           ),
//           stateKey: 'otherConfirm'
//         });
//       }
//     }
//   }

//   //
//   // 8) Height & Weight (always at end)
//   //
//   blocks.push({
//     element: (
//       <div>
//         <h2>What is your height?</h2>
//         <p className="subtitle">select ft and in or cm</p>
//         {heightUnit === 'imperial' ? (
//           <div className="imperial-row">
//             <input
//               type="number"
//               placeholder="e.g. 5 ft."
//               value={ft}
//               onChange={e => setFt(e.target.value)}
//               onBlur={() => setAnswer('height', `${ft} ft ${inch} in`)}
//             />
//             <input
//               type="number"
//               placeholder="e.g. 3 in."
//               value={inch}
//               onChange={e => setInch(e.target.value)}
//               onBlur={() => setAnswer('height', `${ft} ft ${inch} in`)}
//             />
//           </div>
//         ) : (
//           <div className="metric-row">
//             <input
//               type="number"
//               placeholder="e.g. 170 cm"
//               value={cm}
//               onChange={e => setCm(e.target.value)}
//               onBlur={() => setAnswer('height', `${cm} cm`)}
//             />
//           </div>
//         )}
//         <button
//           className="unit-switch"
//           onClick={() => {
//             if (heightUnit === 'imperial') {
//               setHeightUnit('metric');
//               setFt('');
//               setInch('');
//               setAnswer('height', '');
//             } else {
//               setHeightUnit('imperial');
//               setCm('');
//               setAnswer('height', '');
//             }
//           }}
//         >
//           {heightUnit === 'imperial' ? 'Switch to cm.' : 'Switch to ft., in.'}
//         </button>

//         <h2>What is your weight?</h2>
//         <p className="subtitle">select st and lbs or kg</p>
//         {weightUnit === 'imperial' ? (
//           <div className="imperial-row">
//             <input
//               type="number"
//               placeholder="e.g. 10 st."
//               value={st}
//               onChange={e => setSt(e.target.value)}
//               onBlur={() => setAnswer('weight', `${st} st ${lbs} lbs`)}
//             />
//             <input
//               type="number"
//               placeholder="e.g. 3 lbs."
//               value={lbs}
//               onChange={e => setLbs(e.target.value)}
//               onBlur={() => setAnswer('weight', `${st} st ${lbs} lbs`)}
//             />
//           </div>
//         ) : (
//           <div className="metric-row">
//             <input
//               type="number"
//               placeholder="e.g. 75 kg"
//               value={kg}
//               onChange={e => setKg(e.target.value)}
//               onBlur={() => setAnswer('weight', `${kg} kg`)}
//             />
//           </div>
//         )}
//         <button
//           className="unit-switch"
//           onClick={() => {
//             if (weightUnit === 'imperial') {
//               setWeightUnit('metric');
//               setSt('');
//               setLbs('');
//               setAnswer('weight', '');
//             } else {
//               setWeightUnit('imperial');
//               setKg('');
//               setAnswer('weight', '');
//             }
//           }}
//         >
//           {weightUnit === 'imperial' ? 'Switch to kg.' : 'Switch to st., lbs.'}
//         </button>

//         <p className="subtitle">
//           We use this information to calculate your BMI (body mass index). If you have a high BMI a combined contraceptive may not be suitable for you
//         </p>
//       </div>
//     )
//   });

//   //
//   // Navigation logic
//   //
//   const canNext = () => {
//     const cfg = blocks[step];
//     if (cfg.stateKey) {
//       const val = answers[cfg.stateKey];
//       return typeof val === 'boolean' ? val : !!val;
//     }
//     return true;
//   };
//   const goNext = () => {
//     if (!canNext()) return;
//     setStep(s => Math.min(s + 1, blocks.length - 1));
//   };
//   const goPrev = () => {
//     setStep(s => Math.max(s - 1, 0));
//   };
//   const handleSubmit = async () => {
//     await supabase.from('contraception_assessment').insert([answers]);
//     alert('Submitted!');
//   };

//   return (
//     <>
//       <Header />
//       <div className="contra-container">
//         <h1 className="page-title">Contraception Assessment</h1>
//         <section className="question-card">
//           {blocks[step].element}
//         </section>
//         <div className="pager-buttons">
//           <button className="prev-btn" onClick={goPrev} disabled={step === 0}>
//             Back
//           </button>
//           {step < blocks.length - 1 ? (
//             <button className="next-btn" onClick={goNext} disabled={!canNext()}>
//               Next
//             </button>
//           ) : (
//             <button className="submit-btn" onClick={handleSubmit} disabled={!canNext()}>
//               Submit
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ContraPage;
// src/pages/auth/ContraPage.tsx
import React, { useState } from 'react';
import supabase from '../../supabase';
import Header from '../Header';
import './ContraPage.css';

type AnswerValue = string | string[] | boolean;
interface Answers {
  [key: string]: AnswerValue;
}

const INFO_LONG_EXPIRE = `
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

const INFO_LONG_BLEED = `
I see that you are using a contraceptive implant at the moment and have been experiencing unexpected bleeding.

The Royal College of Gynaecologists has advised that it is possible to use a combined contraceptive pill to help manage bleeding caused by progestogen-only implants, injections or intrauterine coils. Combined pills contain both oestrogen and progesterone. These pills should be used for up to 3 months. This is an off label use. This means that although it has become a widely accepted and recognised use of this medication, this use is outside the official license.

After three months, if your bleeding has not settled to a normal pattern, you should see your GP to consider other causes or management options.

The pills that we would generally use should contain 30-35mcg oestrogen with levonorgestrel or norethisterone, as these are lower risk compared to other pills. The combined pills we are able to recommend for managing bleeding on other contraception are the following: Microgynon 30, Rigevidon, Levest or Ovranette. All contain the same active ingredients but are different brands.

It’s worth finding out more about contraceptive choices to make sure you’re choosing the right protection for you. If you’d like more advice on taking the pill you can send us a message through your account for free at any time.
`;

const ContraPage: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);

  // Height / weight units & inputs
  const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('imperial');
  const [ft, setFt] = useState(''), [inch, setInch] = useState(''), [cm, setCm] = useState('');
  const [weightUnit, setWeightUnit] = useState<'imperial' | 'metric'>('imperial');
  const [st, setSt] = useState(''), [lbs, setLbs] = useState(''), [kg, setKg] = useState('');

  const setAnswer = (key: string, value: AnswerValue) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  interface Block {
    element: JSX.Element;
    stateKey?: string;
  }
  const blocks: Block[] = [];

  //
  // 1) Are you currently using any kind of hormonal contraception?
  //
  blocks.push({
    element: (
      <div>
        <h2>Are you currently using any kind of hormonal contraception?</h2>
        <p className="subtitle">
          Such as the combined pill, mini pill, an IUS (coil), implant, injection or patch.
        </p>
        {['Yes','No'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.currentUsing === opt ? 'selected' : ''}`}
            onClick={() => setAnswer('currentUsing', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'currentUsing'
  });

  //
  // 2) Would you like to keep using the same contraception?
  //
  if (answers.currentUsing === 'Yes') {
    blocks.push({
      element: (
        <div>
          <h2>Would you like to keep using the same contraception?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.keepSame === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('keepSame', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'keepSame'
    });
  }

  //
  // 2b) If currently using AND keepSame = No → name & reason & INFO+checkbox
  //
  if (answers.currentUsing === 'Yes' && answers.keepSame === 'No') {
    blocks.push({
      element: (
        <div>
          <h2>Can you tell us the name of the contraception you're using now?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.nameDetail as string) || ''}
            onChange={e => setAnswer('nameDetail', e.target.value)}
          />
        </div>
      ),
      stateKey: 'nameDetail'
    });
    blocks.push({
      element: (
        <div>
          <h2>Why would you like to change?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.changeReason as string) || ''}
            onChange={e => setAnswer('changeReason', e.target.value)}
          />
        </div>
      ),
      stateKey: 'changeReason'
    });
    blocks.push({
      element: (
        <div>
          <div className="info-block">{INFO_LONG_EXPIRE}</div>
          <label className="checkbox-card">
            <input
              type="checkbox"
              checked={!!answers.expireConfirm}
              onChange={e => setAnswer('expireConfirm', e.target.checked)}
            />
            <div>
              Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
              <ul>
                <li><strong>have read and understood the information provided above</strong></li>
                <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
                <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or have difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
                <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
              </ul>
            </div>
          </label>
        </div>
      ),
      stateKey: 'expireConfirm'
    });
  }

  //
  // 2c) If not currently using → Have you ever used any kind of hormonal contraception?
  //
  if (answers.currentUsing === 'No') {
    blocks.push({
      element: (
        <div>
          <h2>Have you ever used any kind of hormonal contraception?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.everUsed === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('everUsed', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'everUsed'
    });

    if (answers.everUsed === 'Yes') {
      blocks.push({
        element: (
          <div>
            <h2>Can you tell us the name(s) of the contraception you have previously used?</h2>
            <textarea
              className="text-input"
              rows={2}
              value={(answers.prevContraception as string) || ''}
              onChange={e => setAnswer('prevContraception', e.target.value)}
            />
          </div>
        ),
        stateKey: 'prevContraception'
      });
      blocks.push({
        element: (
          <div>
            <div className="info-block">{INFO_LONG_EXPIRE}</div>
            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={!!answers.prevConfirm}
                onChange={e => setAnswer('prevConfirm', e.target.checked)}
              />
              <div>
                Because you’re not currently using contraception, it's important that you let us know that you:
                <ul>
                  <li><strong>have read and understood the information provided above</strong></li>
                  <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
                  <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                  <li>understand the risks and possible side effects, including blood clots, and that if you get pain in your leg or difficulty breathing you must seek urgent care</li>
                  <li>will contact your online doctor or GP if you have any questions</li>
                </ul>
              </div>
            </label>
          </div>
        ),
        stateKey: 'prevConfirm'
      });
    }

    if (answers.everUsed === 'No') {
      blocks.push({
        element: (
          <div>
            <div className="info-block">{INFO_LONG_EXPIRE}</div>
            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={!!answers.everConfirm}
                onChange={e => setAnswer('everConfirm', e.target.checked)}
              />
              <div>
                Because you’ve never used hormonal contraception before, it's important that you let us know that you:
                <ul>
                  <li><strong>have read and understood the information provided above</strong></li>
                  <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
                  <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                  <li>understand the risks and possible side effects, including blood clots, and that if you get pain or difficulty breathing you must seek urgent care</li>
                  <li>will contact your online doctor or GP if you have any questions</li>
                </ul>
              </div>
            </label>
          </div>
        ),
        stateKey: 'everConfirm'
      });
    }
  }

  //
  // 3–7) keepSame = Yes flow (unchanged)
  //
  if (answers.keepSame === 'Yes') {
    blocks.push({
      element: (
        <div>
          <h2>What type of contraception are you using?</h2>
          {[
            'Contraceptive pill',
            'Contraceptive implant',
            'Contraceptive injection',
            'Contraceptive coil',
            'Contraceptive patch or ring',
            'Other'
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.type === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('type', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'type'
    });
    blocks.push({
      element: (
        <div>
          <h2>Can you tell us the name of the contraception you're using now?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.nameDetail as string) || ''}
            onChange={e => setAnswer('nameDetail', e.target.value)}
          />
        </div>
      ),
      stateKey: 'nameDetail'
    });
    if (
      answers.type === 'Contraceptive implant' ||
      answers.type === 'Contraceptive injection' ||
      answers.type === 'Contraceptive coil'
    ) {
      blocks.push({
        element: (
          <div>
            <h2>
              Can you tell us why you need another type of contraception as well as the one you're currently using?
            </h2>
            {[
              'my contraception is about to run out or expire',
              'to control irregular bleeding on this contraception',
              'other reasons'
            ].map(opt => (
              <button
                key={opt}
                className={`option-btn ${answers.needAnotherReason === opt ? 'selected' : ''}`}
                onClick={() => setAnswer('needAnotherReason', opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ),
        stateKey: 'needAnotherReason'
      });

      if (answers.needAnotherReason === 'my contraception is about to run out or expire') {
        blocks.push({
          element: (
            <div>
              <div className="info-block">{INFO_LONG_EXPIRE}</div>
              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={!!answers.expireConfirm}
                  onChange={e => setAnswer('expireConfirm', e.target.checked)}
                />
                <div>
                  Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
                  <ul>
                    <li><strong>have read and understood the information provided above</strong></li>
                    <li>understand that if you miss a contraceptive or take one late there is a risk that you might get pregnant</li>
                    <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                    <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or have difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
                    <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
                  </ul>
                </div>
              </label>
            </div>
          ),
          stateKey: 'expireConfirm'
        });
      }

      if (answers.needAnotherReason === 'to control irregular bleeding on this contraception') {
        blocks.push({
          element: (
            <div>
              <h2>
                Are you currently using, or recently used, a contraceptive pill, patch or vaginal ring to control bleeding due to your other contraceptive?
              </h2>
              {['Yes','No'].map(opt => (
                <button
                  key={opt}
                  className={`option-btn ${answers.bleedControlUsed === opt ? 'selected' : ''}`}
                  onClick={() => setAnswer('bleedControlUsed', opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          ),
          stateKey: 'bleedControlUsed'
        });

        if (answers.bleedControlUsed === 'Yes') {
          blocks.push({
            element: (
              <div>
                <h2>
                  What is the name of the additional contraceptive you've used, and how long have you used it for?
                </h2>
                <textarea
                  className="text-input"
                  rows={2}
                  value={(answers.bleedAdditionalDetail as string) || ''}
                  onChange={e => setAnswer('bleedAdditionalDetail', e.target.value)}
                />
              </div>
            ),
            stateKey: 'bleedAdditionalDetail'
          });
        }

        blocks.push({
          element: (
            <div>
              <div className="info-block">{INFO_LONG_BLEED}</div>
              <label className="checkbox-card improved-checkbox">
                <input
                  type="checkbox"
                  checked={!!answers.bleedConfirm}
                  onChange={e => setAnswer('bleedConfirm', e.target.checked)}
                />
                <div className="checkbox-text">
                  Because you’re not currently using the contraceptive pill, it's important that you let us know that you:
                  <ul>
                    <li><strong>have read and understood the information provided above</strong></li>
                    <li>understand that the use of the pill to control irregular bleeding is an off-label use</li>
                    <li>understand the risks and possible side effects of taking the pill, including blood clots, and that if you get pain in your leg or have difficulty breathing while on the pill, you need to speak to a doctor urgently</li>
                    <li>will contact your online doctor or your GP if you have any questions about taking the pill</li>
                  </ul>
                </div>
              </label>
            </div>
          ),
          stateKey: 'bleedConfirm'
        });
      }

      if (answers.needAnotherReason === 'other reasons') {
        blocks.push({
          element: (
            <div>
              <h2>Please provide more details:</h2>
              <textarea
                className="text-input"
                rows={2}
                value={(answers.otherReasonDetails as string) || ''}
                onChange={e => setAnswer('otherReasonDetails', e.target.value)}
              />
            </div>
          ),
          stateKey: 'otherReasonDetails'
        });

        blocks.push({
          element: (
            <div>
              <div className="info-block">{INFO_LONG_EXPIRE}</div>
              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={!!answers.otherConfirm}
                  onChange={e => setAnswer('otherConfirm', e.target.checked)}
                />
                <div>
                  Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
                  <ul>
                    <li><strong>have read and understood the information provided above</strong></li>
                    <li>understand that if you miss a contraceptive or take one late there is a risk that you might get pregnant</li>
                    <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                    <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or difficulty breathing you need to speak to a doctor urgently</li>
                    <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
                  </ul>
                </div>
              </label>
            </div>
          ),
          stateKey: 'otherConfirm'
        });
      }
    }
  }

  //
  // 8) Height & Weight (always next)
  //
  blocks.push({
    element: (
      <div>
        <h2>What is your height?</h2>
        <p className="subtitle">select ft and in or cm</p>
        {heightUnit === 'imperial' ? (
          <div className="imperial-row">
            <input
              type="number"
              placeholder="e.g. 5 ft."
              value={ft}
              onChange={e => setFt(e.target.value)}
              onBlur={() => setAnswer('height', `${ft} ft ${inch} in`)}
            />
            <input
              type="number"
              placeholder="e.g. 3 in."
              value={inch}
              onChange={e => setInch(e.target.value)}
              onBlur={() => setAnswer('height', `${ft} ft ${inch} in`)}
            />
          </div>
        ) : (
          <div className="metric-row">
            <input
              type="number"
              placeholder="e.g. 170 cm"
              value={cm}
              onChange={e => setCm(e.target.value)}
              onBlur={() => setAnswer('height', `${cm} cm`)}
            />
          </div>
        )}
        <button
          className="unit-switch"
          onClick={() => {
            if (heightUnit === 'imperial') {
              setHeightUnit('metric'); setFt(''); setInch(''); setAnswer('height','');
            } else {
              setHeightUnit('imperial'); setCm(''); setAnswer('height','');
            }
          }}
        >
          {heightUnit === 'imperial' ? 'Switch to cm.' : 'Switch to ft., in.'}
        </button>

        <h2>What is your weight?</h2>
        <p className="subtitle">select st and lbs or kg</p>
        {weightUnit === 'imperial' ? (
          <div className="imperial-row">
            <input
              type="number"
              placeholder="e.g. 10 st."
              value={st}
              onChange={e => setSt(e.target.value)}
              onBlur={() => setAnswer('weight', `${st} st ${lbs} lbs`)}
            />
            <input
              type="number"
              placeholder="e.g. 3 lbs."
              value={lbs}
              onChange={e => setLbs(e.target.value)}
              onBlur={() => setAnswer('weight', `${st} st ${lbs} lbs`)}
            />
          </div>
        ) : (
          <div className="metric-row">
            <input
              type="number"
              placeholder="e.g. 75 kg"
              value={kg}
              onChange={e => setKg(e.target.value)}
              onBlur={() => setAnswer('weight', `${kg} kg`)}
            />
          </div>
        )}
        <button
          className="unit-switch"
          onClick={() => {
            if (weightUnit === 'imperial') {
              setWeightUnit('metric'); setSt(''); setLbs(''); setAnswer('weight','');
            } else {
              setWeightUnit('imperial'); setKg(''); setAnswer('weight','');
            }
          }}
        >
          {weightUnit === 'imperial' ? 'Switch to kg.' : 'Switch to st., lbs.'}
        </button>

        <p className="subtitle">
          We use this information to calculate your BMI (body mass index). If you have a high BMI a combined contraceptive may not be suitable for you
        </p>
      </div>
    )
  });

  //
  // 9) Blood pressure measured?
  //
  blocks.push({
    element: (
      <div>
        <h2>Has your blood pressure been measured in the last 12 months?</h2>
        <p className="subtitle">
          We need a recent blood pressure measurement because some pills or patches can cause blood pressure to rise. Some contraceptives can increase your risk of certain medical conditions. Our doctors will look at your blood pressure alongside the other information you provide to decide if it’s safe for them to prescribe you the combined contraceptive.
        </p>
        {['Yes','No'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.bpMeasured === opt ? 'selected' : ''}`}
            onClick={() => setAnswer('bpMeasured', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'bpMeasured'
  });

  //
  // 10) If bpMeasured = Yes → What was the reading?
  //
  if (answers.bpMeasured === 'Yes') {
    blocks.push({
      element: (
        <div>
          <h2>What was the reading?</h2>
          {[
            'Less than 140/90 (both numbers are less)',
            '140/90 or higher (either number is higher)',
            "I don't know"
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.bpReading === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('bpReading', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bpReading'
    });

    // a) 140/90 or higher → free-text
    if (answers.bpReading === '140/90 or higher (either number is higher)') {
      blocks.push({
        element: (
          <div>
            <h2>Please give the 2 numbers of your blood pressure reading (for example 140/90):</h2>
            <textarea
              className="text-input"
              rows={2}
              value={(answers.bpValue as string) || ''}
              onChange={e => setAnswer('bpValue', e.target.value)}
            />
          </div>
        ),
        stateKey: 'bpValue'
      });
    }

    // b) I don't know → orderType + conditional bpValue
    if (answers.bpReading === "I don't know") {
      // 1) Which contraceptive do you want?
      blocks.push({
        element: (
          <div>
            <h2>Do you know the type of contraceptive that you would like to order?</h2>
            {[
              'Combined pill, patch or vaginal ring (for example Microgynon, Cilique, Qlaira)',
              'Mini pill (for example Cerelle, Cerazette, Hana, Noriday)',
              "I don't know"
            ].map(opt => (
              <button
                key={opt}
                className={`option-btn ${answers.orderType === opt ? 'selected' : ''}`}
                onClick={() => setAnswer('orderType', opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ),
        stateKey: 'orderType',
      });

      // 2) Only if they did NOT pick the mini-pill, ask for the two numbers
      const MINI = 'Mini pill (for example Cerelle, Cerazette, Hana, Noriday)';
      if (answers.orderType && answers.orderType !== MINI) {
        blocks.push({
          element: (
            <div>
              <h2>Please give the 2 numbers of your blood pressure reading (for example 140/90):</h2>
              <textarea
                className="text-input"
                rows={2}
                value={(answers.bpValue as string) || ''}
                onChange={e => setAnswer('bpValue', e.target.value)}
              />
            </div>
          ),
          stateKey: 'bpValue',
        });
      }
    }
  }

  //
  // 11) If bpMeasured = No → same orderType + free-text
  //
  if (answers.bpMeasured === 'No') {
    blocks.push({
      element: (
        <div>
          <h2>Do you know the type of contraceptive that you would like to order?</h2>
          {[
            'Combined pill, patch or vaginal ring (for example Microgynon, Cilique, Qlaira)',
            'Mini pill (for example Cerelle, Cerazette, Hana, Noriday)',
            "I don't know"
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.orderType === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('orderType', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'orderType'
    });
    blocks.push({
      element: (
        <div>
          <h2>Please give the 2 numbers of your blood pressure reading (for example 140/90):</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.bpValue as string) || ''}
            onChange={e => setAnswer('bpValue', e.target.value)}
          />
        </div>
      ),
      stateKey: 'bpValue'
    });
  }

  //
  // 12) Allergies
  //
  blocks.push({
    element: (
      <div>
        <h2>Are you allergic to any medicines or other substances?</h2>
        <p className="subtitle">
          For example lactose. Being allergic to certain substances may mean you cannot take the pill.
        </p>
        {['Yes','No'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.allergy === opt ? 'selected' : ''}`}
            onClick={() => setAnswer('allergy', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'allergy'
  });

  //
  // 12b) If allergy = Yes → checklist
  //
  if (answers.allergy === 'Yes') {
    const options = ['penicillin','peanuts or soya','lactose','other medications','other substances'];
    blocks.push({
      element: (
        <div>
          <h2>Are you allergic to:</h2>
          {options.map(opt => (
            <label key={opt} className="checkbox-card">
              <input
                type="checkbox"
                checked={Array.isArray(answers.allergyList) && (answers.allergyList as string[]).includes(opt)}
                onChange={() => {
                  const current = Array.isArray(answers.allergyList) ? [...answers.allergyList] : [];
                  const idx = current.indexOf(opt);
                  if (idx > -1) current.splice(idx,1);
                  else current.push(opt);
                  setAnswer('allergyList', current);
                }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ),
      stateKey: 'allergyList'
    });
  }

  //
  // 13) Smoking
  //
  blocks.push({
    element: (
      <div>
        <h2>Do you smoke?</h2>
        <p className="subtitle">
          We ask you this because it will help us decide which type of contraceptive is safe for you. If you smoke while taking some contraceptives, it can increase your risk of a blood clot, stroke or heart attack.
        </p>
        {['Yes','No','I used to smoke'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.smoke === opt ? 'selected' : ''}`}
            onClick={() => setAnswer('smoke', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'smoke'
  });

  //
  // 13b) If "I used to smoke" → when did you stop?
  //
  if (answers.smoke === 'I used to smoke') {
    blocks.push({
      element: (
        <div>
          <h2>When did you stop smoking?</h2>
          {['In the last 12 months','More than 12 months ago'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.smokeStopped === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('smokeStopped', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'smokeStopped'
    });
  }

  //
  // 14) Pregnancy / birth in last 6 weeks?
  //
  blocks.push({
    element: (
      <div>
        <h2>Are you pregnant or have you given birth in the last 6 weeks?</h2>
        <p className="subtitle">
          This can affect which type of contraceptive we recommend.
        </p>
        {[
          "I'm pregnant or there's a chance I could be",
          'I gave birth in the last 3 weeks',
          'I gave birth in the last 3 to 6 weeks',
          'No, none of these'
        ].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.pregnantRecently === opt ? 'selected' : ''}`}
            onClick={() => setAnswer('pregnantRecently', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'pregnantRecently'
  });

  //
  // 14b) If gave birth 3–6 weeks → breastfeeding?
  //
  if (answers.pregnantRecently === 'I gave birth in the last 3 to 6 weeks') {
    blocks.push({
      element: (
        <div>
          <h2>Are you breastfeeding?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.breastfeeding === opt ? 'selected' : ''}`}
              onClick={() => setAnswer('breastfeeding', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'breastfeeding'
    });

    // 14c) If breastfeeding = No → postpartum complications
    if (answers.breastfeeding === 'No') {
      const comps = [
        'a blood transfusion or a significant loss of blood during or after your delivery',
        'a caesarian section',
        'pre-eclampsia during or after your pregnancy',
        'none of these'
      ];
      blocks.push({
        element: (
          <div>
            <h2>Did you have:</h2>
            {comps.map(opt => (
              <button
                key={opt}
                className={`option-btn ${answers.postBirthComplication === opt ? 'selected' : ''}`}
                onClick={() => setAnswer('postBirthComplication', opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ),
        stateKey: 'postBirthComplication'
      });
    }
  }

  //
  // Navigation logic
  //
  const canNext = () => {
    const cfg = blocks[step];
    if (cfg.stateKey) {
      const val = answers[cfg.stateKey];
      return typeof val === 'boolean' ? val : !!val;
    }
    return true;
  };
  const goNext = () => {
    if (!canNext()) return;
    setStep(s => Math.min(s + 1, blocks.length - 1));
  };
  const goPrev = () => setStep(s => Math.max(s - 1, 0));
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
          {blocks[step].element}
        </section>
        <div className="pager-buttons">
          <button className="prev-btn" onClick={goPrev} disabled={step === 0}>
            Back
          </button>
          {step < blocks.length - 1 ? (
            <button className="next-btn" onClick={goNext} disabled={!canNext()}>
              Next
            </button>
          ) : (
            <button className="submit-btn" onClick={handleSubmit} disabled={!canNext()}>
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
