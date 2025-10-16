const syntaxRules = [
  { regex: /#(.*?)#/g, replace: '<h2>$1</h2>' },
  { regex: /@(.*?)@/g, replace: '<span style="color:red;">$1</span>' },
  { regex: /\n/g, replace: '<br>' }
];

export function parseText(text: string) {
  let result = text
  syntaxRules.forEach(rule => {
    result = result.replace(rule.regex, rule.replace)
  })
  return result
}
