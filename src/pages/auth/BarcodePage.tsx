// import React, { useEffect, useMemo, useRef, useState, CSSProperties } from "react";
// import supabase from "../../supabase";

// /** ---------------- Types ---------------- */
// type BalanceRow = {
//   barcode: string;
//   drug_name: string;
//   open_balance: number | string | null;
//   balance: number | string | null;
// };

// type OrderRow = {
//   id: number;
//   barcode: string;
//   drug_name: string;
//   date: string;
//   time: string;
//   units: number;
//   company: string | null;
// };

// type MoveRow = {
//   id: number;
//   barcode: string;
//   drug_name: string;
//   date: string;
//   time: string;
//   units: number;
// };

// type OrderCard = {
//   id: number;
//   barcode: string;
//   drug_name: string;
//   units: number;
//   company: string;
// };

// type InCard = {
//   id: number;
//   barcode: string;
//   drug_name: string;
//   units: number;
// };

// type OutCard = {
//   id: number;
//   barcode: string;
//   drug_name: string;
//   units: number;
//   balance: number; // current balance (display)
// };

// const COMPANIES = ["AAH", "Alliance", "Medihealth", "Phoenix", "Special"]; // alphabetical

// /** ---------------- Styles (dark UI, rounded) ---------------- */
// const styles: Record<string, CSSProperties> = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(180deg, #0f1115 0%, #0b0d12 100%)",
//     color: "#EAEAEA",
//     fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
//     padding: "24px",
//   },
//   board: {
//     maxWidth: 1400,
//     margin: "0 auto",
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr 1fr",
//     gap: 16,
//   },
//   column: {
//     background: "rgba(255,255,255,0.04)",
//     border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 16,
//     padding: 12,
//     backdropFilter: "blur(4px)",
//   },
//   colHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "12px 10px",
//     borderRadius: 12,
//     marginBottom: 8,
//     background: "rgba(255,255,255,0.05)",
//     border: "1px solid rgba(255,255,255,0.08)",
//   },
//   colTitle: { fontSize: 18, fontWeight: 700 },
//   inputWrap: { position: "relative", marginTop: 8 },
//   input: {
//     width: "100%",
//     border: "1px solid #2a2f3a",
//     background: "#141821",
//     color: "#EAEAEA",
//     borderRadius: 10,
//     padding: "10px 12px",
//     outline: "none",
//     fontSize: 14,
//   },
//   suggestBox: {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     right: 0,
//     zIndex: 5,
//     marginTop: 6,
//     background: "#111418",
//     border: "1px solid #293042",
//     borderRadius: 10,
//     overflow: "hidden",
//     boxShadow: "0 12px 24px rgba(0,0,0,.35)",
//   },
//   suggestItem: { padding: "10px 12px", cursor: "pointer" },
//   suggestItemHover: { background: "#00FF7F", color: "#000", fontWeight: 700 },

//   list: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
//   card: {
//     position: "relative",
//     background: "rgba(255,255,255,0.06)",
//     border: "1px solid rgba(255,255,255,0.1)",
//     borderRadius: 14,
//     padding: 12,
//   },
//   close: {
//     position: "absolute",
//     top: 6,
//     right: 8,
//     background: "transparent",
//     border: "none",
//     color: "#AAB3C0",
//     fontSize: 18,
//     cursor: "pointer",
//   },
//   drug: { fontWeight: 700, fontSize: 15, marginBottom: 6 },
//   subStack: { display: "flex", flexDirection: "column", gap: 8 },
//   fieldRow: { display: "flex", gap: 10, alignItems: "center" },
//   label: { fontSize: 12, opacity: 0.7 },
//   smallInput: {
//     width: 110,
//     border: "1px solid #344055",
//     background: "#141821",
//     color: "#EAEAEA",
//     borderRadius: 8,
//     padding: "8px 10px",
//     outline: "none",
//     fontSize: 14,
//   },
//   select: {
//     width: 150,
//     border: "1px solid #344055",
//     background: "#141821",
//     color: "#EAEAEA",
//     borderRadius: 8,
//     padding: "8px 10px",
//     outline: "none",
//     fontSize: 14,
//   },
//   balancePill: {
//     display: "inline-block",
//     padding: "4px 10px",
//     borderRadius: 999,
//     background: "rgba(255,255,255,0.08)",
//     border: "1px solid rgba(255,255,255,0.12)",
//     fontSize: 12,
//   },
// };

// /** ---------------- Utilities ---------------- */
// const pad = (n: number) => n.toString().padStart(2, "0");
// const nowParts = () => {
//   const d = new Date();
//   return {
//     date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
//     time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
//   };
// };
// const num = (v: any) => (Number(v) || 0);

// /** Recompute balance = open_balance + sum(stock_in.units) - sum(stock_out.units) for a barcode */
// async function recomputeAndUpdateBalance(barcode: string) {
//   const [{ data: balRow }, inAgg, outAgg] = await Promise.all([
//     supabase.from("Balance").select("open_balance").eq("barcode", barcode).maybeSingle(),
//     supabase.from("stock_in").select("units").eq("barcode", barcode),
//     supabase.from("stock_out").select("units").eq("barcode", barcode),
//   ]);
//   const open = num(balRow?.open_balance);
//   const plus = (inAgg.data || []).reduce((s: number, r: any) => s + num(r.units), 0);
//   const minus = (outAgg.data || []).reduce((s: number, r: any) => s + num(r.units), 0);
//   const newBalance = open + plus - minus;
//   await supabase.from("Balance").update({ balance: newBalance }).eq("barcode", barcode);
//   return newBalance;
// }

// /** ---------------- Component ---------------- */
// export default function PrescriptionBoard() {
//   /* ---------- ORDER COLUMN STATE ---------- */
//   const [orderQuery, setOrderQuery] = useState("");
//   const [orderSuggest, setOrderSuggest] = useState<BalanceRow[]>([]);
//   const [orderHover, setOrderHover] = useState<number | null>(null);
//   const [showOrderSuggest, setShowOrderSuggest] = useState(false);
//   const [orders, setOrders] = useState<OrderCard[]>([]);

//   /* ---------- STOCK IN COLUMN STATE ---------- */
//   const [inQuery, setInQuery] = useState("");
//   const [inSuggest, setInSuggest] = useState<OrderRow[]>([]);
//   const [inHover, setInHover] = useState<number | null>(null);
//   const [showInSuggest, setShowInSuggest] = useState(false);
//   const [ins, setIns] = useState<InCard[]>([]);

//   /* ---------- STOCK OUT COLUMN STATE ---------- */
//   const [outQuery, setOutQuery] = useState("");
//   const [outSuggest, setOutSuggest] = useState<BalanceRow[]>([]);
//   const [outHover, setOutHover] = useState<number | null>(null);
//   const [showOutSuggest, setShowOutSuggest] = useState(false);
//   const [outs, setOuts] = useState<OutCard[]>([]);

//   const orderInputRef = useRef<HTMLInputElement | null>(null);
//   const inInputRef = useRef<HTMLInputElement | null>(null);
//   const outInputRef = useRef<HTMLInputElement | null>(null);

//   /** ---------- Suggestions ---------- */
//   useEffect(() => {
//     async function loadOrders() {
//       const { data, error } = await supabase
//         .from("order_item")
//         .select("id, barcode, drug_name, units, company")
//         .gt("units", 0)                    // only units > 0
//         .order("id", { ascending: false });
//       if (!error && data) {
//         setOrders(
//           data.map((r) => ({
//             id: r.id,
//             barcode: r.barcode,
//             drug_name: r.drug_name,
//             units: r.units ?? 0,
//             company: r.company ?? "",
//           }))
//         );
//       }
//     }
  
//     loadOrders();
  
//     const ch = supabase
//       .channel("order_item_changes")
//       .on("postgres_changes",
//         { event: "*", schema: "public", table: "order_item" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             const n = payload.new as any;
//             if ((n.units ?? 0) > 0) {
//               // put at top
//               setOrders((prev) => [
//                 {
//                   id: n.id,
//                   barcode: n.barcode,
//                   drug_name: n.drug_name,
//                   units: n.units ?? 0,
//                   company: n.company ?? "",
//                 },
//                 ...prev.filter((p) => p.id !== n.id),
//               ]);
//             }
//           } else if (payload.eventType === "UPDATE") {
//             const n = payload.new as any;
//             setOrders((prev) => {
//               // if units <= 0 hide it
//               if ((n.units ?? 0) <= 0) return prev.filter((p) => p.id !== n.id);
//               const updated = prev.map((p) =>
//                 p.id === n.id ? { ...p, units: n.units ?? 0, company: n.company ?? "" } : p
//               );
//               // also bump to top when it changes
//               const found = updated.find((p) => p.id === n.id);
//               return found ? [found, ...updated.filter((p) => p.id !== n.id)] : updated;
//             });
//           } else if (payload.eventType === "DELETE") {
//             const o = payload.old as any;
//             setOrders((prev) => prev.filter((p) => p.id !== o.id));
//           }
//         }
//       )
//       .subscribe();
  
//     return () => { supabase.removeChannel(ch); };
//   }, []);
  
//   useEffect(() => {
//     async function loadIns() {
//       const { data, error } = await supabase
//         .from("stock_in")
//         .select("id, barcode, drug_name, units")
//         .order("id", { ascending: false })
//         .limit(200);
//       if (!error && data) {
//         setIns(data.map((r) => ({ id: r.id, barcode: r.barcode, drug_name: r.drug_name, units: r.units ?? 0 })));
//       }
//     }
  
//     loadIns();
  
//     const ch = supabase
//       .channel("stock_in_changes")
//       .on("postgres_changes",
//         { event: "*", schema: "public", table: "stock_in" },
//         async (payload) => {
//           // adjust Order.units based on the delta and bump the order card to top (if still >0)
//           const applyOrderDelta = async (barcode: string, delta: number) => {
//             // delta > 0 means new stock-in units → subtract from order
//             if (delta === 0) return;
  
//             const { data: ord } = await supabase
//               .from("order_item")
//               .select("id, units, drug_name, company")
//               .eq("barcode", barcode)
//               .maybeSingle();
  
//             if (ord) {
//               const newUnits = Math.max(0, (Number(ord.units) || 0) - delta);
//               await supabase.from("order_item").update({ units: newUnits }).eq("id", ord.id);
//               // local mirror (top or remove)
//               setOrders((prev) => {
//                 const rest = prev.filter((o) => o.id !== ord.id);
//                 if (newUnits <= 0) return rest;         // remove
//                 const updated = { id: ord.id, barcode, drug_name: ord.drug_name, units: newUnits, company: ord.company ?? "" };
//                 return [updated, ...rest];               // bring to top
//               });
//             }
//           };
  
//           if (payload.eventType === "INSERT") {
//             const n = payload.new as any;
//             setIns((prev) => [{ id: n.id, barcode: n.barcode, drug_name: n.drug_name, units: n.units ?? 0 }, ...prev]);
//             await recomputeAndUpdateBalance(n.barcode);
//             await applyOrderDelta(n.barcode, Number(n.units) || 0);
//           } else if (payload.eventType === "UPDATE") {
//             const n = payload.new as any;
//             const o = payload.old as any;
//             const delta = (Number(n.units) || 0) - (Number(o.units) || 0);
//             setIns((prev) =>
//               prev.map((c) => (c.id === n.id ? { ...c, units: n.units ?? 0 } : c))
//             );
//             await recomputeAndUpdateBalance(n.barcode);
//             await applyOrderDelta(n.barcode, delta);
//           } else if (payload.eventType === "DELETE") {
//             const o = payload.old as any;
//             setIns((prev) => prev.filter((c) => c.id !== o.id));
//             await recomputeAndUpdateBalance(o.barcode);
//             // deleting a stock_in should add those units BACK to order
//             await applyOrderDelta(o.barcode, -(Number(o.units) || 0));
//           }
//         }
//       )
//       .subscribe();
  
//     return () => { supabase.removeChannel(ch); };
//   }, []);

//   useEffect(() => {
//     async function loadOuts() {
//       const { data, error } = await supabase
//         .from("stock_out")
//         .select("id, barcode, drug_name, units")
//         .order("id", { ascending: false })
//         .limit(200);
//       if (!error && data) {
//         // we’ll fetch live balance on the fly per card after recompute
//         setOuts(data.map((r) => ({ id: r.id, barcode: r.barcode, drug_name: r.drug_name, units: r.units ?? 0, balance: 0 })));
//         // hydrate balances
//         data.forEach(async (r) => {
//           const b = await recomputeAndUpdateBalance(r.barcode);
//           setOuts((prev) => prev.map((c) => (c.id === r.id ? { ...c, balance: b } : c)));
//         });
//       }
//     }
  
