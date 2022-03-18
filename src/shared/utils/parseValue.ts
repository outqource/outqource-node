const checkJsonString = (value: string): boolean => {
  try {
    const result = JSON.parse(value);
    if (result && typeof result === "object") {
      return true;
    }
    throw new Error("not json");
  } catch (error) {
    return false;
  }
};

export const parseAutoValue = (value: string) => {
  const isNumberValue = Number(value);
  const isBooleanValue =
    value === "TRUE" ||
    value === "FALSE" ||
    value === "true" ||
    value === "false";
  const isJsonValue = checkJsonString(value);

  if (isNumberValue) {
    return isNumberValue;
  } else if (isBooleanValue) {
    return value === "TRUE" || value === "true";
  } else if (isJsonValue) {
    return JSON.parse(value);
  } else {
    return value;
  }
};

export const parseValue = (
  value: string,
  type: "string" | "boolean" | "number" | "json" | "auto" = "auto"
) => {
  switch (type) {
    case "string":
      return value;
    case "boolean":
      return value === "TRUE" || value === "true";
    case "number":
      return Number(value);
    case "json":
      return JSON.parse(value);
    case "auto":
      return parseAutoValue(value);
    default:
      return value;
  }
};
