export function parseToMermaid(text) {
  const lines = ['flowchart TD']
  const links = []
  const usecases = []
  const actors = []
  const usecaseMap = {}
  let idCounter = 1

  // 把句子按标点切成多句
  const sentences = text.split(/[。；！!？?]/).map(s => s.trim()).filter(Boolean)

  for (const sentence of sentences) {
    // 匹配格式：XX人/角色 + 动作（动词）
    const match = sentence.match(/^(.+?)(登录|查看|管理|提交|审批|下载)(.*)/)
    if (match) {
      const actor = match[1].trim()
      const verb = match[2].trim()
      const object = match[3].trim()

      const action = object ? `${verb}${object}` : verb

      const actorKey = `actor_${actors.length}`
      if (!actors.includes(actor)) {
        actors.push(actor)
        lines.push(`${actorKey}(["👤 ${actor}"])`)
      }

      const usecaseId = `uc_${idCounter++}`
      usecaseMap[action] = usecaseId
      usecases.push({ id: usecaseId, label: action })

      links.push(`${actorKey} --> ${usecaseId}`)
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
