export const getEnvironment = (): 'development' | 'uat' | 'production' => {
  return (process.env.NODE_ENV as 'development' | 'uat' | 'production') || 'development';
};

export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

export const isUAT = (): boolean => {
  return getEnvironment() === 'uat';
};

export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

export const getEnvironmentName = (): string => {
  const env = getEnvironment();
  switch (env) {
    case 'development':
      return 'Development';
    case 'uat':
      return 'UAT';
    case 'production':
      return 'Production';
    default:
      return 'Unknown';
  }
};

export const getEnvironmentColor = (): string => {
  const env = getEnvironment();
  switch (env) {
    case 'development':
      return 'bg-yellow-500';
    case 'uat':
      return 'bg-orange-500';
    case 'production':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getEnvironmentBadge = () => {
  if (isProduction()) return null; // Don't show badge in production
  
  return {
    name: getEnvironmentName(),
    color: getEnvironmentColor(),
    textColor: 'text-white'
  };
}; 