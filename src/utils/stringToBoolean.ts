export const stringToBoolean = (val: string): boolean => {
   return val.toLowerCase()?.trim() === 'true';
};
