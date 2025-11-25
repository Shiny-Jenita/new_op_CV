import React from "react";

interface Invoice {
  id: number;
  name: string;
  date: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onClose: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="border-2 border-gray-300 p-4 rounded-lg shadow-lg bg-white w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Invoices</h2>
          <button onClick={onClose} className="text-red-600 font-bold text-lg">
            ✕
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium text-gray-700 pb-2">View Invoice</th>
              <th className="text-left font-medium text-gray-700 pb-2">Date Issued</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="py-2">{invoice.name}</td>
                <td className="py-2">{invoice.date}</td>
                <td>
                  <button className="bg-sky-700 text-white px-3 py-1 rounded-md text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
