import type { Request, Response } from "express";
import { RagService } from "./rag.service";


const ragService=new RagService();

const getStats = async (req: Request, res: Response) => {
  console.log("connected", req.query);
  res.status(200).json({ message: "connected rag apis" });
};

const ingestAdmin = async (req: Request, res: Response) => {
  try{
  const result = await ragService.ingestAdmin();
  if(result === null || result === undefined){  // ✅
    throw new Error("Admin get data ingestion failed")
  }
  
 return res.status(200).json({
    success: true,
    httpStatusCode: 200,
    message: `Admin get data ingestion completed. Total: ${result}`,
    data: { count: result }
  });
}
catch(error:any){
    return res.status(400).json({
    success: true,
    httpStatusCode: 400,
    message: error?.message,
    data: null
  });
}
};


const queryRag = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) throw new Error("Query is required");

    const result = await ragService.generateAnswer(query);

    return res.status(200).json({
      success: true,
      httpStatusCode: 200,
      message: "Answer generated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      httpStatusCode: 400,
      message: error?.message,
      data: null,
    });
  }
};



export const RagController = {
  getStats,
  ingestAdmin,
  queryRag
};