import { useEffect, useState } from 'react';

const defaultState = {
  name: '',
  species: '',
  substrate: '',
  grainType: '',
  geneticsSource: 'Grain Spawn',
  inoculationDate: '',
  spawnToBulkDate: '',
  status: 'Growing',
  notes: '',
};

function GrowFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultState, ...initialData });
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-forest-800 bg-forest-900 p-6 shadow-card">
        <h3 className="mb-4 text-xl font-semibold text-cream-100">
          {initialData ? 'Edit Grow' : 'Add New Grow'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { key: 'name', label: 'Grow Name', type: 'text' },
            { key: 'species', label: 'Species', type: 'text' },
            { key: 'substrate', label: 'Substrate Type', type: 'text' },
            { key: 'grainType', label: 'Grain Type', type: 'text', placeholder: 'corn, rice, bird seed, rye, millet...' },
            { key: 'inoculationDate', label: 'Inoculation Date', type: 'date' },
            { key: 'spawnToBulkDate', label: 'Spawn to Bulk Date', type: 'date' },
          ].map((field) => (
            <label key={field.key} className="flex flex-col gap-1 text-sm text-cream-200">
              {field.label}
              <input
                required={field.type === 'date' || field.key !== 'spawnToBulkDate'}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className="rounded-md border border-forest-800 bg-forest-800 px-3 py-2 text-cream-100 outline-none ring-moss-400 focus:ring-2"
              />
            </label>
          ))}

          <label className="flex flex-col gap-1 text-sm text-cream-200">
            Genetics Source
            <select
              value={formData.geneticsSource}
              onChange={(e) => setFormData((prev) => ({ ...prev, geneticsSource: e.target.value }))}
              className="rounded-md border border-forest-800 bg-forest-800 px-3 py-2 text-cream-100 outline-none ring-moss-400 focus:ring-2"
            >
              <option value="Grain Spawn">Grain Spawn</option>
              <option value="Liquid Culture">Liquid Culture</option>
              <option value="Spore">Spore</option>
              <option value="Agar">Agar</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-cream-200">
            Status
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-md border border-forest-800 bg-forest-800 px-3 py-2 text-cream-100 outline-none ring-moss-400 focus:ring-2"
            >
              <option value="Harvested">Harvested</option>
              <option value="Contaminated">Contaminated</option>
              <option value="Growing">Growing</option>
            </select>
          </label>

          <label className="col-span-1 flex flex-col gap-1 text-sm text-cream-200 sm:col-span-2">
            Notes
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="rounded-md border border-forest-800 bg-forest-800 px-3 py-2 text-cream-100 outline-none ring-moss-400 focus:ring-2"
            />
          </label>

          <div className="col-span-1 flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-forest-700 px-4 py-2 text-sm text-cream-200 hover:bg-forest-800"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-earth-500 px-4 py-2 text-sm font-semibold text-cream-100 hover:bg-earth-400">
              Save Grow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GrowFormModal;
