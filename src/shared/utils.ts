export const getENV = (
	key: string,
): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable not set: ${key}`
    );
  } else {
    return value;
  }
};

export const startCase = (str: string): string =>
  str ? str.replace(
    /\w\S*/g,
    function(txt: string) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }
  ) : '';