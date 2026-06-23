export interface Conference {
  name: string;
  tagline: string;
  description: string;
  date: string;
  location: string;
  organizersDetails: { name: string, affiliation: string }[];
  programBlocks: { startTime: string, endTime: string, title: string }[];
  slug: string;
}