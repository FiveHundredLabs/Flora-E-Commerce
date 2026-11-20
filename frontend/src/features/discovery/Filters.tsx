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

        {/* Filter Action Buttons */}
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
