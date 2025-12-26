
// import React, { useEffect, useRef, useState, CSSProperties } from "react";
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
//   units: number;          // current input value in the UI
//   lastCommitted: number;  // units last written to DB for this row
//   availBalance: number;   // current available balance for validation (not shown)
//   invalid?: boolean;      // UI flag when units > availBalance
// };

// type BalanceCard = {
//   barcode: string;
//   drug_name: string;
//   balance: number;
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
//   topBar: {
//     width: "60%",
//     margin: "0 auto 16px auto",
//   },
//   board: {
//     maxWidth: 1400,
//     margin: "0 auto",
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr 1fr 1fr", // 4 columns
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
//   smallInputError: {
//     width: 110,
//     border: "1px solid #e53935", // red
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
// const num = (v: any) => Number(v) || 0;

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
//   /* ---------- GLOBAL POWER SEARCH ---------- */
//   const [powerQuery, setPowerQuery] = useState("");

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

//   /* ---------- BALANCE COLUMN STATE ---------- */
//   const [balances, setBalances] = useState<BalanceCard[]>([]);
//   const [balanceQuery, setBalanceQuery] = useState(""); // Balance-only filter

//   /* ---------- STOCK OUT COLUMN STATE ---------- */
//   const [outQuery, setOutQuery] = useState("");
//   const [outSuggest, setOutSuggest] = useState<BalanceRow[]>([]);
//   const [outHover, setOutHover] = useState<number | null>(null);
//   const [showOutSuggest, setShowOutSuggest] = useState(false);
//   const [outs, setOuts] = useState<OutCard[]>([]);

//   /* ---------- PINNED BARCODES (stay at top across all columns) ---------- */
//   const [pinnedBarcodes, setPinnedBarcodes] = useState<Set<string>>(new Set());

//   const orderInputRef = useRef<HTMLInputElement | null>(null);
//   const inInputRef = useRef<HTMLInputElement | null>(null);
//   const outInputRef = useRef<HTMLInputElement | null>(null);

//   /** ---------- Reordering helpers (pins first, stable order) ---------- */
//   function reorderWithPins<T>(arr: T[], getBarcode: (t: T) => string, pins: Set<string>): T[] {
//     if (!arr?.length) return arr;
//     const pinned: T[] = [];
//     const rest: T[] = [];
//     for (const item of arr) {
//       (pins.has(getBarcode(item)) ? pinned : rest).push(item);
//     }
//     return [...pinned, ...rest];
//   }

//   function pinAndReorder(barcode: string) {
//     setPinnedBarcodes((prev) => {
//       const next = new Set(prev);
//       next.add(barcode);
//       setOrders((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
//       setIns((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
//       setOuts((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
//       setBalances((prevList) => reorderWithPins(prevList, (x) => x.barcode, next));
//       return next;
//     });
//   }

//   function applyPinOrderAll() {
//     setOrders((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
//     setIns((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
//     setOuts((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
//     setBalances((prev) => reorderWithPins(prev, (x) => x.barcode, pinnedBarcodes));
//   }

//   /** ---------- Filters ---------- */
//   const p = powerQuery.trim().toLowerCase();
//   const nameMatchesGlobal = (name: string) => (p ? name.toLowerCase().includes(p) : true);
//   const balanceNameMatches = (name: string) => {
//     const q = balanceQuery.trim().toLowerCase();
//     return q ? name.toLowerCase().includes(q) : true;
//   };

//   /** ---------- Load & Realtime: ORDER ---------- */
//   useEffect(() => {
//     async function loadOrders() {
//       const { data, error } = await supabase
//         .from("order_item")
//         .select("id, barcode, drug_name, units, company")
//         .gt("units", 0)
//         .order("id", { ascending: false });
//       if (!error && data) {
//         const mapped = data.map((r) => ({
//           id: r.id,
//           barcode: r.barcode,
//           drug_name: r.drug_name,
//           units: r.units ?? 0,
//           company: r.company ?? "",
//         }));
//         setOrders((prev) => reorderWithPins(mapped, (x) => x.barcode, pinnedBarcodes));
//       }
//     }

//     loadOrders();

//     const ch = supabase
//       .channel("order_item_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "order_item" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             const n = payload.new as any;
//             if ((n.units ?? 0) > 0) {
//               setOrders((prev) =>
//                 reorderWithPins(
//                   [
//                     {
//                       id: n.id,
//                       barcode: n.barcode,
//                       drug_name: n.drug_name,
//                       units: n.units ?? 0,
//                       company: n.company ?? "",
//                     },
//                     ...prev.filter((p) => p.id !== n.id),
//                   ],
//                   (x) => x.barcode,
//                   pinnedBarcodes
//                 )
//               );
//             }
//           } else if (payload.eventType === "UPDATE") {
//             const n = payload.new as any;
//             setOrders((prev) => {
//               const updated =
//                 (n.units ?? 0) <= 0
//                   ? prev.filter((p) => p.id !== n.id)
//                   : prev.map((p) =>
//                       p.id === n.id
//                         ? { ...p, units: n.units ?? 0, company: n.company ?? "" }
//                         : p
//                     );
//               return reorderWithPins(updated, (x) => x.barcode, pinnedBarcodes);
//             });
//           } else if (payload.eventType === "DELETE") {
//             const o = payload.old as any;
//             setOrders((prev) =>
//               reorderWithPins(prev.filter((p) => p.id !== o.id), (x) => x.barcode, pinnedBarcodes)
//             );
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch);
//     };
//   }, [pinnedBarcodes]);

//   /** ---------- Load & Realtime: STOCK IN ---------- */
//   useEffect(() => {
//     async function loadIns() {
//       const { data, error } = await supabase
//         .from("stock_in")
//         .select("id, barcode, drug_name, units")
//         .order("id", { ascending: false })
//         .limit(200);
//       if (!error && data) {
//         const mapped = data.map((r) => ({
//           id: r.id,
//           barcode: r.barcode,
//           drug_name: r.drug_name,
//           units: r.units ?? 0,
//         }));
//         setIns((prev) => reorderWithPins(mapped, (x) => x.barcode, pinnedBarcodes));
//       }
//     }

//     loadIns();

//     const ch = supabase
//       .channel("stock_in_changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "stock_in" }, async (payload) => {
//         const applyOrderDelta = async (barcode: string, delta: number) => {
//           if (delta === 0) return;
//           const { data: ord } = await supabase
//             .from("order_item")
//             .select("id, units, drug_name, company")
//             .eq("barcode", barcode)
//             .maybeSingle();

//           if (ord) {
//             const newUnits = Math.max(0, (Number(ord.units) || 0) - delta);
//             await supabase.from("order_item").update({ units: newUnits }).eq("id", ord.id);
//           }
//         };

//         if (payload.eventType === "INSERT") {
//           const n = payload.new as any;
//           setIns((prev) =>
//             reorderWithPins(
//               [{ id: n.id, barcode: n.barcode, drug_name: n.drug_name, units: n.units ?? 0 }, ...prev],
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//           const nb = await recomputeAndUpdateBalance(n.barcode);
//           setOuts((prev) =>
//             reorderWithPins(
//               prev.map((c) => (c.barcode === n.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//           await applyOrderDelta(n.barcode, Number(n.units) || 0);
//         } else if (payload.eventType === "UPDATE") {
//           const n = payload.new as any;
//           const o = payload.old as any;
//           const delta = (Number(n.units) || 0) - (Number(o.units) || 0);
//           setIns((prev) =>
//             reorderWithPins(
//               prev.map((c) => (c.id === n.id ? { ...c, units: n.units ?? 0 } : c)),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//           const nb = await recomputeAndUpdateBalance(n.barcode);
//           setOuts((prev) =>
//             reorderWithPins(
//               prev.map((c) => (c.barcode === n.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//           await applyOrderDelta(n.barcode, delta);
//         } else if (payload.eventType === "DELETE") {
//           const o = payload.old as any;
//           setIns((prev) =>
//             reorderWithPins(prev.filter((c) => c.id !== o.id), (x) => x.barcode, pinnedBarcodes)
//           );
//           const nb = await recomputeAndUpdateBalance(o.barcode);
//           setOuts((prev) =>
//             reorderWithPins(
//               prev.map((c) => (c.barcode === o.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//           await applyOrderDelta(o.barcode, -(Number(o.units) || 0));
//         }
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch);
//     };
//   }, [pinnedBarcodes]);

//   /** ---------- Load & Realtime: BALANCE ---------- */
//   useEffect(() => {
//     async function loadBalances() {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode, drug_name, balance")
//         .order("drug_name", { ascending: true });
//       if (!error && data) {
//         const mapped = data.map((r) => ({
//           barcode: r.barcode,
//           drug_name: r.drug_name,
//           balance: num(r.balance),
//         }));
//         setBalances((prev) => reorderWithPins(mapped, (x) => x.barcode, pinnedBarcodes));
//       }
//     }

//     loadBalances();

//     const ch = supabase
//       .channel("balance_changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "Balance" }, (payload) => {
//         if (payload.eventType === "INSERT") {
//           const n = payload.new as any;
//           setBalances((prev) =>
//             reorderWithPins(
//               [...prev, { barcode: n.barcode, drug_name: n.drug_name, balance: num(n.balance) }],
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//         } else if (payload.eventType === "UPDATE") {
//           const n = payload.new as any;
//           setBalances((prev) =>
//             reorderWithPins(
//               prev.map((b) =>
//                 b.barcode === n.barcode ? { ...b, drug_name: n.drug_name, balance: num(n.balance) } : b
//               ),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//           setOuts((prev) =>
//             reorderWithPins(
//               prev.map((c) =>
//                 c.barcode === n.barcode ? { ...c, availBalance: num(n.balance), invalid: c.units > num(n.balance) } : c
//               ),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//         } else if (payload.eventType === "DELETE") {
//           const o = payload.old as any;
//           setBalances((prev) =>
//             reorderWithPins(prev.filter((b) => b.barcode !== o.barcode), (x) => x.barcode, pinnedBarcodes)
//           );
//         }
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch);
//     };
//   }, [pinnedBarcodes]);

//   /** ---------- Load & Realtime: STOCK OUT ---------- */
//   useEffect(() => {
//     async function loadOuts() {
//       const { data, error } = await supabase
//         .from("stock_out")
//         .select("id, barcode, drug_name, units")
//         .order("id", { ascending: false })
//         .limit(200);
//       if (!error && data) {
//         const initial: OutCard[] = await Promise.all(
//           data.map(async (r) => {
//             const nb = await recomputeAndUpdateBalance(r.barcode);
//             return {
//               id: r.id,
//               barcode: r.barcode,
//               drug_name: r.drug_name,
//               units: r.units ?? 0,
//               lastCommitted: r.units ?? 0,
//               availBalance: nb,
//               invalid: (r.units ?? 0) > nb,
//             };
//           })
//         );
//         setOuts((prev) => reorderWithPins(initial, (x) => x.barcode, pinnedBarcodes));
//       }
//     }

//     loadOuts();

//     const ch = supabase
//       .channel("stock_out_changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "stock_out" }, async (payload) => {
//         if (payload.eventType === "INSERT") {
//           const n = payload.new as any;
//           const nb = await recomputeAndUpdateBalance(n.barcode);
//           setOuts((prev) =>
//             reorderWithPins(
//               [
//                 {
//                   id: n.id,
//                   barcode: n.barcode,
//                   drug_name: n.drug_name,
//                   units: n.units ?? 0,
//                   lastCommitted: n.units ?? 0,
//                   availBalance: nb,
//                   invalid: (n.units ?? 0) > nb,
//                 },
//                 ...prev,
//               ],
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//         } else if (payload.eventType === "UPDATE") {
//           const n = payload.new as any;
//           const nb = await recomputeAndUpdateBalance(n.barcode);
//           setOuts((prev) =>
//             reorderWithPins(
//               prev.map((c) =>
//                 c.id === n.id
//                   ? {
//                       ...c,
//                       units: n.units ?? 0,
//                       lastCommitted: n.units ?? 0,
//                       availBalance: nb,
//                       invalid: (n.units ?? 0) > nb,
//                     }
//                   : c
//               ),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//         } else if (payload.eventType === "DELETE") {
//           const o = payload.old as any;
//           const nb = await recomputeAndUpdateBalance(o.barcode);
//           setOuts((prev) =>
//             reorderWithPins(
//               prev
//                 .filter((c) => c.id !== o.id)
//                 .map((c) => (c.barcode === o.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
//               (x) => x.barcode,
//               pinnedBarcodes
//             )
//           );
//         }
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch);
//     };
//   }, [pinnedBarcodes]);

