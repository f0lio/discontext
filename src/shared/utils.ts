export const getENV = (
	key: string,
  required = false
): string => {
  const value = process.env[key];
  if (!value) {
    if (!required) return '';
    throw new Error(
      `Environment variable not set: ${key}`
    );
  }
  return value;
};

export const startCase = (str: string): string =>
  str ? str.replace(
    /\w\S*/g,
    function(txt: string) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }
  ) : '';