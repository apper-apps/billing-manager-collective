import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { variant: "draft", label: "Draft" },
    sent: { variant: "sent", label: "Sent" },
    paid: { variant: "paid", label: "Paid" },
    overdue: { variant: "overdue", label: "Overdue" }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;