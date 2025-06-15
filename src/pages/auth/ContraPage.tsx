import React, { useState } from 'react';
import supabase from '../../supabase';
import Header from '../Header';
import './ContraPage.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type AnswerValue = string | string[] | boolean;
interface Answers {
  [key: string]: AnswerValue;
}

// Map each answer key to its full question text
const questionsMap: Record<string,string> = {
  // Patient details
  patientTitle:    'Title',
  patientName:     'First name',
  patientAge:      'Age',
  patientAddress1: 'Address line 1',
  patientPostcode: 'Postcode',

  // 1–4: current user & change
  currentUsing: 'Are you currently using any kind of hormonal contraception?',
  keepSame:     'Would you like to keep using the same contraception?',
  nameDetail:   "Can you tell us the name of the contraception you're using now?",
  changeReason: 'Why would you like to change?',

  // 5: expiry info confirm
  expireConfirm: 'I have read and understood the information provided above and agree to proceed',

  // 6–8: ever used before
  everUsed:         'Have you ever used any kind of hormonal contraception?',
  prevContraception:
                    'Can you tell us the name(s) of the contraception you have previously used?',
  everConfirm:      'I have read and understood the information provided above and agree to proceed',

  // 9–17: keepSame = Yes path
  type:             'What type of contraception are you using?',
  needAnotherReason:
                    "Can you tell us why you need another type of contraception as well as the one you're currently using?",
  bleedControlUsed:
                    'Are you currently using, or recently used, a contraceptive pill, patch or vaginal ring to control bleeding due to your other contraceptive?',
  bleedAdditionalDetail:
                    "What is the name of the additional contraceptive you've used, and how long have you used it for?",
  bleedConfirm:     'I have read and understood the bleeding-management information and agree to proceed',
  otherReasonDetails:
                    'Please provide more details:',
  otherConfirm:     'I have read and understood the information provided above and agree to proceed',

  // 18–19: height & weight
  height: 'What is your height?',
  weight: 'What is your weight?',

  // 20–24: blood pressure & order type
  bpMeasured:
    'Has your blood pressure been measured in the last 12 months?',
  bpReading:
    'What was the reading?',
  bpValue:
    'Please give the 2 numbers of your blood pressure reading (for example 140/90):',
  orderType:
    'Do you know the type of contraceptive that you would like to order?',

  // 25–26: allergy
  allergy:     'Are you allergic to any medicines or other substances?',
  allergyList: 'Are you allergic to:',

  // 27–28: smoking
  smoke:        'Do you smoke?',
  smokeStopped: 'When did you stop smoking?',

  // 29–31: pregnancy & postpartum
  pregnantRecently:
    'Are you pregnant or have you given birth in the last 6 weeks?',
  breastfeeding: 'Are you breastfeeding?',
  postBirthComplication:
    'Did you have:',

  // 32–36: migraines
  migraineDiagnosed:
    'Have you ever been diagnosed with migraines, or do you think you have had one?',
  migraineStartWithContraception:
    'Did your migraines start when you started using hormonal contraception?',
  migraineKnownContraception:
    'Do you know the name or type of contraception you were on when your migraines started?',
  migraineContraceptionName:
    'What was it?',
  migraineAura:
    'Have you ever had any unusual symptoms or sensations before you get a headache?',

  // 37–40: high blood pressure history
  highBpDiagnosed:
    'Have you ever been diagnosed with high blood pressure?',
  highBpRelated:
    'Was this related to:',
  highBpDetails:
    'Please give more details about what happened. Has your blood pressure gone back to normal since?',
  highBpOtherDetails:
    'Please provide more details about the cause for this and any treatments you had:',

  // 41–42: heart attack / stroke
  heartStroke:
    'Have you ever had a heart attack or stroke?',
  heartStrokeDetails:
    'Could you give us some more details? When did this happen and what treatment did you have?',

  // 43: clot risk factors
  clotRiskFactors:
    'Do any of the following apply to you?',

  // 44–46: diabetes
  diabetes:
    'Do you have diabetes?',
  diabetesComplications:
    'Do you have any complications from diabetes?',
  diabetesDetails:
    'Could you give us some more details? When did these complications start and what treatment did you have?',

  // 47–49: liver or kidney conditions
  liverKidney:
    'Do you have any conditions affecting your liver or kidneys?',
  liverKidneyDetails:
    'Could you give us some more details? What are the conditions, when did they start and what treatment have you had?',
  liverKidneyConfirm:
    'I have read and understood the information provided above and agree to proceed',

  // 50–51: cancer
  cancerList:
    'Do you have or have you ever had cancer?',
  cancerNever:
    'I have never had cancer',
  otherCancerDetails:
    'Could you give us some more details? We need to know when you had the cancer, whether you still have it, and what treatment you’ve had.',

  // 52–58: bleeding
  bleedingUnusual:
    'Do you have unexpected or unusual vaginal bleeding?',
  bleedingDuration:
    'How long have you been using your current contraception?',
  bleedingFirstNotice:
    'When did you first notice any unusual/unexpected vaginal bleeding?',
  bleedingFirstConfirm:
    'I understand the expected bleeding info and agree to proceed',
  bleedingDiscussed:
    'Have you discussed any unusual/unexpected bleeding with your GP or a gynaecologist?',
  bleedingDoctorAdvice:
    'What did the doctor advise was causing the bleeding?',
  bleedingTests:
    'Please describe any tests or examinations that you had:',
  bleedingChanged:
    'Has the bleeding changed since you last spoke to your doctor?',

  // 59–62: bleeding (no GP)
  bleedingStart:
    'When did this unexpected bleeding start?',
  bleedingLastHappened:
    'When did this last happen?',
  bleedingSymptoms:
    'Have you had:',
  stiTest:
    'Have you had a test for sexually transmitted infections (STIs) in the last 12 months or since your last new sexual partner?',

  // 63–65: medications
  otherConditions:
    "Do you have any other medical conditions?",
  conditionsList:
    "Please list all your medical conditions:",
  tranexamicAcid:
    "Do you take tranexamic acid?",
  medList:
    "Are you taking any of the following medications?",
  medNone:
    "None of the above",
  otherMedication:
    "Are you currently taking any other medication, or have you recently finished a course of medication?",
  otherMedDetails:
    "Please list the names and doses of all these medications:",
  otherMedPurpose:
    "What do you use these medications for?",

  // 65: supply length & final confirm
  supplyLength:
    "Do you want to order a 3 month or 6 month supply of contraception?",
  supplyConfirm:
    "I fully understand the questions asked & have answered honestly & truthfully.",
};


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
  const [submitted, setSubmitted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Height & weight state…
  const [heightUnit, setHeightUnit] = useState<'imperial'|'metric'>('imperial');
  const [ft, setFt]       = useState(''); const [inch, setInch] = useState(''); const [cm, setCm] = useState('');
  const [weightUnit, setWeightUnit] = useState<'imperial'|'metric'>('imperial');
  const [st, setSt]       = useState(''); const [lbs, setLbs]   = useState(''); const [kg, setKg] = useState('');

  const setAnswer = (key: string, value: AnswerValue) =>
    setAnswers(prev => ({ ...prev, [key]: value }));

  const setAnswerAndNext = (key: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(s => Math.min(s + 1, blocks.length - 1));
  };

  interface Block { element: JSX.Element; stateKey?: string; }
  const blocks: Block[] = [];

  // —————————————————————————————————————————————
  // 0) Patient details
  // —————————————————————————————————————————————
  blocks.push({
    element: (
      <div className="patient-details">
        <h2 className="full-width">Patient details</h2>
        <label>
          Title
          <select
            value={(answers.patientTitle as string)||''}
            onChange={e=>setAnswer('patientTitle', e.target.value)}
          >
            <option value="">Select…</option>
            {['Mr','Mrs','Miss','Ms','Dr','Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          First name <span className="required"></span>
          <input
            type="text"
            value={(answers.patientName as string)||''}
            onChange={e=>setAnswer('patientName', e.target.value)}
          />
        </label>
        <label>
          Age
          <input
            type="number"
            value={(answers.patientAge as string)||''}
            onChange={e=>setAnswer('patientAge', e.target.value)}
          />
        </label>
        <label className="full-width">
          Address line 1
          <input
            type="text"
            value={(answers.patientAddress1 as string)||''}
            onChange={e=>setAnswer('patientAddress1', e.target.value)}
          />
        </label>
        <label>
          Postcode
          <input
            type="text"
            value={(answers.patientPostcode as string)||''}
            onChange={e=>setAnswer('patientPostcode', e.target.value)}
          />
        </label>
      </div>
    ),
    stateKey: 'patientName'  // require at least name
  });

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
            onClick={() => setAnswerAndNext('currentUsing', opt)}
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
              onClick={() => setAnswerAndNext('keepSame', opt)}
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
  // 3) If currently using AND keepSame = No → name of current method
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
  }

  //
  // 4) Why would you like to change?
  //
  if (answers.currentUsing === 'Yes' && answers.keepSame === 'No') {
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
  }

  //
  // 5) Confirm you've read the expiry info
  //
  if (answers.currentUsing === 'Yes' && answers.keepSame === 'No') {
    blocks.push({
      element: (
        <div>
          <div className="info-block">{INFO_LONG_EXPIRE}</div>
          <label className="checkbox-card">
            <input
              type="checkbox"
              checked={!!answers.expireConfirm}
              onChange={e => setAnswerAndNext('expireConfirm', e.target.checked)}
            />
            <div>
              Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
              <ul>
                <li><strong>have read and understood the information provided above</strong></li>
                <li>understand that if you miss a dose or take one late there is a risk you might get pregnant</li>
                <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
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
  // 6) Have you ever used any kind of hormonal contraception?
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
              onClick={() => setAnswerAndNext('everUsed', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'everUsed'
    });
  }

  //
  // 7) If everUsed = Yes → names of previous methods
  //
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
  }

  //
  // 8) Confirm you've read the expiry info (never used)
  //
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

  //
  // 9) What type of contraception are you using? (keepSame = Yes)
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
              onClick={() => setAnswerAndNext('type', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'type'
    });
  }

  //
  // 10) Name of current method (keepSame = Yes)
  //
  if (answers.keepSame === 'Yes') {
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
  }

  //
  // 11) Why need another method? (implant/injection/coil + keepSame=Yes)
  //
  if (
    answers.keepSame === 'Yes' &&
    ['Contraceptive implant', 'Contraceptive injection', 'Contraceptive coil'].includes(answers.type as string)
  ) {
    blocks.push({
      element: (
        <div>
          <h2>Can you tell us why you need another type of contraception as well as the one you're currently using?</h2>
          {[
            'my contraception is about to run out or expire',
            'to control irregular bleeding on this contraception',
            'other reasons'
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn2 ${answers.needAnotherReason === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('needAnotherReason', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'needAnotherReason'
    });
  }

  //
  // 12) Expiry confirm (if running out)
  //
  if (answers.needAnotherReason === 'my contraception is about to run out or expire') {
    blocks.push({
      element: (
        <div>
          <div className="info-block">{INFO_LONG_EXPIRE}</div>
          <label className="checkbox-card">
            <input
              type="checkbox"
              checked={!!answers.expireConfirm}
              onChange={e => setAnswerAndNext('expireConfirm', e.target.checked)}
            />
            <div>
              Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
              <ul>
                <li><strong>have read and understood the information provided above</strong></li>
                <li>understand that if you miss a contraceptive or take one late there is a risk that you might get pregnant</li>
                <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
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
  // 13) Bleed-control: are you using pill/patch/ring for bleeding?
  //
  if (answers.needAnotherReason === 'to control irregular bleeding on this contraception') {
    blocks.push({
      element: (
        <div>
          <h2>Are you currently using, or recently used, a contraceptive pill, patch or vaginal ring to control bleeding due to your other contraceptive?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.bleedControlUsed === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('bleedControlUsed', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bleedControlUsed'
    });
  }

  //
  // 14) Bleed-control details if Yes
  //
  if (answers.bleedControlUsed === 'Yes') {
    blocks.push({
      element: (
        <div>
          <h2>What is the name of the additional contraceptive you've used, and how long have you used it for?</h2>
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

  //
  // 15) Confirm bleed-info
  //
  if (answers.needAnotherReason === 'to control irregular bleeding on this contraception') {
    blocks.push({
      element: (
        <div>
          <div className="info-block">{INFO_LONG_BLEED}</div>
          <label className="checkbox-card improved-checkbox">
            <input
              type="checkbox"
              checked={!!answers.bleedConfirm}
              onChange={e => setAnswerAndNext('bleedConfirm', e.target.checked)}
            />
            <div className="checkbox-text">
              Because you’re not currently using the contraceptive pill, it's important that you let us know that you:
              <ul>
                <li><strong>have read and understood the information provided above</strong></li>
                <li>understand that the use of the pill to control irregular bleeding is an off-label use</li>
                <li>understand the risks and possible side effects of taking the pill, including blood clots, and that if you get pain in your leg or difficulty breathing while on the pill, you need to speak to a doctor urgently</li>
                <li>will contact your online doctor or your GP if you have any questions about taking the pill</li>
              </ul>
            </div>
          </label>
        </div>
      ),
      stateKey: 'bleedConfirm'
    });
  }

  //
  // 16) Other reasons details
  //
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
  }

  //
  // 17) Confirm other reasons info
  //
  if (answers.needAnotherReason === 'other reasons') {
    blocks.push({
      element: (
        <div>
          <div className="info-block">{INFO_LONG_EXPIRE}</div>
          <label className="checkbox-card">
            <input
              type="checkbox"
              checked={!!answers.otherConfirm}
              onChange={e => setAnswerAndNext('otherConfirm', e.target.checked)}
            />
            <div>
              Because you’re not currently using contraception or because you'd like to change your contraception, it's important that you let us know that you:
              <ul>
                <li><strong>have read and understood the information provided above</strong></li>
                <li>understand that if you miss a contraceptive or take one late there is a risk that you might get pregnant</li>
                <li>understand that being sick (vomiting) or having diarrhoea can also affect how well the pill works</li>
                <li>understand the risks and possible side effects of taking contraception, including blood clots, and that if you get pain in your leg or difficulty breathing while on contraception, you need to speak to a doctor urgently</li>
                <li>will contact your online doctor or your GP if you have any questions about taking the contraceptive</li>
              </ul>
            </div>
          </label>
        </div>
      ),
      stateKey: 'otherConfirm'
    });
  }

  //
  // 18) What is your height?
  //
  blocks.push({
    element: (
      <div>
        <h2>What is your height?</h2>
        <p className="subtitle">select ft and in or cm</p>
        {heightUnit === 'imperial' ? (
          <div className="imperial-row">
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                placeholder="e.g. 5"
                value={ft}
                onChange={e => setFt(e.target.value)}
              />
              <div className="spinner">
                <span className="spinner-up"   onClick={() => setFt(v => String(Number(v||'0')+1))}>▲</span>
                <span className="spinner-down" onClick={() => setFt(v => String(Math.max(Number(v||'0')-1,0)))}>▼</span>
              </div>
            </div>
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                placeholder="e.g. 3"
                value={inch}
                onChange={e => setInch(e.target.value)}
              />
              <div className="spinner">
                <span className="spinner-up"   onClick={() => setInch(v => String(Number(v||'0')+1))}>▲</span>
                <span className="spinner-down" onClick={() => setInch(v => String(Math.max(Number(v||'0')-1,0)))}>▼</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="metric-row">
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                placeholder="e.g. 170"
                value={cm}
                onChange={e => setCm(e.target.value)}
              />
              <div className="spinner">
                <span className="spinner-up"   onClick={() => setCm(v => String(Number(v||'0')+1))}>▲</span>
                <span className="spinner-down" onClick={() => setCm(v => String(Math.max(Number(v||'0')-1,0)))}>▼</span>
              </div>
            </div>
          </div>
        )}
        <button className="unit-switch" onClick={() => {
          if (heightUnit === 'imperial') {
            setHeightUnit('metric'); setFt(''); setInch(''); setAnswer('height','');
          } else {
            setHeightUnit('imperial'); setCm(''); setAnswer('height','');
          }
        }}>
          {heightUnit === 'imperial' ? 'Switch to cm.' : 'Switch to ft., in.'}
        </button>
      </div>
    ),
    stateKey: 'height'
  });

  //
  // 19) What is your weight?
  //
  blocks.push({
    element: (
      <div>
        <h2>What is your weight?</h2>
        <p className="subtitle">select st and lbs or kg</p>
        {weightUnit === 'imperial' ? (
          <div className="imperial-row">
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                placeholder="e.g. 10"
                value={st}
                onChange={e => setSt(e.target.value)}
              />
              <div className="spinner">
                <span className="spinner-up"   onClick={() => setSt(v => String(Number(v||'0')+1))}>▲</span>
                <span className="spinner-down" onClick={() => setSt(v => String(Math.max(Number(v||'0')-1,0)))}>▼</span>
              </div>
            </div>
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                placeholder="e.g. 3"
                value={lbs}
                onChange={e => setLbs(e.target.value)}
              />
              <div className="spinner">
                <span className="spinner-up"   onClick={() => setLbs(v => String(Number(v||'0')+1))}>▲</span>
                <span className="spinner-down" onClick={() => setLbs(v => String(Math.max(Number(v||'0')-1,0)))}>▼</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="metric-row">
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                placeholder="e.g. 75"
                value={kg}
                onChange={e => setKg(e.target.value)}
              />
              <div className="spinner">
                <span className="spinner-up"   onClick={() => setKg(v => String(Number(v||'0')+1))}>▲</span>
                <span className="spinner-down" onClick={() => setKg(v => String(Math.max(Number(v||'0')-1,0)))}>▼</span>
              </div>
            </div>
          </div>
        )}
        <button className="unit-switch" onClick={() => {
          if (weightUnit === 'imperial') {
            setWeightUnit('metric'); setSt(''); setLbs(''); setAnswer('weight','');
          } else {
            setWeightUnit('imperial'); setKg(''); setAnswer('weight','');
          }
        }}>
          {weightUnit === 'imperial' ? 'Switch to kg.' : 'Switch to st., lbs.'}
        </button>
        <p className="subtitle">
          We use this information to calculate your BMI. If you have a high BMI a combined contraceptive may not be suitable for you.
        </p>
      </div>
    ),
    stateKey: 'weight'
  });

  //
  // 20) Has your blood pressure been measured in the last 12 months?
  //
  blocks.push({
    element: (
      <div>
        <h2>Has your blood pressure been measured in the last 12 months?</h2>
        <p className="subtitle">
          We need a recent blood pressure measurement because some pills or patches can cause blood pressure to rise. Our doctors will consider this alongside the other information you provide.
        </p>
        {['Yes','No'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.bpMeasured === opt ? 'selected' : ''}`}
            onClick={() => setAnswerAndNext('bpMeasured', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'bpMeasured'
  });

  //
  // 21) If Yes → What was the reading?
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
              className={`option-btn3 ${answers.bpReading === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('bpReading', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bpReading'
    });
  }

  //
  // 22) If 140/90 or higher → free-text
  //
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

  //
  // 23) If “I don’t know” OR bpMeasured=No → which contraceptive?
  //
  if (answers.bpReading === "I don't know" || answers.bpMeasured === 'No') {
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
              className={`option-btn2 ${answers.orderType === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('orderType', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'orderType'
    });
  }

  //
  // 24) If orderType ≠ Mini → ask reading again
  //
  if (
    (answers.bpReading === "I don't know" && answers.orderType && answers.orderType !== 'Mini pill (for example Cerelle, Cerazette, Hana, Noriday)') ||
    answers.bpMeasured === 'No'
  ) {
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
  // 25) Are you allergic to any medicines or other substances?
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
            onClick={() => setAnswerAndNext('allergy', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'allergy'
  });

  //
  // 26) If allergy = Yes → checklist
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
  // 27) Do you smoke?
  //
  blocks.push({
    element: (
      <div>
        <h2>Do you smoke?</h2>
        <p className="subtitle">
          We ask you this because smoking while taking some contraceptives can increase your risk of blood clots, stroke or heart attack.
        </p>
        {['Yes','No','I used to smoke'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.smoke === opt ? 'selected' : ''}`}
            onClick={() => setAnswerAndNext('smoke', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'smoke'
  });

  //
  // 28) If "I used to smoke" → when did you stop?
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
              onClick={() => setAnswerAndNext('smokeStopped', opt)}
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
  // 29) Are you pregnant or have you given birth in the last 6 weeks?
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
            className={`option-btn3 ${answers.pregnantRecently === opt ? 'selected' : ''}`}
            onClick={() => setAnswerAndNext('pregnantRecently', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'pregnantRecently'
  });

  //
  // 30) If gave birth 3–6 weeks → breastfeeding?
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
              onClick={() => setAnswerAndNext('breastfeeding', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'breastfeeding'
    });
  }

  //
  // 31) If breastfeeding = No → postpartum complications
  //
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
              className={`option-btn2 ${answers.postBirthComplication === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('postBirthComplication', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'postBirthComplication'
    });
  }

  //
  // 32) Have you ever been diagnosed with migraines?
  //
  blocks.push({
    element: (
      <div>
        <h2>Have you ever been diagnosed with migraines, or do you think you have had one?</h2>
        <p className="subtitle">
          A migraine is a severe headache, usually on one side, often with nausea, light/sound sensitivity or visual aura.
        </p>
        {['Yes','No'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.migraineDiagnosed === opt ? 'selected' : ''}`}
            onClick={() => setAnswerAndNext('migraineDiagnosed', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'migraineDiagnosed'
  });

  //
  // 33) If “Yes” → did migraines start with contraception?
  //
  if (answers.migraineDiagnosed === 'Yes') {
    blocks.push({
      element: (
        <div>
          <h2>Did your migraines start when you started using hormonal contraception?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.migraineStartWithContraception === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('migraineStartWithContraception', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'migraineStartWithContraception'
    });
  }

  //
  // 34) If started with contraception → know which?
  //
  if (answers.migraineStartWithContraception === 'Yes') {
    blocks.push({
      element: (
        <div>
          <h2>Do you know the name or type of contraception you were on when your migraines started?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.migraineKnownContraception === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('migraineKnownContraception', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),stateKey:'migraineKnownContraception'
    });
  }

  //
  // 35) If know it → free-text
  //
  if (answers.migraineKnownContraception==='Yes'){
    blocks.push({
      element:(
        <div>
          <h2>What was it?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.migraineContraceptionName as string)||''}
            onChange={e=>setAnswer('migraineContraceptionName',e.target.value)}
          />
        </div>
      ),
      stateKey:'migraineContraceptionName'
    });
  }

  //
  // 36) Aura question
  //
  if(
    answers.migraineDiagnosed==='Yes'&&
    (answers.migraineKnownContraception==='No'||answers.migraineStartWithContraception==='No')
  ){
    blocks.push({
      element:(
        <div>
          <h2>Have you ever had any unusual symptoms or sensations before you get a headache?</h2>
          <p className="subtitle">
            e.g. flashing lights, zigzags, pins and needles, or temporary speech difficulty (aura).
          </p>
          {['Yes','No'].map(opt=>(
            <button
              key={opt}
              className={`option-btn ${answers.migraineAura===opt?'selected':''}`}
              onClick={()=>setAnswerAndNext('migraineAura',opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey:'migraineAura'
    });
  }

  //
  // 37) Have you ever been diagnosed with high blood pressure?
  //
  blocks.push({
    element:(
      <div>
        <h2>Have you ever been diagnosed with high blood pressure?</h2>
        <p className="subtitle">
          If you’ve ever had high blood pressure, taking a combined contraceptive will increase your risk of blood clots, and some contraceptives can also raise your blood pressure.
        </p>
        {['Yes','No'].map(opt=>(
          <button
            key={opt}
            className={`option-btn ${answers.highBpDiagnosed===opt?'selected':''}`}
            onClick={()=>setAnswerAndNext('highBpDiagnosed',opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey:'highBpDiagnosed'
  });

  //
  // 38) If highBpDiagnosed = Yes → Was this related to…
  //
  if(answers.highBpDiagnosed==='Yes'){
    blocks.push({
      element:(
        <div>
          <h2>Was this related to:</h2>
          {[
            'pregnancy',
            'being anxious about seeing the doctor (white coat syndrome)',
            'other reasons'
          ].map(opt=>(
            <button
              key={opt}
              className={`option-btn2 ${answers.highBpRelated===opt?'selected':''}`}
              onClick={()=>setAnswerAndNext('highBpRelated',opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey:'highBpRelated'
    });
  }

  //
  // 39) If pregnancy or white-coat → details + normal?
  //
  if(
    answers.highBpRelated==='pregnancy'||
    answers.highBpRelated==='being anxious about seeing the doctor (white coat syndrome)'
  ){
    blocks.push({
      element:(
        <div>
          <h2>Please give more details about what happened. Has your blood pressure gone back to normal since?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.highBpDetails as string)||''}
            onChange={e=>setAnswer('highBpDetails',e.target.value)}
          />
        </div>
      ),
      stateKey:'highBpDetails'
    });
  }

  //
  // 40) If other reasons → cause & treatment details
  //
  if(answers.highBpRelated==='other reasons'){
    blocks.push({
      element:(
        <div>
          <h2>Please provide more details about the cause for this and any treatments you had:</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.highBpOtherDetails as string)||''}
            onChange={e=>setAnswer('highBpOtherDetails',e.target.value)}
          />
        </div>
      ),
      stateKey:'highBpOtherDetails'
    });
  }

  //
  // 41) Have you ever had a heart attack or stroke?
  //
  blocks.push({
    element:(
      <div>
        <h2>Have you ever had a heart attack or stroke?</h2>
        <p className="subtitle">
          If you’ve ever had a heart attack or stroke, we’ll need to know a bit more to tell whether it’s safe to prescribe you the combined contraceptive.
        </p>
        {['Yes','No'].map(opt=>(
          <button
            key={opt}
            className={`option-btn ${answers.heartStroke===opt?'selected':''}`}
            onClick={()=>setAnswerAndNext('heartStroke',opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),stateKey:'heartStroke'
  });

  //
  // 42) If heartStroke = Yes → details
  //
  if(answers.heartStroke==='Yes'){
    blocks.push({
      element:(
        <div>
          <h2>Could you give us some more details? When did this happen and what treatment did you have?</h2>
          <textarea
            className="text-input"
            rows={3}
            value={(answers.heartStrokeDetails as string)||''}
            onChange={e=>setAnswer('heartStrokeDetails',e.target.value)}
          />
        </div>
      ),stateKey:'heartStrokeDetails'
    });
  }

  //
  // 43) Clot risk factors
  //
  //
// 43) Clot risk factors
//
blocks.push({
  element: (
    <div>
      <h2>Do any of the following apply to you?</h2>
      <p className="subtitle">
        We ask about these because they can all increase your risk of blood clots.
      </p>
      {[
        'I have had a blood clot before',
        'Someone in my close family has had a blood clot',
        'I have had major surgery in the last 3 weeks',
        'I am immobile',
        'None of these apply to me'
      ].map(opt => (
        <label key={opt} className="checkbox-card">
          <input
            type="checkbox"
            checked={Array.isArray(answers.clotRiskFactors) && (answers.clotRiskFactors as string[]).includes(opt)}
            onChange={() => {
              const noneOpt = 'None of these apply to me';
              // start from whatever is already selected
              let current = Array.isArray(answers.clotRiskFactors)
                ? [...answers.clotRiskFactors]
                : [];
              
              if (opt === noneOpt) {
                // selecting "None" clears everything else
                current = [noneOpt];
              } else {
                // remove "None" if it was selected
                current = current.filter(o => o !== noneOpt);
                // toggle this particular option
                const idx = current.indexOf(opt);
                if (idx > -1) current.splice(idx, 1);
                else current.push(opt);
              }

              setAnswer('clotRiskFactors', current);
            }}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  ),
  stateKey: 'clotRiskFactors'
});

  //
// 44) Do you have diabetes?
//
blocks.push({
  element: (
    <div>
      <h2>Do you have diabetes?</h2>
      <p className="subtitle">
        We ask you about this because if you’ve had any complications with diabetes, we’ll need to know a bit more to safely prescribe you contraception.
      </p>
      {['Yes', 'No'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.diabetes === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('diabetes', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'diabetes'
});

//
// 45) If you do have diabetes → any complications?
//
if (answers.diabetes === 'Yes') {
  blocks.push({
    element: (
      <div>
        <h2>Do you have any complications from diabetes?</h2>
        <p className="subtitle">
          For example, damage to the eyes or kidneys, or sensations in your hands and feet.
        </p>
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.diabetesComplications === opt ? 'selected' : ''}`}
            onClick={() => setAnswerAndNext('diabetesComplications', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'diabetesComplications'
  });
}

//
// 46) If you do have complications → free-text details
//
if (answers.diabetes === 'Yes' && answers.diabetesComplications === 'Yes') {
  blocks.push({
    element: (
      <div>
        <h2>
          Could you give us some more details? When did these complications start and what treatment did you have?
        </h2>
        <textarea
          className="text-input"
          rows={3}
          value={(answers.diabetesDetails as string) || ''}
          onChange={e => setAnswer('diabetesDetails', e.target.value)}
        />
      </div>
    ),
    stateKey: 'diabetesDetails'
  });
}

//
// 47) Do you have any conditions affecting your liver or kidneys?
//
blocks.push({
  element: (
    <div>
      <h2>Do you have any conditions affecting your liver or kidneys?</h2>
      <p className="subtitle">
        If you have any problems with your liver or kidneys, we’ll need to know a bit more to tell whether it’s safe to prescribe you the pill.
      </p>
      {['Yes', 'No'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.liverKidney === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('liverKidney', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'liverKidney'
});

//
// 48) If Yes → free-text details
//
if (answers.liverKidney === 'Yes') {
  blocks.push({
    element: (
      <div>
        <h2>
          Could you give us some more details? What are the conditions, when did they start and what treatment have you had?
        </h2>
        <textarea
          className="text-input"
          rows={3}
          value={(answers.liverKidneyDetails as string) || ''}
          onChange={e => setAnswer('liverKidneyDetails', e.target.value)}
        />
      </div>
    ),
    stateKey: 'liverKidneyDetails'
  });

  //
  // 49) Show info + confirmation checkbox
  //
  blocks.push({
    element: (
      <label className="checkbox-card">
        <input
          type="checkbox"
          checked={!!answers.liverKidneyConfirm}
          onChange={e => setAnswerAndNext('liverKidneyConfirm', e.target.checked)}
        />
        <div>
          Most hormonal contraceptives should not be taken if you have severe liver or kidney problems. Some pills, like <strong>Slynd</strong>, may need blood tests to check your potassium levels and kidney function even if you have mild kidney disease. If you’re concerned about whether this applies to you, please tell your GP which contraceptive you’re taking and ask them to check whether you need any blood tests.

          <p>Please tick to confirm you understand.</p>
        </div>
      </label>
    ),
    stateKey: 'liverKidneyConfirm'
  });
}
//
// 50) Do you have or have you ever had cancer?
//
blocks.push({
  element: (
    <div>
      <h2>Do you have or have you ever had cancer?</h2>
      <p className="subtitle">
        We need to know a bit more about this to tell whether it’s safe to prescribe you the pill.
      </p>
      {[
        'Breast cancer',
        'Cervical cancer',
        'Liver cancer',
        'Other cancer',
        'I have never had cancer'
      ].map(opt => {
        const isNever = opt === 'I have never had cancer';
        const list = Array.isArray(answers.cancerList) ? answers.cancerList : [];
        const neverChecked = !!answers.cancerNever;
        const checked = isNever ? neverChecked : list.includes(opt);

        return (
          <label key={opt} className="checkbox-card">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                if (isNever) {
                  const now = !neverChecked;
                  setAnswer('cancerNever', now);
                  if (now) setAnswer('cancerList', []);
                } else {
                  const next = checked
                    ? list.filter(x => x !== opt)
                    : [...list, opt];
                  setAnswer('cancerList', next);
                  if (neverChecked) setAnswer('cancerNever', false);
                }
              }}
            />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  ),
  stateKey: 'cancerList'
});

// 51) only when “Other cancer” is in answers.cancerList
if (Array.isArray(answers.cancerList) &&
    answers.cancerList.includes('Other cancer')) {
  blocks.push({
    element: (
      <div>
        <h2>
          Could you give us some more details? We need to know when you had the cancer,
          whether you still have it, and what treatment you’ve had.
        </h2>
        <textarea
          className="text-input"
          rows={3}
          value={(answers.otherCancerDetails as string) || ''}
          onChange={e => setAnswer('otherCancerDetails', e.target.value)}
        />
      </div>
    ),
    stateKey: 'otherCancerDetails'
  });
}
// —————————————————————————————————————————————
// Bleeding section (52–62)
// —————————————————————————————————————————————
// 52) Do you have unexpected or unusual vaginal bleeding?
blocks.push({
  element: (
    <div>
      <h2>Do you have unexpected or unusual vaginal bleeding?</h2>
      <p className="subtitle">
        For example, do you bleed between periods or after you have sex, or are your periods very heavy or painful?
      </p>
      {['Yes','No'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.bleedingUnusual === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('bleedingUnusual', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'bleedingUnusual'
});

// Only if they said “Yes” do we add any more bleeding blocks…
if (answers.bleedingUnusual === 'Yes') {
  // 53) Duration
  blocks.push({
    element: (
      <div>
        <h2>How long have you been using your current contraception?</h2>
        {['Less than 3 months','More than 3 months'].map(opt => (
          <button
            key={opt}
            className={`option-btn ${answers.bleedingDuration === opt ? 'selected' : ''}`}
            onClick={() => setAnswerAndNext('bleedingDuration', opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    ),
    stateKey: 'bleedingDuration'
  });

  // 54a) First-notice if < 3 months
  if (answers.bleedingDuration === 'Less than 3 months') {
    blocks.push({
      element: (
        <div>
          <h2>When did you first notice any unusual/unexpected vaginal bleeding?</h2>
          {[
            'Since I started using this contraception',
            'Before starting the contraception'
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn3 ${answers.bleedingFirstNotice === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('bleedingFirstNotice', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bleedingFirstNotice'
    });

    // 54b) Info + confirm if “Since…”
    if (answers.bleedingFirstNotice === 'Since I started using this contraception') {
      blocks.push({
        element: (
          <div>
            <div className="info-block">
              Unexpected bleeding or a change in bleeding in the first 3 months of
              taking a new contraceptive can be expected. However if the bleeding
              continues past 3 months, if it gets worse, or if you notice any pain
              or bleeding during sex you should contact your GP as soon as possible
              so this can be looked into further.
            </div>
            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={!!answers.bleedingFirstConfirm}
                onChange={e => setAnswerAndNext('bleedingFirstConfirm', e.target.checked)}
              />
              <span>I understand</span>
            </label>
          </div>
        ),
        stateKey: 'bleedingFirstConfirm'
      });
    }
  }

  // 55) GP discussion if > 3 months OR (< 3 months + Before…)
  if (
    answers.bleedingDuration === 'More than 3 months' ||
    (answers.bleedingDuration === 'Less than 3 months'
     && answers.bleedingFirstNotice === 'Before starting the contraception')
  ) {
    blocks.push({
      element: (
        <div>
          <h2>Have you discussed any unusual/unexpected bleeding with your GP or a gynaecologist?</h2>
          {['Yes','No'].map(opt => (
            <button
              key={opt}
              className={`option-btn ${answers.bleedingDiscussed === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('bleedingDiscussed', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bleedingDiscussed'
    });
  }

  // 56–58) Doctor’s advice → tests → change-check
  if (answers.bleedingDiscussed === 'Yes') {
    // 56
    blocks.push({
      element: (
        <div>
          <h2>What did the doctor advise was causing the bleeding?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.bleedingDoctorAdvice as string) || ''}
            onChange={e => setAnswer('bleedingDoctorAdvice', e.target.value)}
          />
        </div>
      ),
      stateKey: 'bleedingDoctorAdvice'
    });
    // 57
    blocks.push({
      element: (
        <div>
          <h2>Please describe any tests or examinations that you had:</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.bleedingTests as string) || ''}
            onChange={e => setAnswer('bleedingTests', e.target.value)}
          />
        </div>
      ),
      stateKey: 'bleedingTests'
    });
    // 58
    blocks.push({
      element: (
        <div>
          <h2>Has the bleeding changed since you last spoke to your doctor?</h2>
          {[
            'Yes, it has reduced or stopped',
            'Yes, it has become worse or more frequent',
            'No, it has not changed'
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn3 ${answers.bleedingChanged === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('bleedingChanged', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bleedingChanged'
    });
  }

  // 59–62) Timing → last-happened → symptoms → STI test + info
  if (answers.bleedingDiscussed === 'No') {
    // 59
    blocks.push({
      element: (
        <div>
          <h2>When did this unexpected bleeding start?</h2>
          {[
            'Before I started my current contraception',
            'In the first 3 months after I started my current contraception',
            'More than 3 months after I started my current contraception'
          ].map(opt => (
            <button
              key={opt}
              className={`option-btn2 ${answers.bleedingStart === opt ? 'selected' : ''}`}
              onClick={() => setAnswerAndNext('bleedingStart', opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ),
      stateKey: 'bleedingStart'
    });
    // 60
    blocks.push({
      element: (
        <div>
          <h2>When did this last happen?</h2>
          <textarea
            className="text-input"
            rows={2}
            value={(answers.bleedingLastHappened as string) || ''}
            onChange={e => setAnswer('bleedingLastHappened', e.target.value)}
          />
        </div>
      ),
      stateKey: 'bleedingLastHappened'
    });
    // 61
    blocks.push({
      element: (
        <div>
          <h2>Have you had:</h2>
          {[
            'bleeding during or after sex',
            'heavy bleeding',
            'pain when having sex',
            'none of these'
          ].map(opt => {
            const none = opt === 'none of these';
            const list = Array.isArray(answers.bleedingSymptoms)
              ? [...answers.bleedingSymptoms]
              : [];
            const checked = list.includes(opt);
            return (
              <label key={opt} className="checkbox-card">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    let next = checked
                      ? list.filter(x => x !== opt)
                      : [...list, opt];
                    if (none) next = ['none of these'];
                    else next = next.filter(x => x !== 'none of these');
                    setAnswer('bleedingSymptoms', next);
                  }}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      ),
      stateKey: 'bleedingSymptoms'
    });
    // 62
    if (
      Array.isArray(answers.bleedingSymptoms) &&
      answers.bleedingSymptoms.length > 0
    ) {
      blocks.push({
        element: (
          <div>
            <h2>
              Have you had a test for sexually transmitted infections (STIs)
              in the last 12 months or since your last new sexual partner?
            </h2>
            <p className="subtitle">
              We ask this because an STI can be a cause of unexpected or unusual bleeding.
            </p>
            {['Yes','No'].map(opt => (
              <button
                key={opt}
                className={`option-btn ${answers.stiTest === opt ? 'selected' : ''}`}
                onClick={() => setAnswer('stiTest', opt)}
              >
                {opt}
              </button>
            ))}
            {answers.stiTest === 'Yes' ? (
              <div className="info-block">
                It is important that your cervical smear tests are up to date. Most
                women from the age of 25 should have a smear test every 3 years, and
                every 5 years after the age of 50. You may be invited more frequently
                if there were any abnormalities on your last test. If you are not sure
                when your next test should be, please contact your GP.
              </div>
            ) : (
              <div className="info-block">
                We’d recommend you get tested for sexually transmitted infections (STIs)
                as they can be a cause of unexpected or unusual bleeding.
                <br/><br/>
                It is important that your cervical smear tests are up to date. Most
                women from the age of 25 should have a smear test every 3 years, and
                every 5 years after the age of 50. You may be invited more frequently
                if there were any abnormalities on your last test. If you are not sure
                when your next test should be, please contact your GP.
              </div>
            )}
          </div>
        ),
        stateKey: 'stiTest'
      });
    }
  }
// —————————————————————————————————————————————
// Q64) Do you have any other medical conditions?
// —————————————————————————————————————————————
blocks.push({
  element: (
    <div>
      <h2>Do you have any other medical conditions?</h2>
      <p className="subtitle">
        Please let us know any other health conditions you have that we haven't already asked about.
      </p>
      {['Yes','No'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.otherConditions === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('otherConditions', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'otherConditions'
});

// Q64b) List them if "Yes"
if (answers.otherConditions === 'Yes') {
  blocks.push({
    element: (
      <div>
        <h2>Please list all your medical conditions:</h2>
        <textarea
          className="text-input"
          rows={3}
          placeholder="e.g. asthma, eczema, osteoarthritis..."
          value={(answers.conditionsList as string) || ''}
          onChange={e => setAnswer('conditionsList', e.target.value)}
        />
      </div>
    ),
    stateKey: 'conditionsList'
  });
}

// —————————————————————————————————————————————
// Q63) Do you take tranexamic acid?
// —————————————————————————————————————————————
blocks.push({
  element: (
    <div>
      <h2>Do you take tranexamic acid?</h2>
      <p className="subtitle">
        This is a medication that is often used to help reduce heavy bleeding.
        Brand names include Cyklokapron and Evana Heavy Period Relief.
      </p>
      {['Yes','No'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.tranexamicAcid === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('tranexamicAcid', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'tranexamicAcid'
});

// —————————————————————————————————————————————
// Q65) Are you taking any of the following medications?
// —————————————————————————————————————————————
blocks.push({
  element: (
    <div>
      <h2>Are you taking any of the following medications?</h2>
      <p className="subtitle">
        Some medicines can interact with hormonal contraception.
      </p>
      {[
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
        'Topiramate'
      ].map(opt => (
        <label key={opt} className="checkbox-card">
          <input
            type="checkbox"
            checked={Array.isArray(answers.medList) && answers.medList.includes(opt)}
            onChange={() => {
              const current = Array.isArray(answers.medList) ? [...answers.medList] : [];
              const idx = current.indexOf(opt);
              if (idx > -1) current.splice(idx, 1);
              else current.push(opt);
              // whenever anything else is selected, clear “None of the above”
              setAnswer('medList', current);
              setAnswer('medNone', false);
            }}
          />
          <span>{opt}</span>
        </label>
      ))}
      <label className="checkbox-card">
  <input
    type="checkbox"
    checked={!!answers.medNone}
    onChange={() => {
      const now = !answers.medNone;
      setAnswer('medNone', now);
      if (now) {
        // clear any other meds
        setAnswer('medList', []);
      }
    }}
  />
  <span>None of the above</span>
</label>

    </div>
  ),
  stateKey: 'medList'
});

}
// —————————————————————————————————————————————
// Q66) Other medications?
// —————————————————————————————————————————————
blocks.push({
  element: (
    <div>
      <h2>
        Are you currently taking any other medication, or have you recently finished a course of medication?
      </h2>
      {['Yes','No'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.otherMedication === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('otherMedication', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'otherMedication'
});

// Q66b) If “Yes” → names & doses
if (answers.otherMedication === 'Yes') {
  blocks.push({
    element: (
      <div>
        <h2>Please list the names and doses of all these medications:</h2>
        <textarea
          className="text-input"
          rows={3}
          placeholder="e.g. Methotrexate 10 mg weekly, Prednisolone 5 mg daily"
          value={(answers.otherMedDetails as string) || ''}
          onChange={e => setAnswer('otherMedDetails', e.target.value)}
        />
      </div>
    ),
    stateKey: 'otherMedDetails'
  });

  // Q66c) If “Yes” → purpose
  blocks.push({
    element: (
      <div>
        <h2>What do you use these medications for?</h2>
        <textarea
          className="text-input"
          rows={2}
          placeholder="e.g. rheumatoid arthritis, asthma"
          value={(answers.otherMedPurpose as string) || ''}
          onChange={e => setAnswer('otherMedPurpose', e.target.value)}
        />
      </div>
    ),
    stateKey: 'otherMedPurpose'
  });
}

// —————————————————————————————————————————————
// Q65) Supply length + confirm bullets + T&C
// —————————————————————————————————————————————

// 65a) choose 3- or 6-month supply
blocks.push({
  element: (
    <div>
      <h2>Do you want to order a 3 month or 6 month supply of contraception?</h2>
      <p className="subtitle">
        If you’re new to contraception or starting a new one that you’ve not been on before, we recommend a 3 month supply so you can see if it suits you and if you get any side effects. If you’re ordering one you’re already taking or have used before, a 6 month supply may be more suitable.
      </p>
      <p className="subtitle">
        Hana, the mini pill, is available as a 1 month pack as well as a 3 and 6 months pack. Choose '3 months' here if you'd like this option.
      </p>
      {['3 months','6 months'].map(opt => (
        <button
          key={opt}
          className={`option-btn ${answers.supplyLength === opt ? 'selected' : ''}`}
          onClick={() => setAnswerAndNext('supplyLength', opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  ),
  stateKey: 'supplyLength'
});

// blocks.push({
//   element: (
//     <div className="patient-details">
//       <h2 className="full-width">Patient details</h2>

//       <label>
//         Title
//         <select
//           value={(answers.patientTitle as string) || ''}
//           onChange={e => setAnswer('patientTitle', e.target.value)}
//         >
//           <option value="">Select…</option>
//           {['Mr','Mrs','Miss','Ms','Dr','Other'].map(t => (
//             <option key={t} value={t}>{t}</option>
//           ))}
//         </select>
//       </label>

//       <label>
//         First name<span className="required">*</span>
//         <input
//           type="text"
//           value={(answers.patientName as string) || ''}
//           onChange={e => setAnswer('patientName', e.target.value)}
//         />
//       </label>

//       <label>
//         Age
//         <input
//           type="number"
//           value={(answers.patientAge as string) || ''}
//           onChange={e => setAnswer('patientAge', e.target.value)}
//         />
//       </label>

//       <label className="full-width">
//         Address line 1
//         <input
//           type="text"
//           value={(answers.patientAddress1 as string) || ''}
//           onChange={e => setAnswer('patientAddress1', e.target.value)}
//         />
//       </label>

//       <label>
//         Postcode
//         <input
//           type="text"
//           value={(answers.patientPostcode as string) || ''}
//           onChange={e => setAnswer('patientPostcode', e.target.value)}
//         />
//       </label>
//     </div>
//   ),
//   stateKey: 'patientName'   // require at least name to advance
// });


// 65b) “I fully understand…” bullets
blocks.push({
  element: (
    <label className="checkbox-card">
      <input
        type="checkbox"
        checked={!!answers.supplyConfirm}
        onChange={e => setAnswerAndNext('supplyConfirm', e.target.checked)}
      />
      <div>
        <ul>
          <li>I fully understand the questions asked &amp; have answered honestly &amp; truthfully.</li>
          <li>I fully understand the side-effects of the treatment options, their effectiveness and alternative options &amp; am happy to continue with my request.</li>
          <li>I confirm &amp; agree that any treatment prescribed for me is for my personal use only.</li>
        </ul>
      </div>
    </label>
  ),
  stateKey: 'supplyConfirm'
});

// 65c) T&C / Privacy / Cookie policy
// blocks.push({
//   element: (
//     <label className="checkbox-card">
//       <input
//         type="checkbox"
//         checked={!!answers.agreeTnC}
//         onChange={e => setAnswerAndNext('agreeTnC', e.target.checked)}
//       />
//       {/* <span>
//         Please tick here to show that you’ve read, understood and agree to our{' '}
//         <a href="/terms" target="_blank">terms and conditions</a>,{' '}
//         <a href="/privacy" target="_blank">privacy notice</a> and{' '}
//         <a href="/cookie" target="_blank">cookie policy</a>.
//       </span> */}
//     </label>
//   ),
//   stateKey: 'agreeTnC'
// });


// …any blocks that come _after_ this…
// Navigation helpers
const safeStep = Math.min(step, blocks.length - 1);
const currentBlock = blocks[safeStep];

const canNext = (): boolean => {
  if (safeStep === blocks.length - 1) return true;
  const cfg = blocks[safeStep];
  if (!cfg.stateKey) return true;
  const val = answers[cfg.stateKey];
  if (typeof val === 'boolean') return val;
  if (Array.isArray(val)) return val.length > 0;
  return !!val;
};

const goNext = () => canNext() && setStep(s => Math.min(s + 1, blocks.length - 1));
const goPrev = () => setStep(s => Math.max(s - 1, 0));

// handleSubmit → save + PDF + success
const handleSubmit = async () => {
  await supabase.from('contraception_assessment').insert([answers]);

  const doc = new jsPDF({ unit: 'pt' });
  const margin = 40;
  let y = margin;

  // Title
  doc.setFontSize(18);
  doc.text('Contraception Request - Coleshill Pharmacy', margin, y);
  y += 30;

  // Patient details
  doc.setFontSize(12);
  ['patientTitle','patientName','patientAge','patientAddress1','patientPostcode'].forEach(key => {
    const label = questionsMap[key] || key;
    const value = String(answers[key] || '');
    doc.text(`${label}: ${value}`, margin, y);
    y += 20;
  });
  y += 10;

  // Q&A
  doc.setFontSize(12);
  Object.entries(answers).forEach(([key,val]) => {
    if (key.startsWith('patient')) return;
    const question = questionsMap[key] || key;
    const answer = Array.isArray(val) ? val.join(', ') : String(val);
    doc.text(question, margin, y);
    y += 16;
    const lines = doc.splitTextToSize(answer, 500);
    doc.text(lines, margin + 10, y);
    y += lines.length * 14 + 10;
    if (y > doc.internal.pageSize.height - 60) {
      doc.addPage();
      y = margin;
    }
  });

  const blob = doc.output('blob');
  setPdfUrl(URL.createObjectURL(blob));
  setSubmitted(true);
};

// Success screen
if (submitted) return (
  <>
    <Header />
    <div className="contra-container">
      <h1>Success!</h1>
      <p>Your answers have been submitted.</p>
      {!pdfUrl && (
        <button onClick={handleSubmit} className="download-btn">Generate PDF</button>
      )}
      {pdfUrl && (
        <a href={pdfUrl} download="contraception_assessment.pdf" className="download-btn">
          Download PDF
        </a>
      )}
    </div>
  </>
);

// Main render
return (
  <>
    <Header />
    <div className="contra-container">
      <h1 className="page-title">Contraception Assessment</h1>
      <section className="question-card">
        {currentBlock.element}
      </section>
      <div className="pager-buttons">
        <button onClick={goPrev} disabled={safeStep === 0} className="prev-btn">Back</button>
        {safeStep < blocks.length - 1 ? (
          <button onClick={goNext} disabled={!canNext()} className="next-btn">Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={!canNext()} className="submit-btn">Submit</button>
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
