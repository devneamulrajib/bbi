import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { toast } from 'react-toastify';

const Dashboard = ({ url, token }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper for Currency
  const currency = "$"; 

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return; // Wait for token

        const response = await axios.get(`${url}/api/order/dashboard`, {
            headers: { token }
        });
        
        if (response.data.success) {
          setData(response.data);
        } else {
            toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, token]);

  // PDF Generator
  const generatePDF = (order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 10, 40);
    doc.text(`Date: ${moment(order.date).format('LLL')}`, 10, 50);
    
    // Customer Info
    const fName = order.address?.firstName || "";
    const lName = order.address?.lastName || "";
    doc.text(`Customer: ${fName} ${lName}`, 10, 60);
    doc.text(`Email: ${order.address?.email || "N/A"}`, 10, 70);

    // AutoTable for items
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
      const itemData = [
        item.name,
        item.quantity,
        `$${item.price}`,
        `$${item.price * item.quantity}`,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
    });

    // Final Amount
    doc.text(`Total Amount: $${order.amount}`, 140, doc.lastAutoTable.finalY + 15);
    
    doc.save(`invoice_${order._id}.pdf`);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Error loading data. Please refresh.</div>;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-800">{currency}{data.stats.totalRevenue}</h3>
          <p className="text-xs text-blue-500 mt-1">
            {currency}{data.stats.todaysRevenue} today
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-400">
          <p className="text-gray-500 text-sm">Orders Pending</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.stats.pendingOrders}</h3>
          <p className="text-xs text-gray-400 mt-1">Action needed</p>
        </div>

        {/* Processing */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500">
          <p className="text-gray-500 text-sm">Processing</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.stats.processingOrders}</h3>
          <p className="text-xs text-gray-400 mt-1">Being prepared</p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Delivered</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.stats.deliveredOrders}</h3>
          <p className="text-xs text-green-600 mt-1">Completed orders</p>
        </div>
      </div>

      {/* 2. CHARTS & BEST SELLERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Sales Chart */}
        <div className="bg-white p-5 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Sales Report (Last 7 Days)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${currency}${value}`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "5px" }} 
                    itemStyle={{ color: "#4F46E5" }}
                    formatter={(value) => [`${currency}${value}`, "Sales"]}
                />
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Best Selling Products</h2>
          <div className="flex flex-col gap-4">
            {data.bestSellers.length > 0 ? (
                data.bestSellers.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-bold text-sm">#{idx + 1}</span>
                        <div>
                            <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.count} units sold</p>
                        </div>
                    </div>
                    <p className="font-bold text-gray-700 text-sm">{currency}{product.revenue}</p>
                </div>
                ))
            ) : (
                <p className="text-gray-400 text-sm">No sales data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. RECENT ORDERS TABLE */}
      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-3 rounded-tl">Invoice No</th>
                <th className="p-3">Order Time</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Method</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-tr">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {data.recentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="p-3 font-medium text-gray-800">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-3 text-gray-500">{moment(order.date).format("MMM Do, h:mm a")}</td>
                  <td className="p-3">
                    {order.address ? `${order.address.firstName} ${order.address.lastName}` : "Guest User"}
                  </td>
                  <td className="p-3">{order.paymentMethod}</td>
                  <td className="p-3 font-bold">{currency}{order.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Pending' || order.status === 'Order Placed' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => generatePDF(order)}
                      className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-700 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;