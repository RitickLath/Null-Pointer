import express from "express";
import * as problemController from "../controller/problem.controller";
import { isAuthenticated } from "../middleware";

export const ProblemRouter = express.Router();

// Get all problems
ProblemRouter.get("/", problemController.getAllProblems);

// Get problems by difficulty (Easy/Medium/Hard)
ProblemRouter.get(
  "/problems/difficulty",
  problemController.getProblemsByDifficulty
);

// Get problems by tags/topics
ProblemRouter.get("/tags", problemController.getProblemsByTags);

// Search problems by title/tags
ProblemRouter.get("/search", problemController.searchProblems);

// Get single problem details
ProblemRouter.get("/:id", problemController.getProblemById);

////////////////// PROTECTED ROUTE FOR USER LOGGED IN ONLY //////////////////
// Get problems liked by the user
ProblemRouter.get(
  "/liked",
  isAuthenticated,
  problemController.getLikedProblems
);

// Get problems saved/bookmarked by the user
ProblemRouter.get(
  "/saved",
  isAuthenticated,
  problemController.getSavedProblems
);

////////////////// PROTECTED ROUTE FOR ADMIN LOGGED IN ONLY //////////////////
// ADMIN: Create a new problem
ProblemRouter.post("add-problem/", problemController.createProblem);

// ADMIN: Update an existing problem
ProblemRouter.put("update-problem/:id", problemController.updateProblem);
