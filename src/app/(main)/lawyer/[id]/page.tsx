'use client';

import Spinner from '@/components/spinner';
import { useParams } from 'next/navigation';
import { useGetLawyerById } from '../../_api/use-get-lawyer-by-id';

export default function LawyerIdPage() {
  const param = useParams();
  const { id } = param as { id: string };
  const { data, isLoading } = useGetLawyerById(id);

  if (isLoading) {
    return <Spinner />;
  }

  return <div>LawyerIdPage</div>;
}
