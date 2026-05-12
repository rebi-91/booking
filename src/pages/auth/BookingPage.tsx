
import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  FormEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import './BookingPage.css';
import supabase from '../../supabase';
import { useSession } from '../../context/SessionContext';

// Title options for dropdown
const TITLE_OPTIONS = ['Mr', 'Mrs', 'Miss', 'Master', 'Dr', 'Prof'];

// About 50 most-common country codes
const COUNTRY_CODES = [
  { label: 'United Kingdom (+44)', value: '44' },
  { label: 'United States (+1)', value: '1' },
  { label: 'Canada (+1)', value: '1' },
  { label: 'Australia (+61)', value: '61' },
  { label: 'India (+91)', value: '91' },
  { label: 'Germany (+49)', value: '49' },
  { label: 'France (+33)', value: '33' },
  { label: 'Italy (+39)', value: '39' },
  { label: 'Spain (+34)', value: '34' },
  { label: 'Netherlands (+31)', value: '31' },
  { label: 'Sweden (+46)', value: '46' },
  { label: 'Norway (+47)', value: '47' },
  { label: 'Denmark (+45)', value: '45' },
  { label: 'Finland (+358)', value: '358' },
  { label: 'Belgium (+32)', value: '32' },
  { label: 'Switzerland (+41)', value: '41' },
  { label: 'Austria (+43)', value: '43' },
  { label: 'New Zealand (+64)', value: '64' },
  { label: 'South Africa (+27)', value: '27' },
  { label: 'Nigeria (+234)', value: '234' },
  { label: 'Egypt (+20)', value: '20' },
  { label: 'Kenya (+254)', value: '254' },
  { label: 'Brazil (+55)', value: '55' },
  { label: 'Mexico (+52)', value: '52' },
  { label: 'Argentina (+54)', value: '54' },
  { label: 'Chile (+56)', value: '56' },
  { label: 'Colombia (+57)', value: '57' },
  { label: 'Peru (+51)', value: '51' },
  { label: 'Venezuela (+58)', value: '58' },
  { label: 'Russia (+7)', value: '7' },
  { label: 'China (+86)', value: '86' },
  { label: 'Japan (+81)', value: '81' },
  { label: 'South Korea (+82)', value: '82' },
  { label: 'Singapore (+65)', value: '65' },
  { label: 'Malaysia (+60)', value: '60' },
  { label: 'Indonesia (+62)', value: '62' },
  { label: 'Thailand (+66)', value: '66' },
  { label: 'Vietnam (+84)', value: '84' },
  { label: 'Philippines (+63)', value: '63' },
  { label: 'Saudi Arabia (+966)', value: '966' },
  { label: 'United Arab Emirates (+971)', value: '971' },
  { label: 'Qatar (+974)', value: '974' },
  { label: 'Israel (+972)', value: '972' },
  { label: 'Turkey (+90)', value: '90' },
  { label: 'Poland (+48)', value: '48' },
  { label: 'Greece (+30)', value: '30' },
  { label: 'Ireland (+353)', value: '353' },
  { label: 'Portugal (+351)', value: '351' },
  { label: 'Czech Republic (+420)', value: '420' },
  { label: 'Hungary (+36)', value: '36' },
  { label: 'Romania (+40)', value: '40' },
];

interface Service {
  id: number;
  title: string;
  duration: string;
  address: string;
  price: string;
  description?: string;
}

interface BookingData {
  date: string;
  start_time: string;
  cat: 'NHS' | 'Private';
  service: string;
  title: string;
  dateBirth: string;
  patientName: string;
  telNumber: string;
  email: string;
  status: string;
  customerID?: string;
  both?: boolean;
  medication?: string;
  amount?: string;
}

