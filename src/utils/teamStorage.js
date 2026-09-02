const STORAGE_KEY = 'leadms_vendor_team_invites';

export const DEFAULT_TEAM_MEMBERS = [
  {
    _id: 'usr_mradul',
    id: 'usr_mradul',
    email: 'mradulgandhi18@gmail.com',
    firstName: 'Mradul',
    lastName: 'Gandhi',
    designation: 'Sales Team Lead',
    role: 'team-member',
    status: 'Active',
    date: new Date().toLocaleDateString(),
  },
  {
    _id: 'usr_nilesh',
    id: 'usr_nilesh',
    email: 'nileshkumar95559926@gmail.com',
    firstName: 'Nilesh',
    lastName: 'Kumar',
    designation: 'Solar Tech Lead',
    role: 'team-member',
    status: 'Active',
    date: new Date().toLocaleDateString(),
  },
];

export const teamStorage = {
  getTeamMembers: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const localList = saved ? JSON.parse(saved) : [];

      const mergedMap = new Map();
      DEFAULT_TEAM_MEMBERS.forEach((m) => mergedMap.set(m.email.toLowerCase(), m));

      localList.forEach((m) => {
        const email = m.email?.toLowerCase();
        if (email) {
          const emailName = m.email.split('@')[0];
          mergedMap.set(email, {
            _id: m.token || m.email,
            id: m.token || m.email,
            email: m.email,
            firstName: m.firstName || emailName.charAt(0).toUpperCase() + emailName.slice(1),
            lastName: m.lastName || (m.role === 'team-member' ? 'Team Lead' : 'Associate'),
            designation: m.designation || 'Team Lead',
            role: m.role || 'team-member',
            status: m.status || 'Active',
            date: m.date || new Date().toLocaleDateString(),
          });
        }
      });

      return Array.from(mergedMap.values());
    } catch {
      return DEFAULT_TEAM_MEMBERS;
    }
  },

  addTeamMember: (newMember) => {
    try {
      const currentList = teamStorage.getTeamMembers();
      const email = newMember.email.toLowerCase();
      const updatedList = [
        newMember,
        ...currentList.filter((m) => m.email.toLowerCase() !== email),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    } catch {
      return [];
    }
  },

  removeTeamMember: (email) => {
    try {
      const currentList = teamStorage.getTeamMembers();
      const updatedList = currentList.filter((m) => m.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    } catch {
      return [];
    }
  },
};
