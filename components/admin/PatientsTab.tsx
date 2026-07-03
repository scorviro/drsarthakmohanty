import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, X, Download, FileSpreadsheet, Settings,
  CheckSquare, Square, ChevronDown, UserCheck, Users, Banknote,
  ShieldCheck, HeartPulse, Zap, Activity, ClipboardList, Search, FileText, Upload,
  SlidersHorizontal
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── HCG CONSTANTS ─────────────────────────────────────────────────────────
const DIAGNOSIS_GROUPS: Record<string, string[]> = {
  'Head & Neck': [
    'Ca Buccal Mucosa', 'Ca Tongue', 'Ca Floor of Mouth', 'Ca Lip',
    'Ca Larynx', 'Ca Hypopharynx', 'Ca Oropharynx', 'Ca Nasopharynx',
    'Ca Thyroid', 'Ca Parotid', 'Sinonasal Tumor', 'Ca Maxilla',
  ],
  'Lung': [
    'Ca Lung (NSCLC)', 'Ca Lung (SCLC)', 'Mesothelioma', 'Lung Carcinoid',
  ],
  'GI': [
    'Ca Esophagus', 'Ca Stomach', 'Ca Pancreas', 'Ca Rectum',
    'Ca Anal Canal', 'Ca Liver (HCC)', 'Ca Gallbladder', 'GIST',
    'Ca Duodenum', 'Ca Colon',
  ],
  'GU': [
    'Ca Prostate', 'Ca Bladder', 'Ca Kidney (RCC)', 'Ca Testis',
    'Ca Penis', 'Ca Urethra', 'Wilms Tumor',
  ],
  'Gynaec': [
    'Ca Cervix', 'Ca Endometrium', 'Ca Ovary', 'Ca Vulva',
    'Ca Vagina', 'Gestational Trophoblastic Neoplasia',
  ],
  'CNS': [
    'Glioblastoma (GBM)', 'Astrocytoma (Grade II)', 'Astrocytoma (Grade III)',
    'Oligodendroglioma', 'Ependymoma', 'Meningioma',
    'Brain Metastasis', 'Spinal Cord Tumor', 'Craniopharyngioma', 'Medulloblastoma',
  ],
  'Lymphoma': [
    "Hodgkin's Lymphoma", "Non-Hodgkin's Lymphoma (DLBCL)",
    "Non-Hodgkin's Lymphoma (Follicular)", 'MALT Lymphoma',
    'Mantle Cell Lymphoma', 'Primary CNS Lymphoma',
  ],
  'Sarcomas': [
    'Osteosarcoma', "Ewing's Sarcoma", 'Soft Tissue Sarcoma',
    'Rhabdomyosarcoma', 'Chondrosarcoma', 'Leiomyosarcoma', 'Liposarcoma',
  ],
  'Palliative': [
    'Bone Metastasis', 'Brain Mets (Palliative)', 'Spinal Cord Compression',
    'Pain Palliation', 'Hemostatic RT', 'Liver Mets', 'Adrenal Mets',
  ],
  'Onco Emergencies': [
    'SVC Syndrome', 'Spinal Cord Compression (Emergency)',
    'Fungating / Bleeding Wound', 'Hemorrhagic Mass',
    'Obstructive Uropathy', 'Acute Stridor',
  ],
};

const DIAGNOSIS_CATEGORIES = Object.keys(DIAGNOSIS_GROUPS);

const PATIENT_FLAGS = [
  { id: 'OPD', label: 'OPD', color: 'blue' },
  { id: 'Referred', label: 'Referred', color: 'amber' },
  { id: 'Machine Couch', label: 'Machine Couch', color: 'purple' },
  { id: 'Simulation', label: 'Simulation', color: 'teal' },
  { id: 'Follow-up (Cash)', label: 'Follow-up (Cash)', color: 'orange' },
  { id: 'Needs Radiotherapy', label: 'Needs RT', color: 'red' },
];

const PAYMENT_TYPES = ['Cash-OPD', 'Cash-IPD', 'Cash-Followup', 'Cash-RT', 'PM-JAYA', 'Insurance', 'Free'];

const SHORT_PAYMENT_LABELS: Record<string, string> = {
  'Cash-OPD': 'OPD',
  'Cash-IPD': 'IPD',
  'Cash-Followup': 'Followup',
  'Cash-RT': 'RT',
  'PM-JAYA': 'PM',
  'Insurance': 'INS',
  'Free': 'Free'
};

