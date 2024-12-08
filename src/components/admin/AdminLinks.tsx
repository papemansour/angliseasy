import React, { useState } from 'react';
import { Link, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLinkStore, ExternalLink } from '../../store/linkStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AdminLinksProps {
  levelId: string;
  levelName: string;
}

export function AdminLinks({ levelId, levelName }: AdminLinksProps) {
  const [linkInfo, setLinkInfo] = useState({
    title: '',
    url: '',
    description: '',
  });

  const { addLink, deleteLink, getLinks } = useLinkStore();
  const links = getLinks(levelId);

  const handleAddLink = () => {
    if (!linkInfo.title || !linkInfo.url) {
      toast.error('Le titre et l\'URL sont requis');
      return;
    }

    try {
      new URL(linkInfo.url);
    } catch {
      toast.error('URL invalide');
      return;
    }

    const newLink: ExternalLink = {
      id: Math.random().toString(36).substr(2, 9),
      levelId,
      title: linkInfo.title,
      url: linkInfo.url,
      description: linkInfo.description,
      addedAt: new Date().toLocaleString(),
    };

    addLink(levelId, newLink);
    toast.success('Lien ajouté avec succès');
    setLinkInfo({ title: '', url: '', description: '' });
  };

  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold mb-4">Liens externes - {levelName}</h4>
      
      <div className="space-y-4 mb-6">
        <Input
          placeholder="Titre du lien"
          value={linkInfo.title}
          onChange={(e) => setLinkInfo({ ...linkInfo, title: e.target.value })}
        />
        <Input
          placeholder="URL"
          value={linkInfo.url}
          onChange={(e) => setLinkInfo({ ...linkInfo, url: e.target.value })}
        />
        <Input
          placeholder="Description (optionnel)"
          value={linkInfo.description}
          onChange={(e) => setLinkInfo({ ...linkInfo, description: e.target.value })}
        />
        <Button
          onClick={handleAddLink}
          icon={Link}
          disabled={!linkInfo.title || !linkInfo.url}
        >
          Ajouter le lien
        </Button>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium">Liens disponibles ({links.length})</h5>
        <div className="grid gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h6 className="font-medium">{link.title}</h6>
                <p className="text-sm text-gray-600">{link.description}</p>
                <p className="text-xs text-gray-500">
                  Ajouté le {link.addedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Tester le lien"
                >
                  <Link size={18} />
                </a>
                <button
                  onClick={() => {
                    deleteLink(levelId, link.id);
                    toast.success('Lien supprimé avec succès');
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}