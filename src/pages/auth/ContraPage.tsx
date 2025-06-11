// ContraPage.tsx
import React, { useState } from 'react';
import Header from '../Header';
import './ContraPage.css';

const CONTRACEPTION_TYPES = [
  'Contraceptive pill',
  'Contraceptive implant',
  'Contraceptive injection',
  'Contraceptive coil',
  'Contraceptive patch or ring',
  'Other'
];

const CLOT_RISK_OPTIONS = [
  'I have had a blood clot before',
  'Someone in my close family has had a blood clot',
  'I have had major surgery in the last 3 weeks',
  'I am immobile',
  'None of these apply to me'
];

const CANCER_TYPES = [
  'Breast cancer',
  'Cervical cancer',
  'Liver cancer',
  'Other cancer',
  'I have never had cancer'
];

const MEDICATION_LIST = [
  'Carbamazepine',
  'Eslicarbazepine',
  'Griseofulvin',
  'Lamotrigine',
  'Modafinil',
  'Orlistat',
  'Oxcarbazepine',
  'Phenytoin',
  'Rifabutin',
  'Rifampicin',
  'Topiramate',
  'None of the above'
];

const ContraPage: React.FC = () => {
  // contraception states
  const [currentUsing, setCurrentUsing] = useState<string | null>(null);
  const [keepSame, setKeepSame] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [nameDetail, setNameDetail] = useState<string>('');
  const [changeReason, setChangeReason] = useState<string>('');

  // health history
  const [hadHeartEvent, setHadHeartEvent] = useState<string | null>(null);
  const [heartEventDetails, setHeartEventDetails] = useState<string>('');
  const [clotRisks, setClotRisks] = useState<string[]>([]);
  const [hasDiabetes, setHasDiabetes] = useState<string | null>(null);
  const [liverKidneyCondition, setLiverKidneyCondition] = useState<string | null>(null);
  const [liverKidneyDetails, setLiverKidneyDetails] = useState<string>('');
  const [cancerHistory, setCancerHistory] = useState<string[]>([]);
  const [cancerDetails, setCancerDetails] = useState<string>('');

  // symptoms / bleeding
  const [unexpectedBleeding, setUnexpectedBleeding] = useState<string | null>(null);
  const [contraceptiveDuration, setContraceptiveDuration] = useState<string | null>(null);
  const [otherConditions, setOtherConditions] = useState<string | null>(null);
  const [otherConditionsList, setOtherConditionsList] = useState<string>('');

  // medications
  const [usesTranexamic, setUsesTranexamic] = useState<string | null>(null);
  const [medicationList, setMedicationList] = useState<string[]>([]);
  const [otherMedicationCourse, setOtherMedicationCourse] = useState<string | null>(null);
  const [otherMedicationDetails, setOtherMedicationDetails] = useState<string>('');
  const [otherMedicationUse, setOtherMedicationUse] = useState<string>('');

  // supply and confirmations
  const [supplyDuration, setSupplyDuration] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  // multi-select handler
  const toggleMulti = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]
    );
  };

  // scroll helper after answer
  const handleAnswer = <T,>(
    e: React.MouseEvent,
    setter: React.Dispatch<React.SetStateAction<T>>,
    value: T
  ) => {
    setter(value);
    const card = (e.currentTarget as HTMLElement).closest('.question-card');
    if (card && card.nextElementSibling) {
      (card.nextElementSibling as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      <Header />
      <div className="contra-container">
        <h1 className="page-title">Contraception Assessment</h1>

        {/* 1 */}
        <section className="question-card">
          <h2>Are you currently using any hormonal contraception?</h2>
          <p className="subtitle">Such as pill, coil, implant, injection or patch.</p>
          <div className="options-list">
            {['Yes', 'No'].map(opt => (
              <button
                key={opt}
                className={`option-btn ${currentUsing === opt ? 'selected' : ''}`}
                onClick={e => handleAnswer(e, setCurrentUsing, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 2 */}
        {currentUsing === 'Yes' && (
          <section className="question-card">
            <h2>Would you like to keep using the same contraception?</h2>
            <div className="options-list">
              {['Yes', 'No'].map(opt => (
                <button
                  key={opt}
                  className={`option-btn ${keepSame === opt ? 'selected' : ''}`}
                  onClick={e => handleAnswer(e, setKeepSame, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3 & 4 same method */}
        {currentUsing === 'Yes' && keepSame === 'Yes' && (
          <>
            <section className="question-card">
              <h2>What type of contraception are you using?</h2>
              <div className="options-list">
                {CONTRACEPTION_TYPES.map(opt => (
                  <button
                    key={opt}
                    className={`option-btn ${type === opt ? 'selected' : ''}`}
                    onClick={e => handleAnswer(e, setType, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>
            <section className="question-card">
              <h2>Can you tell us the name of the contraception you're using now?</h2>
              <textarea
                className="text-input"
                rows={2}
                placeholder="E.g. Microgynon"
                value={nameDetail}
                onChange={e => setNameDetail(e.target.value)}
              />
            </section>
          </>
        )}

        {/* 3 & 4 change reason */}
        {currentUsing === 'Yes' && keepSame === 'No' && (
          <>
            <section className="question-card">
              <h2>Can you tell us the name of the contraception you're using now?</h2>
              <textarea
                className="text-input"
                rows={2}
                placeholder="Enter name..."
                value={nameDetail}
                onChange={e => setNameDetail(e.target.value)}
              />
            </section>
            <section className="question-card">
              <h2>Why would you like to change?</h2>
              <textarea
                className="text-input"
                rows={2}
                placeholder="Explain reason..."
                value={changeReason}
                onChange={e => setChangeReason(e.target.value)}
              />
            </section>
          </>
        )}

        {/* 5 Heart event */}
        <section className="question-card">
          <h2>Have you ever had a heart attack or stroke?</h2>
          <p className="subtitle">If yes, please provide details.</p>
          <div className="options-list">
            {['Yes', 'No'].map(opt => (
              <button
                key={opt}
                className={`option-btn ${hadHeartEvent === opt ? 'selected' : ''}`}
                onClick={e => handleAnswer(e, setHadHeartEvent, opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          {hadHeartEvent === 'Yes' && (
            <textarea
              className="text-input"
              rows={2}
              placeholder="When & treatment details..."
              value={heartEventDetails}
              onChange={e => setHeartEventDetails(e.target.value)}
            />
          )}
        </section>

                {/* 6 Clot risk */}
        <section className="question-card">
          <h2>Do any of the following apply to you?</h2>
          <p className="subtitle">These can increase your risk of blood clots.</p>
          <div className="options-list">
            {CLOT_RISK_OPTIONS.map(opt => (
              <label key={opt} className={`checkbox-card ${clotRisks.includes(opt)?'selected':''}`}>
                <input type="checkbox" checked={clotRisks.includes(opt)} onChange={() => toggleMulti(opt, clotRisks, setClotRisks)} />
                {opt}
              </label>
            ))}
          </div>
        </section>

        {/* 7 Diabetes */}
        <section className="question-card">
          <h2>Do you have diabetes?</h2>
          <div className="options-list">
            {['Yes','No'].map(opt => (
              <button key={opt} className={`option-btn ${hasDiabetes===opt?'selected':''}`} onClick={e=>handleAnswer(e, setHasDiabetes, opt)}>
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 8 Liver/kidney */}
        <section className="question-card">
          <h2>Do you have any conditions affecting your liver or kidneys?</h2>
          <div className="options-list">
            {['Yes','No'].map(opt => (
              <button key={opt} className={`option-btn ${liverKidneyCondition===opt?'selected':''}`} onClick={e=>handleAnswer(e, setLiverKidneyCondition, opt)}>
                {opt}
              </button>
            ))}
          </div>
          {liverKidneyCondition==='Yes' && (
            <textarea className="text-input" rows={2} placeholder="Details..." value={liverKidneyDetails} onChange={e=>setLiverKidneyDetails(e.target.value)}/>
          )}
        </section>

        {/* 9 Cancer */}
        <section className="question-card">
          <h2>Do you have or have you ever had cancer?</h2>
          <p className="subtitle">Select all that apply</p>
          <div className="options-list">
            {CANCER_TYPES.map(opt => (
              <label key={opt} className={`checkbox-card ${cancerHistory.includes(opt)?'selected':''}`}>
                <input type="checkbox" checked={cancerHistory.includes(opt)} onChange={()=>toggleMulti(opt, cancerHistory, setCancerHistory)} />
                {opt}
              </label>
            ))}
          </div>
          {cancerHistory.length>0 && !cancerHistory.includes('I have never had cancer') && (
            <textarea className="text-input" rows={2} placeholder="Details..." value={cancerDetails} onChange={e=>setCancerDetails(e.target.value)}/>
          )}
        </section>

        {/* 10 Unexpected bleeding */}
        <section className="question-card">
          <h2>Do you have unexpected or unusual vaginal bleeding?</h2>
          <div className="options-list">
            {['Yes','No'].map(opt => (
              <button key={opt} className={`option-btn ${unexpectedBleeding===opt?'selected':''}`} onClick={e=>handleAnswer(e, setUnexpectedBleeding, opt)}>
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 11 Duration */}
        <section className="question-card">
          <h2>How long have you been using your current contraception?</h2>
          <div className="options-list">
            {['< 3 months','> 3 months'].map(opt => (
              <button key={opt} className={`option-btn ${contraceptiveDuration===opt?'selected':''}`} onClick={e=>handleAnswer(e, setContraceptiveDuration, opt)}>
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 12 Other conditions */}
        <section className="question-card">
          <h2>Do you have any other medical conditions?</h2>
          <div className="options-list">
            {['Yes','No'].map(opt => (
              <button key={opt} className={`option-btn ${otherConditions===opt?'selected':''}`} onClick={e=>handleAnswer(e, setOtherConditions, opt)}>
                {opt}
              </button>
            ))}
          </div>
          {otherConditions==='Yes' && (
            <textarea className="text-input" rows={2} placeholder="List conditions..." value={otherConditionsList} onChange={e=>setOtherConditionsList(e.target.value)}/>
          )}
        </section>

        {/* 13 Tranexamic acid */}
        <section className="question-card">
          <h2>Do you take tranexamic acid?</h2>
          <p className="subtitle">Used to help reduce heavy bleeding (e.g. Cyklokapron).</p>
          <div className="options-list">
            {['Yes','No'].map(opt => (
              <button key={opt} className={`option-btn ${usesTranexamic===opt?'selected':''}`} onClick={e=>handleAnswer(e, setUsesTranexamic, opt)}>
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* 14 Medications list */}
        <section className="question-card">
          <h2>Are you taking any of the following medications?</h2>
          <div className="options-list">
            {MEDICATION_LIST.map(opt => (
              <label key={opt} className={`checkbox-card ${medicationList.includes(opt)?'selected':''}`}>
                <input type="checkbox" checked={medicationList.includes(opt)} onChange={()=>toggleMulti(opt, medicationList, setMedicationList)} />
                {opt}
              </label>
            ))}
          </div>
        </section>

        {/* 15 Other medication course */}
        <section className="question-card">
          <h2>Are you currently taking any other medication, or have you recently finished a course of medication?</h2>
          <div className="options-list">
            {['Yes','No'].map(opt => (
              <button key={opt} className={`option-btn ${otherMedicationCourse===opt?'selected':''}`} onClick={e=>handleAnswer(e, setOtherMedicationCourse, opt)}>
                {opt}
              </button>
            ))}
          </div>
          {otherMedicationCourse==='Yes' && (
            <>
              <textarea className="text-input" rows={2} placeholder="Names & doses..." value={otherMedicationDetails} onChange={e=>setOtherMedicationDetails(e.target.value)}/>
              <textarea className="text-input" rows={2} placeholder="What for?" value={otherMedicationUse} onChange={e=>setOtherMedicationUse(e.target.value)}/>
            </>
          )}
        </section>

        {/* 16 Supply & confirm */}
        <section className="question-card">
          <h2>Do you want to order a 3 month or 6 month supply of contraception?</h2>
          <p className="subtitle">For new users we recommend 3 months, existing users 6 months.</p>
          <div className="options-list">
            {['3 months','6 months'].map(opt => (
              <button key={opt} className={`option-btn ${supplyDuration===opt?'selected':''}`} onClick={e=>handleAnswer(e, setSupplyDuration, opt)}>
                {opt}
              </button>
            ))}
          </div>
          <label className={`checkbox-card ${confirmations?'selected':''}`}><input type="checkbox" checked={confirmations} onChange={()=>setConfirmations(!confirmations)}/>I have answered honestly & truthfully.</label>
          <label className={`checkbox-card ${agreeTerms?'selected':''}`}><input type="checkbox" checked={agreeTerms} onChange={()=>setAgreeTerms(!agreeTerms)}/>I agree to the terms, privacy notice & cookie policy.</label>
        </section>

        <button className="next-button" disabled={!agreeTerms}>
          Next
        </button>
      </div>
    </>
  );
};

export default ContraPage;

// // ContraPage.tsx
// import React, { useState } from 'react';
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

//   return (
//     <div className="contra-container">
//       <h1 className="page-title">Contraception Assessment</h1>

//       {/* 1 */}
//       <section className="question-card">
//         <h2>Are you currently using any kind of hormonal contraception?</h2>
//         <p className="subtitle">
//           Such as the combined pill, mini pill, an IUS (coil), implant,
//           injection or patch.
//         </p>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${currentUsing === opt ? 'selected' : ''}`}
//               onClick={() => setCurrentUsing(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* 2 */}
//       {currentUsing === 'Yes' && (
//         <section className="question-card">
//           <h2>Would you like to keep using the same contraception?</h2>
//           <div className="options-list">
//             {['Yes', 'No'].map(opt => (
//               <button
//                 key={opt}
//                 className={`option-btn ${keepSame === opt ? 'selected' : ''}`}
//                 onClick={() => setKeepSame(opt)}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* 3 & 4 same method */}
//       {currentUsing === 'Yes' && keepSame === 'Yes' && (
//         <>
//           <section className="question-card">
//             <h2>What type of contraception are you using?</h2>
//             <div className="options-list">
//               {CONTRACEPTION_TYPES.map(opt => (
//                 <button
//                   key={opt}
//                   className={`option-btn ${type === opt ? 'selected' : ''}`}
//                   onClick={() => setType(opt)}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           </section>
//           <section className="question-card">
//             <h2>
//               Can you tell us the name of the contraception you're using
//               now?
//             </h2>
//             <textarea
//               className="text-input"
//               rows={2}
//               placeholder="E.g. Microgynon"
//               value={nameDetail}
//               onChange={e => setNameDetail(e.target.value)}
//             />
//           </section>
//         </>
//       )}

//       {/* 3 & 4 change reason */}
//       {currentUsing === 'Yes' && keepSame === 'No' && (
//         <>
//           <section className="question-card">
//             <h2>
//               Can you tell us the name of the contraception you're using
//               now?
//             </h2>
//             <textarea
//               className="text-input"
//               rows={2}
//               placeholder="Enter name..."
//               value={nameDetail}
//               onChange={e => setNameDetail(e.target.value)}
//             />
//           </section>
//           <section className="question-card">
//             <h2>Why would you like to change?</h2>
//             <textarea
//               className="text-input"
//               rows={2}
//               placeholder="Explain reason..."
//               value={changeReason}
//               onChange={e => setChangeReason(e.target.value)}
//             />
//           </section>
//         </>
//       )}

//       {/* 5 Heart event */}
//       <section className="question-card">
//         <h2>Have you ever had a heart attack or stroke?</h2>
//         <p className="subtitle">
//           If you’ve ever had one, please provide details.
//         </p>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${hadHeartEvent === opt ? 'selected' : ''}`}
//               onClick={() => setHadHeartEvent(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//         {hadHeartEvent === 'Yes' && (
//           <textarea
//             className="text-input"
//             rows={2}
//             placeholder="When & treatment details..."
//             value={heartEventDetails}
//             onChange={e => setHeartEventDetails(e.target.value)}
//           />
//         )}
//       </section>

//       {/* 6 Clot risk */}
//       <section className="question-card">
//         <h2>Do any of the following apply to you?</h2>
//         <p className="subtitle">
//           These can increase your risk of blood clots.
//         </p>
//         <div className="options-list">
//           {CLOT_RISK_OPTIONS.map(opt => (
//             <label
//               key={opt}
//               className={`checkbox-card ${clotRisks.includes(opt) ? 'selected' : ''}`}
//             >
//               <input
//                 type="checkbox"
//                 checked={clotRisks.includes(opt)}
//                 onChange={() => toggleMulti(opt, clotRisks, setClotRisks)}
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//       </section>

//       {/* 7 Diabetes */}
//       <section className="question-card">
//         <h2>Do you have diabetes?</h2>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${hasDiabetes === opt ? 'selected' : ''}`}
//               onClick={() => setHasDiabetes(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* 8 Liver/kidney */}
//       <section className="question-card">
//         <h2>Do you have any conditions affecting your liver or kidneys?</h2>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${liverKidneyCondition === opt ? 'selected' : ''}`}
//               onClick={() => setLiverKidneyCondition(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//         {liverKidneyCondition === 'Yes' && (
//           <textarea
//             className="text-input"
//             rows={2}
//             placeholder="Details..."
//             value={liverKidneyDetails}
//             onChange={e => setLiverKidneyDetails(e.target.value)}
//           />
//         )}
//       </section>

//       {/* 9 Cancer */}
//       <section className="question-card">
//         <h2>Do you have or have you ever had cancer?</h2>
//         <p className="subtitle">Select all that apply</p>
//         <div className="options-list">
//           {CANCER_TYPES.map(opt => (
//             <label
//               key={opt}
//               className={`checkbox-card ${cancerHistory.includes(opt) ? 'selected' : ''}`}
//             >
//               <input
//                 type="checkbox"
//                 checked={cancerHistory.includes(opt)}
//                 onChange={() => toggleMulti(opt, cancerHistory, setCancerHistory)}
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//         {cancerHistory.length > 0 && !cancerHistory.includes('I have never had cancer') && (
//           <textarea
//             className="text-input"
//             rows={2}
//             placeholder="Details..."
//             value={cancerDetails}
//             onChange={e => setCancerDetails(e.target.value)}
//           />
//         )}
//       </section>

//       {/* 10 Unexpected bleeding */}
//       <section className="question-card">
//         <h2>Do you have unexpected or unusual vaginal bleeding?</h2>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${unexpectedBleeding === opt ? 'selected' : ''}`}
//               onClick={() => setUnexpectedBleeding(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* 11 Duration */}
//       <section className="question-card">
//         <h2>How long have you been using your current contraception?</h2>
//         <div className="options-list">
//           {['< 3 months', '> 3 months'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${contraceptiveDuration === opt ? 'selected' : ''}`}
//               onClick={() => setContraceptiveDuration(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* 12 Other conditions */}
//       <section className="question-card">
//         <h2>Do you have any other medical conditions?</h2>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${otherConditions === opt ? 'selected' : ''}`}
//               onClick={() => setOtherConditions(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//         {otherConditions === 'Yes' && (
//           <textarea
//             className="text-input"
//             rows={2}
//             placeholder="List conditions..."
//             value={otherConditionsList}
//             onChange={e => setOtherConditionsList(e.target.value)}
//           />
//         )}
//       </section>

//       {/* 13 Tranexamic acid */}
//       <section className="question-card">
//         <h2>Do you take tranexamic acid?</h2>
//         <p className="subtitle">
//           Used to help reduce heavy bleeding (e.g. Cyklokapron).
//         </p>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${usesTranexamic === opt ? 'selected' : ''}`}
//               onClick={() => setUsesTranexamic(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* 14 Medications list */}
//       <section className="question-card">
//         <h2>Are you taking any of the following medications?</h2>
//         <div className="options-list">
//           {MEDICATION_LIST.map(opt => (
//             <label
//               key={opt}
//               className={`checkbox-card ${medicationList.includes(opt) ? 'selected' : ''}`}
//             >
//               <input
//                 type="checkbox"
//                 checked={medicationList.includes(opt)}
//                 onChange={() => toggleMulti(opt, medicationList, setMedicationList)}
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//       </section>

//       {/* 15 Other medication course */}
//       <section className="question-card">
//         <h2>
//           Are you currently taking any other medication, or have you recently
//           finished a course of medication?
//         </h2>
//         <div className="options-list">
//           {['Yes', 'No'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${otherMedicationCourse === opt ? 'selected' : ''}`}
//               onClick={() => setOtherMedicationCourse(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//         {otherMedicationCourse === 'Yes' && (
//           <>
//             <textarea
//               className="text-input"
//               rows={2}
//               placeholder="Names & doses..."
//               value={otherMedicationDetails}
//               onChange={e => setOtherMedicationDetails(e.target.value)}
//             />
//             <textarea
//               className="text-input"
//               rows={2}
//               placeholder="What for?"
//               value={otherMedicationUse}
//               onChange={e => setOtherMedicationUse(e.target.value)}
//             />
//           </>
//         )}
//       </section>

//       {/* 16 Supply & confirm */}
//       <section className="question-card">
//         <h2>
//           Do you want to order a 3 month or 6 month supply of contraception?
//         </h2>
//         <p className="subtitle">
//           For new users we recommend 3 months, existing users 6 months.
//         </p>
//         <div className="options-list">
//           {['3 months', '6 months'].map(opt => (
//             <button
//               key={opt}
//               className={`option-btn ${supplyDuration === opt ? 'selected' : ''}`}
//               onClick={() => setSupplyDuration(opt)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//         <label className={`checkbox-card ${confirmations ? 'selected' : ''}`}>
//           <input
//             type="checkbox"
//             checked={confirmations}
//             onChange={() => setConfirmations(!confirmations)}
//           />
//           I have answered honestly & truthfully.
//         </label>
//         <label className={`checkbox-card ${agreeTerms ? 'selected' : ''}`}>
//           <input
//             type="checkbox"
//             checked={agreeTerms}
//             onChange={() => setAgreeTerms(!agreeTerms)}
//           />
//           I agree to the terms, privacy notice & cookie policy.
//         </label>
//       </section>

//       <button className="next-button" disabled={!agreeTerms}>
//         Next
//       </button>
//     </div>
//   );
// };

// export default ContraPage;
