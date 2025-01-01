type registerErrorType = {
  email?: string;
  name?: string;
  password?: string;
};

type LoginPayloadType = {
  email: string;
  password: string;
};

type LoginErrorType = {
  email?: string;
  password?: string;
};

// * Auth INput type
type AuthInputType = {
  label: string;
  type: string;
  name: string;
  errors: registerErrorType;
  callback: (name: string, value: string) => void;
};

// * Forgot password payload type
type ForgotPasswordPayload = {
  email: string;
};

// reset password type
type ResetPasswordPayload = {
  email: string;
  signature: string;
  password: string;
  password_confirmation: string;
};

// * Magic link payload type
type MagicLinkPayload = {
  email: string;
};

type MagicLinkPayloadVerify = {
  email: string;
  token: string;
};

export interface WalletDetails {
  cardinal_address: string;
  cardinal_pubkey: string;
  ordinal_address: string;
  ordinal_pubkey: string;
  connected?: boolean;
  wallet: string | null;
}

export interface AccountType {
  vault: string;
  ordinal_address: string;
}

export interface Comment {
  length?: number;
  text: string;
  author?: string;
  date: string;
}

export interface CollectionItem {
  itemId: any;
  _id: string;
  collection_item_name: string;
  inscription_id: string;
  comments: Comment[];
  likes: string[];

}

export interface ApiResponse {
  success: boolean;
  data: CollectionItem[];
  message?: string;
}
