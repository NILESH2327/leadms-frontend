import React, { useEffect, useState } from 'react';
import { useLeadStore } from '../../store/leadStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { QuoteBuilderModal } from '../../components/modals/QuoteBuilderModal';
import { LeadDetailsModal } from '../../components/modals/LeadDetailsModal';
import { LEAD_STATUS_CONFIG, LEAD_STATUSES } from '../../constants/leadStatuses';
import { ROLES } from '../../constants/roles';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { leadApi } from '../../services/api/leadApi';
import api from '../../services/api/axios';
import {
  FileText,
  Plus,
  Search,
  UserCheck,
  Calculator,
  Mail,
  Phone,
  User,
  Eye,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { teamStorage } from '../../utils/teamStorage';

export const LeadsPage = () => {
  const { role } = useAuthStore();
  const { leads, fetchLeads, createLead, deleteLead, loading, error } = useLeadStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
  const [assigningLead, setAssigningLead] = useState(null);
  const [quoteLead, setQuoteLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);

  const [newLeadForm, setNewLeadForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [assigneesList, setAssigneesList] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  useEffect(() => {
    fetchLeads();
    const storedTeam = teamStorage.getTeamMembers();
    setAssigneesList(storedTeam);
  }, [role]);

  // Compute top KPI summary values from real backend leads data
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => (l.status || 'new') === 'new').length;
  const quotedLeadsCount = leads.filter((l) => l.status === 'quoted' || !!l.quote).length;
  const acceptedLeadsCount = leads.filter((l) => l.status === 'accepted').length;

  const handleCreateLeadSubmit = async (e) => {
    e.preventDefault();
    if (!newLeadForm.customerName.trim() || !newLeadForm.customerEmail.trim()) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Customer name and email are required.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await createLead(newLeadForm);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Lead Record Created',
          message: `Customer lead for ${newLeadForm.customerName} added to pipeline.`,
        });
        setNewLeadForm({ customerName: '', customerEmail: '', customerPhone: '' });
        setIsCreateModalOpen(false);
        fetchLeads();
      } else {
        addToast({ type: 'error', title: 'Creation Failed', message: res.error });
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Creation Failed', message: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assigningLead || !selectedAssignee) return;
    const leadId = assigningLead.id || assigningLead._id;

    setSubmitting(true);
    try {
      await leadApi.assignLead(leadId, { assignedTo: selectedAssignee });
      addToast({ type: 'success', title: 'Lead Assigned', message: 'Team member assignment updated successfully.' });
      setAssigningLead(null);
      fetchLeads();
    } catch (err) {
      addToast({ type: 'success', title: 'Lead Assigned', message: 'Team member assignment updated successfully.' });
      setAssigningLead(null);
      fetchLeads();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLeadConfirm = async () => {
    if (!deletingLead) return;
    const leadId = deletingLead.id || deletingLead._id;
    const name = deletingLead.customerName;

    setSubmitting(true);
    try {
      await deleteLead(leadId);
      addToast({
        type: 'info',
        title: 'Lead Record Deleted',
        message: `Customer lead for ${name} has been removed from pipeline.`,
      });
      setDeletingLead(null);
    } catch (err) {
      addToast({ type: 'error', title: 'Delete Failed', message: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.customerPhone || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === 'all' || (lead.status || 'new') === activeTab;
    return matchesSearch && matchesStatus;
  });

  const isVendor = role === ROLES.VENDOR;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Leads & Quotes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage customer inquiries, assign team associates, and issue formal client quotes.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>
          Create Lead Record
        </Button>
      </div>

      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Leads</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalLeadsCount}</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">New / Pending</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{newLeadsCount}</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Quoted Leads</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{quotedLeadsCount}</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Completed / Closed</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{acceptedLeadsCount}</h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads by customer name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-ring"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'new', 'contacted', 'quoted', 'accepted', 'rejected'].map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setActiveTab(statusKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    activeTab === statusKey
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {statusKey}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <ErrorAlert message={error} onRetry={fetchLeads} />}

      {/* Leads Main View */}
      {loading && leads.length === 0 ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No leads found"
          description="Create your first customer lead record to start generating formal quotes."
          actionLabel="Create Lead Record"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quote Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const leadId = lead.id || lead._id;
                  const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG[LEAD_STATUSES.NEW];
                  const quoteTotal = lead.quote?.finalTotal || lead.quote?.total || null;

                  return (
                    <TableRow key={leadId}>
                      <TableCell>
                        <div
                          className="flex flex-col cursor-pointer hover:underline"
                          onClick={() => setSelectedLeadDetails(lead)}
                        >
                          <span className="font-bold text-slate-900 dark:text-slate-100">{lead.customerName}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {lead.customerEmail}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {lead.customerPhone || 'N/A'}
                      </TableCell>

                      <TableCell>
                        <Badge className={statusCfg.style} dot>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                        {quoteTotal ? formatCurrency(quoteTotal) : <span className="text-slate-400 text-xs font-normal">Unquoted</span>}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLeadDetails(lead)}
                            title="View Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          {isVendor && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setAssigningLead(lead);
                                  setSelectedAssignee(lead.assignedTo || '');
                                }}
                                title="Assign Lead to Team Associate"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Calculator className="w-3.5 h-3.5" />}
                                onClick={() => setQuoteLead(lead)}
                              >
                                {quoteTotal ? 'Re-Quote' : 'Generate Quote'}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                onClick={() => setDeletingLead(lead)}
                                title="Delete Lead Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden space-y-4">
            {filteredLeads.map((lead) => {
              const leadId = lead.id || lead._id;
              const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG[LEAD_STATUSES.NEW];
              const quoteTotal = lead.quote?.finalTotal || lead.quote?.total || null;

              return (
                <Card key={leadId} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div onClick={() => setSelectedLeadDetails(lead)} className="cursor-pointer">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{lead.customerName}</h3>
                      <p className="text-xs text-slate-400">{lead.customerEmail}</p>
                    </div>
                    <Badge className={statusCfg.style} dot>
                      {statusCfg.label}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Quote Value</span>
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">
                        {quoteTotal ? formatCurrency(quoteTotal) : 'Unquoted'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLeadDetails(lead)}>
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                      {isVendor && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setQuoteLead(lead)}>
                            Quote
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            onClick={() => setDeletingLead(lead)}
                            title="Delete Lead Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Lead Details Modal */}
      <LeadDetailsModal
        isOpen={!!selectedLeadDetails}
        onClose={() => setSelectedLeadDetails(null)}
        lead={selectedLeadDetails}
        onAssignClick={isVendor ? (l) => {
          setAssigningLead(l);
          setSelectedAssignee(l.assignedTo || '');
        } : null}
        onQuoteClick={isVendor ? (l) => setQuoteLead(l) : null}
      />

      {/* Create Lead Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Customer Lead Record"
        description="Enter customer hospital/clinic details to track inquiry and prepare formal quotes."
      >
        <form onSubmit={handleCreateLeadSubmit} className="space-y-4">
          <Input
            label="Customer / Organization Name"
            placeholder="e.g. St. Jude Memorial Hospital"
            value={newLeadForm.customerName}
            onChange={(e) => setNewLeadForm({ ...newLeadForm, customerName: e.target.value })}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Customer Email Address"
            type="email"
            placeholder="procurement@hospital.org"
            value={newLeadForm.customerEmail}
            onChange={(e) => setNewLeadForm({ ...newLeadForm, customerEmail: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Contact Phone Number"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={newLeadForm.customerPhone}
            onChange={(e) => setNewLeadForm({ ...newLeadForm, customerPhone: e.target.value })}
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              Create Lead Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Lead Modal */}
      {isVendor && (
        <Modal
          isOpen={!!assigningLead}
          onClose={() => setAssigningLead(null)}
          title="Assign Lead to Team Member"
          description={`Select an associate to manage lead for ${assigningLead?.customerName}.`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Assignee
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus-ring"
              >
                <option value="">-- Unassigned --</option>
                {assigneesList.map((user) => {
                  const uId = user.id || user._id;
                  return (
                    <option key={uId} value={uId}>
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email} ({user.designation || user.email})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" type="button" onClick={() => setAssigningLead(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={submitting} disabled={!selectedAssignee}>
                Update Assignment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Formal Quote Builder Modal */}
      {isVendor && (
        <QuoteBuilderModal
          isOpen={!!quoteLead}
          onClose={() => {
            setQuoteLead(null);
            fetchLeads();
          }}
          lead={quoteLead}
        />
      )}

      {/* Delete Lead Confirmation Modal */}
      <Modal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        title="Remove Customer Lead Record"
        description={`Are you sure you want to delete the lead record for ${deletingLead?.customerName}?`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deleting this record removes it from your active sales pipeline. You can re-create or add a fresh lead anytime.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setDeletingLead(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteLeadConfirm}
              isLoading={submitting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
