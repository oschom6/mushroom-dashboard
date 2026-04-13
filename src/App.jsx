import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import GrowCard from './components/GrowCard';
import GrowFormModal from './components/GrowFormModal';
import { createId, loadGrows, saveGrows } from './utils/storage';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartPalette = ['#97b86b', '#b58d69', '#7f9e5a', '#8f6f58', '#c2a67f'];

function App() {
  const [grows, setGrows] = useState(() => loadGrows());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrow, setEditingGrow] = useState(null);

  const handleSaveGrow = (formData) => {
    const next = editingGrow
      ? grows.map((grow) =>
          grow.id === editingGrow.id ? { ...grow, ...formData, harvests: editingGrow.harvests || [] } : grow,
        )
      : [...grows, { ...formData, id: createId('grow'), harvests: [] }];

    setGrows(next);
    saveGrows(next);
    setIsModalOpen(false);
    setEditingGrow(null);
  };

  const openAddModal = () => {
    setEditingGrow(null);
    setIsModalOpen(true);
  };

  const openEditModal = (grow) => {
    setEditingGrow(grow);
    setIsModalOpen(true);
  };

  const handleAddHarvest = (growId, harvest) => {
    const next = grows.map((grow) =>
      grow.id === growId ? { ...grow, harvests: [...grow.harvests, { ...harvest, id: createId('harvest') }] } : grow,
    );
    setGrows(next);
    saveGrows(next);
  };

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<GrowsPage grows={grows} onAddGrow={openAddModal} onEditGrow={openEditModal} />}
        />
        <Route path="/grows/:growId" element={<GrowDetailPage grows={grows} onAddHarvest={handleAddHarvest} onEditGrow={openEditModal} />} />
        <Route path="/stats" element={<StatsPage grows={grows} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <GrowFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGrow}
        initialData={editingGrow}
      />
    </Layout>
  );
}

