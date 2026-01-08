import { parse } from "path";
import { ValueTracker } from "../Tracker/valuetracker";
import { PtTrackerMeta, TrackerMeta } from "@/core/types/tracker";
import { evaluate } from "mathjs";

export class TrackerConnectionManager {
  private trackers: Map<string, TrackerMeta>;
  private pointTrackers: Map<string, PtTrackerMeta>;
  private activeLinks = new Map<
    string,
    { target: string; deps: Set<string> }
  >();

  private validConnections: string[] = [];

  constructor(
    trackers: Map<string, TrackerMeta>,
    pointTrackers: Map<string, PtTrackerMeta>
  ) {
    this.trackers = trackers;
    this.pointTrackers = pointTrackers;
  }

  dependencies = new Map<string, Set<string>>();
  private resolveTracker(ref: string): ValueTracker | null {
    if (ref.includes(".")) {
      const [name, prop] = ref.split(".");
      const ptMeta = this.pointTrackers.get(name);
      if (!ptMeta) return null;
      if (prop === "x") return ptMeta.tracker.x;
      if (prop === "y") return ptMeta.tracker.y;
      return null;
    }
    return this.trackers.get(ref)?.tracker ?? null;
  }

  connectTrackers(expression: string): { success: boolean; msg: string } {
    const trimmedExpr = expression.trim();
    if (!trimmedExpr.endsWith(";")) {
      return {
        success: false,
        msg: "Expression must end with a semicolon (;)",
      };
    }

    if (this.activeLinks.has(expression)) {
      return { success: false, msg: "This expression is already active." };
    }

    const cleanExpr = trimmedExpr.slice(0, -1).trim();
    const LHS_REGEX = /^\s*\[([^\]]+)\]\s*=/;
    const REF_REGEX = /\[([^\]]+)\]/g;

    const lhsMatch = cleanExpr.match(LHS_REGEX);
    if (!lhsMatch)
      return { success: false, msg: "Invalid format. Use '[target] = ...;'" };

    const targetRef = lhsMatch[1]; // e.g. "pt1.x" or "var1"
    const targetTracker = this.resolveTracker(targetRef);

    if (!targetTracker) {
      return { success: false, msg: `Target '${targetRef}' not found.` };
    }

    const rhs = cleanExpr.split("=").slice(1).join("=").trim();
    const newDeps = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = REF_REGEX.exec(rhs)) !== null) {
      newDeps.add(match[1]); // e.g. "x" or "pt2.y"
    }

    // 1. Validation: Existence
    for (const dep of newDeps) {
      if (!this.resolveTracker(dep)) {
        return { success: false, msg: `Dependency '${dep}' missing.` };
      }
    }

    // 2. Deep Circular Dependency Check
    const causesCycle = (current: string, searchTarget: string): boolean => {
      const existingDeps = this.dependencies.get(current);
      if (!existingDeps) return false;
      if (existingDeps.has(searchTarget)) return true;
      for (const nextDep of existingDeps) {
        if (causesCycle(nextDep, searchTarget)) return true;
      }
      return false;
    };

    for (const dep of newDeps) {
      if (dep === targetRef || causesCycle(dep, targetRef)) {
        return {
          success: false,
          msg: `Circular dependency: [${targetRef}] cannot depend on [${dep}].`,
        };
      }
    }

    // 3. Syntax validation
    try {
      let testExpr = rhs;
      newDeps.forEach((d) => (testExpr = testExpr.replaceAll(`[${d}]`, "1")));
      parse(testExpr);
    } catch {
      return { success: false, msg: "Mathematical syntax error." };
    }

    /* --- Validation Passed: Update State --- */

    this.dependencies.set(targetRef, newDeps);

    const updateTarget = () => {
      let evalExpr = rhs;
      newDeps.forEach((dep) => {
        const tracker = this.resolveTracker(dep);
        const val = tracker ? tracker.value : 0;
        evalExpr = evalExpr.replaceAll(`[${dep}]`, val.toString());
      });
      try {
        const result = evaluate(evalExpr);
        if (typeof result === "number" && !Number.isNaN(result)) {
          targetTracker.value = result;
        }
      } catch (err) {
        console.error("Link evaluation error:", err);
      }
    };

    // Attach listeners using the targetRef as the unique ID
    const successArray: boolean[] = [];
    newDeps.forEach((dep) => {
      const depTracker = this.resolveTracker(dep)!;
      const done = depTracker.addUpdater(
        `link-${targetRef}`,
        updateTarget,
        "t"
      );
      successArray.push(done);
    });

    if (successArray.includes(false)) {
      this.dependencies.delete(targetRef);
      return { success: false, msg: "Failed to add updater." };
    }

    updateTarget();
    this.activeLinks.set(expression, { target: targetRef, deps: newDeps });

    this.validConnections.push(expression);

    return { success: true, msg: "Linked successfully." };
  }

  /**
   * Modified to use the new resolution logic for cleanup
   */
  removeExpression(expression: string) {
    const link = this.activeLinks.get(expression);
    if (!link) return;

    link.deps.forEach((depRef) => {
      const depTracker = this.resolveTracker(depRef);
      if (depTracker) {
        depTracker.removeUpdater(`link-${link.target}`);
      }
    });

    this.dependencies.delete(link.target);
    this.activeLinks.delete(expression);
    this.validConnections = this.validConnections.filter(
      (conn) => conn !== expression
    );
  }
  getAllExpressions(): string[] {
    return Array.from(this.activeLinks.keys());
  }

  remove(name: string) {
    // If 'name' is 'pt1', we check for 'pt1', 'pt1.x', and 'pt1.y'
    const targetsToRemove = new Set<string>([name]);
    if (this.pointTrackers.has(name)) {
      targetsToRemove.add(`${name}.x`);
      targetsToRemove.add(`${name}.y`);
    }

    // 2. Clean up expressions where this (or its components) is the TARGET
    // Example: [pt1.x] = [var] + 1;
    this.activeLinks.forEach((link, expr) => {
      if (targetsToRemove.has(link.target)) {
        this.removeExpression(expr);
      }
    });
    this.activeLinks.forEach((link, expr) => {
      const hasDep = Array.from(link.deps).some((dep) =>
        targetsToRemove.has(dep)
      );
      if (hasDep) {
        this.removeExpression(expr);
      }
    });
  }

  clear() {
    this.activeLinks.forEach((_, expr) => this.removeExpression(expr));
    this.dependencies.clear();
    this.activeLinks.clear();
    this.validConnections = [];
  }

  storeAsObj() {
    return this.validConnections;
  }

  loadFromObj(data: string[]) {
    data.forEach((expr) => {
      this.connectTrackers(expr);
    });
  }
}
