import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@/components/ui/dashboard.css";
import { useMemo, useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useOrderStore } from "@/stores/useOrderStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- Sub-Component: Thẻ thống kê ---
const StatItem = ({ title, value, icon, colorClass }: any) => {
  const softColor = colorClass.replace('text-', 'bg-soft-');
  return (
    <div className="col-lg-3 col-md-6">
      <div className="stat-box">
        <div className={`icon-container ${softColor}`}>
          <i className={`bi ${icon} fs-4`}></i>
        </div>
        <div className="stat-info">
          <div className="label fw-bold text-uppercase">{title}</div>
          <div className="value">{value}</div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Biểu đồ  (Lọc Giờ/Ngày/Tháng/Năm + Doanh thu) ---
const SalesGrowthChart = ({ orders }: { orders: any[] }) => {
  const [filterType, setFilterType] = useState<'hour' | 'day' | 'month' | 'year'>('month');

  const chartData = useMemo(() => {
    let dataMap: any[] = [];
    const now = new Date();

    if (filterType === 'hour') {
      dataMap = [...Array(24)].map((_, i) => ({ name: `${i}h`, key: i, pending: 0, completed: 0, cancelled: 0, revenue: 0 }));
      orders.forEach(o => {
        const d = new Date(o.createdAt);
        if (d.toDateString() === now.toDateString()) {
          const h = d.getHours();
          if (o.status === 'pending') dataMap[h].pending++;
          else if (o.status === 'completed') { dataMap[h].completed++; dataMap[h].revenue += o.totalAmount; }
          else if (o.status === 'cancelled') dataMap[h].cancelled++;
        }
      });
    } else if (filterType === 'day') {
      dataMap = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return { name: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), key: d.toDateString(), pending: 0, completed: 0, cancelled: 0, revenue: 0 };
      });
      orders.forEach(o => {
        const oDate = new Date(o.createdAt).toDateString();
        const found = dataMap.find(d => d.key === oDate);
        if (found) {
          if (o.status === 'pending') found.pending++;
          else if (o.status === 'completed') { found.completed++; found.revenue += o.totalAmount; }
          else if (o.status === 'cancelled') found.cancelled++;
        }
      });
    } else if (filterType === 'month') {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      dataMap = months.map(name => ({ name, pending: 0, completed: 0, cancelled: 0, revenue: 0 }));
      orders.forEach(o => {
        const mIdx = new Date(o.createdAt).getMonth();
        if (o.status === 'pending') dataMap[mIdx].pending++;
        else if (o.status === 'completed') { dataMap[mIdx].completed++; dataMap[mIdx].revenue += o.totalAmount; }
        else if (o.status === 'cancelled') dataMap[mIdx].cancelled++;
      });
    } else {
      const years = Array.from(new Set(orders.map(o => new Date(o.createdAt).getFullYear()))).sort();
      dataMap = years.map(y => ({ name: y.toString(), pending: 0, completed: 0, cancelled: 0, revenue: 0 }));
      orders.forEach(o => {
        const y = new Date(o.createdAt).getFullYear().toString();
        const found = dataMap.find(d => d.name === y);
        if (found) {
          if (o.status === 'pending') found.pending++;
          else if (o.status === 'completed') { found.completed++; found.revenue += o.totalAmount; }
          else if (o.status === 'cancelled') found.cancelled++;
        }
      });
    }
    return dataMap;
  }, [orders, filterType]);

  // Hàm định dạng tiền tệ cho Tooltip và Trục Y
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <div className="dashboard-card">
      <div className="card-header-admin d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="card-header-indicator"></div>
          <h6 className="mb-0">Biểu đồ doanh thu</h6>
        </div>
        <select
          className="form-select form-select-sm w-auto border-0 bg-light fw-bold shadow-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="hour">Hôm nay (Giờ)</option>
          <option value="day">7 ngày qua</option>
          <option value="month">Năm nay (Tháng)</option>
          <option value="year">Theo Năm</option>
        </select>
      </div>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="clrRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />

            {/* Trục Y trái cho Số lượng đơn */}
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />

            {/* Trục Y phải cho Doanh thu */}
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#f59e0b' }}
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
            />

            <Tooltip
              formatter={(value, name) => name === "Doanh thu" ? [formatCurrency(Number(value)), name] : [value, name]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" align="right" height={40} iconType="circle" />

            {/* Area Doanh thu (Màu vàng cam) */}
            <Area
              yAxisId="right" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#f59e0b" strokeWidth={2}
              fillOpacity={1} fill="url(#clrRev)"
            />

            {/* Các đường trạng thái đơn hàng */}
            <Area yAxisId="left" type="monotone" dataKey="completed" name="Hoàn thành" stroke="#16a34a" strokeWidth={3} fill="transparent" dot={{ r: 4 }} />
            <Area yAxisId="left" type="monotone" dataKey="pending" name="Đang xử lý" stroke="#0284c7" strokeWidth={3} fill="transparent" dot={{ r: 4 }} />
            <Area yAxisId="left" type="monotone" dataKey="cancelled" name="Đã hủy" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Donut Chart (Giữ nguyên) ---
const DonutChart = ({ counts, total }: { counts: any; total: number }) => {
  const size = 160; const strokeWidth = 18; const radius = (size - strokeWidth) / 2; const circumference = 2 * Math.PI * radius;
  const segments = useMemo(() => [
    { label: "Đang xử lý", val: counts.pending, color: "#0284c7" },
    { label: "Hoàn thành", val: counts.completed, color: "#16a34a" },
    { label: "Đã hủy", val: counts.cancelled, color: "#dc2626" },
  ], [counts]);
  let accumulatedOffset = 0;
  return (
    <div className="position-relative d-flex justify-content-center">
      <svg width={size} height={size}>
        <circle r={radius} cx={size / 2} cy={size / 2} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          if (seg.val === 0) return null;
          const dash = (seg.val / total) * circumference; const offset = accumulatedOffset; accumulatedOffset += dash;
          return <circle key={i} r={radius} cx={size / 2} cy={size / 2} fill="none" stroke={seg.color} strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circumference}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dasharray 0.8s ease' }} />;
        })}
      </svg>
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <div className="text-muted small" style={{ fontSize: '0.7rem' }}>TỔNG CỘNG</div>
        <div className="fw-bold h4 mb-0">{total}</div>
      </div>
    </div>
  );
};

