import { parse, evaluate } from "mathjs";
import { TrackerMeta } from "@/core/types/tracker";

export class TrackerExpressionConnectorFactory {
  static connect(args: {
    trackers: Map<string, TrackerMeta>;
    dependencies: Map<string, Set<string>>;
    expression: string;
  }): { success: boolean; msg: string } {
    const { trackers, dependencies } = args;

    /* -------------------------------------------------- */
    /* 1. Basic validation                                */
    /* -------------------------------------------------- */

    const trimmed = args.expression.trim();
    if (!trimmed.endsWith(";")) {
      return {
        success: false,
        msg: "Expression must end with a semicolon (;)",
      };
    }

    const cleanExpr = trimmed.slice(0, -1).trim();

    const LHS_REGEX = /^\s*\[([^\]]+)\]\s*=/;
    const REF_REGEX = /\[([^\]]+)\]/g;

    const lhsMatch = cleanExpr.match(LHS_REGEX);
    if (!lhsMatch) {
      return {
        success: false,
        msg: "Invalid format. Use '[target] = ...;'",
      };
    }

    const targetName = lhsMatch[1];
    const targetMeta = trackers.get(targetName);
    if (!targetMeta) {
      return {
        success: false,
        msg: `Target tracker '${targetName}' not found.`,
      };
    }

    /* -------------------------------------------------- */
    /* 2. Extract RHS & dependencies                      */
    /* -------------------------------------------------- */

    const rhs = cleanExpr.split("=").slice(1).join("=").trim();
    if (!rhs) {
      return {
        success: false,
        msg: "Right-hand side of expression is empty.",
      };
    }

    const deps = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = REF_REGEX.exec(rhs)) !== null) {
      deps.add(match[1]);
    }

    for (const dep of deps) {
      if (!trackers.has(dep)) {
        return {
          success: false,
          msg: `Dependency tracker '${dep}' does not exist.`,
        };
      }
    }

    /* -------------------------------------------------- */
    /* 3. Math syntax validation                          */
    /* -------------------------------------------------- */

    try {
      let testExpr = rhs;
      deps.forEach((d) => {
        testExpr = testExpr.replaceAll(`[${d}]`, "1");
      });
      parse(testExpr);
    } catch {
      return {
        success: false,
        msg: "Mathematical syntax error in expression.",
      };
    }

    /* -------------------------------------------------- */
    /* 4. Circular dependency detection                   */
    /* -------------------------------------------------- */

    const createsCycle = (start: string, current: string): boolean => {
      if (start === current) return true;
      const next = dependencies.get(current);
      if (!next) return false;
      for (const n of next) {
        if (createsCycle(start, n)) return true;
      }
      return false;
    };

    for (const dep of deps) {
      if (createsCycle(targetName, dep)) {
        return {
          success: false,
          msg: `Circular dependency detected: '${dep}' depends on '${targetName}'.`,
        };
      }
    }

    /* -------------------------------------------------- */
    /* 5. Register dependency graph                       */
    /* -------------------------------------------------- */

    dependencies.set(targetName, deps);

    /* -------------------------------------------------- */
    /* 6. Create updater                                  */
    /* -------------------------------------------------- */

    const updateTarget = () => {
      let evalExpr = rhs;
      deps.forEach((dep) => {
        const val = trackers.get(dep)!.tracker.value;
        evalExpr = evalExpr.replaceAll(`[${dep}]`, val.toString());
      });

      try {
        const result = evaluate(evalExpr);
        if (typeof result === "number" && !Number.isNaN(result)) {
          targetMeta.tracker.value = result;
        }
      } catch {
        /* silent runtime math errors */
      }
    };

    /* Initial evaluation */
    updateTarget();

    /* Attach updaters */
    deps.forEach((dep) => {
      trackers
        .get(dep)!
        .tracker.addUpdater(`dep-${targetName}`, updateTarget, rhs);
    });

    return {
      success: true,
      msg: `Tracker '${targetName}' successfully linked.`,
    };
  }
}
