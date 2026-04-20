import SpinningWheel from '../assets/SpinningWheel.JPG';

export default function Shop() {
  return (
    <div className="shop-page">
      <h1>Shop</h1>
      <p>Find recommended tools, yarn, and knitting supplies.</p>
      <img src={SpinningWheel} alt="A spinning wheel with a basket of handspun yarn sitting next to it"/>

      <div className="shop-controls">
        <input type="text" placeholder="Search products..." />

        <select>
          <option value="">All categories</option>
          <option value="yarn">Yarn</option>
          <option value="needles">Needles</option>
          <option value="tools">Tools</option>
        </select>
      </div>

      <div className="shop-grid">
        <div className="shop-card">
          <h3>Interchangeable Needle Set</h3>
          <p>Flexible set for multiple projects and sizes.</p>
        </div>

        <div className="shop-card">
          <h3>Merino Wool Yarn</h3>
          <p>Soft, warm yarn great for garments.</p>
        </div>

        <div className="shop-card">
          <h3>Row Counter</h3>
          <p>Simple tool to track rows in complex patterns.</p>
        </div>
      </div>
    </div>
  );
}