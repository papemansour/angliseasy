import { create } from 'zustand';

export interface ExternalLink {
  id: string;
  levelId: string;
  title: string;
  url: string;
  description: string;
  addedAt: string;
}

interface LinkStore {
  links: { [levelId: string]: ExternalLink[] };
  addLink: (levelId: string, link: ExternalLink) => void;
  deleteLink: (levelId: string, linkId: string) => void;
  getLinks: (levelId: string) => ExternalLink[];
}

export const useLinkStore = create<LinkStore>((set, get) => ({
  links: {},
  addLink: (levelId: string, link: ExternalLink) => {
    set((state) => ({
      links: {
        ...state.links,
        [levelId]: [...(state.links[levelId] || []), link],
      },
    }));
  },
  deleteLink: (levelId: string, linkId: string) => {
    set((state) => ({
      links: {
        ...state.links,
        [levelId]: state.links[levelId]?.filter(link => link.id !== linkId) || [],
      },
    }));
  },
  getLinks: (levelId: string) => {
    return get().links[levelId] || [];
  },
}));