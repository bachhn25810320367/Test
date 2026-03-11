import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  label: string;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, label, accept = "image/*" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="w-full border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
    >
      <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Upload className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400" />
      </div>
      <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200">{label}</span>
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        accept={accept} 
        className="hidden" 
      />
    </div>
  );
};
