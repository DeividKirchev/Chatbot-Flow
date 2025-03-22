const request = require("supertest");
const server = require("../../../app");
const mockingoose = require("mockingoose");
const ChatBlock = require("../../../models/configuration/chatBlockModel");

   const mockBlocks = [
     {
       _id: "507f1f77bcf86cd799439011",
       type: "sendMessage",
       nextBlock: "507f1f77bcf86cd799439012",
       originalId: "block1",
       message: "Hello, world!",
     },
   ];

describe("GET /api/v1/blocks", () => {
  it("should return all chat blocks", async () => {
 
    mockingoose(ChatBlock).toReturn(mockBlocks, "find");
    const res = await request(server).get("/api/v1/blocks");
    expect(res.statusCode).toBe(200);
    expect(res.body.blocks).toBeDefined();
    expect(res.body.blocks.length).toBeGreaterThan(0);
  });
});