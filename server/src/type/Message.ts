export type Message = {
	massage: string;
	sender: string;
	receiver: string;
};

export interface MessageData {
  senderId: string
	receiverId?: string
  content: string
}

export type UserInfo = {
	email: string;
	id: string;
	username: string;
	displayname: string;
	role: string;
};
