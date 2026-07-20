export interface CancerType {
  slug: string;
  title: string;
  subTypes: string;
  shortDesc: string;
  fullDesc: string;
  radiationRole: string;
  techniques: string[];
  image: string;
}

export const cancerTypesData: CancerType[] = [
  {
    slug: "head-neck-cancer",
    title: "Head & Neck Cancer",
    subTypes: "Oral Cavity, Thyroid, Larynx, Pharynx, Nasopharynx",
    shortDesc: "Comprehensive radiation oncology care for tumors of the mouth, throat, larynx, and thyroid, focusing on organ preservation and speech/swallowing function.",
    fullDesc: `
      <p>Head and neck cancers encompass a diverse group of tumors that arise in the moist surfaces lining the mouth, nose, and throat. Radiation therapy is a cornerstone of head and neck cancer treatment, either as a primary therapy (definitive) or after surgery (adjuvant) to eliminate residual cancer cells.</p>
      
      <h3>Organ Preservation Protocol</h3>
      <p>Historically, large head and neck tumors required extensive surgical resection, often involving the removal of the larynx (voice box) or portions of the jaw. Modern precision radiation oncology allows for definitive chemoradiotherapy that achieves excellent cure rates while preserving the anatomical structures necessary for speech, swallowing, and breathing.</p>
    `,
    radiationRole: "Primary definitive treatment (often combined with chemotherapy) to preserve speech and swallowing function, or post-operative adjuvant therapy to reduce recurrence risk.",
    techniques: ["IMRT (Intensity-Modulated Radiotherapy)", "IGRT (Image-Guided Radiotherapy)", "VMAT (RapidArc)", "Bilateral neck nodal planning"],
    image: "/therapypics/Headandneck.jpeg"
  },
  {
    slug: "breast-cancer",
    title: "Breast Cancer",
    subTypes: "Ductal Carcinoma, Lobular Carcinoma, Early-stage & Advanced",
    shortDesc: "Post-lumpectomy and post-mastectomy radiation treatments incorporating advanced heart-sparing techniques (DIBH) for maximum safety.",
    fullDesc: `
      <p>Breast cancer is one of the most common malignancies diagnosed in women. Radiation therapy plays a critical role in breast-conserving therapy (lumpectomy followed by radiation), reducing the risk of local recurrence by over 70%. It is also indicated after mastectomy for patients with larger tumors or positive lymph nodes.</p>
      
      <h3>Heart-Sparing Technologies</h3>
      <p>For patients with left-sided breast cancer, protecting the heart from low-dose radiation exposure is a primary concern. We utilize Deep Inspiration Breath-Hold (DIBH) and Real-time Position Management (RPM) gating. By taking a deep breath and holding it, the lungs expand, pushing the heart back and away from the breast tissue being treated, reducing cardiac dose to near zero.</p>
    `,
    radiationRole: "Adjuvant therapy after breast-conserving surgery (lumpectomy) or mastectomy to eradicate microscopic cells, and palliative treatment for metastatic disease.",
    techniques: ["DIBH (Deep Inspiration Breath-Hold)", "3D-CRT Conformal Radiotherapy", "VMAT / RapidArc", "Hypofractionated whole breast irradiation"],
    image: "/therapypics/breast.jpeg"
  },
  {
    slug: "brain-spine-tumor",
    title: "Brain & Spine Tumors",
    subTypes: "Gliomas, Meningiomas, Brain Metastases, Acoustic Neuromas",
    shortDesc: "High-precision cranial and spinal radiotherapy including single-session stereotactic radiosurgery (SRS) to target tumors with sub-millimeter margins.",
    fullDesc: `
      <p>Tumors of the central nervous system (brain and spine) require an extraordinary level of targeting precision due to the high density of critical neurological structures nearby, such as the brainstem, optic nerves, and spinal cord.</p>
      
      <h3>Stereotactic Radiosurgery (SRS)</h3>
      <p>For benign lesions (meningiomas, acoustic neuromas) or brain metastases, Stereotactic Radiosurgery (SRS) delivers a single, highly potent fraction of radiation that halts tumor growth. Because the radiation falls off extremely fast outside the target boundary, the healthy brain is spared, preventing cognitive decline and functional deficits.</p>
    `,
    radiationRole: "Primary non-surgical ablation via SRS/SRT, adjuvant postoperative therapy for high-grade gliomas, and palliative spinal radiation to prevent paralysis.",
    techniques: ["SRS (Stereotactic Radiosurgery)", "SRT (Stereotactic Radiotherapy)", "IGRT (Cone-Beam CT tracking)", "3D Treatment Planning with MRI fusion"],
    image: "/therapypics/brain.jpg"
  },
  {
    slug: "genitourinary-cancer",
    title: "Genitourinary Cancers",
    subTypes: "Prostate, Bladder, Kidney, Testicular Cancers",
    shortDesc: "Advanced radiotherapy for prostate and bladder malignancies, including extreme hypofractionated SBRT and bladder-preservation protocols.",
    fullDesc: `
      <p>Genitourinary cancers affect the organs of the urinary tract and reproductive system. Radiation oncology is highly effective in managing these cancers, particularly prostate and urinary bladder malignancies.</p>
      
      <h3>Prostate SBRT & Bladder Preservation</h3>
      <p>For prostate cancer, Stereotactic Body Radiotherapy (SBRT) delivers high-dose fractions in just 5 sessions, yielding cure rates equivalent to radical surgery without the surgical recovery time. For bladder cancer, we employ trimodality bladder-preservation therapy (transurethral resection followed by concurrent chemoradiation) to avoid total cystectomy and preserve urinary function.</p>
    `,
    radiationRole: "Definitive curative radiation for localized prostate cancer, bladder-preserving chemoradiation, and adjuvant radiation for pelvic recurrences.",
    techniques: ["Prostate SBRT (5 fractions)", "VMAT / RapidArc", "Daily CBCT tracking (IGRT)", "Heart/Bowel-sparing pelvic planning"],
    image: "/therapypics/prostate.jpeg"
  },
  {
    slug: "thoracic-lung-cancer",
    title: "Thoracic & Lung Cancers",
    subTypes: "Non-Small Cell Lung Cancer (NSCLC), Small Cell Lung Cancer (SCLC)",
    shortDesc: "SBRT for early-stage localized lung tumors and concurrent chemoradiotherapy for locally advanced thoracic malignancies.",
    fullDesc: `
      <p>Lung cancer is a leading cause of oncological mortality worldwide. Radiation therapy is crucial at every stage of the disease, from early-stage localized lesions to advanced metastatic blockages.</p>
      
      <h3>Targeting Tumors in Motion</h3>
      <p>Because lung tumors move as the patient breathes, treating them requires advanced motion management. We utilize 4D-CT scans to model tumor motion during the respiratory cycle, and employ respiratory gating so the radiation beam only turns on when the tumor is in a specific phase of breathing. This drastically reduces the volume of healthy lung tissue irradiated.</p>
    `,
    radiationRole: "Ablative SBRT for medically inoperable early lung cancers, definitive concurrent chemoradiotherapy for Stage III NSCLC, and palliative airway clearance.",
    techniques: ["4D-CT simulation", "Respiratory Gating (RPM)", "SBRT / SABR", "Prophylactic Cranial Irradiation (PCI) for SCLC"],
    image: "/therapypics/thoracic.jpeg"
  },
  {
    slug: "gynecological-cancer",
    title: "Gynecological Cancers",
    subTypes: "Cervical, Uterine, Endometrial, Ovarian, Vaginal Cancers",
    shortDesc: "State-of-the-art pelvic chemoradiotherapy combined with high-dose-rate (HDR) brachytherapy using advanced applicator templates.",
    fullDesc: `
      <p>Gynecological cancers represent a major health challenge, particularly cervical cancer. Radiation therapy is the primary curative treatment for locally advanced cervical cancer and a common postoperative adjuvant therapy for endometrial cancer.</p>
      
      <h3> Pelvic Radiation & Brachytherapy Boost</h3>
      <p>The standard treatment for locally advanced cervical cancer consists of external beam radiation (using IMRT or VMAT) to treat the pelvis, followed by high-dose-rate (HDR) brachytherapy. Brachytherapy allows the doctor to insert applicators directly into the cervix and uterus to deliver a highly concentrated dose to the main tumor mass while protecting the bladder and rectum.</p>
    `,
    radiationRole: "Primary definitive treatment for locally advanced cervical cancer, adjuvant postoperative pelvic radiation, and HDR brachytherapy boosts.",
    techniques: ["HDR Brachytherapy (ICRT/Interstitial)", "MUPIT template placement", "IMRT / VMAT pelvic mapping", "IGRT setup verification"],
    image: "/therapypics/gynaecologival.jpeg"
  }
];
