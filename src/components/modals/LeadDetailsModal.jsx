import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LEAD_STATUS_CONFIG, LEAD_STATUSES } from '../../constants/leadStatuses';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Mail, Phone, Calendar, UserCheck, Calculator, Building2, CheckCircle2 } from 'lucide-react';

export const LeadDetailsModal = ({ isOpen, onClose, lead, onAssignClick, onQuoteClick }) => {
  if (!lead) return null;

  const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG[LEAD_STATUSES.NEW];
  const quote = lead.quote;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lead Details — ${lead.customerName}`}
      description="Comprehensive customer inquiry, assignment details, and quote status overview."
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Customer & Status Header */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{lead.customerName}</h4>
              <span className="text-xs text-slate-400">Customer ID: {lead.id || lead._id}</span>
            </div>
            <Badge className={statusCfg.style} dot>
              {statusCfg.label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{lead.customerEmail || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{lead.customerPhone || 'No phone provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Created {formatDate(lead.createdAt || lead.createdDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Assigned: {lead.assignedToName || lead.assignedTo || 'Unassigned'}</span>
            </div>
          </div>
        </div>

        {/* Quote Details Section */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Quote Information
          </h5>

          {quote ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Base Equipment Total</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(quote.baseTotal ?? quote.basePrice)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Vendor Margin Applied</span>
                <span className="font-semibold text-emerald-600">
                  +{formatCurrency(quote.marginApplied ?? quote.margin)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Installation Fee</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  +{formatCurrency(quote.installationPrice ?? quote.installation)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Miscellaneous Charges</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  +{formatCurrency(quote.miscCharges ?? quote.misc)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold text-brand-600 dark:text-brand-400">
                <span>Final Formal Quote Total</span>
                <span>{formatCurrency(quote.finalTotal ?? quote.total)}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
              No formal quote generated for this lead yet.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onAssignClick && (
            <Button
              variant="outline"
              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onAssignClick(lead);
              }}
            >
              Assign Lead
            </Button>
          )}
          {onQuoteClick && (
            <Button
              variant="primary"
              leftIcon={<Calculator className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onQuoteClick(lead);
              }}
            >
              {quote ? 'Re-Quote Lead' : 'Generate Formal Quote'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