// Sample services data
const sampleServices: Record<number, Service> = {
  1: {
    id: 1,
    title: 'Altitude sickness',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£10.00',
  },
  2: {
    id: 2,
    title: 'Sore throat (Ages 5+)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  3: {
    id: 3,
    title: 'Travel Consultation',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£10.00 – deducted if go ahead with treatment',
  },
  4: {
    id: 4,
    title: 'Travel vaccine',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies – depends on what vaccine(s) needed',
  },
  5: {
    id: 5,
    title: 'Uncomplicated UTI (Women aged 16–64)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  6: {
    id: 6,
    title: 'Vitamin B12 Injection',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£30.00',
  },
  7: {
    id: 7,
    title: 'Impetigo (Ages 1+)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  8: {
    id: 8,
    title: 'Infected insect bite (Ages 1+)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  90: {
    id: 90,
    title: 'Period Delay',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£20.00',
  },
  89: {
    id: 89,
    title: 'Period Pain',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies depending on treatment',
  },
  10: {
    id: 10,
    title: 'Private flu jab',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£30.00',
  },
  44: {
    id: 44,
    title: 'Shingles (Ages 18+)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  12: {
    id: 12,
    title: 'Weight Loss Clinic',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies depending on Treatment',
  },
  55: {
    id: 55,
    title: 'Mounjaro',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies depending on Treatment',
  },
  66: {
    id: 66,
    title: 'Wegovy',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies depending on Treatment',
  },
  67: {
    id: 67,
    title: 'Orlistat',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies depending on Treatment',
  },
  13: {
    id: 13,
    title: 'Oral Contraception',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  14: {
    id: 14,
    title: 'Flu Vaccination',
    duration: '5m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  15: {
    id: 15,
    title: 'Blood Pressure Check',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  16: {
    id: 16,
    title: 'COVID-19 Vaccination (over 75)',
    duration: '5m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  45: {
    id: 45,
    title: 'Private COVID-19 Vaccination',
    duration: '5m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Private',
  },
  46: {
    id: 46,
    title: 'Ear Piercing',
    duration: '5m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Get your ear(s) pierced for only £40',
  },
  17: {
    id: 17,
    title: 'Yellow fever',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '—',
  },
  18: {
    id: 18,
    title: 'Ear wax removal',
    duration: '15m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price:
      '£55 for one ear £75 for both. (£25 for consultation if no wax is found) <br/><b>Please ensure you have been using olive oil twice a day for at least 14 days prior to appointment.</b>',
  },
  19: {
    id: 19,
    title: 'Earache (Ages 1–17)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  20: {
    id: 20,
    title: 'Erectile dysfunction',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Sildenafil/Tadalafil – 2 tabs £10, 4 tabs £15, 8 tabs £25',
  },
  21: {
    id: 21,
    title: 'Sinusitis (Ages 12+)',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  22: {
    id: 22,
    title: 'Acid Reflux',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'PPIs (omeprazole etc.) for £8',
  },
  23: {
    id: 23,
    title: 'Pain Relief',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Naproxen 500mg for £8',
  },
  24: {
    id: 24,
    title: 'Male Pattern Baldness (Androgenic Alopecia)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Finasteride 1mg for £20',
  },
  25: {
    id: 25,
    title: 'Female Hirsutism in Women',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Vaniqa cream for £69.99',
  },
  26: {
    id: 26,
    title: 'Jet Lag',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Melatonin MR – 5 tabs £18.99 / 30 tabs £39.99',
  },
  9: {
    id: 9,
    title: 'Traveller’s Diarrhoea',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Azithromycin for £20',
  },
  28: {
    id: 28,
    title: 'Oral Thrush',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies depending on treatment',
  },
  30: {
    id: 30,
    title: 'Diphtheria, Tetanus and Polio',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£40.00 - only 1 dose',
  },
  31: {
    id: 31,
    title: 'Hepatitis A (2 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£60.00 per dose',
  },
  32: {
    id: 32,
    title: 'Hepatitis B (3 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£60.00 per dose',
  },
  33: {
    id: 33,
    title: 'Typhoid (1 dose or orally)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£40.00',
  },
  34: {
    id: 34,
    title: 'Rabies (3 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£90.00 per dose',
  },
  35: {
    id: 35,
    title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£60.00',
  },
  36: {
    id: 36,
    title: 'Cholera (2 doses – special cases)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£90.00',
  },
  37: {
    id: 37,
    title: 'Japanese Encephalitis',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£100.00 per dose',
  },
  38: {
    id: 38,
    title: 'Chicken Pox',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£80.00',
  },
  39: {
    id: 39,
    title: 'Meningitis B',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£140.00',
  },
  40: {
    id: 40,
    title: 'Shingles vaccination (Zostavax)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£200.00',
  },
  41: {
    id: 41,
    title: 'Anti-malarials',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Malarone £40 / Doxycycline £25',
  },
  42: {
    id: 42,
    title: 'HPV',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Gardasil-9 – £184.50/dose, £362 (2 doses), £540 (3 doses)',
  },
  43: {
    id: 43,
    title: 'Dengue Fever (2 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Qdenga - £130 per dose',
  },
};

// Flu service IDs
// 10 = Private flu jab
// 14 = NHS Flu Vaccination
const FLU_SERVICE_IDS = new Set([10, 14]);

// Determine category by service id
function serviceCategory(id: number): 'NHS' | 'Private' {
  const nhs = new Set([2, 5, 7, 8, 13, 14, 15, 16, 17, 19, 21]);
  return nhs.has(id) ? 'NHS' : 'Private';
}

function toLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Date range helper where the end date is NOT included.
// Example: start 18 May 2026, end 22 June 2026 blocks:
// 18 May 2026 through 21 June 2026.
// 22 June 2026 is available again.
function isWithinDateRangeEndExclusive(
  date: Date,
  start: Date,
  end: Date
): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  return d >= s && d < e;
}

// Fetch existing booked times for a given date & category
async function fetchExistingBookings(
  dateISO: string,
  category: 'NHS' | 'Private',
  sid?: number
): Promise<string[]> {
  let query = supabase
    .from('bookings')
    .select('start_time')
    .eq('date', dateISO);

  if (sid === 14 || sid === 16) {
    // Flu + COVID block each other
    query = query.in('service', [
      sampleServices[14].title.replace(/ treatment$/i, ''),
      sampleServices[16].title.replace(/ treatment$/i, ''),
    ]);
  } else {
    // Normal rule → match same category
    query = query.eq('cat', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }

  return (data as { start_time: string }[]).map((r) => r.start_time);
}

// Generate timeslots between start and end with step in minutes
function generateTimeSlots(
  sh: number,
  sm: number,
  eh: number,
  em: number,
  step: number
): string[] {
  const slots: string[] = [];
  let cur = new Date();
  cur.setHours(sh, sm, 0, 0);

  const end = new Date();
  end.setHours(eh, em, 0, 0);

  while (cur <= end) {
    slots.push(
      `${String(cur.getHours()).padStart(2, '0')}:${String(
        cur.getMinutes()
      ).padStart(2, '0')}`
    );

    cur = new Date(cur.getTime() + step * 60_000);
  }

  return slots;
}

// Available slots by day-of-week and category
function slotsForDayAndCategory(
  dow: number,
  cat: 'NHS' | 'Private',
  sid?: number,
  date?: Date
): string[] {
  const step = cat === 'Private' ? 20 : 10;

  // ✅ Ear wax removal / ear syringing rules
  // - No Saturdays
  // - No Sundays
  // - Block from Monday 18 May 2026 until Monday 22 June 2026
  // - 22 June 2026 is NOT included, so bookings restart from 22 June 2026
  if (sid === 18 && date) {
    const earWaxBlockStart = new Date(2026, 4, 18); // 18 May 2026
    const earWaxBlockEnd = new Date(2026, 5, 22); // 22 June 2026, not included

    if (dow === 0 || dow === 6) {
      return []; // no Sundays or Saturdays
    }

    if (isWithinDateRangeEndExclusive(date, earWaxBlockStart, earWaxBlockEnd)) {
      return []; // blocked from 18 May 2026 up to but not including 22 June 2026
    }

    if (dow >= 1 && dow <= 4) {
      return [
        ...generateTimeSlots(9, 30, 11, 45, 15),
        ...generateTimeSlots(14, 0, 17, 45, 15),
      ];
    }

    if (dow === 5) {
      return [
        ...generateTimeSlots(9, 30, 11, 45, 15),
        ...generateTimeSlots(15, 0, 17, 45, 15),
      ];
    }

    return [];
  }

  // ✅ Flu jabs blocked until after 1st October 2026
  // This applies to Private flu jab (10) and NHS Flu Vaccination (14)
  if (sid && FLU_SERVICE_IDS.has(sid) && date) {
    const fluStart = new Date(2026, 9, 2); // 2 Oct 2026 = after 1st October 2026

    if (date < fluStart) {
      return [];
    }

    if (dow >= 1 && dow <= 4) {
      return [
        ...generateTimeSlots(9, 30, 12, 55, 5),
        ...generateTimeSlots(14, 0, 17, 55, 5),
      ];
    }

    if (dow === 5) {
      return [
        ...generateTimeSlots(9, 30, 11, 55, 5),
        ...generateTimeSlots(15, 0, 17, 55, 5),
      ];
    }

    return [];
  }

  // ✅ COVID rule kept separate
  if (sid === 16 && date) {
    const covidStart = new Date(2025, 9, 1); // 1 Oct 2025

    if (date < covidStart) {
      return [];
    }

    if (dow >= 1 && dow <= 4) {
      return [
        ...generateTimeSlots(9, 30, 12, 55, 5),
        ...generateTimeSlots(14, 0, 17, 55, 5),
      ];
    }

    if (dow === 5) {
      return [
        ...generateTimeSlots(9, 30, 11, 55, 5),
        ...generateTimeSlots(15, 0, 17, 55, 5),
      ];
    }

    return [];
  }

  // Normal rules for all other services
  const startHour = 9;
  const startMin = 30;
  const endHour = 18;
  const endMin = 0;

  if (dow >= 1 && dow <= 4) {
    // Mon–Thu, 1–2pm blocked
    return [
      ...generateTimeSlots(startHour, startMin, 12, 0 - step, step),
      ...generateTimeSlots(14, 0, endHour - 1, endMin - 1, step),
    ];
  }

  if (dow === 5) {
    // Fri, 12–3pm blocked
    return [
      ...generateTimeSlots(startHour, startMin, 12, 0 - step, step),
      ...generateTimeSlots(15, 0, endHour - 1, endMin - 1, step),
    ];
  }

  // Sat/Sun → no slots
  return [];
}

const pharmacyEmail = 'coleshillpharmacy@hotmail.com';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();

  const [bothSelected, setBothSelected] = useState(false);
  const sid = parseInt(id || '1', 10);
  const service = sampleServices[sid] || sampleServices[1];
  const category = serviceCategory(sid);

  const [medication, setMedication] = useState('');
  const [amount, setAmount] = useState('');

  // Calendar state
  const [view, setView] = useState<'calendar' | 'form'>('calendar');

  const today = new Date();

  let initialYear = today.getFullYear();
  let initialMonth = today.getMonth();

  if (FLU_SERVICE_IDS.has(sid)) {
    initialYear = 2026;
    initialMonth = 9; // October
  }

  if (sid === 16) {
    initialYear = 2025;
    initialMonth = 9; // October
  }

  const [displayYear, setDisplayYear] = useState(initialYear);
  const [displayMonth, setDisplayMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [chosenTime, setChosenTime] = useState<string | null>(null);
  const timeSlotRef = useRef<HTMLDivElement>(null);

  // Form state + validation
  const [patientTitle, setPatientTitle] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [patientName, setPatientName] = useState('');
  const [countryCode, setCountryCode] = useState('44');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  const [errors, setErrors] = useState<{
    title?: string;
    dob?: string;
    name?: string;
    phone?: string;
    medication?: string;
    amount?: string;
  }>({});

  // Load available times when date or category changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) {
        setAvailableTimes([]);
        return;
      }

      const dow = selectedDate.getDay();
      const all = slotsForDayAndCategory(dow, category, sid, selectedDate);
      const dateISO = toLocalYMD(selectedDate);
      const booked = await fetchExistingBookings(dateISO, category, sid);

      setAvailableTimes(all.filter((t) => !booked.includes(t)));
    }

    loadSlots();
  }, [selectedDate, category, sid]);

  // Scroll into view when selecting date
  useEffect(() => {
    if (selectedDate && timeSlotRef.current) {
      setTimeout(() => {
        timeSlotRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [selectedDate]);

  // Reset scroll on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calendar helpers
  const firstOfMonth = new Date(displayYear, displayMonth, 1);
  const firstColumnIndex = (firstOfMonth.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  const isCurrentMonth =
    displayYear === today.getFullYear() && displayMonth === today.getMonth();

  const handlePrev = () => {
    if (
      displayYear > today.getFullYear() ||
      (displayYear === today.getFullYear() && displayMonth > today.getMonth())
    ) {
      const p = new Date(displayYear, displayMonth - 1, 1);

      setDisplayYear(p.getFullYear());
      setDisplayMonth(p.getMonth());
      setSelectedDate(null);
      setChosenTime(null);
    }
  };

  const handleNext = () => {
    const n = new Date(displayYear, displayMonth + 1, 1);

    setDisplayYear(n.getFullYear());
    setDisplayMonth(n.getMonth());
    setSelectedDate(null);
    setChosenTime(null);
  };

  const footerText =
    selectedDate &&
    selectedDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(displayYear, displayMonth, day));
    setChosenTime(null);
  };

  const handleTimeClick = (t: string) => {
    setChosenTime(t);
    setView('form');
  };

  async function handleBookingSubmit(e: FormEvent) {
    e.preventDefault();

    const errs: Record<string, string> = {};

    if (!patientTitle) errs.title = 'Required';
    if (!patientDob) errs.dob = 'Required';
    if (!patientName.trim()) errs.name = 'Required';
    if (!patientPhone.trim()) errs.phone = 'Required';

    // Validation only if service is Erectile Dysfunction
    if (sid === 20) {
      if (!medication) errs.medication = 'Please select a medication';
      if (!amount) errs.amount = 'Please select an amount';
    }

    setErrors(errs);

    if (Object.keys(errs).length) return;
    if (!selectedDate || !chosenTime) return;

    const dateISO = toLocalYMD(selectedDate);
    const e164 = countryCode + patientPhone.replace(/^0+/, '');
    const strippedTitle = service.title.replace(/ treatment$/i, '');

    const { error } = await supabase.from('bookings').insert<BookingData>([
      {
        date: dateISO,
        start_time: chosenTime,
        cat: category,
        service: strippedTitle,
        title: patientTitle,
        dateBirth: patientDob,
        patientName,
        telNumber: e164,
        both: bothSelected,
        email: patientEmail,
        status: 'Pending Confirmation',
        ...(sid === 20 && { medication, amount }),
        ...(session?.user?.id && { customerID: session.user.id }),
      },
    ]);

    if (error) {
      alert('Error saving booking: ' + error.message);
      return;
    }

    // Send email to patient
    if (patientEmail.trim()) {
      const patientEmailPayload = {
        to: patientEmail,
        name: `${patientTitle} ${patientName}`,
        service: service.title,
        date: dateISO,
        time: chosenTime,
      };

      const { error: patientFnErr } = await supabase.functions.invoke(
        'resend-email',
        {
          body: patientEmailPayload,
        }
      );

      if (patientFnErr) {
        console.warn('Patient email error:', patientFnErr.message);
      }
    }

    // Send email to pharmacy
    const pharmacyEmailPayload = {
      to: pharmacyEmail,
      name: 'Coleshill Pharmacy',
      service: service.title,
      date: dateISO,
      time: chosenTime,
      patient: `${patientTitle} ${patientName}`,
      phone: e164,
      email: patientEmail,
    };

    const { error: pharmacyFnErr } = await supabase.functions.invoke(
      'resend-email',
      {
        body: pharmacyEmailPayload,
      }
    );

    if (pharmacyFnErr) {
      console.warn('Pharmacy email error:', pharmacyFnErr.message);
    }

    if (sid === 20) {
      alert(`Booking confirmed for Erectile Dysfunction.
Medication: ${medication}
Amount: ${amount}
Please check your inbox, including spam folder.`);
    } else {
      alert('Booking confirmed! Please check your inbox, including spam folder.');
    }

    navigate('/');
  }

  return (
    <>
      <Header />

      <div className="page-wrapper">
        <div className="container py-3">
          {view === 'calendar' && (
            <>
              <button className="round-back" onClick={() => navigate(-1)}>
                ←
              </button>

              <div className="service-header">
                <h2 className="booking-title">{service.title}</h2>

                <p className="booking-subtitle">
                  {sid === 14 && (
                    <>
                      Flu vaccinations are NOT available from 2nd October 2026.
                      <div className="mt-2 texxt">
                        <div className="mt-2">Flu Eligible Patients:</div>
                        <ul className="list-disc list-inside">
                          <li>Aged 65 and over</li>
                          <li>
                            Clinically at risk, for example asthma, COPD, heart
                            failure, etc.
                          </li>
                          <li>
                            Contacts of patients with a weakened immune system
                          </li>
                          <li>Care home residents</li>
                          <li>Frontline health and social care workers</li>
                          <li>Pregnant women</li>
                        </ul>
                      </div>
                      <a href="/book/16" className="text-blue-600 underline">
                        COVID
                      </a>{' '}
                      vaccinations are available.
                      <div className="mt-2 texxt">
                        <div className="mt-2">COVID Eligible Patients:</div>
                        <ul className="list-disc list-inside">
                          <li>Aged 75 and over</li>
                          <li>Weakened immune system</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {sid === 16 && (
                    <>
                
                      <div className="mt-2 texxt">
                        <div className="mt-2">COVID Eligible Patients:</div>
                        <ul className="list-disc list-inside">
                          <li>Aged 75 and over</li>
                          <li>Weakened immune system</li>
                        </ul>
                      </div>
                      <a href="/book/14" className="text-blue-600 underline">
                        Flu jabs
                      </a>{' '}
                      are NOT available until the 2nd of October 2026.
                      {/* <div className="mt-2 texxt">
                        <div className="mt-2">Flu Eligible Patients:</div>
                        <ul className="list-disc list-inside">
                          <li>Aged 65 and over</li>
                          <li>
                            Clinically at risk, for example asthma, COPD, heart
                            failure, etc.
                          </li>
                          <li>
                            Contacts of patients with a weakened immune system
                          </li>
                          <li>Care home residents</li>
                          <li>Frontline health and social care workers</li>
                          <li>Pregnant women</li>
                        </ul>
                      </div> */}
                    </>
                  )}

                  {sid !== 14 && sid !== 16 && 'Book your Appointment now!'}
                </p>

                <div className="service-info-row">
                  <div className="info-item">
                    <i className="bi bi-clock"></i>
                    <span>{service.duration}</span>
                  </div>

                  <div className="info-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>{service.address}</span>
                  </div>

                  <div className="info-item">
                    <i className="bi bi-wallet2"></i>
                    <span dangerouslySetInnerHTML={{ __html: service.price }} />
                  </div>
                </div>

                {sid === 20 && (
                  <div className="ed-inline-selects">
                    <div className="ed-field">
                      <select
                        id="medication"
                        className="form-control"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select medication
                        </option>
                        <option value="Sildenafil">Sildenafil</option>
                        <option value="Tadalafil">Tadalafil</option>
                      </select>
                    </div>

                    <div className="ed-field">
                      <select
                        id="amount"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select amount
                        </option>
                        <option value="2 tablets">2 tablets</option>
                        <option value="4 tablets">4 tablets</option>
                        <option value="8 tablets">8 tablets</option>
                      </select>
                    </div>
                  </div>
                )}

                <hr />
              </div>

              <div className="calendar-container">
                <div className="calendar-header-box">
                  <button
                    className="btn header-arrow"
                    onClick={handlePrev}
                    disabled={isCurrentMonth}
                  >
                    ‹
                  </button>

                  <span className="header-month">
                    {new Date(displayYear, displayMonth).toLocaleDateString(
                      'en-GB',
                      {
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </span>

                  <button className="btn header-arrow" onClick={handleNext}>
                    ›
                  </button>
                </div>

                <div className="calendar-grid mb-2">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(
                    (d) => (
                      <div key={d} className="col-1 px-0">
                        <button className="day-btn header-day" disabled>
                          {d}
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="calendar-grid">
                  {Array.from({ length: firstColumnIndex }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="col-1 px-0" />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (day) => {
                      const dObj = new Date(displayYear, displayMonth, day);
                      const isToday =
                        dObj.toDateString() === today.toDateString();
                      const isSelected =
                        selectedDate &&
                        dObj.toDateString() === selectedDate.toDateString();

                      let inPast =
                        dObj <
                        new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate()
                        );

                      // Flu jabs blocked until after 1st October 2026
                      if (FLU_SERVICE_IDS.has(sid)) {
                        const fluStart = new Date(2026, 9, 2);
                        inPast = inPast || dObj < fluStart;
                      }

                      // COVID restriction kept as before
                      if (sid === 16) {
                        const covidStart = new Date(2025, 9, 1);
                        inPast = inPast || dObj < covidStart;
                      }

                      // Ear wax removal / ear syringing restrictions
                      // - Block Saturdays and Sundays
                      // - Block from 18 May 2026 until 22 June 2026
                      // - 22 June 2026 is not included
                      if (sid === 18) {
                        const dow = dObj.getDay();
                        const earWaxBlockStart = new Date(2026, 4, 18); // 18 May 2026
                        const earWaxBlockEnd = new Date(2026, 5, 22); // 22 June 2026, not included

                        if (
                          dow === 0 ||
                          dow === 6 ||
                          isWithinDateRangeEndExclusive(
                            dObj,
                            earWaxBlockStart,
                            earWaxBlockEnd
                          )
                        ) {
                          inPast = true;
                        }
                      }

                      let cls = '';

                      if (isSelected) cls = 'selected-day';
                      else if (isToday) cls = 'today-day';

                      return (
                        <div key={day} className="col-1 px-0">
                          <button
                            disabled={inPast}
                            className={`btn day-btn ${
                              inPast ? 'past-day' : cls
                            }`}
                            onClick={() => !inPast && handleDayClick(day)}
                          >
                            {day}
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <hr />

              {selectedDate ? (
                <div className="times-container">
                  <div className="selected-date-label" ref={timeSlotRef}>
                    {footerText}
                  </div>

                  <div className="row gx-0 time-row">
                    {availableTimes.length ? (
                      availableTimes.map((t) => (
                        <div key={t} className="col-12 px-0 mb-2">
                          <button
                            className={`btn time-slot-btn ${
                              chosenTime === t ? 'selected-time' : ''
                            }`}
                            onClick={() => handleTimeClick(t)}
                          >
                            {t}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="select-date-text">
                        No available slots for this date.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="select-date-text">
                  Select a date to see available times
                </p>
              )}
            </>
          )}

          {view === 'form' && selectedDate && chosenTime && (
            <div className="form-fullpage">
              <div className="form-header">
                <button
                  className="back-btn"
                  onClick={() => {
                    setView('calendar');
                    setChosenTime(null);
                  }}
                >
                  ←
                </button>

                <span className="form-title">{service.title}</span>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <strong>Category:</strong> {category}
                </div>

                <div className="detail-row">
                  <strong>Treatment:</strong> {service.title}
                </div>

                <div className="detail-row">
                  <strong>Provider:</strong> Coleshill Pharmacy
                </div>

                <div className="detail-row">
                  <strong>Date:</strong>{' '}
                  {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>

                <div className="detail-row">
                  <strong>Time:</strong> {chosenTime}
                </div>
              </div>

              {sid === 20 && (
                <div className="medication-amount-row">
                  <div>
                    <select
                      id="medication"
                      className={`form-control ${
                        errors.medication ? 'input-error' : ''
                      }`}
                      value={medication}
                      onChange={(e) => setMedication(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select medication *
                      </option>
                      <option value="Sildenafil">Sildenafil</option>
                      <option value="Tadalafil">Tadalafil</option>
                    </select>

                    {errors.medication && (
                      <div className="error-message">{errors.medication}</div>
                    )}
                  </div>

                  <div>
                    <select
                      id="amount"
                      className={`form-control ${
                        errors.amount ? 'input-error' : ''
                      }`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select amount *
                      </option>
                      <option value="2 tablets">2 tablets</option>
                      <option value="4 tablets">4 tablets</option>
                      <option value="8 tablets">8 tablets</option>
                    </select>

                    {errors.amount && (
                      <div className="error-message">{errors.amount}</div>
                    )}
                  </div>
                </div>
              )}

              <form
                className="booking-form"
                onSubmit={handleBookingSubmit}
                noValidate
              >
                <label htmlFor="patientTitle" className="form-label">
                  Title <span className="required">*</span>
                </label>

                <select
                  id="patientTitle"
                  className={`form-control ${
                    errors.title ? 'input-error' : ''
                  }`}
                  value={patientTitle}
                  onChange={(e) => setPatientTitle(e.target.value)}
                >
                  <option value="" disabled></option>
                  {TITLE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                {errors.title && (
                  <div className="error-message">{errors.title}</div>
                )}

                <label htmlFor="patientDob" className="form-label">
                  Date of Birth <span className="required">*</span>
                </label>

                <input
                  type="date"
                  id="patientDob"
                  className={`form-control ${errors.dob ? 'input-error' : ''}`}
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                />

                {errors.dob && (
                  <div className="error-message">{errors.dob}</div>
                )}

                <label htmlFor="patientName" className="form-label">
                  Name <span className="required">*</span>
                </label>

                <input
                  type="text"
                  id="patientName"
                  className={`form-control ${
                    errors.name ? 'input-error' : ''
                  }`}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />

                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}

                <label htmlFor="countryCode" className="form-label">
                  Country Code <span className="required">*</span>
                </label>

                <select
                  id="countryCode"
                  className="form-control"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={`${c.label}-${c.value}`} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="patientPhone" className="form-label">
                  Phone <span className="required">*</span>
                </label>

                <input
                  type="tel"
                  id="patientPhone"
                  className={`form-control ${
                    errors.phone ? 'input-error' : ''
                  }`}
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />

                {errors.phone && (
                  <div className="error-message">{errors.phone}</div>
                )}

                <label htmlFor="patientEmail" className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  id="patientEmail"
                  className="form-control"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />

                <button type="submit" className="submit-btn">
                  Confirm Booking
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;
