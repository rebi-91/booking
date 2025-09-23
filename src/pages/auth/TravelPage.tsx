
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "./TravelPage.css"; // ⬅️ new styles (below)



/** ------------------ Vaccination product list (unchanged) ------------------ */
type Category = "Vaccines" | "Anti-malarials" | "Consultation";
interface TravelItem {
  id: number;
  title: string;
  price: string;
  doses?: string;
  notes?: string;
  category: Category;
  featured?: boolean;
}

const ITEMS: TravelItem[] = [
  { id: 3, title: "Travel Consultation", price: "£10.00", notes: "Deducted if you go ahead with treatment", category: "Consultation", featured: true },
  { id: 30, title: "Diphtheria, Tetanus & Polio (DTP)", price: "£40.00", doses: "1 dose", category: "Vaccines" },
  { id: 31, title: "Hepatitis A", price: "£60.00 per dose", doses: "2 doses", category: "Vaccines" },
  { id: 32, title: "Hepatitis B", price: "£60.00 per dose", doses: "3 doses", category: "Vaccines" },
  { id: 33, title: "Typhoid (Injection or Oral)", price: "£40.00", doses: "1 course", category: "Vaccines" },
  { id: 34, title: "Rabies", price: "£90.00 per dose", doses: "3 doses", category: "Vaccines" },
  { id: 35, title: "Meningitis ACWY", price: "£60.00", doses: "1 dose", notes: "Hajj/Umrah certificate provided", category: "Vaccines" },
  { id: 36, title: "Cholera", price: "£90.00", doses: "2 doses (special cases)", category: "Vaccines" },
  { id: 37, title: "Japanese Encephalitis", price: "£100.00 per dose", doses: "Course per schedule", category: "Vaccines" },
  { id: 38, title: "Chicken Pox (Varicella)", price: "£80.00", doses: "Per dose", category: "Vaccines" },
  { id: 39, title: "Meningitis B (Bexsero)", price: "£140.00", doses: "Per dose", category: "Vaccines" },
  { id: 40, title: "Shingles (Zostavax)", price: "£200.00", doses: "1 dose", category: "Vaccines" },
  { id: 42, title: "HPV (Gardasil-9)", price: "£184.50 per dose", doses: "2 doses £362 / 3 doses £540", category: "Vaccines" },
  { id: 43, title: "Dengue (Qdenga)", price: "£130.00 per dose", doses: "2 doses", category: "Vaccines" },
  { id: 17, title: "Yellow Fever", price: "Call for price", doses: "1 dose", category: "Vaccines" },
  { id: 41, title: "Anti-malarials", price: "Malarone £40 / Doxycycline £25", doses: "Course length varies", category: "Anti-malarials" },
];

const CATEGORIES: Category[] = ["Vaccines", "Anti-malarials", "Consultation"];

/** ------------------ Country dataset (demo) ------------------ */
type Risk = "Low" | "Medium" | "High";

interface Country {
  name: string;
  code: string;         // ISO-2
  flag: string;         // emoji flag
  risk: Risk;
  required: string[];   // mandatory for entry (if any)
  recommended: string[];// commonly recommended
  info?: string;        // short extra info
  image: string;        // hero image URL
}

