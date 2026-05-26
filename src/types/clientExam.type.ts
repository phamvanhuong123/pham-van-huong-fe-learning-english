export interface ClientOption {
  id: string;
  label: string;
  text: string | null;
}

export interface ClientQuestion {
  id: string;
  order: number;
  questionText: string | null;
  part: string;
  options: ClientOption[];
}

export interface ClientPassage {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  order: number;
}

export interface ClientPassageGroup {
  id: string;
  part: string;
  passages: ClientPassage[];
  questions: ClientQuestion[];
}

export interface ClientExamData {
  id: string;
  title: string;
  description: string | null;
  part: string;
  difficulty: string;
  type: string;
  duration: number;
  passageGroups: ClientPassageGroup[];
  questions: ClientQuestion[];
}