// --- Main Dashboard Page ---
const DashboardPage = () => {
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => { fetchProducts(); fetchOrders(); }, [fetchProducts, fetchOrders]);

  const statsData = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === "completed");
    const totalRev = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const todayStr = new Date().toDateString();
    const todayRev = completedOrders.filter(o => o.createdAt && new Date(o.createdAt).toDateString() === todayStr).reduce((sum, o) => sum + o.totalAmount, 0);
    const counts = { pending: 0, completed: 0, cancelled: 0 };
    orders.forEach(o => { if (o.status in counts) counts[o.status as keyof typeof counts]++; });
    return { totalRev, todayRev, counts };
  }, [orders]);

  const statCards = [
    { title: "Sản phẩm", value: products.length, icon: "bi-box-seam", colorClass: "text-primary" },
    { title: "Đơn hàng", value: orders.length, icon: "bi-cart3", colorClass: "text-success" },
    { title: "Doanh thu", value: `${statsData.totalRev.toLocaleString()}đ`, icon: "bi-currency-dollar", colorClass: "text-warning" },
    { title: "Hôm nay", value: `${statsData.todayRev.toLocaleString()}đ`, icon: "bi-graph-up-arrow", colorClass: "text-danger" },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="row g-3 mb-4">{statCards.map((s, i) => <StatItem key={i} {...s} />)}</div>
      <div className="row g-4">
        <div className="col-lg-8"><SalesGrowthChart orders={orders} /></div>
        <div className="col-lg-4">
          <div className="dashboard-card">
            <div className="card-header-admin"><div className="card-header-indicator" style={{ backgroundColor: '#10b981' }}></div><h6>Phân tích đơn hàng</h6></div>
            <div className="py-3"><DonutChart counts={statsData.counts} total={orders.length || 1} /></div>
            <div className="mt-4">
              {[{ label: "Đang xử lý", val: statsData.counts.pending, color: "#0284c7" }, { label: "Hoàn thành", val: statsData.counts.completed, color: "#16a34a" }, { label: "Đã hủy", val: statsData.counts.cancelled, color: "#dc2626" }].map((item, i) => (
                <div key={i} className="status-row"><span className="status-label"><span className="dot" style={{ backgroundColor: item.color }}></span>{item.label}</span><span className="fw-bold">{item.val}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;