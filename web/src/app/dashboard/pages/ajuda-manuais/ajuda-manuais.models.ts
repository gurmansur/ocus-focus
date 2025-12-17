export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  sections: HelpSection[];
}

export interface HelpSection {
  title: string;
  content: string;
  steps?: string[];
}
