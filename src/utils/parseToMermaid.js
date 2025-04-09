export function parseToMermaid(text) {
  const lines = ['flowchart TD']
  const usecases = []
  const links = []
  const usecaseMap = new Map()
  const actorMap = new Map()
  let usecaseCounter = 1
  let actorCounter = 0

  const verbs = ['登录', '查看', '管理', '提交', '审批', '下载', '上传', '导出', '导入', '编辑', '删除', '创建', '新增', '维护', '操作']
  const verbPattern = new RegExp(`(${verbs.join('|')})`, 'g')
  const sentenceDelimiters = /[。；!！？?]/g
  const actionDelimiters = /[，、和与及并然后]/g

  const cleanText = text
    .replace(/：/g, '，')
    .replace(/[（）]/g, '')
    .replace(sentenceDelimiters, '\n')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  for (const sentence of cleanText) {
    const isReadonly = sentence.includes('不可操作') || sentence.includes('只读')

    // 找所有动词的位置
    const verbMatches = [...sentence.matchAll(verbPattern)]
    if (verbMatches.length === 0) continue

    // 用第一个动词前的部分当角色
    const firstVerb = verbMatches[0]
    const actorPart = sentence.slice(0, firstVerb.index).trim()
    const actionPart = sentence.slice(firstVerb.index).trim()

    if (!actorPart) continue
    const actors = actorPart.split(/、|和|及|与/).map(a => a.trim()).filter(Boolean)
    const actions = actionPart.split(actionDelimiters).map(a => a.trim()).filter(Boolean)

    for (const actor of actors) {
      if (!actorMap.has(actor)) {
        const actorId = `actor_${actorCounter++}`
        actorMap.set(actor, actorId)
        lines.push(`${actorId}(["👤 ${actor}"])`)
      }
      const actorId = actorMap.get(actor)

      for (const action of actions) {
        const match = action.match(new RegExp(`^(${verbs.join('|')})(.*)$`))
        if (!match) continue

        const verb = match[1].trim()
        const obj = match[2].trim()
        const label = obj ? `${verb}${obj}` : verb

        if (!usecaseMap.has(label)) {
          const ucId = `uc_${usecaseCounter++}`
          usecaseMap.set(label, ucId)
          usecases.push({ id: ucId, label })
        }

        const ucId = usecaseMap.get(label)
        const link = isReadonly ? `${actorId} -.-> ${ucId}` : `${actorId} --> ${ucId}`
        links.push(link)
      }
    }
  }

  if (usecases.length === 0) {
    return `flowchart TD\nactor_0(["👤 未识别"])\nuc_1((( 无法解析句子 )))\nactor_0 --> uc_1`
  }

  usecases.forEach(u => lines.push(`${u.id}((( ${u.label} )))`))
  lines.push(...links)

  return lines.join('\n')
}
