export const config = {
  lightControllerIp: process.env.LIGHT_CONTROLLER_IP || '192.168.1.47',
  zoneId: process.env.ZONE_ID || 'a0b76544fe9d',
} as const;