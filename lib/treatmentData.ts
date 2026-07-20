export interface Treatment {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  technology: string;
  sessions: string;
  clinicalIndications: string[];
  benefits: string[];
  image?: string;
}

export const treatmentsData: Treatment[] = [
  {
    slug: "sbrt",
    title: "Stereotactic Body Radiation Therapy (SBRT)",
    shortDesc: "Highly potent, ultra-precise doses of radiation delivered in a shortened course of 1 to 5 sessions, minimizing exposure to healthy tissues.",
    fullDesc: `
      <p>Stereotactic Body Radiation Therapy (SBRT), also known as Stereotactic Ablative Radiotherapy (SABR), is one of the most significant advancements in modern radiation oncology. It allows radiation oncologists to deliver exceptionally high, tumor-destroying doses of radiation to precise targets inside the body over a very short timeframe—typically just 1 to 5 sessions.</p>
      
      <h3>How SBRT Works</h3>
      <p>Unlike traditional radiation, which delivers small daily doses over several weeks, SBRT uses advanced 3D imaging and patient localization systems to track the tumor's exact position in real-time. This sub-millimeter tracking allows a high-dose beam to be delivered with pinpoint accuracy, sparing the surrounding healthy organs from unnecessary radiation.</p>
      
      <h3>What to Expect During Treatment</h3>
      <p>SBRT treatments are completely non-invasive and painless. Before the treatment, a simulation scan is performed to map the tumor and create a customized immobilization mold to ensure you remain perfectly still. During the delivery phase, you will lie comfortably on the linear accelerator couch while the machine moves around you to deliver beam arcs. Each session takes about 15 to 30 minutes, and patients can immediately return to their normal daily activities.</p>
    `,
    technology: "TrueBeam Linac, RPM Respiratory Gating, Active Breathing Coordinator",
    sessions: "1 to 5 fractions (completed in 1 week)",
    clinicalIndications: [
      "Early-stage Non-Small Cell Lung Cancer (NSCLC)",
      "Localized Prostate Cancer",
      "Primary and Metastatic Liver Tumors",
      "Pancreatic Malignancies",
      "Spinal and Bone Metastases"
    ],
    benefits: [
      "Extremely high local control rates (often exceeding 90%)",
      "Shortened treatment timeline (days instead of weeks)",
      "Minimal side effects due to sub-millimeter targeting",
      "Completely outpatient, non-invasive procedure"
    ],
    image: "/therapypics/SBRT.jpeg"
  },
  {
    slug: "imrt",
    title: "Intensity-Modulated Radiation Therapy (IMRT)",
    shortDesc: "Advanced precision radiation that sculpts high-dose beams to match the complex 3D shape of the tumor, sparing critical surrounding organs.",
    fullDesc: `
      <p>Intensity-Modulated Radiation Therapy (IMRT) is a high-precision radiotherapy modality that uses computer-controlled linear accelerators to deliver precise radiation doses to a malignant tumor or specific areas within the tumor.</p>
      
      <h3>How IMRT Works</h3>
      <p>IMRT allows the radiation oncologist to divide the radiation beam into hundreds of smaller, individual 'beamlets'. The intensity of each beamlet can be adjusted independently. This modulation enables the sculpting of a high radiation dose that conforms tightly around the outer contours of the tumor while creating steep drop-offs of dose near critical healthy structures (such as the spinal cord, brainstem, or salivary glands).</p>
      
      <h3>Clinical Importance in Head & Neck Cancers</h3>
      <p>IMRT is particularly vital for head and neck cancers, where tumors are located adjacent to crucial organs. Conventional radiation often leads to permanent xerostomia (dry mouth) due to salivary gland exposure. IMRT allows the radiation team to spare the parotid glands, significantly preserving post-treatment salivary function and improving long-term quality of life.</p>
    `,
    technology: "Multileaf Collimators (MLC), 3D Treatment Planning System (Eclipse)",
    sessions: "25 to 35 fractions (typically 5 to 7 weeks)",
    clinicalIndications: [
      "Head and Neck Cancers (Oral Cavity, Larynx, Pharynx, Nasopharynx)",
      "Prostate Cancer",
      "Brain Tumors (Gliomas, Meningiomas)",
      "Gynecological Cancers (Cervical, Endometrial)",
      "Gastrointestinal Malignancies"
    ],
    benefits: [
      "Higher radiation doses can be safely delivered to the tumor",
      "Substantially reduces side effects in healthy tissue",
      "Protects critical structures like eyes, spinal cord, and salivary glands",
      "Improves long-term patient comfort and quality of life"
    ],
    image: "/therapypics/IMRT.jpeg"
  },
  {
    slug: "vmat",
    title: "Volumetric Modulated Arc Therapy (VMAT)",
    shortDesc: "Continuous 360-degree rotational radiation delivery that drastically reduces session times to under 2-3 minutes while maintaining high conformity.",
    fullDesc: `
      <p>Volumetric Modulated Arc Therapy (VMAT), commercially known as RapidArc, represents a major evolutionary step from fixed-field IMRT. Instead of delivering radiation from a few static angles, VMAT delivers the dose in a continuous, rotational sweep of the machine's gantry around the patient.</p>
      
      <h3>The VMAT Advantage</h3>
      <p>During a VMAT sweep, three parameters are constantly modulated in unison: the speed of the rotating gantry, the shape of the multileaf collimator leaves, and the dose rate of the radiation beam. This allows for exceptionally conformal dose distributions that can be delivered in a fraction of the time required by traditional methods.</p>
      
      <h3>Speed and Comfort</h3>
      <p>A standard IMRT session might take 15 to 20 minutes of treatment couch time. VMAT can deliver the equivalent (or superior) dose plan in just 2 to 3 minutes. Reducing the time the patient must remain perfectly still on the couch significantly lowers the risk of patient movement during the treatment, further increasing overall accuracy.</p>
    `,
    technology: "Rotational Gantry Linac, Dynamic Multileaf Collimation, High Dose-Rate Flattening Filter Free (FFF) beams",
    sessions: "20 to 35 fractions (completed in 4 to 7 weeks)",
    clinicalIndications: [
      "Prostate Cancer",
      "Gynecological Cancers",
      "Thoracic and Lung Tumors",
      "Brain and Spine Tumors",
      "Pediatric Cancers requiring rapid delivery"
    ],
    benefits: [
      "Extremely fast treatment sessions (under 3 minutes)",
      "Enhanced patient comfort and less anxiety on the treatment couch",
      "Decreases probability of intra-fraction patient motion",
      "Outstanding dose conformity and organ-at-risk sparing"
    ],
    image: "/therapypics/VMAT.jpeg"
  },
  {
    slug: "igrt",
    title: "Image-Guided Radiation Therapy (IGRT)",
    shortDesc: "Real-time scanning and image verification during every single session to correct for internal tumor movement and target deviations.",
    fullDesc: `
      <p>Image-Guided Radiation Therapy (IGRT) is the clinical practice of performing repeated imaging scans (such as cone-beam CTs or X-rays) immediately before or during the delivery of radiotherapy. It is the absolute gold standard for verifying correct patient alignment and tumor targeting.</p>
      
      <h3>Why IGRT is Necessary</h3>
      <p>Internal organs move constantly. The bladder fills and empties, lungs expand and contract, and digestive tract gases shift. Over a 5-week treatment course, a tumor's position can vary from day to day, and the patient's outer setup alignment may not perfectly match their internal anatomy. IGRT solves this by taking a quick low-dose scan while the patient is on the treatment couch, comparing it to the planning scan, and making automatic sub-millimeter table adjustments before the beam turns on.</p>
    `,
    technology: "On-Board Imager (OBI), Cone-Beam CT (CBCT), Optical Surface Monitoring",
    sessions: "Used daily alongside IMRT, VMAT, and SBRT courses",
    clinicalIndications: [
      "Prostate Cancer (tracking prostate movement relative to bladder/rectum)",
      "Lung and Thoracic Tumors (tracking respiratory motion)",
      "Gynecological Cancers",
      "Spinal and Paraspinal Tumors",
      "Head and Neck Tumors"
    ],
    benefits: [
      "Verifies exact tumor location immediately before the beam is turned on",
      "Allows for tighter, safer treatment margins around the tumor",
      "Minimizes dose to critical organs immediately adjacent to the tumor",
      "Provides clinical certainty of targeting accuracy throughout the course"
    ],
    image: "/therapypics/IGRT.jpeg"
  },
  {
    slug: "srs-srt",
    title: "Stereotactic Radiosurgery & Radiotherapy (SRS/SRT)",
    shortDesc: "Non-surgical, high-dose targeting specifically designed for cranial lesions, acoustic neuromas, and brain metastases.",
    fullDesc: `
      <p>Stereotactic Radiosurgery (SRS) is a highly specialized, non-invasive form of radiation therapy used to treat tumors and other abnormalities in the brain. Despite the name 'radiosurgery', it involves no surgical incision. Instead, it uses highly focused beams of radiation to treat lesions with surgical precision.</p>
      
      <h3>SRS vs. SRT</h3>
      <p>When the treatment is completed in a single session, it is referred to as Stereotactic Radiosurgery (SRS). When the treatment is broken up into 2 to 5 sessions (fractions) to protect critical structures like the optic nerves or brainstem, it is called Stereotactic Radiotherapy (SRT).</p>
      
      <h3>How Cranial Sparing Works</h3>
      <p>SRS/SRT relies on a specialized headframe or custom thermoplastic mask to keep the patient's head completely immobile. Dozens of small radiation beams intersect precisely at the center of the tumor. While each individual beam has a low dose that passes harmlessly through normal brain tissue, the point where all beams converge receives a highly destructive dose of radiation, killing the tumor cells while sparing normal brain function.</p>
    `,
    technology: "Stereotactic Head Frames, High-Resolution Brain Lab planning software, Micro-multileaf Collimators",
    sessions: "1 session (SRS) or 2 to 5 sessions (SRT)",
    clinicalIndications: [
      "Brain Metastases (cancer that has spread to the brain from elsewhere)",
      "Benign Brain Tumors (Meningiomas, Acoustic Neuromas, Pituitary Adenomas)",
      "Arteriovenous Malformations (AVMs)",
      "Trigeminal Neuralgia"
    ],
    benefits: [
      "Safe alternative to open brain surgery (craniotomy)",
      "No surgical incision, no general anesthesia, and no hospital stay",
      "Exceptional targeting accuracy protecting healthy brain tissue",
      "Completed in a single day or up to 5 brief outpatient visits"
    ],
    image: "/therapypics/SRS.jpeg"
  },
  {
    slug: "3d-crt",
    title: "3D Conformal Radiation Therapy (3D-CRT)",
    shortDesc: "Standard conformal radiotherapy that shapes beams to match the basic anatomical contours of the tumor using computed tomography planning.",
    fullDesc: `
      <p>3D Conformal Radiation Therapy (3D-CRT) is a standard, highly reliable radiation therapy technique that uses computer software and advanced imaging (CT scans) to create a three-dimensional profile of a patient's tumor.</p>
      
      <h3>How 3D-CRT Works</h3>
      <p>Before 3D-CRT was developed, radiation beams were directed in simple, flat shapes (2D). With 3D-CRT, the radiation beams are shaped to match the exact profile of the tumor using custom metal blocks or collimator leaves. This allows the radiation oncologist to treat the tumor more effectively while reducing damage to nearby healthy tissues.</p>
    `,
    technology: "Computed Tomography (CT) Simulation, Eclipse Treatment Planning, Linac collimation",
    sessions: "20 to 35 fractions (4 to 7 weeks)",
    clinicalIndications: [
      "Breast Cancer (post-lumpectomy or post-mastectomy)",
      "Lung Cancer (definitive or palliative settings)",
      "Palliative bone metastasis treatment",
      "Gastrointestinal cancers"
    ],
    benefits: [
      "Highly accessible and time-tested treatment technique",
      "Accurately shapes the radiation field to match the tumor boundary",
      "Appropriate for a wide range of cancer diagnoses",
      "Excellent option for palliative management to relieve pain and symptoms"
    ]
  },
  {
    slug: "brachytherapy",
    title: "Brachytherapy (Internal Radiotherapy)",
    shortDesc: "Direct targeted internal radiation where small radioactive sources are placed inside or adjacent to the cancer cells, protecting distant organs.",
    fullDesc: `
      <p>Brachytherapy is a unique form of radiotherapy where radioactive sources are placed directly inside or immediately adjacent to the tumor. This allows the radiation team to deliver a highly concentrated dose of radiation directly to the cancer cells, while the radiation level drops off extremely fast, protecting distant healthy tissues.</p>
      
      <h3>Types of Brachytherapy</h3>
      <p>Dr. Sarthak specializes in High-Dose-Rate (HDR) brachytherapy, which is commonly used for gynecological malignancies. This includes Intracavitary Brachytherapy (ICRT) using templates like the MUPIT template, or interstitial implants where temporary catheters are placed directly into the tissue to guide the radioactive source.</p>
      
      <h3>The Procedure</h3>
      <p>Brachytherapy is typically performed in a dedicated treatment suite. Applicators or thin tubes are placed in position under local or general anesthesia. A computerized machine then drives a tiny radioactive source (usually Iridium-192) through the tubes to deliver the dose over a few minutes, after which the source is retracted and the applicators are removed. The patient does not remain radioactive after the procedure.</p>
    `,
    technology: "HDR Afterloader, Iridium-192 source, Real-time ultrasound/CT guidance, MUPIT Template",
    sessions: "1 to 5 insertions (typically outpatient or short overnight stay)",
    clinicalIndications: [
      "Cervical Cancer",
      "Endometrial / Uterine Cancer",
      "Vaginal Cancers",
      "Soft Tissue Sarcomas",
      "Prostate Cancer boost"
    ],
    benefits: [
      "Unmatched localized dose concentration directly inside the tumor",
      "Dramatically spares surrounding organs (bladder, rectum)",
      "Short treatment duration (often completed in a few minutes per session)",
      "No residual radiation inside the patient's body after the session"
    ]
  },
  {
    slug: "palliative-radiotherapy",
    title: "Palliative Radiotherapy (Symptom Relief Care)",
    shortDesc: "Compassionate, rapid-acting targeted radiation designed specifically to reduce tumor size, relieve pain, and improve the quality of life.",
    fullDesc: `
      <p>Palliative radiotherapy is the use of radiation therapy in patients with advanced, incurable cancers to relieve pain, stop bleeding, shrink tumors causing blockages, and improve overall quality of life.</p>
      
      <h3>Symptom Relief & Pain Control</h3>
      <p>One of the most common applications of palliative radiation is for bone metastases. Cancer that spreads to the bones can cause severe, debilitating pain. A short course of targeted radiation (often just 1 to 5 sessions) can significantly reduce or completely eliminate pain in up to 75% of patients, reducing the need for strong narcotic pain medications.</p>
      
      <h3>Shrinking Tumors to Relieve Pressure</h3>
      <p>Palliative radiation is also highly effective at relieving spinal cord compression (which can cause paralysis if left untreated), resolving superior vena cava syndrome (where a chest tumor blocks blood flow to the head), and shrinking tumors in the lung that are causing severe shortness of breath or persistent coughing up of blood.</p>
    `,
    technology: "3D-CRT or VMAT planning, Rapid palliative simulation workflows",
    sessions: "1 to 10 fractions (completed in 1 to 2 weeks)",
    clinicalIndications: [
      "Painful Bone Metastases",
      "Spinal Cord Compression",
      "Superior Vena Cava (SVC) Syndrome",
      "Hemoptysis or airway obstruction from lung tumors",
      "Bleeding from gynecological or bladder cancers"
    ],
    benefits: [
      "Rapid and long-lasting relief from severe cancer pain",
      "Improves daily physical functioning and overall quality of life",
      "Short, highly convenient treatment courses",
      "Very low incidence of side effects due to localized, moderate dosing"
    ]
  }
];