//   /** ---------- Suggestion fetchers ---------- */
//   // ORDER: search Balance by name fragment
//   useEffect(() => {
//     const q = orderQuery.trim();
//     if (q.length < 2) {
//       setOrderSuggest([]);
//       setShowOrderSuggest(false);
//       return;
//     }
//     (async () => {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode,drug_name,open_balance,balance")
//         .ilike("drug_name", `%${q}%`)
//         .order("drug_name", { ascending: true })
//         .limit(10);
//       if (!error) {
//         setOrderSuggest(data || []);
//         setShowOrderSuggest(true);
//         setOrderHover(null);
//       }
//     })();
//   }, [orderQuery]);

//   // STOCK IN: search current order_item list by name fragment
//   useEffect(() => {
//     const q = inQuery.trim();
//     if (q.length < 2) {
//       setInSuggest([]);
//       setShowInSuggest(false);
//       return;
//     }
//     (async () => {
//       const { data, error } = await supabase
//         .from("order_item")
//         .select("id,barcode,drug_name,date,time,units,company")
//         .ilike("drug_name", `%${q}%`)
//         .order("id", { ascending: false })
//         .limit(10);
//       if (!error) {
//         setInSuggest((data as any) || []);
//         setShowInSuggest(true);
//         setInHover(null);
//       }
//     })();
//   }, [inQuery]);

//   // STOCK OUT: search Balance by name fragment
//   useEffect(() => {
//     const q = outQuery.trim();
//     if (q.length < 2) {
//       setOutSuggest([]);
//       setShowOutSuggest(false);
//       return;
//     }
//     (async () => {
//       const { data, error } = await supabase
//         .from("Balance")
//         .select("barcode,drug_name,open_balance,balance")
//         .ilike("drug_name", `%${q}%`)
//         .order("drug_name", { ascending: true })
//         .limit(10);
//       if (!error) {
//         setOutSuggest(data || []);
//         setShowOutSuggest(true);
//         setOutHover(null);
//       }
//     })();
//   }, [outQuery]);

//   /** ---------- ORDER helpers ---------- */
//   async function upsertOrder(barcode: string) {
//     const { data: b } = await supabase.from("Balance").select("barcode,drug_name").eq("barcode", barcode).maybeSingle();
//     if (!b) return;
//     const existing = orders.find((o) => o.barcode === barcode);
//     if (existing) {
//       pinAndReorder(barcode);
//       return;
//     }

//     const { date, time } = nowParts();
//     const { data: inserted, error } = await supabase
//       .from("order_item")
//       .upsert(
//         {
//           barcode: b.barcode,
//           drug_name: b.drug_name,
//           date,
//           time,
//           units: 0,
//           company: null,
//         },
//         { onConflict: "barcode" }
//       )
//       .select("*")
//       .single();

//     if (!error && inserted) {
//       setOrders((prev) =>
//         reorderWithPins(
//           [{ id: inserted.id, barcode: inserted.barcode, drug_name: inserted.drug_name, units: inserted.units ?? 0, company: inserted.company ?? "" }, ...prev.filter((p) => p.barcode !== inserted.barcode)],
//           (x) => x.barcode,
//           pinnedBarcodes
//         )
//       );
//       pinAndReorder(barcode);
//     }
//   }

//   async function onOrderSuggestPick(row: BalanceRow) {
//     setShowOrderSuggest(false);
//     setOrderQuery("");
//     await upsertOrder(row.barcode);
//     pinAndReorder(row.barcode);
//     setTimeout(() => orderInputRef.current?.focus(), 0);
//   }

//   async function handleOrderEnter() {
//     const raw = orderQuery.trim();
//     if (!raw) return;
//     const { data: byCode } = await supabase.from("Balance").select("barcode").eq("barcode", raw).maybeSingle();
//     if (byCode?.barcode) {
//       await upsertOrder(byCode.barcode);
//       pinAndReorder(byCode.barcode);
//     }
//     setOrderQuery("");
//   }

//   async function setOrderUnits(card: OrderCard, val: string) {
//     const units = val === "" ? 0 : Math.max(0, Number(val) || 0);
//     setOrders((prev) =>
//       reorderWithPins(prev.map((o) => (o.id === card.id ? { ...o, units } : o)), (x) => x.barcode, pinnedBarcodes)
//     );
//     pinAndReorder(card.barcode); // keep pinned on change
//     await supabase.from("order_item").update({ units }).eq("id", card.id);
//   }

//   async function setOrderCompany(card: OrderCard, company: string) {
//     setOrders((prev) =>
//       reorderWithPins(prev.map((o) => (o.id === card.id ? { ...o, company } : o)), (x) => x.barcode, pinnedBarcodes)
//     );
//     pinAndReorder(card.barcode);
//     await supabase.from("order_item").update({ company }).eq("id", card.id);
//   }

//   async function deleteOrder(card: OrderCard) {
//     setOrders((prev) =>
//       reorderWithPins(prev.filter((o) => o.id !== card.id), (x) => x.barcode, pinnedBarcodes)
//     );
//     await supabase.from("order_item").delete().eq("id", card.id);
//   }

//   /** ---------- STOCK IN helpers ---------- */
//   async function addStockInFromOrder(orow: OrderRow) {
//     const exists = ins.find((i) => i.barcode === orow.barcode);
//     if (exists) {
//       pinAndReorder(orow.barcode);
//       return;
//     }
//     setIns((prev) =>
//       reorderWithPins(
//         [{ id: -Date.now(), barcode: orow.barcode, drug_name: orow.drug_name, units: 0 }, ...prev],
//         (x) => x.barcode,
//         pinnedBarcodes
//       )
//     );
//     pinAndReorder(orow.barcode);
//   }

//   async function applyStockIn(card: InCard, rawVal: string) {
//     const units = rawVal === "" ? 0 : Math.max(0, Number(rawVal) || 0);
//     setIns((prev) =>
//       reorderWithPins(prev.map((c) => (c === card ? { ...c, units } : c)), (x) => x.barcode, pinnedBarcodes)
//     );
//     pinAndReorder(card.barcode);
//     if (units <= 0) return;

//     const { date, time } = nowParts();

//     const { data: inserted, error } = await supabase
//       .from("stock_in")
//       .insert({ barcode: card.barcode, drug_name: card.drug_name, date, time, units })
//       .select("*")
//       .single();
//     if (error) return;

//     const { data: orderRow } = await supabase.from("order_item").select("id,units").eq("barcode", card.barcode).maybeSingle();

//     if (orderRow) {
//       const left = Math.max(0, num(orderRow.units) - units);
//       if (left === 0) {
//         await supabase.from("order_item").delete().eq("id", orderRow.id);
//         setOrders((prev) =>
//           reorderWithPins(prev.filter((o) => o.barcode !== card.barcode), (x) => x.barcode, pinnedBarcodes)
//         );
//       } else {
//         await supabase.from("order_item").update({ units: left }).eq("id", orderRow.id);
//         setOrders((prev) =>
//           reorderWithPins(prev.map((o) => (o.barcode === card.barcode ? { ...o, units: left } : o)), (x) => x.barcode, pinnedBarcodes)
//         );
//       }
//     }

//     await recomputeAndUpdateBalance(card.barcode);
//     setOuts((prev) =>
//       reorderWithPins(
//         prev.map((c) => (c.barcode === card.barcode ? { ...c, availBalance: Math.max(0, c.availBalance - units), invalid: c.units > Math.max(0, c.availBalance - units) } : c)),
//         (x) => x.barcode,
//         pinnedBarcodes
//       )
//     );
//     setIns((prev) =>
//       reorderWithPins(prev.map((c) => (c === card ? { ...c, id: inserted.id } : c)), (x) => x.barcode, pinnedBarcodes)
//     );
//   }

//   async function deleteStockIn(card: InCard) {
//     if (card.id > 0) {
//       const { data: row } = await supabase.from("stock_in").select("id,units").eq("id", card.id).maybeSingle();
//       await supabase.from("stock_in").delete().eq("id", card.id);

//       const nb = await recomputeAndUpdateBalance(card.barcode);
//       setOuts((prev) =>
//         reorderWithPins(
//           prev.map((c) => (c.barcode === card.barcode ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
//           (x) => x.barcode,
//           pinnedBarcodes
//         )
//       );

//       if (row?.units) {
//         const { data: existing } = await supabase
//           .from("order_item")
//           .select("id,units,drug_name,company,date,time")
//           .eq("barcode", card.barcode)
//           .maybeSingle();
//         if (existing) {
//           const added = num(existing.units) + num(row.units);
//           await supabase.from("order_item").update({ units: added }).eq("id", existing.id);
//           setOrders((prev) =>
//             reorderWithPins(prev.map((o) => (o.barcode === card.barcode ? { ...o, units: added } : o)), (x) => x.barcode, pinnedBarcodes)
//           );
//         } else {
//           const { data: bal } = await supabase.from("Balance").select("drug_name").eq("barcode", card.barcode).maybeSingle();
//           const { date, time } = nowParts();
//           const { data: insRow } = await supabase
//             .from("order_item")
//             .insert({
//               barcode: card.barcode,
//               drug_name: bal?.drug_name ?? card.drug_name,
//               date,
//               time,
//               units: row.units,
//               company: null,
//             })
//             .select("*")
//             .single();
//           if (insRow) {
//             setOrders((prev) =>
//               reorderWithPins(
//                 [{ id: insRow.id, barcode: insRow.barcode, drug_name: insRow.drug_name, units: insRow.units, company: insRow.company ?? "" }, ...prev],
//                 (x) => x.barcode,
//                 pinnedBarcodes
//               )
//             );
//           }
//         }
//       }
//     }
//     setIns((prev) => reorderWithPins(prev.filter((c) => c !== card), (x) => x.barcode, pinnedBarcodes));
//   }

//   /** ---------- STOCK OUT helpers ---------- */

//   // NEW: create a stock_out row immediately with units=1, then pin and hydrate card
//   async function createStockOutNow(brow: BalanceRow) {
//     const { date, time } = nowParts();

//     // Insert into stock_out with default units = 1 (immediate DB write)
//     const { data: inserted, error } = await supabase
//       .from("stock_out")
//       .insert({ barcode: brow.barcode, drug_name: brow.drug_name, date, time, units: 1 })
//       .select("*")
//       .single();

//     if (error || !inserted) return;

//     // Recompute Balance and update UI states
//     const nb = await recomputeAndUpdateBalance(brow.barcode);

//     // If already present in UI list, bump to top and refresh values; else add it
//     setOuts((prev) => {
//       const exists = prev.find((o) => o.barcode === brow.barcode && o.id === inserted.id);
//       const nextCard: OutCard = {
//         id: inserted.id,
//         barcode: brow.barcode,
//         drug_name: brow.drug_name,
//         units: 1,
//         lastCommitted: 1,
//         availBalance: nb,
//         invalid: 1 > nb,
//       };
//       const updated = exists
//         ? prev.map((c) => (c.id === inserted.id ? nextCard : c))
//         : [nextCard, ...prev];
//       return reorderWithPins(updated, (x) => x.barcode, pinnedBarcodes);
//     });

//     // Also keep Balance list fresh (it will also be updated by realtime)
//     setBalances((prev) =>
//       reorderWithPins(
//         prev.map((b) => (b.barcode === brow.barcode ? { ...b, balance: nb } : b)),
//         (x) => x.barcode,
//         pinnedBarcodes
//       )
//     );

//     pinAndReorder(brow.barcode);
//   }

//   // Add by suggestion pick → now inserts immediately (units=1)
//   async function addStockOutFromBalance(brow: BalanceRow) {
//     // If there is already a *local* placeholder for same barcode (id <= 0), drop it
//     setOuts((prev) => prev.filter((o) => !(o.barcode === brow.barcode && o.id <= 0)));
//     await createStockOutNow(brow);
//   }

//   // Update units (validation: no units > balance)
//   async function applyStockOut(card: OutCard, rawVal: string) {
//     const typed = rawVal === "" ? 0 : Math.max(0, Number(rawVal) || 0);

//     // reflect UI immediately
//     setOuts((prev) =>
//       reorderWithPins(
//         prev.map((c) => (c === card ? { ...c, units: typed, invalid: typed > c.availBalance } : c)),
//         (x) => x.barcode,
//         pinnedBarcodes
//       )
//     );
//     pinAndReorder(card.barcode);

//     // If invalid, don't touch DB
//     if (typed > card.availBalance) return;

