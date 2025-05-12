export type ResolveType = (value: boolean | PromiseLike<boolean>) => void;
export type AuthContext =  {
  userName: string,
  userRoles: string[],
  sessionId?: string
}
