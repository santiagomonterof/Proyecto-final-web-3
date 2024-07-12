import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Client {
  id: number;
  username: string;
  role: string;
  station: Station;
}

export interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  refresh: string;
  access: string;
  client: Client;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface RoleNames {
  [key: string]: string;
}

export const roleNames: RoleNames = {
  '1': 'Seller',
  '2': 'Station Admin',
  '3': 'Refinery Admin',
  '4': 'Driver',
  '5': 'Access Admin',
};