export type Account = {
  name: string;
  accountId: string;
  email: string;
  profiles: AccountProfile[];
};

export type AccountProfile = {
  name: string;
  link: string;
};
