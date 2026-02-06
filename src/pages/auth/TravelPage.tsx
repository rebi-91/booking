
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import "./TravelPage.css";

const MAIN_TEXT_COLOR = 'rgb(119, 128, 159)';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';
const MAINS_TEXT_COLOR = 'rgb(14, 75, 141)';
const MAIS_TEXT_COLOR = 'rgb(14, 75, 141)';
const ACCENT_COLOR = '#00D364';
const ACC_COLOR = 'rgb(42, 157, 239)';

/** ------------------ Vaccination product list ------------------ */
type Category = "Vaccines" | "Anti-malarials" | "Consultation";
interface TravelItem {
  id: number;
  title: string;
  price: string;
  doses?: string;
  notes?: string;
  description?: string;
  category: Category;
  featured?: boolean;
}

const ITEMS: TravelItem[] = [
  {
    id: 3,
    title: "Travel Consultation",
    price: "£10.00",
    notes: "Deducted if you go ahead with treatment",
    description: "One-to-one consultation with our pharmacist to review your destination, health needs, and vaccination history. We'll recommend exactly what’s required for safe travel.",
    category: "Consultation",
    featured: true
  },
  {
    id: 30,
    title: "Diphtheria, Tetanus & Polio (DTP)",
    price: "£40.00",
    doses: "1 dose",
    description: "A combined booster that protects against three potentially life-threatening infections. Recommended for travel to areas where these diseases are still present.",
    category: "Vaccines"
  },
  {
    id: 31,
    title: "Hepatitis A",
    price: "£60.00 per dose",
    doses: "2 doses",
    description: "Protects against Hepatitis A, a liver infection spread through contaminated food and water. Essential for travel to many parts of the world.",
    category: "Vaccines"
  },
  {
    id: 32,
    title: "Hepatitis B",
    price: "£60.00 per dose",
    doses: "3 doses",
    description: "Provides protection against Hepatitis B, a virus spread through blood and bodily fluids. Recommended for long stays, healthcare work, or high-risk exposure.",
    category: "Vaccines"
  },
  {
    id: 33,
    title: "Typhoid (Injection or Oral)",
    price: "£40.00",
    doses: "1 course",
    description: "Helps prevent typhoid fever, a serious infection spread through contaminated food and drink. Important for travel to Asia, Africa, and Latin America.",
    category: "Vaccines"
  },
  {
    id: 34,
    title: "Rabies",
    price: "£90.00 per dose",
    doses: "3 doses",
    description: "Recommended for travellers at risk of animal bites. Provides protection against rabies, which is almost always fatal once symptoms appear.",
    category: "Vaccines"
  },
  {
    id: 35,
    title: "Meningitis ACWY",
    price: "£60.00",
    doses: "1 dose",
    notes: "Hajj/Umrah certificate provided",
    description: "Protects against four strains of meningitis. A mandatory requirement for Hajj and Umrah travellers. Certificate issued on vaccination.",
    category: "Vaccines"
  },
  {
    id: 36,
    title: "Cholera",
    price: "£90.00",
    doses: "2 doses (special cases)",
    description: "Oral vaccine for protection against cholera, an infection spread by unsafe food and water. Recommended for travellers to high-risk areas or aid workers.",
    category: "Vaccines"
  },
  {
    id: 37,
    title: "Japanese Encephalitis",
    price: "£100.00 per dose",
    doses: "Course per schedule",
    description: "Recommended for long stays or rural travel in Asia. Protects against Japanese encephalitis, a mosquito-borne infection that can cause brain inflammation.",
    category: "Vaccines"
  },
  {
    id: 38,
    title: "Chicken Pox (Varicella)",
    price: "£80.00",
    doses: "Per dose",
    description: "Helps prevent chickenpox infection and complications. Suitable for those who haven’t had chickenpox before and want immunity.",
    category: "Vaccines"
  },
  {
    id: 39,
    title: "Meningitis B (Bexsero)",
    price: "£140.00",
    doses: "Per dose",
    description: "Protects against meningitis B, a serious cause of meningitis and blood poisoning. Strongly recommended for young people and certain high-risk travellers.",
    category: "Vaccines"
  },
  {
    id: 40,
    title: "Shingles (Zostavax)",
    price: "£200.00",
    doses: "1 dose",
    description: "For adults over 50. Helps prevent shingles and reduces the severity of outbreaks if they occur.",
    category: "Vaccines"
  },
  {
    id: 42,
    title: "HPV (Gardasil-9)",
    price: "£184.50 per dose",
    doses: "2 doses £362 / 3 doses £540",
    description: "Protects against human papillomavirus (HPV), which can cause cervical and other cancers, as well as genital warts. Covers 9 different HPV strains.",
    category: "Vaccines"
  },
  {
    id: 43,
    title: "Dengue (Qdenga)",
    price: "£130.00 per dose",
    doses: "2 doses",
    description: "Protects against dengue fever, a mosquito-borne infection common in tropical and subtropical areas. Recommended for long-term travellers and residents.",
    category: "Vaccines"
  },
  {
    id: 17,
    title: "Yellow Fever",
    price: "Unavailable",
    doses: "1 dose",
    description: "Currently unavailable. Protects against yellow fever, a mosquito-borne viral infection. Certificate often required for entry into certain countries.",
    category: "Vaccines"
  },
  {
    id: 41,
    title: "Anti-malarials",
    price: "Malarone £51.99 / Doxycycline £25",
    doses: "Course length varies",
    description: "Medication to prevent malaria, tailored to your destination and medical history. We'll advise on the best option and course length for your trip.",
    category: "Anti-malarials"
  }
];



