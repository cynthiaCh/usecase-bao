export function parseToMermaid(text) {
  const lines = ['flowchart TD']
  const usecases = []
  const links = []
  const usecaseMap = new Map()
  const actorMap = new Map()
  let usecaseCounter = 1
  let actorCounter = 0

  const verbs = ['登录', '查看', '管理', '提交', '审批', '下载', '上传', '导出', '导入', '编辑', '删除', '创建', '新增', '维护', '操作']
  const verbPattern = new RegExp(`^(.+?)(${verbs.join('|')})(.*)$`)

  // 清洗和分句
  const cleanText = text
    .replace(/：/g, '，')       // 统一为逗号
    .replace(/[（）]/g, '')     // 去除括号
    .replace(/[。；!！？?]/g, '\n') // 用换行分句
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  for (const sentence of cleanText) {
    const isReadonly = sentence.includes('不可操作') || sentence.includes('只读')
    const parts = sentence.split(/，|、/).map(p => p.trim()).filter(Boolean)

    for (const part of parts) {
      const subActions = part.split(/并|然后|及|和|与|、/).map(p => p.trim()).filter(Boolean)

      for (const sub of subActions) {
        const match = sub.match(verbPattern)
        if (match) {
          const actor = match[1].trim()
          const verb = match[2].trim()
          const obj = match[3].trim()
          const actionLabel = obj ? `${verb}${obj}` : verb

          if (!actorMap.has(actor)) {
            const actorId = `actor_${actorCounter++}`
            actorMap.set(actor, actorId)
            lines.push(`${actorId}(["👤 ${actor}"])`)
          }
          const actorId = actorMap.get(actor)

          let ucId = usecaseMap.get(actionLabel)
          if (!ucId) {
            ucId = `uc_${usecaseCounter++}`
            usecaseMap.set(actionLabel, ucId)
            usecases.push({ id: ucId, label: actionLabel })
          }

          const link = isReadonly
            ? `${actorId} -.-> ${ucId}`
            : `${actorId} --> ${ucId}`
          links.push(link)
        }
      }
    }
  }

  if (usecases.length === 0) {
    return `flowchart TD\nactor_0(["👤 未识别"])\nuc_1((( 无法解析句子 )))\nactor_0 --> uc_1`
  }

  usecases.forEach(u => {
    lines.push(`${u.id}((( ${u.label} )))`)
  })
  lines.push(...links)

  return lines.join('\n')
}
