
import React, { useState, useEffect, useMemo, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import supabase from "../../supabase";
import { DateRange, RangeKeyDict } from "react-date-range";
import { FaHome } from "react-icons/fa";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Order {
  id: number;
  createdAt: string;
  patientName: string;
  dateBirth?: string | null;
  telNumber: string;
  service: string;            // title stored in DB
  treatment: string;
  dosage: string;
  date: string;               // YYYY-MM-DD
  status: "Ordered" | "Accepted" | "Rejected";
}

interface Service {
  id: number;
  title: string;
  duration: string;
  address: string;
  price: string;
}




const sampleServices: Record<number, Service> = {
    1:  { id: 1,  title: 'Altitude sickness', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00' },
    2:  { id: 2,  title: 'Sore throat (Ages 5+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    3:  { id: 3,  title: 'Travel Consultation', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£10.00 – deducted if go ahead with treatment' },
    4:  { id: 4,  title: 'Travel vaccine', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies – depends on what vaccine(s) needed' },
    5:  { id: 5,  title: 'Uncomplicated UTI (Women aged 16–64)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    6:  { id: 6,  title: 'Vitamin B12 Injection', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£30.00' },
    7:  { id: 7,  title: 'Impetigo (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    8:  { id: 8,  title: 'Infected insect bite (Ages 1+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    9:  { id: 9,  title: 'Traveller’s Diarrhoea', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Azithromycin for £20' },
    10: { id: 10, title: 'Private flu jab', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£20.00' },
    12: { id: 12, title: 'Weight Loss Management', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on Treatment' },
    13: { id: 13, title: 'Oral Contraception', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    14: { id: 14, title: 'Flu Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    15: { id: 15, title: 'Blood Pressure Check', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    16: { id: 16, title: 'COVID-19 Vaccination', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    17: { id: 17, title: 'Yellow fever', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '—' },
    18: { id: 18, title: 'Ear wax removal', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£35 one ear / £55 both ears' },
    19: { id: 19, title: 'Earache (Ages 1–17)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    20: { id: 20, title: 'Erectile dysfunction', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Sildenafil/Tadalafil – 2 tabs £10, 4 tabs £15, 8 tabs £25' },
    21: { id: 21, title: 'Sinusitis (Ages 12+)', duration: '10m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Free NHS' },
    22: { id: 22, title: 'Acid Reflux', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'PPIs (omeprazole etc.) for £8' },
    23: { id: 23, title: 'Pain Relief', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Naproxen 500mg for £8' },
    24: { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Finasteride 1mg for £20' },
    25: { id: 25, title: 'Female Hirsutism in Women', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Vaniqa cream for £69.99' },
    26: { id: 26, title: 'Jet Lag', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Melatonin MR – 5 tabs £18.99 / 30 tabs £39.99' },
    28: { id: 28, title: 'Oral Thrush', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Varies depending on treatment' },
    30: { id: 30, title: 'Diphtheria, Tetanus and Polio', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00 - only 1 dose' },
    31: { id: 31, title: 'Hepatitis A (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
    32: { id: 32, title: 'Hepatitis B (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00 per dose' },
    33: { id: 33, title: 'Typhoid (1 dose or orally)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£40.00' },
    34: { id: 34, title: 'Rabies (3 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00 per dose' },
    35: { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£60.00' },
    36: { id: 36, title: 'Cholera (2 doses – special cases)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£90.00' },
    37: { id: 37, title: 'Japanese Encephalitis', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£100.00 per dose' },
    38: { id: 38, title: 'Chicken Pox', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£80.00' },
    39: { id: 39, title: 'Meningitis B', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£140.00' },
    40: { id: 40, title: 'Shingles vaccination (Zostavax)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: '£200.00' },
    41: { id: 41, title: 'Anti-malarials', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Malarone £40 / Doxycycline £25' },
    42: { id: 42, title: 'HPV', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Gardasil-9 – £184.50/dose, £362 (2 doses), £540 (3 doses)' },
    43: { id: 43, title: 'Dengue Fever (2 doses)', duration: '20m', address: '114–116 High St, Coleshill, Birmingham B46 3BJ', price: 'Qdenga - £130 per dose' },
  };
  
  const initialTreatmentOptions: Record<number, string[]> = {
    0: [],
    12: ["Mounjaro 2.5mg","Mounjaro 5mg","Mounjaro 7.5mg","Mounjaro 10mg","Mounjaro 12.5mg","Mounjaro 15mg",
         "Wegovy 0.25mg","Wegovy 0.5mg","Wegovy 1mg","Wegovy 1.7mg"],
    55: ["Mounjaro 2.5mg","Mounjaro 5mg","Mounjaro 7.5mg","Mounjaro 10mg","Mounjaro 12.5mg","Mounjaro 15mg"],
    66: ["Wegovy 0.25mg","Wegovy 0.5mg","Wegovy 1mg","Wegovy 1.7mg"],
// ... populate per service
};

export default function OrderPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reverse‐lookup IDs from titles, and treatment dropdowns
  const [selectedServices, setSelectedServices] = useState<Record<number, number>>({});
  const [selectedTreatments, setSelectedTreatments] = useState<Record<number, string>>({});
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

  const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  const [showCalendar, setShowCalendar] = useState(true);
  const [lastChanged, setLastChanged] = useState<"start"|"end"|null>(null);

  useEffect(() => {
    if (!session) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("orders").select("*");
        const orders = data as Order[];
        setAllOrders(orders);

        // initialize local dropdown+checkbox state
        const svcMap: Record<number, number> = {};
        const trtMap: Record<number, string> = {};
        const selMap: Record<number, boolean> = {};

        orders.forEach(o => {
          // find service ID by title
          const svcEntry = Object.values(sampleServices)
            .find(s => s.title === o.service);
          svcMap[o.id] = svcEntry?.id ?? 0;
          trtMap[o.id] = o.treatment;
          selMap[o.id] = false;
        });

        setSelectedServices(svcMap);
        setSelectedTreatments(trtMap);
        setSelectedRows(selMap);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  const filtered = useMemo(() => {
    const [s0,e0] = [range[0].startDate!, range[0].endDate!];
    return allOrders
      .filter(o => ["Ordered","Accepted","Rejected"].includes(o.status))
      .filter(o => {
        const d = new Date(o.date);
        if (!showCalendar) return d >= s0 && d <= e0;
        if (lastChanged === "start") return d >= s0;
        if (lastChanged === "end") return d <= e0;
        return true;
      });
  }, [allOrders, range, showCalendar, lastChanged]);

  const grouped = useMemo(() => 
    filtered.reduce<Record<string,Order[]>>((acc,o) => {
      (acc[o.date] ||= []).push(o);
      return acc;
    }, {}), [filtered]
  );

  const updateOrder = async (id: number, updates: Partial<Order>) => {
    await supabase.from("orders").update(updates).eq("id", id);
    setAllOrders(prev => prev.map(o => o.id===id ? {...o, ...updates} : o));
  };

  const anySelected = Object.values(selectedRows).some(v => v);

  const handleAcceptAll = () => {
    Object.entries(selectedRows)
      .filter(([_,sel]) => sel)
      .forEach(([id]) => {
        const o = allOrders.find(x => x.id===+id)!;
        const svcId = selectedServices[o.id];
        const trt = selectedTreatments[o.id];
        updateOrder(o.id, {
          status: "Accepted",
          service: sampleServices[svcId].title,
          treatment: trt
        });
      });
    // clear
    setSelectedRows(prev => {
      const c = {...prev};
      Object.keys(prev).forEach(k => { if(prev[k]) c[+k]=false; });
      return c;
    });
  };

  const handleAccept = (o: Order) => {
    const newSvcId = selectedServices[o.id];
    const newTrt  = selectedTreatments[o.id];
    if (newSvcId && (sampleServices[newSvcId].title !== o.service || newTrt !== o.treatment)) {
      if (!window.confirm(
        `Change service from '${o.service}' to '${sampleServices[newSvcId].title}' and treatment from '${o.treatment}' to '${newTrt}'?`
      )) return;
    }
    updateOrder(o.id, {
      status: "Accepted",
      service: sampleServices[newSvcId].title,
      treatment: newTrt
    });
  };

  const handleReject = (o: Order) => updateOrder(o.id, { status: "Rejected" });
  const handleReinstate = (o: Order) => updateOrder(o.id, { status: "Accepted" });

  const toggleRow = (id: number, checked: boolean) =>
    setSelectedRows(prev => ({ ...prev, [id]: checked }));
  const toggleGroup = (orders: Order[], checked: boolean) =>
    setSelectedRows(prev => {
      const c = {...prev};
      orders.forEach(o => c[o.id] = checked);
      return c;
    });

  const styles: Record<string, CSSProperties> = {
    page:       { background:"#121212", minHeight:"100vh", color:"#EEE", padding:"2rem", fontFamily:"Segoe UI, sans-serif" },
    container:  { width:"100%", padding:"2rem", background:"#1E1E1E", borderRadius:12, boxShadow:"0 4px 20px rgba(0,0,0,0.5)", position:"relative" },
    homeBtn:    { position:"absolute",top:16,right:16,fontSize:24,color:"#4A90E2",cursor:"pointer" },
    title:      { color:"#4A90E2",fontSize:"2rem",marginBottom:"1rem" },
    controls:   { display:"flex",gap:"1rem",marginBottom:"1.5rem",alignItems:"center" },
    dateRange:  { border:"1px solid #333",borderRadius:8,overflow:"hidden",flex:1 },
    tableWrap:  { overflowX:"auto",marginBottom:"2rem",boxShadow:"0 2px 10px rgba(0,0,0,0.3)",borderRadius:8 },
    table:      { width:"100%",borderCollapse:"collapse",background:"#FFF",color:"#222",borderRadius:8 },
    th:         { padding:"0.75rem 1rem",background:"#4A90E2",color:"#FFF",textTransform:"uppercase",fontSize:"0.875rem",letterSpacing:"0.05em",textAlign:"left" },
    td:         { padding:"1rem",borderBottom:"1px solid #EEE",textAlign:"left",verticalAlign:"middle",fontSize:"0.95rem" },
    trHover:    { transition:"background .2s" },
    checkbox:   { margin:0 },
    select:     { padding:"4px 8px",borderRadius:4,border:"1px solid #ccc" },
    btnAcceptAll:  { margin:"1rem 0", padding:"8px 16px", background:"#28a745", color:"#FFF", border:"none", borderRadius:6, cursor:"pointer" },
    btnAccept:     { padding:"6px 12px", borderRadius:20, background:"#28a745", color:"#FFF", border:"none", cursor:"pointer" },
    btnReject:     { padding:"6px 12px", borderRadius:20, background:"#dc3545", color:"#FFF", border:"none", cursor:"pointer" },
    btnReinstate:  { padding:"6px 12px", borderRadius:20, background:"#ff9800", color:"#FFF", border:"none", cursor:"pointer" },
  };

  if (loading) return <div style={styles.page}>Loading…</div>;
  if (error)   return <div style={styles.page}>Error: {error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <FaHome style={styles.homeBtn} onClick={()=>navigate("/")} title="Home" />
        <h1 style={styles.title}>Order Board</h1>

        <div style={styles.controls}>
          <div style={styles.dateRange}>
            <DateRange
              ranges={range}
              onChange={(item: RangeKeyDict)=>{
                let {startDate,endDate} = item.selection;
                if (startDate!>endDate!) [startDate,endDate] = [endDate!,startDate!];
                setRange([{...item.selection,startDate,endDate}]);
                if (startDate!.getTime()!==range[0].startDate!.getTime()) setLastChanged("start");
                else if (endDate!.getTime()!==range[0].endDate!.getTime()) setLastChanged("end");
                if (startDate&&endDate) setShowCalendar(false);
              }}
              moveRangeOnFirstSelection
              rangeColors={["#4A90E2"]}
            />
          </div>
        </div>

        {anySelected && (
          <button style={styles.btnAcceptAll} onClick={handleAcceptAll}>
            Accept All
          </button>
        )}

        {Object.entries(grouped).map(([date, orders])=>(
          <div key={date} style={{marginBottom:"2rem"}}>
            <h2 style={{color:"#F23657", display:"flex", alignItems:"center"}}>
              <input
                type="checkbox"
                style={styles.checkbox}
                onChange={e=>toggleGroup(orders,e.target.checked)}
              />
              <span style={{marginLeft:8}}>
                {new Date(date).toLocaleDateString("en-GB")} — {orders.length} records
              </span>
            </h2>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}><input type="checkbox" style={styles.checkbox} onChange={e=>toggleGroup(orders,e.target.checked)} /></th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Treatment</th>
                    <th style={styles.th}>Dosage</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>DOB</th>
                    <th style={styles.th}>PHONE</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o.id}
                        style={styles.trHover}
                        onMouseEnter={e=>(e.currentTarget.style.background="#F5F5F5")}
                        onMouseLeave={e=>(e.currentTarget.style.background="")}
                    >
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedRows[o.id]}
                          style={styles.checkbox}
                          onChange={e=>toggleRow(o.id,e.target.checked)}
                        />
                      </td>
                      <td style={styles.td}>
                      <select
  style={styles.select}
  value={selectedServices[o.id]}
  onChange={e => {
    const newSvcId = Number(e.target.value);
    setSelectedServices(prev => ({ ...prev, [o.id]: newSvcId }));
    updateOrder(o.id, { service: sampleServices[newSvcId].title });
  }}
>

                          {Object.values(sampleServices).map(s=>(
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </select>
                      </td>
                      <td style={styles.td}>
                      <select
  style={styles.select}
  value={selectedTreatments[o.id]}
  onChange={e => {
    const newTrt = e.target.value;
    setSelectedTreatments(prev => ({ ...prev, [o.id]: newTrt }));
    updateOrder(o.id, { treatment: newTrt });
  }}
>

                          <option value="" disabled>Select treatment</option>
                          {(initialTreatmentOptions[selectedServices[o.id]]||[]).map(t=>(
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </td>
                      <td style={styles.td}>{o.dosage}</td>
                      <td style={styles.td}>{o.patientName}</td>
                      <td style={styles.td}>{o.dateBirth||"—"}</td>
                      <td style={styles.td}>
                        <a href={`https://wa.me/${o.telNumber}`} target="_blank" rel="noopener noreferrer">
                          {o.telNumber}
                        </a>
                      </td>
                      <td style={styles.td}>
                        {o.status==="Ordered" && (
                          <button style={styles.btnAccept} onClick={()=>handleAccept(o)}>
                            Accept
                          </button>
                        )}
                        {o.status==="Accepted" && (
                          <button style={styles.btnReject} onClick={()=>handleReject(o)}>
                            Reject
                          </button>
                        )}
                        {o.status==="Rejected" && (
                          <button style={styles.btnReinstate} onClick={()=>handleReinstate(o)}>
                            Re-instate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