//     // Insert vs Update:
//     if (card.id <= 0) {
//       // should not generally happen now (we insert on add), but keep safe-guard
//       const { date, time } = nowParts();
//       if (typed <= 0) return;
//       const { data: inserted, error } = await supabase
//         .from("stock_out")
//         .insert({ barcode: card.barcode, drug_name: card.drug_name, date, time, units: typed })
//         .select("*")
//         .single();
//       if (error || !inserted) return;
//       const nb = await recomputeAndUpdateBalance(card.barcode);
//       setOuts((prev) =>
//         reorderWithPins(
//           prev.map((c) =>
//             c === card ? { ...c, id: inserted.id, lastCommitted: typed, availBalance: nb, invalid: typed > nb } : c
//           ),
//           (x) => x.barcode,
//           pinnedBarcodes
//         )
//       );
//       return;
//     }

//     // Update existing row
//     await supabase.from("stock_out").update({ units: typed }).eq("id", card.id);
//     const nb = await recomputeAndUpdateBalance(card.barcode);
//     setOuts((prev) =>
//       reorderWithPins(
//         prev.map((c) => (c === card ? { ...c, lastCommitted: typed, availBalance: nb, invalid: typed > nb } : c)),
//         (x) => x.barcode,
//         pinnedBarcodes
//       )
//     );
//   }

//   async function deleteStockOut(card: OutCard) {
//     if (card.id > 0) {
//       await supabase.from("stock_out").delete().eq("id", card.id);
//       const nb = await recomputeAndUpdateBalance(card.barcode);
//       setOuts((prev) =>
//         reorderWithPins(
//           prev.map((c) => (c === card ? { ...c, availBalance: nb, invalid: c.units > nb } : c)),
//           (x) => x.barcode,
//           pinnedBarcodes
//         )
//       );
//     }
//     setOuts((prev) => reorderWithPins(prev.filter((c) => c !== card), (x) => x.barcode, pinnedBarcodes));
//   }

//   /** ---------- Inputs handlers for suggestions ---------- */
//   const orderPick = (row: BalanceRow) => onOrderSuggestPick(row);
//   const inPick = (row: OrderRow) => {
//     setShowInSuggest(false);
//     setInQuery("");
//     addStockInFromOrder(row);
//     setTimeout(() => inInputRef.current?.focus(), 0);
//   };
//   const outPick = async (row: BalanceRow) => {
//     setShowOutSuggest(false);
//     setOutQuery("");
//     await addStockOutFromBalance(row); // NOW inserts into DB with units=1
//     setTimeout(() => outInputRef.current?.focus(), 0);
//   };

//   /** ---------- Render helpers ---------- */
//   const renderSuggest = <T,>(
//     items: T[],
//     hover: number | null,
//     onPick: (row: T) => void,
//     onHover: (i: number | null) => void,
//     getKey: (row: T, i: number) => string,
//     getText: (row: T) => string
//   ) => (
//     <div style={styles.suggestBox}>
//       {items.length === 0 ? (
//         <div style={{ padding: 10, color: "#AAB3C0" }}>No matches</div>
//       ) : (
//         items.map((r, i) => (
//           <div
//             key={getKey(r, i)}
//             style={{ ...styles.suggestItem, ...(hover === i ? styles.suggestItemHover : {}) }}
//             onMouseEnter={() => onHover(i)}
//             onMouseLeave={() => onHover(null)}
//             onClick={() => onPick(r)}
//           >
//             {getText(r)}
//           </div>
//         ))
//       )}
//     </div>
//   );

//   /** ---------- JSX ---------- */
//   return (
//     <div style={styles.page}>
//       {/* Power Search (global) */}
//       <div style={styles.topBar}>
//         <input
//           style={styles.input}
//           value={powerQuery}
//           onChange={(e) => setPowerQuery(e.target.value)}
//           placeholder="power search"
//         />
//       </div>

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
//               onChange={(e) => {
//                 setOrderQuery(e.target.value);
//                 setShowOrderSuggest(true);
//               }}
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   await handleOrderEnter();
//                 }
//               }}
//               placeholder="Scan barcode or type to search Balance by name…"
//               autoFocus
//             />
//             {showOrderSuggest &&
//               renderSuggest(
//                 orderSuggest,
//                 orderHover,
//                 orderPick,
//                 setOrderHover,
//                 (r, i) => (r as any).barcode + "-" + i,
//                 (r) => (r as any).drug_name
//               )}
//           </div>

//           <div style={styles.list}>
//             {orders
//               .filter((o) => nameMatchesGlobal(o.drug_name))
//               .map((o) => (
//                 <div key={o.id} style={styles.card}>
//                   <button style={styles.close} aria-label="Remove" onClick={() => deleteOrder(o)}>
//                     ×
//                   </button>
//                   <div style={styles.drug}>{o.drug_name}</div>
//                   <div style={styles.subStack}>
//                     <div style={styles.fieldRow}>
//                       <div style={styles.label}>Units</div>
//                       <input
//                         style={styles.smallInput}
//                         value={o.units === 0 ? "" : String(o.units)}
//                         inputMode="numeric"
//                         onChange={(e) => setOrderUnits(o, e.target.value)}
//                         placeholder="e.g. 5"
//                       />
//                     </div>
//                     <div style={styles.fieldRow}>
//                       <div style={styles.label}>Company</div>
//                       <select style={styles.select} value={o.company || ""} onChange={(e) => setOrderCompany(o, e.target.value)}>
//                         <option value="" disabled>
//                           Select supplier…
//                         </option>
//                         {COMPANIES.map((c) => (
//                           <option key={c} value={c}>
//                             {c}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               ))}
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
//               onChange={(e) => {
//                 setInQuery(e.target.value);
//                 setShowInSuggest(true);
//               }}
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const raw = inQuery.trim();
//                   if (!raw) return;
//                   const { data: r } = await supabase.from("order_item").select("*").eq("barcode", raw).maybeSingle();
//                   if (r) inPick(r as OrderRow);
//                   setInQuery("");
//                 }
//               }}
//               placeholder="Scan barcode or search by name in current Order…"
//             />
//             {showInSuggest &&
//               renderSuggest(
//                 inSuggest,
//                 inHover,
//                 inPick,
//                 setInHover,
//                 (r, i) => (r as any).id + "-" + i,
//                 (r) => (r as any).drug_name
//               )}
//           </div>

//           <div style={styles.list}>
//             {ins
//               .filter((c) => nameMatchesGlobal(c.drug_name))
//               .map((c) => (
//                 <div key={c.id} style={styles.card}>
//                   <button style={styles.close} aria-label="Remove" onClick={() => deleteStockIn(c)}>
//                     ×
//                   </button>
//                   <div style={styles.drug}>{c.drug_name}</div>
//                   <div style={styles.subStack}>
//                     <div style={styles.fieldRow}>
//                       <div style={styles.label}>Units</div>
//                       <input
//                         style={styles.smallInput}
//                         value={c.units === 0 ? "" : String(c.units)}
//                         inputMode="numeric"
//                         onChange={(e) => applyStockIn(c, e.target.value)}
//                         placeholder="e.g. 3"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </section>

//         {/* ----------- BALANCE COLUMN ----------- */}
//         <section style={styles.column}>
//           <div style={styles.colHeader}>
//             <div style={styles.colTitle}>Balance</div>
//             <div></div>
//           </div>

//           {/* Balance-only filter */}
//           <div style={styles.inputWrap}>
//             <input
//               style={styles.input}
//               value={balanceQuery}
//               onChange={(e) => setBalanceQuery(e.target.value)}
//               placeholder="Filter drug name in Balance…"
//             />
//           </div>

//           <div style={styles.list}>
//             {balances
//               .filter((b) => nameMatchesGlobal(b.drug_name)) // global power search
//               .filter((b) => balanceNameMatches(b.drug_name)) // balance-only filter
//               .map((b) => (
//                 <div key={b.barcode} style={styles.card}>
//                   <div style={styles.drug}>{b.drug_name}</div>
//                   <div style={styles.fieldRow}>
//                     <div style={styles.label}>Balance</div>
//                     <div style={styles.balancePill}>{b.balance}</div>
//                   </div>
//                 </div>
//               ))}
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
//               onChange={(e) => {
//                 setOutQuery(e.target.value);
//                 setShowOutSuggest(true);
//               }}
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   const raw = outQuery.trim();
//                   if (!raw) return;

//                   // Try barcode exact first
//                   const { data: byCode } = await supabase
//                     .from("Balance")
//                     .select("*")
//                     .eq("barcode", raw)
//                     .maybeSingle();

//                   if (byCode) {
//                     await outPick(byCode as BalanceRow); // NOW inserts into DB with units=1
//                     setOutQuery("");
//                     return;
//                   }

//                   // Fallback: match by drug_name (first alphabetical hit)
//                   const { data: byName } = await supabase
//                     .from("Balance")
//                     .select("*")
//                     .ilike("drug_name", `%${raw}%`)
//                     .order("drug_name", { ascending: true })
//                     .limit(1)
//                     .maybeSingle();

//                   if (byName) {
//                     await outPick(byName as BalanceRow); // NOW inserts into DB with units=1
//                   }
//                   setOutQuery("");
//                 }
//               }}
//               placeholder="Scan barcode or type drug name… (Enter to add & insert with units=1)"
//             />
//             {showOutSuggest &&
//               renderSuggest(
//                 outSuggest,
//                 outHover,
//                 outPick, // pick = inserts with units=1
//                 setOutHover,
//                 (r, i) => (r as any).barcode + "-" + i,
//                 (r) => (r as any).drug_name
//               )}
//           </div>

//           <div style={styles.list}>
//             {outs
//               .filter((c) => nameMatchesGlobal(c.drug_name))
//               .map((c) => (
//                 <div key={c.id} style={styles.card}>
//                   <button style={styles.close} aria-label="Remove" onClick={() => deleteStockOut(c)}>
//                     ×
//                   </button>
//                   <div style={styles.drug}>{c.drug_name}</div>
//                   <div style={styles.subStack}>
//                     <div style={styles.fieldRow}>
//                       <div style={styles.label}>Units</div>
//                       <input
//                         style={c.invalid ? styles.smallInputError : styles.smallInput}
//                         value={String(c.units)}              // defaults to 1 on creation (DB)
//                         inputMode="numeric"
//                         onChange={(e) => applyStockOut(c, e.target.value)}
//                         placeholder="e.g. 2"
//                       />
//                     </div>
//                     {/* balance display intentionally removed */}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// import supabase from "../../supabase";
// import { useEffect, useState } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";

// type PatientQR = {
//   qr_value: string;
//   patient_name: string;
// };

// export default function BarcodePage() {
//   const [patient, setPatient] = useState<PatientQR | null>(null);
//   const [step, setStep] = useState<"scan" | "confirm" | "options">("scan");

//   const [dob, setDob] = useState("");
//   const [address, setAddress] = useState("");
//   const [postcode, setPostcode] = useState("");
//   const [manualName, setManualName] = useState("");

//   useEffect(() => {
//     if (step !== "scan") return;

//     const scanner = new Html5QrcodeScanner(
//       "reader",
//       { fps: 10, qrbox: 250 },
//       false
//     );

//     scanner.render(
//       async (decodedText: string) => {
//         await scanner.clear();

//         const { data, error } = await supabase
//           .from("qrcode")
//           .select("qr_value, patient_name")
//           .eq("qr_value", decodedText)
//           .single();

//         if (error || !data) {
//           alert("QR code not recognised");
//           return;
//         }

//         setPatient(data);
//         setStep("confirm");
//       },
//       () => {
//         // ignore scan errors
//       }
//     );

//     return () => {
//       scanner.clear().catch(() => {});
//     };
//   }, [step]);

//   const handleManualSubmit = () => {
//     if (!manualName.trim()) return;
  
//     // Directly set patient without checking the table
//     setPatient({
//       qr_value: manualName.trim().replace(/ /g, "_"), // optional system-friendly value
//       patient_name: manualName.trim(),
//     });
//     setStep("confirm");
//   };
  

//   const submitChoice = async (choice: string) => {
//     if (!patient) return;

//     await supabase.from("checkins").insert({
//       qr_value: patient.qr_value,
//       patient_name: patient.patient_name,
//       dob_entered: dob,
//       address_entered: address,
//       postcode_entered: postcode,
//       option_selected: choice,
//     });

