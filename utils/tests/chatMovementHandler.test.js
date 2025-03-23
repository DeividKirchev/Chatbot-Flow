const ChatMovementHandler = require("../chatMovementHandler");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

describe("ChatMovementHandler", () => {
  let mockService;
  let mockChat;
  let mockBlocks;
  let mockConfiguration;
  let mockEntryBlock;
  let mockMessage;
  let handler;

  beforeEach(() => {
    const welcomeBlockId = new ObjectId();
    const questionBlockId = new ObjectId();
    const intentBlockId = new ObjectId();
    const responseBlockId = new ObjectId();
    const finalBlockId = new ObjectId();
    const errorBlockId = new ObjectId();
    mockBlocks = [
      {
        _id: welcomeBlockId,
        type: "sendMessage",
        message: "Welcome to our chatbot!",
        nextBlock: questionBlockId,
        execute: jest.fn().mockResolvedValue({
          send: "Welcome to our chatbot!",
          nextBlock: questionBlockId,
        }),
      },
      {
        _id: questionBlockId,
        type: "awaitResponse",
        nextBlock: intentBlockId,
        execute: jest.fn().mockResolvedValue({
          awaitResponse: true,
          nextBlock: intentBlockId,
        }),
      },
      {
        _id: intentBlockId,
        type: "recognizeIntent",
        intents: [
          {
            intent: "help",
            nextBlock: responseBlockId,
          },
          {
            intent: "goodbye",
            nextBlock: finalBlockId,
          },
        ],
        errorIntentNextBlock: errorBlockId,
        execute: jest.fn().mockImplementation(async (service, message) => {
          if (message.toLowerCase().includes("help")) {
            return { nextBlock: responseBlockId };
          } else if (message.toLowerCase().includes("bye")) {
            return { nextBlock: finalBlockId };
          }
          return { nextBlock: errorBlockId };
        }),
      },
      {
        _id: responseBlockId,
        type: "sendMessage",
        message: "How can I assist you today?",
        nextBlock: null,
        execute: jest.fn().mockResolvedValue({
          send: "How can I assist you today?",
          nextBlock: null,
        }),
      },
      {
        _id: finalBlockId,
        type: "sendMessage",
        message: "Goodbye! Have a great day!",
        nextBlock: null,
        execute: jest.fn().mockResolvedValue({
          send: "Goodbye! Have a great day!",
          nextBlock: null,
        }),
      },
      {
        _id: errorBlockId,
        type: "sendMessage",
        message: "I'm not sure I understand. Can you rephrase?",
        nextBlock: questionBlockId,
        execute: jest.fn().mockResolvedValue({
          send: "I'm not sure I understand. Can you rephrase?",
          nextBlock: questionBlockId,
        }),
      },
    ];

    mockEntryBlock = mockBlocks[0];
    mockConfiguration = {
      _id: new ObjectId(),
      name: "Test Configuration",
      blocks: mockBlocks,
      entryBlock: mockEntryBlock._id,
    };

    mockService = {
      send: jest.fn(),
      close: jest.fn(),
    };

    mockChat = {
      _id: new ObjectId(),
      messages: [],
      lastBlock: null,
      save: jest.fn().mockResolvedValue(true),
    };

    mockMessage = "Initial message";

    handler = new ChatMovementHandler(
      mockConfiguration,
      mockEntryBlock,
      mockService,
      mockMessage,
      mockChat
    );
  });

  test("saveChat saves chat", async () => {
    await handler.saveChat();
    expect(mockChat.save).toHaveBeenCalled();
  });

  test("cancelMovement sets canceled flag", () => {
    handler.cancelMovement();
    expect(handler.canceled).toBe(true);
  });

  test("saveMessage adds message to chat history with timestamp", () => {
    const messageToSave = {
      content: "Test message",
      block: mockEntryBlock._id,
      isUserMessage: true,
    };

    handler.saveMessage(messageToSave);

    expect(mockChat.messages.length).toBe(1);
    expect(mockChat.messages[0].content).toBe("Test message");
    expect(mockChat.messages[0].block).toBe(mockEntryBlock._id);
    expect(mockChat.messages[0].isUserMessage).toBe(true);
    expect(mockChat.messages[0].sentAt).toBeInstanceOf(Date);
  });

  test("continueMovement processes new message when awaiting response", () => {
    const saveMessageSpy = jest.spyOn(handler, "saveMessage");
    const moveChatFlowSpy = jest
      .spyOn(handler, "moveChatFlow")
      .mockResolvedValue({});

    handler.continueMovement("New user message");

    expect(handler.message).toBe("New user message");
    expect(saveMessageSpy).toHaveBeenCalledWith({
      content: "New user message",
      block: mockEntryBlock._id,
      isUserMessage: true,
    });
    expect(moveChatFlowSpy).toHaveBeenCalled();
  });

  test("continueMovement does nothing when not awaiting response", () => {
    handler.awaitingResponse = false;
    const moveChatFlowSpy = jest
      .spyOn(handler, "moveChatFlow")
      .mockResolvedValue({});

    handler.continueMovement("New user message");

    expect(moveChatFlowSpy).not.toHaveBeenCalled();
    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({ status: "notAwaitingResponse", message: mockMessage })
    );
  });

  test("moveChatFlow executes sendMessage block correctly and continues until awaitResponse", async () => {
    const sendMessageBlock = mockBlocks[0];
    const awaitResponseBlock = mockBlocks[1];
    const intentBlock = mockBlocks[2];

    handler.currentBlock = sendMessageBlock;
    handler.lastActiveBlock = sendMessageBlock;
    handler.awaitingResponse = false;

    sendMessageBlock.execute.mockResolvedValue({
      send: "Welcome to our chatbot!",
      nextBlock: awaitResponseBlock._id,
    });

    awaitResponseBlock.execute.mockResolvedValue({
      awaitResponse: true,
      nextBlock: intentBlock._id,
    });

    const result = await handler.moveChatFlow();

    expect(sendMessageBlock.execute).toHaveBeenCalledWith(
      mockService,
      mockMessage
    );

    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({ status: "response", message: "Welcome to our chatbot!" })
    );

    expect(mockChat.messages.length).toBeGreaterThanOrEqual(1);
    expect(mockChat.messages[0].content).toBe("Welcome to our chatbot!");

    expect(awaitResponseBlock.execute).toHaveBeenCalledWith(
      mockService,
      mockMessage
    );

    expect(handler.awaitingResponse).toBe(true);
    expect(result).toEqual({ awaitingResponse: true });

    expect(handler.currentBlock).toBe(intentBlock);
    expect(handler.lastActiveBlock).toBe(awaitResponseBlock);
  });

  test("moveChatFlow executes recognizeIntent block with help intent and continues to completion", async () => {
    const intentBlock = mockBlocks[2];
    const responseBlock = mockBlocks[3];

    handler.currentBlock = intentBlock;
    handler.lastActiveBlock = intentBlock;
    handler.awaitingResponse = false;
    handler.message = "I need help please";

    intentBlock.execute.mockResolvedValue({
      nextBlock: responseBlock._id,
    });

    responseBlock.execute.mockResolvedValue({
      send: "How can I assist you today?",
      nextBlock: null,
    });

    const result = await handler.moveChatFlow();

    expect(intentBlock.execute).toHaveBeenCalledWith(
      mockService,
      "I need help please"
    );

    expect(responseBlock.execute).toHaveBeenCalled();

    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({
        status: "response",
        message: "How can I assist you today?",
      })
    );

    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({ status: "finished" })
    );

    expect(result).toEqual({ isFinished: true });
    expect(mockChat.save).toHaveBeenCalled();
    expect(mockService.close).toHaveBeenCalled();
  });

  test("moveChatFlow executes recognizeIntent block with error intent and continues until awaitResponse", async () => {
    const intentBlock = mockBlocks[2];
    const errorBlock = mockBlocks[5];
    const questionBlock = mockBlocks[1];
    const nextIntentBlock = mockBlocks[2];

    handler.currentBlock = intentBlock;
    handler.lastActiveBlock = intentBlock;
    handler.awaitingResponse = false;
    handler.message = "random text";

    intentBlock.execute.mockResolvedValue({
      nextBlock: errorBlock._id,
    });

    errorBlock.execute.mockResolvedValue({
      send: "I'm not sure I understand. Can you rephrase?",
      nextBlock: questionBlock._id,
    });

    questionBlock.execute.mockResolvedValue({
      awaitResponse: true,
      nextBlock: nextIntentBlock._id,
    });

    const result = await handler.moveChatFlow();

    expect(intentBlock.execute).toHaveBeenCalledWith(
      mockService,
      "random text"
    );

    expect(errorBlock.execute).toHaveBeenCalled();

    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({
        status: "response",
        message: "I'm not sure I understand. Can you rephrase?",
      })
    );

    expect(questionBlock.execute).toHaveBeenCalled();

    expect(handler.awaitingResponse).toBe(true);
    expect(result).toEqual({ awaitingResponse: true });

    expect(handler.currentBlock).toBe(nextIntentBlock);
    expect(handler.lastActiveBlock).toBe(questionBlock);
  });

  test("moveChatFlow handles completion (no next block)", async () => {
    const finalBlock = mockBlocks[4];
    handler.currentBlock = finalBlock;
    handler.lastActiveBlock = finalBlock;
    handler.awaitingResponse = false;

    const result = await handler.moveChatFlow();

    expect(finalBlock.execute).toHaveBeenCalled();
    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({
        status: "response",
        message: "Goodbye! Have a great day!",
      })
    );
    expect(mockService.send).toHaveBeenCalledWith(
      JSON.stringify({ status: "finished" })
    );
    expect(mockChat.save).toHaveBeenCalled();
    expect(mockService.close).toHaveBeenCalled();
    expect(result).toEqual({ isFinished: true });
  });

  test("moveChatFlow does nothing when canceled", async () => {
    handler.canceled = true;
    const result = await handler.moveChatFlow();

    expect(handler.currentBlock.execute).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
