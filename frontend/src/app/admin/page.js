'use client';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Total Orders', value: '0' },
          { name: 'Total Revenue', value: '₹0' },
          { name: 'Active Retailers', value: '0' },
          { name: 'Total Companies', value: '0' },
        ].map((item) => (
          <div key={item.name} className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
            <p className="text-3xl font-bold mt-2 text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="flex gap-4">
          <a href="/admin/products" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Add New Product
          </a>
          <a href="/admin/orders" className="px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            View All Orders
          </a>
        </div>
      </div>
    </div>
  );
}