//     alert("Thank you. Please wait.");
//     window.location.reload();
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
//       {/* Step 1: Scan QR */}
//       {step === "scan" && (
//         <div
//           style={{
//             padding: 20,
//             borderRadius: 8,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             backgroundColor: "#fff",
//           }}
//         >
//           <h2 style={{ marginBottom: 20 }}>Scan your QR code</h2>
//           <div id="reader" style={{ margin: "0 auto 20px auto", width: 300 }} />
//           <p style={{ marginBottom: 10, color: "#555" }}>Or type your name:</p>
//           <div style={{ display: "flex", gap: 10 }}>
//           <input
//   type="text"
//   placeholder="Patient Name"
//   value={manualName}
//   onChange={(e) => setManualName(e.target.value)}
//   style={{
//     flex: 1,
//     padding: 8,
//     borderRadius: 4,
//     border: "1px solid #ccc",
//   }}
//   autoComplete="off"
//   autoCorrect="off"
//   spellCheck={false}
// />

//             <button
//               onClick={handleManualSubmit}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: 4,
//                 border: "none",
//                 backgroundColor: "#0070f3",
//                 color: "#fff",
//                 cursor: "pointer",
//               }}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Confirm */}
//       {step === "confirm" && patient && (
//         <div
//           style={{
//             padding: 20,
//             borderRadius: 8,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             backgroundColor: "#fff",
//           }}
//         >
//           <h2 style={{ marginBottom: 20 }}>Welcome {patient.patient_name}</h2>

//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             <input
//               placeholder="Date of Birth"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               style={inputStyle}
//             />
//             <input
//               placeholder="First line of address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               style={inputStyle}
//             />
//             <input
//               placeholder="Postcode"
//               value={postcode}
//               onChange={(e) => setPostcode(e.target.value)}
//               style={inputStyle}
//             />
//             <button
//               onClick={() => setStep("options")}
//               style={{ ...buttonStyle, marginTop: 10 }}
//             >
//               Continue
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 3: Choose option */}
//       {step === "options" && (
//         <div
//           style={{
//             padding: 20,
//             borderRadius: 8,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             backgroundColor: "#fff",
//           }}
//         >
//           <h2 style={{ marginBottom: 20 }}>Please choose one option</h2>

