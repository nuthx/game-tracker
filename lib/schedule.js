import schedule from "node-schedule";
import { prisma } from "@/lib/prisma";
import { monitorUser } from "@/lib/monitor";

const tasks = new Map();

export async function startTask() {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  await stopTask("monitorUser");
  tasks.set("monitorUser", schedule.scheduleJob(`*/${user.monitorInterval} * * * *`, () => {
    monitorUser();
  }));
  monitorUser();
}

export async function stopTask(name) {
  const task = tasks.get(name);
  if (task) {
    task.cancel();
    tasks.delete(name);
  }
}