const GENDERS = ['Male', 'Female', 'Other'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const FLAG_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

const PAYMENT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Cash-OPD': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Cash-IPD': { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  'Cash-Followup': { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  'Cash-RT': { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  'PM-JAYA': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Insurance: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Free: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

// ─── MASTER FIELDS FOR EHR CUSTOMIZATION ─────────────────────────────────────
interface FieldConfig {
  key: string;
  labelEn: string;
  labelGu: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
}

const MASTER_FIELDS: FieldConfig[] = [
  { key: "email", labelEn: "Email Address", labelGu: "ઈમેલ આઈડી", type: "text" },
  { key: "address", labelEn: "Residential Address", labelGu: "સરનામું", type: "textarea" },
  { key: "stage", labelEn: "Cancer Stage", labelGu: "કેન્સર સ્ટેજ", type: "select", options: ["Stage I", "Stage II", "Stage III", "Stage IV", "N/A"] },
  { key: "symptoms", labelEn: "Symptoms", labelGu: "લક્ષણો", type: "textarea" },
  { key: "treatment", labelEn: "Treatment Given", labelGu: "સારવાર", type: "textarea" },
  { key: "prescription", labelEn: "Prescribed Medicine", labelGu: "લખેલી દવાઓ", type: "textarea" },
  { key: "dosage", labelEn: "Dosage Instructions", labelGu: "લેવાની સૂચના", type: "textarea" },
  { key: "doctorNotes", labelEn: "Doctor Clinical Notes", labelGu: "ક્લિનિકલ નોંધ", type: "textarea" },
  { key: "bp", labelEn: "Blood Pressure (BP)", labelGu: "બ્લડ પ્રેશર", type: "text" },
  { key: "pulse", labelEn: "Pulse Rate (bpm)", labelGu: "પલ્સ રેટ", type: "text" },
  { key: "temperature", labelEn: "Body Temperature (°F)", labelGu: "શરીરનું તાપમાન", type: "text" },
  { key: "weight", labelEn: "Weight (kg)", labelGu: "વજન", type: "text" },
  { key: "labReportUrl", labelEn: "Lab Reports Note", labelGu: "લેબોરેટરી રીપોર્ટ વિગત", type: "textarea" },
  { key: "nextFollowUp", labelEn: "Next Follow-up Date", labelGu: "આગામી મુલાકાતની તારીખ", type: "date" },
  { key: "billingTotal", labelEn: "Total Fees (₹)", labelGu: "કુલ ફી", type: "number" },
  { key: "billingPending", labelEn: "Pending Amount (₹)", labelGu: "બાકી રકમ", type: "number" },
  { key: "paymentMethod", labelEn: "Payment Method", labelGu: "ચુકવણીની પદ્ધતિ", type: "select", options: ["Cash", "UPI/Online", "Card", "Pending"] },
  { key: "allergies", labelEn: "Known Allergies", labelGu: "એલર્જી", type: "textarea" },
  { key: "pastHistory", labelEn: "Past Medical History", labelGu: "ભૂતકાળનો ઇતિહાસ", type: "textarea" },
  { key: "familyHistory", labelEn: "Family History", labelGu: "કૌટુંબિક ઇતિહાસ", type: "textarea" },
  { key: "insuranceDetails", labelEn: "Insurance Details", labelGu: "વીમાની વિગત", type: "text" },
  { key: "status", labelEn: "Patient Status", labelGu: "દર્દીની સ્થિતિ", type: "select", options: ["Active Treatment", "Recovered/Remission", "Follow-up Stage", "Discharged"] }
];

// Helper to format date
function formatDate(d: string) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length < 3) return d;
  const [y, m, day] = parts;
  return `${day}/${m}/${y}`;
}

// Inline Badges
function PaymentBadge({ type }: { type: string }) {
  const styles = PAYMENT_COLORS[type] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {type}
    </span>
  );
}

function FlagBadge({ flag }: { flag: string }) {
  const meta = PATIENT_FLAGS.find(f => f.id === flag) || { label: flag, color: 'blue' };
  const styles = FLAG_COLORS[meta.color] || FLAG_COLORS.blue;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ring-1 ring-inset ${styles.bg} ${styles.text} ${styles.ring}`}>
      {meta.label}
    </span>
  );
}

// ─── DIAGNOSIS SELECTOR COMPONENT ───────────────────────────────────────────
function DiagnosisSelector({
  category,
  diagnosis,
  onCategoryChange,
  onDiagnosisChange,
  error
}: {
  category: string;
  diagnosis: string;
  onCategoryChange: (cat: string) => void;
  onDiagnosisChange: (diag: string) => void;
  error?: string;
}) {
  const [catSearch, setCatSearch] = useState(category);
  const [isCatOpen, setIsCatOpen] = useState(false);

  const [diagSearchState, setDiagSearchState] = useState(diagnosis);
  const [isDiagOpen, setIsDiagOpen] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setCatSearch(category);
  }, [category]);

  useEffect(() => {
    setDiagSearchState(diagnosis);
  }, [diagnosis]);

  const filteredCategories = useMemo(() => {
    const list = Object.keys(DIAGNOSIS_GROUPS);
    if (!catSearch?.trim()) return list;
    return list.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));
  }, [catSearch]);

  const filteredDiagnoses = useMemo(() => {
    const list = category ? (DIAGNOSIS_GROUPS[category] || []) : Object.values(DIAGNOSIS_GROUPS).flat();
    const uniqueList = Array.from(new Set(list));
    if (!diagSearchState?.trim()) return uniqueList;
    return uniqueList.filter(d => d.toLowerCase().includes(diagSearchState.toLowerCase()));
  }, [category, diagSearchState]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Diagnosis Category */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Diagnosis Category <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Select or type category…"
            value={catSearch}
            onChange={e => {
              const val = e.target.value;
              setCatSearch(val);
              onCategoryChange(val);
            }}
            onFocus={() => setIsCatOpen(true)}
            onBlur={() => setTimeout(() => setIsCatOpen(false), 200)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800
              focus:outline-none focus:border-brand-500 focus:bg-white transition"
          />
          {isCatOpen && filteredCategories.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
              <div className="py-1">
                {filteredCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCatSearch(cat);
                      onCategoryChange(cat);
                      setIsCatOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specific Diagnosis */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Specific Diagnosis <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Select or type diagnosis…"
            value={diagSearchState}
            onChange={e => {
              const val = e.target.value;
              setDiagSearchState(val);
              onDiagnosisChange(val);
            }}
            onFocus={() => setIsDiagOpen(true)}
            onBlur={() => setTimeout(() => setIsDiagOpen(false), 200)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800
              focus:outline-none focus:border-brand-500 focus:bg-white transition"
          />
          {isDiagOpen && filteredDiagnoses.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
              <div className="py-1">
                {filteredDiagnoses.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDiagSearchState(d);
                      onDiagnosisChange(d);
                      setIsDiagOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {error}
        </p>
      )}
    </div>
  );
}

// ─── PATIENTS TAB PROPS ──────────────────────────────────────────────────────
interface PatientsTabProps {
  showToast: (text: string, type: "success" | "error") => void;
}

export default function PatientsTab({ showToast }: PatientsTabProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [enabledFields, setEnabledFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Month Period navigation
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterFlag, setFilterFlag] = useState("");
  const [selectedBreakdown, setSelectedBreakdown] = useState<string>("Cash-OPD");
  const [isBreakdownMenuOpen, setIsBreakdownMenuOpen] = useState(false);
  const [isCashBreakdownOpen, setIsCashBreakdownOpen] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);

  // Form input and Validation states
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tempEnabledFields, setTempEnabledFields] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const csvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch settings
      const settingsRes = await fetch("/api/patients/settings");
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const rawFields = settingsData.enabledFields || [];
        const cleanFields = rawFields.filter((f: string) => MASTER_FIELDS.some(m => m.key === f));
        setEnabledFields(cleanFields);
        setTempEnabledFields(cleanFields);
      }

      // Fetch patients
      const patientsRes = await fetch("/api/patients");
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData.patients || []);
      }
    } catch (e) {
      showToast("Error loading clinical records.", "error");
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (dir: number) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  // Helper to resolve month & year of a patient record
  const getPatientPeriod = (p: any) => {
    let m = p.month;
    let y = p.year;
    if (!m || !y) {
      if (p.visitDate) {
        const parts = p.visitDate.split("-");
        y = Number(parts[0]);
        m = Number(parts[1]);
      }
    }
    return { month: m, year: y };
  };

  // ─── FILTERED PATIENTS FOR PERIOD & CRITERIA ────────────────────────────────
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // 1. Period filter
      const pPeriod = getPatientPeriod(p);
      if (pPeriod.month !== currentMonth || pPeriod.year !== currentYear) {
        return false;
      }

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.diagnosis?.toLowerCase().includes(q) ||
        p.diagnosisCategory?.toLowerCase().includes(q) ||
        p.referringDoctor?.toLowerCase().includes(q) ||
        p.contact?.includes(q) ||
        p.patientId?.toLowerCase().includes(q);

      // 3. Dropdown filters
      const matchCategory = !filterCategory || p.diagnosisCategory === filterCategory;
      const matchPayment = !filterPayment || p.paymentType === filterPayment;
      const matchFlag = !filterFlag || (p.flags || []).includes(filterFlag);

      return matchSearch && matchCategory && matchPayment && matchFlag;
    });
  }, [patients, currentMonth, currentYear, searchQuery, filterCategory, filterPayment, filterFlag]);

  // ─── REVENUE COLLECTIONS BREAKDOWN ──────────────────────────────────────────
  const collections = useMemo(() => {
    const monthPatients = patients.filter(p => {
      const pPeriod = getPatientPeriod(p);
      return pPeriod.month === currentMonth && pPeriod.year === currentYear;
    });

    const cashOPD = monthPatients.filter(p => p.paymentType === 'Cash-OPD' || p.paymentType === 'Cash').reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);
    const cashIPD = monthPatients.filter(p => p.paymentType === 'Cash-IPD').reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);
    const cashFollowup = monthPatients.filter(p => p.paymentType === 'Cash-Followup').reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);
    const cashRT = monthPatients.filter(p => p.paymentType === 'Cash-RT').reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);
    const pmjaya = monthPatients.filter(p => p.paymentType === 'PM-JAYA').reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);
    const insurance = monthPatients.filter(p => p.paymentType === 'Insurance').reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);
    const free = 0;

    const total = cashOPD + cashIPD + cashFollowup + cashRT + pmjaya + insurance;

    return {
      'Cash-OPD': cashOPD,
      'Cash-IPD': cashIPD,
      'Cash-Followup': cashFollowup,
      'Cash-RT': cashRT,
      'PM-JAYA': pmjaya,
      'Insurance': insurance,
      'Free': free,
      total
    };
  }, [patients, currentMonth, currentYear]);

  // ─── STATS CALCULATIONS (FROM MONTH PATIENTS) ──────────────────────────────
  const stats = useMemo(() => {
    const monthPatients = patients.filter(p => {
      const pPeriod = getPatientPeriod(p);
      return pPeriod.month === currentMonth && pPeriod.year === currentYear;
    });

    return {
      total: monthPatients.length,
      cash: monthPatients.filter(p => ['Cash-OPD', 'Cash-IPD', 'Cash-Followup', 'Cash-RT', 'Cash'].includes(p.paymentType)).length,
      cashOPD: monthPatients.filter(p => p.paymentType === 'Cash-OPD' || p.paymentType === 'Cash').length,
      cashIPD: monthPatients.filter(p => p.paymentType === 'Cash-IPD').length,
      cashFollowup: monthPatients.filter(p => p.paymentType === 'Cash-Followup').length,
      cashRT: monthPatients.filter(p => p.paymentType === 'Cash-RT').length,
      pmjaya: monthPatients.filter(p => p.paymentType === 'PM-JAYA').length,
      insurance: monthPatients.filter(p => p.paymentType === 'Insurance').length,
      referred: monthPatients.filter(p => (p.flags || []).includes('Referred')).length,
      simulation: monthPatients.filter(p => (p.flags || []).includes('Simulation')).length,
      needsRT: monthPatients.filter(p => (p.flags || []).includes('Needs Radiotherapy')).length,
      followup: monthPatients.filter(p => (p.flags || []).includes('Follow-up (Cash)')).length,
    };
  }, [patients, currentMonth, currentYear]);

  // Dynamically calculate pending fees when total/paid changes
  useEffect(() => {
    const total = parseFloat(formValues.billingTotal || "0");
    const paid = parseFloat(formValues.billingPaid || "0");
    if (!isNaN(total) && !isNaN(paid)) {
      setFormValues(prev => ({
        ...prev,
        billingPending: Math.max(0, total - paid)
      }));
    }
  }, [formValues.billingTotal, formValues.billingPaid]);

  // ─── REAL-TIME FIELD CHANGE HANDLER ───────────────────────────────────────
  const handleFieldChange = (key: string, value: any) => {
    setFormValues(prev => {
      const updated = { ...prev, [key]: value };
      if (key === "paymentType" && value === "Free") {
        updated.billingPaid = "0";
      }
      return updated;
    });

    // Clear validation error when doctor edits/corrects the field
    if (formErrors[key]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // ─── CLINICAL INPUT VALIDATIONS ───────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 0. Patient ID: Required
    if (!formValues.patientId?.trim()) {
      errors.patientId = "Patient ID is required.";
    }

    // 1. Patient Name: Required, letters and spaces only
    if (!formValues.name?.trim()) {
      errors.name = "Patient name is required.";
    } else if (!/^[A-Za-z\s.]+$/.test(formValues.name.trim())) {
      errors.name = "Name must contain letters, spaces and periods only.";
    }

    // 2. Contact Number: Exactly 10 digits if provided
    if (formValues.contact && formValues.contact.trim()) {
      const contactVal = formValues.contact.trim();
      if (!/^[0-9]{10}$/.test(contactVal)) {
        errors.contact = "Contact must be a valid 10-digit phone number.";
      }
    }

    // 3. Email Address: Valid format if provided
    if (enabledFields.includes("email") && formValues.email && formValues.email.trim()) {
      const emailVal = formValues.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        errors.email = "Please enter a valid email address (e.g. name@domain.com).";
      }
    }

    // 4. Age: Valid integer 1-120
    if (formValues.age !== undefined && formValues.age !== null && formValues.age !== "") {
      const ageVal = Number(formValues.age);
      if (isNaN(ageVal) || ageVal < 1 || ageVal > 120 || !Number.isInteger(ageVal)) {
        errors.age = "Age must be a whole number between 1 and 120.";
      }
    }

    // 5. Diagnosis categories required
    if (!formValues.diagnosisCategory) {
      errors.diagnosisCategory = "Please select a diagnosis category.";
    }
    if (!formValues.diagnosis) {
      errors.diagnosis = "Please select a specific diagnosis.";
    }

    // 6. Date required
    if (!formValues.visitDate) {
      errors.visitDate = "Visit date is required.";
    }

    // 7. Billing Amount logic
    const billingTotalEnabled = enabledFields.includes("billingTotal");
    const billingPaidEnabled = true;

    let totalVal = 0;
    let paidVal = 0;

    if (billingTotalEnabled && formValues.billingTotal !== undefined && formValues.billingTotal !== "") {
      totalVal = parseFloat(formValues.billingTotal);
      if (isNaN(totalVal) || totalVal < 0) {
        errors.billingTotal = "Total fees must be a positive number.";
      }
    }

    if (billingPaidEnabled && formValues.billingPaid !== undefined && formValues.billingPaid !== "") {
      paidVal = parseFloat(formValues.billingPaid);
      if (isNaN(paidVal) || paidVal < 0) {
        errors.billingPaid = "Paid amount must be a positive number.";
      }
    }

    if (billingTotalEnabled && billingPaidEnabled && totalVal >= 0 && paidVal > totalVal) {
      errors.billingPaid = "Paid amount cannot exceed total fees.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── CSV EXPORT ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = [
      'Patient ID', 'Patient Name', 'Age', 'Gender', 'Diagnosis Category',
      'Diagnosis', 'Payment Type', 'Paid Amount', 'Referring Doctor', 'Contact No.', 'Visit Date', 'Flags', 'Notes'
    ];

    // Append dynamically customized fields to headers
    enabledFields.forEach(fKey => {
      const fConfig = MASTER_FIELDS.find(m => m.key === fKey);
      if (fConfig) {
        headers.push(fConfig.labelEn);
      }
    });

    const csvRows = [headers.join(",")];

    filteredPatients.forEach(p => {
      const row = [
        p.patientId || '',
        `"${(p.name || '').replace(/"/g, '""')}"`,
        p.age || '',
        p.gender || '',
        p.diagnosisCategory || '',
        `"${(p.diagnosis || '').replace(/"/g, '""')}"`,
        p.paymentType || 'Cash-OPD',
        p.billingPaid || '0',
        `"${(p.referringDoctor || '').replace(/"/g, '""')}"`,
        p.contact || '',
        p.visitDate || '',
        `"${(p.flags || []).join('; ')}"`,
        `"${(p.notes || '').replace(/"/g, '""')}"`
      ];

      // Append custom fields values
      enabledFields.forEach(fKey => {
        const val = p[fKey] !== undefined ? String(p[fKey]) : '';
        row.push(`"${val.replace(/"/g, '""')}"`);
      });

      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HCG_Oncology_Patients_${MONTHS[currentMonth - 1]}_${currentYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("CSV directory exported successfully!", "success");
  };

  // ─── CSV IMPORT ────────────────────────────────────────────────────────────
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        showToast("Invalid CSV file.", "error");
        return;
      }

      const parseCSVLine = (textLine: string) => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let idx = 0; idx < textLine.length; idx++) {
          const char = textLine[idx];
          if (char === '"') {
            if (inQuotes && textLine[idx + 1] === '"') {
              current += '"';
              idx++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result.map(val => val.trim());
      };

      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
      let okCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const row = parseCSVLine(line);

        const getValue = (keys: string[]) => {
          for (const key of keys) {
            const idx = headers.findIndex(h => h === key.toLowerCase());
            if (idx !== -1 && row[idx]) return row[idx];
          }
          return '';
        };

        const name = getValue(['patient name', 'name']);
        if (!name) continue;

        const age = parseInt(getValue(['age'])) || 0;
        const gender = getValue(['gender']) || 'Male';
        const diagnosisCategory = getValue(['diagnosis category', 'diagnosiscategory', 'category']);
        const diagnosis = getValue(['diagnosis']);
        const rawPayment = (getValue(['payment type', 'paymenttype', 'payment']) || '').trim();
        let paymentType = 'Cash-OPD';
        if (rawPayment) {
          if (rawPayment === 'Cash') {
            paymentType = 'Cash-OPD';
          } else {
            const matched = PAYMENT_TYPES.find(t => t.toLowerCase() === rawPayment.toLowerCase());
            if (matched) {
              paymentType = matched;
            } else if (rawPayment.toLowerCase().startsWith('cash')) {
              paymentType = 'Cash-OPD';
            } else {
              paymentType = rawPayment;
            }
          }
        }
        const referringDoctor = getValue(['referring doctor', 'referringdoctor']);
        const billingPaid = getValue(['paid amount', 'paidamount', 'paid', 'billingpaid']) || '0';
        const contact = getValue(['contact', 'phone', 'contact no']);
        const visitDate = getValue(['visit date', 'visitdate', 'date']) || new Date().toISOString().slice(0, 10);
        const flagsStr = getValue(['flags']);
        const flags = flagsStr ? flagsStr.split(';').map(f => f.trim()).filter(Boolean) : [];
        const notes = getValue(['notes']);

        // Extra dynamic fields if provided in headers
        const extraData: Record<string, any> = {};
        enabledFields.forEach(fKey => {
          const fConfig = MASTER_FIELDS.find(m => m.key === fKey);
          if (fConfig) {
            const csvVal = getValue([fConfig.labelEn.toLowerCase()]);
            if (csvVal) extraData[fKey] = fConfig.type === 'number' ? Number(csvVal) : csvVal;
          }
        });

        try {
          const payload = {
            name, age, gender, diagnosisCategory, diagnosis, paymentType,
            billingPaid, referringDoctor, contact, visitDate, flags, notes, ...extraData,
            month: currentMonth,
            year: currentYear
          };

          await fetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          okCount++;
        } catch (err) {
          console.error("CSV import row failed:", err);
        }
      }

      showToast(`Imported ${okCount} patients successfully!`, "success");
      fetchInitialData();
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // ─── PDF LIST DIRECTORY GENERATION ─────────────────────────────────────────
  const handleExportListPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // Landscape

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Dr. Sarthak Kumar Mohanty - Clinical Registry Directory (${MONTHS[currentMonth - 1]} ${currentYear})`, 14, 15);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 20);

    const tableHeaders = ["#", "Patient", "Age/Sex", "Diagnosis", "Payment", "Paid Amount (Rs.)", "Referring Dr", "Date", "Flags"];
    enabledFields.forEach(fKey => {
      const fConfig = MASTER_FIELDS.find(m => m.key === fKey);
      if (fConfig) tableHeaders.push(fConfig.labelEn);
    });

    const tableData = filteredPatients.map((p, idx) => {
      const row = [
        idx + 1,
        p.name || "-",
        `${p.age || "-"}/${p.gender?.charAt(0) || "-"}`,
        `${p.diagnosisCategory || "-"}\n(${p.diagnosis || "-"})`,
        p.paymentType || "-",
        p.billingPaid !== undefined && p.billingPaid !== null && p.billingPaid !== "" ? Number(p.billingPaid).toLocaleString('en-IN') : "0",
        p.referringDoctor || "-",
        formatDate(p.visitDate),
        (p.flags || []).join(", ")
      ];
      enabledFields.forEach(fKey => {
        const val = p[fKey];
        row.push(val !== undefined && val !== null ? String(val) : "-");
      });
      return row;
    });

    // Calculate total paid amount
    const totalPaid = filteredPatients.reduce((sum, p) => sum + (parseFloat(p.billingPaid) || 0), 0);

    const tableFooters = tableHeaders.map(header => {
      if (header === "Paid Amount (Rs.)") {
        return totalPaid.toLocaleString('en-IN');
      }
      return "";
    });

    autoTable(doc, {
      startY: 26,
      head: [tableHeaders],
      body: tableData,
      foot: [tableFooters],
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] }, // brand-600
      footStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: "bold" },
      styles: { fontSize: 8, font: "Helvetica" },
      margin: { top: 25 },
      didDrawPage: function (data: any) {
        doc.setFontSize(8);
        doc.text(`Page ${doc.getNumberOfPages()}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`clinical_directory_${MONTHS[currentMonth - 1]}_${currentYear}.pdf`);
    showToast("PDF directory exported successfully!", "success");
  };

  // ─── PATIENT CASE PAPER LETTERHEAD PDF ─────────────────────────────────────
  const handleExportPatientCasePDF = (patient: any) => {
    const doc = new jsPDF("p", "mm", "a4");

    // Modern Header (Clinical Letterhead)
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // brand-500
    doc.text("DR. SARTHAK KUMAR MOHANTY", 15, 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(241, 245, 249); // slate-100
    doc.text("Radiation Oncologist | Clinical & Precision Cancer Care Expert", 15, 24);
    doc.text("Contact: +91 99982 90040 | Web: drsarthakmohanty.com", 15, 30);

    // Patient Case Details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("CLINICAL PATIENT RECORD", 15, 52);

    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(15, 56, 195, 56);

    // Grid Layout for patient details
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500

    doc.text("PATIENT ID:", 15, 65);
    doc.text("FULL NAME:", 15, 72);
    doc.text("AGE / GENDER:", 15, 79);
    doc.text("CONTACT NO:", 15, 86);
    doc.text("VISIT DATE:", 15, 93);
    doc.text("PAID AMOUNT:", 15, 100);

    doc.setFont("Helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(patient.patientId || "-", 50, 65);
    doc.text(patient.name || "-", 50, 72);
    doc.text(`${patient.age || "-"} Years / ${patient.gender || "-"}`, 50, 79);
    doc.text(patient.contact || "-", 50, 86);
    doc.text(formatDate(patient.visitDate) || "-", 50, 93);
    doc.text(patient.billingPaid !== undefined && patient.billingPaid !== null && patient.billingPaid !== "" ? `Rs. ${Number(patient.billingPaid).toLocaleString('en-IN')}` : "Rs. 0", 50, 100);

    doc.setFont("Helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("DIAGNOSIS CAT:", 110, 65);
    doc.text("SPECIFIC DIAG:", 110, 72);
    doc.text("PAYMENT TYPE:", 110, 79);
    doc.text("REFERRING DR:", 110, 86);
    doc.text("PATIENT FLAGS:", 110, 93);

    doc.setFont("Helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(patient.diagnosisCategory || "-", 145, 65);
    doc.text(patient.diagnosis || "-", 145, 72);
    doc.text(patient.paymentType || "-", 145, 79);
    doc.text(patient.referringDoctor || "-", 145, 86);
    doc.text((patient.flags || []).join(", ") || "None", 145, 93);

    // EHR Custom fields list (Dynamic)
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("CLINICAL AND EHR RECORD DETAILS", 15, 114);
    doc.line(15, 117, 195, 117);

    let startY = 126;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);

    // Notes block
    if (patient.notes) {
      doc.setTextColor(100, 116, 139);
      doc.text("CLINICAL NOTES:", 15, startY);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const splitNotes = doc.splitTextToSize(patient.notes, 140);
      doc.text(splitNotes, 50, startY);
      startY += Math.max(10, splitNotes.length * 5);
    }

    enabledFields.forEach(fKey => {
      const fConfig = MASTER_FIELDS.find(m => m.key === fKey);
      if (fConfig && patient[fKey] !== undefined && patient[fKey] !== "") {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text(`${fConfig.labelEn.toUpperCase()}:`, 15, startY);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        const valStr = String(patient[fKey]);
        const splitText = doc.splitTextToSize(valStr, 140);
        doc.text(splitText, 50, startY);

        startY += Math.max(8, splitText.length * 5);
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
      }
    });

    // Signature footer
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 268, 195, 268);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Dr. Sarthak Kumar Mohanty Signature", 145, 275);
    doc.text("Generated via Secure Clinical Portal", 15, 275);

    doc.save(`patient_case_${patient.name.toLowerCase().replace(/\s+/g, "_")}.pdf`);
    showToast(`PDF Case paper generated for ${patient.name}!`, "success");
  };

  // ─── ADD/EDIT RECORD CRUD SUBMISSIONS ──────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormValues({
      patientId: "",
      name: "", age: "", gender: "Male", visitDate: new Date().toISOString().slice(0, 10),
      diagnosisCategory: "", diagnosis: "", paymentType: "Cash-OPD",
      billingPaid: "",
      referringDoctor: "", contact: "", flags: [], notes: ""
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingPatient(p);
    setFormValues({ ...p });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const toggleFormFlag = (flagId: string) => {
    const currentFlags = formValues.flags || [];
    if (currentFlags.includes(flagId)) {
      handleFieldChange("flags", currentFlags.filter((f: string) => f !== flagId));
    } else {
      handleFieldChange("flags", [...currentFlags, flagId]);
    }
  };

  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run clinical input validation check
    if (!validateForm()) {
      showToast("Please correct the clinical validation errors.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formValues,
        age: formValues.age ? Number(formValues.age) : "",
        month: currentMonth,
        year: currentYear
      };

      let res;
      if (editingPatient) {
        res = await fetch("/api/patients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, oldPatientId: editingPatient.patientId })
        });
      } else {
        res = await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showToast(editingPatient ? "Patient record updated!" : "New patient registered!", "success");
        setIsFormOpen(false);
        fetchInitialData();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to save patient record.", "error");
      }
    } catch (err) {
      showToast("Network error submitting patient record.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this clinical record?")) return;
    try {
      const res = await fetch(`/api/patients?patientId=${patientId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Patient record deleted successfully.", "success");
        fetchInitialData();
      } else {
        showToast("Failed to delete patient record.", "error");
      }
    } catch (e) {
      showToast("Network error deleting patient record.", "error");
    }
  };

  // ─── EHR CUSTOMIZE COLUMNS SETTINGS SUBMIT ──────────────────────────────────
  const toggleSettingField = (fKey: string) => {
    if (tempEnabledFields.includes(fKey)) {
      setTempEnabledFields(prev => prev.filter(f => f !== fKey));
    } else {
      setTempEnabledFields(prev => [...prev, fKey]);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/patients/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabledFields: tempEnabledFields })
      });
      if (res.ok) {
        setEnabledFields(tempEnabledFields);
        setIsSettingsOpen(false);
        showToast("Clinical fields customized successfully.", "success");
      } else {
        showToast("Failed to save customization.", "error");
      }
    } catch (e) {
      showToast("Network error saving settings.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION WITH MONTH PERIOD SELECTOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Patient Registry</span>
            <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Local DB</span>
          </h1>
          <p className="text-slate-600 mt-1">{MONTHS[currentMonth - 1]} {currentYear} · HCG Hospital, Rajkot</p>
        </div>

        {/* Period Selector (Month Navigator) */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 shrink-0 text-white shadow-sm">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white"
            title="Previous Month"
          >
            <ChevronDown size={16} className="rotate-90" />
          </button>
          <div className="text-center px-4 min-w-28 select-none">
            <p className="font-bold text-sm font-heading">{MONTHS[currentMonth - 1]}</p>
            <p className="text-slate-400 text-[10px] uppercase font-bold mt-0.5 tracking-wider">{currentYear}</p>
          </div>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white"
            title="Next Month"
          >
            <ChevronDown size={16} className="-rotate-90" />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* Row 1 standard cards */}
        {[
          { key: 'total', label: 'Total Patients', icon: Users, val: stats.total, color: 'bg-brand-50 text-brand-600 border border-brand-100' },
          { key: 'cash', label: 'Cash', icon: Banknote, val: stats.cash, color: 'bg-emerald-50 text-emerald-600 border border-emerald-100', isInteractive: true },
          { key: 'pmjaya', label: 'PM-JAYA', icon: ShieldCheck, val: stats.pmjaya, color: 'bg-amber-50 text-amber-600 border border-amber-100' },
          { key: 'insurance', label: 'Insurance', icon: HeartPulse, val: stats.insurance, color: 'bg-sky-50 text-sky-600 border border-sky-100' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  if (s.isInteractive) {
                    setIsCashBreakdownOpen(!isCashBreakdownOpen);
                  }
                }}
                className={`bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow ${
                  s.isInteractive ? 'cursor-pointer hover:border-emerald-200' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-500 leading-none mb-1 truncate">{s.label}</p>
                  {loading ? (
                    <div className="h-5 w-8 bg-slate-100 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold font-heading text-slate-900 leading-none">{s.val}</p>
                  )}
                </div>
              </motion.div>

              {s.isInteractive && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCashBreakdownOpen(!isCashBreakdownOpen);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition z-10 shadow-sm"
                  title="View Cash Breakdown"
                >
                  <SlidersHorizontal size={14} />
                </button>
              )}

              {s.key === 'cash' && isCashBreakdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsCashBreakdownOpen(false)} 
                  />
                  <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-xl p-2.5 z-40">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                      Cash Patients
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'OPD', count: stats.cashOPD },
                        { label: 'IPD', count: stats.cashIPD },
                        { label: 'Followup', count: stats.cashFollowup },
                        { label: 'RT', count: stats.cashRT }
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-500">{item.label}</span>
                          <span className="font-bold text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 min-w-5 text-center">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* REVENUE COLLECTIONS BREAKDOWN (Spans 2 rows on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-2 lg:col-span-1 lg:row-span-2 bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Banknote size={16} />
            </div>
            {/* Dropdown selector for breakdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsBreakdownMenuOpen(!isBreakdownMenuOpen)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                title="Select Payment Type"
              >
                <SlidersHorizontal size={14} />
              </button>

              {isBreakdownMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsBreakdownMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-20 max-h-48 overflow-y-auto">
                    {Object.keys(collections)
                      .filter(key => key !== 'total' && key !== 'Free')
                      .map(key => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedBreakdown(key);
                            setIsBreakdownMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[11px] font-semibold transition ${
                            selectedBreakdown === key 
                              ? 'bg-brand-50 text-brand-700' 
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {key}
                        </button>
                      ))
                    }
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-0 mt-1">
            {/* Total Box */}
            <div className="flex items-center justify-between p-2 bg-emerald-50/50 rounded-xl border border-emerald-100/60 mb-2">
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Banknote size={14} className="shrink-0 text-emerald-600" />
                <span>Total</span>
              </div>
              <span className="text-xs font-extrabold text-slate-800">
                ₹{collections.total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Divider Line */}
            <div className="border-t border-dashed border-slate-200 my-1" />

            {/* Selected Breakdown Box */}
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[90px] pr-1 mt-1">
              {Object.entries(collections)
                .filter(([key]) => key !== 'total')
                .filter(([key]) => key === selectedBreakdown)
                .map(([key, val]) => {
                  const styles = PAYMENT_COLORS[key] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
                  const shortLabel = SHORT_PAYMENT_LABELS[key] || key;
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 min-w-0">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate flex items-center gap-1.5">
                        <Banknote size={14} className={`shrink-0 ${styles.text}`} />
                        <span>{shortLabel}</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">
                        ₹{val.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>

        {/* Row 2 standard cards */}
        {[
          { key: 'simulation', label: 'Simulations', icon: Activity, val: stats.simulation, color: 'bg-teal-50 text-teal-600 border border-teal-100' },
          { key: 'needsRT', label: 'Needs RT', icon: Zap, val: stats.needsRT, color: 'bg-rose-50 text-rose-600 border border-rose-100' },
          { key: 'followup', label: 'Follow-ups', icon: ClipboardList, val: stats.followup, color: 'bg-orange-50 text-orange-600 border border-orange-100' },
          { key: 'referred', label: 'Referrals', icon: UserCheck, val: stats.referred, color: 'bg-violet-50 text-violet-600 border border-violet-100' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 4) * 0.03 }}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 leading-none mb-1 truncate">{s.label}</p>
                {loading ? (
                  <div className="h-5 w-8 bg-slate-100 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold font-heading text-slate-900 leading-none">{s.val}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, diagnosis, referring doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition placeholder:text-slate-400"
          />
        </div>

        {/* Dropdown filters */}
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        >
          <option value="">All Categories</option>
          {DIAGNOSIS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filterPayment}
          onChange={e => setFilterPayment(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        >
          <option value="">All Payments</option>
          {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filterFlag}
          onChange={e => setFilterFlag(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        >
          <option value="">All Flags</option>
          {PATIENT_FLAGS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition"
            title="Configure EHR clinical fields"
          >
            <Settings size={14} /> Customize
          </button>

          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCSVImport}
          />
          <button
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition"
          >
            <Upload size={14} /> Import
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition"
          >
            <FileSpreadsheet size={14} /> Export CSV
          </button>

          <button
            onClick={handleExportListPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 border border-rose-200 bg-white rounded-lg hover:bg-rose-50 transition"
          >
            <Download size={14} /> Export PDF
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
          >
            <Plus size={14} /> Add Patient
          </button>
        </div>
      </div>

      {/* INTERACTIVE TABLE GRID */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-brand-400" />
            </div>
            <p className="text-slate-700 font-semibold font-heading text-lg">No patients found</p>
            <p className="text-slate-400 text-sm mt-1">Add a patient or adjust your filters for {MONTHS[currentMonth - 1]} {currentYear}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-slate-100 bg-slate-50/60">
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3 w-10">#</th>
                  <th className="px-4 py-3">Patient ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Age / Sex</th>
                  <th className="px-4 py-3">Diagnosis</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Paid Amount</th>
                  <th className="px-4 py-3">Referring Dr.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Flags</th>
                  {/* Dynamic Settings Fields */}
                  {enabledFields.map(fKey => {
                    const fConfig = MASTER_FIELDS.find(m => m.key === fKey);
                    return fConfig ? (
                      <th key={fKey} className="px-4 py-3 min-w-[120px] font-semibold text-slate-500 uppercase tracking-wide">
                        {fConfig.labelEn}
                      </th>
                    ) : null;
                  })}
                  <th className="px-4 py-3 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-800">
                {filteredPatients.map((p, idx) => (
                  <tr key={p.patientId} className="group hover:bg-brand-50/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 font-normal">{idx + 1}</td>
                    <td className="px-4 py-3 text-brand-600 font-mono font-semibold text-xs whitespace-nowrap">
                      {p.patientId}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 leading-none">{p.name}</p>
                      {p.contact && <p className="text-xs text-slate-400 mt-1 font-normal">{p.contact}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-normal">
                      {p.age ? `${p.age} / ${p.gender?.charAt(0) || '?'}` : `— / ${p.gender?.charAt(0) || '?'}`}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-brand-600 leading-none">{p.diagnosisCategory || "—"}</p>
                      {p.diagnosis && <p className="text-[11px] text-slate-500 font-normal mt-1 leading-tight">{p.diagnosis}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge type={p.paymentType} />
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">
                      {p.billingPaid !== undefined && p.billingPaid !== null && p.billingPaid !== "" ? `₹${Number(p.billingPaid).toLocaleString('en-IN')}` : "₹0"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-normal">{p.referringDoctor || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 font-normal whitespace-nowrap">{formatDate(p.visitDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.flags || []).map((f: string) => <FlagBadge key={f} flag={f} />)}
                      </div>
                    </td>

                    {/* Render customized dynamic fields values */}
                    {enabledFields.map(fKey => {
                      const val = p[fKey];
                      return (
                        <td key={fKey} className="px-4 py-3 max-w-[200px] truncate text-slate-600 font-normal">
                          {val !== undefined && val !== null && val !== "" ? String(val) : "—"}
                        </td>
                      );
                    })}

                    {/* Action buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleExportPatientCasePDF(p)}
                          title="Print Patient Case Sheet"
                          className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 transition"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Patient Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(p.patientId)}
                          title="Delete permanently"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── ADD/EDIT PATIENT DIALOG MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-none">
                    {editingPatient ? "Edit Clinical Record" : "Register New Patient"}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5">
                    {editingPatient ? `Editing patient record ID: ${editingPatient.patientId}` : "Fill in HCG clinical details below"}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleSubmitRecord} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-5">

                  {/* Patient ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Patient ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PAT-1683FE7C"
                      value={formValues.patientId || ""}
                      onChange={(e) => handleFieldChange("patientId", e.target.value)}
                      className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:bg-white transition
                        ${formErrors.patientId ? 'border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-brand-500'}`}
                    />
                    {formErrors.patientId && (
                      <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors.patientId}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={formValues.name || ""}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:bg-white transition
                        ${formErrors.name ? 'border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-brand-500'}`}
                    />
                    {formErrors.name && (
                      <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Age, Gender & Visit Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 58"
                        value={formValues.age || ""}
                        onChange={(e) => handleFieldChange("age", e.target.value)}
                        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:bg-white transition
                          ${formErrors.age ? 'border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-brand-500'}`}
                      />
                      {formErrors.age && (
                        <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors.age}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Gender
                      </label>
                      <select
                        value={formValues.gender || "Male"}
                        onChange={(e) => handleFieldChange("gender", e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
                      >
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Visit Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formValues.visitDate || ""}
                        onChange={(e) => handleFieldChange("visitDate", e.target.value)}
                        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:bg-white transition
                          ${formErrors.visitDate ? 'border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-brand-500'}`}
                      />
                      {formErrors.visitDate && (
                        <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors.visitDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Diagnosis Selector */}
                  <DiagnosisSelector
                    category={formValues.diagnosisCategory || ""}
                    diagnosis={formValues.diagnosis || ""}
                    onCategoryChange={(cat) => handleFieldChange("diagnosisCategory", cat)}
                    onDiagnosisChange={(diag) => handleFieldChange("diagnosis", diag)}
                    error={formErrors.diagnosisCategory || formErrors.diagnosis}
                  />

                  {/* Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Payment Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formValues.paymentType || "Cash-OPD"}
                        onChange={(e) => handleFieldChange("paymentType", e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
                      >
                        {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Paid Amount (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1500"
                        value={formValues.billingPaid ?? ""}
                        onChange={(e) => handleFieldChange("billingPaid", e.target.value)}
                        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:bg-white transition ${
                          formErrors.billingPaid ? 'border-rose-400 focus:border-rose-400' : 'border-slate-200 focus:border-brand-500'
                        }`}
                      />
                      {formErrors.billingPaid && (
                        <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors.billingPaid}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Referral & Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Referring Doctor
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Sharma"
                        value={formValues.referringDoctor || ""}
                        onChange={(e) => handleFieldChange("referringDoctor", e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        Contact No.
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formValues.contact || ""}
                        onChange={(e) => handleFieldChange("contact", e.target.value)}
                        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:bg-white transition
                          ${formErrors.contact ? 'border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-brand-500'}`}
                      />
                      {formErrors.contact && (
                        <p className="text-rose-500 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors.contact}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Patient Flags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Patient Flags
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PATIENT_FLAGS.map(f => {
                        const isChecked = (formValues.flags || []).includes(f.id);
                        return (
                          <label
                            key={f.id}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition select-none
                              ${isChecked
                                ? 'bg-brand-50 border-brand-200 text-brand-700'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                          >
                            <input
                              type="checkbox"
                              className="accent-brand-600"
                              checked={isChecked}
                              onChange={() => toggleFormFlag(f.id)}
                            />
                            <span className="text-xs font-semibold">{f.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                      Clinical Notes
                    </label>
                    <textarea
                      placeholder="Special instructions, staging details, clinical observations..."
                      value={formValues.notes || ""}
                      onChange={(e) => handleFieldChange("notes", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition resize-none"
                    />
                  </div>

                  {/* Dynamic Settings Fields (EHR clinical records) */}
                  {enabledFields.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">EHR Custom Fields</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {enabledFields.map(fKey => {
                          const f = MASTER_FIELDS.find(m => m.key === fKey);
                          if (!f) return null;
                          const isFullWidth = f.type === "textarea";

                          return (
                            <div key={f.key} className={`space-y-1.5 ${isFullWidth ? "sm:col-span-2" : ""}`}>
                              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                {f.labelEn} ({f.labelGu})
                              </label>

                              {f.type === "textarea" ? (
                                <textarea
                                  value={formValues[f.key] || ""}
                                  onChange={(e) => handleFieldChange(f.key, e.target.value)}
                                  rows={2}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition resize-none"
                                />
                              ) : f.type === "select" ? (
                                <select
                                  value={formValues[f.key] || ""}
                                  onChange={(e) => handleFieldChange(f.key, e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
                                >
                                  <option value="">Select option...</option>
                                  {f.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                                  value={formValues[f.key] || ""}
                                  onChange={(e) => handleFieldChange(f.key, e.target.value)}
                                  className={`w-full bg-slate-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:bg-white transition
                                    ${formErrors[f.key] ? 'border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-brand-500'}`}
                                />
                              )}
                              {formErrors[f.key] && (
                                <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {formErrors[f.key]}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : editingPatient ? 'Save Changes' : 'Add Patient'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EHR CUSTOMIZE FIELDS CHECKLIST MODAL ─────────────────────────────── */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-none">Customize Clinical Record Fields</h3>
                  <p className="text-slate-500 text-xs mt-1.5">Select extra fields to enable in your dynamic clinical EHR directory</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MASTER_FIELDS.map((f) => {
                  const isChecked = tempEnabledFields.includes(f.key);
                  return (
                    <button
                      key={f.key}
                      onClick={() => toggleSettingField(f.key)}
                      className={`flex items-center space-x-3.5 p-3.5 rounded-xl border text-left transition-all ${isChecked
                          ? "bg-brand-50 border-brand-200 text-slate-900 shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                      <div className={isChecked ? "text-brand-600" : "text-slate-400"}>
                        {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs truncate leading-none">{f.labelEn}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-1 leading-none">{f.labelGu}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
                >
                  Apply & Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
