import { Router } from "express";
import { RagController } from "./rag.controller";

const router = Router();

router.get("/stats", RagController.getStats);

router.post("/ingestAdmin", RagController.ingestAdmin)
router.post("/query",RagController.queryRag)
export const RagRoutes = router;