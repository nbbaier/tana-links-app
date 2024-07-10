export type TanaLink = {
  id: number;
  vtid: number;
  link_id: string;
  link_url: string;
  saved_datetime: string;
  saved_timestamp: Date;
  created_at: string;
  updated_at: string;
};

export interface DomainPair {
  in_url: string;
  out_url: string;
}
