import DOMPurify from 'dompurify'
const syntaxRules = [
  { regex: /#(.*?)#/g, replace: '<h2>$1</h2>' },
  { regex: /@(.*?)@/g, replace: '<span style="color:red;">$1</span>' },
  { regex: /\n/g, replace: '<br>' }
];

export function parseText(text: string | null | undefined) {
  if (!text) return ''
  let result = text
  syntaxRules.forEach(rule => {
    result = result.replace(rule.regex, rule.replace)
  })
  return DOMPurify.sanitize(result) // ✅ 关键点：防止 XSS
}
