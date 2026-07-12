import React, { useState } from 'react';
import { Users, Building2, Tags, Search, Plus, Edit2, Shield, MoreVertical } from 'lucide-react';
import { mockData } from '../mocks/sharedMockData';
import { motion } from 'framer-motion';

export default function OrgSetup() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState(mockData.employees);
  const [departments, setDepartments] = useState(mockData.departments);
  const [categories, setCategories] = useState(mockData.categories);

  const handleRoleChange = (id, newRole) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, role: newRole } : emp));
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-rust/10 text-rust border-rust/20';
      case 'Asset Manager': return 'bg-navy/10 text-navy border-navy/20';
      case 'Department Head': return 'bg-sage/10 text-sage border-sage/20';
      default: return 'bg-gray-100 text-charcoal/60 border-gray-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy">Organization Setup</h1>
          <p className="text-charcoal/60 mt-1">Manage employees, structural hierarchy, and asset classifications.</p>
        </div>
        <button className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-beige px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          {activeTab === 'employees' ? 'Invite Employee' : activeTab === 'departments' ? 'Add Department' : 'New Category'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-navy/5 shadow-sm p-1 shrink-0 w-fit">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'employees' ? 'bg-navy text-white shadow-md' : 'text-charcoal/60 hover:text-navy hover:bg-beige/50'
          }`}
        >
          <Users size={18} /> Employee Directory
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'departments' ? 'bg-navy text-white shadow-md' : 'text-charcoal/60 hover:text-navy hover:bg-beige/50'
          }`}
        >
          <Building2 size={18} /> Departments
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'categories' ? 'bg-navy text-white shadow-md' : 'text-charcoal/60 hover:text-navy hover:bg-beige/50'
          }`}
        >
          <Tags size={18} /> Asset Categories
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white border border-navy/5 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Search Bar for the active tab */}
        <div className="p-4 border-b border-navy/5 bg-beige/30 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 bg-white border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm"
            />
          </div>
        </div>

        {/* Tab 1: Employees */}
        {activeTab === 'employees' && (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 border-b border-navy/10 z-10 text-xs uppercase text-charcoal/50 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role (Access Level)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-beige/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xs">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-charcoal">{emp.name}</div>
                          <div className="text-xs text-charcoal/50">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-charcoal/80">{emp.department}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={emp.role}
                        onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1.5 rounded border outline-none cursor-pointer ${getRoleColor(emp.role)} bg-white`}
                      >
                        <option value="Employee">Employee (Base)</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Admin">System Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${emp.status === 'Active' ? 'bg-sage/10 text-sage' : 'bg-charcoal/10 text-charcoal/60'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-charcoal/40 hover:text-navy hover:bg-navy/10 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Departments */}
        {activeTab === 'departments' && (
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 border-b border-navy/10 z-10 text-xs uppercase text-charcoal/50 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Department Name</th>
                  <th className="px-6 py-4">Department Head</th>
                  <th className="px-6 py-4">Parent Dept</th>
                  <th className="px-6 py-4 text-center">Assets Held</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-beige/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-charcoal">{dept.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${dept.head === 'Unassigned' ? 'text-rust' : 'text-charcoal/80'}`}>
                        {dept.head}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">{dept.parent}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-full bg-navy/10 text-navy font-bold text-xs">
                        {dept.assetCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-charcoal/40 hover:text-navy hover:bg-navy/10 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'categories' && (
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-navy/10 rounded-xl p-5 hover:shadow-md transition-shadow relative bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-beige flex items-center justify-center text-navy font-bold">
                        {cat.prefix}
                      </div>
                      <h3 className="font-bold text-charcoal text-lg">{cat.name}</h3>
                    </div>
                    <button className="text-charcoal/40 hover:text-navy transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide">Custom Fields</div>
                    <div className="flex flex-wrap gap-2">
                      {cat.customFields.map((field, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-charcoal/70 text-xs font-medium rounded-md">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-navy/5 flex items-center justify-between text-sm">
                    <span className="text-charcoal/60">Can be booked?</span>
                    <span className={`font-semibold ${cat.bookable ? 'text-sage' : 'text-charcoal/40'}`}>
                      {cat.bookable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
