const formatPercentage = (percentage: number) => {
  return Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
    signDisplay: "always",
  }).format(percentage / 100);
};

export default formatPercentage;
