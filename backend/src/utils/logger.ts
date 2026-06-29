const SENSITIVE_KEYS = [
  'password', 'pin', 'cvv', 'cardnumber', 'pan', 'aadhaar', 'ssn', 
  'currentpassword', 'newpassword', 'twofactorsecret', 'otp', 'token', 'refreshtoken'
];

export const maskSensitiveData = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(maskSensitiveData);
  }

  const masked: any = {};
  for (const key of Object.keys(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
      masked[key] = '[MASKED]';
    } else if (typeof obj[key] === 'object') {
      masked[key] = maskSensitiveData(obj[key]);
    } else {
      masked[key] = obj[key];
    }
  }
  return masked;
};

const formatMessage = (level: string, message: string, meta?: any): string => {
  const logObj: any = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (meta) {
    if (meta instanceof Error) {
      logObj.error = {
        message: meta.message,
        stack: meta.stack
      };
    } else {
      logObj.meta = maskSensitiveData(meta);
    }
  }

  return JSON.stringify(logObj);
};

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(formatMessage('INFO', message, meta));
  },
  warn: (message: string, meta?: any) => {
    console.warn(formatMessage('WARN', message, meta));
  },
  error: (message: string, meta?: any) => {
    console.error(formatMessage('ERROR', message, meta));
  }
};