//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             <button
//               onClick={() => submitChoice("See Pharmacist")}
//               style={buttonStyle}
//             >
//               🧑‍⚕️ See Pharmacist
//             </button>
//             <button
//               onClick={() => submitChoice("Have Appointment")}
//               style={buttonStyle}
//             >
//               📅 Have Appointment
//             </button>
//             <button
//               onClick={() => submitChoice("Pick Up Medication")}
//               style={buttonStyle}
//             >
//               💊 Pick Up Medication
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const inputStyle: React.CSSProperties = {
//   padding: 8,
//   borderRadius: 4,
//   border: "1px solid #ccc",
//   width: "100%",
// };

// const buttonStyle: React.CSSProperties = {
//   padding: "10px 16px",
//   borderRadius: 4,
//   border: "none",
//   backgroundColor: "#0070f3",
//   color: "#fff",
//   cursor: "pointer",
// };
import supabase from "../../supabase";
import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type PatientQR = {
  qr_value: string;
  patient_name: string;
};

type PharmacistStatus = {
  pharmacist_work: boolean;
};

// Define options with colors matching CheckinsPage (keep at top)
const OPTIONS = [
  { label: "🧑‍⚕️ See Pharmacist", value: "See Pharmacist", color: "#0070f3" },
  { label: "📅 Have Appointment", value: "Have Appointment", color: "#00b894" },
  { label: "💊 Pick Up Medication", value: "Pick Up Medication", color: "#fdcb6e" },
  { label: "📦 Pick Up Blister Packs", value: "Pick Up Blister Packs", color: "#6c5ce7" },
  { label: "♻️ Return Unwanted Medication", value: "Return Unwanted Medication", color: "#d63031" },
  { label: "🚨 Emergency Supply", value: "Emergency Supply", color: "#e84393" },
];

export default function BarcodePage() {
  const [patient, setPatient] = useState<PatientQR | null>(null);
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [manualName, setManualName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [pharmacistStatus, setPharmacistStatus] = useState<boolean | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isProcessingBarcode, setIsProcessingBarcode] = useState(false);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const showForm = !!patient;

  // Auto-focus on patient name input when on first page
  useEffect(() => {
    if (!showForm && nameInputRef.current) {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [showForm]);

  // Handle barcode scanner input when typing in the name field
  useEffect(() => {
    const handleBarcodeInput = async () => {
      if (!manualName.trim() || isProcessingBarcode) return;

      // Check if input looks like a barcode/QR code value
      // Barcodes are often alphanumeric with underscores or other separators
      const barcodePattern = /^[a-zA-Z0-9_\-\.]+$/;
      
      // Check if input is likely a barcode (not a typical name with spaces)
      if (!manualName.includes(' ') && barcodePattern.test(manualName) && manualName.length > 5) {
        setIsProcessingBarcode(true);
        
        try {
          // Try to find patient by qr_value in the database
          const { data, error } = await supabase
            .from("qrcode")
            .select("qr_value, patient_name")
            .eq("qr_value", manualName.trim())
            .single();

          if (error || !data) {
            // If not found by qr_value, try searching by patient_name (case insensitive)
            const { data: nameData, error: nameError } = await supabase
              .from("qrcode")
              .select("qr_value, patient_name")
              .ilike("patient_name", `%${manualName.trim()}%`)
              .limit(1)
              .single();

            if (nameError || !nameData) {
              // Not a valid barcode, keep as manual name
              setIsProcessingBarcode(false);
              return;
            }

            // Found by name search
            setPatient(nameData);
            if (scannerRef.current && isCameraActive) {
              await scannerRef.current.clear();
              setIsCameraActive(false);
            }
            setManualName("");
          } else {
            // Found by qr_value
            setPatient(data);
            if (scannerRef.current && isCameraActive) {
              await scannerRef.current.clear();
              setIsCameraActive(false);
            }
            setManualName("");
          }
        } catch (error) {
          console.error("Error processing barcode:", error);
        } finally {
          setIsProcessingBarcode(false);
        }
      }
    };

    // Add a small delay to detect when user has finished typing/scanning
    const timer = setTimeout(handleBarcodeInput, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [manualName, isProcessingBarcode, isCameraActive]);

  // Check camera access on page load
  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } }});
        stream.getTracks().forEach(track => track.stop());
        setCameraAccess(true);
      } catch (error) {
        console.error("Camera access denied:", error);
        setCameraAccess(false);
      }
    };
    
    checkCameraAccess();
  }, []);

  // Fetch pharmacist status on page load
  useEffect(() => {
    const fetchPharmacistStatus = async () => {
      try {
        setIsLoadingStatus(true);
        const { data, error } = await supabase
          .from("pharmacist")
          .select("pharmacist_work")
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching pharmacist status:", error);
          setPharmacistStatus(null);
        } else {
          setPharmacistStatus(data?.pharmacist_work || false);
        }
      } catch (error) {
        console.error("Error fetching pharmacist status:", error);
        setPharmacistStatus(null);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchPharmacistStatus();
  }, []);

  // QR scanner - only initialize after camera check AND element is mounted
  useEffect(() => {
    if (cameraAccess === false) {
      console.log("Camera access denied, skipping scanner initialization");
      return;
    }

    if (cameraAccess !== true) return;

    const timer = setTimeout(() => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) {
        console.error("Reader element not found!");
        return;
      }

      readerElement.style.position = 'relative';
      readerElement.style.overflow = 'hidden';

      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 400, aspectRatio: 1.0,
          experimentalFeatures: { useBarCodeDetectorIfSupported: true } },
        false
      );

      scannerRef.current.render(
        async (decodedText: string) => {
          if (scannerRef.current) {
            await scannerRef.current.clear();
            setIsCameraActive(false);
          }

          const { data, error } = await supabase
            .from("qrcode")
            .select("qr_value, patient_name")
            .eq("qr_value", decodedText)
            .single();

          if (error || !data) {
            alert("QR code not recognised");
            if (scannerRef.current) {
              scannerRef.current.resume();
              setIsCameraActive(true);
            }
            return;
          }

          setPatient(data);
        },
        (error) => {
          console.log("QR Scanner error:", error);
        }
      );

      setIsScannerReady(true);

    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [cameraAccess]);

  const sendQRCodeEmail = async () => {
    if (!email || !patient) return;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
  
    try {
      const qrValue = patient.patient_name.replace(/ /g, "_");
  
      const { data: existingQR, error: fetchError } = await supabase
        .from("qrcode")
        .select("qr_value, patient_name")
        .or(`qr_value.eq.${qrValue},email.eq.${email}`)
        .single();
  
      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }
  
      if (existingQR) {
        const createNew = window.confirm(
          "A QR code was already created for this patient/email. Do you want to create a new one?"
        );
        if (!createNew) return;
      }
  
      setIsSendingEmail(true);
  
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;
  
      const { error: dbError } = await supabase.from("qrcode").upsert(
        {
          qr_value: qrValue,
          patient_name: patient.patient_name,
          dob: dob || "",
          firstline: address || "",
          postcode: postcode || "",
          email: email,
        },
        { onConflict: "qr_value" }
      );
  
      if (dbError) throw dbError;
  
      const { error: emailError } = await supabase.functions.invoke("send-qr-email", {
        body: { to: email, patientName: patient.patient_name, qrValue, qrImage },
      });
  
      if (emailError) throw emailError;
  
      setEmailSent(true);
      alert("QR code sent successfully!");
  
    } catch (err) {
      console.error("Email send failed:", err);
      alert("Failed to send email: " + (err as Error).message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    if (!isScannerReady || !scannerRef.current) return;
  
    const styleAndPositionStopButton = () => {
      const stopBtn = document.querySelector('#reader .html5-qrcode-button-stop') as HTMLElement;
      if (stopBtn) {
        stopBtn.style.cssText = `
          background-color: #d63031 !important;
          color: white !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 12px 24px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
          transition: none !important;
          position: absolute !important;
          z-index: 0 !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          pointer-events: auto !important;
          opacity: 0.3 !important;
        `;
        
        const newBtn = stopBtn.cloneNode(true) as HTMLElement;
        stopBtn.parentNode?.replaceChild(newBtn, stopBtn);
        
        newBtn.onmouseover = () => {
          newBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.25) !important';
          newBtn.style.transform = 'translateX(-50%) translateY(-2px) !important';
        };
        
        newBtn.onmouseout = () => {
          newBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2) !important';
          newBtn.style.transform = 'translateX(-50%) !important';
        };
      }
    };
  
    styleAndPositionStopButton();
    const interval = setInterval(styleAndPositionStopButton, 500);
    
    return () => clearInterval(interval);
  }, [isScannerReady]);

  useEffect(() => {
    if (showForm) {
      setShowWelcome(false);
      setShowOptions(false);
      setEmailSent(false);
      
      setTimeout(() => {
        setShowWelcome(true);
        
        setTimeout(() => {
          setShowOptions(true);
        }, 800);
      }, 300);
    } else {
      setShowWelcome(false);
      setShowOptions(false);
      setEmail("");
      setEmailSent(false);
    }
  }, [showForm]);

  const handleManualSubmit = () => {
    if (!manualName.trim()) return;

    // Stop camera if active
    if (scannerRef.current && isCameraActive) {
      scannerRef.current.clear().catch(() => {});
      setIsCameraActive(false);
    }

    // Check if it's a barcode/QR value first
    const checkIfBarcode = async () => {
      setIsProcessingBarcode(true);
      try {
        const { data, error } = await supabase
          .from("qrcode")
          .select("qr_value, patient_name")
          .eq("qr_value", manualName.trim())
          .single();

        if (error || !data) {
          // Not a barcode, treat as new patient name
          setPatient({
            qr_value: manualName.trim().replace(/ /g, "_"),
            patient_name: manualName.trim(),
          });
        } else {
          // Found by qr_value
          setPatient(data);
        }
      } catch (error) {
        console.error("Error checking barcode:", error);
        // If error, treat as new patient name
        setPatient({
          qr_value: manualName.trim().replace(/ /g, "_"),
          patient_name: manualName.trim(),
        });
      } finally {
        setIsProcessingBarcode(false);
      }
    };

    checkIfBarcode();
  };

  const submitChoice = async () => {
    if (!patient || !selectedOption) return;
  
    if (selectedOption === "See Pharmacist") {
      try {
        setIsLoadingStatus(true);
        const { data, error } = await supabase
          .from("pharmacist")
          .select("pharmacist_work")
          .limit(1)
          .single();
  
        if (error) {
          alert("Unable to verify pharmacist availability. Please try again.");
          setIsLoadingStatus(false);
          return;
        }
  
        const currentStatus = data?.pharmacist_work || false;
        setPharmacistStatus(currentStatus);
        
        if (!currentStatus) {
          alert("Sorry, the pharmacist is currently on break. Please select another option.");
          setIsLoadingStatus(false);
          setSelectedOption(null);
          return;
        }
      } catch (error) {
        console.error("Error re-checking pharmacist status:", error);
        alert("Error verifying pharmacist availability. Please try again.");
        setIsLoadingStatus(false);
        return;
      } finally {
        setIsLoadingStatus(false);
      }
    }
  
    try {
      console.log("Submitting data:", {
        qr_value: patient.qr_value,
        patient_name: patient.patient_name,
        dob_entered: dob || null,
        address_entered: address || null,
        postcode_entered: postcode || null,
        email_entered: email || null,
        option_selected: selectedOption,
      });
  
      const { data, error } = await supabase
        .from("checkins")
        .insert([
          {
            qr_value: patient.qr_value,
            patient_name: patient.patient_name,
            dob_entered: dob || null,
            address_entered: address || null,
            postcode_entered: postcode || null,
            email_entered: email || null,
            option_selected: selectedOption,
            created_at: new Date().toISOString(),
          }
        ])
        .select();
  
      if (error) {
        console.error("Database error details:", error);
        
        if (error.code === '23505') {
          alert("A check-in for this patient was already recorded today.");
        } else if (error.code === '42501') {
          alert("Permission denied. Please contact support.");
        } else if (error.message.includes('null value')) {
          alert("Some required fields are missing. Please try again.");
        } else {
          alert(`There was an error submitting your choice: ${error.message}`);
        }
        return;
      }
  
      console.log("Successfully inserted:", data);
      alert("Thank you. Your check-in was successful.");
      clearForm();
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const goBack = () => {
    clearForm();
  };

  const restartScanner = () => {
    if (scannerRef.current && cameraAccess === true) {
      scannerRef.current.clear().catch(() => {});
      
      setTimeout(() => {
        if (scannerRef.current) {
          const readerElement = document.getElementById("reader");
          if (readerElement) {
            readerElement.style.position = 'relative';
            readerElement.style.overflow = 'hidden';
          }

          scannerRef.current.render(
            async (decodedText: string) => {
              if (scannerRef.current) {
                await scannerRef.current.clear();
                setIsCameraActive(false);
              }

              const { data, error } = await supabase
                .from("qrcode")
                .select("qr_value, patient_name")
                .eq("qr_value", decodedText)
                .single();

              if (error || !data) {
                alert("QR code not recognised");
                if (scannerRef.current) {
                  scannerRef.current.resume();
                  setIsCameraActive(true);
                }
                return;
              }

              setPatient(data);
            },
            () => {}
          );
          setIsCameraActive(true);
          setIsScannerReady(true);
        }
      }, 500);
    }
  };

  const clearForm = () => {
    setPatient(null);
    setDob("");
    setAddress("");
    setPostcode("");
    setManualName("");
    setEmail("");
    setSelectedOption(null);
    setShowWelcome(false);
    setShowOptions(false);
    setEmailSent(false);
    
    // Restart camera after successful submission
    restartScanner();
  };

  // Filter options based on pharmacist status
  const filteredOptionButtons = OPTIONS.filter(opt => {
    if (opt.value === "See Pharmacist" && pharmacistStatus === false) {
      return false;
    }
    return true;
  });

  // Get the color of the selected option for the confirm button
  const getSelectedOptionColor = () => {
    if (!selectedOption) return "#0070f3";
    const selected = OPTIONS.find(opt => opt.value === selectedOption);
    return selected ? selected.color : "#0070f3";
  };

  return (
    <div style={{
      backgroundColor: "#000",
      minHeight: "100vh",
      paddingTop: "30px",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 20px",
        fontFamily: "sans-serif",
        backgroundColor: "#000",
        minHeight: "100vh",
      }}>
        {/* HEADER - Always visible at the top */}
        <div style={{
          display: "flex",
          marginLeft: "200px",
          gap: 160, 
          alignItems: "center",
          marginBottom: 20,
          padding: "0 20px",
        }}>
          <h1 style={{ 
            textAlign: "center", 
            fontSize: '2rem',
            background: 'linear-gradient(45deg, #0070f3, #00b894)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            Coleshill Pharmacy
          </h1>
          
          {/* Pharmacist Toggle Button */}
          <button
            disabled={true}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: pharmacistStatus === true ? "#00b894" : 
                            pharmacistStatus === false ? "#d63031" : "#6c757d",
              color: "#fff",
              cursor: "default",
              fontWeight: 600,
              fontSize: 16,
              transition: "all 0.3s ease",
              boxShadow: pharmacistStatus === true ? 
                "0 4px 15px rgba(0, 184, 148, 0.4)" : 
                pharmacistStatus === false ? 
                "0 4px 15px rgba(214, 48, 49, 0.4)" : 
                "0 4px 15px rgba(108, 117, 125, 0.4)",
              minWidth: "180px",
            }}
          >
            {isLoadingStatus ? "Loading..." : 
             pharmacistStatus === true ? "Pharmacist: ON ✓" : 
             pharmacistStatus === false ? "Pharmacist: OFF ✗" : 
             "Status: Unknown"}
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 200px)",
        }}>
          {/* First Page - QR Scan / Name Input (hidden when form is shown) */}
          {!showForm && (
            <div style={{
              backgroundColor: "#000",
              padding: 30,
              borderRadius: 10,
              boxShadow: "0 4px 20px 1px #041E42",
              border: "1px solid #333",
              maxWidth: 690,
              width: "100%",
              opacity: isScannerReady ? 1 : 0.7,
              transition: 'opacity 0.5s ease-in-out',
              position: 'relative'
            }}>
              <h2 style={{ 
                marginBottom: 30, 
                color: "#e0e0e0",
                fontSize: '1.5rem',
                textAlign: "center", 
                background: 'linear-gradient(45deg, #0070f3, #00b894)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
              }}>Scan your QR code</h2>
              
              {cameraAccess === false ? (
                <div style={{
                  margin: "0 auto 10px auto",
                  width: 500,
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1a1a1a",
                  borderRadius: 10,
                  color: "#b0b0b0",
                  fontSize: 18,
                  border: "1px solid #555",
                }}>
                  Camera access denied. Please allow camera permissions or use manual entry.
                </div>
              ) : cameraAccess === true ? (
                <>
                  <div
                    id="reader"
                    style={{ 
                      margin: "0 auto 10px auto",
                      width: 500, 
                      height: 400,
                      display: isScannerReady ? 'block' : 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.5s ease',
                      zIndex: 1,
                    }}
                  />
                  {!isScannerReady && (
                    <div style={{
                      margin: "0 auto 10px auto",
                      width: 500,
                      height: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#1a1a1a",
                      borderRadius: 10,
                      color: "#b0b0b0",
                      fontSize: 18,
                      border: "1px solid #555",
                      transition: 'all 0.5s ease',
                      zIndex: 1,
                    }}>
                      Initializing scanner...
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  margin: "0 auto 10px auto",
                  width: 500,
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1a1a1a",
                  borderRadius: 10,
                  color: "#b0b0b0",
                  fontSize: 18,
                  border: "1px solid #555",
                  zIndex: 1,
                }}>
                  Checking camera permissions...
                </div>
              )}
              
              {/* Manual Entry Section */}
              <div style={{
                position: 'relative',
                zIndex: 100,
                marginTop: 20,
                backgroundColor: '#000',
                padding: '20px 0',
              }}>
                <div style={{ 
                  display: "flex", 
                  gap: 10, 
                  alignItems: "stretch",
                  position: 'relative',
                  marginTop: -55,
                  width: "100%",
                  zIndex: 100
                }}>
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Patient Name or Scan Barcode"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    onKeyDown={(e) => {
                      // Handle Enter key for manual submission
                      if (e.key === 'Enter') {
                        handleManualSubmit();
                      }
                    }}
                    style={{
                      padding: 8,
                      borderRadius: 5,
                      border: "1px solid #555",
                      width: "80%",
                      backgroundColor: "#222",
                      fontSize: 16,
                      color: "#fff",
                      fontWeight: 500,
                      boxSizing: "border-box",
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 100
                    }}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <button 
                    onClick={handleManualSubmit}
                    disabled={isProcessingBarcode}
                    style={{
                      padding: 15,
                      borderRadius: 5,
                      border: "none",
                      backgroundColor: isProcessingBarcode ? "#555" : "#0070f3",
                      color: "#fff",
                      cursor: isProcessingBarcode ? "default" : "pointer",
                      fontWeight: 600,
                      fontSize: 16,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 100,
                      width: "20%",
                    }}
                  >
                    {isProcessingBarcode ? "Processing..." : "Next"}
                  </button>
                </div>
                <p style={{
                  marginBottom: 18,
                  marginTop: 8,
                  color: "#b0b0b0",
                  fontSize: 16,
                  fontWeight: 500,
                  position: 'relative',
                  zIndex: 101,
                  textAlign: 'left',
                  paddingLeft: '10px'
                }}>
                  ...Or type your full name or scan barcode
                </p>
                <p style={{
                  marginBottom: 18,
                  marginTop: 8,
                  color: "#666",
                  fontSize: 12,
                  fontWeight: 400,
                  position: 'relative',
                  zIndex: 101,
                  textAlign: 'left',
                  paddingLeft: '10px'
                }}>
                  Tip: The cursor is automatically in the input field. Scan barcode or type name and press Enter.
                </p>
              </div>
            </div>
          )}

          {/* Second Page - Form + Options (shown when patient data is available) */}
          {showForm && patient && (
            <div style={{
              backgroundColor: "#000",
              padding: 30,
              borderRadius: 10,
              boxShadow: "0 4px 20px 1px #002366",
              border: "1px solid #333",
              maxWidth: 800,
              width: "100%",
              animation: 'fadeIn 0.5s ease-in-out'
            }}>
              {/* Form Header with Go Back button */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: 30,
                opacity: showWelcome ? 1 : 0,
                transform: showWelcome ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
              }}>
                <button 
                  onClick={goBack}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid #555",
                    backgroundColor: "#333",
                    color: "#e0e0e0",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: 'all 0.3s ease',
                    opacity: showWelcome ? 1 : 0,
                    transform: showWelcome ? 'translateX(0)' : 'translateX(-20px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#555";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                    e.currentTarget.style.color = "#e0e0e0";
                  }}
                >
                  ← Go Back
                </button>
              </div>

              {/* Welcome Message */}
              <div style={{
                marginBottom: 30,
                opacity: showWelcome ? 1 : 0,
                transform: showWelcome ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s'
              }}>
                <h2 style={{ 
                  margin: 0,
                  fontSize: '2rem',
                  background: 'linear-gradient(45deg, #0070f3, #00b894)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: "center"
                }}>
                  Welcome {patient.patient_name}!
                </h2>
                <p style={{
                  marginTop: 10,
                  color: "#b0b0b0",
                  fontSize: 16,
                  textAlign: "center"
                }}>
                  Please select your reason for visiting today
                </p>
              </div>

              {/* Options Layout */}
              <div style={{ 
                marginTop: 30, 
                display: "flex", 
                flexDirection: "column", 
                gap: 20,
                opacity: showOptions ? 1 : 0,
                transform: showOptions ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s'
              }}>
                {/* First Row */}
                <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                  {filteredOptionButtons
                    .filter(opt => opt.value === "See Pharmacist" || opt.value === "Have Appointment")
                    .map((opt, index) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedOption(opt.value)}
                        style={{
                          padding: "29px 38px",
                          borderRadius: 16,
                          border: selectedOption === opt.value ? `3px solid ${opt.color}` : "none",
                          backgroundColor: selectedOption === opt.value ? opt.color : "#1a1a1a",
                          color: selectedOption === opt.value ? "#fff" : opt.color,
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: 600,
                          minWidth: 240,
                          boxShadow: selectedOption === opt.value ? `0 4px 15px ${opt.color}66` : "none",
                          transition: "all 0.3s ease",
                          transform: showOptions ? 'scale(1)' : 'scale(0.9)',
                          opacity: showOptions ? 1 : 0,
                          transitionDelay: `${0.9 + (index * 0.1)}s`,
                          ...(opt.value === "See Pharmacist" && pharmacistStatus === false && {
                            backgroundColor: "#333",
                            color: "#666",
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          })
                        }}
                      >
                        {opt.value === "See Pharmacist" && pharmacistStatus === false ? 
                          "👨‍⚕️ Pharmacist Unavailable" : opt.label}
                      </button>
                    ))}
                </div>

                {/* Second Row */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                  {filteredOptionButtons
                    .filter(opt => opt.value === "Pick Up Medication" || opt.value === "Pick Up Blister Packs")
                    .map((opt, index) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedOption(opt.value)}
                        style={{
                          padding: "29px 38px",
                          borderRadius: 16,
                          border: selectedOption === opt.value ? `3px solid ${opt.color}` : "none",
                          backgroundColor: selectedOption === opt.value ? opt.color : "#1a1a1a",
                          color: selectedOption === opt.value ? "#fff" : opt.color,
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: 600,
                          minWidth: 240,
                          boxShadow: selectedOption === opt.value ? `0 4px 15px ${opt.color}66` : "none",
                          transition: "all 0.3s ease",
                          transform: showOptions ? 'scale(1)' : 'scale(0.9)',
                          opacity: showOptions ? 1 : 0,
                          transitionDelay: `${1.1 + (index * 0.1)}s`,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                </div>

                {/* Third Row */}
                <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                  {filteredOptionButtons
                    .filter(opt => opt.value === "Return Unwanted Medication" || opt.value === "Emergency Supply")
                    .map((opt, index) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedOption(opt.value)}
                        style={{
                          padding: "29px 38px",
                          borderRadius: 16,
                          border: selectedOption === opt.value ? `3px solid ${opt.color}` : "none",
                          backgroundColor: selectedOption === opt.value ? opt.color : "#1a1a1a",
                          color: selectedOption === opt.value ? "#fff" : opt.color,
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: 600,
                          minWidth: 240,
                          boxShadow: selectedOption === opt.value ? `0 4px 15px ${opt.color}66` : "none",
                          transition: "all 0.3s ease",
                          transform: showOptions ? 'scale(1)' : 'scale(0.9)',
                          opacity: showOptions ? 1 : 0,
                          transitionDelay: `${1.3 + (index * 0.1)}s`,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                </div>

                {/* Confirm Check-in Button */}
                {selectedOption && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    marginTop: 40,
                    opacity: showOptions ? 1 : 0,
                    transition: 'opacity 0.5s ease-out 1.5s'
                  }}>
                    <div style={{
                      border: `3px solid ${getSelectedOptionColor()}`,
                      borderRadius: 12,
                      padding: 0,
                      display: 'inline-block'
                    }}>
                      <button
                        onClick={submitChoice}
                        style={{
                          padding: "20px 40px",
                          fontSize: 20,
                          backgroundColor: getSelectedOptionColor(),
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "all 0.3s ease",
                          boxShadow: `0 6px 20px ${getSelectedOptionColor()}66`,
                          margin: 0,
                        }}
                      >
                        ✓ Confirm Check-in
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Information Inputs */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 15, 
                marginTop: 40,
                marginBottom: 30,
                opacity: showWelcome ? 1 : 0,
                transition: 'opacity 0.8s ease-out 0.5s'
              }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8, color: "#b0b0b0", fontSize: 14 }}>
                    Optional Information
                  </label>
                  <input
                    placeholder="Date of Birth (optional)"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      border: "1px solid #555",
                      width: "100%",
                      backgroundColor: "#222",
                      fontSize: 16,
                      color: "#fff",
                      boxSizing: "border-box",
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <input
                    placeholder="First line of address (optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      border: "1px solid #555",
                      width: "100%",
                      backgroundColor: "#222",
                      fontSize: 16,
                      color: "#fff",
                      boxSizing: "border-box",
                      transition: 'all 0.3s ease',
                      marginTop: 15,
                    }}
                  />
                  <input
                    placeholder="Postcode (optional)"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      border: "1px solid #555",
                      width: "100%",
                      backgroundColor: "#222",
                      fontSize: 16,
                      color: "#fff",
                      boxSizing: "border-box",
                      transition: 'all 0.3s ease',
                      marginTop: 15,
                    }}
                  />
                </div>
                
                {/* Email Section */}
                <div style={{ marginTop: 20 }}>
                  <label style={{ display: "block", marginBottom: 8, color: "#b0b0b0", fontSize: 14 }}>
                    Email for QR Code (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      border: "1px solid #555",
                      width: "100%",
                      backgroundColor: "#222",
                      fontSize: 16,
                      color: "#fff",
                      boxSizing: "border-box",
                      transition: 'all 0.3s ease',
                    }}
                  />
                  
                  {/* Send QR Code Button */}
                  {email && !emailSent && (
                    <button
                      onClick={sendQRCodeEmail}
                      disabled={isSendingEmail}
                      style={{
                        padding: "12px 20px",
                        borderRadius: 5,
                        border: "none",
                        backgroundColor: isSendingEmail ? "#555" : "#00b894",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 16,
                        transition: 'all 0.3s ease',
                        marginTop: 15,
                        width: "100%",
                      }}
                    >
                      {isSendingEmail ? (
                        <>
                          <span style={{ marginRight: 8 }}>⏳</span>
                          Sending QR Code...
                        </>
                      ) : (
                        <>
                          <span style={{ marginRight: 8 }}>📧</span>
                          Send QR Code to Email
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Success message when email is sent */}
                  {emailSent && (
                    <div style={{
                      marginTop: 15,
                      padding: "12px 20px",
                      backgroundColor: "#00b894",
                      color: "white",
                      borderRadius: 5,
                      fontWeight: 600,
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8
                    }}>
                      <span>✓</span>
                      QR Code sent to {email}
                    </div>
                  )}
                  
                  {/* Helper text */}
                  <p style={{
                    fontSize: 14,
                    color: "#666",
                    marginTop: 8,
                    marginBottom: 0,
                    textAlign: "left"
                  }}>
                    Enter your email to receive a QR code for future visits.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CSS Animations */}
        <style>
          {`
            body, html {
              margin: 0;
              padding: 0;
              background-color: #000 !important;
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            #reader {
              border: none !important;
              background: none !important;
              position: relative !important;
              overflow: hidden !important;
            }
            #reader canvas, #reader video {
              border: none !important;
              border-radius: 10px !important;
              position: relative !important;
              z-index: 10 !important;
              background: #000 !important;
              border: 1px solid #555 !important;
            }
            #reader .html5-qrcode-overlay, 
            #reader .html5-qrcode-button-start {
              display: none !important;
            }
            
            /* Smooth transitions */
            button:hover:not(:disabled) {
              transform: translateY(-2px);
            }
            
            button:active:not(:disabled) {
              transform: translateY(1px);
            }
            
            /* Input focus effects */
            input:focus {
              border-color: #0070f3 !important;
              box-shadow: 0 0 5px rgba(0, 112, 243, 0.5) !important;
              outline: none;
            }
            
            /* Scrollbar styling */
            div::-webkit-scrollbar {
              width: 8px;
            }
            
            div::-webkit-scrollbar-track {
              background: #333;
              border-radius: 4px;
            }
            
            div::-webkit-scrollbar-thumb {
              background: #555;
              border-radius: 4px;
            }
            
            div::-webkit-scrollbar-thumb:hover {
              background: #777;
            }
          `}
        </style>
      </div>
    </div>
  );
}

