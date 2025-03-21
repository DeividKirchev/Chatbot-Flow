/*

block.execute(service, message)

Response schema:
  {
    send: string, // Message to send to the user and save in the chat
    nextBlock: string, // ID of the next block to execute
    awaitResponse: boolean, // Whether the chat should break here and wait for a response from the user
  }

*/

class ChatMovementController {
  constructor(blocks, entryBlock, service, message, chat) {
    this.blocks = blocks;
    this.awaitingResponse = true;
    this.currentBlock = entryBlock;
    this.service = service;
    this.message = message;
    this.chat = chat;
    this.canceled = false;
  }

  async saveChat() {
    await this.chat.save();
  }

  cancelMovement() {
    this.canceled = true;
  }

  startMovement(message) {
    if (this.awaitingResponse && !this.canceled) {
      this.message = message || "";
      this.awaitingResponse = false;
      this.moveChatFlow();
      const messageToSave = {
        content: this.message,
        block: this.currentBlock._id,
      };
      this.chat.messages.push(messageToSave);

      this.service.send(
        JSON.stringify({ status: "received", message: this.message })
      );
    } else {
      this.service.send(
        JSON.stringify({ status: "notAwaitingResponse", message: this.message })
      );
    }
  }

  async moveChatFlow() {
    if (!this.canceled) {
      const result = await this.currentBlock.execute(
        this.service,
        this.message
      );

      if (result.send) {
        this.service.send(
          JSON.stringify({ status: "response", message: result.send })
        );
        const message = {
          content: result.send,
          block: this.currentBlock._id,
        };
        this.chat.messages.push(message);
      }

      if (!result.nextBlock) {
        this.service.send(JSON.stringify({ status: "finished" }));
        await this.saveChat();
        this.service.close();
        return { isFinished: true };
      }

      this.currentBlock = this.blocks.find((block) =>
        block._id.equals(result.nextBlock)
      );

      if (result.awaitResponse) {
        this.awaitingResponse = true;
        return { awaitingResponse: true };
      }
      return this.moveChatFlow();
    }
  }
}

module.exports = ChatMovementController;
