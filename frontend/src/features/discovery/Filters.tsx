import { useEffect, useRef, useState } from 'react';
import { Button } from '../../shared/components/ui/Button';
import { SelectField, TextField } from '../../shared/components/ui/Fields';
import { categories, categoryNames, defaultFilters, locations, locationNames, searchSchema, type Filters as FilterValues } from './model';

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
  const input = useRef<HTMLInputElement>(null);
  const { q, category, location, sort } = values;

  useEffect(() => {
    // URL history replaces drafts without replacing focused form elements.
    setDraft({ q, category, location, sort });
    setError(undefined);
  }, [q, category, location, sort, revision]);

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

        <div className="filter-widget">
          <h2 className="widget-title">Categories</h2>
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
          <div className="category-quick-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${draft.category === cat ? 'is-active' : ''}`}
                onClick={() => setDraft({ ...draft, category: draft.category === cat ? '' : cat })}
              >
                {categoryNames[cat]}
              </button>
            ))}
          </div>
        </div>

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

        <div className="filter-widget">
          <h2 className="widget-title">Color Palette</h2>
          <div className="color-swatches" role="group" aria-label="Color options">
            {[
              { name: 'Botanical Green', color: '#244C3A' },
              { name: 'Sage Green', color: '#6F967B' },
              { name: 'Golden Ochre', color: '#D9A85F' },
              { name: 'Soft Cream', color: '#F5F3E9' },
              { name: 'Blush Rose', color: '#D48C8C' },
            ].map((swatch) => (
              <span
                key={swatch.name}
                className="color-swatch-circle"
                style={{ backgroundColor: swatch.color }}
                title={swatch.name}
                aria-label={swatch.name}
              />
            ))}
          </div>
        </div>

        <div className="catalog-filter-actions">
          <Button type="submit" variant="primary">Apply filters</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(defaultFilters);
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
