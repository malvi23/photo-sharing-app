interface imageData {
  id: string;
  title: string;
  description: string;
  base64Image: string;
}

export interface LoggedInUserReq {
  code: number;
  status: string;
  message: string;
  data: imageData[];
}