//     loadOuts();
  
//     const ch = supabase
//       .channel("stock_out_changes")
//       .on("postgres_changes",
//         { event: "*", schema: "public", table: "stock_out" },
//         async (payload) => {
//           if (payload.eventType === "INSERT") {
//             const n = payload.new as any;
//             const b = await recomputeAndUpdateBalance(n.barcode);
//             setOuts((prev) => [{ id: n.id, barcode: n.barcode, drug_name: n.drug_name, units: n.units ?? 0, balance: b }, ...prev]);
//           } else if (payload.eventType === "UPDATE") {
//             const n = payload.new as any;
//             const b = await recomputeAndUpdateBalance(n.barcode);
//             setOuts((prev) =>
//               prev.map((c) => (c.id === n.id ? { ...c, units: n.units ?? 0, balance: b } : c))
//             );
//           } else if (payload.eventType === "DELETE") {
//             const o = payload.old as any;
//             const b = await recomputeAndUpdateBalance(o.barcode);
//             setOuts((prev) => prev.filter((c) => c.id !== o.id));
//             // Optionally update any visible card for same barcode with new balance
//             setOuts((prev) => prev.map((c) => (c.barcode === o.barcode ? { ...c, balance: b } : c)));
//           }
//         }
//       )
//       .subscribe();
  
//     return () => { supabase.removeChannel(ch); };
//   }, []);
  
//   // ORDER: search Balance by name fragment, or enter full barcode + Enter
//   useEffect(() => {
//     const q = orderQuery.trim();
//     if (q.length < 2) { setOrderSuggest([]); setShowOrderSuggest(false); return; }
//     (async () => {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode,drug_name,open_balance,balance")
//         .ilike("drug_name", `%${q}%`)
//         .order("drug_name", { ascending: true })
//         .limit(10);
//       if (!error) { setOrderSuggest(data || []); setShowOrderSuggest(true); setOrderHover(null); }
//     })();
//   }, [orderQuery]);

//   // Load existing order items at start + subscribe to realtime updates
// useEffect(() => {
//     async function loadOrders() {
//       const { data, error } = await supabase
//         .from("order_item")
//         .select("id, barcode, drug_name, units, company")
//         .order("id", { ascending: false });
//       if (!error && data) {
//         setOrders(
//           data.map((r) => ({
//             id: r.id,
//             barcode: r.barcode,
//             drug_name: r.drug_name,
//             units: r.units ?? 0,
//             company: r.company ?? "",
//           }))
//         );
//       }
//     }
  
//     loadOrders();
  
//     // Realtime subscription: listen for inserts, updates, deletes
//     const sub = supabase
//       .channel("order_item_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "order_item" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setOrders((prev) => [
//               {
//                 id: payload.new.id,
//                 barcode: payload.new.barcode,
//                 drug_name: payload.new.drug_name,
//                 units: payload.new.units ?? 0,
//                 company: payload.new.company ?? "",
//               },
//               ...prev.filter((p) => p.id !== payload.new.id),
//             ]);
//           } else if (payload.eventType === "UPDATE") {
//             setOrders((prev) =>
//               prev.map((p) =>
//                 p.id === payload.new.id
//                   ? {
//                       ...p,
//                       units: payload.new.units ?? 0,
//                       company: payload.new.company ?? "",
//                     }
//                   : p
//               )
//             );
//           } else if (payload.eventType === "DELETE") {
//             setOrders((prev) => prev.filter((p) => p.id !== payload.old.id));
//           }
//         }
//       )
//       .subscribe();
  
//     return () => {
//       supabase.removeChannel(sub);
//     };
//   }, []);
  

//   // STOCK IN: search current order_item list by name fragment
//   useEffect(() => {
//     const q = inQuery.trim();
//     if (q.length < 2) { setInSuggest([]); setShowInSuggest(false); return; }
//     (async () => {
//       const { data, error } = await supabase
//         .from("order_item")
//         .select("id,barcode,drug_name,date,time,units,company")
//         .ilike("drug_name", `%${q}%`)
//         .order("id", { ascending: false })
//         .limit(10);
//       if (!error) { setInSuggest((data as any) || []); setShowInSuggest(true); setInHover(null); }
//     })();
//   }, [inQuery]);

//   // STOCK OUT: search Balance by name fragment
//   useEffect(() => {
//     const q = outQuery.trim();
//     if (q.length < 2) { setOutSuggest([]); setShowOutSuggest(false); return; }
//     (async () => {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode,drug_name,open_balance,balance")
//         .ilike("drug_name", `%${q}%`)
//         .order("drug_name", { ascending: true })
//         .limit(10);
//       if (!error) { setOutSuggest(data || []); setShowOutSuggest(true); setOutHover(null); }
//     })();
//   }, [outQuery]);

//   /** ---------- ORDER helpers ---------- */

//   async function upsertOrder(barcode: string) {
//     // get Balance row first
//     const { data: b } = await supabase
//       .from("Balance")
//       .select("barcode,drug_name")
//       .eq("barcode", barcode)
//       .maybeSingle();
//     if (!b) return;

//     // If exists locally, just focus units field
//     const existing = orders.find((o) => o.barcode === barcode);
//     if (existing) return;

//     const { date, time } = nowParts();
//     // ensure 1 row per barcode (upsert by barcode). Starts with units 0 and no company.
//     const { data: inserted, error } = await supabase
//       .from("order_item")
//       .upsert({
//         barcode: b.barcode,
//         drug_name: b.drug_name,
//         date, time,
//         units: 0,
//         company: null,
//       }, { onConflict: "barcode" })
//       .select("*")
//       .single();

//     if (!error && inserted) {
//       // put at top
//       setOrders((prev) => [{ id: inserted.id, barcode: inserted.barcode, drug_name: inserted.drug_name, units: inserted.units ?? 0, company: inserted.company ?? "" }, ...prev.filter(p => p.barcode !== inserted.barcode)]);
//     }
//   }

//   async function onOrderSuggestPick(row: BalanceRow) {
//     setShowOrderSuggest(false);
//     setOrderQuery("");
//     await upsertOrder(row.barcode);
//     // focus Order input for next scan
//     setTimeout(() => orderInputRef.current?.focus(), 0);
//   }

//   async function handleOrderEnter() {
//     const raw = orderQuery.trim();
//     if (!raw) return;
//     // If typed a barcode, try exact lookup by barcode
//     const { data: byCode } = await supabase
//       .from("Balance").select("barcode").eq("barcode", raw).maybeSingle();
//     if (byCode?.barcode) {
//       await upsertOrder(byCode.barcode);
//     }
//     setOrderQuery("");
//   }

//   async function setOrderUnits(card: OrderCard, val: string) {
//     const units = val === "" ? 0 : Math.max(0, Number(val) || 0);
//     setOrders((prev) => prev.map((o) => o.id === card.id ? { ...o, units } : o));
//     await supabase.from("order_item").update({ units }).eq("id", card.id);
//   }

//   async function setOrderCompany(card: OrderCard, company: string) {
//     setOrders((prev) => prev.map((o) => o.id === card.id ? { ...o, company } : o));
//     await supabase.from("order_item").update({ company }).eq("id", card.id);
//   }

//   async function deleteOrder(card: OrderCard) {
//     setOrders((prev) => prev.filter((o) => o.id !== card.id));
//     await supabase.from("order_item").delete().eq("id", card.id);
//   }

//   /** ---------- STOCK IN helpers ---------- */

//   async function addStockInFromOrder(orow: OrderRow) {
//     // Local card at top (no units yet)
//     const exists = ins.find((i) => i.barcode === orow.barcode);
//     if (exists) return;
//     setIns((prev) => [{ id: -Date.now(), barcode: orow.barcode, drug_name: orow.drug_name, units: 0 }, ...prev]);
//   }

//   async function applyStockIn(card: InCard, rawVal: string) {
//     const units = rawVal === "" ? 0 : Math.max(0, Number(rawVal) || 0);
//     setIns((prev) => prev.map((c) => c === card ? { ...c, units } : c));
//     if (units <= 0) return;

//     const { date, time } = nowParts();

//     // Upsert (insert new row every time you start typing positive units)
//     const { data: inserted, error } = await supabase
//       .from("stock_in")
//       .insert({ barcode: card.barcode, drug_name: card.drug_name, date, time, units })
//       .select("*")
//       .single();
//     if (error) return;

//     // Reduce matching order_item units
//     const { data: orderRow } = await supabase
//       .from("order_item")
//       .select("id,units")
//       .eq("barcode", card.barcode)
//       .maybeSingle();

//     if (orderRow) {
//       const left = Math.max(0, num(orderRow.units) - units);
//       if (left === 0) {
//         await supabase.from("order_item").delete().eq("id", orderRow.id);
//         setOrders((prev) => prev.filter((o) => o.barcode !== card.barcode));
//       } else {
//         await supabase.from("order_item").update({ units: left }).eq("id", orderRow.id);
//         setOrders((prev) => prev.map((o) => o.barcode === card.barcode ? { ...o, units: left } : o));
//       }
//     }

//     // Recompute balance for this barcode
//     const newBal = await recomputeAndUpdateBalance(card.barcode);
//     // keep card; user can add more lines if needed
//     setIns((prev) => prev.map((c) => c === card ? { ...c, id: inserted.id } : c));
//   }

//   async function deleteStockIn(card: InCard) {
//     // If this card has been inserted (id > 0), remove from DB and **revert** balance and order units
//     if (card.id > 0) {
//       // fetch units of that row before delete
//       const { data: row } = await supabase.from("stock_in").select("id,units").eq("id", card.id).maybeSingle();
//       await supabase.from("stock_in").delete().eq("id", card.id);

//       // revert balance
//       await recomputeAndUpdateBalance(card.barcode);

//       // add back to order_item units
//       if (row?.units) {
//         const { data: existing } = await supabase.from("order_item").select("id,units,drug_name,company,date,time").eq("barcode", card.barcode).maybeSingle();
//         if (existing) {
//           const added = num(existing.units) + num(row.units);
//           await supabase.from("order_item").update({ units: added }).eq("id", existing.id);
//           setOrders((prev) => prev.map((o) => o.barcode === card.barcode ? { ...o, units: added } : o));
//         } else {
//           const { data: bal } = await supabase.from("Balance").select("drug_name").eq("barcode", card.barcode).maybeSingle();
//           const { date, time } = nowParts();
//           const { data: insRow } = await supabase.from("order_item").insert({
//             barcode: card.barcode,
//             drug_name: bal?.drug_name ?? card.drug_name,
//             date, time, units: row.units, company: null,
//           }).select("*").single();
//           if (insRow) {
//             setOrders((prev) => [{ id: insRow.id, barcode: insRow.barcode, drug_name: insRow.drug_name, units: insRow.units, company: insRow.company ?? "" }, ...prev]);
//           }
//         }
//       }
//     }
//     setIns((prev) => prev.filter((c) => c !== card));
//   }

//   /** ---------- STOCK OUT helpers ---------- */

//   async function addStockOutFromBalance(brow: BalanceRow) {
//     const exists = outs.find((o) => o.barcode === brow.barcode);
//     const currBal = num(brow.balance);
//     if (exists) return;
//     setOuts((prev) => [{ id: -Date.now(), barcode: brow.barcode, drug_name: brow.drug_name, units: 0, balance: currBal }, ...prev]);
//   }

//   async function applyStockOut(card: OutCard, rawVal: string) {
//     const units = rawVal === "" ? 0 : Math.max(0, Number(rawVal) || 0);
//     setOuts((prev) => prev.map((c) => c === card ? { ...c, units } : c));
//     if (units <= 0) return;

//     const { date, time } = nowParts();
//     const { data: inserted, error } = await supabase
//       .from("stock_out")
//       .insert({ barcode: card.barcode, drug_name: card.drug_name, date, time, units })
//       .select("*")
//       .single();
//     if (error) return;

//     const newBal = await recomputeAndUpdateBalance(card.barcode);
//     setOuts((prev) => prev.map((c) => c === card ? { ...c, id: inserted.id, balance: newBal } : c));
//   }

//   async function deleteStockOut(card: OutCard) {
//     if (card.id > 0) {
//       await supabase.from("stock_out").delete().eq("id", card.id);
//       const newBal = await recomputeAndUpdateBalance(card.barcode);
//       setOuts((prev) => prev.map((c) => c === card ? { ...c, balance: newBal } : c));
//     }
//     setOuts((prev) => prev.filter((c) => c !== card));
//   }

//   /** ---------- Inputs handlers for suggestions ---------- */

