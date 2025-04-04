import { Message } from "@/models/message.models";

export default interface APIResponseInterface {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  data?: object;
}
