import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const PageComingSoon = React.lazy(() => import('./modules/PageComingSoon'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', name: 'Home', component: DefaultLayout, exact: true },
  { path: '/dashboard', name: 'Dashboard', component: PageComingSoon, exact: true },

  { path: '/candidates', name: 'Job Candidates', component: React.lazy(() => import('./modules/PageJobCandidates')), exact: true },
  { path: '/candidates/:id', name: 'Job Candidate Information', component: React.lazy(() => import('./modules/PageJobCandidateDetail')), exact: true },
  { path: '/candidates/:id/application', name: 'Job Application', component: React.lazy(() => import('./modules/PageJobCandidateApplication')), exact: true },
  { path: '/candidates/:id/phone-screen', name: 'Phone Screen', component: React.lazy(() => import('./modules/PagePhoneScreen')), exact: true },
  { path: '/candidates/:id/in-person-interview', name: 'In-Person Interview', component: React.lazy(() => import('./modules/PageInPersonInterview')), exact: true },

  { path: '/employees', name: 'Employees', component: React.lazy(() => import('./modules/PageEmployees')), exact: true },
  { path: '/employees/:id', name: 'Employee Information', component: React.lazy(() => import('./modules/PageEmployeeDetail')), exact: true },
  { path: '/employees/:id/application', name: 'Job Application', component: PageComingSoon, exact: true },
  { path: '/employees/:id/phone-screen', name: 'Phone Screen', component: React.lazy(() => import('./modules/PagePhoneScreen')), exact: true },
  { path: '/employees/:id/in-person-interview', name: 'In Person Interview', component: React.lazy(() => import('./modules/PageInPersonInterview')), exact: true },
  { path: '/employees/:id/exit-interview', name: 'Exit Interview', component: React.lazy(() => import('./modules/PageExitInterview')), exact: true },
  { path: '/employees/:id/schedule', name: 'Schedule', component: PageComingSoon, exact: true },

  { path: '/leads', name: 'Leads', component: React.lazy(() => import('./modules/PageLeads')), exact: true },
  { path: '/leads/:id', name: 'Lead Information', component: React.lazy(() => import('./modules/PageLeadDetail')), exact: true },

  { path: '/customers', name: 'Customers', component: React.lazy(() => import('./modules/PageCustomers')), exact: true },
  { path: '/customers/:id', name: 'Customer Information', component: React.lazy(() => import('./modules/PageCustomerDetail')), exact: true },
  
  { path: '/schedule', name: 'Schedule', component: React.lazy(() => import("./modules/PageSchedule")), exact: true },
  { path: '/time-entries', name: 'Time Entries', component: React.lazy(() => import('./modules/PageTimeEntries')), exact: true },

  { path: '/users', name: 'Users', component: React.lazy(() => import('./modules/PageUsers')), exact: true},
  { path: '/users/:id', name: 'User Details', component: React.lazy(() => import('./modules/PageUserDetails')), exact: true},

  { path: '/settings', name: 'System Settings', component: React.lazy(() => import('./modules/PageSettings'))},

  { path: '/referral-sources', name: 'Customers', component: PageComingSoon, exact: true },
  { path: '/licensed-agencies', name: 'Customers', component: PageComingSoon, exact: true },

];

export default routes;