function GrowsPage({ grows, onAddGrow, onEditGrow }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-cream-100">All Grows</h2>
        <button onClick={onAddGrow} className="rounded-md bg-moss-500 px-4 py-2 text-sm font-semibold text-forest-950 hover:bg-moss-400">
          + Add Grow
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grows.map((grow) => (
          <div key={grow.id} className="relative">
            <GrowCard grow={grow} />
            <button
              onClick={() => onEditGrow(grow)}
              className="absolute right-3 top-3 rounded border border-earth-300/60 bg-forest-800/90 px-2 py-1 text-xs text-earth-300 hover:bg-forest-700"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function GrowDetailPage({ grows, onAddHarvest, onEditGrow }) {
  const { growId } = useParams();
  const navigate = useNavigate();
  const grow = grows.find((item) => item.id === growId);
  const [harvestForm, setHarvestForm] = useState({ date: '', weight: '', flush: 1 });

  if (!grow) return <p className="text-cream-200">Grow not found.</p>;

  const totalYield = grow.harvests.reduce((sum, h) => sum + Number(h.weight), 0);
  const perFlush = Object.values(
    grow.harvests.reduce((acc, item) => {
      const key = `Flush ${item.flush}`;
      acc[key] = acc[key] || { flush: key, yield: 0 };
      acc[key].yield += Number(item.weight);
      return acc;
    }, {}),
  );

  const submitHarvest = (event) => {
    event.preventDefault();
    onAddHarvest(grow.id, { date: harvestForm.date, weight: Number(harvestForm.weight), flush: Number(harvestForm.flush) });
    setHarvestForm({ date: '', weight: '', flush: 1 });
  };

  return (
    <section className="space-y-6">
      <button onClick={() => navigate('/')} className="text-sm text-moss-300 hover:text-moss-200">
        ← Back to grows
      </button>
      <div className="rounded-xl border border-forest-800 bg-forest-900 p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-cream-100">{grow.name}</h2>
            <p className="text-cream-200">{grow.species}</p>
          </div>
          <button onClick={() => onEditGrow(grow)} className="rounded-md bg-earth-500 px-3 py-1.5 text-sm font-semibold text-cream-100 hover:bg-earth-400">
            Edit Grow
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm text-cream-200 sm:grid-cols-2">
          <p><span className="text-cream-100">Substrate:</span> {grow.substrate}</p>
          <p><span className="text-cream-100">Genetics:</span> {grow.geneticsSource}</p>
          <p><span className="text-cream-100">Inoculated:</span> {grow.inoculationDate}</p>
          <p><span className="text-cream-100">Status:</span> {grow.status}</p>
          <p className="sm:col-span-2"><span className="text-cream-100">Notes:</span> {grow.notes || '—'}</p>
        </div>
        <p className="mt-4 text-lg font-semibold text-moss-300">Total Yield: {totalYield} g</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-forest-800 bg-forest-900 p-5 shadow-card">
          <h3 className="mb-3 text-lg font-semibold">Harvest Log</h3>
          <div className="space-y-2 text-sm">
            {grow.harvests.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-md bg-forest-800 px-3 py-2">
                <span>{entry.date}</span>
                <span>Flush {entry.flush}</span>
                <span className="font-semibold text-moss-300">{entry.weight} g</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-forest-800 bg-forest-900 p-5 shadow-card">
            <h3 className="mb-3 text-lg font-semibold">Add Harvest</h3>
            <form onSubmit={submitHarvest} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input required type="date" value={harvestForm.date} onChange={(e) => setHarvestForm((p) => ({ ...p, date: e.target.value }))} className="rounded-md border border-forest-700 bg-forest-800 px-3 py-2" />
              <input required type="number" min="1" placeholder="Weight (g)" value={harvestForm.weight} onChange={(e) => setHarvestForm((p) => ({ ...p, weight: e.target.value }))} className="rounded-md border border-forest-700 bg-forest-800 px-3 py-2" />
              <input required type="number" min="1" placeholder="Flush #" value={harvestForm.flush} onChange={(e) => setHarvestForm((p) => ({ ...p, flush: e.target.value }))} className="rounded-md border border-forest-700 bg-forest-800 px-3 py-2" />
              <button type="submit" className="rounded-md bg-moss-500 px-4 py-2 font-semibold text-forest-950 hover:bg-moss-400 sm:col-span-3">Add Entry</button>
            </form>
          </div>

          <div className="rounded-xl border border-forest-800 bg-forest-900 p-5 shadow-card">
            <h3 className="mb-3 text-lg font-semibold">Per-Flush Yield Breakdown</h3>
            <ul className="space-y-2 text-sm">
              {perFlush.map((row) => (
                <li key={row.flush} className="flex items-center justify-between rounded bg-forest-800 px-3 py-2">
                  <span>{row.flush}</span>
                  <span className="font-semibold text-moss-300">{row.yield} g</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsPage({ grows }) {
  const stats = useMemo(() => {
    const allHarvests = grows.flatMap((grow) =>
      grow.harvests.map((h) => ({ ...h, species: grow.species, growStatus: grow.status })),
    );

    const yieldOverTime = Object.values(
      allHarvests.reduce((acc, item) => {
        acc[item.date] = acc[item.date] || { date: item.date, yield: 0 };
        acc[item.date].yield += Number(item.weight);
        return acc;
      }, {}),
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    const yieldBySpecies = Object.values(
      allHarvests.reduce((acc, item) => {
        acc[item.species] = acc[item.species] || { species: item.species, yield: 0 };
        acc[item.species].yield += Number(item.weight);
        return acc;
      }, {}),
    );

    const statusCounts = ['completed', 'failed', 'active'].map((label) => ({ name: label, value: 0 }));
    grows.forEach((grow) => {
      if (grow.status === 'failed') statusCounts[1].value += 1;
      else if (grow.status === 'harvested') statusCounts[0].value += 1;
      else statusCounts[2].value += 1;
    });

    const bestFlush = Object.values(
      allHarvests.reduce((acc, item) => {
        const key = `Flush ${item.flush}`;
        acc[key] = acc[key] || { flush: key, yield: 0 };
        acc[key].yield += Number(item.weight);
        return acc;
      }, {}),
    ).sort((a, b) => b.yield - a.yield);

    return { yieldOverTime, yieldBySpecies, statusCounts, bestFlush };
  }, [grows]);

  return (
    <section>
      <h2 className="mb-5 text-xl font-semibold">Dashboard & Stats</h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartPanel title="Total Yield Over Time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.yieldOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3932" />
              <XAxis dataKey="date" stroke="#ddd3c4" />
              <YAxis stroke="#ddd3c4" />
              <Tooltip />
              <Line type="monotone" dataKey="yield" stroke="#97b86b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Yield by Species">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.yieldBySpecies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3932" />
              <XAxis dataKey="species" stroke="#ddd3c4" />
              <YAxis stroke="#ddd3c4" />
              <Tooltip />
              <Bar dataKey="yield">
                {stats.yieldBySpecies.map((_, index) => (
                  <Cell key={index} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Success Rate (Completed vs Failed vs Active)">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stats.statusCounts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                {stats.statusCounts.map((_, index) => (
                  <Cell key={index} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Best Flush Performance">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.bestFlush}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3932" />
              <XAxis dataKey="flush" stroke="#ddd3c4" />
              <YAxis stroke="#ddd3c4" />
              <Tooltip />
              <Bar dataKey="yield" fill="#b58d69" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </section>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="rounded-xl border border-forest-800 bg-forest-900 p-4 shadow-card">
      <h3 className="mb-3 font-semibold text-cream-100">{title}</h3>
      {children}
    </div>
  );
}

export default App;
