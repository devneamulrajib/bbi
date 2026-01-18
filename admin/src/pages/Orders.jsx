import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets' 
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' 
import { 
  Search, RefreshCcw, Download, Printer, Eye, X, 
  Trash2, CheckCircle, XCircle, Bike 
} from 'lucide-react'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]) 
  const [filteredOrders, setFilteredOrders] = useState([]) 
  const [riders, setRiders] = useState([]) // State for Riders
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

  // --- FETCH ORDERS ---
  const fetchAllOrders = async () => {
    if (!token) return
    try {
      const response = await axios.post(backendUrl + '/api/user/list', {}, { headers: { token } }) // Note: Route might differ based on your route file, assumed /api/user/list based on context or /api/order/list
      // Based on previous context, usually it is /api/order/list, but if you moved it to userRoute, check path. 
      // I will use your previous file's path:
      // If your backend/routes/userRoute.js has 'userRouter.get('/list', ... allUsers)', that's users.
      // Orders usually reside in orderRoute. Assuming standard order route:
      const orderRes = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      
      if (orderRes.data.success) {
        setOrders(orderRes.data.orders)
      } else {
        toast.error(orderRes.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- FETCH RIDERS (New) ---
  const fetchRiders = async () => {
    try {
      // Fetching staff from the user/staff/list route we created
      const response = await axios.get(backendUrl + '/api/user/staff/list', { headers: { token } })
      if (response.data.success) {
        // Filter only staff with role 'Deliveryman'
        const deliveryMen = response.data.staff.filter(member => member.role === 'Deliveryman')
        setRiders(deliveryMen)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // --- ASSIGN RIDER HANDLER (New) ---
  const assignRiderHandler = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      const response = await axios.post(backendUrl + '/api/user/order/assign', { orderId, riderId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchAllOrders() // Refresh orders to show assigned rider
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
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

  // --- PDF GENERATOR ---
  const generateInvoice = (order) => {
    try {
        const doc = new jsPDF();
        const currency = 'Tk '; 

        try {
            if (assets.logo) {
                doc.addImage(assets.logo, 'PNG', 10, 10, 20, 20); 
            }
        } catch (imgError) {
            console.warn("Logo failed to load");
        }

        doc.setFontSize(20);
        doc.setTextColor(0, 100, 0); 
        doc.text("BabaiBangladesh", 35, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("www.babaibangladesh.com", 35, 26);
        doc.text("Dhaka, Bangladesh", 35, 31);

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("INVOICE", 160, 20);
        
        doc.setFontSize(10);
        doc.text(`#${order._id.slice(-6).toUpperCase()}`, 160, 26);
        const orderDate = order.date ? new Date(order.date).toLocaleDateString() : 'N/A';
        doc.text(`Date: ${orderDate}`, 160, 31);

        const paymentStatus = order.payment ? "PAID" : "UNPAID";
        doc.setFontSize(12);
        if (order.payment) {
            doc.setTextColor(0, 128, 0); 
        } else {
            doc.setTextColor(200, 0, 0); 
        }
        doc.text(paymentStatus, 160, 38);
        doc.setTextColor(0); 

        doc.setFontSize(10);
        doc.text("Bill To:", 10, 50);
        doc.setTextColor(60);
        const fullName = `${order.address.firstName || ''} ${order.address.lastName || ''}`;
        doc.text(fullName, 10, 56);
        doc.text(order.address.phone || '', 10, 61);
        doc.text(`${order.address.street || ''}, ${order.address.city || ''}`, 10, 66);

        const tableColumn = ["Item", "Size", "Qty", "Price", "Total"];
        const tableRows = [];
        let subtotal = 0;

        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                tableRows.push([
                    item.name,
                    item.size || '-',
                    item.quantity,
                    `${currency}${item.price}`,
                    `${currency}${itemTotal}`,
                ]);
            });
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [0, 100, 0] }
        });

        let deliveryCharge = order.deliveryCharge || (order.amount > subtotal ? order.amount - subtotal : 0);
        let discount = order.discount || 0; 
        
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 10 : 100;
        
        doc.setTextColor(0);
        doc.setFontSize(10);

        const xLabel = 140;
        const xValue = 190;
        let currentY = finalY;

        doc.text("Subtotal:", xLabel, currentY);
        doc.text(`${currency}${subtotal}`, xValue, currentY, { align: 'right' });
        currentY += 6;

        doc.text("Delivery Charge:", xLabel, currentY);
        doc.text(`${currency}${deliveryCharge}`, xValue, currentY, { align: 'right' });
        currentY += 6;

        if (order.coupon || discount > 0) {
            doc.setTextColor(0, 100, 0); 
            doc.text(`Discount (${order.coupon || 'Coupon'}):`, xLabel, currentY);
            doc.text(`-${currency}${discount}`, xValue, currentY, { align: 'right' });
            doc.setTextColor(0);
            currentY += 6;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", xLabel, currentY + 2);
        doc.text(`${currency}${order.amount}`, xValue, currentY + 2, { align: 'right' });

        doc.save(`invoice_${order._id.slice(-6)}.pdf`);
    
    } catch (err) {
        console.error("PDF Generation Error:", err);
        toast.error("Failed to generate PDF. Check console.");
    }
  }

  // --- CSV EXPORT ---
  const downloadReport = () => {
    try {
        let csvContent = "data:text/csv;charset=utf-8,ID,Date,Name,Total,Status,Payment,Rider\n";
        filteredOrders.forEach(o => {
            const date = o.date ? new Date(o.date).toLocaleDateString() : 'N/A';
            const name = o.address ? `${o.address.firstName} ${o.address.lastName}` : 'Guest';
            // Need to find rider name from riders array if only ID is in order, 
            // but usually backend populates it or we check riders state. 
            // For now simple CSV.
            csvContent += `${o._id},${date},${name},${o.amount},${o.status},${o.paymentMethod},${o.rider || 'Unassigned'}\n`;
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

  useEffect(() => { 
    if(token){
      fetchAllOrders();
      fetchRiders(); // Fetch riders when component loads
    }
  }, [token])

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
                        <th className='p-4'>Rider</th> {/* New Column */}
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
                            
                            {/* --- ASSIGN RIDER COLUMN --- */}
                            <td className='p-4'>
                                <div className='flex items-center gap-1'>
                                  <Bike size={16} className="text-gray-400"/>
                                  <select 
                                      onChange={(e) => assignRiderHandler(order._id, e.target.value)} 
                                      value={order.rider || ""} 
                                      className='border rounded text-xs py-1 px-1 focus:outline-none bg-white max-w-[120px]'
                                  >
                                      <option value="">Select Rider</option>
                                      {riders.map((r) => (
                                          <option key={r._id} value={r._id}>
                                              {r.name}
                                          </option>
                                      ))}
                                  </select>
                                </div>
                            </td>

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
                        <tr><td colSpan="9" className='p-10 text-center text-gray-400'>No orders found.</td></tr>
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
                              <p className={`font-bold mt-1 ${selectedOrder.payment ? 'text-green-600' : 'text-red-500'}`}>
                                  {selectedOrder.payment ? "PAID" : "UNPAID"}
                              </p>
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
                            <h3 className='font-bold text-gray-700 border-b pb-1 mb-2'>Details</h3>
                            <p>Method: <span className='font-semibold'>{selectedOrder.paymentMethod}</span></p>
                            <p>Status: <span className='font-semibold text-blue-600'>{selectedOrder.status}</span></p>
                            
                            {/* Rider Info in Modal */}
                            {selectedOrder.rider && (
                                <p className='mt-2 bg-blue-50 p-1 rounded'>
                                    <span className='font-semibold text-blue-700'>Assigned Rider ID:</span> 
                                    <br/>{selectedOrder.rider}
                                </p>
                            )}

                            {selectedOrder.coupon && <p className='text-green-600 mt-1'>Coupon Used: {selectedOrder.coupon}</p>}
                          </div>
                      </div>

                      <table className='w-full mb-4 border text-sm'>
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

                      <div className='flex justify-end'>
                          <div className='w-48 text-sm'>
                              {(() => {
                                  const subtotal = selectedOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                                  const delivery = selectedOrder.deliveryCharge || (selectedOrder.amount > subtotal ? selectedOrder.amount - subtotal : 0);
                                  return (
                                      <>
                                        <div className='flex justify-between py-1 border-b'>
                                            <span className='text-gray-600'>Subtotal:</span>
                                            <span>${subtotal}</span>
                                        </div>
                                        <div className='flex justify-between py-1 border-b'>
                                            <span className='text-gray-600'>Delivery:</span>
                                            <span>${delivery}</span>
                                        </div>
                                        <div className='flex justify-between py-2 text-lg font-bold text-gray-800'>
                                            <span>Total:</span>
                                            <span>${selectedOrder.amount}</span>
                                        </div>
                                      </>
                                  )
                              })()}
                          </div>
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