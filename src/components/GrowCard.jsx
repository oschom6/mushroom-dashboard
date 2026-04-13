import { useNavigate } from 'react-router-dom';

const statusStyles = {
  Growing: 'bg-green-500/20 text-green-300 border-green-400/40',
  Harvested: 'bg-slate-500/20 text-slate-200 border-slate-400/40',
  Contaminated: 'bg-red-500/20 text-red-300 border-red-400/40',
};

function GrowCard({ grow, onEdit }) {
  const navigate = useNavigate();
  const totalYield = grow.harvests.reduce((sum, item) => sum + Number(item.weight || 0), 0);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/grows/${grow.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') navigate(`/grows/${grow.id}`);
      }}
      className="rounded-xl border border-forest-800 bg-forest-900 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-moss-400/50"
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-cream-100">{grow.name}</h2>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[grow.status] || statusStyles.Growing}`}>
            {grow.status}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(grow);
            }}
            className="rounded border border-earth-300/60 bg-forest-800/90 px-2 py-1 text-xs text-earth-300 hover:bg-forest-700"
          >
            Edit
          </button>
        </div>
      </div>
      <div className="space-y-1 text-sm text-cream-200">
        <p>
          <span className="text-cream-100">Species:</span> {grow.species}
        </p>
        <p>
          <span className="text-cream-100">Substrate:</span> {grow.substrate}
        </p>
        <p>
          <span className="text-cream-100">Grain Type:</span> {grow.grainType || '—'}
        </p>
        <p>
          <span className="text-cream-100">Genetics:</span> {grow.geneticsSource}
        </p>
        <p>
          <span className="text-cream-100">Inoculated:</span> {grow.inoculationDate}
        </p>
        <p>
          <span className="text-cream-100">Spawn to Bulk:</span> {grow.spawnToBulkDate || '—'}
        </p>
        <p className="pt-2 text-base font-semibold text-moss-300">Total Yield: {totalYield} g</p>
      </div>
    </article>
  );
}

export default GrowCard;
