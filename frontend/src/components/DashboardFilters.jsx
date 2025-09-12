export default function DashboardFilters({ filters, setFilters }) {
  return (
    <div className="bg-black text-[#D4AF37] p-4 rounded-lg shadow mb-6">
      <h3 className="font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div>
          <label className="block text-sm text-[#D4AF37]">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="mt-1 w-full border border-[#D4AF37] bg-[#1a1a1a] text-[#D4AF37] rounded-lg px-3 py-2"
          />
        </div>

        
        <div>
          <label className="block text-sm text-[#D4AF37]">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="mt-1 w-full border border-[#D4AF37] bg-[#1a1a1a] text-[#D4AF37] rounded-lg px-3 py-2"
          />
        </div>

        
        <div>
          <label className="block text-sm text-[#D4AF37]">Category</label>
          <input
            type="text"
            placeholder="e.g. Food"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="mt-1 w-full border border-[#D4AF37] bg-[#1a1a1a] text-[#D4AF37] placeholder-[#D4AF37]/70 rounded-lg px-3 py-2"
          />
        </div>

        
        <div>
          <label className="block text-sm text-[#D4AF37]">Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="mt-1 w-full border border-[#D4AF37] bg-[#1a1a1a] text-[#D4AF37] rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
      </div>
    </div>
  );
}