// import supabase from "../../supabase";
// import { useEffect, useState, useRef } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";

// type PatientQR = {
//   qr_value: string;
//   patient_name: string;
// };

// type PharmacistStatus = {
//   pharmacist_work: boolean;
// };

// export default function BarcodePage() {
//   const [patient, setPatient] = useState<PatientQR | null>(null);
//   const [dob, setDob] = useState("");
//   const [address, setAddress] = useState("");
//   const [postcode, setPostcode] = useState("");
//   const [manualName, setManualName] = useState("");
//   const [email, setEmail] = useState(""); // NEW: Email state
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [cameraAccess, setCameraAccess] = useState<boolean | null>(null);
//   const [isCameraActive, setIsCameraActive] = useState(true);
//   const [isScannerReady, setIsScannerReady] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);
//   const [pharmacistStatus, setPharmacistStatus] = useState<boolean | null>(null);
//   const [isLoadingStatus, setIsLoadingStatus] = useState(true);
//   const [isSendingEmail, setIsSendingEmail] = useState(false); // NEW: Email sending state
//   const [emailSent, setEmailSent] = useState(false); // NEW: Email sent state

//   const scannerRef = useRef<Html5QrcodeScanner | null>(null);
//   const showForm = !!patient;

//   // Check camera access on page load
//   useEffect(() => {
//     const checkCameraAccess = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } }});
//         stream.getTracks().forEach(track => track.stop());
//         setCameraAccess(true);
//       } catch (error) {
//         console.error("Camera access denied:", error);
//         setCameraAccess(false);
//       }
//     };
    
//     checkCameraAccess();
//   }, []);

//   // Fetch pharmacist status on page load
//   useEffect(() => {
//     const fetchPharmacistStatus = async () => {
//       try {
//         setIsLoadingStatus(true);
//         const { data, error } = await supabase
//           .from("pharmacist")
//           .select("pharmacist_work")
//           .limit(1)
//           .single();

//         if (error) {
//           console.error("Error fetching pharmacist status:", error);
//           setPharmacistStatus(null);
//         } else {
//           setPharmacistStatus(data?.pharmacist_work || false);
//         }
//       } catch (error) {
//         console.error("Error fetching pharmacist status:", error);
//         setPharmacistStatus(null);
//       } finally {
//         setIsLoadingStatus(false);
//       }
//     };

//     fetchPharmacistStatus();
//   }, []);

//   // QR scanner - only initialize after camera check AND element is mounted
//   useEffect(() => {
//     if (cameraAccess === false) {
//       console.log("Camera access denied, skipping scanner initialization");
//       return;
//     }

//     // Only initialize scanner if we have camera access
//     if (cameraAccess !== true) return;

//     // Small delay to ensure DOM is ready
//     const timer = setTimeout(() => {
//       const readerElement = document.getElementById("reader");
//       if (!readerElement) {
//         console.error("Reader element not found!");
//         return;
//       }

//       // Set up container styles before initializing scanner
//       readerElement.style.position = 'relative';
//       readerElement.style.overflow = 'hidden';

//       scannerRef.current = new Html5QrcodeScanner(
//         "reader",
//         { fps: 10, qrbox: 400, aspectRatio: 1.0, // ensures square scanning box matches QR
//           experimentalFeatures: { useBarCodeDetectorIfSupported: true } },
//         false
//       );

//       scannerRef.current.render(
//         async (decodedText: string) => {
//           if (scannerRef.current) {
//             await scannerRef.current.clear();
//             setIsCameraActive(false);
//           }

//           const { data, error } = await supabase
//             .from("qrcode")
//             .select("qr_value, patient_name")
//             .eq("qr_value", decodedText)
//             .single();

//           if (error || !data) {
//             alert("QR code not recognised");
//             // Restart scanner if QR not recognized
//             if (scannerRef.current) {
//               scannerRef.current.resume();
//               setIsCameraActive(true);
//             }
//             return;
//           }

//           setPatient(data);
//         },
//         (error) => {
//           console.log("QR Scanner error:", error);
//         }
//       );

//       setIsScannerReady(true);

//     }, 100); // Small delay for DOM stability

//     return () => {
//       clearTimeout(timer);
//       if (scannerRef.current) {
//         scannerRef.current.clear().catch(() => {});
//       }
//     };
//   }, [cameraAccess]);

//   const sendQRCodeEmail = async () => {
//     if (!email || !patient) return;
  
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       alert("Please enter a valid email address");
//       return;
//     }
  
//     try {
//       const qrValue = patient.patient_name.replace(/ /g, "_");
  
//       // Check if QR code already exists for this qr_value or email
//       const { data: existingQR, error: fetchError } = await supabase
//         .from("qrcode")
//         .select("qr_value, patient_name")
//         .or(`qr_value.eq.${qrValue},email.eq.${email}`)
//         .single();
  
//       if (fetchError && fetchError.code !== "PGRST116") {
//         // PGRST116 is "no rows found" in Supabase PostgREST
//         throw fetchError;
//       }
  
//       if (existingQR) {
//         const createNew = window.confirm(
//           "A QR code was already created for this patient/email. Do you want to create a new one?"
//         );
//         if (!createNew) return; // User selected 'No'
//       }
  
//       setIsSendingEmail(true);
  
//       const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;
  
//       // Upsert QR code record (will insert or update)
//       const { error: dbError } = await supabase.from("qrcode").upsert(
//         {
//           qr_value: qrValue,
//           patient_name: patient.patient_name,
//           dob: dob || "",
//           firstline: address || "",
//           postcode: postcode || "",
//           email: email,
//         },
//         { onConflict: "qr_value" } // Must be string, not array
//       );
  
