import { useState, useEffect } from "react";
import { orgSetupApi } from "../api/orgSetupApi";
import { Plus, X, Trash2, ShieldAlert } from "lucide-react";

export default function OrgSetup() {
  const [activeTab, setActiveTab] = useState("departments");
  
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Modals state
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [promoteModal, setPromoteModal] = useState({ isOpen: false, employee: null });

  // Form State
  const [newDept, setNewDept] = useState({ name: "", head: "", parent: "-" });
  const [newCat, setNewCat] = useState({ name: "", customFields: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [depts, cats, emps] = await Promise.all([
      orgSetupApi.getDepartments(),
      orgSetupApi.getCategories(),
      orgSetupApi.getEmployees()
    ]);
    setDepartments(depts);
    setCategories(cats);
    setEmployees(emps);
  };

  const handleAddClick = () => {
    if (activeTab === "departments") setIsAddDeptOpen(true);
    if (activeTab === "categories") setIsAddCatOpen(true);
  };

  const handlePromote = async (newRole) => {
    if (promoteModal.employee) {
      await orgSetupApi.promoteEmployee(promoteModal.employee.id, newRole);
      fetchData();
      setPromoteModal({ isOpen: false, employee: null });
    }
  };

  const submitDept = async (e) => {
    e.preventDefault();
    await orgSetupApi.addDepartment(newDept);
    setNewDept({ name: "", head: "", parent: "-" });
    setIsAddDeptOpen(false);
    fetchData();
  };

  const submitCat = async (e) => {
    e.preventDefault();
    await orgSetupApi.addCategory(newCat);
    setNewCat({ name: "", customFields: [] });
    setIsAddCatOpen(false);
    fetchData();
  };

  const StatusBadge = ({ status }) => {
    const isAvailable = status === "Active" || status === "Available";
    const bgClass = isAvailable ? "bg-sage/10 text-sage border-sage/20" : "bg-slate/10 text-slate border-slate/20";
    return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${bgClass}`}>{status}</span>;
  };

  const RoleBadge = ({ role }) => {
    let colorClass = "bg-slate/10 text-slate border-slate/20";
    if (role === "Admin") colorClass = "bg-navy/10 text-navy border-navy/20";
    if (role === "Asset Manager") colorClass = "bg-sage/10 text-sage border-sage/20";
    if (role === "Department Head") colorClass = "bg-amber/10 text-amber border-amber/20";
    return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>{role}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-6 border-b border-navy/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Organization Setup</h1>
          <p className="text-charcoal/70 mt-1">Manage departments, categories, and employees.</p>
        </div>
        {(activeTab === "departments" || activeTab === "categories") && (
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-navy text-cream px-4 py-2 rounded-md hover:bg-navy/90 transition shadow-sm"
          >
            <Plus size={16} /> Add {activeTab === "departments" ? "Department" : "Category"}
          </button>
        )}
      </div>

      <div className="flex gap-6 mb-6">
        {["departments", "categories", "employees"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium transition-colors capitalize ${activeTab === tab ? "text-navy border-b-2 border-navy" : "text-charcoal/50 hover:text-navy"}`}
          >
            {tab === "employees" ? "Employee Directory" : tab}
          </button>
        ))}
      </div>

      <div className="bg-cream rounded-lg shadow-sm border border-navy/5 overflow-hidden">
        {activeTab === "departments" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-beige border-b border-navy/10 text-charcoal/70 text-sm">
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Head</th>
                <th className="p-4 font-medium">Parent Dept</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id} className="border-b border-navy/5 last:border-0 hover:bg-beige/30">
                  <td className="p-4 font-medium">{dept.name}</td>
                  <td className="p-4 text-charcoal/80">{dept.head}</td>
                  <td className="p-4 text-charcoal/80">{dept.parent}</td>
                  <td className="p-4"><StatusBadge status={dept.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "categories" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-beige border-b border-navy/10 text-charcoal/70 text-sm">
                <th className="p-4 font-medium">Category Name</th>
                <th className="p-4 font-medium">Assets</th>
                <th className="p-4 font-medium">Custom Fields</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-navy/5 last:border-0 hover:bg-beige/30">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-charcoal/80">{cat.assetCount}</td>
                  <td className="p-4 text-charcoal/80">
                    {cat.customFields?.length > 0 
                      ? cat.customFields.map(f => f.name).join(", ") 
                      : <span className="text-charcoal/40">None</span>}
                  </td>
                  <td className="p-4"><StatusBadge status={cat.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "employees" && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-beige border-b border-navy/10 text-charcoal/70 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-navy/5 last:border-0 hover:bg-beige/30">
                  <td className="p-4 font-medium">{emp.name}</td>
                  <td className="p-4 text-charcoal/80">{emp.email}</td>
                  <td className="p-4 text-charcoal/80">{emp.department}</td>
                  <td className="p-4"><RoleBadge role={emp.role} /></td>
                  <td className="p-4"><StatusBadge status={emp.status} /></td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setPromoteModal({ isOpen: true, employee: emp })}
                      className="text-navy hover:underline text-sm font-medium disabled:opacity-50"
                      disabled={emp.role === "Admin"}
                    >
                      Promote User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Promote Modal */}
      {promoteModal.isOpen && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center p-4 z-50">
          <div className="bg-cream rounded-xl p-6 max-w-md w-full shadow-lg border border-navy/10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2"><ShieldAlert size={20} className="text-amber" /> Promote User</h2>
              <button onClick={() => setPromoteModal({ isOpen: false, employee: null })} className="text-charcoal/50 hover:text-charcoal"><X size={20} /></button>
            </div>
            <p className="text-charcoal/70 text-sm mb-6">Elevate permissions for <span className="font-semibold text-charcoal">{promoteModal.employee?.name}</span>.</p>
            
            <div className="space-y-3">
              <button onClick={() => handlePromote("Department Head")} className="w-full text-left p-4 border border-navy/10 rounded-lg hover:border-navy hover:bg-navy/5 transition group">
                <div className="font-medium text-navy">Department Head</div>
                <div className="text-sm text-charcoal/70 mt-1">Approves transfers & books resources for department.</div>
              </button>
              
              <button onClick={() => handlePromote("Asset Manager")} className="w-full text-left p-4 border border-navy/10 rounded-lg hover:border-navy hover:bg-navy/5 transition group">
                <div className="font-medium text-navy">Asset Manager</div>
                <div className="text-sm text-charcoal/70 mt-1">Full control over asset registration, maintenance, and audits.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Drawer */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 bg-navy/50 flex justify-end z-50">
          <div className="w-full max-w-md bg-cream h-full shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-navy">New Department</h2>
              <button onClick={() => setIsAddDeptOpen(false)} className="text-charcoal/50 hover:text-charcoal"><X size={24} /></button>
            </div>
            <form onSubmit={submitDept} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Department Name</label>
                <input required value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} type="text" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy" placeholder="e.g. Engineering" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Department Head (Employee)</label>
                <input required value={newDept.head} onChange={e => setNewDept({...newDept, head: e.target.value})} type="text" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy" placeholder="Search employee..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Parent Department</label>
                <select value={newDept.parent} onChange={e => setNewDept({...newDept, parent: e.target.value})} className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy">
                  <option value="-">None</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full bg-navy text-cream py-3 rounded-md font-medium hover:bg-navy/90 transition">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center p-4 z-50">
          <div className="bg-cream rounded-xl p-6 max-w-lg w-full shadow-lg border border-navy/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-navy">New Asset Category</h2>
              <button onClick={() => setIsAddCatOpen(false)} className="text-charcoal/50 hover:text-charcoal"><X size={20} /></button>
            </div>
            <form onSubmit={submitCat} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category Name</label>
                <input required value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} type="text" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy" placeholder="e.g. Vehicles" />
              </div>
              
              <div className="border-t border-navy/10 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-charcoal">Custom Fields</label>
                  <button type="button" onClick={() => setNewCat({...newCat, customFields: [...newCat.customFields, { id: Date.now(), name: "", type: "text" }]})} className="text-xs text-navy font-medium hover:underline flex items-center gap-1"><Plus size={14} /> Add Field</button>
                </div>
                {newCat.customFields.length === 0 ? (
                  <div className="text-sm text-charcoal/50 italic bg-beige p-4 rounded text-center border border-navy/5">No custom fields defined.</div>
                ) : (
                  <div className="space-y-3">
                    {newCat.customFields.map((field) => (
                      <div key={field.id} className="flex gap-3 items-start">
                        <input required value={field.name} onChange={e => setNewCat({...newCat, customFields: newCat.customFields.map(f => f.id === field.id ? {...f, name: e.target.value} : f)})} placeholder="Field Name (e.g. Warranty)" className="flex-1 p-2 border border-navy/20 rounded-md bg-white text-sm" />
                        <select value={field.type} onChange={e => setNewCat({...newCat, customFields: newCat.customFields.map(f => f.id === field.id ? {...f, type: e.target.value} : f)})} className="w-32 p-2 border border-navy/20 rounded-md bg-white text-sm">
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                        </select>
                        <button type="button" onClick={() => setNewCat({...newCat, customFields: newCat.customFields.filter(f => f.id !== field.id)})} className="p-2 text-rust hover:bg-rust/10 rounded-md transition"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddCatOpen(false)} className="px-4 py-2 text-charcoal/70 hover:text-charcoal font-medium">Cancel</button>
                <button type="submit" className="bg-navy text-cream px-6 py-2 rounded-md font-medium hover:bg-navy/90 transition">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
