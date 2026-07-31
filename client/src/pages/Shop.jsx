import { products } from "../data/products";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);

export default function Shop() {
  return (
    <div className="shop-page">
      <h1>Shop</h1>
      <p>Find recommended tools, yarn, and knitting supplies.</p>

      <div className="shop-grid">
        {products.map((item) => (
          <div className="product-card">
            <img src={item.image} alt={item.title} className="image-standard" />

            {item.badge && <span className="badge">{item.badge}</span>}

            <h3 style={{ color: item.titleColor }}>{item.title}</h3>

            <p>{formatPrice(item.price)}</p>

            <a href={item.etsyUrl} target="_blank" rel="noreferrer">
              View on Etsy
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
