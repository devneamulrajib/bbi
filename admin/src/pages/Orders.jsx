import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets' 
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // <--- FIXED IMPORT
import { 
  Search, RefreshCcw, Download, Printer, Eye, X, 
  Trash2, CheckCircle, XCircle 
} from 'lucide-react'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]) 
  const [filteredOrders, setFilteredOrders] = useState([]) 
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [limitFilter, setLimitFilter] = useState('All') 
  const [methodFilter, setMethodFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // --- FETCH DATA ---
  const fetchAllOrders = async () => {
    if (!token) return
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- STATUS UPDATE ---
  const statusHandler = async (orderId, status = null, payment = null) => {
    try {
      let payload = { orderId };
      if(status) payload.status = status;
      if(payment !== null) payload.payment = payment;

      const response = await axios.post(backendUrl + '/api/order/status', payload, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders() 
        toast.success("Updated Successfully")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // --- DELETE ORDER ---
  const deleteOrderHandler = async (orderId) => {
    if(!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
        const response = await axios.post(backendUrl + '/api/order/delete', { orderId }, { headers: { token } })
        if (response.data.success) {
          toast.success(response.data.message)
          fetchAllOrders()
        } else {
          toast.error(response.data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  // --- FILTER LOGIC ---
  useEffect(() => {
    let result = [...orders];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(order => 
        order._id.toLowerCase().includes(lowerTerm) ||
        (order.address.firstName + " " + order.address.lastName).toLowerCase().includes(lowerTerm)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (methodFilter !== 'All') {
      result = result.filter(order => order.paymentMethod === methodFilter);
    }

    if (startDate && endDate) {
      const start = new Date(startDate).setHours(0,0,0,0);
      const end = new Date(endDate).setHours(23,59,59,999);
      result = result.filter(order => {
        const orderDate = new Date(order.date).getTime();
        return orderDate >= start && orderDate <= end;
      });
    }

    if (limitFilter !== 'All' && (!startDate || !endDate)) {
      const days = parseInt(limitFilter);
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - days);
      result = result.filter(order => new Date(order.date) >= limitDate);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, limitFilter, methodFilter, startDate, endDate, orders]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setLimitFilter('All');
    setMethodFilter('All');
    setStartDate('');
    setEndDate('');
  }

  // --- PDF GENERATOR (FIXED) ---
  const generateInvoice = (order) => {
    try {
        const doc = new jsPDF();
        const currency = '$'; 

        // 1. LOGO HANDLING
        try {
            if (assets.logo) {
                doc.addImage(assets.logo, 'PNG', 10, 10, 20, 20); 
            }
        } catch (imgError) {
            console.warn("Logo failed to load (ignoring):", imgError);
        }

        // 2. BRANDING TEXT
        doc.setFontSize(20);
        doc.setTextColor(0, 100, 0); // Green
        doc.text("BabaiBangladesh", 35, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("www.babaibangladesh.com", 35, 26);
        doc.text("Dhaka, Bangladesh", 35, 31);

        // 3. INVOICE INFO
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("INVOICE", 160, 20);
        doc.setFontSize(10);
        doc.text(`#${order._id.slice(-6).toUpperCase()}`, 160, 26);
        
        const orderDate = order.date ? new Date(order.date).toLocaleDateString() : 'N/A';
        doc.text(`Date: ${orderDate}`, 160, 32);

        // 4. BILL TO
        doc.text("Bill To:", 10, 50);
        doc.setTextColor(60);
        const fullName = `${order.address.firstName || ''} ${order.address.lastName || ''}`;
        doc.text(fullName, 10, 56);
        doc.text(order.address.phone || '', 10, 61);
        doc.text(`${order.address.street || ''}, ${order.address.city || ''}`, 10, 66);

        // 5. ITEMS TABLE
        const tableColumn = ["Item", "Size", "Qty", "Price", "Total"];
        const tableRows = [];
        
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                tableRows.push([
                    item.name,
                    item.size || 'N/A',
                    item.quantity,
                    `${currency}${item.price}`,
                    `${currency}${item.price * item.quantity}`,
                ]);
            });
        }

        // Use autoTable as a function call instead of doc.autoTable
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [0, 100, 0] }
        });

        // 6. TOTAL AMOUNT
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 10 : 100;
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text(`Total Amount: ${currency}${order.amount}`, 140, finalY);

        // 7. SAVE
        doc.save(`invoice_${order._id.slice(-6)}.pdf`);
    
    } catch (err) {
        console.error("PDF Generation Error:", err);
        toast.error("Failed to generate PDF. Check console.");
    }
  }

  // --- CSV EXPORT ---
  const downloadReport = () => {
    try {
        let csvContent = "data:text/csv;charset=utf-8,ID,Date,Name,Amount,Status,Method\n";
        filteredOrders.forEach(o => {
            const date = o.date ? new Date(o.date).toLocaleDateString() : 'N/A';
            const name = o.address ? `${o.address.firstName} ${o.address.lastName}` : 'Guest';
            csvContent += `${o._id},${date},${name},${o.amount},${o.status},${o.paymentMethod}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders.csv");
        document.body.appendChild(link);
        link.click();
    } catch (err) {
        toast.error("Failed to export CSV");
    }
  }

  useEffect(() => { fetchAllOrders() }, [token])

  return (
    <div className='w-full min-h-screen bg-gray-50 pb-10'>
      <h3 className='text-2xl font-bold mb-6 text-gray-800'>Order Management</h3>

      {/* FILTER BAR */}
      <div className='bg-white p-5 rounded-lg shadow mb-6'>
        <div className='flex flex-wrap gap-4 items-center justify-between mb-4'>
            {/* Search */}
            <div className='relative w-full md:w-64'>
                <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                <input 
                    type="text" 
                    placeholder="Search ID or Name..." 
                    className='w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Controls */}
            <div className='flex flex-wrap gap-2 text-sm'>
                <select className='border px-3 py-2 rounded outline-none' value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                    <option value="All">Status: All</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>

                <select className='border px-3 py-2 rounded outline-none' value={limitFilter} onChange={(e)=>setLimitFilter(e.target.value)}>
                    <option value="All">Time: All</option>
                    <option value="1">Last 24h</option>
                    <option value="7">Last 7d</option>
                    <option value="30">Last 30d</option>
                </select>

                <select className='border px-3 py-2 rounded outline-none' value={methodFilter} onChange={(e)=>setMethodFilter(e.target.value)}>
                    <option value="All">Method: All</option>
                    <option value="COD">COD</option>
                    <option value="Stripe">Stripe</option>
                </select>

                <button onClick={downloadReport} className='bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1'>
                    <Download size={16} /> Export
                </button>
            </div>
        </div>

        {/* Date Filters */}
        <div className='flex flex-wrap gap-4 items-center border-t pt-4 text-sm'>
            <div className='flex items-center gap-2'>
                <span className='text-gray-500'>From:</span>
                <input type="date" className='border px-2 py-1 rounded' value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
            </div>
            <div className='flex items-center gap-2'>
                <span className='text-gray-500'>To:</span>
                <input type="date" className='border px-2 py-1 rounded' value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
            </div>
            <button onClick={resetFilters} className='text-gray-500 hover:text-red-500 flex items-center gap-1 ml-auto'>
                <RefreshCcw size={14} /> Reset
            </button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
                <thead className='bg-gray-100 border-b text-xs uppercase text-gray-600'>
                    <tr>
                        <th className='p-4'>Invoice</th>
                        <th className='p-4'>Date</th>
                        <th className='p-4'>Customer</th>
                        <th className='p-4'>Payment</th>
                        <th className='p-4'>Amount</th>
                        <th className='p-4'>Status</th>
                        <th className='p-4'>Action</th>
                        <th className='p-4 text-center'>View</th>
                    </tr>
                </thead>
                <tbody className='text-sm text-gray-700'>
                    {filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
                        <tr key={index} className='hover:bg-gray-50 border-b'>
                            <td className='p-4 font-mono font-bold'>#{order._id.slice(-6).toUpperCase()}</td>
                            <td className='p-4'>
                                {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className='p-4 font-medium'>
                                {order.address.firstName} {order.address.lastName}
                                <div className='text-xs text-gray-400'>{order.address.phone}</div>
                            </td>
                            <td className='p-4'>
                                <div className='flex flex-col gap-1'>
                                    <span>{order.paymentMethod}</span>
                                    <button 
                                        onClick={()=>statusHandler(order._id, null, !order.payment)} 
                                        className={`flex items-center gap-1 text-xs border px-1.5 py-0.5 rounded w-fit cursor-pointer hover:bg-gray-100 ${order.payment ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}
                                    >
                                        {order.payment ? <><CheckCircle size={10}/> Paid</> : <><XCircle size={10}/> Pending</>}
                                    </button>
                                </div>
                            </td>
                            <td className='p-4 font-bold'>${order.amount}</td>
                            <td className='p-4'>
                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                      'bg-blue-100 text-blue-700'}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className='p-4'>
                                <div className='flex items-center gap-2'>
                                    <select 
                                        onChange={(e) => statusHandler(order._id, e.target.value)} 
                                        value={order.status} 
                                        className='border rounded text-xs py-1 px-1 focus:outline-none bg-white max-w-[100px]'
                                    >
                                        <option value="Order Placed">Placed</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button onClick={()=>deleteOrderHandler(order._id)} className='text-red-400 hover:text-red-600'>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                            <td className='p-4 flex gap-2 justify-center'>
                                <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className='text-blue-500 hover:bg-blue-50 p-1.5 rounded'>
                                    <Eye size={18} />
                                </button>
                                <button onClick={() => generateInvoice(order)} className='text-green-600 hover:bg-green-50 p-1.5 rounded'>
                                    <Printer size={18} />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="8" className='p-10 text-center text-gray-400'>No orders found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedOrder && (
          <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'>
              <div className='bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col'>
                  <div className='flex justify-between items-center p-4 border-b'>
                      <h2 className='font-bold text-lg'>Order Details</h2>
                      <button onClick={() => setShowModal(false)} className='text-gray-400 hover:text-red-500'><X size={24} /></button>
                  </div>
                  <div className='p-6 overflow-y-auto'>
                      {/* Branding */}
                      <div className='flex justify-between items-start mb-6'>
                          <div>
                              <div className='flex items-center gap-2'>
                                  <img src={assets.logo} className='h-8 w-auto' alt="logo" onError={(e) => e.target.style.display = 'none'} />
                                  <span className='text-xl font-bold text-green-700'>BabaiBangladesh</span>
                              </div>
                              <p className='text-xs text-gray-500 mt-1'>www.babaibangladesh.com</p>
                          </div>
                          <div className='text-right'>
                              <h1 className='text-2xl font-bold text-gray-800'>INVOICE</h1>
                              <p className='text-sm text-gray-500'>#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                              <p className='text-sm text-gray-500'>{selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : ''}</p>
                          </div>
                      </div>

                      {/* Content */}
                      <div className='grid grid-cols-2 gap-8 mb-6 text-sm'>
                          <div>
                              <h3 className='font-bold text-gray-700 border-b pb-1 mb-2'>Bill To</h3>
                              <p>{selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                              <p className='text-gray-500'>{selectedOrder.address.street}</p>
                              <p className='text-gray-500'>{selectedOrder.address.city}, {selectedOrder.address.zipcode}</p>
                              <p className='text-gray-500'>{selectedOrder.address.phone}</p>
                          </div>
                          <div>
                            <h3 className='font-bold text-gray-700 border-b pb-1 mb-2'>Status</h3>
                            <p>Payment: <span className='font-semibold'>{selectedOrder.paymentMethod}</span> ({selectedOrder.payment ? 'Paid' : 'Pending'})</p>
                            <p>Order Status: <span className='font-semibold text-blue-600'>{selectedOrder.status}</span></p>
                          </div>
                      </div>

                      <table className='w-full mb-6 border text-sm'>
                          <thead className='bg-gray-50 text-gray-700'>
                              <tr>
                                  <th className='p-2 text-left'>Item</th>
                                  <th className='p-2 text-center'>Qty</th>
                                  <th className='p-2 text-right'>Total</th>
                              </tr>
                          </thead>
                          <tbody>
                              {selectedOrder.items.map((item, i) => (
                                  <tr key={i} className='border-t'>
                                      <td className='p-2'>
                                          <p className='font-medium'>{item.name}</p>
                                          <span className='text-xs text-gray-500'>Size: {item.size}</span>
                                      </td>
                                      <td className='p-2 text-center'>x{item.quantity}</td>
                                      <td className='p-2 text-right font-medium'>${item.price * item.quantity}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>

                      <div className='flex justify-end text-lg font-bold text-gray-800'>
                          Total: ${selectedOrder.amount}
                      </div>
                  </div>
                  <div className='p-4 border-t bg-gray-50 flex justify-end'>
                      <button onClick={() => generateInvoice(selectedOrder)} className='bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700'>
                          <Printer size={16} /> Print Invoice
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}

export default Orders