//   // ORDER pick by suggestion
//   const orderPick = (row: BalanceRow) => onOrderSuggestPick(row);
//   // STOCK IN pick by order
//   const inPick = (row: OrderRow) => { setShowInSuggest(false); setInQuery(""); addStockInFromOrder(row); setTimeout(() => inInputRef.current?.focus(), 0); };
//   // STOCK OUT pick by balance
//   const outPick = (row: BalanceRow) => { setShowOutSuggest(false); setOutQuery(""); addStockOutFromBalance(row); setTimeout(() => outInputRef.current?.focus(), 0); };

//   /** ---------- Render helpers ---------- */
//   const renderSuggest = <T,>(items: T[], hover: number | null, onPick: (row: T) => void, onHover: (i: number | null) => void, getKey: (row: T, i: number) => string, getText: (row: T) => string) => (
//     <div style={styles.suggestBox}>
//       {items.length === 0 ? (
//         <div style={{ padding: 10, color: "#AAB3C0" }}>No matches</div>
//       ) : items.map((r, i) => (
//         <div
//           key={getKey(r, i)}
//           style={{ ...styles.suggestItem, ...(hover === i ? styles.suggestItemHover : {}) }}
//           onMouseEnter={() => onHover(i)}
//           onMouseLeave={() => onHover(null)}
//           onClick={() => onPick(r)}
//         >
//           {getText(r)}
//         </div>
//       ))}
//     </div>
//   );

//   /** ---------- JSX ---------- */
//   return (
//     <div style={styles.page}>
//       <div style={styles.board}>

//         {/* ----------- ORDER COLUMN ----------- */}
//         <section style={styles.column}>
//           <div style={styles.colHeader}>
//             <div style={styles.colTitle}>Order</div>
//             <div></div>
//           </div>

//           <div style={styles.inputWrap}>
//             <input
//               ref={orderInputRef}
//               style={styles.input}
//               value={orderQuery}
//               onChange={(e) => { setOrderQuery(e.target.value); setShowOrderSuggest(true); }}
//               onKeyDown={async (e) => { if (e.key === "Enter") { e.preventDefault(); await handleOrderEnter(); } }}
//               placeholder="Scan barcode or type to search Balance by name…"
//               autoFocus
//             />
//             {showOrderSuggest && renderSuggest(
//               orderSuggest,
//               orderHover,
//               orderPick,
//               setOrderHover,
//               (r, i) => (r as any).barcode + "-" + i,
//               (r) => (r as any).drug_name
//             )}
//           </div>

//           <div style={styles.list}>
//             {orders.map((o) => (
//               <div key={o.id} style={styles.card}>
//                 <button style={styles.close} aria-label="Remove" onClick={() => deleteOrder(o)}>×</button>
//                 <div style={styles.drug}>{o.drug_name}</div>
//                 <div style={styles.subStack}>
//                   <div style={styles.fieldRow}>
//                     <div style={styles.label}>Units</div>
//                     <input
//                       style={styles.smallInput}
//                       value={o.units === 0 ? "" : String(o.units)}
//                       inputMode="numeric"
//                       onChange={(e) => setOrderUnits(o, e.target.value)}
//                       placeholder="e.g. 5"
//                     />
//                   </div>
//                   <div style={styles.fieldRow}>
//                     <div style={styles.label}>Company</div>
//                     <select
//                       style={styles.select}
//                       value={o.company || ""}
//                       onChange={(e) => setOrderCompany(o, e.target.value)}
//                     >
//                       <option value="" disabled>Select supplier…</option>
//                       {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ----------- STOCK IN COLUMN ----------- */}
//         <section style={styles.column}>
//           <div style={styles.colHeader}>
//             <div style={styles.colTitle}>Stock In</div>
//             <div></div>
//           </div>

//           <div style={styles.inputWrap}>
//             <input
//               ref={inInputRef}
//               style={styles.input}
//               value={inQuery}
//               onChange={(e) => { setInQuery(e.target.value); setShowInSuggest(true); }}
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   // also allow barcode direct (look in order_item)
//                   const raw = inQuery.trim();
//                   if (!raw) return;
//                   const { data: r } = await supabase.from("order_item").select("*").eq("barcode", raw).maybeSingle();
//                   if (r) inPick(r as OrderRow);
//                   setInQuery("");
//                 }
//               }}
//               placeholder="Scan barcode or search by name in current Order…"
//             />
//             {showInSuggest && renderSuggest(
//               inSuggest,
//               inHover,
//               inPick,
//               setInHover,
//               (r, i) => (r as any).id + "-" + i,
//               (r) => (r as any).drug_name
//             )}
//           </div>

//           <div style={styles.list}>
//             {ins.map((c) => (
//               <div key={c.id} style={styles.card}>
//                 <button style={styles.close} aria-label="Remove" onClick={() => deleteStockIn(c)}>×</button>
//                 <div style={styles.drug}>{c.drug_name}</div>
//                 <div style={styles.subStack}>
//                   <div style={styles.fieldRow}>
//                     <div style={styles.label}>Units</div>
//                     <input
//                       style={styles.smallInput}
//                       value={c.units === 0 ? "" : String(c.units)}
//                       inputMode="numeric"
//                       onChange={(e) => applyStockIn(c, e.target.value)}
//                       placeholder="e.g. 3"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ----------- STOCK OUT COLUMN ----------- */}
//         <section style={styles.column}>
//           <div style={styles.colHeader}>
//             <div style={styles.colTitle}>Stock Out</div>
//             <div></div>
//           </div>

//           <div style={styles.inputWrap}>
//             <input
//               ref={outInputRef}
//               style={styles.input}
//               value={outQuery}
//               onChange={(e) => { setOutQuery(e.target.value); setShowOutSuggest(true); }}
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const raw = outQuery.trim();
//                   if (!raw) return;
//                   const { data: b } = await supabase.from("Balance").select("*").eq("barcode", raw).maybeSingle();
//                   if (b) outPick(b as BalanceRow);
//                   setOutQuery("");
//                 }
//               }}
//               placeholder="Scan barcode or search Balance by name…"
//             />
//             {showOutSuggest && renderSuggest(
//               outSuggest,
//               outHover,
//               outPick,
//               setOutHover,
//               (r, i) => (r as any).barcode + "-" + i,
//               (r) => (r as any).drug_name
//             )}
//           </div>

//           <div style={styles.list}>
//             {outs.map((c) => (
//               <div key={c.id} style={styles.card}>
//                 <button style={styles.close} aria-label="Remove" onClick={() => deleteStockOut(c)}>×</button>
//                 <div style={styles.drug}>{c.drug_name}</div>
//                 <div style={styles.subStack}>
//                   <div style={styles.fieldRow}>
//                     <div style={styles.label}>Units</div>
//                     <input
//                       style={styles.smallInput}
//                       value={c.units === 0 ? "" : String(c.units)}
//                       inputMode="numeric"
//                       onChange={(e) => applyStockOut(c, e.target.value)}
//                       placeholder="e.g. 2"
//                     />
//                   </div>
//                   <div className="balanceRow" style={styles.fieldRow}>
//                     <div style={styles.label}>Balance</div>
//                     <div style={styles.balancePill}>{c.balance}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState, CSSProperties } from "react";
// import supabase from "../../supabase";
import React, { useEffect, useRef, useState, CSSProperties } from "react";
import supabase from "../../supabase";

/** ---------------- Types ---------------- */
type BalanceRow = {
  barcode: string;
  drug_name: string;
  open_balance: number | string | null;
  balance: number | string | null;
};

type OrderRow = {
  id: number;
  barcode: string;
  drug_name: string;
  date: string;
  time: string;
  units: number;
  company: string | null;
};

type OrderCard = {
  id: number;
  barcode: string;
  drug_name: string;
  units: number;
  company: string;
};

type InCard = {
  id: number;
  barcode: string;
  drug_name: string;
  units: number;
};

type OutCard = {
  id: number;
  barcode: string;
  drug_name: string;
  units: number;          // current input value in the UI
  lastCommitted: number;  // units last written to DB for this row
  availBalance: number;   // current available balance for validation (not shown)
  invalid?: boolean;      // UI flag when units > availBalance
};

type BalanceCard = {
  barcode: string;
  drug_name: string;
  balance: number;
};

const COMPANIES = ["AAH", "Alliance", "Medihealth", "Phoenix", "Special"]; // alphabetical

/** ---------------- Styles (dark UI, rounded) ---------------- */
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f1115 0%, #0b0d12 100%)",
    color: "#EAEAEA",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    padding: "24px",
  },
  topBar: {
    width: "60%",
    margin: "0 auto 16px auto",
  },
  board: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr", // 4 columns
    gap: 16,
  },
  column: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 12,
    backdropFilter: "blur(4px)",
  },
  colHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 10px",
    borderRadius: 12,
    marginBottom: 8,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  colTitle: { fontSize: 18, fontWeight: 700 },
  inputWrap: { position: "relative", marginTop: 8 },
  input: {
    width: "100%",
    border: "1px solid #2a2f3a",
    background: "#141821",
    color: "#EAEAEA",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    fontSize: 14,
  },
  suggestBox: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 5,
    marginTop: 6,
    background: "#111418",
    border: "1px solid #293042",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(0,0,0,.35)",
  },
  suggestItem: { padding: "10px 12px", cursor: "pointer" },
  suggestItemHover: { background: "#00FF7F", color: "#000", fontWeight: 700 },

  list: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
  card: {
    position: "relative",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 12,
  },
  close: {
    position: "absolute",
    top: 6,
    right: 8,
    background: "transparent",
    border: "none",
    color: "#AAB3C0",
    fontSize: 18,
    cursor: "pointer",
  },
  drug: { fontWeight: 700, fontSize: 15, marginBottom: 6 },
  subStack: { display: "flex", flexDirection: "column", gap: 8 },
  fieldRow: { display: "flex", gap: 10, alignItems: "center" },
  label: { fontSize: 12, opacity: 0.7 },
  smallInput: {
    width: 110,
    border: "1px solid #344055",
    background: "#141821",
    color: "#EAEAEA",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
    fontSize: 14,
  },
  smallInputError: {
    width: 110,
    border: "1px solid #e53935", // red
    background: "#141821",
    color: "#EAEAEA",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
    fontSize: 14,
  },
  select: {
    width: 150,
    border: "1px solid #344055",
    background: "#141821",
    color: "#EAEAEA",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
    fontSize: 14,
  },
  balancePill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
  },
};

/** ---------------- Utilities ---------------- */
const pad = (n: number) => n.toString().padStart(2, "0");
const nowParts = () => {
  const d = new Date();
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
};
const num = (v: any) => Number(v) || 0;

/** Recompute balance = open_balance + sum(stock_in.units) - sum(stock_out.units) for a barcode */
async function recomputeAndUpdateBalance(barcode: string) {
  const [{ data: balRow }, inAgg, outAgg] = await Promise.all([
    supabase.from("Balance").select("open_balance").eq("barcode", barcode).maybeSingle(),
    supabase.from("stock_in").select("units").eq("barcode", barcode),
    supabase.from("stock_out").select("units").eq("barcode", barcode),
  ]);
  const open = num(balRow?.open_balance);
  const plus = (inAgg.data || []).reduce((s: number, r: any) => s + num(r.units), 0);
  const minus = (outAgg.data || []).reduce((s: number, r: any) => s + num(r.units), 0);
  const newBalance = open + plus - minus;
  await supabase.from("Balance").update({ balance: newBalance }).eq("barcode", barcode);
  return newBalance;
}

