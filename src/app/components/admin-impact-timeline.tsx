import { useState } from "react";
import { Camera, CheckCircle2, Send, X } from "lucide-react";

export function AdminImpactTimeline() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({ project: "", description: "", date: "" });

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = () => {
    if (!form.project || !form.description || !imagePreview) {
      alert("Please complete all fields and upload a photo.");
      return;
    }
    alert("Impact Update Published! This is now visible on the Donor Timeline.");
    setForm({ project: "", description: "", date: "" });
    setImagePreview(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Camera className="text-blue-600" /> Impact Timeline Manager
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Upload verified proofs of work. Donors see these updates in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Send size={18} className="text-blue-600"/> Publish New Update
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                  value={form.project}
                  onChange={(e) => setForm({...form, project: e.target.value})}
                >
                  <option value="">-- Select Project --</option>
                  <option>Vidya Shakti (Education)</option>
                  <option>Drishti Eye Camp</option>
                  <option>Annapoorna (Hunger Relief)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Photo Proof</label>
                {!imagePreview ? (
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Camera size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-600">Click to Upload Photo</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                    <button onClick={() => setImagePreview(null)} className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-slate-700 hover:text-red-600"><X size={18} /></button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-500 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                />
              </div>

              <button onClick={handlePublish} className="w-full py-4 bg-[#3366FF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={20} /> Publish to Donors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}