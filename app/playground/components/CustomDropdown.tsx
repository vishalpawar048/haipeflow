import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import * as LucideIcons from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: keyof typeof LucideIcons; 
  rightContent?: React.ReactNode;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: any) => void;
  placeholder?: string;
  triggerIcon?: keyof typeof LucideIcons;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  triggerIcon,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>}
      
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 flex items-center justify-between hover:border-slate-300 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <div className="flex items-center gap-2">
          {triggerIcon && <Icon name={triggerIcon} className="w-4 h-4 text-slate-400" />}
          <span className={!selectedOption ? "text-slate-400" : ""}>
            {selectedOption ? selectedOption.label : (placeholder || "Select...")}
          </span>
        </div>
        <Icon 
          name="ChevronDown" 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div 
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                  value === option.value ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <Icon name={option.icon} className="w-4 h-4 text-slate-400" />}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-slate-900">{option.label}</span>
                    {option.subLabel && <span className="text-[10px] text-slate-500">{option.subLabel}</span>}
                  </div>
                </div>
                
                {option.rightContent && (
                  <div onClick={(e) => e.stopPropagation()}>
                    {option.rightContent}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