// NOTE: This is guidance-only demo data.
// Always assess individual needs during consultation.
const COUNTRIES: Country[] = [
    // ——— From your screenshots: ALL Popular Destinations ———
    {
      name: "Algeria", code: "DZ", flag: "🇩🇿", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (remote/animal contact)"],
      info: "Food & water hygiene advised; consider rabies if travelling outside cities.",
      image: "https://images.unsplash.com/photo-1600275669439-df5fbe5f1c00?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Argentina", code: "AR", flag: "🇦🇷", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster"],
      info: "Yellow fever is recommended for travel to some northern provinces.",
      image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Australia", code: "AU", flag: "🇦🇺", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Belize", code: "BZ", flag: "🇧🇿", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials (regional)", "Rabies (caving/animal contact)"],
      info: "Mosquito bite avoidance essential; malaria in some rural areas.",
      image: "https://images.unsplash.com/photo-1534293232045-791f2f2e9b6d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Bolivia", code: "BO", flag: "🇧🇴", risk: "High",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Yellow Fever (recommended for tropical regions)", "Rabies (remote travel)"],
      info: "YF recommended for low-altitude tropical zones; altitude issues common.",
      image: "https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Brazil", code: "BR", flag: "🇧🇷", risk: "Medium",
      required: ["Yellow Fever (may be required for certain regions/entries)"],
      recommended: ["Hepatitis A", "Typhoid", "Yellow Fever (recommended in many states)"],
      info: "Check itinerary—YF widely recommended; bite avoidance crucial.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Cambodia", code: "KH", flag: "🇰🇭", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Japanese Encephalitis (rural/long stay)", "Rabies (animal exposure)"],
      info: "JE depends on season and rural exposure.",
      image: "https://images.unsplash.com/photo-1505733044-bf2cc7b7f9d5?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Canada", code: "CA", flag: "🇨🇦", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "China", code: "CN", flag: "🇨🇳", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (long stays/animal contact)"],
      info: "Consider itinerary—rural trips increase exposure risks.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Colombia", code: "CO", flag: "🇨🇴", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Yellow Fever (recommended for many regions)", "Anti-malarials (regional)"],
      info: "YF recommended for Amazon and many inland areas.",
      image: "https://images.unsplash.com/photo-1508612761958-e931d843bddb?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Costa Rica", code: "CR", flag: "🇨🇷", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid"],
      info: "Bite avoidance for dengue/chikungunya recommended.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Dominican Republic", code: "DO", flag: "🇩🇴", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid"],
      info: "Standard food & water precautions advised.",
      image: "https://images.unsplash.com/photo-1529694157871-0cdb2314d8b9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Egypt", code: "EG", flag: "🇪🇬", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (remote/animal contact)"],
      info: "Street-food hygiene and bottled water recommended.",
      image: "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Fiji", code: "FJ", flag: "🇫🇯", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster"],
      info: "Mosquito bite avoidance important (dengue risk).",
      image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop",
    },
    { name: "Finland", code: "FI", flag: "🇫🇮", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop" },
    { name: "France", code: "FR", flag: "🇫🇷", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1528291151373-2a2d4b4f7b86?q=80&w=1600&auto=format&fit=crop" },
    { name: "Germany", code: "DE", flag: "🇩🇪", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1509395284057-84f63f9a5c44?q=80&w=1600&auto=format&fit=crop" },
    {
      name: "Guatemala", code: "GT", flag: "🇬🇹", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (caves/animal contact)"],
      image: "https://images.unsplash.com/photo-1520975922284-7b10f1f2e5d4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Honduras", code: "HN", flag: "🇭🇳", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials (regional)"],
      image: "https://images.unsplash.com/photo-1531265511691-87fa53a2b2a0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "India", code: "IN", flag: "🇮🇳", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (long stays/remote)", "Japanese Encephalitis (rural/seasonal)"],
      info: "Consider JE for extended rural travel; food & water hygiene essential.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Indonesia", code: "ID", flag: "🇮🇩", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (Bali/remote areas)", "Japanese Encephalitis (rural/long stay)", "Anti-malarials (regional)"],
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
    { name: "Japan", code: "JP", flag: "🇯🇵", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)", "Japanese Encephalitis (long rural stays)"],
      image: "https://images.unsplash.com/photo-1505060893248-7cc27c2b3d90?q=80&w=1600&auto=format&fit=crop" },
    {
      name: "Jordan", code: "JO", flag: "🇯🇴", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster"],
      image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Kenya", code: "KE", flag: "🇰🇪", risk: "High",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (long stays)", "Anti-malarials"],
      info: "Malaria risk in many regions—chemo-prophylaxis recommended.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
    { name: "Lebanon", code: "LB", flag: "🇱🇧", risk: "Medium",
      required: [], recommended: ["Hepatitis A", "Typhoid", "Tetanus booster"],
      image: "https://images.unsplash.com/photo-1552176625-9b9f2b2e7b0f?q=80&w=1600&auto=format&fit=crop" },
    {
      name: "Malaysia", code: "MY", flag: "🇲🇾", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (exposure risk)", "Japanese Encephalitis (rural/long stay)"],
      info: "Dengue present—mosquito bite avoidance essential.",
      image: "https://images.unsplash.com/photo-1529123050123-4e35c0cdb5b7?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Maldives", code: "MV", flag: "🇲🇻", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)", "Hepatitis A"],
      info: "Resort hygiene generally high; protect against mosquito bites.",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Mexico", code: "MX", flag: "🇲🇽", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid"],
      info: "Food & water precautions advised.",
      image: "https://images.unsplash.com/photo-1526401485004-2fda9f4b0f87?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Morocco", code: "MA", flag: "🇲🇦", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (remote/animal contact)"],
      info: "Street-food hygiene and safe water recommended.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Nepal", code: "NP", flag: "🇳🇵", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (trekking)", "Japanese Encephalitis (rural/seasonal)"],
      info: "Altitude medications may be appropriate for trekking itineraries.",
      image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d5?q=80&w=1600&auto=format&fit=crop",
    },
    { name: "New Zealand", code: "NZ", flag: "🇳🇿", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop" },
    { name: "Norway", code: "NO", flag: "🇳🇴", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=1600&auto=format&fit=crop" },
    {
      name: "Oman", code: "OM", flag: "🇴🇲", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)", "Hepatitis A", "Typhoid (if eating widely)"],
      image: "https://images.unsplash.com/photo-1548786811-ff3ad45f0b4b?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Pakistan", code: "PK", flag: "🇵🇰", risk: "High",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (long stays)", "Japanese Encephalitis (rural/seasonal)"],
      info: "Bite avoidance and strict food & water hygiene recommended.",
      image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Panama", code: "PA", flag: "🇵🇦", risk: "Medium",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials (Darién/remote)"],
      image: "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Peru", code: "PE", flag: "🇵🇪", risk: "High",
      required: ["Yellow Fever (may be required for tropical regions)"],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (rural/remote)"],
      info: "YF widely recommended for Amazon/low-jungle areas.",
      image: "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Philippines", code: "PH", flag: "🇵🇭", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (animal exposure)", "Japanese Encephalitis (rural/long stay)"],
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
    },
    { name: "Portugal", code: "PT", flag: "🇵🇹", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      info: "Heatwave precautions in summer.",
      image: "https://images.unsplash.com/photo-1565106430482-8f7c0f3d6c2b?q=80&w=1600&auto=format&fit=crop" },
    { name: "Qatar", code: "QA", flag: "🇶🇦", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)", "Hepatitis A"],
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1600&auto=format&fit=crop" },
    {
      name: "Russian Federation", code: "RU", flag: "🇷🇺", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid (if eating widely)", "Tetanus booster", "Rabies (long stays/remote)"],
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Rwanda", code: "RW", flag: "🇷🇼", risk: "High",
      required: ["Yellow Fever (commonly required)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials", "Rabies (remote/animal contact)"],
      image: "https://images.unsplash.com/photo-1558981359-219d6364c9f0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Saudi Arabia", code: "SA", flag: "🇸🇦", risk: "Medium",
      required: ["Meningitis ACWY (Hajj/Umrah pilgrims)"],
      recommended: ["Hepatitis A", "Typhoid", "Routine boosters (MMR, Tetanus)"],
      info: "Clinic provides Hajj/Umrah ACWY certificate.",
      image: "https://images.unsplash.com/photo-1542382257-80dedb72508b?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Senegal", code: "SN", flag: "🇸🇳", risk: "High",
      required: ["Yellow Fever (commonly required)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials", "Rabies (remote/animal contact)"],
      image: "https://images.unsplash.com/photo-1551281044-8d8a8b9d4b66?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "South Africa", code: "ZA", flag: "🇿🇦", risk: "Medium",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)", "Hepatitis A", "Typhoid", "Anti-malarials (regional)"],
      info: "Malaria present in specific regions—seek itinerary advice.",
      image: "https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=1600&auto=format&fit=crop",
    },
    { name: "Sri Lanka", code: "LK", flag: "🇱🇰", risk: "Medium",
      required: [], recommended: ["Hepatitis A", "Typhoid", "Rabies (long stays/animal contact)"],
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop" },
    { name: "Sweden", code: "SE", flag: "🇸🇪", risk: "Low",
      required: [], recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1477255608475-1860f114bf77?q=80&w=1600&auto=format&fit=crop" },
    {
      name: "Tanzania", code: "TZ", flag: "🇹🇿", risk: "High",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials", "Rabies (safari/remote)"],
      image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Thailand", code: "TH", flag: "🇹🇭", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (animal exposure)", "Japanese Encephalitis (rural/long stay)"],
      info: "JE considered for rural itineraries during transmission season.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Tunisia", code: "TN", flag: "🇹🇳", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster"],
      image: "https://images.unsplash.com/photo-1528650371593-47b6a49cfdc9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Türkiye (Turkey)", code: "TR", flag: "🇹🇷", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)", "Hepatitis A", "Typhoid (if off-resort)"],
      image: "https://images.unsplash.com/photo-1473953871802-2cf4f1b4d24f?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Uganda", code: "UG", flag: "🇺🇬", risk: "High",
      required: ["Yellow Fever certificate (commonly required)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials", "Rabies (remote/animal contact)"],
      image: "https://images.unsplash.com/photo-1558981359-219d6364c9f0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "United States of America", code: "US", flag: "🇺🇸", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Uruguay", code: "UY", flag: "🇺🇾", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)", "Hepatitis A"],
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Vietnam", code: "VN", flag: "🇻🇳", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (exposure risk)", "Japanese Encephalitis (rural/long stay)"],
      image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Zambia", code: "ZM", flag: "🇿🇲", risk: "High",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials", "Rabies (remote/animal contact)"],
      image: "https://images.unsplash.com/photo-1558981033-0f7e1229f66f?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Zimbabwe", code: "ZW", flag: "🇿🇼", risk: "High",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Anti-malarials", "Rabies (remote/animal contact)"],
      image: "https://images.unsplash.com/photo-1505245208761-ba872912fac0?q=80&w=1600&auto=format&fit=crop",
    },
  
    // (already in your demo — kept intact / slightly aligned)
    {
      name: "Portugal", code: "PT", flag: "🇵🇹", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)"],
      info: "Public healthcare is excellent. Pay attention to heatwaves in summer.",
      image: "https://images.unsplash.com/photo-1565106430482-8f7c0f3d6c2b?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Morocco", code: "MA", flag: "🇲🇦", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster"],
      info: "Food and water hygiene advised, especially when eating street food.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Kenya", code: "KE", flag: "🇰🇪", risk: "High",
      required: ["Yellow Fever (if arriving from/through risk areas)"],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (long stays)", "Anti-malarials"],
      info: "Malaria risk in many regions—chemo-prophylaxis recommended.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "India", code: "IN", flag: "🇮🇳", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Tetanus booster", "Rabies (long stays)"],
      info: "Consider Japanese Encephalitis for extended rural travel.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Thailand", code: "TH", flag: "🇹🇭", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (activities with animals)"],
      info: "JE vaccine for long rural trips during transmission seasons.",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Brazil", code: "BR", flag: "🇧🇷", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Yellow Fever (recommended)", "Typhoid"],
      info: "Yellow Fever recommended for many states; check itinerary.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Japan", code: "JP", flag: "🇯🇵", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)"],
      info: "JE considered for long rural stays.",
      image: "https://images.unsplash.com/photo-1505060893248-7cc27c2b3d90?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Malaysia", code: "MY", flag: "🇲🇾", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (exposure risk)"],
      info: "Dengue present—mosquito bite avoidance essential.",
      image: "https://images.unsplash.com/photo-1529123050123-4e35c0cdb5b7?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Mexico", code: "MX", flag: "🇲🇽", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid"],
      info: "Food & water precautions advised.",
      image: "https://images.unsplash.com/photo-1526401485004-2fda9f4b0f87?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Nepal", code: "NP", flag: "🇳🇵", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (trekking)"],
      info: "Altitude sickness medication may be appropriate for trekking.",
      image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d5?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Australia", code: "AU", flag: "🇦🇺", risk: "Low",
      required: [],
      recommended: ["Routine boosters (MMR, Tetanus)"],
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Vietnam", code: "VN", flag: "🇻🇳", risk: "Medium",
      required: [],
      recommended: ["Hepatitis A", "Typhoid", "Rabies (exposure risk)"],
      image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop",
    },
  ];
  
