import { type FC, type ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'pill' | 'enclosed';
  fullWidth?: boolean;
  className?: string;
  onChange?: (tabId: string) => void;
}

const Tabs: FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'line',
  fullWidth = false,
  className = '',
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variants = {
    line: {
      list: 'border-b border-gray-200',
      tab: (isActive: boolean, isDisabled: boolean) => `
        py-2 px-4 border-b-2 -mb-px
        ${isActive
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
    pill: {
      list: 'space-x-2',
      tab: (isActive: boolean, isDisabled: boolean) => `
        py-2 px-4 rounded-full
        ${isActive
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
    enclosed: {
      list: 'space-x-1',
      tab: (isActive: boolean, isDisabled: boolean) => `
        py-2 px-4 rounded-t-lg border-t border-l border-r
        ${isActive
          ? 'bg-white border-gray-200 text-gray-900'
          : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${variants[variant].list}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={`
              ${variants[variant].tab(activeTab === tab.id, !!tab.disabled)}
              ${fullWidth ? 'flex-1' : ''}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition-colors duration-200
            `}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
