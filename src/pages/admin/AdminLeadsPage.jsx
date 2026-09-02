import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api/adminApi';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LeadDetailsModal } from '../../components/modals/LeadDetailsModal';
import { LEAD_STATUS_CONFIG, LEAD_STATUSES } from '../../constants/leadStatuses';
import { formatCurrency } from '../../utils/formatters';
import { Search, Mail, Eye, Building2 } from 'lucide-react';

export const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getLeads();
      const list = Array.isArray(data) ? data : data?.leads || data?.data || [];
      setLeads(list);
    } catch (err) {
      setError(err?.message || 'Failed to load system leads from backend.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.customerPhone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.vendorName || lead.vendorId?.name || lead.vendorId?.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === 'all' || (lead.status || 'new') === activeTab;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            System Leads Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global monitoring of all customer inquiries, organization quotes, and vendor pipelines across the system.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads by customer name, email, phone, or vendor..."
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

      {error && <ErrorAlert message={error} onRetry={loadLeads} />}

      {loading && <SkeletonTable rows={5} cols={5} />}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Details</TableHead>
              <TableHead>Vendor / Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quoted Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                  No system leads found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => {
                const leadId = lead.id || lead._id;
                const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG[LEAD_STATUSES.NEW];
                const quoteTotal = lead.quote?.finalTotal || lead.quote?.total || null;
                
                const vendorDisplay =
                  lead.vendorName ||
                  (lead.vendorId?.email ? `${lead.vendorId.name || 'Vendor'} (${lead.vendorId.email})` : null) ||
                  lead.vendorEmail ||
                  (lead.assignedTo ? `Assigned (${lead.assignedTo})` : 'Vendor Partner');

                return (
                  <TableRow key={leadId}>
                    <TableCell>
                      <div
                        className="flex flex-col cursor-pointer hover:underline"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <span className="font-bold text-slate-900 dark:text-slate-100">{lead.customerName}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {lead.customerEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-brand-600" />
                        <span>{vendorDisplay}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusCfg.style} dot>
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                      {quoteTotal ? formatCurrency(quoteTotal) : <span className="text-slate-400 font-normal text-xs">Unquoted</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                        title="View Lead Details"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      {/* Lead Details Modal */}
      <LeadDetailsModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
      />
    </div>
  );
};
