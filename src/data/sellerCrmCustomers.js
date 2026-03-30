export const CRM_STATUSES = [
  'New Lead',
  'Contacted',
  'Site Survey',
  'Proposal Sent',
  'Deal Closed',
  'Installation In Progress',
  'Completed',
];

export const CRM_STATUS_BADGE_CLASS = {
  'New Lead': 'seller-crm-status seller-crm-status--new',
  Contacted: 'seller-crm-status seller-crm-status--contacted',
  'Site Survey': 'seller-crm-status seller-crm-status--survey',
  'Proposal Sent': 'seller-crm-status seller-crm-status--proposal',
  'Deal Closed': 'seller-crm-status seller-crm-status--deal',
  'Installation In Progress': 'seller-crm-status seller-crm-status--install',
  Completed: 'seller-crm-status seller-crm-status--completed',
};

export const CRM_PROGRESS_STEPS = [
  'Lead Created',
  'Contacted',
  'Site Survey',
  'Proposal Sent',
  'Deal Closed',
  'Installation Started',
  'Installation Completed',
];

export const CRM_STATUS_TO_STEP = {
  'New Lead': 'Lead Created',
  Contacted: 'Contacted',
  'Site Survey': 'Site Survey',
  'Proposal Sent': 'Proposal Sent',
  'Deal Closed': 'Deal Closed',
  'Installation In Progress': 'Installation Started',
  Completed: 'Installation Completed',
};

export function getCompletedStepIndexByStatus(status) {
  const step = CRM_STATUS_TO_STEP[status] || 'Lead Created';
  const idx = CRM_PROGRESS_STEPS.indexOf(step);
  return Math.max(0, idx);
}

export const CRM_DUMMY_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Rohit Sharma',
    phone: '9876543210',
    city: 'Indore',
    address: 'Vijay Nagar, Indore, MP',
    systemSize: '3KW',
    assignedStaff: 'Demo Manager',
    status: 'New Lead',
  },
  {
    id: 'cust-2',
    name: 'Neha Verma',
    phone: '9988776655',
    city: 'Bhopal',
    address: 'Arera Colony, Bhopal, MP',
    systemSize: '5KW',
    assignedStaff: 'Sales Executive',
    status: 'Site Survey',
  },
  {
    id: 'cust-3',
    name: 'Amit Patel',
    phone: '9123456780',
    city: 'Ujjain',
    address: 'Freeganj, Ujjain, MP',
    systemSize: '10KW',
    assignedStaff: 'Technician',
    status: 'Installation In Progress',
  },
];

