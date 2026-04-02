import { Context, Schema } from 'koishi'

export const name = 'checkyourbox'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context, config: Config) {
  // write your plugin here
  ctx.command('box [user]', '查询用户信息')
    // 自动解析平台@用户（核心！）
    .userFields(['id', 'name', 'authority'])
    .action(async ({ session }, user) => {
      try {
        // 1. 判定目标用户：未@则取自己
        // 确保 target 是用户对象而不是字符串
        const target = typeof user === 'object' && user !== null ? user : session.user

        // 2. 组装用户数据
        const userInfo = {
          userId: target.id,
          userName: target.name || '未知昵称',
          authority: target.authority || 0,
          platform: session.platform,
          guildId: session.guildId || '私聊',
          isSelf: !user // 是否查询自己
        }

        // 3. 格式化输出消息
        const msg = `
📦 用户卡片面板
${userInfo.isSelf ? '👤 你的信息' : '👤 目标用户信息'}
🆔 用户ID：${userInfo.userId}
📛 用户昵称：${userInfo.userName}
🔐 权限等级：${userInfo.authority}
🌐 平台：${userInfo.platform}
🏠 来源：${userInfo.guildId}
        `

        // 4. 发送消息（支持纯文本/卡片）
        return msg

      } catch (err) {
        return '❌ 获取用户信息失败，请检查@格式是否正确！'
      }
    })
}
