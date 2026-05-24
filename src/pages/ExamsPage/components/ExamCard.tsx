import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export interface Exam {
  id: string;
  title: string;
  description: string;
  part: string;
  difficulty: string;
  type: string;
  duration: number;
}

interface ExamCardProps {
  exam: Exam;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'EASY': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200';
      case 'HARD': return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-blue-100 overflow-hidden flex flex-col bg-white">
      <CardHeader className="pb-3 bg-gradient-to-br from-white to-gray-50/80">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge variant="outline" className="bg-white/80 font-bold tracking-wider text-xs px-2 py-0.5 border-gray-200 shadow-sm text-gray-600">
            {exam.part === 'FULL' ? 'FULL TEST' : exam.part.replace('PART', 'PART ')}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(exam.difficulty)}>
            {exam.difficulty}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-xl font-bold leading-tight text-gray-800 group-hover:text-blue-600 transition-colors">
          {exam.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
          {exam.description || 'Bài thi đánh giá năng lực TOEIC chuẩn format mới. Bài test giúp bạn làm quen cấu trúc đề và đánh giá nhanh năng lực.'}
        </p>
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{exam.duration} phút</span>
          </div>
          {exam.type === 'VIP' && (
            <div className="flex items-center gap-1.5 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
              <span className="text-purple-600 font-bold tracking-wide text-xs">PREMIUM</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-gray-50">
        <Button 
          onClick={() => navigate(`/exams/${exam.id}`)}
          className="w-full bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};
