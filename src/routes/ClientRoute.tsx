import { Route } from 'react-router';

function ClientRoute() {
  return (
    <Route path="/" element={<div style={{ padding: '2rem' }}>Client Home Page (Simple)</div>} />
  );
}

export default ClientRoute;