/** ------------------ Country dataset ------------------ */
type Risk = "Low" | "Medium" | "High";

interface Country {
  name: string;
  code: string;
  flag: string;
  risk: Risk;
  required: string[];
  recommended: string[];
  info?: string;
  image: string;
}

const COUNTRIES: Country[] = [
  // ——— From your screenshots: ALL Popular Destinations ———
  {
    name: "Algeria", code: "DZ", flag: "🇩🇿", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Large desert regions require adequate hydration. Healthcare varies outside major cities.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FDZ.webp&w=3840&q=75",
  },
  {
    name: "Argentina", code: "AR", flag: "🇦🇷", risk: "Medium",
    required: ["Meningitis ACWY"],
    recommended: ["Yellow fever", "Hepatitis A"],
    info: "Travelers visiting Iguazu Falls region often recommended to get Yellow Fever vaccine.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FAR.webp&w=3840&q=75",
  },
  {
    name: "Australia", code: "AU", flag: "🇦🇺", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis B"],
    info: "High standard of hygiene and healthcare. Japanese Encephalitis only if visiting Torres Strait.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FAU.webp&w=3840&q=75",
  },
  {
    name: "Belize", code: "BZ", flag: "🇧🇿", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Some areas have malaria risk, use mosquito repellents and prophylaxis if recommended.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FBZ.webp&w=3840&q=75",
  },
  {
    name: "Bolivia", code: "BO", flag: "🇧🇴", risk: "High",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Yellow Fever"],
    info: "Altitude sickness is a concern in La Paz and other high-elevation regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FBO.webp&w=3840&q=75",
  },
  {
    name: "Brazil", code: "BR", flag: "🇧🇷", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies", "Anti Malarial", "Hepatitis B"],
    info: "Yellow fever vaccination required for certain regions. Zika virus precautions recommended.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FBR.webp&w=3840&q=75",
  },
  {
    name: "Cambodia", code: "KH", flag: "🇰🇭", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Japanese Encephalitis"],
    info: "Malaria prophylaxis may be considered outside major cities. Safe food and water practices advised.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FKH.webp&w=3840&q=75",
  },
  {
    name: "Canada", code: "CA", flag: "🇨🇦", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: [],
    info: "Healthcare standards are high. Winter travelers should consider influenza shots.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FCA.webp&w=3840&q=75",
  },
  {
    name: "China", code: "CN", flag: "🇨🇳", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Large country with varying medical facilities. Air quality concerns in some cities.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FCN.webp&w=3840&q=75",
  },
  {
    name: "Colombia", code: "CO", flag: "🇨🇴", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Yellow Fever"],
    info: "Mosquito-borne illnesses can be an issue in jungle areas. Check local advisories for malaria risk.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FCO.webp&w=3840&q=75",
  },
  {
    name: "Costa Rica", code: "CR", flag: "🇨🇷", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Hepatitis B", "Rabies"],
    info: "Generally safe for travelers. Rabies vaccination recommended for adventure travelers.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FCR.webp&w=3840&q=75",
  },
  {
    name: "Dominican Republic", code: "DO", flag: "🇩🇴", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarial"],
    info: "Be cautious of mosquito-borne illnesses; use insect repellent and protective clothing.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FDO.webp&w=3840&q=75",
  },
  {
    name: "Egypt", code: "EG", flag: "🇪🇬", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid","Hepatitis B", "Rabies", ],
    info: "Risk of schistosomiasis in freshwater. Rabies vaccination recommended for rural areas.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FEG.webp&w=3840&q=75",
  },
  {
    name: "Fiji", code: "FJ", flag: "🇫🇯", risk: "Medium",
    required: ["Meningitis ACWY"],
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Mosquito-borne illnesses can be a concern in tropical regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FFJ.webp&w=3840&q=75",
  },

  { name: "Finland", code: "FI", flag: "🇫🇮", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: ["Tick-borne encephalitis"],
    info: "Excellent medical facilities. Consider TBE vaccination if visiting the Åland Islands or forested regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FFI.webp&w=3840&q=75" },

  { name: "France", code: "FR", flag: "🇫🇷", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: [""],
    info: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FFR.webp&w=3840&q=75",
    image: "https://images.unsplash.com/photo-1528291151373-2a2d4b4f7b86?q=80&w=1600&auto=format&fit=crop" },


  { name: "Germany", code: "DE", flag: "🇩🇪", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: [""],
    info: "Excellent healthcare system. Keep routine vaccinations up to date.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FDE.webp&w=3840&q=75" },
  {
    name: "Guatemala", code: "GT", flag: "🇬🇹", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Altitude can be a factor in mountainous regions. Tap water is generally not potable.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FGT.webp&w=3840&q=75",
  },
  {
    name: "Honduras", code: "HN", flag: "🇭🇳", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Mosquito-borne illnesses like dengue and Zika occur. Protect against mosquito bites.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FHN.webp&w=3840&q=75",
  },
  {
    name: "India", code: "IN", flag: "🇮🇳", risk: "High",
    required: ["Hepatitis A", "Typhoid", "Yellow Fever"],
    recommended: ["Hepatitis B", "Anti Malarial", "Japanese Encephalitis", "Rabies"],
    info: "Malaria risk is present throughout the country. Consider additional precautions during monsoon season.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FIN.webp&w=3840&q=75",
  },
  {
    name: "Indonesia", code: "ID", flag: "🇮🇩", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies", "Japanese Encephalitis", "Anti-malarials"],
    info: "Risk varies by island. Malaria prevention recommended for rural areas and eastern islands.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FID.webp&w=3840&q=75",
  },
  { name: "Japan", code: "JP", flag: "🇯🇵", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: ["Hepatitis A", "Hepatitis B", "Japanese Encephalitis (long rural stays)"],
    info: "Generally very safe for travelers. Standard precautions recommended.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FJP.webp&w=3840&q=75" },
  {
    name: "Jordan", code: "JO", flag: "🇯🇴", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Desert climate, stay hydrated and avoid heat exhaustion.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FJO.webp&w=3840&q=75",
  },
  {
    name: "Kenya", code: "KE", flag: "🇰🇪", risk: "High",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Hepatitis B", "Meningitis ACWY", "Typhoid", "Rabies", "Anti Malarial"],
    info: "Malaria prevention essential. Consider meningitis vaccine if traveling to affected areas.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FKE.webp&w=3840&q=75",
  },
  { name: "Lebanon", code: "LB", flag: "🇱🇧", risk: "Medium",
    required: ["No mandatory vaccinations required"], 
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Healthcare is good in major cities. Check security advisories for certain regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FLB.webp&w=3840&q=75" },
  {
    name: "Malaysia", code: "MY", flag: "🇲🇾", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Dengue fever is a concern, use insect repellent and stay in accommodations with air conditioning.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FMY.webp&w=3840&q=75",
  },
  {
    name: "Maldives", code: "MV", flag: "🇲🇻", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: ["Typhoid", "Hepatitis A"],
    info: "Resort islands have medical facilities, but remote islands may have limited resources. Dengue fever can occur.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FMV.webp&w=3840&q=75",
  },
  {
    name: "Mexico", code: "MX", flag: "🇲🇽", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A","Hepatitis B", "Typhoid", "Anti Malarial",],
    info: "Malaria risk in certain rural areas. Food and water precautions recommended.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FMX.webp&w=3840&q=75",
  },
  {
    name: "Morocco", code: "MA", flag: "🇲🇦", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis B", "Typhoid", "Rabies", "Hepatitis A"],
    info: "Generally safe for travelers. Rabies vaccination recommended for hiking in rural areas.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FJP.webp&w=3840&q=75",
  },
  {
    name: "Nepal", code: "NP", flag: "🇳🇵", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Altitude sickness is a serious concern for high-altitude treks.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FNP.webp&w=3840&q=75",
  },

  { name: "New Zealand", code: "NZ", flag: "🇳🇿", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: [""],
    info: "Excellent healthcare. Protect against strong UV rays with sunscreen.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FNZ.webp&w=3840&q=75" },


  { name: "Norway", code: "NO", flag: "🇳🇴", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: [],
    info: "Healthcare is top-notch. Be prepared for cold weather and changing conditions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FNO.webp&w=3840&q=75" },
  {
    name: "Oman", code: "OM", flag: "🇴🇲", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A"],
    info: "Healthcare system is good. Desert climate, be mindful of heat and stay well hydrated.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FOM.webp&w=3840&q=75",
  },
  {
    name: "Pakistan", code: "PK", flag: "🇵🇰", risk: "High",
    required: ["Diphtheria, Tetanus, and Polio"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Polio vaccination certificate often required for exit. Healthcare quality varies by region.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FPK.webp&w=3840&q=75",
  },
  {
    name: "Panama", code: "PA", flag: "🇵🇦", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Yellow Fever"],
    info: "Mosquito-borne diseases in lowland areas, take precautions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FPA.webp&w=3840&q=75",
  },
  {
    name: "Peru", code: "PE", flag: "🇵🇪", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Hepatitis B", "Typhoid", "Rabies", "Anti Malarial"],
    info: "Altitude sickness prevention recommended for Cusco and Machu Picchu visitors.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FPE.webp&w=3840&q=75",
  },
  {
    name: "Philippines", code: "PH", flag: "🇵🇭", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Rabies"],
    info: "Mosquito-borne illnesses (dengue, malaria in certain areas) require precautions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FPH.webp&w=3840&q=75",
  },
  { name: "Portugal", code: "PT", flag: "🇵🇹", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: [""],
    info: "Public healthcare facilities are generally excellent. Pay attention to heatwaves in summer.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FPT.webp&w=3840&q=75" },

  { name: "Qatar", code: "QA", flag: "🇶🇦", risk: "Low",
    required: ["No mandatory vaccinations required"], 
    recommended: ["Hepatitis A"],
    info: "Advanced healthcare facilities. Extreme heat in summer, stay hydrated and avoid direct sun.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FQA.webp&w=3840&q=75" },
  {
    name: "Russian Federation", code: "RU", flag: "🇷🇺", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A"],
    info: "Consider a rabies vaccine if traveling to remote areas or engaging in outdoor activities.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FRU.webp&w=3840&q=75",
  },
  {
    name: "Rwanda", code: "RW", flag: "🇷🇼", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarial"],
    info: "Health services have improved greatly. Mountain gorilla trekking requires a permit and some health checks.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FRW.webp&w=3840&q=75",
  },
  {
    name: "Saudi Arabia", code: "SA", flag: "🇸🇦", risk: "Medium",
    required: ["Meningitis ACWY"],
    recommended: ["Hepatitis A", "Diphtheria, Tetanus, and Polio"],
    info: "Advanced healthcare facilities. Extreme heat in summer, stay hydrated and avoid direct sun.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FSA.webp&w=3840&q=75",
  },
  {
    name: "Senegal", code: "SN", flag: "🇸🇳", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarial"],
    info: "A Yellow Fever certificate is often required. Mosquito protection is essential.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FSN.webp&w=3840&q=75",
  },
  {
    name: "South Africa", code: "ZA", flag: "🇿🇦", risk: "Medium",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Hepatitis B", "Typhoid", "Anti Malarial", "Rabies"],
    info: "Malaria precautions needed for Kruger National Park and northeastern regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FZA.webp&w=3840&q=75",
  },

  { name: "Sri Lanka", code: "LK", flag: "🇱🇰", risk: "Medium",
    required: ["Yellow Fever"], 
    recommended: ["Hepatitis A", "Typhoid", "Japanese Encephalitis"],
    info: "Mosquito-borne illnesses like dengue can be common; use repellent and cover exposed skin.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FLK.webp&w=3840&q=75" },


  { name: "Sweden", code: "SE", flag: "🇸🇪", risk: "Medium",
    required: ["No mandatory vaccinations required"], 
    recommended: ["Tick-borne encephalitis"],
    info: "High standard of healthcare. Northern regions can have ticks in spring/summer.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FSE.webp&w=3840&q=75" },
 
    {
    name: "Tanzania", code: "TZ", flag: "🇹🇿", risk: "High",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarial"],
    info: "Yellow Fever certificate may be required depending on departure point. Malaria is prevalent in many regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FTZ.webp&w=3840&q=75",
  },
  {
    name: "Thailand", code: "TH", flag: "🇹🇭", risk: "Medium",
    required: ["Hepatitis A", "Typhoid"],
    recommended: ["Hepatitis B", "Anti Malarial", "Rabies", "Japanese Encephalitis"],
    info: "Risk varies by region and length of stay. Rural areas may require additional precautions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FTH.webp&w=3840&q=75",
  },
  {
    name: "Tunisia", code: "TN", flag: "🇹🇳", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Medical care is decent in urban areas. Be prepared for hot, dry weather in desert regions.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FTN.webp&w=3840&q=75",
  },
  {
    name: "Türkiye (Turkey)", code: "TR", flag: "🇹🇷", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid"],
    info: "Water quality varies by region. Carry bottled water and practice food safety.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FTR.webp&w=3840&q=75",
  },
  {
    name: "Uganda", code: "UG", flag: "🇺🇬", risk: "High",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarial"],
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FUG.webp&w=3840&q=75",
  },
  {
    name: "United States of America", code: "US", flag: "🇺🇸", risk: "Low",
    required: ["No mandatory vaccinations required"],
    recommended: [""],
    info: "Generally high standards of healthcare. Stay updated on routine vaccinations.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FUS.webp&w=3840&q=75",
  },
  {
    name: "Uruguay", code: "UY", flag: "🇺🇾", risk: "Low",
    required: ["Yellow Fever"],
    recommended: ["Hepatitis A"],
    info: "Well-developed healthcare in urban areas. Mosquito-borne illness risk is generally low.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FUY.webp&w=3840&q=75",
  },
  {
    name: "Vietnam", code: "VN", flag: "🇻🇳", risk: "Medium",
    required: ["Hepatitis A"],
    recommended: ["Hepatitis B", "Typhoid", "Rabies", "Japanese Encephalitis", "Anti Malarial"],
    info: "Malaria risk higher in rural areas. Japanese Encephalitis recommended for long-term stays.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FVN.webp&w=3840&q=75",
  },
  {
    name: "Zambia", code: "ZM", flag: "🇿🇲", risk: "High",
    required: ["Yellow Fever (if arriving from/through risk areas)"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarials", "Yellow Fever"],
    info: "Malaria risk is significant. Proof of Yellow Fever vaccination may be needed, depending on travel route.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FZM.webp&w=3840&q=75",
  },
  {
    name: "Zimbabwe", code: "ZW", flag: "🇿🇼", risk: "Medium",
    required: ["No mandatory vaccinations required"],
    recommended: ["Hepatitis A", "Typhoid", "Anti Malarial"],
    info: "Yellow Fever vaccine may be required if arriving from certain countries. Victoria Falls region is a mosquito-prone area.",
    image: "https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2Ftravel-destinations%2FZW.webp&w=3840&q=75",
  },

];

/** ------------------ Helpers ------------------ */
const riskBadgeClass = (risk: "Low" | "Medium" | "High") =>
  risk === "Low"
    ? "bg-success-subtle text-success"
    : risk === "Medium"
    ? "bg-warning-subtle text-warning"
    : "bg-danger-subtle text-danger";

/** ------------------ Vaccine Cards ------------------ */
const VaccinationGrid: React.FC<{ items: any[] }> = ({ items }) => (
  <div className="row g-4">
    {items.map((it) => {
      const isYellowFever = it.title.toLowerCase().includes("yellow fever");

      return (
        <div
          key={it.id}
          className={`col-12 col-md-6`}
        >
          <div
            className={`vacc-card shadow-sm ${
              isYellowFever ? "vacc-card--yellow" : ""
            }`}
          >
            <div className="vacc-card__text">
              <h3 className="vacc-card__title">{it.title}</h3>
              <p className="vacc-card__desc">
                {it.description ||
                  "Protection and advice tailored to your trip and medical history."}
              </p>
              <span className="price-pill">{it.price}</span>
            </div>

            <div className="vacc-card__cta">
              {isYellowFever ? (
                <button className="btn btn-cta" disabled>
                  Book now
                </button>
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


/** ------------------ FAQ Section ------------------ */
const FAQSection: React.FC = () => {
  const faqs = [
    {
      q: "How do I know which travel vaccines I need for my trip?",
      a: "Before you set off, it’s important to research the specific health risks of your destination. You can check reputable sources like NHS Fit for Travel or speak with our travel clinic team at Coleshill Pharmacy for tailored advice. We’ll consider factors such as the countries you’re visiting, the duration of your stay, and any planned activities. By assessing your medical history and vaccination records, we can recommend the appropriate jabs or boosters."
    },
    {
      q: "How can I book a travel clinic appointment?",
      a: "Booking an appointment at our Coleshill Pharmacy travel clinic is quick and straightforward. You can give us a ring, pop into the pharmacy, or use our online booking form if available. Our friendly team will find a convenient slot that suits your schedule. We’ll discuss your travel plans and vaccination requirements over the phone or in person, so you know exactly what to expect. Don’t leave it too late – allow enough time to complete your vaccinations before your departure."
    },
    {
      q: "How far in advance should I get my travel vaccinations?",
      a: "Ideally, you should visit our travel clinic at least six to eight weeks before you head off. This allows time for any vaccines to become fully effective and for multiple doses if needed. If you’re travelling sooner, don’t worry – contact us as soon as possible, and we’ll do our best to help. Some vaccines take longer to provide protection, while others may need several injections over a few weeks."
    },
    {
      q: "Is Yellow Fever vaccination available at Coleshill Pharmacy?",
      a: "No. We are not currently offering Yellow Fever vaccinations or certificates at Coleshill Pharmacy. If you require this service, you will need to visit an alternative Yellow Fever vaccination centre."
    },
    
    {
      q: "What about malaria prevention for high-risk areas?",
      a: "Malaria is a serious concern in many tropical and subtropical regions. If you’re travelling to a high-risk area, we’ll discuss the different antimalarial medications available and recommend the most suitable option based on your medical history and travel plans. We’ll also talk about bite prevention, such as using mosquito nets, repellents, and covering up in the evenings. Remember to start taking antimalarials before you leave, continue throughout your stay, and finish the course upon your return."
    },
    {
      q: "Can children get their travel vaccinations at Coleshill Pharmacy?",
      a: "Absolutely. We welcome families who need travel vaccinations. Our friendly pharmacist is experienced in administering immunisations to children, taking extra care to ensure they feel at ease. We’ll discuss each child’s vaccination history and any unique considerations, like allergies or ongoing medical conditions. If certain vaccines aren’t appropriate for a child’s age, we’ll advise on alternatives or the best timing. We’ll also offer practical tips on staying healthy during your family trip."
    },
    {
      q: "What do I need to bring to the travel clinic appointment?",
      a: "When you visit our travel clinic, it helps to bring as much information as possible. That includes details of your travel itinerary, such as the countries you’ll visit, the length of your stay, and any activities you plan. Bring your vaccination records or a list of previous immunisations if you have them. It’s also useful to have a note of any medical conditions, current medications, or allergies. Our pharmacist will use this information to tailor your vaccination plan and advice."
    },
    {
      q: "Do travel vaccines have side effects?",
      a: "Like all vaccines, travel jabs can cause mild side effects, but serious reactions are rare. Most people experience little more than a sore arm, some redness, or slight swelling at the injection site. Occasionally, you may feel tired, develop a low-grade fever, or have minor aches and pains for a day or two. Our pharmacist will explain potential side effects during your consultation and advise on ways to manage them."
    },
    {
      q: "Can you provide certificates if required?",
      a: "We currently do not issue International Certificates of Vaccination, such as for Yellow Fever. For destinations that require these certificates, you will need to attend a registered Yellow Fever vaccination centre."
    },
    {
      q: "How can I stay healthy while travelling abroad?",
      a: "Beyond vaccinations, staying healthy abroad involves simple yet effective measures. Pack a travel first-aid kit with essentials like painkillers, plasters, antiseptic, and any personal medications. Stay hydrated, especially in hot climates, and drink bottled or purified water if the local supply isn’t safe. Use insect repellent to protect against bites, and be mindful of sun protection – wear sunscreen, sunglasses, and hats. When dining, stick to reputable eateries, and make sure food is properly cooked."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-5 bg-white faq-section">
  <div className="faq-inner">
        <h2 className="freq">
          Frequently asked <span className="questions">questions</span>
        </h2>
        <div className="accordion">
          {faqs.map((item, i) => (
            <div key={i} className="faq-item border-bottom py-3">
              <button
                className="faq-question d-flex justify-content-between align-items-center w-100"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{item.q}</span>
                <span>{openIndex === i ? "×" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className="faq-answer mt-2">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/** ------------------ Page ------------------ */
const TravelPage: React.FC = () => {
  const [countryQuery, setCountryQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries by query
  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return [];

    const matches = COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(q)
    );

    // Deduplicate by country name
    return Array.from(
      new Map(matches.map((c) => [c.name.toLowerCase(), c])).values()
    );
  }, [countryQuery]);

  const chooseCountry = (c: Country) => {
    setSelectedCountry(c);
    setCountryQuery(c.name);
    setShowSuggestions(false);
  };


  return (
    <div>
    <div className="bg-light">
      <Header />
  
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">Travel Advisor</h1>
          <p className="hero__subtitle">
            Discover recommended vaccinations for safe travel.
          </p>
  
          {/* Search */}
          <div ref={wrapperRef} className="position-relative">
            <div className="hero-search d-flex align-items-center">
              <i className="bi bi-search hero-search__icon" />
              <input
                className="hero-search__input form-control border-0 bg-transparent text-white"
                placeholder="Enter your destination..."
                value={countryQuery}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setShowSuggestions(true); // ✅ show while typing
                }}
                onFocus={() => {
                  if (countryQuery.trim().length > 0) setShowSuggestions(true);
                }}
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
            </div>
  
            {/* Suggestions dropdown */}
            {showSuggestions && filteredCountries.length > 0 && (
              <div className="suggestions list-group shadow mt-2 w-100">
                {filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                    onClick={() => chooseCountry(c)}
                  >
                    <span className="me-2" style={{ fontSize: "20px" }}>
                      {c.flag}
                    </span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
  
     {/* Popular Destinations Ticker */}
<section className="popular-destinations py-4">
  <div className="container">
    <h2 className="text-center mb-3">Popular Destinations</h2>

    <div className="ticker-wrap">
      <div className="country-ticker">
        <div className="country-ticker__track">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              className="country-chip"
              onClick={() => chooseCountry(c)}
            >
              {c.flag} {c.name}
            </button>
          ))}
          {/* duplicate for infinite loop */}
          {COUNTRIES.map((c) => (
            <button
              key={c.code + "-dup"}
              className="country-chip"
              onClick={() => chooseCountry(c)}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* COUNTRY CARD */}
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

              {/* Required */}
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
                  travel health advice, please consult our travel clinic.
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

      {/* VACCINATION CARDS */}
      <section className="py-4">
        <div className="container">
          <VaccinationGrid items={ITEMS} />
        </div>
      </section>

            {/* TRAVEL CONSULTATION BANNER ABOVE FAQ */}
            <section className="py-5">
            <div className="container">
  <div className="row align-items-center consult-banner text-white rounded-3 overflow-hidden">
    <div className="col-md-6 p-5">
      <h2 className="fw-bold mb-3">
        Don&apos;t know what travel vaccines you need? Book a travel consultation!
      </h2>
      <p className="mb-3">
        Simply book in with us, and let us take care of the rest.
      </p>
      <p className="mb-4">
        Jet off on your travels with our Travel Clinic, for all of your travel needs.
        We offer a range of vaccinations, as well as comprehensive travel advice to get you where you need to go.
      </p>
      <Link to="/book/3" className="btn btn-consult fw-bold">
        Book your travel consultation
      </Link>
    </div>
    <div className="col-md-6 p-0">
      <img
        src="https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/promo.webp"
        alt="Suitcases with airplane"
        className="img-fluid h-100 w-100 object-fit-cover"
      />
    </div>
  </div>
</div>

      </section>

      {/* FAQ SECTION */}
      <FAQSection />
       {/* Find Us */}
       <section id="find-us" className="container py-5 find-us">
          <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6">
              <p>
                Contact us for travel vaccination, ear wax removal and a wide
                range of NHS or private services we offer.
              </p>
              <p>
                <strong>Phone:</strong> 01675 466014
              </p>
              <p>
                <strong>Email:</strong> coleshillpharmacy@gmail.com
              </p>
              <p>
                <strong>Address:</strong> 114–116 High St, Coleshill, Birmingham
                B46 3BJ
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                Monday–Friday 8:30 am–6 pm
                <br />
                Saturday 9 am–5:30 pm
                <br />
                Sunday Closed
              </p>
            </div>
            <div className="col-md-6">
              <iframe
                title="Coleshill Pharmacy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '0.5rem', marginBottom: '30px' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
    </div>
  );
};

export default TravelPage;

