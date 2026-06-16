import React from "react";
import NextImage from "next/image";
import { Upload, Plus, Copy, ExternalLink, Trash2 } from "lucide-react";

interface GalleryPhoto {
  filename: string;
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

interface GalleryTabProps {
  photos: GalleryPhoto[];
  uploading: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeletePhoto: (filename: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export default function GalleryTab({
  photos,
  uploading,
  handlePhotoUpload,
  handleDeletePhoto,
  showToast,
}: GalleryTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Media Gallery</h1>
        <p className="text-slate-600 mt-1">Upload and store clinical photos, team assets, and article covers. Copy their URLs to paste in content fields.</p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Upload size={18} className="text-brand-teal" />
          <span>Upload New Asset</span>
        </h3>
        
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-50/50 transition-colors relative cursor-pointer group">
          <input 
            type="file" 
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
              <p className="text-sm font-bold text-brand-teal">Saving file to uploads folder...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-brand-teal border border-teal-100 group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <p className="text-sm font-bold text-slate-800">Click to select photo or drag it here</p>
              <p className="text-xs text-slate-400">Supports PNG, JPG, JPEG, WEBP and SVG.</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div key={photo.filename} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="relative h-40 bg-slate-100 flex items-center justify-center">
              <img 
                src={photo.url} 
                alt={photo.filename} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(photo.url);
                    showToast("Copied photo URL to clipboard!");
                  }}
                  className="p-2 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform"
                  title="Copy relative URL"
                >
                  <Copy size={16} />
                </button>
                <a 
                  href={photo.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform"
                  title="View photo"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <p className="text-slate-800 text-xs font-bold truncate" title={photo.filename}>
                {photo.filename.replace(/^\d+_\d*_/, "")}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-slate-400 font-semibold">
                  {(photo.sizeBytes / 1024).toFixed(1)} KB
                </span>
                <button 
                  onClick={() => handleDeletePhoto(photo.filename)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Delete permanently"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-4 bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
            No photos uploaded yet. Upload your first photo above!
          </div>
        )}
      </div>
    </div>
  );
}
