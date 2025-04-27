import { CrimeTable } from '../_components/crime-table';

export default function CrimeDashboard() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Crime Dashboard</h1>
      <CrimeTable />
    </div>
  );
}
