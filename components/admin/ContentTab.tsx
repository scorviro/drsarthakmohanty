import React from "react";

interface LanguageContent {
  hero: { trusted: string; oncologist: string; description: string };
  about: { desc1: string; desc2: string };
}

interface WebsiteContent {
  translations: {
    [key: string]: LanguageContent;
    en: LanguageContent;
    hi: LanguageContent;
    gu: LanguageContent;
  };
}

interface ContentTabProps {
  contentForm: WebsiteContent;
  setContentForm: React.Dispatch<React.SetStateAction<WebsiteContent>>;
  handleSaveContent: (e: React.FormEvent) => Promise<void>;
}

export default function ContentTab({
  contentForm,
  setContentForm,
  handleSaveContent,
}: ContentTabProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Website Content Manager</h1>
        <p className="text-slate-600 mt-1">Directly edit all landing page text paragraphs and headings in English, Hindi, and Gujarati.</p>
      </div>

      <form onSubmit={handleSaveContent} className="space-y-6">
        {["en", "hi", "gu"].map((lang) => (
          <div key={lang} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 capitalize border-b border-slate-100 pb-3 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
              <span>{lang === "en" ? "English Content" : lang === "hi" ? "Hindi Content (हिंदी)" : "Gujarati Content (ગુજરાતી)"}</span>
            </h3>

            {/* Hero Copy */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Tagline</label>
                <input 
                  type="text"
                  value={contentForm.translations?.[lang]?.hero?.trusted || ""}
                  onChange={(e) => {
                    const updated = { ...contentForm };
                    updated.translations[lang].hero.trusted = e.target.value;
                    setContentForm(updated);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Title</label>
                <input 
                  type="text"
                  value={contentForm.translations?.[lang]?.hero?.oncologist || ""}
                  onChange={(e) => {
                    const updated = { ...contentForm };
                    updated.translations[lang].hero.oncologist = e.target.value;
                    setContentForm(updated);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Description Paragraph</label>
              <textarea 
                rows={3}
                value={contentForm.translations?.[lang]?.hero?.description || ""}
                onChange={(e) => {
                  const updated = { ...contentForm };
                  updated.translations[lang].hero.description = e.target.value;
                  setContentForm(updated);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm leading-relaxed"
              />
            </div>

            {/* About Copy */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Doctor Paragraph 1</label>
              <textarea 
                rows={3}
                value={contentForm.translations?.[lang]?.about?.desc1 || ""}
                onChange={(e) => {
                  const updated = { ...contentForm };
                  updated.translations[lang].about.desc1 = e.target.value;
                  setContentForm(updated);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Doctor Paragraph 2</label>
              <textarea 
                rows={3}
                value={contentForm.translations?.[lang]?.about?.desc2 || ""}
                onChange={(e) => {
                  const updated = { ...contentForm };
                  updated.translations[lang].about.desc2 = e.target.value;
                  setContentForm(updated);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm leading-relaxed"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-brand-teal hover:bg-[#00a892] text-slate-950 font-bold py-3.5 px-10 rounded-2xl tracking-wide transition-all shadow-lg text-sm"
          >
            Save All Paragraph Changes
          </button>
        </div>
      </form>
    </div>
  );
}
