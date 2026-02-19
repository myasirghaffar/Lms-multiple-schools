
import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Edit3, 
  Trash2, 
  Plus, 
  Zap, 
  X, 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  Layers,
  CheckCircle2,
  MinusCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Plan {
  id: string;
  name: string;
  price: number;
  cycle: string;
  features: string[];
  isPopular?: boolean;
}

const SubscriptionPlans: React.FC = () => {
  const { isDemo } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    cycle: 'monthly',
    features: ['']
  });
  const [formLoading, setFormLoading] = useState(false);

  // Scroll Lock Management
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('educhain_mock_plans');
    if (saved) {
      setPlans(JSON.parse(saved));
    } else {
      const initialPlans = [
        { id: '1', name: 'Basic', price: 49, cycle: 'monthly', features: ['Up to 200 Students', 'Core LMS Modules', 'Standard Support', '5GB Storage'] },
        { id: '2', name: 'Pro', price: 149, cycle: 'monthly', features: ['Up to 1000 Students', 'All LMS Modules', 'Priority Support', '50GB Storage'], isPopular: true },
        { id: '3', name: 'Enterprise', price: 499, cycle: 'monthly', features: ['Unlimited Students', 'Full Feature Access', '24/7 Support', 'SSO Integration'] }
      ];
      setPlans(initialPlans);
      localStorage.setItem('educhain_mock_plans', JSON.stringify(initialPlans));
    }
    setLoading(false);
  }, []);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        cycle: plan.cycle,
        features: [...plan.features]
      });
    } else {
      setEditingPlan(null);
      setFormData({ name: '', price: 0, cycle: 'monthly', features: [''] });
    }
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [''] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 800));
        let updatedPlans;
        if (editingPlan) {
          updatedPlans = plans.map(p => p.id === editingPlan.id ? { ...p, ...formData, features: formData.features.filter(f => f.trim()) } : p);
        } else {
          const newPlan = {
            id: Math.random().toString(36).substr(2, 9),
            ...formData,
            features: formData.features.filter(f => f.trim())
          };
          updatedPlans = [...plans, newPlan];
        }
        setPlans(updatedPlans);
        localStorage.setItem('educhain_mock_plans', JSON.stringify(updatedPlans));
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this plan tier? This cannot be undone.')) {
      const updated = plans.filter(p => p.id !== id);
      setPlans(updated);
      localStorage.setItem('educhain_mock_plans', JSON.stringify(updated));
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Subscription Tiers</h2>
          <p className="text-sm text-slate-500 font-medium">Define global pricing units for the EduChain network.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} />
          <span>Provision New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-[40px] p-8 border-2 ${plan.isPopular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/5' : 'border-slate-100'} relative flex flex-col group hover:scale-[1.02] transition-all`}>
            {plan.isPopular && (
              <div className="absolute top-6 right-6">
                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200">Featured</span>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{plan.name}</h3>
              <div className="flex items-baseline mt-3">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">${plan.price}</span>
                <span className="text-slate-400 ml-2 text-sm font-bold uppercase tracking-widest">/ {plan.cycle}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-3 group/feat">
                  <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600 shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-sm text-slate-600 font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
              <button 
                onClick={() => handleOpenModal(plan)}
                className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all"
              >
                <Edit3 size={18} />
                <span>Configure</span>
              </button>
              <button 
                onClick={() => handleDelete(plan.id)}
                className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => handleOpenModal()}
          className="border-4 border-dashed border-slate-100 rounded-[40px] p-8 flex flex-col items-center justify-center space-y-6 hover:bg-slate-50 hover:border-indigo-200 transition-all text-slate-300 hover:text-indigo-400 min-h-[400px] group"
        >
           <div className="bg-slate-50 p-6 rounded-full group-hover:bg-white group-hover:shadow-xl transition-all">
             <Plus size={48} />
           </div>
           <div className="text-center">
             <p className="font-black text-xl tracking-tight text-slate-400 group-hover:text-indigo-600">Infinite Tier</p>
             <p className="text-xs font-bold uppercase tracking-widest mt-1">Add custom pricing model</p>
           </div>
        </button>
      </div>

      {/* Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !formLoading && setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{editingPlan ? 'Configure Tier' : 'Provision Tier'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={28} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Identity</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                    placeholder="e.g. Pro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Cost ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Featured Capabilities</label>
                  <button type="button" onClick={handleAddFeature} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add Line
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <input 
                        value={feature}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                        placeholder="e.g. AI Grading System"
                        className="flex-1 px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={24} /> : editingPlan ? 'Save Configurations' : 'Authorize Tier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
