type Arguments = { message: string  };

export default {
  ...{
    test: (_: any, { message } : Arguments) => message
  }
};
