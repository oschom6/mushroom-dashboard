import { Link } from 'react-router-dom';

const statusStyles = {
  colonizing: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
  fruiting: 'bg-green-500/20 text-green-300 border-green-400/40',
  harvested: 'bg-slate-500/20 text-slate-200 border-slate-400/40',
  failed: 'bg-red-500/20 text-red-300 border-red-400/40',
};

function GrowCard({ grow }) {
  const totalYield = grow.harvests.reduce((sum, item) => sum + Number(item.weight || 0), 0);

  return (
    <Link
      to={`/grows/${grow.id}`}
      className="rounded-xl border border-forest-800 bg-forest-900 p-5 shadow-card transition hover:-translate-y-0.5 hover:border-moss-400/50"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-cream-100">{grow.name}</h2>
        <span
          className={`rounded-full border px-2 py-1 text-xs font-semibold capitalize ${statusStyles[grow.status] || statusStyles.colonizing}`}
        >
          {grow.status}
        </span>
      </div>
      <div className="space-y-1 text-sm text-cream-200">
        <p>
          <span className="text-cream-100">Species:</span> {grow.species}
        </p>
        <p>
          <span className="text-cream-100">Substrate:</span> {grow.substrate}
        </p>
        <p>
          <span className="text-cream-100">Genetics:</span> {grow.geneticsSource}
        </p>
        <p>
          <span className="text-cream-100">Inoculated:</span> {grow.inoculationDate}
        </p>
        <p className="pt-2 text-base font-semibold text-moss-300">Total Yield: {totalYield} g</p>
      </div>
    </Link>
  );
}

export default GrowCard;
