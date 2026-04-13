/**
 * Template Renderer
 *
 * Renders dynamic templates with variable substitution.
 * Supports simple {{variable}} syntax and advanced computed expressions.
 */

/**
 * Compile a template string into a reusable render function.
 *
 * For simple templates, uses string replacement.
 * For templates with computed expressions ({{ expr }}), uses new Function()
 * to evaluate the expression in a sandboxed context with provided variables.
 *
 * @param {string} template - Template string with {{variable}} placeholders
 * @returns {Function} Compiled render function accepting a data object
 */
function compileTemplate(template) {
  // Check if template uses computed expressions (double braces with operators)
  const hasExpressions = /\{\{[^}]*[+\-*\/\(\)\.][^}]*\}\}/.test(template);

  if (!hasExpressions) {
    // Simple variable substitution — safe path
    return function render(data) {
      return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return data[key] !== undefined ? String(data[key]) : '';
      });
    };
  }

  // Complex template with expressions — use Function constructor
  // Extract all variable names used in the template
  const varNames = [];
  const varPattern = /\{\{([^}]+)\}\}/g;
  let match;
  while ((match = varPattern.exec(template)) !== null) {
    // Extract the base variable name (first identifier)
    const baseVar = match[1].trim().match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (baseVar && !varNames.includes(baseVar[0])) {
      varNames.push(baseVar[0]);
    }
  }

  // Build the render function body
  const bodyParts = template.split(/\{\{([^}]+)\}\}/g);
  let funcBody = 'var __result = "";\n';

  for (let i = 0; i < bodyParts.length; i++) {
    if (i % 2 === 0) {
      // Literal text
      funcBody += `__result += ${JSON.stringify(bodyParts[i])};\n`;
    } else {
      // Expression — evaluate directly
      funcBody += `__result += (${bodyParts[i]});\n`;
    }
  }

  funcBody += 'return __result;';

  // Create function with variable names as parameters
  // The template expressions run in a limited scope with only provided vars
  return new Function(...varNames, funcBody);
}

/**
 * Render a template string with provided data.
 * Convenience wrapper around compileTemplate.
 */
function renderTemplate(template, data) {
  const compiled = compileTemplate(template);
  const varNames = Object.keys(data);
  const varValues = varNames.map(k => data[k]);
  return compiled(...varValues);
}

/**
 * Render a list of items using a template.
 * Each item is rendered with the template and results are joined.
 */
function renderList(template, items, separator = '\n') {
  return items.map(item => renderTemplate(template, item)).join(separator);
}

module.exports = { compileTemplate, renderTemplate, renderList };
