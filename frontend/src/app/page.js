export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
        Shree Arihant Traders
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
        B2B Wholesale Food Ordering Platform. Advanced inventory management and retailer ordering system.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/login"
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Customer Login
        </a>
        <a href="/browse" className="text-sm font-semibold leading-6">
          Browse Products <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
