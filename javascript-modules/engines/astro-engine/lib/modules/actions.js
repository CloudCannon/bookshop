export const actions = new Proxy({}, {
  get() {
    console.warn("[Bookshop] actions is not supported in Bookshop. Please use an editing fallback instead.");
    return () => {};
  }
});

export const defineAction = () => {
  console.warn("[Bookshop] defineAction is not supported in Bookshop. Please use an editing fallback instead.");
  return {
    handler: () => {},
    input: null
  };
};

export const isInputError = (error) => {
  console.warn("[Bookshop] isInputError is not supported in Bookshop. Please use an editing fallback instead.");
  return false;
};

export const isActionError = (error) => {
  console.warn("[Bookshop] isActionError is not supported in Bookshop. Please use an editing fallback instead.");
  return false;
};

export class ActionError extends Error {
  constructor(code, message) {
    super(message);
    console.warn("[Bookshop] ActionError is not supported in Bookshop. Please use an editing fallback instead.");
    this.code = code;
  }
}

export const getActionContext = (context) => {
  console.warn("[Bookshop] getActionContext is not supported in Bookshop. Please use an editing fallback instead.");
  return {
    action: undefined,
    setActionResult: () => {},
    serializeActionResult: () => ({})
  };
};

export const deserializeActionResult = (result) => {
  console.warn("[Bookshop] deserializeActionResult is not supported in Bookshop. Please use an editing fallback instead.");
  return {};
};

export const getActionPath = (action) => {
  console.warn("[Bookshop] getActionPath is not supported in Bookshop. Please use an editing fallback instead.");
  return '';
};
