import { sourceTypes } from "../../parser/types";

export default class WebSecurityJSCheck {
  constructor() {
    this.id = 'WEB_SECURITY_JS_CHECK';
    this.description = `Do not use disablewebsecurity`;
    this.type = sourceTypes.JAVASCRIPT;
  }

  match(astNode, astHelper){
    if (astNode.type !== 'NewExpression') return null;
    if (astNode.callee.name !== 'BrowserWindow') return null;

    let location = [];

    if (astNode.arguments.length > 0) {
      const found_nodes = astHelper.findNodeByType(astNode.arguments[0],
        astHelper.PropertyName,
        astHelper.PropertyDepth,
        false,
        node => (node.key.value === 'webSecurity' || node.key.name === 'webSecurity'));

      for (const node of found_nodes) {
        if (node.value.value === false) {
          location.push({ line: node.key.loc.start.line, column: node.key.loc.start.column, id: this.id, description: this.description, manualReview: false });
        }
      }
    }

    return location;
  }
}