/** ---------------- Component ---------------- */
export default function PrescriptionBoard() {
  /* ---------- GLOBAL POWER SEARCH ---------- */
  const [powerQuery, setPowerQuery] = useState("");

  /* ---------- ORDER COLUMN STATE ---------- */
  const [orderQuery, setOrderQuery] = useState("");
  const [orderSuggest, setOrderSuggest] = useState<BalanceRow[]>([]);
  const [orderHover, setOrderHover] = useState<number | null>(null);
  const [showOrderSuggest, setShowOrderSuggest] = useState(false);
  const [orders, setOrders] = useState<OrderCard[]>([]);

  /* ---------- STOCK IN COLUMN STATE ---------- */
  const [inQuery, setInQuery] = useState("");
  const [inSuggest, setInSuggest] = useState<OrderRow[]>([]);
  const [inHover, setInHover] = useState<number | null>(null);
  const [showInSuggest, setShowInSuggest] = useState(false);
  const [ins, setIns] = useState<InCard[]>([]);

  /* ---------- BALANCE COLUMN STATE ---------- */
  const [balances, setBalances] = useState<BalanceCard[]>([]);
  const [balanceQuery, setBalanceQuery] = useState(""); // Balance-only filter

  /* ---------- STOCK OUT COLUMN STATE ---------- */
  const [outQuery, setOutQuery] = useState("");
  const [outSuggest, setOutSuggest] = useState<BalanceRow[]>([]);
  const [outHover, setOutHover] = useState<number | null>(null);
  const [showOutSuggest, setShowOutSuggest] = useState(false);
  const [outs, setOuts] = useState<OutCard[]>([]);

  /* ---------- PINNED BARCODES (stay at top across all columns) ---------- */
  const [pinnedBarcodes, setPinnedBarcodes] = useState<Set<string>>(new Set());

  const orderInputRef = useRef<HTMLInputElement | null>(null);
  const inInputRef = useRef<HTMLInputElement | null>(null);
  const outInputRef = useRef<HTMLInputElement | null>(null);

  /** ---------- Reordering helpers (pins first, stable order) ---------- */
  function reorderWithPins<T>(arr: T[], getBarcode: (t: T) => string, pins: Set<string>): T[] {
    if (!arr?.length) return arr;
    const pinned: T[] = [];
    const rest: T[] = [];
    for (const item of arr) {
      (pins.has(getBarcode(item)) ? pinned : rest).push(item);
    }
    return [...pinned, ...rest];
  }

  function pinAndReorder(barcode: string) {
    setPinnedBarcodes((prev) => {
      const next = new Set(prev);
      next.add(barcode);
      setOrders((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
      setIns((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
      setOuts((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
      setBalances((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
      return next;
    });
  }

  function applyPinOrderAll() {
    setOrders((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
    setIns((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
    setOuts((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
    setBalances((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
  }

  /** ---------- Filters ---------- */
  const p = powerQuery.trim().toLowerCase();
  const nameMatchesGlobal = (name: string) => (p ? name.toLowerCase().includes(p) : true);
  const balanceNameMatches = (name: string) => {
    const q = balanceQuery.trim().toLowerCase();
    return q ? name.toLowerCase().includes(q) : true;
  };

  /** ---------- Load & Realtime: ORDER ---------- */
  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from("order_item")
        .select("id, barcode, drug_name, units, company")
        .gt("units", 0)
        .order("id", { ascending: false });
      if (!error && data) {
        const mapped = data.map((r) => ({
          id: r.id,
          barcode: r.barcode,
          drug_name: r.drug_name,
          units: r.units ?? 0,
          company: r.company ?? "",
        }));
        setOrders((prev) => reorderWithPins(mapped, (x) => x.barcode, pinnedBarcodes));
      }
    }

    loadOrders();

    const ch = supabase
      .channel("order_item_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_item" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const n = payload.new as any;
            if ((n.units ?? 0) > 0) {
              setOrders((prev) =>
                reorderWithPins(
                  [
                    {
                      id: n.id,
                      barcode: n.barcode,
                      drug_name: n.drug_name,
                      units: n.units ?? 0,
                      company: n.company ?? "",
                    },
                    ...prev.filter((p) => p.id !== n.id),
                  ],
                  (x) => x.barcode,
                  pinnedBarcodes
                )
              );
            }
          } else if (payload.eventType === "UPDATE") {
            const n = payload.new as any;
            setOrders((prev) => {
              const updated =
                (n.units ?? 0) <= 0
                  ? prev.filter((p) => p.id !== n.id)
                  : prev.map((p) =>
                      p.id === n.id
                        ? { ...p, units: n.units ?? 0, company: n.company ?? "" }
                        : p
                    );
              return reorderWithPins(updated, (x) => x.barcode, pinnedBarcodes);
            });
          } else if (payload.eventType === "DELETE") {
            const o = payload.old as any;
            setOrders((prev) =>
              reorderWithPins(prev.filter((p) => p.id !== o.id), (x) => x.barcode, pinnedBarcodes)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [pinnedBarcodes]);

  /** ---------- Load & Realtime: STOCK IN ---------- */
  useEffect(() => {
    async function loadIns() {
      const { data, error } = await supabase
        .from("stock_in")
        .select("id, barcode, drug_name, units")
        .order("id", { ascending: false })
        .limit(200);
      if (!error && data) {
        const mapped = data.map((r) => ({
          id: r.id,
          barcode: r.barcode,
          drug_name: r.drug_name,
          units: r.units ?? 0,
        }));
        setIns((prev) => reorderWithPins(mapped, (x) => x.barcode, pinnedBarcodes));
      }
    }

    loadIns();

    const ch = supabase
      .channel("stock_in_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "stock_in" }, async (payload) => {
        const applyOrderDelta = async (barcode: string, delta: number) => {
          if (delta === 0) return;
          const { data: ord } = await supabase
            .from("order_item")
            .select("id, units, drug_name, company")
            .eq("barcode", barcode)
            .maybeSingle();

          if (ord) {
            const newUnits = Math.max(0, (Number(ord.units) || 0) - delta);
            await supabase.from("order_item").update({ units: newUnits }).eq("id", ord.id);
          }
        };

        if (payload.eventType === "INSERT") {
          const n = payload.new as any;
          setIns((prev) =>
            reorderWithPins(
              [{ id: n.id, barcode: n.barcode, drug_name: n.drug_name, units: n.units ?? 0 }, ...prev],
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
          const nb = await recomputeAndUpdateBalance(n.barcode);
          setOuts((prev) =>
            reorderWithPins(
              prev.map((c) => (c.barcode === n.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
          await applyOrderDelta(n.barcode, Number(n.units) || 0);
        } else if (payload.eventType === "UPDATE") {
          const n = payload.new as any;
          const o = payload.old as any;
          const delta = (Number(n.units) || 0) - (Number(o.units) || 0);
          setIns((prev) =>
            reorderWithPins(
              prev.map((c) => (c.id === n.id ? { ...c, units: n.units ?? 0 } : c)),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
          const nb = await recomputeAndUpdateBalance(n.barcode);
          setOuts((prev) =>
            reorderWithPins(
              prev.map((c) => (c.barcode === n.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
          await applyOrderDelta(n.barcode, delta);
        } else if (payload.eventType === "DELETE") {
          const o = payload.old as any;
          setIns((prev) =>
            reorderWithPins(prev.filter((c) => c.id !== o.id), (x) => x.barcode, pinnedBarcodes)
          );
          const nb = await recomputeAndUpdateBalance(o.barcode);
          setOuts((prev) =>
            reorderWithPins(
              prev.map((c) => (c.barcode === o.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
          await applyOrderDelta(o.barcode, -(Number(o.units) || 0));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [pinnedBarcodes]);

  /** ---------- Load & Realtime: BALANCE ---------- */
  useEffect(() => {
    async function loadBalances() {
      const { data, error } = await supabase
        .from("Balance")
        .select("barcode, drug_name, balance")
        .order("drug_name", { ascending: true });
      if (!error && data) {
        const mapped = data.map((r) => ({
          barcode: r.barcode,
          drug_name: r.drug_name,
          balance: num(r.balance),
        }));
        setBalances((prev) => reorderWithPins(mapped, (x) => x.barcode, pinnedBarcodes));
      }
    }

    loadBalances();

    const ch = supabase
      .channel("balance_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "Balance" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const n = payload.new as any;
          setBalances((prev) =>
            reorderWithPins(
              [...prev, { barcode: n.barcode, drug_name: n.drug_name, balance: num(n.balance) }],
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
        } else if (payload.eventType === "UPDATE") {
          const n = payload.new as any;
          setBalances((prev) =>
            reorderWithPins(
              prev.map((b) =>
                b.barcode === n.barcode ? { ...b, drug_name: n.drug_name, balance: num(n.balance) } : b
              ),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
          setOuts((prev) =>
            reorderWithPins(
              prev.map((c) =>
                c.barcode === n.barcode ? { ...c, availBalance: num(n.balance), invalid: c.units > num(n.balance) } : c
              ),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
        } else if (payload.eventType === "DELETE") {
          const o = payload.old as any;
          setBalances((prev) =>
            reorderWithPins(prev.filter((b) => b.barcode !== o.barcode), (x) => x.barcode, pinnedBarcodes)
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [pinnedBarcodes]);

  /** ---------- Load & Realtime: STOCK OUT ---------- */
  useEffect(() => {
    async function loadOuts() {
      const { data, error } = await supabase
        .from("stock_out")
        .select("id, barcode, drug_name, units")
        .order("id", { ascending: false })
        .limit(200);
      if (!error && data) {
        const initial: OutCard[] = await Promise.all(
          data.map(async (r) => {
            const nb = await recomputeAndUpdateBalance(r.barcode);
            return {
              id: r.id,
              barcode: r.barcode,
              drug_name: r.drug_name,
              units: r.units ?? 0,
              lastCommitted: r.units ?? 0,
              availBalance: nb,
              invalid: (r.units ?? 0) > nb,
            };
          })
        );
        setOuts((prev) => reorderWithPins(initial, (x) => x.barcode, pinnedBarcodes));
      }
    }

    loadOuts();

    const ch = supabase
      .channel("stock_out_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "stock_out" }, async (payload) => {
        if (payload.eventType === "INSERT") {
          const n = payload.new as any;
          const nb = await recomputeAndUpdateBalance(n.barcode);
          setOuts((prev) =>
            reorderWithPins(
              [
                {
                  id: n.id,
                  barcode: n.barcode,
                  drug_name: n.drug_name,
                  units: n.units ?? 0,
                  lastCommitted: n.units ?? 0,
                  availBalance: nb,
                  invalid: (n.units ?? 0) > nb,
                },
                ...prev,
              ],
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
        } else if (payload.eventType === "UPDATE") {
          const n = payload.new as any;
          const nb = await recomputeAndUpdateBalance(n.barcode);
          setOuts((prev) =>
            reorderWithPins(
              prev.map((c) =>
                c.id === n.id
                  ? {
                      ...c,
                      units: n.units ?? 0,
                      lastCommitted: n.units ?? 0,
                      availBalance: nb,
                      invalid: (n.units ?? 0) > nb,
                    }
                  : c
              ),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
        } else if (payload.eventType === "DELETE") {
          const o = payload.old as any;
          const nb = await recomputeAndUpdateBalance(o.barcode);
          setOuts((prev) =>
            reorderWithPins(
              prev
                .filter((c) => c.id !== o.id)
                .map((c) => (c.barcode === o.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
              (x) => x.barcode,
              pinnedBarcodes
            )
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [pinnedBarcodes]);

  /** ---------- Suggestion fetchers ---------- */
  // ORDER: search Balance by name fragment
  useEffect(() => {
    const q = orderQuery.trim();
    if (q.length < 2) {
      setOrderSuggest([]);
      setShowOrderSuggest(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("Balance")
        .select("barcode,drug_name,open_balance,balance")
        .ilike("drug_name", `%${q}%`)
        .order("drug_name", { ascending: true })
        .limit(10);
      if (!error) {
        setOrderSuggest(data || []);
        setShowOrderSuggest(true);
        setOrderHover(null);
      }
    })();
  }, [orderQuery]);

  // STOCK IN: search current order_item list by name fragment
  useEffect(() => {
    const q = inQuery.trim();
    if (q.length < 2) {
      setInSuggest([]);
      setShowInSuggest(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("order_item")
        .select("id,barcode,drug_name,date,time,units,company")
        .ilike("drug_name", `%${q}%`)
        .order("id", { ascending: false })
        .limit(10);
      if (!error) {
        setInSuggest((data as any) || []);
        setShowInSuggest(true);
        setInHover(null);
      }
    })();
  }, [inQuery]);

  // STOCK OUT: search Balance by name fragment
  useEffect(() => {
    const q = outQuery.trim();
    if (q.length < 2) {
      setOutSuggest([]);
      setShowOutSuggest(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("Balance")
        .select("barcode,drug_name,open_balance,balance")
        .ilike("drug_name", `%${q}%`)
        .order("drug_name", { ascending: true })
        .limit(10);
      if (!error) {
        setOutSuggest(data || []);
        setShowOutSuggest(true);
        setOutHover(null);
      }
    })();
  }, [outQuery]);

  /** ---------- ORDER helpers ---------- */
  async function upsertOrder(barcode: string) {
    const { data: b } = await supabase.from("Balance").select("barcode,drug_name").eq("barcode", barcode).maybeSingle();
    if (!b) return;
    const existing = orders.find((o) => o.barcode === barcode);
    if (existing) {
      pinAndReorder(barcode);
      return;
    }

    const { date, time } = nowParts();
    const { data: inserted, error } = await supabase
      .from("order_item")
      .upsert(
        {
          barcode: b.barcode,
          drug_name: b.drug_name,
          date,
          time,
          units: 0,
          company: null,
        },
        { onConflict: "barcode" }
      )
      .select("*")
      .single();

    if (!error && inserted) {
      setOrders((prev) =>
        reorderWithPins(
          [{ id: inserted.id, barcode: inserted.barcode, drug_name: inserted.drug_name, units: inserted.units ?? 0, company: inserted.company ?? "" }, ...prev.filter((p) => p.barcode !== inserted.barcode)],
          (x) => x.barcode,
          pinnedBarcodes
        )
      );
      pinAndReorder(barcode);
    }
  }

  async function onOrderSuggestPick(row: BalanceRow) {
    setShowOrderSuggest(false);
    setOrderQuery("");
    await upsertOrder(row.barcode);
    pinAndReorder(row.barcode);
    setTimeout(() => orderInputRef.current?.focus(), 0);
  }

  async function handleOrderEnter() {
    const raw = orderQuery.trim();
    if (!raw) return;
    const { data: byCode } = await supabase.from("Balance").select("barcode").eq("barcode", raw).maybeSingle();
    if (byCode?.barcode) {
      await upsertOrder(byCode.barcode);
      pinAndReorder(byCode.barcode);
    }
    setOrderQuery("");
  }

  async function setOrderUnits(card: OrderCard, val: string) {
    const units = val === "" ? 0 : Math.max(0, Number(val) || 0);
    setOrders((prev) =>
      reorderWithPins(prev.map((o) => (o.id === card.id ? { ...o, units } : o)), (x) => x.barcode, pinnedBarcodes)
    );
    pinAndReorder(card.barcode); // keep pinned on change
    await supabase.from("order_item").update({ units }).eq("id", card.id);
  }

  async function setOrderCompany(card: OrderCard, company: string) {
    setOrders((prev) =>
      reorderWithPins(prev.map((o) => (o.id === card.id ? { ...o, company } : o)), (x) => x.barcode, pinnedBarcodes)
    );
    pinAndReorder(card.barcode);
    await supabase.from("order_item").update({ company }).eq("id", card.id);
  }

  async function deleteOrder(card: OrderCard) {
    setOrders((prev) =>
      reorderWithPins(prev.filter((o) => o.id !== card.id), (x) => x.barcode, pinnedBarcodes)
    );
    await supabase.from("order_item").delete().eq("id", card.id);
  }

  /** ---------- STOCK IN helpers ---------- */
  async function addStockInFromOrder(orow: OrderRow) {
    const exists = ins.find((i) => i.barcode === orow.barcode);
    if (exists) {
      pinAndReorder(orow.barcode);
      return;
    }
    setIns((prev) =>
      reorderWithPins(
        [{ id: -Date.now(), barcode: orow.barcode, drug_name: orow.drug_name, units: 0 }, ...prev],
        (x) => x.barcode,
        pinnedBarcodes
      )
    );
    pinAndReorder(orow.barcode);
  }

  async function applyStockIn(card: InCard, rawVal: string) {
    const units = rawVal === "" ? 0 : Math.max(0, Number(rawVal) || 0);
    setIns((prev) =>
      reorderWithPins(prev.map((c) => (c === card ? { ...c, units } : c)), (x) => x.barcode, pinnedBarcodes)
    );
    pinAndReorder(card.barcode);
    if (units <= 0) return;

    const { date, time } = nowParts();

    const { data: inserted, error } = await supabase
      .from("stock_in")
      .insert({ barcode: card.barcode, drug_name: card.drug_name, date, time, units })
      .select("*")
      .single();
    if (error) return;

    const { data: orderRow } = await supabase.from("order_item").select("id,units").eq("barcode", card.barcode).maybeSingle();

    if (orderRow) {
      const left = Math.max(0, num(orderRow.units) - units);
      if (left === 0) {
        await supabase.from("order_item").delete().eq("id", orderRow.id);
        setOrders((prev) =>
          reorderWithPins(prev.filter((o) => o.barcode !== card.barcode), (x) => x.barcode, pinnedBarcodes)
        );
      } else {
        await supabase.from("order_item").update({ units: left }).eq("id", orderRow.id);
        setOrders((prev) =>
          reorderWithPins(prev.map((o) => (o.barcode === card.barcode ? { ...o, units: left } : o)), (x) => x.barcode, pinnedBarcodes)
        );
      }
    }

    await recomputeAndUpdateBalance(card.barcode);
    setOuts((prev) =>
      reorderWithPins(
        prev.map((c) => (c.barcode === card.barcode ? { ...c, availBalance: Math.max(0, c.availBalance - units), invalid: c.units > Math.max(0, c.availBalance - units) } : c)),
        (x) => x.barcode,
        pinnedBarcodes
      )
    );
    setIns((prev) =>
      reorderWithPins(prev.map((c) => (c === card ? { ...c, id: inserted.id } : c)), (x) => x.barcode, pinnedBarcodes)
    );
  }

  async function deleteStockIn(card: InCard) {
    if (card.id > 0) {
      const { data: row } = await supabase.from("stock_in").select("id,units").eq("id", card.id).maybeSingle();
      await supabase.from("stock_in").delete().eq("id", card.id);

      const nb = await recomputeAndUpdateBalance(card.barcode);
      setOuts((prev) =>
        reorderWithPins(
          prev.map((c) => (c.barcode === card.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
          (x) => x.barcode,
          pinnedBarcodes
        )
      );

      if (row?.units) {
        const { data: existing } = await supabase
          .from("order_item")
          .select("id,units,drug_name,company,date,time")
          .eq("barcode", card.barcode)
          .maybeSingle();
        if (existing) {
          const added = num(existing.units) + num(row.units);
          await supabase.from("order_item").update({ units: added }).eq("id", existing.id);
          setOrders((prev) =>
            reorderWithPins(prev.map((o) => (o.barcode === card.barcode ? { ...o, units: added } : o)), (x) => x.barcode, pinnedBarcodes)
          );
        } else {
          const { data: bal } = await supabase.from("Balance").select("drug_name").eq("barcode", card.barcode).maybeSingle();
          const { date, time } = nowParts();
          const { data: insRow } = await supabase
            .from("order_item")
            .insert({
              barcode: card.barcode,
              drug_name: bal?.drug_name ?? card.drug_name,
              date,
              time,
              units: row.units,
              company: null,
            })
            .select("*")
            .single();
          if (insRow) {
            setOrders((prev) =>
              reorderWithPins(
                [{ id: insRow.id, barcode: insRow.barcode, drug_name: insRow.drug_name, units: insRow.units, company: insRow.company ?? "" }, ...prev],
                (x) => x.barcode,
                pinnedBarcodes
              )
            );
          }
        }
      }
    }
    setIns((prev) => reorderWithPins(prev.filter((c) => c !== card), (x) => x.barcode, pinnedBarcodes));
  }

  /** ---------- STOCK OUT helpers ---------- */

  // NEW: create a stock_out row immediately with units=1, then pin and hydrate card
  async function createStockOutNow(brow: BalanceRow) {
    const { date, time } = nowParts();

    // Insert into stock_out with default units = 1 (immediate DB write)
    const { data: inserted, error } = await supabase
      .from("stock_out")
      .insert({ barcode: brow.barcode, drug_name: brow.drug_name, date, time, units: 1 })
      .select("*")
      .single();

    if (error || !inserted) return;

    // Recompute Balance and update UI states
    const nb = await recomputeAndUpdateBalance(brow.barcode);

    // If already present in UI list, bump to top and refresh values; else add it
    setOuts((prev) => {
      const exists = prev.find((o) => o.barcode === brow.barcode && o.id === inserted.id);
      const nextCard: OutCard = {
        id: inserted.id,
        barcode: brow.barcode,
        drug_name: brow.drug_name,
        units: 1,
        lastCommitted: 1,
        availBalance: nb,
        invalid: 1 > nb,
      };
      const updated = exists
        ? prev.map((c) => (c.id === inserted.id ? nextCard : c))
        : [nextCard, ...prev];
      return reorderWithPins(updated, (x) => x.barcode, pinnedBarcodes);
    });

    // Also keep Balance list fresh (it will also be updated by realtime)
    setBalances((prev) =>
      reorderWithPins(
        prev.map((b) => (b.barcode === brow.barcode ? { ...b, balance: nb } : b)),
        (x) => x.barcode,
        pinnedBarcodes
      )
    );

    pinAndReorder(brow.barcode);
  }

  // Add by suggestion pick → now inserts immediately (units=1)
  async function addStockOutFromBalance(brow: BalanceRow) {
    // If there is already a *local* placeholder for same barcode (id <= 0), drop it
    setOuts((prev) => prev.filter((o) => !(o.barcode === brow.barcode && o.id <= 0)));
    await createStockOutNow(brow);
  }

  // Update units (validation: no units > balance)
  async function applyStockOut(card: OutCard, rawVal: string) {
    const typed = rawVal === "" ? 0 : Math.max(0, Number(rawVal) || 0);

    // reflect UI immediately
    setOuts((prev) =>
      reorderWithPins(
        prev.map((c) => (c === card ? { ...c, units: typed, invalid: typed > c.availBalance } : c)),
        (x) => x.barcode,
        pinnedBarcodes
      )
    );
    pinAndReorder(card.barcode);

    // If invalid, don't touch DB
    if (typed > card.availBalance) return;

    // Insert vs Update:
    if (card.id <= 0) {
      // should not generally happen now (we insert on add), but keep safe-guard
      const { date, time } = nowParts();
      if (typed <= 0) return;
      const { data: inserted, error } = await supabase
        .from("stock_out")
        .insert({ barcode: card.barcode, drug_name: card.drug_name, date, time, units: typed })
        .select("*")
        .single();
      if (error || !inserted) return;
      const nb = await recomputeAndUpdateBalance(card.barcode);
      setOuts((prev) =>
        reorderWithPins(
          prev.map((c) =>
            c === card ? { ...c, id: inserted.id, lastCommitted: typed, availBalance: nb, invalid: typed > nb } : c
          ),
          (x) => x.barcode,
          pinnedBarcodes
        )
      );
      return;
    }

    // Update existing row
    await supabase.from("stock_out").update({ units: typed }).eq("id", card.id);
    const nb = await recomputeAndUpdateBalance(card.barcode);
    setOuts((prev) =>
      reorderWithPins(
        prev.map((c) => (c === card ? { ...c, lastCommitted: typed, availBalance: nb, invalid: typed > nb } : c)),
        (x) => x.barcode,
        pinnedBarcodes
      )
    );
  }

  async function deleteStockOut(card: OutCard) {
    if (card.id > 0) {
      await supabase.from("stock_out").delete().eq("id", card.id);
      const nb = await recomputeAndUpdateBalance(card.barcode);
      setOuts((prev) =>
        reorderWithPins(
          prev.map((c) => (c === card ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
          (x) => x.barcode,
          pinnedBarcodes
        )
      );
    }
    setOuts((prev) => reorderWithPins(prev.filter((c) => c !== card), (x) => x.barcode, pinnedBarcodes));
  }

  /** ---------- Inputs handlers for suggestions ---------- */
  const orderPick = (row: BalanceRow) => onOrderSuggestPick(row);
  const inPick = (row: OrderRow) => {
    setShowInSuggest(false);
    setInQuery("");
    addStockInFromOrder(row);
    setTimeout(() => inInputRef.current?.focus(), 0);
  };
  const outPick = async (row: BalanceRow) => {
    setShowOutSuggest(false);
    setOutQuery("");
    await addStockOutFromBalance(row); // NOW inserts into DB with units=1
    setTimeout(() => outInputRef.current?.focus(), 0);
  };

  /** ---------- Render helpers ---------- */
  const renderSuggest = <T,>(
    items: T[],
    hover: number | null,
    onPick: (row: T) => void,
    onHover: (i: number | null) => void,
    getKey: (row: T, i: number) => string,
    getText: (row: T) => string
  ) => (
    <div style={styles.suggestBox}>
      {items.length === 0 ? (
        <div style={{ padding: 10, color: "#AAB3C0" }}>No matches</div>
      ) : (
        items.map((r, i) => (
          <div
            key={getKey(r, i)}
            style={{ ...styles.suggestItem, ...(hover === i ? styles.suggestItemHover : {}) }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onPick(r)}
          >
            {getText(r)}
          </div>
        ))
      )}
    </div>
  );

  /** ---------- JSX ---------- */
  return (
    <div style={styles.page}>
      {/* Power Search (global) */}
      <div style={styles.topBar}>
        <input
          style={styles.input}
          value={powerQuery}
          onChange={(e) => setPowerQuery(e.target.value)}
          placeholder="power search"
        />
      </div>

      <div style={styles.board}>
        {/* ----------- ORDER COLUMN ----------- */}
        <section style={styles.column}>
          <div style={styles.colHeader}>
            <div style={styles.colTitle}>Order</div>
            <div></div>
          </div>

          <div style={styles.inputWrap}>
            <input
              ref={orderInputRef}
              style={styles.input}
              value={orderQuery}
              onChange={(e) => {
                setOrderQuery(e.target.value);
                setShowOrderSuggest(true);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  await handleOrderEnter();
                }
              }}
              placeholder="Scan barcode or type to search Balance by name…"
              autoFocus
            />
            {showOrderSuggest &&
              renderSuggest(
                orderSuggest,
                orderHover,
                orderPick,
                setOrderHover,
                (r, i) => (r as any).barcode + "-" + i,
                (r) => (r as any).drug_name
              )}
          </div>

          <div style={styles.list}>
            {orders
              .filter((o) => nameMatchesGlobal(o.drug_name))
              .map((o) => (
                <div key={o.id} style={styles.card}>
                  <button style={styles.close} aria-label="Remove" onClick={() => deleteOrder(o)}>
                    ×
                  </button>
                  <div style={styles.drug}>{o.drug_name}</div>
                  <div style={styles.subStack}>
                    <div style={styles.fieldRow}>
                      <div style={styles.label}>Units</div>
                      <input
                        style={styles.smallInput}
                        value={o.units === 0 ? "" : String(o.units)}
                        inputMode="numeric"
                        onChange={(e) => setOrderUnits(o, e.target.value)}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div style={styles.fieldRow}>
                      <div style={styles.label}>Company</div>
                      <select style={styles.select} value={o.company || ""} onChange={(e) => setOrderCompany(o, e.target.value)}>
                        <option value="" disabled>
                          Select supplier…
                        </option>
                        {COMPANIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ----------- STOCK IN COLUMN ----------- */}
        <section style={styles.column}>
          <div style={styles.colHeader}>
            <div style={styles.colTitle}>Stock In</div>
            <div></div>
          </div>

          <div style={styles.inputWrap}>
            <input
              ref={inInputRef}
              style={styles.input}
              value={inQuery}
              onChange={(e) => {
                setInQuery(e.target.value);
                setShowInSuggest(true);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const raw = inQuery.trim();
                  if (!raw) return;
                  const { data: r } = await supabase.from("order_item").select("*").eq("barcode", raw).maybeSingle();
                  if (r) inPick(r as OrderRow);
                  setInQuery("");
                }
              }}
              placeholder="Scan barcode or search by name in current Order…"
            />
            {showInSuggest &&
              renderSuggest(
                inSuggest,
                inHover,
                inPick,
                setInHover,
                (r, i) => (r as any).id + "-" + i,
                (r) => (r as any).drug_name
              )}
          </div>

          <div style={styles.list}>
            {ins
              .filter((c) => nameMatchesGlobal(c.drug_name))
              .map((c) => (
                <div key={c.id} style={styles.card}>
                  <button style={styles.close} aria-label="Remove" onClick={() => deleteStockIn(c)}>
                    ×
                  </button>
                  <div style={styles.drug}>{c.drug_name}</div>
                  <div style={styles.subStack}>
                    <div style={styles.fieldRow}>
                      <div style={styles.label}>Units</div>
                      <input
                        style={styles.smallInput}
                        value={c.units === 0 ? "" : String(c.units)}
                        inputMode="numeric"
                        onChange={(e) => applyStockIn(c, e.target.value)}
                        placeholder="e.g. 3"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ----------- BALANCE COLUMN ----------- */}
        <section style={styles.column}>
          <div style={styles.colHeader}>
            <div style={styles.colTitle}>Balance</div>
            <div></div>
          </div>

          {/* Balance-only filter */}
          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              value={balanceQuery}
              onChange={(e) => setBalanceQuery(e.target.value)}
              placeholder="Filter drug name in Balance…"
            />
          </div>

          <div style={styles.list}>
            {balances
              .filter((b) => nameMatchesGlobal(b.drug_name)) // global power search
              .filter((b) => balanceNameMatches(b.drug_name)) // balance-only filter
              .map((b) => (
                <div key={b.barcode} style={styles.card}>
                  <div style={styles.drug}>{b.drug_name}</div>
                  <div style={styles.fieldRow}>
                    <div style={styles.label}>Balance</div>
                    <div style={styles.balancePill}>{b.balance}</div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ----------- STOCK OUT COLUMN ----------- */}
        <section style={styles.column}>
          <div style={styles.colHeader}>
            <div style={styles.colTitle}>Stock Out</div>
            <div></div>
          </div>

          <div style={styles.inputWrap}>
            <input
              ref={outInputRef}
              style={styles.input}
              value={outQuery}
              onChange={(e) => {
                setOutQuery(e.target.value);
                setShowOutSuggest(true);
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const raw = outQuery.trim();
                  if (!raw) return;

                  // Try barcode exact first
                  const { data: byCode } = await supabase
                    .from("Balance")
                    .select("*")
                    .eq("barcode", raw)
                    .maybeSingle();

                  if (byCode) {
                    await outPick(byCode as BalanceRow); // NOW inserts into DB with units=1
                    setOutQuery("");
                    return;
                  }

                  // Fallback: match by drug_name (first alphabetical hit)
                  const { data: byName } = await supabase
                    .from("Balance")
                    .select("*")
                    .ilike("drug_name", `%${raw}%`)
                    .order("drug_name", { ascending: true })
                    .limit(1)
                    .maybeSingle();

                  if (byName) {
                    await outPick(byName as BalanceRow); // NOW inserts into DB with units=1
                  }
                  setOutQuery("");
                }
              }}
              placeholder="Scan barcode or type drug name… (Enter to add & insert with units=1)"
            />
            {showOutSuggest &&
              renderSuggest(
                outSuggest,
                outHover,
                outPick, // pick = inserts with units=1
                setOutHover,
                (r, i) => (r as any).barcode + "-" + i,
                (r) => (r as any).drug_name
              )}
          </div>

          <div style={styles.list}>
            {outs
              .filter((c) => nameMatchesGlobal(c.drug_name))
              .map((c) => (
                <div key={c.id} style={styles.card}>
                  <button style={styles.close} aria-label="Remove" onClick={() => deleteStockOut(c)}>
                    ×
                  </button>
                  <div style={styles.drug}>{c.drug_name}</div>
                  <div style={styles.subStack}>
                    <div style={styles.fieldRow}>
                      <div style={styles.label}>Units</div>
                      <input
                        style={c.invalid ? styles.smallInputError : styles.smallInput}
                        value={String(c.units)}              // defaults to 1 on creation (DB)
                        inputMode="numeric"
                        onChange={(e) => applyStockOut(c, e.target.value)}
                        placeholder="e.g. 2"
                      />
                    </div>
                    {/* balance display intentionally removed */}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// type BalanceRow = {
//   barcode: string;
//   drug_name: string;
//   balance: number | string | null;
// };

// type TableItem = {
//   barcode: string;
//   drug_name: string;
//   units: string;       // user enters manually
//   balance: number;     // numeric current balance from DB
//   company: string;     // dropdown selection
// };

// const COMPANY_OPTIONS = ["AAH", "Alliance", "Medihealth", "Phoenix", "Special"]; // alphabetical

// const styles: Record<string, CSSProperties> = {
//   page: {
//     background: "#121212",
//     minHeight: "100vh",
//     color: "#EEE",
//     padding: "2rem",
//     fontFamily: "Segoe UI, sans-serif",
//   },
//   card: {
//     maxWidth: 1000,
//     margin: "0 auto",
//     padding: "1.5rem",
//     background: "#1E1E1E",
//     borderRadius: 12,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//   },
//   title: { color: "#4A90E2", fontSize: "1.6rem", marginBottom: "1rem", fontWeight: 700 },

//   actionsRow: { display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" },
//   stockInBtn: {
//     background: "#1976D2", color: "#FFF", border: "none", borderRadius: 8,
//     padding: "0.6rem 0.9rem", cursor: "pointer", fontSize: "1rem",
//   },
//   stockOutBtn: {
//     background: "#D32F2F", color: "#FFF", border: "none", borderRadius: 8,
//     padding: "0.6rem 0.9rem", cursor: "pointer", fontSize: "1rem",
//   },
//   orderBtn: {
//     background: "#00FF7F", color: "#000", border: "none", borderRadius: 8,
//     padding: "0.6rem 0.9rem", cursor: "pointer", fontSize: "1rem", fontWeight: 700,
//     boxShadow: "0 0 0 2px rgba(0,0,0,0.15) inset",
//   },

//   label: { display: "block", fontWeight: 600, marginBottom: 6, marginTop: 6 },
//   inputRow: { position: "relative", display: "flex", gap: 8, alignItems: "center", marginBottom: 6 },
//   input: {
//     flex: 1, padding: "0.6rem 0.9rem", borderRadius: 8, border: "1px solid #333",
//     background: "#2A2A2A", color: "#EEE", fontSize: "1rem", outline: "none",
//   },
//   addBtn: {
//     padding: "0.6rem 0.9rem", borderRadius: 8, border: "none",
//     background: "#4A90E2", color: "#FFF", fontSize: "1rem", cursor: "pointer",
//   },

//   suggestBox: {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     right: 0,
//     marginTop: 6,
//     background: "#1C2230",
//     border: "1px solid #333",
//     borderRadius: 8,
//     overflow: "hidden",
//     zIndex: 5,
//     boxShadow: "0 8px 20px rgba(0,0,0,.35)",
//   },
  
//   suggestItem: {
//     padding: "0.55rem 0.9rem",
//     cursor: "pointer",
//     borderBottom: "1px solid #3a3a3a",
//   },
  
//   suggestItemHover: {
//     background: "#00FF7F", // bright green
//     color: "#000",         // black text
//     fontWeight: 600,
//   },
  
//   suggestEmpty: { padding: "0.55rem 0.9rem", color: "#AAA" },

//   hint: { marginTop: 8, minHeight: 22, fontSize: "0.95rem" },
//   error: { color: "#f66" },

//   tableWrap: { marginTop: 16, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" },
//   table: { width: "100%", borderCollapse: "collapse", background: "#FFF", color: "#222" },
//   th: {
//     background: "#4A90E2", color: "#FFF", textAlign: "left", padding: "0.8rem 1rem",
//     fontSize: "0.9rem", letterSpacing: "0.02em", textTransform: "uppercase",
//   },
//   td: { padding: "0.8rem 1rem", borderBottom: "1px solid #EEE", verticalAlign: "middle" },
//   unitsInput: {
//     width: 120, padding: "0.45rem 0.6rem", borderRadius: 6, border: "1px solid #CCC", fontSize: "0.95rem",
//   },
//   select: {
//     padding: "0.45rem 0.6rem", borderRadius: 6, border: "1px solid #CCC", fontSize: "0.95rem",
//     background: "#fff",
//   },
//   rowHighlight: { background: "#FFF8CC", transition: "background .6s" },
// };

// function useDebounced<T>(value: T, delay = 250) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id); }, [value, delay]);
//   return debounced;
// }

// export default function ScanToList() {
//   // Input (barcode or name fragment)
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounced(query.trim(), 200);

//   const [err, setErr] = useState<string | null>(null);
//   const [hint, setHint] = useState<string | null>("Scan a barcode or start typing a drug name.");
//   const [items, setItems] = useState<TableItem[]>([]);
//   const [highlightedBarcode, setHighlightedBarcode] = useState<string | null>(null);
//   const [pendingFocusBarcode, setPendingFocusBarcode] = useState<string | null>(null);
//   const [busy, setBusy] = useState<"in" | "out" | "order" | null>(null);

//   // Suggestions
//   const [suggestions, setSuggestions] = useState<BalanceRow[]>([]);
//   const [showSuggest, setShowSuggest] = useState(false);
//   const [hoverIndex, setHoverIndex] = useState<number | null>(null);

//   const unitRefs = useRef<Record<string, HTMLInputElement | null>>({});
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const highlightTimer = useRef<number | null>(null);
//   const suggestBoxRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => () => { if (highlightTimer.current) window.clearTimeout(highlightTimer.current); }, []);
//   const resetHighlightSoon = () => {
//     if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
//     highlightTimer.current = window.setTimeout(() => setHighlightedBarcode(null), 1000);
//   };

//   // Focus Units input after items render
//   useEffect(() => {
//     if (!pendingFocusBarcode) return;
//     requestAnimationFrame(() => {
//       const el = unitRefs.current[pendingFocusBarcode!];
//       if (el) {
//         el.focus();
//         el.select?.();
//         setHighlightedBarcode(pendingFocusBarcode);
//         resetHighlightSoon();
//       }
//       setPendingFocusBarcode(null);
//     });
//   }, [items, pendingFocusBarcode]);

//   // Suggestions: substring match anywhere in drug_name
//   useEffect(() => {
//     (async () => {
//       setErr(null);
//       if (!debouncedQuery || debouncedQuery.length < 2) {
//         setSuggestions([]);
//         setShowSuggest(false);
//         return;
//       }
//       try {
//         const { data, error } = await supabase
//           .from("Balance")
//           .select("barcode, drug_name, balance")
//           .ilike("drug_name", `%${debouncedQuery}%`)
//           .order("drug_name", { ascending: true })
//           .limit(8);
//         if (error) throw error;
//         setSuggestions(data || []);
//         setShowSuggest(true);
//         setHoverIndex(null);
//       } catch (e: any) {
//         setErr(e?.message ?? "Search failed.");
//         setSuggestions([]);
//         setShowSuggest(false);
//       }
//     })();
//   }, [debouncedQuery]);

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       if (!suggestBoxRef.current || !inputRef.current) return;
//       if (!suggestBoxRef.current.contains(e.target as Node) && !inputRef.current.contains(e.target as Node)) {
//         setShowSuggest(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   // Helpers
//   const coerceBalance = (v: number | string | null | undefined) => Number(v ?? 0) || 0;
//   const focusBarcodeBox = () => requestAnimationFrame(() => inputRef.current?.focus());

//   const addOrFocusRow = (row: BalanceRow) => {
//     const balanceNum = coerceBalance(row.balance);
//     const existing = items.find((r) => r.barcode === row.barcode);
//     if (existing) {
//       setPendingFocusBarcode(row.barcode);
//       return;
//     }
//     const newRow: TableItem = {
//       barcode: row.barcode,
//       drug_name: row.drug_name,
//       units: "",
//       balance: balanceNum,
//       company: "", // user must choose
//     };
//     setItems((prev) => [newRow, ...prev]);
//     setPendingFocusBarcode(row.barcode);
//   };

//   const lookupByBarcode = async (code: string) => {
//     setErr(null);
//     setHint(null);
//     if (!code) return;

//     try {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode, drug_name, balance")
//         .eq("barcode", code)
//         .maybeSingle<BalanceRow>();

//       if (error) throw error;
//       if (!data) {
//         setErr("No match found for that barcode.");
//         return;
//       }
//       addOrFocusRow(data);
//     } catch (e: any) {
//       setErr(e?.message ?? "Lookup failed.");
//     }
//   };

//   // Actions
//   const handleAdd = async () => {
//     const code = query.trim();
//     await lookupByBarcode(code); // Enter/Add prefers barcode path
//     setQuery("");
//     setShowSuggest(false);
//     focusBarcodeBox();
//   };

//   const handleSelectSuggestion = (row: BalanceRow) => {
//     setShowSuggest(false);
//     setQuery("");
//     addOrFocusRow(row);
//   };

//   const handleUnitsChange = (barcodeKey: string, value: string) => {
//     if (value === "" || /^[0-9]+$/.test(value)) {
//       setItems((prev) => prev.map((r) => (r.barcode === barcodeKey ? { ...r, units: value } : r)));
//     }
//   };

//   const handleCompanyChange = (barcodeKey: string, value: string) => {
//     setItems((prev) => prev.map((r) => (r.barcode === barcodeKey ? { ...r, company: value } : r)));
//   };

//   const nowParts = () => {
//     const d = new Date();
//     const pad = (n: number) => n.toString().padStart(2, "0");
//     return {
//       date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
//       time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
//     };
//   };

//   const getCurrentBalance = async (barcodeKey: string) => {
//     const { data, error } = await supabase
//       .from("Balance")
//       .select("balance")
//       .eq("barcode", barcodeKey)
//       .single<{ balance: number | string | null }>();
//     if (error) throw error;
//     return coerceBalance(data.balance);
//   };

//   const doCommitStock = async (mode: "in" | "out") => {
//     if (items.length === 0) return;

//     const missingUnits = items.filter((r) => r.units === "" || Number(r.units) <= 0);
//     if (missingUnits.length > 0) {
//       setErr("Please enter valid Units for all rows.");
//       return;
//     }

//     const confirmText =
//       mode === "in"
//         ? "Are you sure you want to add the scanned items to current stock?"
//         : "Are you sure you want to dispense the scanned items and take them away from current stock?";
//     if (!window.confirm(confirmText)) return;

//     setBusy(mode);
//     setErr(null);

//     const { date, time } = nowParts();

//     try {
//       // Insert into stock_in / stock_out (audit)
//       const rowsToInsert = items.map((r) => ({
//         drug_name: r.drug_name,
//         units: Number(r.units),
//         date,
//         time,
//       }));
//       const target = mode === "in" ? "stock_in" : "stock_out";
//       const { error: insErr } = await supabase.from(target).insert(rowsToInsert);
//       if (insErr) throw insErr;

//       // Update Balance.balance
//       for (const r of items) {
//         const delta = mode === "in" ? Number(r.units) : -Number(r.units);
//         const current = await getCurrentBalance(r.barcode);
//         const updated = current + delta;
//         const { error: upErr } = await supabase
//           .from("Balance")
//           .update({ balance: updated })
//           .eq("barcode", r.barcode);
//         if (upErr) throw upErr;
//       }

//       setItems([]);
//       setHint(mode === "in" ? "Stock in recorded successfully." : "Stock out recorded successfully.");
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to save changes.");
//     } finally {
//       setBusy(null);
//       focusBarcodeBox();
//     }
//   };

//   const doOrder = async () => {
//     if (items.length === 0) return;

//     const missingUnits = items.filter((r) => r.units === "" || Number(r.units) <= 0);
//     if (missingUnits.length > 0) {
//       setErr("Please enter valid Units for all rows.");
//       return;
//     }
//     const missingCompany = items.filter((r) => !r.company);
//     if (missingCompany.length > 0) {
//       setErr("Please choose a Company for all rows.");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to place this order?")) return;

//     setBusy("order");
//     setErr(null);

//     const { date, time } = nowParts();

//     try {
//       const rowsToInsert = items.map((r) => ({
//         barcode: r.barcode,
//         drug_name: r.drug_name,
//         date,
//         time,
//         units: Number(r.units),
//         company: r.company,
//       }));

//       const { error } = await supabase.from("order_item").insert(rowsToInsert);
//       if (error) throw error;

//       setItems([]);
//       setHint("Order recorded successfully.");
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to place order.");
//     } finally {
//       setBusy(null);
//       focusBarcodeBox();
//     }
//   };

//   // Keyboard helpers on input
//   const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAdd();
//       return;
//     }
//     if (e.key === "Escape") {
//       setShowSuggest(false);
//       return;
//     }
//     if ((e.key === "ArrowDown" || e.key === "ArrowUp") && showSuggest && suggestions.length > 0) {
//       e.preventDefault();
//       setHoverIndex((idx) => {
//         const next = idx === null ? 0 : (e.key === "ArrowDown" ? idx + 1 : idx - 1);
//         if (next < 0) return suggestions.length - 1;
//         if (next >= suggestions.length) return 0;
//         return next;
//       });
//     }
//     if (e.key === "Tab" && showSuggest && suggestions.length > 0 && hoverIndex !== null) {
//       e.preventDefault();
//       handleSelectSuggestion(suggestions[hoverIndex]);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Scan Items</h1>

//         {/* Action Buttons */}
//         <div style={styles.actionsRow}>
//           <button
//             type="button"
//             style={styles.orderBtn}
//             disabled={busy !== null || items.length === 0}
//             onClick={doOrder}
//             title="Insert rows into order_item"
//           >
//             {busy === "order" ? "Placing…" : "Order"}
//           </button>

//           <button
//             type="button"
//             style={styles.stockInBtn}
//             disabled={busy !== null || items.length === 0}
//             onClick={() => doCommitStock("in")}
//             title="Add scanned items to stock"
//           >
//             {busy === "in" ? "Saving…" : "Stock in"}
//           </button>
//           <button
//             type="button"
//             style={styles.stockOutBtn}
//             disabled={busy !== null || items.length === 0}
//             onClick={() => doCommitStock("out")}
//             title="Dispense and subtract from stock"
//           >
//             {busy === "out" ? "Saving…" : "Stock out"}
//           </button>
//         </div>

//         {/* Input + Suggestions */}
//         <label htmlFor="scan-input" style={styles.label}>Scan barcode or type drug name</label>
//         <div style={styles.inputRow}>
//           <input
//             id="scan-input"
//             ref={inputRef}
//             value={query}
//             onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
//             onKeyDown={onInputKeyDown}
//             placeholder="Scan barcode… or start typing a drug name"
//             style={styles.input}
//             autoFocus
//             inputMode="text"
//             autoComplete="off"
//           />
//           <button type="button" style={styles.addBtn} onClick={handleAdd}>Add</button>

//           {showSuggest && (
//             <div ref={suggestBoxRef} style={styles.suggestBox}>
//               {suggestions.length === 0 ? (
//                 <div style={styles.suggestEmpty}>No matches</div>
//               ) : (
//                 suggestions.map((s, i) => {
//                   const hovered = i === hoverIndex;
//                   return (
//                     <div
//                       key={`${s.barcode}-${i}`}
//                       style={{ ...styles.suggestItem, ...(hovered ? styles.suggestItemHover : {}) }}
//                       onMouseEnter={() => setHoverIndex(i)}
//                       onMouseLeave={() => setHoverIndex(null)}
//                       onClick={() => handleSelectSuggestion(s)}
//                       title={s.barcode}
//                     >
//                       {s.drug_name}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           )}
//         </div>

//         <div style={styles.hint}>
//           {err && <span style={styles.error}>{err}</span>}
//           {!err && hint && <span>{hint}</span>}
//         </div>

//         {/* Table */}
//         <div style={styles.tableWrap}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Drug Name</th>
//                 <th style={styles.th}>Units</th>
//                 <th style={styles.th}>Balance</th>
//                 <th style={styles.th}>Company</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((row) => {
//                 const isHighlighted = row.barcode === highlightedBarcode;
//                 return (
//                   <tr key={row.barcode} style={isHighlighted ? styles.rowHighlight : undefined}>
//                     <td style={styles.td}>{row.drug_name}</td>
//                     <td style={styles.td}>
//                       <input
//                         ref={(el) => (unitRefs.current[row.barcode] = el)}
//                         type="text"
//                         inputMode="numeric"
//                         value={row.units}
//                         onChange={(e) => handleUnitsChange(row.barcode, e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             e.preventDefault();
//                             inputRef.current?.focus();
//                           }
//                         }}
//                         placeholder="Enter units…"
//                         style={styles.unitsInput}
//                       />
//                     </td>
//                     <td style={styles.td}>{row.balance}</td>
//                     <td style={styles.td}>
//                       <select
//                         value={row.company}
//                         onChange={(e) => handleCompanyChange(row.barcode, e.target.value)}
//                         style={styles.select}
//                       >
//                         <option value="" disabled>
//                           Select supplier…
//                         </option>
//                         {COMPANY_OPTIONS.map((opt) => (
//                           <option key={opt} value={opt}>{opt}</option>
//                         ))}
//                       </select>
//                     </td>
//                   </tr>
//                 );
//               })}
//               {items.length === 0 && (
//                 <tr>
//                   <td style={styles.td} colSpan={4}>No items yet. Scan or search to add the first item.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState, CSSProperties } from "react";
// import supabase from "../../supabase";

// type BalanceRow = {
//   barcode: string;
//   drug_name: string;
//   balance: number;
// };

// type TableItem = {
//   barcode: string;
//   drug_name: string;
//   units: string;
//   balance: number;
// };

// const styles: Record<string, CSSProperties> = {
//   page: {
//     background: "#121212",
//     minHeight: "100vh",
//     color: "#EEE",
//     padding: "2rem",
//     fontFamily: "Segoe UI, sans-serif",
//   },
//   card: {
//     maxWidth: 900,
//     margin: "0 auto",
//     padding: "1.5rem",
//     background: "#1E1E1E",
//     borderRadius: 12,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
//   },
//   title: {
//     color: "#4A90E2",
//     fontSize: "1.6rem",
//     marginBottom: "1rem",
//     fontWeight: 700,
//   },
//   actionsRow: {
//     display: "flex",
//     gap: 12,
//     marginBottom: 10,
//     flexWrap: "wrap",
//   },
//   stockInBtn: {
//     background: "#1976D2",
//     color: "#FFF",
//     border: "none",
//     borderRadius: 8,
//     padding: "0.6rem 0.9rem",
//     cursor: "pointer",
//     fontSize: "1rem",
//   },
//   stockOutBtn: {
//     background: "#D32F2F",
//     color: "#FFF",
//     border: "none",
//     borderRadius: 8,
//     padding: "0.6rem 0.9rem",
//     cursor: "pointer",
//     fontSize: "1rem",
//   },
//   label: { display: "block", fontWeight: 600, marginBottom: 6, marginTop: 6 },
//   inputRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 6 },
//   input: {
//     flex: 1,
//     padding: "0.6rem 0.9rem",
//     borderRadius: 8,
//     border: "1px solid #333",
//     background: "#2A2A2A",
//     color: "#EEE",
//     fontSize: "1rem",
//     outline: "none",
//   },
//   addBtn: {
//     padding: "0.6rem 0.9rem",
//     borderRadius: 8,
//     border: "none",
//     background: "#4A90E2",
//     color: "#FFF",
//     fontSize: "1rem",
//     cursor: "pointer",
//   },
//   hint: { marginTop: 8, minHeight: 22, fontSize: "0.95rem" },
//   error: { color: "#f66" },

//   tableWrap: {
//     marginTop: 16,
//     borderRadius: 10,
//     overflow: "hidden",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     background: "#FFF",
//     color: "#222",
//   },
//   th: {
//     background: "#4A90E2",
//     color: "#FFF",
//     textAlign: "left",
//     padding: "0.8rem 1rem",
//     fontSize: "0.9rem",
//     letterSpacing: "0.02em",
//     textTransform: "uppercase",
//   },
//   td: { padding: "0.8rem 1rem", borderBottom: "1px solid #EEE", verticalAlign: "middle" },
//   unitsInput: {
//     width: 120,
//     padding: "0.45rem 0.6rem",
//     borderRadius: 6,
//     border: "1px solid #CCC",
//     fontSize: "0.95rem",
//   },
//   rowHighlight: {
//     background: "#FFF8CC",
//     transition: "background .6s",
//   },
// };

// export default function ScanToList() {
//   const [barcode, setBarcode] = useState("");
//   const [err, setErr] = useState<string | null>(null);
//   const [hint, setHint] = useState<string | null>("Scan or enter a barcode to begin.");
//   const [items, setItems] = useState<TableItem[]>([]);
//   const [highlightedBarcode, setHighlightedBarcode] = useState<string | null>(null);
//   const [pendingFocusBarcode, setPendingFocusBarcode] = useState<string | null>(null);
//   const [busy, setBusy] = useState<"in" | "out" | null>(null);

//   const unitRefs = useRef<Record<string, HTMLInputElement | null>>({});
//   const barcodeInputRef = useRef<HTMLInputElement | null>(null);
//   const highlightTimer = useRef<number | null>(null);

//   useEffect(() => {
//     return () => {
//       if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
//     };
//   }, []);

//   const resetHighlightSoon = () => {
//     if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
//     highlightTimer.current = window.setTimeout(() => setHighlightedBarcode(null), 1000);
//   };

//   useEffect(() => {
//     if (!pendingFocusBarcode) return;
//     requestAnimationFrame(() => {
//       const el = unitRefs.current[pendingFocusBarcode!];
//       if (el) {
//         el.focus();
//         el.select?.();
//         setHighlightedBarcode(pendingFocusBarcode);
//         resetHighlightSoon();
//       }
//       setPendingFocusBarcode(null);
//     });
//   }, [items, pendingFocusBarcode]);

//   const lookupBarcode = async (code: string) => {
//     setErr(null);
//     setHint(null);

//     if (!code) {
//       setHint("Type or scan a barcode, then press Enter.");
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode, drug_name, balance")
//         .eq("barcode", code)
//         .maybeSingle<BalanceRow>();

//       if (error) throw error;
//       if (!data) {
//         setErr("No match found for that barcode.");
//         return;
//       }

//       // Already exists? Just focus its Units input
//       const existing = items.find((r) => r.barcode === data.barcode);
//       if (existing) {
//         setPendingFocusBarcode(data.barcode);
//         return;
//       }

//       // Insert new row at the top
//       const newRow: TableItem = {
//         barcode: data.barcode,
//         drug_name: data.drug_name,
//         units: "",
//         balance: data.balance ?? 0,
//       };

//       setItems((prev) => [newRow, ...prev]);
//       setPendingFocusBarcode(data.barcode);
//     } catch (e: any) {
//       setErr(e?.message ?? "Lookup failed.");
//     }
//   };

//   const handleScan = async () => {
//     const code = barcode.trim();
//     await lookupBarcode(code);
//     setBarcode("");
//     requestAnimationFrame(() => barcodeInputRef.current?.focus());
//   };

//   const handleUnitsChange = (barcodeKey: string, value: string) => {
//     if (value === "" || /^[0-9]+$/.test(value)) {
//       setItems((prev) =>
//         prev.map((r) => (r.barcode === barcodeKey ? { ...r, units: value } : r))
//       );
//     }
//   };

//   const nowParts = () => {
//     const d = new Date();
//     const pad = (n: number) => n.toString().padStart(2, "0");
//     return {
//       date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
//       time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
//     };
//   };

//   const getCurrentBalance = async (barcodeKey: string) => {
//     const { data, error } = await supabase
//       .from("Balance")
//       .select("balance")
//       .eq("barcode", barcodeKey)
//       .single<Pick<BalanceRow, "balance">>();
//     if (error) throw error;
//     return data.balance ?? 0;
//   };

//   const doCommit = async (mode: "in" | "out") => {
//     if (items.length === 0) return;

//     const missing = items.filter((r) => r.units === "" || Number(r.units) <= 0);
//     if (missing.length > 0) {
//       setErr("Please enter valid Units for all rows.");
//       return;
//     }

//     const confirmText =
//       mode === "in"
//         ? "Are you sure you want to add the scanned items to current stock?"
//         : "Are you sure you want to dispense the scanned items and take them away from current stock?";
//     if (!window.confirm(confirmText)) return;

//     setBusy(mode);
//     setErr(null);

//     const { date, time } = nowParts();

//     try {
//       const rowsToInsert = items.map((r) => ({
//         drug_name: r.drug_name,
//         units: Number(r.units),
//         date,
//         time,
//       }));

//       // Insert into stock_in or stock_out
//       const target = mode === "in" ? "stock_in" : "stock_out";
//       const { error: insErr } = await supabase.from(target).insert(rowsToInsert);
//       if (insErr) throw insErr;

//       // Update balance column
//       for (const r of items) {
//         const delta = mode === "in" ? Number(r.units) : -Number(r.units);
//         const current = await getCurrentBalance(r.barcode);
//         const updated = current + delta;
//         const { error: upErr } = await supabase
//           .from("Balance")
//           .update({ balance: updated })
//           .eq("barcode", r.barcode);
//         if (upErr) throw upErr;
//       }

//       setItems([]);
//       setHint(
//         mode === "in"
//           ? "Stock in recorded successfully."
//           : "Stock out recorded successfully."
//       );
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to save changes.");
//     } finally {
//       setBusy(null);
//       requestAnimationFrame(() => barcodeInputRef.current?.focus());
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Scan Items</h1>

//         <div style={styles.actionsRow}>
//           <button
//             type="button"
//             style={styles.stockInBtn}
//             disabled={busy !== null || items.length === 0}
//             onClick={() => doCommit("in")}
//           >
//             {busy === "in" ? "Saving…" : "Stock in"}
//           </button>
//           <button
//             type="button"
//             style={styles.stockOutBtn}
//             disabled={busy !== null || items.length === 0}
//             onClick={() => doCommit("out")}
//           >
//             {busy === "out" ? "Saving…" : "Stock out"}
//           </button>
//         </div>

//         <label htmlFor="barcode" style={styles.label}>
//           Scan or enter barcode
//         </label>
//         <div style={styles.inputRow}>
//           <input
//             id="barcode"
//             ref={barcodeInputRef}
//             value={barcode}
//             onChange={(e) => setBarcode(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 handleScan();
//               }
//             }}
//             placeholder="e.g. 0123456789012"
//             style={styles.input}
//             autoFocus
//             inputMode="numeric"
//             autoComplete="off"
//           />
//           <button type="button" style={styles.addBtn} onClick={handleScan}>
//             Add
//           </button>
//         </div>

//         <div style={styles.hint}>
//           {err && <span style={styles.error}>{err}</span>}
//           {!err && hint && <span>{hint}</span>}
//         </div>

//         <div style={styles.tableWrap}>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Drug Name</th>
//                 <th style={styles.th}>Units</th>
//                 <th style={styles.th}>Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((row) => {
//                 const isHighlighted = row.barcode === highlightedBarcode;
//                 return (
//                   <tr key={row.barcode} style={isHighlighted ? styles.rowHighlight : undefined}>
//                     <td style={styles.td}>{row.drug_name}</td>
//                     <td style={styles.td}>
//                       <input
//                         ref={(el) => (unitRefs.current[row.barcode] = el)}
//                         type="text"
//                         inputMode="numeric"
//                         value={row.units}
//                         onChange={(e) => handleUnitsChange(row.barcode, e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             e.preventDefault();
//                             barcodeInputRef.current?.focus();
//                           }
//                         }}
//                         placeholder="Enter units…"
//                         style={styles.unitsInput}
//                       />
//                     </td>
//                     <td style={styles.td}>{row.balance ?? "—"}</td>
//                   </tr>
//                 );
//               })}
//               {items.length === 0 && (
//                 <tr>
//                   <td style={styles.td} colSpan={3}>
//                     No items yet. Scan a barcode to add the first item.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // // src/components/BarcodeSearch.tsx
// import React, { useEffect, useMemo, useState, CSSProperties } from "react";
// import supabase from "../../supabase";

// type BalanceRow = {
//   drug_name: string;
//   balance: number | string;
// };

// type Props = {
//   /** Optional: called when a row is found */
//   onFound?: (row: BalanceRow, barcode: string) => void;
//   /** Optional: autofocus the input (good for scanners) */
//   autoFocus?: boolean;
//   /** Optional: override styles */
//   stylesOverride?: Partial<typeof styles>;
// };

// function useDebounced<T>(value: T, delay = 250) {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return debounced;
// }

// const styles: Record<string, CSSProperties> = {
//   wrap: { maxWidth: 480, width: "100%" },
//   label: { display: "block", fontWeight: 600, marginBottom: 6 },
//   input: {
//     padding: "0.5rem 1rem",
//     borderRadius: 6,
//     border: "1px solid #333",
//     background: "#2A2A2A",
//     color: "#EEE",
//     fontSize: "1rem",
//     width: "100%",
//     boxSizing: "border-box",
//     outline: "none",
//   },
//   hint: { marginTop: 8, minHeight: 24, fontSize: "0.95rem" },
//   error: { color: "#f66" },
//   result: { fontWeight: 700 },
// };

// const BarcodeSearch: React.FC<Props> = ({ onFound, autoFocus = true, stylesOverride }) => {
//   const s = { ...styles, ...(stylesOverride || {}) };

//   const [barcode, setBarcode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const [row, setRow] = useState<BalanceRow | null>(null);

//   const debounced = useDebounced(barcode.trim(), 200);

//   const fetchRow = useMemo(
//     () => async (code: string) => {
//       if (!code) {
//         setRow(null);
//         setErr(null);
//         return;
//       }
//       setLoading(true);
//       setErr(null);
//       try {
//         const { data, error } = await supabase
//           .from("Balance")
//           .select("drug_name,balance")
//           .eq("barcode", code)
//           .maybeSingle();

//         if (error) throw error;

//         setRow(data);
//         if (data && onFound) onFound(data, code);
//       } catch (e: any) {
//         setRow(null);
//         setErr(e?.message ?? "Lookup failed");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [onFound]
//   );

//   useEffect(() => {
//     fetchRow(debounced);
//   }, [debounced, fetchRow]);

//   return (
//     <div style={s.wrap}>
//       <label htmlFor="barcode" style={s.label}>
//         Scan or enter barcode
//       </label>
//       <input
//         id="barcode"
//         autoFocus={autoFocus}
//         value={barcode}
//         onChange={(e) => setBarcode(e.target.value)}
//         onKeyDown={(e) => {
//           // Many scanners send Enter; prevent form submit in forms.
//           if (e.key === "Enter") e.preventDefault();
//         }}
//         placeholder="e.g. 0123456789012"
//         style={s.input}
//         inputMode="numeric"
//         autoComplete="off"
//       />
//       <div style={s.hint}>
//         {loading && <span>Searching…</span>}
//         {!loading && err && <span style={s.error}>{err}</span>}
//         {!loading && !err && row === null && debounced && <span>No match found.</span>}
//         {!loading && row && (
//           <span style={s.result}>
//             {row.drug_name} x {row.balance}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BarcodeSearch;
