import React from "react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ImageIcon, Edit, Trash2, X } from "lucide-react";

interface Article {
  id: string;
  slug?: string;
  title?: { [key: string]: string | undefined; en?: string; hi?: string; gu?: string };
  summary?: { [key: string]: string | undefined; en?: string; hi?: string; gu?: string };
  content?: { [key: string]: string | undefined; en?: string; hi?: string; gu?: string };
  category: string;
  readTime: number;
  image: string;
  trending: boolean;
}

interface ArticlesTabProps {
  articles: Article[];
  isArticleModalOpen: boolean;
  setIsArticleModalOpen: (open: boolean) => void;
  editingArticle: Article | null;
  articleForm: Article;
  setArticleForm: React.Dispatch<React.SetStateAction<Article>>;
  handleSaveArticle: (e: React.FormEvent) => Promise<void>;
  handleDeleteArticle: (id: string) => Promise<void>;
  openAddArticle: () => void;
  openEditArticle: (art: Article) => void;
}

export default function ArticlesTab({
  articles,
  isArticleModalOpen,
  setIsArticleModalOpen,
  editingArticle,
  articleForm,
  setArticleForm,
  handleSaveArticle,
  handleDeleteArticle,
  openAddArticle,
  openEditArticle,
}: ArticlesTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Education</h1>
          <p className="text-slate-600 mt-1">Publish oncology research, awareness guides, and healthy living articles.</p>
        </div>
        <button 
          onClick={openAddArticle}
          className="bg-brand-teal hover:bg-[#00a892] text-slate-950 font-bold py-3 px-5 rounded-2xl flex items-center space-x-2 transition-all shadow-md text-sm"
        >
          <Plus size={18} />
          <span>Publish Article</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div key={art.id} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-44 bg-gradient-to-br from-brand-teal/15 to-slate-900 flex items-center justify-center overflow-hidden">
              <ImageIcon className="text-brand-teal/20 absolute" size={36} />
              <img 
                src={art.image} 
                alt={art.title?.en || "Article Cover"} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border border-white/10 z-10">
                {art.category}
              </span>
              {art.trending && (
                <span className="absolute top-4 right-4 bg-brand-teal text-slate-950 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full z-10">
                  Trending
                </span>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 text-xs font-bold block mb-1">{art.readTime} min read</span>
                <h4 className="font-extrabold text-slate-900 text-base line-clamp-2 leading-snug mb-2">
                  {art.title?.en || "Untitled Article"}
                </h4>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                  {art.summary?.en}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
                <button 
                  onClick={() => openEditArticle(art)}
                  className="text-xs font-bold text-brand-teal hover:underline flex items-center space-x-1"
                >
                  <Edit size={14} />
                  <span>Edit Content</span>
                </button>
                <button 
                  onClick={() => handleDeleteArticle(art.id)}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center space-x-1"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="col-span-3 bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
            No articles published yet. Click the publish button to add one!
          </div>
        )}
      </div>

      {/* ARTICLE WRITER MODAL */}
      <AnimatePresence>
        {isArticleModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center pb-6 border-b border-slate-150 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {editingArticle ? "Edit Patient Education Article" : "Publish New Education Article"}
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Write once, publish in English, Hindi, and Gujarati automatically.</p>
                </div>
                <button 
                  onClick={() => setIsArticleModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-6">
                {/* Meta information */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Category</label>
                    <select
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-xs font-semibold"
                    >
                      <option value="heart">Heart Health</option>
                      <option value="diabetes">Diabetes</option>
                      <option value="cancer">Cancer Awareness</option>
                      <option value="women">Women's Health</option>
                      <option value="child">Child Care</option>
                      <option value="nutrition">Nutrition & Diet</option>
                      <option value="mental">Mental Wellness</option>
                      <option value="preventive">Preventive Care</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Read Time (minutes)</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={60}
                      value={articleForm.readTime}
                      onChange={(e) => setArticleForm({ ...articleForm, readTime: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-600">Cover Image URL (e.g. from Media Gallery)</label>
                    <input 
                      type="text" 
                      value={articleForm.image}
                      onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                      placeholder="/uploads/your_photo.jpg or external url"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input 
                    type="checkbox" 
                    id="trending"
                    checked={articleForm.trending}
                    onChange={(e) => setArticleForm({ ...articleForm, trending: e.target.checked })}
                    className="w-4 h-4 text-brand-teal border-slate-300 rounded focus:ring-brand-teal"
                  />
                  <label htmlFor="trending" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Feature as Trending Article on Homepage
                  </label>
                </div>

                {/* Language tabs form inputs */}
                <div className="grid md:grid-cols-3 gap-6">
                  {["en", "hi", "gu"].map((lang) => (
                    <div key={lang} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 border-b pb-2 flex justify-between items-center">
                        <span>{lang === "en" ? "English" : lang === "hi" ? "Hindi (हिंदी)" : "Gujarati (ગુજરાતી)"}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                      </h4>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                        <input 
                          type="text"
                          value={articleForm.title?.[lang] || ""}
                          onChange={(e) => {
                            const updated = { ...articleForm };
                            if (!updated.title) updated.title = {};
                            updated.title[lang] = e.target.value;
                            setArticleForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal transition-all text-xs font-semibold"
                          required={lang === "en"}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Short Summary</label>
                        <textarea 
                          rows={2}
                          value={articleForm.summary?.[lang] || ""}
                          onChange={(e) => {
                            const updated = { ...articleForm };
                            if (!updated.summary) updated.summary = {};
                            updated.summary[lang] = e.target.value;
                            setArticleForm(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal transition-all text-xs"
                          required={lang === "en"}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Article Content (HTML allowed)</label>
                        <textarea 
                          rows={8}
                          value={articleForm.content?.[lang] || ""}
                          onChange={(e) => {
                            const updated = { ...articleForm };
                            if (!updated.content) updated.content = {};
                            updated.content[lang] = e.target.value;
                            setArticleForm(updated);
                          }}
                          placeholder="<h3>Heading</h3><p>Your paragraphs here...</p>"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal transition-all text-xs font-mono"
                          required={lang === "en"}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-slate-150">
                  <button 
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-brand-teal hover:bg-[#00a892] text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md"
                  >
                    {editingArticle ? "Save Changes" : "Publish Article"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
