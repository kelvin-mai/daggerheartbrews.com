type UserItem = {
  id: string;
  userId: string;
  public: boolean;
  upvotes: number;
  downvotes: number;
  cardPreviewId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCard = UserItem & {
  cardPreviewId: string;
};

export type UserAdversary = UserItem & {
  adversaryPreviewId: string;
};

export type UserCardBookmark = {
  id: string;
  userId: string;
  userCardId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type UserAdversaryBookmark = {
  id: string;
  userId: string;
  userAdversaryId: string;
  createdAt: Date;
  updatedAt: Date | null;
};
