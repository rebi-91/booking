
import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import './BookingPage.css';
import supabase from '../../supabase';

interface Service {
  id: number;
  title: string;
  duration: string;
  address: string;
  price: string;
}

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
    title: 'Sore throat treatment',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  3: {
    id: 3,
    title: 'Travel Consultation',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£10.00 - deducted if go ahead with treatment',
  },
  4: {
    id: 4,
    title: 'Travel vaccine',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Varies - depends on what vaccine(s) needed',
  },
  5: {
    id: 5,
    title: 'Uncomplicated UTI (Women) treatment',
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
    title: 'Hair loss',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£10.00',
  },
  8: {
    id: 8,
    title: 'Impetigo treatment',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  9: {
    id: 9,
    title: 'Infected insect bite treatment',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  10: {
    id: 10,
    title: 'Period delay',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£20.00',
  },
  11: {
    id: 11,
    title: 'Private flu jab',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£20.00',
  },
  12: {
    id: 12,
    title: 'Shingles treatment',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  13: {
    id: 13,
    title: 'Weight Loss',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Starts at £120.00',
  },
  14: {
    id: 14,
    title: 'Oral Contraception',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  15: {
    id: 15,
    title: 'Flu Vaccination',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  16: {
    id: 16,
    title: 'Blood pressure check',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  17: {
    id: 17,
    title: 'COVID-19 Vaccination',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  18: {
    id: 18,
    title: 'Chicken pox vaccine',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£80.00',
  },
  19: {
    id: 19,
    title: 'Ear wax removal',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price:
      'Our service is £45 for one ear and £60 for two ears. £10 consult fee if no wax removed.',
  },
  20: {
    id: 20,
    title: 'Earache treatment',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  21: {
    id: 21,
    title: 'Erectile dysfunction',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Sildenafil or Tadalafil - 2 tablets (£10), 4 tablets (£15) and 8 tablets (£25)',
  },
  22: {
    id: 22,
    title: 'Sinusitis treatment',
    duration: '10m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Free NHS',
  },
  23: {
    id: 23,
    title: 'Diphtheria, tetanus and polio (1 dose)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£40',
  },
  24: {
    id: 24,
    title: 'Hepatitis A (2 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£60 per dose',
  },
  25: {
    id: 25,
    title: 'Hepatitis B (3 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£60 per dose',
  },
  26: {
    id: 26,
    title: 'Typhoid (1 dose or orally)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£40',
  },
  27: {
    id: 27,
    title: 'Rabies (3 doses)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£90 per dose',
  },
  28: {
    id: 28,
    title: 'Meningitis (1 dose - for hajj or umrah)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£60',
  },
  29: {
    id: 29,
    title: 'Cholera (2 doses - special cases)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£90',
  },
  30: {
    id: 30,
    title: 'Japanese Encephalitis',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£100 per dose',
  },
  31: {
    id: 31,
    title: 'Chicken pox',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£80',
  },
  32: {
    id: 32,
    title: 'Meningitis B',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£140',
  },
  33: {
    id: 33,
    title: 'Shingles (Zostavax)',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: '£200',
  },
  34: {
    id: 34,
    title: 'Anti-malarials',
    duration: '20m',
    address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
    price: 'Malarone for £40 and Doxycycline for £25',
  },
};

type Category = 'NHS' | 'Private';
function serviceCategory(id: number): Category {
  const nhs = new Set([2,5,8,9,12,14,15,16,17,20,22]);
  return nhs.has(id) ? 'NHS' : 'Private';
}

async function fetchExistingBookings(
  dateISO: string,
  category: Category
): Promise<string[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('start_time')
    .eq('date', dateISO)
    .eq('cat', category);
  if (error) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }
  return (data as { start_time: string }[]).map((r) => r.start_time);
}

function generateTimeSlots(
  sh: number, sm: number,
  eh: number, em: number,
  step: number
): string[] {
  const slots: string[] = [];
  let cur = new Date();
  cur.setHours(sh, sm, 0, 0);
  const end = new Date();
  end.setHours(eh, em, 0, 0);
  while (cur <= end) {
    slots.push(
      `${String(cur.getHours()).padStart(2,'0')}:${String(
        cur.getMinutes()
      ).padStart(2,'0')}`
    );
    cur = new Date(cur.getTime() + step * 60000);
  }
  return slots;
}

function slotsForDayAndCategory(
  dow: number,
  cat: Category
): string[] {
  const step = cat === 'Private' ? 20 : 10;
  if (cat === 'NHS') {
    if (dow >= 1 && dow <= 4)
      return generateTimeSlots(9,30,17,10,step);
    if (dow === 5)
      return [
        ...generateTimeSlots(9,30,12,10,step),
        ...generateTimeSlots(15,30,17,10,step),
      ];
    return [];
  } else {
    if (dow >= 1 && dow <= 3)
      return generateTimeSlots(9,30,17,10,step);
    if (dow === 5)
      return [
        ...generateTimeSlots(9,30,12,10,step),
        ...generateTimeSlots(15,0,17,10,step),
      ];
    return [];
  }
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const sid = parseInt(id || '0', 10);
  const service = sampleServices[sid] || sampleServices[1];
  const category = serviceCategory(sid);

  const [view, setView] = useState<'calendar' | 'form'>('calendar');
  const today = new Date();
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [chosenTime, setChosenTime] = useState<string | null>(null);
  const timeSlotRef = useRef<HTMLDivElement | null>(null);

  // form state + validation
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) return setAvailableTimes([]);
      const dow = selectedDate.getDay();
      const all = slotsForDayAndCategory(dow, category);
      const dateISO = selectedDate.toISOString().split('T')[0];
      const booked = await fetchExistingBookings(dateISO, category);
      setAvailableTimes(all.filter((t) => !booked.includes(t)));
    }
    loadSlots();
  }, [selectedDate, category]);

  useEffect(() => {
    if (selectedDate && timeSlotRef.current) {
      setTimeout(() => {
        timeSlotRef.current!.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [selectedDate]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // calendar helpers
  const firstOfMonth = new Date(displayYear, displayMonth, 1);
  const firstColumnIndex = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

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
  const isCurrentMonth =
    displayYear === today.getFullYear() &&
    displayMonth === today.getMonth();

  const footerText =
    selectedDate &&
    selectedDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });

  const handleDayClick = (d: number) => {
    setSelectedDate(new Date(displayYear, displayMonth, d));
    setChosenTime(null);
  };
  const handleTimeClick = (t: string) => {
    setChosenTime(t);
    setView('form');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!patientName.trim()) newErrors.name = 'Required - please enter your full name';
    if (!patientPhone.trim()) newErrors.phone = 'Required - please enter your phone';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const dateISO = selectedDate!.toISOString().split('T')[0];
    const stripped = service.title.replace(/ treatment$/i, '');
    const { error } = await supabase.from('bookings').insert([
      {
        date: dateISO,
        start_time: chosenTime,
        cat: category,
        service: stripped,
        patientName,
        telNumber: patientPhone,
        email: patientEmail,
      },
    ]);
    if (error) {
      alert('Error saving booking: ' + error.message);
    } else {
      alert('Booking confirmed!');
      navigate('/');
    }
  };

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <div className="container py-3">
          {view === 'calendar' && (
            <>
              <button
                className="round-back"
                onClick={() => navigate(-1)}
              >
                ←
              </button>

              <div className="service-header">
                <h2 className="booking-title">{service.title}</h2>
                <p className="booking-subtitle">
                  Book your Appointment now!
                </p>
                <div className="service-info-row">
                  <div className="info-item">
                    <i className="bi bi-clock"></i>
                    <span>
                      {category === 'Private'
                        ? '20m'
                        : '10m'}
                    </span>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-geo-alt"></i>
                    <span>{service.address}</span>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-wallet2"></i>
                    <span>{service.price}</span>
                  </div>
                </div>
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
                  <button
                    className="btn header-arrow"
                    onClick={handleNext}
                  >
                    ›
                  </button>
                </div>

                {/* header days */}
                {/* after */}
<div className="calendar-grid mb-2">
  {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d) => (
    <div key={d} className="col-1 px-0">
      <button className="day-btn header-day" disabled>
        {d}
      </button>
    </div>
  ))}
</div>


                <div className="calendar-grid">
                  {Array.from({ length: firstColumnIndex }).map(
                    (_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="col-1 px-0"
                      />
                    )
                  )}
                  {Array.from(
                    { length: daysInMonth },
                    (_, i) => i + 1
                  ).map((day) => {
                    const dObj = new Date(
                      displayYear,
                      displayMonth,
                      day
                    );
                    const isToday =
                      dObj.toDateString() === today.toDateString();
                    const isSelected =
                      selectedDate &&
                      dObj.toDateString() ===
                        selectedDate.toDateString();
                    const inPast =
                      dObj <
                      new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                      );
                    let cls = '';
                    if (isSelected) cls = 'selected-day';
                    else if (isToday) cls = 'today-day';

                    return (
                      <div
                        key={day}
                        className="col-1 px-0"
                      >
                        <button
                          disabled={inPast}
                          className={`btn day-btn ${
                            inPast ? 'past-day' : cls
                          }`}
                          onClick={() =>
                            !inPast && handleDayClick(day)
                          }
                        >
                          {day}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr />

              {selectedDate ? (
                <div className="times-container">
                  <div
                    className="selected-date-label"
                    ref={timeSlotRef}
                  >
                    {footerText}
                  </div>
                  <div className="row gx-0 time-row">
                    {availableTimes.length ? (
                      availableTimes.map((t) => (
                        <div
                          key={t}
                          className="col-12 px-0 mb-2"
                        >
                          <button
                            className={`btn time-slot-btn ${
                              chosenTime === t
                                ? 'selected-time'
                                : ''
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
                <span className="form-title">
                  {service.title}
                </span>
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
                  {selectedDate.toLocaleDateString(
                    'en-GB',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                </div>
                <div className="detail-row">
                  <strong>Time:</strong> {chosenTime}
                </div>
              </div>

              <form
                className="booking-form"
                onSubmit={handleBookingSubmit}
                noValidate
              >
                <label
                  htmlFor="patientName"
                  className="form-label"
                >
                  Name
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="patientName"
                  className={`form-control ${
                    errors.name ? 'input-error' : ''
                  }`}
                  value={patientName}
                  onChange={(e) =>
                    setPatientName(e.target.value)
                  }
                />
                {errors.name && (
                  <div className="error-message">
                    {errors.name}
                  </div>
                )}

                <label
                  htmlFor="patientPhone"
                  className="form-label"
                >
                  Phone
                  <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="patientPhone"
                  className={`form-control ${
                    errors.phone ? 'input-error' : ''
                  }`}
                  value={patientPhone}
                  onChange={(e) =>
                    setPatientPhone(e.target.value)
                  }
                />
                {errors.phone && (
                  <div className="error-message">
                    {errors.phone}
                  </div>
                )}

                <label
                  htmlFor="patientEmail"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="patientEmail"
                  className="form-control"
                  value={patientEmail}
                  onChange={(e) =>
                    setPatientEmail(e.target.value)
                  }
                />

                <button
                  type="submit"
                  className="submit-btn"
                >
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

// import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Header from '../Header';
// import './BookingPage.css';
// import supabase from '../../supabase';

// interface Service {
//   id: number;
//   title: string;
//   duration: string;
//   address: string;
//   price: string;
// }

// const sampleServices: Record<number, Service> = {
//   1: {
//     id: 1,
//     title: 'Altitude sickness',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   2: {
//     id: 2,
//     title: 'Sore throat treatment',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   3: {
//     id: 3,
//     title: 'Travel Consultation',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'varies',
//   },
//   4: {
//     id: 4,
//     title: 'Travel vaccine',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'varies',
//   },
//   5: {
//     id: 5,
//     title: 'Uncomplicated UTI (Women) treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   6: {
//     id: 6,
//     title: 'Vitamin B12 Injection',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   7: {
//     id: 7,
//     title: 'Hair loss',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   8: {
//     id: 8,
//     title: 'Impetigo treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   9: {
//     id: 9,
//     title: 'Infected insect bite treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   10: {
//     id: 10,
//     title: 'Period delay',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   11: {
//     id: 11,
//     title: 'Private flu jab',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£20.00',
//   },
//   12: {
//     id: 12,
//     title: 'Shingles treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   13: {
//     id: 13,
//     title: 'Weight Loss',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Starts at £120.00',
//   },
//   14: {
//     id: 14,
//     title: 'Oral Contraception',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   15: {
//     id: 15,
//     title: 'Flu Vaccination',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   16: {
//     id: 16,
//     title: 'Blood pressure check',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   17: {
//     id: 17,
//     title: 'COVID-19 Vaccination',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   18: {
//     id: 18,
//     title: 'Chickenpox vaccine',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£80.00',
//   },
//   19: {
//     id: 19,
//     title: 'Ear wax removal',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Our service is £40 for one ear and £50 for two ears. £10 consult fee if no wax removed.',
//   },
//   20: {
//     id: 20,
//     title: 'Earache treatment',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   21: {
//     id: 21,
//     title: 'Erectile dysfunction',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£20.00',
//   },
//   22: {
//     id: 22,
//     title: 'Sinusitis treatment',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Free NHS',
//   },
//   23: {
//     id: 23,
//     title: 'Diphtheria, tetanus and polio (1 dose)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£40',
//   },
//   24: {
//     id: 24,
//     title: 'Hepatitis A (2 doses - day 0 & 6-12months)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£60 per dose',
//   },
//   25: {
//     id: 25,
//     title: 'Hepatitis B (3 doses)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£60 per dose',
//   },
//   26: {
//     id: 26,
//     title: 'Typhoid (1 dose or orally)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£40',
//   },
//   27: {
//     id: 27,
//     title: 'Rabies (3 doses)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£90 per dose',
//   },
//   28: {
//     id: 28,
//     title: 'Meningitis (1 dose - for hajj or umrah)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£60',
//   },
//   29: {
//     id: 29,
//     title: 'Cholera (2 doses - special cases)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£90',
//   },
//   30: {
//     id: 30,
//     title: 'Japanese Encephalitis',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£100 per dose',
//   },
//   31: {
//     id: 31,
//     title: 'Chicken pox',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£80',
//   },
//   32: {
//     id: 32,
//     title: 'Meningitis B',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£140',
//   },
//   33: {
//     id: 33,
//     title: 'Shingles (Zostavax)',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£200',
//   },
//   34: {
//     id: 34,
//     title: 'Anti-malarials',
//     duration: '10m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: 'Prices vary',
//   },
// };

// type Category = 'NHS' | 'Private';

// function serviceCategory(serviceId: number): Category {
//   const nhsIDs = new Set<number>([
//     2,  // Sore throat
//     5,  // Uncomplicated UTI (Women)
//     8,  // Impetigo
//     9,  // Infected insect bite
//     12, // Shingles
//     16, // Blood pressure check
//     14, // Oral Contraception
//     15, // Flu vaccination
//     17, // COVID-19 Vaccination
//     20, // Earache
//     22, // Sinusitis
//   ]);
//   return nhsIDs.has(serviceId) ? 'NHS' : 'Private';
// }

// function generateTimeSlots(
//   startHour: number,
//   startMin: number,
//   endHour: number,
//   endMin: number
// ): string[] {
//   const slots: string[] = [];
//   let current = new Date();
//   current.setHours(startHour, startMin, 0, 0);
//   const end = new Date();
//   end.setHours(endHour, endMin, 0, 0);

//   while (current <= end) {
//     const hh = current.getHours().toString().padStart(2, '0');
//     const mm = current.getMinutes().toString().padStart(2, '0');
//     slots.push(`${hh}:${mm}`);
//     current = new Date(current.getTime() + 20 * 60000);
//   }
//   return slots;
// }

// function slotsForDayAndCategory(dayIndex: number, category: Category): string[] {
//   if (category === 'NHS') {
//     switch (dayIndex) {
//       case 1: // Mon
//       case 2: // Tue
//       case 3: // Wed
//       case 4: // Thu
//         return generateTimeSlots(9, 30, 17, 10);
//       case 5: // Fri
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 30, 17, 10),
//         ];
//       default:
//         return []; // Sat/Sun: none
//     }
//   } else {
//     switch (dayIndex) {
//       case 1: // Mon
//       case 2: // Tue
//       case 3: // Wed
//         return generateTimeSlots(9, 30, 17, 10);
//       case 4: // Thu: none
//         return [];
//       case 5: // Fri
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 0, 17, 10),
//         ];
//       default:
//         return []; // Sat/Sun: none
//     }
//   }
// }

// async function fetchExistingBookings(
//   dateISO: string,
//   category: Category
// ): Promise<string[]> {
//   const { data, error } = await supabase
//     .from('bookings')
//     .select('start_time')
//     .eq('date', dateISO)
//     .eq('cat', category);

//   if (error) {
//     console.error('Supabase fetch error:', error.message);
//     return [];
//   }
//   return (data as { start_time: string }[]).map((row) => row.start_time);
// }

// const BookingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const numericId = parseInt(id || '0', 10);
//   const service: Service = sampleServices[numericId] || sampleServices[1];
//   const category = serviceCategory(numericId);

//   // View toggles between "calendar" and "form"
//   const [view, setView] = useState<'calendar' | 'form'>('calendar');

//   // Calendar state
//   const today = new Date();
//   const [displayYear, setDisplayYear] = useState(today.getFullYear());
//   const [displayMonth, setDisplayMonth] = useState(today.getMonth());
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   // Chosen time slot
//   const [chosenTime, setChosenTime] = useState<string | null>(null);

//   // Available times for the chosen date
//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);

//   // Booking form fields
//   const [patientName, setPatientName] = useState('');
//   const [patientPhone, setPatientPhone] = useState('');
//   const [patientEmail, setPatientEmail] = useState('');

//   // A ref to the “selected-date-label” container, so we can scroll it into view
//   const timeSlotRef = useRef<HTMLDivElement | null>(null);

//   // Whenever “selectedDate” or “category” changes, reload time slots:
//   useEffect(() => {
//     async function loadSlots() {
//       if (!selectedDate) {
//         setAvailableTimes([]);
//         return;
//       }
//       const dow = selectedDate.getDay(); // 0=Sun…6=Sat
//       const allSlots = slotsForDayAndCategory(dow, category);
//       const dateISO = selectedDate.toISOString().split('T')[0];
//       const booked = await fetchExistingBookings(dateISO, category);
//       const freeSlots = allSlots.filter((t) => !booked.includes(t));
//       setAvailableTimes(freeSlots);
//     }
//     loadSlots();
//   }, [selectedDate, category]);

//   // Scroll the “selected-date-label” into view whenever a date is clicked
//   useEffect(() => {
//     if (selectedDate && timeSlotRef.current) {
//       // Delay slightly to ensure the slots have rendered, then scroll:
//       setTimeout(() => {
//         timeSlotRef.current?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start',
//         });
//       }, 100);
//     }
//   }, [selectedDate]);

//   // Calendar helpers
//   const firstOfMonth = new Date(displayYear, displayMonth, 1);
//   const jsWeekday = firstOfMonth.getDay(); // 0=Sun…6=Sat
//   const firstColumnIndex = (jsWeekday + 6) % 7; // shift so Mon=0…Sun=6
//   const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

//   // Navigate to previous month (unless already at current month)
//   const handlePrevMonth = () => {
//     if (
//       displayYear > today.getFullYear() ||
//       (displayYear === today.getFullYear() && displayMonth > today.getMonth())
//     ) {
//       const prev = new Date(displayYear, displayMonth - 1, 1);
//       setDisplayYear(prev.getFullYear());
//       setDisplayMonth(prev.getMonth());
//       setSelectedDate(null);
//       setChosenTime(null);
//     }
//   };
//   // Navigate to next month
//   const handleNextMonth = () => {
//     const next = new Date(displayYear, displayMonth + 1, 1);
//     setDisplayYear(next.getFullYear());
//     setDisplayMonth(next.getMonth());
//     setSelectedDate(null);
//     setChosenTime(null);
//   };

//   const isShowingCurrentMonth =
//     displayYear === today.getFullYear() && displayMonth === today.getMonth();

//   // When a calendar “day” is clicked:
//   const handleDayClick = (day: number) => {
//     const dt = new Date(displayYear, displayMonth, day);
//     setSelectedDate(dt);
//     setChosenTime(null);
//   };

//   // When a time‐slot is clicked, switch to form view
//   const handleTimeClick = (time: string) => {
//     setChosenTime(time);
//     setView('form');
//   };

//   // Submit booking to Supabase
//   const handleBookingSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDate || !chosenTime) return;

//     const dateISO = selectedDate.toISOString().split('T')[0];
//     const rawTitle = service.title;
//     const strippedTitle = rawTitle.replace(/ treatment$/i, '');

//     const { error } = await supabase.from('bookings').insert([
//       {
//         date: dateISO,
//         start_time: chosenTime,
//         cat: category,
//         service: strippedTitle,
//         patientName,
//         telNumber: patientPhone,
//         email: patientEmail,
//       },
//     ]);
//     if (error) {
//       alert('Error saving booking: ' + error.message);
//     } else {
//       alert('Booking confirmed!');
//       navigate('/');
//     }
//   };

//   // Format “Monday 2 Jun” style footer
//   const footerText =
//     selectedDate &&
//     selectedDate.toLocaleDateString('en-GB', {
//       weekday: 'long',
//       day: 'numeric',
//       month: 'short',
//     });

//     useLayoutEffect(() => {
//       // force scroll to absolute top before paint
//       window.scrollTo(0, 0);
//     }, []);
    

//   return (
//     <>
//       <Header />

//       <div className="page-wrapper">
//         <div className="container py-3">
//           {view === 'calendar' && (
//             <>
//               {/* Rounded back button at far left */}
//               <button
//                 className="round-back"
//                 onClick={() => navigate(-1)}
//               >
//                 ←
//               </button>

//               {/* SERVICE HEADER */}
//               <div className="service-header">
//                 <h2 className="booking-title">
//                   {service.title} Appointment
//                 </h2>
//                 <div className="service-info-row">
//                   <div className="info-item">
//                     <i className="bi bi-clock"></i>
//                     <span>{service.duration}</span>
//                   </div>
//                   <div className="info-item">
//                     <i className="bi bi-geo-alt"></i>
//                     <span>{service.address}</span>
//                   </div>
//                   <div className="info-item">
//                     <i className="bi bi-wallet2"></i>
//                     <span>{service.price}</span>
//                   </div>
//                 </div>
//                 <hr />
//               </div>

//               {/* CALENDAR (with extra left/right padding) */}
//               <div className="calendar-container">
//                 {/* BOXED HEADER */}
//                 <div className="calendar-header-box">
//                   <button
//                     className="btn header-arrow"
//                     onClick={handlePrevMonth}
//                     disabled={isShowingCurrentMonth}
//                   >
//                     ‹
//                   </button>
//                   <span className="header-month">
//                     {new Date(displayYear, displayMonth).toLocaleDateString(
//                       'en-GB',
//                       { month: 'long', year: 'numeric' }
//                     )}
//                   </span>
//                   <button
//                     className="btn header-arrow"
//                     onClick={handleNextMonth}
//                   >
//                     ›
//                   </button>
//                 </div>

//                 {/* WEEKDAY ROW (each .col-1 px-0 lines up) */}
//                 <div className="row text-center weekday-row">
//                   {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((wd) => (
//                     <div key={wd} className="col-1 px-0">
//                       {wd}
//                     </div>
//                   ))}
//                 </div>

//                 {/* CALENDAR GRID */}
//                 <div className="row calendar-grid">
//                   {/* blank placeholders */}
//                   {Array.from({ length: firstColumnIndex }).map((_, idx) => (
//                     <div key={`empty-${idx}`} className="col-1 px-0"></div>
//                   ))}

//                   {/* each day */}
//                   {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
//                     const thisDate = new Date(
//                       displayYear,
//                       displayMonth,
//                       day
//                     );
//                     const isToday =
//                       thisDate.toDateString() === today.toDateString();
//                     const isSelected =
//                       selectedDate &&
//                       thisDate.toDateString() ===
//                         selectedDate.toDateString();
//                     const dateInPast = thisDate < new Date(
//                       today.getFullYear(),
//                       today.getMonth(),
//                       today.getDate()
//                     );

//                     // Decide which CSS class to apply:
//                     let dayClass = '';
//                     if (isSelected) {
//                       dayClass = 'selected-day';
//                     } else if (isToday) {
//                       dayClass = 'today-day';
//                     }

//                     return (
//                       <div key={day} className="col-1 px-0">
//                         <button
//                           onClick={() => !dateInPast && handleDayClick(day)}
//                           className={`btn day-btn ${
//                             dateInPast ? 'past-day' : dayClass
//                           }`}
//                           disabled={dateInPast}
//                         >
//                           {day}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <hr />

//               {/* TIME SLOTS */}
//               {selectedDate ? (
//                 <div className="times-container">
//                   {/* Attach ref here so we can scroll this label into view */}
//                   <div
//                     className="selected-date-label"
//                     ref={timeSlotRef}
//                   >
//                     {footerText}
//                   </div>
//                   <div className="row gx-0 time-row">
//                     {availableTimes.length > 0 ? (
//                       availableTimes.map((t) => {
//                         const isChosen = chosenTime === t;
//                         return (
//                           <div key={t} className="col-12 px-0 mb-2">
//                             <button
//                               className={`btn time-slot-btn ${
//                                 isChosen ? 'selected-time' : ''
//                               }`}
//                               onClick={() => handleTimeClick(t)}
//                             >
//                               {t}
//                             </button>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <p className="select-date-text">
//                         No available slots for this date.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="select-date-text">
//                   Select a date to see available times
//                 </p>
//               )}
//             </>
//           )}

//           {/* FULL‐PAGE “Confirm Your Booking” FORM */}
//           {view === 'form' && selectedDate && chosenTime && (
//             <div className="form-fullpage">
//               <div className="form-header">
//                 <button
//                   className="back-btn"
//                   onClick={() => {
//                     setView('calendar');
//                     setChosenTime(null);
//                   }}
//                 >
//                   ←
//                 </button>
//                 <span className="form-title">
//                   {service.title} Appointment
//                 </span>
//               </div>

//               <div className="booking-details">
//                 <div className="detail-row">
//                   <strong>Category:</strong> {category}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Treatment:</strong> {service.title}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Provider:</strong> Coleshill Pharmacy
//                 </div>
//                 <div className="detail-row">
//                   <strong>Date:</strong>{' '}
//                   {selectedDate.toLocaleDateString('en-GB', {
//                     weekday: 'long',
//                     day: 'numeric',
//                     month: 'short',
//                     year: 'numeric',
//                   })}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Time:</strong> {chosenTime}
//                 </div>
//               </div>

//               <form className="booking-form" onSubmit={handleBookingSubmit}>
//                 <label htmlFor="patientName" className="form-label">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="patientName"
//                   className="form-control"
//                   value={patientName}
//                   onChange={(e) => setPatientName(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="patientPhone" className="form-label">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   id="patientPhone"
//                   className="form-control"
//                   value={patientPhone}
//                   onChange={(e) => setPatientPhone(e.target.value)}
//                   required
//                 />

//                 <label htmlFor="patientEmail" className="form-label">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="patientEmail"
//                   className="form-control"
//                   value={patientEmail}
//                   onChange={(e) => setPatientEmail(e.target.value)}
//                   required
//                 />

//                 <button type="submit" className="submit-btn">
//                   Confirm Booking
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BookingPage;


// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../Header";
// import "./BookingPage.css";
// import supabase from "../../supabase";

// interface Service {
//   id: number;
//   title: string;
//   duration: string;
//   address: string;
//   price: string;
// }

// const sampleServices: Record<number, Service> = {
//   1: {
//     id: 1,
//     title: "Altitude sickness",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   2: {
//     id: 2,
//     title: "Sore throat treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   3: {
//     id: 3,
//     title: "Travel Consultation",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   4: {
//     id: 4,
//     title: "Travel vaccine",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   5: {
//     id: 5,
//     title: "Uncomplicated UTI (Women) treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   6: {
//     id: 6,
//     title: "Vitamin B12 Injection",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   7: {
//     id: 7,
//     title: "Hair loss",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   8: {
//     id: 8,
//     title: "Impetigo treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   9: {
//     id: 9,
//     title: "Infected insect bite treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   10: {
//     id: 10,
//     title: "Period delay",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   11: {
//     id: 11,
//     title: "Private flu jab",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   12: {
//     id: 12,
//     title: "Shingles treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   13: {
//     id: 13,
//     title: "Weight loss clinic",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   14: {
//     id: 14,
//     title: "Oral Contraception",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   15: {
//     id: 15,
//     title: "Flu vaccination",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   16: {
//     id: 16,
//     title: "Blood pressure check",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   17: {
//     id: 17,
//     title: "COVID-19 Vaccination",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   18: {
//     id: 18,
//     title: "Chickenpox vaccine",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   19: {
//     id: 19,
//     title: "Ear wax removal",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   20: {
//     id: 20,
//     title: "Earache treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
//   21: {
//     id: 21,
//     title: "Erectile dysfunction",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "£10.00",
//   },
//   22: {
//     id: 22,
//     title: "Sinusitis treatment",
//     duration: "20m",
//     address: "114–116 High St, Coleshill, Birmingham B46 3BJ",
//     price: "Free NHS",
//   },
// };

// type Category = "NHS" | "Private";

// function serviceCategory(serviceId: number): Category {
//   const nhsIDs = new Set<number>([
//     2, 5, 8, 9, 12, 16, 14, 15, 17, 20, 22,
//   ]);
//   return nhsIDs.has(serviceId) ? "NHS" : "Private";
// }

// function generateTimeSlots(
//   startHour: number,
//   startMin: number,
//   endHour: number,
//   endMin: number
// ): string[] {
//   const slots: string[] = [];
//   let current = new Date();
//   current.setHours(startHour, startMin, 0, 0);
//   const end = new Date();
//   end.setHours(endHour, endMin, 0, 0);

//   while (current <= end) {
//     const hh = current.getHours().toString().padStart(2, "0");
//     const mm = current.getMinutes().toString().padStart(2, "0");
//     slots.push(`${hh}:${mm}`);
//     current = new Date(current.getTime() + 20 * 60 * 1000);
//   }
//   return slots;
// }

// function slotsForDayAndCategory(
//   dayIndex: number,
//   category: Category
// ): string[] {
//   if (category === "NHS") {
//     switch (dayIndex) {
//       case 1:
//       case 2:
//       case 3:
//       case 4:
//         return generateTimeSlots(9, 30, 17, 10);
//       case 5:
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 30, 17, 10),
//         ];
//       default:
//         return [];
//     }
//   } else {
//     switch (dayIndex) {
//       case 1:
//       case 2:
//       case 3:
//         return generateTimeSlots(9, 30, 17, 10);
//       case 4:
//         return [];
//       case 5:
//         return [
//           ...generateTimeSlots(9, 30, 12, 10),
//           ...generateTimeSlots(15, 0, 17, 10),
//         ];
//       default:
//         return [];
//     }
//   }
// }

// async function fetchExistingBookings(
//   dateISO: string,
//   category: Category
// ): Promise<string[]> {
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("start_time")
//     .eq("date", dateISO)
//     .eq("cat", category);

//   if (error) {
//     console.error("Supabase fetch error:", error.message);
//     return [];
//   }
//   return (data as { start_time: string }[]).map((row) => row.start_time);
// }

// const BookingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const numericId = parseInt(id || "0", 10);
//   const service = sampleServices[numericId] || sampleServices[1];
//   const category = serviceCategory(numericId);

//   // "calendar" shows calendar & time‐slots; "form" shows the full‐page booking form.
//   const [view, setView] = useState<"calendar" | "form">("calendar");

//   const today = new Date();
//   const [displayYear, setDisplayYear] = useState(today.getFullYear());
//   const [displayMonth, setDisplayMonth] = useState(today.getMonth());
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   const [chosenTime, setChosenTime] = useState<string | null>(null);
//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);

//   // Form fields:
//   const [patientName, setPatientName] = useState("");
//   const [patientPhone, setPatientPhone] = useState("");
//   const [patientEmail, setPatientEmail] = useState("");

//   // Whenever selectedDate or category changes → reload free slots:
//   useEffect(() => {
//     async function loadSlots() {
//       if (!selectedDate) {
//         setAvailableTimes([]);
//         return;
//       }
//       const dow = selectedDate.getDay(); // 0=Sun…6=Sat
//       const allSlots = slotsForDayAndCategory(dow, category);
//       const dateISO = selectedDate.toISOString().split("T")[0];
//       const bookedTimes = await fetchExistingBookings(dateISO, category);
//       const freeSlots = allSlots.filter((t) => !bookedTimes.includes(t));
//       setAvailableTimes(freeSlots);
//     }
//     loadSlots();
//   }, [selectedDate, category]);

//   // Calendar helpers:
//   const firstOfMonth = new Date(displayYear, displayMonth, 1);
//   const jsWeekday = firstOfMonth.getDay(); // 0=Sun…6=Sat
//   const firstColumnIndex = (jsWeekday + 6) % 7; // shift Mon=0…Sun=6
//   const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

//   // Navigate months:
//   const handlePrevMonth = () => {
//     if (
//       displayYear > today.getFullYear() ||
//       (displayYear === today.getFullYear() && displayMonth > today.getMonth())
//     ) {
//       const prev = new Date(displayYear, displayMonth - 1, 1);
//       setDisplayYear(prev.getFullYear());
//       setDisplayMonth(prev.getMonth());
//       setSelectedDate(null);
//       setChosenTime(null);
//     }
//   };
//   const handleNextMonth = () => {
//     const next = new Date(displayYear, displayMonth + 1, 1);
//     setDisplayYear(next.getFullYear());
//     setDisplayMonth(next.getMonth());
//     setSelectedDate(null);
//     setChosenTime(null);
//   };
//   const isShowingCurrentMonth =
//     displayYear === today.getFullYear() && displayMonth === today.getMonth();

//   const handleDayClick = (day: number) => {
//     const dt = new Date(displayYear, displayMonth, day);
//     setSelectedDate(dt);
//     setChosenTime(null);
//   };
//   const handleTimeClick = (time: string) => {
//     setChosenTime(time);
//     setView("form");
//   };

//   // Submit booking
//   const handleBookingSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDate || !chosenTime) return;
//     const dateISO = selectedDate.toISOString().split("T")[0];
//     const rawTitle = service.title;
//     const strippedTitle = rawTitle.replace(/ treatment$/i, "");

//     const { error } = await supabase.from("bookings").insert([
//       {
//         date: dateISO,
//         start_time: chosenTime,
//         cat: category,
//         service: strippedTitle,
//         patientName: patientName,
//         telNumber: patientPhone,
//         email: patientEmail,
//       },
//     ]);

//     if (error) {
//       alert("Error saving booking: " + error.message);
//     } else {
//       alert("Booking confirmed!");
//       navigate(`/book/${numericId}`); // Stay on the same /book/:id page
//       // or navigate("/") if you prefer returning to home
//     }
//   };

//   // Format selectedDate:
//   const footerText =
//     selectedDate &&
//     selectedDate.toLocaleDateString("en-GB", {
//       weekday: "long",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   return (
//     <>
//       <Header />

//       <div className="page-wrapper">
//         <div className="container py-3">
//           {/**—————— CALENDAR & TIME‐SLOTS VIEW ——————*/}
//           {view === "calendar" && (
//             <>
//               {/* Back arrow simply goes “back” in history: */}
//               <button
//                 className="btn btn-light btn-sm mb-3"
//                 onClick={() => navigate(-1)}
//               >
//                 ←
//               </button>

//               {/* Service header */}
//               <h2 className="booking-title">{service.title} Appointment</h2>
//               <div className="service-info-row">
//                 <div className="info-item">
//                   <i className="bi bi-clock"></i>
//                   <span>{service.duration}</span>
//                 </div>
//                 <div className="info-item">
//                   <i className="bi bi-geo-alt"></i>
//                   <span>{service.address}</span>
//                 </div>
//                 <div className="info-item">
//                   <i className="bi bi-wallet2"></i>
//                   <span>{service.price}</span>
//                 </div>
//               </div>

//               <hr />

//               {/* Month header */}
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <button
//                   className="btn nav-btn"
//                   onClick={handlePrevMonth}
//                   disabled={isShowingCurrentMonth}
//                 >
//                   ‹
//                 </button>
//                 <h5 className="mb-0 calendar-month">
//                   {new Date(displayYear, displayMonth).toLocaleDateString(
//                     "en-GB",
//                     {
//                       month: "long",
//                       year: "numeric",
//                     }
//                   )}
//                 </h5>
//                 <button className="btn nav-btn" onClick={handleNextMonth}>
//                   ›
//                 </button>
//               </div>

//               {/* Weekday labels */}
//               <div className="row text-center text-muted small weekday-row">
//                 {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((wd) => (
//                   <div key={wd} className="col-1 px-0">
//                     {wd}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar grid */}
//               <div className="row g-2 calendar-grid mb-4">
//                 {Array.from({ length: firstColumnIndex }).map((_, idx) => (
//                   <div key={`empty-${idx}`} className="col-1 px-0"></div>
//                 ))}

//                 {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
//                   (day) => {
//                     const thisDate = new Date(displayYear, displayMonth, day);
//                     const dateInPast =
//                       thisDate <
//                       new Date(today.getFullYear(), today.getMonth(), today.getDate());
//                     const isSelected =
//                       selectedDate &&
//                       thisDate.toDateString() === selectedDate.toDateString();

//                     return (
//                       <div key={day} className="col-1 px-0">
//                         <button
//                           onClick={() => !dateInPast && handleDayClick(day)}
//                           className={`btn day-btn ${
//                             dateInPast
//                               ? "past-day"
//                               : isSelected
//                               ? "selected-day"
//                               : ""
//                           }`}
//                           disabled={dateInPast}
//                         >
//                           {day}
//                         </button>
//                       </div>
//                     );
//                   }
//                 )}
//               </div>

//               <hr />

//               {/* Available times */}
//               {selectedDate ? (
//                 <div className="times-container">
//                   <h6 className="selected-date-label">{footerText}</h6>
//                   <div className="row gx-2 time-row">
//                     {availableTimes.length > 0 ? (
//                       availableTimes.map((t) => (
//                         <div key={t} className="col-12 mb-2">
//                           <button
//                             className="btn time-slot-btn"
//                             onClick={() => handleTimeClick(t)}
//                           >
//                             {t}
//                           </button>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-muted">No available slots for this date.</p>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-muted select-date-text">
//                   Select a date to see times
//                 </p>
//               )}
//             </>
//           )}

//           {/**—————— FULL‐PAGE “CONFIRM YOUR BOOKING” FORM ——————*/}
//           {view === "form" && selectedDate && chosenTime && (
//             <div className="form-fullpage">
//               <div className="form-header">
//                 <button
//                   className="btn back-btn"
//                   onClick={() => {
//                     setView("calendar");
//                     setChosenTime(null);
//                   }}
//                 >
//                   ←
//                 </button>
//                 <h5 className="form-title">Confirm Your Booking</h5>
//               </div>

//               <div className="booking-details">
//                 <div className="detail-row">
//                   <strong>Category:</strong> {category}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Treatment:</strong> {service.title}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Provider:</strong> Coleshill Pharmacy
//                 </div>
//                 <div className="detail-row">
//                   <strong>Date:</strong>{" "}
//                   {selectedDate.toLocaleDateString("en-GB", {
//                     weekday: "long",
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </div>
//                 <div className="detail-row">
//                   <strong>Time:</strong> {chosenTime}
//                 </div>
//               </div>

//               <form className="booking-form" onSubmit={handleBookingSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="patientName" className="form-label">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="patientName"
//                     className="form-control"
//                     value={patientName}
//                     onChange={(e) => setPatientName(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="patientPhone" className="form-label">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     id="patientPhone"
//                     className="form-control"
//                     value={patientPhone}
//                     onChange={(e) => setPatientPhone(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="patientEmail" className="form-label">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="patientEmail"
//                     className="form-control"
//                     value={patientEmail}
//                     onChange={(e) => setPatientEmail(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary submit-btn">
//                   Confirm Booking
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BookingPage;

// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Header from '../Header';
// // import './BookingPage.css';

// interface Service {
//   id: number;
//   title: string;
//   duration: string;
//   address: string;
//   price: string;
// }

// // Reuse the Coleshill address + a sample price for every service
// const sampleServices: Record<number, Service> = {
//   1: {
//     id: 1,
//     title: 'Altitude sickness',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   2: {
//     id: 2,
//     title: 'Sore throat treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   3: {
//     id: 3,
//     title: 'Travel Consultation',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   4: {
//     id: 4,
//     title: 'Travel vaccine',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   5: {
//     id: 5,
//     title: 'Uncomplicated UTI (Women) treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   6: {
//     id: 6,
//     title: 'Vitamin B12 Injection',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   7: {
//     id: 7,
//     title: 'Hair loss',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   8: {
//     id: 8,
//     title: 'Impetigo treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   9: {
//     id: 9,
//     title: 'Infected insect bite treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   10: {
//     id: 10,
//     title: 'Period delay',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   11: {
//     id: 11,
//     title: 'Private flu jab',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   12: {
//     id: 12,
//     title: 'Shingles treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   13: {
//     id: 13,
//     title: 'Weight loss clinic',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   14: {
//     id: 14,
//     title: 'Oral Contraception',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   15: {
//     id: 15,
//     title: 'Flu vaccination',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   16: {
//     id: 16,
//     title: 'Blood pressure check',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   17: {
//     id: 17,
//     title: 'COVID-19 Vaccination',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   18: {
//     id: 18,
//     title: 'Chickenpox vaccine',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   19: {
//     id: 19,
//     title: 'Ear wax removal',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   20: {
//     id: 20,
//     title: 'Earache treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   21: {
//     id: 21,
//     title: 'Erectile dysfunction',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
//   22: {
//     id: 22,
//     title: 'Sinusitis treatment',
//     duration: '20m',
//     address: '114–116 High St, Coleshill, Birmingham B46 3BJ',
//     price: '£10.00',
//   },
// };

// const BookingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const numericId = parseInt(id || '0', 10);
//   const service = sampleServices[numericId] || sampleServices[1];

//   // Initialize calendar to today's date
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState<Date>(today);

//   const year = selectedDate.getFullYear();
//   const monthIndex = selectedDate.getMonth();
//   const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

//   // Compute which weekday the 1st of the month falls on (Monday = 0 … Sunday = 6)
//   const firstOfMonth = new Date(year, monthIndex, 1);
//   const jsWeekday = firstOfMonth.getDay(); // Sunday=0, Monday=1, … Saturday=6
//   const firstColumnIndex = (jsWeekday + 6) % 7;

//   const handleClickDay = (dayNum: number) => {
//     setSelectedDate(new Date(year, monthIndex, dayNum));
//   };

//   const footerText = selectedDate.toLocaleDateString('en-GB', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'short',
//   });

//   return (
//     <>
//       <Header />

//       <div className="page-wrapper">
//         <div className="container py-3">
//           {/* Back button */}
//           <button
//             className="btn btn-light btn-sm mb-3"
//             onClick={() => navigate(-1)}
//           >
//             ←
//           </button>

//           {/* Service Title */}
//           <h2 className="fw-bold mb-3">{service.title} Appointment</h2>

//           {/* Icons row: duration, address, price */}
//           <div className="row text-secondary mb-4">
//             <div className="col-auto d-flex align-items-center mb-2 mb-md-0">
//               <i className="bi bi-clock me-2"></i>
//               <span>{service.duration}</span>
//             </div>
//             <div className="col-auto d-flex align-items-center mb-2 mb-md-0">
//               <i className="bi bi-geo-alt me-2"></i>
//               <span>{service.address}</span>
//             </div>
//             <div className="col-auto d-flex align-items-center">
//               <i className="bi bi-wallet2 me-2"></i>
//               <span>{service.price}</span>
//             </div>
//           </div>

//           <hr />

//           {/* Calendar Header */}
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <button
//               className="btn btn-outline-secondary btn-sm"
//               disabled
//             >
//               ‹
//             </button>
//             <h5 className="mb-0">
//               {selectedDate.toLocaleDateString('en-GB', {
//                 month: 'long',
//                 year: 'numeric',
//               })}
//             </h5>
//             <button
//               className="btn btn-outline-secondary btn-sm"
//               disabled
//             >
//               ›
//             </button>
//           </div>

//           {/* Weekday labels */}
//           <div className="row text-center text-muted small">
//             {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((wd) => (
//               <div key={wd} className="col-1 px-0">
//                 {wd}
//               </div>
//             ))}
//           </div>

//           {/* Calendar Grid */}
//           <div className="row g-2 justify-content-start">
//             {/* Blank placeholders until day “1” lines up on the right weekday */}
//             {Array.from({ length: firstColumnIndex }).map((_, idx) => (
//               <div key={`empty-${idx}`} className="col-1 px-0" />
//             ))}

//             {/* Render each day button */}
//             {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
//               const thisDate = new Date(year, monthIndex, day);
//               const isSelected =
//                 thisDate.toDateString() === selectedDate.toDateString();

//               return (
//                 <div key={day} className="col-1 px-0">
//                   <button
//                     onClick={() => handleClickDay(day)}
//                     className={`btn btn-sm w-100 ${
//                       isSelected
//                         ? 'btn-dark text-white'
//                         : 'btn-outline-secondary'
//                     }`}
//                   >
//                     {day}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>

//           <hr className="mt-4" />

//           {/* Footer: show selected date text */}
//           <div className="mt-3">
//             <h6>{footerText}</h6>
//             {/* You could add available time‐slot buttons below here */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BookingPage;
