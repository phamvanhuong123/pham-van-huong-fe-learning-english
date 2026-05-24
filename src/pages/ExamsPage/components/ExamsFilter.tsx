import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ExamsFilterProps {
  search: string;
  setSearch: (val: string) => void;
  part: string;
  setPart: (val: string) => void;
  difficulty: string;
  setDifficulty: (val: string) => void;
  onFilter: () => void;
}

export const ExamsFilter: React.FC<ExamsFilterProps> = ({
  search,
  setSearch,
  part,
  setPart,
  difficulty,
  setDifficulty,
  onFilter
}) => {
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onFilter();
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input 
          placeholder="Tìm kiếm đề thi..." 
          className="pl-10 h-12 bg-gray-50 border-gray-200 focus-visible:ring-blue-500 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <Select value={part} onValueChange={setPart}>
          <SelectTrigger className="w-full md:w-[160px] h-12 rounded-xl border-gray-200 bg-gray-50">
            <SelectValue placeholder="Phần thi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả phần thi</SelectItem>
            <SelectItem value="FULL">Full Test</SelectItem>
            <SelectItem value="PART1">Part 1</SelectItem>
            <SelectItem value="PART2">Part 2</SelectItem>
            <SelectItem value="PART3">Part 3</SelectItem>
            <SelectItem value="PART4">Part 4</SelectItem>
            <SelectItem value="PART5">Part 5</SelectItem>
            <SelectItem value="PART6">Part 6</SelectItem>
            <SelectItem value="PART7">Part 7</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full md:w-[160px] h-12 rounded-xl border-gray-200 bg-gray-50">
            <SelectValue placeholder="Độ khó" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Mọi độ khó</SelectItem>
            <SelectItem value="EASY">Dễ</SelectItem>
            <SelectItem value="MEDIUM">Trung bình</SelectItem>
            <SelectItem value="HARD">Khó</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onFilter} className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all">
          Lọc
        </Button>
      </div>
    </div>
  );
};
