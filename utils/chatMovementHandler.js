/*

block.execute(service, message)

Response schema:
  {
    send: string, // Message to send to the user and save in the chat
    nextBlock: string, // ID of the next block to execute
    awaitResponse: boolean, // Whether the chat should break here and wait for a response from the user
  }

*/

class ChatMovementHandler {
  constructor(configuration, entryBlock, service, message, chat) {
    this.configuration = configuration;
    this.blocks = configuration.blocks;
    this.awaitingResponse = true;
    this.currentBlock = entryBlock;
    this.lastActiveBlock = entryBlock;
    this.service = service;
    this.message = message;
    this.chat = chat;
    this.canceled = false;
  }

  async saveChat() {
    this.chat.lastBlock =
      this.lastActiveBlock?._id || this.configuration.entryBlock;
    await this.chat.save();
  }

  cancelMovement() {
    this.canceled = true;
  }

  continueMovement(message) {
    if (this.awaitingResponse && !this.canceled) {
      this.message = message || "";
      this.awaitingResponse = false;
      this.saveMessage({
        content: this.message,
        block: this.lastActiveBlock._id,
        isUserMessage: true,
      });
      this.moveChatFlow();
    } else {
      this.service.send(
        JSON.stringify({ status: "notAwaitingResponse", message: this.message })
      );
    }
  }

  saveMessage(messageToSave) {
    const message = {
      ...messageToSave,
      sentAt: new Date(),
    };
    this.chat.messages.push(message);
  }

  async moveChatFlow() {
    if (!this.canceled) {
      const result = await this.currentBlock.execute(
        this.service,
        this.message
      );

      const newCurrentBlock = result.nextBlock
        ? this.blocks.find((block) => block._id.equals(result.nextBlock))
        : null;

      if (result.send) {
        this.service.send(
          JSON.stringify({ status: "response", message: result.send })
        );
        this.saveMessage({
          content: result.send,
          block: this.currentBlock._id,
          isUserMessage: false,
        });
      } else if (result.awaitResponse) {
        this.awaitingResponse = true;
        this.lastActiveBlock = this.currentBlock; // In case we have consecutive awaitResponse blocks
        this.currentBlock = newCurrentBlock;
        return { awaitingResponse: true };
      } else {
        this.saveMessage({
          block: this.currentBlock._id,
          isUserMessage: false,
        });
      }

      if (!result.nextBlock) {
        this.service.send(JSON.stringify({ status: "finished" }));
        this.lastActiveBlock = null;
        await this.saveChat();
        this.service.close();
        return { isFinished: true };
      } else {
        this.currentBlock = newCurrentBlock;
        this.lastActiveBlock = this.currentBlock;
        return this.moveChatFlow();
      }
    }
  }
}

module.exports = ChatMovementHandler;
