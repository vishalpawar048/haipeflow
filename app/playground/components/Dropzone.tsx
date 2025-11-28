import React, { useRef } from 'react';
import { Icon } from './Icon';

interface DropzoneProps {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  accept?: string;
  label: string;
  subLabel?: string;
  preview?: string;
  className?: string;
  multiple?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ 
  onFileSelect, 
  onFilesSelect,
  accept = "image/*", 
  label, 
  subLabel, 
  preview,
  className = "",
  multiple = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple && onFilesSelect) {
        onFilesSelect(Array.from(e.target.files));
      } else if (onFileSelect) {
        onFileSelect(e.target.files[0]);
      }
    }
    // Reset input so same file can be selected again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-4 transition-all hover:border-blue-500 hover:bg-blue-50 ${className}`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative w-full h-32 flex items-center justify-center rounded-lg bg-slate-50 overflow-hidden">
           <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
             <Icon name="RefreshCw" className="text-white w-6 h-6" />
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Icon name="UploadCloud" className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500" />
          <p className="text-sm font-medium text-slate-700">{label}</p>
          {subLabel && <p className="text-xs text-slate-500 mt-1">{subLabel}</p>}
        </div>
      )}
    </div>
  );
};