//       if (dbError) throw dbError;
  
//       // Send email via Supabase function
//       const { error: emailError } = await supabase.functions.invoke("send-qr-email", {
//         body: { to: email, patientName: patient.patient_name, qrValue, qrImage },
//       });
  
//       if (emailError) throw emailError;
  
//       setEmailSent(true);
//       alert("QR code sent successfully!");
  
//     } catch (err) {
//       console.error("Email send failed:", err);
//       alert("Failed to send email: " + (err as Error).message);
//     } finally {
//       setIsSendingEmail(false);
//     }
//   };

//   // Style and position the stop button behind camera
//   useEffect(() => {
//     if (!isScannerReady || !scannerRef.current) return;
  
//     const styleAndPositionStopButton = () => {
//       // Find the stop button
//       const stopBtn = document.querySelector('#reader .html5-qrcode-button-stop') as HTMLElement;
//       if (stopBtn) {
//         // Position it UNDER the title and input field
//         stopBtn.style.cssText = `
//           background-color: #d63031 !important;
//           color: white !important;
//           border: none !important;
//           border-radius: 12px !important;
//           padding: 12px 24px !important;
//           font-size: 16px !important;
//           font-weight: 600 !important;
//           cursor: pointer !important;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
//           transition: none !important;
//           position: absolute !important;
//           z-index: 0 !important;  // LOWEST z-index - behind everything
//           bottom: 20px !important;
//           left: 50% !important;
//           transform: translateX(-50%) !important;
//           pointer-events: auto !important;
//           opacity: 0.3 !important;  // Make it semi-transparent to confirm it's behind
//         `;
        
//         // Remove any event listeners that might interfere
//         const newBtn = stopBtn.cloneNode(true) as HTMLElement;
//         stopBtn.parentNode?.replaceChild(newBtn, stopBtn);
        
//         // Optional: Add hover effects if you still want them
//         newBtn.onmouseover = () => {
//           newBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.25) !important';
//           newBtn.style.transform = 'translateX(-50%) translateY(-2px) !important';
//         };
        
//         newBtn.onmouseout = () => {
//           newBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2) !important';
//           newBtn.style.transform = 'translateX(-50%) !important';
//         };
//       }
//     };
  
//     // Try to style immediately and also set up an interval to catch dynamic creation
//     styleAndPositionStopButton();
//     const interval = setInterval(styleAndPositionStopButton, 500);
    
//     return () => clearInterval(interval);
//   }, [isScannerReady]);

//   // Handle form transitions and animations
//   useEffect(() => {
//     if (showForm) {
//       // Reset animation states
//       setShowWelcome(false);
//       setShowOptions(false);
//       setEmailSent(false); // NEW: Reset email sent state
      
//       // Show welcome message after a short delay
//       setTimeout(() => {
//         setShowWelcome(true);
        
//         // Show options after welcome message appears
//         setTimeout(() => {
//           setShowOptions(true);
//         }, 800);
//       }, 300);
//     } else {
//       // Reset animation states when form closes
//       setShowWelcome(false);
//       setShowOptions(false);
//       setEmail(""); // NEW: Clear email when closing form
//       setEmailSent(false); // NEW: Reset email sent state
//     }
//   }, [showForm]);

//   const handleManualSubmit = () => {
//     if (!manualName.trim()) return;

//     // Stop camera if active
//     if (scannerRef.current && isCameraActive) {
//       scannerRef.current.clear().catch(() => {});
//       setIsCameraActive(false);
//     }

//     setPatient({
//       qr_value: manualName.trim().replace(/ /g, "_"),
//       patient_name: manualName.trim(),
//     });
//   };

//   const submitChoice = async () => {
//     if (!patient || !selectedOption) return;
  
//     // Re-check pharmacist status ONLY if "See Pharmacist" is selected
//     if (selectedOption === "See Pharmacist") {
//       try {
//         setIsLoadingStatus(true);
//         const { data, error } = await supabase
//           .from("pharmacist")
//           .select("pharmacist_work")
//           .limit(1)
//           .single();
  
//         if (error) {
//           alert("Unable to verify pharmacist availability. Please try again.");
//           setIsLoadingStatus(false);
//           return;
//         }
  
//         const currentStatus = data?.pharmacist_work || false;
//         setPharmacistStatus(currentStatus);
        
//         // Don't allow submission if pharmacist is not working
//         if (!currentStatus) {
//           alert("Sorry, the pharmacist is currently on break. Please select another option.");
//           setIsLoadingStatus(false);
//           setSelectedOption(null); // Clear the selection
//           return;
//         }
//       } catch (error) {
//         console.error("Error re-checking pharmacist status:", error);
//         alert("Error verifying pharmacist availability. Please try again.");
//         setIsLoadingStatus(false);
//         return;
//       } finally {
//         setIsLoadingStatus(false);
//       }
//     }
  
//     try {
//       // Log the data being sent for debugging
//       console.log("Submitting data:", {
//         qr_value: patient.qr_value,
//         patient_name: patient.patient_name,
//         dob_entered: dob || null,
//         address_entered: address || null,
//         postcode_entered: postcode || null,
//         email_entered: email || null,
//         option_selected: selectedOption,
//       });
  
//       const { data, error } = await supabase
//         .from("checkins")
//         .insert([
//           {
//             qr_value: patient.qr_value,
//             patient_name: patient.patient_name,
//             dob_entered: dob || null,
//             address_entered: address || null,
//             postcode_entered: postcode || null,
//             email_entered: email || null,
//             option_selected: selectedOption,
//             created_at: new Date().toISOString(), // Add timestamp if needed
//           }
//         ])
//         .select(); // Use .select() to get feedback
  
//       if (error) {
//         console.error("Database error details:", error);
        
//         // Provide more specific error messages
//         if (error.code === '23505') { // Unique constraint violation
//           alert("A check-in for this patient was already recorded today.");
//         } else if (error.code === '42501') { // Permission denied
//           alert("Permission denied. Please contact support.");
//         } else if (error.message.includes('null value')) {
//           alert("Some required fields are missing. Please try again.");
//         } else {
//           alert(`There was an error submitting your choice: ${error.message}`);
//         }
//         return;
//       }
  
//       console.log("Successfully inserted:", data);
//       alert("Thank you. Your check-in was successful.");
//       clearForm();
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

//   const goBack = () => {
//     clearForm();
//   };

//   const restartScanner = () => {
//     if (scannerRef.current && cameraAccess === true) {
//       scannerRef.current.clear().catch(() => {});
      
//       setTimeout(() => {
//         if (scannerRef.current) {
//           const readerElement = document.getElementById("reader");
//           if (readerElement) {
//             readerElement.style.position = 'relative';
//             readerElement.style.overflow = 'hidden';
//           }

//           scannerRef.current.render(
//             async (decodedText: string) => {
//               if (scannerRef.current) {
//                 await scannerRef.current.clear();
//                 setIsCameraActive(false);
//               }

//               const { data, error } = await supabase
//                 .from("qrcode")
//                 .select("qr_value, patient_name")
//                 .eq("qr_value", decodedText)
//                 .single();

//               if (error || !data) {
//                 alert("QR code not recognised");
//                 if (scannerRef.current) {
//                   scannerRef.current.resume();
//                   setIsCameraActive(true);
//                 }
//                 return;
//               }

//               setPatient(data);
//             },
//             () => {}
//           );
//           setIsCameraActive(true);
//           setIsScannerReady(true);
//         }
//       }, 500);
//     }
//   };

//   const clearForm = () => {
//     setPatient(null);
//     setDob("");
//     setAddress("");
//     setPostcode("");
//     setManualName("");
//     setEmail(""); // NEW: Clear email
//     setSelectedOption(null);
//     setShowWelcome(false);
//     setShowOptions(false);
//     setEmailSent(false); // NEW: Reset email sent state
    
//     // Restart camera after successful submission
//     restartScanner();
//   };

//   const optionButtons = [
//     { label: "🧑‍⚕️ See Pharmacist", value: "See Pharmacist", color: "#0070f3" },
//     { label: "📅 Have Appointment", value: "Have Appointment", color: "#00b894" },
//     { label: "💊 Pick Up Medication", value: "Pick Up Medication", color: "#fdcb6e" },
//     { label: "📦 Pick Up Blister Packs", value: "Pick Up Blister Packs", color: "#6c5ce7" },
//     { label: "♻️ Return Unwanted Medication", value: "Return Unwanted Medication", color: "#d63031" },
//     { label: "🚨 Emergency Supply", value: "Emergency Supply", color: "#e84393" },
//   ];

//   // Filter options based on pharmacist status
//   const filteredOptionButtons = optionButtons.filter(opt => {
//     // If pharmacist is not available, hide "See Pharmacist" option
//     if (opt.value === "See Pharmacist" && pharmacistStatus === false) {
//       return false;
//     }
//     return true;
//   });

//   // Get the color of the selected option for the confirm button
//   const getSelectedOptionColor = () => {
//     if (!selectedOption) return "#0070f3";
//     const selected = optionButtons.find(opt => opt.value === selectedOption);
//     return selected ? selected.color : "#0070f3";
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 690,
//         margin: "50px auto",
//         textAlign: "center",
//         fontFamily: "sans-serif",
//       }}
//     >
//       {/* First Page - QR Scan / Name Input (hidden when form is shown) */}
//       {!showForm && (
//         <div style={{
//           ...cardStyle1,
//           opacity: isScannerReady ? 1 : 0.7,
//           transition: 'opacity 0.5s ease-in-out',
//           position: 'relative'
//         }}>
//           <h2 style={{ marginBottom: 20 }}>Scan your QR code</h2>
          
//           {cameraAccess === false ? (
//             <div style={{
//               margin: "0 auto 10px auto",
//               width: 500,
//               height: 600,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "#f5f5f5",
//               borderRadius: 20,
//               color: "#666",
//               fontSize: 18
//             }}>
//               Camera access denied. Please allow camera permissions or use manual entry.
//             </div>
//           ) : cameraAccess === true ? (
//             <>
//               <div
//                 id="reader"
//                 style={{ 
//                   margin: "0 auto 10px auto",
//                   width: 500, 
//                   height: 600,
//                   display: isScannerReady ? 'block' : 'none',
//                   position: 'relative',
//                   overflow: 'hidden',
//                   transition: 'all 0.5s ease',
//                   zIndex: 1,
//                 }}
//               />
//               {!isScannerReady && (
//                 <div style={{
//                   margin: "0 auto 10px auto",
//                   width: 500,
//                   height: 600,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: "#f5f5f5",
//                   borderRadius: 20,
//                   color: "#666",
//                   fontSize: 18,
//                   transition: 'all 0.5s ease',
//                   zIndex: 1,
//                 }}>
//                   Initializing scanner...
//                 </div>
//               )}
//             </>
//           ) : (
//             <div style={{
//               margin: "0 auto 10px auto",
//               width: 500,
//               height: 610,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "#f5f5f5",
//               borderRadius: 20,
//               color: "#666",
//               fontSize: 18,
//               zIndex: 1,
//             }}>
//               Checking camera permissions...
//             </div>
//           )}
          
//           {/* Title and input field section - placed ABOVE the camera */}
//           <div style={{
//             position: 'relative',
//             zIndex: 100,
//             marginTop: 20,
//             backgroundColor: 'white',
//             padding: '20px 0',
//             borderRadius: '8px'
//           }}>
//             <div style={{ 
//               display: "flex", 
//               gap: 10, 
//               alignItems: "stretch",
//               position: 'relative',
//               marginTop: -255,
//               width: "100%",
//               zIndex: 100
//             }}>
//               <input
//                 type="text"
//                 placeholder="Patient Name"
//                 value={manualName}
//                 onChange={(e) => setManualName(e.target.value)}
//                 style={{
//                   ...inputStyle2,
//                   position: 'relative',
//                   zIndex: 100
//                 }}
//                 autoComplete="off"
//                 autoCorrect="off"
//                 spellCheck={false}
//               />
//               <button onClick={handleManualSubmit} style={{
//                 ...buttonStyle,
//                 position: 'relative',
//                 zIndex: 100,
//                 width: "20%",
//               }}>
//                 Next
//               </button>
//             </div>
//             <p style={{
//               marginBottom: 18,
//               marginTop: 8,
//               color: "#555",
//               fontSize: 16,
//               fontWeight: 500,
//               position: 'relative',
//               zIndex: 101,
//               textAlign: 'left',
//               paddingLeft: '10px'
//             }}>
//               ...Or type your name
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Second Page - Form + Options (shown when patient data is available) */}
//       {showForm && patient && (
//         <div style={{
//           ...cardStyle,
//           opacity: 1,
//           animation: 'fadeIn 0.5s ease-in-out'
//         }}>
//           {/* Header with Go Back button and Pharmacist Status */}
//           <div style={{ 
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "center", 
//             marginBottom: 30,
//             opacity: showWelcome ? 1 : 0,
//             transform: showWelcome ? 'translateY(0)' : 'translateY(-20px)',
//             transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
//           }}>
//             <button 
//               onClick={goBack}
//               style={{
//                 padding: "10px 20px",
//                 borderRadius: 8,
//                 border: "none",
//                 backgroundColor: "#6c757d",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontWeight: 600,
//                 fontSize: 10,
//                 transition: 'all 0.3s ease',
//                 opacity: showWelcome ? 1 : 0,
//                 transform: showWelcome ? 'translateX(0)' : 'translateX(-20px)'
//               }}
//             >
//               ← Go Back
//             </button>
            
