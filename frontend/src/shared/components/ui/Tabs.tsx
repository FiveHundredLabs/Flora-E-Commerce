import {
  useId,
  useState,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

export type TabItem = {
  id: string;
  label: string;
  badge?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
};

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  className = '',
}: {
  tabs: readonly TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}) {
  const baseId = useId();
  const [internalActive, setInternalActive] = useState(
    defaultTab ?? tabs[0]?.id ?? ''
  );
  const activeId = controlledActiveTab ?? internalActive;
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string, focusButton = false) => {
    setInternalActive(id);
    onChange?.(id);
    if (focusButton) {
      requestAnimationFrame(() => {
        const btn = tabListRef.current?.querySelector<HTMLButtonElement>(`#${baseId}-tab-${id}`);
        btn?.focus();
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    if (enabledTabs.length === 0) return;
    const currentIndex = enabledTabs.findIndex((t) => t.id === activeId);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = enabledTabs[(currentIndex + 1) % enabledTabs.length];
      if (next) handleSelect(next.id, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length];
      if (prev) handleSelect(prev.id, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = enabledTabs[0];
      if (first) handleSelect(first.id, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = enabledTabs[enabledTabs.length - 1];
      if (last) handleSelect(last.id, true);
    }
  };

  const activeContent = tabs.find((t) => t.id === activeId)?.content;

  return (
    <div className={`tabs ${className}`.trim()}>
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Navigation tabs"
        className="tabs__list"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeId;
          const tabElementId = `${baseId}-tab-${tab.id}`;
          const panelElementId = `${baseId}-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              type="button"
              id={tabElementId}
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelElementId}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              className={`tabs__trigger ${isSelected ? 'is-active' : ''}`.trim()}
              onClick={() => handleSelect(tab.id)}
            >
              <span className="tabs__label">{tab.label}</span>
              {tab.badge && <span className="tabs__badge">{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeId}`}
        tabIndex={0}
        className="tabs__panel"
      >
        {activeContent}
      </div>
    </div>
  );
}
