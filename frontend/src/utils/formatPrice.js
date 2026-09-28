/**
 * Format numerical prices into clear Indian Rupee currency format (INR)
 * Examples:
 *  4532000    => "₹45,32,000"
 *  12500000   => "₹1,25,00,000"
 *  "7500000"  => "₹75,00,000"
 *
 * @param {number|string} price - The raw price value
 * @returns {string} Formatted price string in Indian Rupee denomination
 */
export default function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "₹0";
  }

  const numericValue = Number(price);

  if (isNaN(numericValue)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
}
