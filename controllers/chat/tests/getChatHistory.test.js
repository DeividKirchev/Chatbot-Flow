const request = require("supertest");
const server = require("../../../app");
const mockingoose = require("mockingoose");
const Chat = require("../../../models/chat/chatModel");

beforeEach(() => {
  mockingoose.resetAll();
});

const mockChats = [
  {
    _id: "56cb91bdc3464f14678934ca",
    messages: [
      {
        content: "Hello, world!",
        block: "56cb91bdc3464f14678934cb",
        isUserMessage: true,
        sentAt: new Date(),
      },
    ],
  },
];

describe("GET /api/v1/chat", () => {
  it("should return the chat history", async () => {
    mockingoose(Chat).toReturn(mockChats, "find");
    const res = await request(server).get("/api/v1/chat");
    expect(res.statusCode).toBe(200);
    expect(res.body.chats).toBeDefined();
    expect(res.body.chats.length).toBeGreaterThan(0);
    expect(res.body.chats[0].messages.length).toBeGreaterThan(0);
    expect(res.body.chats[0].messages[0].content).toBe("Hello, world!");
    expect(res.body.chats[0].messages[0].isUserMessage).toBe(true);
    expect(res.body.chats[0].messages[0].sentAt).toBeDefined();
  });
});

describe("GET /api/v1/chat/:id", () => {
  it("should return the chat history", async () => {
    mockingoose(Chat).toReturn(mockChats[0], "findOne");
    const res = await request(server).get("/api/v1/chat/" + mockChats[0]._id);
    expect(res.statusCode).toBe(200);
    expect(res.body.chat).toBeDefined();
    expect(res.body.chat._id).toBe(mockChats[0]._id);
    expect(res.body.chat.messages.length).toBeGreaterThan(0);
    expect(res.body.chat.messages[0].content).toBe("Hello, world!");
    expect(res.body.chat.messages[0].isUserMessage).toBe(true);
    expect(res.body.chat.messages[0].sentAt).toBeDefined();
  });
});
