
import React from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { getSocialIcon, socialMediaIcons } from '@/components/icons/SocialMediaIcons';

interface SocialLink {
  platform: string;
  url: string;
}

interface Props {
  socialLinks: SocialLink[];
  setSocialLinks: (links: SocialLink[]) => void;
}

export default function SocialLinksEditor({ socialLinks, setSocialLinks }: Props) {
  const handleAddLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handlePlatformChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].platform = value;
    setSocialLinks(newLinks);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].url = value;
    setSocialLinks(newLinks);
  };

  return (
    <div className="space-y-4">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle block">
        Redes Sociais
      </span>
      {socialLinks.map((link, index) => {
        const Icon = getSocialIcon(link.platform);
        return (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <label className="block">
                <span className="text-xs text-muted-foreground-subtle flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  Plataforma
                </span>
                <select
                  value={link.platform}
                  onChange={e => handlePlatformChange(index, e.target.value)}
                  className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                >
                  <option value="">Selecione uma plataforma</option>
                  {Object.keys(socialMediaIcons).map(platform => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground-subtle">URL</span>
                <input
                  type="text"
                  value={link.url}
                  onChange={e => handleUrlChange(index, e.target.value)}
                  placeholder="https://exemplo.com/perfil"
                  className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <FiTrash className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={handleAddLink}
        className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm hover:border-primary/60 transition-colors"
      >
        <FiPlus className="w-4 h-4" /> Adicionar Link Social
      </button>
    </div>
  );
}
