export interface Article {
  id: string;
  slug: string;
  title: { en: string; hi: string; gu: string };
  summary: { en: string; hi: string; gu: string };
  content: { en: string; hi: string; gu: string };
  category: "heart" | "diabetes" | "cancer" | "women" | "child" | "nutrition" | "mental" | "preventive";
  readTime: number; // in minutes
  image: string;
  trending?: boolean;
}

export const categories = {
  heart: { en: "Heart Health", hi: "हृदय स्वास्थ्य", gu: "હૃદય સ્વાસ્થ્ય" },
  diabetes: { en: "Diabetes", hi: "मधुमेह (डायबिटीज)", gu: "મધુપ્રમેહ (ડાયાબિટીસ)" },
  cancer: { en: "Cancer Awareness", hi: "कैंसर जागरूकता", gu: "કેન્સર જાગૃતિ" },
  women: { en: "Women's Health", hi: "महिला स्वास्थ्य", gu: "મહિલા સ્વાસ્થ્ય" },
  child: { en: "Child Care", hi: "बाल संगોપન", gu: "બાળ ઉછેર અને સંભાળ" },
  nutrition: { en: "Nutrition & Diet", hi: "पोषण और आहार", gu: "પોષણ અને આહાર" },
  mental: { en: "Mental Wellness", hi: "मानसिक कल्याण", gu: "માનસિક સુખાકારી" },
  preventive: { en: "Preventive Care", hi: "निवारક देखभाल", gu: "રોગ અટકાવવાના ઉપાયો" },
};

