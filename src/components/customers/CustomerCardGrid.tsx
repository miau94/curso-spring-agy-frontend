import React from 'react';
import type { CustomerDto } from '../../types/api';
import { CustomerCard } from './CustomerCard';

interface CustomerCardGridProps {
  customers: CustomerDto[];
  isAdmin: boolean;
  onViewDetail: (id?: number) => void;
  onEdit: (customer: CustomerDto) => void;
  onDelete: (customer: CustomerDto) => void;
}

export const CustomerCardGrid: React.FC<CustomerCardGridProps> = ({
  customers,
  isAdmin,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          isAdmin={isAdmin}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
