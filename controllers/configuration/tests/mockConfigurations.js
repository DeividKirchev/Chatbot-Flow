module.exports.basic = {
  input: {
    blocks: [
      {
        _id: "0",
        type: "sendMessage",
        message: "Hello, what are you looking for today?",
        nextBlock: "1",
      },
      {
        type: "awaitResponse",
        _id: "1",
        nextBlock: "2",
      },
      {
        _id: "2",
        type: "recognizeIntent",
        intents: [
          {
            intent: "What is the weather?",
            nextBlock: "3",
          },
          {
            intent: "What is the time?",
            nextBlock: "4",
          },
        ],
        errorIntentNextBlock: "1",
      },
      {
        _id: "3",
        type: "sendMessage",
        message: "It's sunny",
      },
      {
        _id: "4",
        type: "sendMessage",
        message: "It's 10pm",
      },
    ],
  },
  insertMany: [
    {
      _id: "56cb91bdc3464f14678934c3",
      originalId: "0",
      type: "sendMessage",
      message: "Hello, what are you looking for today?",
      originalNextBlock: "1",
    },
    {
      _id: "56cb91bdc3464f14678934c4",
      type: "awaitResponse",
      originalId: "1",
      originalNextBlock: "2",
    },
    {
      _id: "56cb91bdc3464f14678934c5",
      originalId: "2",
      type: "recognizeIntent",
      intents: [
        {
          intent: "What is the weather?",
          originalNextBlock: "3",
        },
        {
          intent: "What is the time?",
          originalNextBlock: "4",
        },
      ],
      originalErrorIntentNextBlock: "1",
    },
    {
      _id: "56cb91bdc3464f14678934c6",
      originalId: "3",
      type: "sendMessage",
      message: "It's sunny",
      originalNextBlock: "5",
    },
    {
      _id: "56cb91bdc3464f14678934c7",
      originalId: "4",
      type: "sendMessage",
      message: "It's 10pm",
      originalNextBlock: "5",
    },
  ],
};

module.exports.noBlocks = {
  input: {
    blocks: [],
  },
  insertMany: [],
};

module.exports.loopConfiguration = {
  input: {
    blocks: [
      {
        _id: "0",
        type: "sendMessage",
        message: "What are you looking for today?",
        nextBlock: "1",
      },
      {
        type: "awaitResponse",
        _id: "1",
        nextBlock: "2",
      },
      {
        _id: "2",
        type: "recognizeIntent",
        intents: [
          {
            intent: "What is the weather?",
            nextBlock: "3",
          },
          {
            intent: "What is the time?",
            nextBlock: "4",
          },
        ],
        errorIntentNextBlock: "9",
      },
      {
        _id: "3",
        type: "sendMessage",
        message: "It's sunny",
        nextBlock: "5",
      },
      {
        _id: "4",
        type: "sendMessage",
        message: "It's 10pm",
        nextBlock: "5",
      },
      {
        _id: "5",
        type: "sendMessage",
        message: "Would you like anything else?",
        nextBlock: "6",
      },
      {
        type: "awaitResponse",
        _id: "6",
        nextBlock: "7",
      },
      {
        _id: "7",
        type: "recognizeIntent",
        intents: [
          {
            intent: "Yes",
            nextBlock: "0",
          },
          {
            intent: "No",
            nextBlock: "8",
          },
        ],
        errorIntentNextBlock: "10",
      },
      {
        _id: "8",
        type: "sendMessage",
        message: "Have a nice day!",
      },
      {
        _id: "9",
        type: "sendMessage",
        message: "I don't understand what you mean.",
        nextBlock: "0",
      },
      {
        _id: "10",
        type: "sendMessage",
        message: "I don't understand what you mean.",
        nextBlock: "5",
      },
    ],
  },
  insertMany: [
    {
      _id: "56cb91bdc3464f14678934c8",
      originalId: "0",
      type: "sendMessage",
      message: "What are you looking for today?",
      originalNextBlock: "1",
    },
    {
      type: "awaitResponse",
      _id: "56cb91bdc3464f14678934c9",
      originalId: "1",
      originalNextBlock: "2",
    },
    {
      _id: "56cb91bdc3464f14678934ca",
      originalId: "2",
      type: "recognizeIntent",
      intents: [
        {
          intent: "What is the weather?",
          originalNextBlock: "3",
        },
        {
          intent: "What is the time?",
          originalNextBlock: "4",
        },
      ],
      originalErrorIntentNextBlock: "9",
    },
    {
      _id: "56cb91bdc3464f14678934cb",
      originalId: "3",
      type: "sendMessage",
      message: "It's sunny",
      originalNextBlock: "5",
    },
    {
      _id: "56cb91bdc3464f14678934cb",
      originalId: "4",
      type: "sendMessage",
      message: "It's 10pm",
      originalNextBlock: "5",
    },
    {
      _id: "56cb91bdc3464f14678934cc",
      originalId: "5",
      type: "sendMessage",
      message: "Would you like anything else?",
      originalNextBlock: "6",
    },
    {
      _id: "56cb91bdc3464f14678934cd",
      type: "awaitResponse",
      originalId: "6",
      originalNextBlock: "7",
    },
    {
      _id: "56cb91bdc3464f14678934ce",
      originalId: "7",
      type: "recognizeIntent",
      intents: [
        {
          intent: "Yes",
          originalNextBlock: "0",
        },
        {
          intent: "No",
          originalNextBlock: "8",
        },
      ],
      originalErrorIntentNextBlock: "10",
    },
    {
      _id: "56cb91bdc3464f14678934cf",
      originalId: "8",
      type: "sendMessage",
      message: "Have a nice day!",
      originalNextBlock: "9",
    },
    {
      _id: "56cb91bdc3464f14678934d0",
      originalId: "9",
      type: "sendMessage",
      message: "I don't understand what you mean.",
      originalNextBlock: "0",
    },
    {
      _id: "56cb91bdc3464f14678934d1",
      originalId: "10",
      type: "sendMessage",
      message: "I don't understand what you mean.",
      originalNextBlock: "5",
    },
  ],
};

