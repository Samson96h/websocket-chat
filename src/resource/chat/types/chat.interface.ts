export interface Chat {
  id: string;
  name: string;
  ownerId: number;
  ownerName: string;
  members: number[];
  messages: { userId: number; text: string; createdAt: Date }[];
}