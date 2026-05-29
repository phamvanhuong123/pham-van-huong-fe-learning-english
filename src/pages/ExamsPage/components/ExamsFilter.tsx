import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';

interface ExamsFilterProps {
  search: string;
  setSearch: (val: string) => void;
  part: string;
  setPart: (val: string) => void;
  difficulty: string;
  setDifficulty: (val: string) => void;
  onFilter: () => void; // Keep for backward compatibility if parent still uses it manually
}

const PARTS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'FULL', label: 'Full Test' },
  { value: 'PART1', label: 'Part 1' },
  { value: 'PART2', label: 'Part 2' },
  { value: 'PART3', label: 'Part 3' },
  { value: 'PART4', label: 'Part 4' },
  { value: 'PART5', label: 'Part 5' },
  { value: 'PART6', label: 'Part 6' },
  { value: 'PART7', label: 'Part 7' },
];

export const ExamsFilter: React.FC<ExamsFilterProps> = ({
  search,
  setSearch,
  part,
  setPart,
  difficulty,
  setDifficulty,
  onFilter
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [debouncedSearch] = useDebounce(localSearch, 500);

  // Auto trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
      onFilter();
    }
  }, [debouncedSearch, search, setSearch, onFilter]);

  // Handle direct parts/difficulty clicks auto triggering filter in parent due to useEffect there, 
  // but we can also manually call onFilter if needed. Parent already has useEffect for part/difficulty.

  return (
    <div className="mb-8 space-y-6">
      {/* Top row: Search and Difficulty */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 text-slate-400 h-5 w-5" />
          <Input 
            placeholder="Tìm kiếm đề thi..." 
            className="pl-12 h-12 bg-transparent border-none shadow-none focus-visible:ring-0 text-base"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
        
        <div className="w-full md:w-auto px-2 pb-2 md:pb-0">
          <Select 
            value={difficulty} 
            onValueChange={(val) => {
              setDifficulty(val);
              // Give state time to update in parent, parent's useEffect will catch it
            }}
          >
            <SelectTrigger className="w-full md:w-[180px] h-10 border-none bg-slate-50/50 hover:bg-slate-100 focus:ring-0 font-medium">
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-slate-100">
              <SelectItem value="ALL">Mọi độ khó</SelectItem>
              <SelectItem value="EASY">Dễ</SelectItem>
              <SelectItem value="MEDIUM">Trung bình</SelectItem>
              <SelectItem value="HARD">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bottom row: Parts (Pills) */}
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide gap-2 mask-linear-fade">
        {PARTS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPart(p.value)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              part === p.value 
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