module.exports.entryBlock = {
  input: {
    blocks: [
      {
        _id: "0",
        type: "sendMessage",
        message: "What are you looking for today?",
        nextBlock: "1",
      },
      {
        type: "awaitResponse",
        _id: "1",
        nextBlock: "2",
      },
      {
        _id: "2",
        type: "recognizeIntent",
        intents: [
          {
            intent: "What is the weather?",
            nextBlock: "3",
          },
          {
            intent: "What is the time?",
            nextBlock: "4",
          },
        ],
        errorIntentNextBlock: "9",
      },
      {
        _id: "3",
        type: "sendMessage",
        message: "It's sunny",
        nextBlock: "5",
      },
      {
        _id: "4",
        type: "sendMessage",
        message: "It's 10pm",
        nextBlock: "5",
      },
      {
        _id: "5",
        type: "sendMessage",
        message: "Would you like anything else?",
        nextBlock: "6",
      },
      {
        type: "awaitResponse",
        _id: "6",
        nextBlock: "7",
      },
      {
        _id: "7",
        type: "recognizeIntent",
        intents: [
          {
            intent: "Yes",
            nextBlock: "0",
          },
          {
            intent: "No",
            nextBlock: "8",
          },
        ],
        errorIntentNextBlock: "10",
      },
      {
        _id: "8",
        type: "sendMessage",
        message: "Have a nice day!",
      },
      {
        _id: "9",
        type: "sendMessage",
        message: "I don't understand what you mean.",
        nextBlock: "0",
      },
      {
        _id: "10",
        type: "sendMessage",
        message: "I don't understand what you mean.",
        nextBlock: "5",
      },
    ],
    entryBlock: "0",
  },
  insertMany: [
    {
      _id: "56cb91bdc3464f14678934cf",
      originalId: "0",
      type: "sendMessage",
      message: "What are you looking for today?",
      originalNextBlock: "1",
    },
    {
      type: "awaitResponse",
      _id: "56cb91bdc3464f14678934d0",
      originalId: "1",
      originalNextBlock: "2",
    },
    {
      _id: "56cb91bdc3464f14678934d1",
      originalId: "2",
      type: "recognizeIntent",
      intents: [
        {
          intent: "What is the weather?",
          originalNextBlock: "3",
        },
        {
          intent: "What is the time?",
          originalNextBlock: "4",
        },
      ],
      originalErrorIntentNextBlock: "9",
    },
    {
      _id: "56cb91bdc3464f14678934d2",
      originalId: "3",
      type: "sendMessage",
      message: "It's sunny",
      originalNextBlock: "5",
    },
    {
      _id: "56cb91bdc3464f14678934d3",
      originalId: "4",
      type: "sendMessage",
      message: "It's 10pm",
      originalNextBlock: "5",
    },
    {
      _id: "56cb91bdc3464f14678934d4",
      originalId: "5",
      type: "sendMessage",
      message: "Would you like anything else?",
      originalNextBlock: "6",
    },
    {
      _id: "56cb91bdc3464f14678934d5",
      originalId: "6",
      type: "awaitResponse",
      originalNextBlock: "7",
    },
    {
      _id: "56cb91bdc3464f14678934d6",
      originalId: "7",
      type: "recognizeIntent",
      intents: [
        {
          intent: "Yes",
          originalNextBlock: "0",
        },
        {
          intent: "No",
          originalNextBlock: "8",
        },
      ],
      originalErrorIntentNextBlock: "10",
    },
    {
      _id: "56cb91bdc3464f14678934d7",
      originalId: "8",
      type: "sendMessage",
      message: "Have a nice day!",
      originalNextBlock: "9",
    },
    {
      _id: "56cb91bdc3464f14678934d8",
      originalId: "9",
      type: "sendMessage",
      message: "I don't understand what you mean.",
      originalNextBlock: "0",
    },
    {
      _id: "56cb91bdc3464f14678934d9",
      originalId: "10",
      type: "sendMessage",
      message: "I don't understand what you mean.",
      originalNextBlock: "5",
    },
  ],
};
