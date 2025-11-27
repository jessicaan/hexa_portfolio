const sections = [
  { id: 'about', title: 'About', description: 'Narrativa pessoal, manifesto e CTA inicial.' },
  { id: 'skills', title: 'Skills', description: 'Stacks, ferramentas e proficiência.' },
  { id: 'projects', title: 'Projects', description: 'Cases detalhados com mídia e links.' },
  { id: 'experience', title: 'Experience', description: 'Linha do tempo profissional e conquistas.' },
  { id: 'education', title: 'Education', description: 'Formações, certificações e highlights.' },
  { id: 'contact', title: 'Contact', description: 'Links diretos, email e social hubs.' },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border-subtle/70 bg-surface-soft/70 p-5 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Sessão segura</p>
        <h2 className="text-2xl font-semibold text-foreground mt-2">CMS do portfólio</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Você está autenticada. Gere e atualize seções, cards e media do seu portfólio imersivo.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground-subtle">Sessão</p>
            <p className="text-sm text-foreground">Persistência local habilitada</p>
          </div>
          <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground-subtle">Proteção</p>
            <p className="text-sm text-foreground">Rotas bloqueadas para visitantes</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(section => (
          <div
            key={section.id}
            className="relative overflow-hidden rounded-2xl border border-border-subtle/70 bg-surface/70 p-5 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground-subtle">
                {section.title}
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-1">{section.description}</h3>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-foreground hover:border-primary/60 hover:text-foreground transition-colors"
              >
                Abrir seção
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
