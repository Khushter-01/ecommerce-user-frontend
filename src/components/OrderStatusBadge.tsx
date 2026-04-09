const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-info/10 text-info',
  shipped: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  const cls = statusColors[status?.toLowerCase()] || statusColors.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
