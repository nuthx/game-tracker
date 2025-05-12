import schedule from "node-schedule"
import { prisma } from "@/lib/prisma"
import { monitorUser } from "@/lib/monitor"

// 使用全局变量以确保跨模块访问相同的实例
global.scheduleTasks = global.scheduleTasks || new Map()
const tasks = global.scheduleTasks

export async function startTask() {
  const taskName = "monitorUser"
  const user = await prisma.user.findUnique({ where: { id: 1 } })

  // 停止所有任务
  const task = tasks.get(taskName)
  if (task) {
    task.cancel()
    tasks.delete(taskName)
    console.log(`已停止任务: ${taskName}`)
  }

  // 创建新任务
  tasks.set(taskName, schedule.scheduleJob(`*/${user.monitorInterval} * * * * *`, () => {
    monitorUser()
  }))
  console.log("当前任务列表:", Array.from(tasks.keys()), "进程ID:", process.pid)
}
