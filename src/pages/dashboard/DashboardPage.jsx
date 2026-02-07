import React from 'react';
import { Eye, MousePointerClick, TrendingUp, Users, Phone, DollarSign, BarChart3, UserPlus } from 'lucide-react';

const KPICard = ({ title, value, percentage, icon: Icon, isPositive = true }) => {
  const textColor = isPositive ? 'text-green-500' : 'text-red-500';
  const bgColor = 'bg-white'; // The cards are white in the image
  
  // Adjusted icon background based on the image (subtle, light color)
  const iconBgColor = {
    Impressions: 'bg-blue-50',
    Clicks: 'bg-blue-50',
    Conversions: 'bg-blue-50',
    Leads: 'bg-blue-50',
    Contacts: 'bg-blue-50',
    'Cost Per Click': 'bg-blue-50',
    'Cost Per Conversion': 'bg-blue-50',
    'Average CPC': 'bg-blue-50',
  }[title] || 'bg-gray-50';

  return (
    <div className="flex-1 min-w-[200px] p-4 bg-white rounded-xl shadow-md border border-gray-100 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${iconBgColor} mb-3`}>
          <Icon size={18} className="text-blue-500" />
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp size={14} className={textColor} />
          <span className={`text-sm font-medium ${textColor}`}>
            {percentage}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

const FunnelStep = ({ label, value, color, width }) => (
  <div className="flex items-center justify-between mb-4">
    <span className="text-sm font-medium text-gray-700 w-32 text-left">{label}</span>
    <div className="flex items-center space-x-2 flex-1">
      <div className="h-4 rounded-full" style={{ width: width, backgroundColor: color }}></div>
      <span className="text-sm font-medium">{value}</span>
      <span className="text-xs text-gray-500 w-10 text-right">{(parseFloat(width) / 100).toFixed(1)}%</span>
    </div>
  </div>
);

const ConversionFunnel = () => {
  const funnelSteps = [
    { label: 'Impressions', value: '125 680', color: 'rgb(92, 161, 237)', width: '100%' },
    { label: 'Clicks', value: '4 250', color: 'rgb(245, 176, 65)', width: '3.4%' },
    { label: 'Conversions', value: '340', color: 'rgb(238, 120, 151)', width: '0.3%' },
    { label: 'Leads', value: '280', color: 'rgb(117, 190, 240)', width: '0.2%' },
    { label: 'Contacts', value: '156', color: 'rgb(235, 100, 92)', width: '0.1%' },
  ];

  const analysisSteps = [
    { label: 'Click Rate', value: '3.38%', isPositive: true, bg: 'bg-blue-50' },
    { label: 'Conversion Rate', value: '8.00%', isPositive: true, bg: 'bg-green-50' },
    { label: 'Lead Rate', value: '82.35%', isPositive: false, bg: 'bg-yellow-50' },
    { label: 'Contact Rate', value: '55.71%', isPositive: false, bg: 'bg-red-50' },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full">
      <div className="flex items-center space-x-2 mb-6">
        <UserPlus size={24} className="text-red-500" />
        <h2 className="text-xl font-semibold text-gray-800">Conversion Funnel</h2>
      </div>

      <div className="space-y-4 mb-8">
        {funnelSteps.map((step) => (
          <div key={step.label} className="flex items-center justify-between">
             <span className="text-sm font-medium text-gray-700 w-32 text-left">{step.label}</span>
             <div className="flex items-center space-x-2 flex-1 relative h-4">
                 {/* Background track (Impression width only) */}
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-full" />
                {/* Colored bar */}
                <div 
                    className="absolute top-0 left-0 h-full rounded-full" 
                    style={{ width: step.width, backgroundColor: step.color }} 
                />
                <div className="absolute top-0 left-0 h-full flex items-center">
                    <span className="text-xs font-medium text-white px-2" style={{ backgroundColor: step.color, borderRadius: '9999px', transform: 'translateY(-100%)' }}>
                        {step.value}
                    </span>
                </div>
                <span className="absolute right-0 text-xs text-gray-500">{step.width}</span>
             </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Drop-off Analysis</h3>
      <div className="grid grid-cols-2 gap-3">
        {analysisSteps.map((step) => (
          <div key={step.label} className={`p-2 rounded-lg ${step.bg}`}>
            <p className="text-xs text-gray-500">{step.label}</p>
            <span className={`text-sm font-semibold ${step.isPositive ? 'text-green-600' : 'text-red-500'}`}>{step.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PerformanceTrends = () => {
    // Simplified placeholder for a complex chart component
    const data = [
        { day: 'Sep 1', clicks: 800, conversions: 800 },
        { day: 'Sep 2', clicks: 820, conversions: 750 },
        { day: 'Sep 3', clicks: 750, conversions: 780 },
        { day: 'Sep 4', clicks: 850, conversions: 900 },
        { day: 'Sep 5', clicks: 760, conversions: 870 },
        { day: 'Sep 6', clicks: 800, conversions: 900 },
        { day: 'Sep 7', clicks: 800, conversions: 900 },
    ];
    const maxClicks = 850;
    const maxConversions = 900;
    const maxHeight = 150; // Max height for bars in pixels

    const ChartBar = ({ day, clicks, conversions }) => {
        const clicksHeight = (clicks / maxClicks) * maxHeight;
        const conversionsHeight = (conversions / maxConversions) * maxHeight;
        const totalHeight = Math.max(clicksHeight, conversionsHeight);
        
        return (
            <div className="flex flex-col items-center w-8 relative">
                {/* Bar Max Value Label (Placeholder for tooltip) */}
                {day === 'Sep 4' && (
                    <div className="absolute -top-6 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                        820
                    </div>
                )}
                <div className="flex h-[150px] items-end space-x-1">
                    {/* Clicks Bar (Blue) */}
                    <div 
                        className="w-3 bg-blue-500 rounded-t-md" 
                        style={{ height: `${clicksHeight}px` }} 
                        title={`Clicks: ${clicks}`}
                    ></div>
                    {/* Conversions Bar (Orange/Yellow) */}
                    <div 
                        className="w-3 bg-yellow-500 rounded-t-md" 
                        style={{ height: `${conversionsHeight}px` }}
                        title={`Conversions: ${conversions}`}
                    ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{day}</span>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full">
            <div className="flex items-center space-x-2 mb-8">
                <BarChart3 size={24} className="text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Performance Trends</h2>
            </div>
            
            <div className="relative flex justify-around items-end border-b border-gray-200" style={{ height: `${maxHeight + 20}px` }}>
                {data.map((item, index) => (
                    <ChartBar 
                        key={index} 
                        day={item.day} 
                        clicks={item.clicks} 
                        conversions={item.conversions} 
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-8">
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Clicks</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Conversions</span>
                </div>
            </div>
        </div>
    );
};

const DailyCostAnalysis = () => {
    const data = [
        { day: '1er sept', cost: 750 },
        { day: '2 sept', cost: 800 },
        { day: '3 sept', cost: 780 },
        { day: '4 sept', cost: 850 },
        { day: '5 sept', cost: 790 },
        { day: '6 sept', cost: 900 },
        { day: '7 sept', cost: 860 },
    ];
    const maxCost = 900;
    const maxHeight = 150; 

    const ChartBar = ({ day, cost }) => {
        const costHeight = (cost / maxCost) * maxHeight;
        
        return (
            <div className="flex flex-col items-center w-12 relative">
                <div className="h-[150px] flex items-end justify-center">
                    <div 
                        className="w-5 bg-yellow-500 rounded-t-md" 
                        style={{ height: `${costHeight}px` }} 
                        title={`Coût: ${cost}`}
                    ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2 rotate-[45deg] transform origin-top-left -ml-2">{day}</span>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full">
            <div className="flex items-center space-x-2 mb-8">
                <BarChart3 size={24} className="text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Analyse des coûts quotidiens</h2>
            </div>
            
            <div className="relative flex justify-around items-end border-b border-gray-200" style={{ height: `${maxHeight + 20}px` }}>
                {data.map((item, index) => (
                    <ChartBar 
                        key={index} 
                        day={item.day} 
                        cost={item.cost}
                    />
                ))}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"></div>
            </div>
        </div>
    );
};

const PerformanceSummary = () => {
    const metrics = [
        { label: 'Taux de clic', value: '3.38%', highlight: 'none' },
        { label: 'Taux de conversion', value: '8%', highlight: 'none' },
        { label: 'Dépenses publicitaires totales', value: '$2 850,5', highlight: 'none' },
        { label: 'Taux de conversion des prospects en contacts', value: '55.7%', highlight: 'none' },
        { label: 'Retour sur investissement publicitaire', value: '3.2x', highlight: 'green' },
        { label: 'Coût par prospect', value: '$10.18', highlight: 'none' },
    ];

    const MetricItem = ({ label, value, highlight }) => {
        let labelClasses = 'text-gray-700';
        let valueClasses = 'font-bold text-gray-900';
        let wrapperClasses = 'flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 transition-colors duration-200 hover:bg-gray-50/50';

        if (highlight === 'blue') {
            labelClasses = 'text-white font-medium';
            valueClasses = 'font-bold text-white';
            wrapperClasses = 'flex justify-between items-center py-3 px-2 -mx-2 rounded-lg bg-blue-500/80 last:border-b-0';
        } else if (highlight === 'green') {
            labelClasses = 'text-gray-700';
            valueClasses = 'font-bold text-green-600';
            wrapperClasses = 'flex justify-between items-center py-3 px-2 -mx-2 rounded-lg bg-green-50 last:border-b-0';
        }

        return (
            <div className={wrapperClasses}>
                <span className={`text-sm ${labelClasses}`}>{label}</span>
                <span className={`text-sm ${valueClasses}`}>{value}</span>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 h-full">
            <div className="flex items-center space-x-2 mb-6">
                <BarChart3 size={24} className="text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Résumé des performances</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {metrics.map((metric, index) => (
                    <MetricItem key={index} {...metric} />
                ))}
            </div>
        </div>
    );
};


const DashboardPage = () => {
  const [activeDateRange, setActiveDateRange] = React.useState('Last 90 days');

  const kpis = [
    { title: 'Impressions', value: '1456.9k', percentage: '24.6%', icon: Eye, isPositive: true },
    { title: 'Clicks', value: '48.2k', percentage: '19.8%', icon: MousePointerClick, isPositive: true },
    { title: 'Conversions', value: '3.7k', percentage: '11.5%', icon: TrendingUp, isPositive: true },
    { title: 'Leads', value: '2.9k', percentage: '28.4%', icon: Users, isPositive: true },
    { title: 'Contacts', value: '1.8k', percentage: '22.7%', icon: Phone, isPositive: true },
    { title: 'Cost Per Click', value: '$0.68', percentage: '1.2%', icon: DollarSign, isPositive: true },
    { title: 'Cost Per Conversion', value: '$8.92', percentage: '5.8%', icon: DollarSign, isPositive: false },
    { title: 'Average CPC', value: '$0.68', percentage: '1.2%', icon: DollarSign, isPositive: true },
  ];
  
  const handleDateRangeClick = (range) => {
    setActiveDateRange(range);
    console.log(`Date range selected: ${range}`);
  };

  const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900">Marketing Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your campaign performance and conversions</p>
      </header>
      
      {/* Date Range Selector */}
      <div className="flex space-x-3">
        {dateRanges.map((range) => (
          <button
            key={range}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activeDateRange === range
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleDateRangeClick(range)}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            percentage={kpi.percentage}
            icon={kpi.icon}
            isPositive={kpi.isPositive}
          />
        ))}
      </div>

      {/* New Charts/Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceTrends />
        <ConversionFunnel />
      </div>

      {/* New Charts (Daily Cost Analysis and Performance Summary) Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyCostAnalysis />
        <PerformanceSummary />
      </div>
    </div>
  );
};

export default DashboardPage;