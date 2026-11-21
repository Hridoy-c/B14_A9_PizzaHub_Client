const styles: Record<string, string> = {
  paid: "bg-[#5B7F3A]/15 text-[#3F7A2C]",
  unpaid: "bg-[#F2C14E]/25 text-[#7A5A00]",
  no_payment_required: "bg-[#EADBC8] text-[#7A6455]",
};

const PaymentStatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-wide ${
      styles[status] ?? "bg-[#EADBC8] text-[#7A6455]"
    }`}
  >
    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
    {status.replace(/_/g, " ")}
  </span>
);

export default PaymentStatusBadge;