// src/pages/TravelPage.tsx

// Small helper to color the Risk badge (Bootstrap utility colors)
const riskBadgeClass = (risk: "Low" | "Medium" | "High") =>
  risk === "Low"
    ? "bg-success-subtle text-success"
    : risk === "Medium"
    ? "bg-warning-subtle text-warning"
    : "bg-danger-subtle text-danger";

// (Optional) short, friendly descriptions for vaccine cards in the grid
const DESCRIPTIONS: Record<number, string> = {
  41: "Protects you from malaria when travelling to high-risk areas",
  36: "Protects you from cholera infection while travelling",
  30: "Quick and simple vaccination process",
  31: "Protects you from catching Hepatitis A while travelling",
  32: "Long-lasting protection with full course",
  37: "Protects you from a serious mosquito-borne disease",
  35: "Protects against four types of meningitis",
  38: "Suitable for those who need protection",
  39: "Helps protect against MenB disease",
  40: "Shingles protection for eligible adults",
  42: "HPV (Gardasil-9) protection — course as advised",
  43: "Protection against dengue (2-dose schedule)",
  34: "Animal-bite/remote travel protection",
  33: "Food & water protection (injection or oral)",
  17: "Please call for latest availability and price",
  3:  "Your tailored travel health advice",
};

// A tidy two-column list like in your screenshot
const VaccinationGrid: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="row g-4">
    {items.map((it) => {
      const desc =
        DESCRIPTIONS[it.id] ||
        "Protection and advice tailored to your trip and medical history.";
      const isCall = it.price.toLowerCase().includes("call");
      return (
        <div key={it.id} className="col-12 col-md-6">
          <div className="vacc-card shadow-sm">
            <div className="vacc-card__text">
              <h3 className="vacc-card__title">{it.title}</h3>
              <p className="vacc-card__desc">{desc}</p>
              <span className="price-pill">{it.price}</span>
            </div>
            <div className="vacc-card__cta">
              {isCall ? (
                <a href="tel:+441675462450" className="btn btn-cta">
                  Call to book
                </a>
              ) : (
                <Link to={`/book/${it.id}`} className="btn btn-cta">
                  Book now
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const TravelPage: React.FC = () => {
  // ——— Country selection + autocomplete ———
  const [countryQuery, setCountryQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    null
  );
  const suggestRef = useRef<HTMLDivElement | null>(null);

  // pick a sensible default country on first render
  useEffect(() => {
    setSelectedCountry(COUNTRIES.find((c) => c.name === "Portugal") ?? COUNTRIES[0]);
  }, []);

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return [];
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [countryQuery]);

  const chooseCountry = (c: Country) => {
    setSelectedCountry(c);
    setCountryQuery(c.name);
    setShowSuggest(false);
  };

  // close suggestions when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!suggestRef.current) return;
      if (!suggestRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ——— Ticker (marquee) ———
  const POPULAR = useMemo(() => {
    // Choose an order that looks good; adjust/remove to use all countries
    const want = [
      "Argentina", "Australia", "Bolivia", "Brazil", "Belize",
      "Japan", "Jordan", "Kenya", "Lebanon", "Malaysia", "Maldives",
      "Mexico", "Morocco", "Nepal", "New Zealand", "Norway",
      "Oman", "Pakistan", "Peru", "Philippines", "Portugal",
      "Qatar", "Rwanda", "Saudi Arabia", "Senegal", "South Africa",
      "Sri Lanka", "Sweden", "Tanzania", "Thailand", "Tunisia",
      "Türkiye (Turkey)", "Uganda", "Uruguay", "United States of America",
      "Vietnam", "Zambia", "Zimbabwe",
    ];
    const picked = COUNTRIES.filter((c) => want.includes(c.name));
    return picked.length ? picked : COUNTRIES.slice(0, 24);
  }, []);

  // ——— Vaccination cards (keep your prices/IDs) ———
  const cards = useMemo(() => {
    // put Anti-malarials + Cholera at the top like the screenshot
    const priorityOrder = [41, 36];
    const priority = ITEMS.filter((i) => priorityOrder.includes(i.id));
    const rest = ITEMS.filter((i) => !priorityOrder.includes(i.id));
    return [...priority, ...rest];
  }, []);

  return (
    <div className="bg-light">
      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Travel Advisor</h1>
          <p className="hero__subtitle">
            Discover recommended vaccinations for safe travel.
          </p>

          {/* Search (pill) */}
          <div className="hero-search" ref={suggestRef}>
            <i className="bi bi-search hero-search__icon" />
            <input
              className="hero-search__input"
              placeholder="Enter your destination..."
              value={countryQuery}
              onChange={(e) => {
                setCountryQuery(e.target.value);
                setShowSuggest(e.target.value.trim().length > 0);
              }}
              onFocus={() =>
                setShowSuggest((s) => countryQuery.trim().length > 0 || s)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredCountries[0]) {
                  chooseCountry(filteredCountries[0]);
                }
              }}
            />
            <button
              className="btn hero-search__btn"
              onClick={() => {
                if (filteredCountries[0]) chooseCountry(filteredCountries[0]);
              }}
            >
              Search
            </button>

            {/* Suggestions – only when typing */}
            {showSuggest && filteredCountries.length > 0 && (
              <div className="suggestions">
                {filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    className="suggestions__item"
                    onClick={() => chooseCountry(c)}
                  >
                    <span className="me-2">{c.flag}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* POPULAR (ticker) */}
      <section className="ticker-wrap">
        <div className="container">
          <div className="text-center text-muted small mb-2">
            Popular Destinations
          </div>

          <div className="country-ticker" aria-hidden="true">
            {/* Duplicate the line twice for a seamless loop */}
            <div className="country-ticker__track">
              {[...POPULAR, ...POPULAR].map((c, i) => (
                <button
                  key={`${c.code}-${i}`}
                  className="country-chip"
                  onClick={() => chooseCountry(c)}
                  title={c.name}
                >
                  <span className="me-2">{c.flag}</span>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRY CARD (changes without navigation) */}
      {selectedCountry && (
        <section className="py-4">
          <div className="container">
            <div className="card shadow-sm overflow-hidden rounded-4">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="p-4 p-lg-5">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fs-4 me-2">{selectedCountry.flag}</span>
                      <h2 className="h4 mb-0">{selectedCountry.name}</h2>
                      <span
                        className={`badge ms-3 ${riskBadgeClass(
                          selectedCountry.risk
                        )}`}
                      >
                        {selectedCountry.risk} Risk
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="fw-semibold mb-2">
                        <i className="bi bi-shield-check me-2" />
                        Required Vaccinations
                      </div>
                      {selectedCountry.required.length ? (
                        <ul className="mb-3">
                          {selectedCountry.required.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-muted mb-3">
                          No mandatory vaccinations required.
                        </div>
                      )}

                      <div className="fw-semibold mb-2">
                        <i className="bi bi-info-circle me-2" />
                        Additional Information
                      </div>
                      <div className="alert alert-primary mb-3 py-2">
                        {selectedCountry.info ||
                          "For personalised advice, book a travel consultation."}
                      </div>

                      <div className="alert alert-secondary mb-0 py-2">
                        <div className="fw-semibold mb-1">Disclaimer</div>
                        This information is for guidance only. For personalised
                        travel health advice, please consult our travel clinic
                        and speak to one of our specialists.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <img
                    src={selectedCountry.image}
                    alt={selectedCountry.name}
                    className="w-100 h-100 object-fit-cover"
                    style={{ minHeight: 320 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VACCINATION CARDS (always visible) */}
      <section className="py-4">
        <div className="container">
          <VaccinationGrid items={cards} />
        </div>
      </section>
    </div>
  );
};

export default TravelPage;
