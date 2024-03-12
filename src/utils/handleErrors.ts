import { Response } from "express";

const handleErrors = (err: any, res: Response) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error fetching feed:", err);
  }
  
  return res
    .status(500)
    .json({ status: "error", message: `Internal Server Error: ${err}` });
};

export default handleErrors;
