import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api/adminApi';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { ROLE_LABELS, ROLE_BADGE_STYLES } from '../../constants/roles';
import { Search, Mail } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsers();
      const list = Array.isArray(data) ? data : data?.users || data?.data || [];
      setUsers(list);
    } catch (err) {
      setError(err?.message || 'Failed to load system users from backend.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.lastName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Platform Users Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete list of registered Administrators, Vendors, Traders, and Team Members.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-ring"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="vendor">Vendor Partner</option>
              <option value="trader">Trader / Supplier</option>
              <option value="team-member">Team Member</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error && <ErrorAlert message={error} onRetry={loadUsers} />}

      {loading && <SkeletonTable rows={5} cols={3} />}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name & Email</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>User ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                  No matching users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const uId = user.id || user._id;
                return (
                  <TableRow key={uId}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${ROLE_BADGE_STYLES[user.role] || ''}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {uId}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