//             {/* Pharmacist Status Display */}
//             <div style={{
//               padding: "10px 20px",
//               borderRadius: 8,
//               backgroundColor: pharmacistStatus === true ? "#00b894" : 
//                              pharmacistStatus === false ? "#d63031" : "#6c757d",
//               color: "#fff",
//               fontWeight: 600,
//               fontSize: 10,
//               transition: 'all 0.5s ease',
//               opacity: showWelcome ? 1 : 0,
//               transform: showWelcome ? 'translateX(0)' : 'translateX(20px)'
//             }}>
//               {isLoadingStatus ? (
//                 "Loading..."
//               ) : pharmacistStatus === true ? (
//                 "Pharmacist: Working"
//               ) : pharmacistStatus === false ? (
//                 "Pharmacist: On Break"
//               ) : (
//                 "Status: Unknown"
//               )}
//             </div>
//           </div>

//           {/* Welcome Message with Animation */}
//           <div style={{
//             marginBottom: 30,
//             opacity: showWelcome ? 1 : 0,
//             transform: showWelcome ? 'translateY(0)' : 'translateY(20px)',
//             transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s'
//           }}>
//             <h2 style={{ 
//               margin: 0,
//               fontSize: '1.5rem',
//               background: 'linear-gradient(45deg, #0070f3, #00b894)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text'
//             }}>
//               Welcome {patient.patient_name}!
//             </h2>
//           </div>

//           {/* Options Layout with Staggered Animation */}
//           <div style={{ 
//             marginTop: 10, 
//             display: "flex", 
//             flexDirection: "column", 
//             gap: 20,
//             opacity: showOptions ? 1 : 0,
//             transform: showOptions ? 'translateY(0)' : 'translateY(30px)',
//             transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s'
//           }}>
//             {/* First Row - Conditionally show See Pharmacist based on status */}
//             <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
//               {filteredOptionButtons
//                 .filter(opt => opt.value === "See Pharmacist" || opt.value === "Have Appointment")
//                 .map((opt, index) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => setSelectedOption(opt.value)}
//                     style={{
//                       ...optionButtonStyle,
//                       backgroundColor: selectedOption === opt.value ? opt.color : `${opt.color}77`,
//                       border: selectedOption === opt.value ? `3px solid ${opt.color}` : "none",
//                       boxShadow: selectedOption === opt.value ? `0 0 15px ${opt.color}99` : "0 4px 15px rgba(0,0,0,0.1)",
//                       borderRadius: 16,
//                       transform: showOptions ? 'scale(1)' : 'scale(0.9)',
//                       opacity: showOptions ? 1 : 0,
//                       transition: `all 0.5s ease-out ${0.9 + (index * 0.1)}s`,
//                       // Gray out See Pharmacist if not available
//                       ...(opt.value === "See Pharmacist" && pharmacistStatus === false && {
//                         backgroundColor: "#cccccc",
//                         color: "#666666",
//                         cursor: "not-allowed",
//                         pointerEvents: "none",
//                       })
//                     }}
//                   >
//                     {opt.value === "See Pharmacist" && pharmacistStatus === false ? 
//                       "👨‍⚕️ Pharmacist Unavailable" : opt.label}
//                   </button>
//                 ))}
//             </div>

//             {/* Second Row */}
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
//               {filteredOptionButtons
//                 .filter(opt => opt.value === "Pick Up Medication" || opt.value === "Pick Up Blister Packs")
//                 .map((opt, index) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => setSelectedOption(opt.value)}
//                     style={{
//                       ...optionButtonStyle,
//                       backgroundColor: selectedOption === opt.value ? opt.color : `${opt.color}33`,
//                       border: selectedOption === opt.value ? `3px solid ${opt.color}` : "none",
//                       boxShadow: selectedOption === opt.value ? `0 0 15px ${opt.color}99` : "0 4px 15px rgba(0,0,0,0.1)",
//                       borderRadius: 16,
//                       transform: showOptions ? 'scale(1)' : 'scale(0.9)',
//                       opacity: showOptions ? 1 : 0,
//                       transition: `all 0.5s ease-out ${1.1 + (index * 0.1)}s`,
//                     }}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//             </div>

//             {/* Third Row */}
//             <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
//               {filteredOptionButtons
//                 .filter(opt => opt.value === "Return Unwanted Medication" || opt.value === "Emergency Supply")
//                 .map((opt, index) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => setSelectedOption(opt.value)}
//                     style={{
//                       ...optionButtonStyle,
//                       backgroundColor: selectedOption === opt.value ? opt.color : `${opt.color}11`,
//                       border: selectedOption === opt.value ? `3px solid ${opt.color}` : "none",
//                       boxShadow: selectedOption === opt.value ? `0 0 15px ${opt.color}99` : "0 4px 15px rgba(0,0,0,0.1)",
//                       borderRadius: 16,
//                       transform: showOptions ? 'scale(1)' : 'scale(0.9)',
//                       opacity: showOptions ? 1 : 0,
//                       transition: `all 0.5s ease-out ${1.3 + (index * 0.1)}s`,
//                     }}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//             </div>

//             {/* Confirm Check-in Button - Color matches selected option */}
//            {selectedOption && (
//   <div style={{ 
//     display: "flex", 
//     justifyContent: "center", 
//     marginTop: 30
//   }}>
//     <div style={{
//       border: `3px solid ${getSelectedOptionColor()}`,
//       borderRadius: 12,
//       padding: 0,
//       display: 'inline-block'
//     }}>
//       <button
//         onClick={submitChoice}
//         style={{
//           ...buttonStyle,
//           padding: "20px 40px",
//           fontSize: 20,
//           backgroundColor: getSelectedOptionColor(),
//           borderRadius: 8,
//           boxShadow: `0 6px 20px ${getSelectedOptionColor()}66`,
//           transition: 'all 0.3s ease',
//           border: 'none',
//           margin: 0,
//           cursor: 'pointer',
//           // Add this class to target with CSS if needed
        
//         }}
//       >
//         ✓ Confirm Check-in
//       </button>
//     </div>
//   </div>
// )}
// </div>
//           {/* Information Inputs */}
//           <div style={{ 
//             display: "flex", 
//             flexDirection: "column", 
//             gap: 15, 
//             marginTop: 30,
//             marginBottom: 30,
//             opacity: showWelcome ? 1 : 0,
//             transition: 'opacity 0.8s ease-out 0.5s'
//           }}>
//             <input
//               placeholder="Date of Birth (optional)"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               style={inputStyle}
//             />
//             <input
//               placeholder="First line of address (optional)"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               style={inputStyle}
//             />
//             <input
//               placeholder="Postcode (optional)"
//               value={postcode}
//               onChange={(e) => setPostcode(e.target.value)}
//               style={inputStyle}
//             />
            
//             {/* Email input field */}
//             <div style={{ marginTop: 10 }}>
//               <input
//                 type="email"
//                 placeholder="Email address (optional - for QR code)"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={inputStyle}
//               />
              
//               {/* Send QR Code Button */}
//               {email && !emailSent && (
//                 <button
//                   onClick={sendQRCodeEmail}
//                   disabled={isSendingEmail}
//                   style={{
//                     ...buttonStyle,
//                     backgroundColor: isSendingEmail ? "#ccc" : "#00b894",
//                     marginTop: 10,
//                     width: "100%",
//                     fontSize: 16,
//                     padding: "12px 20px",
//                   }}
//                 >
//                   {isSendingEmail ? (
//                     <>
//                       <span style={{ marginRight: 8 }}>⏳</span>
//                       Sending QR Code...
//                     </>
//                   ) : (
//                     <>
//                       <span style={{ marginRight: 8 }}>📧</span>
//                       Send QR Code to Email
//                     </>
//                   )}
//                 </button>
//               )}
              
//               {/* Success message when email is sent */}
//               {emailSent && (
//                 <div style={{
//                   marginTop: 10,
//                   padding: "12px 20px",
//                   backgroundColor: "#00b894",
//                   color: "white",
//                   borderRadius: 8,
//                   fontWeight: 600,
//                   fontSize: 16,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8
//                 }}>
//                   <span>✓</span>
//                   QR Code sent to {email}
//                 </div>
//               )}
              
//               {/* Helper text */}
//               <p style={{
//                 fontSize: 14,
//                 color: "#666",
//                 marginTop: 8,
//                 marginBottom: 0,
//                 textAlign: "left"
//               }}>
//                 Enter your email to receive a QR code for future visits. This is optional.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CSS Animations */}
//       <style>
//   {`
//     @keyframes fadeIn {
//       from {
//         opacity: 0;
//         transform: translateY(20px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
    
//     #reader {
//       border: none !important;
//       background: none !important;
//       position: relative !important;
//       overflow: hidden !important;
//     }
//     #reader canvas, #reader video {
//       border: none !important;
//       border-radius: 20px !important;
//       position: relative !important;
//       z-index: 10 !important;
//       background: #000 !important;
//     }
//     #reader .html5-qrcode-overlay, 
//     #reader .html5-qrcode-button-start {
//       display: none !important;
//     }
    
//     /* Smooth transitions for all interactive elements */
//     button, input {
//       transition: all 0.3s ease !important;
//     }
    
//     /* Keep hover effects for all buttons except confirm check-in */
//     button:not(.confirm-button-no-hover):hover:not(:disabled) {
//       transform: translateY(-2px) !important;
//     }
    
//     button:not(.confirm-button-no-hover):active:not(:disabled) {
//       transform: translateY(1px) !important;
//     }
    
//     /* Specifically disable hover effects for confirm button */
//     .confirm-button-no-hover:hover {
//       transform: none !important;
//       box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
//     }
//   `}
// </style>
//     </div>
//   );
// }

// // Styles
// const cardStyle1: React.CSSProperties = {
//   padding: 20,
//   borderRadius: 16,
//   boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//   backgroundColor: "#fff",
//   transition: 'all 0.5s ease-in-out',
//   maxWidth: 610,
//   maxHeight: 610,
// };

// const cardStyle: React.CSSProperties = {
//   padding: 20,
//   borderRadius: 16,
//   boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//   backgroundColor: "#fff",
//   transition: 'all 0.5s ease-in-out',
// };

// const inputStyle2: React.CSSProperties = {
//   padding: 10,
//   borderRadius: 8,
//   border: "2px solid #e0e0e0",
//   width: "100%",
//   backgroundColor: "#fafafa",
//   fontSize: 18,
//   color: "#333",
//   fontWeight: 550,
//   boxSizing: "border-box",
//   transition: 'all 0.3s ease',
// };

// const inputStyle: React.CSSProperties = {
//   padding: 10,
//   borderRadius: 8,
//   border: "2px solid #e0e0e0",
//   width: "100%",
//   backgroundColor: "#fafafa",
//   fontSize: 18,
//   color: "#333",
//   fontWeight: 500,
//   boxSizing: "border-box",
//   transition: 'all 0.3s ease',
// };

// const buttonStyle: React.CSSProperties = {
//   padding: "28px 30px",
//   borderRadius: 8,
//   border: "none",
//   backgroundColor: "#0070f3",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: 600,
//   transition: "all 0.3s ease",
//   opacity: 1,
//   minWidth: "120px",
//   textAlign: "center",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const optionButtonStyle: React.CSSProperties = {
//   padding: "29px 38px",
//   borderRadius: 16,
//   border: "none",
//   color: "#222",
//   cursor: "pointer",
//   fontSize: 16,
//   fontWeight: 600,
//   minWidth: 240,
//   boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//   transition: "all 0.3s ease",
// };