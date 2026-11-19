import { useEffect, useRef, useState } from 'react';
import { Button } from '../../shared/components/ui/Button';
import { SelectField, TextField } from '../../shared/components/ui/Fields';
import { categories, categoryNames, defaultFilters, locations, locationNames, searchSchema, type Filters as FilterValues } from './model';
import { getProductPhoto } from './assets';

export function Filters({
  values,
  revision,
  apply,
  clear,
}: {
  values: FilterValues;
  revision: string;
  apply: (values: FilterValues) => void;
  clear: () => void;
}) {
  const [draft, setDraft] = useState(values);
  const [error, setError] = useState<string>();
  const [priceRange, setPriceRange] = useState(120);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const { q, category, location, sort } = values;

  useEffect(() => {
    // URL history replaces drafts without replacing focused form elements.
    setDraft({ q, category, location, sort });
    setError(undefined);
    if (!category) {
      setSelectedSize(null);
      setSelectedColor(null);
    }
  }, [q, category, location, sort, revision]);

  const featurePhoto = getProductPhoto('morning-bouquet');

  return (
    <aside className="fiama-filters-sidebar" aria-label="Catalog filters sidebar">
      <form
        className="catalog-filters"
        aria-label="Sample catalog filters"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = searchSchema.safeParse(draft.q);
          if (!parsed.success) {
            setError('Use 100 characters or fewer.');
            input.current?.focus();
            return;
          }
          setError(undefined);
          setDraft({ ...draft, q: parsed.data });
          apply({ ...draft, q: parsed.data });
        }}
      >
        {/* Search Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Search Catalog</h2>
          <TextField
            ref={input}
            label="Search"
            name="q"
            value={draft.q}
            onChange={(event) => setDraft({ ...draft, q: event.target.value })}
            hint="Search sample names and descriptions."
            error={error}
          />
        </div>

        {/* Collections / Categories Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Collections</h2>
          <SelectField
            label="Category"
            value={draft.category}
            onChange={(event) => setDraft({ ...draft, category: event.target.value as FilterValues['category'] })}
          >
            <option value="">All categories</option>
            {categories.map((value) => (
              <option key={value} value={value}>{categoryNames[value]}</option>
            ))}
          </SelectField>

          <ul className="collections-count-list">
            {[
              { id: 'bouquets', label: 'Bespoke Arrangements', count: 12 },
              { id: 'bouquets', label: 'Birthday Bouquets', count: 8 },
              { id: 'stems', label: 'Next Day Express Stems', count: 9 },
              { id: 'plants', label: 'Indoor Potted Plants', count: 8 },
              { id: 'bouquets', label: 'Wedding & Ceremonial', count: 7 },
            ].map((col, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className={`collection-row-btn ${draft.category === col.id ? 'is-active' : ''}`}
                  onClick={() => setDraft({ ...draft, category: col.id as FilterValues['category'] })}
                >
                  <span className="col-name">{col.label}</span>
                  <span className="col-count">({col.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Availability Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Availability</h2>
          <div className="availability-options">
            <label className="filter-checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>In stock <em>(27)</em></span>
            </label>
            <label className="filter-checkbox-label">
              <input type="checkbox" />
              <span>Out of stock <em>(3)</em></span>
            </label>
          </div>
        </div>

        {/* Price Slider Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Price Range</h2>
          <div className="price-slider-wrap">
            <div className="price-slider-labels">
              <span>$10</span>
              <span className="price-slider-current">Up to ${priceRange}</span>
              <span>$250</span>
            </div>
            <input
              type="range"
              min={10}
              max={250}
              step={5}
              value={priceRange}
              aria-label="Price range filter"
              className="fiama-range-slider"
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Size Pills Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Size</h2>
          <div className="size-pills-grid" role="group" aria-label="Size options">
            {[
              { size: 'S', count: 14 },
              { size: 'M', count: 22 },
              { size: 'L', count: 18 },
              { size: 'XL', count: 6 },
            ].map((item) => (
              <button
                key={item.size}
                type="button"
                className={`size-pill-btn ${selectedSize === item.size ? 'is-active' : ''}`}
                onClick={() => setSelectedSize(selectedSize === item.size ? null : item.size)}
              >
                <span>{item.size}</span>
                <span className="size-count">({item.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Swatches Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Color</h2>
          <div className="color-swatches-grid" role="group" aria-label="Color options">
            {[
              { name: 'White', color: '#FAF9F6', count: 12 },
              { name: 'Sage', color: '#6F967B', count: 8 },
              { name: 'Yellow', color: '#E8C547', count: 6 },
              { name: 'Blush', color: '#E8B4B8', count: 10 },
              { name: 'Orange', color: '#E07A5F', count: 5 },
              { name: 'Purple', color: '#8F7193', count: 4 },
            ].map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                className={`color-swatch-item ${selectedColor === swatch.name ? 'is-active' : ''}`}
                onClick={() => setSelectedColor(selectedColor === swatch.name ? null : swatch.name)}
              >
                <span
                  className="color-swatch-circle"
                  style={{ backgroundColor: swatch.color }}
                  aria-hidden="true"
                />
                <span className="swatch-label">{swatch.name}</span>
                <span className="swatch-count">({swatch.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Location</h2>
          <SelectField
            label="Location"
            value={draft.location}
            onChange={(event) => setDraft({ ...draft, location: event.target.value as FilterValues['location'] })}
          >
            <option value="">All locations</option>
            {locations.map((value) => (
              <option key={value} value={value}>{locationNames[value]}</option>
            ))}
          </SelectField>
        </div>

        {/* Sort Options Widget */}
        <div className="filter-widget">
          <h2 className="widget-title">Sort Options</h2>
          <SelectField
            label="Sort by"
            value={draft.sort}
            onChange={(event) => setDraft({ ...draft, sort: event.target.value as FilterValues['sort'] })}
          >
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </SelectField>
        </div>

        {/* Feature Product Miniature Widget (Screenshot 3) */}
        <div className="filter-widget feature-product-widget">
          <h2 className="widget-title">Feature Product</h2>
          <div className="feature-product-card">
            <div className="feature-thumb">
              <img src={featurePhoto.primary} alt={featurePhoto.alt} />
            </div>
            <div className="feature-info">
              <div className="feature-stars">★★★★★</div>
              <h4 className="feature-name">Morning Bouquet</h4>
              <div className="feature-pricing">
                <span className="price-new">$38.00</span>
                <span className="price-old">$48.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="catalog-filter-actions">
          <Button type="submit" variant="primary">Apply filters</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(defaultFilters);
              setSelectedSize(null);
              setSelectedColor(null);
              setPriceRange(120);
              setError(undefined);
              clear();
            }}
          >
            Clear filters
          </Button>
        </div>
      </form>
    </aside>
  );
}