export const educationArticles: Article[] = [
  {
    id: "art-1",
    slug: "preventing-heart-disease",
    category: "heart",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
    trending: true,
    title: {
      en: "Protecting Your Heart: Essential Daily Habits",
      hi: "अपने दिल की सुरक्षा: आवश्यक दैनिक आदतें",
      gu: "તમારા હૃદયની સુરક્ષા: આવશ્યક દૈનિક આદતો"
    },
    summary: {
      en: "Simple, evidence-based lifestyle choices to keep your cardiovascular system strong and healthy.",
      hi: "आपके हृदय प्रणाली को मजबूत और स्वस्थ रखने के लिए सरल, साक्ष्य-आधारित जीवन शैली विकल्प।",
      gu: "તમારી કાર્ડિયોવાસ્ક્યુલર સિસ્ટમને મજબૂત અને સ્વસ્થ રાખવા માટે સરળ અને વૈજ્ઞાનિક જીવનશૈલીની પસંદગીઓ."
    },
    content: {
      en: `<h3>Introduction</h3><p>Heart disease remains one of the leading causes of health issues worldwide. Fortunately, most cardiovascular diseases are preventable through active daily habits.</p><h3>1. Regular Cardio Exercise</h3><p>Aim for at least 30 minutes of moderate activity, like brisk walking or cycling, five days a week. This strengthens the heart muscle and improves circulation.</p><h3>2. A Heart-Healthy Diet</h3><p>Incorporate colorful vegetables, whole grains, nuts, and healthy fats (like olive oil). Reduce salt, refined sugars, and trans fats.</p><h3>3. Stress Management</h3><p>Chronic stress increases blood pressure. Practicing mindfulness, deep breathing, or yoga helps regulate cortisol levels and protect the heart.</p>`,
      hi: `<h3>प्रस्तावना</h3><p>हृदय रोग दुनिया भर में स्वास्थ्य समस्याओं के प्रमुख कारणों में से एक है। सौभाग्य से, अधिकांश हृदय रोग दैनिक आदतों के माध्यम से रोके जा सकते हैं।</p><h3>1. नियमित हृदय व्यायाम</h3><p>सप्ताह में पांच दिन कम से कम 30 मिनट मध्यम गतिविधि जैसे तेज चलना या साइकिल चलाना का लक्ष्य रखें। यह हृदय की मांसपेशियों को मजबूत करता है।</p><h3>2. हृदय-स्वस्थ आहार</h3><p>रंगीन सब्जियां, साबुत अनाज, नट्स और स्वस्थ वसा (जैसे जैतून का तेल) शामिल करें। नमक और चीनी कम करें।</p><h3>3. तनाव प्रबंधन</h3><p>दीर्घकालिक तनाव रक्तचाप बढ़ाता है। ध्यान, गहरी सांस लेना या योग कोर्टिसोल के स्तर को नियंत्रित करने में मदद करता है।</p>`,
      gu: `<h3>પ્રસ્તાવના</h3><p>હૃદય રોગ વિશ્વભરમાં આરોગ્ય સમસ્યાઓનું મુખ્ય કારણ છે. સદભાગ્યે, દૈનિક સક્રિય આદતો દ્વારા મોટાભાગના હૃદય રોગોને અટકાવી શકાય છે.</p><h3>1. નિયમિત કસરત</h3><p>અઠવાડિયામાં પાંચ દિવસ ઓછામાં ઓછી ૩૦ મિનિટ ઝડપી ચાલવું અથવા સાઇકલિંગ જેવી મધ્યમ પ્રવૃત્તિ કરો. આનાથી હૃદયના સ્નાયુઓ મજબૂત થાય છે.</p><h3>2. હૃદય માટે તંદુરસ્ત આહાર</h3><p>શાકભાજી, આખા અનાજ, સૂકો મેવો અને તંદુરસ્ત ચરબી (જેમ કે ઓલિવ ઓઇલ) નો આહારમાં સમાવેશ કરો. મીઠું અને ખાંડનું પ્રમાણ ઘટાડો.</p><h3>3. તણાવ મુક્તિ</h3><p>વધુ પડતો તણાવ બ્લડ પ્રેશર વધારે છે. ધ્યાન અથવા યોગ કરવાથી હૃદય સુરક્ષિત રહે છે.</p>`
    }
  },
  {
    id: "art-2",
    slug: "managing-diabetes-naturally",
    category: "diabetes",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=600&auto=format&fit=crop",
    trending: true,
    title: {
      en: "Understanding & Managing Blood Sugar Levels",
      hi: "ब्लड शुगर के स्तर को समझना और प्रबंधित करना",
      gu: "બ્લડ શુગરના સ્તરને સમજવું અને નિયંત્રિત કરવું"
    },
    summary: {
      en: "A patient's guide to maintaining stable glucose levels through nutrition, exercise, and hydration.",
      hi: "पोषण, व्यायाम और हाइड्रेशन के माध्यम से ग्लूकोज के स्तर को स्थिर बनाए रखने के लिए एक गाइड।",
      gu: "યોગ્ય પોષણ, કસરત અને હાઇડ્રેશન દ્વારા ગ્લુકોઝના સ્તરને નિયંત્રણમાં રાખવા માટેની માર્ગદર્શિકા."
    },
    content: {
      en: `<h3>Understanding Glucose</h3><p>Diabetes occurs when the body either cannot produce enough insulin or cannot effectively use it. Stable glucose is key to long-term health.</p><h3>1. Monitor Carbohydrate Intake</h3><p>Carbohydrates directly impact blood sugar. Focus on complex carbohydrates (like oats, quinoa, and vegetables) rather than simple carbohydrates.</p><h3>2. Stay Hydrated</h3><p>Drinking plenty of water helps your kidneys flush out excess sugar through urine, reducing overall blood glucose levels naturally.</p><h3>3. Regular Physical Activity</h3><p>Exercise increases insulin sensitivity, meaning your cells can better utilize available sugar in your bloodstream.</p>`,
      hi: `<h3>ग्लूकोज को समझना</h3><p>मधुमेह तब होता है जब शरीर या तो पर्याप्त इंसुलिन का उत्पादन नहीं कर पाता है या इसका प्रभावी ढंग से उपयोग नहीं कर पाता है।</p><h3>1. कार्बोहाइड्रेट सेवन पर नजर रखें</h3><p>जटिल कार्बोहाइड्रेट (जैसे जई, क्विनोआ और सब्जियां) पर ध्यान केंद्रित करें न कि रिफाइंड कार्ब्स पर।</p><h3>2. पर्याप्त पानी पिएं</h3><p>खूब पानी पीने से गुर्दे को मूत्र के माध्यम से अतिरिक्त शर्करा बाहर निकालने में मदद मिलती है।</p><h3>3. नियमित शारीरिक गतिविधि</h3><p>व्यायाम इंसुलिन संवेदनशीलता को बढ़ाता है, जिससे कोशिकाएं रक्त में उपलब्ध शर्करा का बेहतर उपयोग कर पाती हैं।</p>`,
      gu: `<h3>ગ્લુકોઝને સમજવું</h3><p>જ્યારે શરીર પૂરતું ઇન્સ્યુલિન ઉત્પન્ન કરી શકતું નથી અથવા તેનો અસરકારક ઉપયોગ કરી શકતું નથી ત્યારે ડાયાબિટીસ થાય છે.</p><h3>1. કાર્બોહાઇડ્રેટ્સ પર નિયંત્રણ</h3><p>મેંદા અને ખાંડવાળી વસ્તુઓને બદલે ફાઈબર યુક્ત ખોરાક (ઓટ્સ, શાકભાજી) ખાઓ.</p><h3>2. પૂરતું પાણી પીવો</h3><p>વધુ પાણી પીવાથી કિડની વધારાની ખાંડને પેશાબ વાટે બહાર કાઢી નાખે છે.</p><h3>3. રોજિંદી શારીરિક પ્રવૃત્તિ</h3><p>કસરત કરવાથી ઇન્સ્યુલિન કાર્યક્ષમ બને છે અને બ્લડ શુગર જળવાઈ રહે છે.</p>`
    }
  },
  {
    id: "art-3",
    slug: "early-cancer-detection",
    category: "cancer",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop",
    trending: true,
    title: {
      en: "Early Cancer Detection: Warning Signs & Screenings",
      hi: "कैंसर का जल्द पता लगाना: चेतावनी संकेत और स्क्रीनिंग",
      gu: "કેન્સરનું વહેલું નિદાન: ચેતવણીના સંકેતો અને સ્ક્રીનીંગ"
    },
    summary: {
      en: "Recognizing early symptoms and understanding when to schedule screening tests can save lives.",
      hi: "शुरुआती लक्षणों को पहचानना और स्क्रीनिंग टेस्ट कराने के सही समय को समझना जीवन बचा सकता है।",
      gu: "પ્રારંભિક લક્ષણોને ઓળખવા અને સમયસર સ્ક્રીનીંગ ટેસ્ટ કરાવવાથી જીવન બચાવી શકાય છે."
    },
    content: {
      en: `<h3>Why Early Detection Matters</h3><p>When cancer is diagnosed early, treatment is more likely to succeed. Screening tests are designed to detect cancer before symptoms appear.</p><h3>Common Warning Signs</h3><ul><li>Unexplained weight loss of 5kg or more.</li><li>Persistent fatigue that does not improve with rest.</li><li>Changes in skin, such as new moles or changing colors.</li><li>Persistent cough or hoarseness.</li></ul><h3>Key Screenings</h3><p>Discuss routine screenings like mammograms, colonoscopies, and low-dose CT scans with your doctor based on age and family history.</p>`,
      hi: `<h3>जल्द पता लगाना क्यों महत्वपूर्ण है</h3><p>जब कैंसर का जल्द पता चल जाता है, तो उपचार के सफल होने की संभावना अधिक होती है।</p><h3>सामान्य चेतावनी संकेत</h3><ul><li>बिना किसी कारण के 5 किलो या उससे अधिक वजन कम होना।</li><li>लगातार थकान जो आराम करने से ठीक न हो।</li><li>त्वचा में बदलाव, जैसे नए तिल या रंग बदलना।</li><li>लगातार खांसी या आवाज बैठना।</li></ul><h3>मुख्य स्क्रीनिंग</h3><p>उम्र और पारिवारिक इतिहास के आधार पर अपने डॉक्टर से मैमोग्राम और कोलोनोस्कोपी जैसी नियमित स्क्रीनिंग के बारे में चर्चा करें।</p>`,
      gu: `<h3>વહેલું નિદાન શા માટે જરૂરી છે</h3><p>જો કેન્સરનું વહેલું નિદાન થાય તો સારવાર સફળ થવાની સંભાવના ઘણી વધી જાય છે.</p><h3>સામાન્ય લક્ષણો</h3><ul><li>કોઈ કારણ વગર ૫ કિલો કે તેથી વધુ વજન ઘટી જવું.</li><li>આરામ કરવા છતાં પણ સતત અશક્તિ રહેવી.</li><li>ત્વચા પર નવા તલ થવા કે તલના રંગમાં ફેરફાર થવો.</li><li>સતત ખાંસી કે અવાજ બેસી જવો.</li></ul><h3>સ્ક્રીનીંગ ટેસ્ટ</h3><p>ઉંમર અને પારિવારિક ઇતિહાસ મુજબ તમારા ડોક્ટર સાથે મેમોગ્રાફી કે અન્ય ટેસ્ટ વિશે ચર્ચા કરો.</p>`
    }
  },
  {
    id: "art-4",
    slug: "womens-health-milestones",
    category: "women",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
    title: {
      en: "Women's Health Guide: Milestones Across Decades",
      hi: "महिला स्वास्थ्य गाइड: दशकों के दौरान महत्वपूर्ण पड़ाव",
      gu: "મહિલા સ્વાસ્થ્ય માર્ગદર્શિકા: વિવિધ ઉંમરે રાખવાની કાળજી"
    },
    summary: {
      en: "From reproductive health to menopause and bone density, discover health focus areas for every stage of life.",
      hi: "प्रजनन स्वास्थ्य से लेकर रजोनिवृत्ति और हड्डियों के घनत्व तक, जीवन के हर चरण के लिए स्वास्थ्य क्षेत्रों की खोज करें।",
      gu: "પ્રજનન સ્વાસ્થ્યથી લઈને મેનોપોઝ અને હાડકાંની મજબૂતી સુધી, જીવનના દરેક તબક્કે રાખવાની કાળજી."
    },
    content: {
      en: `<h3>Every Stage Matters</h3><p>A woman's body undergoes unique changes throughout life. Tailoring preventive care to your age keeps you active and resilient.</p><h3>Your 20s and 30s</h3><p>Focus on reproductive health, bone mass optimization, and routine cervical screenings (Pap smears).</p><h3>Your 40s and 50s</h3><p>Monitor breast health with mammograms, check blood pressure, and adapt to metabolic changes during perimenopause.</p><h3>Your 60s and Beyond</h3><p>Bone density scans (DEXA) and heart health checks become top priorities to prevent osteoporosis and cardiovascular risk.</p>`,
      hi: `<h3>हर चरण महत्वपूर्ण है</h3><p>एक महिला का शरीर जीवन भर अद्वितीय परिवर्तनों से गुजरता है। उम्र के अनुसार निवारक देखभाल अपनाएं।</p><h3>20 और 30 की उम्र</h3><p>प्रजनन स्वास्थ्य, हड्डियों की मजबूती और नियमित गर्भाशय ग्रीवा स्क्रीनिंग (पैप स्मीयर) पर ध्यान दें।</p><h3>40 और 50 की उम्र</h3><p>मैमोग्राम से स्तनों के स्वास्थ्य की जांच करें, रक्तचाप की निगरानी करें और चयापचय में बदलावों के अनुकूल बनें।</p><h3>60 और उसके बाद</h3><p>ऑस्टियोपोरोसिस को रोकने के लिए अस्थि घनत्व स्कैन (DEXA) और हृदय स्वास्थ्य की जांच सर्वोच्च प्राथमिकता बन जाती है।</p>`,
      gu: `<h3>દરેક તબક્કો મહત્વનો છે</h3><p>મહિલાનું શરીર જીવનભર અનોખા ફેરફારોમાંથી પસાર થાય છે. ઉંમર પ્રમાણે કાળજી રાખવાથી તંદુરસ્તી જળવાય છે.</p><h3>૨૦ અને ૩૦ વર્ષની ઉંમર</h3><p>પ્રજનન સ્વાસ્થ્ય, હાડકાંની મજબૂતાઈ અને નિયમિત પેપ સ્મીયર (ગર્ભાશયની તપાસ) કરાવો.</p><h3>૪૦ અને ૫૦ વર્ષની ઉંમર</h3><p>મેમોગ્રાફી દ્વારા સ્તનની તપાસ, બ્લડ પ્રેશર અને મેનોપોઝ દરમિયાન થતા ફેરફારો પર ધ્યાન આપો.</p><h3>૬૦ વર્ષ પછી</h3><p>હાડકાં નબળા પડતા અટકાવવા ડેક્સા (DEXA) સ્કેન અને હૃદયની તપાસને પ્રાથમિકતા આપો.</p>`
    }
  },
  {
    id: "art-5",
    slug: "childhood-nutrition-basics",
    category: "child",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600&auto=format&fit=crop",
    title: {
      en: "Nurturing Growth: Nutrition Tips for Young Children",
      hi: "विकास का पोषण: छोटे बच्चों के लिए पोषण संबंधी टिप्स",
      gu: "બાળ ઉછેર: નાના બાળકો માટે પોષણની સરળ ટીપ્સ"
    },
    summary: {
      en: "Practical advice on establishing balanced, nutrient-dense meals for healthy cognitive and physical growth.",
      hi: "स्वस्थ संज्ञानात्मक और शारीरिक विकास के लिए संतुलित, पोषक तत्वों से भरपूर भोजन तैयार करने की व्यावहारिक सलाह।",
      gu: "બાળકના શારીરિક અને માનસિક વિકાસ માટે પોષણયુક્ત અને સંતુલિત આહાર પૂરો પાડવાની ટીપ્સ."
    },
    content: {
      en: `<h3>Building Blocks of Health</h3><p>Good nutrition during childhood lays the foundation for lifelong wellbeing. Avoid forcing food; create positive mealtime environments.</p><h3>1. Diverse Plates</h3><p>Include protein (lentils, milk products), whole grains, and a variety of colorful fruits and vegetables to ensure diverse vitamin intake.</p><h3>2. Limit Processed Sugar</h3><p>Avoid sodas, packaged juices, and refined flour snacks. Opt for fresh fruits, curd, or homemade oats cookies.</p><h3>3. Encourage Physical Play</h3><p>Active play stimulates appetite and builds strong motor skills, essential alongside good nutrition.</p>`,
      hi: `<h3>स्वास्थ्य के बुनियादी तत्व</h3><p>बचपन में अच्छा पोषण जीवन भर के कल्याण की नींव रखता है। भोजन के समय सकारात्मक माहौल बनाएं।</p><h3>1. विविध प्लेट</h3><p>विभिन्न विटामिन सुनिश्चित करने के लिए प्रोटीन (दालें, दूध उत्पाद), साबुत अनाज और रंगीन फल-सब्जियां शामिल करें।</p><h3>2. प्रसंस्कृत चीनी को सीमित करें</h3><p>सोडा, डिब्बाबंद जूस और मैदे के स्नैक्स से बचें। ताजे फल या घर के बने स्नैक्स चुनें।</p><h3>3. शारीरिक खेल को बढ़ावा दें</h3><p>सक्रिय खेल भूख बढ़ाता है और हड्डियों के विकास में मदद करता है।</p>`,
      gu: `<h3>તંદુરસ્તીના પાયાના પથ્થર</h3><p>બાળપણમાં મળતું યોગ્ય પોષણ આજીવન તંદુરસ્તીનો પાયો નાખે છે. જમતી વખતે ખુશનુમા વાતાવરણ રાખો.</p><h3>1. વિવિધ આહાર</h3><p>પ્રોટીન (કઠોળ, દૂધ), અનાજ અને તાજા ફળો આપો જેથી પૂરતા પ્રમાણમાં વિટામિન્સ મળી રહે.</p><h3>2. પ્રોસેસ્ડ શુગર ટાળો</h3><p>પેકેટવાળા જ્યુસ, કોલ્ડ્રિંક્સ અને મેંદાની વસ્તુઓ આપવાનું ટાળો. તેના બદલે તાજા ફળો આપો.</p><h3>3. રમવાની ટેવ પાડો</h3><p>બાળક જેટલું રમશે તેટલી ભૂખ સારી લાગશે અને હાડકાં પણ મજબૂત થશે.</p>`
    }
  },
  {
    id: "art-6",
    slug: "nutrition-diet-myths",
    category: "nutrition",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop",
    title: {
      en: "Fact vs. Fiction: Popular Diet & Nutrition Myths",
      hi: "तथ्य बनाम कल्पना: लोकप्रिय आहार और पोषण संबंधी मिथक",
      gu: "તથ્ય કે ભ્રમણા: આહાર અને પોષણ સંબંધિત ખોટી માન્યતાઓ"
    },
    summary: {
      en: "Debunking common misconceptions about weight loss, carbs, fats, and organic foods using science.",
      hi: "विज्ञान का उपयोग करके वजन घटाने, कार्ब्स, वसा और जैविक खाद्य पदार्थों के बारे में सामान्य गलतफहमियों को दूर करना।",
      gu: "વજન ઘટાડવા, ચરબી, કાર્બોહાઇડ્રેટ્સ અને ઓર્ગેનિક ખોરાક વિશેની સમાજમાં પ્રવર્તતી ગેરસમજોનું વિજ્ઞાન આધારિત ખંડન."
    },
    content: {
      en: `<h3>Science-Based Eating</h3><p>Diet trends come and go, but baseline biochemistry remains the same. Let's look at clinical evidence behind nutrition.</p><h3>Myth 1: Carbohydrates Make You Gain Weight</h3><p>Fact: Excess calories cause weight gain, not carbohydrates. Complex carbs like fiber-rich grains are vital energy sources.</p><h3>Myth 2: All Fats Are Bad</h3><p>Fact: Healthy fats (avocados, seeds, nuts) protect your organs and assist in vitamin absorption. Only trans fats should be avoided.</p><h3>Myth 3: Skipping Meals Helps Lose Weight</h3><p>Fact: Skipping meals can slow down metabolism and lead to overeating later. Balanced portion control is much more effective.</p>`,
      hi: `<h3>विज्ञान आधारित खान-पान</h3><p>आहार के रुझान आते-जाते रहते हैं, लेकिन बुनियादी जैव रसायन वही रहता है। आइए विज्ञान को समझें।</p><h3>मिथक 1: कार्बोहाइड्रेट से वजन बढ़ता है</h3><p>तथ्य: वजन कैलोरी की अधिकता से बढ़ता है, कार्बोहाइड्रेट से नहीं। जटिल कार्ब्स ऊर्जा के महत्वपूर्ण स्रोत हैं।</p><h3>मिथक 2: सभी वसा खराब हैं</h3><p>तथ्य: स्वस्थ वसा (अखरोट, बीज) अंगों की रक्षा करते हैं। केवल ट्रांस वसा से बचना चाहिए।</p><h3>मिथक 3: भोजन छोड़ने से वजन कम होता है</h3><p>तथ्य: भोजन छोड़ने से चयापचय धीमा हो सकता है और बाद में अधिक खाने की आदत पड़ सकती है।</p>`,
      gu: `<h3>વિજ્ઞાન આધારિત આહાર</h3><p>ઘણા પ્રકારના ડાયેટ પ્લાન આવે છે અને જાય છે, પણ શરીરનું વિજ્ઞાન સમાન રહે છે.</p><h3>ગેરસમજ ૧: કાર્બોહાઇડ્રેટ્સથી વજન વધે છે</h3><p>હકીકત: વજન વધુ પડતી કેલરીથી વધે છે, કાર્બોહાઇડ્રેટ્સથી નહીં. શાકભાજી કે અનાજમાંથી મળતા કાર્બ્સ શક્તિનો મુખ્ય સ્ત્રોત છે.</p><h3>ગેરસમજ ૨: બધી ચરબી નુકસાન કરે છે</h3><p>હકીકત: અખરોટ, તેલીબિયાં વગેરેમાંથી મળતી ગુણકારી ચરબી વિટામિન્સ પચાવવામાં મદદ કરે છે.</p><h3>ગેરસમજ ૩: જમવાનું છોડી દેવાથી વજન ઘટે છે</h3><p>હકીકત: ભૂખ્યા રહેવાથી મેટાબોલિઝમ ધીમું પડે છે અને પછીથી વધારે ખવાઈ જાય છે. આહારનું પ્રમાણ જાળવવું વધુ અસરકારક છે.</p>`
    }
  },
  {
    id: "art-7",
    slug: "managing-anxiety-daily",
    category: "mental",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600&auto=format&fit=crop",
    title: {
      en: "Mind Matters: Simple Exercises to Relieve Stress & Anxiety",
      hi: "मन की बात: तनाव और चिंता दूर करने के सरल उपाय",
      gu: "મનની શાંતિ: તણાવ અને ચિંતા મુક્તિના સરળ ઉપાયો"
    },
    summary: {
      en: "Practical techniques like the 5-4-3-2-1 method, journaling, and deep box breathing for mental wellness.",
      hi: "मानसिक कल्याण के लिए 5-4-3-2-1 विधि, जर्नलिंग और गहरी सांस लेने जैसी व्यावहारिक तकनीकें।",
      gu: "માનસિક સુખાકારી માટે ડાયરી લખવી, ઊંડા શ્વાસ લેવા અને 5-4-3-2-1 જેવી પ્રાયોગિક પદ્ધતિઓ."
    },
    content: {
      en: `<h3>Mental Fitness</h3><p>Mental health is just as important as physical health. Incorporating small stress relief habits into your routine can prevent burnout.</p><h3>1. The 5-4-3-2-1 Grounding Method</h3><p>Acknowledge 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This brings your focus back to the present.</p><h3>2. Deep Box Breathing</h3><p>Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold for 4 seconds. This instantly calms the nervous system.</p><h3>3. Establish Screen-Free Boundaries</h3><p>Avoid checking emails or social media for the first 30 minutes of the morning and the last 30 minutes before sleep.</p>`,
      hi: `<h3>मानसिक फिटनेस</h3><p>मानसिक स्वास्थ्य उतना ही महत्वपूर्ण है जितना कि शारीरिक स्वास्थ्य। दैनिक दिनचर्या में छोटे बदलाव तनाव को रोक सकते हैं।</p><h3>1. 5-4-3-2-1 ग्राउंडिंग विधि</h3><p>5 चीजें जिन्हें आप देख सकते हैं, 4 जिन्हें छू सकते हैं, 3 जिन्हें सुन सकते हैं, 2 जिन्हें सूंघ सकते हैं, और 1 जिसे चख सकते हैं, उन्हें महसूस करें।</p><h3>2. बॉक्स ब्रीदिंग</h3><p>4 सेकंड तक सांस लें, 4 सेकंड रोकें, 4 सेकंड छोड़ें, और 4 सेकंड रुकें। यह तंत्रिका तंत्र को शांत करता है।</p><h3>3. स्क्रीन-मुक्त सीमाएं</h3><p>सुबह जागने के बाद और सोने से पहले के 30 मिनट में मोबाइल फोन से दूर रहें।</p>`,
      gu: `<h3>માનસિક સ્વસ્થતા</h3><p>શારીરિક તંદુરસ્તી જેટલી જ માનસિક તંદુરસ્તી પણ જરૂરી છે. દિવસ દરમિયાન નાની આદતો બદલવાથી શાંતિ મળે છે.</p><h3>1. 5-4-3-2-1 ગ્રાઉન્ડિંગ રીત</h3><p>તમારી આસપાસ જોયેલી ૫ વસ્તુઓ, અડી શકાય તેવી ૪ વસ્તુઓ, સાંભળી શકાય તેવા ૩ અવાજ, સુંઘી શકાય તેવી ૨ ગંધ અને ૧ સ્વાદને મહેસુસ કરો.</p><h3>2. ઊંડા શ્વાસ લેવાની કસરત (બોક્સ બ્રીધિંગ)</h3><p>૪ સેકન્ડ શ્વાસ લો, ૪ સેકન્ડ રોકો, ૪ સેકન્ડ શ્વાસ બહાર કાઢો અને ૪ સેકન્ડ રોકો. આનાથી મગજ શાંત થાય છે.</p><h3>3. સ્ક્રીન ટાઈમ ઓછો કરો</h3><p>સવારે ઉઠ્યા પછી અને રાત્રે સુતા પહેલા ૩૦ મિનિટ ફોન કે ટીવીથી દૂર રહો.</p>`
    }
  },
  {
    id: "art-8",
    slug: "preventive-healthcare-benefits",
    category: "preventive",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
    title: {
      en: "An Ounce of Prevention: Why Annual Checkups Matter",
      hi: "बचाव का महत्व: वार्षिक स्वास्थ्य जांच क्यों आवश्यक है",
      gu: "પૂર્વાવલોકન: વાર્ષિક મેડિકલ ચેક-અપ શા માટે જરૂરી છે"
    },
    summary: {
      en: "Regular physicals, lab tests, and baseline blood counts help identify asymptomatic issues early.",
      hi: "नियमित शारीरिक जांच, लैब परीक्षण और रक्त गणना बिना लक्षणों वाली समस्याओं का शीघ्र पता लगाने में मदद करते हैं।",
      gu: "નિયમિત લેબોરેટરી ટેસ્ટ અને શારીરિક તપાસ દ્વારા કોઈ પણ રોગને તેના પ્રારંભિક તબક્કે જ ઓળખી શકાય છે."
    },
    content: {
      en: `<h3>Preventive Medicine</h3><p>The goal of preventive care is to catch potential health problems before they evolve into chronic conditions or medical emergencies.</p><h3>1. Essential Annual Tests</h3><p>Complete Blood Count (CBC), lipid profile (cholesterol), HbA1c (blood sugar average), and kidney/liver panels.</p><h3>2. Early Warning Sign Audits</h3><p>Checking blood pressure and body mass index (BMI) provides instant data on cardiovascular risk and metabolic balance.</p><h3>3. Vaccination Updates</h3><p>Ensuring flu shots, tetanus boosters, and other age-specific vaccines are up to date helps shield your immune system.</p>`,
      hi: `<h3>निवारक चिकित्सा</h3><p>निवारक देखभाल का उद्देश्य संभावित स्वास्थ्य समस्याओं को गंभीर या पुरानी बीमारी बनने से पहले ही पकड़ना है।</p><h3>1. आवश्यक वार्षिक परीक्षण</h3><p>कम्प्लीट ब्लड काउंट (CBC), लिपिड प्रोफाइल (कोलेस्ट्रॉल), HbA1c (औसत ब्लड शुगर) और किडनी/लिवर फंक्शन टेस्ट।</p><h3>2. रक्तचाप की निगरानी</h3><p>नियमित रूप से रक्तचाप की जांच करने से हृदय स्वास्थ्य की स्थिति का तुरंत पता चलता है।</p><h3>3. टीकाकरण</h3><p>फ्लू शॉट और टिटनेस बूस्टर जैसे टीकों को समय पर लेना आपकी प्रतिरक्षा प्रणाली को सुरक्षित रखता है।</p>`,
      gu: `<h3>રોગ અટકાવવાના ઉપાયો</h3><p>પ્રિવેન્ટિવ કેરનો મુખ્ય હેતુ રોગ ગંભીર બને તે પહેલા જ તેને ઓળખીને દૂર કરવાનો છે.</p><h3>1. દર વર્ષે કરાવવાના જરૂરી રિપોર્ટ</h3><p>સીબીસી (CBC), કોલેસ્ટ્રોલ (Lipid Profile), એચબીએવનસી (HbA1c) અને લીવર/કિડનીના રિપોર્ટ.</p><h3>2. બ્લડ પ્રેશર મોનિટરિંગ</h3><p>સમય-સમય પર બ્લડ પ્રેશરની તપાસ કરાવવાથી હૃદય સંબંધિત જોખમો ટાળી શકાય છે.</p><h3>3. રસીકરણ</h3><p>ફ્લૂ વેક્સિન અથવા ધનુર (Tetanus) ના ઇન્જેક્શન સમયસર લેવાથી રોગપ્રતિકારક શક્તિ જળવાય છે.</p>`
    }
  }
];
